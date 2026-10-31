import {describe,it,expect,vi} from 'vitest';
import {AudioDirector,VOICE_RULES,type VoiceCategory} from '../../src/audio/AudioDirector';
import {DuckEnvelope,dbToGain,musicGain} from '../../src/audio/mix';
import {sampleOrFallback,selectVariant,eventMaterial,WEAPON_MATERIALS,ENEMY_MATERIALS,ULTIMATE_MATERIALS,ENVIRONMENT_SAMPLES,UI_SAMPLES,COMBAT_SAMPLES,MUSIC_THEMES,normalizeTheme,MusicThemeSelector} from '../../src/audio/catalog';
import {freshSave} from '../../src/save/storage';
import {WEAPONS,ENEMIES} from '../../src/data/catalog';
import {FUSIONS} from '../../src/data/fusions';
import {ULTIMATES} from '../../src/data/ultimates';
import {EVENT_DEFS} from '../../src/world/events';
import {existsSync} from 'node:fs';
import loops from '../../src/assets/audio-loops.json';
const mock=vi.hoisted(()=>({instances:[] as {options:Record<string,unknown>;unloaded:boolean;active:boolean;gain:number}[]}));
vi.mock('howler',()=>({Howl:class{
 options:Record<string,unknown>;unloaded=false;active=false;gain=0;_fallback=false;
 constructor(options:Record<string,unknown>){this.options=options;mock.instances.push(this);}
 rate(){}
 play(){this.active=true;return 1;}stop(){this.active=false;}volume(value:number){this.gain=value;}unload(){this.unloaded=true;this.active=false;}
}}));
import {MusicDirector} from '../../src/audio/MusicDirector';
import type {Howl} from 'howler';

