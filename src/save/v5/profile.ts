import {CHARACTERS,ENEMIES,PASSIVES,WEAPONS,CONTENT_VERSION} from '../../data/catalog';
import {FUSIONS} from '../../data/fusions';
import {RELICS} from '../../data/relics';
import {DAILY_RULES} from '../../data/daily';
import {freshSave,settleRun,validateSave} from '../storage';
import {recoveryDigest} from '../recovery';
import {compareDaily} from '../../challenges/scoring';
import {S2_IDS} from '../../semesters/catalog-ids';
import {validInheritanceChoice} from '../../semesters/inheritance';
import {PRODUCT_VERSION,type Graduation,type Rating,type RunSummary,type SaveProfile,type SemesterDailyRecord,type SemesterHistory,type SemesterId,type SemesterResult} from '../../semesters/profile';
import type {RunResult,SaveData} from '../../types';

export const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:unknown):string[]=>Array.isArray(v)?[...new Set(v.filter((x):x is string=>typeof x==='string'&&x.length<160))]:[];
const ids=(v:unknown,allowed:readonly string[])=>strings(v).filter(id=>allowed.includes(id));
const number=(v:unknown,max=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?Math.min(max,v):0;
const date=(v:unknown):v is string=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export const S1_IDS={weapons:WEAPONS.map(w=>w.id),passives:PASSIVES.map(p=>p.id),fusions:FUSIONS.map(f=>f.id),enemies:ENEMIES.map(e=>e.id),relics:RELICS.map(r=>r.id),events:['portal','advisor','blackout','examRage','sports','rainstorm'],regions:['library','canteen','track','lab','workshop','garden']};
const all=(kind:keyof typeof S1_IDS):string[]=>[...S1_IDS[kind],...S2_IDS[kind]];
const emptyHistory=():SemesterHistory=>({graduation:null,bestRating:null,recentRuns:[]});
function legacyEvidence(save:SaveData):Graduation|null{return save.stats.wins>=1?{source:'legacyWins'}:save.achievements.survivor?.progress>=1?{source:'legacyAchievement'}:null;}
export function freshProfile():SaveProfile{
 const s=freshSave();return {...s,schemaVersion:4,contentVersion:PRODUCT_VERSION,selectedSemester:'s1',semesters:{s1:emptyHistory(),s2:{...emptyHistory(),unlocks:{weapons:[...S2_IDS.weapons],passives:[...S2_IDS.passives],regions:[...S2_IDS.regions]},achievements:Object.fromEntries(S2_IDS.achievements.map(id=>[id,{progress:0,completed:false,claimed:false}])),stats:structuredClone(s.stats)}},inheritance:{version:'carry-v1',alumniEligible:false,choice:{id:'supply'}},daily:{records:[],attempts:{},completedKeys:[]},migration:{fromSchema:4,fromContentVersion:PRODUCT_VERSION,legacyDigest:null}};
}
export function migrateV3ToV4(save:SaveData,origin:{schemaVersion:number;contentVersion?:unknown;raw?:string}={schemaVersion:3}):SaveProfile{
 const out=freshProfile(),graduation=legacyEvidence(save);
 Object.assign(out,structuredClone(save),{schemaVersion:4,contentVersion:PRODUCT_VERSION});
 out.semesters.s1.graduation=graduation;out.inheritance.alumniEligible=!!graduation;out.selectedSemester=graduation?'s2':'s1';
 out.daily={records:save.daily.records.map(r=>({...r,semesterId:'s1'})),attempts:Object.fromEntries(Object.entries(save.daily.attempts).map(([k,v])=>[`s1|${k}`,v])),completedKeys:save.daily.completedDates.map(d=>`s1|${d}`)};
 out.migration={fromSchema:origin.schemaVersion,fromContentVersion:typeof origin.contentVersion==='string'?origin.contentVersion:save.contentVersion,legacyDigest:recoveryDigest(origin.raw??JSON.stringify(save))};return out;
}
/** Pure S1 projection: new IDs, daily state and semester containers never enter old validators. */
export function toLegacyS1Save(profile:SaveProfile):SaveData{
 const out=freshSave();
 for(const key of ['credits','unlocked','selected','talents','settledRuns','unlocks','achievements','settings','stats','persistence'] as const)if(profile[key]!==undefined)Object.assign(out,{[key]:structuredClone(profile[key])});
 out.discovered=ids(profile.discovered,[...S1_IDS.weapons,...S1_IDS.passives,...S1_IDS.fusions]);out.evolutions=ids(profile.evolutions,S1_IDS.weapons);
 for(const [key,kind] of [['discoveredEnemies','enemies'],['fusions','fusions'],['relics','relics'],['events','events'],['regions','regions']] as const)out[key]=ids(profile[key],S1_IDS[kind]);
 out.daily={records:profile.daily.records.filter(r=>r.semesterId==='s1').map(({semesterId:_,...r})=>r),attempts:Object.fromEntries(Object.entries(profile.daily.attempts).filter(([k])=>k.startsWith('s1|')).map(([k,v])=>[k.slice(3),v])),completedDates:profile.daily.completedKeys.filter(k=>k.startsWith('s1|')).map(k=>k.slice(3))};return out;
}
function graduation(v:unknown):Graduation|null{
 if(!object(v))return null;
 if(v.source==='legacyWins'||v.source==='legacyAchievement')return {source:v.source};
 return v.source==='normalRun'&&typeof v.runId==='string'&&v.runId.length>0&&v.runId.length<160?{source:'normalRun',runId:v.runId}:null;
}
function rating(v:unknown,semesterId:SemesterId):Rating|null{
 if(!object(v)||!['S','A','B','C'].includes(String(v.grade))||typeof v.value!=='number'||!Number.isFinite(v.value)||v.value<0||typeof v.ratingVersion!=='string'||typeof v.rulesVersion!=='string'||typeof v.runId!=='string'||v.semesterId!==semesterId)return null;
 return {grade:v.grade as Rating['grade'],value:v.value,ratingVersion:v.ratingVersion,rulesVersion:v.rulesVersion,semesterId,runId:v.runId};
}
function history(v:unknown,semesterId:SemesterId):SemesterHistory{
 if(!object(v))return emptyHistory();
 const recentRuns:RunSummary[]=[];
 if(Array.isArray(v.recentRuns))for(const r of v.recentRuns){if(!object(r)||typeof r.id!=='string'||typeof r.rulesVersion!=='string'||r.semesterId!==semesterId||recentRuns.some(x=>x.id===r.id))continue;recentRuns.push({id:r.id,semesterId,rulesVersion:r.rulesVersion,victory:r.victory===true,week:number(r.week,semesterId==='s1'?22:24),seconds:number(r.seconds),build:ids(r.build,[...all('weapons'),...all('passives'),...all('fusions')]).slice(0,12),rating:rating(r.rating,semesterId)});}
 return {graduation:graduation(v.graduation),bestRating:rating(v.bestRating,semesterId),recentRuns:recentRuns.slice(-10)};
}
/** Per-semester retention and dedup; S1 versions/scores/IDs remain unchanged. */
export function retainSemesterRecords(records:SemesterDailyRecord[]):SemesterDailyRecord[]{
 return (['s1','s2'] as const).flatMap(semester=>{
  const own=records.filter(r=>r.semesterId===semester),latest=own.map(r=>r.date).sort().at(-1),cutoff=latest?new Date(Date.parse(latest)-29*86400000).toISOString().slice(0,10):'',seen=new Set<string>(),counts=new Map<string,number>();
  return own.sort(compareDaily).filter(r=>{if(r.date<cutoff||seen.has(r.id))return false;seen.add(r.id);const k=`${r.date}|${r.version}`,n=counts.get(k)??0;counts.set(k,n+1);return n<10;});
 });
}
function dailyRecord(v:unknown):SemesterDailyRecord|null{
 if(!object(v)||!['s1','s2'].includes(String(v.semesterId))||!date(v.date)||typeof v.id!=='string'||v.id.length>160||typeof v.version!=='string'||v.version.length>80||!DAILY_RULES.some(r=>r.id===v.rule)||!CHARACTERS.some(c=>c.id===v.character)||typeof v.score!=='number'||!Number.isFinite(v.score)||v.score<0||typeof v.seconds!=='number'||!Number.isFinite(v.seconds)||v.seconds<0||v.seconds>(v.semesterId==='s1'?1200:1500)+1)return null;
 const semesterId=v.semesterId as SemesterId,allowed=semesterId==='s1'?S1_IDS:{weapons:all('weapons'),passives:all('passives'),fusions:all('fusions'),relics:all('relics')};
 return {semesterId,id:v.id,date:v.date,version:v.version,rule:String(v.rule),character:String(v.character),nickname:typeof v.nickname==='string'?v.nickname.slice(0,20):'校园研究生',score:Math.floor(number(v.score)),victory:v.victory===true,completedWeeks:Math.floor(number(v.completedWeeks,semesterId==='s1'?22:24)),seconds:number(v.seconds,semesterId==='s1'?1200:1500),build:ids(v.build,[...allowed.weapons,...allowed.passives,...allowed.fusions]).slice(0,12),relics:ids(v.relics,allowed.relics).slice(0,3),averageCurse:number(v.averageCurse,3),createdAt:number(v.createdAt,1e14)};
}
export function validateProfile(value:unknown,raw?:string):SaveProfile|null{
 if(!object(value))return null;
 if([1,2,3].includes(Number(value.schemaVersion))){const old=validateSave(value);if(!old)return null;const out=migrateV3ToV4(old,{schemaVersion:Number(value.schemaVersion),contentVersion:value.contentVersion,raw:raw??JSON.stringify(value)});out.settledRuns=strings(value.settledRuns);return out;}
 if(value.schemaVersion!==4)return null;
 // Explicitly construct legacy common fields; never pass schema 4 to validateSave.
 const common:Record<string,unknown>={schemaVersion:3,contentVersion:CONTENT_VERSION};
 for(const key of ['credits','unlocked','selected','talents','unlocks','achievements','settings','stats','persistence'])if(Object.hasOwn(value,key))common[key]=value[key];
 const old=validateSave(common);if(!old)return null;
 const out=freshProfile();Object.assign(out,old,{schemaVersion:4,contentVersion:PRODUCT_VERSION});out.settledRuns=strings(value.settledRuns);
 out.discovered=ids(value.discovered,[...all('weapons'),...all('passives'),...all('fusions')]);if(!out.discovered.includes('knife'))out.discovered.unshift('knife');out.evolutions=ids(value.evolutions,all('weapons'));
 for(const [key,kind] of [['discoveredEnemies','enemies'],['fusions','fusions'],['relics','relics'],['events','events'],['regions','regions']] as const)out[key]=ids(value[key],all(kind));
 const semesters=object(value.semesters)?value.semesters:{};
 out.semesters.s1=history(semesters.s1,'s1');out.semesters.s1.graduation??=legacyEvidence(old);
 Object.assign(out.semesters.s2,history(semesters.s2,'s2'));
 if(object(semesters.s2)){
  const s2=semesters.s2;
  if(object(s2.unlocks))for(const k of ['weapons','passives','regions'] as const)out.semesters.s2.unlocks[k]=[...new Set([...S2_IDS[k],...ids(s2.unlocks[k],all(k))])];
  if(object(s2.stats)){for(const k of ['runs','wins','kills','bestWeek','elites','miniBosses','shieldKills','frozen'] as const)out.semesters.s2.stats[k]=number(s2.stats[k],k==='bestWeek'?24:1e9);out.semesters.s2.stats.visits=ids(s2.stats.visits,all('regions'));}
  if(object(s2.achievements))for(const id of S2_IDS.achievements){const a=s2.achievements[id];if(object(a))out.semesters.s2.achievements[id]={progress:number(a.progress),completed:a.completed===true,claimed:a.completed===true&&a.claimed===true};}
 }
 out.inheritance.alumniEligible=!!out.semesters.s1.graduation;out.selectedSemester=value.selectedSemester==='s2'&&out.inheritance.alumniEligible?'s2':'s1';
 if(object(value.inheritance)&&validInheritanceChoice(out,value.inheritance.choice)){const choice=value.inheritance.choice;out.inheritance.choice=choice.id==='topic'?{id:'topic',weaponId:choice.weaponId}:{id:choice.id};}
 out.daily={records:[],attempts:{},completedKeys:[]};
 if(object(value.daily)){
  if(Array.isArray(value.daily.records))out.daily.records=retainSemesterRecords(value.daily.records.map(dailyRecord).filter((r):r is SemesterDailyRecord=>!!r));
  if(object(value.daily.attempts))for(const [k,v] of Object.entries(value.daily.attempts))if(/^s[12]\|\d{4}-\d{2}-\d{2}\|[\w.-]{1,80}$/.test(k)&&date(k.split('|')[1]))out.daily.attempts[k]=Math.floor(number(v,1e6));
  out.daily.completedKeys=strings(value.daily.completedKeys).filter(k=>/^s[12]\|/.test(k)&&date(k.slice(3)));
 }
 if(object(value.migration))out.migration={fromSchema:number(value.migration.fromSchema,4),fromContentVersion:typeof value.migration.fromContentVersion==='string'?value.migration.fromContentVersion:PRODUCT_VERSION,legacyDigest:typeof value.migration.legacyDigest==='string'?value.migration.legacyDigest:null};
 return out;
}
function summarize(out:SaveProfile,result:RunResult|SemesterResult,semesterId:SemesterId){
 const history=out.semesters[semesterId];history.recentRuns=[...history.recentRuns,{id:result.id,semesterId,rulesVersion:result.manifest?.rulesVersion??(semesterId==='s1'?'campus-v4.0.1':'campus-s2-v5.0.0'),victory:result.victory,week:result.week,seconds:result.seconds,build:[...result.weapons,...result.passives].map(w=>w.id),rating:null}].slice(-10);
 if(result.victory&&result.manifest?.mode!=='daily')history.graduation??={source:'normalRun',runId:result.id};
 out.inheritance.alumniEligible=!!out.semesters.s1.graduation;
}
export function settleS1Profile(profile:SaveProfile,result:RunResult):SaveProfile{
 if(profile.settledRuns.includes(result.id)||result.debug)return profile;
 const before=toLegacyS1Save(profile),after=settleRun(before,result),out=structuredClone(profile);
 out.credits+=after.credits-before.credits;
 for(const key of ['unlocked','unlocks','achievements','stats'] as const)Object.assign(out,{[key]:after[key]});
 out.settledRuns.push(result.id);
 for(const key of ['discovered','evolutions','discoveredEnemies','fusions','relics','events','regions'] as const)out[key]=[...new Set([...out[key],...after[key]])];
 out.daily.records=retainSemesterRecords([...out.daily.records.filter(r=>r.semesterId!=='s1'),...after.daily.records.map(r=>({...r,semesterId:'s1' as const}))]);
 out.daily.completedKeys=[...new Set([...out.daily.completedKeys,...after.daily.completedDates.map(d=>`s1|${d}`)])];
 summarize(out,result,'s1');return out;
}
export function settleS2Profile(profile:SaveProfile,result:SemesterResult):SaveProfile{
 if(profile.settledRuns.includes(result.id)||result.debug||result.practice)return profile;
 const out=structuredClone(profile),daily=result.manifest?.mode==='daily',s2=out.semesters.s2;
 out.settledRuns.push(result.id);
 if(!daily){out.credits+=number(result.credits);s2.stats.runs++;s2.stats.wins+=Number(result.victory);s2.stats.kills+=result.progress?.normalKills??result.kills;s2.stats.bestWeek=Math.max(s2.stats.bestWeek,Math.min(24,result.week));if(result.progress){for(const k of ['elites','miniBosses','shieldKills','frozen'] as const)s2.stats[k]+=result.progress[k];s2.stats.visits=[...new Set([...s2.stats.visits,...result.progress.visited])];}}
 if(daily&&result.dailyRecord?.semesterId==='s2')out.daily.records=retainSemesterRecords([...out.daily.records,result.dailyRecord]);
 if(daily&&result.victory&&result.manifest?.date)out.daily.completedKeys=[...new Set([...out.daily.completedKeys,`s2|${result.manifest.date}`])];
 if(result.progress)for(const [key,from] of [['discoveredEnemies','enemies'],['fusions','fusions'],['relics','relics'],['events','events'],['regions','visited']] as const)out[key]=[...new Set([...out[key],...result.progress[from]])];
 summarize(out,result,'s2');return out;
}
