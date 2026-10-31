import {describe,it,expect,vi} from 'vitest';
import {randomStreams} from '../../src/core/run';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {S2_CONTENT as content} from '../../src/semesters/s2/content';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {weaponParams} from '../../src/semesters/s2/legacy/params';
import {weaponCard,weaponCodex} from '../../src/semesters/s2/presentation/build-details';
import {draftCards,s2PassiveValue} from '../../src/semesters/s2/legacy/rules';
import type {ContentSkill,ContentWeaponId} from '../../src/semesters/s2/types';
const skill=(s:ContentState,id:ContentSkill['id'],level=5,evolved=false):ContentSkill=>({id,level,evolved,rarity:0,instanceId:s.nextInstance()});
function fixture(id:ContentWeaponId='knife'){
 const p=freshProfile();p.stats.wins=1;const snapshot=createS2PreviewSnapshot(p,77,{choice:{id:'topic',weaponId:id}}),services={snapshot,streams:randomStreams(77)},s=new ContentState(content,services);s.enemies.clear();s.stats.crit=0;let tick=0;
 const step=()=>s.tick({...services,dt:1/60,clock:{tick:++tick,combatSeconds:tick/60,teachingSeconds:tick/60,assessmentSeconds:0,week:1,completedWeeks:0},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n});
 return{s,step};
}
function target(s:ContentState,x=80,kind='homework'){const id=s.spawnEnemy(kind,s.player.x+x,s.player.y);s.enemies.speed[id]=0;s.enemies.hp[id]=s.enemies.maxHp[id]=1e6;s.rebuildGrid();return id;}
const hit=(s:ContentState,id:number,attackId:string,damage=100)=>s.hitEnemy(id,damage,'knife',s.player.x,s.player.y,0,false,false,false,false,false,{attackId});
describe('v5 complete S2 equipment',()=>{
 it('makes four weapons/passives/evolutions attainable, with shared level/quality parameters and single reward commits',()=>{
  expect(content.weapons.filter(w=>w.id.startsWith('s2:'))).toHaveLength(4);expect(content.passives.filter(w=>w.id.startsWith('s2:'))).toHaveLength(4);expect(content.fusions.some(w=>w.id.startsWith('s2:'))).toBe(false);
  const {s}=fixture();for(const def of [...content.weapons,...content.passives].filter(d=>d.id.startsWith('s2:'))){const cards=draftCards(content,[],[],0,s.streams.draft,false,{weapons:[def.id],passives:[def.id]});expect(cards.some(c=>c.id===def.id)).toBe(true);}
  for(const id of ['s2:spool','s2:printer'] as const){for(const level of [1,2,3,4,5])for(const rarity of [0,1,2,3] as const){const w={...skill(s,id,level),rarity},p=weaponParams(content,w,s.stats);expect(weaponCard(content,id,level,rarity,s.stats).params).toEqual(p);expect(weaponCodex(content,id,w,s.stats).levels[level-1].params).toEqual(p);expect(p.damage).toBeGreaterThan(0);}
   s.weapons.splice(0,s.weapons.length,skill(s,id));s.passives.splice(0,s.passives.length,skill(s,content.weaponById[id].evolution.passive,1));s.setPhase('playing');s.openChest(false,id);const token=s.rewards.token,index=s.rewards.options.findIndex(o=>o.id===id);expect(index).toBeGreaterThanOrEqual(0);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(true);expect(s.command({type:'chooseReward',token,index}).accepted).toBe(false);expect(s.weapons[0].evolved).toBe(true);s.command({type:'chestDone',token});s.command({type:'evolutionDone',token});
  }s.dispose();
 });
 it('uses actual damage once for echo, excludes repeated volley hits, caps Boss benefit and avoids double crit/protocol/reduction/overkill',()=>{
  const {s}=fixture();s.passives.push(skill(s,'s2:echoChip'),skill(s,'s2:protocol'));const a=target(s),boss=target(s,180,'inspector');s.enemies.rank[boss]=3;const node=s.spawnSummon('node',boss,s.player.x+200,s.player.y,10,true);expect(node).toBeGreaterThanOrEqual(0);
  hit(s,a,'a');hit(s,a,'a');expect(s.additionalDamage.knife).toBeUndefined();hit(s,a,'b');expect(s.additionalDamage.knife.echo).toBeCloseTo(21.2);expect(s.damage.knife).toBeCloseTo(100+106+106+21.2);
  hit(s,a,'c');expect(s.additionalDamage.knife.echo).toBeCloseTo(21.2);s.combatTime=1;hit(s,a,'a');expect(s.additionalDamage.knife.echo).toBeCloseTo(21.2);hit(s,a,'d');expect(s.additionalDamage.knife.echo).toBeCloseTo(42.4);
  s.stats.crit=1;s.stats.critDamage=2;s.hitEnemy(boss,100,'laser',0,0,0,true,false,false,false,false,{attackId:'x'});const before=s.damage.laser;s.hitEnemy(boss,100,'laser',0,0,0,true,false,false,false,false,{attackId:'y'});expect(s.damage.laser-before).toBeCloseTo(123.6*1.1);expect(s.additionalDamage.laser.echo).toBeCloseTo(12.36);expect(s.metrics.criticalHits).toBe(2);
  s.combatTime=2;s.enemies.hp[a]=3;const prior=s.damage.knife;hit(s,a,'last');expect(s.damage.knife-prior).toBe(3);s.resolveDeaths();const reused=target(s);expect(reused).toBe(a);hit(s,reused,'new');expect(s.additionalDamage.knife.echo).toBeCloseTo(42.4);s.dispose();
 });
 it('triggers structures with old single/area weapons and new weapons, consumes arrays before dispatch, and isolates mark/echo/critical chains',()=>{
  for(const source of ['staple','brick','mine','s2:drone','s2:spool'] as const){const {s}=fixture('s2:printer');s.weapons[0].level=5;s.weapons[0].evolved=true;s.passives.push(skill(s,'s2:echoChip'));const a=target(s,70);s.weaponSystem.printer.update(s.weapons[0],weaponParams(content,s.weapons[0],s.stats),.16);expect(s.weaponSystem.printer.marks.length).toBeGreaterThan(0);const marks=s.weaponSystem.printer.marks.length;s.stats.crit=1;s.stats.critDamage=2;const prior=s.metrics.criticalHits;const spy=vi.spyOn(s,'hitEnemy');s.hitEnemy(a,10,source,0,0);expect(s.weaponSystem.printer.marks).toHaveLength(0);expect(s.additionalDamage['s2:printer'].mark).toBeGreaterThan(0);expect(s.metrics.criticalHits-prior).toBe(1);expect(spy.mock.calls.length).toBeLessThanOrEqual(marks+3);expect(s.metrics.criticalChains).toBe(0);s.dispose();}
 });
 it('conducts while moving or standing, bounds live segments, and clears trajectories, marks and in-flight beads on replacement/evolution/removal/exit',()=>{
  for(const evolved of [false,true]){const {s}=fixture('s2:spool');s.weapons[0].level=5;s.weapons[0].evolved=evolved;target(s,45);for(let n=0;n<150;n++){s.combatTime=n/60;s.weaponSystem.update(1/60);}expect(s.damage['s2:spool']).toBeGreaterThan(0);expect(s.weaponSystem.spool.segments.length).toBeLessThanOrEqual(evolved?10:7);if(evolved)expect(s.weaponSystem.spool.segments.some(s=>s.connector)).toBe(true);s.weapons[0]=skill(s,'s2:spool',5,!evolved);const old=s.weaponSystem.spool.segments[0];s.weaponSystem.update(1/60);expect(s.weaponSystem.spool.segments.some(s=>s.generation===old.generation)).toBe(false);s.weaponSystem.remove('s2:spool');expect(s.weaponSystem.spool.segments).toHaveLength(0);s.dispose();}
  const {s}=fixture('s2:printer');target(s,70);s.weaponSystem.update(.16);expect(s.weaponSystem.printer.beads.length+s.weaponSystem.printer.marks.length).toBeGreaterThan(0);s.weapons[0]=skill(s,'s2:printer');s.weaponSystem.update(.01);expect(s.weaponSystem.printer.marks).toHaveLength(0);s.weapons.length=0;s.weaponSystem.update(.01);expect(s.weaponSystem.printer.beads.length+s.weaponSystem.printer.marks.length).toBe(0);s.dispose();
 });
 it('stores only ready ultimate overflow and refunds it without shortening the original cooldown',()=>{
  const {s}=fixture();for(const level of [1,2,3,4,5]){s.passives.splice(0,s.passives.length,skill(s,'s2:battery',level));s.ultimate.energy=240;s.ultimate.cooldown=s.ultimate.remaining=0;s.ultimate.gain(1000,'fixture');expect(s.ultimate.overflow).toBe([20,30,40,50,60][level-1]);expect(s.ultimate.release()).toBe(true);expect(s.ultimate.energy).toBe([20,30,40,50,60][level-1]);expect(s.ultimate.cooldown).toBe(30);s.ultimate.energy=240;expect(s.ultimate.ready).toBe(false);s.ultimate.update(1);expect(s.ultimate.cooldown).toBe(29);}s.dispose();
 });
 it('arms harness after two continuous combat seconds, mitigates once and waits eight seconds independent of rendering',()=>{
  const {s,step}=fixture();s.weapons.length=0;s.passives.push(skill(s,'s2:harness'));s.command({type:'move',x:1,y:0});for(let n=0;n<122;n++)step();expect(s.harness.ready).toBe(true);expect(s.harness.reduce(100)).toBe(85);expect(s.harness.reduce(100)).toBe(100);const move=()=>{s.combatTime+=1/60;s.player.prevX=s.player.x;s.player.x+=2;s.harness.update(1/60);};for(let n=0;n<479;n++)move();expect(s.harness.ready).toBe(false);for(let n=0;n<123;n++)move();expect(s.harness.ready).toBe(true);s.passives[0].rarity=3;expect(s2PassiveValue(content,s.passives,'s2:harness')).toBeLessThanOrEqual(.225);s.dispose();
 });
});
