import {Howl} from 'howler';
import type {Settings} from '../types';
import {audioSources,normalizeTheme,type MusicTheme} from './catalog';
import {musicGain,DuckEnvelope} from './mix';
import loops from '../assets/audio-loops.json';
interface Track {sound:Howl;id:number;weight:number;target:number;theme:MusicTheme;owned:boolean}
interface Prepared {sound:Howl;ready:boolean;failed:boolean;activate?:()=>void;timer?:ReturnType<typeof setTimeout>}
/** Stream whole CC0 songs. Only a ready replacement starts the 700ms crossfade. */
export class MusicDirector {
 readonly duck=new DuckEnvelope();private tracks:Track[]=[];private theme:MusicTheme|null=null;private pending=0;private disposed=false;private stopped=false;private prepared=new Map<MusicTheme,Prepared>();private rate=1;private forcedFailure=false;
 constructor(private fallback:(theme:MusicTheme)=>Howl|undefined){}
 preload(theme:string){
  const desired=normalizeTheme(theme);if(this.disposed||this.prepared.has(desired)||this.tracks.some(t=>t.theme===desired&&t.target===1))return;
  const loop=loops[desired];
  const sound=new Howl({src:audioSources('music-'+desired),format:['ogg','mp3'],html5:false,preload:true,volume:0,loop:true,sprite:{track:[loop.loopStartMs,loop.loopLengthMs,true]},
   onload:()=>{const entry=this.prepared.get(desired);if(!entry||entry.sound!==sound||this.disposed){sound.unload();return;}clearTimeout(entry.timer);entry.ready=true;entry.activate?.();},
   onloaderror:()=>{const entry=this.prepared.get(desired);if(!entry||entry.sound!==sound)return;clearTimeout(entry.timer);entry.failed=true;entry.activate?.();},
   onplayerror:()=>this.failTrack(sound,desired),
  });
  const entry:Prepared={sound,ready:false,failed:false};entry.timer=setTimeout(()=>{if(this.prepared.get(desired)===entry){entry.failed=true;entry.activate?.();}},5000);this.prepared.set(desired,entry);
  // Streaming preload has bounded residency; active songs are managed separately.
  while(this.prepared.size>2){const oldest=[...this.prepared].find(([key])=>key!==this.theme&&key!==desired);if(!oldest)break;clearTimeout(oldest[1].timer);oldest[1].sound.unload();this.prepared.delete(oldest[0]);}
 }
 setTheme(theme:string){
  const desired=normalizeTheme(theme);
  if(this.disposed||(!this.stopped&&desired===this.theme))return;
  this.stopped=false;this.theme=desired;const token=++this.pending;
  // A request that never became audible must never activate after another screen opens.
  for(const [key,entry] of this.prepared)if(entry.activate){clearTimeout(entry.timer);entry.sound.unload();this.prepared.delete(key);}
  if(this.forcedFailure){const sound=this.fallback(desired);if(sound)this.activate(sound,desired,undefined,false);return;}
  this.preload(desired);const entry=this.prepared.get(desired);if(!entry)return;
  const activate=()=>{
   if(this.disposed||token!==this.pending||this.prepared.get(desired)!==entry)return;
   clearTimeout(entry.timer);this.prepared.delete(desired);
   if(entry.failed){entry.sound.unload();const synthetic=this.fallback(desired);if(synthetic)this.activate(synthetic,desired,undefined,false);}
   else this.activate(entry.sound,desired,'track',true);
  };
  entry.activate=activate;if(entry.ready||entry.failed)activate();
 }
 private failTrack(sound:Howl,theme:MusicTheme){
  if(this.disposed)return;const entry=this.prepared.get(theme);
  if(entry?.sound===sound){clearTimeout(entry.timer);entry.failed=true;entry.activate?.();return;}
  const index=this.tracks.findIndex(t=>t.sound===sound);if(index<0)return;
  this.tracks.splice(index,1);sound.unload();const replacement=this.fallback(theme);
  if(replacement)this.activate(replacement,theme,undefined,false);
 }
 private activate(sound:Howl,theme:MusicTheme,sprite:string|undefined,owned:boolean){
  // Rapid menu/run changes still keep one outgoing track and one incoming track.
  this.tracks.sort((a,b)=>b.weight-a.weight);
  for(const old of this.tracks.splice(1)){old.sound.stop(old.id);if(old.owned)old.sound.unload();}
  for(const track of this.tracks)track.target=0;
  const id=sound.play(sprite);sound.volume(0,id);sound.rate(this.rate,id);this.tracks.push({sound,id,weight:0,target:1,theme,owned});
 }
 update(dt:number,now:number,settings:Settings,paused:boolean){
  const duck=this.duck.gain(now);
  for(let n=this.tracks.length-1;n>=0;n--){const t=this.tracks[n];t.weight=Math.max(0,Math.min(1,t.weight+Math.sign(t.target-t.weight)*dt/.7));
   t.sound.volume(musicGain(settings,paused,duck,t.weight),t.id);
   if(t.target===0&&t.weight===0){t.sound.stop(t.id);if(t.owned)t.sound.unload();this.tracks.splice(n,1);}
  }
 }
 stop(){this.stopped=true;++this.pending;for(const entry of this.prepared.values()){clearTimeout(entry.timer);entry.sound.unload();}this.prepared.clear();for(const t of this.tracks)t.target=0;}
 simulateFailure(value:boolean){if(this.forcedFailure===value)return;this.forcedFailure=value;const theme=this.theme??'normal';this.stop();this.setTheme(theme);}
 resetDucking(){this.duck.clear();}
 setRate(rate:number){this.rate=rate;for(const track of this.tracks)track.sound.rate(rate,track.id);}
 destroy(){this.disposed=true;++this.pending;for(const entry of this.prepared.values()){clearTimeout(entry.timer);entry.sound.unload();}this.prepared.clear();for(const t of this.tracks){t.sound.stop(t.id);if(t.owned)t.sound.unload();}this.tracks=[];}
 get debug(){return{theme:this.theme,tracks:this.tracks.map(t=>({theme:t.theme,weight:t.weight,fallback:!t.owned})),prepared:[...this.prepared.keys()],pending:this.pending};}
}
