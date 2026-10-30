import {Assets,Texture} from 'pixi.js';
import {artManifest,artUrl,pixiManifest,type ArtId,type Bundle} from './manifest';

export interface LoadProgress {completed:number;total:number;failed:number;label:string}
export interface ResourceLease {textures:Map<ArtId,Texture>;release:()=>void}
interface Entry {promise:Promise<Texture|null>;refs:number}
const bundleLabel=(bundle:Bundle)=>bundle==='battle-core'?'整理学术装备':bundle==='battle-content'?'准备校园地图':bundle.startsWith('boss-')?'准备本周考核':'准备校园画册';
/** Shared ownership; cancellation never destroys a texture used by another UI. */
class ResourceLoader {
  private entries=new Map<ArtId,Entry>();
  private forced=new Set<ArtId>();
  private loadedSources=new Map<ArtId,string>();
  private initialized:Promise<void>|undefined;
  private active=0;
  private waiting:(()=>void)[]=[];
  readonly failures=new Set<ArtId>();
  forceMissing(id:ArtId,missing:boolean){if(missing)this.forced.add(id);else this.forced.delete(id);}
  isMissing(id:ArtId){return this.forced.has(id)||this.failures.has(id);}
  bundle(bundle:Bundle,signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void){
    const ids=(Object.keys(artManifest) as ArtId[]).filter(id=>artManifest[id].bundle===bundle);
    return this.loadIds(ids,signal,onProgress,bundleLabel(bundle));
  }
  async loadIds(requested:readonly ArtId[],signal?:AbortSignal,onProgress?:(p:LoadProgress)=>void,label='准备校园画册'):Promise<ResourceLease>{
    this.initialized??=Assets.init({manifest:pixiManifest});await this.initialized;
    const ids=[...new Set(requested)],textures=new Map<ArtId,Texture>();
    const acquired:ArtId[]=[];let completed=0,failed=0;
    const report=()=>onProgress?.({completed,total:ids.length,failed,label});
    if(!signal?.aborted)report();
    // A fixed six-request cap is shared by all concurrent bundles; never FPS based.
    for(let start=0;start<ids.length&&!signal?.aborted;start+=6){
      await Promise.all(ids.slice(start,start+6).map(async id=>{
        if(signal?.aborted)return;
        let entry=this.entries.get(id);
        if(!entry){entry={refs:0,promise:this.load(id)};this.entries.set(id,entry);}
        entry.refs++;acquired.push(id);
        const texture=await entry.promise;
        if(texture&&!this.forced.has(id))textures.set(id,texture);else failed++;
        completed++;if(!signal?.aborted)report();
      }));
    }
    let released=false;
    const release=()=>{if(released)return;released=true;for(const id of acquired){const entry=this.entries.get(id);if(entry){entry.refs=Math.max(0,entry.refs-1);if(entry.refs===0&&this.failures.has(id))this.entries.delete(id);}}};
    if(signal?.aborted){release();textures.clear();}
    // Small shared assets stay warm across runs; explicit dispose frees zero-ref textures.
    return {textures,release};
  }
  private async load(id:ArtId):Promise<Texture|null>{
    if(this.active>=6)await new Promise<void>(resolve=>this.waiting.push(resolve));
    else this.active++;
    try{
      const sources=[artUrl(id),...(artManifest[id].pngFallback?[artUrl(id,'png')]:[])];
      for(const source of sources){
        for(let attempt=0;attempt<2;attempt++)try{
          const texture=await Assets.load<Texture>(source);
          if(texture instanceof Texture){this.failures.delete(id);this.loadedSources.set(id,source);return texture;}
        }catch{/* A failed decorative image must not block the bundle or gameplay. */}
      }
      this.failures.add(id);return null;
    }finally{
      const next=this.waiting.shift();if(next)next();else this.active--;
    }
  }
  async dispose(){
    for(const [id,entry] of this.entries)if(!entry.refs){
      await entry.promise;
      const source=this.loadedSources.get(id);
      if(source)await Assets.unload(source).catch(()=>{});
      this.entries.delete(id);this.loadedSources.delete(id);
    }
  }
}
export const resources=new ResourceLoader();
/** Fonts have a finite wait; system fonts remain a valid fallback. */
export async function prepareFonts(){
  if(!document.fonts)return;
  await Promise.race([Promise.allSettled([document.fonts.load('600 18px "Campus Digits"'),document.fonts.load('400 16px "Campus Sans"','校园图书馆基础教学楼实验中心食堂')]),new Promise(resolve=>setTimeout(resolve,1800))]);
}
