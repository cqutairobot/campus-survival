import {describe,it,expect,vi} from 'vitest';
import {randomStreams} from '../../src/core/run';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import type {RuntimeServices} from '../../src/semesters/runtime/contracts';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {S2_CONTENT as content} from '../../src/semesters/s2/content';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {createContentCatalog,LEGACY_CONTENT} from '../../src/semesters/s2/legacy/catalog';
import {legacyContentRules,projectContent} from '../../src/semesters/s2/legacy/rules-adapter';
import {draftCards,evolutionReady,protocolBonus} from '../../src/semesters/s2/legacy/rules';
import {weaponParams} from '../../src/semesters/s2/legacy/params';
import {weaponCard,weaponCodex} from '../../src/semesters/s2/presentation/build-details';
import type {ContentSkill,ContentWeaponId} from '../../src/semesters/s2/types';
import {worldBlocked} from '../../src/semesters/s2/world';

const ids=['s2:drone','s2:whiteboard'] as const;
function fixture(id:ContentWeaponId='s2:drone',catalog=content){
 const profile=freshProfile();profile.stats.wins=1;profile.selected='coder';profile.unlocks.weapons=LEGACY_CONTENT.weapons.map(w=>w.id);profile.unlocks.passives=LEGACY_CONTENT.passives.map(p=>p.id);
 const snapshot=createS2PreviewSnapshot(profile,77,{choice:{id:'topic',weaponId:id}}),services:RuntimeServices={snapshot,streams:randomStreams(snapshot.seed)},s=new ContentState(catalog,services);
 s.enemies.clear();s.player.invincible=1000;s.player.facing=0;s.stats.crit=0;s.rebuildGrid();let tick=0;
 const step=()=>s.tick({...services,dt:1/60,clock:{tick:++tick,combatSeconds:tick/60,teachingSeconds:tick/60,assessmentSeconds:0,week:s.week,completedWeeks:s.week-1},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n});
 return{s,services,snapshot,profile,step};
}
function skill(s:ContentState,id:ContentSkill['id'],level=5,evolved=false):ContentSkill{return{id,level,rarity:0,evolved,kind:'base',instanceId:s.nextInstance()};}
function target(s:ContentState,x=130,y=0,kind='homework'){
 const id=s.spawnEnemy(kind,s.player.x+x,s.player.y+y);s.enemies.speed[id]=0;if(kind==='homework')s.enemies.hp[id]=s.enemies.maxHp[id]=1e7;s.rebuildGrid();return id;
}
const hit=(s:ContentState,id:number,source:ContentWeaponId='knife',damage=100,secondary=false)=>s.hitEnemy(id,damage,source,s.player.x,s.player.y,0,false,false,false,false,secondary);

