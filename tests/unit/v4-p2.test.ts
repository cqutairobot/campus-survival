import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {TextureCatalog} from '../../src/render/TextureCatalog';
import type {TextureLibrary} from '../../src/render/procedural';
import {Texture,TextureSource} from 'pixi.js';
import {ResourceLoader} from '../../src/assets/loader';
import {qualityBudget,qualityName,allowsDistortion} from '../../src/presentation/quality';
import {profiles} from '../../src/presentation/profiles';
import {deathStyle} from '../../src/fx/DeathFX';
import {normalizeSettings} from '../../src/save/settings';
import {freshSave,validateSave,SaveRepository} from '../../src/save/storage';
import {resolveAudioPreset,OUTPUT_PROFILES} from '../../src/audio/OutputBus';
import {isDebugFixture} from '../../src/debug/isolation';
import {uiFixture,DEFAULT_UI_PARAMETERS} from '../../src/debug/fixtures';
import {INITIAL_HUD} from '../../src/state/store';
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
const texture=()=>new Texture({source:new TextureSource({width:256,height:24})});
describe('v4 P2 closure policies',()=>{
 it('keeps manual high budgets intact and makes medium/low filter policies explicit',()=>{
  expect(qualityName('auto')).toBe('high');expect(qualityBudget('high')).toMatchObject({dpr:2,particles:32768});expect(qualityBudget('medium')).toMatchObject({dpr:1.5,particles:8192,bloomResolution:.5});expect(qualityBudget('low')).toMatchObject({dpr:1,particles:1024});
  expect(allowsDistortion('medium',profiles.critical)).toBe(false);expect(allowsDistortion('medium',profiles.boss)).toBe(true);expect(allowsDistortion('low',profiles.boss)).toBe(false);

 });
 it('limits dissolution to high and keeps reduced motion deaths stationary',()=>{
  const event={type:'death' as const,x:0,y:0,size:24,color:0xffffff,enemyKind:'coding' as const};
  expect(deathStyle(event,'high',true).dissolve).toBe(true);for(const quality of ['medium','low'])expect(deathStyle(event,quality,true).dissolve).toBe(false);
  expect(deathStyle(event,'high',false)).toMatchObject({count:1,dissolve:false,silhouette:0});
 });
 it.each(['2.0.0','3.0.0','4.0.0-p0','4.0.0-p1'])('adds audio defaults without changing progress or explicit preferences from %s',contentVersion=>{
  const input={...freshSave(),contentVersion,credits:137,settledRuns:['settled'],settings:{...freshSave().settings,audioPreset:undefined,motion:false,muted:true,hitStop:0,shake:0,flash:0,quality:'low'}};
  const output=validateSave(input)!;expect(output).toMatchObject({credits:137,settledRuns:['settled'],settings:{audioPreset:'auto',motion:false,muted:true,hitStop:0,shake:0,flash:0,quality:'low'}});expect(validateSave(output)).toEqual(output);
  expect(normalizeSettings({...output.settings,audioPreset:'phone'}).audioPreset).toBe('phone');
 });
 it('chooses automatic phone EQ from capability and short side, independent of orientation',()=>{
  expect(resolveAudioPreset('auto',true,390)).toBe('phone');expect(resolveAudioPreset('auto',true,768)).toBe('full');expect(resolveAudioPreset('auto',false,390)).toBe('full');expect(resolveAudioPreset('full',true,390)).toBe('full');expect(OUTPUT_PROFILES.phone.ratio).toBe(3);
 });
 it('requires both debug and fixture flags and keeps fixture changes in memory',()=>{
  expect(isDebugFixture('?fixture=1')).toBe(false);expect(isDebugFixture('?debug=1&fixture=1')).toBe(true);
  const fixture=uiFixture({...DEFAULT_UI_PARAMETERS,screen:'result',largeNumbers:true,state:'locked'},INITIAL_HUD),repo=new SaveRepository(null),before=freshSave();repo.write(fixture.save);
  expect(fixture.hud.result?.kills).toBe(987654321);expect(fixture.save.daily.attempts).toEqual({});expect(before.credits).toBe(freshSave().credits);expect(fixture.save.unlocked).toEqual(['balanced']);
 });
 it('handles a missing image or corrupt atlas using retries, PNG and final geometry fallback',async()=>{
  const load=vi.fn(async()=>{throw Error('decode failed');}),unload=vi.fn(async()=>{}),loader=new ResourceLoader({init:async()=>{},load,unload});
  const lease=await loader.loadIds(['homework']);expect(lease.textures.size).toBe(0);expect(loader.failures.has('homework')).toBe(true);expect(load).toHaveBeenCalledTimes(4);lease.release();await loader.dispose();expect(loader.debug.entries).toBe(0);expect(unload).not.toHaveBeenCalled();
  const image=texture(),loadPng=vi.fn(async(source:string)=>{if(source.endsWith('.webp'))throw Error('network');return image;}),fallback=new ResourceLoader({init:async()=>{},load:loadPng,unload});
  const ok=await fallback.loadIds(['homework']);expect(ok.textures.get('homework')).toBe(image);expect(loadPng).toHaveBeenCalledTimes(3);ok.release();await fallback.dispose();image.destroy(true);
 });
 it('does not destroy a shared atlas and serializes re-acquisition against an in-flight unload',async()=>{
  const images=[texture(),texture()];let unblock:()=>void=()=>{};const gate=new Promise<void>(r=>{unblock=r;}),unload=vi.fn(()=>gate),load=vi.fn(async()=>images[Math.min(1,load.mock.calls.length-1)]),loader=new ResourceLoader({init:async()=>{},load,unload});
  const a=await loader.loadIds(['particles']),b=await loader.loadIds(['particles']);a.release();await loader.dispose();expect(unload).not.toHaveBeenCalled();b.release();const disposing=loader.dispose();await tick();const c=loader.loadIds(['particles']);await tick();expect(load).toHaveBeenCalledTimes(1);unblock();await disposing;const lease=await c;expect(load).toHaveBeenCalledTimes(2);expect(loader.debug.references).toBe(1);lease.release();await loader.dispose();expect(loader.debug.textures).toBe(0);images.forEach(t=>t.destroy(true));
 });
 it('releases an aborted bundle after the current decode without leaving references',async()=>{
  const image=texture(),abort=new AbortController(),loader=new ResourceLoader({init:async()=>{},load:async()=>{abort.abort();return image;},unload:async()=>{}}),lease=await loader.loadIds(['particles'],abort.signal);expect(lease.textures.size).toBe(0);expect(loader.debug.references).toBe(0);lease.release();await loader.dispose();expect(loader.debug.entries).toBe(0);image.destroy(true);
 });
 it('falls back to geometry for an atlas that decoded with invalid frame dimensions',()=>{
  const malformed=new Texture({source:new TextureSource({width:24,height:24})}),fallback=texture(),get=vi.fn(()=>fallback),catalog=new TextureCatalog({get} as unknown as TextureLibrary,new Map([['particles',malformed]]),'balanced');
  expect(catalog.get('fragment-paper')).toBe(fallback);expect(get).toHaveBeenCalledWith('fragment-paper');catalog.destroy();malformed.destroy(true);fallback.destroy(true);
 });
 it('meters every delivered audio codec around the common target with dynamic headroom',()=>{
  const report=JSON.parse(readFileSync('docs/v4-audio-loudness.json','utf8')) as {targetLufs:number;clips:{id:string;outputs:Record<string,{integratedLufs:number;truePeakDbtp:number}>}[]};
  expect(report.clips).toHaveLength(109);for(const clip of report.clips){expect(Object.keys(clip.outputs).sort()).toEqual(['mp3','ogg']);for(const output of Object.values(clip.outputs)){expect(Math.abs(output.integratedLufs-report.targetLufs),clip.id).toBeLessThanOrEqual(.8);expect(output.truePeakDbtp,clip.id).toBeLessThanOrEqual(-3);}}
 });

});
