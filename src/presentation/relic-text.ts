import {RELIC_MAP} from '../data/relics';
export function relicCost(id:string){return id==='clockShard'?'敌人常规移速 +18%（大 Boss、冲锋除外）':RELIC_MAP[id]?.cost??'';}
