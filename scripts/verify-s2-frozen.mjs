import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {auditSemesterTwo,currentSemesterMetadata} from './s2-freeze.mjs';
const root=resolve(process.argv[2]??'.'),output=resolve(process.argv[3]??'/tmp/campus-s2-freeze.json');
let report;
try{const pin=JSON.parse(readFileSync(resolve(root,'freeze/s2-v5.0.0.json'),'utf8'));report=auditSemesterTwo(root,pin,await currentSemesterMetadata(root));}catch(error){report={passed:false,checks:[{name:'S2 freeze execution',passed:false,error:error.message}]};}
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n');for(const c of report.checks.filter(c=>!c.passed))console.error('S2 freeze rejected:',c.name,c.error??'');console.log(`${report.checks.filter(c=>c.passed).length}/${report.checks.length} S2 freeze checks passed`);if(!report.passed)process.exitCode=1;
