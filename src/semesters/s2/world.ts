import {Random,distanceSq} from '../../core/math';
import {BUILDINGS,WORLD_SIZE,ZONES,campusSnapshot,isBlocked,safePoint,slideMove,type Building} from '../../world/campus';
import {Navigation} from '../../world/navigation';
import {buildingArt,buildingKeys,landmarkArt} from '../../assets/bindings';
import type {ArtId} from '../../assets/manifest';
import {immutableSnapshot} from '../types';
import {S2_IDS} from '../catalog-ids';
import type {Immutable} from '../runtime/contracts';

export interface Point {x:number;y:number}
export interface Rect extends Point {w:number;h:number}
export type Extension='smartTeaching'|'jointLab'|'exhibitHall';
export interface WorldBuilding extends Building {id:string;art?:ArtId;placeholder?:Extension}
export interface WorldZone extends Point {id:string;name:string;radius:number;color:number;art?:ArtId;entrance:Point;legacy:boolean}
export interface AssessmentSite {
 id:string;regionId:string;name:string;center:Point;radius:number;player:Point;boss:Point;
 /** Each polyline reaches a different, retained campus road without a gate. */
 retreats:Point[][];
}
export interface ChapterGoal {chapter:number;fromWeek:number;toWeek:number;regionId:string;title:string;objective:string;target:Point}
export interface S2WorldSnapshot {
 version:string;size:number;spawn:Point;regions:string[];zones:WorldZone[];buildings:WorldBuilding[];
 blockers:Building[];fences:Building[];gates:Building[];paths:Rect[];square:Rect;track:Rect;
 lawns:{x:number;y:number;rx:number;ry:number}[];props:{kind:'tree'|'bench'|'planter';x:number;y:number;scale:number}[];
 assessmentSites:AssessmentSite[];chapters:ChapterGoal[];
}
export type WorldSnapshot=Immutable<S2WorldSnapshot>;
type Geometry=Pick<WorldSnapshot,'blockers'|'size'>;
export const S2_REGION_DEFS:readonly WorldZone[]=[
 {id:'s2:smartTeaching',name:'智慧教学楼外场',x:1408,y:1280,radius:530,color:0x8dbdc9,entrance:{x:1776,y:1536},legacy:false},
 {id:'s2:jointLab',name:'产教联合实验园',x:5100,y:4480,radius:650,color:0x8099ac,entrance:{x:4480,y:4480},legacy:false},
 {id:'s2:exhibitHall',name:'学生成果展廊',x:1376,y:4816,radius:570,color:0xcdb583,entrance:{x:1376,y:4608},legacy:false},
];

// The frozen S1 helpers only read their array. Adapt their mutable parameter type
// here rather than changing those files or copying the collision algorithms.
const blockers=(world:Geometry)=>world.blockers as Building[];
export const worldBlocked=(world:Geometry,x:number,y:number,radius=16)=>isBlocked(x,y,radius,blockers(world));
export const worldSafePoint=(world:Geometry,x:number,y:number)=>safePoint(x,y,blockers(world));
export const worldSlideMove=(world:Geometry,x:number,y:number,dx:number,dy:number,radius:number,out={x:0,y:0})=>slideMove(x,y,dx,dy,radius,out,blockers(world));
export const worldZoneAt=(world:Pick<WorldSnapshot,'zones'|'regions'>,x:number,y:number)=>world.zones.find(z=>world.regions.includes(z.id)&&distanceSq(x,y,z.x,z.y)<z.radius*z.radius);
export const chapterAt=(world:Pick<WorldSnapshot,'chapters'>,week:number)=>world.chapters.find(c=>week>=c.fromWeek&&week<=c.toWeek)??world.chapters[world.chapters.length-1];

export function worldNavigation(world:Geometry){
 const navigation=new Navigation([...world.blockers]);
 // On the existing 64-unit grid, 18-unit fences + 2*22 clearance can fall
 // entirely between cell centers. S2 uses 24: at least one cell sees every
 // thin fence, while the original 160-unit entrances stay open. BFS is unchanged.
 for(let y=0;y<navigation.side;y++)for(let x=0;x<navigation.side;x++)if(worldBlocked(world,x*64+32,y*64+32,24))navigation.blocked[y*navigation.side+x]=1;
 return navigation;
}

/** Exact floor rectangles for the warning mask, derived from collision geometry.
 * Horizontal bands avoid overlapping cutout holes at the legacy fence corners. */
export function warningFloor(world:Geometry):Rect[] {
 const edges=[...new Set([0,world.size,...world.blockers.flatMap(b=>[b.y,b.y+b.h])])].sort((a,b)=>a-b),floor:Rect[]=[];
 for(let n=1;n<edges.length;n++){
  const y=edges[n-1],bottom=edges[n],walls=world.blockers.filter(b=>b.y<bottom&&b.y+b.h>y).map(b=>[b.x,b.x+b.w]).sort((a,b)=>a[0]-b[0]);
  let x=0;
  for(const [left,right] of walls){if(left>x)floor.push({x,y,w:left-x,h:bottom-y});x=Math.max(x,right);}
  if(x<world.size)floor.push({x,y,w:world.size-x,h:bottom-y});
 }
 return floor;
}

