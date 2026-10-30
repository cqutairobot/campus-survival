import type {VisualEvent} from '../types';
import {attackFeel} from './weapon-feedback';
export type FeedbackTier='normal'|'critical'|'kill'|'elite'|'miniBoss'|'boss'|'hurt'|'climax';
export interface FeedbackProfile {tier:FeedbackTier;frames:number;trauma:number;flash:number;white:number;squash:number;stretch:number;recoil:number;duration:number;zoom:number;wave:number;amplitude:number;radius:number;split:number;blur:number}
const base={flash:.055,white:.75,squash:.88,stretch:1.12,recoil:4,duration:.125,zoom:1,wave:0,amplitude:0,radius:140,split:0,blur:0};
export const profiles:Record<FeedbackTier,FeedbackProfile>={
  normal:{...base,tier:'normal',frames:1,trauma:.1},
  critical:{...base,tier:'critical',frames:2,trauma:.42,flash:.085,white:1,squash:.78,stretch:1.2,recoil:7,duration:.17,zoom:1.025,wave:.12,amplitude:3,split:.055,blur:.06},
  kill:{...base,tier:'kill',frames:2,trauma:.2},
  elite:{...base,tier:'elite',frames:3,trauma:.68,flash:.09,white:.9,squash:.92,stretch:1.08,recoil:3,duration:.165,zoom:1.045,wave:.22,amplitude:8,radius:280,split:.08,blur:.09},
  miniBoss:{...base,tier:'miniBoss',frames:4,trauma:.82,zoom:1.055,wave:.28,amplitude:10,radius:360,split:.09,blur:.1},
  boss:{...base,tier:'boss',frames:5,trauma:1,zoom:1.07,wave:.36,amplitude:14,radius:480,split:.1,blur:.1},
  hurt:{...base,tier:'hurt',frames:0,trauma:.6,split:0},
  climax:{...base,tier:'climax',frames:4,trauma:.75,zoom:1.045,wave:.24,amplitude:10,radius:360,split:.09,blur:.09},
};
export function feedbackProfile(event:VisualEvent):FeedbackProfile|null{
  if(event.type==='hit'){
    const feel=attackFeel(event),profile=event.critical?profiles.critical:event.rank&&['elite','miniBoss','boss'].includes(event.rank)?{...profiles.elite,frames:1,trauma:.12,zoom:1,wave:0,split:0,blur:0}:profiles.normal;
    return {...profile,recoil:profile.recoil*feel.weight,duration:profile.duration*(event.evolved?1.1:1),radius:profile.radius*feel.radius,amplitude:profile.amplitude*feel.weight};
  }
  if(event.type==='death')return event.rank==='boss'?profiles.boss:event.rank==='miniBoss'?profiles.miniBoss:event.rank==='elite'||event.priority?profiles.elite:profiles.kill;
  if(event.type==='hurt')return profiles.hurt;
  if(['ultimate','fusion','evolution','boss'].includes(event.type))return profiles.climax;
  return null;
}
