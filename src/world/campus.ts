import { clamp, distanceSq } from '../core/math';
export const WORLD_SIZE = 6144;
export interface Building { x:number; y:number; w:number; h:number; name:string; color:number; type:'library'|'canteen'|'basic'|'college'|'dorm' }
export const BUILDINGS: Building[] = [
  {x:2450,y:2220,w:380,h:230,name:'逸夫图书馆',color:0x80a6a0,type:'library'},
  {x:3450,y:2570,w:340,h:200,name:'学生食堂',color:0xd9a17b,type:'canteen'},
  {x:2690,y:3480,w:430,h:210,name:'基础教学楼',color:0xd8bc8b,type:'basic'},
  {x:3650,y:3390,w:340,h:220,name:'建筑与城市规划学院',color:0xb7a4be,type:'college'},
  {x:1940,y:3000,w:310,h:200,name:'研究生公寓',color:0xd8ae93,type:'dorm'},
  {x:3750,y:1920,w:390,h:230,name:'土木与交通工程学院',color:0xa9b8c8,type:'college'},
  {x:1940,y:1740,w:300,h:200,name:'实验中心',color:0x8eb7ab,type:'college'},
  {x:2450,y:4110,w:370,h:210,name:'基础楼 · 南楼',color:0xe0ba82,type:'basic'},
  {x:4360,y:3070,w:360,h:220,name:'校园活动中心',color:0x8bafa2,type:'college'},
  {x:1530,y:3890,w:330,h:210,name:'研究生公寓 · 西楼',color:0xc8ad9c,type:'dorm'},
];
export const ZONES = [
  {id:'library',name:'图书馆 · 经验 +15%',x:2640,y:2640,radius:220,color:0x95c2bf},
  {id:'canteen',name:'食堂 · 脱战后缓慢回血',x:3615,y:2990,radius:180,color:0xeacb9e},
  {id:'lab',name:'实验中心外场 · 范围增幅',x:5200,y:1900,radius:240,color:0x8db8d1},
  {id:'workshop',name:'模型工坊 · 应急护盾',x:900,y:2200,radius:260,color:0xceac92},
  {id:'garden',name:'夜读花园 · 风险增伤',x:3072,y:5100,radius:280,color:0xa59bc7},
  {id:'track',name:'操场 · 跑起来就有希望',x:2890,y:1600,radius:330,color:0xdcb89d},
];
export function isBlocked(x:number,y:number,radius=16,blockers=BUILDINGS) {
  if(x<radius||y<radius||x>WORLD_SIZE-radius||y>WORLD_SIZE-radius)return true;
  return blockers.some(b=> x>b.x-radius&&x<b.x+b.w+radius&&y>b.y-radius&&y<b.y+b.h+radius);
}
/** Resolve one axis at a time to preserve sliding. Handles inside-rectangle corrections too. */
export function slideMove(x:number,y:number,dx:number,dy:number,radius:number,out={x:0,y:0},blockers=BUILDINGS) {
  let nx=clamp(x+dx,radius,WORLD_SIZE-radius),ny=clamp(y+dy,radius,WORLD_SIZE-radius);
  for(const b of blockers) {
    if(nx>b.x-radius&&nx<b.x+b.w+radius&&y>b.y-radius&&y<b.y+b.h+radius) nx=dx>0?b.x-radius:b.x+b.w+radius;
  }
  for(const b of blockers) {
    if(nx>b.x-radius&&nx<b.x+b.w+radius&&ny>b.y-radius&&ny<b.y+b.h+radius) ny=dy>0?b.y-radius:b.y+b.h+radius;
  }
  out.x=nx;out.y=ny;return out;
}
export function zoneAt(x:number,y:number) { return ZONES.find(z=>distanceSq(x,y,z.x,z.y)<z.radius*z.radius); }
export function safePoint(x:number,y:number,blockers=BUILDINGS) {
  x=clamp(x,80,WORLD_SIZE-80);y=clamp(y,80,WORLD_SIZE-80);
  if(!isBlocked(x,y,32,blockers))return {x,y};
  for(let r=64;r<=640;r+=64)for(let a=0;a<8;a++){const nx=x+Math.cos(a*Math.PI/4)*r,ny=y+Math.sin(a*Math.PI/4)*r;if(!isBlocked(nx,ny,32,blockers))return{x:nx,y:ny};}
  return{x:3072,y:3072};
}

export function campusSnapshot(unlocked:string[]){const blockers=[...BUILDINGS],fences:Building[]=[];for(const z of ZONES.filter(z=>['lab','workshop','garden'].includes(z.id))){const r=z.radius+70,x=z.x-r,y=z.y-r,w=r*2;const wall=(x:number,y:number,w:number,h:number)=>({x,y,w,h,name:`${z.id}-围栏`,color:0x9aaa91,type:'basic' as const});fences.push(wall(x,y,w,18),wall(x,y,18,w),wall(x+w-18,y,18,w),wall(x,y+w-18,r-80,18),wall(z.x+80,y+w-18,r-80,18));if(!unlocked.includes(z.id))blockers.push(wall(x,y,w,w));}return{blockers:[...blockers,...fences],fences,regions:[...unlocked]};}
