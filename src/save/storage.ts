import {CHARACTERS,CONTENT_VERSION,ENEMIES,PASSIVES,PASSIVE_MAP,TALENTS,WEAPONS,WEAPON_MAP} from '../data/catalog';
import {FUSIONS} from '../data/fusions';
import {RELICS} from '../data/relics';
import {ACHIEVEMENTS} from '../data/achievements';
import {DAILY_RULES} from '../data/daily';
import type {DailyRecord,RunResult,SaveData,Settings} from '../types';
import {clamp} from '../core/math';
import {DEFAULT_PASSIVES,DEFAULT_REGIONS,DEFAULT_WEAPONS,migrateV1ToV2,migrateV2ToV3} from './migrations';
import {awardAchievements} from '../progression/achievements';
import {retainRecords} from '../challenges/scoring';
export const SAVE_KEY='campus-survival.save.v3',BACKUP_KEY='campus-survival.backup.v3';
export const LEGACY_KEYS=['campus-survival.save.v2','campus-survival.backup','campus-survival.save.v1'];
export const DEFAULT_SETTINGS:Settings={master:.65,music:.35,sfx:.7,muted:false,quality:'high',shake:.6,flash:.65,motion:true,damageNumbers:true,afterimages:true,haptics:true,quickChest:true,nickname:'校园研究生'};
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
 if(record(input.settings)){const s=input.settings;for(const k of ['master','music','sfx','shake','flash'] as const)if(typeof s[k]==='number'&&Number.isFinite(s[k]))out.settings[k]=clamp(s[k],0,1);for(const k of ['muted','motion','damageNumbers','afterimages','haptics','quickChest'] as const)if(typeof s[k]==='boolean')out.settings[k]=s[k];if(['auto','high','medium','low'].includes(String(s.quality)))out.settings.quality=s.quality as Settings['quality'];if(typeof s.nickname==='string')out.settings.nickname=s.nickname.trim().slice(0,20)||'校园研究生';}
 if(record(input.stats)){for(const k of ['runs','wins','kills','bestWeek','elites','miniBosses','shieldKills','frozen'] as const)out.stats[k]=finite(input.stats[k],k==='bestWeek'?22:1e9);out.stats.visits=strings(input.stats.visits,6).filter(id=>regions.includes(id));}
 if(record(input.daily)){if(Array.isArray(input.daily.records))out.daily.records=retainRecords(input.daily.records.slice(0,10000).map(validDaily).filter((r):r is DailyRecord=>!!r));out.daily.completedDates=strings(input.daily.completedDates,10000).filter(date);if(record(input.daily.attempts))for(const [key,count] of Object.entries(input.daily.attempts).slice(-1000))if(/^\d{4}-\d{2}-\d{2}\|[\w.-]{1,80}$/.test(key))out.daily.attempts[key]=integer(count,1e6);}
 return out;
}
export interface StorageLike{getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
export class SaveRepository{
 status='本地存档已就绪';private future=false;
 constructor(private storage:StorageLike|null){}
 load():SaveData{
  if(!this.storage){this.status='临时模式 · 存储不可用';return freshSave();}
  for(const key of [SAVE_KEY,BACKUP_KEY,...LEGACY_KEYS])try{const raw=this.storage.getItem(key);if(!raw)continue;const parsed:unknown=JSON.parse(raw);if(key===SAVE_KEY&&record(parsed)&&Number(parsed.schemaVersion)>3){this.future=true;this.status='发现未来版本存档 · 使用内存模式，保留原文';}const save=validateSave(parsed);if(save){if(key!==SAVE_KEY){this.status=key===BACKUP_KEY?'已恢复有效备份':'旧存档已迁移至 v3';this.write(save);if(key===BACKUP_KEY)this.status='已恢复有效备份';}return save;}}catch{this.status='读取失败 · 尝试有效备份';}
  return freshSave();
 }
 write(save:SaveData){if(!this.storage||this.future){this.status=this.future?'未来版本原文已保留 · 可导出内存进度':'临时模式 · 本次进度无法保存';return false;}const validated=validateSave(save);if(!validated)return false;try{const previous=this.storage.getItem(SAVE_KEY);if(previous){try{const old=JSON.parse(previous);if(Number(old.schemaVersion)>3){this.future=true;return false;}if(validateSave(old)){let futureBackup=false;try{const backup=this.storage.getItem(BACKUP_KEY);futureBackup=!!backup&&Number(JSON.parse(backup).schemaVersion)>3;}catch{/* Invalid backups can be replaced by a valid one. */}if(!futureBackup)this.storage.setItem(BACKUP_KEY,previous);}}catch{/* Preserve a good backup. */}}this.storage.setItem(SAVE_KEY,JSON.stringify(validated));this.status='已保存在此设备';return true;}catch{this.status='保存失败 · 可导出存档备份';return false;}}
 reset(){try{for(const key of [SAVE_KEY,BACKUP_KEY,...LEGACY_KEYS])this.storage?.removeItem(key);}catch{/* Keep an in-memory save. */}this.future=false;return freshSave();}
}
export function settleRun(save:SaveData,result:RunResult):SaveData{
 if(save.settledRuns.includes(result.id)||result.debug)return save;
 const daily=result.manifest?.mode==='daily',out=structuredClone(save);out.settledRuns.push(result.id);
 if(!daily){out.credits+=result.credits;out.stats.runs++;out.stats.wins+=Number(result.victory);out.stats.kills+=result.progress?.normalKills??result.kills;out.stats.bestWeek=Math.max(out.stats.bestWeek,result.week);}
 if(daily&&result.dailyRecord)out.daily.records=retainRecords([...out.daily.records,result.dailyRecord]);
 if(result.progress){for(const key of ['fusions','relics','events','regions','discoveredEnemies'] as const){const from=key==='regions'?result.progress.visited:key==='discoveredEnemies'?result.progress.enemies:result.progress[key];out[key]=[...new Set([...out[key],...from])];}}
 return awardAchievements(out,result);
}
