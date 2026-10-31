import type {S2RunSnapshot} from '../types';
import type {Immutable,InheritanceView} from './contracts';

/** Run-local ledger, constructed once from the opening snapshot. Never rebuild on
 * pause, stat recalculation or assessment transitions. Ordinary shields stay in content rules. */
export class RuntimeInheritance {
 private shield:number;
 constructor(private readonly inheritance:Immutable<S2RunSnapshot['inheritance']>){
  this.shield=inheritance.id==='supply'?inheritance.shield:0;
 }
 view(combatSeconds:number):InheritanceView{
  const i=this.inheritance;
  return {id:i.id,shield:i.id==='supply'&&combatSeconds<i.durationSeconds?this.shield:0,xpMultiplier:i.id==='notes'&&combatSeconds<i.durationSeconds?i.xpMultiplier:1};
 }
 absorb(amount:number,combatSeconds:number){
  if(!Number.isFinite(amount)||amount<=0)return 0;
  const absorbed=Math.min(amount,this.view(combatSeconds).shield);this.shield-=absorbed;return amount-absorbed;
 }
 experience(amount:number,combatSeconds:number){
  return Number.isFinite(amount)&&amount>0?amount*this.view(combatSeconds).xpMultiplier:0;
 }
}
