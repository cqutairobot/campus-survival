import { BUILDINGS, WORLD_SIZE } from './campus';
/** Shared 64-unit flow field. One BFS per target cell, at most twice a second. */
export class Navigation {
  readonly side = WORLD_SIZE/64;
  readonly blocked = new Uint8Array(this.side*this.side);
  readonly distance = new Int16Array(this.side*this.side);
  private queue = new Int32Array(this.side*this.side);
  private target=-1;
  constructor(blockers=BUILDINGS){this.configure(blockers);}
  configure(blockers=BUILDINGS){this.blocked.fill(0);this.target=-1;
    for(let y=0;y<this.side;y++)for(let x=0;x<this.side;x++){
      const wx=x*64+32,wy=y*64+32;
      if(blockers.some(b=>wx>b.x-22&&wx<b.x+b.w+22&&wy>b.y-22&&wy<b.y+b.h+22))this.blocked[y*this.side+x]=1;
    }
    this.distance.fill(32767);
  }
  rebuild(x:number,y:number,force=false){
    const cell=Math.floor(y/64)*this.side+Math.floor(x/64);if(cell===this.target&&!force)return;
    this.target=cell;this.distance.fill(32767);this.distance[cell]=0;
    let head=0,tail=1;this.queue[0]=cell;
    while(head<tail){const c=this.queue[head++],cx=c%this.side,cy=Math.floor(c/this.side),d=this.distance[c]+1;
      const visit=(n:number)=>{if(!this.blocked[n]&&this.distance[n]===32767){this.distance[n]=d;this.queue[tail++]=n;}};
      if(cx>0)visit(c-1);if(cx<this.side-1)visit(c+1);if(cy>0)visit(c-this.side);if(cy<this.side-1)visit(c+this.side);
    }
  }
  direction(x:number,y:number,out={x:0,y:0}){
    const cx=Math.max(0,Math.min(this.side-1,Math.floor(x/64))),cy=Math.max(0,Math.min(this.side-1,Math.floor(y/64))),c=cy*this.side+cx;
    let best=c,bestD=this.distance[c];
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=this.side||ny>=this.side)continue;
      if(dx&&dy&&(this.blocked[c+dx]||this.blocked[c+dy*this.side]))continue;
      const n=ny*this.side+nx;if(!this.blocked[n]&&this.distance[n]<bestD){best=n;bestD=this.distance[n];}
    }
    out.x=(best%this.side)*64+32-x;out.y=Math.floor(best/this.side)*64+32-y;return out;
  }
}
