import type {ContentState} from './legacy/ContentState';
import {s2PassiveValue} from './legacy/rules';

/** Explicitly settled hits skip every outgoing multiplier and enemy mitigation. */
export interface HitContext {settled?:true;additional?:'echo'|'mark';attackId?:string;dot?:boolean}
export class EchoChip {
 private targets=new Map<number,{generation:number;seen:Set<string>;next:number}>();
 private serial=0;
 constructor(private g:ContentState){}
 amount(id:number,actual:number,context:HitContext={}){
  const g=this.g,e=g.enemies,bonus=s2PassiveValue(g.content,g.passives,'s2:echoChip',e.rank[id]===3);if(!bonus||actual<=0)return 0;
  const attack=context.attackId??`hit:${++this.serial}`,old=this.targets.get(id),valid=old?.generation===e.generation[id];
  if(!valid){this.targets.set(id,{generation:e.generation[id],seen:new Set([attack]),next:0});return 0;}
  if(old.seen.has(attack))return 0;old.seen.add(attack);if(old.seen.size>128)old.seen.delete(old.seen.values().next().value!);if(g.combatTime+1e-8<old.next)return 0;
  old.next=g.combatTime+1;return actual*bonus;
 }
 forget(id:number){this.targets.delete(id);}
 clear(){this.targets.clear();}
}
export class Harness {
 private moving=0;private next=0;ready=false;
 constructor(private g:ContentState){}
 update(dt:number){const p=this.g.player;if(!s2PassiveValue(this.g.content,this.g.passives,'s2:harness')){this.ready=false;this.moving=0;return;}if(this.g.combatTime<this.next){this.moving=0;return;}if(Math.hypot(p.x-p.prevX,p.y-p.prevY)>dt*5)this.moving+=dt;else this.moving=0;if(this.moving+1e-8>=2)this.ready=true;}
 reduce(damage:number){if(!this.ready)return damage;const bonus=s2PassiveValue(this.g.content,this.g.passives,'s2:harness');this.ready=false;this.moving=0;this.next=this.g.combatTime+8;return damage*(1-bonus);}
}
