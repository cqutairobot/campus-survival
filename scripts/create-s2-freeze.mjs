import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {S2_ACTIVE_BASELINE,S2_FREEZE_ENTRIES,S2_ENTRY_ENTRIES,semesterEntryClosure,semesterTwoClosure,currentSemesterMetadata,sha256} from './s2-freeze.mjs';
if(!process.argv.includes('--write'))throw Error('First freeze creation requires explicit --write; verification never regenerates a baseline');
const root=resolve('.'),file=resolve(root,S2_ACTIVE_BASELINE);if(existsSync(file))throw Error('S2 baseline already exists; future changes require a new version and explanation');
const read=p=>readFileSync(resolve(root,p)),metadata=await currentSemesterMetadata(root),closure=semesterTwoClosure(root);
const pin={version:'s2-freeze-v2',baselineVersion:'s2-v5.0.1',baseCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),createdAt:'2026-11-01',provenance:'P22 formal entry opening. Original gameplay closure is retained; only registry.ts changes in that closure. Formal lazy routing, scene, UI and store wiring have an additional exact closure. Catalog, score, rating, daily, calendar and Boss values remain P21 versions.',predecessor:{file:'freeze/s2-v5.0.0.json',sha256:sha256(read('freeze/s2-v5.0.0.json'))},entrypoints:S2_FREEZE_ENTRIES,entrypointsOpen:S2_ENTRY_ENTRIES,...metadata,runtimeFiles:Object.fromEntries(closure.map(p=>[p,sha256(read(p))])),entryFiles:Object.fromEntries(semesterEntryClosure(root).filter(p=>!closure.includes(p)).map(p=>[p,sha256(read(p))])),packageSha256:sha256(read('package.json')),lockSha256:sha256(read('package-lock.json'))};
writeFileSync(file,JSON.stringify(pin,null,2)+'\n');console.log(`Created ${closure.length}-file S2 behavior/data/save/inheritance/score closure`);
