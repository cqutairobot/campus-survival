import type {ContentSkill,WeaponIdentity} from '../types';
// P04 bounded port of src/weapons/summons.ts; S1 source remains frozen.
import type {ContentState} from './ContentState';
import type {WeaponParams} from './params';
import {distanceSq,TAU} from '../../../core/math';
export interface Turret{x:number;y:number;remaining:number;cooldown:number;source:'blueprint'}
export interface Drone{x:number;y:number;index:number;instanceId:number;generation:number;target:number;targetGeneration:number;cooldown:number}
export interface DroneBolt{x:number;y:number;prevX:number;prevY:number;instanceId:number;generation:number;target:number;targetGeneration:number;damage:number;life:number;sync:boolean;source:WeaponIdentity}
/** Fixed turrets are damage emitters, never navigation obstacles. */
export class SummonSystem{
 readonly turrets:Turret[]=[];private redeploy=0;
 readonly drones:Drone[]=[];readonly droneBolts:DroneBolt[]=[];private droneGeneration=0;private droneInstance=-1;private retarget=0;private sync=0;
 constructor(private g:ContentState){}
 remove(id:string){if(id==='blueprint'){this.turrets.length=0;this.redeploy=0;}if(id==='s2:drone'){this.drones.length=this.droneBolts.length=0;this.droneGeneration++;this.droneInstance=-1;this.retarget=0;this.sync=0;}}
 prune(){const skill=this.g.weapons.find(w=>w.id==='s2:drone');if(!skill||skill.instanceId!==this.droneInstance)this.remove('s2:drone');}
 updateDrones(skill:ContentSkill,params:WeaponParams,dt:number){
  const g=this.g,e=g.enemies,p=g.player,instanceId=skill.instanceId!;
  if(this.droneInstance!==instanceId||this.drones.length!==params.count){
   this.remove('s2:drone');this.droneInstance=instanceId;this.sync=params.syncInterval??0;
   for(let n=0;n<params.count;n++)this.drones.push({x:p.x,y:p.y-25,index:n,instanceId,generation:this.droneGeneration,target:-1,targetGeneration:0,cooldown:n*params.interval/params.count});
  }
  const closest=(x:number,y:number,used=new Set<number>())=>{let target=-1,best=params.range**2;for(const id of e.active){const d=distanceSq(x,y,e.x[id],e.y[id]);if(e.hp[id]>0&&!used.has(id)&&(d<best||d===best&&id<target)){target=id;best=d;}}return target;};
  this.retarget-=dt;const assign=this.retarget<=0;if(assign)this.retarget+=params.retargetInterval!;
  const used=new Set<number>();
  const fire=(drone:Drone,target:number,sync=false)=>{
   if(target<0)return;this.droneBolts.push({x:drone.x,y:drone.y,prevX:drone.x,prevY:drone.y,instanceId,generation:this.droneGeneration,target,targetGeneration:e.generation[target],damage:params.damage,life:params.range/720+.75,sync,source:g.weaponSystem.identity(skill)});
   g.emit({type:'shot',x:drone.x,y:drone.y,color:sync?0xc1f6ff:0x529fcc,size:8,weapon:'s2:drone',evolved:skill.evolved,level:skill.level,text:sync?'同步集火':'常规攻击'});
  };
  for(const drone of this.drones){
   const a=g.combatTime*.8+drone.index*TAU/params.count,x=p.x+Math.cos(a)*76,y=p.y+Math.sin(a)*53-27,blend=1-Math.exp(-dt*12);drone.x+=(x-drone.x)*blend;drone.y+=(y-drone.y)*blend;
   if(assign||!e.valid(drone.target,drone.targetGeneration)||e.hp[drone.target]<=0||distanceSq(drone.x,drone.y,e.x[drone.target],e.y[drone.target])>params.range**2){drone.target=closest(drone.x,drone.y,used);if(drone.target<0)drone.target=closest(drone.x,drone.y);drone.targetGeneration=drone.target<0?0:e.generation[drone.target];}
   if(drone.target>=0)used.add(drone.target);drone.cooldown-=dt;if(drone.cooldown<=0){drone.cooldown+=params.interval;fire(drone,drone.target);}
  }
  // An extra volley never replaces or delays the ordinary coverage schedule.
  if(skill.evolved&&params.syncInterval){this.sync-=dt;if(this.sync<=0){this.sync+=params.syncInterval;const target=closest(p.x,p.y);if(target>=0){for(const drone of this.drones)fire(drone,target,true);g.emit({type:'ring',x:e.x[target],y:e.y[target],size:36,color:0x529fcc,weapon:'s2:drone',text:'同步集火',duration:.35});}}}
  for(let n=this.droneBolts.length-1;n>=0;n--){
   const b=this.droneBolts[n];b.life-=dt;
   if(b.instanceId!==this.droneInstance||b.generation!==this.droneGeneration||b.life<=0||!e.valid(b.target,b.targetGeneration)||e.hp[b.target]<=0){this.droneBolts.splice(n,1);continue;}
   b.prevX=b.x;b.prevY=b.y;const dx=e.x[b.target]-b.x,dy=e.y[b.target]-b.y,d=Math.hypot(dx,dy),travel=720*dt;
   if(d<=travel+e.radius[b.target]){g.hitEnemy(b.target,b.damage,'s2:drone',b.x,b.y,1,true,true,false,false,false,{weapon:b.source});g.emit({type:'beam',x:b.x,y:b.y,x2:e.x[b.target],y2:e.y[b.target],size:b.sync?4:2,color:0x7dd7ec,weapon:'s2:drone',duration:.12});this.droneBolts.splice(n,1);}
   else{b.x+=dx/d*travel;b.y+=dy/d*travel;}
  }
 }
 update(skill:ContentSkill,params:WeaponParams,dt:number,fire:(turret:Turret,params:WeaponParams)=>void){this.redeploy-=dt;if(this.redeploy<=0||this.turrets.length!==params.count){this.redeploy=8;this.turrets.length=0;for(let n=0;n<params.count;n++){const a=n*TAU/params.count,p=this.g.safePoint(this.g.player.x+Math.cos(a)*90,this.g.player.y+Math.sin(a)*70);this.turrets.push({...p,remaining:8*this.g.stats.duration,cooldown:n*.035,source:'blueprint'});}this.g.emit({type:'signature',x:this.g.player.x,y:this.g.player.y,color:0x80b8ee,size:150,weapon:'blueprint',evolved:skill.evolved,value:params.count,duration:.8});}
  for(const turret of this.turrets){turret.remaining-=dt;turret.cooldown-=dt;if(turret.remaining>0&&turret.cooldown<=0){turret.cooldown+=params.interval;fire(turret,params);}}
 }
}
