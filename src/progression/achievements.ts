import {ACHIEVEMENTS} from '../data/achievements';
import type {RunResult,SaveData} from '../types';
export function awardAchievements(save:SaveData,result:RunResult):SaveData{
 if(result.debug)return save;
 const out=structuredClone(save),p=result.progress,isDaily=result.manifest?.mode==='daily';
 if(isDaily&&result.victory&&result.manifest?.date&&!out.daily.completedDates.includes(result.manifest.date))out.daily.completedDates.push(result.manifest.date);
 if(!isDaily&&p){out.stats.elites+=p.elites;out.stats.miniBosses+=p.miniBosses;out.stats.shieldKills+=p.shieldKills;out.stats.frozen+=p.frozen;out.stats.visits=[...new Set([...out.stats.visits,...p.visited])];}
 const values:Record<string,number>={exercise:out.stats.kills,proposal:Number(!!p?.bossIds.includes('proposal')),inspection:Number(out.stats.miniBosses>0),shieldBreaker:out.stats.shieldKills,structure:Number(p?.architect),calmResearch:p?.frozen??0,firstFusion:p?.fusions.length??0,survivor:out.stats.wins,ddl:p?.elites??0,breakthrough:p?.evolutions??0,headwind:Number(result.victory&&(p?.relics.length??0)>=2),guide:out.stats.visits.length,fusionMaster:new Set(p?.fusions).size,today:new Set(out.daily.completedDates).size};
 for(const a of ACHIEVEMENTS){if(!!a.daily!==isDaily)continue;const prev=out.achievements[a.id]??{progress:0,completed:false,claimed:false},progress=Math.min(a.goal,Math.max(prev.progress,values[a.id]??0)),completed=progress>=a.goal;out.achievements[a.id]={progress,completed,claimed:completed};if(completed){if(a.weapon&&!out.unlocks.weapons.includes(a.weapon))out.unlocks.weapons.push(a.weapon);if(a.region&&!out.unlocks.regions.includes(a.region))out.unlocks.regions.push(a.region);if(a.character&&!out.unlocked.includes(a.character))out.unlocked.push(a.character);}}
 return out;
}
