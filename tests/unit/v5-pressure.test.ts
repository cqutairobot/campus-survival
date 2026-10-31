import {describe,it,expect} from 'vitest';
import {randomStreams} from '../../src/core/run';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import type {RuntimeServices,RuntimeStep} from '../../src/semesters/runtime/contracts';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {LEGACY_CONTENT as content} from '../../src/semesters/s2/legacy/catalog';
import {legacyContentRules} from '../../src/semesters/s2/legacy/rules-adapter';
import {pressureAt,eliteSeconds,normalWeight} from '../../src/semesters/s2/pressure';
import {cappedDamage,invulnerabilityFor,type IncomingHit} from '../../src/semesters/s2/player-damage';
import {DangerScheduler,dangerContains,safeDangerRoute,type S2Hazard} from '../../src/semesters/s2/danger';
import {createS2WorldSnapshot,worldBlocked,worldNavigation,type Point,type S2WorldSnapshot} from '../../src/semesters/s2/world';

function opening(seed=77){const p=freshProfile();p.stats.wins=1;return createS2PreviewSnapshot(p,seed,{choice:{id:'topic',weaponId:'knife'}});}
function fixture(){const snapshot=opening(),services:RuntimeServices={snapshot,streams:randomStreams(snapshot.seed)},s=new ContentState(content,services);s.enemies.clear();s.weapons.length=0;s.player.invincible=0;return{s,services};}
function step(s:ContentState,services:RuntimeServices,tick:number,grants:Partial<RuntimeStep>={}){return s.tick({...services,dt:1/60,clock:{tick,combatSeconds:tick/60,teachingSeconds:tick/60,assessmentSeconds:0,week:s.week,completedWeeks:s.week-1},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n,...grants});}
function request(s: DangerScheduler,p:Point,extra:Partial<S2Hazard>={}){return s.request({id:0,kind:'circle',x:p.x,y:p.y,x2:0,y2:0,radius:65,warning:1,life:.3,damage:1000,hit:false,...extra},extra.tier??'normal',0,extra.trackPlayer)!;}
const world=createS2WorldSnapshot(['library','canteen','track','lab','workshop','garden']);

