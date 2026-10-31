import {CHARACTERS,CONTENT_VERSION,ENEMIES,PASSIVES,PASSIVE_MAP,TALENTS,WEAPONS,WEAPON_MAP} from '../data/catalog';
import {FUSIONS} from '../data/fusions';
import {RELICS} from '../data/relics';
import {ACHIEVEMENTS} from '../data/achievements';
import {DAILY_RULES} from '../data/daily';
import type {DailyRecord,RunResult,SaveData,PersistenceState} from '../types';
import {diagnoseSave,recoveryDigest,recoveryPreview,type RecoverySource} from './recovery';
import {DEFAULT_PASSIVES,DEFAULT_REGIONS,DEFAULT_WEAPONS,migrateV1ToV2,migrateV2ToV3} from './migrations';
import {awardAchievements} from '../progression/achievements';
import {retainRecords} from '../challenges/scoring';
import {DEFAULT_SETTINGS,normalizeSettings} from './settings';
export {DEFAULT_SETTINGS} from './settings';
export const SAVE_KEY='campus-survival.save.v3',BACKUP_KEY='campus-survival.backup.v3';
export const LEGACY_KEYS=['campus-survival.save.v2','campus-survival.backup','campus-survival.save.v1'];
export function freshSave():SaveData{return{schemaVersion:3,contentVersion:CONTENT_VERSION,credits:0,unlocked:['balanced'],selected:'balanced',talents:{},discovered:['knife'],evolutions:[],settledRuns:[],unlocks:{weapons:[...DEFAULT_WEAPONS],passives:[...DEFAULT_PASSIVES],regions:[...DEFAULT_REGIONS]},achievements:Object.fromEntries(ACHIEVEMENTS.map(a=>[a.id,{progress:0,completed:false,claimed:false}])),discoveredEnemies:[],fusions:[],relics:[],events:[],regions:[],daily:{records:[],attempts:{},completedDates:[]},settings:{...DEFAULT_SETTINGS},stats:{runs:0,wins:0,kills:0,bestWeek:0,elites:0,miniBosses:0,shieldKills:0,frozen:0,visits:[]}};}
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const integer=(v:unknown,max=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?Math.min(max,Math.floor(v)):0;
const finite=(v:unknown,max=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?Math.min(max,v):0;
const strings=(v:unknown,max=10000)=>Array.isArray(v)?[...new Set(v.filter((x):x is string=>typeof x==='string'&&x.length<160))].slice(0,max):[];
const date=(v:unknown)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const regions=['library','canteen','track','lab','workshop','garden'],events=['portal','advisor','blackout','examRage','sports','rainstorm'];
function validDaily(value:unknown):DailyRecord|null{
 if(!record(value)||!date(value.date)||typeof value.id!=='string'||value.id.length>160||typeof value.version!=='string'||value.version.length>80||!DAILY_RULES.some(r=>r.id===value.rule)||!CHARACTERS.some(c=>c.id===value.character)||typeof value.score!=='number'||!Number.isFinite(value.score)||value.score<0||typeof value.seconds!=='number'||!Number.isFinite(value.seconds)||value.seconds<0||value.seconds>1201)return null;
 return{id:value.id,date:value.date as string,version:value.version,rule:String(value.rule),character:String(value.character),nickname:typeof value.nickname==='string'?value.nickname.slice(0,20):'校园研究生',score:integer(value.score),victory:value.victory===true,completedWeeks:integer(value.completedWeeks,22),seconds:finite(value.seconds,1200),build:strings(value.build,12).filter(id=>Object.hasOwn(WEAPON_MAP,id)||Object.hasOwn(PASSIVE_MAP,id)),relics:strings(value.relics,3).filter(id=>RELICS.some(r=>r.id===id)),averageCurse:finite(value.averageCurse,3),createdAt:finite(value.createdAt,1e14)};
}
/** Validate before persisting; unknown future schemas are never rewritten. */
export function validateSave(value:unknown):SaveData|null{
 if(!record(value)||![1,2,3].includes(value.schemaVersion as number)||typeof value.credits!=='number'||!Number.isFinite(value.credits)||value.credits<0)return null;
 const input=migrateV2ToV3(migrateV1ToV2(value)),out=freshSave();out.credits=integer(input.credits);
 out.unlocked=[...new Set(['balanced',...strings(input.unlocked,6).filter(id=>CHARACTERS.some(c=>c.id===id))])];out.selected=typeof input.selected==='string'&&out.unlocked.includes(input.selected)?input.selected:'balanced';
 if(record(input.talents))for(const t of TALENTS)out.talents[t.id]=integer(input.talents[t.id],5);
 out.discovered=[...new Set(['knife',...strings(input.discovered,44).filter(id=>Object.hasOwn(WEAPON_MAP,id)||Object.hasOwn(PASSIVE_MAP,id))])];out.evolutions=strings(input.evolutions,22).filter(id=>WEAPONS.some(w=>w.id===id));
 out.settledRuns=strings(input.settledRuns,100000);
 if(record(input.unlocks)){out.unlocks.weapons=[...new Set([...DEFAULT_WEAPONS,...strings(input.unlocks.weapons,22).filter(id=>WEAPONS.some(w=>w.id===id))])];out.unlocks.passives=[...new Set([...DEFAULT_PASSIVES,...strings(input.unlocks.passives,16).filter(id=>PASSIVES.some(p=>p.id===id))])];out.unlocks.regions=[...new Set([...DEFAULT_REGIONS,...strings(input.unlocks.regions,6).filter(id=>regions.includes(id))])];}
 if(record(input.achievements))for(const a of ACHIEVEMENTS){const x=input.achievements[a.id];if(record(x)){const progress=finite(x.progress,a.goal),completed=progress>=a.goal;out.achievements[a.id]={progress,completed,claimed:completed&&x.claimed===true};}}
 out.discoveredEnemies=strings(input.discoveredEnemies,32).filter(id=>ENEMIES.some(e=>e.id===id));out.fusions=strings(input.fusions,6).filter(id=>FUSIONS.some(f=>f.id===id));out.relics=strings(input.relics,6).filter(id=>RELICS.some(r=>r.id===id));out.events=strings(input.events,6).filter(id=>events.includes(id));out.regions=strings(input.regions,6).filter(id=>regions.includes(id));
 out.settings=normalizeSettings(input.settings);
 if(record(input.stats)){for(const k of ['runs','wins','kills','bestWeek','elites','miniBosses','shieldKills','frozen'] as const)out.stats[k]=finite(input.stats[k],k==='bestWeek'?22:1e9);out.stats.visits=strings(input.stats.visits,6).filter(id=>regions.includes(id));}
 if(record(input.daily)){if(Array.isArray(input.daily.records))out.daily.records=retainRecords(input.daily.records.slice(0,10000).map(validDaily).filter((r):r is DailyRecord=>!!r));out.daily.completedDates=strings(input.daily.completedDates,10000).filter(date);if(record(input.daily.attempts))for(const [key,count] of Object.entries(input.daily.attempts).slice(-1000))if(/^\d{4}-\d{2}-\d{2}\|[\w.-]{1,80}$/.test(key))out.daily.attempts[key]=integer(count,1e6);}
 return out;
}
export interface StorageLike{getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
export const RECOVERY_PREFIX='campus-survival.recovery.v3.';
export class SaveRepository{
 status='本地存档已就绪';state:PersistenceState='new';sources:RecoverySource[]=[];
 constructor(private storage:StorageLike|null){}
 private mark(state:PersistenceState,status:string){this.state=state;this.status=status;}
 load():SaveData{
  this.sources=[];this.mark('new','尚无存档 · 首次保存后保存在此设备');
  if(!this.storage){this.mark('unavailable','内存模式 · 存储不可用，可导出本页进度');return freshSave();}
  let future=false;
  for(const key of [SAVE_KEY,BACKUP_KEY,...LEGACY_KEYS]){
   let raw:string|null;try{raw=this.storage.getItem(key);}catch{this.mark('unavailable','内存模式 · 存储读取失败，可导出本页进度');return freshSave();}
   if(raw===null)continue;
   let parsed:unknown;try{parsed=JSON.parse(raw);}catch{/* Keep even empty strings and invalid JSON. */}
   if(key===SAVE_KEY&&record(parsed)&&Number(parsed.schemaVersion)>3)future=true;
   const save=validateSave(parsed);
   if(save){
    if(future){this.mark('future','未来版本原文已保留 · 内存模式');return save;}
    if(key===SAVE_KEY){this.mark('ready','本地存档已就绪');return save;}
    this.mark('fallback',key===BACKUP_KEY?'已恢复有效备份':'旧存档已迁移至 v3');
    const notice=this.status;try{this.protect(this.sources);this.storage.setItem(SAVE_KEY,JSON.stringify(save));this.mark('fallback',notice);}catch{this.mark('failed','备份已载入内存 · 写回失败，可导出');}return save;
   }
   this.sources.push({key,raw,reason:diagnoseSave(raw)});
  }
  if(future)this.mark('future','未来版本原文已保留 · 内存模式');
  else if(this.sources.length)this.mark('corrupt','内存模式 · 原档待恢复');
  return freshSave();
 }
 private canWrite(){
  if(['corrupt','future','unavailable'].includes(this.state)||!this.storage){
   this.status=this.state==='corrupt'?'内存模式 · 原档待恢复':this.state==='future'?'未来版本原文已保留 · 可导出内存进度':'内存模式 · 本次进度无法保存';return false;
  }return true;
 }
 write(save:SaveData){
  if(!this.canWrite())return false;
  const validated=validateSave(save);if(!validated)return false;
  try{
   const previous=this.storage!.getItem(SAVE_KEY);
   if(previous!==null){
    let old:unknown;try{old=JSON.parse(previous);}catch{/* Preserve any valid backup. */}
    if(record(old)&&Number(old.schemaVersion)>3){this.sources=[{key:SAVE_KEY,raw:previous,reason:diagnoseSave(previous)}];this.mark('future','未来版本原文已保留 · 内存模式');return false;}
    // A malformed external replacement is protected even if load() preceded it.
    if(!validateSave(old)){this.sources=[{key:SAVE_KEY,raw:previous,reason:diagnoseSave(previous)}];this.mark('corrupt','内存模式 · 原档待恢复');return false;}
    let futureBackup=false;try{const backup=this.storage!.getItem(BACKUP_KEY);futureBackup=backup!==null&&Number(JSON.parse(backup).schemaVersion)>3;}catch{/* Invalid backups can be replaced by a valid one. */}
    if(!futureBackup)this.storage!.setItem(BACKUP_KEY,previous);
   }
   this.storage!.setItem(SAVE_KEY,JSON.stringify(validated));this.mark('ready','已保存在此设备');return true;
  }catch{this.mark('failed','保存失败 · 可导出存档备份');return false;}
 }
 /** Archive all originals without borrowing the rotating backup slot. */
 private protect(sources:RecoverySource[]){
  for(const source of sources){
   const base=RECOVERY_PREFIX+recoveryDigest(source.raw);let key=base;
   for(let slot=0;;slot++){
    key=slot?`${base}.${slot}`:base;const existing=this.storage!.getItem(key);
    if(existing===source.raw)break;
    if(existing!==null)continue;
    this.storage!.setItem(key,source.raw);if(this.storage!.getItem(key)!==source.raw)throw Error('原文回读核对失败');break;
   }
  }
 }
 commitRecovery(kind:'fields'|'reset',sourceIndex=0):SaveData|null{
  if(!this.storage||this.state==='future'||this.state==='unavailable'){this.status='原文保护仍生效 · 无法写入设备';return null;}
  const candidate=kind==='reset'?freshSave():recoveryPreview(this.sources[sourceIndex]?.raw??'')?.save;
  if(!candidate){this.status='无法按字段恢复此原文';return null;}
  try{
   // Recheck before archiving or replacing; an external change needs a fresh preview.
   for(const s of kind==='fields'||this.state==='corrupt'?this.sources:[])if(this.storage.getItem(s.key)!==s.raw)throw Error('原文已在别处变化，请刷新');
   const originals=[...this.sources];
   if(kind==='reset')for(const key of [SAVE_KEY,BACKUP_KEY,...LEGACY_KEYS]){const raw=this.storage.getItem(key);if(raw!==null&&!originals.some(s=>s.key===key))originals.push({key,raw,reason:'重置前原文'});}
   for(const s of originals){let v:unknown;try{v=JSON.parse(s.raw);}catch{}if(record(v)&&Number(v.schemaVersion)>3)throw Error('未来版本原文不能重置');}
   this.protect(originals);
   this.storage.setItem(SAVE_KEY,JSON.stringify(candidate));
   if(kind==='reset')for(const key of [BACKUP_KEY,...LEGACY_KEYS])this.storage.removeItem(key);
   this.sources=originals;this.mark('ready',kind==='reset'?'已保留原文并重置，已保存在此设备':'已按字段恢复并保存，恢复前原文可导出');return candidate;
  }catch(e){this.status=`恢复未完成 · ${e instanceof Error?e.message:'写入失败'} · 原文可导出`;return null;}
 }
 reset(){return this.commitRecovery('reset');}
}
export function settleRun(save:SaveData,result:RunResult):SaveData{
 if(save.settledRuns.includes(result.id)||result.debug)return save;
 const daily=result.manifest?.mode==='daily',out=structuredClone(save);out.settledRuns.push(result.id);
 if(!daily){out.credits+=result.credits;out.stats.runs++;out.stats.wins+=Number(result.victory);out.stats.kills+=result.progress?.normalKills??result.kills;out.stats.bestWeek=Math.max(out.stats.bestWeek,result.week);}
 if(daily&&result.dailyRecord)out.daily.records=retainRecords([...out.daily.records,result.dailyRecord]);
 if(result.progress){for(const key of ['fusions','relics','events','regions','discoveredEnemies'] as const){const from=key==='regions'?result.progress.visited:key==='discoveredEnemies'?result.progress.enemies:result.progress[key];out[key]=[...new Set([...out[key],...from])];}}
 return awardAchievements(out,result);
}
