import {describe,it,expect,vi} from 'vitest';
import {createGameEngine,initializeGameScene} from '../../src/app/semester-engine';
import {GameEngine} from '../../src/core/engine';
import {createS1Engine} from '../../src/semesters/s1/adapter';
import {createS2Engine,createS2Snapshot,prepareS2Scene,type S2Engine} from '../../src/semesters/s2/adapter';
import {loadSemesterRuntime,SEMESTERS} from '../../src/semesters/registry';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import {freshProfile,settleS2Profile,validateProfile,toLegacyS1Save} from '../../src/save/v5/profile';
import {createAppStore} from '../../src/state/store';
import {ProfileRepository} from '../../src/save/v5/repository';
import {SaveCoordinator,type SaveLocks} from '../../src/save/coordinator';
import {SAVE_KEY} from '../../src/save/storage';
import {historicalSaves} from '../helpers/v5-saves';
import {s2DailyChallenge} from '../../src/semesters/s2/daily';
import type {SaveProfile,SemesterResult} from '../../src/semesters/profile';

const profile=()=>validateProfile(historicalSaves().v3)!;
function hooks(initial=profile()){
 let saved=initial;const commits:SemesterResult[]=[];
 return{get saved(){return saved;},commits,publish:vi.fn(),discover:vi.fn(),beginDaily:vi.fn(),settle:(result:SemesterResult)=>{commits.push(result);return saved=settleS2Profile(saved,result);}};
}
/** Skip only calendar waiting in this fixture. All gates, damage/rewards and
 * settlement run through the production adapter and frozen content rules. */
