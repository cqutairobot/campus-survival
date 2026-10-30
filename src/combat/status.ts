import type {EnemyPool} from '../entities/pools';
import type {EnemyRank} from '../types';
import {RANK_CODE,rankName} from '../data/enemies';
export const SLOW_CAP:Record<EnemyRank,number>={normal:.6,elite:.45,miniBoss:.25,boss:.1,bossAdd:.6};
export function slowFactor(e:EnemyPool,id:number){return e.slowTime[id]>0?1-Math.min(SLOW_CAP[rankName(e.rank[id])],e.slow[id]):1;}
export function applySlow(e:EnemyPool,id:number,amount:number,seconds:number){if(e.hp[id]<=0)return;e.slow[id]=Math.max(e.slowTime[id]>0?e.slow[id]:0,Math.min(SLOW_CAP[rankName(e.rank[id])],amount));e.slowTime[id]=Math.max(e.slowTime[id],seconds);}
export function freezeEnemy(e:EnemyPool,id:number,seconds:number,cryo=false){if(e.hp[id]<=0||e.immune[id]>0||e.frozen[id]>0||(cryo&&e.rank[id]===RANK_CODE.boss))return false;const first=e.frozen[id]<=0;e.frozen[id]=Math.max(e.frozen[id],seconds);return first;}
/** Immunity begins when hard control ends, so overlapping fields cannot extend it forever. */
export function updateStatus(e:EnemyPool,id:number,dt:number){e.flash[id]=Math.max(0,e.flash[id]-dt);e.slowTime[id]=Math.max(0,e.slowTime[id]-dt);if(e.frozen[id]>0){e.frozen[id]=Math.max(0,e.frozen[id]-dt);if(e.frozen[id]===0){e.immune[id]=6;e.freezeAccum[id]=0;}return true;}e.immune[id]=Math.max(0,e.immune[id]-dt);return false;}
