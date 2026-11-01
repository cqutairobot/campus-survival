import {RULES_VERSION,DAILY_RULES_VERSION} from '../data/daily';
import type {SaveProfile,SemesterId} from './profile';
import {hasAlumniEligibility} from './inheritance';
import {immutableSnapshot,type SemesterMetadata} from './types';

/** Menu metadata only. S2 rules, behavior and art are deliberately absent. */
export const SEMESTERS:Readonly<Record<SemesterId,SemesterMetadata>>=immutableSnapshot({
 s1:{id:'s1',name:'第一学期',contentVersion:'4.0.1',rulesVersion:RULES_VERSION,dailyRulesVersion:DAILY_RULES_VERSION,worldVersion:'campus-s1-v4.0.1',calendar:{weeks:22,weekSeconds:40,bossWeeks:[8,16,22],miniBossWeeks:[11,18],dailyLimitSeconds:1200},runtimeAvailable:true},
 s2:{id:'s2',name:'第二学期',contentVersion:'5.0.0',rulesVersion:'campus-s2-v5.0.2',dailyRulesVersion:'daily-s2-v5.0.2',worldVersion:'campus-s2-v5.0.0',calendar:{weeks:24,weekSeconds:40,bossWeeks:[8,16,24],miniBossWeeks:[6,13,20],dailyLimitSeconds:1500},runtimeAvailable:true},
});
export function semesterAccess(profile:SaveProfile,id:SemesterId){
 const eligible=id==='s1'||hasAlumniEligibility(profile),playable=eligible&&SEMESTERS[id].runtimeAvailable;
 return {eligible,playable,reason:!eligible?'通关第一学期普通模式后开放':'可开始新学期'};
}
/** Each semester has its own lazy adapter; eligibility is checked before loading. */
export async function loadSemesterRuntime(id:SemesterId,profile:SaveProfile){
 const access=semesterAccess(profile,id);if(!access.playable)throw Error(access.reason);
 if(id==='s1')return import('./s1/adapter');
 return import('./s2/adapter');
}
