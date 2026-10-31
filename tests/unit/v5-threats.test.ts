import {describe,it,expect} from 'vitest';
import {randomStreams} from '../../src/core/run';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import type {RuntimeServices} from '../../src/semesters/runtime/contracts';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {LEGACY_CONTENT} from '../../src/semesters/s2/legacy/catalog';
import {projectContent} from '../../src/semesters/s2/legacy/rules-adapter';
import {S2_CONTENT as content} from '../../src/semesters/s2/content';
import {eliteSeconds,normalWeight,pressureAt} from '../../src/semesters/s2/pressure';
import {FIRST_THREAT_WEEKS,LESSON_MELEE} from '../../src/semesters/s2/first-chapter';
import type {S2Hazard} from '../../src/semesters/s2/danger';

function fixture(week=1){
 const profile=freshProfile();profile.stats.wins=1;const snapshot=createS2PreviewSnapshot(profile,77),services:RuntimeServices={snapshot,streams:randomStreams(snapshot.seed)},s=new ContentState(content,services);
 s.enemies.clear();s.weapons.length=0;s.week=week;Object.assign(s.player,{x:3104,y:3104,prevX:3104,prevY:3104,invincible:0});s.rebuildGrid();let tick=0;
 const step=()=>s.tick({...services,dt:1/60,clock:{tick:++tick,combatSeconds:tick/60,teachingSeconds:(week-1)*40+tick/60,assessmentSeconds:0,week,completedWeeks:week-1},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n});
 const until=(predicate:()=>boolean,limit=600)=>{for(let n=0;n<limit&&!predicate();n++)step();expect(predicate()).toBe(true);};
 const spawn=(kind:string)=>{const id=s.spawnEnemy(kind,s.player.x-260,s.player.y);s.enemies.cooldown[id]=0;s.enemies.speed[id]=0;return id;};
 return{s,services,step,until,spawn};
}
const hazards=(s:ContentState)=>[...s.hazards,...s.danger.pending];
const kill=(s:ContentState,id:number)=>{s.hitEnemy(id,1e8,'knife',s.player.x,s.player.y,0,false,false);s.resolveDeaths();s.resolveDeaths();};

