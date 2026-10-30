import {expect,it} from 'vitest';
import {GameEngine} from '../../src/core/engine';
import {Random} from '../../src/core/math';
import {draftCards,xpForLevel,spawnRate,xpGemTier} from '../../src/progression/rules';
import {freshSave} from '../../src/save/storage';
import type {Skill} from '../../src/types';
it('前三分钟每次可扩充武器并升级主武器，Lv.4 的配方被动必达',()=>{
  for(let seed=1;seed<=100;seed++)for(const count of [1,2,3]){
    const weapons:Skill[]=['knife','orbit','bot'].slice(0,count).map(id=>({id:id as Skill['id'],level:4,rarity:0,evolved:false}));
    const cards=draftCards(weapons,[],0,new Random(seed),true);
    expect(new Set(cards.map(c=>c.id)).size).toBe(3);
    expect(cards.some(c=>c.type==='weapon'&&!weapons.some(w=>w.id===c.id))).toBe(true);
    expect(cards.some(c=>weapons.some(w=>w.id===c.id)&&c.nextLevel===5)).toBe(true);
    expect(cards.some(c=>c.type==='passive'&&['haste','xp','multi'].slice(0,count).includes(c.id))).toBe(true);
    expect(cards.some(c=>c.id==='haste')).toBe(true);
  }
});
it('大宝石 48 / 虹彩 192 边界不更改经验值，合并守恒',()=>{
  expect([1,4,12,47,48,191,192,10000].map(xpGemTier)).toEqual([0,1,2,2,3,3,4,4]);
  const g=new GameEngine(freshSave(),12);for(let n=0;n<48;n++)g.spawnDrop('xp',3000,3000,4);g.mergeExperience();
  expect(g.totalDroppedXp()).toBe(192);expect(xpGemTier(g.drops.data[g.drops.active[0]].value)).toBe(4);
});
it('经验累计到 24 级少 1012；24 级以后逐级需求回归',()=>{
  const old=(l:number)=>Math.ceil(12+6*(l-1)+.5*(l-1)**2);
  let difference=0;for(let l=1;l<24;l++)difference+=old(l)-xpForLevel(l);
  expect(difference).toBe(1012);for(let l=24;l<100;l++)expect(xpForLevel(l)).toBe(old(l));
  expect([1,2,3,4,5,6,7,8].map(spawnRate)).toEqual([2.6,3.4,4.2,5.2,6.5,8.2,10,11.7]);
});
it('同次拾取连续升级只演出一次；重复点击不会消耗下一次选卡',()=>{
  const g=new GameEngine(freshSave(),123);g.addExperience(30);
  expect(g.visualEvents.filter(e=>e.type==='level')).toHaveLength(1);
  for(let n=0;n<20;n++)g.tick(1/60);
  expect(g.phase).toBe('draft');const before=g.weapons.length+g.passives.length;
  g.send({type:'choose',index:0});g.send({type:'choose',index:0});g.tick(1/60);
  expect(g.phase).toBe('draft');expect(g.weapons.length+g.passives.length).toBe(before+1);
  expect(g.visualEvents.filter(e=>e.type==='level')).toHaveLength(1);
});
