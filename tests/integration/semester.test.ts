import { expect,it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { GameEngine } from '../../src/core/engine';
import { freshSave } from '../../src/save/storage';
import { TALENTS, WEAPON_MAP } from '../../src/data/catalog';
import { isBlocked, slideMove } from '../../src/world/campus';
import { distanceSq } from '../../src/core/math';

/** A deterministic player using only movement, the normal draft and reward actions. */
function pilot(g:GameEngine){
  if(g.phase==='draft'){
    const wanted=['knife','orbit','bot','lightning','wifi','broadcast','xp','haste','multi','speed','area','regen'];
    const score=g.cards.map(c=>{
      const owned=[...g.weapons,...g.passives].find(w=>w.id===c.id),index=wanted.indexOf(c.id);
      return (index<0?-100:30-index)+(owned?9+owned.level*2:0)+(c.type==='weapon'?7:0)+(c.id==='regen'&&g.player.hp<g.stats.maxHp*.7?20:0);
    });g.send({type:'choose',index:score.indexOf(Math.max(...score))});return;
  }
  const command=g.phase==='bossIntro'?'introDone':g.phase==='bossDeath'?'bossDeathDone':g.phase==='chest'?'chestDone':g.phase==='evolution'?'evolutionDone':null;
  if(command){g.send({type:command});return;}
  if(g.phase!=='playing'||g.frame%6!==0)return;
  const p=g.player,e=g.enemies;let tx=3072+Math.cos(g.combatTime*.023)*280,ty=3072+Math.sin(g.combatTime*.023)*240,closest=Infinity;
  for(const id of g.drops.active){const d=g.drops.data[id],dist=distanceSq(p.x,p.y,d.x,d.y),weight=d.kind==='chest'?.04:d.kind==='heal'&&p.hp<g.stats.maxHp*.8?.1:1;if(dist*weight<closest&&!isBlocked(d.x,d.y,20)){closest=dist*weight;tx=d.x;ty=d.y;}}
  let best=-Infinity,bx=0,by=0;
  for(let n=0;n<24;n++){
    const a=n*Math.PI/12,ix=Math.cos(a),iy=Math.sin(a),next=slideMove(p.x,p.y,ix*45,iy*45,12);
    let score=(Math.hypot(tx-p.x,ty-p.y)-Math.hypot(tx-next.x,ty-next.y))*.8;
    if(Math.hypot(next.x-p.x,next.y-p.y)<30)score-=300;
    for(const id of e.active){const d=Math.hypot(next.x-e.x[id],next.y-e.y[id])-e.radius[id];if(d<65)score-=Math.max(0,65-d)**2*.025;}
    for(const id of g.enemyShots.active){const s=g.enemyShots.data[id];if(s.age<0)continue;const d=Math.hypot(next.x-s.x-s.vx*.25,next.y-s.y-s.vy*.25);if(d<65)score-=(65-d)*3;}
    for(const h of g.hazards)if(h.kind==='circle'&&distanceSq(next.x,next.y,h.x,h.y)<(h.radius+25)**2)score-=220;
    score+=ix*g.inputX*6+iy*g.inputY*6;
    if(score>best){best=score;bx=ix;by=iy;}
  }
  g.inputX=bx;g.inputY=by;
}
it('局外养成后的自然开局可完成学期（普通输入、无 debug）',()=>{
  const save=freshSave();save.talents=Object.fromEntries(TALENTS.map(t=>[t.id,5]));
  const g=new GameEngine(save,Number(process.env.SIM_SEED)||123),timeline:{week:number;level:number;hp:number;kills:number}[]=[];let last=0;
  for(let n=0;n<60*1400&&!g.result;n++){
    pilot(g);g.tick(1/60);g.visualEvents.length=0;
    if(g.week!==last){last=g.week;timeline.push({week:g.week,level:g.level,hp:Math.round(g.player.hp),kills:g.kills});}
  }
  console.log('自然学期回归',JSON.stringify({timeline,result:g.result,phase:g.phase,build:g.weapons.map(w=>({name:WEAPON_MAP[w.id].name,level:w.level,evolved:w.evolved}))}));
  if(process.env.CAMPUS_REPORT)writeFileSync(process.env.CAMPUS_REPORT,JSON.stringify({seed:Number(process.env.SIM_SEED)||123,startingTalents:save.talents,timeline,result:g.result,metrics:g.metrics},null,2));
  expect(g.cheated).toBe(false);expect(g.result).not.toBeNull();expect(g.result?.victory).toBe(true);expect(g.result?.bosses).toBe(3);expect(g.poolFailures).toBe(0);
},120000);
it('初始角色原地停留可自然死亡并正常结算',()=>{
  const g=new GameEngine(freshSave(),51);
  for(let n=0;n<60*1400&&!g.result;n++){
    if(g.phase==='draft')g.send({type:'choose',index:0});
    const done=g.phase==='bossIntro'?'introDone':g.phase==='bossDeath'?'bossDeathDone':g.phase==='chest'?'chestDone':g.phase==='evolution'?'evolutionDone':null;
    if(done)g.send({type:done});g.tick(1/60);g.visualEvents.length=0;
  }
  expect(g.cheated).toBe(false);expect(g.result?.victory).toBe(false);expect(g.result?.week).toBeGreaterThanOrEqual(1);
  if(process.env.CAMPUS_STATIONARY_REPORT)writeFileSync(process.env.CAMPUS_STATIONARY_REPORT,JSON.stringify({seed:51,startingTalents:{},input:'stationary; ordinary draft index 0 and reward dismissal',result:g.result,metrics:g.metrics},null,2));
});
