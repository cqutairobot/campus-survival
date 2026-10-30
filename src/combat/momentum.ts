import {ENEMIES} from '../data/catalog';
import type {EnemyRank,PlayerStats} from '../types';
export const COMBO_THRESHOLDS=[10,25,50,100] as const;
export function frenzyStats(stats:PlayerStats,active:boolean):PlayerStats{return active?{...stats,haste:Math.min(2.5,stats.haste*1.2),area:Math.min(1.8,stats.area*1.15)}:stats;}
/** All timers use combat time, including neither UI pauses nor cinematics. */
export class CombatMomentum {
  combo=0;peakCombo=0;charge=0;remaining=0;cooldown=0;clearCooldown=0;criticals=0;chainCooldown=0;
  private lastKill=-Infinity;private tier=0;private ordinaryKills:number[]=[];
  get active(){return this.remaining>1e-9;}
  update(dt:number,time:number){
    if(time-this.lastKill>3+1e-6){this.combo=0;this.tier=0;}
    if(this.active){this.remaining=Math.max(0,this.remaining-dt);if(!this.active){this.remaining=0;this.cooldown=12;}}
    else if(this.cooldown>0)this.cooldown=Math.max(0,this.cooldown-dt);
    else if(time-this.lastKill>4)this.charge=Math.max(0,this.charge-10*Math.min(dt,time-this.lastKill-4));
    this.clearCooldown=Math.max(0,this.clearCooldown-dt);this.chainCooldown=Math.max(0,this.chainCooldown-dt);
  }
  gain(value:number){
    if(this.active||this.cooldown>1e-6)return false;
    this.charge=Math.min(100,this.charge+value);if(this.charge<100)return false;
    this.charge=0;this.remaining=6;return true;
  }
  kill(kind:number|EnemyRank,time:number,weight=1){
    const rank=typeof kind==='number'?ENEMIES[kind]?.rank??'normal':kind;
    if(time-this.lastKill>3+1e-6){this.combo=0;this.tier=0;}
    this.lastKill=time;this.combo+=weight;this.peakCombo=Math.max(this.peakCombo,this.combo);
    const nextTier=COMBO_THRESHOLDS.filter(n=>n<=this.combo).length,milestone=nextTier>this.tier?COMBO_THRESHOLDS[nextTier-1]:0;this.tier=nextTier;
    let clear=false;
    if(rank==='normal'){this.ordinaryKills=this.ordinaryKills.filter(t=>time-t<=1+1e-6);for(let i=0;i<Math.floor(weight);i++)this.ordinaryKills.push(time);if(this.ordinaryKills.length>=20&&this.clearCooldown<=1e-6){clear=true;this.clearCooldown=20;this.ordinaryKills=[];}}
    const frenzy=this.gain((rank==='boss'?25:rank==='elite'||rank==='miniBoss'?8:1)*weight+(clear?15:0));
    return{milestone,clear,frenzy};
  }
  critical(){
    this.criticals=Math.min(3,this.criticals+1);if(this.criticals<3||this.chainCooldown>1e-6)return false;
    this.criticals=0;this.chainCooldown=.6;return true;
  }
  debugCharge(value:number,time:number){this.lastKill=time;return this.gain(Math.max(0,Math.min(100,value))-this.charge);}
  debugCombo(value:number,time:number){this.combo=Math.max(0,Math.floor(value));this.peakCombo=Math.max(this.peakCombo,this.combo);this.lastKill=time;this.tier=COMBO_THRESHOLDS.filter(n=>n<=this.combo).length;}
}
