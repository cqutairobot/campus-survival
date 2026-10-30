import {describe,expect,it} from 'vitest';
import {CombatMomentum,frenzyStats} from '../../src/combat/momentum';
import {GameEngine} from '../../src/core/engine';
import {freshSave} from '../../src/save/storage';
import {FixedLoop} from '../../src/core/loop';
import {validCommand} from '../../src/debug/commands';
const arena=()=>{const g=new GameEngine(freshSave(),123);g.enemies.clear();g.weapons.length=0;g.stats.crit=0;return g;};
describe('v2 周期爆发规则',()=>{
  it('普通 / 精英 / Boss 分别充能 1 / 8 / 25；100 点触发六秒狂热',()=>{
    const m=new CombatMomentum();m.kill(0,0);m.kill(5,1);m.kill(7,2);expect(m.charge).toBe(34);
    m.gain(65);expect(m.charge).toBe(99);expect(m.kill(0,3).frenzy).toBe(true);expect(m.remaining).toBe(6);expect(m.charge).toBe(0);
    for(let n=0;n<360;n++)m.update(1/60,3+(n+1)/60);
    expect(m.active).toBe(false);expect(m.cooldown).toBe(12);m.kill(5,9.1);expect(m.charge).toBe(0);
    for(let n=0;n<720;n++)m.update(1/60,9+(n+1)/60);
    expect(m.cooldown).toBeCloseTo(0);m.kill(0,21.1);expect(m.charge).toBe(1);
  });
  it('狂热衰减从四秒无击杀后开始，每秒十点；不预存充能',()=>{
    const m=new CombatMomentum();m.debugCharge(50,0);m.update(4,4);expect(m.charge).toBe(50);m.update(.5,4.5);expect(m.charge).toBe(45);
    m.gain(55);expect(m.active).toBe(true);m.gain(100);expect(m.remaining).toBe(6);expect(m.charge).toBe(0);
  });
  it('狂热遵守硬上限，不修改角色基础属性，暂停完全冻结',()=>{
    const g=arena();g.stats.haste=2.49;g.stats.area=1.79;g.momentum.gain(100);
    expect(frenzyStats(g.stats,true)).toMatchObject({haste:2.5,area:1.8});expect(g.stats.haste).toBe(2.49);
    g.send({type:'pause'});for(let n=0;n<600;n++)g.tick(1/60);expect(g.momentum.remaining).toBe(6);expect(g.combatTime).toBe(0);
  });
  it('10 / 25 / 50 / 100 连杀各触发一次；三秒断连后重新计数',()=>{
    const m=new CombatMomentum(),milestones:number[]=[];
    for(let n=1;n<=110;n++){const r=m.kill(0,n*.02);if(r.milestone)milestones.push(r.milestone);}
    expect(milestones).toEqual([10,25,50,100]);expect(m.combo).toBe(110);m.update(3.01,5.21);expect(m.combo).toBe(0);m.kill(0,5.22);expect(m.combo).toBe(1);expect(m.peakCombo).toBe(110);
  });
  it('清场只计算普通敌人，吸取 360 内已有经验，冷却 20 秒，经验守恒',()=>{
    const g=arena();g.spawnDrop('xp',g.player.x+350,g.player.y,48);g.spawnDrop('xp',g.player.x+400,g.player.y,192);
    for(let n=0;n<20;n++){const id=g.spawnEnemy('homework',g.player.x+250,g.player.y);g.hitEnemy(id,100,'knife',g.player.x,g.player.y);}
    expect(g.metrics.clearRewards).toBe(1);expect(g.momentum.charge).toBe(35);expect(g.totalDroppedXp()).toBe(260);
    expect(g.drops.active.filter(id=>g.drops.data[id].attract)).toHaveLength(21);
    for(let n=0;n<20;n++){const id=g.spawnEnemy('homework',g.player.x+250,g.player.y);g.hitEnemy(id,100,'knife',0,0);}
    expect(g.metrics.clearRewards).toBe(1);expect(g.metrics.generatedXp-g.metrics.collectedRawXp).toBe(g.totalDroppedXp());
    const m=new CombatMomentum();for(let n=0;n<20;n++)m.kill(5,0);expect(m.clearCooldown).toBe(0);
  });
  it('第三次暴击连锁最多两个其他目标；不暴击、不递归，基础伤害 25% 归原武器',()=>{
    const g=arena(),p=g.player;g.stats.crit=1;g.random.next=()=>0;
    const origin=g.spawnEnemy('receipt',p.x+50,p.y),a=g.spawnEnemy('receipt',p.x+100,p.y),b=g.spawnEnemy('receipt',p.x+180,p.y),far=g.spawnEnemy('receipt',p.x+420,p.y);
    for(const id of [origin,a,b,far])g.enemies.hp[id]=g.enemies.maxHp[id]=1000;
    for(let n=0;n<3;n++)g.hitEnemy(origin,40,'knife',p.x,p.y);
    expect(g.metrics.criticalChains).toBe(1);expect(g.metrics.chainDamage).toBe(20);expect(g.metrics.criticalHits).toBe(3);
    expect([g.enemies.hp[a],g.enemies.hp[b],g.enemies.hp[far]]).toEqual([990,990,1000]);expect(g.damage.knife).toBe(230);
    for(let n=0;n<3;n++)g.hitEnemy(origin,40,'knife',p.x,p.y);expect(g.metrics.criticalChains).toBe(1);
    g.momentum.update(.6,.6);g.hitEnemy(origin,40,'knife',p.x,p.y);expect(g.metrics.criticalChains).toBe(2);
  });
  it('连锁在贯穿攻击中击杀其他目标时不漏算、不重复、不破坏迭代',()=>{
    const g=arena(),p=g.player;g.stats.crit=1;g.random.next=()=>0;g.weapons.push({id:'laser',level:5,rarity:0,evolved:true});
    for(let n=0;n<12;n++){const id=g.spawnEnemy('homework',p.x+60+n*22,p.y);g.enemies.hp[id]=20;}
    g.grid.rebuild(g.enemies.active,g.enemies.x,g.enemies.y);g.weaponSystem.update(.21);
    expect(g.kills).toBe(12);expect(g.enemies.active).toHaveLength(0);expect(g.damage.laser).toBe(240);expect(g.metrics.criticalChains).toBeLessThanOrEqual(1);
  });
  it('快速进化服从槽位，正常宝箱揭名；重复宝箱和结束指令不重复发奖',()=>{
    const g=new GameEngine(freshSave(),123);g.send({type:'evolve',id:'orbit'});g.send({type:'chest'});g.tick(1/60);
    expect(g.chest?.evolvedId).toBe('orbit');expect(g.metrics.evolutionTimes).toHaveLength(1);g.send({type:'chestDone'});g.send({type:'chestDone'});g.tick(1/60);expect(g.phase).toBe('evolution');
    g.send({type:'evolutionDone'});g.send({type:'evolutionDone'});g.tick(1/60);expect(g.phase).toBe('playing');expect(g.metrics.evolutionTimes).toHaveLength(1);expect(g.cheated).toBe(true);
    expect(validCommand({type:'frenzy',value:NaN})).toBe(false);expect(validCommand({type:'evolve',id:'__proto__'})).toBe(false);
  });
  it('30 / 60 / 120 / 240 FPS 与各档设置下，同输入含狂热 / 连杀 / 连锁的战斗完全一致',()=>{
    const states=[];
    for(const fps of [30,60,120,240])for(const quality of ['low','medium','high'] as const){
      const save=freshSave();save.settings={...save.settings,quality,muted:quality==='low',motion:quality==='high',flash:quality==='low'?0:.65};const g=new GameEngine(save,91),loop=new FixedLoop();
      g.send({type:'god',value:true});g.send({type:'frenzy',value:100});g.send({type:'combo',value:24});g.send({type:'grant',id:'luck',level:5});g.send({type:'spawn',value:60});
      for(let n=0;n<fps*12;n++){loop.advance(1/fps,dt=>{if(g.phase==='draft')g.send({type:'choose',index:0});g.inputX=.5;g.inputY=.2;g.tick(dt);});g.visualEvents.length=0;}
      states.push({x:g.player.x,y:g.player.y,hp:g.player.hp,kills:g.kills,xp:g.xp,phase:g.phase,random:g.random.state,time:g.combatTime,metrics:g.metrics,momentum:JSON.stringify(g.momentum)});
    }
    for(const state of states)expect(state).toEqual(states[0]);
  });
});
