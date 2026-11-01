import {GameEngine} from '../src/core/engine';
import {pilot} from '../tests/helpers/pilot';
import {xpForLevel} from '../src/semesters/s2/legacy/rules';
import {semesterTwoResult} from '../src/semesters/s2/settlement';
/** Deterministic release observation; presentation-free, one fixed seed. The
 * short teaching path is the same fixture used in P12/P13, never production tuning. */
import {freshProfile,validateProfile,toLegacyS1Save} from '../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../src/semesters/inheritance';
import {SemesterEngine} from '../src/semesters/runtime/SemesterEngine';
import {S2_RUNTIME_CONFIG} from '../src/semesters/s2/config';
import {S2_CONTENT} from '../src/semesters/s2/content';
import {legacyContentRules} from '../src/semesters/s2/legacy/rules-adapter';
import type {ContentState} from '../src/semesters/s2/legacy/ContentState';
import type {ContentSkill,ContentWeaponId} from '../src/semesters/s2/types';
const oldWeapons=['laser','knife','blueprint','lightning'] as const;
export const RELEASE_BUILDS=[
 {id:'p12-old-base',label:'P12旧四基础Lv5',weapons:oldWeapons.map(id=>({id,evolved:false})),passives:[['haste',3],['multi',1],['area',2],['duration',2],['armor',3],['health',3]]},
 {id:'medium-mixed',label:'合法中等混合/两进化',weapons:[{id:'laser',evolved:true},{id:'s2:drone',evolved:false},{id:'s2:whiteboard',evolved:false},{id:'s2:spool',evolved:true}],passives:[['haste',3],['multi',1],['luck',1],['duration',2],['s2:protocol',3],['s2:harness',3]]},
 {id:'p13-strong-evolved',label:'合法强旧四进化（补幸运签）',weapons:oldWeapons.map(id=>({id,evolved:true})),passives:[['haste',3],['multi',1],['area',2],['duration',2],['luck',1]]},
 {id:'strong-s2-evolved',label:'强S2四进化',weapons:['s2:drone','s2:whiteboard','s2:spool','s2:printer'].map(id=>({id,evolved:true})),passives:[['haste',3],['multi',1],['area',2],['duration',2],['s2:protocol',3],['s2:harness',3]]},
] as const;
export function simulateReleaseBoss(buildIndex:number,boss:1|2|3=3){
 const build=RELEASE_BUILDS[buildIndex],cost=releaseBuildCost(build),p=freshProfile();p.stats.wins=1;p.unlocked.push('coder');p.selected='coder';p.unlocks.weapons=S2_CONTENT.weapons.filter(w=>!w.id.startsWith('s2:')).map(w=>w.id) as typeof p.unlocks.weapons;const snapshot=createS2PreviewSnapshot(validateProfile(p)!,86,{choice:{id:'topic',weaponId:build.weapons[0].id}}),base=legacyContentRules(S2_CONTENT);let s!:ContentState;
 const engine=new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,view:{publish(){}},rules:{...base,project:state=>({phase:state.phase}),create(services){s=base.create(services);s.player.invincible=1000;return s;},step(state,step){return step.phase==='teaching'?{}:base.step(state,step);}}});
 const intro=()=>{for(let n=0;n<10000&&engine.read().phase==='teaching';n++)engine.advance(1/15);if(engine.read().phase!=='assessmentIntro'||!engine.acknowledge(engine.read().gate!.token))throw Error('Missing deterministic intro');s.drops.clear();};
 const reward=()=>{const token=s.rewards.token,index=s.rewards.options.findIndex(o=>o.id==='upgrade');if(index>=0)engine.dispatch({type:'chooseReward',token,index});if(!engine.dispatch({type:'chestDone',token})||!engine.acknowledge(engine.read().gate!.token))throw Error('Missing deterministic reward');engine.advance(1/60);};
 for(let n=0;n<boss-1;n++){intro();s.hitEnemy(s.bossEnemy,1e9,'knife',s.player.x,s.player.y,0,false,false);engine.advance(1/60);reward();}intro();
 for(const w of s.weapons)s.weaponSystem.remove(w.id);const make=(id:string,evolved=false,level=5):ContentSkill=>({id:id as ContentWeaponId,level,evolved,rarity:0,instanceId:s.nextInstance()});
 s.weapons.splice(0,s.weapons.length,...build.weapons.map(w=>make(w.id,w.evolved)));s.passives.splice(0,s.passives.length,...build.passives.map(([id,level])=>make(id,false,level)));s.recalculateStats();s.stats.crit=0;s.damageMultiplier=1;s.player.hp=50;s.player.invincible=1000;
 const e=s.enemies,id=s.bossEnemy;s.player.x=e.x[id]-80;s.player.y=e.y[id];s.player.prevX=s.player.x;s.player.prevY=s.player.y;
 const system=boss===3?s.bossSystem.expoFinal:boss===2?s.bossSystem.projectReview:s.bossSystem.proposalBoard,stages=new Set<number>();let previous=e.hp[id],monotonic=true,fixedHp=true,maxReduction=0,recoveryDamage=0,minRecoveryTicks=Infinity,recoveryStart=-1,armoredTicks=0;
 for(let n=0;n<60*300&&engine.read().phase==='assessment';n++){
  const phase=system.snapshot()!;stages.add(phase.stage);const reduction='reduction'in phase?phase.reduction:0;maxReduction=Math.max(maxReduction,reduction);if(reduction>0)armoredTicks++;
  const recovery=phase.move==='recovery';if(recovery&&recoveryStart<0)recoveryStart=s.frame;if(!recovery&&recoveryStart>=0){minRecoveryTicks=Math.min(minRecoveryTicks,s.frame-recoveryStart);recoveryStart=-1;}
  const hp=e.hp[id];engine.dispatch({type:'move',x:e.x[id]-s.player.x-80,y:e.y[id]-s.player.y});engine.advance(1/60);if(recovery)recoveryDamage+=hp-e.hp[id];monotonic&&=e.hp[id]<=previous;fixedHp&&=e.maxHp[id]===(boss===3?110000:boss===2?46000:16000);previous=e.hp[id];
 }
 const result={build:build.id,label:build.label,boss,seed:86,hp:boss===3?110000:boss===2?46000:16000,seconds:Math.round(engine.read().clock.assessmentSeconds*100)/100,killed:engine.read().phase==='assessmentReward',remainingHp:e.hp[id],stages:[...stages],maxReduction,armoredSeconds:Math.round(armoredTicks/60*100)/100,recoveryDamage:Math.round(recoveryDamage),minRecoveryTicks:Number.isFinite(minRecoveryTicks)?minRecoveryTicks:null,monotonic,fixedHp,weapons:build.weapons,passives:build.passives,cost};engine.dispose();return result;
}
export function releaseBalanceObservations(){return[...RELEASE_BUILDS.map((_,i)=>simulateReleaseBoss(i,3)),simulateReleaseBoss(0,2),simulateReleaseBoss(1,1),simulateReleaseBoss(1,2)];}

