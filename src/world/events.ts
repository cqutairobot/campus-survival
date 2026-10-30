import type {GameEngine} from '../core/engine';
import type {EventId} from '../types';
import {distanceSq} from '../core/math';
export const EVENT_DEFS=[{id:'portal',name:'临时调课',duration:20,description:'两个安全传送点，传送冷却 2 秒'},{id:'advisor',name:'导师突然找你',duration:28,description:'特殊精英必掉宝箱和红牛；提示结束后继续存在'},{id:'blackout',name:'停电',duration:18,description:'视野 260，危险轮廓保持清晰'},{id:'examRage',name:'考试周狂暴',duration:25,description:'刷怪 +30%、敌人移速 +15%、普通经验 +20%；结束生成磁铁'},{id:'sports',name:'校园运动会',duration:20,description:'玩家移速 +20%、冲锋权重 ×2；结束获得 30 护盾'},{id:'rainstorm',name:'突降暴雨',duration:20,description:'玩家与普通敌人移速 −10%、敌弹速度 −15%；结束生成红牛'}] as const;
export class CampusEvents{
 private next=110;private nextBlackout=90;
 constructor(private g:GameEngine){}
 start(kind:EventId){const g=this.g;if(g.bossActive)return;const p=g.player,a=g.safePoint(p.x+120,p.y+80),b=g.safePoint(p.x+g.streams.event.range(600,850),p.y+g.streams.event.range(-400,400)),def=EVENT_DEFS.find(e=>e.id===kind)!;g.gameEvent={kind,remaining:def.duration,warning:3,x:a.x,y:a.y,x2:b.x,y2:b.y,cooldown:0};g.message(`3 秒后 · ${def.name} · ${def.description}`,6);if(!g.progress.events.includes(kind)){g.progress.events.push(kind);g.discover(`event:${kind}`);}}
 update(dt:number){const g=this.g,p=g.player,event=g.gameEvent;
  if(g.bossActive){g.gameEvent=null;return;}
  if(g.manifest.dailyRule==='nightRun'&&g.semesterTime>=this.nextBlackout){this.nextBlackout+=90;if(event?.kind!=='blackout')this.start('blackout');}
  if(event){if(event.warning>0){event.warning=Math.max(0,event.warning-dt);if(event.warning<=0&&event.kind==='advisor'){g.spawnEnemy('advisor');}return;}event.remaining-=dt;event.cooldown-=dt;if(event.remaining<=0){if(event.kind==='examRage')g.spawnDrop('magnet',p.x+45,p.y,1);if(event.kind==='sports')g.addShield(30,10);if(event.kind==='rainstorm')g.spawnDrop('heal',p.x+45,p.y,25);g.gameEvent=null;return;}
   if(event.kind==='portal'&&event.cooldown<=0){const a=distanceSq(p.x,p.y,event.x,event.y),b=distanceSq(p.x,p.y,event.x2,event.y2);if(a<38**2||b<38**2){const to=a<b?{x:event.x2,y:event.y2}:{x:event.x,y:event.y};p.x=p.prevX=to.x;p.y=p.prevY=to.y;p.invincible=1.2;event.cooldown=2;g.message('临时调课 · 已抵达新教室');}}return;}
  if(g.week>=3&&g.semesterTime>=this.next){this.next=g.semesterTime+g.streams.event.range(75,105);const defs=EVENT_DEFS.filter(e=>!(g.manifest.dailyRule==='nightRun'&&e.id==='blackout'));this.start(g.streams.event.weighted(defs,()=>1).id);}
 }
}
