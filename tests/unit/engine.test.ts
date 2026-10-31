// 历史契约 / 旧流程前提：自动进化和 Boss 即时死亡/旧宝箱流程前提过期；当前奖励 token、死亡队列见 v3-content、v3-foundation。
// 逐项说明见 docs/v4.0.1-legacy-tests.md；不属于默认门禁，不为这些预期恢复旧数值。
import { describe, expect, it } from 'vitest';
import { GameEngine } from '../../src/core/engine';
import { FixedLoop } from '../../src/core/loop';
import { freshSave } from '../../src/save/storage';
import { WEAPONS } from '../../src/data/catalog';
const create=(seed=123)=>new GameEngine(freshSave(),seed);
const tick=(g:GameEngine,count=1)=>{for(let n=0;n<count;n++){g.tick(1/60);g.visualEvents.length=0;}};
describe('战斗流程与守恒',()=>{
  it('暂停冻结所有战斗和学期时间，恢复不补算后台时间',()=>{const g=create();tick(g,60);g.send({type:'pause'});tick(g);const before=g.snapshot();tick(g,300);expect(g.semesterTime).toBe(before.semesterTime);expect(g.combatTime).toBe(before.combatTime);g.send({type:'resume'});tick(g);expect(g.phase).toBe('playing');expect(g.semesterTime-before.semesterTime).toBeCloseTo(1/60);});
  it('升级先慢放再暂停，选择后只获得一项技能',()=>{const g=create();g.addExperience(12);tick(g,20);expect(g.phase).toBe('draft');expect(g.cards).toHaveLength(3);const previous=g.weapons.length+g.passives.length;g.send({type:'choose',index:0});g.send({type:'choose',index:0});tick(g);expect(g.phase).toBe('playing');expect(g.level).toBe(2);expect(g.weapons.length+g.passives.length).toBeLessThanOrEqual(previous+1);});
  it('16 个宝箱进化保留槽位、品质与被动，进化后不重复出现',()=>{
    for(const def of WEAPONS){const g=create();g.weapons.splice(0,g.weapons.length,{id:def.id,level:5,rarity:2,evolved:false});g.passives.push({id:def.evolution.passive,level:1,rarity:0,evolved:false});g.openChest();expect(g.chest?.evolvedId).toBe(def.id);expect(g.weapons).toEqual([{id:def.id,level:5,rarity:2,evolved:true}]);expect(g.passives).toHaveLength(1);g.send({type:'chestDone'});tick(g);expect(g.phase).toBe('evolution');g.send({type:'evolutionDone'});tick(g);expect(g.phase).toBe('playing');}
  });
  it('经验合并与磁铁保持总经验，不把非经验掉落吞掉',()=>{const g=create();for(let n=0;n<1000;n++)g.spawnDrop('xp',3000+n%10,3000+n%9,n%12+1);g.spawnDrop('heal',3000,3000,25);const before=g.totalDroppedXp();g.mergeExperience();expect(g.totalDroppedXp()).toBe(before);expect(g.drops.active.some(id=>g.drops.data[id].kind==='heal')).toBe(true);g.magnet();expect(g.totalDroppedXp()).toBe(before);expect(g.drops.active.filter(id=>g.drops.data[id].kind==='xp').every(id=>g.drops.data[id].attract)).toBe(true);});
  it('Boss 周边界只触发一次，Boss 战加时，死亡后自动开宝箱',()=>{
    const g=create();g.semesterTime=319.99;tick(g);expect(g.phase).toBe('bossIntro');const before=g.semesterTime;g.send({type:'introDone'});tick(g,60);expect(g.semesterTime).toBe(before);expect(g.bossTime).toBeGreaterThan(.9);const boss=g.bossEnemy;
    g.hitEnemy(boss,1e9,'knife',0,0);g.hitEnemy(boss,1e9,'knife',0,0);expect(g.kills).toBe(1);tick(g);expect(g.phase).toBe('bossDeath');expect(g.bosses).toBe(1);g.send({type:'bossDeathDone'});tick(g);expect(g.phase).toBe('chest');g.send({type:'chestDone'});tick(g);expect(g.phase).toBe('playing');tick(g,3);expect(g.bossEnemy).toBe(-1);expect(g.week).toBe(9);
  });
  it('最终 Boss 与玩家同帧死亡，判负且结算只执行一次',()=>{let settlements=0;const g=new GameEngine(freshSave(),12,{publish:()=>{},discover:()=>{},settle:()=>settlements++});g.startBoss(2);g.send({type:'introDone'});tick(g);g.hitEnemy(g.bossEnemy,1e9,'knife',0,0);g.player.hp=0;tick(g);expect(g.result?.victory).toBe(false);g.finish(true);tick(g);expect(settlements).toBe(1);});
  it('正常胜利必须等最终奖励揭晓，调试局不发绩点',()=>{const g=create();g.send({type:'boss',value:2});g.send({type:'introDone'});tick(g);g.hitEnemy(g.bossEnemy,1e9,'knife',0,0);tick(g);g.send({type:'bossDeathDone'});tick(g);expect(g.result).toBeNull();g.send({type:'chestDone'});tick(g);expect(g.result?.victory).toBe(true);expect(g.result?.credits).toBe(0);});
  it('熬夜不会救活已被击杀的玩家，自损在 1 HP 停止',()=>{const g=create();g.passives.push({id:'night',level:5,rarity:0,evolved:false});g.stats.drain=.008;g.player.hp=1;tick(g);expect(g.player.hp).toBe(1);g.player.hp=0;tick(g);expect(g.phase).toBe('result');});
  it('池复用后的旧命中记录不会阻止新敌人受伤',()=>{const g=create(),e=g.enemies;const id=e.active[0],old=e.generation[id];e.orbitHits[id*12]=999;e.release(id);const next=g.spawnEnemy('homework',3100,3100);expect(next).toBe(id);expect(e.generation[next]).not.toBe(old);expect(e.orbitHits[next*12]).toBe(0);});
  it('不同渲染频率与视觉事件消费频率得到相同确定性战斗',()=>{
    const results=[];for(const fps of [30,60,120]){const g=create(),loop=new FixedLoop();g.inputX=.7;g.inputY=.2;for(let n=0;n<fps*10;n++){loop.advance(1/fps,dt=>g.tick(dt));g.visualEvents.length=0;}results.push({hp:g.player.hp,x:g.player.x,y:g.player.y,kills:g.kills,xp:g.xp,enemies:g.enemies.active.length,time:g.semesterTime,random:g.random.state});}expect(results[0]).toEqual(results[1]);expect(results[1]).toEqual(results[2]);
  });
  it('500/800/1200 实体压力下不溢出关键逻辑池',()=>{for(const count of [500,800,1200]){const g=create();g.send({type:'god',value:true});g.send({type:'spawn',value:count});tick(g,10);expect(g.poolFailures).toBe(0);expect(g.enemies.active.length).toBeGreaterThan(count*.8);}});
});
