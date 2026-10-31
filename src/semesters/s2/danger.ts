import {clamp,segmentDistanceSq} from '../../core/math';
import type {Hazard} from '../../types';
import type {Navigation} from '../../world/navigation';
import {worldBlocked,worldNavigation,type Point,type WorldSnapshot} from './world';
import {pressureAt} from './pressure';
import type {DamageTier} from './player-damage';

const HZ=60,LOCK_TICKS=21;
export const DANGER_RETRY_TICKS=30;
export const warningSeconds=(tier:DamageTier)=>tier==='boss'?1.2:1;
export interface SafeRoute {points:Point[];travelSeconds:number;width:number}
export interface S2Hazard extends Hazard {
 tier:DamageTier;phase:'queued'|'warning'|'active'|'cancelled';token:number;
 requestedTick:number;retryTick:number;startedTick:number;warningTotal:number;warningTicks:number;
 lifeTotal:number;lifeTicks:number;locked:boolean;safeHalfAngle:number;route:SafeRoute|null;
 /** Opt-in future S2 attacks may aim until the final 0.35s, never afterwards. */
 trackPlayer?:boolean;
}
export type HazardOptions=Partial<Hazard>&{tier?:DamageTier;trackPlayer?:boolean};
const angleDelta=(a:number,b:number)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

/** Whole future footprint for route planning, or current footprint for a hit.
 * A ring has a real >=90-degree gap, shared with presentation and collision. */
export function dangerContains(h:Pick<S2Hazard,'kind'|'x'|'y'|'x2'|'y2'|'radius'|'safeAngle'|'safeHalfAngle'|'angularSpeed'|'lifeTotal'>,p:Point,padding=12,future=true){
 if(h.kind==='circle')return Math.hypot(p.x-h.x,p.y-h.y)<h.radius+padding;
 if(h.kind==='line'){
  const sweep=future?(h.angularSpeed??0)*h.lifeTotal:0,steps=Math.max(1,Math.ceil(Math.abs(sweep)/.1));
  for(let n=0;n<=steps;n++){
   const a=sweep*n/steps,dx=h.x2-h.x,dy=h.y2-h.y,x=h.x+dx*Math.cos(a)-dy*Math.sin(a),y=h.y+dx*Math.sin(a)+dy*Math.cos(a);
   if(segmentDistanceSq(p.x,p.y,h.x,h.y,x,y)<(h.radius+padding)**2)return true;
  }
  return false;
 }
 const dx=p.x-h.x,dy=p.y-h.y,d=Math.hypot(dx,dy),delta=Math.abs(angleDelta(Math.atan2(dy,dx),h.safeAngle??0)),half=Math.max(Math.PI/4,h.safeHalfAngle);
 const inGap=delta<half&&d*Math.sin(half-delta)>=padding;
 return d<h.radius+padding&&!inGap;
}

const cell=(p:Point,side:number)=>Math.floor(p.y/64)*side+Math.floor(p.x/64);
const center=(n:number,side:number)=>({x:n%side*64+32,y:Math.floor(n/side)*64+32});
function clearSegment(world:WorldSnapshot,a:Point,b:Point){
 const count=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/12));
 for(let n=0;n<=count;n++)if(worldBlocked(world,a.x+(b.x-a.x)*n/count,a.y+(b.y-a.y)*n/count,50))return false;
 return true;
}

/** Bounded BFS over the same worldNavigation grid. Check a 100px-wide corridor,
 * exact wall segments, speed/arrival times and all admitted danger footprints.
 * Nearby authored retreats guide the choice, but never bypass collision/time. */
