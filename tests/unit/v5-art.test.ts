import {describe,it,expect,vi} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Texture,TextureSource} from 'pixi.js';
import {TextureCatalog} from '../../src/semesters/s2/presentation/TextureCatalog';
import {S2_CONTENT} from '../../src/semesters/s2/content';
import {resources} from '../../src/assets/loader';
import {ResourceLoader} from '../../src/assets/loader';
import {artManifest,resourceManifest,artUrl,type ResourceId} from '../../src/assets/manifest';
import {S2_ART_MANIFEST,S2_ART_BINDINGS,S2_ART_FRAMES} from '../../src/semesters/s2/presentation/art-manifest';
import {FIRST_CHAPTER_ENEMIES} from '../../src/semesters/s2/first-chapter';
import {S2_ENEMY_ART,semesterArtBundles} from '../../src/semesters/s2/presentation/art-loading';
import {S2_IDS} from '../../src/semesters/catalog-ids';
import {PROPOSAL_BOARD} from '../../src/semesters/s2/proposal-board';
const sha=(file:string)=>createHash('sha256').update(readFileSync(file)).digest('hex');
const json=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const bindings=S2_ART_BINDINGS as Record<string,{icon:ResourceId;detail?:ResourceId}>;
const frames=S2_ART_FRAMES as Record<string,{atlas:ResourceId;frame:readonly number[];white?:readonly number[];whiteAtlas?:ResourceId}>;
describe('v5 first-chapter art contracts',()=>{
 it('immediately cancels consumers, preserves shared owners, bounds hung loads and reclaims late generations',async()=>{
  vi.useFakeTimers();
  const gates:{source:string;signal?:AbortSignal;resolve:(texture:Texture)=>void}[]=[],unload=vi.fn(async()=>{});
  const backend={init:async()=>{},load:(source:string,signal?:AbortSignal)=>new Promise<Texture>(resolve=>gates.push({source,signal,resolve})),unload};
  try{
   const loader=new ResourceLoader(backend,10),abort=new AbortController();
   const first=loader.loadIds(['s2:item-atlas'],abort.signal),second=loader.loadIds(['s2:item-atlas']);await vi.advanceTimersByTimeAsync(0);
   expect(gates).toHaveLength(1);expect(loader.debug.references).toBe(2);let cancelled=false;void first.then(()=>{cancelled=true;});
   abort.abort();await vi.advanceTimersByTimeAsync(0);expect(cancelled).toBe(true);expect(loader.debug.references).toBe(1);expect(gates[0].signal?.aborted).toBe(false);
   gates[0].resolve(Texture.EMPTY);const held=await second;expect(held.textures.size).toBe(1);await loader.dispose();expect(unload).not.toHaveBeenCalled();held.release();held.release();await loader.dispose();expect(loader.debug).toEqual({entries:0,references:0,textures:0,loading:0,waiting:0});

   gates.length=0;unload.mockClear();const gone=new AbortController(),pending=loader.loadIds(['s2:item-atlas'],gone.signal);await vi.advanceTimersByTimeAsync(0);gone.abort();await pending;await loader.dispose();expect(loader.debug).toEqual({entries:0,references:0,textures:0,loading:0,waiting:0});expect(gates[0].signal?.aborted).toBe(true);
   const replacement=loader.loadIds(['s2:item-atlas']);await vi.advanceTimersByTimeAsync(0);gates[0].resolve(Texture.EMPTY);await vi.advanceTimersByTimeAsync(0);expect(unload).not.toHaveBeenCalled();gates[1].resolve(Texture.EMPTY);const lease=await replacement;expect(lease.textures.size).toBe(1);lease.release();await loader.dispose();expect(unload).toHaveBeenCalledTimes(1);

   gates.length=0;unload.mockClear();const timeout=loader.loadIds(['s2:item-atlas']);await vi.advanceTimersByTimeAsync(20);expect(gates).toHaveLength(3);expect(gates[2].source).toMatch(/\.png$/);gates[2].resolve(Texture.EMPTY);const fallback=await timeout;expect(fallback.textures.size).toBe(1);gates[0].resolve(Texture.EMPTY);gates[1].resolve(Texture.EMPTY);await vi.advanceTimersByTimeAsync(0);expect(unload).toHaveBeenCalledWith(gates[0].source);expect(unload).not.toHaveBeenCalledWith(gates[2].source);fallback.release();await loader.dispose();
   const exhausted=loader.loadIds(['s2:item-atlas']);await vi.advanceTimersByTimeAsync(40);const empty=await exhausted;expect(empty.textures.size).toBe(0);empty.release();expect(loader.failures.has('s2:item-atlas')).toBe(true);await loader.dispose();expect(loader.debug.loading).toBe(0);

   gates.length=0;const controllers=Array.from({length:7},()=>new AbortController()),queued=(Object.keys(artManifest).slice(0,7) as ResourceId[]).map((id,n)=>loader.loadIds([id],controllers[n].signal));await vi.advanceTimersByTimeAsync(0);expect(loader.debug).toMatchObject({loading:6,waiting:1,references:7});controllers.forEach(c=>c.abort());await Promise.all(queued);await loader.dispose();expect(loader.debug).toEqual({entries:0,references:0,textures:0,loading:0,waiting:0});gates.forEach(g=>g.resolve(Texture.EMPTY));await vi.advanceTimersByTimeAsync(0);

   const initGate=new ResourceLoader({...backend,init:()=>new Promise(()=>{})},10),initAbort=new AbortController(),initializing=initGate.loadIds(['s2:item-atlas'],initAbort.signal);let stopped=false;void initializing.then(()=>{stopped=true;});initAbort.abort();await vi.advanceTimersByTimeAsync(0);expect(stopped).toBe(true);await vi.advanceTimersByTimeAsync(10);await initGate.dispose();
  }finally{vi.useRealTimers();}
 });
 it('covers every first-chapter actor/item/evolution/building/landmark with real files and in-bounds atlas frames, while preserving the oldS1 asset catalog and paths',()=>{
  expect(Object.keys(artManifest).some(id=>id.startsWith('s2:'))).toBe(false);expect(artUrl('homework')).toContain('assets/art/v4/enemies/homework.webp');
  for(const id of [...FIRST_CHAPTER_ENEMIES.map(e=>e.id),PROPOSAL_BOARD.id,'s2:drone','s2:whiteboard','s2:drone:evolved','s2:whiteboard:evolved','s2:infirmary','s2:jointTable','s2:glassLink','s2:networkHub'])expect(bindings[id],id).toBeDefined();
  for(const [id,a] of Object.entries(S2_ART_MANIFEST)){expect(id.startsWith('s2:')).toBe(true);expect(a.placeholder).toBe(false);expect(resourceManifest[id as ResourceId]).toEqual(a);for(const ext of ['webp','png'])expect(existsSync(`public/${a.root}/${a.path}.${ext}`)).toBe(true);}
  for(const [id,frame] of Object.entries(frames)){const a=resourceManifest[frame.atlas],png=readFileSync(`public/${'root'in a?a.root:'assets/art/v4'}/${a.path}.png`),width=png.readUInt32BE(16),height=png.readUInt32BE(20);for(const rect of [frame.frame,...(frame.white?[frame.white]:[])]){expect(rect[0]+rect[2],id).toBeLessThanOrEqual(width);expect(rect[1]+rect[3],id).toBeLessThanOrEqual(height);}expect(png[25]).toBe(6);}
  const source=new TextureSource({width:256,height:24}),oldSource=new TextureSource({width:256,height:24}),atlas=new Texture({source}),oldAtlas=new Texture({source:oldSource}),textures=new TextureCatalog({get:()=>Texture.EMPTY},new Map([['s2:particle-atlas',atlas],['particles',oldAtlas]]),'balanced',S2_CONTENT);
  for(const kind of ['spark','paper','key','code','smoke','ice','glass','metal','blueprint','brick']){const texture=textures.get(`fragment-${kind}`);expect(texture.source).toBe(source);expect(texture.width).toBe(24);}
  resources.forceMissing('s2:particle-atlas',true);expect(textures.get('fragment-spark').source).toBe(oldSource);resources.forceMissing('s2:particle-atlas',false);textures.destroy();atlas.destroy(true);oldAtlas.destroy(true);
 });
 it('retains42 independent AI masters and two actual CC0 source files, alpha/anchors/prompts/model visibility and SHA256 provenance for every deployed derivative; no source master is shipped',()=>{
  const ledger=json('art-src/s2/ledger.json'),ai=ledger.assets.filter((a:any)=>a.sourceType==='ai'),cc0=ledger.assets.filter((a:any)=>a.sourceType==='cc0');expect(ledger.sampleOnly).toBe(false);expect(ledger.missing).toEqual([]);expect(ai).toHaveLength(42);expect(cc0).toHaveLength(2);
  for(const a of ai){expect(sha(a.master)).toBe(a.masterSha256);expect(sha(a.raw)).toBe(a.rawSha256);expect(a.alphaExtrema).toEqual(a.key==='semester-cover'?[255,255]:[0,255]);expect(a.anchor).toHaveLength(2);expect(a.prompt).toContain(a.key==='semester-cover'?'Opaque campus':'Transparent background');expect(a.model).toContain('not exposed');expect(a.license).toContain('no CC0 claim');expect(a.outputs.length).toBeGreaterThan(0);expect(sha(a.reference.file)).toBe(a.reference.sha256);const bytes=readFileSync(a.master);expect([bytes.readUInt32BE(16),bytes.readUInt32BE(20)]).toEqual(a.masterSize);}
  for(const a of cc0){expect(sha(a.sourceFile)).toBe(a.sha256);expect(sha(a.licenseFile)).toBe(a.licenseSha256);expect(readFileSync(a.licenseFile,'utf8')).toContain('Creative Commons Zero');}
  for(const o of ledger.outputs){expect(o.file).toMatch(/^public\/assets\/art\/v5\/s2\//);expect(sha(o.file)).toBe(o.sha256);expect(o.bytes).toBe(readFileSync(o.file).byteLength);expect(o.file).not.toContain('/masters/');}
  const deployed=new Set(ledger.assets.flatMap((a:any)=>a.outputs.map((o:any)=>o.file)));expect(deployed.size).toBe(ledger.outputs.length);expect(existsSync('docs/v5-p18-sample.png')).toBe(true);expect(existsSync('docs/v5-art-prompts.md')).toBe(true);
 });
 it('covers all40 enemies and19 item masters, preserves P18 originals, and preloads regions without codex/detail/cover downloads',()=>{
  expect(S2_CONTENT.enemies).toHaveLength(40);expect(Object.keys(S2_ENEMY_ART)).toHaveLength(40);
  for(const e of S2_CONTENT.enemies){expect(S2_ENEMY_ART[e.id],e.id).toBeDefined();for(const id of Object.values(S2_ENEMY_ART[e.id]))expect(resourceManifest[id]).toBeDefined();}
  for(const id of [...S2_IDS.weapons,...S2_IDS.weapons.map(id=>id+':evolved'),...S2_IDS.fusions,...S2_IDS.passives,...S2_IDS.relics,...S2_IDS.interactions,'s2:jointLab','s2:exhibitHall','s2:cover'])expect(bindings[id],id).toBeDefined();
  for(const [file,hash] of Object.entries(json('art-src/s2/p18-preserved.json')))expect(sha(file),file).toBe(hash);
  for(const id of S2_IDS.regions){expect(bindings[id].icon).toMatch(/^s2:thumb-building-/);expect(bindings[id].detail).toMatch(/^s2:building-/);}
  expect(semesterArtBundles(1,{x:3072,y:3072})).toEqual([]);
  expect(semesterArtBundles(1,{x:5000,y:4480})).toContain('s2-chapter-2');
  expect(semesterArtBundles(1,{x:1408,y:4800})).toContain('s2-chapter-3');
  expect(semesterArtBundles(16,{x:3072,y:3072})).toEqual(['s2-chapter-2','s2-chapter-3']);
  const needed=semesterArtBundles(1,{x:3072,y:3072},[],['s2:printer','s2:battery']);expect(needed).toContain('s2-items-2');expect(needed).toContain('s2-items-1');
  expect(needed.some(b=>/codex|details|cover/.test(b))).toBe(false);
  expect(Object.values(S2_ART_MANIFEST).filter(a=>a.path.startsWith('icons/')&&a.path.endsWith('-192')).every(a=>a.bundle==='s2-details')).toBe(true);
 });
 it('uses the SAME six-slot lease queue for new aliases, WebP→PNG retry, total failure fallback, shared ownership and aborted late results',async()=>{
  let active=0,peak=0;const calls:string[]=[],unloaded:string[]=[];const loader=new ResourceLoader({init:async()=>{},load:async source=>{calls.push(source);active++;peak=Math.max(peak,active);try{await new Promise(r=>setTimeout(r,1));if(source.includes('atlases/landmarks')||source.includes('atlases/enemies.webp'))throw Error('fixture unavailable');return Texture.EMPTY;}finally{active--;}},unload:async source=>{unloaded.push(source);}});
  const lease=await loader.loadIds(Object.keys(S2_ART_MANIFEST) as ResourceId[]);expect(peak).toBeLessThanOrEqual(6);expect(calls.filter(s=>s.includes('atlases/enemies.webp'))).toHaveLength(2);expect(calls.some(s=>s.includes('atlases/enemies.png'))).toBe(true);expect(lease.textures.has('s2:enemy-atlas')).toBe(true);expect(lease.textures.has('s2:landmark-atlas')).toBe(false);expect(loader.failures.has('s2:landmark-atlas')).toBe(true);
  const second=await loader.loadIds(['s2:enemy-atlas']);lease.release();await loader.dispose();expect(loader.debug.references).toBe(1);expect(unloaded.some(s=>s.includes('atlases/enemies.png'))).toBe(false);second.release();await loader.dispose();expect(loader.debug).toEqual({entries:0,references:0,textures:0,loading:0,waiting:0});
  let complete!:(value:Texture)=>void;const late=new ResourceLoader({init:async()=>{},load:()=>new Promise<Texture>(resolve=>{complete=resolve;}),unload:async()=>{}}),abort=new AbortController(),pending=late.loadIds(['s2:item-atlas'],abort.signal);await new Promise(r=>setTimeout(r,0));abort.abort();complete(Texture.EMPTY);const cancelled=await pending;expect(cancelled.textures.size).toBe(0);cancelled.release();await late.dispose();expect(late.debug.references).toBe(0);expect(late.debug.entries).toBe(0);
 });
});