export interface ReleaseBuild {id:string;weapons:readonly {id:string;evolved:boolean}[];passives:readonly (readonly [string,number])[]}
export function releaseBuildCost(build:ReleaseBuild){
 if(!build.weapons.length||build.weapons.length>6||build.passives.length>6||new Set(build.weapons.map(w=>w.id)).size!==build.weapons.length||new Set(build.passives.map(([id])=>id)).size!==build.passives.length)throw Error('Illegal six-slot build');
 for(const [id,level] of build.passives)if(!S2_CONTENT.passiveById[id]||!Number.isInteger(level)||level<1||level>5)throw Error(`Illegal passive: ${id}`);
 for(const w of build.weapons){const def=S2_CONTENT.weaponById[w.id];if(!def||def.fusion)throw Error(`Illegal weapon: ${w.id}`);if(w.evolved&&!build.passives.some(([id,level])=>id===def.evolution.passive&&level>=1))throw Error(`Missing evolution recipe: ${w.id}`);}
 const acquisitions=build.weapons.length-1+build.passives.length,totalPoints=build.weapons.length*5-1+build.passives.reduce((n,[,level])=>n+level,0),xp=(choices:number)=>Array.from({length:choices},(_,i)=>xpForLevel(i+1)).reduce((a,b)=>a+b,0);
 return {starter:build.weapons[0].id,weaponSlots:build.weapons.length,passiveSlots:build.passives.length,acquisitionDrafts:acquisitions,reinforcementPoints:totalPoints-acquisitions,totalSkillPoints:totalPoints,evolutionChests:build.weapons.filter(w=>w.evolved).length,minimumAcquisitionXP:xp(acquisitions),allDraftXP:xp(totalPoints),allDraftLevel:totalPoints+1,scope:'Cost lower bounds: ordinary chest upgrades can replace reinforcement points, never acquisitions; an evolution consumes one chest choice, including all three Boss reinforcements. Full real card pool is not guaranteed to offer a prescribed build.'};
}
/** Short real-input observation: full ordinary simulation, no invincibility,
 * debug grants, accelerated calendar, injected skills or manual ultimate. */
