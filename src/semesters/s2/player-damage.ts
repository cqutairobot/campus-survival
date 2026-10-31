import {clamp} from '../../core/math';
import type {EnemyRank} from '../../types';

export type DamageTier='normal'|'elite'|'boss';
export interface DamageOrigin {kind:'contact'|'projectile'|'hazard'|'environment';id:number;generation:number;tier:DamageTier}
export interface IncomingHit extends DamageOrigin {damage:number;x:number;y:number}
export const tierForRank=(rank:EnemyRank):DamageTier=>rank==='boss'?'boss':rank==='normal'?'normal':'elite';
export const damageLimit=(tier:DamageTier)=>tier==='boss'?.45:tier==='elite'?.4:.3;
export const cappedDamage=(hit:IncomingHit,maxHp:number,armor:number,regionalMultiplier=1)=>Math.min(maxHp*damageLimit(hit.tier),Math.max(1,hit.damage*regionalMultiplier-armor));
export const invulnerabilityFor=(seconds:number)=>clamp(seconds,.7,1.5);
const kinds={contact:0,projectile:1,hazard:2,environment:3};
/** Highest mitigated incident wins, then stable source identity. Collection order
 * and swap-removal order cannot turn one simulation step into several hits. */
export function selectPlayerHit(hits:readonly IncomingHit[],maxHp:number,armor:number,regionalMultiplier=1){
 return [...hits].sort((a,b)=>cappedDamage(b,maxHp,armor,regionalMultiplier)-cappedDamage(a,maxHp,armor,regionalMultiplier)||kinds[a.kind]-kinds[b.kind]||a.id-b.id||a.generation-b.generation||a.x-b.x||a.y-b.y)[0];
}
