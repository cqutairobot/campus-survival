import type {ContentFusionDef,ContentFusionId,WeaponIdentity,ContentSkill} from './types';
import type {ContentState} from './legacy/ContentState';
import type {WeaponParams} from './legacy/params';
import {sweptHit} from './legacy/damage';
import {distanceSq,TAU} from '../../core/math';
const fixed=(n:number)=>Array(5).fill(n);
function fusion(id:ContentFusionId,name:string,icon:string,color:string,components:ContentFusionDef['components'],damage:number,interval:number,count:number,range:number,description:string,extra:Partial<ContentFusionDef>={}):ContentFusionDef{return{id,name,icon,color,components,fusion:true,tag:'第二学期融合',description,damage:fixed(damage),interval:fixed(interval),count:fixed(count),range:fixed(range),forms:Array(5).fill(name),evolution:{name,passive:'haste',description,damage,interval,count,range},...extra};}
export const S2_FUSIONS:readonly ContentFusionDef[]=[
 fusion('s2:fieldHub','外场协同站','blueprint','#61bdce',['s2:drone','blueprint'],70,.5,4,750,'移动无人机与固定支援点每3秒轮换集火；与智慧校园中枢互斥，二者都消耗蓝图炮台。',{secondaryDamage:220,explosion:fixed(140),syncInterval:3}),
 fusion('s2:holoReview','全息评审阵列','laser','#7bd7bd',['s2:whiteboard','laser'],180,1.8,3,900,'先投影路径，0.45秒后逐线贯穿；侧后方仍需移动保护。',{width:fixed(26),lineLength:fixed(900),hitDelay:fixed(.45),sequenceDelay:fixed(.16)}),
 fusion('s2:digitalTwin','数字孪生试验台','brick','#ba9ae8',['s2:spool','s2:printer'],200,1.4,6,160,'沿轨迹铺设构件并周期爆破；站立也展开小闭环。每轮每目标一次。',{width:fixed(18),duration:fixed(3),explosion:fixed(120),lineLength:fixed(180),placementInterval:fixed(.28),hitDelay:fixed(.4),sequenceDelay:fixed(0)}),
];
interface Point {x:number;y:number}
export interface FusionNode extends Point {source:WeaponIdentity;index:number;stationary:boolean}
export interface FusionBolt extends Point {prevX:number;prevY:number;source:WeaponIdentity;target:number;targetGeneration:number;damage:number;life:number}
export interface FusionLine extends Point {x2:number;y2:number;width:number;source:WeaponIdentity;age:number;delay:number;life:number;damage:number;attackId:string;hit:boolean}
export interface TwinSegment extends Point {x2:number;y2:number;source:WeaponIdentity;life:number}
export interface TwinConstruct extends TwinSegment {radius:number;damage:number;delay:number;attackId:string}
interface Run {source:WeaponIdentity;cooldown:number;sync:number;place:number;mode:number;angle:number;anchor:Point;last:Point}
/** All delayed work carries the weapon instance and its removal generation. */
export class FusionSystem {
 readonly nodes:FusionNode[]=[];readonly bolts:FusionBolt[]=[];readonly lines:FusionLine[]=[];readonly segments:TwinSegment[]=[];readonly constructs:TwinConstruct[]=[];
 private runs=new Map<string,Run>();private serial=0;
 constructor(private g:ContentState){}
 remove(id:string){this.runs.delete(id);for(const list of [this.nodes,this.bolts,this.lines,this.segments,this.constructs])for(let n=list.length-1;n>=0;n--)if(list[n].source.id===id)list.splice(n,1);}
 prune(){for(const [id,run] of this.runs)if(!this.g.weaponSystem.accepts(run.source))this.remove(id);}
 private nearest(x:number,y:number,range:number){const e=this.g.enemies;let target=-1,best=range**2;for(const id of e.active){const d=distanceSq(x,y,e.x[id],e.y[id]);if(e.hp[id]>0&&d<best){best=d;target=id;}}return target;}
 private hit(id:number,damage:number,source:WeaponIdentity,x:number,y:number,attackId:string,dot=false){return this.g.hitEnemy(id,damage,source.id,x,y,0,true,true,false,false,false,{weapon:source,attackId,dot});}
 update(skill:ContentSkill,p:WeaponParams,dt:number){
  const g=this.g,v=g.player,e=g.enemies,id=p.id,source=g.weaponSystem.identity(skill);let r=this.runs.get(id);if(!r||!g.weaponSystem.accepts(r.source)){this.remove(id);r={source,cooldown:0,sync:p.syncInterval??0,place:0,mode:-1,angle:0,anchor:{x:v.x,y:v.y},last:{x:v.x,y:v.y}};this.runs.set(id,r);}r.cooldown-=dt;r.sync-=dt;
  if(id==='s2:fieldHub'){
   const stationary=Math.floor(g.combatTime/(p.syncInterval??3))%2===1;if(r.mode!==Number(stationary)){r.mode=Number(stationary);r.anchor={x:v.x,y:v.y};this.nodes.splice(0,this.nodes.length,...Array.from({length:p.count},(_,index)=>({x:v.x,y:v.y,source,index,stationary})));}
   for(const node of this.nodes){const a=(stationary?0:g.combatTime*.8)+node.index*TAU/p.count,center=stationary?r.anchor:v;node.x=center.x+Math.cos(a)*(stationary?45:85);node.y=center.y+Math.sin(a)*(stationary?35:55)-20;node.stationary=stationary;}
   if(r.cooldown<=0){r.cooldown+=p.interval;for(const node of this.nodes){const target=this.nearest(node.x,node.y,p.range);if(target>=0)this.bolts.push({x:node.x,y:node.y,prevX:node.x,prevY:node.y,source,target,targetGeneration:e.generation[target],damage:p.damage,life:p.range/700+1});}}
   if(r.sync<=0){r.sync+=p.syncInterval!;const target=this.nearest(v.x,v.y,p.range);if(target>=0){const attackId=`hub:${++this.serial}`;for(const enemy of [...e.active])if(e.hp[enemy]>0&&distanceSq(e.x[target],e.y[target],e.x[enemy],e.y[enemy])<=(p.explosion+e.radius[enemy])**2)this.hit(enemy,p.secondaryDamage,source,e.x[target],e.y[target],attackId);g.emit({type:'ring',x:e.x[target],y:e.y[target],size:p.explosion,color:0x61bdce,weapon:id,duration:.4});}}
   for(let n=this.bolts.length-1;n>=0;n--){const b=this.bolts[n];b.life-=dt;if(!g.weaponSystem.accepts(b.source)||!e.valid(b.target,b.targetGeneration)||e.hp[b.target]<=0||b.life<=0){this.bolts.splice(n,1);continue;}b.prevX=b.x;b.prevY=b.y;const dx=e.x[b.target]-b.x,dy=e.y[b.target]-b.y,d=Math.hypot(dx,dy);if(d<=700*dt+e.radius[b.target]){this.hit(b.target,b.damage,b.source,b.x,b.y,`hub-bolt:${++this.serial}`);this.bolts.splice(n,1);}else{b.x+=dx/d*700*dt;b.y+=dy/d*700*dt;}}
  }else if(id==='s2:holoReview'){
   if(r.cooldown<=0){r.cooldown+=p.interval;const target=this.nearest(v.x,v.y,p.range),angle=target<0?v.facing:Math.atan2(e.y[target]-v.y,e.x[target]-v.x),attackId=`holo:${++this.serial}`;for(let n=0;n<p.count;n++){const a=angle+(n-(p.count-1)/2)*.035;this.lines.push({x:v.x,y:v.y,x2:v.x+Math.cos(a)*p.range,y2:v.y+Math.sin(a)*p.range,width:p.width,source,age:-n*p.sequenceDelay!,delay:p.hitDelay!,life:p.hitDelay!+.25,damage:p.damage,attackId,hit:false});}}
   for(let n=this.lines.length-1;n>=0;n--){const line=this.lines[n];line.age+=dt;if(!g.weaponSystem.accepts(line.source)||line.age>line.life){this.lines.splice(n,1);continue;}if(line.hit||line.age<line.delay)continue;line.hit=true;for(const target of [...e.active])if(e.hp[target]>0&&sweptHit(line.x,line.y,line.x2,line.y2,e.x[target],e.y[target],line.width/2+e.radius[target]))this.hit(target,line.damage,line.source,line.x,line.y,line.attackId);g.emit({type:'beam',x:line.x,y:line.y,x2:line.x2,y2:line.y2,size:line.width,color:0x7bd7bd,weapon:id,duration:.2});}
  }else if(id==='s2:digitalTwin'){
   for(let n=this.segments.length-1;n>=0;n--)if((this.segments[n].life-=dt)<=0||!g.weaponSystem.accepts(this.segments[n].source))this.segments.splice(n,1);r.place-=dt;
   if(r.place<=0){r.place+=p.placementInterval!;const dx=v.x-r.last.x,dy=v.y-r.last.y,d=Math.hypot(dx,dy),radius=p.range*.45,a=r.angle;r.angle+=TAU/p.count;const segment=d>8?{x:v.x-dx/d*Math.min(d,p.lineLength!),y:v.y-dy/d*Math.min(d,p.lineLength!),x2:v.x,y2:v.y}:{x:v.x+Math.cos(a)*radius,y:v.y+Math.sin(a)*radius,x2:v.x+Math.cos(r.angle)*radius,y2:v.y+Math.sin(r.angle)*radius};this.segments.push({...segment,source,life:p.duration});while(this.segments.length>p.count)this.segments.shift();r.last={x:v.x,y:v.y};}
   if(r.cooldown<=0){r.cooldown+=p.interval;const attackId=`twin:${++this.serial}`;for(const segment of this.segments)this.constructs.push({...segment,radius:p.explosion,damage:p.damage,delay:p.hitDelay!,life:p.hitDelay!+.05,attackId});}
   const hit=new Set<string>();for(let n=this.constructs.length-1;n>=0;n--){const c=this.constructs[n];c.delay-=dt;if(!g.weaponSystem.accepts(c.source)){this.constructs.splice(n,1);continue;}if(c.delay>0)continue;const x=(c.x+c.x2)/2,y=(c.y+c.y2)/2;for(const target of [...e.active]){const key=`${c.attackId}:${target}:${e.generation[target]}`;if(e.hp[target]>0&&!hit.has(key)&&distanceSq(x,y,e.x[target],e.y[target])<=(c.radius+e.radius[target])**2){hit.add(key);this.hit(target,c.damage,c.source,x,y,c.attackId,true);}}g.emit({type:'ring',x,y,size:c.radius,color:0xba9ae8,weapon:id,duration:.3});this.constructs.splice(n,1);}
  }
 }
}
