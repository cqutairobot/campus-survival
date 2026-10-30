import {describe,expect,it,vi} from 'vitest';
import {WEAPONS} from '../../src/data/catalog';
import {GameEngine} from '../../src/core/engine';
import {freshSave,validateSave} from '../../src/save/storage';
import {weaponChanges,weaponParams} from '../../src/weapons/params';
import {TrailHistory} from '../../src/fx/trails';
import {HitStopBudget} from '../../src/fx/feedback';
import {Haptics} from '../../src/fx/haptics';

describe('v2 武器成长和表现边界',()=>{
  for(const def of WEAPONS){
    it(`${def.name} 五级均有可见变化，卡片与参数一致`,()=>{
      expect(new Set(def.forms).size).toBe(5);
      for(let level=1;level<=5;level++){
        const next=weaponParams({id:def.id,level,rarity:0,evolved:false}),changes=weaponChanges(def.id,level);
        expect(changes.some(c=>c.label==='形态'&&c.after===next.form)).toBe(true);
        if(level>1){const prev=weaponParams({id:def.id,level:level-1,rarity:0,evolved:false});expect(['count','range','pierce','width','spread','explosion','duration','interval'].some(k=>next[k as 'count']!==prev[k as 'count'])).toBe(true);}
      }
    });
    it(`${def.evolution.name} 正常攻击产生实际伤害与专属轮廓`,()=>{
      const g=new GameEngine(freshSave(),12);g.enemies.clear();g.weapons.splice(0,1,{id:def.id,level:5,rarity:0,evolved:true});g.stats.crit=0;
      for(const radius of [40,90,150,220])for(let n=0;n<12;n++){const a=n*Math.PI/6,id=g.spawnEnemy('receipt',g.player.x+Math.cos(a)*radius,g.player.y+Math.sin(a)*radius);g.enemies.hp[id]=g.enemies.maxHp[id]=100000;}
      g.grid.rebuild(g.enemies.active,g.enemies.x,g.enemies.y);
      for(let frame=0;frame<320;frame++){g.combatTime+=1/60;g.weaponSystem.update(1/60);}
      expect(g.damage[def.id]).toBeGreaterThan(0);expect(g.poolFailures).toBe(0);
      if(def.id==='orbit')expect(weaponParams(g.weapons[0]).count).toBe(6);
      else expect(g.visualEvents.some(e=>e.type==='signature'&&e.weapon===def.id&&e.evolved)).toBe(true);
    });
  }
  it('双波每波每敌人仅命中一次，光束也不因视觉持续而重复',()=>{
    for(const [weapon,expected] of [['wifi',24],['laser',28]] as const){
      const g=new GameEngine(freshSave(),12);g.enemies.clear();g.weapons.splice(0,1,{id:weapon,level:1,rarity:0,evolved:false});g.stats.crit=0;
      const id=g.spawnEnemy('receipt',g.player.x+100,g.player.y);g.enemies.hp[id]=1000;g.grid.rebuild(g.enemies.active,g.enemies.x,g.enemies.y);
      for(let n=0;n<65;n++){g.combatTime+=1/60;g.weaponSystem.update(1/60);}
      expect(g.damage[weapon]).toBe(expected);
    }
  });
  it('拖尾同一模拟时刻只采样一次，有固定历史上限',()=>{
    const trail=new TrailHistory();for(let frame=0;frame<30;frame++)for(let render=0;render<4;render++)trail.sample(frame*10,0,frame/60,16);
    expect(trail.points).toHaveLength(16);expect(new Set(trail.points.map(p=>p.time)).size).toBe(16);
  });
  it('全局停顿在任何滚动一秒内最多三个逻辑步，合并同帧请求',()=>{
    const budget=new HitStopBudget();let current=budget.request(0,1/60,0);expect(current).toBe(1/60);
    current=budget.request(0,2/60,current);expect(current).toBe(2/60);
    expect(budget.request(.1,2/60,0)).toBe(1/60);expect(budget.request(.9,1/60,0)).toBe(0);
    expect(budget.request(1.01,2/60,0)).toBe(2/60);
  });
  it('旧 schema v2 自动补齐设置，保留进度与已有偏好',()=>{
    const old={...freshSave(),credits:123,settings:{muted:true,quality:'high',shake:.2,flash:0}};
    const save=validateSave(old)!;expect(save.credits).toBe(123);expect(save.settings).toMatchObject({muted:true,quality:'high',shake:.2,flash:0,haptics:true,afterimages:true});
  });
  it('触觉独立开关、能力检测、用户激活及至少 200ms 限频',()=>{
    const vibrate=vi.fn();vi.stubGlobal('navigator',{vibrate,userActivation:{hasBeenActive:true}});const h=new Haptics(),event={type:'level' as const,x:0,y:0,size:1,color:0};
    h.event(event,false,0);expect(vibrate).not.toHaveBeenCalled();h.event(event,true,0);h.event(event,true,100);h.event({...event,type:'evolution'},true,200);
    expect(vibrate.mock.calls).toEqual([[20],[[12,35,18]]]);vi.unstubAllGlobals();
  });
});
