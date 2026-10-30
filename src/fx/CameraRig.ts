import type {FeedbackProfile} from '../presentation/profiles';
import {PresentationClock} from './PresentationClock';
const hash=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return(v-Math.floor(v))*2-1;};
function noise(t:number,seed:number){const n=Math.floor(t),f=t-n,s=f*f*(3-2*f);return hash(n+seed)*(1-s)+hash(n+1+seed)*s;}
export class CameraRig {
  trauma=0;private angle=0;private last=-1;private windowPeak=0;private zoomAge=1;private zoomPeak=1;private nextZoom=0;
  readonly emphasis=new PresentationClock(6);
  event(profile:FeedbackProfile,angle:number,now:number,stopStrength:number){
    if(now-this.last>.045){this.windowPeak=0;this.last=now;}
    const extra=Math.max(0,profile.trauma-this.windowPeak);this.windowPeak=Math.max(this.windowPeak,profile.trauma);
    if(profile.trauma>.2||this.trauma<.3)this.trauma=Math.min(profile.trauma>.2?1:.3,this.trauma+extra);this.angle=angle;
    if(profile.zoom>1&&(now>=this.nextZoom||profile.tier==='boss'&&profile.zoom>this.zoomPeak)){this.zoomPeak=profile.zoom;this.zoomAge=0;this.nextZoom=now+.45;this.emphasis.request(now,profile.frames,stopStrength);}
  }
  update(dt:number,time:number,strength:number,zoomEnabled:boolean){
    this.trauma=Math.max(0,this.trauma-1.8*dt);this.zoomAge+=this.emphasis.advance(dt);
    const a=this.trauma**2*strength,dx=Math.cos(this.angle),dy=Math.sin(this.angle),n=noise(time*24,1)*.7+noise(time*41,7)*.3;
    const z=this.zoomAge<.035?this.zoomAge/.035:Math.max(0,1-(this.zoomAge-.035)/.2);
    return{x:a?24*a*(.65*dx*n+.35*noise(time*24,13)):0,y:a?14*a*(.65*dy*n+.35*noise(time*41,19)):0,rotation:a?.35*Math.PI/180*a*noise(time*24,29):0,zoom:zoomEnabled?1+(this.zoomPeak-1)*z:1};
  }
  clear(){this.trauma=0;this.zoomAge=1;this.zoomPeak=1;this.nextZoom=0;this.windowPeak=0;this.last=-1;this.emphasis.clear();}
}
