/** v5 orchestrator: original v3 audit first, then exact v4.0.1 source/data/dependency checks. */
import {readFileSync,mkdirSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {S1_COMMIT,V3_COMMIT,sha256,gitSource,runtimeClosure,catalogSnapshot,baselineManifest} from './s1-baseline.mjs';
import {S1_ACTIVE_BASELINE,auditCurrentS1} from './s1-freeze.mjs';

const root=resolve(process.argv[2]??'.'),output=resolve(process.argv[3]??join(tmpdir(),'campus-s1-freeze.json'));
const pin=JSON.parse(readFileSync(resolve(root,'freeze/s1-v4.0.1.json'),'utf8'));
const read=file=>gitSource(root,S1_COMMIT,file),temporary=mkdtempSync(join(tmpdir(),'campus-s1-audit-'));
const checks=[];
const check=(name,ok)=>checks.push({name,passed:ok});
try{
 // Portable baseline materialization. Missing Git objects fail, never silently pass.
 const baseline=join(temporary,'v3');
 for(const file of pin.frozenFiles){const path=resolve(baseline,file);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,gitSource(root,V3_COMMIT,file));}
 const historical=join(temporary,'v401');
 for(const file of [...Object.keys(pin.runtimeFiles),...Object.keys(pin.auditFiles),'package.json','package-lock.json']){const path=resolve(historical,file);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,read(file));}
 execFileSync(process.execPath,[resolve(historical,'scripts/verify-v4-frozen.mjs'),baseline,join(temporary,'v3-audit.json')],{cwd:historical,stdio:'inherit'});
 check('original 46-file audit',true);
 check('pin comes from fixed Git baseline',pin.sourceCommit===S1_COMMIT&&pin.v3Commit===V3_COMMIT&&JSON.stringify(pin)===JSON.stringify(await baselineManifest(root)));
 for(const [file,hash] of Object.entries({...pin.runtimeFiles,...pin.auditFiles}))check(file,sha256(read(file))===hash);
 const closure=runtimeClosure(pin.frozenFiles,read);
 check('static S1 dependency closure',JSON.stringify(closure)===JSON.stringify(Object.keys(pin.runtimeFiles))&&!closure.some(file=>/\/semesters\/|\/s2\//.test(file)));
 check('S1 catalog IDs and numeric summaries',JSON.stringify(await catalogSnapshot(read))===JSON.stringify(pin.catalog));
 const pkg=JSON.parse(read('package.json'));
 check('dependency versions',JSON.stringify(pkg.dependencies)===JSON.stringify(pin.dependencies)&&JSON.stringify(pkg.devDependencies)===JSON.stringify(pin.devDependencies));
 check('lockfile',sha256(read('package-lock.json'))===pin.lockSha256);
 check('historical S1 pin bytes preserved',readFileSync(resolve(root,'freeze/s1-v4.0.1.json')).equals(gitSource(root,'f68ba71','freeze/s1-v4.0.1.json')));
 checks.push(...await auditCurrentS1(root,JSON.parse(readFileSync(resolve(root,S1_ACTIVE_BASELINE),'utf8'))));
}catch(error){checks.push({name:'audit execution',passed:false,error:error.message});}
finally{rmSync(temporary,{recursive:true,force:true});}
const report={sourceCommit:S1_COMMIT,passed:checks.every(c=>c.passed),checks};
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const failed of checks.filter(c=>!c.passed))console.error('S1 freeze rejected:',failed.name,failed.error??'');
console.log(`${checks.filter(c=>c.passed).length}/${checks.length} v5 S1 freeze checks passed`);
if(!report.passed)process.exitCode=1;
