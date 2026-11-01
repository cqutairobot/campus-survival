import {EVENT_DEFS} from '../../world/events';
import {distanceSq} from '../../core/math';
import type {ContentState} from './legacy/ContentState';
import type {S2Hazard} from './danger';

export const S2_EVENT_DEFS=[
 {id:'s2:deliveryDay',name:'校园配送日',duration:24,description:'错峰通过三条配送线；安全完成获得10点短护盾',from:2},
 {id:'s2:networkMaintenance',name:'校园网维护',duration:28,description:'击破两个联调终端；完成后获得磁铁，任意攻击均有效',from:10},
 {id:'s2:jointExhibit',name:'联合展评',duration:24,description:'依次访问两个展点；完成后获得一次普通强化',from:18},
 {id:'s2:openLab',name:'开放实验日',duration:20,description:'范围+15%，支援权重提高；正常结束回复25 HP',from:3},
] as const;
export const SEMESTER_EVENTS=[...EVENT_DEFS.map(d=>({...d,from:3})),...S2_EVENT_DEFS];
export type SemesterEventId=typeof SEMESTER_EVENTS[number]['id'];
interface Identity {id:number;generation:number}
interface CampusEvent {
 kind:SemesterEventId;generation:number;warning:number;remaining:number;x:number;y:number;x2:number;y2:number;cooldown:number;
 started:number;hurtCount:number;lines:S2Hazard[];terminals:Identity[];closed:number;visits:number;advisor:boolean;
}
const LESSONS=['s2:deliveryDay','s2:networkMaintenance','s2:jointExhibit'] as const;

/** One run-local event. All delayed attacks carry this event's generation;
 * cancellation is distinct from completion and cannot grant an end reward. */
