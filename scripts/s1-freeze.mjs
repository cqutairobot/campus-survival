import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runtimeClosure,catalogSnapshot,sha256,gitSource,S1_COMMIT} from './s1-baseline.mjs';
export const S1_ACTIVE_BASELINE='freeze/s1-v5.0.4.json';
export async function auditCurrentS1(root,pin){
 const read=file=>readFileSync(resolve(root,file)),checks=[],check=(name,passed)=>checks.push({name,passed});
 const original=JSON.parse(read('freeze/s1-v4.0.1.json'));
 check('S1 entrypoints preserved',JSON.stringify(pin.entrypoints)===JSON.stringify(original.frozenFiles));
 const closure=runtimeClosure(original.frozenFiles,read);
 check('exact current S1 closure',JSON.stringify(closure)===JSON.stringify(Object.keys(pin.runtimeFiles)));
 for(const [file,hash] of Object.entries(pin.runtimeFiles))check(file,sha256(read(file))===hash);
 check('S1 current catalog',JSON.stringify(await catalogSnapshot(read))===JSON.stringify(pin.catalog));
 check('S1 explicit version and provenance',/^s1-v\d+\.\d+\.\d+$/.test(pin.baselineVersion)&&!!pin.provenance?.trim()&&/^[a-f0-9]{40}$/.test(pin.predecessor?.sourceCommit??''));
 let predecessor=pin.predecessor,valid=!!predecessor;const seen=new Set();
 while(predecessor){if(!/^freeze\/s1-v\d+\.\d+\.\d+\.json$/.test(predecessor.file)||seen.has(predecessor.file)){valid=false;break;}seen.add(predecessor.file);const raw=read(predecessor.file);if(sha256(raw)!==predecessor.sha256){valid=false;break;}predecessor=JSON.parse(raw).predecessor;}
 check('S1 preserved predecessor chain',valid);
 const pkg=JSON.parse(read('package.json'));check('S1 dependency versions',JSON.stringify(pkg.dependencies)===JSON.stringify(original.dependencies)&&JSON.stringify(pkg.devDependencies)===JSON.stringify(original.devDependencies));
 if(pin.productVersion){
  const locked=JSON.parse(read('package-lock.json')),historical=JSON.parse(gitSource(root,S1_COMMIT,'package-lock.json'));
  check('reviewed product metadata bytes',pkg.version===pin.productVersion&&locked.version===pkg.version&&locked.packages[''].version===pkg.version&&sha256(read('package.json'))===pin.packageSha256&&sha256(read('package-lock.json'))===pin.lockSha256);
  // Only the two root product version fields may differ. Every dependency,
  // resolution, integrity, platform entry and package property stays pinned.
  locked.version=historical.version;locked.packages[''].version=historical.packages[''].version;
  check('S1 resolved dependencies unchanged',JSON.stringify(locked)===JSON.stringify(historical));
 }else check('S1 lockfile',sha256(read('package-lock.json'))===original.lockSha256);
 return checks;
}
