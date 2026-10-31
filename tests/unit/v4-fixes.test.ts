import {describe,it,expect,vi} from 'vitest';
import {freshSave,validateSave,SaveRepository,SAVE_KEY,BACKUP_KEY,LEGACY_KEYS,RECOVERY_PREFIX,settleRun} from '../../src/save/storage';
import {recoveryPreview} from '../../src/save/recovery';
import {normalizeSettings,DEFAULT_SETTINGS} from '../../src/save/settings';
import {qualityBudget,qualityName} from '../../src/presentation/quality';
import {resolveAudioPreset,OUTPUT_PROFILES} from '../../src/audio/OutputBus';
import type {Settings,Quality} from '../../src/types';
import {useApp,createAppStore} from '../../src/state/store';
import {Texture,TextureSource} from 'pixi.js';
import {ResourceLoader} from '../../src/assets/loader';
import {afterimagePoint} from '../../src/render/trail-sampling';
import {SaveCoordinator,type SaveLocks} from '../../src/save/coordinator';
import {GameEngine} from '../../src/core/engine';
import {ModalPauseOwner,blocksGameKey} from '../../src/ui/input/modal-input';
import {InteractionPointer} from '../../src/ui/hud/interaction-pointer';
class Memory {
 data=new Map<string,string>();fail='';
 getItem(k:string){return this.data.get(k)??null;}
 setItem(k:string,v:string){if(this.fail&&k.startsWith(this.fail))throw new DOMException('quota','QuotaExceededError');this.data.set(k,v);}
 removeItem(k:string){this.data.delete(k);}
}
describe('v4.0.1 short regressions',()=>{
 it('R01 protects originals, recovers known fields, preserves fallback/future and quota failures',()=>{
  const bad=JSON.stringify({...freshSave(),credits:'137',unlocked:['balanced','coder'],selected:'coder',talents:{hp:3},stats:{...freshSave().stats,runs:7}});
  for(const raw of [bad,'{broken','']){
   const storage=new Memory();storage.setItem(SAVE_KEY,raw);const repo=new SaveRepository(storage);repo.load();expect(repo.state).toBe('corrupt');expect(repo.write(freshSave())).toBe(false);expect(storage.getItem(SAVE_KEY)).toBe(raw);
   if(raw===bad){const preview=recoveryPreview(raw)!;expect(preview.save).toMatchObject({credits:0,selected:'coder',talents:{hp:3},stats:{runs:7}});expect(preview.changes.some(x=>x.includes('credits')&&x.includes('137')&&x.includes('→ 0'))).toBe(true);
    for(const fail of [RECOVERY_PREFIX,SAVE_KEY]){storage.fail=fail;expect(repo.commitRecovery('fields')).toBeNull();expect(storage.getItem(SAVE_KEY)).toBe(raw);expect(repo.state).toBe('corrupt');}
    storage.fail='';expect(repo.commitRecovery('fields')?.selected).toBe('coder');expect([...storage.data].filter(([k])=>k.startsWith(RECOVERY_PREFIX)).map(([,v])=>v)).toEqual([raw]);expect(repo.write({...freshSave(),credits:6})).toBe(true);
   }else{expect(recoveryPreview(raw)).toBeNull();storage.fail=RECOVERY_PREFIX;expect(repo.commitRecovery('reset')).toBeNull();expect(storage.getItem(SAVE_KEY)).toBe(raw);storage.fail='';expect(repo.commitRecovery('reset')?.credits).toBe(0);}
  }
  const storage=new Memory();storage.setItem(SAVE_KEY,bad);storage.setItem(BACKUP_KEY,JSON.stringify({...freshSave(),credits:73}));const repo=new SaveRepository(storage);expect(repo.load().credits).toBe(73);expect(repo.state).toBe('fallback');expect(repo.write({...freshSave(),credits:74})).toBe(true);
  const future=JSON.stringify({...freshSave(),schemaVersion:99});storage.setItem(SAVE_KEY,future);expect(repo.load().credits).toBe(73);expect(repo.state).toBe('future');expect(repo.write(freshSave())).toBe(false);expect(repo.reset()).toBeNull();expect(storage.getItem(SAVE_KEY)).toBe(future);
  const absent=new SaveRepository(new Memory());absent.load();expect(absent.state).toBe('new');expect(absent.write(freshSave())).toBe(true);
 });
 it('R02 strictly validates enum types in memory and makes consumers total',()=>{
  for(const value of [['high'],null,{},'invalid',7]){
   const out=normalizeSettings({quality:value,audioPreset:value});expect(out.quality).toBe('high');expect(out.audioPreset).toBe('auto');expect(normalizeSettings(out)).toEqual(out);
   expect(qualityName(value as Quality)).toBe('high');expect(qualityBudget(value as Quality)).toEqual(qualityBudget('high'));
   expect(OUTPUT_PROFILES[resolveAudioPreset(value as Settings['audioPreset'],true,390)]).toEqual(OUTPUT_PROFILES.phone);
  }
  for(const quality of ['auto','high','medium','low'] as const)expect(normalizeSettings({quality}).quality).toBe(quality);
  for(const audioPreset of ['auto','full','phone'] as const)expect(normalizeSettings({audioPreset}).audioPreset).toBe(audioPreset);
  useApp.getState().settings({quality:['low'] as unknown as Quality,audioPreset:['phone'] as unknown as Settings['audioPreset'],shake:0,motion:false,muted:true});
  expect(useApp.getState().save.settings).toMatchObject({quality:'high',audioPreset:'auto',shake:0,motion:false,muted:true});
 });
 it('compatibility: v2/v3/P0/P1/P2 validate, write and reload without progression loss or mutation',()=>{
  for(const version of ['2.0.0','3.0.0','4.0.0-p0','4.0.0-p1','4.0.0-p2']){
   const old={...freshSave(),schemaVersion:version==='2.0.0'?2:3,contentVersion:version,credits:137,selected:'coder',unlocked:['balanced','coder'],talents:{hp:3},discovered:['knife','orbit'],evolutions:['orbit'],settledRuns:['done'],relics:['clockShard'],fusions:['sword'],settings:{...DEFAULT_SETTINGS,motion:false,muted:true,shake:0,flash:0,hitStop:0,quality:'medium',...(version==='4.0.0-p2'?{audioPreset:'phone',dynamicMusic:false,afterimages:false}:{audioPreset:undefined})},stats:{...freshSave().stats,kills:600,runs:4,wins:1,bestWeek:22}};
   const before=structuredClone(old),valid=validateSave(old)!;expect(old).toEqual(before);expect(validateSave(valid)).toEqual(valid);
   const storage=new Memory();if(old.schemaVersion===2)storage.setItem(LEGACY_KEYS[0],JSON.stringify(old));const repo=new SaveRepository(storage);if(old.schemaVersion===2){expect(repo.load()).toEqual(valid);expect(storage.getItem(LEGACY_KEYS[0])).toBe(JSON.stringify(old));}expect(repo.write(valid)).toBe(true);expect(validateSave(new SaveRepository(storage).load())).toEqual(valid);
   expect(valid).toMatchObject({credits:137,selected:'coder',talents:{hp:3},settledRuns:['done'],stats:{runs:4,kills:600},settings:{motion:false,muted:true,shake:0,flash:0,hitStop:0,quality:'medium'}});
   expect(settleRun(valid,{id:'done'} as Parameters<typeof settleRun>[1])).toBe(valid);
  }
 });
 it('R03 panels own only their pause, preserve draft/reward tokens and control defaults',()=>{
  for(const phase of ['playing','paused','draft','reward','contract','result'] as const){
   const engine=new GameEngine(freshSave(),4);engine.setPhase(phase);const session={engine,scene:{clearUIInput:vi.fn()}},owner=new ModalPauseOwner<typeof session>(),token=engine.draftToken,reward=engine.rewards.token,cards=engine.cards;
   engine.inputX=1;session.scene.clearUIInput.mockImplementation(()=>{engine.inputX=0;engine.landmarks.held=false;});owner.open(session);owner.open(session);engine.tick(1/60);
   expect(session.scene.clearUIInput).toHaveBeenCalled();expect(engine.inputX).toBe(0);
   expect(engine.phase).toBe(phase==='result'?'result':'paused');
   for(const key of ['KeyP','KeyD','KeyQ','Space','KeyE','Digit1'])expect(blocksGameKey(key)).toBe(true);
   for(const key of ['Tab','Home','End','Backspace'])expect(blocksGameKey(key)).toBe(false);
   owner.close(session);engine.tick(1/60);expect(engine.phase).toBe(phase);expect(engine.draftToken).toBe(token);expect(engine.rewards.token).toBe(reward);expect(engine.cards).toBe(cards);
   owner.close(session);engine.tick(1/60);expect(engine.phase).toBe(phase);
  }
  const send=vi.fn(),session={engine:{phase:'playing' as const,send},scene:{clearUIInput:vi.fn()}},owner=new ModalPauseOwner<typeof session>();owner.open(session);owner.close({...session});expect(send.mock.calls.map(([c])=>c.type)).toEqual(['pause']);
 });
 it('R05 releases one interaction pointer once on hide/lost capture/late up without touching movement',()=>{
  const game=new GameEngine(freshSave(),8);game.inputX=1;game.inputY=.5;const held=vi.fn((value:boolean)=>game.send({type:'interact',held:value})),target={setPointerCapture:vi.fn(),hasPointerCapture:()=>true,releasePointerCapture:vi.fn()},pointer=new InteractionPointer(held);
  expect(pointer.press(41,target)).toBe(true);expect(pointer.press(42,target)).toBe(false);pointer.release(42);expect(held.mock.calls).toEqual([[true]]);
  pointer.release();pointer.release(41);pointer.release();expect(held.mock.calls).toEqual([[true],[false]]);expect(target.releasePointerCapture).toHaveBeenCalledTimes(1);game.tick(1/60);expect(game.landmarks.held).toBe(false);expect([game.inputX,game.inputY]).toEqual([1,.5]);
  pointer.press(43,target);pointer.release(43);pointer.release(43);expect(held.mock.calls).toEqual([[true],[false],[true],[false]]);
 });

 it('R04 serializes two stores, rejects delayed old-owner writes and takes over latest disk data',async()=>{
  class Locks implements SaveLocks {
   owners=new Set<string>();queue=Promise.resolve();
   exclusive<T>(_name:string,task:()=>T|Promise<T>):Promise<T>{const result=this.queue.then(task);this.queue=result.then(()=>{},()=>{});return result;}
   async holdOwner(owner:string){this.owners.add(owner);return()=>{this.owners.delete(owner);};}
   async ownerAlive(owner:string){return this.owners.has(owner);}
  }
  const storage=new Memory(),locks=new Locks();storage.setItem(SAVE_KEY,JSON.stringify({...freshSave(),credits:200}));
  const ar=new SaveRepository(storage),ac=new SaveCoordinator(ar,storage,locks),a=createAppStore(ar,ac);await ac.initialize();
  const br=new SaveRepository(storage),bc=new SaveCoordinator(br,storage,locks),b=createAppStore(br,bc);await bc.initialize();expect(bc.role).toBe('observer');
  expect(a.getState().unlock('analysis')).toBe(true);await a.getState().whenIdle();const afterBuy=storage.getItem(SAVE_KEY);expect(JSON.parse(afterBuy!)).toMatchObject({credits:120,unlocked:['balanced','analysis']});
  const engine=new GameEngine(freshSave(),1);engine.finish(false);const run={...engine.result!,id:'same-run',credits:20};
  expect((await b.getState().settings({muted:true})).kind).toBe('memory');b.getState().settle(run);await b.getState().whenIdle();expect(storage.getItem(SAVE_KEY)).toBe(afterBuy);
  let release!:()=>void;const gate=new Promise<void>(r=>{release=r;});const blocking=locks.exclusive('commit',()=>gate);
  const older=a.getState().settings({quality:'low'}),newer=a.getState().settings({muted:true});release();await blocking;await older;await newer;expect(a.getState().save.settings).toMatchObject({quality:'low',muted:true});
  let unlock!:()=>void;const blocked=locks.exclusive('commit',()=>new Promise<void>(r=>{unlock=r;}));await Promise.resolve();
  const taking=b.getState().takeoverSave();for(let i=0;i<5;i++)await Promise.resolve();
  const stale=a.getState().settings({quality:'medium'});a.getState().settle(run);const queued=a.getState().whenIdle();unlock();await blocked;await taking;await stale;await queued;
  expect(b.getState().save).toMatchObject({credits:120,unlocked:['balanced','analysis'],settings:{quality:'low',muted:true}});expect(ac.role).toBe('conflict');expect(JSON.parse(storage.getItem(SAVE_KEY)!)).toMatchObject({credits:120,persistence:{ownerId:bc.ownerId}});
  b.getState().settle(run);b.getState().settle(run);await b.getState().whenIdle();expect(JSON.parse(storage.getItem(SAVE_KEY)!).credits).toBe(140);expect(b.getState().save.settledRuns.filter(id=>id===run.id)).toHaveLength(1);
  const previous=JSON.parse(storage.getItem(SAVE_KEY)!).persistence;await b.getState().importSave(JSON.stringify({...b.getState().save,persistence:{revision:999,epoch:99,ownerId:'foreign-file'}}));expect(JSON.parse(storage.getItem(SAVE_KEY)!).persistence).toEqual({...previous,revision:previous.revision+1});
  // Old external writers and deletions revoke ownership even without a storage event.
  storage.setItem(SAVE_KEY,JSON.stringify({...freshSave(),credits:7}));expect((await b.getState().settings({muted:false})).kind).toBe('memory');expect(JSON.parse(storage.getItem(SAVE_KEY)!).credits).toBe(7);
  await b.getState().refreshSave();expect(b.getState().save.credits).toBe(7);expect(b.getState().save.persistence?.revision).toBe(1);storage.removeItem(SAVE_KEY);bc.verify();expect(bc.role).toBe('conflict');
  for(const persistence of [null,{}, {revision:-1,epoch:0,ownerId:'x'}])expect(validateSave({...freshSave(),persistence})).toBeNull();
  storage.setItem(SAVE_KEY,JSON.stringify({...freshSave(),credits:18}));const memoryRepo=new SaveRepository(storage),unsupported=new SaveCoordinator(memoryRepo,storage,null),memory=createAppStore(memoryRepo,unsupported);await unsupported.initialize();const raw=storage.getItem(SAVE_KEY);expect(memory.getState().save.credits).toBe(18);await memory.getState().settings({muted:true});expect(storage.getItem(SAVE_KEY)).toBe(raw);expect(memory.getState().persistence).toBe('unsupported');
  ac.dispose();bc.dispose();unsupported.dispose();
 });

 it('R09 keeps reverse/find point identity and boundary order at every original trail layer',()=>{
  const samples=[[],[0,.04,.08,.12,.16,.2,.22,.24],[.08,.08,.12],[1,2]];
  for(const times of samples){const points=times.map((time,n)=>({x:n,y:-n,time})),before=[...points];
   for(const high of [true,false])for(const age of [0,.12,.22,.24,1])for(let layer=1;layer<=(high?5:2);layer++)expect(afterimagePoint(points,age,layer,high)).toBe([...points].reverse().find(p=>age-p.time>=layer*.04&&age-p.time<=(high?.22:.12)));
   expect(points).toEqual(before);points.forEach((p,n)=>expect(p).toBe(before[n]));
  }
 });
 it('S01 fulfills dispose after aborted decode, retaining a reacquired shared lease until its last release',async()=>{
  for(const reacquire of [false,true]){
   const image=new Texture({source:new TextureSource({width:256,height:24})});let finish!:(texture:Texture)=>void;const gate=new Promise<Texture>(r=>{finish=r;}),abort=new AbortController(),unload=vi.fn(async()=>{}),loader=new ResourceLoader({init:async()=>{},load:()=>gate,unload});
   const pending=loader.loadIds(['particles'],abort.signal);while(!loader.debug.loading)await Promise.resolve();abort.abort();await loader.dispose();
   const second=reacquire?loader.loadIds(['particles']):null;if(second)while(loader.debug.references!==2)await Promise.resolve();
   finish(image);const canceled=await pending;canceled.release();const retained=second?await second:null;
   if(retained){expect(loader.debug.references).toBe(1);expect(unload).not.toHaveBeenCalled();retained.release();retained.release();}
   for(let i=0;i<20&&loader.debug.entries;i++)await Promise.resolve();expect(loader.debug).toMatchObject({entries:0,references:0,textures:0});expect(unload).toHaveBeenCalledTimes(1);image.destroy(true);
  }
 });

});
