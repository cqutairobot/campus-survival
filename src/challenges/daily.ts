import {DAILY_RULES,DAILY_RULES_VERSION} from '../data/daily';
// Kept local to avoid a run-manifest/daily import cycle.
export function dailySeed(date:string,version=DAILY_RULES_VERSION){let h=2166136261;for(const c of `campus-v3|${version}|${date}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function beijingDate(now=new Date()){return new Date(now.getTime()+8*3600_000).toISOString().slice(0,10);}
export function dailyChallenge(date=beijingDate()){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw new Error('无效每日日期');const seed=dailySeed(date);return{date,version:DAILY_RULES_VERSION,seed,id:`${date}|${DAILY_RULES_VERSION}`,rule:DAILY_RULES[seed%DAILY_RULES.length]};}
