import type {ContentState} from './legacy/ContentState';
import type {WeaponParams} from './legacy/params';
import type {ContentSkill,WeaponIdentity} from './types';
import {sweptHit} from './legacy/damage';

export interface WhiteboardLine {x:number;y:number;x2:number;y2:number;width:number;damage:number;age:number;hitDelay:number;life:number;hit:boolean;instanceId:number;generation:number;index:number;evolved:boolean;attackId:string;source:WeaponIdentity}
/** Player attacks only: never registered as world geometry or enemy hazards. */
export class WhiteboardSystem {
 readonly lines:WhiteboardLine[]=[];private cooldown=.2;private generation=0;private instance=-1;private serial=0;
 constructor(private g:ContentState){}
 remove(){this.lines.length=0;this.cooldown=.05;this.instance=-1;this.generation++;}
 reset(){this.cooldown=.05;}
 prune(){if(!this.g.weapons.some(w=>w.id==='s2:whiteboard'&&w.instanceId===this.instance))this.remove();}
 update(skill:ContentSkill,params:WeaponParams,dt:number){
  const g=this.g,p=g.player,e=g.enemies;
  if(this.instance!==skill.instanceId){this.remove();this.instance=skill.instanceId!;}
  this.cooldown-=dt;
  if(this.cooldown<=0){
   this.cooldown+=params.interval;const attackId=`board:${this.instance}:${this.generation}:${++this.serial}`,groups=skill.evolved?params.count/2:params.count;
   for(let n=0;n<params.count;n++){
    const group=skill.evolved?Math.floor(n/2):n,forward=params.range*(group+1)/(groups+1),cx=p.x+Math.cos(p.facing)*forward,cy=p.y+Math.sin(p.facing)*forward,a=p.facing+Math.PI/2+(skill.evolved?(n%2?-.48:.48):0),half=params.lineLength!*.5;
    this.lines.push({x:cx-Math.cos(a)*half,y:cy-Math.sin(a)*half,x2:cx+Math.cos(a)*half,y2:cy+Math.sin(a)*half,width:params.width,damage:params.damage,age:-n*params.sequenceDelay!,hitDelay:params.hitDelay!,life:params.hitDelay!+.24,hit:false,instanceId:this.instance,generation:this.generation,index:n,evolved:skill.evolved,attackId,source:g.weaponSystem.identity(skill)});
   }
  }
  for(let n=this.lines.length-1;n>=0;n--){
   const line=this.lines[n];line.age+=dt;
   if(line.instanceId!==this.instance||line.generation!==this.generation||line.age>line.life){this.lines.splice(n,1);continue;}
   if(line.age<line.hitDelay||line.hit)continue;line.hit=true;
   for(const id of [...e.active])if(e.hp[id]>0&&sweptHit(line.x,line.y,line.x2,line.y2,e.x[id],e.y[id],line.width*.5+e.radius[id]))g.hitEnemy(id,line.damage,'s2:whiteboard',line.x,line.y,1,true,true,false,false,false,{weapon:line.source,attackId:line.attackId});
   g.emit({type:'beam',x:line.x,y:line.y,x2:line.x2,y2:line.y2,size:3,color:0x408b79,weapon:'s2:whiteboard',level:skill.level,evolved:skill.evolved,duration:.2});
  }
 }
}
