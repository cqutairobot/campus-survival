// P04 bounded port of src/combat/pickups.ts; S1 source remains frozen.
import type {ContentState} from './ContentState';
import {RANK_CODE} from '../../../data/enemies';
import {distanceSq} from '../../../core/math';
import {applySlow,freezeEnemy} from '../../../combat/status';
import type {PickupId} from '../../../types';
export function applyPickup(g:ContentState,id:PickupId,value=g.content.pickupById[id].value){const def=g.content.pickupById[id],p=g.player;
 if(id==='heal')g.heal(value);else if(id==='magnet')g.magnet();else if(id==='bomb')g.clearEnemies(value,{kind:'pickup',id},{elite:[.35,Infinity],miniBoss:[.1,1200],boss:[.08,4000]});
 else if(id==='freeze'){const e=g.enemies;for(const n of e.active){if(distanceSq(p.x,p.y,e.x[n],e.y[n])>value**2)continue;if(e.rank[n]===RANK_CODE.boss||e.rank[n]===RANK_CODE.miniBoss)applySlow(e,n,.6,4);else if(freezeEnemy(e,n,e.rank[n]===RANK_CODE.elite?2:4))g.frozenTarget(n);}g.freezeHostiles(value,4);}
 else if(id==='shield')g.addShield(value,def.duration);else if(id==='coffeeBoost')g.coffeeTime=def.duration;else if(id==='energy')g.ultimate.gain(value,'灵感便签');
 g.message(`${def.name} · ${def.description}`);g.emit({type:'ring',x:p.x,y:p.y,color:parseInt(def.color.slice(1),16),size:id==='bomb'||id==='freeze'?900:100,duration:.6});
}
export function rollPickup(g:ContentState,x:number,y:number,cooldowns:Record<string,number>){const roll=g.dropRandom.next();let sum=0;for(const p of g.content.pickups){sum+=p.probability;if(roll<sum){if(g.combatTime>=(cooldowns[p.id]??0)){g.spawnDrop(p.id,x,y,p.value);cooldowns[p.id]=g.combatTime+p.cooldown;}return;}}}
