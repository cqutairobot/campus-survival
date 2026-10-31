import {describe,it,expect} from 'vitest';
import {historicalSaves} from '../helpers/v5-saves';
import {freshProfile,validateProfile,toLegacyS1Save,settleS1Profile,settleS2Profile,S1_IDS} from '../../src/save/v5/profile';
import {ProfileRepository,PRE_V5_PREFIX,profileRecoveryPreview} from '../../src/save/v5/repository';
import {SaveRepository,freshSave,validateSave,SAVE_KEY,BACKUP_KEY,LEGACY_KEYS,RECOVERY_PREFIX} from '../../src/save/storage';
import {SaveCoordinator,type SaveLocks} from '../../src/save/coordinator';
import {createAppStore} from '../../src/state/store';
import {S2_IDS} from '../../src/semesters/catalog-ids';
import {GameEngine} from '../../src/core/engine';
import type {RunResult} from '../../src/types';
import type {SemesterResult} from '../../src/semesters/profile';

class Memory {
 data=new Map<string,string>();fail='';silent=false;
 getItem(k:string){return this.data.get(k)??null;}
 setItem(k:string,v:string){if(this.fail&&k.startsWith(this.fail)){if(this.silent)return;throw Error('quota');}this.data.set(k,v);}
 removeItem(k:string){this.data.delete(k);}
}
class Locks implements SaveLocks {
 owners=new Set<string>();queue=Promise.resolve();names:string[]=[];
 exclusive<T>(name:string,task:()=>T|Promise<T>):Promise<T>{this.names.push(name);const result=this.queue.then(task);this.queue=result.then(()=>{},()=>{});return result;}
 async holdOwner(owner:string){this.owners.add(owner);return()=>{this.owners.delete(owner);};}
 async ownerAlive(owner:string){return this.owners.has(owner);}
}
function result(id='new-run'):RunResult{const engine=new GameEngine(freshSave(),17);engine.finish(false);const r={...engine.result!,id,credits:20};engine.dispose();return r;}
describe('v5 profile core boundaries',()=>{
 it('6.5 historical matrix preserves original bytes, fields, settings, dedup and reloads idempotently',()=>{
  for(const [version,input] of Object.entries(historicalSaves())){
   const raw=JSON.stringify(input),before=structuredClone(input),old=validateSave(input)!,profile=validateProfile(input,raw)!;
   expect(input,version).toEqual(before);expect(profile.schemaVersion).toBe(4);expect(profile.credits).toBe(137);expect(profile.selected).toBe('coder');expect(profile.settings).toEqual(old.settings);expect(profile.stats).toEqual(old.stats);expect(profile.achievements).toEqual(old.achievements);expect(profile.unlocks).toEqual(old.unlocks);
   for(const k of ['discovered','evolutions','discoveredEnemies','fusions','relics','events','regions','settledRuns'] as const)expect(profile[k],`${version}.${k}`).toEqual(old[k]);
   expect(profile.semesters.s1.bestRating).toBeNull();expect(profile.semesters.s1.recentRuns).toEqual([]);expect(profile.selectedSemester).toBe(version==='v2Uncleared'?'s1':'s2');expect(profile.stats.wins).toBe(version==='v2Uncleared'?0:1);
   expect(toLegacyS1Save(profile)).toEqual(old);expect(validateProfile(profile)).toEqual(profile);expect(validateProfile(JSON.parse(JSON.stringify(profile)))).toEqual(profile);
   const storage=new Memory(),key=input.schemaVersion===1?LEGACY_KEYS[2]:input.schemaVersion===2?LEGACY_KEYS[0]:SAVE_KEY;storage.setItem(key,raw);
   const repo=new ProfileRepository(storage),loaded=repo.load();expect(storage.getItem(key)).toBe(raw);expect(repo.writeLoaded(loaded)).toBe(true);
   expect([...storage.data].filter(([k])=>k.startsWith(PRE_V5_PREFIX)).map(([,v])=>v)).toContain(raw);if(key!==SAVE_KEY)expect(storage.getItem(key)).toBe(raw);
   expect(new ProfileRepository(storage).load()).toEqual(profile);expect(settleS1Profile(profile,{id:'historical-run'} as RunResult)).toBe(profile);
   const settled=settleS1Profile(profile,result(version));expect(settleS1Profile(settled,result(version))).toBe(settled);expect(settled.credits).toBe(157);
  }
 });
 it('graduation requires normal evidence, keeps conflicting legacy facts and ignores boolean/selection/debug/daily hints',()=>{
  const old=freshSave();old.achievements.survivor={progress:1,completed:false,claimed:false};const achievement=validateProfile(old)!;
  expect(achievement.semesters.s1.graduation?.source).toBe('legacyAchievement');expect(achievement.stats.wins).toBe(0);
  for(const hint of [{stats:{...old.stats,bestWeek:22}},{discoveredEnemies:['finals'],regions:['garden'],settledRuns:['win']},{daily:historicalSaves().v3.daily}]){
   const p=validateProfile({...freshSave(),...hint})!;expect(p.selectedSemester).toBe('s1');expect(p.inheritance.alumniEligible).toBe(false);expect(p.semesters.s1.graduation).toBeNull();
  }
  const p=freshProfile();p.inheritance.alumniEligible=true;p.selectedSemester='s2';expect(validateProfile(p)?.selectedSemester).toBe('s1');
  const daily={...result(),victory:true,manifest:{...result().manifest!,mode:'daily' as const,date:'2026-10-31'}};
  expect(settleS1Profile(p,daily).semesters.s1.graduation).toBeNull();expect(settleS1Profile(p,{...result(),debug:true,victory:true})).toBe(p);
  const won=settleS1Profile(p,{...result(),victory:true});expect(won.semesters.s1.graduation).toEqual({source:'normalRun',runId:'new-run'});expect(validateProfile(won)?.inheritance.alumniEligible).toBe(true);
 });
 it('schema 4 keeps full S2 IDs, full dedup, summaries and daily namespaces without legacy truncation',()=>{
  const p=validateProfile(historicalSaves().v401)!,before=structuredClone(p);
  p.discovered=[...S1_IDS.weapons,...S1_IDS.passives,...S2_IDS.weapons,...S2_IDS.passives];p.evolutions=[...S1_IDS.weapons,...S2_IDS.weapons];
  p.discoveredEnemies=[...S1_IDS.enemies,...S2_IDS.enemies];p.fusions=[...S1_IDS.fusions,...S2_IDS.fusions];p.relics=[...S1_IDS.relics,...S2_IDS.relics];p.events=[...S1_IDS.events,...S2_IDS.events];p.regions=[...S1_IDS.regions,...S2_IDS.regions];
  p.settledRuns=Array.from({length:100005},(_,i)=>`run-${i}`);
  const s1=p.daily.records[0];p.daily.records.push({...s1,semesterId:'s2',seconds:1500,completedWeeks:24,build:['s2:drone','s2:protocol'],relics:['s2:projectGrant']});p.daily.attempts['s2|2026-10-30|daily-s2-v5.0.0']=3;p.daily.completedKeys.push('s2|2026-10-30');
  const full=structuredClone(p),out=validateProfile(p)!;expect(p).toEqual(full);expect(out).toEqual(full);expect(validateProfile(JSON.parse(JSON.stringify(out)))).toEqual(full);
  expect(out.discoveredEnemies).toHaveLength(40);expect(out.fusions).toHaveLength(9);expect(out.settledRuns).toHaveLength(100005);expect(out.daily.records).toHaveLength(2);
  const legacy=toLegacyS1Save(out);expect(legacy.discoveredEnemies).toHaveLength(25);expect(legacy.fusions).toHaveLength(6);expect(legacy.daily).toEqual(toLegacyS1Save(before).daily);expect(validateSave(legacy)).not.toBeNull();
  expect(validateProfile({...out,schemaVersion:5})).toBeNull();expect(validateSave(out)).toBeNull();
 });
 it('S1/S2 settlements preserve the other semester, merge wallet deltas, isolate daily/practice and dedup globally',()=>{
  let p=validateProfile(historicalSaves().v3)!;p.discoveredEnemies.push('s2:bike');p.fusions.push('s2:fieldHub');
  const r=result('s1'),s1stats=structuredClone(p.stats);const r2:SemesterResult={...result('s2'),dailyRecord:undefined,semesterId:'s2',week:24,victory:true,credits:30,weapons:[{id:'s2:drone'}],passives:[]};
  const second=settleS2Profile(p,r2);expect(second.stats).toEqual(s1stats);expect(second.semesters.s2.stats).toMatchObject({runs:1,wins:1,bestWeek:24});expect(second.credits).toBe(167);expect(settleS2Profile(second,r2)).toBe(second);expect(settleS1Profile(second,{...r,id:'s2'})).toBe(second);
  const s2=structuredClone(second.semesters.s2);p=settleS1Profile(second,r);expect(p.semesters.s2).toEqual(s2);expect(p.credits).toBe(187);expect(p.fusions).toContain('s2:fieldHub');expect(p.discoveredEnemies).toContain('s2:bike');
  expect(settleS2Profile(p,{...r2,id:'practice',practice:true})).toBe(p);expect(settleS2Profile(p,{...r2,id:'debug',debug:true})).toBe(p);
  const daily=settleS2Profile(p,{...r2,id:'daily-s2',manifest:{...r2.manifest!,mode:'daily',date:'2026-10-31'}});expect(daily.stats).toEqual(p.stats);expect(daily.semesters.s2.stats).toEqual(s2.stats);expect(daily.credits).toBe(p.credits);expect(toLegacyS1Save(daily).daily.completedDates).not.toContain('2026-10-31');
  for(let i=0;i<12;i++)p=settleS1Profile(p,{...r,id:`summary-${i}`});expect(p.semesters.s1.recentRuns).toHaveLength(10);expect(validateProfile(p)).toEqual(p);
 });
 it('backs up raw text before writes, refuses quota/readback/future failures, recovers corrupt/fallback explicitly',async()=>{
  const raw=JSON.stringify(historicalSaves().v401);
  for(const fail of [PRE_V5_PREFIX,SAVE_KEY])for(const silent of [false,true]){
   const storage=new Memory();storage.setItem(SAVE_KEY,raw);storage.fail=fail;storage.silent=silent;const repo=new ProfileRepository(storage),c=new SaveCoordinator(repo,storage,new Locks());
   const p=await c.initialize();expect(storage.getItem(SAVE_KEY)).toBe(raw);expect(c.state).toBe('failed');expect((await c.commit(p)).kind).toBe('failed');c.dispose();
  }
  for(const key of [SAVE_KEY,BACKUP_KEY]){
   const storage=new Memory(),future=JSON.stringify({...freshProfile(),schemaVersion:99});storage.setItem(SAVE_KEY,raw);storage.setItem(key,future);const repo=new ProfileRepository(storage),p=repo.load();expect(repo.state).toBe('future');expect(repo.write(p)).toBe(false);expect(repo.commitRecovery('reset')).toBeNull();expect(storage.getItem(key)).toBe(future);
  }
  const failedStorage=new Memory();failedStorage.setItem(SAVE_KEY,raw);failedStorage.fail=PRE_V5_PREFIX;const failedRepo=new ProfileRepository(failedStorage),failedCoordinator=new SaveCoordinator(failedRepo,failedStorage,new Locks()),failedStore=createAppStore(failedRepo,failedCoordinator,{validate:validateProfile,settle:settleS1Profile});await failedCoordinator.initialize();expect((await failedStore.getState().takeoverSave()).kind).toBe('failed');expect(failedStorage.getItem(SAVE_KEY)).toBe(raw);failedCoordinator.dispose();
  const storage=new Memory();storage.setItem(SAVE_KEY,'{broken');storage.setItem(BACKUP_KEY,raw);const repo=new ProfileRepository(storage),p=repo.load();expect(repo.state).toBe('fallback');expect(repo.write(p)).toBe(true);expect(storage.getItem(BACKUP_KEY)).toBe(raw);expect([...storage.data].filter(([k])=>k.startsWith(RECOVERY_PREFIX)).map(([,v])=>v)).toContain('{broken');
  const broken=JSON.stringify({...historicalSaves().v401,credits:'137'});storage.data.clear();storage.setItem(SAVE_KEY,broken);repo.load();expect(repo.state).toBe('corrupt');expect(repo.write(freshProfile())).toBe(false);expect(profileRecoveryPreview(broken)?.save).toMatchObject({credits:0,selected:'coder'});storage.fail=RECOVERY_PREFIX;expect(repo.commitRecovery('fields')).toBeNull();expect(storage.getItem(SAVE_KEY)).toBe(broken);storage.fail='';expect(repo.commitRecovery('fields')?.selected).toBe('coder');
 });
 it('shares v4 locks, observes old owners, claims only explicitly, blocks stale writes and archives UI imports',async()=>{
  const storage=new Memory(),locks=new Locks(),raw=JSON.stringify(historicalSaves().v3);storage.setItem(SAVE_KEY,raw);
  const oldRepo=new SaveRepository(storage),old=new SaveCoordinator(oldRepo,storage,locks);await old.initialize();
  const repo=new ProfileRepository(storage),next=new SaveCoordinator(repo,storage,locks),store=createAppStore(repo,next,{validate:validateProfile,settle:settleS1Profile});await next.initialize();expect(next.role).toBe('observer');const observed=storage.getItem(SAVE_KEY);await store.getState().settings({muted:false});expect(storage.getItem(SAVE_KEY)).toBe(observed);
  await store.getState().takeoverSave();expect(next.role).toBe('writer');expect(JSON.parse(storage.getItem(SAVE_KEY)!).schemaVersion).toBe(4);const claimed=storage.getItem(SAVE_KEY);expect((await old.commit(freshSave())).kind).toBe('memory');expect(storage.getItem(SAVE_KEY)).toBe(claimed);
  const imported=JSON.stringify(historicalSaves().v2);expect((await store.getState().importSave(imported)).kind).toBe('saved');expect([...storage.data].filter(([k])=>k.startsWith(PRE_V5_PREFIX)).map(([,v])=>v)).toContain(imported);expect(store.getState().save.inheritance.alumniEligible).toBe(true);expect(locks.names.every(name=>name===`${SAVE_KEY}.commit`)).toBe(true);
  const disk=storage.getItem(SAVE_KEY);storage.setItem(SAVE_KEY,JSON.stringify({...freshProfile(),credits:9}));await store.getState().settings({motion:true});expect(next.role).toBe('conflict');expect(storage.getItem(SAVE_KEY)).not.toBe(disk);
  old.dispose();next.dispose();
 });
});
