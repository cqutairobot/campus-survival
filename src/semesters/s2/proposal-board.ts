import {segmentDistanceSq} from '../../core/math';
import {slowFactor} from '../../combat/status';
import type {ContentState} from './legacy/ContentState';
import type {ContentEnemyDef} from './legacy/catalog';
import type {S2Hazard} from './danger';

export const PROPOSAL_BOARD:ContentEnemyDef={id:'s2:proposalBoard',name:'联合选题审查',rank:'boss',behavior:'proposalBoard',tags:[],hp:16000,speed:60,damage:24,xp:90,radius:42,color:'#d5a455',from:8};
type Move='opening'|'line'|'chase'|'reservation'|'stagger'|'recovery'|'transition';
interface Round {
 owner:number;generation:number;tier:'boss';stage:1|2;move:Move;
 untilTick:number;line:1|2;handle?:S2Hazard;
}

/** One run-local actor, identified by slot AND generation. Attack execution
 * follows the admitted handle; only rests/chase use the fixed simulation tick. */
export class ProposalBoardSystem {
 private round:Round|null=null;
 private nav={x:0,y:0};
 constructor(private g:ContentState){}
 reset(){this.round=null;this.current();}
 private current(){
  const g=this.g,e=g.enemies,id=g.bossEnemy;
  if(id<0||!e.alive[id]||e.hp[id]<=0||g.content.enemies[e.kind[id]].id!==PROPOSAL_BOARD.id)return null;
  if(this.round?.owner!==id||this.round.generation!==e.generation[id])this.round={owner:id,generation:e.generation[id],tier:'boss',stage:1,move:'opening',untilTick:g.frame+60,line:1};
  return this.round;
 }
 snapshot(){
  const a=this.round,e=this.g.enemies;if(!a||!e.valid(a.owner,a.generation)||e.hp[a.owner]<=0||this.g.bossEnemy!==a.owner)return null;
  return{owner:a.owner,generation:a.generation,tier:a.tier,stage:a.stage,move:a.move,line:a.line,remaining:Math.max(0,a.untilTick-this.g.frame)/60,attackPhase:a.handle?.phase??null,handleId:a.handle?.id??null};
 }
 contactAllowed(id:number){const a=this.round;return !a||a.owner!==id||a.generation!==this.g.enemies.generation[id]||!['opening','transition','recovery','stagger'].includes(a.move);}
 /** Also called at the damage boundary, before old shots/hazards can resolve.
  * Lethal burst never locks HP or forces a second phase before the kill. */
 observeHealth(){
  const a=this.current();if(!a)return;
  const g=this.g,e=g.enemies,id=a.owner;
  if(a.stage!==1||e.hp[id]>e.maxHp[id]*.5)return;
  // Commit first: repeated hits, DOT, frozen actors and update() cannot re-clear.
  a.stage=2;g.bossStage=2;a.move='transition';a.untilTick=g.frame+60;
  g.cancelEnemyAttacks(id,a.generation);g.cancelEnemyProjectiles(id,a.generation);a.handle=undefined;
  e.state[id]=3;e.vx[id]=e.vy[id]=0;g.player.invincible=Math.max(g.player.invincible,1);
  g.emit({type:'boss',x:e.x[id],y:e.y[id],color:0xd5a455,size:250,text:'阶段 2 · 联合预约',duration:1});
  g.message('联合选题审查 · 阶段 2，安全过渡 1 秒',1);g.impact(6,.05);
 }
 update(dt:number){
  this.observeHealth();const a=this.current();if(!a)return;
  const g=this.g,e=g.enemies,id=a.owner;
  if(e.frozen[id]>0)return;
  if(a.handle){
   const h=a.handle;
   if(h.phase!=='cancelled'){
    e.state[id]=h.phase==='active'?2:1;
    if(a.move==='line'&&h.phase==='active'){
     // Endpoints are the scheduler's actual locked result, never a fresh aim.
     const dx=h.x2-h.x,dy=h.y2-h.y,speed=slowFactor(e,id)/h.lifeTotal;
     e.angle[id]=Math.atan2(dy,dx);g.moveEnemy(id,dx*speed*dt,dy*speed*dt);this.contact(id);
    }
    return;
   }
   a.handle=undefined;
   if(a.move==='reservation'){a.move='line';a.line=1;}
   else if(a.stage===1){a.move='chase';a.untilTick=g.frame+90;}
   else if(a.line===1){a.move='stagger';a.untilTick=g.frame+42;}
   else this.recover(a);
   return;
  }
  if(a.move==='chase'){
   if(g.frame>=a.untilTick){this.recover(a);return;}
   const direction=g.navigation.direction(e.x[id],e.y[id],this.nav),length=Math.hypot(direction.x,direction.y)||1,speed=e.speed[id]*slowFactor(e,id);
   e.state[id]=0;g.moveEnemy(id,direction.x/length*speed*dt,direction.y/length*speed*dt);this.contact(id);return;
  }
  if(g.frame<a.untilTick){e.state[id]=3;return;}
  if(a.move==='stagger'){a.move='line';a.line=2;}
  else if(['opening','transition','recovery'].includes(a.move)){a.move=a.stage===1?'line':'reservation';a.line=1;}
  const options={owner:a.owner,ownerGeneration:a.generation,cancelOnDeath:true,tier:a.tier,ordinary:false};
  if(a.move==='reservation'){
   // A reservation stays on the requested OLD player position, even if queued.
   a.handle=g.addHazard('circle',g.player.x,g.player.y,0,0,76,1.5,.35,26,undefined,options);
  }else{
   const angle=Math.atan2(g.player.y-e.y[id],g.player.x-e.x[id]);
   a.handle=g.addHazard('line',e.x[id],e.y[id],e.x[id]+Math.cos(angle)*620,e.y[id]+Math.sin(angle)*620,e.radius[id],1.2,1.2,0,undefined,{...options,trackPlayer:true});
  }
  if(a.handle){e.state[id]=1;g.message(a.move==='reservation'?'联合预约 · 离开预约落点':`联合冲线 ${a.line} · 横向避让`,3);}
  else a.untilTick=g.frame+30;
 }
 private recover(a:Round){a.move='recovery';a.untilTick=this.g.frame+120;this.g.enemies.state[a.owner]=3;this.g.message('审查停手 · 集中输出 2 秒',2);}
 private contact(id:number){const g=this.g,e=g.enemies,p=g.player;if(segmentDistanceSq(p.x,p.y,e.prevX[id],e.prevY[id],e.x[id],e.y[id])<(e.radius[id]+12)**2)g.hurtPlayer(e.damage[id],e.prevX[id],e.prevY[id],g.originForEnemy(id));}
}
