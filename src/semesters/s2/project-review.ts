import type {ContentState} from './legacy/ContentState';
import type {ContentEnemyDef} from './legacy/catalog';
import type {S2Hazard} from './danger';

export const PROJECT_REVIEW:ContentEnemyDef={id:'s2:projectReview',name:'项目中期验收',rank:'boss',behavior:'projectReview',tags:[],hp:46000,speed:0,damage:30,xp:140,radius:46,color:'#ba8758',from:16};
export const REVIEW_ATTACHMENTS:readonly ContentEnemyDef[]=[
 {id:'s2:relayNode',name:'联调终端',rank:'bossAdd',behavior:'relayNode',tags:[],hp:800,speed:0,damage:0,xp:0,radius:22,color:'#c7ae65',from:16},
 {id:'s2:reviewPanel',name:'移动评审屏',rank:'bossAdd',behavior:'reviewPanel',tags:[],hp:520,speed:24,damage:0,xp:0,radius:25,color:'#d48f79',from:16},
];
interface Identity {id:number;generation:number}
interface Round {owner:number;generation:number;stage:1|2|3;move:'opening'|'transition'|'scan'|'stagger'|'recovery';until:number;line:number;cycle:number;nodesAt:number;exposedUntil:number;handle?:S2Hazard;panel?:Identity;transitions:number[]}
/** Required checkpoint 2. Timers use the fixed combat clock, and scans execute
 * only via admitted danger handles with a live source identity. */
