import {describe,it,expect} from 'vitest';
import {historicalSaves} from '../helpers/v5-saves';
import {freshProfile,validateProfile,toLegacyS1Save,settleS1Profile} from '../../src/save/v5/profile';
import {createS1Snapshot,createS1Engine} from '../../src/semesters/s1/adapter';
import {createS2PreviewSnapshot,hasAlumniEligibility,inheritedWeaponIds} from '../../src/semesters/inheritance';
import {SEMESTERS,loadSemesterRuntime,semesterAccess} from '../../src/semesters/registry';
import {legacyDiscovery,discoverProfile} from '../../src/save/v5/discovery';
import {createManifest} from '../../src/core/run';
import {GameEngine} from '../../src/core/engine';
import {BOSS_WEEKS,WEEK_SECONDS} from '../../src/data/catalog';
import {S2_IDS} from '../../src/semesters/catalog-ids';
import {createAppStore} from '../../src/state/store';
import {SaveCoordinator,type SaveLocks} from '../../src/save/coordinator';
import {ProfileRepository} from '../../src/save/v5/repository';
import {SAVE_KEY} from '../../src/save/storage';
import type {InheritanceChoice} from '../../src/semesters/types';

describe('v5 semester routing and inheritance',()=>{
 it('S1 adapter preserves manifest, starting weapon, stats and all eight random streams; S2 runtime stays closed',async()=>{
  const p=validateProfile(historicalSaves().v3)!,before=structuredClone(p);p.inheritance.choice={id:'topic',weaponId:'orbit'};
  for(const mode of ['normal','daily'] as const){
   const snapshot=createS1Snapshot(p,99,mode,'2026-10-31'),old=createManifest(toLegacyS1Save(p),99,mode,'2026-10-31');
   expect(snapshot.legacy).toEqual(old);expect(snapshot.inheritance).toBeNull();expect(snapshot.semesterId).toBe('s1');expect(Object.isFrozen(snapshot.legacy.talents)).toBe(true);
  }
  const noop=()=>{},original=new GameEngine(toLegacyS1Save(p),99),adapted=createS1Engine(p,99,{publish:noop,discover:noop,settle:noop});
  expect(adapted.snapshot.initialWeapon.id).toBe('bot');expect(adapted.engine.player.shield).toBe(0);
  for(const g of [original,adapted.engine]){g.inputX=1;for(let n=0;n<90;n++)g.tick(1/60);g.addExperience(7);g.tick(1/60);g.send({type:'choose',index:0});g.tick(1/60);}
  expect(adapted.engine.exportSession()).toEqual(original.exportSession());expect(adapted.engine.player).toEqual(original.player);original.dispose();adapted.engine.dispose();
  expect(p.stats).toEqual(before.stats);expect(p.credits).toBe(before.credits);
  expect(SEMESTERS.s1.calendar).toMatchObject({weeks:22,weekSeconds:WEEK_SECONDS,bossWeeks:BOSS_WEEKS,dailyLimitSeconds:1200});expect(SEMESTERS.s2.calendar).toMatchObject({weeks:24,weekSeconds:40,bossWeeks:[8,16,24],dailyLimitSeconds:1500});
  const route=await loadSemesterRuntime('s1',p);expect(route.createS1Engine).toBe(createS1Engine);await expect(loadSemesterRuntime('s2',p)).rejects.toThrow('暂未开放');await expect(loadSemesterRuntime('s2',freshProfile())).rejects.toThrow('普通模式');
 });
 it('three mutually exclusive immutable inheritances use legal base weapons; fixed daily ignores personal power and choice',()=>{
  const p=validateProfile(historicalSaves().v2)!,before=structuredClone(p),choices:InheritanceChoice[]=[{id:'supply'},{id:'notes'},{id:'topic',weaponId:'orbit'},{id:'topic',weaponId:'s2:drone'}];
  for(const choice of choices){
   const s=createS2PreviewSnapshot(p,100,{choice});expect(s.inheritance.id).toBe(choice.id);expect(s.initialWeapon).toEqual({id:choice.id==='topic'?choice.weaponId:'bot',level:1,rarity:0,evolved:false});
   expect(Object.isFrozen(s)).toBe(true);expect(Object.isFrozen(s.inheritance)).toBe(true);expect(Object.isFrozen(s.talents)).toBe(true);expect(()=>s.weapons.push('illegal')).toThrow();
   if(s.inheritance.id==='supply')expect(s.inheritance).toEqual({version:'carry-v1',id:'supply',shield:15,durationSeconds:60});
   if(s.inheritance.id==='notes')expect(s.inheritance).toEqual({version:'carry-v1',id:'notes',xpMultiplier:1.08,durationSeconds:120});
   if(s.inheritance.id==='topic')expect(Object.keys(s.inheritance).sort()).toEqual(['id','version','weapon']);
  }
  expect(p).toEqual(before);expect(inheritedWeaponIds(p)).not.toContain('blueprint');
  for(const weaponId of ['blueprint','sword','参考文献风暴','unknown'])expect(()=>createS2PreviewSnapshot(p,1,{choice:{id:'topic',weaponId}})).toThrow('未解锁');
  const bad=freshProfile();bad.inheritance.alumniEligible=true;bad.selectedSemester='s2';expect(hasAlumniEligibility(bad)).toBe(false);expect(()=>createS2PreviewSnapshot(bad,1)).toThrow('普通模式');
  const assignment={seed:777,date:'2026-10-31',rule:'piercing',character:'balanced',inheritance:{id:'notes'} as InheritanceChoice},fixed=createS2PreviewSnapshot(p,1,{mode:'daily',assignment});
  p.inheritance.choice={id:'topic',weaponId:'s2:printer'};p.talents={hp:5,damage:5};p.selected='balanced';p.unlocks.weapons=['knife'];p.unlocks.passives=[];p.unlocks.regions=[];p.credits=9999;
  expect(createS2PreviewSnapshot(p,999,{mode:'daily',assignment})).toEqual(fixed);expect(Object.values(fixed.talents)).toEqual(Array(8).fill(3));expect(fixed.weapons).toHaveLength(26);expect(fixed.passives).toHaveLength(20);expect(fixed.regions).toHaveLength(9);
  const normal=createS2PreviewSnapshot(before,2);before.talents.hp=5;before.unlocks.regions.push('workshop');expect(normal.talents.hp).toBe(3);expect(normal.regions).not.toContain('workshop');
 });
 it('selection and namespaced discovery persist without changing S1 stats; active runs cannot alter opening conditions',async()=>{
  const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}},locks:SaveLocks={exclusive:async(_name,task)=>task(),holdOwner:async()=>()=>{},ownerAlive:async()=>false};
  storage.setItem(SAVE_KEY,JSON.stringify(historicalSaves().v3));const repo=new ProfileRepository(storage),c=new SaveCoordinator(repo,storage,locks),store=createAppStore(repo,c,{validate:validateProfile,settle:settleS1Profile});await c.initialize();
  const original=structuredClone(store.getState().save.stats),credits=store.getState().save.credits;
  store.getState().selectSemester('s1');store.getState().selectInheritance({id:'topic',weaponId:'orbit'});await store.getState().whenIdle();
  let disk=validateProfile(JSON.parse(storage.getItem(SAVE_KEY)!))!;expect(disk.selectedSemester).toBe('s1');expect(disk.inheritance.choice).toEqual({id:'topic',weaponId:'orbit'});expect(disk.stats).toEqual(original);expect(disk.credits).toBe(credits);
  const d={category:'enemy' as const,id:'s2:bike',semesterId:'s2' as const,evidence:'debug' as const};store.getState().discover(d);await store.getState().whenIdle();disk=validateProfile(JSON.parse(storage.getItem(SAVE_KEY)!))!;
  expect(disk.discoveredEnemies).toContain('s2:bike');expect(disk.stats).toEqual(original);expect(legacyDiscovery('enemy:s2:bike').id).toBe('s2:bike');expect(discoverProfile(disk,{...d,id:'s2:unknown'})).toBe(disk);
  const source=store.getState().save;store.setState({hud:{...store.getState().hud,phase:'playing'}});store.getState().selectSemester('s2');store.getState().selectInheritance({id:'notes'});expect(store.getState().save).toBe(source);
  expect(semesterAccess(freshProfile(),'s2').eligible).toBe(false);expect(S2_IDS.enemies).toHaveLength(15);c.dispose();
 });
});
