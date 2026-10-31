/** Strict, short source audit. No simulation, performance run, or gameplay RNG is executed. */
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),baseline=resolve(process.argv[2]??'/workspace/campus-survival-v3-backup'),output=process.argv[3]??'docs/v4-p2-freeze-audit.json';
const folders=['src/core','src/data','src/combat','src/weapons','src/enemies','src/entities','src/progression','src/world','src/challenges'];
const files=folders.flatMap(folder=>readdirSync(resolve(root,folder),{withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.ts')).map(e=>`${folder}/${e.name}`));
// Fixed 46-file contract, recorded before v4.0.1 gameplay changes.
const EXPECTED_FILES=[
 "src/challenges/daily.ts",
 "src/challenges/scoring.ts",
 "src/combat/damage.ts",
 "src/combat/deaths.ts",
 "src/combat/momentum.ts",
 "src/combat/pickups.ts",
 "src/combat/status.ts",
 "src/combat/ultimates.ts",
 "src/core/commands.ts",
 "src/core/engine.ts",
 "src/core/grid.ts",
 "src/core/input.ts",
 "src/core/loop.ts",
 "src/core/math.ts",
 "src/core/metrics.ts",
 "src/core/pool.ts",
 "src/core/replay.ts",
 "src/core/run.ts",
 "src/data/achievements.ts",
 "src/data/catalog.ts",
 "src/data/daily.ts",
 "src/data/enemies.ts",
 "src/data/fusions.ts",
 "src/data/pickups.ts",
 "src/data/relics.ts",
 "src/data/ultimates.ts",
 "src/data/waves.ts",
 "src/data/weapons.ts",
 "src/enemies/behaviors.ts",
 "src/enemies/bosses.ts",
 "src/enemies/director.ts",
 "src/enemies/elites.ts",
 "src/enemies/minibosses.ts",
 "src/entities/pools.ts",
 "src/progression/achievements.ts",
 "src/progression/relics.ts",
 "src/progression/rewards.ts",
 "src/progression/rules.ts",
 "src/weapons/fusions.ts",
 "src/weapons/params.ts",
 "src/weapons/summons.ts",
 "src/weapons/system.ts",
 "src/world/campus.ts",
 "src/world/events.ts",
 "src/world/landmarks.ts",
 "src/world/navigation.ts"
];
const exceptions=JSON.parse(readFileSync(resolve(root,'scripts/v4.0.1-gameplay-exceptions.json'),'utf8'));
const allowedPatches={'R06':'src/combat/momentum.ts','R07':'src/weapons/system.ts'};
if(exceptions.patches.length!==2||Object.keys(allowedPatches).some(issue=>exceptions.patches.filter(p=>p.issue===issue&&p.file===allowedPatches[issue]).length!==1))throw Error('Only the two approved gameplay patches are allowed');
const hash=source=>createHash('sha256').update(source).digest('hex');
const occurrences=(source,fragment)=>fragment?source.split(fragment).length-1:0;
function restorePatch(file,actual,previous){
 const patch=exceptions.patches.find(p=>p.file===file);if(!patch)return actual;
 if(hash(previous)!==patch.baselineSha256||hash(actual)!==patch.patchedSha256)throw Error(`${patch.issue}: file hash differs`);
 for(const fragment of patch.fragments){
  if(fragment.expectedOccurrences!==1||occurrences(previous,fragment.old)!==1||occurrences(actual,fragment.new)!==1)throw Error(`${patch.issue}: exact fragment count differs`);
  actual=actual.replace(fragment.new,fragment.old);
 }
 return actual;
}
const VERSION_LINES=[
 ["export const DAILY_RULES_VERSION='daily-v3.1';", "export const DAILY_RULES_VERSION='daily-v4.0.1';"],
 ["export const RULES_VERSION='campus-v3.0';", "export const RULES_VERSION='campus-v4.0.1';"],
];
function restoreVersions(actual,previous){
 for(const [before,after] of VERSION_LINES){if(occurrences(previous,before)!==1||occurrences(actual,after)!==1)throw Error('Daily version literal differs');actual=actual.replace(after,before);}
 return actual;
}
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
const baselineFiles=folders.flatMap(folder=>readdirSync(resolve(baseline,folder),{withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.ts')).map(e=>`${folder}/${e.name}`)).sort();
const fileSetMatches=JSON.stringify([...files].sort())===JSON.stringify(EXPECTED_FILES)&&JSON.stringify(baselineFiles)===JSON.stringify(EXPECTED_FILES);
const checks=EXPECTED_FILES.map(file=>{
 try{
  const actual=readFileSync(resolve(root,file),'utf8'),previous=readFileSync(resolve(baseline,file),'utf8'),exact=actual===previous;
  let restored=restorePatch(file,actual,previous);if(file==='src/data/daily.ts')restored=restoreVersions(restored,previous);
  const patch=exceptions.patches.find(p=>p.file===file),passed=normalize(file,restored)===normalize(file,previous);
  return {file,passed,comparison:exact?'byte-identical':patch?`${patch.issue}: exact approved gameplay fragments only`:file==='src/data/daily.ts'?'exact two version literals only':file==='src/core/engine.ts'?'remove readonly visual event payloads and heal display snapshots only':'ignore presentation rarity colors and content version only',sha256:hash(actual)};
 }catch(error){return {file,passed:false,error:error.message};}
});
const report={baseline:relative(root,baseline),checked:checks.length,fileSetMatches,passed:fileSetMatches&&checks.every(c=>c.passed),allowed:['catalog: rarity presentation colors and content label','engine: readonly visual metadata and actual-heal display event',...exceptions.patches.map(p=>`${p.issue}: ${p.reason}`)],versionMetadata:VERSION_LINES,checks};
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
if(!fileSetMatches)console.error('Frozen 46-file set differs');
for(const check of checks.filter(c=>!c.passed))console.error('Gameplay differs:',check.file,check.error??'');
console.log(`${checks.filter(c=>c.passed).length}/${checks.length} frozen files audited; ${checks.filter(c=>c.comparison==='byte-identical').length} byte-identical; only R06/R07 gameplay patches and the two exact version lines are approved.`);
if(!report.passed)process.exitCode=1;
