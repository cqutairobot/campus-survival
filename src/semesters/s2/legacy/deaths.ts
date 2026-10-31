import type {EnemyPool} from '../../../entities/pools';
import type {ContentDamageSource} from '../types';

/** S2 copy of the generation-checked queue, with S2 source IDs. */
export interface ContentDeath {slot:number;generation:number;source:ContentDamageSource;clearChain:boolean}
export class ContentDeathQueue {
 private queue:ContentDeath[]=[];
 mark(e:EnemyPool,slot:number,source:ContentDamageSource,clearChain=false){if(!e.alive[slot]||e.pendingDead[slot])return false;e.pendingDead[slot]=1;this.queue.push({slot,generation:e.generation[slot],source,clearChain});return true;}
 drain(e:EnemyPool,resolve:(death:ContentDeath)=>void){while(this.queue.length){const d=this.queue.shift()!;if(e.valid(d.slot,d.generation)&&e.pendingDead[d.slot])resolve(d);}}
 clear(){this.queue.length=0;}
}
