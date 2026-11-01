import {Assets,Texture} from 'pixi.js';
import {artManifest,resourceManifest,artDefinition,artUrl,pixiManifest,type ArtId,type ResourceId,type ResourceBundle,type Bundle} from './manifest';

export interface LoadProgress {completed:number;total:number;failed:number;label:string}
export interface ResourceLease<Id extends ResourceId=ArtId> {textures:Map<Id,Texture>;release:()=>void}
interface Entry {promise:Promise<Texture|null>;refs:number;unloading?:Promise<void>;disposeRequested?:boolean}
const bundleLabel=(bundle:Bundle)=>bundle==='battle-core'?'整理学术装备':bundle==='battle-content'?'准备校园地图':bundle.startsWith('boss-')?'准备本周考核':'准备校园画册';
/** Shared ownership; cancellation never destroys a texture used by another UI. */
interface ResourceBackend {init:()=>Promise<unknown>;load:(source:string)=>Promise<unknown>;unload:(source:string)=>Promise<unknown>}
export class ResourceLoader {
  private entries=new Map<ResourceId,Entry>();
  private forced=new Set<ResourceId>();
  private loadedSources=new Map<ResourceId,string>();
  private initialized:Promise<unknown>|undefined;
  private active=0;
  private waiting:(()=>void)[]=[];
  readonly failures=new Set<ResourceId>();
  constructor(private backend:ResourceBackend={init:()=>Assets.init({manifest:pixiManifest}),load:source=>Assets.load(source),unload:source=>Assets.unload(source)}){}
  forceMissing(id:ResourceId,missing:boolean){if(missing)this.forced.add(id);else this.forced.delete(id);}
  isMissing(id:ResourceId){return this.forced.has(id)||this.failures.has(id);}
  bundle(bundle:Bundle,signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void){
    const ids=(Object.keys(artManifest) as ArtId[]).filter(id=>artManifest[id].bundle===bundle);
    return this.loadIds(ids,signal,onProgress,bundleLabel(bundle));
  }
  extensionBundle(bundle:ResourceBundle,signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void){const ids=(Object.keys(resourceManifest) as ResourceId[]).filter(id=>resourceManifest[id].bundle===bundle);return this.loadIds(ids,signal,onProgress,'准备第二学期素材');}
  async loadIds<Id extends ResourceId>(requested:readonly Id[],signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void,label='准备校园画册'):Promise<ResourceLease<Id>>{
    this.initialized??=this.backend.init().catch(()=>{});await this.initialized;
    const ids=[...new Set(requested)],textures=new Map<Id,Texture>();
    const acquired:[ResourceId,Entry][]=[];let completed=0,failed=0;
    const report=()=>onProgress?.({completed,total:ids.length,failed,label});
    if(!signal?.aborted)report();
    // A fixed six-request cap is shared by all concurrent bundles; never FPS based.
    for(let start=0;start<ids.length&&!signal?.aborted;start+=6){
      await Promise.all(ids.slice(start,start+6).map(async id=>{
        if(signal?.aborted)return;
        let entry=this.entries.get(id);
        while(entry?.unloading){await entry.unloading;entry=this.entries.get(id);}
        if(signal?.aborted)return;
        if(!entry){entry={refs:0,promise:this.load(id)};this.entries.set(id,entry);}
        entry.refs++;acquired.push([id,entry]);
        const texture=await entry.promise;
        if(texture&&!this.forced.has(id))textures.set(id,texture);else failed++;
        completed++;if(!signal?.aborted)report();
      }));
    }
    let released=false;
    const release=()=>{if(released)return;released=true;for(const [id,entry] of acquired){entry.refs=Math.max(0,entry.refs-1);if(!entry.refs&&entry.disposeRequested)void this.sweep(id,entry);}};
    if(signal?.aborted){release();textures.clear();}
    return {textures,release};
  }
  private async load(id:ResourceId):Promise<Texture|null>{
    if(this.active>=6)await new Promise<void>(resolve=>this.waiting.push(resolve));
    else this.active++;
    try{
      const sources=[artUrl(id),...(artDefinition(id).pngFallback?[artUrl(id,'png')]:[])];
      for(const source of sources){
        for(let attempt=0;attempt<2;attempt++)try{
          const texture=await this.backend.load(source);
          if(texture instanceof Texture&&texture.width>0&&texture.height>0){this.failures.delete(id);this.loadedSources.set(id,source);return texture;}
        }catch{/* A failed decorative image must not block the bundle or gameplay. */}
      }
      this.failures.add(id);return null;
    }finally{
      const next=this.waiting.shift();if(next)next();else this.active--;
    }
  }
  private sweep(id:ResourceId,entry:Entry):Promise<void>{
    if(entry.refs||this.entries.get(id)!==entry)return Promise.resolve();
    return entry.unloading??=(async()=>{
      try{
        await entry.promise;if(entry.refs||this.entries.get(id)!==entry)return;
        const source=this.loadedSources.get(id);
        if(source)try{await this.backend.unload(source);}catch{/* Failed cache cleanup must not reject an unawaited release. */}
        if(this.entries.get(id)===entry){this.entries.delete(id);this.loadedSources.delete(id);}
      }finally{entry.unloading=undefined;}
    })();
  }
  async dispose(){
    await Promise.all([...this.entries].map(([id,entry])=>{entry.disposeRequested=true;return this.sweep(id,entry);}));
  }
  get debug(){return{entries:this.entries.size,references:[...this.entries.values()].reduce((sum,e)=>sum+e.refs,0),textures:this.loadedSources.size,loading:this.active,waiting:this.waiting.length};}
}
export const resources=new ResourceLoader();
/** Fonts have a finite wait; system fonts remain a valid fallback. */
export async function prepareFonts(){
  if(!document.fonts)return;
  await Promise.race([Promise.allSettled([document.fonts.load('600 18px "Campus Digits"'),document.fonts.load('400 16px "Campus Sans"','校园图书馆基础教学楼实验中心食堂')]),new Promise(resolve=>setTimeout(resolve,1800))]);
}
