import {describe,it,expect} from 'vitest';
import {BUILDINGS,ZONES,campusSnapshot} from '../../src/world/campus';
import type {Navigation} from '../../src/world/navigation';
import {randomStreams} from '../../src/core/run';
import {freshProfile} from '../../src/save/v5/profile';
import {createS2PreviewSnapshot} from '../../src/semesters/inheritance';
import {ContentState} from '../../src/semesters/s2/legacy/ContentState';
import {LEGACY_CONTENT} from '../../src/semesters/s2/legacy/catalog';
import {projectContent} from '../../src/semesters/s2/legacy/rules-adapter';
import {assessmentEntry,assessmentSiteClear,chapterAt,createS2WorldSnapshot,warningFloor,worldBlocked,worldNavigation,worldSlideMove,worldZoneAt,type Point,type S2WorldSnapshot,type WorldSnapshot} from '../../src/semesters/s2/world';

const oldIds=ZONES.map(z=>z.id);
const cell=(p:Point)=>Math.floor(p.y/64)*96+Math.floor(p.x/64);
const center=(n:number)=>({x:n%96*64+32,y:Math.floor(n/96)*64+32});
const overlaps=(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number})=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function walk(world:WorldSnapshot,route:readonly Point[],radius=32){
 let p={...route[0]};
 for(const end of route.slice(1)){
  const from={...p},steps=Math.ceil(Math.hypot(end.x-from.x,end.y-from.y)/12);
  for(let n=1;n<=steps;n++){
   const next={x:from.x+(end.x-from.x)*n/steps,y:from.y+(end.y-from.y)*n/steps};
   p=worldSlideMove(world,p.x,p.y,next.x-p.x,next.y-p.y,radius);
   if(Math.abs(p.x-next.x)+Math.abs(p.y-next.y)>.001||worldBlocked(world,p.x,p.y,radius))throw Error(`Blocked route at ${next.x}, ${next.y}`);
  }
 }
 const end=route[route.length-1];expect(p).toEqual({x:end.x,y:end.y});
}
function reachable(world:WorldSnapshot,nav:Navigation,p:Point){
 let c=cell(p);expect(nav.blocked[c],`Blocked flow-field cell at ${p.x}, ${p.y}`).toBe(0);expect(nav.distance[c]).toBeLessThan(32767);
 const route:Point[]=[p,center(c)];
 while(nav.distance[c]>0){
  const x=c%96,y=Math.floor(c/96),next=[...(x?[c-1]:[]),...(x<95?[c+1]:[]),...(y?[c-96]:[]),...(y<95?[c+96]:[])].find(n=>!nav.blocked[n]&&nav.distance[n]===nav.distance[c]-1);
  if(next===undefined)throw Error('Flow field has no route to spawn');c=next;route.push(center(c));
 }
 route.push(world.spawn);walk(world,route,12);
}
function fixture(world:WorldSnapshot){const p=freshProfile();p.stats.wins=1;p.unlocks.regions=[...oldIds];const snapshot=createS2PreviewSnapshot(p,77),services={snapshot,streams:randomStreams(snapshot.seed)},state=new ContentState(LEGACY_CONTENT,services,world);state.enemies.clear();return{state,services};}

