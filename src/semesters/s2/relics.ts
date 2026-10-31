import {RELICS} from '../../data/relics';
import {relicStats,clampStats} from '../../progression/relics';
import {clamp,distanceSq} from '../../core/math';
import {FIRST_THREAT_WEEKS} from './first-chapter';
import {ADVANCED_WEEKS} from './advanced-enemies';
import {pressureAt} from './pressure';
import {RANK_CODE} from '../../data/enemies';
import type {PlayerStats} from '../../types';
import type {ContentState} from './legacy/ContentState';
import type {S2Hazard} from './danger';
export interface ContentRelicDef {id:string;name:string;curse:string;icon:string;benefit:string;cost:string}
export const PROJECT_RELICS:readonly ContentRelicDef[]=[
 {id:'s2:routePermit',name:'外场通行证',curse:'配送加试',icon:'speed',benefit:'移动时武器伤害 +12%',cost:'每80战斗秒追加一组配送冲线，提前3秒播报；Boss期间顺延，不积压爆发'},
 {id:'s2:bufferBadge',name:'应急缓冲章',curse:'轻装',icon:'shield',benefit:'每60战斗秒获得18点护盾，持续10秒',cost:'最大生命 −10%，当前HP同比调整'},
 {id:'s2:reviewSeal',name:'评审通行章',curse:'评审落点',icon:'star',benefit:'对任意有标记目标伤害 +10%；所有武器可施加3秒短标记',cost:'被标记精英死亡留下1.2秒预警落点；危险排程满则延后'},
 {id:'s2:projectGrant',name:'项目资助函',curse:'追加验收',icon:'cap',benefit:'经验 +12%，下一场必打Boss箱额外普通强化一份（本局一次）',cost:'下两个非Boss周各追加一只预告精英；受精英上限约束，不补账'},
];
export const S2_RELICS:readonly ContentRelicDef[]=[...RELICS,...PROJECT_RELICS];
/** Old six retain their exact values. New modifiers and hard caps live in S2. */
export function s2RelicStats(base:PlayerStats,ids:readonly string[]){const s=relicStats(base,[...ids]);if(ids.includes('s2:bufferBadge'))s.maxHp*=.9;if(ids.includes('s2:projectGrant'))s.xp+=.12;return clampStats(s);}
export const markedDamageBonus=(protocol:number,review:number)=>clamp(protocol+review,0,.15);
const BOSS_WEEKS=[8,16,24];
interface Mark {generation:number;expires:number}
interface ReviewPoint {x:number;y:number}
export class ProjectRelics {
 integral=0;amended=false;
 private seen=new Set<string>();private marks=new Map<number,Mark>();private lastRouteBucket=0;private lastBufferBucket=0;
 private routeRemaining=0;private routeAt=0;private route?:S2Hazard;private review?:S2Hazard;private reviews:ReviewPoint[]=[];private reviewAt=0;
 private buffer={amount:0,expires:0};private grantClaimed=false;private grantBossUsed=false;private grantBoss=-1;private grantWeeks:number[]=[];private grantHandled=new Set<number>();private elite?:S2Hazard;private eliteWeek=-1;
 constructor(private g:ContentState){}
 get average(){return this.g.combatTime>0?clamp(this.integral/this.g.combatTime,0,3):0;}
 private has(id:string){return this.g.relics.includes(id);}
 private record(id:string){
  if(!this.seen.has(id)){this.seen.add(id);if(id==='s2:projectGrant'&&!this.grantClaimed){this.grantClaimed=true;this.grantBoss=this.g.bosses;this.grantBossUsed=false;for(let w=this.g.week+1;w<=24&&this.grantWeeks.length<2;w++)if(!BOSS_WEEKS.includes(w))this.grantWeeks.push(w);}}
  if(!this.g.progress.relics.includes(id))this.g.progress.relics.push(id);this.g.discover(`relic:${id}`);
 }
 acquire(id:string){const g=this.g;if(g.relics.length>=3||this.has(id)||!g.content.relics.some(r=>r.id===id))return false;const previous=g.stats.maxHp,already=this.seen.has(id);g.relics.push(id);this.record(id);g.recalculateStats(already||id==='redNotebook'||id==='s2:bufferBadge'?'ratio':'increase',previous);return true;}
 replace(oldId:string,newId:string){
  const g=this.g,index=g.relics.indexOf(oldId);if(this.amended||index<0||this.has(newId)||!g.content.relics.some(r=>r.id===newId))return false;
  const previous=g.stats.maxHp;this.removeEffects(oldId);g.relics[index]=newId;this.amended=true;this.record(newId);g.recalculateStats('ratio',previous);return true;
 }
 private cancel(h?:S2Hazard){if(h){h.phase='cancelled';h.token=0;for(const list of [this.g.hazards,this.g.danger.pending]){const n=list.indexOf(h);if(n>=0)list.splice(n,1);}}}
 private removeEffects(id:string){if(id==='s2:bufferBadge')this.expireBuffer();if(id==='s2:routePermit'){this.cancel(this.route);this.route=undefined;this.routeRemaining=0;}if(id==='s2:reviewSeal'){this.cancel(this.review);this.review=undefined;this.reviews.length=0;this.marks.clear();}if(id==='s2:projectGrant'){this.cancel(this.elite);this.elite=undefined;}}
 private expireBuffer(){const p=this.g.player;p.shield=Math.max(0,p.shield-Math.min(p.shield,this.buffer.amount));this.buffer={amount:0,expires:0};}
 shieldUsed(amount:number){this.buffer.amount=Math.max(0,this.buffer.amount-amount);}
 private marked(id:number){const e=this.g.enemies,m=this.marks.get(id);return !!(m&&e.valid(id,m.generation)&&m.expires>this.g.combatTime)||this.g.protocol.has(id)||this.g.weaponSystem.printer.marks.some(m=>distanceSq(m.x,m.y,e.x[id],e.y[id])<=(m.radius+e.radius[id])**2);}
 /** Marks are applied once by primary weapon hits; settled echo is never amplified again. */
 weaponBonus(id:number,secondary:boolean){if(!this.has('s2:reviewSeal'))return 0;const marked=this.marked(id),g=this.g;if(this.has('s2:reviewSeal')&&!secondary)this.marks.set(id,{generation:g.enemies.generation[id],expires:g.combatTime+3});return this.has('s2:reviewSeal')&&marked?.1:0;}
 movingMultiplier(){const p=this.g.player;return this.has('s2:routePermit')&&Math.hypot(p.x-p.prevX,p.y-p.prevY)>5/60?1.12:1;}
 death(id:number){const e=this.g.enemies;if(e.owner[id]<0&&e.rank[id]===RANK_CODE.elite&&this.has('s2:reviewSeal')&&this.marked(id))this.reviews.push({x:e.x[id],y:e.y[id]});this.marks.delete(id);}
 forget(id:number){this.marks.delete(id);}
 bossReward(){if(!this.grantClaimed||this.grantBossUsed||this.g.bossNumber!==this.grantBoss)return 0;this.grantBossUsed=true;return this.has('s2:projectGrant')?1:0;}
 /** Boss admission cancels current broadcasts; at most one delivery group is
  * owed afterwards, and elite opportunities expire with their authored week. */
 suspend(){if(this.route&&(this.route.phase==='active'||this.route.startedTick>=0&&this.route.warningTicks===0))this.routeRemaining=Math.max(0,this.routeRemaining-1);if(this.review&&(this.review.phase==='active'||this.review.startedTick>=0&&this.review.warningTicks===0))this.reviews.shift();if(this.route&&this.route.phase!=='cancelled')this.cancel(this.route);this.route=undefined;this.cancel(this.review);this.review=undefined;this.cancel(this.elite);this.elite=undefined;}
 update(dt:number){
  const g=this.g,p=g.player;this.integral+=g.relics.length*dt;
  if(this.buffer.expires&&g.combatTime>=this.buffer.expires)this.expireBuffer();this.buffer.amount=Math.min(this.buffer.amount,p.shield);
  const routeBucket=Math.floor((g.combatTime+1e-8)/80),bufferBucket=Math.floor((g.combatTime+1e-8)/60);
  if(routeBucket>this.lastRouteBucket){this.lastRouteBucket=routeBucket;if(this.has('s2:routePermit'))this.routeRemaining=Math.max(this.routeRemaining,2);}
  if(bufferBucket>this.lastBufferBucket){this.lastBufferBucket=bufferBucket;if(this.has('s2:bufferBadge')){this.expireBuffer();const before=p.shield;g.addShield(18,Math.max(p.shieldTime,10));this.buffer={amount:p.shield-before,expires:g.combatTime+10};}}
  const within=g.semesterTime-(g.week-1)*40,lesson=Object.entries({...FIRST_THREAT_WEEKS,...ADVANCED_WEEKS}).some(([id,week])=>g.week===week&&g.content.enemyById[id]);
  if(g.bossActive||lesson&&within<12)return;
  if(this.has('s2:routePermit'))this.deliver();
  if(this.has('s2:reviewSeal'))this.reviewDrop();
  if(this.has('s2:projectGrant')&&g.ordinarySpawnsAllowed)this.grantElite();
 }
 private deliver(){const g=this.g;if(this.route){if(this.route.phase!=='cancelled')return;this.route=undefined;this.routeRemaining=Math.max(0,this.routeRemaining-1);this.routeAt=g.frame+30;}if(!this.routeRemaining||g.frame<this.routeAt)return;const p=g.player,a=this.lastRouteBucket%2?0:Math.PI/2,dx=Math.cos(a)*360,dy=Math.sin(a)*360;this.route=g.addHazard('line',p.x-dx,p.y-dy,p.x+dx,p.y+dy,22,3,.75,24,undefined,{tier:'elite',ordinary:false});if(this.route)g.message('外场通行证风险 · 配送冲线将在3秒后通过',3);else this.routeAt=g.frame+30;}
 private reviewDrop(){const g=this.g;if(this.review){if(this.review.phase!=='cancelled')return;this.review=undefined;this.reviews.shift();this.reviewAt=g.frame+30;}if(!this.reviews.length||g.frame<this.reviewAt)return;const p=this.reviews[0];this.review=g.addHazard('circle',p.x,p.y,0,0,64,1.2,.35,24,undefined,{tier:'elite',ordinary:false});if(!this.review)this.reviewAt=g.frame+30;}
 private grantElite(){
  const g=this.g,w=g.week,within=g.semesterTime-(w-1)*40;if(this.elite&&this.eliteWeek!==w){this.cancel(this.elite);this.elite=undefined;}
  if(this.elite){if(this.elite.phase==='active'){const h=this.elite;this.cancel(h);this.elite=undefined;const id=g.spawnEnemy('ddl',h.x,h.y,0,w);if(id<0)this.grantHandled.delete(w);}else if(this.elite.phase==='cancelled')this.elite=undefined;return;}
  if(!this.grantWeeks.includes(w)||this.grantHandled.has(w)||within<4||within>36)return;
  // SpawnEnemy enforces the same final cap as the director; this warning also
  // spends a major danger token and cannot become an unannounced refill.
  if(g.enemies.active.filter(id=>g.enemies.hp[id]>0&&g.enemies.rank[id]===RANK_CODE.elite).length>=pressureAt(w).eliteCap)return;
  const point=g.safePoint(g.player.x+360,g.player.y+120),h=g.addHazard('circle',point.x,point.y,0,0,28,3,1/60,0,undefined,{tier:'elite',ordinary:false});if(h){this.elite=h;this.eliteWeek=w;this.grantHandled.add(w);g.message('项目资助函风险 · 追加精英预告3秒',3);}
 }
 snapshot(){const e=this.g.enemies;return{integral:this.integral,average:this.average,amended:this.amended,seen:[...this.seen],marks:[...this.marks].filter(([id,m])=>e.valid(id,m.generation)&&e.hp[id]>0&&m.expires>this.g.combatTime).map(([id,m])=>({id,...m})),routeRemaining:this.routeRemaining,routeHandle:this.route?.id??null,reviewPending:this.reviews.length,grant:{claimed:this.grantClaimed,bossUsed:this.grantBossUsed,boss:this.grantBoss,weeks:[...this.grantWeeks],handled:[...this.grantHandled],eliteHandle:this.elite?.id??null},buffer:{...this.buffer},clocks:{routeBucket:this.lastRouteBucket,bufferBucket:this.lastBufferBucket}};}
 clear(){this.suspend();this.marks.clear();this.reviews.length=0;this.routeRemaining=0;}
}
