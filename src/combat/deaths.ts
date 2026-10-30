import type {EnemyPool} from '../entities/pools';
import type {DamageSource} from '../types';
export interface Death {slot:number;generation:number;source:DamageSource;clearChain:boolean}
export class DeathQueue{
 private queue:Death[]=[];
 mark(e:EnemyPool,slot:number,source:DamageSource,clearChain=false){if(!e.alive[slot]||e.pendingDead[slot])return false;e.pendingDead[slot]=1;this.queue.push({slot,generation:e.generation[slot],source,clearChain});return true;}
 drain(e:EnemyPool,resolve:(death:Death)=>void){while(this.queue.length){const d=this.queue.shift()!;if(e.valid(d.slot,d.generation)&&e.pendingDead[d.slot])resolve(d);}}
 clear(){this.queue.length=0;}
}
