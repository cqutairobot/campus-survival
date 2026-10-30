import {describe,it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Texture,TextureSource} from 'pixi.js';
import {CHARACTERS,WEAPONS,PASSIVES,ENEMIES} from '../../src/data/catalog';
import {FUSIONS} from '../../src/data/fusions';
import {RELICS} from '../../src/data/relics';
import {PICKUPS} from '../../src/data/pickups';
import {ULTIMATES} from '../../src/data/ultimates';
import {BUILDINGS,ZONES} from '../../src/world/campus';
import {characterArt,itemArt,enemyArt,buildingArt,buildingKeys,landmarkArt} from '../../src/assets/bindings';
import {artManifest,type ArtId} from '../../src/assets/manifest';
import {ENEMY_MATERIALS,enemyMaterial} from '../../src/presentation/materials';
import {attackFeel,WEAPON_FEEDBACK,ULTIMATE_FEEDBACK} from '../../src/presentation/weapon-feedback';
import {feedbackProfile} from '../../src/presentation/profiles';
import {buildingPlacement,fitArtScale,enemyArtSize} from '../../src/presentation/art-layout';
import {DeathFX,deathStyle} from '../../src/fx/DeathFX';
import type {VisualEvent} from '../../src/types';
const hit:VisualEvent={type:'hit',x:100,y:120,size:12,color:0xffffff,weapon:'knife'};
const death:VisualEvent={...hit,type:'death',size:24,enemyKind:'homework',rank:'normal'};
const json=(path:string)=>JSON.parse(readFileSync(path,'utf8'));

