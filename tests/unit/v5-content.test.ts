import {describe,it,expect} from 'vitest';
import {CHARACTERS,ENEMIES,PASSIVES,RARITY_MULTIPLIERS,WEAPONS} from '../../src/data/catalog';
import {FUSIONS} from '../../src/data/fusions';
import {PICKUPS} from '../../src/data/pickups';
import {ULTIMATES} from '../../src/data/ultimates';
import {RELICS} from '../../src/data/relics';
import {NORMAL_IDS,SPAWN_RATES,WAVE_WEIGHTS,WEEK_GROUP} from '../../src/data/waves';
import {weaponParams as originalParams} from '../../src/weapons/params';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {randomStreams} from '../../src/core/run';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import type {RuntimeServices,RuntimeStep} from '../../src/semesters/runtime/contracts';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {createContentCatalog,LEGACY_CONTENT as content} from '../../src/semesters/s2/legacy/catalog';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {legacyContentRules,projectContent} from '../../src/semesters/s2/legacy/rules-adapter';
import {weaponParams} from '../../src/semesters/s2/legacy/params';
import {draftCards,statsFor} from '../../src/semesters/s2/legacy/rules';
import {fusionCandidates} from '../../src/semesters/s2/legacy/fusions';
import {TextureCatalog} from '../../src/semesters/s2/presentation/TextureCatalog';
import {Texture} from 'pixi.js';
import type {BaseWeaponId,Skill} from '../../src/types';

function opening(id:BaseWeaponId='knife',notes=false){const profile=freshProfile();profile.stats.wins=1;profile.unlocks.weapons=WEAPONS.map(w=>w.id);profile.unlocks.passives=PASSIVES.map(p=>p.id);return createS2PreviewSnapshot(profile,77,{choice:notes?{id:'notes'}:{id:'topic',weaponId:id}});}
function fixture(id:BaseWeaponId='knife'){
 const snapshot=opening(id),services:RuntimeServices={snapshot,streams:randomStreams(snapshot.seed)},state=new ContentState(content,services);state.enemies.clear();state.player.invincible=1000;state.rebuildGrid();
 return{state,services};
}
function step(s:ContentState,services:RuntimeServices,tick:number,extra:Partial<RuntimeStep>={}){return s.tick({...services,dt:1/60,clock:{tick,combatSeconds:tick/60,teachingSeconds:tick/60,assessmentSeconds:tick/60,week:s.week,completedWeeks:s.week-1},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n,...extra});}
function targets(s:ContentState){for(const radius of [35,75,150,240])for(let n=0;n<12;n++){const a=n*Math.PI/6,id=s.spawnEnemy('homework',s.player.x+Math.cos(a)*radius,s.player.y+Math.sin(a)*radius);s.enemies.hp[id]=s.enemies.maxHp[id]=1e7;s.enemies.speed[id]=0;}s.rebuildGrid();}
function finishReward(s:ContentState){const token=s.rewards.token;expect(s.command({type:'chestDone',token}).accepted).toBe(true);if(s.phase==='evolution')expect(s.command({type:'evolutionDone',token}).accepted).toBe(true);}

