import { describe, expect, it } from 'vitest';
import { CHARACTERS, ENEMIES, PASSIVES, TALENTS, WEAPONS } from '../../src/data/catalog';
import { Random } from '../../src/core/math';
import { canBuyTalent, draftCards, evolutionReady, rollRarity, statsFor, talentRefund, weekHpMultiplier, xpForLevel } from '../../src/progression/rules';
import { freshSave } from '../../src/save/storage';
import type { Skill } from '../../src/types';
describe('内容及数值契约',()=>{
  it('16 武器、12 被动、16 配方、4 角色、8 天赋、全部五级数据合法',()=>{
    expect([WEAPONS.length,PASSIVES.length,CHARACTERS.length,TALENTS.length]).toEqual([16,12,4,8]);
    expect(new Set([...WEAPONS,...PASSIVES].map(w=>w.id)).size).toBe(28);
    for(const w of WEAPONS){for(const values of [w.damage,w.interval,w.count,w.range]){expect(values).toHaveLength(5);expect(values.every(n=>Number.isFinite(n)&&n>0)).toBe(true);}expect(PASSIVES.some(p=>p.id===w.evolution.passive)).toBe(true);expect(w.icon).toBeTruthy();expect(w.evolution.damage).toBeGreaterThan(0);}
    for(const p of PASSIVES)expect(p.values).toHaveLength(5);
    for(const c of CHARACTERS)expect(WEAPONS.some(w=>w.id===c.weapon)).toBe(true);
    expect(new Set(ENEMIES.map(e=>e.id)).size).toBe(14);
  });
  it('v2 前段经验减半，24 级后回归；后段生命适度补偿',()=>{expect([1,2,3,5,12,15,20,24,30].map(xpForLevel)).toEqual([6,10,13,22,70,122,256,415,607]);expect(weekHpMultiplier(1)).toBe(1);expect(weekHpMultiplier(22)).toBeCloseTo(19.74208*1.25);});
  it('品质仅放大被动增加部分，数量与自损代价不放大',()=>{
    const p:Skill[]=[{id:'night',level:5,rarity:3,evolved:false},{id:'multi',level:5,rarity:3,evolved:false}];
    const s=statsFor(freshSave(),p);expect(s.damage).toBe(2.25);expect(s.multi).toBe(3);expect(s.drain).toBe(.008);
  });
  it('角色、天赋与硬上限计算正确',()=>{
    const save=freshSave();save.selected='analysis';save.talents={hp:5,haste:5,speed:5,magnet:5,luck:5};
    const p=PASSIVES.map(w=>({id:w.id,level:5,rarity:3 as const,evolved:false}));const s=statsFor(save,p);
    expect(s.maxHp).toBe(90+25+75*1.25);expect(s.haste).toBeLessThanOrEqual(2.5);expect(s.area).toBeLessThanOrEqual(1.8);expect(s.crit).toBeLessThanOrEqual(.6);expect(s.invulnerability).toBeLessThanOrEqual(1.5);expect(s.speed).toBeLessThanOrEqual(420);expect(s.magnet).toBe(170);
  });
  it('新卡去重，满槽排除新技能，满级和进化技能排除',()=>{
    const weapons=WEAPONS.slice(0,6).map((w,n)=>({id:w.id,level:n===0?5:4,rarity:2 as const,evolved:n===1}));
    const passives=PASSIVES.slice(0,6).map(p=>({id:p.id,level:5,rarity:1 as const,evolved:false}));
    for(let seed=1;seed<30;seed++){const cards=draftCards(weapons,passives,.5,new Random(seed));expect(new Set(cards.map(c=>c.id)).size).toBe(3);for(const c of cards)if(c.type==='weapon')expect(weapons.slice(2).some(w=>w.id===c.id)).toBe(true);else expect(['heal','shield','credit']).toContain(c.type);}
  });
  it('池空时补足回血、护盾和绩点',()=>{const w=WEAPONS.slice(0,6).map(d=>({id:d.id,level:5,rarity:0 as const,evolved:true})),p=PASSIVES.slice(0,6).map(d=>({id:d.id,level:5,rarity:0 as const,evolved:false}));expect(draftCards(w,p,0,new Random(7)).map(c=>c.type)).toEqual(['heal','shield','credit']);});
  it('全部 16 条进化均可达，缺少任一条件不能进化',()=>{
    for(const w of WEAPONS){const skill:Skill={id:w.id,level:5,rarity:2,evolved:false},p:Skill={id:w.evolution.passive,level:1,rarity:0,evolved:false};expect(evolutionReady([skill],[p])).toHaveLength(1);expect(evolutionReady([{...skill,level:4}],[p])).toHaveLength(0);expect(evolutionReady([skill],[])).toHaveLength(0);expect(evolutionReady([{...skill,evolved:true}],[p])).toHaveLength(0);}
  });
  it('幸运提高紫金品质出现率，且每次结果合法',()=>{
    const a=new Random(123),b=new Random(123);let base=0,lucky=0;for(let n=0;n<10000;n++){const x=rollRarity(a,0),y=rollRarity(b,1);expect(x).toBeGreaterThanOrEqual(0);expect(y).toBeLessThanOrEqual(3);base+=Number(x>=2);lucky+=Number(y>=2);}expect(lucky).toBeGreaterThan(base*1.6);
  });
  it('天赋分支、花费、退款与满级保护',()=>{const s=freshSave();s.credits=100;expect(canBuyTalent(s,'speed')).toBe(false);s.talents.hp=1;expect(canBuyTalent(s,'speed')).toBe(true);s.talents.speed=5;expect(canBuyTalent(s,'speed')).toBe(false);expect(talentRefund({hp:5,damage:2})).toBe(144);});
});
