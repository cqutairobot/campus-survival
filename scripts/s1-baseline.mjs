import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {posix} from 'node:path';
import {stripTypeScriptTypes} from 'node:module';

export const S1_COMMIT='08722a5cc69b6eb166d04aeb6e09f99d5fc6615b';
export const V3_COMMIT='7085e4c78794372a9c25d5a546a5696a8c23cebe';
export const sha256=source=>createHash('sha256').update(source).digest('hex');
export const gitSource=(root,commit,file)=>execFileSync('git',['show',`${commit}:${file}`],{cwd:root,maxBuffer:8*1024*1024});
export function frozenFiles(read){
 const source=read('scripts/verify-v4-frozen.mjs').toString();
 return JSON.parse(source.match(/const EXPECTED_FILES=(\[[\s\S]*?\]);/)[1]);
}
const javascript=(source)=>stripTypeScriptTypes(source.toString(),{mode:'transform',disableExperimentalWarning:true});
const staticImports=/^\s*(?:import|export)\s+(?:[^;\n]*?\s+from\s+)?['"](\.[^'"]+)['"]/gm;
export function imports(file,source){
 return [...javascript(source).matchAll(staticImports)].map(match=>posix.normalize(posix.join(posix.dirname(file),match[1]))+'.ts');
}
export function runtimeClosure(files,read){
 const visited=new Set();
 const visit=file=>{if(visited.has(file))return;visited.add(file);for(const dep of imports(file,read(file)))visit(dep);};
 files.forEach(visit);return [...visited].sort();
}
// Evaluate only pinned local data modules, with type imports erased. No engine is started.
export async function catalogSnapshot(read){
 const cache=new Map();
 const url=file=>{
  if(cache.has(file))return cache.get(file);
  const code=javascript(read(file)).replace(staticImports,(declaration,spec)=>declaration.replace(spec,url(posix.normalize(posix.join(posix.dirname(file),spec))+'.ts')));
  const value='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(file,value);return value;
 };
 const entries={
  'src/data/catalog.ts':['WEAPONS','PASSIVES','CHARACTERS','TALENTS','ENEMIES','BOSS_WEEKS','CHEST_WEEKS','WEEK_SECONDS','RARITY_MULTIPLIERS','CONTENT_VERSION'],
  'src/data/fusions.ts':['FUSIONS'],'src/data/relics.ts':['RELICS'],'src/data/achievements.ts':['ACHIEVEMENTS'],
  'src/data/daily.ts':['DAILY_RULES','DAILY_RULES_VERSION','RULES_VERSION'],
  'src/data/waves.ts':['NORMAL_IDS','WAVE_WEIGHTS','WEEK_GROUP','SPAWN_RATES'],
  'src/data/pickups.ts':['PICKUPS'],'src/data/ultimates.ts':['ULTIMATES'],
  'src/world/campus.ts':['WORLD_SIZE','BUILDINGS','ZONES'],'src/world/events.ts':['EVENT_DEFS'],
 };
 // IDs and numeric trees are reviewable; full data digests also pin names/recipes/tags.
 const numeric=value=>{
  if(typeof value==='number')return value;
  if(Array.isArray(value))return value.map(numeric);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).flatMap(([k,v])=>k==='id'?[[k,v]]:typeof v==='number'||v&&typeof v==='object'?[[k,numeric(v)]]:[]));
  return null;
 };
 const snapshot={};
 for(const [file,names] of Object.entries(entries)){
  const module=await import(url(file));
  snapshot[file]=Object.fromEntries(names.map(name=>{
   const value=module[name];return [name,{sha256:sha256(JSON.stringify(value)),...(Array.isArray(value)&&value.every(v=>v?.id)?{ids:value.map(v=>v.id)}:{}),values:numeric(value)}];
  }));
 }
 return snapshot;
}

export async function baselineManifest(root){
 const read=file=>gitSource(root,S1_COMMIT,file),files=frozenFiles(read),closure=runtimeClosure(files,read),pkg=JSON.parse(read('package.json'));
 return {sourceCommit:S1_COMMIT,v3Commit:V3_COMMIT,frozenFiles:files,
  runtimeFiles:Object.fromEntries(closure.map(file=>[file,sha256(read(file))])),
  auditFiles:Object.fromEntries(['scripts/verify-v4-frozen.mjs','scripts/v4.0.1-gameplay-exceptions.json'].map(file=>[file,sha256(read(file))])),
  dependencies:pkg.dependencies,devDependencies:pkg.devDependencies,lockSha256:sha256(read('package-lock.json')),catalog:await catalogSnapshot(read)};
}
