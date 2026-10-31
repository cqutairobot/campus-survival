// P04 bounded port of src/enemies/minibosses.ts; S1 source remains frozen.
import type {ContentState} from './ContentState';
import {TAU} from '../../../core/math';
export function updateMiniBoss(g:ContentState,id:number,dt:number){const e=g.enemies,p=g.player,kind=g.content.enemies[e.kind[id]].id;e.shootTimer[id]-=dt;e.skillTimer[id]-=dt;
 if(kind==='inspector'){
  if(e.shootTimer[id]<=0){e.shootTimer[id]=3;for(let n=0;n<6;n++)g.enemyBullet(e.x[id],e.y[id],n*TAU/6+g.combatTime*.1,170,10,7,.75,false,id);}
  if(e.skillTimer[id]<=0){e.skillTimer[id]=7;for(let n=0;n<2;n++)g.spawnSummon('node',id,e.x[id]+(n?1:-1)*90,e.y[id]-40,0,true);}
 }else if(kind==='teamlead'){
  if(e.shootTimer[id]<=0){e.shootTimer[id]=4;for(let n=0;n<3;n++)g.addHazard('circle',p.x+(n-1)*130,p.y+(n%2?90:-55),0,0,80,1,.3,16,undefined,{ordinary:false,owner:id,ownerGeneration:e.generation[id]});}
  if(e.skillTimer[id]<=0){e.skillTimer[id]=8;for(let n=0;n<4;n++)g.spawnSummon('homework',id,e.x[id]+Math.cos(n*TAU/4)*90,e.y[id]+Math.sin(n*TAU/4)*90,12);}
 }
}
