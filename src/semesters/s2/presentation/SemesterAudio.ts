import {Howl,Howler} from 'howler';
import type {GameAudio} from '../../../audio/audio';
import type {VoiceCategory} from '../../../audio/AudioDirector';
import type {Settings} from '../../../types';
import type {ContentVisualEvent} from '../enemy-visuals';
import type {Immutable} from '../../runtime/contracts';
import type {LegacyContentDTO} from '../legacy/rules-adapter';
import {S2_AUDIO_MANIFEST,S2_ENEMY_CUES,S2_WEAPON_CUES,S2_PASSIVE_CUES,S2_RELIC_CUES,S2_EVENT_CUES,S2_INTERACTION_CUES,S2_WARNING_CUES,S2_BOSS_STAGE_CUES,S2_AMBIENCE_CUES,semesterAudioIds,semesterAudioSources,type S2Sound} from './audio-catalog';
export interface LayerSound {state():string;play():number;stop(id?:number):unknown;playing(id?:number):boolean;volume(value:number,id?:number):unknown;stereo(value:number,id?:number):unknown;unload():unknown}
export interface LayerOptions {src:string[];format:string[];loop:boolean;volume:number;preload:boolean;onload:()=>void;onloaderror:()=>void}
/** Only the S2 scene owns these Howls. Howler's public shared context/output and
 * the existing GameAudio director/duck envelopes remain the single audio bus. */
