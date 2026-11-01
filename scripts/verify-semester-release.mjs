import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const root=resolve(process.argv[2]??'.'),base=process.argv[3]??'/tmp/campus-s2-p21';
for(const [script,output] of [['verify-s1-frozen.mjs',`${base}-freeze.json`],['verify-s2-frozen.mjs',`${base}-s2-freeze.json`],['audit-semester-assets.mjs','docs/v5-source-audit.json']]){
 const args=script==='audit-semester-assets.mjs'?[`scripts/${script}`,output]:[`scripts/${script}`,root,output];const result=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});if(result.status!==0){process.exitCode=result.status??1;break;}
}
