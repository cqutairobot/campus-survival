import type {SemesterRules} from '../../runtime/contracts';
import {ContentState} from './ContentState';
import type {ContentCatalog} from './catalog';
import {xpForLevel} from './rules';
import {chapterAt,type WorldSnapshot} from '../world';

/** Only visual fields leave the rules. Ordinary arrays/objects replace pools,
 * typed buffers and Maps; entity identity is slot + generation + full content ID. */
export function projectContent(s:ContentState){
 const e=s.enemies,goal=chapterAt(s.world,s.week);
 const enemyFields=['x','y','prevX','prevY','vx','vy','hp','maxHp','radius','shield','frozen','state','affixes','rank','generation','alive'] as const;
 const enemies=Object.fromEntries(enemyFields.map(key=>{const values:number[]=[];for(const id of e.active)values[id]=e[key][id];return[key,values];})) as Record<typeof enemyFields[number],number[]>;
 const kind:string[]=[];for(const id of e.active)kind[id]=s.content.enemies[e.kind[id]].id;
 const identity=(pool:ContentState['shots']|ContentState['drops'])=>({alive:Object.fromEntries(pool.active.map(id=>[id,1])),generation:Object.fromEntries(pool.active.map(id=>[id,pool.generation[id]]))});
 const shots=(pool:ContentState['shots'])=>({active:[...pool.active],data:Object.fromEntries(pool.active.map(id=>{const shot=pool.data[id];return[id,{...shot,hits:[...shot.hits]}];})),...identity(pool)});
 return {
  player:{...s.player},stats:{...s.stats},combatStats:{...s.combatStats},weapons:structuredClone(s.weapons),passives:structuredClone(s.passives),consumed:[...s.consumed],relics:[...s.relics],
  manifest:{character:s.manifest.character,regions:[...s.manifest.regions],mode:s.manifest.mode},world:s.world,chapter:{...goal,reached:s.progress.visited.includes(goal.regionId)},assessmentAdmission:s.assessmentAdmission?structuredClone(s.assessmentAdmission):null,phase:s.phase,frame:s.frame,week:s.week,combatTime:s.combatTime,bossTime:s.bossTime,bossActive:s.bossActive,bossStage:s.bossStage,bossEnemy:s.bossEnemy,
  enemies:{...enemies,kind,active:[...e.active]},shots:shots(s.shots),enemyShots:shots(s.enemyShots),
  areas:{active:[...s.areas.active],data:Object.fromEntries(s.areas.active.map(id=>{const {hits:_,...area}=s.areas.data[id];return[id,{...area}];}))},
  drops:{active:[...s.drops.active],data:Object.fromEntries(s.drops.active.map(id=>[id,{...s.drops.data[id]}])),...identity(s.drops)},
  hazards:s.hazards.map(h=>({...h,route:h.route?structuredClone(h.route):null})),dangerQueue:s.danger.pending.map(h=>({id:h.id,retryTick:h.retryTick,tier:h.tier})),parcels:s.threats.parcelViews(),proposalBoard:s.bossSystem.proposalBoard.snapshot(),turrets:s.weaponSystem.summons.turrets.map(t=>({...t})),visualEvents:s.visualEvents.map(v=>({serial:v.serial,event:{...v.event}})),
  ultimate:s.ultimate.snapshot(),momentum:{active:s.momentum.active,combo:s.momentum.combo,charge:s.momentum.charge,remaining:s.momentum.remaining},
  level:s.level,xp:s.xp,xpNext:xpForLevel(s.level),kills:s.kills,bosses:s.bosses,damage:{...s.damage},bonusCredits:s.bonusCredits,progress:structuredClone(s.progress),discoveries:structuredClone(s.discoveries),
  cards:structuredClone(s.cards),draftToken:s.draftToken,reward:structuredClone(s.rewards.snapshot),rewardToken:s.rewards.token,chest:structuredClone(s.chest),notice:s.combatTime<s.noticeUntil?s.notice:'',assessmentRewardDone:s.assessmentRewardDone,
 };
}
export type LegacyContentDTO=ReturnType<typeof projectContent>;
export function legacyContentRules(content:ContentCatalog,world?:WorldSnapshot):SemesterRules<ContentState,LegacyContentDTO>{
 return {create:services=>new ContentState(content,services,world),step:(state,step)=>state.tick(step),assessment:(state,event,services)=>state.assessment(event,services),project:projectContent,command:(state,command)=>state.command(command),canAcknowledge:(state,kind)=>state.canAcknowledge(kind),canResume:(state,reason)=>reason==='manual'||reason==='loading'||!state.hasPendingRewards,dispose:state=>state.dispose()};
}