export function naturalIncomeObservation(semester:'s1'|'s2',seed=86,seconds=180){
 const p=freshProfile();p.stats.wins=1;let s!:ContentState;const snapshot=createS2PreviewSnapshot(p,seed,{choice:{id:'topic',weaponId:'knife'}}),base=legacyContentRules(S2_CONTENT);
 const first=semester==='s1'?new GameEngine(toLegacyS1Save(p),seed):null;
 const second=first?null:new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,view:{publish(){}},rules:{...base,project:state=>({phase:state.phase}),create(services){return s=base.create(services);}}});
 const model=first??s;let choices=0,chests=0;
 // The pilot uses the shared central roads. Only its ordinary command sink is
 // adapted; the S2 model still owns movement, collisions, spawns and card pool.
 const controlled=first??new Proxy(s,{get(target,key){if(key==='send')return (command:Record<string,unknown>)=>second!.dispatch(command.type==='choose'?{...command,token:target.draftToken}:command);return Reflect.get(target,key);}}) as unknown as GameEngine;
 for(let i=0;i<seconds*60+1024&&model.combatTime<seconds-1e-7&&!(first?.result??second?.read().result);i++){
  if(model.phase==='reward'){const index=model.rewards.options.findIndex(o=>o.kind==='evolution');controlled.send({type:'chooseReward',token:model.rewards.token,index:index>=0?index:model.rewards.options.findIndex(o=>o.kind==='upgrade')});}
  else if(model.phase==='contract')controlled.send({type:'chooseReward',token:model.rewards.token,index:-1});
  else{if(model.phase==='draft')choices++;if(model.phase==='chest')chests++;pilot(controlled);}
  if(first){first.tick(1/60);first.visualEvents.length=0;}else second!.advance(1/60);
 }
 const survived=model.player.hp>0;if(first)first.finish(false);else second!.abandon();
 const result=first?.result??semesterTwoResult(snapshot,second!.read().result,s,{id:`natural-${seed}`,nickname:'离线观察',createdAt:1})!;
 const out={semester,seed,seconds:result.seconds,survived,credits:result.credits,creditsPerCombatMinute:result.seconds?Math.round(result.credits/result.seconds*60*100)/100:0,level:model.level,normalKills:model.progress.normalKills,choices,chests,weapons:structuredClone(model.weapons),passives:structuredClone(model.passives),limits:'180-second movement/draft pilot on common central roads, zero talents, no manual ultimate or relic risk; S2 topic chooses knife, so no opening shield/XP bonus. This is neither graduation evidence nor a win-rate sample.'};first?.dispose();second?.dispose();return out;
}
