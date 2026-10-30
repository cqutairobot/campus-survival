import { createServer } from 'vite';
import { performance } from 'node:perf_hooks';
import { mkdirSync,writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Pure simulation stress. It is deliberately reported separately from GPU/render FPS.
const duration=Number(process.argv.find(a=>a.startsWith('--seconds='))?.split('=')[1])||600;
const target=Number(process.argv.find(a=>a.startsWith('--entities='))?.split('=')[1])||900;
const output=process.argv.find(a=>a.startsWith('--output='))?.split('=')[1]||'docs/performance-simulation.json';
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
  const {GameEngine}=await server.ssrLoadModule('/src/core/engine.ts');const {freshSave}=await server.ssrLoadModule('/src/save/storage.ts');
  const g=new GameEngine(freshSave(),20261030);g.weapons.length=0;
  for(const id of ['orbit','bot','lightning','wifi','rain','laser'])g.send({type:'grant',id,level:5,evolved:true});
  g.send({type:'god',value:true});g.send({type:'week',value:17});g.send({type:'spawn',value:target});g.tick(1/60);
  // A controlled stress arena excludes random full-screen clears.
  g.specialCooldown.bomb=Infinity;
  const samples=[];let minimum=Infinity,maximum=0,visibleMinimum=Infinity;
  const start=performance.now();
  for(let frame=0;frame<duration*60;frame++){
    // Maintain a long stress arena, with normal weapon, collision, pickup and AI behavior.
    g.semesterTime=650;
    {const missing=target-g.enemies.active.length;for(let n=0;n<missing;n++){const a=g.random.range(0,Math.PI*2),r=g.random.range(130,380);g.spawnEnemy(['homework','checkin','ppt','review','receipt'][n%5],g.player.x+Math.cos(a)*r,g.player.y+Math.sin(a)*r);}}
    while(g.enemies.active.length>target)g.enemies.release(g.enemies.active.at(-1));
    for(let n=g.drops.active.length-1;n>=0;n--){const id=g.drops.active[n];if(g.drops.data[id].kind==='bomb')g.drops.release(id);}
    if(g.phase==='draft')g.send({type:'choose',index:0});else if(g.phase==='chest')g.send({type:'chestDone'});else if(g.phase==='evolution')g.send({type:'evolutionDone'});
    for(const id of g.enemies.active){if(g.enemies.maxHp[id]<8000){g.enemies.maxHp[id]=8000;g.enemies.hp[id]=8000;}}
    if(frame%120===0)for(const id of g.enemies.active.slice(0,24))g.enemies.hp[id]=12;
    if(frame%1200===0)g.send({type:'frenzy',value:100});
    const t=performance.now();g.tick(1/60);samples.push(performance.now()-t);g.visualEvents.length=0;
    if(frame>60)minimum=Math.min(minimum,g.enemies.active.length);maximum=Math.max(maximum,g.enemies.active.length);
    if(frame>60){let visible=0;for(const id of g.enemies.active)if(Math.abs(g.enemies.x[id]-g.player.x)<g.viewWidth/2&&Math.abs(g.enemies.y[id]-g.player.y)<g.viewHeight/2)visible++;visibleMinimum=Math.min(visibleMinimum,visible);}
    if(frame%6000===0)console.log(`模拟 ${Math.floor(frame/60)} / ${duration} 秒，${g.enemies.active.length} 活跃敌人`);
  }
  samples.sort((a,b)=>a-b);
  const report={kind:'simulation-only',warning:'CPU 模拟结果，不代表渲染帧率或真机性能。每两秒设置 24 个可击杀目标，六进化武器与狂热并发。',date:new Date().toISOString(),runtime:process.version,target,durationSimulatedSeconds:duration,wallSeconds:(performance.now()-start)/1000,frames:samples.length,meanSimulationMs:samples.reduce((a,b)=>a+b,0)/samples.length,p95SimulationMs:samples[Math.floor(samples.length*.95)],p99SimulationMs:samples[Math.floor(samples.length*.99)],minimumActiveEnemies:minimum,maximumActiveEnemies:maximum,minimumVisibleEnemiesAfterWarmup:visibleMinimum,weapons:g.weapons,metrics:g.metrics,poolFailures:g.poolFailures,pools:Object.fromEntries(['enemies','shots','enemyShots','areas','drops'].map(k=>[k,{capacity:g[k].capacity,peak:g[k].peak,overflow:g[k].overflow}]))};
  mkdirSync(resolve('docs'),{recursive:true});writeFileSync(resolve(output),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  if(g.poolFailures)process.exitCode=1;g.dispose();
}finally{await server.close();}
