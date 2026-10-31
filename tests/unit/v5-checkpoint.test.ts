import {describe,it,expect,vi} from 'vitest';
import {randomStreams} from '../../src/core/run';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {SEMESTERS,semesterAccess} from '../../src/semesters/registry';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import type {AssessmentEvent,RuntimeServices} from '../../src/semesters/runtime/contracts';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {S2_CONTENT as content} from '../../src/semesters/s2/content';
import {LEGACY_CONTENT} from '../../src/semesters/s2/legacy/catalog';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {legacyContentRules,projectContent} from '../../src/semesters/s2/legacy/rules-adapter';
import type {S2Hazard} from '../../src/semesters/s2/danger';
import {worldBlocked} from '../../src/semesters/s2/world';

const all=(s:ContentState)=>[...s.hazards,...s.danger.pending];
const hit=(s:ContentState,id:number,damage:number)=>s.hitEnemy(id,damage,'knife',s.player.x,s.player.y,0,false,false,false,true);
function fixture(index=0,week=8){
 const profile=freshProfile();profile.stats.wins=1;const snapshot=createS2PreviewSnapshot(profile,77),services:RuntimeServices={snapshot,streams:randomStreams(snapshot.seed)},s=new ContentState(content,services);
 s.enemies.clear();s.weapons.length=0;s.week=week;s.stats.regen=0;
 const assessment={index,week,final:week===24},clock={tick:0,combatSeconds:week*40,teachingSeconds:week*40,assessmentSeconds:0,week,completedWeeks:week},boundary={...services,damageAfterInheritance:(n:number)=>n,experienceAfterInheritance:(n:number)=>n};
 s.assessment({stage:'prepare',assessment,clock},boundary);s.assessment({stage:'start',assessment,clock},boundary);
 const id=s.bossEnemy,e=s.enemies;Object.assign(s.player,{x:3104,y:3104,prevX:3104,prevY:3104,invincible:1000});e.x[id]=e.prevX[id]=2844;e.y[id]=e.prevY[id]=3104;s.navigation.rebuild(s.player.x,s.player.y,true);s.rebuildGrid();let tick=0;
 const step=()=>s.tick({...boundary,dt:1/60,clock:{...clock,tick:++tick,combatSeconds:week*40+tick/60,assessmentSeconds:tick/60},phase:'assessment',assessment,ordinarySpawnsAllowed:false});
 const until=(predicate:()=>boolean,limit=1200)=>{for(let n=0;n<limit&&!predicate();n++)step();expect(predicate()).toBe(true);};
 return{s,id,e,step,until,boundary,assessment,clock};
}

