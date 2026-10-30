import {RadialBlurFilter,RGBSplitFilter,ShockwaveFilter} from 'pixi-filters';
import type {Settings} from '../types';
import type {FeedbackProfile} from '../presentation/profiles';
/** Both installed filters expect CSS pixel coordinates in their filter input. */
export function eventPixelPosition(x:number,y:number,ox:number,oy:number,scale:number,rotation=0){const c=Math.cos(rotation),s=Math.sin(rotation);return{x:(x*c-y*s)*scale+ox,y:(x*s+y*c)*scale+oy};}
export class PostFX {
  readonly shock=new ShockwaveFilter({center:{x:0,y:0},speed:1100,amplitude:3,wavelength:90});
  readonly rgb=new RGBSplitFilter({red:[0,0],green:[0,0],blue:[0,0]});
  readonly radial=new RadialBlurFilter({center:{x:0,y:0},angle:0,kernelSize:5,radius:140});
  private age=1;private profile:FeedbackProfile|null=null;private point={x:0,y:0};
  event(profile:FeedbackProfile,point:{x:number;y:number}){
    if(!profile.wave&&!profile.split&&!profile.blur)return;
    if(this.age<.035&&this.profile&&this.profile.trauma>profile.trauma)return;
    this.profile=profile;this.age=0;this.point={...point};
    this.shock.center={...point};this.radial.center={...point};
  }
  update(dt:number,settings:Settings,quality:string){
    this.age+=dt;const p=this.profile;
    if(!p||!settings.motion||!settings.distortion||settings.flash===0||quality==='low'){this.clear();return [];}
    const filters=[];
    if(this.age<p.wave){this.shock.time=this.age;this.shock.amplitude=p.amplitude*settings.flash;this.shock.speed=p.radius/Math.max(.01,p.wave);filters.push(this.shock);}
    if(this.age<p.split){const pixels=(p.trauma>=.68?4:2)*settings.flash;this.rgb.redX=pixels;this.rgb.blueX=-pixels;filters.push(this.rgb);}
    if(this.age<p.blur&&quality==='high'){this.radial.angle=(p.trauma>=.68?1.8:.55)*settings.flash;this.radial.radius=p.radius;filters.push(this.radial);}
    return filters;
  }
  clear(){this.age=1;this.profile=null;this.radial.angle=0;this.rgb.redX=this.rgb.blueX=0;}
  get filters(){return [this.shock,this.rgb,this.radial];}
  get debug(){return{center:{...this.point},active:!!this.profile&&this.age<Math.max(this.profile.wave,this.profile.split,this.profile.blur)};}
}
