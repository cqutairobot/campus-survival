import {describe,it,expect} from 'vitest';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {freshProfile} from '../../src/save/v5/profile';
import {immutableSnapshot,type InheritanceChoice} from '../../src/semesters/types';
import type {AssessmentEvent,Immutable,RuntimeStep,SemesterRules,SemesterRunView,SemesterRuntimeConfig,StepOutcome} from '../../src/semesters/runtime/contracts';
import {randomStreams} from '../../src/core/run';
import {EnemyPool} from '../../src/entities/pools';
import {CHARACTERS,ENEMIES} from '../../src/data/catalog';
import {weaponParams} from '../../src/weapons/params';
import {inCone} from '../../src/combat/damage';
import {slideMove} from '../../src/world/campus';
import type {Skill} from '../../src/types';

function opening(choice:InheritanceChoice={id:'supply'},daily=false){
 const p=freshProfile();p.stats.wins=1;p.unlocks.weapons.push('coffee','orbit');
 return createS2PreviewSnapshot(p,77,daily?{mode:'daily',assignment:{seed:77,date:'2026-10-31',rule:'piercing',character:'balanced',inheritance:choice}}:{choice});
}
/** Content-free timing adapter: no enemies, balance simulation or persistent settlement. */
function timing(snapshot=opening(),config:SemesterRuntimeConfig=S2_RUNTIME_CONFIG){
 const state={creates:0,steps:0,disposed:0,miniBoss:true,ordinarySpawnsAllowed:true,events:[] as AssessmentEvent[],damage:0,xp:0,weapons:[] as string[]};
 let outcome:StepOutcome|((step:RuntimeStep)=>StepOutcome)={},damage=0,xp=0,viewDisposed=0,publishes=0;
 let last:Immutable<SemesterRunView<{weapons:string[]}>>;
 const rules:SemesterRules<typeof state,{weapons:string[]}>={
  create({snapshot}){state.creates++;state.weapons=[snapshot.initialWeapon.id];return state;},
  step(s,step){s.steps++;s.ordinarySpawnsAllowed=step.ordinarySpawnsAllowed;s.damage+=step.damageAfterInheritance(damage);s.xp+=step.experienceAfterInheritance(xp);damage=xp=0;return typeof outcome==='function'?outcome(step):outcome;},
  assessment(s,event){s.events.push(structuredClone(event));if(event.stage==='prepare')s.miniBoss=false;},
  project:s=>({weapons:s.weapons}),
  dispose(s){s.disposed++;},
 };
 const engine=new SemesterEngine({snapshot,config,rules,view:{publish:v=>{last=v;publishes++;},dispose:()=>{viewDisposed++;}}});
 return {engine,state,get last(){return last;},get publishes(){return publishes;},get viewDisposed(){return viewDisposed;},setOutcome:(v:typeof outcome)=>{outcome=v;},hit:(n:number)=>{damage=n;},grant:(n:number)=>{xp=n;}};
}
// Generic helper avoids test-only clock setters or accelerated/variable simulation dt.
function seconds<State,Content>(g:SemesterEngine<State,Content>,n:number){for(let i=0;i<Math.round(n*15);i++)g.advance(1/15);}
function acknowledge<State,Content>(g:SemesterEngine<State,Content>){return g.acknowledge(g.read().gate!.token);}

