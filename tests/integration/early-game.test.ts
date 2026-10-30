import {expect,it} from 'vitest';
import {GameEngine} from '../../src/core/engine';
import {CHARACTERS} from '../../src/data/catalog';
import {freshSave} from '../../src/save/storage';
import {pilot} from '../helpers/pilot';

it('固定小矩阵自然开局：首升/新武器机会≤20秒，180秒至少三武器覆盖≥90%，经验守恒',()=>{
  let starts=0,survivors=0,threeWeapons=0;
  for(const character of CHARACTERS)for(const strategy of ['balanced','expand'] as const)for(const seed of [1,7]){
    const save=freshSave();save.selected=character.id;const g=new GameEngine(save,seed);let firstOffer:number|null=null;starts++;
    for(let frame=0;frame<60*190&&!g.result&&g.combatTime<180;frame++){
      if(g.phase==='draft'&&g.cards.some(c=>c.type==='weapon'&&!g.weapons.some(w=>w.id===c.id)))firstOffer??=g.combatTime;
      pilot(g,strategy);g.tick(1/60);g.visualEvents.length=0;
    }
    expect(g.cheated).toBe(false);expect(g.metrics.firstUpgrade).not.toBeNull();expect(g.metrics.firstUpgrade!).toBeLessThanOrEqual(20);
    expect(firstOffer).not.toBeNull();expect(firstOffer!).toBeLessThanOrEqual(20);
    expect(g.metrics.generatedXp-g.metrics.collectedRawXp).toBe(g.totalDroppedXp());expect(g.poolFailures).toBe(0);
    if(g.combatTime>=180){survivors++;threeWeapons+=Number(g.weapons.length>=3);}g.dispose();
  }
  expect(starts).toBe(16);expect(survivors).toBeGreaterThan(0);expect(threeWeapons/survivors).toBeGreaterThanOrEqual(.9);
},60000);
