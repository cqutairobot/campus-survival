/** Seconds, never render frames. This clock cannot stop or write to GameEngine. */
export class PresentationClock {
  remaining=0;private history:{time:number;seconds:number}[]=[];
  constructor(readonly budgetFrames=8){}
  request(now:number,frames:number,strength=1){
    this.history=this.history.filter(entry=>now-entry.time<1-1e-9);
    const available=Math.max(0,this.budgetFrames/60-this.history.reduce((sum,entry)=>sum+entry.seconds,0));
    const wanted=Math.max(0,frames/60*Math.min(1,Math.max(0,strength)));
    const extra=Math.min(available,Math.max(0,wanted-this.remaining));
    if(extra>0)this.history.push({time:now,seconds:extra});
    this.remaining+=extra;return this.remaining;
  }
  advance(dt:number){const held=Math.min(this.remaining,Math.max(0,dt));this.remaining=Math.max(0,this.remaining-dt);return Math.max(0,dt-held);}
  clear(){this.remaining=0;this.history=[];}
}
