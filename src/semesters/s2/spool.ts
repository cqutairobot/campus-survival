import type {ContentState} from './legacy/ContentState';
import type {ContentSkill} from './types';
import type {WeaponParams} from './legacy/params';
import {sweptHit} from './legacy/damage';
export interface FiberSegment {x:number;y:number;x2:number;y2:number;life:number;width:number;instanceId:number;generation:number;connector?:boolean}
export class SpoolSystem {
 readonly segments:FiberSegment[]=[];private instance=-1;private generation=0;private place=0;private pulse=0;private last={x:0,y:0};private angle=0;private serial=0;
 constructor(private g:ContentState){}
 remove(){this.segments.length=0;this.instance=-1;this.generation++;this.place=this.pulse=0;}
 prune(){if(!this.g.weapons.some(w=>w.id==='s2:spool'&&w.instanceId===this.instance))this.remove();}
 update(skill:ContentSkill,p:WeaponParams,dt:number){
  const g=this.g,v=g.player,e=g.enemies;if(this.instance!==skill.instanceId){this.remove();this.instance=skill.instanceId!;this.last={x:v.x,y:v.y};}
  for(let n=this.segments.length-1;n>=0;n--)if((this.segments[n].life-=dt)<=0||this.segments[n].connector||this.segments[n].generation!==this.generation||this.segments[n].instanceId!==this.instance)this.segments.splice(n,1);
  this.place-=dt;this.pulse-=dt;
  if(this.place<=0){
   this.place+=p.placementInterval!;const dx=v.x-this.last.x,dy=v.y-this.last.y,d=Math.hypot(dx,dy);let x:number,y:number,x2:number,y2:number;
   if(d>8){const length=Math.min(d,p.lineLength!);x2=v.x;y2=v.y;x=x2-dx/d*length;y=y2-dy/d*length;}
   else{const radius=Math.min(p.range*.5,p.lineLength!/(2*Math.sin(Math.PI/p.count))),a=this.angle;this.angle+=Math.PI*2/p.count;x=v.x+Math.cos(a)*radius;y=v.y+Math.sin(a)*radius;x2=v.x+Math.cos(this.angle)*radius;y2=v.y+Math.sin(this.angle)*radius;}
   this.segments.push({x,y,x2,y2,width:p.width,life:p.duration,instanceId:this.instance,generation:this.generation});this.last={x:v.x,y:v.y};while(this.segments.length>p.count)this.segments.shift();
  }
  if(skill.evolved&&this.segments.length>=2){const nearest=[...this.segments].sort((a,b)=>Math.hypot((a.x+a.x2)/2-v.x,(a.y+a.y2)/2-v.y)-Math.hypot((b.x+b.x2)/2-v.x,(b.y+b.y2)/2-v.y)),[a,b]=nearest;this.segments.push({x:(a.x+a.x2)/2,y:(a.y+a.y2)/2,x2:(b.x+b.x2)/2,y2:(b.y+b.y2)/2,width:p.width,life:dt*2,instanceId:this.instance,generation:this.generation,connector:true});}
  if(this.pulse<=0){this.pulse+=p.interval;const attackId=`fiber:${this.instance}:${this.generation}:${++this.serial}`;
   for(const id of [...e.active])if(e.hp[id]>0&&this.segments.some(s=>sweptHit(s.x,s.y,s.x2,s.y2,e.x[id],e.y[id],e.radius[id]+s.width/2)))g.hitEnemy(id,p.damage,'s2:spool',v.x,v.y,0,true,true,false,false,false,{weapon:g.weaponSystem.identity(skill),attackId,dot:true});
   for(const s of this.segments)g.emit({type:'beam',x:s.x,y:s.y,x2:s.x2,y2:s.y2,size:2,color:0x709fe8,weapon:'s2:spool',duration:.16});
  }
 }
}
