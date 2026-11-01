import type { GameEngine } from '../../src/core/engine';
import { WEAPON_MAP } from '../../src/data/catalog';
import { distanceSq } from '../../src/core/math';
import { isBlocked, slideMove } from '../../src/world/campus';

export type Strategy = 'balanced' | 'expand' | 'specialize';
/** Only ordinary movement, draft selection and reward dismissal. No debug grants. */
export function pilot(g:GameEngine,strategy:Strategy='balanced') {
  if(g.phase==='draft') {
    const wanted=['knife','orbit','bot','lightning','wifi','broadcast','xp','haste','multi','speed','area','regen'];
    const score=g.cards.map(c=>{
      const owned=[...g.weapons,...g.passives].find(w=>w.id===c.id),index=wanted.indexOf(c.id);
      const main=g.weapons[0],recipe=WEAPON_MAP[main.id].evolution.passive;
      let value=(index<0?0:30-index)+(owned?9+owned.level*2:0)+(c.type==='weapon'?7:0);
      if(strategy==='balanced') {
        if(c.type==='weapon'&&!owned&&g.weapons.length<3)value+=38;
        if(c.id===main.id)value+=25;
        if(c.id===recipe&&!owned&&main.level>=4)value+=70;
      } else if(strategy==='expand') {
        if(c.type==='weapon'&&!owned&&g.weapons.length<4)value+=100;
        if(c.id===main.id)value+=20;
        if(c.id===recipe&&!owned&&main.level>=4)value+=70;
      } else {
        if(c.id===main.id)value+=120;
        if(c.id===recipe&&!owned)value+=60;
        if(owned&&c.type==='weapon')value+=30;
      }
      if(c.id==='regen'&&g.player.hp<g.stats.maxHp*.7)value+=20;
      return value;
    });
    g.send({type:'choose',index:score.indexOf(Math.max(...score))});return;
  }
  const command=g.phase==='bossIntro'?'introDone':g.phase==='bossDeath'?'bossDeathDone':g.phase==='chest'?'chestDone':g.phase==='evolution'?'evolutionDone':null;
  if(command){g.send(command==='chestDone'||command==='evolutionDone'?{type:command,token:g.rewards.token}:{type:command});return;}
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
