import {FixedLoop} from '../../core/loop';
import {randomStreams} from '../../core/run';
import {immutableSnapshot,freezeSnapshot,type S2RunSnapshot} from '../types';
import {RuntimeInheritance} from './inheritance';
import type {Assessment,Immutable,PauseReason,RuntimeClock,RuntimeOutcome,RuntimePhase,RuntimeServices,SemesterRules,SemesterRunView,SemesterRuntimeConfig,SemesterView} from './contracts';

/** Independent S2 orchestration. It never constructs GameEngine, imports S1
 * combat rules, accesses saves, or owns a renderer/RAF. The host supplies elapsed
 * frame time; all content simulation runs through the frozen 1/60 FixedLoop. */
export class SemesterEngine<State,Content> {
 readonly snapshot:Immutable<S2RunSnapshot>;
 readonly config:Immutable<SemesterRuntimeConfig>;
 private readonly loop=new FixedLoop();
 private readonly services:RuntimeServices;
 private readonly state:State;
 private readonly inheritance:RuntimeInheritance;
 private combatTicks=0;
 private teachingTicks=0;
 private assessmentTicks=0;
 private assessmentsPassed=0;
 private phase:RuntimePhase='teaching';
 private assessment:Assessment|null=null;
 private gate:SemesterRunView<Content>['gate']=null;
 private suspension:SemesterRunView<Content>['pause']=null;
 private result:RuntimeOutcome|null=null;
 private serial=0;
 private disposed=false;
 private publishedView:Immutable<SemesterRunView<Content>>|undefined;
 private readonly weekTicks:number;
 private readonly dailyTicks:number;

 constructor(options:{snapshot:S2RunSnapshot;config:SemesterRuntimeConfig;rules:SemesterRules<State,Content>;view:SemesterView<Content>}){
  this.snapshot=immutableSnapshot(options.snapshot);this.config=immutableSnapshot(options.config);
  const s=this.snapshot,c=this.config,calendar=c.calendar;
  if(s.semesterId!=='s2'||c.id!=='s2'||!s.eligible||s.contentVersion!==c.contentVersion||s.worldVersion!==c.worldVersion||s.rulesVersion!==(s.mode==='daily'?c.dailyRulesVersion:c.rulesVersion))throw Error('Unsupported semester snapshot or rules version');
  this.weekTicks=calendar.weekSeconds/this.loop.step;this.dailyTicks=calendar.dailyLimitSeconds/this.loop.step;
  if(!Number.isSafeInteger(calendar.weeks)||calendar.weeks<1||!Number.isSafeInteger(this.weekTicks)||this.weekTicks<1||!Number.isSafeInteger(this.dailyTicks)||this.dailyTicks<1||!calendar.bossWeeks.length||calendar.bossWeeks.at(-1)!==calendar.weeks||calendar.bossWeeks.some((w,n)=>!Number.isInteger(w)||w<1||w>calendar.weeks||n>0&&w<=calendar.bossWeeks[n-1]))throw Error('Invalid semester calendar');
  this.rules=options.rules;this.view=options.view;
  this.services=Object.freeze({snapshot:this.snapshot,streams:randomStreams(s.seed)});
  this.inheritance=new RuntimeInheritance(s.inheritance);
  this.state=this.rules.create(this.services);
  this.publish();
 }
 private readonly rules:SemesterRules<State,Content>;
 private readonly view:SemesterView<Content>;

