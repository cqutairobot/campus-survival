export interface TrailPoint{x:number;y:number;time:number}
export class TrailHistory {
  readonly points:TrailPoint[]=[];private lastTime=-Infinity;
  sample(x:number,y:number,time:number,limit:number) {
    // Rendering a simulation frame repeatedly must not emit extra samples.
    if(time<=this.lastTime+1e-6)return false;
    const previous=this.points.at(-1);
    if(previous&&time-this.lastTime<1/60-1e-6&&Math.hypot(x-previous.x,y-previous.y)<8)return false;
    this.lastTime=time;this.points.push({x,y,time});if(this.points.length>limit)this.points.splice(0,this.points.length-limit);return true;
  }
}
