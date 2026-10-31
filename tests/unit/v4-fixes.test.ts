import {describe,it,expect,vi} from 'vitest';
import {freshSave,validateSave,SaveRepository,SAVE_KEY,BACKUP_KEY,LEGACY_KEYS,RECOVERY_PREFIX,settleRun} from '../../src/save/storage';
import {recoveryPreview} from '../../src/save/recovery';
import {normalizeSettings,DEFAULT_SETTINGS} from '../../src/save/settings';
import {qualityBudget,qualityName} from '../../src/presentation/quality';
import {resolveAudioPreset,OUTPUT_PROFILES} from '../../src/audio/OutputBus';
import type {Settings,Quality} from '../../src/types';
import {useApp} from '../../src/state/store';
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

});