describe('v5 semester-two pressure and fairness',()=>{
 it('interpolates 24 weeks from catalogue bases, spends capped budgets, bounds support and queues only one elite opportunity',()=>{
  const expected=[[1,4,1.25,1.05,1,240,0],[4,7.5,1.75,1.2,1.06,360,2],[8,14,2.5,1.4,1.13,560,2],[12,23,2.95,1.65,1.2,760,2],[16,32,3.3,1.85,1.25,960,2],[20,42,3.6,2,1.28,1120,3],[24,50,3.85,2.1,1.3,1200,3]];
  for(const [w,rate,hp,damage,speed,normalCap,eliteCap] of expected)expect(pressureAt(w)).toMatchObject({rate,hp,damage,speed,normalCap,eliteCap});
  expect(pressureAt(2).rate).toBeCloseTo(4+3.5/3);expect(pressureAt(23)).toMatchObject({rate:48,normalCap:1180,eliteCap:3});expect(pressureAt(23).hp).toBeCloseTo(3.7875);expect(pressureAt(0)).toEqual(pressureAt(1));expect(pressureAt(30)).toEqual(pressureAt(24));
  expect(eliteSeconds(3)).toEqual([]);expect(eliteSeconds(4)).toEqual([12]);expect(eliteSeconds(9)).toEqual([12,32]);for(const w of [6,13,20])expect(eliteSeconds(w)).toEqual([12]);
  expect(content.waves.normalIds.every(id=>normalWeight(id,24)>0)).toBe(true);
  const {s}=fixture();s.week=24;const base=content.enemyById.homework,id=s.spawnEnemy('homework',3300,3072);expect(s.enemies.maxHp[id]).toBe(Math.ceil(base.hp*3.85));expect(s.enemies.speed[id]).toBeCloseTo(base.speed*1.3);expect(s.enemies.damage[id]).toBeCloseTo(base.damage*2.1);
  const elite=s.spawnEnemy('ddl',3300,3072);expect(s.enemies.maxHp[elite]).toBe(2210);expect(s.enemies.damage[elite]).toBeCloseTo(content.enemyById.ddl.damage*2.1);
  s.enemies.clear();s.ordinarySpawnsAllowed=true;s.semesterTime=23*40;
  for(let tick=0;tick<1800;tick++)s.director.update(1/60);
  expect(s.enemies.active.filter(n=>s.enemies.rank[n]===0)).toHaveLength(1200);
  for(const [kind,cap] of [['summoner',4],['leader',3]] as const)expect(s.enemies.active.filter(n=>content.enemies[s.enemies.kind[n]].id===kind).length).toBeLessThanOrEqual(cap);
  s.enemies.clear();s.director.update(1/60);expect(s.enemies.active.length).toBeLessThanOrEqual(1);
  s.week=9;s.semesterTime=8*40+12;for(let n=0;n<2;n++)s.spawnEnemy('ddl',3300,3072);s.director.update(1/60);expect(s.director.pendingElites).toEqual([9]);
  for(const w of [10,12,14]){s.week=w;s.semesterTime=(w-1)*40+33;s.director.update(1/60);expect(s.director.pendingElites).toHaveLength(1);}
  s.enemies.clear();s.director.update(1/60);expect(s.enemies.active.filter(n=>s.enemies.rank[n]===1)).toHaveLength(1);s.dispose();
  const mini=fixture().s;mini.ordinarySpawnsAllowed=true;mini.week=6;mini.semesterTime=5*40+20;mini.director.update(1/60);expect(mini.enemies.active.some(n=>mini.enemies.rank[n]===2)).toBe(true);for(let n=1;n<120;n++)mini.director.update(1/60);expect(mini.metrics.normalSpawned-12).toBe(Math.floor(pressureAt(6).rate*.75*2));mini.dispose();
 });

 it('caps total post-armour incidents before both shields, admits one stable hit per step and protects for at least 42 ticks',()=>{
  const hit:IncomingHit={kind:'environment',id:0,generation:0,tier:'normal',damage:10000,x:3072,y:3072};
  for(const [tier,cap] of [['normal',30],['elite',40],['boss',45]] as const){
   expect(cappedDamage({...hit,tier},100,8,1.1)).toBe(cap);
   const {s,services}=fixture();s.stats.maxHp=s.player.hp=100;s.stats.armor=8;s.addShield(10,10);const grants:number[]=[];
   s.behaviors.update=()=>s.hurtPlayer(hit.damage,hit.x,hit.y,{...hit,tier});step(s,services,1,{damageAfterInheritance:n=>{grants.push(n);return n-5;}});
   expect(grants).toEqual([cap-10]);expect(s.player.hp).toBe(100-(cap-15));expect(s.player.shield).toBe(0);expect(s.player.invincible).toBe(.7);s.dispose();
  }
  expect(cappedDamage({...hit,damage:9},100,8,1.1)).toBeCloseTo(1.9);expect([invulnerabilityFor(.1),invulnerabilityFor(2)]).toEqual([.7,1.5]);
  const run=(reverse:boolean)=>{
   const {s,services}=fixture();s.stats.maxHp=s.player.hp=100;const hits=[{...hit,id:8,damage:8},{...hit,id:2,tier:'boss' as const,damage:999}];if(reverse)hits.reverse();
   s.behaviors.update=()=>{for(const h of hits)s.hurtPlayer(h.damage,h.x,h.y,h);};step(s,services,1);expect(s.player.hp).toBe(55);expect(s.metrics.hurtCount).toBe(1);
   for(let t=2;t<=42;t++)step(s,services,t);expect(s.player.hp).toBe(55);step(s,services,43);expect(s.player.hp).toBe(10);expect(s.metrics.hurtCount).toBe(2);
   for(let t=44;t<=85;t++)step(s,services,t);expect(s.player.hp).toBeLessThanOrEqual(0);const result=[s.player.hp,s.metrics.hurtCount,s.player.invincible];s.dispose();return result;
  };expect(run(false)).toEqual(run(true));
  for(const reverse of [false,true]){
   const {s,services}=fixture();s.week=4;s.stats.maxHp=s.player.hp=100;
   for(const kind of ['homework','ddl']){const id=s.spawnEnemy(kind,s.player.x,s.player.y);s.enemies.damage[id]=999;s.enemies.speed[id]=0;s.enemies.affixes[id]=0;}
   if(reverse)s.enemies.active.reverse();step(s,services,1);expect(s.player.hp).toBe(60);expect(s.metrics.hurtCount).toBe(1);s.dispose();
  }
  const shots=fixture();shots.s.enemyBullet(shots.s.player.x,shots.s.player.y,0,0,999);expect(shots.s.enemyShots.data[shots.s.enemyShots.active[0]].age).toBe(-1);
  for(let t=1;t<=59;t++)step(shots.s,shots.services,t);expect(shots.s.metrics.hurtCount).toBe(0);step(shots.s,shots.services,60);expect(shots.s.metrics.hpLost).toBeCloseTo(shots.s.stats.maxHp*.3);shots.s.dispose();
  const {s}=fixture();s.inputX=1;s.setPhase('draft');s.setPhase('playing');expect([s.inputX,s.inputY,s.player.invincible]).toEqual([0,0,.75]);s.dispose();
 });

 it('proves an actually reachable 100px route through the injected world and authored retreats, and defers sealed or too-slow escapes',()=>{
  const nav=worldNavigation(world);
  for(const site of world.assessmentSites.filter(s=>s.retreats.length)){
   const active:S2Hazard[]=[],scheduler=new DangerScheduler(world,active),p=site.center,h=request(scheduler,p,{kind:'line',x:p.x-180,x2:p.x+180,y2:p.y,radius:18,tier:'boss'}),route=safeDangerRoute(world,nav,p,220,h)!;
   expect(route,site.id).not.toBeNull();expect(route.width).toBe(100);expect(route.travelSeconds).toBeLessThanOrEqual(h.warning-.2);expect(dangerContains(h,route.points.at(-1)!,50)).toBe(false);
   for(let n=1;n<route.points.length;n++){const a=route.points[n-1],b=route.points[n],count=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/8));for(let k=0;k<=count;k++)expect(worldBlocked(world,a.x+(b.x-a.x)*k/count,a.y+(b.y-a.y)*k/count,50)).toBe(false);}
   expect(safeDangerRoute(world,nav,p,5,h)).toBeNull();
   const ring=request(scheduler,p,{kind:'ring',radius:250,safeAngle:Math.PI/2});const safe=safeDangerRoute(world,nav,p,220,ring)!;expect(safe).not.toBeNull();expect(ring.safeHalfAngle).toBeGreaterThanOrEqual(Math.PI/4);expect(dangerContains(ring,safe.points.at(-1)!,50)).toBe(false);
  }
  const injected=structuredClone(world) as S2WorldSnapshot,p=world.spawn;
  for(const r of [{x:p.x-140,y:p.y-140,w:32,h:280},{x:p.x+108,y:p.y-140,w:32,h:280},{x:p.x-140,y:p.y-140,w:280,h:32},{x:p.x-140,y:p.y+108,w:280,h:32}])injected.blockers.push({...r,name:'test wall',color:0,type:'college'});
  const active:S2Hazard[]=[],scheduler=new DangerScheduler(injected,active),h=request(scheduler,p);
  scheduler.update(1,1,p,220,()=>true,()=>{});expect(active).toEqual([]);expect(h.phase).toBe('queued');expect(h.retryTick).toBe(31);expect(h.warning).toBe(1);expect(h.token).toBe(0);
 });

 it('orders major tokens deterministically, retries on fixed ticks without shortening warnings, locks aim and cancels stale owners',()=>{
  const p={x:3104,y:3104},active:S2Hazard[]=[],scheduler=new DangerScheduler(world,active),starts:number[]=[];
  const handles=[9,2,7].map(owner=>request(scheduler,{x:p.x+500,y:p.y},{owner,ownerGeneration:1,cancelOnDeath:true}));
  const update=(tick:number,alive=true,week=1)=>scheduler.update(tick,week,p,220,()=>alive,h=>starts.push(h.owner!));
  update(1);expect(starts).toEqual([2,7]);expect(active).toHaveLength(2);expect(handles[0].retryTick).toBe(31);
  scheduler.cancelOwner(2,1);update(2);expect(starts).toEqual([2,7]);for(let t=3;t<=31;t++)update(t);expect(starts).toEqual([2,7,9]);expect(handles[0].warning).toBe(1);
  for(let t=32;t<=60;t++)update(t);expect(handles[2].phase).toBe('warning');update(61);expect(handles[2].phase).toBe('active');update(62,false);expect(active).toEqual([]);expect(scheduler.pending).toEqual([]);expect(handles.every(h=>h.token===0)).toBe(true);
  for(let n=0;n<4;n++)request(scheduler,{x:p.x+500+n*10,y:p.y},{id:n});update(63,true,17);expect(active).toHaveLength(3);scheduler.clear();
  const tracked=request(scheduler,{x:p.x-500,y:p.y},{kind:'line',x2:p.x-400,y2:p.y,radius:18,trackPlayer:true});
  scheduler.update(64,1,p,220,()=>true,()=>{});p.y+=20;for(let t=65;t<=103;t++)update(t);expect(tracked.locked).toBe(true);expect(tracked.warning).toBe(.35);const locked=[tracked.x2,tracked.y2];p.y+=120;update(104);expect([tracked.x2,tracked.y2]).toEqual(locked);
  scheduler.clear();const aimed=request(scheduler,p,{kind:'circle',radius:65,trackPlayer:true});let lockedAt=0;
  for(let tick=105;tick<=165;tick++){update(tick);if(aimed.locked&&!lockedAt)lockedAt=aimed.warning;}
  expect(lockedAt).toBeGreaterThanOrEqual(.35);expect(aimed.phase).toBe('active');expect(scheduler.pending).toEqual([]);
 });

 it('repeats fixed-seed pressure, danger admissions and damage at 30/60/120Hz through the production fixed loop',()=>{
  const run=(hz:number,seed=77)=>{
   const base=legacyContentRules(content);let state!:ContentState;const admissions:{tick:number;id:number;token:number}[]=[],seen=new Set<number>();
   const engine=new SemesterEngine({snapshot:opening(seed),config:S2_RUNTIME_CONFIG,view:{publish(){}},rules:{...base,create(services){state=base.create(services);state.enemies.clear();state.weapons.length=0;state.player.invincible=0;return state;},step(s,context){
    if(context.clock.tick===1){s.addHazard('circle',s.player.x,s.player.y,0,0,65,0,.3,999);s.addHazard('circle',s.player.x+500,s.player.y,0,0,65,0,.3,999);s.addHazard('line',s.player.x-300,s.player.y+300,s.player.x+300,s.player.y+300,18,0,.5,999);}
    if(context.clock.tick===90)s.command({type:'move',x:.4,y:0});
    const result=base.step(s,{...context,clock:{...context.clock,week:9,teachingSeconds:8*40+11+context.clock.tick/60}});
    for(const h of s.hazards)if(!seen.has(h.token)){seen.add(h.token);admissions.push({tick:h.startedTick,id:h.id,token:h.token});}return result;
   }}});
   for(let n=0;n<hz*3;n++)engine.advance(1/hz);
   const view=engine.read(),result={clock:view.clock,hp:view.content.player.hp,player:view.content.player,admissions,queued:view.content.dangerQueue,enemies:state.enemies.active.map(id=>[id,state.enemies.kind[id],state.enemies.hp[id],state.enemies.x[id],state.enemies.y[id]]),spawnState:state.streams.spawn.state,hurt:state.metrics.hurtCount};
   expect(view.clock.tick).toBe(180);expect(admissions.filter(h=>h.id<3)).toHaveLength(3);expect(state.metrics.hurtCount).toBe(1);expect(state.enemies.active.some(id=>state.enemies.rank[id]===1)).toBe(true);engine.dispose();return result;
  };
  const baseline=run(60);expect(run(30)).toEqual(baseline);expect(run(120)).toEqual(baseline);expect(run(60)).toEqual(baseline);expect(run(60,78).spawnState).not.toBe(baseline.spawnState);
 });
});