describe('v5 semester-two campus extensions',()=>{
 it('reaches every extension from opening spawn with the existing flow field and real sliding collision, and injects one immutable world',()=>{
  for(const unlocked of [['library','canteen','track'],oldIds]){
   const world=createS2WorldSnapshot(unlocked),nav=worldNavigation(world);nav.rebuild(world.spawn.x,world.spawn.y);
   for(const zone of world.zones.filter(z=>!z.legacy)){
    expect(world.regions).toContain(zone.id);expect(worldZoneAt(world,zone.entrance.x,zone.entrance.y)?.id).toBe(zone.id);
    reachable(world,nav,zone.entrance);reachable(world,nav,zone);
   }
   expect([1,8,9,16,17,24].map(week=>chapterAt(world,week).chapter)).toEqual([1,1,2,2,3,3]);
   for(const goal of world.chapters)reachable(world,nav,goal.target);
  }
  const injected=structuredClone(createS2WorldSnapshot(oldIds)) as S2WorldSnapshot;
  injected.spawn={x:1000,y:600};
  const wall={id:'fixture-screen',x:1064,y:536,w:64,h:128,name:'预约屏',type:'college' as const,color:0x8dbdc9,placeholder:'smartTeaching' as const};injected.buildings.push(wall);injected.blockers.push(wall);
  const {state:s,services}=fixture(injected);s.player.invincible=1000;s.command({type:'move',x:1,y:0});
  for(let tick=1;tick<=60;tick++)s.tick({...services,dt:1/60,clock:{tick,combatSeconds:tick/60,teachingSeconds:tick/60,assessmentSeconds:0,week:1,completedWeeks:0},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n});
  expect(s.player.x).toBe(1052);expect(s.navigation.blocked[cell({x:1088,y:608})]).toBe(1);
  const dto=projectContent(s);expect(dto.world).toBe(s.world);expect(dto.world.buildings.at(-1)).toEqual(wall);expect(Object.isFrozen(dto.world.blockers.at(-1))).toBe(true);
  const floor=warningFloor(dto.world);expect(floor.some(r=>1088>r.x&&1088<r.x+r.w&&608>r.y&&608<r.y+r.h)).toBe(false);expect(floor.some(r=>1000>r.x&&1000<r.x+r.w&&600>r.y&&600<r.y+r.h)).toBe(true);
  wall.x=5000;expect(s.world.blockers.at(-1)?.x).toBe(1064);
  const entrance=s.world.zones.find(z=>z.id==='s2:smartTeaching')!.entrance;Object.assign(s.player,{...entrance,vx:0,vy:0});s.command({type:'move',x:0,y:0});s.tick({...services,dt:1/60,clock:{tick:61,combatSeconds:61/60,teachingSeconds:61/60,assessmentSeconds:0,week:1,completedWeeks:0},phase:'teaching',assessment:null,ordinarySpawnsAllowed:false,damageAfterInheritance:n=>n,experienceAfterInheritance:n=>n});
  expect(projectContent(s).chapter.reached).toBe(true);expect(s.discoveries).toContainEqual({category:'region',id:'s2:smartTeaching',semesterId:'s2',evidence:'run'});s.dispose();
 });

 it('keeps exam floors and independent retreats clear, confirms admission before moving and falls back in the current area',()=>{
  const world=createS2WorldSnapshot(oldIds),nav=worldNavigation(world);nav.rebuild(world.spawn.x,world.spawn.y);
  for(const site of world.assessmentSites){expect(assessmentSiteClear(world,site),site.id).toBe(true);reachable(world,nav,site.player);reachable(world,nav,site.boss);}
  for(const site of world.assessmentSites.filter(s=>s.regionId.startsWith('s2:'))){
   expect(site.retreats.length).toBeGreaterThanOrEqual(2);
   expect(new Set(site.retreats.map(r=>JSON.stringify(r.at(-1)))).size).toBe(site.retreats.length);
   for(const route of site.retreats){walk(world,route);reachable(world,nav,route.at(-1)!);}
  }
  const jointLanes=world.paths.filter(p=>p.x===4210&&p.w===1598);expect(jointLanes).toHaveLength(3);
  for(const lane of jointLanes)walk(world,[{x:lane.x,y:lane.y+lane.h/2},{x:lane.x+lane.w-64,y:lane.y+lane.h/2}]);
  walk(world,[{x:4368,y:4160},{x:4368,y:4800}]);walk(world,[{x:5744,y:4160},{x:5744,y:4800}]);
  // All three exams use the nearest valid plaza, regardless of chapter focus.
  for(const index of [0,1,2]){
   const {state:s,services}=fixture(world),site=world.assessmentSites[1];Object.assign(s.player,site.center);
   const before={x:s.player.x,y:s.player.y},boundary={...services,damageAfterInheritance:(n:number)=>n,experienceAfterInheritance:(n:number)=>n},event={assessment:{index,week:[8,16,24][index],final:index===2},clock:{tick:0,combatSeconds:0,teachingSeconds:0,assessmentSeconds:0,week:1,completedWeeks:0}};
   s.assessment({...event,stage:'prepare'},boundary);expect({x:s.player.x,y:s.player.y}).toEqual(before);expect(s.assessmentAdmission?.site.id).toBe(site.id);expect(s.enemies.active).toHaveLength(0);expect(s.canAcknowledge('assessmentIntro')).toBe(true);
   s.assessment({...event,stage:'start'},boundary);expect({x:s.player.x,y:s.player.y}).toEqual(site.player);expect(s.player.prevX).toBe(s.player.x);expect({x:s.enemies.x[s.bossEnemy],y:s.enemies.y[s.bossEnemy]}).toEqual(site.boss);expect(worldBlocked(s.world,s.player.x,s.player.y,32)).toBe(false);s.dispose();
  }
  const from=world.assessmentSites[0].player,bad=assessmentEntry(world,from);bad.site.center={x:1300,y:1000};
  const fallback=assessmentEntry(world,from,bad);expect(fallback.fallback).toBe(true);expect(fallback.site.regionId).toBe('s2:smartTeaching');expect(assessmentSiteClear(world,fallback.site)).toBe(true);
 });

 it('retains all six legacy entrances, exact old buildings/fences/gates and the original road corridors',()=>{
  const world=createS2WorldSnapshot(oldIds),legacy=campusSnapshot(oldIds),nav=worldNavigation(world);nav.rebuild(world.spawn.x,world.spawn.y);
  expect(world.size).toBe(6144);expect(world.fences).toEqual(legacy.fences);expect(world.blockers.slice(0,legacy.blockers.length)).toEqual(legacy.blockers);
  for(const zone of ZONES){const retained=world.zones.find(z=>z.id===zone.id)!;expect(retained).toMatchObject(zone);reachable(world,nav,retained.entrance);walk(world,[retained.entrance,zone]);}
  expect(world.buildings.filter(b=>!b.placeholder).map(({id:_,art:__,...b})=>b)).toEqual(BUILDINGS);
  for(const building of world.buildings.filter(b=>b.placeholder))for(const road of world.paths.slice(0,7))expect(overlaps(building,road),building.id).toBe(false);
  const locked=createS2WorldSnapshot(['library','canteen','track']),oldLocked=campusSnapshot(['library','canteen','track']);expect(locked.blockers.slice(0,oldLocked.blockers.length)).toEqual(oldLocked.blockers);expect(locked.gates).toHaveLength(3);
  const navLocked=worldNavigation(locked);navLocked.rebuild(locked.spawn.x,locked.spawn.y);for(const zone of locked.zones.filter(z=>z.legacy))reachable(locked,navLocked,zone.entrance);
 });
});
