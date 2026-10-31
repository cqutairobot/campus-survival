// P04 bounded port of src/enemies/bosses.ts; S1 source remains frozen.
import type { ContentState } from './ContentState';
import { distanceSq, TAU } from '../../../core/math';
import { RANK_CODE } from '../../../data/enemies';
import { slowFactor } from '../../../combat/status';
export class BossSystem {
  private attack=2.5;private summon=9;private skill=5;private lastStage=1;private doubleCharge=false;
  constructor(private g:ContentState){}
  reset(){this.attack=2.5;this.summon=9;this.skill=5;this.lastStage=1;this.doubleCharge=false;}
  update(dt:number){
    const g=this.g,id=g.bossEnemy,e=g.enemies,p=g.player;if(id<0||!e.alive[id]||e.hp[id]<=0||e.frozen[id]>0)return;
    const kind=e.kind[id],ratio=e.hp[id]/e.maxHp[id],stage=kind===this.g.content.enemyIndex.proposal?(ratio<.5?2:1):kind===this.g.content.enemyIndex.defense?(ratio<.3?3:ratio<.6?2:1):(ratio<.35?3:ratio<.7?2:1);
    g.bossStage=stage;
    if(stage!==this.lastStage){this.lastStage=stage;g.emit({type:'boss',x:e.x[id],y:e.y[id],color:0xe6b75e,size:230,text:`阶段 ${stage}`});g.impact(6,.05);if(kind===this.g.content.enemyIndex.finals&&stage===2)this.exams();}
    this.attack-=dt;this.summon-=dt;this.skill-=dt;
    const dx=p.x-e.x[id],dy=p.y-e.y[id],dist=Math.hypot(dx,dy)||1;
    if(e.state[id]===1){
      e.timer[id]-=dt;if(e.timer[id]<=0){e.state[id]=2;e.timer[id]=.6;}
    }else if(e.state[id]===2){
      g.moveEnemy(id,Math.cos(e.angle[id])*560*dt,Math.sin(e.angle[id])*560*dt);e.timer[id]-=dt;
      if(e.timer[id]<=0){e.state[id]=0;if(stage>=2&&!this.doubleCharge){this.doubleCharge=true;this.charge();}else this.doubleCharge=false;}
    }else if(dist>230){const speed=e.speed[id]*slowFactor(e,id);g.moveEnemy(id,dx/dist*speed*dt,dy/dist*speed*dt);}
    if(kind===this.g.content.enemyIndex.proposal){
      if(this.attack<=0){this.ring(stage>=2?18:12,175);this.attack=5.5;}
      if(this.skill<=0&&e.state[id]===0){this.charge();this.skill=9;}
      if(this.summon<=0){for(let n=0;n<6;n++)g.spawnSummon('ppt',id,e.x[id]+Math.cos(n*TAU/6)*95,e.y[id]+Math.sin(n*TAU/6)*95);this.summon=10;}
    }else if(kind===this.g.content.enemyIndex.defense){
      if(this.attack<=0){
        const a=Math.atan2(dy,dx);
        for(let n=0;n<2;n++){const angle=a+(n===0?-.24:.24)*(stage===3?-1:1),hazard=g.addHazard('line',e.x[id],e.y[id],e.x[id]+Math.cos(angle)*1100,e.y[id]+Math.sin(angle)*1100,18,.9,.8,18);if(hazard)hazard.angularSpeed=(stage===3?-1:1)*.6;}
        this.attack=stage===3?4.5:6;
      }
      if(this.skill<=0){this.wall();this.skill=stage>=2?7:10;}
      if(this.summon<=0){for(let n=0;n<3+stage;n++)g.spawnSummon('review',id,e.x[id]+g.streams.ai.range(-150,150),e.y[id]+g.streams.ai.range(-150,150));this.summon=12;}
    }else{
      if(this.attack<=0){this.ring(28,stage===3?210:175,true);this.attack=stage===3?3.6:4.5;}
      if(this.skill<=0){
        const pattern=g.streams.ai.int(0,stage>=2?3:1);
        if(pattern===0)this.math();else if(pattern===1)this.fan();else if(pattern===2)this.wall();else g.addHazard('ring',p.x,p.y,0,0,300,.85,1.3,18,Math.atan2(e.y[id]-p.y,e.x[id]-p.x));
        this.skill=stage===3?3.8:5.5;
      }
      if(this.summon<=0&&stage===3){g.spawnSummon('examCharger',id,p.x+350,p.y+250,0);this.summon=12;}
    }
  }
  private ring(count:number,speed:number,safe=false){
    const g=this.g,e=g.enemies,id=g.bossEnemy,rotation=g.streams.ai.range(0,TAU),safeA=Math.atan2(g.player.y-e.y[id],g.player.x-e.x[id]);
    g.emit({type:'warning',x:e.x[id],y:e.y[id],color:0xe57474,size:80,duration:.75});
    for(let n=0;n<count;n++){const a=rotation+n*TAU/count;if(safe&&Math.cos(a-safeA)>.84)continue;g.enemyBullet(e.x[id],e.y[id],a,speed,10,7,.75,false);}
  }
  private charge(){const g=this.g,e=g.enemies,id=g.bossEnemy;e.angle[id]=Math.atan2(g.player.y-e.y[id],g.player.x-e.x[id]);e.state[id]=1;e.timer[id]=.9;g.addHazard('line',e.x[id],e.y[id],e.x[id]+Math.cos(e.angle[id])*380,e.y[id]+Math.sin(e.angle[id])*380,42,.9,0,0);}
  private wall(){
    const g=this.g,p=g.player,vertical=g.streams.ai.next()<.5,gap=vertical?p.y:p.x;
    for(let n=-5;n<=5;n++){
      const offset=n*54;if(Math.abs(offset)<85)continue;
      if(vertical)g.enemyBullet(p.x-450,gap+offset,0,160,12,11,.9,false);else g.enemyBullet(gap+offset,p.y-430,Math.PI/2,160,12,11,.9,false);
    }
    g.emit({type:'warning',x:p.x,y:p.y,color:0xb999d2,size:120,text:'弹幕通道',duration:.9});
  }
  private math(){const g=this.g,p=g.player;for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++){if(x===0&&y===0||g.streams.ai.next()<.25)continue;g.addHazard('circle',p.x+x*100,p.y+y*100,0,0,40,.9,.35,16);}}
  private fan(){const g=this.g,e=g.enemies,id=g.bossEnemy,a=Math.atan2(g.player.y-e.y[id],g.player.x-e.x[id]);for(let n=0;n<11;n++)g.enemyBullet(e.x[id],e.y[id],a+(n-5)*.16,180,10,7,.8,false);}
  private exams(){const g=this.g,p=g.player;for(const [i,kind] of ['math','english','coding','mechanics'].entries()){const a=i*TAU/4;g.spawnEnemy(kind,p.x+Math.cos(a)*340,p.y+Math.sin(a)*340);}}
  updateExams(dt:number){
    const g=this.g,e=g.enemies,p=g.player;
    for(const id of e.active){if(e.rank[id]!==RANK_CODE.bossAdd||e.hp[id]<=0||e.frozen[id]>0||!['math','english','coding','mechanics'].includes(this.g.content.enemies[e.kind[id]].id))continue;e.cooldown[id]-=dt;if(e.cooldown[id]>0)continue;e.cooldown[id]=5+g.streams.ai.next()*2;
      const kind=e.kind[id];if(kind===this.g.content.enemyIndex.math){for(let n=0;n<4;n++)g.addHazard('circle',p.x+(n%2?85:-85),p.y+(n<2?85:-85),0,0,38,.9,.25,12);}
      else if(kind===this.g.content.enemyIndex.english){const a=Math.atan2(p.y-e.y[id],p.x-e.x[id]);for(let n=-2;n<=2;n++)g.enemyBullet(e.x[id],e.y[id],a+n*.22,165,8,6,.8);}
      else if(kind===this.g.content.enemyIndex.coding){for(let n=-2;n<=2;n++){if(n===0)continue;g.enemyBullet(p.x+n*60,p.y-350,Math.PI/2,145,9,7,.85);}}
      else if(distanceSq(p.x,p.y,e.x[id],e.y[id])<600**2)g.addHazard('ring',e.x[id],e.y[id],0,0,250,.9,1.2,12,Math.atan2(p.y-e.y[id],p.x-e.x[id]));
    }
  }
}
