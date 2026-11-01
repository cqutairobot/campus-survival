import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {S2_FREEZE_ENTRIES,semesterTwoClosure,currentSemesterMetadata,sha256} from './s2-freeze.mjs';
if(!process.argv.includes('--write'))throw Error('First freeze creation requires explicit --write; verification never regenerates a baseline');
const root=resolve('.'),file=resolve(root,'freeze/s2-v5.0.0.json');if(existsSync(file))throw Error('S2 v5.0.0 baseline already exists; future rule changes require a new version and explanation');
const read=p=>readFileSync(resolve(root,p)),metadata=await currentSemesterMetadata(root),closure=semesterTwoClosure(root);
const pin={version:'s2-freeze-v1',baseCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),createdAt:'2026-11-01',provenance:'First P21 working-tree freeze after deterministic release tuning; the P21 local commit contains this exact pin and source. S1 pin/closure are separate and unchanged.',entrypoints:S2_FREEZE_ENTRIES,...metadata,runtimeFiles:Object.fromEntries(closure.map(p=>[p,sha256(read(p))])),packageSha256:sha256(read('package.json')),lockSha256:sha256(read('package-lock.json'))};
writeFileSync(file,JSON.stringify(pin,null,2)+'\n');console.log(`Created ${closure.length}-file S2 behavior/data/save/inheritance/score closure`);