describe('v5 first checkpoint boss',()=>{
 it('commits 50% once at the damage boundary, cancels queued/warning/active handles and only matching owned shots, then protects one second',()=>{
  for(const phase of ['queued','warning','active'] as const){
   const f=fixture(),{s,id,e}=f;
   if(phase==='queued')for(let n=0;n<2;n++)s.addHazard('circle',3900,3104+n*180,0,0,40,4,1,0,undefined,{owner:undefined,ownerGeneration:undefined,cancelOnDeath:false,tier:'boss'});
   f.until(()=>all(s).some(h=>h.owner===id&&h.phase===phase));const old=all(s).find(h=>h.owner===id)!;
   expect(old).toMatchObject({owner:id,ownerGeneration:e.generation[id],cancelOnDeath:true,tier:'boss'});
   const other=s.spawnEnemy('homework',3800,3500);e.speed[other]=0;
   s.enemyBullet(3900,3500,0,0,1,6,0,false,id);const owned=s.enemyShots.active.at(-1)!;
   s.enemyBullet(3900,3500,0,0,1,6,0,true,other);const unrelated=s.enemyShots.active.at(-1)!;
   // A shot slot reused by another owner must survive the old owner's clear.
   s.enemyBullet(3900,3500,0,0,1,6,0,false,id);const reused=s.enemyShots.active.at(-1)!;s.enemyShots.release(reused);s.enemyBullet(3900,3500,0,0,1,6,0,true,other);expect(s.enemyShots.active.at(-1)).toBe(reused);
   const cancel=vi.spyOn(s.danger,'cancelOwner'),clear=vi.spyOn(s,'cancelEnemyProjectiles');s.player.invincible=0;s.player.hp=50;e.frozen[id]=.5;
   hit(s,id,8000);expect(e.hp[id]).toBe(8000);expect(e.maxHp[id]).toBe(16000);expect(s.bossStage).toBe(2);expect(s.player.hp).toBe(50);expect(s.player.invincible).toBe(1);
   expect(old.phase).toBe('cancelled');expect(all(s).some(h=>h.owner===id)).toBe(false);expect(s.enemyShots.alive[owned]).toBe(0);expect(s.enemyShots.alive[unrelated]).toBe(1);expect(s.enemyShots.alive[reused]).toBe(1);
   hit(s,id,123);s.bossSystem.update(0);s.bossSystem.update(0);expect(e.hp[id]).toBe(7877);expect(cancel).toHaveBeenCalledTimes(1);expect(clear).toHaveBeenCalledExactlyOnceWith(id,e.generation[id]);
   expect(projectContent(s).proposalBoard).toMatchObject({stage:2,move:'transition',remaining:1});const switchTick=s.frame,x=e.x[id],y=e.y[id];
   for(let n=0;n<59;n++){f.step();expect(all(s).some(h=>h.owner===id)).toBe(false);expect(e.x[id]).toBe(x);expect(e.y[id]).toBe(y);}
   expect(s.player.hp).toBe(50);expect(s.player.invincible).toBeGreaterThan(0);f.step();expect(s.frame-switchTick).toBe(60);
   const next=all(s).find(h=>h.owner===id)!;expect(next.kind).toBe('circle');expect(next.phase).toBe(phase==='queued'?'queued':'warning');
   hit(s,id,1);s.bossSystem.update(0);expect(next.phase).not.toBe('cancelled');expect(clear).toHaveBeenCalledTimes(1);expect(s.visualEvents.filter(v=>v.event.type==='boss'&&v.event.text?.startsWith('阶段 2'))).toHaveLength(1);s.dispose();
  }
 });

 it('uses real locked lines/old landing positions with full warnings, staggered phase-two lines and >=2 seconds without attacks or contact each round',()=>{
  for(const stage of [1,2]){
   const f=fixture(),{s,id,e}=f;if(stage===2)hit(s,id,8000);
   const handles:S2Hazard[]=[],seen=new Set<number>();let checkedLock=false,checkedLanding=false;
   for(let n=0;n<1000&&projectContent(s).proposalBoard?.move!=='recovery';n++){
    f.step();for(const h of all(s))if(h.owner===id&&!seen.has(h.id)){seen.add(h.id);handles.push(h);}
    const h=handles.at(-1);
    if(h?.kind==='circle'&&h.phase==='warning'&&!checkedLanding){const old={x:h.x,y:h.y};s.player.y+=180;f.step();expect([h.x,h.y]).toEqual([old.x,old.y]);checkedLanding=true;}
    if(h?.kind==='line'&&h.locked&&h.phase==='warning'&&!checkedLock){
     const locked={x:h.x2,y:h.y2},origin={x:e.x[id],y:e.y[id]};s.player.y-=100;
     f.until(()=>h.phase==='active');expect([h.x2,h.y2]).toEqual([locked.x,locked.y]);f.step();
     const dx=e.x[id]-origin.x,dy=e.y[id]-origin.y,lx=locked.x-h.x,ly=locked.y-h.y;expect(Math.hypot(dx,dy)).toBeGreaterThan(0);expect(Math.abs(dx*ly-dy*lx)/Math.hypot(lx,ly)).toBeLessThan(.001);checkedLock=true;
    }
   }
   expect(checkedLock).toBe(true);expect(handles.map(h=>h.kind)).toEqual(stage===1?['line']:['circle','line','line']);
   for(const h of handles){expect(h.warningTotal).toBeGreaterThanOrEqual(1.2);expect(h.phase).toBe('cancelled');expect(h.route?.width).toBe(100);expect(h.route!.points.every(p=>!worldBlocked(s.world,p.x,p.y,50))).toBe(true);expect(h).toMatchObject({owner:id,ownerGeneration:e.generation[id],tier:'boss'});}
   if(stage===2){const [,first,second]=handles;expect(second.startedTick-first.startedTick).toBeGreaterThanOrEqual((first.warningTotal+first.lifeTotal+.7)*60);expect(checkedLanding).toBe(true);}
   expect(projectContent(s).proposalBoard).toMatchObject({move:'recovery',remaining:2});const rest=s.frame,x=e.x[id],y=e.y[id];
   Object.assign(s.player,{x,y,prevX:x,prevY:y,hp:50,invincible:0});hit(s,id,10);const hp=e.hp[id];
   for(let n=0;n<119;n++){f.step();expect(all(s).some(h=>h.owner===id)).toBe(false);expect([e.x[id],e.y[id]]).toEqual([x,y]);}
   expect(s.player.hp).toBe(50);expect(e.hp[id]).toBe(hp);f.until(()=>all(s).some(h=>h.owner===id));expect(all(s).find(h=>h.owner===id)!.requestedTick-rest).toBeGreaterThanOrEqual(120);s.dispose();
  }
 });

 it('heals a fixed 15% and commits one chest/reward gate, finishes the internal first eight weeks without graduation or settlement',()=>{
  const profile=freshProfile();profile.stats.wins=1;const original=structuredClone(profile),snapshot=createS2PreviewSnapshot(profile,77),base=legacyContentRules(content);let s!:ContentState,services!:RuntimeServices;
  // Keep the production 24x40 calendar and fixed 60Hz combat/reward rules;
  // omit ordinary combat and project only the reward token in this gate test.
  const engine=new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,view:{publish(){}},rules:{...base,project:state=>({rewardToken:state.rewards.token}),create(value){services=value;s=base.create(value);s.enemies.clear();s.player.invincible=1000;return s;},step(state,step){return base.step(state,{...step,ordinarySpawnsAllowed:false});}}});
  for(let n=0;n<4800;n++)engine.advance(1/15);const intro=engine.read();expect(intro).toMatchObject({phase:'assessmentIntro',clock:{week:8,completedWeeks:8,teachingSeconds:320},assessment:{week:8,final:false}});
  expect(engine.acknowledge(intro.gate!.token)).toBe(true);expect(engine.acknowledge(intro.gate!.token)).toBe(false);expect(content.enemies[s.enemies.kind[s.bossEnemy]].id).toBe('s2:proposalBoard');
  const max=s.stats.maxHp;s.player.hp=50;const heal=vi.spyOn(s,'heal'),chest=vi.spyOn(s.rewards,'openChest');hit(s,s.bossEnemy,1e9);engine.advance(1/60);
  const reward=engine.read(),token=reward.content.rewardToken;expect(reward.phase).toBe('assessmentReward');expect(reward.result).toBeNull();expect(reward.assessmentsPassed).toBe(1);expect(s.player.hp).toBeCloseTo(50+max*.15);expect(chest).toHaveBeenCalledTimes(1);expect(s.weapons[0].level).toBe(4);
  const passed:AssessmentEvent={stage:'passed',assessment:intro.assessment!,clock:reward.clock},boundary={...services,damageAfterInheritance:(n:number)=>n,experienceAfterInheritance:(n:number)=>n};
  s.assessment(passed,boundary);s.assessment(passed,boundary);s.resolveDeaths();expect(heal.mock.calls.filter(([,fixed])=>fixed)).toEqual([[max*.15,true]]);expect(chest).toHaveBeenCalledTimes(1);expect(s.bosses).toBe(1);expect(s.metrics.bossFights).toHaveLength(1);expect(s.progress.bossIds).toEqual(['s2:proposalBoard']);
  expect(engine.acknowledge(reward.gate!.token)).toBe(false);expect(engine.dispatch({type:'chestDone',token:token+1})).toBe(false);expect(engine.dispatch({type:'chestDone',token})).toBe(true);expect(engine.dispatch({type:'chestDone',token})).toBe(false);
  expect(s.assessmentRewardDone).toBe(true);expect(engine.acknowledge(reward.gate!.token)).toBe(true);expect(engine.acknowledge(reward.gate!.token)).toBe(false);engine.advance(1/60);
  expect(engine.read()).toMatchObject({phase:'teaching',clock:{week:9,completedWeeks:8},assessmentsPassed:1,result:null});expect(s.player.hp).toBeCloseTo(50+max*.15);expect(SEMESTERS.s2.runtimeAvailable).toBe(false);expect(semesterAccess(profile,'s2').playable).toBe(false);
  engine.abandon();expect(engine.read().result).toMatchObject({reason:'abandoned',victory:false,completedWeeks:8,assessmentsPassed:1});expect(profile).toEqual(original);engine.dispose();
 });

 it('lets lethal burst skip the transition, keeps later/legacy actors unchanged and never resurrects a same-step defeat',()=>{
  expect(content.enemies.slice(0,25)).toEqual(LEGACY_CONTENT.enemies);
  const f=fixture(),{s,id,e}=f,clear=vi.spyOn(s,'cancelEnemyProjectiles');hit(s,id,16001);expect(e.hp[id]).toBe(0);expect(s.bossStage).toBe(1);expect(clear).not.toHaveBeenCalled();s.player.hp=0;expect(f.step()).toEqual({defeated:true});expect(s.player.hp).toBe(0);expect(s.bosses).toBe(0);s.dispose();
  for(const [index,week,actor] of [[1,16,'defense'],[2,24,'finals']] as const){const later=fixture(index,week);expect(content.enemies[later.e.kind[later.id]].id).toBe(actor);expect(projectContent(later.s).proposalBoard).toBeNull();later.s.dispose();}
  const fallback=new ContentState(LEGACY_CONTENT,f.boundary);fallback.enemies.clear();fallback.assessment({stage:'start',assessment:f.assessment,clock:f.clock},f.boundary);expect(LEGACY_CONTENT.enemies[fallback.enemies.kind[fallback.bossEnemy]].id).toBe('proposal');fallback.dispose();
 });
});