export class SemesterEvents {
 active:CampusEvent|null=null;private serial=0;private next=110;private nextBlackout=90;private last='';private taught=new Set<number>();private rotation:SemesterEventId[]=[];
 constructor(private g:ContentState){}
 get kind(){return this.active&&this.active.warning<=0?this.active.kind:null;}
 sourceAlive(id:string,generation:number){return this.active?.kind===id&&this.active.generation===generation;}
 start(kind:SemesterEventId){
  const g=this.g,def=SEMESTER_EVENTS.find(d=>d.id===kind);if(!def||this.active||g.bossActive||g.revision.active||g.phase!=='playing')return false;
  const a=g.safePoint(g.player.x+120,g.player.y+80),b=g.safePoint(g.player.x+300,g.player.y-80);
  this.active={kind,generation:++this.serial,warning:3,remaining:def.duration,...a,x2:b.x,y2:b.y,cooldown:0,started:g.frame+180,hurtCount:g.metrics.hurtCount,lines:[],terminals:[],closed:0,visits:0,advisor:false};this.last=kind;
  if(!g.progress.events.includes(kind))g.progress.events.push(kind);g.discover(`event:${kind}`);g.message(`3 秒后 · ${def.name} · ${def.description}`,6);return true;
 }
 terminalKilled(id:number,generation:number){const a=this.active;if(a?.kind==='s2:networkMaintenance'&&a.terminals.some(t=>t.id===id&&t.generation===generation))a.closed++;}
 private hazard(a:CampusEvent,kind:'circle'|'line',x:number,y:number,x2:number,y2:number,radius:number,damage:number){return this.g.addHazard(kind,x,y,x2,y2,radius,1.2,.4,damage,undefined,{sourceId:a.kind,sourceGeneration:a.generation,cancelOnDeath:true,ordinary:false,tier:'elite'});}
 update(dt:number){
  const g=this.g,p=g.player;if(g.bossActive||g.revision.active){this.cancel();return;}
  const a=this.active;
  if(!a){
   const chapter=Math.min(3,Math.ceil(g.week/8)),lessonWeek=[2,10,18][chapter-1];
   // New-mechanism introductions retain their first 12s of isolation.
   if(!g.ordinarySpawnsAllowed||g.phase!=='playing'||g.semesterTime-(g.week-1)*40<14)return;
   if(g.week>=lessonWeek&&!this.taught.has(chapter)){if(this.start(LESSONS[chapter-1]))this.taught.add(chapter);return;}
   if(g.manifest.dailyRule==='nightRun'&&g.semesterTime>=this.nextBlackout){if(this.start('blackout'))this.nextBlackout=(Math.floor(g.semesterTime/90)+1)*90;return;}
   if(g.week>=3&&g.semesterTime>=this.next){this.next=g.semesterTime+g.streams.event.range(85,105);if(!this.rotation.length)this.rotation=SEMESTER_EVENTS.filter(d=>d.from<=g.week&&!(g.manifest.dailyRule==='nightRun'&&d.id==='blackout')).map(d=>d.id).sort((x,y)=>x<y?-1:x>y?1:0);const eligible=this.rotation.filter(id=>id!==this.last);if(eligible.length){const id=eligible[g.streams.event.int(0,eligible.length-1)];this.rotation.splice(this.rotation.indexOf(id),1);this.start(id);}}return;
  }
  if(a.warning>0){a.warning=Math.max(0,(a.started-g.frame)/60);if(a.warning>0)return;
   a.hurtCount=g.metrics.hurtCount;
   if(a.kind==='s2:networkMaintenance')for(const point of [{x:a.x,y:a.y},{x:a.x2,y:a.y2}]){const id=g.spawnEnemy('s2:relayNode',point.x,point.y,0,undefined,true);if(id>=0){g.enemies.hp[id]=g.enemies.maxHp[id]=180;g.enemies.xp[id]=g.enemies.rewardWeight[id]=0;a.terminals.push({id,generation:g.enemies.generation[id]});}}
  }
  a.remaining=Math.max(0,SEMESTER_EVENTS.find(d=>d.id===a.kind)!.duration-(g.frame-a.started)/60);a.cooldown-=dt;
  if(a.kind==='advisor'&&!a.advisor){const id=g.spawnEnemy('advisor');if(id>=0)a.advisor=true;}
  if(a.kind==='s2:deliveryDay'&&a.lines.length<3&&(g.frame-a.started)/60>=a.lines.length*8){const offset=(a.lines.length-1)*90,h=this.hazard(a,'line',p.x-280,p.y+offset,p.x+280,p.y+offset,24,14);if(h)a.lines.push(h);}
  if(a.kind==='s2:jointExhibit'){
   const point=a.visits===0?{x:a.x,y:a.y}:{x:a.x2,y:a.y2};
   if(a.visits<2&&distanceSq(p.x,p.y,point.x,point.y)<52**2){a.visits++;g.message(`联合展评 · 展点 ${a.visits}/2`,2);}
   if(a.cooldown<=0&&a.visits<2){this.hazard(a,'circle',p.x,p.y,0,0,55,12);a.cooldown=6;}
  }
  if(a.kind==='portal'&&a.cooldown<=0){const one=distanceSq(p.x,p.y,a.x,a.y),two=distanceSq(p.x,p.y,a.x2,a.y2);if(one<38**2||two<38**2){const to=one<two?{x:a.x2,y:a.y2}:{x:a.x,y:a.y};p.x=p.prevX=to.x;p.y=p.prevY=to.y;p.invincible=Math.max(p.invincible,1.2);a.cooldown=2;}}
  if(a.remaining>0)return;
  const success=a.kind==='s2:deliveryDay'?a.lines.length===3&&a.lines.every(h=>h.startedTick>=0&&h.lifeTicks<Math.ceil(h.lifeTotal*60)&&h.phase==='cancelled')&&g.metrics.hurtCount===a.hurtCount:a.kind==='s2:networkMaintenance'?a.terminals.length===2&&a.closed===2:a.kind==='s2:jointExhibit'?a.visits===2:true;
  this.cancel();if(!success){g.message('事件结束 · 目标未完成，未发放结束奖励');return;}
  g.completedSideBranches.add(a.kind);
  if(a.kind==='s2:deliveryDay')g.addShield(10,8);
  if(a.kind==='examRage'||a.kind==='s2:networkMaintenance')g.spawnDrop('magnet',p.x+45,p.y,1);
  if(a.kind==='sports')g.addShield(30,10);
  if(a.kind==='rainstorm'||a.kind==='s2:openLab')g.spawnDrop('heal',p.x+45,p.y,25);
  if(a.kind==='s2:jointExhibit')g.rewards.openReinforcement(1);
  g.message(`${SEMESTER_EVENTS.find(d=>d.id===a.kind)!.name} · 已完成`,3);
 }
 cancel(){const a=this.active;if(!a)return;this.active=null;this.g.danger.cancelSource(a.kind,a.generation);for(const t of a.terminals)if(this.g.enemies.valid(t.id,t.generation))this.g.releaseEnemy(t.id);}
 snapshot(){const a=this.active;return a?{kind:a.kind,name:SEMESTER_EVENTS.find(d=>d.id===a.kind)!.name,warning:a.warning,remaining:a.remaining,x:a.x,y:a.y,x2:a.x2,y2:a.y2,visits:a.visits,closed:a.closed,generation:a.generation}:null;}
}