function site(id:string,regionId:string,name:string,x:number,y:number,radius:number,retreats:Point[][]=[]):AssessmentSite {
 return{id,regionId,name,center:{x,y},radius,player:{x,y:y+120},boss:{x,y:y-180},retreats};
}
function corridor(a:Point,b:Point,width=128):Rect {
 return{x:Math.min(a.x,b.x)-width/2,y:Math.min(a.y,b.y)-width/2,w:Math.abs(a.x-b.x)+width,h:Math.abs(a.y-b.y)+width};
}

/** One run-local, plain, deeply frozen world. No gameplay RNG or resource load.
 * Legacy region gates follow the opening manifest; all three extensions are open. */
export function createS2WorldSnapshot(unlocked:readonly string[]):WorldSnapshot {
 const newIds=S2_IDS.regions;
 const regions=[...new Set([...unlocked,...newIds])],legacy=campusSnapshot(regions);
 const extensions:WorldBuilding[]=[
  {id:'s2:glassLink',x:1160,y:512,w:480,h:128,name:'智慧教学楼 · 玻璃连廊',color:0x8dbdc9,type:'college',placeholder:'smartTeaching'},
  {id:'s2:networkHub',x:1200,y:960,w:320,h:224,name:'预约屏与校园网络终端',color:0x8dbdc9,type:'college',placeholder:'smartTeaching'},
  {id:'s2:assemblyA',x:4520,y:4260,w:280,h:100,name:'联合实验园 · 装配棚',color:0x8099ac,type:'college',placeholder:'jointLab'},
  {id:'s2:logisticsA',x:4910,y:4260,w:210,h:100,name:'校园物流站',color:0x8099ac,type:'college',placeholder:'jointLab'},
  {id:'s2:assemblyB',x:4520,y:4580,w:280,h:100,name:'联合实验园 · 测试设备',color:0x8099ac,type:'college',placeholder:'jointLab'},
  {id:'s2:logisticsB',x:4910,y:4580,w:210,h:100,name:'联合项目设备库',color:0x8099ac,type:'college',placeholder:'jointLab'},
  {id:'s2:displayWest',x:832,y:4352,w:240,h:160,name:'学生成果展廊 · 西展台',color:0xcdb583,type:'college',placeholder:'exhibitHall'},
  {id:'s2:displayEast',x:1568,y:4352,w:272,h:160,name:'学生成果展廊 · 东展台',color:0xcdb583,type:'college',placeholder:'exhibitHall'},
 ];
 const buildings:WorldBuilding[]=[...BUILDINGS.map((b,n)=>({...b,id:buildingKeys[n],art:buildingArt[buildingKeys[n]]})),...extensions];
 const zones:WorldZone[]=[...ZONES.map(z=>({...z,art:landmarkArt[z.id],entrance:{x:z.x,y:['lab','workshop','garden'].includes(z.id)?z.y+z.radius+144:z.y},legacy:true})),
  ...structuredClone(S2_REGION_DEFS),
 ];
 const assessmentSites=[
  site('s2:smart-square',newIds[0],'智慧教学楼环廊广场',1440,1456,224,[
   [{x:1440,y:1456},{x:1776,y:1456},{x:1776,y:1664},{x:2320,y:1664}],
   [{x:1440,y:1456},{x:1440,y:2040}],
  ]),
  site('s2:joint-square',newIds[1],'联合实验园测试广场',5504,4480,224,[
   [{x:5504,y:4480},{x:4210,y:4480}],
   [{x:5504,y:4480},{x:5744,y:4480},{x:5744,y:3870},{x:4210,y:3870}],
  ]),
  site('s2:exhibit-square',newIds[2],'学生成果联展广场',1376,4896,256,[
   [{x:1376,y:4896},{x:2320,y:4896}],
   [{x:1376,y:4896},{x:1376,y:3870}],
   [{x:1376,y:4896},{x:640,y:4896},{x:640,y:3870}],
   [{x:1376,y:4896},{x:1376,y:5504},{x:2320,y:5504}],
  ]),
  site('central-square','central','校园中心广场',3072,3072,224),
  site('library-square','library','图书馆前广场',2640,2768,224),
  site('canteen-square','canteen','食堂外场',3728,3096,224),
  site('track-square','track','操场内场',2890,1600,256),
  site('lab-square','lab','实验中心安全外场',5200,1900,224),
  site('workshop-square','workshop','模型工坊外场',900,2200,224),
  site('garden-square','garden','夜读花园空地',3072,5100,256),
 ];
 const square={x:2760,y:2820,w:630,h:520},paths:Rect[]=[
  ...[2320,3072,4210].map(x=>({x:x-80,y:0,w:160,h:WORLD_SIZE})),
  ...[2040,2870,3310,3870].map(y=>({x:0,y:y-70,w:WORLD_SIZE,h:140})),
  {x:960,y:704,w:896,h:160},{x:960,y:1472,w:896,h:160},{x:960,y:704,w:160,h:928},{x:1696,y:704,w:160,h:928},
  ...[4160,4480,4800].map(y=>({x:4210,y:y-64,w:1598,h:128})),
  {x:4304,y:3870,w:128,h:994},{x:5680,y:3870,w:128,h:994},
  ...assessmentSites.slice(0,3).flatMap(s=>s.retreats.flatMap(route=>route.slice(1).map((p,n)=>corridor(route[n],p)))),
 ];
 const chapters:ChapterGoal[]=[
  {chapter:1,fromWeek:1,toWeek:8,regionId:newIds[0],title:'返校与外场准备',objective:'前往智慧教学楼外场，熟悉环形走廊、绕侧路线与校园网络终端。',target:zones[6].entrance},
  {chapter:2,fromWeek:9,toWeek:16,regionId:newIds[1],title:'跨学科协作',objective:'前往产教联合实验园，在装配棚、物流站和测试场之间规划三条互通路线。',target:zones[7].entrance},
  {chapter:3,fromWeek:17,toWeek:24,regionId:newIds[2],title:'成果布展与期末联展',objective:'前往学生成果展廊，沿多出口广场布展并保留联展退路。',target:zones[8].entrance},
 ];
 const world:S2WorldSnapshot={version:'campus-s2-v5.0.0',size:WORLD_SIZE,spawn:{x:3072,y:3072},regions,zones,buildings,
  blockers:[...legacy.blockers,...extensions],fences:legacy.fences,gates:legacy.blockers.filter(b=>b.name.endsWith('-围栏')&&b.w===b.h),paths,square,track:{x:2560,y:1360,w:680,h:400},
  lawns:[],props:[],assessmentSites,chapters};
 const rng=new Random(7042019);
 for(let n=0;n<220;n++)world.lawns.push({x:rng.range(60,6080),y:rng.range(60,6080),rx:rng.range(20,80),ry:rng.range(15,50)});
 for(let n=0;n<260;n++){
  const x=rng.range(300,5840),y=rng.range(300,5840);
  if(worldBlocked(world,x,y,70)||distanceSq(x,y,world.spawn.x,world.spawn.y)<440**2||zones.some(z=>distanceSq(x,y,z.x,z.y)<(z.radius+60)**2)||paths.some(p=>x>p.x-60&&x<p.x+p.w+60&&y>p.y-60&&y<p.y+p.h+60))continue;
  world.props.push({kind:'tree',x,y,scale:rng.range(.7,1.15)});
 }
 for(const [x,y] of [[2750,2780],[3400,2780],[2750,3370],[3400,3370],[800,900],[1944,900],[4420,4020],[5824,4928],[800,5232],[1936,5232]]){
  world.props.push({kind:'planter',x,y,scale:1},{kind:'bench',x:x+85,y,scale:1});
 }
 return immutableSnapshot(world);
}