describe('v4 audio scheduling and mixing',()=>{
 it('enforces actual-layer category caps and 48 total voices with critical headroom',()=>{
  const director=new AudioDirector(),add=(category:VoiceCategory)=>director.admit(category,.6,0,0,'session',()=>{let active=true;return{playing:()=>active,stop:()=>{active=false;}};});
  for(const category of Object.keys(VOICE_RULES) as VoiceCategory[])for(let n=0;n<100;n++)add(category);
  expect(director.voices.length).toBeLessThanOrEqual(48);for(const category of Object.keys(VOICE_RULES) as VoiceCategory[])expect(director.voices.filter(v=>v.category===category).length).toBeLessThanOrEqual(VOICE_RULES[category].limit);
  expect(director.voices.filter(v=>v.category==='hurt')).toHaveLength(4);expect(director.evicted).toBeGreaterThan(0);
 });
 it('keeps important voices when low-priority sounds compete and releases only session scope',()=>{
  const director=new AudioDirector();let stops=0;const start=()=>({playing:()=>true,stop:()=>{stops++;}});
  for(let i=0;i<4;i++)director.admit('hurt',1,0,i,'session',start);director.admit('hover',.2,1,5,'ui',start);director.release('session');expect(stops).toBe(4);expect(director.voices).toHaveLength(1);expect(director.voices[0].scope).toBe('ui');director.release();expect(stops).toBe(5);
 });
 it('overlapping ducks use the deepest envelope once, including settings and paused gain',()=>{
  const duck=new DuckEnvelope();duck.trigger('critical',0);duck.trigger('hurt',0);duck.trigger('elite',0);expect(duck.gain(.02)).toBeCloseTo(dbToGain(-6));
  const settings=freshSave().settings;expect(musicGain(settings,true,duck.gain(.02))).toBeCloseTo(settings.master*settings.music*.22*dbToGain(-6));
  expect(musicGain({...settings,musicDucking:false},true,duck.gain(.02))).toBeCloseTo(settings.master*settings.music*.22);expect(duck.gain(2)).toBe(1);
 });
 it('failed/missing samples select synthesis and variants never immediately repeat',()=>{
  const sample={loaded:false},fallback={loaded:true};expect(sampleOrFallback(sample,s=>s.loaded,fallback)).toBe(fallback);expect(sampleOrFallback(undefined,()=>true,fallback)).toBe(fallback);sample.loaded=true;expect(sampleOrFallback(sample,s=>s.loaded,fallback)).toBe(sample);
  for(let previous=0;previous<4;previous++)for(const random of [0,.3,.7,.999]){const next=selectVariant(previous,4,random);expect(next).not.toBe(previous);expect(next).toBeGreaterThanOrEqual(0);expect(next).toBeLessThan(4);}
 });
 it('crossfades songs without stopping the old song before the new one has loaded',()=>{
  mock.instances.length=0;const music=new MusicDirector(()=>undefined),settings=freshSave().settings;
  music.setTheme('menu');const first=mock.instances[0];(first.options.onload as ()=>void)();music.update(.7,1,settings,false);expect(first.active).toBe(true);expect(first.gain).toBeCloseTo(settings.master*settings.music);
  music.setTheme('boss');expect(first.active).toBe(true);const second=mock.instances[1];(second.options.onload as ()=>void)();music.update(.35,1.35,settings,false);expect(first.active&&second.active).toBe(true);expect(first.gain).toBeCloseTo(second.gain);music.update(.35,1.7,settings,false);expect(first.unloaded).toBe(true);expect(second.gain).toBeCloseTo(settings.master*settings.music);music.destroy();expect(second.unloaded).toBe(true);
 });
 it('cancels stale song loads and never plays a callback after disposal',()=>{
  mock.instances.length=0;const music=new MusicDirector(()=>undefined);music.setTheme('menu');const stale=mock.instances[0];music.setTheme('boss');expect(stale.unloaded).toBe(true);(stale.options.onload as ()=>void)();expect(stale.active).toBe(false);const pending=mock.instances[1];music.destroy();expect(pending.unloaded).toBe(true);(pending.options.onload as ()=>void)();expect(pending.active).toBe(false);
 });
 it('music decoding failure activates a synthetic loop using the same gain path',()=>{
  mock.instances.length=0;const fallback={_fallback:true,play:vi.fn(()=>1),volume:vi.fn(),rate:vi.fn(),stop:vi.fn()} as unknown as Howl;
  const music=new MusicDirector(()=>fallback);music.setTheme('boss');(mock.instances[0].options.onloaderror as ()=>void)();music.duck.trigger('hurt',0);music.update(.7,.02,freshSave().settings,true);expect(fallback.play).toHaveBeenCalledOnce();expect(fallback.volume).toHaveBeenLastCalledWith(musicGain(freshSave().settings,true,dbToGain(-5)),1);music.destroy();expect(fallback.stop).toHaveBeenCalledWith(1);
 });
 it('covers every existing weapon, evolution, fusion, enemy, ultimate and campus event',()=>{
  expect(Object.keys(WEAPON_MATERIALS).sort()).toEqual([...WEAPONS,...FUSIONS].map(w=>w.id).sort());
  expect(Object.keys(ENEMY_MATERIALS).sort()).toEqual(ENEMIES.map(e=>e.id).sort());
  expect(Object.keys(ULTIMATE_MATERIALS).sort()).toEqual(ULTIMATES.map(u=>u.id).sort());
  expect(Object.keys(ENVIRONMENT_SAMPLES).sort()).toEqual(EVENT_DEFS.map(e=>e.id).sort());
  for(const weapon of [...WEAPONS,...FUSIONS])for(const evolved of [false,true])expect(eventMaterial({type:'shot',x:0,y:0,color:0,size:1,weapon:weapon.id,evolved})).toBe(WEAPON_MATERIALS[weapon.id]);
  for(const name of [...UI_SAMPLES,...COMBAT_SAMPLES,...MUSIC_THEMES.map(theme=>'music-'+theme)])for(const format of ['ogg','mp3'])expect(existsSync(`public/assets/audio/v4/${name}.${format}`),name+'.'+format).toBe(true);
 });
 it('uses target material for deaths independently of the weapon that dealt the last hit',()=>{
  expect(eventMaterial({type:'death',x:0,y:0,color:0,size:20,enemyKind:'guard',weapon:'coffee'})).toBe('metal');
  expect(eventMaterial({type:'death',x:0,y:0,color:0,size:20,enemyKind:'bomber',weapon:'brick'})).toBe('glass');
  expect(eventMaterial({type:'hit',x:0,y:0,color:0,size:20,material:'ice',weapon:'coffee'})).toBe('glass');
 });
 it('has five distinct whole-song states, preserves legacy late and waits through transient elite pressure',()=>{
  expect(new Set(MUSIC_THEMES.map(theme=>loops[theme].original)).size).toBe(5);expect(normalizeTheme('late')).toBe('elite');
  const selector=new MusicThemeSelector();expect(selector.resolve('normal',0)).toBe('normal');expect(selector.resolve('elite',1)).toBe('normal');expect(selector.resolve('normal',2)).toBe('normal');
  expect(selector.resolve('elite',3)).toBe('normal');expect(selector.resolve('elite',4.5)).toBe('elite');expect(selector.resolve('normal',5)).toBe('elite');expect(selector.resolve('normal',8.99)).toBe('elite');expect(selector.resolve('normal',9)).toBe('normal');
  expect(selector.resolve('boss',9.1)).toBe('boss');expect(selector.resolve('result',9.2)).toBe('result');expect(selector.resolve('menu',9.3)).toBe('menu');
 });
 it('preloads a boss song silently and reuses it when the boss arrives',()=>{
  mock.instances.length=0;const music=new MusicDirector(()=>undefined);music.setTheme('normal');const normal=mock.instances[0];(normal.options.onload as ()=>void)();music.update(.7,0,freshSave().settings,false);
  music.preload('boss');const boss=mock.instances[1];(boss.options.onload as ()=>void)();expect(boss.active).toBe(false);music.setTheme('boss');expect(mock.instances).toHaveLength(2);expect(boss.active&&normal.active).toBe(true);music.update(.7,1,freshSave().settings,false);expect(normal.unloaded).toBe(true);music.destroy();
 });
 it('caps songs at two even when menu and combat alternate before fades finish',()=>{
  mock.instances.length=0;const music=new MusicDirector(()=>undefined),settings=freshSave().settings;
  for(const theme of ['menu','normal','menu','boss','result','normal']){music.setTheme(theme);const next=mock.instances.at(-1)!;(next.options.onload as ()=>void)();music.update(.02,0,settings,false);expect(music.debug.tracks.length).toBeLessThanOrEqual(2);}
  music.destroy();expect(mock.instances.every(s=>s.unloaded)).toBe(true);
 });
 it('replaces a loaded song if playback fails and ignores repeated late errors',()=>{
  mock.instances.length=0;const fallback={play:vi.fn(()=>1),volume:vi.fn(),rate:vi.fn(),stop:vi.fn()} as unknown as Howl;
  const music=new MusicDirector(()=>fallback);music.setTheme('normal');const sample=mock.instances[0];(sample.options.onload as ()=>void)();(sample.options.onplayerror as ()=>void)();(sample.options.onplayerror as ()=>void)();
  expect(sample.unloaded).toBe(true);expect(fallback.play).toHaveBeenCalledOnce();expect(music.debug.tracks).toHaveLength(1);music.destroy();
 });
 it('times out a stalled music load into synthesis and cancels its watchdog on destruction',()=>{
  vi.useFakeTimers();try{mock.instances.length=0;const fallback={play:vi.fn(()=>1),volume:vi.fn(),rate:vi.fn(),stop:vi.fn()} as unknown as Howl,music=new MusicDirector(()=>fallback);music.setTheme('menu');vi.advanceTimersByTime(5000);expect(fallback.play).toHaveBeenCalledOnce();expect(mock.instances[0].unloaded).toBe(true);music.destroy();expect(vi.getTimerCount()).toBe(0);}finally{vi.useRealTimers();}
 });

});
