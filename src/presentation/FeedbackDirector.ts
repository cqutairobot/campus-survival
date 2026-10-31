import type {Settings,VisualEvent} from '../types';
import {feedbackProfile,type FeedbackProfile} from './profiles';
import {CameraRig} from '../fx/CameraRig';
import {EntityFeedback} from '../fx/EntityFeedback';
export interface FeedbackCue {event:VisualEvent;profile:FeedbackProfile;hold:number}
export class FeedbackDirector {
  readonly entities=new EntityFeedback();readonly camera=new CameraRig();private time=0;
  previewOverrides:Partial<FeedbackProfile>={};
  constructor(private settings:Settings){}
  apply(settings:Settings){this.settings=settings;if(!settings.motion)this.clear();else if(settings.hitStop===0){this.entities.clear();this.camera.emphasis.clear();}}
  consume(events:VisualEvent[]):FeedbackCue[]{
    const cues:FeedbackCue[]=[];let emphasis:FeedbackCue|undefined;
    for(const event of events){
      const base=feedbackProfile(event);if(!base)continue;const profile={...base,...this.previewOverrides};
      let hold=this.settings.motion?profile.frames/60*this.settings.hitStop:0;
      if(this.settings.motion&&['hit','death'].includes(event.type)&&event.slot!==undefined&&event.generation!==undefined)hold=this.entities.hit(event.slot,event.generation,event.angle??0,profile,this.time,this.settings.hitStop);
      const cue={event,profile,hold};cues.push(cue);
      if(!emphasis||profile.trauma>emphasis.profile.trauma)emphasis=cue;
    }
    if(this.settings.motion&&emphasis)this.camera.event(emphasis.profile,emphasis.event.angle??0,this.time,this.settings.hitStop);
    return cues;
  }
  update(dt:number){this.time+=dt;this.entities.update(dt);return this.camera.update(dt,this.time,this.settings.motion?this.settings.shake:0,this.settings.motion&&this.settings.zoomEffects);}
  clear(){this.entities.clear();this.camera.clear();}
}
