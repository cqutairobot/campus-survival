import {ENEMY_INDEX,PASSIVE_MAP,WEAPON_MAP} from '../data/catalog';
import {FUSION_MAP} from '../data/fusions';
import {PICKUP_MAP} from '../data/pickups';
import {RELIC_MAP} from '../data/relics';
import type {GameCommand} from '../types';
export const DEBUG_COMMANDS=new Set(['step','magnet','bomb','chest','week','boss','xp','frenzy','combo','spawn','damage','seed','evolve','grant','god','ultimateFull','spawnEnemy','prepareFusion','pickup','event','teleport','contract','unlockRun']);
export function validCommand(value:unknown):value is GameCommand{
 if(typeof value!=='object'||value===null||!('type'in value)||typeof value.type!=='string')return false;
 const v=value as Record<string,unknown>,type=value.type;
 if(['pause','resume','chestDone','evolutionDone','introDone','bossDeathDone','abandon','step','magnet','bomb','chest','ultimate','ultimateFull','contract','unlockRun'].includes(type))return true;
 if(type==='interact')return typeof v.held==='boolean';
 if(type==='chooseReward')return Number.isSafeInteger(v.token)&&Number.isInteger(v.index)&&Number(v.index)>=-1&&Number(v.index)<64;
 if(type==='choose')return Number.isInteger(v.index)&&Number(v.index)>=0&&Number(v.index)<3&&(v.token===undefined||Number.isSafeInteger(v.token));
 if(type==='grant')return typeof v.id==='string'&&(Object.hasOwn(WEAPON_MAP,v.id)||Object.hasOwn(PASSIVE_MAP,v.id))&&typeof v.level==='number'&&Number.isFinite(v.level)&&(v.evolved===undefined||typeof v.evolved==='boolean');
 if(type==='evolve')return typeof v.id==='string'&&Object.hasOwn(WEAPON_MAP,v.id)&&!WEAPON_MAP[v.id].fusion;
 if(type==='prepareFusion')return typeof v.id==='string'&&Object.hasOwn(FUSION_MAP,v.id);
 if(type==='pickup')return typeof v.id==='string'&&Object.hasOwn(PICKUP_MAP,v.id);
 if(type==='teleport')return typeof v.id==='string'&&['library','canteen','track','lab','workshop','garden'].includes(v.id);
 if(type==='event')return typeof v.id==='string'&&['portal','advisor','blackout','examRage','sports','rainstorm'].includes(v.id);
 if(type==='spawnEnemy')return typeof v.id==='string'&&Object.hasOwn(ENEMY_INDEX,v.id)&&(v.rank===undefined||['normal','elite','miniBoss','boss','bossAdd'].includes(String(v.rank)))&&(v.affixes===undefined||Array.isArray(v.affixes)&&v.affixes.length<=6&&v.affixes.every(x=>['split','shield','dash','deathBlast','aura','ranged'].includes(String(x))));
 if(type==='god')return typeof v.value==='boolean';
 return ['week','boss','xp','spawn','damage','seed','frenzy','combo'].includes(type)&&typeof v.value==='number'&&Number.isFinite(v.value);
}
export {RELIC_MAP};