export class SemesterAudio {
 private sounds=new Map<S2Sound,LayerSound>();private pending=new Map<S2Sound,Promise<void>>();private cancels=new Set<()=>void>();private failed=new Set<S2Sound>();private dead=false;
 private voices:{sound:LayerSound;id:number}[]=[];private last=new Map<string,number>();private edges=new Map<string,string|number|boolean>();private requested='';private ambient:{name:S2Sound;sound:LayerSound;id:number}|undefined;
 constructor(private audio:GameAudio,private settings:Settings,private factory:(o:LayerOptions)=>LayerSound=o=>new Howl(o),private canPlay=()=>Howler.ctx?.state==='running'&&audio.debug.ready){}
 apply(settings:Settings){this.settings=settings;if(settings.muted)this.stop();}
 async prepare(ids:readonly S2Sound[],signal?:AbortSignal){
  for(let start=0;start<ids.length&&!this.dead&&!signal?.aborted;start+=6)await Promise.all(ids.slice(start,start+6).map(id=>this.load(id,signal)));
 }
 private load(name:S2Sound,signal?:AbortSignal):Promise<void>{
  if(this.dead||signal?.aborted)return Promise.resolve();const old=this.pending.get(name);if(old)return old;if(this.sounds.has(name))return Promise.resolve();
  const pending=new Promise<void>(resolve=>{
   let finished=false,sound:LayerSound|undefined;const done=()=>{if(finished)return;finished=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);this.cancels.delete(cancel);resolve();};
   const cancel=()=>{sound?.unload();if(this.sounds.get(name)===sound)this.sounds.delete(name);done();};const timer=setTimeout(()=>{this.failed.add(name);cancel();},5000);
   this.cancels.add(cancel);signal?.addEventListener('abort',cancel,{once:true});
   sound=this.factory({src:semesterAudioSources(name),format:['ogg','mp3'],loop:S2_AUDIO_MANIFEST[name].loop,preload:true,volume:0,onload:()=>{if(this.dead||signal?.aborted){cancel();return;}this.failed.delete(name);done();},onloaderror:()=>{this.failed.add(name);cancel();}});this.sounds.set(name,sound);
   if(this.dead||signal?.aborted)cancel();
  }).finally(()=>this.pending.delete(name));this.pending.set(name,pending);return pending;
 }
 cue(name:S2Sound,category:VoiceCategory='hit',pan=0,volume=.35){
  if(this.dead||this.settings.muted||!this.canPlay())return false;
  const now=performance.now()/1000,key=category+':'+name;if(now-(this.last.get(key)??-10)<(category==='shot'?.075:.12))return false;
  const sound=this.sounds.get(name),critical=category==='hurt'||category==='important';
  if(!sound||sound.state()!=='loaded'){if(critical)this.audio.event({type:'warning',x:0,y:0,color:0xe59a66,size:1,priority:true,pan});else this.audio.play('hit',1,40);return false;}
  if(critical&&this.settings.musicDucking)this.audio.musicDirector.duck.trigger('boss',now);
  const gain=this.settings.master*this.settings.sfx*volume;if(gain<=0)return false;
  const accepted=this.audio.director.admit(category,gain,Math.abs(pan),now,'session',()=>{const id=sound.play();sound.volume(gain,id);sound.stereo(Math.max(-.65,Math.min(.65,pan)),id);this.voices.push({sound,id});return{playing:()=>sound.playing(id),stop:()=>sound.stop(id)};});
  if(accepted)this.last.set(key,now);this.voices=this.voices.filter(v=>v.sound.playing(v.id));return accepted;
 }
 event(event:ContentVisualEvent&{pan?:number}){
  const pan=event.pan??0,weapon=(S2_WEAPON_CUES as Record<string,S2Sound>)[(event.weapon??'')+(event.evolved?':evolved':'')]??(S2_WEAPON_CUES as Record<string,S2Sound>)[event.weapon??''];
  if(weapon&&['shot','beam','ring','chain','pulse'].includes(event.type))this.cue(weapon,weapon.startsWith('fusion-')?'critical':'shot',pan,weapon.startsWith('fusion-')?.35:.2);
  const enemy=(S2_ENEMY_CUES as Record<string,{hit:S2Sound;death:S2Sound}>)[event.contentEnemyId??''];if(enemy&&['hit','death'].includes(event.type))this.cue(event.type==='death'?enemy.death:enemy.hit,event.type==='death'?'death':'hit',pan,.2);
  if(event.type==='warning'){const kind=/落点|预约/.test(event.text??'')?'reservation':/扫描|扇区|评审屏/.test(event.text??'')?'scan':'line';this.cue(S2_WARNING_CUES[kind],'hurt',pan,.75);}
  if(event.type==='boss'){const stage=/阶段\s*3/.test(event.text??'')?3:/阶段\s*2/.test(event.text??'')?2:1;this.cue(S2_BOSS_STAGE_CUES[stage],'important',pan,.65);}
 }
 private edge(key:string,value:string|number|boolean,cue:S2Sound,trigger=true,category:VoiceCategory='hit'){
  const previous=this.edges.get(key);this.edges.set(key,value);if(previous!==undefined&&previous!==value&&trigger)this.cue(cue,category,0,.3);
 }
 observe(g:Immutable<LegacyContentDTO>,playing:boolean){
  if(this.dead)return;
  if(!this.settings.muted){const ids=semesterAudioIds(g.week,g.player),key=ids.join('|');if(key!==this.requested){this.requested=key;void this.prepare(ids);}}
  const event=g.event?.kind??'';this.edge('event',event,(S2_EVENT_CUES as Record<string,S2Sound>)[event]??'contract-s2-project',!!event,'important');
  for(const id of g.relics){const cue=(S2_RELIC_CUES as Record<string,S2Sound>)[id];if(cue)this.edge('relic:'+id,true,cue);}
  this.edge('relics',g.relics.join('|'),'contract-s2-project',true,'important');this.edge('amended',g.risk.amended,S2_INTERACTION_CUES['s2:amendmentTable'],g.risk.amended,'important');
  this.edge('table',g.tables.table?.kind??'',g.tables.table?.kind==='amendment'?S2_INTERACTION_CUES['s2:amendmentTable']:S2_INTERACTION_CUES['s2:jointTable'],!!g.tables.table,'important');
  this.edge('medical',g.interactions.uses['s2:infirmary']??0,S2_INTERACTION_CUES['s2:infirmary'],true,'important');this.edge('revision',g.revision.active?.id??'',S2_INTERACTION_CUES['s2:revision'],!!g.revision.active,'important');
  this.edge('battery',g.ultimate.overflow,S2_PASSIVE_CUES['s2:battery'],g.ultimate.overflow>0);this.edge('protocol',g.protocolMarks.map(m=>m.id+':'+m.generation).join('|'),S2_PASSIVE_CUES['s2:protocol'],g.protocolMarks.length>0);
  this.edge('harness',g.harnessReady,S2_PASSIVE_CUES['s2:harness'],g.harnessReady);this.edge('echo',Object.values(g.additionalDamage).reduce((n,v)=>n+v.echo,0),S2_PASSIVE_CUES['s2:echoChip']);
  this.edge('buffer',g.risk.buffer.expires,S2_RELIC_CUES['s2:bufferBadge'],g.risk.buffer.amount>0);this.edge('review-mark',g.risk.marks.map(m=>m.id+':'+m.generation).join('|'),S2_RELIC_CUES['s2:reviewSeal'],g.risk.marks.length>0);
  this.edge('grant',g.risk.grant.bossUsed,S2_RELIC_CUES['s2:projectGrant'],g.risk.grant.bossUsed,'important');this.edge('route',g.risk.routeHandle??-1,S2_RELIC_CUES['s2:routePermit'],g.risk.routeHandle!==null,'hurt');
  const zone=g.world.zones.find(z=>Math.hypot(g.player.x-z.x,g.player.y-z.y)<z.radius),ambient=(S2_AMBIENCE_CUES as Record<string,S2Sound>)[zone?.id??''];
  if(!playing||this.settings.muted||!ambient){this.stopAmbient();return;}if(this.ambient?.name!==ambient||!this.ambient.sound.playing(this.ambient.id)){this.stopAmbient();const sound=this.sounds.get(ambient);if(sound?.state()==='loaded'&&this.cue(ambient,'shot',0,.07)){const v=this.voices.at(-1)!;this.ambient={name:ambient,...v};}}
 }
 private stopAmbient(){if(this.ambient)this.ambient.sound.stop(this.ambient.id);this.ambient=undefined;}
 stop(){this.stopAmbient();for(const v of this.voices)v.sound.stop(v.id);this.voices=[];this.audio.director.reap();}
 dispose(){if(this.dead)return;this.dead=true;for(const cancel of [...this.cancels])cancel();this.stop();for(const sound of this.sounds.values())sound.unload();this.sounds.clear();this.last.clear();this.edges.clear();}
 get debug(){return{loaded:[...this.sounds].filter(([,s])=>s.state()==='loaded').map(([id])=>id),loading:this.pending.size,failed:[...this.failed],voices:this.voices.filter(v=>v.sound.playing(v.id)).length,disposed:this.dead};}
}
