import type {ContentState} from './legacy/ContentState';

export const PROTOCOL_SECONDS=3;
/** One mark per slot/generation, no extra hit or recursive damage dispatch. */
export class ProtocolMarks {
 private marks=new Map<number,{generation:number;expires:number;bonus:number}>();
 constructor(private g:ContentState){}
 hit(id:number,bonus:number,secondary=false){
  const e=this.g.enemies,now=this.g.combatTime,old=this.marks.get(id),active=old&&old.generation===e.generation[id]&&old.expires>now;
  const result=active?Math.max(old.bonus,bonus):0;
  if(!secondary&&bonus>0)this.marks.set(id,{generation:e.generation[id],expires:now+PROTOCOL_SECONDS,bonus:Math.max(active?old.bonus:0,bonus)});
  return result;
 }
 has(id:number){const m=this.marks.get(id);return !!m&&this.g.enemies.valid(id,m.generation)&&m.expires>this.g.combatTime;}
 forget(id:number){this.marks.delete(id);}
 clear(){this.marks.clear();}
 snapshot(){const e=this.g.enemies;return [...this.marks].filter(([id,m])=>e.valid(id,m.generation)&&e.hp[id]>0&&m.expires>this.g.combatTime).map(([id,m])=>({id,...m}));}
}
