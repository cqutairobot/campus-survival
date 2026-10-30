import {it,expect} from 'vitest';
import {GameEngine} from '../../src/core/engine';
import {freshSave} from '../../src/save/storage';
import {NORMAL_IDS,WAVE_WEIGHTS,WEEK_GROUP} from '../../src/data/waves';
import {Random} from '../../src/core/math';
import {writeFileSync} from 'node:fs';
const reports:unknown[]=[];
for(const week of [8,16,22])it(`第 ${week} 周 20 秒成型参考构筑：无隐藏增伤，至少 85% 普通怪三次内死亡`,()=>{
 const g=new GameEngine(freshSave(),week),rng=new Random(week);g.enemies.clear();g.weapons.splice(0,g.weapons.length,{id:'knife',level:5,rarity:0,evolved:true},{id:'ruler',level:5,rarity:0,evolved:false},{id:'keyboard',level:5,rarity:0,evolved:false},{id:'wifi',level:4,rarity:0,evolved:false});g.semesterTime=(week-1)*40+1;g.stats.crit=.05;g.god=true;const weights=WAVE_WEIGHTS[WEEK_GROUP[week-1]];
 for(let n=0;n<1200;n++){if(n%12===0){const kind=rng.weighted(NORMAL_IDS,k=>weights[NORMAL_IDS.indexOf(k)]),angle=rng.range(0,Math.PI*2),radius=rng.range(100,360);g.spawnEnemy(kind,g.player.x+Math.cos(angle)*radius,g.player.y+Math.sin(angle)*radius);}g.combatTime+=1/60;g.frame++;g.momentum.update(1/60,g.combatTime);g.behaviors.update(1/60);g.rebuildGrid();g.weaponSystem.update(1/60);g.resolveDeaths();g.visualEvents.length=0;}
 const band=week<=16?'middle':'late',hits=g.metrics.normalKillHits[band],times=g.metrics.normalKillSeconds[band],total=hits.reduce((a,b)=>a+b),three=(hits[1]+hits[2]+hits[3])/total;
 const exact=[...g.metrics.normalKillTimings[band]].sort((a,b)=>a-b),medianSeconds=exact[Math.floor(exact.length*.5)],p90Seconds=exact[Math.floor(exact.length*.9)];
 const report={medianSeconds,p90Seconds,week,seconds:20,zeroTalents:true,rarity:'普通',build:['knife evolved Lv.5','ruler Lv.5','keyboard Lv.5','wifi Lv.4'],normalDeaths:total,withinThreeHits:three,hits,firstHitToDeathBuckets:times,heavyHits:g.metrics.heavyKillHits,actualDamage:g.damage,shieldDamage:g.metrics.shieldDamage,overkill:g.metrics.overkill};reports.push(report);
 expect(total).toBeGreaterThan(40);expect(three).toBeGreaterThanOrEqual(.85);expect(medianSeconds).toBeLessThanOrEqual(.9);expect(p90Seconds).toBeLessThanOrEqual(2);expect((times[0]+times[1]+times[2])/total).toBeGreaterThanOrEqual(.9);
 if(reports.length===3)writeFileSync('docs/v3-controlled-balance.json',JSON.stringify(reports,null,2));
});
