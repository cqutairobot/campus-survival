import { create } from 'zustand';
import { settleRun, validateSave } from '../save/storage';
import { canBuyTalent, talentCost, talentRefund } from '../progression/rules';
import { CHARACTERS } from '../data/catalog';
import {normalizeSettings} from '../save/settings';
import type {RecoverySource} from '../save/recovery';
import type { HUD, RunResult, SaveData, Settings, PersistenceState, SaveOperation } from '../types';
import {SaveCoordinator,browserSaveLocks} from '../save/coordinator';
import {IS_FIXTURE} from '../debug/isolation';
import {ProfileRepository} from '../save/v5/repository';
import {settleS1Profile,settleS2Profile,toLegacyS1Save,validateProfile} from '../save/v5/profile';
import type {SaveProfile,SemesterId,SemesterResult} from '../semesters/profile';
import type {Discovery,InheritanceChoice} from '../semesters/types';
import {discoverProfile,legacyDiscovery} from '../save/v5/discovery';
import {hasAlumniEligibility,validInheritanceChoice} from '../semesters/inheritance';
import type {RepositoryPort} from '../save/coordinator';
import type {SemesterFilter} from '../semesters/collection';
let storage:Storage|null=null;try{if(!IS_FIXTURE)storage=globalThis.localStorage??null;}catch{/* Private browsing can block storage. */}
export const repository=new ProfileRepository(storage);
export const INITIAL_HUD:HUD={phase:'menu',hp:110,maxHp:110,shield:0,xp:0,xpNext:6,level:1,kills:0,week:1,semesterTime:0,combatTime:0,bossTime:0,bosses:0,weapons:[],passives:[],cards:[],chest:null,boss:null,zone:'',event:'',fps:60,p95:16.7,entities:0,projectiles:0,drops:0,quality:'high',notice:'',result:null,combo:0,peakCombo:0,comboTier:0,frenzy:{charge:0,remaining:0,cooldown:0},ultimate:{id:'submission',name:'全校交稿',energy:60,cooldown:0,remaining:0,ready:false},reward:null,relics:[],interaction:null,manifest:null,score:0,eligible:true,directions:[]};
type WalletSave=SaveData|SaveProfile;
const legacy=(save:WalletSave)=>save.schemaVersion===4?toLegacyS1Save(save):save;
interface StoreModel<S extends WalletSave>{validate:(v:unknown,raw?:string)=>S|null;settle:(save:S,result:RunResult)=>S}
const legacyModel:StoreModel<SaveData>={validate:validateSave,settle:settleRun};
export interface AppState<S extends WalletSave=SaveProfile> {
 collectionRequest:{semester:SemesterFilter;onlyIncomplete:boolean}|null;requestCollectionGaps:(semester:SemesterFilter)=>void;
  save:S;hud:HUD;saveStatus:string;persistence:PersistenceState;recoverySources:RecoverySource[];savedRuns:string[];canPersist:boolean; publish:(hud:HUD)=>void;
  settings:(patch:Partial<Settings>)=>Promise<SaveOperation>;selectCharacter:(id:string)=>void;unlock:(id:string)=>boolean;
  selectSemester:(id:SemesterId)=>void;selectInheritance:(choice:InheritanceChoice)=>void;
  settleS2:(result:SemesterResult)=>SaveProfile;
  buyTalent:(id:string)=>void;resetTalents:()=>void;discover:(id:string|Discovery,evolution?:boolean)=>void;
  beginDaily:(id:string)=>void;settle:(result:RunResult)=>void;importSave:(raw:string)=>Promise<SaveOperation>;resetSave:()=>Promise<SaveOperation>;recoverSave:(kind:'fields'|'reset',index?:number)=>Promise<SaveOperation>;refreshSave:()=>Promise<SaveOperation>;takeoverSave:()=>Promise<SaveOperation>;whenIdle:()=>Promise<SaveOperation>;
}
export function createAppStore<S extends WalletSave=SaveData>(repository:RepositoryPort<S>,coordinator:SaveCoordinator<S>,model:StoreModel<S>=legacyModel as unknown as StoreModel<S>){
 let memoryRevision=0,lineage=0,pendingCount=0,pending:Promise<SaveOperation>=Promise.resolve({kind:'memory',message:'尚未保存'});
 const info=()=>({saveStatus:coordinator.status,persistence:coordinator.state,recoverySources:[...repository.sources],canPersist:coordinator.role==='writer'});
 const store=create<AppState<S>>((set,get)=>{
  const persist=(save:S):Promise<SaveOperation>=>{
   const ticket=++memoryRevision,generation=lineage;pendingCount++;set({save,...info(),saveStatus:coordinator.role==='writer'?'正在保存至此设备…':coordinator.status});
   return pending=coordinator.commit(save).then(result=>{
    if(generation!==lineage)return result;pendingCount--;
    set(state=>({...info(),saveStatus:pendingCount&&coordinator.role==='writer'?'正在保存至此设备…':coordinator.status,...(result.save?{savedRuns:[...result.save.settledRuns],save:ticket===memoryRevision?result.save:{...state.save,persistence:result.save.persistence}}:{})}));return result;
   });
  };
  const loaded=repository.load(false);
  const recover=async(kind:'fields'|'reset',index=0):Promise<SaveOperation>=>{
   if(!['menu','result'].includes(get().hud.phase))return {kind:'failed',message:'请先返回校园，再恢复或重置；可先导出本页进度。'};
   const ticket=++memoryRevision,generation=lineage,result=await coordinator.recover(kind,index);
   if(generation===lineage&&ticket===memoryRevision)set({...info(),...(result.save?{save:result.save,savedRuns:[...result.save.settledRuns]}:{})});return result;
  };
  const reload=async(takeover:boolean):Promise<SaveOperation>=>{
   if(!['menu','result'].includes(get().hud.phase))return {kind:'failed',message:'请先导出本页进度并返回校园，再刷新 / 接管；本局不会跨接管结算。'};
   const generation=++lineage;memoryRevision++;pendingCount=0;
   const save=await (takeover?coordinator.takeover():coordinator.refresh());
   if(generation===lineage)set({save,...info(),savedRuns:[...save.settledRuns]});
   return {kind:coordinator.role==='writer'&&coordinator.state==='ready'?'saved':coordinator.state==='failed'?'failed':'memory',message:coordinator.status};
  };
  return{
    collectionRequest:null,requestCollectionGaps:semester=>set({collectionRequest:{semester,onlyIncomplete:true}}),
    save:loaded,hud:{...INITIAL_HUD},...info(),savedRuns:[...loaded.settledRuns],publish:hud=>set({hud}),
    settings:patch=>persist({...get().save,settings:normalizeSettings({...get().save.settings,...patch})}),
    selectCharacter:id=>{if(get().save.unlocked.includes(id))persist({...get().save,selected:id});},
    selectSemester:id=>{const s=get().save;if(s.schemaVersion===4&&['menu','result'].includes(get().hud.phase)&&(id==='s1'||id==='s2'&&hasAlumniEligibility(s)))persist({...s,selectedSemester:id});},
    selectInheritance:choice=>{const s=get().save;if(s.schemaVersion===4&&['menu','result'].includes(get().hud.phase)&&hasAlumniEligibility(s)&&validInheritanceChoice(s,choice))persist({...s,inheritance:{...s.inheritance,choice:structuredClone(choice)}});},
    unlock:id=>{const s=get().save,c=CHARACTERS.find(c=>c.id===id);if(!c||c.achievement||s.credits<c.cost||s.unlocked.includes(id))return false;persist({...s,credits:s.credits-c.cost,unlocked:[...s.unlocked,id],selected:id});return true;},
    buyTalent:id=>{const s=get().save;if(canBuyTalent(legacy(s),id))persist({...s,credits:s.credits-talentCost(s.talents[id]??0),talents:{...s.talents,[id]:(s.talents[id]??0)+1}});},
    resetTalents:()=>{const s=get().save;persist({...s,credits:s.credits+talentRefund(s.talents),talents:{}});},
    discover:(id,evolution=false)=>{const s=get().save;if(s.schemaVersion===4){const next=discoverProfile(s,typeof id==='string'?legacyDiscovery(id,evolution):id);if(next!==s)persist({...s,...next});return;}if(typeof id!=='string')return;const at=id.indexOf(':'),prefix=at<0?'':id.slice(0,at),content=at<0?'':id.slice(at+1);const categories={enemy:'discoveredEnemies',fusion:'fusions',relic:'relics',event:'events',region:'regions'} as const;const category=categories[prefix as keyof typeof categories];if(category){if(!s[category].includes(content))persist({...s,[category]:[...s[category],content]});return;}const key=evolution?'evolutions':'discovered';if(!s[key].includes(id))persist({...s,[key]:[...s[key],id]});},
    beginDaily:id=>{const s=get().save;persist({...s,daily:{...s.daily,attempts:{...s.daily.attempts,[id]:(s.daily.attempts[id]??0)+1}}});},
    settle:result=>persist(model.settle(get().save,result)),
    settleS2:result=>{const save=get().save;if(save.schemaVersion!==4)throw Error('第二学期需要 v5 存档');const next=settleS2Profile(save,result);if(next!==save)void persist(next as S);return next;},
    importSave:async raw=>{try{const s=model.validate(JSON.parse(raw),raw);if(!s)return {kind:'invalid',message:'不是有效的校园生存存档'};delete s.persistence;repository.stageImport?.(raw);return persist(s);}catch{return {kind:'invalid',message:'JSON 无法解析'};}},
    resetSave:()=>recover('reset'),recoverSave:recover,refreshSave:()=>reload(false),takeoverSave:()=>reload(true),whenIdle:()=>pending,
  };
 });
 coordinator.subscribe(()=>store.setState(info()));
 void coordinator.initialize().then(save=>{store.setState({save,...info(),savedRuns:[...save.settledRuns]});});
 return store;
}
export const coordinator=new SaveCoordinator(repository,storage,browserSaveLocks());
export const useApp=createAppStore(repository,coordinator,{validate:validateProfile,settle:settleS1Profile});
if(typeof window!=='undefined')coordinator.watch(window);
