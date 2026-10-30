import {describe,it,expect} from 'vitest';
import {normalizeSettings,DEFAULT_SETTINGS} from '../../src/save/settings';
import {freshSave,validateSave,SaveRepository,SAVE_KEY} from '../../src/save/storage';

describe('v4 settings migration',()=>{
 it('new saves use 0.8 feedback, while schema and gameplay version remain compatible',()=>{
  expect(freshSave()).toMatchObject({schemaVersion:3,contentVersion:'4.0.0',settings:{settingsVersion:4,shake:.8,flash:.8,quality:'high',hitStop:1}});
 });
 it.each([1,2,3])('preserves all explicit preferences and progression from schema %s',schemaVersion=>{
  const old={...freshSave(),schemaVersion,credits:137,selected:'coder',unlocked:['balanced','coder'],talents:{hp:2},discovered:['knife','orbit'],settledRuns:['legacy'],settings:{master:0,music:0,sfx:0,shake:0,flash:0,muted:true,motion:false,quality:'low',afterimages:false,haptics:false,quickChest:false},stats:{...freshSave().stats,runs:3,kills:120}},before=structuredClone(old);
  const migrated=validateSave(old)!;
  expect(migrated).toMatchObject({schemaVersion:3,credits:137,selected:'coder',unlocked:['balanced','coder'],talents:{hp:2},settledRuns:['legacy'],stats:{runs:3,kills:120},settings:{...old.settings,settingsVersion:4,uiSfx:.6,hitStop:1,zoomEffects:true,distortion:true,musicDucking:true}});
  expect(old).toEqual(before);expect(validateSave(migrated)).toEqual(migrated);
 });
 it('is pure, clamps invalid values, defaults only missing fields and remains idempotent',()=>{
  const raw={...DEFAULT_SETTINGS,shake:.23,flash:.47,hitStop:0,uiSfx:0,zoomEffects:false,distortion:false,musicDucking:false,quality:'auto' as const},copy=structuredClone(raw);
  expect(normalizeSettings(raw)).toEqual(copy);expect(normalizeSettings(normalizeSettings(raw))).toEqual(copy);expect(raw).toEqual(copy);
  expect(normalizeSettings({master:NaN,flash:9,shake:-1,hitStop:null})).toMatchObject({master:.65,flash:1,shake:0,hitStop:1});
 });
 it('reads a v2 storage key without deleting it or issuing extra rewards',()=>{
  const legacy=JSON.stringify({...freshSave(),schemaVersion:2,credits:73,settledRuns:['done'],settings:{quality:'medium',muted:true,shake:.15,flash:.2}}),data=new Map([['campus-survival.save.v2',legacy]]);
  const repo=new SaveRepository({getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v);},removeItem:k=>{data.delete(k);}}),save=repo.load();
  expect(save.credits).toBe(73);expect(save.settledRuns).toEqual(['done']);expect(save.settings).toMatchObject({quality:'medium',muted:true,shake:.15,flash:.2});expect(data.get('campus-survival.save.v2')).toBe(legacy);expect(JSON.parse(data.get(SAVE_KEY)!)).toEqual(save);
 });
});