describe('v5 drone and whiteboard builds',()=>{
 it('shares every level/quality and both evolved parameters with actual attacks, card rows and codex, including old passive/relic modifiers',()=>{
  expect(content.weapons.slice(0,22)).toEqual(LEGACY_CONTENT.weapons);expect(content.passives.slice(0,16)).toEqual(LEGACY_CONTENT.passives);expect(content.fusions).toEqual(LEGACY_CONTENT.fusions);
  for(const id of ids)for(const level of [1,2,3,4,5])for(const rarity of [0,1,2,3] as const)for(const evolved of level===5?[false,true]:[false]){
   const {s}=fixture(id);s.weapons[0]=skill(s,id,level,evolved);s.weapons[0].rarity=rarity;s.passives.push(...(['night','haste','area','multi'] as const).map(id=>skill(s,id,3)));s.relics.push('assistant');s.recalculateStats();s.stats.crit=0;s.damageMultiplier=1.1;
   for(const x of [65,75,90,120,130,150,180,195])target(s,x);
   const expected=weaponParams(content,s.weapons[0],s.combatStats,s.damageMultiplier),card=weaponCard(content,id,level,rarity,s.combatStats,s.damageMultiplier),book=weaponCodex(content,id,s.weapons[0],s.combatStats,s.damageMultiplier);
   expect(evolved?book.evolution:card.params).toEqual(expected);expect(book.levels[level-1]).toEqual(card);
   expect((evolved?book.rows:card.rows).join(' ')).toContain(`命中伤害 ${Math.round(expected.damage*100)/100}`);const baseCount=[1,1,2,2,3][level-1];expect(expected.count).toBe(id==='s2:drone'?baseCount+2:evolved?6:baseCount);
   const spy=vi.spyOn(s,'hitEnemy');for(let tick=1;tick<=80;tick++){s.combatTime=tick/60;s.weaponSystem.update(1/60);}
   const attacks=spy.mock.calls.filter(c=>c[2]===id);expect(attacks.length,`${id} Lv.${level} quality=${rarity} evolved=${evolved}`).toBeGreaterThan(0);expect(attacks.every(c=>c[1]===expected.damage)).toBe(true);expect(s.damage[id]).toBeGreaterThan(0);s.dispose();
  }
 });

 it('offers the new pool through the draft stream, preserves full discovery IDs, and commits both Lv.5 + Lv.1 evolution recipes once with cleanup',()=>{
  const f=fixture('knife'),s=f.s;s.spawnDrop('xp',s.player.x,s.player.y,6);f.step();expect(s.phase).toBe('draft');const index=s.cards.findIndex(c=>ids.includes(c.id as typeof ids[number]));expect(index).toBeGreaterThanOrEqual(0);const card=s.cards[index];s.command({type:'choose',token:s.draftToken,index});expect(s.weapons.some(w=>w.id===card.id)).toBe(true);expect(s.discoveries).toContainEqual({semesterId:'s2',category:'item',id:card.id,evidence:'run'});s.dispose();
  for(const id of ids){
   const {s,services,snapshot}=fixture(id),passive=content.weaponById[id].evolution.passive;s.weapons[0].level=4;s.passives.push(skill(s,passive,1));expect(evolutionReady(content,s.weapons,s.passives)).toEqual([]);s.weapons[0].level=5;s.passives[0].level=0;expect(evolutionReady(content,s.weapons,s.passives)).toEqual([]);s.passives[0].level=1;expect(evolutionReady(content,s.weapons,s.passives)).toEqual([s.weapons[0]]);
   s.recalculateStats();target(s,400);for(let n=0;n<5;n++)s.weaponSystem.update(1/60);
   expect(id==='s2:drone'?s.weaponSystem.summons.drones.length:s.weaponSystem.whiteboard.lines.length).toBeGreaterThan(0);
   s.openChest(false,id);const token=s.rewards.token,index=s.rewards.options.findIndex(o=>o.id===id&&o.kind==='evolution');expect(index).toBeGreaterThanOrEqual(0);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(true);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(false);expect(s.weapons[0].evolved).toBe(true);expect(s.weaponSystem.summons.droneBolts).toHaveLength(0);expect(s.weaponSystem.summons.drones).toHaveLength(0);expect(s.weaponSystem.whiteboard.lines).toHaveLength(0);expect(s.progress.evolutions).toBe(1);expect(s.discoveries).toContainEqual({semesterId:'s2',category:'evolution',id,evidence:'run'});
   expect(s.command({type:'chestDone',token}).accepted).toBe(true);expect(s.command({type:'evolutionDone',token}).accepted).toBe(true);expect(evolutionReady(content,s.weapons,s.passives)).toEqual([]);
   const offers=draftCards(content,[],[],0,services.streams.draft,true,{weapons:snapshot.weapons,passives:snapshot.passives},true);expect(offers.some(c=>ids.includes(c.id as typeof ids[number]))).toBe(true);expect(offers.some(c=>['s2:spool','s2:printer','s2:battery','s2:harness','s2:echoChip'].includes(c.id))).toBe(false);s.dispose();
  }
 });

 it('combines protocol with all old/new weapon sources, halves every Boss benefit, merges marks, caps quality and excludes secondary re-mark/overkill/recycled slots',()=>{
  for(const level of [1,2,3,4,5])for(const rarity of [0,1,2,3] as const){
   const {s}=fixture();s.weapons.length=0;s.passives.push({...skill(s,'s2:protocol',level),rarity},skill(s,'night',3),skill(s,'luck',3),skill(s,'thesis',3));s.recalculateStats();s.stats.crit=0;const bonus=[.02,.03,.04,.05,.06][level-1]*content.rarityMultipliers[rarity];expect(protocolBonus(content,s.passives)).toBeCloseTo(bonus);
   const normal=target(s),boss=target(s,260,0,'s2:proposalBoard');
   for(const id of [normal,boss]){
    expect(hit(s,id,'knife',100,true)).toBe(100);expect(s.protocol.snapshot().some(m=>m.id===id)).toBe(false);expect(hit(s,id)).toBe(100);
    for(const def of [...content.weapons,...content.fusions])expect(hit(s,id,def.id)).toBeCloseTo(100*(1+bonus*(id===boss?.5:1)));
    expect(s.protocol.snapshot().filter(m=>m.id===id)).toHaveLength(1);
   }
   const before=s.metrics.hits;hit(s,normal,'coffee');expect(s.metrics.hits-before).toBe(1);
   const expires=s.protocol.snapshot().find(m=>m.id===normal)!.expires;s.combatTime=1;hit(s,normal,'s2:drone',100,true);expect(s.protocol.snapshot().find(m=>m.id===normal)!.expires).toBe(expires);s.combatTime=3;expect(hit(s,normal)).toBe(100);
   s.releaseEnemy(normal);const reused=target(s);expect(reused).toBe(normal);expect(hit(s,reused)).toBe(100);s.enemies.hp[reused]=3;expect(hit(s,reused)).toBe(3);s.resolveDeaths();expect(s.protocol.snapshot().some(m=>m.id===reused)).toBe(false);s.dispose();
  }
  const inflated=createContentCatalog({...content,passives:content.passives.map(p=>p.id==='s2:protocol'?{...p,values:[100,100,100,100,100]}:p)}),{s}=fixture('s2:drone',inflated);s.passives.push({...skill(s,'s2:protocol'),rarity:3});expect(protocolBonus(inflated,s.passives)).toBe(.15);s.dispose();
  const chain=fixture().s,a=target(chain,80),b=target(chain,90),c=target(chain,100);chain.passives.push(skill(chain,'s2:protocol'));chain.stats.crit=1;chain.stats.critDamage=2;chain.momentum.criticals=2;chain.hitEnemy(a,100,'s2:whiteboard',chain.player.x,chain.player.y);expect(chain.metrics.criticalChains).toBe(1);expect(chain.metrics.hits).toBe(3);expect(chain.protocol.snapshot().map(m=>m.id)).toEqual([a]);expect(chain.enemies.hp[b]).toBeLessThan(1e7);expect(chain.enemies.hp[c]).toBeLessThan(1e7);chain.dispose();
 });

 it('allocates drone targets, validates target and weapon generations, cleans removal/replacement, and adds sync volleys without interrupting normal attacks',()=>{
  const {s}=fixture();s.weapons[0].level=5;for(const [x,y] of [[250,-100],[250,0],[250,100]])target(s,x,y);s.weaponSystem.update(1/60);const summons=s.weaponSystem.summons;
  expect(summons.drones).toHaveLength(3);expect(new Set(summons.drones.map(d=>d.target)).size).toBe(3);expect(summons.drones.every(d=>d.targetGeneration===s.enemies.generation[d.target]&&d.instanceId===s.weapons[0].instanceId)).toBe(true);
  const stale={...summons.droneBolts[0]},oldGeneration=stale.targetGeneration;s.releaseEnemy(stale.target);const reused=target(s,250,-100);expect(reused).toBe(stale.target);expect(s.enemies.generation[reused]).not.toBe(oldGeneration);s.weaponSystem.update(1/60);expect(summons.droneBolts.some(b=>b.target===reused&&b.targetGeneration===oldGeneration)).toBe(false);expect(s.enemies.hp[reused]).toBe(1e7);
  s.weaponSystem.remove('s2:drone');expect(summons.drones.length+summons.droneBolts.length).toBe(0);s.weapons[0]=skill(s,'s2:drone',5,true);summons.droneBolts.push(stale);const emit=vi.spyOn(s,'emit');
  for(let n=1;n<=310;n++){s.combatTime=n/60;s.weaponSystem.update(1/60);}
  const shots=emit.mock.calls.map(([e])=>e).filter(e=>e.type==='shot'&&e.weapon==='s2:drone');expect(shots.filter(e=>e.text==='同步集火')).toHaveLength(3);expect(shots.filter(e=>e.text==='常规攻击').length).toBeGreaterThanOrEqual(27);expect(summons.droneBolts.every(b=>b.instanceId===s.weapons[0].instanceId&&b.generation!==stale.generation)).toBe(true);s.dispose();expect(summons.drones.length+summons.droneBolts.length).toBe(0);
 });

 it('hits whiteboard lines in order once, leaves player movement/world navigation untouched, and removes every delayed line',()=>{
  for(const evolved of [false,true]){
   const f=fixture('s2:whiteboard'),plain=fixture('s2:whiteboard'),s=f.s;s.weapons[0].level=5;s.weapons[0].evolved=evolved;plain.s.weapons.length=0;const original=JSON.stringify(s.world);
   const t=[65,130,195].map(x=>target(s,x));for(const x of [65,130,195])target(plain.s,x);const hits:{id:number;time:number}[]=[];const actual=s.hitEnemy.bind(s);vi.spyOn(s,'hitEnemy').mockImplementation((...args)=>{if(args[2]==='s2:whiteboard')hits.push({id:args[0],time:s.combatTime});return actual(...args);});
   s.command({type:'move',x:1,y:0});plain.s.command({type:'move',x:1,y:0});let maximum=0;
   for(let n=0;n<64;n++){f.step();plain.step();maximum=Math.max(maximum,s.weaponSystem.whiteboard.lines.length);expect([s.player.x,s.player.y]).toEqual([plain.s.player.x,plain.s.player.y]);}
   expect(s.player.x).toBeGreaterThan(s.world.spawn.x+150);expect(maximum).toBe(evolved?6:3);expect(s.hazards).toEqual([]);expect(s.danger.pending).toEqual([]);expect(JSON.stringify(s.world)).toBe(original);expect(worldBlocked(s.world,s.world.spawn.x+65,s.world.spawn.y,12)).toBe(false);expect(hits.length).toBeGreaterThan(0);
   if(!evolved){expect(hits.map(h=>h.id)).toEqual(t);expect(hits[1].time-hits[0].time).toBeCloseTo(.14,1);expect(hits[2].time-hits[1].time).toBeCloseTo(.14,1);}
   s.weaponSystem.reset('s2:whiteboard');for(let n=0;n<20;n++)f.step();s.weapons.length=0;s.weaponSystem.remove('s2:whiteboard');const count=hits.length;for(let n=0;n<60;n++)f.step();expect(hits).toHaveLength(count);expect(s.weaponSystem.whiteboard.lines).toHaveLength(0);s.dispose();plain.s.dispose();
  }
 });

 it('uses a moving mixed build against the fixed 16000 HP checkpoint, cancels its phase once, damages through recovery and completes only the assessmentReward gate',()=>{
  const f=fixture('s2:drone');f.s.dispose();const original=structuredClone(f.profile),base=legacyContentRules(content);let s!:ContentState,services!:RuntimeServices;
  const engine=new SemesterEngine({snapshot:f.snapshot,config:S2_RUNTIME_CONFIG,view:{publish(){}},rules:{...base,project:state=>({phase:state.phase,token:state.rewards.token}),create(value){services=value;s=base.create(value);s.enemies.clear();s.weapons.splice(0,s.weapons.length,skill(s,'s2:drone',5,true),skill(s,'s2:whiteboard',5,true),skill(s,'laser'));s.passives.push(skill(s,'multi',3),skill(s,'haste',3),skill(s,'area',3),skill(s,'night',3),skill(s,'s2:protocol'));s.recalculateStats();s.stats.crit=0;s.player.invincible=1000;return s;},step(state,step){return step.phase==='assessment'?base.step(state,step):{};}}});
  for(let n=0;n<4800;n++)engine.advance(1/15);const intro=engine.read();expect(intro.phase).toBe('assessmentIntro');expect(engine.acknowledge(intro.gate!.token)).toBe(true);const id=s.bossEnemy,e=s.enemies;expect(e.hp[id]).toBe(16000);expect(e.maxHp[id]).toBe(16000);
  s.player.x=e.x[id]-130;s.player.y=e.y[id];s.player.prevX=s.player.x;s.player.prevY=s.player.y;const start=s.player.x,heal=vi.spyOn(s,'heal');let previous=16000,transition=false,recovery=false,recoveryDamage=0;const allOld=new Set(s.hazards);const cancel=vi.spyOn(s.danger,'cancelOwner');
  for(let n=0;n<9000&&engine.read().phase==='assessment';n++){
   const board=s.bossSystem.proposalBoard.snapshot(),hp=e.hp[id];for(const h of s.hazards)if(!transition&&h.owner===id)allOld.add(h);
   engine.dispatch({type:'move',x:e.x[id]-s.player.x,y:e.y[id]-s.player.y});engine.advance(1/60);
   expect(e.maxHp[id]).toBe(16000);expect(e.hp[id]).toBeLessThanOrEqual(previous);previous=e.hp[id];
   if(!transition&&s.bossStage===2){transition=true;expect([...allOld].every(h=>h.phase==='cancelled')).toBe(true);expect(cancel).toHaveBeenCalledTimes(1);}
   if(board?.move==='recovery'){recovery=true;recoveryDamage+=hp-e.hp[id];}
  }
  expect(transition).toBe(true);expect(recovery).toBe(true);expect(recoveryDamage).toBeGreaterThan(0);expect(Math.abs(s.player.x-start)).toBeGreaterThan(20);for(const id of ['s2:drone','s2:whiteboard','laser'])expect(s.damage[id],id).toBeGreaterThan(0);
  const reward=engine.read();expect(reward.phase).toBe('assessmentReward');expect(reward.assessmentsPassed).toBe(1);expect(reward.result).toBeNull();expect(heal.mock.calls.filter(([,fixed])=>fixed)).toEqual([[s.stats.maxHp*.15,true]]);expect(engine.acknowledge(reward.gate!.token)).toBe(false);
  const option=s.rewards.options.findIndex(o=>o.id==='upgrade');if(option>=0)engine.dispatch({type:'chooseReward',token:s.rewards.token,index:option});const token=s.rewards.token;expect(engine.dispatch({type:'chestDone',token})).toBe(true);expect(engine.dispatch({type:'chestDone',token})).toBe(false);expect(engine.acknowledge(reward.gate!.token)).toBe(true);expect(engine.acknowledge(reward.gate!.token)).toBe(false);
  engine.advance(1/60);expect(engine.read().clock.week).toBe(9);expect(engine.read().result).toBeNull();engine.abandon();expect(engine.read().result).toMatchObject({victory:false,reason:'abandoned',assessmentsPassed:1});expect(f.profile).toEqual(original);expect(services.snapshot).toEqual(f.snapshot);expect(projectContent(s).progress.bossIds).toEqual(['s2:proposalBoard']);engine.dispose();
 });
});
