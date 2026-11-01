/** Directed audit evidence only; no renderer or production constant overrides. */
import {freshProfile} from '../src/save/v5/profile';
import {GameEngine} from '../src/core/engine';
import {freshSave} from '../src/save/storage';
import {randomStreams} from '../src/core/run';
import {createS2PreviewSnapshot} from '../src/semesters/inheritance';
import {S2_CONTENT as content} from '../src/semesters/s2/content';
import {S2_RUNTIME_CONFIG} from '../src/semesters/s2/config';
import {ContentState} from '../src/semesters/s2/legacy/ContentState';
import {legacyContentRules} from '../src/semesters/s2/legacy/rules-adapter';
import {SemesterEngine} from '../src/semesters/runtime/SemesterEngine';
import {fusionCandidates,fuseWeapons} from '../src/semesters/s2/legacy/fusions';
import {releaseBuildCost,type ReleaseBuild} from './s2-balance-simulation';
import type {ContentSkill} from '../src/semesters/s2/types';

const opening=()=>{const p=freshProfile();p.stats.wins=1;p.unlocks.weapons=content.weapons.filter(w=>!w.id.startsWith('s2:')).map(w=>w.id) as typeof p.unlocks.weapons;p.unlocks.passives=content.passives.filter(w=>!w.id.startsWith('s2:')).map(w=>w.id) as typeof p.unlocks.passives;return createS2PreviewSnapshot(p,86);};
const make=(s:ContentState,id:string,evolved=false):ContentSkill=>({id:id as ContentSkill['id'],level:5,rarity:0,evolved,kind:'base',instanceId:s.nextInstance()});
const twin={id:'s2:digitalTwin',components:['s2:spool','s2:printer'],support:['knife','laser','coffee','bot'],passives:['s2:harness','duration','haste','multi','area','luck']};
const sky={id:'sky',components:['laser','prism'],support:['knife','coffee','bot','lightning'],passives:['luck','thesis','haste','multi','area','duration']};
type Comparison=typeof twin;
function equip(s:ContentState,comparison:Comparison,fused:boolean,full:boolean){
 const build:ReleaseBuild={id:comparison.id,weapons:[...comparison.components.map(id=>({id,evolved:true})),...(full?comparison.support.map(id=>({id,evolved:false})):[])],passives:comparison.passives.map(id=>[id,1] as const)};
 const cost=releaseBuildCost(build);for(const old of s.weapons)s.weaponSystem.remove(old.id);s.week=17;s.semesterTime=640.01;s.weapons.splice(0,s.weapons.length,...build.weapons.map(w=>make(s,w.id,w.evolved)));s.passives.splice(0,s.passives.length,...build.passives.map(([id])=>({...make(s,id),level:1})));
 if(fused){if(!fusionCandidates(content,s.weapons,17,0).some(f=>f.id===comparison.id))throw Error('Unavailable fusion');const weapon=fuseWeapons(content,s.weapons,comparison.id,17,0,s.consumed,s.nextInstance());if(!weapon)throw Error('Missing fusion');if(full)s.weapons.push(make(s,'code'));}
 s.recalculateStats();s.stats.crit=0;s.player.facing=0;return{cost,extraSkillPoints:fused&&full?5:0,extraFusionChests:fused?1:0,occupied:s.weapons.length,passives:s.passives.map(p=>({id:p.id,level:p.level})),weapons:s.weapons.map(w=>({id:w.id,evolved:w.evolved}))};
}
/** The exact audit's short fixed-target setup, with actual burn/status updates. */
function staticDamage(ids:readonly {id:string;evolved:boolean}[],targets:number,distance:number,passives:readonly string[]=[],radius?:number){
 const snapshot=opening(),s=new ContentState(content,{snapshot,streams:randomStreams(86)});s.enemies.clear();s.weapons.splice(0,s.weapons.length,...ids.map(w=>make(s,w.id,w.evolved)));s.passives.push(...passives.map(id=>({...make(s,id),level:1})));s.recalculateStats();s.stats.crit=0;s.player.facing=0;s.player.invincible=1000;
 const positions=Array.from({length:targets},(_,n)=>{const angle=targets===1?0:n*Math.PI*2/targets,id=s.spawnEnemy('receipt');s.enemies.hp[id]=s.enemies.maxHp[id]=1e7;s.enemies.speed[id]=0;if(radius!==undefined)s.enemies.radius[id]=radius;return{id,x:s.player.x+Math.cos(angle)*distance,y:s.player.y+Math.sin(angle)*distance};});
 for(let tick=0;tick<1200;tick++){s.frame=tick;s.combatTime=tick/60;for(const p of positions){s.enemies.x[p.id]=p.x;s.enemies.y[p.id]=p.y;s.enemies.vx[p.id]=s.enemies.vy[p.id]=0;}s.behaviors.update(1/60);s.rebuildGrid();s.weaponSystem.update(1/60);s.visualEvents.length=0;}
 const total=Object.values(s.damage).reduce((a,b)=>a+b,0),out={targets,distance,radius:radius??s.enemies.radius[positions[0].id],dps:Math.round(total/20*100)/100,damage:{...s.damage},poolFailures:s.poolFailures};s.dispose();return out;
}
/** Real final Boss phases with the F1 fixed-input isolation protocol. */
function boss(comparison:Comparison,fused:boolean){
 let s!:ContentState;const snapshot=opening(),base=legacyContentRules(content),engine=new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,view:{publish(){}},rules:{...base,project:state=>({phase:state.phase}),create(services){s=base.create(services);s.player.invincible=1000;return s;},step(state,step){return step.phase==='teaching'?{}:base.step(state,step);}}});
 const intro=()=>{while(engine.read().phase==='teaching')engine.advance(1/15);if(!engine.acknowledge(engine.read().gate!.token))throw Error('Intro rejected');s.drops.clear();};
 for(let n=0;n<2;n++){intro();s.hitEnemy(s.bossEnemy,1e9,'knife',s.player.x,s.player.y,0,false,false);engine.advance(1/60);const token=s.rewards.token,index=s.rewards.options.findIndex(o=>o.id==='upgrade');if(index>=0)engine.dispatch({type:'chooseReward',token,index});engine.dispatch({type:'chestDone',token});engine.acknowledge(engine.read().gate!.token);engine.advance(1/60);}intro();
 const build=equip(s,comparison,fused,true);s.week=24;s.semesterTime=960;s.player.invincible=1000;const id=s.bossEnemy,e=s.enemies,stages=new Set<number>();let monotonic=true,previous=110000,maxReduction=0,minWindow=Infinity,windowStart=-1;
 for(let tick=0;tick<18000&&engine.read().phase==='assessment';tick++){
  const phase=s.bossSystem.expoFinal.snapshot()!;stages.add(phase.stage);maxReduction=Math.max(maxReduction,phase.reduction);if(phase.move==='recovery'&&phase.stage===3&&windowStart<0)windowStart=s.frame;if(phase.move!=='recovery'&&windowStart>=0){minWindow=Math.min(minWindow,s.frame-windowStart);windowStart=-1;}
  engine.dispatch({type:'move',x:e.x[id]-s.player.x-80,y:e.y[id]-s.player.y});engine.advance(1/60);monotonic&&=e.hp[id]<=previous&&e.maxHp[id]===110000;previous=e.hp[id];s.visualEvents.length=0;
 }
 const out={fusion:comparison.id,fused,build,seconds:Math.round(engine.read().clock.assessmentSeconds*100)/100,killed:engine.read().phase==='assessmentReward',stages:[...stages],maxReduction,minFinalWindowTicks:Number.isFinite(minWindow)?minWindow:null,monotonic,damage:{...s.damage}};engine.dispose();return out;
}
export function targetedBalanceObservations(){
 const whiteboard=[8,18].flatMap(radius=>[80,130,180,195].map(distance=>({radius,distance,base:staticDamage([{id:'s2:whiteboard',evolved:false}],1,distance,[],radius).dps,evolved:staticDamage([{id:'s2:whiteboard',evolved:true}],1,distance,[],radius).dps})));
 const isolated=[twin,sky].flatMap(c=>[1,12].map(targets=>({fusion:c.id,targets,materials:staticDamage(c.components.map(id=>({id,evolved:true})),targets,targets===1?80:140).dps,fused:staticDamage([{id:c.id,evolved:false}],targets,targets===1?80:140).dps})));
 const legal=[twin,sky].map(c=>({fusion:c.id,passiveBudget:c.passives.map(id=>({id,level:1})),formation:releaseBuildCost({id:c.id,weapons:[...c.components.map(id=>({id,evolved:true})),...c.support.map(id=>({id,evolved:false}))],passives:c.passives.map(id=>[id,1])}),boss:[false,true].map(fused=>boss(c,fused)),crowd:[false,true].map(fused=>({fused,...staticDamage([...(fused?[{id:c.id,evolved:false},{id:'code',evolved:false}]:c.components.map(id=>({id,evolved:true}))),...c.support.map(id=>({id,evolved:false}))],12,140,c.passives)}))}));
 const income=[false,true].map(victory=>{const first=new GameEngine(freshSave(),86);first.semesterTime=first.combatTime=victory?880:180;first.bosses=victory?3:0;first.finish(victory);const credits=first.result!.credits;first.dispose();return {victory,s1Credits:credits,s1TeachingSeconds:victory?880:180,s2Credits:Math.floor((Math.floor((victory?24:4)*1.5)+(victory?3:0)*10+(victory?30:0))),s2TeachingSeconds:victory?960:180,excludes:'Kills, risk, bonus rewards and Boss duration; complete legal Boss times reported separately.'};});
 return{version:'audit-f2-targeted-v1',method:'Seed86 ordinary Lv5, zero crit/talents/ultimate/risk. Static receipt targets restored each fixed step, real status and attacks, 20s; ring 12 targets at140px. Legal six occupied slots use same six Lv1 passives, replace the released slot with base code Lv5 (cost +5 skill points and +1 fusion chest; never claimed free). Real Boss follows at80px with invincibility only to isolate output; fixed HP/stages/window unchanged.',whiteboard,isolated,legal,income};
}
