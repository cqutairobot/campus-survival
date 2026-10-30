import { Howl, Howler } from 'howler';
import type { EventId,Settings, VisualEvent } from '../types';
type Synth=(...args:(number|undefined)[])=>number[];
function wav(samples:ArrayLike<number>,rate:number){
  const b=new ArrayBuffer(44+samples.length*2),v=new DataView(b),write=(offset:number,s:string)=>{for(let n=0;n<s.length;n++)v.setUint8(offset+n,s.charCodeAt(n));};
  write(0,'RIFF');v.setUint32(4,b.byteLength-8,true);write(8,'WAVE');write(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);write(36,'data');v.setUint32(40,samples.length*2,true);
  for(let n=0;n<samples.length;n++)v.setInt16(44+n*2,Math.max(-1,Math.min(1,samples[n]))*32767,true);
  return new Blob([b],{type:'audio/wav'});
}
export class GameAudio {
  private sounds=new Map<string,Howl>();private urls:string[]=[];private music:Howl|null=null;private destroyed=false;private last:Record<string,number>={};private pickupCombo=0;private pickupAt=0;private theme='';private ready=false;private paused=false;
  private environment:EventId|null=null;private environmentFilter:BiquadFilterNode|null=null;
  private settings:Settings;private initializing=false;private unavailable=false;private unlockSound:Howl|null=null;
  private queue=new Map<string,{name:string;rate:number;priority:number}>();private voices:{sound:Howl;id:number;priority:number}[]=[];private duckUntil=0;private ducked=false;voicePeak=0;
  constructor(settings:Settings){
    this.settings=settings;
    // Own the gesture/resume boundary so rejected audio-device promises stay contained.
    Howler.autoUnlock=false;
    window.addEventListener('pointerdown',this.unlock);window.addEventListener('keydown',this.unlock);
    if(!settings.muted)void this.initialize();
  }
  private unlock=()=>{
    if(this.destroyed||this.settings.muted||this.unavailable)return;
    if(!this.initializing&&!this.ready)void this.initialize();
    else if(Howler.ctx?.state!=='running')void Howler.ctx?.resume().catch(()=>{});
  };
  private add(id:string,samples:ArrayLike<number>,loop=false){
    const url=URL.createObjectURL(wav(samples,22050));this.urls.push(url);
    const sound=new Howl({src:[url],format:['wav'],loop,volume:loop?this.settings.music:this.settings.sfx,pool:12,preload:true});this.sounds.set(id,sound);return sound;
  }
  private async initialize(){
    if(this.initializing||this.ready||this.destroyed||this.unavailable)return;this.initializing=true;
    try{
      // Howler owns playback. Close the context created by the ZzFX module on import.
      const unlock=new Howl({src:['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='],format:['wav']});this.unlockSound=unlock;
      if(!Howler.ctx)throw new Error('AudioContext unavailable');
      await Howler.ctx.resume();
      if(this.destroyed){unlock.unload();this.unlockSound=null;return;}
      const {ZZFX}=await import('zzfx');if(ZZFX.audioContext!==Howler.ctx){await ZZFX.audioContext.close();ZZFX.audioContext=Howler.ctx;}
      unlock.unload();this.unlockSound=null;if(this.destroyed)return;ZZFX.sampleRate=22050;ZZFX.volume=.3;const synth: Synth=ZZFX.buildSamples.bind(ZZFX);
      const sfx:Record<string,(number|undefined)[]>={shot:[.22,0,560,.005,.015,.04,1,1.5,-4],hit:[.24,.03,180,.005,.02,.055,3,1.4,-2],pickup:[.25,0,920,.005,.015,.075,0,1.6,5],level:[.4,0,520,.02,.12,.28,0,1.2,0,0,400,.1],hurt:[.42,.05,110,.01,.05,.16,3,1.5,-2],boss:[.4,0,130,.03,.22,.35,1,1.2,1,0,70,.15],evolution:[.45,0,660,.03,.2,.5,0,1.1,0,0,330,.14],chest:[.35,0,740,.01,.12,.25,0,1.2,0,0,440,.09]};
      for(const [id,params] of Object.entries(sfx))this.add(id,synth(...params));
      const materials:Record<string,number[]>={paper:[680,1,.04],coffee:[160,3,.13],key:[310,1,.045],code:[890,2,.06],laser:[120,0,.15],metal:[410,1,.1],blueprint:[1050,0,.055],shuttle:[780,0,.08],glass:[1320,0,.13],ice:[180,3,.2],brick:[90,3,.2]};
      for(const [material,[freq,wave,decay]] of Object.entries(materials))for(const kind of ['shot','hit','death'])this.add(`${kind}-${material}`,synth(kind==='death'?.3:.2,.02,freq*(kind==='death'?.6:1),.003,.012,decay,wave,1.4,kind==='shot'?3:-2));
      this.add('rain-ambience',synth(.13,.3,60,.1,.6,1,3,.8),true);
      this.add('critical',synth(.35,0,125,.003,.02,.12,3,1.8,-5));this.add('combo',synth(.3,0,780,.005,.04,.12,0,1.3,6));
      this.add('music-normal',this.compose(synth,0),true);this.add('music-late',this.compose(synth,1),true);this.add('music-boss',this.compose(synth,2),true);
      this.environmentFilter=Howler.ctx.createBiquadFilter();this.environmentFilter.type='lowpass';this.environmentFilter.frequency.value=20000;Howler.masterGain.disconnect();Howler.masterGain.connect(this.environmentFilter);this.environmentFilter.connect(Howler.ctx.destination);
      this.ready=true;this.apply(this.settings);this.setTheme('normal');
    }catch(error){
      this.unlockSound?.unload();this.unlockSound=null;
      // Permission can be retried by the next gesture; missing hardware cannot.
      this.unavailable=!(error instanceof DOMException&&error.name==='NotAllowedError');
    }finally{this.initializing=false;}
  }
  private compose(synth:Synth,variant:number){
    const beat=60/110,rate=22050,length=Math.ceil(beat*32*rate),mix=new Float32Array(length),cache=new Map<string,number[]>();
    const add=(note:number,at:number,volume:number,instrument:number)=>{
      const key=`${note}-${instrument}`;let samples=cache.get(key);
      if(!samples){const freq=440*2**((note-69)/12);samples=synth(.6,0,freq,.008,instrument===1?.15:.08,instrument===1?.2:.16,instrument===1?1:0,1.6,0,0,0,0,0,instrument===2?.55:0);cache.set(key,samples);}
      const start=Math.floor(at*beat*rate);for(let n=0;n<samples.length&&start+n<mix.length;n++)mix[start+n]+=samples[n]*volume;
    };
    const melody=[76,79,81,79,76,74,72,74,76,79,83,81,79,76,74,72];
    const bass=[48,48,53,53,55,55,48,55];
    for(let b=0;b<32;b++){
      add(bass[Math.floor(b/4)]+(variant===2?-2:0),b,.18,1);
      add(melody[b%16]+(variant===2?-12:0),b,.11,0);
      if(b%2===0)add(36,b,.25,2);else add(66,b,.045,2);
      if(variant>0)add(80,b+.5,.035,2);
    }
    return mix;
  }
  apply(settings:Settings){this.settings=settings;if(!this.ready){if(!settings.muted)void this.initialize();return;}Howler.volume(settings.master);Howler.mute(settings.muted);for(const [name,sound] of this.sounds)sound.volume(name.startsWith('music')?settings.music*(this.paused?.22:1)*(this.ducked?.708:1):name==='rain-ambience'?settings.sfx*.12:settings.sfx);}
  setTheme(theme:string){if(!this.ready||this.destroyed||theme===this.theme||this.unavailable)return;if(Howler.ctx?.state!=='running'){this.unlock();return;}this.music?.stop();this.theme=theme;this.music=this.sounds.get(`music-${theme}`)??null;this.music?.volume(this.settings.music*(this.paused?.22:1)*(this.ducked?.708:1));this.music?.play();}
  setEnvironment(kind:EventId|null){if(!this.ready||this.environment===kind)return;this.environment=kind;const ctx=Howler.ctx;this.environmentFilter?.frequency.setTargetAtTime(kind==='blackout'?1700:20000,ctx.currentTime,.2);this.music?.rate(kind==='examRage'?1.08:1);const rain=this.sounds.get('rain-ambience');if(kind==='rainstorm')this.play('rain-ambience',1,4);else rain?.stop();}
  setPaused(paused:boolean){if(this.paused===paused)return;this.paused=paused;this.music?.volume(this.settings.music*(paused?.22:1)*(this.ducked?.708:1));const rain=this.sounds.get('rain-ambience');if(paused)rain?.pause();else if(this.environment==='rainstorm'&&!rain?.playing())this.play('rain-ambience',1,4);}
  stopMusic(){this.music?.fade(this.music.volume(),0,500);}
  play(name:string,rate=1,priority=1){
    if(!this.ready||this.destroyed||this.settings.muted||this.unavailable)return;
    if(Howler.ctx?.state!=='running'){this.unlock();return;}
    const now=performance.now(),cooldown=/^(hit|shot|death|critical)/.test(name)?50:name==='pickup'?45:200;
    if(now-(this.last[name]??-1000)<cooldown)return;this.last[name]=now;
    const sound=this.sounds.get(name);if(!sound)return;
    this.voices=this.voices.filter(v=>v.sound.playing(v.id));
    if(this.voices.length>=23){const weakest=this.voices.reduce((best,v,n)=>v.priority<this.voices[best].priority?n:best,0);if(this.voices[weakest].priority>priority)return;const [old]=this.voices.splice(weakest,1);old.sound.stop(old.id);}
    const id=sound.play();sound.rate(rate,id);this.voices.push({sound,id,priority});this.voicePeak=Math.max(this.voicePeak,this.voices.length+Number(!!this.music));
  }
  beginFrame(){this.queue.clear();}
  private enqueue(group:string,name:string,rate=1,priority=1){const old=this.queue.get(group);if(!old||old.priority<=priority)this.queue.set(group,{name,rate,priority});}
  flush(){
    for(const event of [...this.queue.values()].sort((a,b)=>b.priority-a.priority))this.play(event.name,event.rate,event.priority);
    const ducked=performance.now()<this.duckUntil;if(ducked!==this.ducked){this.ducked=ducked;this.music?.volume(this.settings.music*(this.paused?.22:1)*(this.ducked?.708:1)*(ducked?.708:1));}
  }
  event(event:VisualEvent){
    const weaponMaterial=event.weapon==='ruler'||event.weapon==='binder'?'metal':event.weapon==='blueprint'||event.weapon==='hub'?'blueprint':event.weapon==='shuttle'?'shuttle':event.weapon==='prism'||event.weapon==='sky'?'glass':event.weapon==='cryo'||event.weapon==='icefire'?'ice':event.weapon==='brick'||event.weapon==='demolition'?'brick':event.weapon==='coffee'?'coffee':event.weapon==='keyboard'?'key':event.weapon==='laser'?'laser':['code','bot','lightning','wifi'].includes(event.weapon??'')?'code':'paper',material=event.type==='shot'?weaponMaterial:event.material&&['paper','key','code','metal','glass','ice','blueprint','brick'].includes(event.material)?event.material:weaponMaterial;
    if(event.type==='pickup'){const now=performance.now();this.pickupCombo=now-this.pickupAt<250?Math.min(7,this.pickupCombo+1):0;this.pickupAt=now;this.enqueue('pickup','pickup',2**(this.pickupCombo/12));}
    else if(event.type==='shot')this.enqueue('shot',`shot-${material}`,1,1);
    else if(event.type==='hit')this.enqueue('hit',event.critical?'critical':`hit-${material}`,1,event.critical?5:2);
    else if(event.type==='death')this.enqueue('death',`death-${material}`,1,event.priority?7:3);
    else if(event.type==='charged')this.enqueue('charged','level',1.5,10);
    else if(event.type==='ultimate'||event.type==='fusion'){this.enqueue('climax','evolution',event.ultimate==='lastMinute'?.8:event.ultimate==='overload'?1.4:1.05,12);this.duckUntil=performance.now()+1000;}
    else if(event.type==='shieldBreak')this.enqueue('shield','death-glass',1.2,8);
    else if(event.type==='warning'&&event.priority)this.enqueue('affix','boss',1.6,9);
    else if(event.type==='combo')this.enqueue('combo','combo',2**(([10,25,50,100].indexOf(event.value??10)+1)*1.75/12),8);
    else if(event.type==='frenzy'||event.type==='clear'){this.enqueue('climax','level',1.1,9);this.duckUntil=performance.now()+500;}
    else if(['level','hurt','boss','evolution'].includes(event.type)){this.enqueue(event.type,event.type,1,10);if(event.type!=='hurt')this.duckUntil=performance.now()+500;}
  }
  destroy(){this.destroyed=true;window.removeEventListener('pointerdown',this.unlock);window.removeEventListener('keydown',this.unlock);this.unlockSound?.unload();this.unlockSound=null;for(const sound of this.sounds.values())sound.unload();this.sounds.clear();if(this.environmentFilter){try{Howler.masterGain.disconnect(this.environmentFilter);this.environmentFilter.disconnect();Howler.masterGain.connect(Howler.ctx.destination);}catch{/* Context may already be closed. */}this.environmentFilter=null;}for(const url of this.urls)URL.revokeObjectURL(url);this.urls=[];}
}
