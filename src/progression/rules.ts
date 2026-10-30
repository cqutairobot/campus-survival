import { CHARACTERS, PASSIVES, PASSIVE_MAP, RARITY_MULTIPLIERS, TALENTS, WEAPONS, WEAPON_MAP } from '../data/catalog';
import {SPAWN_RATES} from '../data/waves';
import { clamp, Random } from '../core/math';
import type { DraftCard, PlayerStats, Rarity, SaveData, Skill } from '../types';

export const xpForLevel = (level:number) => Math.ceil((12+6*(level-1)+.5*(level-1)**2)*(level<=12?.5:level<24?.5+(level-12)/24:1));
export const spawnRate = (week:number) => SPAWN_RATES[clamp(Math.floor(week),1,22)-1];
export function weekHpMultiplier(week:number){const w=clamp(week,1,22);if(w<=5)return(1+.16*(w-1))*(1+.008*(w-1)**2);const points=[[5,1.84992],[6,2],[8,2.25],[12,2.6],[16,2.9],[22,3.2]];for(let i=1;i<points.length;i++){const [x,y]=points[i],[px,py]=points[i-1];if(w<=x)return py+(y-py)*(w-px)/(x-px);}return 3.2;}
export const weekDamageMultiplier=(week:number)=>Math.min(1.9,1+.045*(week-1));
export const talentCost = (level:number) => (level+1)*8;
export const xpGemTier=(value:number)=>value>=192?4:value>=48?3:value>=12?2:value>=4?1:0;
export const talentRefund = (talents:Record<string,number>) => Object.values(talents).reduce((s,l)=>s+4*l*(l+1),0);
export function statsFor(save:SaveData, passives:Skill[]):PlayerStats {
  const character=CHARACTERS.find(c=>c.id===save.selected)??CHARACTERS[0],t=save.talents;
  const p=(id:string)=>passives.find(p=>p.id===id);
  const value=(id:string)=>{const s=p(id);return s?PASSIVE_MAP[id].values[s.level-1]*RARITY_MULTIPLIERS[s.rarity]:0;};
  const lv=(id:string)=>p(id)?.level??0;
  return {
    maxHp:character.hp+(t.hp??0)*5+value('health'),
    speed:Math.min(420,220*(1+(t.speed??0)*.02+value('speed')/100)),
    damage:(1+(t.damage??0)*.03)*(1+value('night')/100),
    haste:Math.min(2.5,1+(t.haste??0)*.02+value('haste')/100),
    area:Math.min(1.8,1+character.area+value('area')/100),
    crit:Math.min(.6,character.crit+value('luck')/100),
    xp:1+(t.xp??0)*.03+value('xp')/100,
    regen:(t.regen??0)*.1+value('regen'),
    multi:lv('multi')?[1,1,2,2,3][lv('multi')-1]:0,
    summon:1+character.summon+(lv('multi')?[0,.05,.05,.1,.15][lv('multi')-1]:0),
    invulnerability:Math.min(1.5,.65+value('calm')),
    magnet:Math.min(420,120+(t.magnet??0)*10+value('magnetism')),
    luck:clamp((t.luck??0)*.03+lv('luck')*.1*RARITY_MULTIPLIERS[p('luck')?.rarity??0],0,1),
    push:1+value('push')/100,
    duration:1+(character.duration??0)+value('duration')/100,
    armor:Math.min(8,(character.armor??0)+value('armor')),charge:Math.min(2,1+value('focus')/100),critDamage:Math.min(3,1.75+value('thesis')),nonSummon:1,
    drain:lv('night')?[.002,.0035,.005,.0065,.008][lv('night')-1]:0,
  };
}
export function rollRarity(rng:Random,luck:number):Rarity {
  const weights=[60,27*(1+.5*luck),11*(1+1.5*luck),2*(1+3*luck)];
  return rng.weighted([0,1,2,3],r=>weights[r]) as Rarity;
}
export function draftCards(weapons:Skill[],passives:Skill[],luck:number,rng:Random,early=false,content?:{weapons:string[];passives:string[];consumed?:string[]}):DraftCard[] {
  const pool:DraftCard[]=[];
  for(const [defs,owned,type] of [[WEAPONS,weapons,'weapon'],[PASSIVES,passives,'passive']] as const){
    for(const def of defs){
      if(content&&(!(type==='weapon'?content.weapons:content.passives).includes(def.id)||content.consumed?.includes(def.id)))continue;
      const skill=owned.find(s=>s.id===def.id);
      if(skill&&(skill.level>=5||skill.evolved))continue;
      if(!skill&&owned.length>=6)continue;
      pool.push({id:def.id,type,rarity:skill?.rarity??rollRarity(rng,luck),nextLevel:skill?skill.level+1:1});
    }
  }
  const selected:DraftCard[]=[];
  const take=(eligible:DraftCard[])=>{if(!eligible.length||selected.length>=3)return;const card=rng.weighted(eligible,()=>1);selected.push(card);pool.splice(pool.indexOf(card),1);};
  if(early){
    if(weapons.length<4)take(pool.filter(c=>c.type==='weapon'&&!weapons.some(w=>w.id===c.id)));
    // Keep upgrading a chosen build possible on every early draft.
    const main=weapons[0];
    take(pool.filter(c=>[...weapons,...passives].some(s=>s.id===c.id)));
    const needs: string[]=weapons.filter(w=>w.level>=4&&!w.evolved).map(w=>WEAPON_MAP[w.id]?.evolution.passive);
    const primaryRecipe=main&&main.level>=4?pool.find(c=>c.id===WEAPON_MAP[main.id].evolution.passive&&!passives.some(p=>p.id===c.id)):undefined;
    if(primaryRecipe)take([primaryRecipe]);else take(pool.filter(c=>c.type==='passive'&&needs.includes(c.id)&&!passives.some(p=>p.id===c.id)));
    if(selected.length<3)take(pool.filter(c=>c.type==='passive'&&weapons.some(w=>WEAPON_MAP[w.id]?.evolution.passive===c.id)));
  }
  while(selected.length<3&&pool.length){
    const card=rng.weighted(pool,c=>{
      const own=c.type==='weapon'?weapons:passives;
      const synergy=c.type==='passive'&&weapons.some(w=>WEAPON_MAP[w.id]?.evolution.passive===c.id);
      return (own.some(s=>s.id===c.id)?1.65:1)*(synergy?1.8:1);
    });
    selected.push(card);pool.splice(pool.indexOf(card),1);
  }
  const filler:DraftCard[]=[{id:'heal',type:'heal',rarity:0,nextLevel:1},{id:'shield',type:'shield',rarity:1,nextLevel:1},{id:'credit',type:'credit',rarity:2,nextLevel:1}];
  while(selected.length<3)selected.push(filler.shift()!);
  return selected;
}
export function evolutionReady(weapons:Skill[],passives:Skill[]) {
  return weapons.filter(w=>w.level===5&&!w.evolved&&!WEAPON_MAP[w.id]?.fusion&&passives.some(p=>p.id===WEAPON_MAP[w.id]?.evolution.passive&&p.level>=1));
}
export function skillName(skill:Skill) { return skill.evolved?WEAPON_MAP[skill.id].evolution.name:(WEAPON_MAP[skill.id]??PASSIVE_MAP[skill.id]).name; }
export function canBuyTalent(save:SaveData,id:string) {
  const talent=TALENTS.find(t=>t.id===id),level=save.talents[id]??0;
  return !!talent&&level<5&&save.credits>=talentCost(level)&&(!talent.parent||(save.talents[talent.parent]??0)>=1);
}
