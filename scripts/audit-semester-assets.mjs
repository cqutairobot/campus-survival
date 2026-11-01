import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=resolve('.'),output=resolve(process.argv[2]??'docs/v5-source-audit.json'),checks=[],cache=new Map();
const json=file=>JSON.parse(readFileSync(resolve(root,file),'utf8')),sha=bytes=>createHash('sha256').update(bytes).digest('hex'),hash=file=>{if(!cache.has(file))cache.set(file,sha(readFileSync(resolve(root,file))));return cache.get(file);},check=(name,passed)=>checks.push({name,passed});
const art=json('art-src/s2/ledger.json'),audio=json('audio-src/s2/ledger.json'),fonts=json('font-src/s2/ledger-v2.json'),previousFonts=json('font-src/s2/ledger.json');
check('font v2 links immutable v1 ledger',fonts.version==='font-s2-v2'&&fonts.predecessor.file==='font-src/s2/ledger.json'&&fonts.predecessor.sha256===hash('font-src/s2/ledger.json')&&JSON.stringify(fonts.existingFaces)===JSON.stringify([...previousFonts.existingFaces,...previousFonts.outputs]));
for(const file of ['font-src/s2/ledger.json','public/licenses/s2-font-ledger.json'])check('historic font ledger '+file,readFileSync(file).equals(execFileSync('git',['show',`f68ba71:${file}`],{maxBuffer:4*1024*1024})));
check('42 real AI masters / zero placeholders',art.assets.filter(a=>a.sourceType==='ai').length===42&&!art.missing.length&&!art.assets.some(a=>a.placeholder));
check('18 logical audio clips / 36 encodings',audio.assets.length===18&&audio.assets.flatMap(a=>a.outputs).length===36);
for(const a of art.assets){
 if(a.sourceType==='ai'){check(`${a.key}: AI provenance`,a.tool==='image_gen built-in'&&a.prompt.length>600&&a.generatedAt&&a.model.includes('not exposed')&&a.license==='AI-generated; no CC0 claim');check(a.raw,hash(a.raw)===a.rawSha256);check(a.master,hash(a.master)===a.masterSha256);check(a.reference.file+': style reference',hash(a.reference.file)===a.reference.sha256);}
 else{check(a.sourceFile,hash(a.sourceFile)===a.sha256);check(a.licenseFile,hash(a.licenseFile)===a.licenseSha256);check(a.key+': CC0',a.license==='CC0 1.0'&&/Creative Commons Zero/.test(readFileSync(a.licenseFile,'utf8')));}
}
for(const a of audio.assets){check('public license '+a.pack,hash('public/licenses/s2-'+a.pack+'-License.txt')===a.licenseSha256);check(a.sourceFile,hash(a.sourceFile)===a.sourceSha256);check(a.licenseFile,hash(a.licenseFile)===a.licenseSha256);check(a.id+': CC0 and mastering',a.license==='CC0 1.0'&&/Creative Commons Zero/.test(readFileSync(a.licenseFile,'utf8'))&&a.outputs.every(o=>Math.abs(o.integratedLufs+23)<=.65&&o.truePeakDbtp<=-3));}
for(const o of [...art.outputs,...audio.assets.flatMap(a=>a.outputs),...fonts.outputs,...fonts.existingFaces])check(o.file,hash(o.file)===o.sha256);
check('public font OFL',hash('public/licenses/s2-font-OFL.txt')===fonts.licenseSha256);check('public particle CC0',readFileSync('public/licenses/s2-kenney-particles.txt','utf8').replace(/\r\n?/g,'\n')===readFileSync(art.assets.find(a=>a.sourceType==='cc0').licenseFile,'utf8').replace(/\r\n?/g,'\n'));
check('font OFL and no missing Han/CJK',fonts.license==='SIL OFL 1.1'&&hash(fonts.licenseFile)===fonts.licenseSha256&&fonts.missing.length===0);
for(const weight of [400,600]){const coverage=new Set([...fonts.existingFaces,...fonts.outputs].filter(f=>f.weight===weight).flatMap(f=>f.codepoints));check(`all Chinese codepoints weight${weight}`,fonts.requiredCodepoints.every(c=>coverage.has(c)));}
for(const [file,digest] of Object.entries(json('art-src/s2/p18-preserved.json')))check('P18 preserved '+file,hash(file)===digest);
for(const [file,digest] of Object.entries(json('audio-src/s2/s1-preserved.json')))check('S1 audio preserved '+file,hash(file)===digest);
// Original S1 art/font files are independently compared with the pre-P19 Git
// tree. The S1 gameplay freeze remains its own untouched46/62 audit.
const preserved=execFileSync('git',['ls-tree','-r','--name-only','b08f033','--','public/assets/art/v4','public/assets/fonts','src/assets/attributions.json','public/licenses'],{encoding:'utf8'}).trim().split('\n').filter(file=>file&&!file.startsWith('public/licenses/s2-'));
for(const file of preserved){const bytes=execFileSync('git',['show',`b08f033:${file}`],{maxBuffer:4*1024*1024});check('S1 source '+file,hash(file)===sha(bytes));}
for(const [dir,expected] of [['public/assets/art/v5/s2',art.outputs.map(a=>a.file)],['public/assets/audio/v5/s2',audio.assets.flatMap(a=>a.outputs.map(o=>o.file))]]){const actual=readdirSync(dir,{recursive:true}).filter(p=>/\.(png|webp|ogg|mp3)$/.test(p)).map(p=>join(dir,p)).sort();check(dir+': no undeclared deployed file',JSON.stringify(actual)===JSON.stringify([...expected].sort()));}
check('public ledgers match reviewable sources',hash('art-src/s2/ledger.json')===hash('public/licenses/s2-art-ledger.json')&&hash('audio-src/s2/ledger.json')===hash('public/licenses/s2-audio-ledger.json')&&hash('font-src/s2/ledger-v2.json')===hash('public/licenses/s2-font-ledger-v2.json')&&hash('font-src/s2/ledger.json')===hash('public/licenses/s2-font-ledger.json'));
check('original sources not in public',!existsSync('public/art-src')&&!existsSync('public/audio-src')&&!existsSync('public/font-src'));
const report={version:'s2-source-audit-v1',passed:checks.every(c=>c.passed),sources:{aiMasters:42,cc0Shapes:2,cc0SoundClips:18,fontLicense:'SIL OFL1.1',music:'original five tracks, unchanged',s1PreservedFiles:preserved.length},uniqueFilesHashed:cache.size,checks};writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(`${checks.filter(c=>c.passed).length}/${checks.length} art/audio/font/source/license checks passed`);for(const c of checks.filter(c=>!c.passed))console.error('Source audit rejected:',c.name);if(!report.passed)process.exitCode=1;
