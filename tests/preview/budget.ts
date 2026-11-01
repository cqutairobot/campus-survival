/** A production-built, test-only host. Not a production app entry or registry route. */
import '../../src/ui/styles/fonts.css';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {prepareSemesterTwoScene} from '../../src/semesters/s2/presentation/prepareScene';
import {resources} from '../../src/assets/loader';
import {S2_ART_MANIFEST} from '../../src/semesters/s2/presentation/art-manifest';
import {createS2WorldSnapshot} from '../../src/semesters/s2/world';
import type {WorldSnapshot} from '../../src/semesters/s2/world';
const chapter=Number(new URLSearchParams(location.search).get('chapter')??1);
const p=freshProfile();p.stats.wins=1;const snapshot=createS2PreviewSnapshot(p,86,{choice:{id:'topic',weaponId:'s2:drone'}}),fallback=new URLSearchParams(location.search).has('fallback');
if(fallback)for(const id of Object.keys(S2_ART_MANIFEST) as (keyof typeof S2_ART_MANIFEST)[])resources.forceMissing(id,true);
const world=structuredClone(createS2WorldSnapshot(snapshot.regions)) as unknown as import('../../src/semesters/s2/world').S2WorldSnapshot;
if(chapter===2)world.spawn={x:5350,y:4480};if(chapter===3)world.spawn={x:1376,y:4896};
const run=await prepareSemesterTwoScene({host:document.querySelector<HTMLElement>('#game')!,snapshot,world:world as WorldSnapshot,settings:{...p.settings,muted:true,quality:'high',motion:true},onStick(){}});
async function showcase(){
 const engine=run.engine,s=engine['state'],view=run.scene,token=engine.pause('manual');s.enemies.clear();s.drops.clear();Object.assign(s.player,{x:1650,y:1300,prevX:1650,prevY:1300,vx:0,vy:0});
 for(const [n,kind] of ['s2:bike','s2:reservation','s2:parceler','s2:dispatcher','s2:proposalBoard'].entries()){const id=s.spawnEnemy(kind,1460+n*95,1490);s.enemies.frozen[id]=1000;}
 s.projectTables.active={kind:'joint',x:1850,y:1350,expires:s.combatTime+60,week:4};s.rebuildGrid();s.addHazard('line',s.player.x-190,s.player.y+70,s.player.x+190,s.player.y+70,18,2,.4,12,undefined,{ordinary:false,tier:'elite'});
 if(token!==null)engine.resume(token);engine.advance(1/60);s.week=8;engine.pause('manual');
 for(const bundle of ['s2-boss-dispatcher','s2-boss-proposalBoard'] as const){const lease=await resources.extensionBundle(bundle);view['artReleases'].push(lease.release);for(const [id,texture] of lease.textures)view['artTextures'].set(id,texture);}
 return{actors:s.enemies.active.map(id=>s.content.enemies[s.enemies.kind[id]].id),hazards:s.hazards.map(h=>({phase:h.phase,route:h.route?.width})),textures:view['artTextures'].size};
}
async function laterShowcase(){
 const engine=run.engine,s=engine['state'],view=run.scene,token=engine.pause('manual');s.enemies.clear();s.drops.clear();
 const kinds=chapter===2?['s2:peer','s2:relay','s2:marshal','s2:coordinator','s2:auditor','s2:projectReview','s2:relayNode','s2:reviewPanel']:['s2:recycler','s2:expoFinal'];
 const center=chapter===2?{x:5000,y:4480}:{x:1376,y:4800};Object.assign(s.player,{...center,prevX:center.x,prevY:center.y,vx:0,vy:0});
 const openingWeek=s.week;s.week=chapter===2?13:24;
 for(const [n,kind] of kinds.entries()){const id=s.spawnEnemy(kind,center.x-250+n%4*140,center.y+100+Math.floor(n/4)*100);if(id<0)throw Error(`Showcase admission failed: ${kind}`);s.enemies.frozen[id]=1000;}
 s.week=openingWeek;
 s.rebuildGrid();if(token!==null)engine.resume(token);engine.advance(1/60);engine.pause('manual');
 for(const bundle of (chapter===2?['s2-chapter-2','s2-boss-auditor','s2-boss-projectReview']:['s2-chapter-3','s2-boss-expoFinal']) as Parameters<typeof resources.extensionBundle>[0][]){const lease=await resources.extensionBundle(bundle);view['artReleases'].push(lease.release);for(const [id,texture] of lease.textures)view['artTextures'].set(id,texture);}
 view['refreshBuildings']();
 return{actors:s.enemies.active.map(id=>s.content.enemies[s.enemies.kind[id]].id),drawn:kinds.map(id=>({id,normal:!!view['textures'].frameTexture(id),white:!!view['textures'].frameTexture(id,true)})),building:!!view['textures'].building(chapter===2?'s2:assemblyA':'s2:displayWest')};
}
Object.assign(window,{__S2_BUDGET__:{...run,showcase,laterShowcase,chapter,ready:true,fallback,resources:()=>resources.debug,art:()=>({normal:!resources.isMissing('s2:enemy-atlas'),building:!resources.isMissing('s2:building-smart-teaching')})}});
