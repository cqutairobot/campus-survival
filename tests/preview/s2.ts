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
Object.assign(window,{__S2_PREVIEW__:{engine,state:()=>state,scene,resources:resourceState,checkpoint,advanced,params:()=>state.weapons.map(w=>weaponParams(S2_CONTENT,w,state.combatStats,state.damageMultiplier))}});
