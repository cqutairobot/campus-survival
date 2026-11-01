import {SEMESTERS} from './registry';
import {CHARACTERS,PASSIVES,TALENTS,WEAPONS} from '../data/catalog';
import {S2_IDS} from './catalog-ids';
import type {SaveProfile} from './profile';
import {immutableSnapshot,type InheritanceChoice,type InheritanceSnapshot,type S2RunSnapshot} from './types';

/** A standalone alumniEligible flag or selected semester is never evidence. */
export function hasAlumniEligibility(profile:SaveProfile){
 const g=profile.semesters.s1.graduation;
 return profile.stats.wins>=1||profile.achievements.survivor?.progress>=1||!!g&&(g.source==='legacyWins'||g.source==='legacyAchievement'||g.source==='normalRun'&&typeof g.runId==='string'&&g.runId.length>0);
}
export function inheritedWeaponIds(profile:SaveProfile){
 return [...new Set([...profile.unlocks.weapons.filter(id=>WEAPONS.some(w=>w.id===id)),...S2_IDS.weapons])];
}
export function validInheritanceChoice(profile:SaveProfile,value:unknown):value is InheritanceChoice{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;const v=value as Record<string,unknown>;
 return v.id==='supply'||v.id==='notes'||v.id==='topic'&&typeof v.weaponId==='string'&&inheritedWeaponIds(profile).includes(v.weaponId);
}
function inheritance(choice:InheritanceChoice):InheritanceSnapshot{
 if(choice.id==='supply')return {version:'carry-v1',id:'supply',shield:15,durationSeconds:60};
 if(choice.id==='notes')return {version:'carry-v1',id:'notes',xpMultiplier:1.08,durationSeconds:120};
 return {version:'carry-v1',id:'topic',weapon:{id:choice.weaponId,level:1,rarity:0,evolved:false}};
}
/** Fixed daily assignments will come from S2's future daily rules, never the personal choice. */
export interface S2DailyAssignment {seed:number;date:string;rule:string;character:string;inheritance:InheritanceChoice}
export function createS2PreviewSnapshot(profile:SaveProfile,seed:number,options:{mode?:'normal';choice?:InheritanceChoice}|{mode:'daily';assignment:S2DailyAssignment}={}):S2RunSnapshot{
 if(!hasAlumniEligibility(profile))throw Error('通关第一学期普通模式后开放');
 const daily=options.mode==='daily',assignment=daily?options.assignment:null;
 const choice=assignment?.inheritance??(!daily&&options.choice||profile.inheritance.choice);
 const dailyProfile=daily?{...profile,unlocks:{...profile.unlocks,weapons:WEAPONS.map(w=>w.id)}}:profile;
 if(!validInheritanceChoice(dailyProfile,choice))throw Error('继承项或基础武器未解锁');
 const character=assignment?.character??profile.selected,c=CHARACTERS.find(c=>c.id===character);if(!c)throw Error('无法识别研究生');
 const selected=inheritance(choice),initialWeapon=selected.id==='topic'?selected.weapon:{id:c.weapon,level:1 as const,rarity:0 as const,evolved:false as const};
 return immutableSnapshot({semesterId:'s2',contentVersion:'5.0.0',rulesVersion:daily?SEMESTERS.s2.dailyRulesVersion:SEMESTERS.s2.rulesVersion,worldVersion:'campus-s2-v5.0.0',mode:daily?'daily':'normal',seed:(assignment?.seed??seed)>>>0,character,talents:daily?Object.fromEntries(TALENTS.map(t=>[t.id,3])):{...profile.talents},weapons:inheritedWeaponIds(dailyProfile),passives:[...new Set([...(daily?S1PassiveIds:profile.unlocks.passives),...S2_IDS.passives])],regions:[...new Set([...(daily?['library','canteen','track','lab','workshop','garden']:profile.unlocks.regions),...S2_IDS.regions])],initialWeapon,inheritance:selected,eligible:true,...(assignment?{date:assignment.date,dailyRule:assignment.rule}:{})});
}
const S1PassiveIds=PASSIVES.map(p=>p.id);
