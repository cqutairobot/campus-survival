import type {GameEngine} from '../core/engine';
import type {WeaponParams} from './params';
import type {Skill} from '../types';
import {TAU} from '../core/math';
export interface Turret{x:number;y:number;remaining:number;cooldown:number;source:'blueprint'}
/** Fixed turrets are damage emitters, never navigation obstacles. */
export class SummonSystem{
 readonly turrets:Turret[]=[];private redeploy=0;
 constructor(private g:GameEngine){}
 remove(id:string){if(id==='blueprint'){this.turrets.length=0;this.redeploy=0;}}
 update(skill:Skill,params:WeaponParams,dt:number,fire:(turret:Turret,params:WeaponParams)=>void){this.redeploy-=dt;if(this.redeploy<=0||this.turrets.length!==params.count){this.redeploy=8;this.turrets.length=0;for(let n=0;n<params.count;n++){const a=n*TAU/params.count,p=this.g.safePoint(this.g.player.x+Math.cos(a)*90,this.g.player.y+Math.sin(a)*70);this.turrets.push({...p,remaining:8*this.g.stats.duration,cooldown:n*.035,source:'blueprint'});}this.g.emit({type:'signature',x:this.g.player.x,y:this.g.player.y,color:0x80b8ee,size:150,weapon:'blueprint',evolved:skill.evolved,value:params.count,duration:.8});}
  for(const turret of this.turrets){turret.remaining-=dt;turret.cooldown-=dt;if(turret.remaining>0&&turret.cooldown<=0){turret.cooldown+=params.interval;fire(turret,params);}}
 }
}
