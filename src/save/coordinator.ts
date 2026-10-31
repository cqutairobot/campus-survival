import type {PersistenceMetadata,PersistenceState,SaveData,SaveOperation} from '../types';
import {SAVE_KEY,validPersistence,type StorageLike} from './storage';
import type {RecoverySource} from './recovery';

export interface SaveEnvelope {persistence?:PersistenceMetadata}
export interface RepositoryPort<S extends SaveEnvelope> {
 state:PersistenceState;status:string;sources:RecoverySource[];
 load(writeBack?:boolean):S;writeLoaded(save:S):boolean;write(save:S):boolean;
 commitRecovery(kind:'fields'|'reset',index?:number,persistence?:PersistenceMetadata):S|null;
 stageImport?(raw:string):void;
}

export interface SaveLocks {
 exclusive<T>(name:string,task:()=>T|Promise<T>):Promise<T>;
 holdOwner(ownerId:string):Promise<()=>void>;
 ownerAlive(ownerId:string):Promise<boolean>;
}
const ownerKey=(owner:string)=>`${SAVE_KEY}.owner.${owner}`;
export class WebSaveLocks implements SaveLocks {
 constructor(private locks:LockManager){}
 exclusive<T>(name:string,task:()=>T|Promise<T>){return this.locks.request(name,{mode:'exclusive'},task);}
 holdOwner(owner:string):Promise<()=>void>{
  return new Promise((acquired,reject)=>{void this.locks.request(ownerKey(owner),{mode:'exclusive'},()=>new Promise<void>(release=>{acquired(release);})).catch(reject);});
 }
 ownerAlive(owner:string){return this.locks.request(ownerKey(owner),{mode:'exclusive',ifAvailable:true},lock=>lock===null);}
}
export function browserSaveLocks():SaveLocks|null{
 try{return typeof navigator!=='undefined'&&navigator.locks?new WebSaveLocks(navigator.locks):null;}catch{return null;}
}
function metadata(raw:string|null):PersistenceMetadata|undefined{
 try{const value=JSON.parse(raw??'null')?.persistence;return validPersistence(value)?value:undefined;}catch{return undefined;}
}
export interface CommitReceipt<S=SaveData> extends SaveOperation {save?:S}
/** All mutations (including startup and recovery) use the same short exclusive lock. */
export class SaveCoordinator<S extends SaveEnvelope=SaveData> {
 readonly ownerId=globalThis.crypto?.randomUUID?.()??`page-${Date.now()}-${Math.random().toString(36).slice(2)}`;
 role:'starting'|'writer'|'observer'|'conflict'|'unsupported'='starting';
 private expectedRaw:string|null=null;private diskMetadata:PersistenceMetadata|undefined;
 private releaseOwner:(()=>void)|undefined;private ownerPromise:Promise<void>|undefined;
 private generation=0;private queue:Promise<unknown>=Promise.resolve();private initial:Promise<S>|undefined;
 private listeners=new Set<()=>void>();private message='正在确认本地存档写入权…';
 constructor(readonly repository:RepositoryPort<S>,private storage:StorageLike|null,private locks:SaveLocks|null){}
 get state():PersistenceState{
  if(this.role==='starting')return 'starting';
  if(['corrupt','future','unavailable'].includes(this.repository.state))return this.repository.state;
  return this.role==='writer'?this.repository.state:this.role;
 }
 get status(){return this.role==='writer'?this.repository.status:`${this.message}${['corrupt','future'].includes(this.repository.state)?` · ${this.repository.status}`:''}`;}
 subscribe(listener:()=>void){this.listeners.add(listener);return()=>{this.listeners.delete(listener);};}
 private emit(){for(const listener of this.listeners)listener();}
 private revoke(message='设备存档已在其他页面变化 · 本页停止保存，请刷新 / 接管'){
  this.generation++;this.role='conflict';this.message=message;this.emit();
 }
 initialize(){return this.initial??=this.open(false);}
 private async lifetime(){
  if(!this.ownerPromise)this.ownerPromise=this.locks!.holdOwner(this.ownerId).then(release=>{this.releaseOwner=release;});
  await this.ownerPromise;
 }
 private nextMetadata(claim=false):PersistenceMetadata{
  const revision=(this.diskMetadata?.revision??0)+1,epoch=(this.diskMetadata?.epoch??0)+Number(claim);
  if(!Number.isSafeInteger(revision)||!Number.isSafeInteger(epoch))throw Error('存档修订号已达上限');
  return {revision,epoch,ownerId:this.ownerId};
 }
 private async open(takeover:boolean):Promise<S>{
  this.generation++;this.role='starting';this.message='正在确认本地存档写入权…';this.emit();
  if(!this.locks||!this.storage){const save=this.repository.load(false);this.role='unsupported';this.message=this.storage?'内存模式 · 此浏览器无法协调多页面保存，仍可加载和导出':'内存模式 · 存储不可用，仍可加载和导出';this.emit();return save;}
  try{
   await this.lifetime();
   return await this.locks.exclusive(`${SAVE_KEY}.commit`,async()=>{
    const save=this.repository.load(false),raw=this.storage!.getItem(SAVE_KEY);
    this.expectedRaw=raw;this.diskMetadata=metadata(raw)??save.persistence;
    const owner=this.diskMetadata?.ownerId;
    if(!takeover&&owner&&owner!==this.ownerId&&await this.locks!.ownerAlive(owner)){
     this.role='observer';this.message='另一个页面正在保存，本页进度暂存在内存';this.emit();return save;
    }
    if(this.storage!.getItem(SAVE_KEY)!==raw){this.revoke();return save;}
    this.role='writer';
    // Protected originals never receive startup metadata; the explicit recovery
    // transaction will claim them only after archiving and a locked raw recheck.
    if(!['corrupt','future','unavailable'].includes(this.repository.state)){
     const claimed={...save,persistence:this.nextMetadata(true)};
     if(this.repository.writeLoaded(claimed)){this.expectedRaw=this.storage!.getItem(SAVE_KEY);this.diskMetadata=claimed.persistence;this.emit();return claimed;}
    }
    this.emit();return save;
   });
  }catch(e){this.role='unsupported';this.message=`内存模式 · 无法取得写入锁：${e instanceof Error?e.message:'协调失败'}，可导出本页进度`;this.emit();return this.repository.load(false);}
 }
 refresh(){return this.open(false);}
 takeover(){return this.open(true);}
 verify(){
  if(this.role!=='writer')return;
  try{if(this.storage!.getItem(SAVE_KEY)!==this.expectedRaw)this.revoke();}catch{this.revoke('读取存储失败 · 本页停止保存，可导出进度');}
 }
 watch(target:Window){
  const storage=(event:StorageEvent)=>{if(event.key===SAVE_KEY||event.key===null)this.verify();},check=()=>this.verify(),visible=()=>{if(!target.document.hidden)this.verify();};
  target.addEventListener('storage',storage);target.addEventListener('pageshow',check);target.document.addEventListener('visibilitychange',visible);
  return()=>{target.removeEventListener('storage',storage);target.removeEventListener('pageshow',check);target.document.removeEventListener('visibilitychange',visible);};
 }
 commit(save:S){return this.enqueue(()=>{
  const next={...save,persistence:this.nextMetadata()};return this.repository.write(next)?next:null;
 });}
 recover(kind:'fields'|'reset',index=0){return this.enqueue(()=>this.repository.commitRecovery(kind,index,this.nextMetadata(true)));}
 private enqueue(action:()=>S|null):Promise<CommitReceipt<S>>{
  const generation=this.generation;
  const run=async():Promise<CommitReceipt<S>>=>{
   await this.initialize();
   if(generation!==this.generation||this.role!=='writer'||!this.locks)return {kind:'memory',message:this.status};
   try{return await this.locks.exclusive(`${SAVE_KEY}.commit`,()=>{
    if(generation!==this.generation||this.role!=='writer')return {kind:'memory',message:this.status};
    if(this.storage!.getItem(SAVE_KEY)!==this.expectedRaw){this.revoke();return {kind:'memory',message:this.status};}
    const save=action();
    if(!save){this.emit();return {kind:['corrupt','future','unavailable'].includes(this.repository.state)?'memory':'failed',message:this.repository.status} as CommitReceipt<S>;}
    this.expectedRaw=this.storage!.getItem(SAVE_KEY);this.diskMetadata=save.persistence;this.emit();return {kind:'saved',message:this.repository.status,save};
   });}catch(e){this.revoke(`保存失败 · ${e instanceof Error?e.message:'协调失败'}，可导出进度`);return {kind:'failed',message:this.status};}
  };
  const result=this.queue.then(run,run);this.queue=result;return result;
 }
 dispose(){this.generation++;this.role='unsupported';this.releaseOwner?.();this.releaseOwner=undefined;this.listeners.clear();}
}