 get droppedSeconds(){return this.loop.droppedSeconds;}
 private get running(){return !this.disposed&&!this.suspension&&(this.phase==='teaching'||this.phase==='assessment');}
 private clock():RuntimeClock{
  return {tick:this.combatTicks,combatSeconds:this.combatTicks*this.loop.step,teachingSeconds:this.teachingTicks*this.loop.step,assessmentSeconds:this.assessmentTicks*this.loop.step,week:Math.min(this.config.calendar.weeks,Math.floor(Math.max(0,this.teachingTicks-1)/this.weekTicks)+1),completedWeeks:Math.floor(this.teachingTicks/this.weekTicks)};
 }
 read():Immutable<SemesterRunView<Content>>{
  const projected=this.rules.project(this.state),content=this.rules.ownedProjection?freezeSnapshot(projected):immutableSnapshot(projected);
  return freezeSnapshot({semesterId:'s2' as const,phase:this.phase,clock:this.clock(),calendar:this.config.calendar,assessment:this.assessment?{...this.assessment}:null,assessmentsPassed:this.assessmentsPassed,gate:this.gate?{...this.gate}:null,pause:this.suspension?{...this.suspension}:null,inheritance:this.inheritance.view(this.combatTicks*this.loop.step),result:this.result?{...this.result}:null,content}) as Immutable<SemesterRunView<Content>>;
 }
 enableVisualEvents(){this.rules.enableVisualEvents?.(this.state);}
 acknowledgeVisualEvents(serial:number){return this.rules.acknowledgeVisualEvents?.(this.state,serial)??false;}
 private publish(interpolation=0,reuse=false){if(!this.disposed){const view=reuse&&this.publishedView?this.publishedView:this.read();this.publishedView=view;this.view.publish(view,interpolation);}}
 advance(deltaSeconds:number){
  if(this.disposed)return 0;
  if(!Number.isFinite(deltaSeconds)||deltaSeconds<0)throw Error('Frame delta must be finite and nonnegative');
  if(!this.running){this.loop.reset();return 0;}
  let stepped=false;const alpha=this.loop.advance(deltaSeconds,()=>{stepped=true;this.step();return this.running;});
  if(!this.running)this.loop.reset();
  this.publish(this.running?alpha:0,!stepped);return this.running?alpha:0;
 }
 private step(){
  if(!this.running)return;
  this.combatTicks++;
  if(this.phase==='teaching'){if(!this.rules.teachingPaused?.(this.state))this.teachingTicks++;}else this.assessmentTicks++;
  const clock=immutableSnapshot(this.clock()),nextWeek=this.config.calendar.bossWeeks[this.assessmentsPassed];
  const outcome=this.rules.step(this.state,{
   ...this.services,dt:this.loop.step,clock,phase:this.phase as 'teaching'|'assessment',assessment:this.assessment?immutableSnapshot(this.assessment):null,
   ordinarySpawnsAllowed:this.phase==='teaching'&&this.teachingTicks<nextWeek*this.weekTicks,
   damageAfterInheritance:amount=>this.inheritance.absorb(amount,clock.combatSeconds),
   experienceAfterInheritance:amount=>this.inheritance.experience(amount,clock.combatSeconds),
  });
  // Defeat wins ties, including a killing blow on the final assessment. A daily
  // timeout also cannot be converted into victory by acknowledging a late reward.
  if(outcome?.defeated){this.finish('defeated');return;}
  if(this.snapshot.mode==='daily'&&this.combatTicks>=this.dailyTicks){this.finish('timeout');return;}
  if(this.phase==='assessment'&&outcome?.assessmentCleared){
   this.assessmentsPassed++;this.assessmentEvent('passed');this.setGate('assessmentReward');
  }else if(this.phase==='teaching'&&this.teachingTicks===nextWeek*this.weekTicks){
   this.assessment={index:this.assessmentsPassed,week:nextWeek,final:nextWeek===this.config.calendar.weeks};
   this.assessmentTicks=0;this.setGate('assessmentIntro');this.assessmentEvent('prepare');
  }
  if(outcome?.pause)this.pause(outcome.pause);
 }
 private assessmentEvent(stage:'prepare'|'start'|'passed'){
  const clock=this.clock();
  this.rules.assessment(this.state,immutableSnapshot({stage,assessment:this.assessment!,clock}),{...this.services,damageAfterInheritance:amount=>this.inheritance.absorb(amount,clock.combatSeconds),experienceAfterInheritance:amount=>this.inheritance.experience(amount,clock.combatSeconds)});
 }
 private setGate(kind:'assessmentIntro'|'assessmentReward'){
  this.rules.clearInput?.(this.state);this.loop.reset();this.phase=kind;this.gate={kind,token:++this.serial};
 }
 /** UI waits use tokens: stale/repeated acknowledgements cannot spawn or reward twice. */
 acknowledge(token:number){
  if(this.disposed||this.suspension||!this.gate||token!==this.gate.token)return false;
  if(this.rules.canAcknowledge?.(this.state,this.gate.kind)===false)return false;
  const kind=this.gate.kind;this.gate=null;this.loop.reset();
  if(kind==='assessmentIntro'){this.phase='assessment';this.assessmentEvent('start');}
  else if(this.assessment!.final)this.finish('completed');
  else{this.phase='teaching';this.assessment=null;this.assessmentTicks=0;}
  this.publish();return true;
 }
 /** Plain commands cross the same simulation boundary as fixed steps. Manual
  * and loading pauses cannot be dismissed by a late content choice. */
 dispatch(command:unknown){
  if(this.disposed||this.result)return false;
  if(command&&typeof command==='object'&&'type'in command&&command.type==='move'&&'x'in command&&command.x===0&&'y'in command&&command.y===0){this.rules.clearInput?.(this.state);return true;}
  if(this.suspension&&['manual','loading'].includes(this.suspension.reason))return false;
  const outcome=this.rules.command?.(this.state,structuredClone(command),this.services);
  if(!outcome?.accepted)return false;
  if(outcome.resume&&this.suspension)this.resume(this.suspension.token);
  if(outcome.pause)this.pause(outcome.pause);
  this.publish();return true;
 }
 pause(reason:PauseReason='manual'){
  if(this.disposed||this.phase==='finished')return null;
  if(!this.suspension){this.rules.clearInput?.(this.state);this.suspension={reason,token:++this.serial};this.loop.reset();this.publish();}
  return this.suspension.token;
 }
 resume(token:number){
  if(this.disposed||!this.suspension||token!==this.suspension.token)return false;
  if(this.rules.canResume?.(this.state,this.suspension.reason)===false)return false;
  this.suspension=null;this.loop.reset();this.publish();return true;
 }
 abandon(){if(!this.disposed&&!this.result){this.finish('abandoned');this.publish();}}
 private finish(reason:RuntimeOutcome['reason']){
  if(this.result)return;
  const clock=this.clock();this.result={semesterId:'s2',mode:this.snapshot.mode,victory:reason==='completed',reason,week:clock.week,completedWeeks:clock.completedWeeks,seconds:clock.combatSeconds,assessmentsPassed:this.assessmentsPassed,teachingSeconds:clock.teachingSeconds};
  this.phase='finished';this.gate=null;this.suspension=null;
 }
 dispose(){
  if(this.disposed)return;this.disposed=true;this.loop.reset();this.publishedView=undefined;
  try{this.rules.dispose?.(this.state);}finally{this.view.dispose?.();}
 }
}
