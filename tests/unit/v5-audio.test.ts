import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AudioDirector,VOICE_RULES,type VoiceCategory} from '../../src/audio/AudioDirector';
import {DuckEnvelope} from '../../src/audio/mix';
import type {GameAudio} from '../../src/audio/audio';
import {SemesterAudio,type LayerOptions,type LayerSound} from '../../src/semesters/s2/presentation/SemesterAudio';
import * as cues from '../../src/semesters/s2/presentation/audio-catalog';
import {S2_IDS} from '../../src/semesters/catalog-ids';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {randomStreams} from '../../src/core/run';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {S2_CONTENT} from '../../src/semesters/s2/content';
import {projectContent} from '../../src/semesters/s2/legacy/rules-adapter';
const json=(p:string)=>JSON.parse(readFileSync(p,'utf8')),sha=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
function fixture(automatic=true){
 const audio={director:new AudioDirector(),musicDirector:{duck:new DuckEnvelope()},debug:{ready:true},event:vi.fn(),play:vi.fn()} as unknown as GameAudio,settings={...freshProfile().settings,muted:false,master:1,sfx:1,musicDucking:true};
 const samples:{options:LayerOptions;unloaded:boolean;loaded:boolean;active:Set<number>;gains:number[]}[]=[];let serial=0;
 const factory=(options:LayerOptions):LayerSound=>{const row={options,unloaded:false,loaded:false,active:new Set<number>(),gains:[] as number[]};samples.push(row);if(automatic)queueMicrotask(()=>{row.loaded=true;options.onload();});return{state:()=>row.loaded?'loaded':'loading',play:()=>{const id=++serial;row.active.add(id);return id;},stop:id=>id===undefined?row.active.clear():row.active.delete(id),playing:id=>id===undefined?!!row.active.size:row.active.has(id),volume:value=>row.gains.push(value),stereo:()=>{},unload:()=>{row.unloaded=true;row.active.clear();}};};
 return{audio,settings,samples,layer:new SemesterAudio(audio,settings,factory,()=>true)};
}
describe('v5 semester sound layers',()=>{
 it('ships exactly18 used CC0 clips in36 metered encodings with source/license/output hashes and complete content mappings; S1 audio remains identical',()=>{
  const ledger=json('audio-src/s2/ledger.json');expect(ledger.assets).toHaveLength(18);expect(cues.S2_SOUND_IDS).toHaveLength(18);expect(ledger.assets.flatMap((a:any)=>a.outputs)).toHaveLength(36);
  for(const a of ledger.assets){expect(sha(a.sourceFile)).toBe(a.sourceSha256);expect(sha(a.licenseFile)).toBe(a.licenseSha256);expect(readFileSync(a.licenseFile,'utf8')).toContain('Creative Commons Zero');expect(a.license).toBe('CC0 1.0');for(const o of a.outputs){expect(sha(o.file)).toBe(o.sha256);expect(Math.abs(o.integratedLufs+23)).toBeLessThanOrEqual(.65);expect(o.truePeakDbtp).toBeLessThanOrEqual(-3);}}
  for(const [path,hash] of Object.entries(json('audio-src/s2/s1-preserved.json')))expect(sha(path),path).toBe(hash);
  for(const [ids,map] of [[S2_IDS.enemies,cues.S2_ENEMY_CUES],[S2_IDS.weapons,cues.S2_WEAPON_CUES],[S2_IDS.fusions,cues.S2_WEAPON_CUES],[S2_IDS.passives,cues.S2_PASSIVE_CUES],[S2_IDS.relics,cues.S2_RELIC_CUES],[S2_IDS.events,cues.S2_EVENT_CUES],[S2_IDS.interactions,cues.S2_INTERACTION_CUES]] as const)for(const id of ids)expect((map as Record<string,unknown>)[id],id).toBeDefined();
  for(const id of S2_IDS.weapons)expect(cues.S2_WEAPON_CUES[`${id}:evolved`]).toBeDefined();
  const mapped=JSON.stringify([cues.S2_ENEMY_CUES,cues.S2_WEAPON_CUES,cues.S2_PASSIVE_CUES,cues.S2_RELIC_CUES,cues.S2_EVENT_CUES,cues.S2_INTERACTION_CUES,cues.S2_WARNING_CUES,cues.S2_BOSS_STAGE_CUES,cues.S2_AMBIENCE_CUES]);for(const id of cues.S2_SOUND_IDS){expect(mapped).toContain(id);expect(cues.semesterAudioSources(id)).toEqual([expect.stringMatching(/\.ogg$/),expect.stringMatching(/\.mp3$/)]);}
  expect(cues.semesterAudioIds(1,{x:3072,y:3072})).not.toContain('ambience-s2-lab');expect(cues.semesterAudioIds(1,{x:5000,y:4480})).toContain('ambience-s2-lab');expect(cues.semesterAudioIds(16,{x:3072,y:3072})).toHaveLength(18);
 });
 it('uses the existing48-voice director, keeps key warnings over ordinary saturation, applies the same duck envelope and releases actual owned voices',async()=>{
  const f=fixture();await f.layer.prepare(cues.S2_SOUND_IDS);expect(f.layer.debug.loaded).toHaveLength(18);expect(f.samples.every(s=>s.options.format.join('/')==='ogg/mp3')).toBe(true);
  for(const category of Object.keys(VOICE_RULES) as VoiceCategory[])if(!['hurt','important'].includes(category))for(let n=0;n<100;n++)f.audio.director.admit(category,.2,1,n,'session',()=>({playing:()=>true,stop:()=>{}}));
  expect(f.layer.cue('warning-s2-line','hurt',.2,.75)).toBe(true);expect(f.audio.director.voices.length).toBeLessThanOrEqual(48);expect(f.audio.director.voices.some(v=>v.priority===100)).toBe(true);expect(f.audio.musicDirector.duck.gain(performance.now()/1000+.02)).toBeLessThan(1);
  f.layer.apply({...f.settings,audioPreset:'phone'});f.layer.dispose();expect(f.layer.debug.voices).toBe(0);expect(f.samples.every(s=>s.unloaded&&!s.active.size)).toBe(true);f.audio.director.release('session');expect(f.audio.director.voices).toHaveLength(0);
 });
 it('cancels pending decoding, ignores late load callbacks and falls back through the existing critical cue when a sample fails',async()=>{
  const f=fixture(false),abort=new AbortController(),loading=f.layer.prepare(['warning-s2-line'],abort.signal);await Promise.resolve();abort.abort();await loading;f.samples[0].options.onload();expect(f.layer.debug.loaded).toHaveLength(0);expect(f.samples[0].unloaded).toBe(true);
  const failed=f.layer.prepare(['warning-s2-reservation']);await Promise.resolve();f.samples.at(-1)!.options.onloaderror();await failed;expect(f.layer.debug.failed).toEqual(['warning-s2-reservation']);expect(f.layer.cue('warning-s2-reservation','hurt')).toBe(false);expect(f.audio.event).toHaveBeenCalledWith(expect.objectContaining({type:'warning',priority:true}));
  const late=f.layer.prepare(['shot-s2-drone']);await Promise.resolve();f.layer.dispose();await late;f.samples.at(-1)!.options.onload();expect(f.layer.cue('shot-s2-drone')).toBe(false);expect(f.layer.debug.voices).toBe(0);expect(f.samples.every(s=>s.unloaded)).toBe(true);
 });
 it('routes real S2 presentation snapshots and attack IDs to passive/relic/event/medical/phase/weapon/evolution cues without changing simulation',()=>{
  const p=freshProfile();p.stats.wins=1;const snapshot=createS2PreviewSnapshot(p,86),s=new ContentState(S2_CONTENT,{snapshot,streams:randomStreams(86)}),f=fixture(),cue=vi.spyOn(f.layer,'cue').mockReturnValue(true);f.layer.apply({...f.settings,muted:true});
  f.layer.observe(projectContent(s),true);s.interactions.uses['s2:infirmary']=1;s.ultimate.overflow=8;s.harness.ready=true;s.protocol.hit(s.enemies.active[0],.05);s.additionalDamage.laser={echo:5,mark:0};s.projectRelics.acquire('s2:bufferBadge');s.events.start('s2:openLab');f.layer.observe(projectContent(s),true);
  const called=cue.mock.calls.map(c=>c[0]);for(const id of ['contract-s2-project','shot-s2-drone','contract-s2-amendment','shot-s2-spool','event-s2-openLab'])expect(called).toContain(id);
  for(const id of S2_IDS.weapons)f.layer.event({type:'shot',x:0,y:0,color:0xffffff,size:1,weapon:id,evolved:true});f.layer.event({type:'warning',x:0,y:0,color:0xffffff,size:1,text:'预约落点',priority:true});f.layer.event({type:'boss',x:0,y:0,color:0xffffff,size:1,text:'阶段 3'});expect(cue.mock.calls.some(([id,category])=>id==='warning-s2-reservation'&&category==='hurt')).toBe(true);
  f.layer.dispose();s.dispose();
 });
});
