import type {Settings} from '../types';
export const dbToGain=(db:number)=>10**(db/20);
/** This is the only multiplication of music/master/pause/intensity/duck gains. */
export function musicGain(settings:Settings,paused:boolean,duck=1,intensity=1){return settings.muted?0:settings.master*settings.music*(paused?.22:1)*intensity*(settings.musicDucking?duck:1);}
export const DUCK_PROFILES={critical:{db:-2.5,attack:.006,hold:.07,release:.16},hurt:{db:-5,attack:.008,hold:.12,release:.25},elite:{db:-6,attack:.008,hold:.18,release:.45},boss:{db:-8,attack:.01,hold:.3,release:.7},legendary:{db:-4,attack:.01,hold:.18,release:.35}} as const;
export type DuckKind=keyof typeof DUCK_PROFILES;
export class DuckEnvelope {
 private events:{at:number;kind:DuckKind;from:number}[]=[];
 trigger(kind:DuckKind,now:number){const from=this.gain(now);if(this.events.some(e=>e.kind===kind&&now-e.at<.035))return;this.events.push({at:now,kind,from});}
 gain(now:number){
  this.events=this.events.filter(e=>{const p=DUCK_PROFILES[e.kind];return now-e.at<p.attack+p.hold+p.release;});
  return this.events.reduce((gain,e)=>{const p=DUCK_PROFILES[e.kind],t=now-e.at,target=dbToGain(p.db),value=t<p.attack?e.from+(target-e.from)*Math.max(0,t)/p.attack:t<p.attack+p.hold?target:target+(1-target)*Math.min(1,(t-p.attack-p.hold)/p.release);return Math.min(gain,value);},1);
 }
 clear(){this.events=[];}
}
