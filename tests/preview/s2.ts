import '../../src/ui/styles/fonts.css';
import {resources} from '../../src/assets/loader';
import {SemesterScene} from '../../src/semesters/s2/presentation/SemesterScene';
import {SemesterEngine} from '../../src/semesters/runtime/SemesterEngine';
import {S2_RUNTIME_CONFIG} from '../../src/semesters/s2/config';
import {legacyContentRules} from '../../src/semesters/s2/legacy/rules-adapter';
import {S2_CONTENT} from '../../src/semesters/s2/content';
import type {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import type {ContentSkill} from '../../src/semesters/s2/types';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {freshProfile} from '../../src/save/v5/profile';
import {weaponParams} from '../../src/semesters/s2/legacy/params';

const profile=freshProfile();profile.stats.wins=1;profile.selected='coder';
const snapshot=createS2PreviewSnapshot(profile,86,{choice:{id:'topic',weaponId:'s2:drone'}}),settings={...profile.settings,muted:true,quality:'high' as const,motion:true,shake:0};
const scene=new SemesterScene(document.querySelector<HTMLElement>('#game')!,S2_CONTENT,settings,()=>{}),base=legacyContentRules(S2_CONTENT);let state!:ContentState,quietTeaching=false;
const engine=new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,view:scene,rules:{...base,create(services){state=base.create(services);state.player.invincible=1000;return state;},step(s,step){return quietTeaching&&step.phase==='teaching'?{}:base.step(s,step);}}});
scene.attach(engine);await scene.initialize();
const skill=(id:ContentSkill['id'],level=5,evolved=false):ContentSkill=>({id,level,evolved,rarity:0,kind:'base',instanceId:state.nextInstance()});
const resourceState=()=>({loader:resources.debug,geometry:scene['geometry'].textures.size,art:scene['artTextures'].size,voices:scene.audio.debug.sessionVoices,canvas:!!document.querySelector('canvas'),panels:document.querySelectorAll('.s2-build-panel').length});
/** Only the teaching wait is omitted in this short-path fixture. Calendar,
 * fixed steps, Boss HP/movement/damage/rewards and all player attacks are real. */
