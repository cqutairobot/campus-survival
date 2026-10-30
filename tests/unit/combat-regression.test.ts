import { describe,expect,it } from 'vitest';
import { GameEngine } from '../../src/core/engine';
import { freshSave } from '../../src/save/storage';
import { ENEMY_INDEX } from '../../src/data/catalog';
import { isBlocked, ZONES } from '../../src/world/campus';
const game=()=>{const g=new GameEngine(freshSave(),123);g.enemies.clear();g.weapons.length=0;g.stats.crit=0;return g;};
describe('武器与场景回归',()=>{
  it('激光同时击杀一排敌人时，交换删除不会漏过相邻目标',()=>{
    const g=game();g.weapons.push({id:'laser',level:5,rarity:0,evolved:false});for(let n=0;n<6;n++){const id=g.spawnEnemy('homework',g.player.x+100+n*50,g.player.y);g.enemies.hp[id]=1;g.enemies.speed[id]=0;}
    g.grid.rebuild(g.enemies.active,g.enemies.x,g.enemies.y);g.weaponSystem.update(.21);expect(g.kills).toBe(6);expect(g.enemies.active).toHaveLength(0);
  });
  it('回旋弹去程、回程各命中一次，同一段不重复扣血',()=>{
    const g=game(),id=g.spawnEnemy('homework',g.player.x+32,g.player.y);g.enemies.hp[id]=g.enemies.maxHp[id]=1000;g.enemies.speed[id]=0;
    g.grid.rebuild(g.enemies.active,g.enemies.x,g.enemies.y);const shot=g.shots.acquire(),s=g.shots.data[shot];
    Object.assign(s,{x:g.player.x,y:g.player.y,prevX:g.player.x,prevY:g.player.y,originX:g.player.x,originY:g.player.y,vx:420,vy:0,kind:'boomerang',source:'ppt',damage:10,life:3,pierce:99,radius:12,range:70,returning:false});
    for(let n=0;n<50;n++)g.weaponSystem.update(1/60);expect(g.damage.ppt).toBe(20);
  });
  it('同源持续区域重叠不重复叠伤',()=>{
    const g=game(),enemy=g.spawnEnemy('homework',g.player.x+10,g.player.y);g.enemies.hp[enemy]=1000;g.grid.rebuild(g.enemies.active,g.enemies.x,g.enemies.y);
    for(let n=0;n<2;n++){const id=g.areas.acquire();Object.assign(g.areas.data[id],{kind:'eraser',source:'eraser',x:g.player.x,y:g.player.y,radius:100,maxRadius:100,damage:10,life:2,age:0,delay:0,tick:0});}
    g.weaponSystem.update(1/60);expect(g.damage.eraser).toBe(10);
  });
  it('提前交稿对 Boss 精确扣除 8%，最终 Boss 上限 4000，且不暴击',()=>{
    for(const n of [0,2]){const g=game();g.startBoss(n);g.stats.crit=.6;const hp=g.enemies.hp[g.bossEnemy];g.bomb();expect(hp-g.enemies.hp[g.bossEnemy]).toBe(n===0?640:4000);}
  });
  it('Boss 的全部血量阶段可触发，期末第二阶段召唤四科考试',()=>{
    for(const [boss,ratios] of [[0,[.49]],[1,[.59,.29]],[2,[.69,.34]]] as const){const g=game();g.startBoss(boss);g.send({type:'introDone'});g.tick(1/60);for(const [n,ratio] of ratios.entries()){g.hitStop=0;g.enemies.hp[g.bossEnemy]=g.enemies.maxHp[g.bossEnemy]*ratio;g.tick(1/60);expect(g.bossStage).toBe(n+2);}if(boss===2)expect(g.enemies.active.filter(id=>g.enemies.kind[id]>=ENEMY_INDEX.math)).toHaveLength(4);}
  });
  it('图书馆加经验，食堂脱战回血，区域互不重叠',()=>{
    const g=game(),library=ZONES[0],canteen=ZONES[1];g.player.x=library.x;g.player.y=library.y;g.spawnDrop('xp',library.x,library.y,4);g.tick(1/60);expect(g.xp).toBeCloseTo(4.6);
    g.player.x=canteen.x;g.player.y=canteen.y;g.player.hp=50;g.player.lastHurt=-100;for(let n=0;n<60;n++)g.tick(1/60);expect(g.player.hp).toBeCloseTo(51);expect(Math.hypot(library.x-canteen.x,library.y-canteen.y)).toBeGreaterThan(library.radius+canteen.radius);
  });
  it('三种随机事件都能触发；传送落点安全，Boss 入场取消事件',()=>{
    const kinds=new Set<string>();for(let seed=1;seed<100;seed++){const g=new GameEngine(freshSave(),seed);g.semesterTime=81;g.combatTime=111;g.tick(1/60);if(g.gameEvent){kinds.add(g.gameEvent.kind);if(g.gameEvent.kind==='portal'){expect(isBlocked(g.gameEvent.x,g.gameEvent.y,20)).toBe(false);expect(isBlocked(g.gameEvent.x2,g.gameEvent.y2,20)).toBe(false);}}g.startBoss(0);expect(g.gameEvent).toBeNull();if(kinds.size===3)break;}expect(kinds.size).toBe(3);
  });
});
