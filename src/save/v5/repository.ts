import {SAVE_KEY,BACKUP_KEY,LEGACY_KEYS,RECOVERY_PREFIX,validPersistence,type StorageLike} from '../storage';
import {recoveryDigest,recoveryPreview,type RecoverySource} from '../recovery';
import type {PersistenceMetadata,PersistenceState} from '../../types';
import type {SaveProfile} from '../../semesters/profile';
import {freshProfile,object,validateProfile} from './profile';

export const PRE_V5_PREFIX='campus-survival.recovery.pre-v5.';
const keys=[SAVE_KEY,BACKUP_KEY,...LEGACY_KEYS];
function parsed(raw:string|null):unknown{try{return JSON.parse(raw??'null');}catch{return null;}}
const future=(raw:string|null)=>{const v=parsed(raw);return object(v)&&Number(v.schemaVersion)>4;};
export function profileRecoveryPreview(raw:string):{save:SaveProfile;changes:string[]}|null{
 const v=parsed(raw);if(!object(v)||![1,2,3,4].includes(Number(v.schemaVersion)))return null;
 if(v.schemaVersion!==4){const old=recoveryPreview(raw);return old?{save:validateProfile(old.save,raw)!,changes:old.changes}:null;}
 const candidate:Record<string,unknown>={...v,credits:typeof v.credits==='number'&&Number.isFinite(v.credits)&&v.credits>=0?v.credits:0};
 if(Object.hasOwn(candidate,'persistence')&&!validPersistence(candidate.persistence))delete candidate.persistence;
 const save=validateProfile(candidate,raw);if(!save)return null;
 const changes:string[]=[];
 for(const [k,value] of Object.entries(save))changes.push(`${k}：${JSON.stringify(v[k])===JSON.stringify(value)?'保留':'归一化 / 补默认'} ${JSON.stringify(value)}`);
 return {save,changes};
}
/** Same physical keys and coordinator locks as v4. Only a locked coordinator writes. */
export class ProfileRepository {
 state:PersistenceState='new';status='尚无存档';sources:RecoverySource[]=[];
 private observed=new Map<string,string|null>();private importRaws:string[]=[];
 constructor(private storage:StorageLike|null){}
 private mark(state:PersistenceState,status:string){this.state=state;this.status=status;}
 load(writeBack=false):SaveProfile{
  this.sources=[];this.observed.clear();this.importRaws=[];this.mark('new','尚无存档 · 首次保存后保存在此设备');
  if(!this.storage){this.mark('unavailable','内存模式 · 存储不可用，可导出本页进度');return freshProfile();}
  let selected:SaveProfile|undefined,sourceKey:string|undefined,hasFuture=false;
  try{
   // Scan the backup too: a future schema anywhere must not be downgraded.
   for(const key of keys){
    const raw=this.storage.getItem(key);this.observed.set(key,raw);if(raw===null)continue;
    if(future(raw))hasFuture=true;
    const save=validateProfile(parsed(raw),raw);
    if(save&&!selected){selected=save;sourceKey=key;}
    if(!save)this.sources.push({key,raw,reason:future(raw)?'来自未来版本，不能覆盖':profileRecoveryPreview(raw)?'存档字段异常，可预览恢复':'JSON 损坏或无法识别的存档'});
   }
  }catch{this.mark('unavailable','内存模式 · 存储读取失败，可导出本页进度');return freshProfile();}
  if(hasFuture)this.mark('future','未来版本原文已保留 · 内存模式');
  else if(selected)this.mark(sourceKey===SAVE_KEY?'ready':'fallback',sourceKey===SAVE_KEY?'本地存档已就绪':'已载入有效备份 / 旧档，待安全保存');
  else if(this.sources.length)this.mark('corrupt','内存模式 · 原档待恢复');
  const save=selected??freshProfile();if(writeBack&&selected&&!hasFuture)this.writeLoaded(save);return save;
 }
 stageImport(raw:string){this.importRaws.push(raw);}
 /** Independent immutable archive; collisions get a checked slot, never overwrite. */
 private archive(raw:string,prefix:string){
  const base=prefix+recoveryDigest(raw);
  for(let slot=0;;slot++){
   const key=base+(slot?`.${slot}`:''),existing=this.storage!.getItem(key);
   if(existing===raw)return;
   if(existing!==null)continue;
   this.storage!.setItem(key,raw);if(this.storage!.getItem(key)!==raw)throw Error('原文回读核对失败');return;
  }
 }
 private originals(){
  for(const [key,raw] of this.observed){
   if(raw===null)continue;
   if(this.storage!.getItem(key)!==raw)throw Error('原文已在其他页面变化，请刷新');
   const value=parsed(raw);if(object(value)&&[1,2,3].includes(Number(value.schemaVersion)))this.archive(raw,PRE_V5_PREFIX);
   else if(!validateProfile(value))this.archive(raw,RECOVERY_PREFIX);
  }
  for(const raw of this.importRaws)this.archive(raw,PRE_V5_PREFIX);
 }
 private writable(){
  if(!this.storage||['corrupt','future','unavailable'].includes(this.state))return false;
  for(const key of keys)if(future(this.storage.getItem(key))){this.mark('future','未来版本原文已保留 · 内存模式');return false;}
  return true;
 }
 writeLoaded(save:SaveProfile){return this.write(save);}
 write(save:SaveProfile):boolean{
  try{
   if(!this.writable())return false;
   const valid=validateProfile(save);if(!valid)return false;
   const previous=this.storage!.getItem(SAVE_KEY),previousValue=parsed(previous);
   if(previous!==null&&!validateProfile(previousValue)&&!(this.sources.some(s=>s.key===SAVE_KEY&&s.raw===previous))){this.mark('corrupt','内存模式 · 原文已变化，待恢复');return false;}
   this.originals();
   // The first migration preserves the existing rotating backup. Later writes rotate schema 4 normally.
   if(object(previousValue)&&previousValue.schemaVersion===4&&validateProfile(previousValue)){this.storage!.setItem(BACKUP_KEY,previous!);if(this.storage!.getItem(BACKUP_KEY)!==previous)throw Error('轮转备份回读核对失败');}
   const serialized=JSON.stringify(valid);this.storage!.setItem(SAVE_KEY,serialized);if(this.storage!.getItem(SAVE_KEY)!==serialized)throw Error('主档回读核对失败');
   this.observed.clear();this.importRaws=[];this.mark('ready','已保存在此设备');return true;
  }catch(e){this.mark('failed',`内存模式 · 保存失败，原文已保留，可导出：${e instanceof Error?e.message:'写入失败'}`);return false;}
 }
 commitRecovery(kind:'fields'|'reset',sourceIndex=0,persistence?:PersistenceMetadata):SaveProfile|null{
  if(!this.storage||['future','unavailable'].includes(this.state))return null;
  const save=kind==='reset'?freshProfile():profileRecoveryPreview(this.sources[sourceIndex]?.raw??'')?.save;if(!save)return null;
  if(persistence)save.persistence={...persistence};
  try{
   for(const key of keys)if(future(this.storage.getItem(key)))throw Error('未来版本原文不能重置');
   for(const [key,raw] of this.observed)if(this.storage.getItem(key)!==raw)throw Error('原文已变化，请刷新');
   // Explicit resets also protect valid schema 4 originals, not just malformed ones.
   for(const key of keys){const raw=this.storage.getItem(key);if(raw!==null)this.archive(raw,RECOVERY_PREFIX);}
   this.originals();const serialized=JSON.stringify(save);this.storage.setItem(SAVE_KEY,serialized);if(this.storage.getItem(SAVE_KEY)!==serialized)throw Error('主档回读核对失败');
   if(kind==='reset')for(const key of [BACKUP_KEY,...LEGACY_KEYS])this.storage.removeItem(key);
   this.observed.clear();this.importRaws=[];this.mark('ready','已保护原文并保存恢复结果');return save;
  }catch(e){this.status=`恢复未完成 · ${e instanceof Error?e.message:'写入失败'} · 原文可导出`;return null;}
 }
}
