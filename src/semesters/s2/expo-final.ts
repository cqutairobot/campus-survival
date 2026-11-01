import type {ContentState} from './legacy/ContentState';
import type {ContentEnemyDef} from './legacy/catalog';
import type {S2Hazard} from './danger';

export const EXPO_FINAL:ContentEnemyDef={id:'s2:expoFinal',name:'毕业成果联展',rank:'boss',behavior:'expoFinal',tags:[],hp:110000,speed:0,damage:36,xp:200,radius:52,color:'#dbad69',from:24};
export const EXPO_FINAL_TUNING=Object.freeze({activeShellReduction:.30,terminalHp:1600,terminalBaseReduction:.10,terminalReduction:.075,terminalReductionCap:.25});
type Attack='delivery'|'reservation'|'scan';
interface Round {owner:number;generation:number;stage:1|2|3;move:'opening'|'transition'|'attack'|'recovery';until:number;cycle:number;attack:Attack;nodesAt:number;exposedUntil:number;handle?:S2Hazard;transitions:number[]}
/** Final assessment only recombines learned attacks. HP never depends on DPS;
 * a hit commits its final crossed threshold before the next simulation step. */
export class ExpoFinalSystem {
 private round:Round|null=null;
 constructor(private g:ContentState){}
 reset(){this.round=null;this.current();}
 private current(){const g=this.g,e=g.enemies,id=g.bossEnemy;if(id<0||!e.alive[id]||e.hp[id]<=0||g.content.enemies[e.kind[id]].id!==EXPO_FINAL.id)return null;if(this.round?.owner!==id||this.round.generation!==e.generation[id])this.round={owner:id,generation:e.generation[id],stage:1,move:'opening',until:g.frame+60,cycle:0,attack:'delivery',nodesAt:Infinity,exposedUntil:0,transitions:[1]};return this.round;}
 private children(a:Round,kind:string){const e=this.g.enemies;return e.active.filter(id=>e.hp[id]>0&&e.owner[id]===a.owner&&e.ownerGeneration[id]===a.generation&&this.g.content.enemies[e.kind[id]].id===kind);}
 reduction(id:number){
  const a=this.current();if(!a||a.owner!==id||a.move!=='attack')return 0;
  // A visible review shell is finite (never invulnerable). Full recovery,
  // transitions and destroyed-terminal exposure remain unmitigated windows.
  if(a.stage!==2)return EXPO_FINAL_TUNING.activeShellReduction;
  if(this.g.frame<a.exposedUntil)return 0;
  return Math.min(EXPO_FINAL_TUNING.terminalReductionCap,EXPO_FINAL_TUNING.terminalBaseReduction+this.children(a,'s2:relayNode').length*EXPO_FINAL_TUNING.terminalReduction);
 }
 contactAllowed(id:number){const a=this.round;return !a||a.owner!==id||a.generation!==this.g.enemies.generation[id]||a.move==='attack';}
 forget(id:number,generation:number){const a=this.round,e=this.g.enemies;if(a&&e.valid(id,generation)&&e.hp[id]<=0&&e.owner[id]===a.owner&&e.ownerGeneration[id]===a.generation&&this.g.content.enemies[e.kind[id]].id==='s2:relayNode'&&a.stage===2){a.exposedUntil=this.g.frame+90;a.nodesAt=Math.max(a.nodesAt,this.g.frame+480);this.g.message('联调终端已关闭 · 联展暴露 1.5 秒',1.5);}}
 observeHealth(){
  const a=this.current();if(!a)return;const g=this.g,e=g.enemies,ratio=e.hp[a.owner]/e.maxHp[a.owner],stage=ratio<=.35?3:ratio<=.7?2:1;if(stage<=a.stage)return;
  a.stage=stage;a.transitions.push(stage);g.bossStage=stage;a.move='transition';a.until=g.frame+60;a.cycle=0;a.nodesAt=stage===2?a.until:Infinity;a.exposedUntil=a.until;a.handle=undefined;
  g.cancelEnemyAttacks(a.owner,a.generation);g.cancelEnemyProjectiles(a.owner,a.generation);e.state[a.owner]=3;e.vx[a.owner]=e.vy[a.owner]=0;g.player.invincible=Math.max(g.player.invincible,1);
  g.emit({type:'boss',x:e.x[a.owner],y:e.y[a.owner],size:290,color:0xdbad69,text:stage===2?'阶段 2 · 联调安全扇区':'阶段 3 · 成果集中展示',duration:1});g.message(`毕业成果联展 · 阶段 ${stage}，安全过渡 1 秒`,1);g.impact(7,.05);
 }
 snapshot(){const a=this.current();if(!a)return null;const e=this.g.enemies;return{owner:a.owner,generation:a.generation,stage:a.stage,move:a.move,attack:a.attack,remaining:Math.max(0,a.until-this.g.frame)/60,reduction:this.reduction(a.owner),exposed:Math.max(0,a.exposedUntil-this.g.frame)/60,transitions:[...a.transitions],nodes:this.children(a,'s2:relayNode').map(id=>({id,generation:e.generation[id]})),panels:this.children(a,'s2:reviewPanel').map(id=>({id,generation:e.generation[id]})),attackPhase:a.handle?.phase??null,handleId:a.handle?.id??null};}
 update(dt:number){
  this.observeHealth();const a=this.current();if(!a)return;const g=this.g,e=g.enemies,id=a.owner;if(e.frozen[id]>0)return;
  for(const panel of this.children(a,'s2:reviewPanel'))if(e.frozen[panel]<=0)g.moveEnemy(panel,Math.cos(g.combatTime*.5+panel)*e.speed[panel]*dt,Math.sin(g.combatTime*.5+panel)*e.speed[panel]*dt);
  if(g.frame<a.until){e.state[id]=3;return;}
  if(a.stage===2&&g.frame>=a.nodesAt){a.nodesAt=g.frame+600;for(let n=this.children(a,'s2:relayNode').length;n<2;n++){const node=g.spawnSummon('s2:relayNode',id,e.x[id]+(n?110:-110),e.y[id]-65,12,true);if(node>=0)e.hp[node]=e.maxHp[node]=EXPO_FINAL_TUNING.terminalHp;}}
  if(a.handle){if(a.handle.phase!=='cancelled'){e.state[id]=a.handle.phase==='active'?2:1;return;}a.handle=undefined;a.move='recovery';a.until=g.frame+(a.stage===3?180:120);e.state[id]=3;g.message(`联展停手 · 集中输出 ${a.stage===3?3:2} 秒`,a.stage===3?3:2);return;}
  if(a.move!=='attack'){a.move='attack';a.attack=a.stage===3?(['delivery','reservation','scan'] as const)[a.cycle%3]:a.stage===2?'scan':a.cycle%2?'scan':'delivery';a.cycle++;}
  this.cast(a);
 }
 private cast(a:Round){
  const g=this.g,e=g.enemies,p=g.player,id=a.owner;let owner=id;
  if(a.attack==='scan'){for(const old of this.children(a,'s2:reviewPanel'))g.releaseEnemy(old);const panel=g.spawnSummon('s2:reviewPanel',id,e.x[id]+(a.cycle%2?140:-140),e.y[id]+80,8,true);if(panel>=0)owner=panel;}
  const extra={owner,ownerGeneration:e.generation[owner],cancelOnDeath:true,tier:'boss' as const,ordinary:false},direction=a.cycle%2?1:-1,angle=Math.atan2(p.y-e.y[owner],p.x-e.x[owner]);
  if(a.attack==='reservation')a.handle=g.addHazard('circle',p.x,p.y,0,0,82,1.5,.35,34,undefined,extra);
  else{const x=e.x[owner],y=e.y[owner],aim=angle-(a.attack==='scan'?direction*.38:0);a.handle=g.addHazard('line',x,y,x+Math.cos(aim)*680,y+Math.sin(aim)*680,a.attack==='scan'?24:28,1.5,.85,34,undefined,{...extra,...(a.attack==='scan'?{angularSpeed:direction*.85}:{})});}
  if(a.handle){e.state[id]=1;g.emit({type:'warning',x:a.handle.x,y:a.handle.y,x2:a.handle.x2,y2:a.handle.y2,size:70,color:0xe59a66,text:{delivery:'配送线路 · 横向让路',reservation:'预约落点 · 离开旧位置',scan:'移动评审屏 · 安全扇区'}[a.attack],duration:1.5,priority:true});}else a.until=g.frame+30;
 }
}