/** Geometry only: P06 will consume the same snapshot when scheduling danger. */
export function assessmentSiteClear(world:Geometry,site:Immutable<AssessmentSite>){
 return !worldBlocked(world,site.center.x,site.center.y,site.radius+32)&&!worldBlocked(world,site.player.x,site.player.y,32)&&!worldBlocked(world,site.boss.x,site.boss.y,48);
}
export interface AssessmentEntry {site:AssessmentSite;fallback:boolean}
export function assessmentEntry(world:WorldSnapshot,from:Point,preferred?:Immutable<AssessmentEntry>|null):AssessmentEntry {
 const nearest=preferred?.site??[...world.assessmentSites].sort((a,b)=>distanceSq(from.x,from.y,a.center.x,a.center.y)-distanceSq(from.x,from.y,b.center.x,b.center.y))[0];
 if(assessmentSiteClear(world,nearest))return{site:structuredClone(nearest) as AssessmentSite,fallback:preferred?.fallback??false};
 // Failed admission stays in the current area. Find a clear local layout, never
 // remove a wall or teleport across the campus as an implicit chapter transition.
 const zone=worldZoneAt(world,from.x,from.y),local=world.assessmentSites.find(s=>s.regionId===zone?.id&&assessmentSiteClear(world,s));
 if(local)return{site:structuredClone(local) as AssessmentSite,fallback:true};
 for(let r=0;r<=640;r+=64)for(let n=0;n<(r?16:1);n++){
  const a=n*Math.PI/8,x=from.x+Math.cos(a)*r,y=from.y+Math.sin(a)*r,candidate=site('local-fallback',zone?.id??'central','当前区域安全布局',x,y,224);
  if(assessmentSiteClear(world,candidate))return{site:candidate,fallback:true};
 }
 // A malformed injected map is an admission failure; callers keep the intro
 // paused instead of starting a boss inside collision geometry.
 throw Error('No safe local assessment layout');
}
