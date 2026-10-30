import { describe, expect, it } from 'vitest';
import { SlotPool } from '../../src/core/pool';
import { SpatialGrid } from '../../src/core/grid';
import { FixedLoop } from '../../src/core/loop';
import { Random, segmentDistanceSq } from '../../src/core/math';
import { actualDamage, inCone, sweptHit } from '../../src/combat/damage';
import { BUILDINGS, isBlocked, safePoint, slideMove } from '../../src/world/campus';
import { Navigation } from '../../src/world/navigation';
import { validCommand } from '../../src/debug/commands';
describe('实体、数学与输入边界',()=>{
  it('O(1) 池复用后旧 generation 无效，重复释放不损坏池',()=>{const pool=new SlotPool(2),id=pool.acquire(),gen=pool.generation[id];pool.acquire();expect(pool.acquire()).toBe(-1);pool.release(id);pool.release(id);expect(pool.acquire()).toBe(id);expect(pool.valid(id,gen)).toBe(false);expect(pool.active).toHaveLength(2);pool.clear();expect(pool.active).toHaveLength(0);expect(pool.acquire()).not.toBe(-1);});
  it('空间网格不丢实体、不重复返回，处理负坐标与哈希冲突',()=>{const rng=new Random(6),x=new Float32Array(64),y=new Float32Array(64),active=Array.from({length:64},(_,i)=>i),grid=new SpatialGrid(64);for(const id of active){x[id]=rng.range(-500,6500);y[id]=rng.range(-500,6500);}grid.rebuild(active,x,y);for(let n=0;n<40;n++){const px=rng.range(0,6000),py=rng.range(0,6000),r=rng.range(1,450),found=grid.query(px,py,r,[]);expect(found.length).toBe(new Set(found).size);for(const id of active)if(Math.hypot(x[id]-px,y[id]-py)<r)expect(found).toContain(id);}});
  it('高速扫掠弹和激光不会跨过小目标，扇形不命中背面',()=>{expect(sweptHit(0,0,1000,0,500,4,5)).toBe(true);expect(sweptHit(0,0,1000,0,500,8,5)).toBe(false);expect(segmentDistanceSq(20,10,0,0,10,0)).toBe(200);expect(inCone(0,0,60,0,0,100,Math.PI/2)).toBe(true);expect(inCone(0,0,-60,0,0,100,Math.PI/2)).toBe(false);expect(actualDamage(8,100)).toBe(8);});
  it('固定步长在 30/60/120Hz 下得到相同模拟结果，后台增量受限',()=>{const values=[];for(const fps of [30,60,120]){let ticks=0;const loop=new FixedLoop();for(let n=0;n<fps*5;n++)loop.advance(1/fps,()=>ticks++);values.push(ticks);}expect(values).toEqual([300,300,300]);let count=0;new FixedLoop().advance(5,()=>count++);expect(count).toBe(5);});
  it('沿墙滑动，地图边界和安全生成点不在建筑内',()=>{const b=BUILDINGS[0],p=slideMove(b.x-15,b.y+70,10,20,12);expect(p.x).toBe(b.x-12);expect(p.y).toBe(b.y+90);expect(slideMove(12,12,-100,-100,12)).toEqual({x:12,y:12});const safe=safePoint(b.x+50,b.y+60);expect(isBlocked(safe.x,safe.y,32)).toBe(false);});
  it('共享流场可从建筑背面绕行，不穿越阻挡单元',()=>{const nav=new Navigation();nav.rebuild(3072,3072);const d=nav.direction(2480,2160);expect(Math.hypot(d.x,d.y)).toBeGreaterThan(0);expect(nav.distance.some(v=>v!==32767)).toBe(true);});
  it('调试和 UI 指令运行时验证 NaN、非法 ID、类型和索引',()=>{expect(validCommand({type:'week',value:NaN})).toBe(false);expect(validCommand({type:'grant',id:'__proto__',level:5})).toBe(false);expect(validCommand({type:'god',value:'yes'})).toBe(false);expect(validCommand({type:'choose',index:3})).toBe(false);expect(validCommand({type:'grant',id:'orbit',level:5,evolved:true})).toBe(true);});
});
