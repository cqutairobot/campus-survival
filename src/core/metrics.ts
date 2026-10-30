/** Simulation counters; independent of render, sound, quality and debug UI. */
export function freshMetrics(){return {
  shieldDamage:0,chests:0,heavyKillHits:Array<number>(11).fill(0),
  spawned:0,normalSpawned:0,generatedXp:0,collectedRawXp:0,creditedXp:0,
  hurtCount:0,hpLost:0,shieldAbsorbed:0,overkill:0,hits:0,criticalHits:0,
  firstKill:null as number|null,firstUpgrade:null as number|null,mainLv5:null as number|null,
  evolutionTimes:[] as {id:string;seconds:number}[],bossFights:[] as {boss:number;seconds:number;damage:number}[],
  frenzyTriggers:0,clearRewards:0,criticalChains:0,chainDamage:0,globalStopSeconds:0,
  normalKillTimings:{early:[] as number[],middle:[] as number[],late:[] as number[]},
  normalKillHits:{early:Array<number>(11).fill(0),middle:Array<number>(11).fill(0),late:Array<number>(11).fill(0)},
  normalKillSeconds:{early:Array<number>(6).fill(0),middle:Array<number>(6).fill(0),late:Array<number>(6).fill(0)},
};}
