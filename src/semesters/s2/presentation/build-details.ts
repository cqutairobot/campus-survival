import type {PlayerStats,Rarity} from '../../../types';
import type {Immutable} from '../../runtime/contracts';
import type {ContentCatalog} from '../legacy/catalog';
import type {ContentSkill,ContentWeaponId} from '../types';
import {weaponChanges,weaponParams,type WeaponParams} from '../legacy/params';

const number=(n:number)=>String(Math.round(n*100)/100);
export function parameterRows(p:WeaponParams){
 const rows=[`命中伤害 ${number(p.damage)}`,`冷却 ${number(p.interval)} 秒`,`${p.id==='s2:drone'?'无人机':p.id==='s2:whiteboard'?'线段':'数量'} ${p.count}`,`范围 ${number(p.range)}`];
 if(p.lineLength!==undefined)rows.push(`线长 ${number(p.lineLength)}`,`线宽 ${number(p.width)}`,`命中延迟 ${number(p.hitDelay!)} 秒`,`逐线间隔 ${number(p.sequenceDelay!)} 秒`);
 if(p.retargetInterval!==undefined)rows.push(`轮转间隔 ${number(p.retargetInterval)} 秒`);
 if(p.syncInterval)rows.push(`同步集火 ${number(p.syncInterval)} 秒 / 额外每机 ${number(p.damage)} 伤害`);
 return rows;
}
/** Actual player stats/quality feed the same parameters as the next attack. */
export function weaponCard(content:ContentCatalog,id:ContentWeaponId,level:number,rarity:Rarity,stats?:PlayerStats,damageMultiplier=1){
 const def=content.weaponById[id],params=weaponParams(content,{id,level,rarity,evolved:false},stats,damageMultiplier);
 return{id,name:def.name,description:def.description,recipe:`Lv.5 + ${content.passiveById[def.evolution.passive].name} Lv.1 → ${def.evolution.name}`,params,rows:parameterRows(params),changes:weaponChanges(content,id,level,rarity,stats,damageMultiplier)};
}
export function weaponCodex(content:ContentCatalog,id:ContentWeaponId,owned?:Immutable<ContentSkill>,stats?:PlayerStats,damageMultiplier=1){
 const rarity=owned?.rarity??0,levels=[1,2,3,4,5].map(level=>weaponCard(content,id,level,rarity,stats,damageMultiplier)),evolution=weaponParams(content,{id,level:5,rarity,evolved:true},stats,damageMultiplier);
 return{id,name:content.weaponById[id].name,levels,evolution,rows:parameterRows(evolution),recipe:levels[0].recipe};
}