export function safeDangerRoute(world:WorldSnapshot,nav:Navigation,player:Point,speed:number,candidate:S2Hazard,others:readonly S2Hazard[]=[]):SafeRoute|null {
 const available=candidate.warning-.2,maxDistance=Math.max(0,available)*speed,side=nav.side,start=cell(player,side),origin=center(start,side);
 if(speed<=0||start<0||start>=nav.blocked.length||nav.blocked[start]||!clearSegment(world,player,origin))return null;
 const hazards=[...others.filter(h=>h!==candidate&&h.phase!=='cancelled'),candidate];
 const unsafeAt=(point:Point,at:number)=>hazards.some(h=>at>=Math.max(0,h.warning)&&at<=Math.max(0,h.warning)+h.life&&dangerContains(h,point,50));
 const initialDistance=Math.hypot(origin.x-player.x,origin.y-player.y);
 for(let n=0;n<=8;n++)if(unsafeAt({x:player.x+(origin.x-player.x)*n/8,y:player.y+(origin.y-player.y)*n/8},initialDistance*n/8/speed))return null;
 const distance=new Map<number,number>([[start,Math.hypot(origin.x-player.x,origin.y-player.y)]]),previous=new Map<number,number>(),queue=[start];
 const site=[...world.assessmentSites].sort((a,b)=>Math.hypot(a.center.x-player.x,a.center.y-player.y)-Math.hypot(b.center.x-player.x,b.center.y-player.y))[0];
 const retreats=site&&Math.hypot(site.center.x-player.x,site.center.y-player.y)<site.radius+320?site.retreats:[];
 let best=-1,bestScore=Infinity;
 for(let head=0;head<queue.length;head++){
  const c=queue[head],p=center(c,side),travel=distance.get(c)!;if(travel>maxDistance+1e-8)continue;
  if(unsafeAt(p,travel/speed))continue;
  if(!hazards.some(h=>dangerContains(h,p,50))){
   const retreatDistance=retreats.length?Math.min(...retreats.flatMap(route=>route.slice(1).map((end,n)=>Math.sqrt(segmentDistanceSq(p.x,p.y,route[n].x,route[n].y,end.x,end.y))))):0;
   const score=travel+Math.min(128,retreatDistance)*.2;
   if(score<bestScore){best=c;bestScore=score;}
  }
  const x=c%side,y=Math.floor(c/side);
  for(const next of [...(x?[c-1]:[]),...(x<side-1?[c+1]:[]),...(y?[c-side]:[]),...(y<side-1?[c+side]:[])]){
   if(nav.blocked[next]||distance.has(next)||travel+64>maxDistance+1e-8)continue;
   const end=center(next,side);if(!clearSegment(world,p,end))continue;
   // The segment must stay safe at the time the player traverses it.
   let safe=true;for(let n=1;n<=8;n++)if(unsafeAt({x:p.x+(end.x-p.x)*n/8,y:p.y+(end.y-p.y)*n/8},(travel+64*n/8)/speed)){safe=false;break;}
   if(!safe)continue;distance.set(next,travel+64);previous.set(next,c);queue.push(next);
  }
 }
 if(best<0)return null;
 const route:Point[]=[];for(let c=best;;c=previous.get(c)!){route.push(center(c,side));if(c===start)break;}route.reverse();route.unshift({x:player.x,y:player.y});
 return{points:route,travelSeconds:distance.get(best)!/speed,width:100};
}