describe('v5 bounded legacy content port',()=>{
 it('manual/reward pauses clear movement and velocity immediately and never resume from a neutral move',()=>{
  let state!:ContentState;const rules=legacyContentRules(content),g=new SemesterEngine({snapshot:opening(),config:S2_RUNTIME_CONFIG,rules:{...rules,create:s=>state=rules.create(s)},view:{publish(){}}});
  g.dispatch({type:'move',x:1,y:0});g.advance(1/60);const token=g.pause('manual')!,before=g.read();
  expect([state.inputX,state.inputY,state.player.vx,state.player.vy]).toEqual([0,0,0,0]);expect(g.dispatch({type:'move',x:0,y:0})).toBe(true);expect(g.dispatch({type:'move',x:1,y:0})).toBe(false);expect(g.read().pause?.token).toBe(token);
  g.advance(100);expect(g.read().clock).toEqual(before.clock);g.resume(token);const x=state.player.x;g.advance(1/120);expect(state.player.x).toBe(x);g.advance(1/120);expect(state.player.x).toBe(x);
  state.openChest();const reward=g.pause('reward')!;expect(g.dispatch({type:'move',x:0,y:0})).toBe(true);expect(g.read().pause?.token).toBe(reward);g.dispose();
 });
 it('retains complete ordered definitions and every level/rarity/evolution parameter; lookups honor an injected directory',()=>{
  expect([content.weapons.length,content.weapons.filter(w=>w.evolution).length,content.fusions.length,content.enemies.length,content.passives.length]).toEqual([22,22,6,25,16]);
  for(const [actual,original] of [[content.weapons,WEAPONS],[content.passives,PASSIVES],[content.fusions,FUSIONS],[content.enemies,ENEMIES],[content.characters,CHARACTERS],[content.pickups,PICKUPS],[content.ultimates,ULTIMATES],[content.relics,RELICS],[content.rarityMultipliers,RARITY_MULTIPLIERS]] as const){expect(actual).toEqual(original);expect(actual).not.toBe(original);}
  expect(content.waves).toEqual({normalIds:NORMAL_IDS,rates:SPAWN_RATES,weights:WAVE_WEIGHTS,groups:WEEK_GROUP});
  const stats=statsFor(content,opening(),PASSIVES.map(p=>({id:p.id,level:5,rarity:3,evolved:false})));
  for(const def of [...WEAPONS,...FUSIONS])for(const level of [1,2,3,4,5])for(const rarity of [0,1,2,3] as const)for(const evolved of [false,true]){
   const skill:Skill={id:def.id,level,rarity,evolved};expect(weaponParams(content,skill,stats,1.2)).toEqual(originalParams(skill,stats,1.2));
  }
  const modified={...structuredClone(content),enemies:[...structuredClone(content.enemies)].reverse()};modified.weapons[0].damage[0]=123;modified.enemies.find(e=>e.id==='homework')!.hp=77;
  const injected=createContentCatalog(modified),snapshot=opening(),s=new ContentState(injected,{snapshot,streams:randomStreams(snapshot.seed)});
  expect(weaponParams(injected,s.weapons[0]).damage).toBe(123);const id=s.spawnEnemy('homework',3200,3072);
  // P06 applies S2 week-one HP to the injected base, exactly once.
  expect(s.enemies.hp[id]).toBe(97);expect(s.enemies.kind[id]).toBe(injected.enemyIndex.homework);expect(projectContent(s).enemies.kind[id]).toBe('homework');
  const textures=new TextureCatalog({get:()=>Texture.EMPTY},new Map([['homework',Texture.WHITE]]),'balanced',injected);expect(textures.get('enemy-homework')).toBe(Texture.WHITE);expect(textures.get('enemy-unknown')).toBe(Texture.EMPTY);textures.destroy();expect(Texture.WHITE.destroyed).toBe(false);
  expect(content.weaponById.knife.damage[0]).toBe(14);expect(Object.isFrozen(content.weaponById.knife.damage)).toBe(true);s.dispose();
 });

 it('runs all 22 weapons, their actual chest evolutions and six fusion attacks through the production rules',()=>{
  for(const def of [...content.weapons,...content.fusions])for(const evolved of def.fusion?[false]:[false,true]){
   const h=fixture(def.fusion?'knife':def.id as BaseWeaponId),s=h.state;
   if(def.fusion)s.weapons.splice(0,1,{id:def.id,level:5,rarity:0,evolved:false,kind:'fusion',instanceId:s.nextInstance(),components:[...def.components!]});
   if(evolved){s.weapons[0].level=5;s.passives.push({id:def.evolution.passive,level:1,rarity:0,evolved:false});s.recalculateStats();s.openChest(false,def.id);const token=s.rewards.token,index=s.rewards.options.findIndex(o=>o.kind==='evolution'&&o.id===def.id);expect(index).toBeGreaterThanOrEqual(0);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(true);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(false);finishReward(s);expect(s.progress.evolutions).toBe(1);}
   targets(s);for(let tick=1;tick<=60;tick++)step(s,h.services,tick);
   expect(s.damage[def.id],`${def.id} evolved=${evolved}`).toBeGreaterThan(0);expect(s.weapons).toHaveLength(1);expect(s.weapons[0].evolved).toBe(evolved);s.dispose();expect(s.shots.active.length+s.areas.active.length+s.weaponSystem.summons.turrets.length).toBe(0);
  }
 });

 it('commits each fusion once and stops material projectiles, summons and DOT while retaining passives, rarity and unrelated emitters',()=>{
  for(const recipe of FUSIONS){
   const h=fixture(recipe.components[0]),s=h.state;s.week=9;s.weapons[0].level=5;s.weapons[0].rarity=1;s.weapons[0].evolved=true;s.weapons.push({id:recipe.components[1],level:5,rarity:3,evolved:true,instanceId:s.nextInstance(),kind:'base'});s.passives.push({id:'duration',level:2,rarity:2,evolved:false});s.recalculateStats();targets(s);for(let tick=1;tick<=18;tick++)step(s,h.services,tick);
   for(const source of [...recipe.components,'mentor'] as const){const shot=s.shots.acquire();s.shots.data[shot].source=source;const area=s.areas.acquire();s.areas.data[area].source=source;}
   const burned=s.enemies.active[0];s.enemies.burn[burned]=2;s.enemies.burnDamage[burned]=6;s.enemies.burnSource[burned]=recipe.components[0];const passive=structuredClone(s.passives),oldInstances=s.weapons.map(w=>w.instanceId!);
   s.openChest();const token=s.rewards.token,index=s.rewards.options.findIndex(o=>o.kind==='fusion'&&o.id===recipe.id);expect(index).toBeGreaterThanOrEqual(0);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(true);
   expect(s.command({type:'chooseReward',token,index}).accepted).toBe(false);expect(s.weapons).toHaveLength(1);expect(s.weapons[0]).toMatchObject({id:recipe.id,rarity:3,level:5,kind:'fusion',evolved:false});expect(oldInstances).not.toContain(s.weapons[0].instanceId);expect(s.consumed).toEqual(recipe.components);expect(s.passives).toEqual(passive);expect(s.progress.fusions).toEqual([recipe.id]);
   expect(s.shots.active.some(id=>recipe.components.includes(s.shots.data[id].source as BaseWeaponId))).toBe(false);expect(s.areas.active.some(id=>recipe.components.includes(s.areas.data[id].source as BaseWeaponId))).toBe(false);expect(s.shots.active.some(id=>s.shots.data[id].source==='mentor')).toBe(true);expect(s.enemies.burn[burned]).toBe(0);expect(s.enemies.burnDamage[burned]).toBe(0);expect(s.weaponSystem.summons.turrets).toHaveLength(0);
   const offers=draftCards(content,s.weapons,s.passives,0,h.services.streams.draft,false,{weapons:content.weapons.map(w=>w.id),passives:[],consumed:s.consumed});expect(offers.some(c=>s.consumed.includes(c.id))).toBe(false);expect(fusionCandidates(content,s.weapons,9,2,s.consumed)).toEqual([]);expect(fusionCandidates(content,s.weapons,8,0,s.consumed)).toEqual([]);
   finishReward(s);expect(s.command({type:'evolutionDone',token}).accepted).toBe(false);s.dispose();
  }
 });

 it('executes all 25 enemy definitions and preserves split, owner, elite, mini-boss and boss reward boundaries',()=>{
  for(const def of content.enemies){
   const h=fixture(),s=h.state;s.weapons.length=0;s.week=def.from;const id=s.spawnEnemy(def.id,s.player.x+320,s.player.y);if(def.rank==='boss'){s.bossEnemy=id;s.bossActive=true;}
   let warned=false;for(let tick=1;tick<=490;tick++){if(def.rank==='boss'&&tick===181)s.enemies.hp[id]=s.enemies.maxHp[id]*.45;if(def.rank==='boss'&&tick===361)s.enemies.hp[id]=s.enemies.maxHp[id]*.2;step(s,h.services,tick);warned||=s.hazards.some(h=>h.kind==='circle'&&h.owner===id);}
   if(def.behavior==='bomber'){expect(warned).toBe(true);expect(s.enemies.alive[id]).toBe(0);expect(s.metrics.generatedXp).toBe(0);expect(s.progress.normalKills).toBe(0);s.dispose();continue;}
   expect(Number.isFinite(s.player.hp)&&Number.isFinite(s.enemies.x[id]),def.id).toBe(true);
   if(def.behavior==='summon'||def.id==='teamlead')expect(s.enemies.active.some(n=>s.enemies.owner[n]===id)).toBe(true);
   if(def.id==='inspector')expect(s.enemies.active.some(n=>content.enemies[s.enemies.kind[n]].id==='node'&&s.enemies.owner[n]===id)).toBe(true);
   if(def.rank==='boss'){expect(s.bossStage).toBe(def.id==='proposal'?2:3);expect(s.enemyShots.active.length+s.hazards.length).toBeGreaterThan(0);}
   const expected=s.enemies.xp[id]+s.enemies.chainXp[id],before=s.metrics.generatedXp,weight=s.enemies.rewardWeight[id]+s.enemies.chainWeight[id];
   const kill=(target:number)=>{s.hitEnemy(target,(s.enemies.hp[target]+s.enemies.shield[target])*10,{kind:'environment',id:'core-check'},s.player.x,s.player.y,0,false,false);s.resolveDeaths();};
   kill(id);if(def.id==='splitter')for(const child of [...s.enemies.active])if(s.enemies.splitGeneration[child]===1)kill(child);
   expect(s.metrics.generatedXp-before,def.id).toBeCloseTo(expected);const once=s.metrics.generatedXp;s.resolveDeaths();expect(s.metrics.generatedXp).toBe(once);
   if(def.rank==='normal')expect(s.progress.normalKills).toBeCloseTo(weight);
   if(def.rank==='elite'||def.rank==='miniBoss'){expect(s.drops.active.some(n=>s.drops.data[n].kind==='chest'&&s.drops.data[n].value===(def.rank==='miniBoss'?2:1))).toBe(true);if(def.rank==='miniBoss')expect(s.enemies.active.some(n=>content.enemies[s.enemies.kind[n]].id==='node')).toBe(false);}
   if(def.rank==='boss')expect(s.progress.bossIds).toEqual([def.id]);
   s.dispose();
  }
  const h=fixture(),s=h.state,owner=s.spawnEnemy('summoner',3300,3072),child=s.spawnSummon('homework',owner,3300,3100);const before=s.ultimate.energy;s.hitEnemy(child,1e5,'knife',3072,3072,0,false,false);s.resolveDeaths();expect(s.metrics.generatedXp).toBe(0);expect(s.ultimate.energy).toBe(before);s.dispose();
 });

 it('uses real inheritance grants, plain immutable DTOs and assessment cleanup/reward gates without S1 settlement',()=>{
  const snapshot=opening('knife',true),services={snapshot,streams:randomStreams(snapshot.seed)},s=new ContentState(content,services);s.enemies.clear();s.player.invincible=0;s.addHazard('circle',s.player.x,s.player.y,0,0,100,0,1,6);
  // P06 requires a full warning; retain the same grant/DTO boundary assertions.
  for(let tick=1;tick<=60;tick++)step(s,services,tick);s.spawnDrop('xp',s.player.x,s.player.y,2);
  let damageCalls=0,xpCalls=0;step(s,services,61,{damageAfterInheritance:n=>{damageCalls++;return n-2;},experienceAfterInheritance:n=>{xpCalls++;return n*1.08;}});expect(damageCalls).toBe(1);expect(xpCalls).toBe(1);expect(s.player.hp).toBe(s.stats.maxHp-4);expect(s.metrics.creditedXp).toBeCloseTo(2.16);s.dispose();
  const choiceRules=legacyContentRules(content),choiceEngine=new SemesterEngine({snapshot:opening(),config:S2_RUNTIME_CONFIG,rules:{...choiceRules,create(services){const s=choiceRules.create(services);s.spawnDrop('xp',s.player.x,s.player.y,6);return s;}},view:{publish(){}}});
  choiceEngine.advance(1/60);const choice=choiceEngine.read();expect(choice.content.phase).toBe('draft');expect(choiceEngine.resume(choice.pause!.token)).toBe(false);expect(choiceEngine.dispatch({type:'choose',token:choice.content.draftToken+1,index:0})).toBe(false);expect(choiceEngine.dispatch({type:'choose',token:choice.content.draftToken,index:0})).toBe(true);expect(choiceEngine.read().pause).toBeNull();expect(choiceEngine.read().clock).toEqual(choice.clock);choiceEngine.dispose();
  // A full drop pool can collect raw XP while preparing a mini-boss handoff.
  // This synchronous grant uses the same combat-clock inheritance boundary.
  const full=fixture(),f=full.state;for(let n=0;n<f.drops.capacity;n++){const id=f.drops.acquire();Object.assign(f.drops.data[id],{kind:n===0?'xp':'chest',value:1,x:1000,y:1000});}f.spawnEnemy('inspector',3300,3072);
  const prepare={stage:'prepare' as const,assessment:{index:0,week:8,final:false},clock:{tick:19200,combatSeconds:320,teachingSeconds:320,assessmentSeconds:0,week:8,completedWeeks:8}};let grants=0;const boundary={...full.services,damageAfterInheritance:(n:number)=>n,experienceAfterInheritance:(n:number)=>{grants++;return n;}};
  f.assessment(prepare,boundary);f.assessment(prepare,boundary);expect(grants).toBe(1);expect(f.metrics.creditedXp).toBe(61);expect(f.progress.miniBosses).toBe(1);expect(f.enemies.active).toEqual([]);f.dispose();
  const base=legacyContentRules(content);let state!:ContentState,disposed=0;
  const engine=new SemesterEngine({snapshot:opening(),config:{...S2_RUNTIME_CONFIG,calendar:{...S2_RUNTIME_CONFIG.calendar,weeks:1,bossWeeks:[1]}},rules:{...base,create(services){state=base.create(services);state.enemies.clear();state.player.invincible=1000;return state;},step(s,context){if(context.clock.tick===2400){const mini=s.spawnEnemy('inspector',s.player.x+200,s.player.y),node=s.spawnSummon('node',mini,s.player.x+250,s.player.y);expect(node).toBeGreaterThanOrEqual(0);s.spawnEnemy('homework',s.player.x+300,s.player.y);s.enemyBullet(s.player.x,s.player.y,0,100,10);s.addHazard('circle',s.player.x,s.player.y,0,0,50,1,1,10);}return base.step(s,{...context,ordinarySpawnsAllowed:false});}},view:{publish(){},dispose(){disposed++;}}});
  engine.dispatch({type:'move',x:.5,y:0});for(let n=0;n<600;n++)engine.advance(1/15);
  const intro=engine.read();expect(intro.phase).toBe('assessmentIntro');expect(intro.content.progress.miniBosses).toBe(1);expect(intro.content.progress.normalKills).toBe(0);expect(intro.content.enemies.active.length+intro.content.enemyShots.active.length+intro.content.hazards.length).toBe(0);expect(intro.content.drops.active.some(id=>intro.content.drops.data[id].kind==='chest')).toBe(true);expect(engine.dispatch({type:'move',x:1,y:0})).toBe(false);expect(engine.acknowledge(intro.gate!.token)).toBe(true);expect(engine.acknowledge(intro.gate!.token)).toBe(false);
  state.hitEnemy(state.bossEnemy,1e6,'knife',state.player.x,state.player.y,0,false,false);engine.advance(1/60);
  const reward=engine.read();expect(reward.phase).toBe('assessmentReward');expect(reward.result).toBeNull();expect(engine.acknowledge(reward.gate!.token)).toBe(false);expect(engine.dispatch({type:'chestDone',token:reward.content.rewardToken+1})).toBe(false);
  expect(engine.dispatch({type:'chestDone',token:reward.content.rewardToken})).toBe(true);
  // Boss XP remains a drop; any pending ordinary drafts/chests are also gated.
  while(engine.read().content.phase!=='playing'){const v=engine.read().content;expect(engine.dispatch(v.phase==='draft'?{type:'choose',token:v.draftToken,index:0}:{type:'chestDone',token:v.rewardToken})).toBe(true);}
  const streams=Object.fromEntries(Object.entries(state.streams).map(([k,v])=>[k,v.state])),view=engine.read();engine.read();expect(Object.fromEntries(Object.entries(state.streams).map(([k,v])=>[k,v.state]))).toEqual(streams);
  const plain=(value:unknown):boolean=>!value||typeof value!=='object'?typeof value!=='function':(Array.isArray(value)||Object.getPrototypeOf(value)===Object.prototype)&&Object.values(value).every(plain);expect(plain(view)).toBe(true);expect(Object.isFrozen(view.content.player)).toBe(true);expect(()=>{(view.content.weapons as Skill[]).push({id:'coffee',level:1,rarity:0,evolved:false});}).toThrow();
  expect(engine.acknowledge(view.gate!.token)).toBe(true);expect(engine.read().result).toMatchObject({semesterId:'s2',victory:true,reason:'completed',assessmentsPassed:1});expect(engine.dispatch({type:'chestDone',token:reward.content.rewardToken})).toBe(false);engine.dispose();engine.dispose();expect(disposed).toBe(1);expect(state.enemies.active.length+state.shots.active.length+state.areas.active.length+state.drops.active.length).toBe(0);expect(ENEMIES).toEqual(content.enemies);
 });
});
