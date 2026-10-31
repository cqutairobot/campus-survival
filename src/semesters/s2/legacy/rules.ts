import type {ContentSkill} from '../types';
import type {ContentCatalog} from './catalog';
import type {Immutable} from '../../runtime/contracts';
import type {S2RunSnapshot} from '../../types';
// P04 bounded port of src/progression/rules.ts; S1 source remains frozen.
import { clamp, Random } from '../../../core/math';
import {pressureAt} from '../pressure';
import type { DraftCard, PlayerStats, Rarity } from '../../../types';

export const xpForLevel = (level:number) => Math.ceil((12+6*(level-1)+.5*(level-1)**2)*(level<=12?.5:level<24?.5+(level-12)/24:1));
export const weekHpMultiplier=(week:number)=>pressureAt(week).hp;
export const weekDamageMultiplier=(week:number)=>pressureAt(week).damage;
export const xpGemTier=(value:number)=>value>=192?4:value>=48?3:value>=12?2:value>=4?1:0;
/** S2 passive quality and final vulnerability cap are resolved only here. */
export function protocolBonus(content:ContentCatalog,passives:readonly ContentSkill[]){const s=passives.find(p=>p.id==='s2:protocol');return s?Math.min(.15,content.passiveById[s.id].values[s.level-1]*content.rarityMultipliers[s.rarity]/100):0;}
export function s2PassiveValue(content:ContentCatalog,passives:readonly ContentSkill[],id:'s2:battery'|'s2:harness'|'s2:echoChip',boss=false){
 const s=passives.find(p=>p.id===id),value=s?content.passiveById[id].values[s.level-1]*content.rarityMultipliers[s.rarity]:0;
 return id==='s2:battery'?Math.min(90,value):Math.min(id==='s2:harness'?.225:boss?.1:.3,value/100);
}
export function statsFor(content:ContentCatalog,save:Immutable<S2RunSnapshot>, passives:ContentSkill[]):PlayerStats {
  const character=content.characters.find(c=>c.id===save.character)??content.characters[0],t=save.talents;
  const p=(id:string)=>passives.find(p=>p.id===id);
  const value=(id:string)=>{const s=p(id);return s?content.passiveById[id].values[s.level-1]*content.rarityMultipliers[s.rarity]:0;};
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
    invulnerability:Math.min(1.5,.7+value('calm')),
    magnet:Math.min(420,120+(t.magnet??0)*10+value('magnetism')),
    luck:clamp((t.luck??0)*.03+lv('luck')*.1*content.rarityMultipliers[p('luck')?.rarity??0],0,1),
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
export function draftCards(content:ContentCatalog,weapons:ContentSkill[],passives:ContentSkill[],luck:number,rng:Random,early=false,available?:{weapons:readonly string[];passives:readonly string[];consumed?:readonly string[]},preferNew=false):DraftCard[] {
  const pool:DraftCard[]=[];
  for(const [defs,owned,type] of [[content.weapons,weapons,'weapon'],[content.passives,passives,'passive']] as const){
    for(const def of defs){
      if(available&&(!(type==='weapon'?available.weapons:available.passives).includes(def.id)||available.consumed?.includes(def.id)))continue;
      const skill=owned.find(s=>s.id===def.id);
      if(skill&&(skill.level>=5||skill.evolved))continue;
      if(!skill&&owned.length>=6)continue;
      pool.push({id:def.id,type,rarity:skill?.rarity??rollRarity(rng,luck),nextLevel:skill?skill.level+1:1});
    }
  }
  const selected:DraftCard[]=[];
  const take=(eligible:DraftCard[])=>{if(!eligible.length||selected.length>=3)return;const card=rng.weighted(eligible,()=>1);selected.push(card);pool.splice(pool.indexOf(card),1);};
  if(preferNew)take(pool.filter(c=>c.type==='weapon'&&c.id.startsWith('s2:')&&!weapons.some(w=>w.id===c.id)));
  if(early){
    if(weapons.length<4&&!selected.some(c=>c.type==='weapon'&&!weapons.some(w=>w.id===c.id)))take(pool.filter(c=>c.type==='weapon'&&!weapons.some(w=>w.id===c.id)));
    // Keep upgrading a chosen build possible on every early draft.
    const main=weapons[0];
    take(pool.filter(c=>[...weapons,...passives].some(s=>s.id===c.id)));
    const needs: string[]=weapons.filter(w=>w.level>=4&&!w.evolved).map(w=>content.weaponById[w.id]?.evolution.passive);
    const primaryRecipe=main&&main.level>=4?pool.find(c=>c.id===content.weaponById[main.id].evolution.passive&&!passives.some(p=>p.id===c.id)):undefined;
    if(primaryRecipe)take([primaryRecipe]);else take(pool.filter(c=>c.type==='passive'&&needs.includes(c.id)&&!passives.some(p=>p.id===c.id)));
    if(selected.length<3)take(pool.filter(c=>c.type==='passive'&&weapons.some(w=>content.weaponById[w.id]?.evolution.passive===c.id)));
  }
  while(selected.length<3&&pool.length){
    const card=rng.weighted(pool,c=>{
      const own=c.type==='weapon'?weapons:passives;
      const synergy=c.type==='passive'&&weapons.some(w=>content.weaponById[w.id]?.evolution.passive===c.id);
      return (own.some(s=>s.id===c.id)?1.65:1)*(synergy?1.8:1);
    });
    selected.push(card);pool.splice(pool.indexOf(card),1);
  }
  const filler:DraftCard[]=[{id:'heal',type:'heal',rarity:0,nextLevel:1},{id:'shield',type:'shield',rarity:1,nextLevel:1},{id:'credit',type:'credit',rarity:2,nextLevel:1}];
  while(selected.length<3)selected.push(filler.shift()!);
  return selected;
}
export function evolutionReady(content:ContentCatalog,weapons:ContentSkill[],passives:ContentSkill[]) {
  return weapons.filter(w=>w.level===5&&!w.evolved&&!content.weaponById[w.id]?.fusion&&passives.some(p=>p.id===content.weaponById[w.id]?.evolution.passive&&p.level>=1));
}
export function skillName(content:ContentCatalog,skill:ContentSkill) { return skill.evolved?content.weaponById[skill.id].evolution.name:(content.weaponById[skill.id]??content.passiveById[skill.id]).name; }