describe('v5 independent semester runtime',()=>{
 it('24×40 calendar gates 8/16/24, stops mini-bosses, pauses teaching during combat and accepts each reward once',()=>{
  const h=timing(),g=h.engine;
  for(const week of [8,16,24]){
   seconds(g,320-1/15);expect(g.read().phase).toBe('teaching');g.advance(1/15);
   const intro=g.read();expect(intro).toMatchObject({phase:'assessmentIntro',assessment:{week,final:week===24},clock:{teachingSeconds:week*40,week,completedWeeks:week,assessmentSeconds:0}});
   expect(h.state.miniBoss).toBe(false);expect(h.state.ordinarySpawnsAllowed).toBe(false);expect(h.state.events.at(-1)?.stage).toBe('prepare');
   const token=intro.gate!.token;g.advance(10);expect(g.read()).toEqual(intro);
   expect(g.acknowledge(token)).toBe(true);expect(g.acknowledge(token)).toBe(false);
   seconds(g,2);expect(g.read().clock).toMatchObject({teachingSeconds:week*40,assessmentSeconds:2,combatSeconds:week*40+(week/8-1)*(2+1/60)+2});
   h.setOutcome({assessmentCleared:true});g.advance(1/60);h.setOutcome({});
   const reward=g.read();expect(reward.phase).toBe('assessmentReward');expect(reward.assessmentsPassed).toBe(week/8);expect(reward.result).toBeNull();
   g.advance(100);expect(g.read()).toEqual(reward);expect(g.acknowledge(token)).toBe(false);
   const rewardToken=reward.gate!.token;expect(g.acknowledge(rewardToken)).toBe(true);expect(g.acknowledge(rewardToken)).toBe(false);
   if(week<24){expect(g.read().phase).toBe('teaching');h.state.miniBoss=true;}
  }
  expect(h.state.events.map(e=>[e.stage,e.assessment.week])).toEqual([8,16,24].flatMap(w=>['prepare','start','passed'].map(s=>[s,w])));
  expect(g.read().result).toMatchObject({semesterId:'s2',victory:true,reason:'completed',completedWeeks:24,assessmentsPassed:3,seconds:966.05});
  const done=g.read();g.advance(20);g.abandon();expect(g.read()).toEqual(done);g.dispose();
 });

 it('carry-v1 consumes once from the opening snapshot and expires on combat time; waits and stale tokens cannot refill it',()=>{
  const source=structuredClone(opening()),shield=timing(source),g=shield.engine;
  Object.assign(source,{inheritance:{version:'carry-v1',id:'notes',xpMultiplier:1.08,durationSeconds:120}});
  expect(g.read().inheritance).toEqual({id:'supply',shield:15,xpMultiplier:1});
  shield.hit(6);g.advance(1/60);expect(shield.state.damage).toBe(0);expect(g.read().inheritance.shield).toBe(9);
  const token=g.pause('choice')!;const paused=g.read();g.advance(500);expect(g.read()).toEqual(paused);expect(g.resume(token+1)).toBe(false);expect(g.resume(token)).toBe(true);expect(g.resume(token)).toBe(false);
  shield.hit(20);shield.grant(10);g.advance(1/60);expect(shield.state.damage).toBe(11);expect(shield.state.xp).toBe(10);expect(g.read().inheritance.shield).toBe(0);expect(shield.state.creates).toBe(1);
  const fresh=timing();seconds(fresh.engine,60-1/15);expect(fresh.engine.read().inheritance.shield).toBe(15);fresh.engine.advance(1/15);expect(fresh.engine.read().inheritance.shield).toBe(0);
  const notes=timing(opening({id:'notes'}));notes.grant(10);notes.engine.advance(1/60);expect(notes.state.xp).toBe(10.8);
  const notePause=notes.engine.pause('manual')!;notes.engine.advance(999);expect(notes.engine.read().inheritance.xpMultiplier).toBe(1.08);notes.engine.resume(notePause);
  for(let i=1;i<7200-1;i++)notes.engine.advance(1/60);expect(notes.engine.read().inheritance.xpMultiplier).toBe(1.08);
  notes.grant(10);notes.engine.advance(1/60);expect(notes.engine.read().clock.combatSeconds).toBe(120);expect(notes.engine.read().inheritance.xpMultiplier).toBe(1);expect(notes.state.xp).toBe(20.8);
  const topic=timing(opening({id:'topic',weaponId:'orbit'}));seconds(topic.engine,1);expect(topic.state.weapons).toEqual(['orbit']);expect(topic.state.creates).toBe(1);expect(topic.engine.read().inheritance).toEqual({id:'topic',shield:0,xpMultiplier:1});
  const count=shield.publishes;g.dispose();g.dispose();g.advance(1);expect(shield.state.disposed).toBe(1);expect(shield.viewDisposed).toBe(1);expect(shield.publishes).toBe(count);expect(g.resume(token)).toBe(false);expect(g.acknowledge(1)).toBe(false);
  for(const h of [fresh,notes,topic])h.engine.dispose();
 });

 it('uses immutable view DTOs and stable fixed steps for real legacy content at 30/60/120Hz, with isolated simulation RNG',()=>{
  const snapshot=opening({id:'topic',weaponId:'coffee'}),enemy=ENEMIES.find(e=>e.id==='homework')!,before=structuredClone(ENEMIES),outcomes=[];
  // A tiny validation adapter only: old definition, parameter function, pool,
  // cone collision and campus movement. Full behavior/reward ports belong to P04.
  for(const fps of [30,60,120]){
   const rules:SemesterRules<{x:number;y:number;hp:number;xp:number;kills:number;cooldown:number;weapons:Skill[];enemies:EnemyPool;streams:ReturnType<typeof randomStreams>},{x:number;y:number;hp:number;xp:number;kills:number;weapons:Skill[];enemies:number[][];streams:Record<string,number>}>= {
    create({snapshot,streams}){
     const enemies=new EnemyPool(8);for(let n=0;n<6;n++){const id=enemies.acquire(),angle=streams.spawn.range(-.3,.3);enemies.x[id]=3072+Math.cos(angle)*(80+n*10);enemies.y[id]=3072+Math.sin(angle)*80;enemies.hp[id]=enemy.hp;}
     if(snapshot.initialWeapon.id!=='coffee')throw Error('Validation adapter only supports coffee');
     return {x:3072,y:3072,hp:CHARACTERS[0].hp,xp:0,kills:0,cooldown:0,weapons:[{...snapshot.initialWeapon,id:snapshot.initialWeapon.id}],enemies,streams};
    },
    step(s,step:RuntimeStep){
     expect(step.dt).toBe(1/60);const e=s.enemies,next=slideMove(s.x,s.y,40*step.dt,10*step.dt,12);s.x=next.x;s.y=next.y;
     for(const id of e.active){const angle=Math.atan2(s.y-e.y[id],s.x-e.x[id]);e.x[id]+=Math.cos(angle)*enemy.speed*step.dt;e.y[id]+=Math.sin(angle)*enemy.speed*step.dt;}
     s.cooldown-=step.dt;if(s.cooldown<=0){const params=weaponParams(s.weapons[0]);s.cooldown+=params.interval;
      for(const id of [...e.active])if(inCone(s.x,s.y,e.x[id],e.y[id],0,params.range,params.spread,enemy.radius)){e.hp[id]-=params.damage*(step.streams.combat.next()<CHARACTERS[0].crit?1.75:1);if(e.hp[id]<=0){e.release(id);s.kills++;s.xp+=step.experienceAfterInheritance(enemy.xp);}}
     }
    },
    project:s=>({x:s.x,y:s.y,hp:s.hp,xp:s.xp,kills:s.kills,weapons:s.weapons,enemies:s.enemies.active.map(id=>[s.enemies.x[id],s.enemies.y[id],s.enemies.hp[id]]),streams:Object.fromEntries(Object.entries(s.streams).map(([id,r])=>[id,r.state]))}),
    assessment(){throw Error('Short content check must stay in week one');},dispose:s=>s.enemies.clear(),
   };
   const g=new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,rules,view:{publish(){}}});
   for(let n=0;n<fps*4;n++){g.advance(1/fps);if(fps===120)g.read();}
   const view=g.read();expect(view.clock).toMatchObject({combatSeconds:4,teachingSeconds:4,week:1});expect(view.calendar).toMatchObject({weeks:24,weekSeconds:40,bossWeeks:[8,16,24]});expect(view.content.kills).toBeGreaterThan(0);expect(view.content.x).toBeGreaterThan(3072);expect(view.content.weapons).toEqual([{id:'coffee',level:1,rarity:0,evolved:false}]);
   expect(()=>{(view.content.weapons as Skill[]).push({id:'knife',level:5,rarity:3,evolved:true});}).toThrow();expect(Object.isFrozen(view.content.streams)).toBe(true);
   outcomes.push(view);g.dispose();
  }
  expect(outcomes[1]).toEqual(outcomes[0]);expect(outcomes[2]).toEqual(outcomes[0]);expect(ENEMIES).toEqual(before);expect(snapshot.initialWeapon.id).toBe('coffee');
 });

 it('bounds catch-up, freezes modal backlog, rejects mismatched snapshots, and gives defeat/1500-second timeout priority over a clear',()=>{
  const h=timing();h.engine.advance(5);expect(h.state.steps).toBe(5);expect(h.engine.droppedSeconds).toBeGreaterThan(4.9);
  for(const delta of [NaN,Infinity,-1])expect(()=>h.engine.advance(delta)).toThrow('Frame delta');
  h.setOutcome({pause:'choice'});h.engine.advance(1/30);const paused=h.engine.read();expect(h.state.steps).toBe(6);h.engine.advance(500);expect(h.engine.read()).toEqual(paused);h.setOutcome({});h.engine.resume(paused.pause!.token);h.engine.advance(1/120);expect(h.state.steps).toBe(6);h.engine.advance(1/120);expect(h.state.steps).toBe(7);h.engine.dispose();
  const bad=immutableSnapshot({...opening(),rulesVersion:'unknown'});expect(()=>timing(bad)).toThrow('Unsupported');expect(()=>timing({...opening(),eligible:false})).toThrow('Unsupported');
  const defeat=timing();seconds(defeat.engine,320);acknowledge(defeat.engine);defeat.setOutcome({defeated:true,assessmentCleared:true});defeat.engine.advance(1/60);expect(defeat.engine.read().result).toMatchObject({victory:false,reason:'defeated',assessmentsPassed:0});expect(defeat.state.events.map(e=>e.stage)).toEqual(['prepare','start']);defeat.engine.dispose();
  const daily=timing(opening({id:'notes'},true));seconds(daily.engine,320);acknowledge(daily.engine);seconds(daily.engine,1180-1/15);expect(daily.engine.read().result).toBeNull();daily.setOutcome(step=>({assessmentCleared:step.clock.combatSeconds>=1500}));daily.engine.advance(1/15);expect(daily.engine.read().result).toMatchObject({semesterId:'s2',mode:'daily',victory:false,reason:'timeout',seconds:1500,completedWeeks:8,assessmentsPassed:0});daily.engine.dispose();
 });
});
