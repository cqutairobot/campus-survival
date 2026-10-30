export const VOICE_RULES={hover:{priority:10,limit:1},pickup:{priority:20,limit:4},shot:{priority:30,limit:8},hit:{priority:40,limit:18},death:{priority:50,limit:8},critical:{priority:60,limit:6},important:{priority:90,limit:4},hurt:{priority:100,limit:4}} as const;
export type VoiceCategory=keyof typeof VOICE_RULES;
export interface Voice {token:number;category:VoiceCategory;priority:number;volume:number;distance:number;started:number;stop:()=>void;playing:()=>boolean;scope:'ui'|'session'}
/** Counts actual sample layers, not Howler cache pools. Four slots reserved for key events. */
export class AudioDirector {
 readonly voices:Voice[]=[];peak=0;evicted=0;dropped=0;private serial=0;
 reap(){for(let i=this.voices.length-1;i>=0;i--)if(!this.voices[i].playing())this.voices.splice(i,1);}
 admit(category:VoiceCategory,volume:number,distance:number,now:number,scope:'ui'|'session',start:()=>Pick<Voice,'stop'|'playing'>){
  this.reap();const rule=VOICE_RULES[category],same=this.voices.filter(v=>v.category===category),cap=rule.priority>=90?48:44;
  if(same.length>=rule.limit||this.voices.length>=cap){
   const candidates=(same.length>=rule.limit?same:this.voices).filter(v=>v.priority<=rule.priority).sort((a,b)=>a.priority-b.priority||(a.volume/(1+a.distance)-b.volume/(1+b.distance))||a.started-b.started);
   const victim=candidates[0];if(!victim){this.dropped++;return false;}victim.stop();this.voices.splice(this.voices.indexOf(victim),1);this.evicted++;
  }
  const playback=start();this.voices.push({token:++this.serial,category,priority:rule.priority,volume,distance,started:now,scope,...playback});this.peak=Math.max(this.peak,this.voices.length);return true;
 }
 release(scope?:'ui'|'session'){for(let i=this.voices.length-1;i>=0;i--)if(!scope||this.voices[i].scope===scope){this.voices[i].stop();this.voices.splice(i,1);}}
}
