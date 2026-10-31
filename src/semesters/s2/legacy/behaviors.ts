// P04 bounded port of src/enemies/behaviors.ts; S1 source remains frozen.
import type {ContentState} from './ContentState';
import {RANK_CODE} from '../../../data/enemies';
import {distanceSq} from '../../../core/math';
import {weekDamageMultiplier} from './rules';
import {relicEnemySpeed} from '../../../progression/relics';
import {applySlow,slowFactor,updateStatus} from '../../../combat/status';
import {updateMiniBoss} from './minibosses';
import type {S2Hazard} from '../danger';
/** Enemy logic consumes only the AI stream; warning shapes live on the danger layer. */
export class EnemyBehaviors{
 private candidates:number[]=[];private nav={x:0,y:0};private charges=new Map<number,S2Hazard>();private bombs=new Map<number,S2Hazard>();
 constructor(private g:ContentState){}
 update(dt:number){const g=this.g,e=g.enemies,p=g.player;let charging=0,bombing=0,summons=0;const auras:number[]=[];
  for(const id of e.active){if(e.hp[id]<=0)continue;const behavior=this.g.content.enemies[e.kind[id]].behavior;if(e.state[id]===1||e.state[id]===2){if(behavior==='charge')charging++;if(behavior==='bomber')bombing++;}if(e.owner[id]>=0&&this.g.content.enemies[e.kind[id]].id!=='node')summons++;if(behavior==='aura'||(e.affixes[id]&16))auras.push(id);}
  for(const id of [...e.active]){
   if(!e.alive[id]||e.hp[id]<=0)continue;const def=this.g.content.enemies[e.kind[id]],rank=e.rank[id];e.prevX[id]=e.x[id];e.prevY[id]=e.y[id];
   const wasFrozen=e.frozen[id]>0,frozen=updateStatus(e,id,dt);if(wasFrozen&&e.frozen[id]<=0)g.emit({type:'block',x:e.x[id],y:e.y[id],color:0xb9ecff,size:e.radius[id]*1.5,material:'ice'});if(g.combatTime-e.cryoLast[id]>.04)e.freezeAccum[id]=0;
   if(e.maxShield[id]>0&&g.combatTime-e.lastHit[id]>=6)e.shield[id]=e.maxShield[id];
   if(e.owner[id]>=0&&!g.enemySourceAlive(e.owner[id],e.ownerGeneration[id])){g.releaseEnemy(id);continue;}
   if(e.lifetime[id]>0){e.lifetime[id]-=dt;if(e.lifetime[id]<=0){g.releaseEnemy(id);continue;}}
   if(e.burn[id]>0){e.burn[id]-=dt;e.burnTick[id]-=dt;if(e.burnTick[id]<=1e-6){e.burnTick[id]=.5;g.hitEnemy(id,e.burnDamage[id],e.burnSource[id],p.x,p.y,0,false);if(e.hp[id]<=0)continue;}}
   if(frozen)continue;
   if(def.behavior==='relayNode'||def.behavior==='reviewPanel'||def.id==='node'||def.behavior==='relay'||def.behavior==='auditor')continue;
   if(id===g.bossEnemy){if(g.bossSystem.expoFinal.contactAllowed(id)&&g.bossSystem.projectReview.contactAllowed(id)&&g.bossSystem.proposalBoard.contactAllowed(id)&&distanceSq(p.x,p.y,e.x[id],e.y[id])<(e.radius[id]+12)**2)g.hurtPlayer(e.damage[id],e.x[id],e.y[id],g.originForEnemy(id));continue;}
   const dx=p.x-e.x[id],dy=p.y-e.y[id],dist=Math.hypot(dx,dy)||1;
   if(dist>2000&&rank===RANK_CODE.normal&&e.owner[id]<0&&(!def.id.startsWith('s2:')||e.state[id]===0)){const point=g.safePoint(p.x-dx/dist*700,p.y-dy/dist*600);e.x[id]=point.x;e.y[id]=point.y;}
   let mx=dx/dist,my=dy/dist,speed=e.speed[id]*slowFactor(e,id)*relicEnemySpeed(g.relics)*(g.activeEvent==='examRage'?1.15:g.activeEvent==='rainstorm'&&rank===RANK_CODE.normal?.9:1),attackSpeed=1;
   let auraBoost=1;for(const aura of auras){if(aura===id||e.hp[aura]<=0)continue;const elite=!!(e.affixes[aura]&16),radius=elite?220:180;if(distanceSq(e.x[id],e.y[id],e.x[aura],e.y[aura])<radius**2){auraBoost=Math.max(auraBoost,elite?1.2:1.15);if(elite)attackSpeed=1.15;}}speed*=auraBoost;
   if(g.manifest.regions.includes('library')&&distanceSq(e.x[id],e.y[id],2640,2640)<220**2)applySlow(e,id,.3,.1);
   e.aiTimer[id]-=dt;if(dist>300){if(e.aiTimer[id]<=0){const nav=g.navigation.direction(e.x[id],e.y[id],this.nav),d=Math.hypot(nav.x,nav.y)||1;e.aiX[id]=nav.x/d;e.aiY[id]=nav.y/d;e.aiTimer[id]=dist<500?.05:.1;}mx=e.aiX[id];my=e.aiY[id];}
   if(g.threats.update(id,dt,{mx,my,speed,dist}))continue;
   if(def.behavior==='snake'){const wave=Math.sin(g.combatTime*4+id)*.5,ox=mx;mx-=my*wave;my+=ox*wave;}
   if(def.behavior==='flank'&&dist>200){const side=(id%2?1:-1)*.65,ox=mx;mx-=my*side;my+=ox*side;}
   if(def.behavior==='ranged'||def.behavior==='thrower'){
    if(dist<280){mx=-dx/dist;my=-dy/dist;}else if(dist<365){mx=-dy/dist*.25;my=dx/dist*.25;}
    e.cooldown[id]-=dt*attackSpeed;if(e.cooldown[id]<=0){const thrower=def.behavior==='thrower';e.cooldown[id]=thrower?4:3.8;const a=Math.atan2(dy,dx);for(let n=thrower?-1:0;n<=(thrower?1:0);n++)g.enemyBullet(e.x[id],e.y[id],a+n*.22,thrower?170:185,8*weekDamageMultiplier(g.week),6,.75,rank===RANK_CODE.normal,id);}
   }
   const charge=def.behavior==='charge'||!!(e.affixes[id]&4)||(def.id==='teamlead'&&e.hp[id]<e.maxHp[id]*.5);
   if(charge){
    e.affixTimer[id]-=dt*attackSpeed;
    if(e.state[id]===0&&e.affixTimer[id]<=0&&(rank!==RANK_CODE.normal||charging<3)){
     const angle=Math.atan2(dy,dx),duration=(e.affixes[id]&4)?.6:300/420;
     const hazard=g.addHazard('line',e.x[id],e.y[id],e.x[id]+Math.cos(angle)*300,e.y[id]+Math.sin(angle)*300,18,1,duration,0,undefined,{owner:id,ownerGeneration:e.generation[id],ordinary:rank===RANK_CODE.normal});
     if(hazard){this.charges.set(id,hazard);if(def.id==='teamlead'&&e.hp[id]<e.maxHp[id]*.5&&e.chargeSequence[id]===0)e.chargeSequence[id]=2;charging++;e.state[id]=1;e.affixTimer[id]=4.5;e.angle[id]=angle;}
    }
    if(e.state[id]===1){
     speed=0;const hazard=this.charges.get(id);
     if(!hazard||hazard.ownerGeneration!==e.generation[id]||hazard.phase==='cancelled'){e.state[id]=0;this.charges.delete(id);}
     else if(hazard.phase==='active'){e.state[id]=2;e.timer[id]=hazard.lifeTotal;}
    }
    else if(e.state[id]===2){mx=Math.cos(e.angle[id]);my=Math.sin(e.angle[id]);speed=420*slowFactor(e,id);e.timer[id]-=dt;if(e.timer[id]<=0){e.state[id]=3;e.timer[id]=.8;}}
    else if(e.state[id]===3){speed=0;e.timer[id]-=dt;if(e.timer[id]<=0){e.state[id]=0;if(e.chargeSequence[id]>1){e.chargeSequence[id]--;e.affixTimer[id]=0;}else e.chargeSequence[id]=0;}}
   }
   if(def.behavior==='bomber'){
    if(e.state[id]===0&&dist<=110&&bombing<4){const hazard=g.addHazard('circle',e.x[id],e.y[id],0,0,100,1,.25,14*weekDamageMultiplier(g.week),undefined,{owner:id,ownerGeneration:e.generation[id],cancelOnDeath:true,ordinary:true});if(hazard){this.bombs.set(id,hazard);bombing++;e.state[id]=1;}}
    if(e.state[id]===1){speed=0;const hazard=this.bombs.get(id);if(!hazard||hazard.ownerGeneration!==e.generation[id]||hazard.phase==='cancelled'){e.state[id]=0;this.bombs.delete(id);}else if(hazard.phase==='active'){hazard.cancelOnDeath=false;e.release(id);this.bombs.delete(id);continue;}}
   }
   if(def.behavior==='summon'){e.cooldown[id]-=dt*attackSpeed;if(e.cooldown[id]<=0){e.cooldown[id]=7;let own=0;for(const child of e.active)if(e.owner[child]===id&&e.ownerGeneration[child]===e.generation[id])own++;for(let n=0;n<2&&own<6&&summons<48;n++,own++,summons++)g.spawnSummon('homework',id,e.x[id]+(n?35:-35),e.y[id]+30,12);}}
   if(def.behavior==='advisor'){e.cooldown[id]-=dt;if(e.cooldown[id]<=0){e.cooldown[id]=4;g.addHazard('circle',p.x,p.y,0,0,65,.85,.3,14,undefined,{ordinary:false,owner:id,ownerGeneration:e.generation[id]});}}
   if(e.affixes[id]&32){e.shootTimer[id]-=dt*attackSpeed;if(e.shootTimer[id]<=0){e.shootTimer[id]=5;const a=Math.atan2(dy,dx);for(let n=-1;n<=1;n++)g.enemyBullet(e.x[id],e.y[id],a+n*.22,170,8*weekDamageMultiplier(g.week),6,.8,false,id);}}
   if(rank===RANK_CODE.miniBoss)updateMiniBoss(g,id,dt);
   if(g.frame%2===0&&dist<800&&e.state[id]!==2){g.grid.query(e.x[id],e.y[id],45,this.candidates);let count=0;for(const other of this.candidates){if(count>=8)break;if(other===id||!e.alive[other]||e.hp[other]<=0)continue;count++;const ox=e.x[id]-e.x[other],oy=e.y[id]-e.y[other],d2=ox*ox+oy*oy,min=(e.radius[id]+e.radius[other])*.85;if(d2>0&&d2<min*min){const d=Math.sqrt(d2),f=(min-d)*.08;mx+=ox/d*f;my+=oy/d*f;}}}
   const magnitude=Math.hypot(mx,my)||1;g.moveEnemy(id,mx/magnitude*speed*dt+e.vx[id]*dt,my/magnitude*speed*dt+e.vy[id]*dt);e.vx[id]*=Math.exp(-dt*18);e.vy[id]*=Math.exp(-dt*18);
   if(distanceSq(p.x,p.y,e.x[id],e.y[id])<(e.radius[id]+12)**2)g.hurtPlayer(e.damage[id],e.x[id],e.y[id],g.originForEnemy(id));
  }
 }
}