export class DangerScheduler {
 readonly pending:S2Hazard[]=[];
 private navigation:Navigation;private serial=0;
 constructor(private world:WorldSnapshot,readonly active:S2Hazard[]){this.navigation=worldNavigation(world);}
 request(h:Hazard,tier:DamageTier,tick:number,trackPlayer=false){
  if(this.pending.length+this.active.length>=96)return;
  const warningTotal=Math.max(warningSeconds(tier),h.warning),lifeTotal=Math.max(1/HZ,h.life),warningTicks=Math.ceil(warningTotal*HZ);
  const danger:S2Hazard={...h,tier,phase:'queued',token:0,requestedTick:tick,retryTick:tick,startedTick:-1,warning:warningTicks/HZ,warningTotal:warningTicks/HZ,warningTicks,life:lifeTotal,lifeTotal,lifeTicks:Math.ceil(lifeTotal*HZ),locked:false,safeHalfAngle:Math.PI/4,route:null,trackPlayer};
  if(danger.kind==='ring')danger.safeAngle??=0;
  this.pending.push(danger);return danger;
 }
 private cancel(h:S2Hazard){h.phase='cancelled';h.token=0;}
 private defer(h:S2Hazard,tick:number){h.phase='queued';h.token=0;h.retryTick=tick+DANGER_RETRY_TICKS;h.warningTicks=Math.ceil(h.warningTotal*HZ);h.warning=h.warningTotal;h.locked=false;h.route=null;this.pending.push(h);}
 update(tick:number,week:number,player:Point,speed:number,ownerAlive:(h:S2Hazard)=>boolean,onStart:(h:S2Hazard)=>void){
  for(let n=this.active.length-1;n>=0;n--){
   const h=this.active[n];if(h.cancelOnDeath&&!ownerAlive(h)){this.cancel(h);this.active.splice(n,1);continue;}
   if((h.frozen??0)>0){h.frozen=Math.max(0,(h.frozen??0)-1/HZ);continue;}
   if(h.startedTick===tick)continue;
   if(h.phase==='warning'){
    if(h.trackPlayer&&!h.locked){
     if(h.kind==='line'){const length=Math.hypot(h.x2-h.x,h.y2-h.y),a=Math.atan2(player.y-h.y,player.x-h.x);h.x2=h.x+Math.cos(a)*length;h.y2=h.y+Math.sin(a)*length;}
     else if(h.kind==='circle'){h.x=player.x;h.y=player.y;}
    }
    h.warningTicks--;h.warning=Math.max(0,h.warningTicks/HZ);
    if(!h.locked){
     if(h.trackPlayer){
      const route=safeDangerRoute(this.world,this.navigation,player,speed,h,this.active);
      if(!route){this.active.splice(n,1);this.defer(h,tick);continue;}
      // Wide/slow-to-escape attacks must stop following sooner. Waiting until
      // exactly 0.35s could otherwise make every targeted cast defer forever.
      h.route=route;if(h.warning<=route.travelSeconds+.2+2/HZ)h.locked=true;
     }
     if(h.warningTicks<=LOCK_TICKS)h.locked=true;
    }
    if(h.warningTicks<=0)h.phase='active';
   }else{
    h.lifeTicks--;h.life=Math.max(0,h.lifeTicks/HZ);
    if(h.lifeTicks<=0){this.cancel(h);this.active.splice(n,1);continue;}
    if(h.angularSpeed){const dx=h.x2-h.x,dy=h.y2-h.y,a=h.angularSpeed/HZ;h.x2=h.x+dx*Math.cos(a)-dy*Math.sin(a);h.y2=h.y+dx*Math.sin(a)+dy*Math.cos(a);}
   }
  }
  // Source identity, then geometry, breaks ties independently of pool swaps.
  this.pending.sort((a,b)=>a.requestedTick-b.requestedTick||(a.owner??-1)-(b.owner??-1)||(a.ownerGeneration??0)-(b.ownerGeneration??0)||a.x-b.x||a.y-b.y||a.id-b.id);
  for(let n=0;n<this.pending.length;){
   const h=this.pending[n];if(h.cancelOnDeath&&!ownerAlive(h)){this.cancel(h);this.pending.splice(n,1);continue;}
   if(h.retryTick>tick){n++;continue;}
   this.pending.splice(n,1);
   if(this.active.length>=pressureAt(week).majorCap){h.retryTick=tick+DANGER_RETRY_TICKS;this.pending.splice(n,0,h);n++;continue;}
   const route=safeDangerRoute(this.world,this.navigation,player,speed,h,this.active);
   if(!route){h.retryTick=tick+DANGER_RETRY_TICKS;this.pending.splice(n,0,h);n++;continue;}
   h.route=route;h.phase='warning';h.token=++this.serial;h.startedTick=tick;this.active.push(h);onStart(h);
  }
 }
 cancelOwner(owner:number,generation:number){for(const list of [this.pending,this.active])for(let n=list.length-1;n>=0;n--)if(list[n].owner===owner&&list[n].ownerGeneration===generation){this.cancel(list[n]);list.splice(n,1);}}
 cancelNear(p:Point,radius:number){for(const list of [this.pending,this.active])for(let n=list.length-1;n>=0;n--)if(Math.hypot(list[n].x-p.x,list[n].y-p.y)<=radius){this.cancel(list[n]);list.splice(n,1);}}
 clear(){for(const h of [...this.pending,...this.active])this.cancel(h);this.pending.length=0;this.active.length=0;}
}

export function ringRadius(h:Pick<S2Hazard,'radius'|'life'|'lifeTotal'>){return h.radius*clamp(1-h.life/h.lifeTotal,0,1);}
