import {SEMESTERS} from '../registry';
import {beijingDate} from '../../challenges/daily';
import {DAILY_RULES} from '../../data/daily';
import type {SemesterDailyRecord,SemesterId} from '../profile';
import type {S2DailyAssignment} from '../inheritance';
import {compareDaily} from '../../challenges/scoring';
export const S2_DAILY_VERSION=SEMESTERS.s2.dailyRulesVersion;
export const S2_DAILY_RULES=DAILY_RULES.map(rule=>({...rule,pressure:rule.id==='assistants'?'精英多一个词条；第 1-8 / 9-16 / 17-24 周上限为 1 / 2 / 3':rule.id==='nightRun'?'每 90 教学秒安排停电 18 秒；避开教学、考核和已有事件':rule.pressure}));
export const S2_SCORE_TABLE={week:1000,normal:4,elite:600,miniBoss:3000,mainBoss:5000,victory:20000,elective:1000,timePerSecond:20,limitSeconds:1500,riskPerLayer:.05} as const;
export function s2DailySeed(date:string,version=S2_DAILY_VERSION){let h=2166136261;for(const c of `campus|s2|${version}|${date}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function s2DailyChallenge(date=beijingDate()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('无效每日日期');
 const seed=s2DailySeed(date),rule=S2_DAILY_RULES[seed%S2_DAILY_RULES.length],inheritance:S2DailyAssignment['inheritance']=(seed>>>8)%3===0?{id:'supply'}:(seed>>>8)%3===1?{id:'notes'}:{id:'topic',weaponId:'s2:drone'};
 return{date,version:S2_DAILY_VERSION,seed,id:`s2|${date}|${S2_DAILY_VERSION}`,rule,assignment:{seed,date,rule:rule.id,character:rule.character,inheritance} satisfies S2DailyAssignment};
}
export function semesterBoard(records:readonly SemesterDailyRecord[],semesterId:SemesterId,date:string,version:string){return records.filter(r=>r.semesterId===semesterId&&r.date===date&&r.version===version).sort(compareDaily);}
export function boardSelection(records:readonly SemesterDailyRecord[],semesterId:SemesterId,today:string,currentVersion:string,date=today,version=currentVersion){const own=records.filter(r=>r.semesterId===semesterId),dates=[...new Set([today,...own.map(r=>r.date)])].sort().reverse(),selectedDate=dates.includes(date)?date:today,versions=[...new Set([currentVersion,...own.filter(r=>r.date===selectedDate).map(r=>r.version)])];return{dates,date:selectedDate,versions,version:versions.includes(version)?version:currentVersion};}
