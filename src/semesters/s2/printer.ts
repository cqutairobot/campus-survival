import type {ContentState} from './legacy/ContentState';
import type {ContentSkill} from './types';
import type {WeaponParams} from './legacy/params';
import {sweptHit} from './legacy/damage';
export interface InkBead {x:number;y:number;prevX:number;prevY:number;vx:number;vy:number;life:number;pierce:number;hits:Set<number>;instanceId:number;generation:number;attackId:string;params:WeaponParams;evolved:boolean}
export interface StructureMark {x:number;y:number;radius:number;life:number;damage:number;instanceId:number;generation:number;evolved:boolean}
export class PrinterSystem {
 readonly beads:InkBead[]=[];readonly marks:StructureMark[]=[];private instance=-1;private generation=0;private cooldown=0;private serial=0;
 constructor(private g:ContentState){}
 remove(){this.beads.length=this.marks.length=0;this.instance=-1;this.generation++;this.cooldown=0;}
 prune(){if(!this.g.weapons.some(w=>w.id==='s2:printer'&&w.instanceId===this.instance))this.remove();}
 private mark(b:InkBead){this.marks.push({x:b.x,y:b.y,radius:b.params.explosion,life:b.params.duration,damage:b.params.markDamage!,instanceId:b.instanceId,generation:b.generation,evolved:b.evolved});while(this.marks.length>16)this.marks.shift();}
 update(skill:ContentSkill,p:WeaponParams,dt:number){
  const g=this.g,v=g.player,e=g.enemies;if(this.instance!==skill.instanceId){this.remove();this.instance=skill.instanceId!;}
  for(let n=this.marks.length-1;n>=0;n--)if((this.marks[n].life-=dt)<=0)this.marks.splice(n,1);
  this.cooldown-=dt;if(this.cooldown<=0){this.cooldown+=p.interval;let nearest=-1,best=p.range**2;for(const id of e.active){const d=(e.x[id]-v.x)**2+(e.y[id]-v.y)**2;if(e.hp[id]>0&&d<best){best=d;nearest=id;}}const angle=nearest<0?v.facing:Math.atan2(e.y[nearest]-v.y,e.x[nearest]-v.x),attackId=`ink:${this.instance}:${this.generation}:${++this.serial}`;
   for(let n=0;n<p.count;n++){const a=angle+(n-(p.count-1)/2)*.12;this.beads.push({x:v.x,y:v.y,prevX:v.x,prevY:v.y,vx:Math.cos(a)*480,vy:Math.sin(a)*480,life:p.range/480,pierce:p.pierce,hits:new Set(),instanceId:this.instance,generation:this.generation,attackId,params:p,evolved:skill.evolved});}
  }
  for(let n=this.beads.length-1;n>=0;n--){const b=this.beads[n];b.prevX=b.x;b.prevY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
   for(const id of [...e.active]){const key=e.generation[id]*e.capacity+id;if(e.hp[id]<=0||b.hits.has(key)||!sweptHit(b.prevX,b.prevY,b.x,b.y,e.x[id],e.y[id],e.radius[id]+5))continue;b.hits.add(key);g.hitEnemy(id,b.params.damage,'s2:printer',b.prevX,b.prevY,1,true,true,false,false,false,{attackId:b.attackId});this.mark(b);if(--b.pierce<=0)break;}
   if(b.life<=0||b.pierce<=0){if(b.pierce>0)this.mark(b);this.beads.splice(n,1);}
  }
 }
 trigger(id:number){
  const g=this.g,e=g.enemies;if(!this.marks.length)return;this.prune();const nearby=this.marks.filter(m=>(m.x-e.x[id])**2+(m.y-e.y[id])**2<=(m.radius+e.radius[id])**2);if(!nearby.length)return;
  const consumed=nearby.some(m=>m.evolved)?[...this.marks]:nearby;
  // Consume first. Explosion hits can never find/re-enter the triggering marks.
  for(const m of consumed)this.marks.splice(this.marks.indexOf(m),1);
  const attackId=`structure:${this.instance}:${this.generation}:${++this.serial}`;
  for(const target of [...e.active]){if(e.hp[target]<=0)continue;let damage=0;for(let n=0;n<consumed.length;n++){const m=consumed[n],next=consumed[(n+1)%consumed.length];if((m.x-e.x[target])**2+(m.y-e.y[target])**2<=(m.radius+e.radius[target])**2||m.evolved&&sweptHit(m.x,m.y,next.x,next.y,e.x[target],e.y[target],e.radius[target]+18))damage=Math.max(damage,m.damage);}if(damage>0)g.hitEnemy(target,damage,'s2:printer',e.x[id],e.y[id],0,false,false,false,false,true,{additional:'mark',attackId});}
  for(const m of consumed)g.emit({type:'ring',x:m.x,y:m.y,size:m.radius,color:0xae7cd2,weapon:'s2:printer',duration:.3});
 }
}
