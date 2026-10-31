import type {SaveProfile,SemesterId} from './profile';
import {ACHIEVEMENTS} from '../data/achievements';
import {hasAlumniEligibility} from './inheritance';
import {S2_CONTENT as catalog} from './s2/content';
import {SEMESTER_EVENTS} from './s2/events';
import {S2_ACHIEVEMENTS,s2AchievementProgress} from './s2/achievements';
import {S2_INTERACTION_DEFS} from './s2/landmarks';
import {S2_REGION_DEFS} from './s2/world';
import {ZONES} from '../world/campus';
import {REGION_CONDITIONS} from '../world/landmarks';
import {S1_IDS} from '../save/v5/profile';

export const COLLECTION_CATALOG_VERSION='5.0.0';
export type SemesterFilter=SemesterId|'all';
export type CollectionCategory='weapons'|'passives'|'evolutions'|'fusions'|'enemies'|'relics'|'events'|'regions'|'interactions'|'achievements';
export interface CollectionEntry {
 id:string;category:CollectionCategory;semesterId:SemesterId;name:string;description:string;condition:string;source:string;fromWeek:number;icon:string;color:string;
 found:boolean;unlocked:boolean;achieved:boolean;complete:boolean;status:'未解锁'|'已解锁未发现'|'已发现'|'成就未达成'|'已达成';recipe:string[];
}
export interface CollectionGroup {total:number;discovered:number;unlocked:number;achieved:number;missing:CollectionEntry[];entries:CollectionEntry[]}
export const COLLECTION_LABELS:Record<CollectionCategory,string>={weapons:'武器',passives:'被动',evolutions:'进化',fusions:'融合',enemies:'敌人',relics:'遗物',events:'事件',regions:'区域',interactions:'互动点',achievements:'成就'};
const categories=Object.keys(COLLECTION_LABELS) as CollectionCategory[];
type Def=Omit<CollectionEntry,'found'|'unlocked'|'achieved'|'complete'|'status'>;
const semester=(id:string):SemesterId=>id.startsWith('s2:')?'s2':'s1';
const both='第一/第二学期均可获得';
function definitions():Def[]{
 const entry=(category:CollectionCategory,id:string,name:string,description:string,condition:string,source:string,fromWeek=1,recipe:string[]=[],icon='book',color='#66d9bf'):Def=>({category,id,semesterId:semester(id),name,description,condition,source,fromWeek,recipe,icon,color});
 const weapons=catalog.weapons.flatMap(w=>[entry('weapons',w.id,w.name,w.description,'升级选卡获得',w.id.startsWith('s2:')?'第二学期第1—24周升级':both,1,[],w.icon,w.color),entry('evolutions',w.id,w.evolution.name,w.evolution.description,`${w.name} Lv.5 + ${catalog.passiveById[w.evolution.passive].name} Lv.1；宝箱选择进化`,w.id.startsWith('s2:')?'第二学期宝箱':both,1,[w.id,w.evolution.passive],w.icon,w.color)]);
 const passives=catalog.passives.map(p=>entry('passives',p.id,p.name,p.description,'升级选卡获得',p.id.startsWith('s2:')?'第二学期第1—24周升级':both,1,[],p.icon,p.color));
 const fusions=catalog.fusions.map(f=>entry('fusions',f.id,f.name,f.description,`${f.components.map(id=>`${catalog.weaponById[id].name} Lv.5`).join(' + ')}；第9周宝箱，每局最多两次`,f.id.startsWith('s2:')?'第二学期第9周起宝箱':`${both}，第9周起宝箱`,9,[...f.components],f.icon,f.color));
 const enemies=catalog.enemies.map(e=>entry('enemies',e.id,e.name,`${{normal:'普通怪',elite:'精英',miniBoss:'小Boss',boss:'大Boss',bossAdd:'附属单位'}[e.rank]} · 基础HP ${e.hp} · 行为 ${e.behavior}`,'遇见即发现；历史记录不代表已击败',e.id.startsWith('s2:')?`第二学期第${e.from}周起${e.rank==='bossAdd'?' · Boss/事件附属':''}`:['boss','miniBoss','bossAdd'].includes(e.rank)?`第一学期第${e.from}周起；第二学期第18周起旧课复习`:`${both}，第${e.from}周起`,e.from,[],e.rank==='boss'?'trophy':'paper',e.color));
 const relics=catalog.relics.map(r=>entry('relics',r.id,r.name,`${r.benefit}；代价：${r.cost}`,`契约台自选，可放弃；${r.curse}`,r.id.startsWith('s2:')?'第二学期第4/12/20周联合课题台':`${both}，契约台自选`,4,[],r.icon,'#e4c17a'));
 const events=SEMESTER_EVENTS.map(e=>entry('events',e.id,e.name,e.description,`持续${e.duration}秒，至少3秒播报；遇见即发现，目标完成另计`,e.id.startsWith('s2:')?`第二学期第${e.from}周起校园事件`:`${both}，第3周起校园事件`,e.from,[],'bolt','#c39aff'));
 const regions=[...ZONES,...S2_REGION_DEFS].map(z=>entry('regions',z.id,z.name.split(' · ')[0],'校园机制区域，访问即发现',REGION_CONDITIONS[z.id]??'校园中自由到访',z.id.startsWith('s2:')?'第二学期第1周起自由到访':both,1,[],'map'));
 const interactions=S2_INTERACTION_DEFS.map(p=>entry('interactions',p.id,p.name,p.condition,p.condition,`第二学期第${p.from}周起 · ${p.name}`,p.from,[],'map'));
 const achievements=[...ACHIEVEMENTS,...S2_ACHIEVEMENTS].map(a=>entry('achievements',a.id,a.name,a.reward,a.condition,`${semester(a.id)==='s1'?'第一':'第二'}学期${'daily'in a&&a.daily?'每日（北京时间）':'普通模式'}正常结算`,1,[],'trophy','#e4c17a'));
 return [...weapons,...passives,...fusions,...enemies,...relics,...events,...regions,...interactions,...achievements];
}
const DEFINITIONS=definitions();
const s1Ids=(category:CollectionCategory):readonly string[]=>category==='interactions'?[]:category==='achievements'?ACHIEVEMENTS.map(a=>a.id):S1_IDS[category==='evolutions'?'weapons':category];
function unlocked(p:SaveProfile,d:Def):boolean {
 if(d.semesterId==='s2'&&!hasAlumniEligibility(p))return false;
 if(d.category==='weapons')return d.semesterId==='s2'||p.unlocks.weapons.includes(d.id);
 if(d.category==='evolutions'){const passive=catalog.weaponById[d.id].evolution.passive;return(d.semesterId==='s2'||p.unlocks.weapons.includes(d.id))&&(passive.startsWith('s2:')?hasAlumniEligibility(p):p.unlocks.passives.includes(passive));}
 if(d.category==='passives')return d.semesterId==='s2'||p.unlocks.passives.includes(d.id);
 if(d.category==='regions')return d.semesterId==='s2'||p.unlocks.regions.includes(d.id);
 if(d.category==='fusions')return d.recipe.every(id=>id.startsWith('s2:')?hasAlumniEligibility(p):p.unlocks.weapons.includes(id));
 return true;
}
/** Pure set difference over the actual catalog. S1's frozen ID sets are its
 * denominator; complete colon IDs never enter validateSave or a split parser. */
