/** Exercise the audit on a disposable copy; never edit the real frozen sources. */
import {cpSync,mkdtempSync,readFileSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const root=process.cwd(),temporary=mkdtempSync(join(tmpdir(),'campus-s1-rejection-'));
try{
 for(const path of ['src','scripts','freeze','package.json','package-lock.json'])cpSync(resolve(root,path),join(temporary,path),{recursive:true});
 symlinkSync(resolve(root,'.git'),join(temporary,'.git'),'dir');
 const file=join(temporary,'src/fx/feedback.ts'),source=readFileSync(file,'utf8');
 if(!source.includes('Math.min(2,'))throw Error('Expected pinned HitStopBudget boundary');
 writeFileSync(file,source.replace('Math.min(2,','Math.min(3,'));
 const output=join(temporary,'report.json'),result=spawnSync(process.execPath,[join(root,'scripts/verify-s1-frozen.mjs'),temporary,output],{encoding:'utf8'});
 const report=JSON.parse(readFileSync(output,'utf8'));
 if(result.status!==1||report.passed||!report.checks.some(c=>c.name==='original 46-file audit'&&c.passed)||!report.checks.some(c=>c.name==='src/fx/feedback.ts'&&!c.passed))throw Error(`Tamper was not rejected correctly: ${result.stdout} ${result.stderr}`);
 console.log('Disposable numeric tamper rejected; original 46-file audit still passes, exact dependency hash fails.');
}finally{rmSync(temporary,{recursive:true,force:true});}
