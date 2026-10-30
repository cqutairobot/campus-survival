import {WEAPONS,PASSIVES} from '../data/catalog';
import {ACHIEVEMENTS} from '../data/achievements';
export const DEFAULT_WEAPONS=WEAPONS.filter((_,i)=>i<16).map(w=>w.id).concat(['ruler','cryo']);
export const DEFAULT_PASSIVES=PASSIVES.map(p=>p.id);
export const DEFAULT_REGIONS=['library','canteen','track'];
type Raw=Record<string,unknown>;
const object=(x:unknown):Raw=>x&&typeof x==='object'&&!Array.isArray(x)?x as Raw:{};
/** Pure migrations are idempotent and never mutate or remove legacy storage. */
export function migrateV1ToV2(raw:Raw):Raw{return Number(raw.schemaVersion)===1?{...raw,schemaVersion:2,settledRuns:Array.isArray(raw.settledRuns)?[...raw.settledRuns]:[]}:structuredClone(raw);}
export function migrateV2ToV3(raw:Raw):Raw{
 if(Number(raw.schemaVersion)!==2)return structuredClone(raw);
 const stats=object(raw.stats),kills=typeof stats.kills==='number'&&Number.isFinite(stats.kills)?Math.max(0,stats.kills):0,wins=typeof stats.wins==='number'&&Number.isFinite(stats.wins)?Math.max(0,stats.wins):0,week=typeof stats.bestWeek==='number'&&Number.isFinite(stats.bestWeek)?stats.bestWeek:0;
 const achievements=Object.fromEntries(ACHIEVEMENTS.map(a=>{const progress=a.id==='exercise'?Math.min(500,kills):a.id==='survivor'?Math.min(1,wins):a.id==='proposal'?Number(wins>=1||week>=9):0;return[a.id,{progress,completed:progress>=a.goal,claimed:progress>=a.goal}];}));
 return{...structuredClone(raw),schemaVersion:3,unlocks:{weapons:[...DEFAULT_WEAPONS,...(kills>=500?['shuttle']:[]),...(wins>=1||week>=9?['prism']:[])],passives:[...DEFAULT_PASSIVES],regions:[...DEFAULT_REGIONS,...(wins>=1||week>=9?['lab']:[]),...(wins>=1?['garden']:[])]},achievements,discoveredEnemies:[],fusions:[],relics:[],events:[],regions:[],daily:{records:[],attempts:{},completedDates:[]},stats:{...stats,elites:0,miniBosses:0,shieldKills:0,frozen:0,visits:[]}};
}