describe('v5 first-chapter threats',()=>{
 it('waits for admitted handles, follows the actual locked bike line, marks old landing positions and uses capped player damage',()=>{
  expect(content.enemies.slice(0,25)).toEqual(LEGACY_CONTENT.enemies);
  for(const [kind,week] of Object.entries(FIRST_THREAT_WEEKS)){
   const f=fixture(week),{s}=f,e=s.enemies;
   // Both tokens are occupied: the new attack must wait through a real retry.
   for(let n=0;n<2;n++)s.addHazard('circle',s.player.x+700,s.player.y+n*180,0,0,45,2,.5,0);
   const id=f.spawn(kind),origin={x:e.x[id],y:e.y[id]},target={x:s.player.x,y:s.player.y};f.step();
   const h=hazards(s).find(h=>h.owner!==undefined)!;expect(h.phase).toBe('queued');expect(h).toMatchObject({ownerGeneration:e.generation[h.owner!],cancelOnDeath:true,tier:'normal'});
   for(let n=0;n<30;n++)f.step();expect(h.phase).toBe('queued');expect([e.x[id],e.y[id]]).toEqual([origin.x,origin.y]);expect(s.metrics.hurtCount).toBe(0);
   f.until(()=>h.phase==='warning');expect(h.warning).toBe(h.warningTotal);expect(h.warningTotal).toBeGreaterThanOrEqual(1);
   if(kind==='s2:bike'){
    s.player.y+=50;f.until(()=>h.locked);const locked={x:h.x2,y:h.y2};s.player.y+=180;
    f.until(()=>h.phase==='active');expect([e.x[id],e.y[id]]).toEqual([origin.x,origin.y]);expect([h.x2,h.y2]).toEqual([locked.x,locked.y]);
    f.step();const dx=e.x[id]-origin.x,dy=e.y[id]-origin.y,lx=h.x2-h.x,ly=h.y2-h.y;
    expect(Math.hypot(dx,dy)).toBeGreaterThan(1);expect(Math.abs(dx*ly-dy*lx)/Math.hypot(lx,ly)).toBeLessThan(.001);expect(dx*lx+dy*ly).toBeGreaterThan(0);
    f.until(()=>h.phase==='cancelled');f.step();expect(e.state[id]).toBe(3);expect(s.metrics.hurtCount).toBe(0);
   }else{
    s.player.y+=200;f.until(()=>h.phase==='active');expect([h.x,h.y]).toEqual([target.x,target.y]);expect(s.metrics.hurtCount).toBe(0);
    if(kind==='s2:parceler')expect(projectContent(s).parcels).toEqual([expect.objectContaining({slot:h.owner,owner:id,ownerGeneration:e.generation[id],generation:e.generation[h.owner!],phase:'active'})]);
    h.damage=9999;s.stats.maxHp=s.player.hp=100;s.player.shield=10;s.player.shieldTime=10;s.player.x=h.x;s.player.y=h.y;s.player.invincible=0;f.step();
    expect(s.player.hp).toBe(80);expect(s.player.shield).toBe(0);expect(s.player.invincible).toBe(.7);expect(s.metrics.hurtCount).toBe(1);
    for(let n=0;n<10;n++)f.step();expect(s.metrics.hurtCount).toBe(1);
   }
   expect(projectContent(s).enemies.kind[id]).toBe(kind);expect(s.discoveries).toContainEqual(expect.objectContaining({category:'enemy',id:kind}));s.dispose();
  }
 });

 it('keeps a 75/25 mixed ordinary budget, respects first weeks and isolates each first lesson from surviving mechanisms',()=>{
  for(let week=1;week<=8;week++){
   const old=content.waves.normalIds.filter(id=>!id.startsWith('s2:')).reduce((n,id)=>n+normalWeight(id,week),0),fresh=Object.keys(FIRST_THREAT_WEEKS).reduce((n,id)=>n+normalWeight(id,week),0);
   expect(old).toBeCloseTo(75);expect(fresh).toBeCloseTo(25);
   for(const [id,from] of Object.entries(FIRST_THREAT_WEEKS))if(week<from)expect(normalWeight(id,week)).toBe(0);
  }
  for(const [lesson,week] of Object.entries(FIRST_THREAT_WEEKS)){
   const {s}=fixture(week);s.ordinarySpawnsAllowed=true;
   const survivor=s.spawnEnemy('review',3400,3104);s.spawnEnemy(lesson==='s2:parceler'?'s2:bike':'s2:parceler',3400,3300);const cancelled=s.addHazard('circle',3400,3104,0,0,65,1,.3,20,undefined,{owner:survivor,ownerGeneration:s.enemies.generation[survivor],cancelOnDeath:true})!;
   const before=s.metrics.normalSpawned;let total=0,fresh=0;
   for(let tick=0;tick<2400;tick++){
    s.semesterTime=(week-1)*40+tick/60;s.director.update(1/60);
    for(const id of [...s.enemies.active]){
     if(s.enemies.rank[id]!==0)continue;const kind=content.enemies[s.enemies.kind[id]].id;total++;fresh+=Number(kind.startsWith('s2:'));
     if(tick<720)expect(kind===lesson||(LESSON_MELEE as readonly string[]).includes(kind)).toBe(true);
     s.releaseEnemy(id);
    }
   }
   expect(cancelled.phase).toBe('cancelled');expect(s.kills).toBe(0);expect(s.metrics.generatedXp).toBe(0);expect(s.metrics.normalSpawned-before).toBe(Math.floor(pressureAt(week).rate*40+1e-9));expect(total).toBe(s.metrics.normalSpawned-before);expect(fresh/total).toBeGreaterThan(.18);expect(fresh/total).toBeLessThan(.32);s.dispose();
  }
  const {s}=fixture();s.ordinarySpawnsAllowed=true;s.semesterTime=13;
  for(let n=0;n<pressureAt(1).normalCap;n++)s.spawnEnemy(n%4?'homework':'s2:bike',3400,3104);
  const before=s.metrics.normalSpawned;for(let n=0;n<600;n++)s.director.update(1/60);expect(s.metrics.normalSpawned).toBe(before);
  for(const id of [...s.enemies.active])s.releaseEnemy(id);s.director.update(1/60);expect(s.metrics.normalSpawned-before).toBeLessThanOrEqual(1);s.dispose();
 });

 it('spawns the 7000HP dispatcher once at week six second twenty, staggers its lines and clears it before assessment',()=>{
  const f=fixture(6),{s,services}=f,e=s.enemies;s.ordinarySpawnsAllowed=true;s.semesterTime=5*40+19.99;s.director.update(0);
  expect(e.active.some(id=>e.rank[id]===2)).toBe(false);s.semesterTime=220;s.director.update(0);
  const boss=e.active.find(id=>content.enemies[e.kind[id]].id==='s2:dispatcher')!;expect(e.hp[boss]).toBe(7000);expect(e.maxHp[boss]).toBe(7000);e.cooldown[boss]=0;e.speed[boss]=0;
  s.semesterTime=232;for(let n=0;n<3;n++)s.director.update(0);expect(e.active.filter(id=>e.rank[id]===2)).toEqual([boss]);expect(e.active.filter(id=>e.rank[id]===1)).toHaveLength(1);expect(eliteSeconds(6)).toEqual([12]);
  // Remove the unrelated melee elite so only the dispatcher owns these casts.
  for(const id of [...e.active])if(id!==boss)s.releaseEnemy(id);
  const starts:S2Hazard[]=[],seen=new Set<number>();
  for(let n=0;n<600&&starts.length<2;n++){
   f.step();for(const h of s.hazards)if(h.owner!==undefined&&e.owner[h.owner]===boss&&!seen.has(h.id)){seen.add(h.id);starts.push(h);expect(h.warningTotal).toBeGreaterThanOrEqual(1.2);expect(h.tier).toBe('elite');}
   expect(s.hazards.filter(h=>h.phase==='active')).toHaveLength(starts.some(h=>h.phase==='active')?1:0);
  }
  expect(starts).toHaveLength(2);expect(starts[1].startedTick-starts[0].startedTick).toBeGreaterThanOrEqual(1.2*60*2+42);expect(starts[0].phase).toBe('cancelled');
  const prepare={stage:'prepare' as const,assessment:{index:0,week:8,final:false},clock:{tick:19200,combatSeconds:320,teachingSeconds:320,assessmentSeconds:0,week:8,completedWeeks:8}},boundary={...services,damageAfterInheritance:(n:number)=>n,experienceAfterInheritance:(n:number)=>n};
  s.assessment(prepare,boundary);s.assessment(prepare,boundary);expect(e.active).toEqual([]);expect(s.hazards).toEqual([]);expect(s.danger.pending).toEqual([]);expect(s.progress.miniBosses).toBe(1);expect(s.metrics.generatedXp).toBe(60);expect(s.drops.active.filter(id=>s.drops.data[id].kind==='chest')).toHaveLength(1);
  s.assessment({...prepare,stage:'start'},boundary);expect(s.bossActive).toBe(true);const active=[...e.active];s.ordinarySpawnsAllowed=true;s.director.update(40);expect(e.active).toEqual(active);expect(e.active.some(id=>e.rank[id]===2)).toBe(false);expect(starts.every(h=>h.phase==='cancelled')).toBe(true);s.dispose();
 });

 it('cancels owner generations, makes both kinds of attachments rewardless and rejects duplicate or stale deaths',()=>{
  for(const kind of [...Object.keys(FIRST_THREAT_WEEKS),'s2:dispatcher']){
   const f=fixture(6),{s}=f,e=s.enemies;
   if(kind==='s2:reservation')for(let n=0;n<2;n++)s.addHazard('circle',s.player.x+700,s.player.y+n*180,0,0,45,2,.5,0);
   const id=f.spawn(kind),generation=e.generation[id],xp=e.xp[id];f.until(()=>hazards(s).some(h=>h.owner!==undefined));const handles=hazards(s).filter(h=>h.owner!==undefined);
   if(kind==='s2:reservation')expect(handles[0].phase).toBe('queued');
   if(kind==='s2:bike'){f.until(()=>handles[0].phase==='active');expect(handles[0].phase).toBe('active');}
   if(kind==='s2:parceler'||kind==='s2:dispatcher'){
    const child=e.active.find(child=>e.owner[child]===id)!;expect(e.ownerGeneration[child]).toBe(generation);s.stats.crit=1;s.momentum.criticals=2;const before={energy:s.ultimate.energy,combo:s.momentum.combo,hp:e.hp[id]};
    s.frozenTarget(child);expect(s.progress.frozen).toBe(0);s.hitEnemy(child,1e8,'knife',s.player.x,s.player.y,0,true,true);s.resolveDeaths();s.resolveDeaths();expect(s.momentum.criticals).toBe(2);expect(s.metrics.criticalChains).toBe(0);expect(s.kills).toBe(0);expect(s.progress.normalKills+s.progress.miniBosses).toBe(0);expect(s.metrics.generatedXp).toBe(0);expect(s.drops.active).toEqual([]);expect({energy:s.ultimate.energy,combo:s.momentum.combo,hp:e.hp[id]}).toEqual(before);expect(handles.every(h=>h.phase==='cancelled')).toBe(true);
    e.cooldown[id]=0;f.until(()=>hazards(s).some(h=>h.owner!==undefined));handles.push(...hazards(s).filter(h=>h.owner!==undefined));
   }
   kill(s,id);expect(s.metrics.generatedXp).toBe(xp);expect(s.kills).toBe(1);expect(s.progress.normalKills+s.progress.miniBosses).toBe(1);expect(e.active).toEqual([]);expect(handles.every(h=>h.phase==='cancelled')).toBe(true);
   const once={xp:s.metrics.generatedXp,kills:s.kills,energy:s.ultimate.energy,chests:s.metrics.chests};s.resolveDeaths();expect({xp:s.metrics.generatedXp,kills:s.kills,energy:s.ultimate.energy,chests:s.metrics.chests}).toEqual(once);
   const replacement=f.spawn(kind);expect(replacement).toBe(id);expect(e.generation[id]).toBeGreaterThan(generation);f.until(()=>hazards(s).some(h=>h.owner!==undefined));const next=hazards(s).find(h=>h.owner!==undefined)!;s.danger.cancelOwner(id,generation);expect(next.phase).not.toBe('cancelled');kill(s,id);expect(s.kills).toBe(2);expect(s.metrics.generatedXp).toBe(xp*2);s.dispose();
  }
  const f=fixture(),{s}=f,old=f.spawn('s2:bike');s.hitEnemy(old,1e8,'knife',3104,3104,0,false,false);s.releaseEnemy(old);const reused=f.spawn('s2:bike');expect(reused).toBe(old);s.resolveDeaths();expect(s.kills).toBe(0);expect(s.metrics.generatedXp).toBe(0);kill(s,reused);expect(s.kills).toBe(1);expect(s.metrics.generatedXp).toBe(content.enemyById['s2:bike'].xp);s.dispose();
 });
});