export function collectionGaps(profile:SaveProfile,catalogVersion=COLLECTION_CATALOG_VERSION,semesterFilter:SemesterFilter='all'){
 if(catalogVersion!==COLLECTION_CATALOG_VERSION)throw Error('Unsupported collection catalog');
 const lists:Record<Exclude<CollectionCategory,'achievements'>,readonly string[]>={weapons:profile.discovered,passives:profile.discovered,evolutions:profile.evolutions,fusions:profile.fusions,enemies:profile.discoveredEnemies,relics:profile.relics,events:profile.events,regions:profile.regions,interactions:profile.semesters.s2.discoveredInteractions};
 const groups={} as Record<CollectionCategory,CollectionGroup>;
 for(const category of categories){const ids=new Set<string>(),entries=DEFINITIONS.filter(d=>d.category===category&&(semesterFilter==='all'||semesterFilter==='s1'&&s1Ids(category).includes(d.id)||semesterFilter==='s2'&&d.semesterId==='s2')).filter(d=>!ids.has(d.id)&&!!ids.add(d.id)).map(d=>{
  const achievement=category==='achievements',state=d.semesterId==='s1'?profile.achievements[d.id]:profile.semesters.s2.achievements[d.id],achieved=achievement&&!!state?.completed,found=achievement?achieved:lists[category as keyof typeof lists].includes(d.id),open=unlocked(profile,d),complete=achievement?achieved:found;
  const unlockCondition=ACHIEVEMENTS.find(a=>a.weapon===d.id||a.region===d.id)?.condition;
  return{...d,condition:!open&&unlockCondition?`${unlockCondition}；下局解锁。${d.condition}`:d.condition,found,unlocked:open,achieved,complete,status:achievement?(achieved?'已达成':'成就未达成'):found?'已发现':open?'已解锁未发现':'未解锁'} satisfies CollectionEntry;
 });groups[category]={total:entries.length,discovered:entries.filter(e=>e.found).length,unlocked:entries.filter(e=>e.unlocked).length,achieved:entries.filter(e=>e.achieved).length,missing:entries.filter(e=>!e.complete),entries};}
 const entries=categories.flatMap(c=>groups[c].entries),total=entries.length;
 return{catalogVersion,semesterFilter,total,discovered:entries.filter(e=>e.found).length,unlocked:entries.filter(e=>e.unlocked).length,achieved:entries.filter(e=>e.achieved).length,missing:entries.filter(e=>!e.complete),groups};
}
export function filterCollection(entries:readonly CollectionEntry[],onlyIncomplete=false,unlockedUndiscovered=false){return entries.filter(e=>(!onlyIncomplete||!e.complete)&&(!unlockedUndiscovered||e.unlocked&&!e.found&&e.category!=='achievements'));}
export function settlementCollection(before:SaveProfile,after:SaveProfile){const old=collectionGaps(before),next=collectionGaps(after),keys=new Set(Object.values(old.groups).flatMap(g=>g.entries.filter(e=>e.complete).map(e=>`${e.category}|${e.id}`))),added=Object.values(next.groups).flatMap(g=>g.entries.filter(e=>e.complete&&!keys.has(`${e.category}|${e.id}`)));return{discoveries:added.filter(e=>e.category!=='achievements'),achievements:added.filter(e=>e.category==='achievements'),suggestions:next.missing.filter(e=>e.unlocked&&e.category!=='achievements'&&e.category!=='interactions').sort((a,b)=>a.fromWeek-b.fromWeek||a.id.localeCompare(b.id)).slice(0,3)};}
export {s2AchievementProgress};
