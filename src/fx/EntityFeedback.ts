import type {FeedbackProfile} from '../presentation/profiles';
import {PresentationClock} from './PresentationClock';
interface State {generation:number;age:number;angle:number;profile:FeedbackProfile;clock:PresentationClock}
export interface EntityPose {white:number;x:number;y:number;scaleX:number;scaleY:number;skew:number;held:number}
const neutral=():EntityPose=>({white:0,x:0,y:0,scaleX:1,scaleY:1,skew:0,held:0});
export class EntityFeedback {
  private states=new Map<number,State>();
  hit(slot:number,generation:number,angle:number,profile:FeedbackProfile,now:number,strength:number){
    let state=this.states.get(slot);
    if(!state||state.generation!==generation){state={generation,age:0,angle,profile,clock:new PresentationClock()};this.states.set(slot,state);}
    const held=state.clock.request(now,profile.frames,strength);
    // Multiple same-target hits in a batch keep the strongest pose.
    if(state.age>0||profile.frames>=state.profile.frames){state.age=0;state.angle=angle;state.profile=profile;}
    return held;
  }
  update(dt:number){for(const state of this.states.values())state.age+=state.clock.advance(dt);}
  pose(slot:number,generation:number,nearPlayer=false):EntityPose{
    const state=this.states.get(slot);if(!state)return neutral();
    if(state.generation!==generation){this.states.delete(slot);return neutral();}
    const p=state.profile,t=Math.min(1,state.age/p.duration);
    if(t>=1)return neutral();
    const force=t<.2?t/.2:Math.exp(-(t-.2)*6)*Math.cos((t-.2)*5),c=Math.cos(state.angle),s=Math.sin(state.angle);
    const along=1+(p.squash-1)*force,across=1+(p.stretch-1)*force;
    // Symmetric directional stretch matrix, expressed through Pixi scale + skew.
    const xx=c*c*along+s*s*across,yy=s*s*along+c*c*across,xy=c*s*(along-across);
    const recoil=(t<.18?t/.18:t<.8?1-(t-.18)/.62:-(1-t)*.5)*Math.min(p.recoil,nearPlayer?2:p.recoil);
    return{white:Math.max(0,1-state.age/p.flash)*p.white,x:c*recoil,y:s*recoil,scaleX:xx,scaleY:yy,skew:Math.atan2(xy,yy),held:state.clock.remaining};
  }
  prune(valid:(slot:number,generation:number)=>boolean){for(const [slot,state] of this.states)if(!valid(slot,state.generation))this.states.delete(slot);}
  clear(){this.states.clear();}
  get size(){return this.states.size;}
}
