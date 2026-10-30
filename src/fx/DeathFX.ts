import {Container,Sprite,Texture,Rectangle} from 'pixi.js';
import type {VisualEvent,FragmentMaterial} from '../types';
import {enemyMaterial} from '../presentation/materials';
import {enemyArtSize,fitArtScale} from '../presentation/art-layout';
export interface DeathStyle {count:number;life:number;speed:number;spin:number;dissolve:boolean;silhouette:number;material:FragmentMaterial}
/** Material and rank determine presentation only; logical release/drop timing stays in the engine. */
export function deathStyle(event:VisualEvent,quality:string,motion:boolean):DeathStyle{
 const material=event.material??(event.enemyKind?enemyMaterial(event.enemyKind):'paper'),crystal=material==='glass'||material==='ice',hard=['metal','brick','key'].includes(material),dissolve=material==='code'||material==='spark';
 const boss=event.rank==='boss',elite=event.rank==='elite'||event.rank==='miniBoss';
 return {material,count:!motion?1:quality==='low'?4:quality==='medium'?6:boss?16:crystal?12:hard?8:dissolve?16:6,life:!motion?.18:boss?.62:elite?.44:crystal?.4:hard?.35:.28,speed:crystal?320:hard?175:dissolve?80:230,spin:hard?7:crystal?9:4,dissolve,silhouette:!motion?0:boss?.083:elite?.05:0};
}
interface Snapshot {parts:Sprite[];textures:Texture[];origins:{x:number;y:number}[];age:number;hold:number;event:VisualEvent;style:DeathStyle;angles:number[];scale:number}
/** Snapshots own subtextures, never live pool entities or shared atlas sources. */
export class DeathFX {
 readonly container=new Container();private snapshots:Snapshot[]=[];
 spawn(event:VisualEvent,texture:Texture,hold:number,quality:string,motion:boolean){
  const style=deathStyle(event,quality,motion),{count}=style,columns=count===1?1:count===6?3:count>=12?4:2,rows=Math.ceil(count/columns),parts:Sprite[]=[],textures:Texture[]=[],angles:number[]=[],origins:{x:number;y:number}[]=[];
  const scale=fitArtScale(texture,enemyArtSize(event.size)),width=texture.width/columns,height=texture.height/rows;
  for(let n=0;n<count;n++){
   const frame=new Rectangle(texture.frame.x+(n%columns)*width,texture.frame.y+Math.floor(n/columns)*height,width,height),piece=new Texture({source:texture.source,frame}),sprite=new Sprite(piece);
   const origin={x:((n%columns+.5)*width-texture.width/2)*scale,y:((Math.floor(n/columns)+.5)*height-texture.height/2)*scale};
   sprite.anchor.set(.5);sprite.scale.set(scale);sprite.position.set(event.x+origin.x,event.y+origin.y);
   this.container.addChild(sprite);parts.push(sprite);textures.push(piece);origins.push(origin);angles.push((event.angle??0)+(n-(count-1)/2)*.46);
  }
  this.snapshots.push({parts,textures,origins,age:0,hold:motion?Math.max(hold,style.silhouette):0,event:{...event},style,angles,scale});
  if(this.snapshots.length>64)this.release(this.snapshots.shift()!);
 }
 update(dt:number,motion:boolean){
  for(let n=this.snapshots.length-1;n>=0;n--){
   const s=this.snapshots[n],held=Math.min(s.hold,dt);s.hold-=held;s.age+=dt-held;const t=Math.min(1,s.age/s.style.life);
   if(t>=1){this.release(s);this.snapshots.splice(n,1);continue;}
   for(const [i,part] of s.parts.entries()){
    const origin=s.origins[i],jitter=(Math.sin(i*73.13+19.1)+1)*.5;
    part.alpha=s.style.dissolve?Math.max(0,1-t*(1.2+jitter)):1-t;
    if(motion&&s.hold<=0){
     const distance=s.style.speed*s.style.life*(t-t*t*.5)*(s.event.rank==='boss'?1.35:1);
     if(s.style.dissolve){part.position.set(s.event.x+origin.x*(1-t)+Math.cos(s.angles[i])*distance*.3,s.event.y+origin.y*(1-t));part.scale.set(s.scale*Math.max(0,1-t*(.7+jitter)));}
     else{part.position.set(s.event.x+origin.x+Math.cos(s.angles[i])*distance,s.event.y+origin.y+Math.sin(s.angles[i])*distance+55*t*t);part.rotation=(i%2?1:-1)*s.style.spin*s.age;part.scale.set(s.scale*(1-t*.3),s.scale*(1-t*.5));}
    }
   }
  }
 }
 private release(snapshot:Snapshot){for(const part of snapshot.parts)part.destroy();for(const texture of snapshot.textures)texture.destroy(false);}
 clear(){for(const snapshot of this.snapshots)this.release(snapshot);this.snapshots=[];}
 get active(){return this.snapshots.length;}
}