function complete(engine:S2Engine){
 const runtime=engine.runtime,state=runtime['state'];state.player.invincible=1000;
 for(const week of [8,16,24]){
  runtime['teachingTicks']=week*2400-1;state.clearThreats();runtime.advance(1/60);
  expect(engine.read().phase).toBe('assessmentIntro');engine.send({type:'introDone'});
  const id=state.bossEnemy;state.hitEnemy(id,1e9,'knife',state.player.x,state.player.y,0,false,false);runtime.advance(1/60);
  expect(engine.read().phase).toBe('assessmentReward');expect(engine.result).toBeNull();
  expect(runtime.acknowledge(engine.read().gate!.token)).toBe(false);
  const token=state.rewards.token,index=state.rewards.options.findIndex(o=>o.id==='upgrade');if(index>=0)runtime.dispatch({type:'chooseReward',token,index});
  runtime.dispatch({type:'chestDone',token});const gate=engine.read().gate!.token;expect(runtime.acknowledge(gate)).toBe(true);expect(runtime.acknowledge(gate)).toBe(false);
 }
}
describe('v5 formal semester two entry',()=>{
 it('cleans failed initialization immediately instead of waiting for host unmount',async()=>{
  const engine=new GameEngine(toLegacyS1Save(freshProfile()),86),dispose=vi.spyOn(engine,'dispose'),release=vi.fn(),scene={initialize:async()=>{throw Error('fixture initialization');},destroy:release};
  await expect(initializeGameScene(scene,engine)).rejects.toThrow('fixture initialization');expect(release).toHaveBeenCalledOnce();expect(dispose).toHaveBeenCalledOnce();
 });
 it('starts without randomUUID, keeps fallback IDs unique and receipts stable without consuming gameplay RNG',()=>{
  const ids:string[]=[],random=crypto.getRandomValues.bind(crypto);
  try{
   const p=profile(),baseline=createS2Engine(p,86,hooks(p));const streams=baseline.engine.runtime['services'].streams;
   vi.stubGlobal('crypto',{getRandomValues:random});
   for(const mode of ['normal','normal','daily'] as const){
    const h=hooks(p),{engine}=createS2Engine(p,86,h,mode,'2026-10-31');
    if(mode==='normal')expect(engine.runtime['services'].streams).toEqual(streams);
    engine.abandon();engine.abandon();engine.advance(1);expect(h.commits).toHaveLength(1);
    const receipt=engine.result!;ids.push(receipt.id);expect(settleS2Profile(h.saved,receipt)).toBe(h.saved);engine.dispose();
   }
   expect(new Set(ids).size).toBe(3);baseline.engine.dispose();
  }finally{vi.unstubAllGlobals();}
 });
 it('loads the eligible S2 adapter and selects each real engine through the GameHost dispatcher',async()=>{
  const p=profile(),legacyHooks={publish:vi.fn(),discover:vi.fn(),settle:vi.fn()},s2Hooks=hooks(p);
  const first=await loadSemesterRuntime('s1',p),second=await loadSemesterRuntime('s2',p);
  expect('createS1Engine'in first&&first.createS1Engine).toBe(createS1Engine);expect('createS2Engine'in second&&second.createS2Engine).toBe(createS2Engine);expect(SEMESTERS.s2.runtimeAvailable).toBe(true);
  const a=createGameEngine(first,p,86,legacyHooks,s2Hooks,'normal'),b=createGameEngine(second,p,86,legacyHooks,s2Hooks,'normal');
  expect(a).toMatchObject({semesterId:'s1',snapshot:{semesterId:'s1'}});expect(a.engine).toBeInstanceOf(GameEngine);expect(b).toMatchObject({semesterId:'s2',snapshot:{semesterId:'s2',rulesVersion:'campus-s2-v5.0.0'}});expect('runtime'in b.engine&&b.engine.runtime).toBeInstanceOf(SemesterEngine);expect(s2Hooks.beginDaily).not.toHaveBeenCalled();a.engine.dispose();b.engine.dispose();
  await expect(loadSemesterRuntime('s2',freshProfile())).rejects.toThrow('普通模式');
 });
 it('settles victory only after the final reward receipt, preserving S1 and committing once',()=>{
  const p=profile(),h=hooks(p),{engine}=createS2Engine(p,86,h),disposed=vi.fn(),settled=vi.fn();engine.attachView({publish(){},settled,dispose:disposed});complete(engine);
  expect(h.commits).toHaveLength(1);expect(engine.result).toMatchObject({victory:true,completedWeeks:24,settlement:{assessmentsPassed:3,finalRewardCommitted:true}});expect(h.saved.stats).toEqual(p.stats);expect(h.saved.semesters.s2.stats).toMatchObject({runs:1,wins:1});expect(h.saved.semesters.s2.graduation?.runId).toBe(engine.result!.id);expect(h.saved.semesters.s2.bestRating).toMatchObject({ratingVersion:'rating-s2-v1',semesterId:'s2'});expect(h.saved.semesters.s2.achievements['s2:survivor'].completed).toBe(true);
  engine.abandon();engine.advance(1);expect(h.commits).toHaveLength(1);expect(settleS2Profile(h.saved,engine.result!)).toBe(h.saved);expect(settled).toHaveBeenCalledOnce();engine.dispose();engine.dispose();expect(disposed).toHaveBeenCalledOnce();
 });
 it('commits defeat and manual exit through the same callback, and ignores practice/debug rewards',()=>{
  for(const reason of ['defeated','abandoned'] as const){const p=profile(),h=hooks(p),{engine}=createS2Engine(p,86,h);if(reason==='defeated'){engine.runtime['state'].player.hp=0;engine.advance(1/60);}else{engine.send({type:'pause'});engine.send({type:'abandon'});}expect(engine.read().result?.reason).toBe(reason);expect(h.saved.semesters.s2.stats.runs).toBe(1);expect(h.saved.semesters.s2.stats.wins).toBe(0);expect(h.saved.semesters.s2.recentRuns[0].rating?.grade).toBe('C');expect(h.saved.stats).toEqual(p.stats);engine.abandon();expect(h.commits).toHaveLength(1);engine.dispose();}
  for(const flag of ['practice','debug'] as const){const h=hooks(),{engine}=createS2Engine(h.saved,86,h,'normal',undefined,{id:flag,nickname:'测试',createdAt:1,[flag]:true});engine.abandon();expect(h.saved.semesters.s2.stats.runs).toBe(0);expect(h.saved.semesters.s2.bestRating).toBeNull();engine.dispose();}
 });
 it('locks the frozen daily date/seed/assignment independently of personal choices and times out at1500s',()=>{
  const p=profile(),day=s2DailyChallenge('2026-10-31'),snapshot=createS2Snapshot(p,7,'daily',day.date),h=hooks(p),{engine}=createS2Engine(p,999,h,'daily',day.date);
  expect(snapshot).toEqual(engine.snapshot);expect(snapshot).toMatchObject({seed:day.seed,date:day.date,dailyRule:day.rule.id,rulesVersion:'daily-s2-v5.0.0',character:day.rule.character});expect(snapshot.weapons).toHaveLength(26);expect(snapshot.passives).toHaveLength(20);expect(snapshot.regions).toHaveLength(9);expect(Object.values(snapshot.talents)).toEqual(Array(8).fill(3));expect(Object.isFrozen(snapshot.inheritance)).toBe(true);expect(h.beginDaily).toHaveBeenCalledExactlyOnceWith(day.id);
  p.selected='balanced';p.talents={};p.inheritance.choice={id:'notes'};expect(createS2Snapshot(p,1,'daily',day.date)).toEqual(snapshot);
  engine.runtime['combatTicks']=89999;engine.advance(1/60);expect(engine.read().result).toMatchObject({reason:'timeout',seconds:1500});expect(h.saved.daily.records.find(r=>r.id===engine.result!.id)).toMatchObject({semesterId:'s2',version:day.version,date:day.date,seconds:1500,rating:{ratingVersion:'rating-s2-v1'}});expect(h.saved.stats).toEqual(profile().stats);expect(h.saved.semesters.s2.stats.runs).toBe(0);engine.dispose();
 });
 it('writes S2 results with the existing profile coordinator, survives reload and keeps old unknown ratings',async()=>{
  const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}},locks:SaveLocks={exclusive:async(_name,task)=>task(),holdOwner:async()=>()=>{},ownerAlive:async()=>false};
  storage.setItem(SAVE_KEY,JSON.stringify(historicalSaves().v3));const repo=new ProfileRepository(storage),coordinator=new SaveCoordinator(repo,storage,locks),store=createAppStore<SaveProfile>(repo,coordinator);await coordinator.initialize();
  const original=structuredClone(store.getState().save),h=hooks(original),{engine}=createS2Engine(original,86,{...h,discover:store.getState().discover,settle:store.getState().settleS2,beginDaily:store.getState().beginDaily});engine.abandon();await store.getState().whenIdle();const disk=validateProfile(JSON.parse(storage.getItem(SAVE_KEY)!))!;expect(disk.semesters.s2.stats.runs).toBe(1);expect(disk.stats).toEqual(original.stats);expect(disk.semesters.s1.bestRating).toBeNull();expect(disk.semesters.s2.recentRuns).toHaveLength(1);expect(store.getState().settleS2(engine.result!)).toBe(store.getState().save);expect(disk.settledRuns.filter(id=>id===engine.result!.id)).toHaveLength(1);engine.dispose();coordinator.dispose();
 });
 it('cancels preparation before importing the renderer and releases a late view without settling a cancelled opening',async()=>{
  const p=profile(),h=hooks(p),{engine}=createS2Engine(p,86,h),abort=new AbortController();abort.abort();
  await expect(prepareS2Scene(engine,{host:{} as HTMLElement,settings:p.settings,onStick(){},signal:abort.signal})).rejects.toMatchObject({name:'AbortError'});
  const dispose=vi.fn(),publish=vi.fn();engine.attachView({publish,dispose});expect(dispose).toHaveBeenCalledOnce();expect(publish).not.toHaveBeenCalled();expect(engine.runtime['disposed']).toBe(true);engine.abandon();expect(h.commits).toHaveLength(0);
 });
});