export class ProjectReviewSystem {
 private round:Round|null=null;
 constructor(private g:ContentState){}
 reset(){this.round=null;this.current();}
 private current(){const g=this.g,e=g.enemies,id=g.bossEnemy;if(id<0||!e.alive[id]||e.hp[id]<=0||g.content.enemies[e.kind[id]].id!==PROJECT_REVIEW.id)return null;if(this.round?.owner!==id||this.round.generation!==e.generation[id])this.round={owner:id,generation:e.generation[id],stage:1,move:'opening',until:g.frame+60,line:0,cycle:0,nodesAt:Infinity,exposedUntil:0,transitions:[1]};return this.round;}
 private children(a:Round,kind:string){const e=this.g.enemies;return e.active.filter(id=>e.hp[id]>0&&e.owner[id]===a.owner&&e.ownerGeneration[id]===a.generation&&this.g.content.enemies[e.kind[id]].id===kind);}
 reduction(id:number){const a=this.current();if(!a||a.owner!==id||a.stage!==2||this.g.frame<a.exposedUntil)return 0;return Math.min(.25,this.children(a,'s2:relayNode').length*.125);}
 contactAllowed(id:number){const a=this.round;return !a||a.owner!==id||a.generation!==this.g.enemies.generation[id]||!['opening','transition','recovery','stagger'].includes(a.move);}
 forget(id:number,generation:number){const a=this.round,e=this.g.enemies;if(!a||!e.valid(id,generation))return;if(e.hp[id]<=0&&e.owner[id]===a.owner&&e.ownerGeneration[id]===a.generation&&this.g.content.enemies[e.kind[id]].id==='s2:relayNode'&&a.stage===2){a.exposedUntil=this.g.frame+90;a.nodesAt=Math.max(a.nodesAt,this.g.frame+480);this.g.message('联调终端已关闭 · 验收暴露 1.5 秒',1.5);}}
 observeHealth(){
  const a=this.current();if(!a)return;const g=this.g,e=g.enemies,ratio=e.hp[a.owner]/e.maxHp[a.owner],stage=ratio<=.3?3:ratio<=.65?2:1;if(stage<=a.stage)return;
  // Commit the final crossed threshold once; lethal bursts are never HP locked.
  a.stage=stage;a.transitions.push(stage);g.bossStage=stage;a.move='transition';a.until=g.frame+60;a.line=0;a.nodesAt=stage===2?a.until:Infinity;a.exposedUntil=a.until;a.handle=undefined;a.panel=undefined;
  g.cancelEnemyAttacks(a.owner,a.generation);g.cancelEnemyProjectiles(a.owner,a.generation);e.state[a.owner]=3;e.vx[a.owner]=e.vy[a.owner]=0;g.player.invincible=Math.max(g.player.invincible,1);
  g.emit({type:'boss',x:e.x[a.owner],y:e.y[a.owner],size:270,color:0xba8758,text:stage===2?'阶段 2 · 双终端联调':'阶段 3 · 交替扫描',duration:1});g.message(`项目中期验收 · 阶段 ${stage}，安全过渡 1 秒`,1);g.impact(6,.05);
 }
 snapshot(){const a=this.current();if(!a)return null;const e=this.g.enemies;return{owner:a.owner,generation:a.generation,stage:a.stage,move:a.move,line:a.line,remaining:Math.max(0,a.until-this.g.frame)/60,reduction:this.reduction(a.owner),exposed:Math.max(0,a.exposedUntil-this.g.frame)/60,transitions:[...a.transitions],nodes:this.children(a,'s2:relayNode').map(id=>({id,generation:e.generation[id],life:e.lifetime[id]})),panels:this.children(a,'s2:reviewPanel').map(id=>({id,generation:e.generation[id],life:e.lifetime[id]})),attackPhase:a.handle?.phase??null,handleId:a.handle?.id??null};}
 update(dt:number){
  this.observeHealth();const a=this.current();if(!a)return;const g=this.g,e=g.enemies,id=a.owner;if(e.frozen[id]>0)return;
  for(const panel of this.children(a,'s2:reviewPanel'))if(e.frozen[panel]<=0)g.moveEnemy(panel,Math.cos(g.combatTime*.5+panel)*e.speed[panel]*dt,Math.sin(g.combatTime*.5+panel)*e.speed[panel]*dt);
  if(g.frame<a.until){e.state[id]=3;return;}
  if(a.stage===2&&g.frame>=a.nodesAt){a.nodesAt=g.frame+600;for(let n=this.children(a,'s2:relayNode').length;n<2;n++)g.spawnSummon('s2:relayNode',id,e.x[id]+(n?105:-105),e.y[id]-55,12,true);}
  if(a.handle){
   if(a.handle.phase!=='cancelled'){e.state[id]=a.handle.phase==='active'?2:1;return;}
   a.handle=undefined;
   if(a.stage===3&&a.line===1){a.move='stagger';a.until=g.frame+36;return;}
   this.recover(a);return;
  }
  if(a.move==='stagger'){a.move='scan';a.line=2;}
  else if(['opening','transition','recovery'].includes(a.move)){a.move='scan';a.line=1;a.cycle++;}
  this.scan(a);
 }
 private scan(a:Round){
  const g=this.g,e=g.enemies,id=a.owner,p=g.player;let owner=id;
  // Screens announce and OWN their pending path; destroying one cancels it.
  if(a.stage>=2&&a.line===1){for(const old of this.children(a,'s2:reviewPanel'))g.releaseEnemy(old);const panel=g.spawnSummon('s2:reviewPanel',id,e.x[id]+(a.cycle%2?140:-140),e.y[id]+80,8,true);if(panel>=0){a.panel={id:panel,generation:e.generation[panel]};owner=panel;}}
  const direction=(a.cycle+a.line)%2?1:-1,angle=Math.atan2(p.y-e.y[owner],p.x-e.x[owner])-direction*.38,x=e.x[owner],y=e.y[owner];
  a.handle=g.addHazard('line',x,y,x+Math.cos(angle)*580,y+Math.sin(angle)*580,24,1.5,.8,28,undefined,{owner,ownerGeneration:e.generation[owner],cancelOnDeath:true,tier:'boss',ordinary:false,angularSpeed:direction*.85});
  if(a.handle){e.state[id]=1;g.emit({type:'warning',x,y,x2:a.handle.x2,y2:a.handle.y2,size:70,color:0xe59a66,text:owner===id?'扫描扇区 · 向侧方移动':'评审屏 · 下一条扫描路径',duration:1.5,priority:true});}
  else a.until=g.frame+30;
 }
 private recover(a:Round){a.move='recovery';a.until=this.g.frame+150;this.g.enemies.state[a.owner]=3;this.g.message('验收停手 · 集中输出 2.5 秒',2.5);}
}
