import {describe,it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {S2_CONTENT} from '../../src/semesters/s2/content';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {S2_SCORE_TABLE} from '../../src/semesters/s2/daily';
import {S2_RELEASE_VERSIONS} from '../../src/semesters/s2/release';
import {SEMESTERS} from '../../src/semesters/registry';
import {simulateReleaseBoss,RELEASE_BUILDS,releaseBuildCost} from '../../scripts/s2-balance-simulation';
const json=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
describe('v5 local release freeze',()=>{
 it('release evidence fits six slots and owns every evolved weapon recipe',()=>{
  expect(RELEASE_BUILDS.map(b=>releaseBuildCost(b).totalSkillPoints)).toEqual([33,32,28,33]);expect(RELEASE_BUILDS.map(b=>releaseBuildCost(b).evolutionChests)).toEqual([0,2,4,4]);
  expect(()=>releaseBuildCost({...RELEASE_BUILDS[1],passives:RELEASE_BUILDS[1].passives.filter(([id])=>id!=='luck')})).toThrow('Missing evolution recipe');
  for(const build of RELEASE_BUILDS){expect(build.weapons.length).toBeLessThanOrEqual(6);expect(build.passives.length).toBeLessThanOrEqual(6);for(const weapon of build.weapons)if(weapon.evolved)expect(build.passives.some(([id])=>id===S2_CONTENT.weaponById[weapon.id].evolution.passive),`${build.id}: ${weapon.id} recipe`).toBe(true);}
 });
 it('checks actual WOFF2 cmaps at both weights against the complete S1+S2 Han/CJK inventory and keeps the original fonts',()=>{
  const result=JSON.parse(execFileSync('python3',['scripts/subset-semester-fonts.py','--check'],{encoding:'utf8'}));expect(result.missing).toEqual([]);expect(result.required).toBeGreaterThan(1000);expect(result.weights).toEqual([400,600]);const ledger=json('font-src/s2/ledger.json');expect(ledger.license).toBe('SIL OFL 1.1');expect(ledger.outputs).toHaveLength(2);expect(ledger.existingFaces).toHaveLength(4);
 });
 it('pins the complete behavior/data/save/calendar/score/ratings closure, rejects a numeric source mutation, and opens the formal entry',async()=>{
  // JS auditor is the exact same implementation used by the CLI release gate.
  // @ts-expect-error Offline .mjs auditor intentionally has no runtime dependency declaration.
  const {S2_ACTIVE_BASELINE,auditSemesterTwo,semesterCatalogSnapshot}=await import('../../scripts/s2-freeze.mjs');
  const pin=json(S2_ACTIVE_BASELINE),metadata={versions:S2_RELEASE_VERSIONS,catalog:semesterCatalogSnapshot(S2_CONTENT),calendar:S2_RUNTIME_CONFIG.calendar,scoring:S2_SCORE_TABLE};expect(auditSemesterTwo(process.cwd(),pin,metadata).passed).toBe(true);
  const changed=auditSemesterTwo(process.cwd(),pin,metadata,(path:string)=>path==='src/semesters/s2/expo-final.ts'?Buffer.from(readFileSync(path,'utf8').replace('hp:110000','hp:110001')):readFileSync(path));expect(changed.passed).toBe(false);expect(changed.checks.filter((c:{passed:boolean})=>!c.passed).map((c:{name:string})=>c.name)).toContain('src/semesters/s2/expo-final.ts');
  const original=readFileSync('freeze/s2-v5.0.0.json');expect(original).toEqual(execFileSync('git',['show','872768f:freeze/s2-v5.0.0.json']));
  expect(readFileSync('freeze/s2-v5.0.1.json')).toEqual(execFileSync('git',['show','f2f4136:freeze/s2-v5.0.1.json']));
  const predecessor=auditSemesterTwo(process.cwd(),{...pin,predecessor:{...pin.predecessor,sha256:'0'.repeat(64)}},metadata);expect(predecessor.passed).toBe(false);
  for(const file of ['src/app/GameHost.tsx','src/app/semester-engine.ts','src/semesters/s2/adapter.ts','src/semesters/s2/presentation/SemesterUI.tsx','src/state/store.ts','vite.config.ts'])expect(pin.entryFiles[file],file).toBeDefined();
  const rewired=auditSemesterTwo(process.cwd(),pin,metadata,(path:string)=>path==='src/semesters/s2/adapter.ts'?Buffer.from(readFileSync(path,'utf8').replace("rulesVersion}","rulesVersion}-changed")):readFileSync(path));expect(rewired.passed).toBe(false);expect(rewired.checks.find((c:{name:string})=>c.name==='src/semesters/s2/adapter.ts').passed).toBe(false);
  for(const file of ['src/semesters/runtime/SemesterEngine.ts','src/semesters/s2/expo-final.ts','src/semesters/s2/legacy/ContentState.ts','src/semesters/s2/legacy/system.ts','src/semesters/s2/spool.ts','src/semesters/s2/settlement.ts','src/semesters/s2/rating.ts','src/semesters/inheritance.ts','src/save/v5/profile.ts'])expect(pin.runtimeFiles[file],file).toBeDefined();expect(SEMESTERS.s2.runtimeAvailable).toBe(true);expect(S2_RELEASE_VERSIONS).toMatchObject({score:'score-s2-v1',rating:'rating-s2-v1',daily:'daily-s2-v5.0.2',inheritance:'carry-v1'});
 });
 it('lets the weaker P12 base and medium mixed builds beat all three final phases at fixed110000 HP without healing',()=>{
  for(const i of [0,1]){const a=simulateReleaseBoss(i);expect(a.killed).toBe(true);expect(a.hp).toBe(110000);expect(a.fixedHp).toBe(true);expect(a.monotonic).toBe(true);expect(a.stages).toEqual([1,2,3]);expect(a.maxReduction).toBe(.30);expect(a.seconds).toBeLessThan(300);}
 });
 it('keeps both strong builds70–100s and repeats the exact P13 fixture deterministically',()=>{
  const first=simulateReleaseBoss(2);for(const a of [first,simulateReleaseBoss(3)]){expect(a.killed).toBe(true);expect(a.fixedHp&&a.monotonic).toBe(true);expect(a.stages).toEqual([1,2,3]);expect(a.maxReduction).toBe(.30);expect(a.seconds).toBeGreaterThanOrEqual(70);expect(a.seconds).toBeLessThanOrEqual(100);}expect(simulateReleaseBoss(2).seconds).toBe(first.seconds);
 });
 it('keeps the middle build inside the1500s full calendar and reproduces the untouched Boss2 old-build timing',()=>{
  const medium=simulateReleaseBoss(1,1).seconds+simulateReleaseBoss(1,2).seconds+simulateReleaseBoss(1).seconds;expect(960+medium).toBeLessThan(1500);expect(simulateReleaseBoss(0,2).seconds).toBe(59.72);
 });
});
