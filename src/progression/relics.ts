import {clamp} from '../core/math';
import type {PlayerStats} from '../types';
export function clampStats(s:PlayerStats):PlayerStats{return{...s,maxHp:Math.max(1,s.maxHp),speed:clamp(s.speed,1,420),haste:clamp(s.haste,.1,2.5),area:clamp(s.area,.1,1.8),crit:clamp(s.crit,0,.6),critDamage:clamp(s.critDamage,1,3),invulnerability:clamp(s.invulnerability,0,1.5),magnet:clamp(s.magnet,0,420),armor:clamp(s.armor,0,8),charge:clamp(s.charge,0,2)};}
export function relicStats(base:PlayerStats,ids:string[]):PlayerStats{
 const s={...base},has=(id:string)=>ids.includes(id);
 if(has('scholarship'))s.xp+=.25;if(has('redNotebook')){s.damage*=1.25;s.maxHp*=.8;}if(has('clockShard'))s.charge+=.3;
 if(has('assistant')){s.summon+=.4;s.nonSummon*=.85;}if(has('emergency')){s.maxHp+=40;s.speed*=.88;}if(has('obsidian'))s.crit+=.15;
 return clampStats(s);
}
export const relicSpawn=(ids:string[])=>ids.includes('scholarship')?1.25:1;
export const relicEnemySpeed=(ids:string[])=>ids.includes('clockShard')?1.18:1;
export const relicBulletSpeed=(ids:string[])=>ids.includes('obsidian')?1.2:1;
