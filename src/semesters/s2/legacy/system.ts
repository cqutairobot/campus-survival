import type {ContentSkill,WeaponIdentity} from '../types';
// P04 bounded port of src/weapons/system.ts; S1 source remains frozen.
import type { ContentState } from './ContentState';
import { weaponParams, type WeaponParams } from './params';
import { angleDelta, colorNumber, distanceSq, TAU } from '../../../core/math';
import {applySlow,freezeEnemy} from '../../../combat/status';
import {SummonSystem} from './summons';
import {WhiteboardSystem} from '../whiteboard';
import {SpoolSystem} from '../spool';
import {FusionSystem} from '../fusions';
import {PrinterSystem} from '../printer';
import { inCone, sweptHit } from './damage';
import type { Area, Shot } from '../../../entities/pools';
import type { WeaponKind } from '../../../types';

export function botPosition(x:number,y:number,time:number,index:number,count:number,level=1,evolved=false){const a=time*(evolved?.5:level===2?1:.7)+index*TAU/count+(level>=4?Math.PI/4:0),radius=level>=4?82:65;return{x:x+Math.cos(a)*radius,y:y+Math.sin(a)*(level===4?70:45)-18};}
export class WeaponSystem {
  private cooldowns:Record<string,number>={};
  private candidates:number[]=[];
  private chain:number[]=[];
  private cancelTimer=0;
  private focusTimer=0;private fusionTimers:Record<string,number>={};private rounds:Record<string,number>={};readonly summons:SummonSystem;
  readonly fusions:FusionSystem;readonly spool:SpoolSystem;readonly printer:PrinterSystem;
  private generations:Record<string,number>={};private source?:WeaponIdentity;private owners=new WeakMap<object,WeaponIdentity>();
  identity(skill:ContentSkill):WeaponIdentity{return{id:skill.id as WeaponIdentity['id'],instanceId:skill.instanceId!,generation:this.generations[skill.id]??0};}
  accepts(source:WeaponIdentity){return (this.generations[source.id]??0)===source.generation&&this.game.weapons.some(w=>w.id===source.id&&w.instanceId===source.instanceId);}
  private attack=0;private attackId='';private identities=new WeakMap<object,string>();
  private hit(id:number,damage:number,source:WeaponKind,x:number,y:number,knockback=1){return this.game.hitEnemy(id,damage,source,x,y,knockback,true,true,false,false,false,{weapon:this.source,attackId:this.attackId,dot:['coffee','eraser','cryo','icefire','ink'].includes(source)});}
  readonly whiteboard:WhiteboardSystem;
  constructor(private game:ContentState){this.fusions=new FusionSystem(game);this.summons=new SummonSystem(game);this.whiteboard=new WhiteboardSystem(game);this.spool=new SpoolSystem(game);this.printer=new PrinterSystem(game);}
  remove(id:string){this.generations[id]=(this.generations[id]??0)+1;this.fusions.remove(id);if(id==='s2:spool')this.spool.remove();if(id==='s2:printer')this.printer.remove();this.summons.remove(id);if(id==='s2:whiteboard')this.whiteboard.remove();for(const target of this.game.enemies.active)if(this.game.enemies.burnSource[target]===id){this.game.enemies.burn[target]=0;this.game.enemies.burnDamage[target]=0;}delete this.cooldowns[id];const g=this.game;for(const n of [...g.shots.active])if(g.shots.data[n].source===id)g.shots.release(n);for(const n of [...g.areas.active])if(g.areas.data[n].source===id)g.areas.release(n);}
  reset(id:string){this.cooldowns[id]=.05;if(id==='s2:whiteboard')this.whiteboard.reset();}
  private nearest(x:number,y:number,range:number,exclude?:number[]){
    const e=this.game.enemies;let result=-1,best=range*range;
    this.game.grid.query(x,y,range,this.candidates);
    for(const id of this.candidates){if(!e.alive[id]||e.hp[id]<=0||exclude?.includes(id))continue;const d=distanceSq(x,y,e.x[id],e.y[id]);if(d<best){best=d;result=id;}}
    return result;
  }
  private shot(source:WeaponKind,x:number,y:number,angle:number,speed:number,damage:number,range:number,pierce:number,kind:Shot['kind']='straight',evolved=false,target=-1,fragment=false,params?:WeaponParams){
    const g=this.game,id=g.shots.acquire();if(id<0){g.poolFailures++;return;}
    const s=g.shots.data[id];this.identities.set(s,this.attackId);if(this.source)this.owners.set(s,this.source);s.x=s.prevX=s.originX=x;s.y=s.prevY=s.originY=y;s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed;
    s.damage=damage;s.life=kind==='boomerang'?range/speed*2+1:range/speed;s.age=0;s.radius=source==='code'?7:source==='ppt'?12:source==='staple'?3:5;
    s.source=source;s.color=colorNumber(this.game.content.weaponById[source].color);s.kind=kind;s.pierce=pierce;s.hits.length=0;s.target=target;
    s.targetGeneration=target<0?0:g.enemies.generation[target];s.range=range;s.returning=false;s.evolved=evolved;s.fragment=fragment;
    s.frozen=0;s.ordinary=false;s.bounce=(source==='shuttle'||source==='binder')?pierce-1:0;s.decay=source==='binder'||evolved?.9:.85;s.level=params?.level??1;s.explosion=params?.explosion??24;s.secondaryDamage=params?.secondaryDamage??0;s.launchAngle=angle;
    g.emit({type:'shot',x,y,color:s.color,size:8,angle,weapon:source,level:s.level,evolved});
  }
  private area(source:WeaponKind,kind:Area['kind'],x:number,y:number,radius:number,damage:number,life:number,delay=0,evolved=false,secondaryDamage=0){
    const g=this.game,id=g.areas.acquire();if(id<0){g.poolFailures++;return;}
    const a=g.areas.data[id];this.identities.set(a,this.attackId);if(this.source)this.owners.set(a,this.source);a.x=x;a.y=y;a.radius=kind==='pulse'?0:radius;a.maxRadius=radius;a.damage=damage;a.life=life;a.age=0;a.delay=delay;
    a.source=source;a.kind=kind;a.color=colorNumber(this.game.content.weaponById[source].color);a.evolved=evolved;a.triggered=false;a.hits.clear();a.tick=0;a.cancelTick=0;a.secondaryDamage=secondaryDamage;a.interval=kind==='icefire'?.4:.5;a.burstTick=2;
    if(kind==='rain'||kind==='brick'||kind==='aftershock')g.emit({type:'rain',x,y,color:a.color,size:radius,duration:delay,weapon:source,evolved});
  }
  update(dt:number){
    const g=this.game,p=g.player,e=g.enemies,st=g.combatStats;
    this.fusions.prune();this.summons.prune();this.whiteboard.prune();this.spool.prune();this.printer.prune();
    this.cancelTimer-=dt;this.focusTimer-=dt;
    for(const skill of g.weapons){
      const def=this.game.content.weaponById[skill.id],id=def.id,ev=skill.evolved,params=weaponParams(this.game.content,skill,st,g.damageMultiplier);
      const {damage,range,count,interval}=params;this.source=this.identity(skill);this.attackId=`weapon:${++this.attack}`;
      if(id==='s2:fieldHub'||id==='s2:holoReview'||id==='s2:digitalTwin'){this.fusions.update(skill,params,dt);continue;}
      if(id==='s2:spool'){this.spool.update(skill,params,dt);continue;}
      if(id==='s2:printer'){this.printer.update(skill,params,dt);continue;}
      if(id==='s2:drone'){this.summons.updateDrones(skill,params,dt);continue;}
      if(id==='s2:whiteboard'){this.whiteboard.update(skill,params,dt);continue;}
      if(id==='blueprint'){this.summons.update(skill,params,dt,(turret,power)=>{const target=this.nearest(turret.x,turret.y,power.range);if(target>=0)this.shot(id,turret.x,turret.y,Math.atan2(e.y[target]-turret.y,e.x[target]-turret.x),550,power.damage,power.range,power.pierce,'straight',ev,target,false,power);});continue;}
      if(id==='sword'){this.fusionTimers.sword=(this.fusionTimers.sword??0)-dt;if(this.fusionTimers.sword<=0){this.fusionTimers.sword+=1.3/st.haste;this.blast(p.x,p.y,330*st.area,params.secondaryDamage,id);}}
      if(id==='orbit'){
        for(let n=0;n<count;n++){
          const a=g.combatTime*2.4*st.haste+n*TAU/count,x=p.x+Math.cos(a)*range,y=p.y+Math.sin(a)*range;
          g.grid.query(x,y,42,this.candidates);
          for(const target of this.candidates){
            const key=target*12+n;
            if(e.alive[target]&&e.orbitHits[key]<=g.combatTime&&distanceSq(x,y,e.x[target],e.y[target])<(e.radius[target]+17)**2){
              e.orbitHits[key]=g.combatTime+interval;this.attackId=`orbit:${n}:${++this.attack}`;this.hit(target,damage,id,x,y);
            }
          }
        }
        if(ev&&this.cancelTimer<=0){this.cancelBullet(p.x,p.y,range,'orbit');this.cancelTimer=1.2;}
        continue;
      }
      this.cooldowns[id]=(this.cooldowns[id]??.2)-dt;if(this.cooldowns[id]>0)continue;
      this.cooldowns[id]+=interval;this.attackId=`weapon:${++this.attack}`;
      const nearest=this.nearest(p.x,p.y,id==='lightning'?600:Math.max(400,range));
      const angle=nearest>=0?Math.atan2(e.y[nearest]-p.y,e.x[nearest]-p.x):p.facing;
      const color=colorNumber(def.color);
      if(!['knife','staple','code','ppt','bot','hub','shuttle','binder','sword'].includes(id))g.emit({type:'shot',x:p.x,y:p.y,color,size:8,angle,weapon:id,level:skill.level,evolved:ev});
      if(ev||def.fusion||['mentor','ruler','prism','cryo','brick'].includes(id))g.emit({type:'signature',x:p.x,y:p.y,color,size:range,angle,weapon:id,level:skill.level,evolved:ev,value:count,duration:Math.min(.8,interval*.8)});
      if(['knife','staple','code','ppt','shuttle','binder','sword'].includes(id)){
        this.chain.length=0;const spread=id==='staple'?Math.PI/3:id==='code'?.9:id==='ppt'?.5:.22;
        for(let n=0;n<count;n++){
          const target=id==='staple'?nearest:this.nearest(p.x,p.y,Math.max(400,range),this.chain);if(target>=0&&id!=='staple')this.chain.push(target);
          const aimed=id==='staple'?angle:target>=0?Math.atan2(e.y[target]-p.y,e.x[target]-p.x):angle;
          const a=aimed+(id!=='staple'&&target>=0?0:count===1?0:(n/(count-1)-.5)*spread);
          const speed=['knife','shuttle','binder','sword'].includes(id)?650:id==='staple'?600:id==='ppt'?420:400;
          const originAngle=n*TAU/count,ox=ev&&id==='knife'?Math.cos(originAngle)*32:0,oy=ev&&id==='knife'?Math.sin(originAngle)*32:0;
          this.shot(id,p.x+ox,p.y+oy,a,speed,damage,range,params.pierce,id==='code'?'homing':id==='ppt'?'boomerang':'straight',ev,target>=0?target:nearest,false,params);
        }
      }else if(id==='bot'||id==='hub'){
        this.chain.length=0;
        for(let n=0;n<count;n++){
          const pos=botPosition(p.x,p.y,g.combatTime,n,count,skill.level,ev),target=this.nearest(pos.x,pos.y,range,this.chain);
          const actual=target>=0?target:nearest;
          if(actual>=0){this.chain.push(actual);this.shot(id,pos.x,pos.y,Math.atan2(e.y[actual]-pos.y,e.x[actual]-pos.x),450,damage,range,1,'straight',ev,actual,false,params);}
        }
        if((ev||id==='hub')&&this.focusTimer<=0&&nearest>=0){
          for(let n=0;n<count;n++){const pos=botPosition(p.x,p.y,g.combatTime,n,count,skill.level,ev);g.emit({type:'beam',x:pos.x,y:pos.y,x2:e.x[nearest],y2:e.y[nearest],color,size:4,duration:.24,weapon:id,evolved:true});}
          this.blast(e.x[nearest],e.y[nearest],(id==='hub'?140:100)*st.area,params.secondaryDamage,id);this.focusTimer=id==='hub'?3:4;
        }
      }else if(id==='coffee'||id==='keyboard'||id==='broadcast'||id==='ruler'){
        const spread=params.spread;
        g.grid.query(p.x,p.y,range+80,this.candidates);
        for(const target of this.candidates){if(!e.alive[target]||!inCone(p.x,p.y,e.x[target],e.y[target],angle,range,spread,e.radius[target]))continue;
          this.hit(target,damage,id,p.x,p.y,id==='broadcast'?2.7:1);
          if(!e.alive[target]||e.hp[target]<=0)continue;
          if(id==='coffee'&&ev){e.burn[target]=2;e.burnTick[target]=.5;e.burnSource[target]='coffee';e.burnDamage[target]=params.secondaryDamage*.5;}
          if(id==='broadcast'){applySlow(e,target,ev?.4:.3,ev?1.2:.8);}
        }
        g.emit({type:'arc',x:p.x,y:p.y,color,size:range,angle,value:spread,text:id,weapon:id,level:skill.level,evolved:ev});
        if(id==='broadcast'&&ev)g.heal(2);
      }else if(id==='prism'||id==='sky'){
        const turn=this.rounds[id]??0;this.rounds[id]=turn+1;const rotation=angle+turn*.23;
        for(let n=0;n<count;n++){const a=rotation+n*TAU/count,x2=p.x+Math.cos(a)*range,y2=p.y+Math.sin(a)*range;for(const target of [...e.active])if(e.hp[target]>0&&sweptHit(p.x,p.y,x2,y2,e.x[target],e.y[target],params.width*.5+e.radius[target]))this.hit(target,damage,id,p.x,p.y);g.emit({type:'beam',x:p.x,y:p.y,x2,y2,color,size:params.width,duration:.3,weapon:id,level:skill.level,evolved:ev});}
        if(id==='sky'&&(turn+1)%3===0){const tx=nearest>=0?e.x[nearest]:p.x,ty=nearest>=0?e.y[nearest]:p.y;this.blast(tx,ty,180*st.area,params.secondaryDamage,id);}
      }else if(id==='cryo'||id==='icefire'){this.area(id,id==='cryo'?'cryo':'icefire',p.x,p.y,range,damage,params.duration,0,ev,params.secondaryDamage);
      }else if(id==='brick'||id==='demolition'){
        this.chain.length=0;for(let n=0;n<count;n++){const target=this.nearest(p.x,p.y,range,this.chain);if(target>=0)this.chain.push(target);const tx=target>=0?e.x[target]:p.x+Math.cos(angle+n*.5)*180,ty=target>=0?e.y[target]:p.y+Math.sin(angle+n*.5)*180;this.area(id,'brick',tx,ty,params.explosion,damage,.7,.45,ev||id==='demolition',params.secondaryDamage);}
      }else if(id==='laser'){
        this.chain.length=0;
        for(let n=0;n<count;n++){
          const aimed=this.nearest(p.x,p.y,range,this.chain);if(aimed>=0)this.chain.push(aimed);
          const a=aimed>=0?Math.atan2(e.y[aimed]-p.y,e.x[aimed]-p.x):angle+(n===0?-.04:.04),x2=p.x+Math.cos(a)*range,y2=p.y+Math.sin(a)*range,width=params.width;
          for(const target of [...e.active]){if(e.alive[target]&&sweptHit(p.x,p.y,x2,y2,e.x[target],e.y[target],width*.5+e.radius[target]))this.hit(target,damage,id,p.x,p.y);}
          g.emit({type:'beam',x:p.x,y:p.y,x2,y2,color,size:width,duration:ev?.3:.18,weapon:id,level:skill.level,evolved:ev});
        }
        g.impact(2);
      }else if(id==='rain'){
        for(let n=0;n<count;n++){
          const target=e.active.length?e.active[(g.random.int(0,Math.max(0,e.active.length-1))+n)%e.active.length]:-1;
          const tx=target>=0&&distanceSq(p.x,p.y,e.x[target],e.y[target])<700**2?e.x[target]:p.x+g.random.range(-220,220);
          const ty=target>=0&&distanceSq(p.x,p.y,e.x[target],e.y[target])<700**2?e.y[target]:p.y+g.random.range(-180,180);
          this.area(id,'rain',tx,ty,range,damage,.65,.4,ev,params.secondaryDamage*.5);
        }
      }else if(id==='wifi'){
        for(let n=0;n<count;n++)this.area(id,'pulse',p.x,p.y,range,damage,.45+n*.22,n*.22,ev);
        g.emit({type:'ring',x:p.x,y:p.y,color,size:range,duration:.67,text:'wifi',weapon:id,level:skill.level,evolved:ev});
      }else if(id==='lightning'){
        this.chain.length=0;let current=nearest,fromX=p.x,fromY=p.y;
        for(let n=0;n<count&&current>=0;n++){
          const tx=e.x[current],ty=e.y[current];this.chain.push(current);
          this.hit(current,damage*Math.max(ev?.92**n:.85**n,ev?0:.4),id,fromX,fromY);
          g.emit({type:'lightning',x:fromX,y:fromY,x2:tx,y2:ty,color,size:ev?4:2,duration:.25,weapon:id,evolved:ev});
          if(ev&&n>=count-2)this.blast(tx,ty,params.explosion,params.secondaryDamage,id);
          fromX=tx;fromY=ty;current=this.nearest(tx,ty,range,this.chain);
        }
        if(nearest>=0)g.impact(2);
      }else if(id==='mentor'){
        // Iterate backwards because hitEnemy may remove via swap.
        for(const target of [...e.active]){if(e.alive[target]&&distanceSq(e.x[target],e.y[target],p.x,p.y)<range*range)this.hit(target,damage,id,p.x,p.y,2);}
        g.emit({type:'ring',x:p.x,y:p.y,color,size:range,duration:.7,text:ev?'院士推荐信':'做得不错'});
        g.impact(5,1/60);
        if(ev){g.addShield(35,4*st.duration);}
      }else if(id==='mine'){
        for(let n=0;n<count;n++){const a=p.facing+Math.PI+(n-(count-1)/2)*.8;this.area(id,'mine',p.x+Math.cos(a)*45,p.y+Math.sin(a)*45,range,damage,params.duration,.5,ev);}
      }else if(id==='eraser')this.area(id,'eraser',p.x,p.y,range,damage,params.duration,0,ev);
    }
    this.updateShots(dt);this.updateAreas(dt);
  }
  blast(x:number,y:number,radius:number,damage:number,source:WeaponKind,slow=0,slowTime=0){
    const g=this.game,e=g.enemies;
    // A separate scratch list prevents nested collision passes from invalidating outer queries.
    for(const id of [...e.active]){if(e.alive[id]&&distanceSq(x,y,e.x[id],e.y[id])<=(radius+e.radius[id])**2){this.hit(id,damage,source,x,y);if(e.alive[id]&&slow){applySlow(e,id,slow,slowTime);}}}
    g.emit({type:'ring',x,y,color:colorNumber(this.game.content.weaponById[source].color),size:radius,duration:.45,text:'explosion',weapon:source,evolved:!!g.weapons.find(w=>w.id===source)?.evolved});
  }
  private cancelBullet(x:number,y:number,radius:number,source:WeaponKind='eraser'){const g=this.game;for(const id of g.enemyShots.active){const s=g.enemyShots.data[id];if(distanceSq(x,y,s.x,s.y)<radius*radius){g.enemyShots.release(id);g.emit({type:'block',x:s.x,y:s.y,color:0xffffff,size:18,angle:Math.atan2(s.y-y,s.x-x),weapon:source});return;}}}
  private updateShots(dt:number){
    const g=this.game,e=g.enemies;
    for(let n=g.shots.active.length-1;n>=0;n--){
      const id=g.shots.active[n],s=g.shots.data[id];this.source=this.owners.get(s);if(this.source&&!this.accepts(this.source)){g.shots.release(id);continue;}this.attackId=this.identities.get(s)??`shot:${id}`;s.age+=dt;s.life-=dt;
      if(s.life<=0){g.shots.release(id);continue;}
      s.prevX=s.x;s.prevY=s.y;
      if(s.kind==='homing'){
        if(!e.valid(s.target,s.targetGeneration)){s.target=this.nearest(s.x,s.y,450);s.targetGeneration=s.target>=0?e.generation[s.target]:0;}
        if(s.target>=0){const speed=Math.hypot(s.vx,s.vy),a=Math.atan2(s.vy,s.vx),target=Math.atan2(e.y[s.target]-s.y,e.x[s.target]-s.x),delta=angleDelta(a,target),next=a+Math.max(-Math.PI*1.5*dt,Math.min(Math.PI*1.5*dt,delta));s.vx=Math.cos(next)*speed;s.vy=Math.sin(next)*speed;}
      }
      if(s.kind==='boomerang'){
        if(!s.returning&&(s.evolved?s.age*420>=s.range:distanceSq(s.x,s.y,s.originX,s.originY)>=s.range*s.range)){s.returning=true;s.hits.length=0;}
        if(s.returning){const dx=g.player.x-s.x,dy=g.player.y-s.y,d=Math.hypot(dx,dy);if(d<22){g.shots.release(id);continue;}const a=Math.atan2(dy,dx)+(s.evolved?.32*Math.min(1,d/100):0);s.vx=Math.cos(a)*510;s.vy=Math.sin(a)*510;}
      }
      if(s.kind==='boomerang'&&s.evolved&&!s.returning){const radius=Math.min(s.range,s.age*420),a=s.launchAngle+s.age*.9;s.x=s.originX+Math.cos(a)*radius;s.y=s.originY+Math.sin(a)*radius;s.vx=(s.x-s.prevX)/dt;s.vy=(s.y-s.prevY)/dt;}
      else{s.x+=s.vx*dt;s.y+=s.vy*dt;}
      const radius=Math.hypot(s.x-s.prevX,s.y-s.prevY)*.5+90;
      g.grid.query((s.x+s.prevX)*.5,(s.y+s.prevY)*.5,radius,this.candidates);
      for(const target of this.candidates){
        if(!e.alive[target]||e.hp[target]<=0)continue;
        const key=e.generation[target]*e.capacity+target;
        if(s.hits.includes(key)||!sweptHit(s.prevX,s.prevY,s.x,s.y,e.x[target],e.y[target],s.radius+e.radius[target]))continue;
        s.hits.push(key);
        if(s.kind==='homing'){
          this.blast(s.x,s.y,s.explosion,s.damage,s.source);
          if(s.evolved&&!s.fragment)for(let a=0;a<2;a++)this.shot('code',s.x,s.y,Math.atan2(s.vy,s.vx)+(a===0?-.8:.8),480,s.secondaryDamage,220,1,'straight',false,-1,true);
        }else this.hit(target,s.damage,s.source,s.prevX,s.prevY);
        s.pierce--;if((s.source==='shuttle'||s.source==='binder')&&s.bounce>0){let next=-1,best=160**2;for(const other of e.active){const key=e.generation[other]*e.capacity+other,d=distanceSq(s.x,s.y,e.x[other],e.y[other]);if(e.hp[other]>0&&!s.hits.includes(key)&&d<best){next=other;best=d;}}if(next>=0){const a=Math.atan2(e.y[next]-s.y,e.x[next]-s.x);s.vx=Math.cos(a)*650;s.vy=Math.sin(a)*650;s.damage*=s.decay;s.bounce--;s.life=Math.max(s.life,Math.sqrt(best)/650+.1);g.emit({type:'signature',x:s.x,y:s.y,color:s.color,size:45,weapon:s.source,duration:.2,evolved:s.evolved});break;}else s.pierce=0;}if(s.pierce<=0){g.shots.release(id);break;}
      }
    }
  }
  private updateAreas(dt:number){
    const g=this.game,e=g.enemies;
    for(let n=g.areas.active.length-1;n>=0;n--){
      const id=g.areas.active[n],a=g.areas.data[id];this.source=this.owners.get(a);if(this.source&&!this.accepts(this.source)){g.areas.release(id);continue;}this.attackId=`${this.identities.get(a)}:${Math.floor(g.combatTime)}`;a.age+=dt;a.life-=dt;
      if(a.life<0){g.areas.release(id);continue;}if(a.age<a.delay)continue;
      if(a.evolved&&a.kind==='eraser'){a.x=g.player.x;a.y=g.player.y;}
      if(a.kind==='pulse')a.radius=a.maxRadius*Math.min(1,(a.age-a.delay)/.45);
      if(a.kind==='brick'||a.kind==='aftershock'){this.blast(a.x,a.y,a.maxRadius,a.damage,a.source);if(a.kind==='brick'&&a.evolved)this.area(a.source,'aftershock',a.x,a.y,a.maxRadius,a.secondaryDamage,.8,a.source==='demolition'?.4:.5,false);g.areas.release(id);continue;}
      if(a.kind==='cryo'){g.grid.query(a.x,a.y,a.radius+80,this.candidates);for(const target of this.candidates){if(e.hp[target]<=0||distanceSq(a.x,a.y,e.x[target],e.y[target])>(a.radius+e.radius[target])**2)continue;applySlow(e,target,a.evolved?.45:.3,.1);if(e.cryoLast[target]<g.combatTime-1e-6){e.freezeAccum[target]+=dt;e.cryoLast[target]=g.combatTime;}if(e.freezeAccum[target]>=(a.evolved?.75:1)&&freezeEnemy(e,target,a.evolved?1.2:1,true)){g.frozenTarget(target);e.freezeAccum[target]=0;}}}
      if(a.kind==='icefire'){a.burstTick-=dt;if(a.burstTick<=0){a.burstTick+=2;for(const target of [...e.active])if(e.hp[target]>0&&distanceSq(a.x,a.y,e.x[target],e.y[target])<=(a.radius+e.radius[target])**2){const key=target*2;if((e.fusionHits[key]??0)<=g.combatTime){e.fusionHits[key]=g.combatTime+1.99;this.hit(target,a.secondaryDamage,a.source,a.x,a.y);}}g.emit({type:'ring',x:a.x,y:a.y,color:a.color,size:a.radius,weapon:a.source,duration:.6,material:'ice'});}}
      if(a.kind==='rain'){
        this.blast(a.x,a.y,a.maxRadius,a.damage,a.source);g.emit({type:'death',x:a.x,y:a.y,color:a.color,size:a.maxRadius*.4});
        if(a.evolved){a.kind='ink';a.life=2*g.stats.duration;a.damage=a.secondaryDamage;a.radius=a.maxRadius;a.tick=.5;}else{g.areas.release(id);continue;}
      }
      if(a.kind==='mine'){
        g.grid.query(a.x,a.y,42,this.candidates);let trigger=false;
        for(const target of this.candidates)if(e.alive[target]&&distanceSq(a.x,a.y,e.x[target],e.y[target])<(e.radius[target]+25)**2){trigger=true;break;}
        if(trigger){this.blast(a.x,a.y,a.maxRadius,a.damage,a.source,a.evolved?.45:.25,a.evolved?2:1);g.areas.release(id);}continue;
      }
      a.tick-=dt;
      if(a.tick<=0){
        a.tick=a.kind==='pulse'?1/60:a.kind==='icefire'?.4:a.kind==='eraser'&&a.evolved?.4:.5;
        g.grid.query(a.x,a.y,a.radius+80,this.candidates);
        for(const target of this.candidates){
          if(!e.alive[target]||distanceSq(a.x,a.y,e.x[target],e.y[target])>(a.radius+e.radius[target])**2)continue;
          const key=e.generation[target]*e.capacity+target;
          if(a.kind==='pulse'&&a.hits.has(key))continue;
          if(['eraser','ink','cryo','icefire'].includes(a.kind)){
            const hitIndex=target*4+(a.kind==='ink'?1:a.kind==='cryo'?2:a.kind==='icefire'?3:0);
            if(e.areaHits[hitIndex]>g.combatTime)continue;
            e.areaHits[hitIndex]=g.combatTime+(a.kind==='icefire'||a.kind==='eraser'&&a.evolved?.4:.5)-.0001;
          }
          if(a.kind==='icefire')applySlow(e,target,.4,.6);
          a.hits.set(key,g.combatTime);this.hit(target,a.damage,a.source,a.x,a.y);
        }
      }
      if(a.kind==='eraser'){a.cancelTick-=dt;if(a.cancelTick<=0){this.cancelBullet(a.x,a.y,a.radius);a.cancelTick=a.evolved?.4:1;}}
    }
  }
  grant(skill:ContentSkill){this.cooldowns[skill.id]=.1;}
}
