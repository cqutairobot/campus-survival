import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,relative,join} from 'node:path';
import {stripTypeScriptTypes} from 'node:module';
import {createHash} from 'node:crypto';
export const S2_FREEZE_ENTRIES=[
 'src/semesters/s2/createRun.ts','src/semesters/s2/settlement.ts','src/semesters/s2/daily.ts','src/semesters/s2/rating.ts','src/semesters/s2/achievements.ts','src/semesters/inheritance.ts','src/save/v5/profile.ts','src/save/v5/repository.ts','src/semesters/s2/release.ts',
];
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function semesterTwoClosure(root,entries=S2_FREEZE_ENTRIES,read=file=>readFileSync(resolve(root,file))){
 const visited=new Set();
 const visit=file=>{
  if(visited.has(file))return;visited.add(file);if(file.endsWith('.json')||file.endsWith('.css'))return;
  const source=stripTypeScriptTypes(read(file).toString(),{mode:'transform',disableExperimentalWarning:true});
  const imports=/^\s*(?:import|export)\s+(?:[^;]*?\s+from\s*)?['"](\.[^'"]+)['"]/gm;
  for(const [,specifier] of source.matchAll(imports)){
   const base=resolve(root,dirname(file),specifier),found=[base,base+'.ts',base+'.tsx',base+'.json',join(base,'index.ts')].find(path=>existsSync(path)&&statSync(path).isFile());
   if(!found)throw Error(`Unresolved S2 runtime dependency: ${file} -> ${specifier}`);
   const path=relative(root,found).replaceAll('\\','/');if(path.startsWith('../'))throw Error('S2 dependency outside repository');visit(path);
  }
 };
 entries.forEach(visit);return [...visited].sort();
}
export function semesterCatalogSnapshot(content){
 const groups=['weapons','passives','fusions','enemies','relics','characters','pickups','ultimates'],rows=Object.fromEntries(groups.map(name=>[name,content[name]]));rows.rarityMultipliers=content.rarityMultipliers;rows.waves=content.waves;
 return{counts:Object.fromEntries(groups.map(name=>[name,content[name].length])),ids:Object.fromEntries(groups.map(name=>[name,content[name].map(a=>a.id)])),dataSha256:sha256(JSON.stringify(rows))};
}
export async function currentSemesterMetadata(root){
 const {createServer}=await import('vite');const server=await createServer({configFile:false,root,server:{middlewareMode:true},appType:'custom',logLevel:'error'});
 try{const {S2_CONTENT}=await server.ssrLoadModule('/src/semesters/s2/content.ts'),{S2_RELEASE_VERSIONS}=await server.ssrLoadModule('/src/semesters/s2/release.ts'),{S2_RUNTIME_CONFIG}=await server.ssrLoadModule('/src/semesters/s2/config.ts'),{S2_SCORE_TABLE}=await server.ssrLoadModule('/src/semesters/s2/daily.ts');return{versions:S2_RELEASE_VERSIONS,catalog:semesterCatalogSnapshot(S2_CONTENT),calendar:S2_RUNTIME_CONFIG.calendar,scoring:S2_SCORE_TABLE};}finally{await server.close();}
}
export function auditSemesterTwo(root,pin,metadata,read=file=>readFileSync(resolve(root,file))){
 const checks=[],check=(name,passed)=>checks.push({name,passed});
 check('explicit S2 entrypoints',JSON.stringify(pin.entrypoints)===JSON.stringify(S2_FREEZE_ENTRIES));
 const closure=semesterTwoClosure(root,S2_FREEZE_ENTRIES,read);check('exact S2 gameplay dependency closure',JSON.stringify(closure)===JSON.stringify(Object.keys(pin.runtimeFiles)));
 for(const [file,hash] of Object.entries(pin.runtimeFiles))check(file,sha256(read(file))===hash);
 for(const name of ['versions','catalog','calendar','scoring'])check(`S2 ${name}`,JSON.stringify(pin[name])===JSON.stringify(metadata[name]));
 check('dependencies and lock unchanged',sha256(read('package.json'))===pin.packageSha256&&sha256(read('package-lock.json'))===pin.lockSha256);
 return{version:'s2-freeze-v1',passed:checks.every(c=>c.passed),checks};
}
