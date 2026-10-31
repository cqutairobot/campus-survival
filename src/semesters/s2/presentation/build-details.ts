import type {PlayerStats,Rarity} from '../../../types';
import type {Immutable} from '../../runtime/contracts';
import type {ContentCatalog} from '../legacy/catalog';
import type {ContentSkill,ContentWeaponId} from '../types';
import {fusionRecipe} from '../legacy/fusions';
import {weaponChanges,weaponParams,type WeaponParams} from '../legacy/params';

const number=(n:number)=>String(Math.round(n*100)/100);
export function parameterRows(p:WeaponParams){
 const rows=[`命中伤害 ${number(p.damage)}`,`冷却 ${number(p.interval)} 秒`,`${p.id==='s2:drone'?'无人机':p.id==='s2:whiteboard'?'线段':'数量'} ${p.count}`,`范围 ${number(p.range)}`];
 if(p.markDamage!==undefined)rows.push(`印记伤害 ${number(p.markDamage)}`,`穿透 ${p.pierce}`,`印记半径 ${number(p.explosion)}`,`印记持续 ${number(p.duration)} 秒`);
 if(p.placementInterval!==undefined)rows.push(`轨迹长度 ${number(p.lineLength!)}`,`铺设间隔 ${number(p.placementInterval)} 秒`,`轨迹持续 ${number(p.duration)} 秒`);
 if(p.hitDelay!==undefined)rows.push(`线长 ${number(p.lineLength!)}`,`线宽 ${number(p.width)}`,`命中延迟 ${number(p.hitDelay!)} 秒`,`逐线间隔 ${number(p.sequenceDelay!)} 秒`);
 if(p.retargetInterval!==undefined)rows.push(`轮转间隔 ${number(p.retargetInterval)} 秒`);
 if(p.id==='s2:digitalTwin')rows.push(`构件爆破半径 ${number(p.explosion)}`);
 if(p.syncInterval&&p.id==='s2:fieldHub')rows.push(`轮换/协同爆破 ${number(p.syncInterval)} 秒 · ${number(p.secondaryDamage)} 伤害 · 半径 ${number(p.explosion)}`);
 else if(p.syncInterval)rows.push(`同步集火 ${number(p.syncInterval)} 秒 / 额外每机 ${number(p.damage)} 伤害`);
 return rows;
}
/** Actual player stats/quality feed the same parameters as the next attack. */
export function weaponCard(content:ContentCatalog,id:ContentWeaponId,level:number,rarity:Rarity,stats?:PlayerStats,damageMultiplier=1){
 const def=content.weaponById[id],params=weaponParams(content,{id,level,rarity,evolved:false},stats,damageMultiplier);
 return{id,name:def.name,description:def.description,recipe:def.fusion?fusionRecipe(content,id):`Lv.5 + ${content.passiveById[def.evolution.passive].name} Lv.1 → ${def.evolution.name}。${content.fusions.filter(f=>f.components.some(c=>c===id)).map(f=>fusionRecipe(content,f.id)).join(' ' )}`,params,rows:parameterRows(params),changes:weaponChanges(content,id,level,rarity,stats,damageMultiplier)};
}
export function weaponCodex(content:ContentCatalog,id:ContentWeaponId,owned?:Immutable<ContentSkill>,stats?:PlayerStats,damageMultiplier=1){
 const rarity=owned?.rarity??0,levels=(content.weaponById[id].fusion?[5]:[1,2,3,4,5]).map(level=>weaponCard(content,id,level,rarity,stats,damageMultiplier)),evolution=weaponParams(content,{id,level:5,rarity,evolved:!content.weaponById[id].fusion},stats,damageMultiplier);
 return{id,name:content.weaponById[id].name,levels,evolution,rows:parameterRows(evolution),recipe:levels[0].recipe};
}