function checkpoint(){
 quietTeaching=true;for(const w of state.weapons)state.weaponSystem.remove(w.id);for(const id of [...state.enemies.active])state.releaseEnemy(id);state.drops.clear();state.danger.clear();state.enemyShots.clear();
 state.weapons.splice(0,state.weapons.length,skill('s2:drone',5,true),skill('s2:whiteboard',5,true),skill('laser'),skill('s2:spool',5,true),skill('s2:printer',5,true));state.passives.splice(0,state.passives.length,skill('multi',3),skill('haste',3),skill('area',3),skill('night',3),skill('s2:protocol'),skill('s2:echoChip'));state.recalculateStats();state.stats.crit=0;state.damageMultiplier=.55;state.player.hp=50;state.player.invincible=1000;
 for(let n=0;n<4800&&engine.read().phase==='teaching';n++)engine.advance(1/15);
 const intro=engine.read(),introAccepted=engine.acknowledge(intro.gate!.token),id=state.bossEnemy,e=state.enemies,hpStart=e.hp[id];state.player.x=e.x[id]-130;state.player.y=e.y[id];state.player.prevX=state.player.x;state.player.prevY=state.player.y;
 let previous=hpStart,monotonic=true,transition=false,recoveryDamage=0;
 for(let n=0;n<9000&&state.bosses===0;n++){
  const rest=state.bossSystem.proposalBoard.snapshot()?.move==='recovery',hp=e.hp[id];engine.dispatch({type:'move',x:e.x[id]-state.player.x-40,y:e.y[id]-state.player.y});engine.advance(1/60);monotonic&&=e.hp[id]<=previous&&e.maxHp[id]===16000;previous=e.hp[id];transition||=state.bossStage===2;if(rest)recoveryDamage+=hp-e.hp[id];
 }
 return{intro:{week:intro.clock.week,teachingSeconds:intro.clock.teachingSeconds},introAccepted,hpStart,monotonic,transition,recoveryDamage,damage:{...state.damage},phase:engine.read().phase,passed:engine.read().assessmentsPassed};
}
function advanced(){
 const s=state,e=s.enemies,previous={week:s.week,time:s.combatTime,frame:s.frame};for(const id of [...e.active])s.releaseEnemy(id);s.advanced.clear();s.week=17;
 const spawn=(kind:string,x:number)=>s.spawnEnemy(kind,s.player.x+x,s.player.y),peers=[spawn('s2:peer',100),spawn('s2:peer',130)],relay=spawn('s2:relay',150),coordinator=spawn('s2:coordinator',170),marshal=spawn('s2:marshal',200),auditor=spawn('s2:auditor',240),robot=spawn('s2:recycler',190);spawn('summoner',280);spawn('leader',300);
 s.advanced.update(1/60);const links=s.advanced.snapshot().links,support=s.advanced.supportCounts();s.combatTime+=2;s.frame+=120;s.advanced.update(1/60);s.danger.update(s.frame,17,s.player,s.stats.speed,h=>h.owner===undefined||s.enemySourceAlive(h.owner,h.ownerGeneration??0),()=>{});
 const node=e.active.find(id=>e.owner[id]===auditor)!,before={kills:s.kills,energy:s.ultimate.energy,drops:s.drops.active.length};s.hitEnemy(node,1e6,'laser',s.player.x,s.player.y,0,false,false);s.resolveDeaths();const zeroRewards=JSON.stringify(before)===JSON.stringify({kills:s.kills,energy:s.ultimate.energy,drops:s.drops.active.length}),exposed=s.advanced.reduction(auditor)===0;
 const casts=[...s.danger.pending,...s.hazards].filter(h=>h.owner===marshal);s.hitEnemy(marshal,1e6,'laser',s.player.x,s.player.y,0,false,false);s.resolveDeaths();const cancelled=casts.length>0&&casts.every(h=>h.phase==='cancelled');
 const result={peers:peers.every(id=>id>=0),actors:[relay,coordinator,auditor,robot].every(id=>id>=0),links:links.length,support,zeroRewards,exposed,cancelled};s.week=previous.week;s.combatTime=previous.time;s.frame=previous.frame;return result;
}
async function projectReview(){
 let s!:ContentState;const view=new SemesterScene(document.querySelector<HTMLElement>('#game')!,S2_CONTENT,settings,()=>{}),engine=new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,view,rules:{...base,create(services){s=base.create(services);s.player.invincible=1000;return s;},step(state,step){return step.phase==='teaching'?{}:base.step(state,step);}}});
 view.attach(engine);await view.initialize();
 const host={engine,state:()=>s,resources:()=>({loader:resources.debug,geometry:view['geometry'].textures.size,art:view['artTextures'].size,voices:view.audio.debug.sessionVoices,canvas:!!document.querySelector('canvas'),panels:document.querySelectorAll('.s2-build-panel').length})};Object.assign((window as unknown as {__S2_PREVIEW__:object}).__S2_PREVIEW__,{project:host});
 const intro=()=>{for(let n=0;n<10000&&engine.read().phase==='teaching';n++)engine.advance(1/15);const read=engine.read();return{week:read.clock.week,teachingSeconds:read.clock.teachingSeconds,accepted:engine.acknowledge(read.gate!.token)};};
 const first=intro();s.hitEnemy(s.bossEnemy,1e9,'knife',s.player.x,s.player.y,0,false,false);engine.advance(1/60);const firstToken=s.rewards.token;engine.dispatch({type:'chestDone',token:firstToken});engine.acknowledge(engine.read().gate!.token);engine.advance(1/60);const second=intro(),id=s.bossEnemy,e=s.enemies;
 for(const w of s.weapons)s.weaponSystem.remove(w.id);const make=(id:ContentSkill['id'],level=5):ContentSkill=>({id,level,evolved:false,rarity:0,instanceId:s.nextInstance()});s.weapons.splice(0,s.weapons.length,...(['laser','knife','blueprint','lightning'] as const).map(id=>make(id)));s.passives.splice(0,s.passives.length,make('haste',3),make('multi',1),make('area',2),make('duration',2),make('armor',3),make('health',3));s.recalculateStats();s.stats.crit=0;s.damageMultiplier=1;s.player.hp=50;s.player.invincible=1000;s.player.x=e.x[id]-80;s.player.y=e.y[id];s.player.prevX=s.player.x;s.player.prevY=s.player.y;s.drops.clear();
 let chests=0;const heals:number[]=[],open=s.rewards.openChest.bind(s.rewards),heal=s.heal.bind(s);s.rewards.openChest=(...args)=>{chests++;return open(...args);};s.heal=(amount,fixed=false)=>{if(fixed)heals.push(amount);return heal(amount,fixed);};
 const stages=new Set<number>();let maxReduction=0,monotonic=true,previous=46000,recoveryDamage=0,nodeChecked=false,panelChecked=false,zeroRewards=true,nodeCancelled=false,panelCancelled=false,exposed=false;
 for(let n=0;n<9000&&engine.read().phase==='assessment';n++){
  const review=s.bossSystem.projectReview.snapshot()!;stages.add(review.stage);maxReduction=Math.max(maxReduction,review.reduction);
  if(review.stage===2){
   const target=!nodeChecked?review.nodes[0]:!panelChecked?review.panels[0]:undefined;
   if(target){const before={kills:s.kills,energy:s.ultimate.energy,drops:s.drops.active.length,normal:s.progress.normalKills},paths=[...s.hazards,...s.danger.pending].filter(h=>h.owner===target.id&&h.ownerGeneration===target.generation);
    if(!nodeChecked){const pending=s.addHazard('circle',e.x[target.id],e.y[target.id],0,0,48,1.5,.25,10,undefined,{owner:target.id,ownerGeneration:target.generation,cancelOnDeath:true,tier:'boss',ordinary:false});if(pending)paths.push(pending);}
    s.hitEnemy(target.id,1e5,'laser',s.player.x,s.player.y,0,false,false);s.resolveDeaths();zeroRewards&&=JSON.stringify(before)===JSON.stringify({kills:s.kills,energy:s.ultimate.energy,drops:s.drops.active.length,normal:s.progress.normalKills});const cancelled=paths.length>0&&paths.every(h=>h.phase==='cancelled');
    if(!nodeChecked){nodeChecked=true;nodeCancelled=cancelled;exposed=s.bossSystem.projectReview.reduction(id)===0;}else{panelChecked=true;panelCancelled=cancelled;}
   }
  }
  const hp=e.hp[id],rest=review.move==='recovery';engine.dispatch({type:'move',x:e.x[id]-s.player.x-80,y:e.y[id]-s.player.y});engine.advance(1/60);if(rest)recoveryDamage+=hp-e.hp[id];monotonic&&=e.hp[id]<=previous&&e.maxHp[id]===46000;previous=e.hp[id];
 }
 const expectedHeal=s.stats.maxHp*.15,reward=engine.read(),prematureAcknowledgement=engine.acknowledge(reward.gate!.token),upgrade=s.rewards.options.findIndex(o=>o.id==='upgrade');if(upgrade>=0)engine.dispatch({type:'chooseReward',token:s.rewards.token,index:upgrade});
 return{first,second,id:S2_CONTENT.enemies[e.kind[id]].id,hp:46000,stages:[...stages],maxReduction,monotonic,recoveryDamage,nodeChecked,panelChecked,nodeCancelled,panelCancelled,zeroRewards,exposed,chests,heals,expectedHeal,seconds:reward.clock.assessmentSeconds,phase:reward.phase,passed:reward.assessmentsPassed,prematureAcknowledgement,damage:{...s.damage}};
}
Object.assign(window,{__S2_PREVIEW__:{engine,state:()=>state,scene,resources:resourceState,checkpoint,advanced,projectReview,params:()=>state.weapons.map(w=>weaponParams(S2_CONTENT,w,state.combatStats,state.damageMultiplier))}});
