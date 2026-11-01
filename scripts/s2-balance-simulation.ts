/** Deterministic release observation; presentation-free, one fixed seed. The
 * short teaching path is the same fixture used in P12/P13, never production tuning. */
import {freshProfile,validateProfile} from '../src/save/v5/profile';
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
 {id:'medium-mixed',label:'中等新旧混合/两进化',weapons:[{id:'laser',evolved:true},{id:'s2:drone',evolved:false},{id:'s2:whiteboard',evolved:false},{id:'s2:spool',evolved:true}],passives:[['haste',3],['multi',1],['area',2],['duration',2],['s2:protocol',3],['s2:harness',3]]},
 {id:'p13-strong-evolved',label:'P13强旧四进化（原62.75秒）',weapons:oldWeapons.map(id=>({id,evolved:true})),passives:[['haste',3],['multi',1],['area',2],['duration',2]]},
 {id:'strong-s2-evolved',label:'强S2四进化',weapons:['s2:drone','s2:whiteboard','s2:spool','s2:printer'].map(id=>({id,evolved:true})),passives:[['haste',3],['multi',1],['area',2],['duration',2],['s2:protocol',3],['s2:harness',3]]},
] as const;
export function simulateReleaseBoss(buildIndex:number,boss:1|2|3=3){
 const build=RELEASE_BUILDS[buildIndex],p=freshProfile();p.stats.wins=1;p.unlocked.push('coder');p.selected='coder';const snapshot=createS2PreviewSnapshot(validateProfile(p)!,86,{choice:{id:'topic',weaponId:'s2:drone'}}),base=legacyContentRules(S2_CONTENT);let s!:ContentState;
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
 const result={build:build.id,label:build.label,boss,seed:86,hp:boss===3?110000:boss===2?46000:16000,seconds:Math.round(engine.read().clock.assessmentSeconds*100)/100,killed:engine.read().phase==='assessmentReward',remainingHp:e.hp[id],stages:[...stages],maxReduction,armoredSeconds:Math.round(armoredTicks/60*100)/100,recoveryDamage:Math.round(recoveryDamage),minRecoveryTicks:Number.isFinite(minRecoveryTicks)?minRecoveryTicks:null,monotonic,fixedHp,weapons:build.weapons,passives:build.passives};engine.dispose();return result;
}
export function releaseBalanceObservations(){return[...RELEASE_BUILDS.map((_,i)=>simulateReleaseBoss(i,3)),simulateReleaseBoss(0,2),simulateReleaseBoss(1,1),simulateReleaseBoss(1,2)];}
