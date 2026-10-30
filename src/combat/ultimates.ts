import type {GameEngine} from '../core/engine';
import type {DamageSource,EnemyRank} from '../types';
import {ultimateFor} from '../data/ultimates';
import {rankName} from '../data/enemies';
import {distanceSq,TAU} from '../core/math';
import {freezeEnemy} from './status';
export class UltimateSystem{
 energy=60;cooldown=0;remaining=0;elapsed=0;private tick=0;private secondary=0;private wave=0;readonly sources:Record<string,number>={};readonly def;
 constructor(private g:GameEngine){this.def=ultimateFor(g.manifest.character);}
 get ready(){return this.energy>=240&&this.cooldown<=1e-6&&this.remaining<=0;}
 gain(amount:number,source:string){if(this.remaining>0||amount<=0)return;const gain=Math.min(240-this.energy,amount);this.energy+=gain;this.sources[source]=(this.sources[source]??0)+gain;if(this.energy>=240&&gain>0)this.g.emit({type:'charged',x:this.g.player.x,y:this.g.player.y,color:0xffd879,size:70,text:'大招就绪'});}
 kill(rank:EnemyRank,weight:number,source:DamageSource){if(source.kind==='ultimate')return;this.gain(({normal:1,elite:15,miniBoss:35,boss:60,bossAdd:0}[rank])*weight*this.g.stats.charge,rank);}
 release(){
  const g=this.g,p=g.player;if(g.phase!=='playing'||p.hp<=0||!this.ready)return false;
  this.energy=0;this.cooldown=g.manifest.dailyRule==='overload'?20:30;this.elapsed=0;this.tick=0;this.secondary=0;this.wave=0;this.remaining={submission:.25,lastMinute:4,parallel:8,conference:6,barrier:8,overload:8}[this.def.id];p.invincible=Math.max(p.invincible,.5);
  g.emit({type:'ultimate',x:p.x,y:p.y,color:parseInt(this.def.color.slice(1),16),size:900,ultimate:this.def.id,text:this.def.name,duration:1.1,priority:true});g.impact(6);
  if(this.def.id==='submission'){g.clearEnemies(900,{kind:'ultimate',id:this.def.id},{elite:[.5,1500],miniBoss:[.12,1800],boss:[.06,4000]});g.addShield(20,3);}
  if(this.def.id==='lastMinute'){
   const e=g.enemies;for(const id of e.active)if(distanceSq(e.x[id],e.y[id],p.x,p.y)<=900**2){const seconds={normal:4,elite:2,miniBoss:1,boss:.5,bossAdd:4}[rankName(e.rank[id])];if(freezeEnemy(e,id,seconds))g.frozenTarget(id);}
   g.freezeHostiles(900,4);for(const h of g.hazards)if(h.owner!==undefined&&e.valid(h.owner,h.ownerGeneration??0)&&e.frozen[h.owner]>0)h.frozen=Math.max(h.frozen??0,e.frozen[h.owner]);
  }
  if(this.def.id==='barrier')g.addShield(40,8);
  return true;
 }
 private blast(radius:number,base:number,x=this.g.player.x,y=this.g.player.y){const g=this.g,e=g.enemies,source:DamageSource={kind:'ultimate',id:this.def.id};for(const id of [...e.active])if(distanceSq(x,y,e.x[id],e.y[id])<=(radius+e.radius[id])**2)g.hitEnemy(id,base*g.stats.damage*g.damageMultiplier,source,x,y);g.emit({type:'ring',x,y,color:parseInt(this.def.color.slice(1),16),size:radius,duration:.55,ultimate:this.def.id});}
 update(dt:number){
  this.cooldown=Math.max(0,this.cooldown-dt);if(this.remaining<=0)return;const g=this.g,p=g.player,e=g.enemies;this.remaining=Math.max(0,this.remaining-dt);this.elapsed+=dt;this.tick-=dt;this.secondary-=dt;
  if(this.def.id==='lastMinute'&&this.remaining<=0)this.blast(900,80+3*g.level);
  if(this.def.id==='parallel'&&this.tick<=0){this.tick+=.35;const used=new Set<number>();for(let n=0;n<6;n++){const a=n*TAU/6+g.combatTime*.5,x=p.x+Math.cos(a)*85,y=p.y+Math.sin(a)*65;let target=-1,best=650**2;for(const id of e.active){const d=distanceSq(x,y,e.x[id],e.y[id]);if(e.hp[id]>0&&d<best&&!used.has(id)){best=d;target=id;}}if(target<0)for(const id of e.active){const d=distanceSq(x,y,e.x[id],e.y[id]);if(e.hp[id]>0&&d<best){best=d;target=id;}}if(target>=0){used.add(target);g.hitEnemy(target,(45+1.5*g.level)*g.stats.damage*g.stats.summon*g.damageMultiplier,{kind:'ultimate',id:this.def.id},x,y);g.emit({type:'beam',x,y,x2:e.x[target],y2:e.y[target],color:0x78e0c4,size:4,duration:.18,ultimate:this.def.id});}}}
  if(this.def.id==='conference'&&this.wave<3&&this.elapsed>=this.wave*.8){const radius=[350,650,900][this.wave++];this.blast(radius,100+2*g.level);g.cancelProjectiles(radius);}
  if(this.def.id==='barrier'){if(this.tick<=0){this.tick+=.5;this.blast(260,40+g.level);}if(this.secondary<=0){this.secondary+=.2;g.cancelProjectiles(260,1);}}
  if(this.def.id==='overload'&&this.tick<=0){this.tick+=2;let target=-1,best=800**2;for(const id of e.active){const d=distanceSq(p.x,p.y,e.x[id],e.y[id]);if(e.hp[id]>0&&d<best){best=d;target=id;}}const x=target>=0?e.x[target]:p.x+Math.cos(p.facing)*180,y=target>=0?e.y[target]:p.y+Math.sin(p.facing)*180;this.blast(160,120+2*g.level,x,y);}
 }
 snapshot(){return{id:this.def.id,name:this.def.name,energy:this.energy,cooldown:this.cooldown,remaining:this.remaining,ready:this.ready};}
}
