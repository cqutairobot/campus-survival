import { createServer } from 'vite';
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
const arg=(name,fallback)=>process.argv.find(a=>a.startsWith(`--${name}=`))?.split('=')[1]??fallback;
const seeds=Number(arg('seeds','20')),seconds=Number(arg('seconds','300')),output=arg('output','docs/v2-early-runs.json');
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
  const {GameEngine}=await server.ssrLoadModule('/src/core/engine.ts');
  const {freshSave}=await server.ssrLoadModule('/src/save/storage.ts');
  const {CHARACTERS,TALENTS,CONTENT_VERSION}=await server.ssrLoadModule('/src/data/catalog.ts');
  const {pilot}=await server.ssrLoadModule('/tests/helpers/pilot.ts');
  const start=performance.now(),runs=[];
  for(const talent of ['zero','partial','full'])for(const character of CHARACTERS)for(const strategy of ['balanced','expand','specialize']) {
    for(let seed=1;seed<=seeds;seed++) {
      const save=freshSave();save.selected=character.id;save.unlocked=CHARACTERS.map(c=>c.id);
      save.talents=talent==='zero'?{}:talent==='partial'?{hp:2,damage:2,speed:1,haste:1,xp:2,regen:1,magnet:1,luck:1}:Object.fromEntries(TALENTS.map(t=>[t.id,5]));
      const g=new GameEngine(save,seed),samples=[],first={kill:null,upgrade:null,secondWeapon:null,thirdWeapon:null,fourthWeapon:null,mainLv5:null,evolution:null};
      let next=30,lastLevel=1,lastMinute=0,minuteLevel=1;
      for(let frame=0;frame<seconds*65+500&&!g.result&&g.combatTime<seconds;frame++) {
        pilot(g,strategy);g.tick(1/60);g.visualEvents.length=0;
        const t=g.combatTime;
        if(g.kills&&first.kill===null)first.kill=t;
        if(g.level>1&&first.upgrade===null)first.upgrade=t;
        for(const [count,key] of [[2,'secondWeapon'],[3,'thirdWeapon'],[4,'fourthWeapon']])if(g.weapons.length>=count&&first[key]===null)first[key]=t;
        if(g.weapons[0].level===5&&first.mainLv5===null)first.mainLv5=t;
        if(g.weapons.some(w=>w.evolved)&&first.evolution===null)first.evolution=t;
        if(t+1e-6>=next) {
          const minute=Math.floor((next+1e-6)/60),upgrades=g.level-lastLevel;
          const snapshot={seconds:next,level:g.level,upgradesSinceLastSample:upgrades,upgradesThisMinute:minute>lastMinute?g.level-minuteLevel:null,kills:g.kills,enemies:g.enemies.active.length,hp:g.player.hp,damage:{...g.damage},weapons:g.weapons.map(w=>({...w})),passives:g.passives.map(w=>({...w})),droppedXp:g.totalDroppedXp(),metrics:g.metrics?structuredClone(g.metrics):null};
          samples.push(snapshot);lastLevel=g.level;if(minute>lastMinute){lastMinute=minute;minuteLevel=g.level;}next+=30;
        }
      }
      runs.push({seed,talent,character:character.id,strategy,first,deathTime:g.result?.seconds??null,completed:g.combatTime+1e-6>=seconds,endSeconds:g.combatTime,credits:g.result?.credits??g.creditsFor(false),creditStatus:g.result?'settled':'preview-if-ended-now',cheated:g.cheated,samples,poolFailures:g.poolFailures,pools:Object.fromEntries(['enemies','shots','enemyShots','areas','drops'].map(k=>[k,{peak:g[k].peak,overflow:g[k].overflow}]))});g.dispose();
    }
    console.log(`${talent} / ${character.id} / ${strategy}: ${seeds} seeds`);
  }
  const quantile=(values,q)=>{const sorted=values.filter(v=>v!==null).sort((a,b)=>a-b);return sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))]:null;};
  const summaries=[];
  for(const talent of ['zero','partial','full'])for(const strategy of ['balanced','expand','specialize']) {
    const group=runs.filter(r=>r.talent===talent&&r.strategy===strategy);
    summaries.push({talent,strategy,starts:group.length,deaths:group.filter(r=>r.deathTime!==null).length,firstUpgradeP50:quantile(group.map(r=>r.first.upgrade),.5),firstUpgradeP90:quantile(group.map(r=>r.first.upgrade),.9),firstKillP50:quantile(group.map(r=>r.first.kill),.5),mainLv5P50:quantile(group.map(r=>r.first.mainLv5),.5),evolutionP50:quantile(group.map(r=>r.first.evolution),.5),minutes:[60,120,180,240,300].map(seconds=>{
      const surviving=group.flatMap(r=>r.samples.filter(s=>s.seconds===seconds));
      return{seconds,allStarts:group.length,survivors:surviving.length,coverage3Weapons:surviving.length?surviving.filter(s=>s.weapons.length>=3).length/surviving.length:null,levelP50:quantile(surviving.map(s=>s.level),.5),levelP10:quantile(surviving.map(s=>s.level),.1),levelP90:quantile(surviving.map(s=>s.level),.9),killsP50:quantile(surviving.map(s=>s.kills),.5),upgradesP50:quantile(surviving.map(s=>s.upgradesThisMinute),.5),activeWeaponsP50:quantile(surviving.map(s=>s.weapons.length),.5)};
    })});
  }
  const report={date:new Date().toISOString(),contentVersion:CONTENT_VERSION,kind:'ordinary-input-five-minute-simulation',seedsPerCell:seeds,totalRuns:runs.length,seconds,wallSeconds:(performance.now()-start)/1000,notes:'战斗时间；普通移动、正常选卡和宝箱；死亡样本保留；分钟分位数使用到达该分钟的存活样本，不含选卡墙钟时间。',summaries,runs};
  writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({output,wallSeconds:report.wallSeconds,totalRuns:runs.length,summaries},null,2));
  if(runs.some(r=>r.cheated||r.poolFailures))process.exitCode=1;
} finally {await server.close();}
