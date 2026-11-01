import {Assets,Texture} from 'pixi.js';
import {artManifest,resourceManifest,artDefinition,artUrl,pixiManifest,type ArtId,type ResourceId,type ResourceBundle,type Bundle} from './manifest';
import {ResourceAvailability,artAvailability} from './availability';

export interface LoadProgress {completed:number;total:number;failed:number;label:string}
export interface ResourceLease<Id extends ResourceId=ArtId> {textures:Map<Id,Texture>;release:()=>void}
interface Entry {promise:Promise<Texture|null>;refs:number;abort:AbortController;settled:boolean;source?:string;texture?:Texture;disposeRequested?:boolean}
const bundleLabel=(bundle:Bundle)=>bundle==='battle-core'?'整理学术装备':bundle==='battle-content'?'准备校园地图':bundle.startsWith('boss-')?'准备本周考核':'准备校园画册';
/** Shared ownership; cancellation never destroys a texture used by another UI. */
interface ResourceBackend {init:()=>Promise<unknown>;load:(source:string,signal?:AbortSignal)=>Promise<unknown>;unload:(source:string)=>Promise<unknown>}
const cancelled=()=>new DOMException('Resource loading cancelled','AbortError');
/** End our wait even when a browser decoder/backend cannot stop its promise. */
function bounded<T>(promise:Promise<T>,signal?:AbortSignal,milliseconds?:number):Promise<T>{
 return new Promise((resolve,reject)=>{
  let timer:ReturnType<typeof setTimeout>|undefined;
  const clean=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
  const abort=()=>{clean();reject(cancelled());};
  promise.then(value=>{clean();resolve(value);},error=>{clean();reject(error);});
  if(signal?.aborted){reject(cancelled());return;}
  signal?.addEventListener('abort',abort,{once:true});
  if(milliseconds!==undefined)timer=setTimeout(()=>{clean();reject(Error('Resource load timed out'));},milliseconds);
 });
}
export class ResourceLoader {
  private entries=new Map<ResourceId,Entry>();
  private unloading=new Map<string,Promise<void>>();
  private initialized:Promise<unknown>|undefined;
  private active=0;
  private waiting:{start:()=>void}[]=[];
  get failures(){return this.availability.failures;}
  constructor(private backend:ResourceBackend={init:()=>Assets.init({manifest:pixiManifest}),load:source=>Assets.load(source),unload:source=>Assets.unload(source)},private timeoutMs=8000,private availability=new ResourceAvailability()){}
  forceMissing(id:ResourceId,missing:boolean){this.availability.forceMissing(id,missing);}
  isMissing(id:ResourceId){return this.availability.isMissing(id);}
  bundle(bundle:Bundle,signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void){
    const ids=(Object.keys(artManifest) as ArtId[]).filter(id=>artManifest[id].bundle===bundle);
    return this.loadIds(ids,signal,onProgress,bundleLabel(bundle));
  }
  extensionBundle(bundle:ResourceBundle,signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void){const ids=(Object.keys(resourceManifest) as ResourceId[]).filter(id=>resourceManifest[id].bundle===bundle);return this.loadIds(ids,signal,onProgress,'准备第二学期素材');}
  async loadIds<Id extends ResourceId>(requested:readonly Id[],signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void,label='准备校园画册'):Promise<ResourceLease<Id>>{
    const ids=[...new Set(requested)],textures=new Map<Id,Texture>();
    const acquired:[ResourceId,Entry][]=[];let completed=0,failed=0,released=false;
    const release=()=>{
      if(released)return;released=true;signal?.removeEventListener('abort',abort);
      for(const [id,entry] of acquired){entry.refs--;if(!entry.refs&&(!entry.settled||entry.disposeRequested))void this.sweep(id,entry);}
    };
    const abort=()=>{release();textures.clear();};
    signal?.addEventListener('abort',abort,{once:true});
    const report=()=>onProgress?.({completed,total:ids.length,failed,label});
    try{
     this.initialized??=bounded(Promise.resolve().then(()=>this.backend.init()),undefined,this.timeoutMs).catch(()=>{});
     await bounded(this.initialized,signal);if(signal?.aborted)throw cancelled();report();
     // A fixed six-request cap is shared by all concurrent bundles; never FPS based.
     for(let start=0;start<ids.length&&!signal?.aborted;start+=6){
      await Promise.all(ids.slice(start,start+6).map(async id=>{
        if(signal?.aborted)return;
        let entry=this.entries.get(id);
        const fresh=!entry;
        if(!entry){entry={refs:0,promise:Promise.resolve(null),abort:new AbortController(),settled:false};this.entries.set(id,entry);}
        entry.refs++;acquired.push([id,entry]);
        if(fresh)entry.promise=this.load(id,entry);
        const texture=await bounded(entry.promise,signal);if(released||signal?.aborted)return;
        if(texture&&!this.availability.isMissing(id))textures.set(id,texture);else failed++;
        completed++;if(!signal?.aborted)report();
      }));
     }
    }catch(error){release();textures.clear();if(!signal?.aborted)throw error;}
    if(signal?.aborted)abort();return {textures,release};
  }
  private slot(signal:AbortSignal):Promise<()=>void>{
    return new Promise((resolve,reject)=>{
      const abort=()=>{this.waiting=this.waiting.filter(item=>item!==waiter);reject(cancelled());};
      const waiter={start:()=>{
        signal.removeEventListener('abort',abort);this.active++;
        resolve(()=>{this.active--;this.waiting.shift()?.start();});
      }};
      if(signal.aborted){reject(cancelled());return;}
      if(this.active<6)waiter.start();else{this.waiting.push(waiter);signal.addEventListener('abort',abort,{once:true});}
    });
  }
  private async load(id:ResourceId,entry:Entry):Promise<Texture|null>{
    let release:(()=>void)|undefined;
    const signal=entry.abort.signal;
    try{
      release=await this.slot(signal);
      const sources=[artUrl(id),...(artDefinition(id).pngFallback?[artUrl(id,'png')]:[])];
      for(const source of sources)for(let attempt=0;attempt<2;attempt++){
        if(signal.aborted)return null;
        entry.source=source;await bounded(this.unloading.get(source)??Promise.resolve(),signal);
        const request=new AbortController(),abort=()=>request.abort();signal.addEventListener('abort',abort,{once:true});
        let done=false,accepted=false,resolved=false;
        const pending=Promise.resolve().then(()=>{if(request.signal.aborted)throw cancelled();return this.backend.load(source,request.signal);});
        // A late result belongs to this generation only. Source ownership also
        // protects a new generation that Pixi may satisfy from the same cache.
        void pending.then(()=>{if(done&&!accepted)void this.unload(source);},()=>{});
        try{
          const texture=await bounded(pending,signal,this.timeoutMs);
          resolved=true;
          if(texture instanceof Texture&&texture.width>0&&texture.height>0&&!signal.aborted){accepted=true;entry.texture=texture;this.failures.delete(id);return texture;}
        }catch{/* Preserve both formats/retries and the procedural fallback. */}
        finally{done=true;signal.removeEventListener('abort',abort);if(!accepted){entry.source=undefined;request.abort();if(resolved)void this.unload(source);}}
      }
      if(!signal.aborted)this.failures.add(id);return null;
    }catch(error){if(!signal.aborted)throw error;return null;}
    finally{entry.settled=true;release?.();}
  }
  private unload(source:string):Promise<void>{
    if([...this.entries.values()].some(entry=>entry.source===source&&(entry.refs>0||entry.texture)))return Promise.resolve();
    let pending=this.unloading.get(source);if(pending)return pending;
    pending=(async()=>{try{await this.backend.unload(source);}catch{/* Cache cleanup must not reject an unawaited release. */}})().finally(()=>this.unloading.delete(source));
    this.unloading.set(source,pending);return pending;
  }
  private sweep(id:ResourceId,entry:Entry):Promise<void>{
    if(entry.refs||this.entries.get(id)!==entry)return Promise.resolve();
    this.entries.delete(id);entry.abort.abort();
    return entry.texture&&entry.source?this.unload(entry.source):Promise.resolve();
  }
  async dispose(){
    await Promise.all([...this.entries].map(([id,entry])=>{entry.disposeRequested=true;return this.sweep(id,entry);}));
    await Promise.all(this.unloading.values());
  }
  get debug(){return{entries:this.entries.size,references:[...this.entries.values()].reduce((sum,e)=>sum+e.refs,0),textures:[...this.entries.values()].filter(e=>e.texture).length,loading:this.active,waiting:this.waiting.length};}
}
export const resources=new ResourceLoader(undefined,8000,artAvailability);
/** Fonts have a finite wait; system fonts remain a valid fallback. */
export async function prepareFonts(){
  if(!document.fonts)return;
  await Promise.race([Promise.allSettled([document.fonts.load('600 18px "Campus Digits"'),document.fonts.load('400 16px "Campus Sans"','校园图书馆基础教学楼实验中心食堂')]),new Promise(resolve=>setTimeout(resolve,1800))]);
}
