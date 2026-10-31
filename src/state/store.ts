import { create } from 'zustand';
import { SaveRepository, settleRun, validateSave } from '../save/storage';
import { canBuyTalent, talentCost, talentRefund } from '../progression/rules';
import { CHARACTERS } from '../data/catalog';
import {normalizeSettings} from '../save/settings';
import type {RecoverySource} from '../save/recovery';
import type { HUD, RunResult, SaveData, Settings, PersistenceState, SaveOperation } from '../types';
import {IS_FIXTURE} from '../debug/isolation';
let storage:Storage|null=null;try{if(!IS_FIXTURE)storage=globalThis.localStorage??null;}catch{/* Private browsing can block storage. */}
export const repository=new SaveRepository(storage);
export const INITIAL_HUD:HUD={phase:'menu',hp:110,maxHp:110,shield:0,xp:0,xpNext:6,level:1,kills:0,week:1,semesterTime:0,combatTime:0,bossTime:0,bosses:0,weapons:[],passives:[],cards:[],chest:null,boss:null,zone:'',event:'',fps:60,p95:16.7,entities:0,projectiles:0,drops:0,quality:'high',notice:'',result:null,combo:0,peakCombo:0,comboTier:0,frenzy:{charge:0,remaining:0,cooldown:0},ultimate:{id:'submission',name:'全校交稿',energy:60,cooldown:0,remaining:0,ready:false},reward:null,relics:[],interaction:null,manifest:null,score:0,eligible:true,directions:[]};
interface AppState {
  save:SaveData;hud:HUD;saveStatus:string;persistence:PersistenceState;recoverySources:RecoverySource[];savedRuns:string[]; publish:(hud:HUD)=>void;
  settings:(patch:Partial<Settings>)=>void;selectCharacter:(id:string)=>void;unlock:(id:string)=>boolean;
  buyTalent:(id:string)=>void;resetTalents:()=>void;discover:(id:string,evolution?:boolean)=>void;
  beginDaily:(id:string)=>void;settle:(result:RunResult)=>void;importSave:(raw:string)=>SaveOperation;resetSave:()=>SaveOperation;recoverSave:(kind:'fields'|'reset',index?:number)=>SaveOperation;
}
export const useApp=create<AppState>((set,get)=>{
  const info=()=>({saveStatus:repository.status,persistence:repository.state,recoverySources:[...repository.sources]});
  const persist=(save:SaveData):SaveOperation=>{const saved=repository.write(save);set({save,...info(),...(saved?{savedRuns:[...save.settledRuns]}:{})});return {kind:saved?'saved':repository.state==='failed'?'failed':'memory',message:saved?'已写入此设备':repository.status};};
  const loaded=repository.load();
  const recover=(kind:'fields'|'reset',index=0):SaveOperation=>{
    if(!['menu','result'].includes(get().hud.phase))return {kind:'failed',message:'请先返回校园，再恢复或重置；可先导出本页进度。'};
    const save=repository.commitRecovery(kind,index);set({...info(),...(save?{save,savedRuns:[...save.settledRuns]}:{})});return {kind:save?'saved':'failed',message:repository.status};
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
    importSave:raw=>{try{const s=validateSave(JSON.parse(raw));if(!s)return {kind:'invalid',message:'不是有效的校园生存存档'};return persist(s);}catch{return {kind:'invalid',message:'JSON 无法解析'};}},
    resetSave:()=>recover('reset'),recoverSave:recover,
  };
});
