import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {writeFileSync,existsSync,readFileSync} from 'node:fs';
const file=process.argv[2];if(!file||existsSync(file))throw Error('An unused explicit observation output path is required');
const server=await createServer({root:resolve(process.env.CAMPUS_AUDIT_ROOT??'.'),configFile:false,server:{middlewareMode:true},appType:'custom',logLevel:'error'});
try{const module=await server.ssrLoadModule('/scripts/s2-audit-balance.ts'),result=module.targetedBalanceObservations();result.source={commit:process.env.CAMPUS_AUDIT_SOURCE_COMMIT??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingChanges:!process.env.CAMPUS_AUDIT_SOURCE_COMMIT,hashes:Object.fromEntries(['src/semesters/s2/whiteboard.ts','src/semesters/s2/fusions.ts','src/semesters/s2/expo-final.ts','src/semesters/registry.ts','scripts/s2-audit-balance.ts'].map(path=>[path,createHash('sha256').update(readFileSync(resolve(process.env.CAMPUS_AUDIT_ROOT??'.',path))).digest('hex')]))};writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({whiteboard:result.whiteboard,isolated:result.isolated,legal:result.legal.map(r=>({fusion:r.fusion,boss:r.boss.map(v=>({fused:v.fused,seconds:v.seconds,stages:v.stages})),crowd:r.crowd.map(v=>({fused:v.fused,dps:v.dps}))}))}));}finally{await server.close();}
