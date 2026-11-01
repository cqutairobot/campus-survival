import {describe,it,expect} from 'vitest';
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
import {PROPOSAL_BOARD} from '../../src/semesters/s2/proposal-board';
const sha=(file:string)=>createHash('sha256').update(readFileSync(file)).digest('hex');
const json=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const bindings=S2_ART_BINDINGS as Record<string,{icon:ResourceId;detail?:ResourceId}>;
const frames=S2_ART_FRAMES as Record<string,{atlas:ResourceId;frame:readonly number[];white?:readonly number[];whiteAtlas?:ResourceId}>;
describe('v5 first-chapter art contracts',()=>{
 it('covers every first-chapter actor/item/evolution/building/landmark with real files and in-bounds atlas frames, while preserving the oldS1 asset catalog and paths',()=>{
  expect(Object.keys(artManifest).some(id=>id.startsWith('s2:'))).toBe(false);expect(artUrl('homework')).toContain('assets/art/v4/enemies/homework.webp');
  for(const id of [...FIRST_CHAPTER_ENEMIES.map(e=>e.id),PROPOSAL_BOARD.id,'s2:drone','s2:whiteboard','s2:drone:evolved','s2:whiteboard:evolved','s2:infirmary','s2:jointTable','s2:glassLink','s2:networkHub'])expect(bindings[id],id).toBeDefined();
  for(const [id,a] of Object.entries(S2_ART_MANIFEST)){expect(id.startsWith('s2:')).toBe(true);expect(a.placeholder).toBe(false);expect(resourceManifest[id as ResourceId]).toEqual(a);for(const ext of ['webp','png'])expect(existsSync(`public/${a.root}/${a.path}.${ext}`)).toBe(true);}
  for(const [id,frame] of Object.entries(frames)){const a=resourceManifest[frame.atlas],png=readFileSync(`public/${'root'in a?a.root:'assets/art/v4'}/${a.path}.png`),width=png.readUInt32BE(16),height=png.readUInt32BE(20);for(const rect of [frame.frame,...(frame.white?[frame.white]:[])]){expect(rect[0]+rect[2],id).toBeLessThanOrEqual(width);expect(rect[1]+rect[3],id).toBeLessThanOrEqual(height);}expect(png[25]).toBe(6);}
  const source=new TextureSource({width:256,height:24}),oldSource=new TextureSource({width:256,height:24}),atlas=new Texture({source}),oldAtlas=new Texture({source:oldSource}),textures=new TextureCatalog({get:()=>Texture.EMPTY},new Map([['s2:particle-atlas',atlas],['particles',oldAtlas]]),'balanced',S2_CONTENT);
  for(const kind of ['spark','paper','key','code','smoke','ice','glass','metal','blueprint','brick']){const texture=textures.get(`fragment-${kind}`);expect(texture.source).toBe(source);expect(texture.width).toBe(24);}
  resources.forceMissing('s2:particle-atlas',true);expect(textures.get('fragment-spark').source).toBe(oldSource);resources.forceMissing('s2:particle-atlas',false);textures.destroy();atlas.destroy(true);oldAtlas.destroy(true);
 });
 it('retains12 independent AI masters and two actual CC0 source files, alpha/anchors/prompts/model visibility and SHA256 provenance for every deployed derivative; no source master is shipped',()=>{
  const ledger=json('art-src/s2/ledger.json'),ai=ledger.assets.filter((a:any)=>a.sourceType==='ai'),cc0=ledger.assets.filter((a:any)=>a.sourceType==='cc0');expect(ledger.sampleOnly).toBe(false);expect(ledger.missing).toEqual([]);expect(ai).toHaveLength(12);expect(cc0).toHaveLength(2);
  for(const a of ai){expect(sha(a.master)).toBe(a.masterSha256);expect(sha(a.raw)).toBe(a.rawSha256);expect(a.alphaExtrema).toEqual([0,255]);expect(a.anchor).toHaveLength(2);expect(a.prompt).toContain('Transparent background');expect(a.model).toContain('not exposed');expect(a.license).toContain('no CC0 claim');expect(a.outputs.length).toBeGreaterThan(0);expect(sha(a.reference.file)).toBe(a.reference.sha256);const bytes=readFileSync(a.master);expect([bytes.readUInt32BE(16),bytes.readUInt32BE(20)]).toEqual(a.masterSize);}
  for(const a of cc0){expect(sha(a.sourceFile)).toBe(a.sha256);expect(sha(a.licenseFile)).toBe(a.licenseSha256);expect(readFileSync(a.licenseFile,'utf8')).toContain('Creative Commons Zero');}
  for(const o of ledger.outputs){expect(o.file).toMatch(/^public\/assets\/art\/v5\/s2\//);expect(sha(o.file)).toBe(o.sha256);expect(o.bytes).toBe(readFileSync(o.file).byteLength);expect(o.file).not.toContain('/masters/');}
  const deployed=new Set(ledger.assets.flatMap((a:any)=>a.outputs.map((o:any)=>o.file)));expect(deployed.size).toBe(ledger.outputs.length);expect(existsSync('docs/v5-p18-sample.png')).toBe(true);expect(existsSync('docs/v5-art-prompts.md')).toBe(true);
 });
 it('uses the SAME six-slot lease queue for new aliases, WebP→PNG retry, total failure fallback, shared ownership and aborted late results',async()=>{
  let active=0,peak=0;const calls:string[]=[],unloaded:string[]=[];const loader=new ResourceLoader({init:async()=>{},load:async source=>{calls.push(source);active++;peak=Math.max(peak,active);try{await new Promise(r=>setTimeout(r,1));if(source.includes('atlases/landmarks')||source.includes('atlases/enemies.webp'))throw Error('fixture unavailable');return Texture.EMPTY;}finally{active--;}},unload:async source=>{unloaded.push(source);}});
  const lease=await loader.loadIds(Object.keys(S2_ART_MANIFEST) as ResourceId[]);expect(peak).toBeLessThanOrEqual(6);expect(calls.filter(s=>s.includes('atlases/enemies.webp'))).toHaveLength(2);expect(calls.some(s=>s.includes('atlases/enemies.png'))).toBe(true);expect(lease.textures.has('s2:enemy-atlas')).toBe(true);expect(lease.textures.has('s2:landmark-atlas')).toBe(false);expect(loader.failures.has('s2:landmark-atlas')).toBe(true);
  const second=await loader.loadIds(['s2:enemy-atlas']);lease.release();await loader.dispose();expect(loader.debug.references).toBe(1);expect(unloaded.some(s=>s.includes('atlases/enemies.png'))).toBe(false);second.release();await loader.dispose();expect(loader.debug).toEqual({entries:0,references:0,textures:0,loading:0,waiting:0});
  let complete!:(value:Texture)=>void;const late=new ResourceLoader({init:async()=>{},load:()=>new Promise<Texture>(resolve=>{complete=resolve;}),unload:async()=>{}}),abort=new AbortController(),pending=late.loadIds(['s2:item-atlas'],abort.signal);await new Promise(r=>setTimeout(r,0));abort.abort();complete(Texture.EMPTY);const cancelled=await pending;expect(cancelled.textures.size).toBe(0);cancelled.release();await late.dispose();expect(late.debug.references).toBe(0);expect(late.debug.entries).toBe(0);
 });
});
