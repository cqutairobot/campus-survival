import { create } from 'zustand';
import { SaveRepository, settleRun, validateSave } from '../save/storage';
import { canBuyTalent, talentCost, talentRefund } from '../progression/rules';
import { CHARACTERS } from '../data/catalog';
import {normalizeSettings} from '../save/settings';
import type {RecoverySource} from '../save/recovery';
import type { HUD, RunResult, SaveData, Settings, PersistenceState, SaveOperation } from '../types';
import {SaveCoordinator,browserSaveLocks} from '../save/coordinator';
import {IS_FIXTURE} from '../debug/isolation';
let storage:Storage|null=null;try{if(!IS_FIXTURE)storage=globalThis.localStorage??null;}catch{/* Private browsing can block storage. */}
export const repository=new SaveRepository(storage);
export const INITIAL_HUD:HUD={phase:'menu',hp:110,maxHp:110,shield:0,xp:0,xpNext:6,level:1,kills:0,week:1,semesterTime:0,combatTime:0,bossTime:0,bosses:0,weapons:[],passives:[],cards:[],chest:null,boss:null,zone:'',event:'',fps:60,p95:16.7,entities:0,projectiles:0,drops:0,quality:'high',notice:'',result:null,combo:0,peakCombo:0,comboTier:0,frenzy:{charge:0,remaining:0,cooldown:0},ultimate:{id:'submission',name:'全校交稿',energy:60,cooldown:0,remaining:0,ready:false},reward:null,relics:[],interaction:null,manifest:null,score:0,eligible:true,directions:[]};
export interface AppState {
  save:SaveData;hud:HUD;saveStatus:string;persistence:PersistenceState;recoverySources:RecoverySource[];savedRuns:string[];canPersist:boolean; publish:(hud:HUD)=>void;
  settings:(patch:Partial<Settings>)=>Promise<SaveOperation>;selectCharacter:(id:string)=>void;unlock:(id:string)=>boolean;
  buyTalent:(id:string)=>void;resetTalents:()=>void;discover:(id:string,evolution?:boolean)=>void;
  beginDaily:(id:string)=>void;settle:(result:RunResult)=>void;importSave:(raw:string)=>Promise<SaveOperation>;resetSave:()=>Promise<SaveOperation>;recoverSave:(kind:'fields'|'reset',index?:number)=>Promise<SaveOperation>;refreshSave:()=>Promise<SaveOperation>;takeoverSave:()=>Promise<SaveOperation>;whenIdle:()=>Promise<SaveOperation>;
}
export function createAppStore(repository:SaveRepository,coordinator:SaveCoordinator){
 let memoryRevision=0,lineage=0,pendingCount=0,pending:Promise<SaveOperation>=Promise.resolve({kind:'memory',message:'尚未保存'});
 const info=()=>({saveStatus:coordinator.status,persistence:coordinator.state,recoverySources:[...repository.sources],canPersist:coordinator.role==='writer'});
 const store=create<AppState>((set,get)=>{
  const persist=(save:SaveData):Promise<SaveOperation>=>{
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
   return {kind:coordinator.role==='writer'?'saved':'memory',message:coordinator.status};
  };
  return{
    save:loaded,hud:{...INITIAL_HUD},...info(),savedRuns:[...loaded.settledRuns],publish:hud=>set({hud}),
    settings:patch=>persist({...get().save,settings:normalizeSettings({...get().save.settings,...patch})}),
    selectCharacter:id=>{if(get().save.unlocked.includes(id))persist({...get().save,selected:id});},
    unlock:id=>{const s=get().save,c=CHARACTERS.find(c=>c.id===id);if(!c||c.achievement||s.credits<c.cost||s.unlocked.includes(id))return false;persist({...s,credits:s.credits-c.cost,unlocked:[...s.unlocked,id],selected:id});return true;},
    buyTalent:id=>{const s=get().save;if(canBuyTalent(s,id))persist({...s,credits:s.credits-talentCost(s.talents[id]??0),talents:{...s.talents,[id]:(s.talents[id]??0)+1}});},
    resetTalents:()=>{const s=get().save;persist({...s,credits:s.credits+talentRefund(s.talents),talents:{}});},
    discover:(id,evolution=false)=>{const s=get().save,[prefix,content]=id.split(':');const categories={enemy:'discoveredEnemies',fusion:'fusions',relic:'relics',event:'events',region:'regions'} as const;const category=categories[prefix as keyof typeof categories];if(category){if(!s[category].includes(content))persist({...s,[category]:[...s[category],content]});return;}const key=evolution?'evolutions':'discovered';if(!s[key].includes(id))persist({...s,[key]:[...s[key],id]});},
    beginDaily:id=>{const s=get().save;persist({...s,daily:{...s.daily,attempts:{...s.daily.attempts,[id]:(s.daily.attempts[id]??0)+1}}});},
    settle:result=>persist(settleRun(get().save,result)),
    importSave:async raw=>{try{const s=validateSave(JSON.parse(raw));if(!s)return {kind:'invalid',message:'不是有效的校园生存存档'};delete s.persistence;return persist(s);}catch{return {kind:'invalid',message:'JSON 无法解析'};}},
    resetSave:()=>recover('reset'),recoverSave:recover,refreshSave:()=>reload(false),takeoverSave:()=>reload(true),whenIdle:()=>pending,
  };
 });
 coordinator.subscribe(()=>store.setState(info()));
 void coordinator.initialize().then(save=>{store.setState({save,...info(),savedRuns:[...save.settledRuns]});});
 return store;
}
export const coordinator=new SaveCoordinator(repository,storage,browserSaveLocks());
export const useApp=createAppStore(repository,coordinator);
if(typeof window!=='undefined')coordinator.watch(window);
