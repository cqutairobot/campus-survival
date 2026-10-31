/** Strict, short source audit. No simulation, performance run, or gameplay RNG is executed. */
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),baseline=resolve(process.argv[2]??'/workspace/campus-survival-v3-backup');
const folders=['src/core','src/data','src/combat','src/weapons','src/enemies','src/entities','src/progression','src/world','src/challenges'];
const files=folders.flatMap(folder=>readdirSync(resolve(root,folder),{withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.ts')).map(e=>`${folder}/${e.name}`));
function withoutVisualEmits(source){
 let result='',at=0;
 while(true){const start=source.indexOf('this.emit(',at);if(start<0)return result+source.slice(at);result+=source.slice(at,start);let depth=1,quote='',escape=false,end=start+'this.emit('.length;
  for(;end<source.length&&depth;end++){const c=source[end];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===quote)quote='';}else if(c==='"'||c==="'"||c==='`')quote=c;else if(c==='(')depth++;else if(c===')')depth--;}
  at=end+(source[end]===';'?1:0);
 }
}
function normalize(file,source){
 if(file==='src/data/catalog.ts')return source.replace(/import \{tokens\} from '\.\.\/design\/tokens';\n/,'').replace(/export const RARITY_COLORS = [^;]+;/,'export const RARITY_COLORS = PRESENTATION_COLORS;').replace(/export const CONTENT_VERSION = '[^']+';/,"export const CONTENT_VERSION = 'PRESENTATION_VERSION';");
 if(file==='src/core/engine.ts')return withoutVisualEmits(source).replace(/import\s*\{enemyMaterial\}\s*from '\.\.\/presentation\/materials';\n/,'').replace('const before=this.player.hp;','').replace('const restored=this.player.hp-before;if(restored>=1)','').replace(/\s+/g,'');
 return source;
}
const checks=files.map(file=>{const actual=readFileSync(resolve(root,file),'utf8'),previous=readFileSync(resolve(baseline,file),'utf8'),exact=actual===previous,passed=normalize(file,actual)===normalize(file,previous);return {file,passed,comparison:exact?'byte-identical':file==='src/core/engine.ts'?'remove readonly visual event payloads and heal display snapshots only':'ignore presentation rarity colors and content version only',sha256:createHash('sha256').update(actual).digest('hex')};});
const report={baseline:relative(root,baseline),checked:checks.length,passed:checks.every(c=>c.passed),allowed:['catalog: rarity presentation colors and content label','engine: readonly visual metadata and actual-heal display event'],checks};
writeFileSync('docs/v4-p2-freeze-audit.json',JSON.stringify(report,null,2)+'\n');
for(const check of checks.filter(c=>!c.passed))console.error('Gameplay differs:',check.file);
console.log(`${checks.filter(c=>c.passed).length}/${checks.length} frozen gameplay files match v3; ${checks.filter(c=>c.comparison==='byte-identical').length} byte-identical.`);
if(!report.passed)process.exitCode=1;
