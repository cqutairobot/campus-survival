import {segmentDistanceSq} from '../../core/math';
import {RANK_CODE} from '../../data/enemies';
import {slowFactor} from '../../combat/status';
import type {ContentState} from './legacy/ContentState';
import type {S2Hazard} from './danger';
import {pressureAt} from './pressure';

interface Identity {slot:number;generation:number}
interface Attack {generation:number;hazard?:S2Hazard;child?:Identity;recovery:number;remaining:number}
interface Parcel {generation:number;owner:number;ownerGeneration:number;hazard:S2Hazard}
interface Motion {mx:number;my:number;speed:number;dist:number}

/** Per-run handles, never independent countdowns for executing an attack. */
export class FirstChapterBehaviors {
 private attacks=new Map<number,Attack>();private parcels=new Map<number,Parcel>();
 constructor(private g:ContentState){}
 private attack(id:number){let a=this.attacks.get(id);if(a?.generation!==this.g.enemies.generation[id]){a={generation:this.g.enemies.generation[id],recovery:0,remaining:0};this.attacks.set(id,a);}return a!;}
 forget(id:number,generation:number){if(this.attacks.get(id)?.generation===generation)this.attacks.delete(id);if(this.parcels.get(id)?.generation===generation)this.parcels.delete(id);}
 clear(){this.attacks.clear();this.parcels.clear();}
 parcelViews(){return [...this.parcels].filter(([id,p])=>this.g.enemies.valid(id,p.generation)).map(([slot,p])=>({slot,generation:p.generation,owner:p.owner,ownerGeneration:p.ownerGeneration,phase:p.hazard.phase,warning:p.hazard.warning,warningTotal:p.hazard.warningTotal}));}
 update(id:number,dt:number,m:Motion){
  const g=this.g,e=g.enemies,kind=g.content.enemies[e.kind[id]].behavior;
  const parcel=this.parcels.get(id);
  if(parcel?.generation===e.generation[id]){
   if(parcel.hazard.phase==='cancelled'||!g.enemySourceAlive(parcel.owner,parcel.ownerGeneration)){g.releaseEnemy(id);return true;}
   // A hovering, shootable parcel marks the old landing position. It has no
   // contact damage; only the admitted active landing can hurt the player.
   e.x[id]=parcel.hazard.x;e.y[id]=parcel.hazard.y;e.state[id]=parcel.hazard.phase==='active'?2:1;return true;
  }
  if(!['bike','reservation','parceler','dispatcher'].includes(kind))return false;
  const a=this.attack(id);e.vx[id]*=Math.exp(-18*dt);e.vy[id]*=Math.exp(-18*dt);
  if(kind==='bike')this.bike(id,dt,m,a);
  else if(kind==='dispatcher')this.dispatcher(id,dt,m,a);
  else this.landing(id,dt,m,a,kind==='parceler');
  return true;
 }
 private move(id:number,dt:number,m:Motion,range=0,factor=1){
  const g=this.g,e=g.enemies,p=g.player;let {mx,my,speed}=m;
  if(range&&m.dist<range){mx=(e.x[id]-p.x)/Math.max(1,m.dist);my=(e.y[id]-p.y)/Math.max(1,m.dist);}
  else if(range&&m.dist<range+90)speed=0;
  const length=Math.hypot(mx,my)||1;g.moveEnemy(id,mx/length*speed*factor*dt,my/length*speed*factor*dt);
  if(segmentDistanceSq(p.x,p.y,e.prevX[id],e.prevY[id],e.x[id],e.y[id])<(e.radius[id]+12)**2)g.hurtPlayer(e.damage[id],e.prevX[id],e.prevY[id],g.originForEnemy(id));
 }
 private bike(id:number,dt:number,m:Motion,a:Attack){
  const g=this.g,e=g.enemies,p=g.player;
  if(a.hazard){
   const h=a.hazard;
   if(h.phase==='cancelled'){
    a.hazard=undefined;if(e.owner[id]>=0){g.releaseEnemy(id);return;}
    a.recovery=.9;e.cooldown[id]=4.5;e.state[id]=3;
   }else if(h.phase==='active'){
    if(e.state[id]!==2){e.angle[id]=Math.atan2(h.y2-h.y,h.x2-h.x);e.state[id]=2;}
    const speed=Math.hypot(h.x2-h.x,h.y2-h.y)/h.lifeTotal*slowFactor(e,id);
    g.moveEnemy(id,Math.cos(e.angle[id])*speed*dt,Math.sin(e.angle[id])*speed*dt);
    if(segmentDistanceSq(p.x,p.y,e.prevX[id],e.prevY[id],e.x[id],e.y[id])<(e.radius[id]+12)**2)g.hurtPlayer(e.damage[id],e.prevX[id],e.prevY[id],g.originForEnemy(id));
    return;
   }else{e.state[id]=1;return;}
  }
  if(a.recovery>0){a.recovery=Math.max(0,a.recovery-dt);g.moveEnemy(id,Math.cos(e.angle[id])*120*a.recovery/.9*dt,Math.sin(e.angle[id])*120*a.recovery/.9*dt);if(!a.recovery){e.state[id]=0;e.angle[id]+=Math.PI;}return;}
  e.cooldown[id]-=dt;
  if(e.cooldown[id]<=0&&m.dist<780){
   const angle=Math.atan2(p.y-e.y[id],p.x-e.x[id]),attached=e.owner[id]>=0;
   a.hazard=g.addHazard('line',e.x[id],e.y[id],e.x[id]+Math.cos(angle)*620,e.y[id]+Math.sin(angle)*620,22,attached?1.2:1.1,1.2,0,undefined,{owner:id,ownerGeneration:e.generation[id],cancelOnDeath:true,tier:g.originForEnemy(id).tier,ordinary:!attached,trackPlayer:true});
   if(a.hazard){e.state[id]=1;return;}e.cooldown[id]=.5;
  }
  this.move(id,dt,m);
 }
 private landing(id:number,dt:number,m:Motion,a:Attack,parceler:boolean){
  const g=this.g,e=g.enemies,p=g.player;
  if(a.hazard){
   if(a.hazard.phase!=='cancelled'){e.state[id]=a.hazard.phase==='active'?2:1;return;}
   if(a.child&&e.valid(a.child.slot,a.child.generation))g.releaseEnemy(a.child.slot);
   a.child=undefined;a.hazard=undefined;e.state[id]=0;e.cooldown[id]=parceler?4.8:4.4;
  }
  e.cooldown[id]-=dt;
  if(e.cooldown[id]<=0&&m.dist<700){
   let owner=id;
   if(parceler){
    owner=g.spawnSummon('s2:parceler',id,p.x,p.y,0,true);
    if(owner<0){e.cooldown[id]=.5;return;}
    e.hp[owner]=e.maxHp[owner]=Math.ceil(8*pressureAt(g.week).hp);e.damage[owner]=0;e.radius[owner]=12;e.speed[owner]=0;
    a.child={slot:owner,generation:e.generation[owner]};
   }
   a.hazard=g.addHazard('circle',p.x,p.y,0,0,parceler?62:65,parceler?1.6:1.2,.3,(parceler?14:12)*pressureAt(g.week).damage,undefined,{owner,ownerGeneration:e.generation[owner],cancelOnDeath:true,tier:g.originForEnemy(id).tier,ordinary:true});
   if(a.hazard){
    e.state[id]=1;
    if(parceler)this.parcels.set(owner,{generation:e.generation[owner],owner:id,ownerGeneration:e.generation[id],hazard:a.hazard});
    return;
   }
   if(a.child&&e.valid(a.child.slot,a.child.generation))g.releaseEnemy(a.child.slot);a.child=undefined;e.cooldown[id]=.5;
  }
  this.move(id,dt,m,parceler?300:250);
 }
 private dispatcher(id:number,dt:number,m:Motion,a:Attack){
  const g=this.g,e=g.enemies,p=g.player;
  if(a.child){
   if(e.valid(a.child.slot,a.child.generation)&&e.hp[a.child.slot]>0){this.move(id,dt,m,340,.15);return;}
   a.child=undefined;a.recovery=a.remaining?.7:2;
   if(!a.remaining){e.cooldown[id]=5.5;e.state[id]=3;}
  }
  if(a.recovery>0){a.recovery=Math.max(0,a.recovery-dt);return;}
  if(a.remaining>0){
   const angle=Math.atan2(p.y-e.y[id],p.x-e.x[id]),side=a.remaining===2?-1:1;
   const child=g.spawnSummon('s2:bike',id,e.x[id]-Math.sin(angle)*76*side,e.y[id]+Math.cos(angle)*76*side,12,true);
   if(child>=0){e.rank[child]=RANK_CODE.bossAdd;e.cooldown[child]=0;a.child={slot:child,generation:e.generation[child]};a.remaining--;}
   else a.recovery=.5;
   return;
  }
  e.cooldown[id]-=dt;e.state[id]=0;
  if(e.cooldown[id]<=0){a.remaining=2;e.state[id]=1;g.message('调度长 · 两条配送线依次放行，横向避让',4);return;}
  this.move(id,dt,m,340);
 }
}
