/** Offline CPU evidence only; never part of the default test or browser matrix.
 * Both runs build all dynamic DTOs, including the same unread 2000-event batch.
 * No hot-read cache, renderer, reduced effects or simulated steps are timed. */
import {createServer} from 'vite';
import {writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {cpus} from 'node:os';
const arg=name=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:undefined;
const root=resolve(arg('--root')??'.'),output=arg('--output'),detailed=process.argv.includes('--detailed-events');if(!output)throw Error('--output is required');
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const server=await createServer({configFile:false,root,server:{middlewareMode:true},appType:'custom',logLevel:'error'});
try{
 const {freshProfile}=await server.ssrLoadModule('/src/save/v5/profile.ts'),{createS2PreviewSnapshot}=await server.ssrLoadModule('/src/semesters/inheritance.ts'),{createSemesterTwoRun}=await server.ssrLoadModule('/src/semesters/s2/createRun.ts');
 const create=()=>{const profile=freshProfile();profile.stats.wins=1;return createSemesterTwoRun(createS2PreviewSnapshot(profile,86),{publish(){}});};
 const sample=read=>{const times=[];for(let n=-5;n<25;n++){const start=performance.now();read();const duration=performance.now()-start;if(n>=0)times.push(duration);}times.sort((a,b)=>a-b);return{p50Ms:times[Math.floor(times.length*.5)],p95Ms:times[Math.floor(times.length*.95)]};};
 const scenes=[];
 for(const [name,enemies,shots,drops,events] of [['empty',0,0,0,0],['medium',240,240,240,2000],['dense',1200,300,800,2000]]){
  const engine=create(),state=engine['state'];state.enemies.clear();state.shots.clear();state.enemyShots.clear();state.drops.clear();state.visualEvents.length=0;
  for(let n=0;n<enemies;n++)state.spawnEnemy('homework',2600+n%40*24,2600+Math.floor(n/40)*24);
  for(let n=0;n<shots;n++){const id=state.shots.acquire();Object.assign(state.shots.data[id],{x:2800+n%20*12,y:2900+n%16*12,prevX:2798+n%20*12,prevY:2898+n%16*12,life:2,hits:[n%Math.max(1,enemies)]});}
  for(let n=0;n<drops;n++){const id=state.drops.acquire();Object.assign(state.drops.data[id],{x:2700+n%30*12,y:3000+Math.floor(n/30)*12,value:1});}
  for(let n=0;n<events;n++)state.emit({type:['hit','warning','death'][n%3],x:2800+n%30*10,y:2900+n%40*10,size:16,color:0xffddaa,value:n,...(detailed?{slot:n%Math.max(1,enemies),generation:1,enemyKind:'homework',rank:'elite',batch:n%20,damageType:'normal',sourceKey:'s2:whiteboard',weapon:'s2:whiteboard',contentEnemyId:'s2:bike',x2:3100+n%30*10,y2:3200+n%40*10,angle:n/100,critical:n%2===0,text:'完整事件负载 · 保留命中、预警与死亡反馈',duration:.4,level:5,evolved:true,material:'glass',priority:true,pan:.1}:{} )});
  engine.enableVisualEvents?.();
  const view=engine.read(),before=Object.fromEntries(Object.entries(state.streams).map(([name,rng])=>[name,rng.state]));
  scenes.push({name,enemies,shots,drops,events,dtoBytes:Buffer.byteLength(JSON.stringify(view)),dtoSha256:hash(view),...sample(()=>engine.read())});
  const after=Object.fromEntries(Object.entries(state.streams).map(([name,rng])=>[name,rng.state]));if(hash(before)!==hash(after))throw Error('Snapshot projection consumed gameplay RNG');
  engine.acknowledgeVisualEvents?.(view.content.visualEvents.at(-1)?.serial??0);scenes.at(-1).afterAcknowledgement=sample(()=>engine.read());engine.dispose();
 }
 const deterministic=[];
 for(const fps of [30,60,120]){const engine=create();engine['state'].player.invincible=1000;engine.dispatch({type:'move',x:.2,y:.4});for(let n=0;n<fps*4;n++)engine.advance(1/fps);const view=engine.read();deterministic.push({fps,ticks:view.clock.tick,viewSha256:hash(view),rng:Object.fromEntries(Object.entries(engine['state'].streams).map(([name,rng])=>[name,rng.state]))});engine.dispose();}
 const report={version:'s2-snapshot-a-c-v1',commit:arg('--commit')??execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sources:Object.fromEntries(['src/semesters/runtime/SemesterEngine.ts','src/semesters/s2/legacy/ContentState.ts','src/semesters/s2/legacy/rules-adapter.ts'].map(file=>[file,createHash('sha256').update(readFileSync(resolve(root,file))).digest('hex')])),node:process.version,cpu:cpus()[0].model,warmups:5,samples:25,eventPayload:detailed?'full optional visual-event fields':'minimal visual-event fields',percentile:'sorted[floor(N*q)]',method:'full dynamic projection; fixed unread event batch; no renderer or simulation inside timed read; no cache shortcut',auditP95Ms:{empty:.524,medium:6.724,dense:8.172},scenes,deterministic};
 const beforePath=arg('--before');if(beforePath){const before=JSON.parse(readFileSync(beforePath,'utf8'));report.comparison=scenes.map(scene=>{const old=before.scenes.find(row=>row.name===scene.name);return{name:scene.name,beforeP95Ms:old.p95Ms,afterP95Ms:scene.p95Ms,ratio:scene.p95Ms/old.p95Ms,auditRatio:scene.p95Ms/report.auditP95Ms[scene.name],sameDTO:scene.dtoSha256===old.dtoSha256};});if(hash(deterministic)!==hash(before.deterministic))throw Error('Fixed-step/RNG fingerprint changed');if(report.comparison.some(row=>!row.sameDTO||row.ratio>.5||row.auditRatio>.5))throw Error('Snapshot DTO equivalence or P95 target failed');}
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({output,scenes:scenes.map(({name,p50Ms,p95Ms})=>({name,p50Ms,p95Ms})),comparison:report.comparison},null,2));
}finally{await server.close();}
