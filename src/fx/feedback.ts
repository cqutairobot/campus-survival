/** Rolling one-second budget in fixed 60 Hz steps. Ordinary hits never request it. */
export class HitStopBudget {
  private stops:{time:number;steps:number}[]=[];
  request(time:number,requestedSeconds:number,currentSeconds:number) {
    this.stops=this.stops.filter(s=>time-s.time<1-1e-9);
    const current=Math.round(currentSeconds*60),wanted=Math.min(2,Math.ceil(requestedSeconds*60));
    const available=Math.max(0,3-this.stops.reduce((sum,s)=>sum+s.steps,0)),extra=Math.min(available,Math.max(0,wanted-current));
    if(extra)this.stops.push({time,steps:extra});return(current+extra)/60;
  }
}