describe('v4 P1 asset coverage and presentation contracts',()=>{
 it('binds every existing content ID and every generated WebP/PNG fallback to a finite resource bundle',()=>{
  expect(Object.keys(characterArt).sort()).toEqual(CHARACTERS.map(c=>c.id).sort());
  expect(Object.keys(enemyArt).sort()).toEqual(ENEMIES.map(e=>e.id).sort());
  expect(Object.keys(itemArt).sort()).toEqual([...WEAPONS,...PASSIVES,...FUSIONS,...RELICS,...PICKUPS,...ULTIMATES].map(d=>d.id).sort());
  expect(buildingKeys).toHaveLength(BUILDINGS.length);expect(Object.keys(landmarkArt).sort()).toEqual(ZONES.map(z=>z.id).sort());
  for(const id of [...buildingKeys.map(k=>buildingArt[k]),...Object.values(characterArt).flatMap(c=>Object.values(c)),...Object.values(enemyArt).flatMap(c=>Object.values(c)),...Object.values(itemArt)] as ArtId[])expect(artManifest[id]).toBeDefined();
  for(const art of Object.values(artManifest)){
   expect(existsSync(`public/assets/art/v4/${art.path}.webp`),art.path).toBe(true);
   if(art.pngFallback)expect(existsSync(`public/assets/art/v4/${art.path}.png`),art.path+'.png').toBe(true);
  }
  expect(artManifest.menuPortrait.path).toBe('ui/menu-campus-portrait');
  expect(artManifest['enemy-finals'].bundle).toBe('boss-finals');
  expect(artManifest['character-coder-portrait'].bundle).toBe('codex-extra');
 });
 it('preserves original AI metadata and credits every deployed bitmap and audio output',()=>{
  const metadata=json('art-src/ai/metadata.json'),sources=json('docs/v4-ai-sources.json'),artBuild=json('docs/v4-art-build.json'),audio=json('docs/v4-audio-build.json'),credits=json('src/assets/attributions.json');
  expect(sources).toHaveLength(137);expect(json('public/licenses/attributions.json')).toEqual(credits);
  const ai=credits.find((e:{id:string})=>e.id==='user-ai');expect(ai.files).toHaveLength(137);
  const outputs=credits.flatMap((e:{files:{output:string}[]})=>e.files.flatMap(f=>f.output.split(' / ')));
  for(const source of sources){
   const relative=source.file.replace('art-src/ai/','');expect(source.metadata).toEqual(metadata[relative]??null);
   expect(source.sha256).toBe(createHash('sha256').update(readFileSync(source.file)).digest('hex'));
   expect(ai.files.find((f:{original:string})=>f.original===source.file)?.sha256).toBe(source.sha256);
   if(!source.metadata)expect(ai.files.find((f:{original:string})=>f.original===source.file).generation.tool).toBe('未提供');
  }
  for(const file of artBuild)expect(outputs,file.file).toContain(file.file);
  for(const record of audio)for(const ext of ['ogg','mp3'])expect(outputs).toContain(`assets/audio/v4/${record.output}.${ext}`);
 });
 it('aligns decorative building plinths to unchanged collision rectangles and keeps art proportions',()=>{
  for(const rect of BUILDINGS){const before={...rect},image={width:512,height:371},p=buildingPlacement(Object.freeze({...rect}),image);
   expect(p.base).toEqual({x:rect.x,y:rect.y,w:rect.w,h:rect.h});expect(p.x).toBe(rect.x);expect(p.y+p.height).toBeCloseTo(rect.y+rect.h);expect(p.width/p.height).toBeCloseTo(image.width/image.height);expect(rect).toEqual(before);
  }
  expect(fitArtScale({width:128,height:128},enemyArtSize(24))*128).toBeCloseTo(fitArtScale({width:256,height:256},enemyArtSize(24))*256);
 });
 it('covers all weapons, evolved weapons, fusions and ultimates without changing their logical payload',()=>{
  expect(Object.keys(WEAPON_FEEDBACK).sort()).toEqual([...WEAPONS,...FUSIONS].map(w=>w.id).sort());
  expect(Object.keys(ULTIMATE_FEEDBACK).sort()).toEqual(ULTIMATES.map(u=>u.id).sort());
  for(const weapon of [...WEAPONS,...FUSIONS]){
   const event={...hit,weapon:weapon.id},copy=structuredClone(event),base=attackFeel(event),evolved=attackFeel({...event,evolved:true});
   expect(evolved.radius).toBeGreaterThan(base.radius);expect(feedbackProfile(event)?.frames).toBe(1);expect(feedbackProfile({...event,critical:true})?.frames).toBe(2);expect(event).toEqual(copy);
  }
  expect(attackFeel({...hit,weapon:undefined,sourceKey:'ultimate:barrier'})).toEqual(ULTIMATE_FEEDBACK.barrier);
 });
 it('uses each enemy material, restrained fragments, elite silhouettes and bounded boss timing',()=>{
  expect(Object.keys(ENEMY_MATERIALS).sort()).toEqual(ENEMIES.map(e=>e.id).sort());
  for(const enemy of ENEMIES)expect(deathStyle({...death,enemyKind:enemy.id},'high',true).material).toBe(enemyMaterial(enemy.id));
  const paper=deathStyle(death,'high',true),metal=deathStyle({...death,enemyKind:'guard'},'high',true),glass=deathStyle({...death,enemyKind:'node'},'high',true),energy=deathStyle({...death,enemyKind:'coding'},'high',true);
  expect(paper.count).toBeGreaterThanOrEqual(4);expect(paper.count).toBeLessThanOrEqual(8);expect(metal.count).toBeGreaterThan(paper.count);expect(glass.count).toBeGreaterThan(metal.count);expect(glass.speed).toBeGreaterThan(metal.speed);expect(energy.dissolve).toBe(true);
  expect(deathStyle({...death,rank:'elite'},'high',true).silhouette).toBe(.05);
  const boss=deathStyle({...death,rank:'boss'},'high',true);expect(boss.life+boss.silhouette).toBeLessThan(.75);
  expect(deathStyle(death,'low',false)).toMatchObject({count:1,silhouette:0,life:.18});
 });
 it('releases independent death snapshots while keeping shared texture sources alive',()=>{
  const source=new TextureSource({width:128,height:128}),texture=new Texture({source}),fx=new DeathFX(),event={...death,slot:5,generation:1};
  fx.spawn(event,texture,.03,'high',true);event.x=900;event.generation=2;
  expect(fx.active).toBe(1);expect(fx.container.children.length).toBe(6);
  fx.update(.01,true);expect(fx.container.children[0].x).toBeLessThan(200);
  fx.update(1,true);expect(fx.active).toBe(0);expect(fx.container.children).toHaveLength(0);expect(source.destroyed).toBe(false);
  fx.spawn(death,texture,0,'high',false);fx.clear();expect(fx.active).toBe(0);expect(source.destroyed).toBe(false);texture.destroy(true);
 });
});
