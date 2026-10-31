import {Howl,Howler} from 'howler';
import type {EventId,Settings,VisualEvent} from '../types';
import {AudioDirector,type VoiceCategory,VOICE_RULES} from './AudioDirector';
import {MusicDirector} from './MusicDirector';
import {audioSources,UI_SAMPLES,COMBAT_SAMPLES,ENVIRONMENT_SAMPLES,eventMaterial,selectVariant,sampleOrFallback,weaponVoice,MusicThemeSelector} from './catalog';
import type {DuckKind} from './mix';
import {OutputBus} from './OutputBus';
type Synth=(...args:(number|undefined)[])=>number[];
function wav(samples:ArrayLike<number>,rate:number){
 const b=new ArrayBuffer(44+samples.length*2),v=new DataView(b),write=(at:number,text:string)=>{for(let n=0;n<text.length;n++)v.setUint8(at+n,text.charCodeAt(n));};
 write(0,'RIFF');v.setUint32(4,b.byteLength-8,true);write(8,'WAVE');write(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);write(36,'data');v.setUint32(40,samples.length*2,true);
 for(let n=0;n<samples.length;n++)v.setInt16(44+n*2,Math.max(-1,Math.min(1,samples[n]))*32767,true);
 return new Blob([b],{type:'audio/wav'});
}
/** App-lifetime audio facade. Scene teardown releases session voices only. */
export class GameAudio {
 readonly director=new AudioDirector();readonly musicDirector:MusicDirector;
 private samples=new Map<string,Howl>();private synthetic=new Map<string,Howl>();private urls:string[]=[];
 private auditionTimers=new Set<ReturnType<typeof setTimeout>>();private output:OutputBus|undefined;private outputInput:GainNode|undefined;private loads=new Set<()=>void>();private loadGeneration=0;private suspendedForLab=false;private fallbackPlays=0;private sampleFailures=new Set<string>();private ready=false;private initializing=false;private destroyed=false;private paused=false;private desiredTheme='menu';private unavailable=false;
 private queue:{name:string;rate:number;category:VoiceCategory;pan:number;volume:number;scope:'ui'|'session';group:string}[]=[];
 private last=new Map<string,number>();private variants=new Map<string,number>();private forceFailure=false;private combatRequested=false;private combatLoading=false;
 private pickupCombo=0;private pickupAt=0;private environment:EventId|null=null;private environmentFilter:BiquadFilterNode|null=null;private rainId:number|undefined;private rainSound:Howl|undefined;private previewTheme:string|null=null;private musicSelector=new MusicThemeSelector();private timer:ReturnType<typeof setInterval>;private previous=performance.now()/1000;
 constructor(private settings:Settings){
  Howler.autoUnlock=false;this.musicDirector=new MusicDirector(theme=>this.synthetic.get(`music-${theme==='elite'?'late':theme==='menu'||theme==='result'?'normal':theme}`));
  window.addEventListener('resize',this.outputChanged);window.addEventListener('pointerdown',this.unlock);window.addEventListener('keydown',this.unlock);
  document.addEventListener('click',this.uiClick);document.addEventListener('pointerover',this.uiHover);
  this.timer=setInterval(()=>{const now=performance.now()/1000,dt=Math.min(.1,now-this.previous);this.previous=now;this.flush();this.musicDirector.update(dt,now,this.settings,this.paused||document.hidden);this.director.reap();},25);
 }
 private outputChanged=()=>this.output?.apply(this.settings.audioPreset);
 private unlock=()=>{
  if(this.destroyed||this.settings.muted||this.unavailable)return;
  if(!this.initializing&&!this.ready)void this.initialize();
  else if(Howler.ctx?.state!=='running')void Howler.ctx?.resume().catch(()=>{});
 };
 private uiClick=(event:MouseEvent)=>{
  const button=(event.target as Element).closest('button');if(!button||button.disabled)return;
  const requested=button.dataset.sound;
  if(requested==='none')return;
  this.play(requested??(button.getAttribute('role')==='tab'||button.closest('[role="tablist"]')?'ui-tab':/关闭|返回|取消/.test(button.textContent??'')?'ui-cancel':'ui-confirm'),1,90);
 };
 private uiHover=(event:PointerEvent)=>{const button=(event.target as Element).closest('button');if(!button||button.disabled||button.contains(event.relatedTarget as Node|null)||event.pointerType==='touch')return;this.play('ui-hover',1,10);};
 private add(id:string,samples:ArrayLike<number>,loop=false){
  const url=URL.createObjectURL(wav(samples,22050));this.urls.push(url);const sound=new Howl({src:[url],format:['wav'],loop,volume:0});this.synthetic.set(id,sound);
 }
 private async initialize(){
  if(this.initializing||this.ready||this.destroyed)return;this.initializing=true;let unlock:Howl|undefined;
  try{
   unlock=new Howl({src:['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='],format:['wav'],volume:0});
   if(!Howler.ctx)throw Error('AudioContext unavailable');await Howler.ctx.resume();if(this.destroyed)return;
   const {ZZFX}=await import('zzfx');if(ZZFX.audioContext!==Howler.ctx){await ZZFX.audioContext.close();ZZFX.audioContext=Howler.ctx;}
   if(this.destroyed)return;ZZFX.sampleRate=22050;ZZFX.volume=.3;const synth:Synth=ZZFX.buildSamples.bind(ZZFX);
   const sounds:Record<string,(number|undefined)[]>={shot:[.2,0,560,.005,.015,.04,1,1.5,-4],hit:[.24,.03,180,.005,.02,.055,3,1.4,-2],death:[.3,.04,110,.003,.025,.16,3,1.5,-3],pickup:[.25,0,920,.005,.015,.075,0,1.6,5],level:[.4,0,520,.02,.12,.28,0,1.2,0,0,400,.1],hurt:[.42,.05,110,.01,.05,.16,3,1.5,-2],boss:[.4,0,130,.03,.22,.35,1,1.2,1,0,70,.15],evolution:[.45,0,660,.03,.2,.5,0,1.1,0,0,330,.14],chest:[.35,0,740,.01,.12,.25,0,1.2,0,0,440,.09],critical:[.35,0,125,.003,.02,.12,3,1.8,-5],'ui-hover':[.12,0,780,.002,.006,.025],'ui-confirm':[.22,0,960,.002,.01,.06],'ui-cancel':[.18,0,520,.002,.01,.055],'ui-reveal':[.3,0,880,.01,.08,.2]};
   for(const [name,params] of Object.entries(sounds))this.add(name,synth(...params));
   for(const [index,name] of ['normal','late','boss'].entries())this.add('music-'+name,this.compose(synth,index),true);
   this.add('rain-ambience',synth(.13,.3,60,.1,.6,1,3,.8),true);
   this.outputInput=Howler.ctx.createGain();this.output=new OutputBus(Howler.ctx,this.outputInput);this.environmentFilter=Howler.ctx.createBiquadFilter();this.environmentFilter.type='lowpass';this.environmentFilter.frequency.value=20000;Howler.masterGain.disconnect();Howler.masterGain.connect(this.environmentFilter);this.environmentFilter.connect(this.outputInput);
   this.ready=true;this.apply(this.settings);this.musicDirector.setTheme(this.desiredTheme);void this.loadSamples(UI_SAMPLES);if(this.combatRequested)this.prepareCombat();
  }catch(error){this.unavailable=!(error instanceof DOMException&&error.name==='NotAllowedError');}
  finally{unlock?.unload();this.initializing=false;}
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
 private async loadSamples(ids:string[],generation=this.loadGeneration){
  for(let start=0;start<ids.length&&!this.destroyed&&generation===this.loadGeneration;start+=6)await Promise.all(ids.slice(start,start+6).map(id=>new Promise<void>(resolve=>{
   if(this.samples.has(id)){resolve();return;}
   let finished=false;const done=()=>{if(finished)return;finished=true;clearTimeout(timer);this.loads.delete(cancel);resolve();};
   const cancel=()=>{sound.unload();done();};const timer=setTimeout(()=>{this.sampleFailures.add(id);sound.unload();done();},5000);
   const sound=new Howl({src:audioSources(id),format:['ogg','mp3'],loop:id==='rain-ambience',preload:true,volume:0,
    onload:()=>{done();if(this.destroyed||generation!==this.loadGeneration){sound.unload();return;}if(id==='rain-ambience'&&this.environment==='rainstorm'){this.stopRain();this.startRain();}},
    onloaderror:()=>{this.sampleFailures.add(id);done();sound.unload();},onplayerror:()=>{if(Howler.ctx?.state==='running')sound.unload();}});
   this.samples.set(id,sound);this.loads.add(cancel);
  })));
 }
 prepareCombat(){this.combatRequested=true;if(!this.ready||this.combatLoading||this.destroyed)return;this.combatLoading=true;void this.loadSamples(COMBAT_SAMPLES);}
 apply(settings:Settings){this.settings=settings;if(this.ready){Howler.volume(.5);Howler.mute(settings.muted||this.suspendedForLab);this.output?.apply(settings.audioPreset);}if(!settings.musicDucking)this.musicDirector.resetDucking();if(settings.muted){this.director.release();this.stopRain();}else if(this.environment==='rainstorm')this.startRain();if(this.rainSound&&this.rainId!==undefined)this.rainSound.volume(settings.master*settings.sfx*.12,this.rainId);}
 setTheme(theme:string){this.desiredTheme=this.musicSelector.resolve(theme,performance.now()/1000,!this.settings.dynamicMusic);if(this.ready)this.musicDirector.setTheme(this.previewTheme??this.desiredTheme);}
 prepareTheme(theme:string){if(this.ready)this.musicDirector.preload(theme);}
 previewMusic(theme:string|null){this.previewTheme=theme;if(this.ready)this.musicDirector.setTheme(theme??this.desiredTheme);}
 setPaused(paused:boolean){if(this.paused===paused)return;this.paused=paused;if(paused)this.stopRain();else if(this.environment==='rainstorm')this.startRain();}
 setEnvironment(kind:EventId|null,silent=false){if(!this.ready||this.environment===kind)return;const previous=this.environment;this.environment=kind;this.environmentFilter?.frequency.setTargetAtTime(kind==='blackout'?1700:20000,Howler.ctx.currentTime,.2);this.musicDirector.setRate(kind==='examRage'?1.08:1);if(kind==='rainstorm')this.startRain();else this.stopRain();if(!silent){if(kind)this.enqueue(ENVIRONMENT_SAMPLES[kind],1,kind==='advisor'?'hurt':'important',0,.75);else if(previous)this.enqueue('event-end',1,'important',0,.4);}}
 private stopRain(){if(this.rainSound&&this.rainId!==undefined)this.rainSound.stop(this.rainId);this.rainId=undefined;this.rainSound=undefined;}
 private startRain(){const sound=sampleOrFallback(this.forceFailure?undefined:this.samples.get('rain-ambience'),sample=>sample.state()==='loaded',this.synthetic.get('rain-ambience'));if(!sound||this.paused||this.settings.muted||this.rainId!==undefined&&sound.playing(this.rainId))return;this.director.admit('shot',.1,0,performance.now()/1000,'session',()=>{const id=sound.play();this.rainId=id;this.rainSound=sound;sound.volume(this.settings.master*this.settings.sfx*.12,id);return{playing:()=>sound.playing(id),stop:()=>{sound.stop(id);if(this.rainSound===sound&&this.rainId===id){this.rainId=undefined;this.rainSound=undefined;}}};});}
 stopMusic(){this.musicDirector.stop();}
 play(name:string,rate=1,priority=90){
  const category:VoiceCategory=name==='ui-hover'?'hover':name.startsWith('ui-')?'important':name==='hurt'?'hurt':name==='pickup'?'pickup':name==='critical'?'critical':priority>=90?'important':'hit';
  this.enqueue(name,rate,category,0,1,name.startsWith('ui-')?'ui':'session');this.flush();
 }
 private enqueue(name:string,rate:number,category:VoiceCategory,pan=0,volume=1,scope:'ui'|'session'='session',group=''){if(this.queue.length<256)this.queue.push({name,rate,category,pan,volume,scope,group});}
 beginFrame(){/* Time-window aggregation persists across render frames. */}
 flush(){
  if(!this.ready||this.destroyed||this.settings.muted||this.suspendedForLab){this.queue=[];return;}
  if(Howler.ctx?.state!=='running'){this.unlock();this.queue=[];return;}
  const now=performance.now()/1000;
  for(const event of this.queue.sort((a,b)=>VOICE_RULES[b.category].priority-VOICE_RULES[a.category].priority)){
   const group=event.category+':'+(event.group||event.name.replace(/-\d+$/,'')),cooldown=event.category==='hover'?.12:event.category==='pickup'?.045:.035;
   if(now-(this.last.get(group)??-10)<cooldown)continue;
   const fallback=this.synthetic.get(event.name)??this.synthetic.get(event.name.startsWith('ui-')?'ui-confirm':event.name.startsWith('death')?'death':event.name.startsWith('shot')?'shot':event.name.startsWith('fusion-')||event.name.startsWith('ultimate-')?'evolution':event.name.startsWith('event-')?'boss':'hit');
   const sound=sampleOrFallback(this.forceFailure?undefined:this.samples.get(event.name),sample=>sample.state()==='loaded',fallback);if(!sound)continue;
   const volume=this.settings.master*(event.scope==='ui'?this.settings.uiSfx:this.settings.sfx)*event.volume;if(volume<=0)continue;
   const accepted=this.director.admit(event.category,volume,Math.abs(event.pan),now,event.scope,()=>{const id=sound.play();sound.volume(volume,id);sound.rate(event.rate,id);if(![...this.synthetic.values()].includes(sound))sound.stereo(Math.max(-.65,Math.min(.65,event.pan)),id);return{stop:()=>sound.stop(id),playing:()=>sound.playing(id)};});
   if(accepted){this.last.set(group,now);if(sound===fallback)this.fallbackPlays++;}
  }
  this.queue=[];if(this.last.size>300)for(const [name,at] of this.last)if(now-at>2)this.last.delete(name);
 }
 event(event:VisualEvent){
  const material=eventMaterial(event),now=performance.now()/1000,pan=Math.max(-.65,Math.min(.65,event.pan??0));
  const sample=(kind:'hit'|'death'|'shot')=>{const group=`${kind}-${material}`,previous=this.variants.get(group)??-1,variant=selectVariant(previous,kind==='hit'?4:2,Math.random());this.variants.set(group,variant);return `${group}-${variant}`;};
  const pitch=()=>2**((Math.random()-.5)*(event.critical?65:120)/1200),volume=()=>10**((Math.random()-.5)*(event.critical?1.5:3)/20);
  if(event.type==='hit'){
   this.enqueue(sample('hit'),pitch(),event.critical?'critical':'hit',pan,volume(),'session',`${event.sourceKey??event.weapon??event.ultimate??'hit'}:${material}`);
   if(event.critical){this.enqueue('critical',pitch(),'critical',pan,.65);this.duck('critical',now);}
  }else if(event.type==='death'){
   const important=event.rank&&['elite','miniBoss','boss'].includes(event.rank)||event.priority;
   this.enqueue(sample('death'),pitch(),important?'important':'death',pan,important?1.1:.8);
   if(important){this.enqueue('boss',.9,'important',pan,.6);this.duck(event.rank==='boss'?'boss':'elite',now);}
  }else if(event.type==='shot'){const voice=weaponVoice(event.weapon,event.evolved);this.enqueue(sample('shot'),voice.rate*pitch(),'shot',pan,voice.volume,'session',`${event.weapon??event.ultimate??'shot'}:${material}`);}
  else if(event.type==='pickup'){this.pickupCombo=now-this.pickupAt<.25?Math.min(7,this.pickupCombo+1):0;this.pickupAt=now;this.enqueue('pickup',2**(this.pickupCombo/12),'pickup',pan,.65);}
  else if(event.type==='hurt'){this.enqueue('hurt',1,'hurt');this.duck('hurt',now);}
  else if(['boss','fusion','ultimate','evolution'].includes(event.type)){this.enqueue(event.type==='boss'?'boss':event.type==='fusion'&&event.weapon?'fusion-'+event.weapon:event.type==='ultimate'&&event.ultimate?'ultimate-'+event.ultimate:'evolution',1,'important');this.duck('boss',now);}
  else if(['level','charged','frenzy','combo','clear'].includes(event.type))this.enqueue(event.type,1,'important',pan,event.type==='combo'?.55:1);
  else if(event.type==='shieldBreak')this.enqueue('shield-break',1,'important',pan);
  else if(event.type==='block')this.enqueue('block',pitch(),'hit',pan,.4);
  else if(event.type==='warning')this.enqueue('boss',event.priority?1.2:1,event.priority?'hurt':'important',pan,event.priority?.8:.35);
  else if(event.type==='chain')this.enqueue('charged',1.1,'hit',pan,.35);
  else if(event.type==='ring'&&event.text==='explosion')this.enqueue(sample('death'),pitch(),'hit',pan,.38,'session',`explosion:${event.weapon??event.ultimate??material}`);
 }
 private duck(kind:DuckKind,now:number){if(this.settings.musicDucking)this.musicDirector.duck.trigger(kind,now);}
 reveal(rarity:number){this.play(['ui-rarity-common','ui-rarity-rare','ui-rarity-epic','ui-rarity-legendary'][Math.max(0,Math.min(3,rarity))]);if(rarity===3)this.duck('legendary',performance.now()/1000);}
 suspendForLab(value:boolean){this.suspendedForLab=value;Howler.mute(this.settings.muted||value);if(value){this.director.release();this.stopRain();}}
 simulateFailure(value:boolean){this.forceFailure=value;this.musicDirector.simulateFailure(value);}
 audition(name:string,segment:'full'|'onset'|'body'|'tail'='full'){
  if(!this.ready||this.settings.muted)return;
  const fallback=this.synthetic.get(name)??this.synthetic.get(name.startsWith('death')?'death':name.startsWith('shot')?'shot':'hit');
  const sound=sampleOrFallback(this.forceFailure?undefined:this.samples.get(name),s=>s.state()==='loaded',fallback);if(!sound)return;
  if(sound===fallback)this.fallbackPlays++;
  const range={full:[0,.8],onset:[0,.02],body:[.008,.13],tail:[.04,.44]}[segment];
  this.director.admit('important',.7,0,performance.now()/1000,'session',()=>{const id=sound.play();sound.volume(this.settings.master*this.settings.sfx*.7,id);sound.seek(range[0],id);const timer=setTimeout(()=>{this.auditionTimers.delete(timer);sound.stop(id);},range[1]*1000);this.auditionTimers.add(timer);return{playing:()=>sound.playing(id),stop:()=>{clearTimeout(timer);this.auditionTimers.delete(timer);sound.stop(id);}};});
 }
 releaseSession(){for(const timer of this.auditionTimers)clearTimeout(timer);this.auditionTimers.clear();this.queue=[];this.pickupCombo=0;this.variants.clear();this.director.release('session');this.stopRain();this.musicDirector.resetDucking();this.setEnvironment(null,true);this.previewMusic(null);this.setPaused(false);this.last.clear();}
 get voicePeak(){return this.director.peak;}
 get debug(){return{suspendedForLab:this.suspendedForLab,fallbackPlays:this.fallbackPlays,sampleFailures:[...this.sampleFailures],outputPreset:this.output?.preset??'full',headroomDb:-6,loadedSamples:this.samples.size,loadingSamples:this.loads.size,syntheticSamples:this.synthetic.size,ready:this.ready,voices:this.director.voices.length,sessionVoices:this.director.voices.filter(v=>v.scope==='session').length,evicted:this.director.evicted,dropped:this.director.dropped,duck:this.musicDirector.duck.gain(performance.now()/1000),music:this.musicDirector.debug,failedSamples:[...this.samples].filter(([,s])=>s.state()!=='loaded').map(([id])=>id),forceFailure:this.forceFailure,environment:this.environment};}
 destroy(){if(this.destroyed)return;this.destroyed=true;for(const timer of this.auditionTimers)clearTimeout(timer);this.auditionTimers.clear();clearInterval(this.timer);++this.loadGeneration;for(const cancel of [...this.loads])cancel();this.loads.clear();window.removeEventListener('resize',this.outputChanged);window.removeEventListener('pointerdown',this.unlock);window.removeEventListener('keydown',this.unlock);document.removeEventListener('click',this.uiClick);document.removeEventListener('pointerover',this.uiHover);this.director.release();this.musicDirector.destroy();for(const sound of [...this.samples.values(),...this.synthetic.values()])sound.unload();for(const url of this.urls)URL.revokeObjectURL(url);if(this.environmentFilter){try{Howler.masterGain.disconnect(this.environmentFilter);this.environmentFilter.disconnect();Howler.masterGain.connect(Howler.ctx.destination);}catch{/* Device may already be closed. */}this.environmentFilter=null;}this.output?.destroy();this.output=undefined;this.outputInput?.disconnect();this.outputInput=undefined;this.samples.clear();this.synthetic.clear();this.queue=[];}
}
let appAudio:GameAudio|undefined;
export function getAudio(settings?:Settings){if(!appAudio){if(!settings)throw Error('Audio service needs initial settings');appAudio=new GameAudio(settings);}return appAudio;}
export function disposeAudio(){appAudio?.destroy();appAudio=undefined;}
