import type {Graphics} from 'pixi.js';
import type {VisualEvent} from '../types';
import {TAU} from '../core/math';
/** Six silhouettes stay identifiable when bloom, flashes and particles are disabled. */
export function drawUltimate(g:Graphics,e:VisualEvent,t:number,light:boolean){const x=e.x,y=e.y,c=e.color,fade=1-t,r=(80+600*t),ring=(rr:number,width=3)=>g.circle(x,y,Math.max(1,rr)).stroke({color:c,width,alpha:fade*.85});
 switch(e.ultimate){
  case 'submission':{ring(r,5);const s=100+180*t;g.roundRect(x-s/2,y-s*.65,s,s*1.3,9).fill({color:0xfff5d1,alpha:fade*.16}).stroke({color:c,width:4,alpha:fade});for(let n=0;n<5;n++){const a=n*TAU/5,px=x+Math.cos(a)*r*.6,py=y+Math.sin(a)*r*.6;g.roundRect(px-18,py-18,36,36,5).stroke({color:0xe6bc64,width:4,alpha:fade});}break;}
  case 'lastMinute':{ring(r,5);ring(r*.9,2);for(let n=0;n<12;n++){const a=n*TAU/12;g.moveTo(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8).lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r).stroke({color:c,width:n%3?2:5,alpha:fade});}g.moveTo(x,y-r*.6).lineTo(x,y).lineTo(x+r*.4,y).stroke({color:0xf3fdff,width:5,alpha:fade});break;}
  case 'parallel':{const count=6;for(let n=0;n<count;n++){const a=n*TAU/count+t,x2=x+Math.cos(a)*r*.65,y2=y+Math.sin(a)*r*.4;g.moveTo(x,y).lineTo(x2,y2).stroke({color:c,width:2,alpha:fade});g.roundRect(x2-25,y2-18,50,36,8).fill({color:0xd6fff0,alpha:fade*.3}).stroke({color:c,width:3,alpha:fade});g.circle(x2-8,y2,3).fill({color:c,alpha:fade});g.circle(x2+8,y2,3).fill({color:c,alpha:fade});}ring(r*.3);break;}
  case 'conference':{for(let n=0;n<3;n++)ring(r*(1-n*.22),4-n);for(let n=0;n<5;n++){const a=n*TAU/5,px=x+Math.cos(a)*r*.7,py=y+Math.sin(a)*r*.7;g.ellipse(px,py,24,32).stroke({color:c,width:2,alpha:fade});g.moveTo(px-24,py).lineTo(px+24,py).stroke({color:0xfff8ed,width:2,alpha:fade});}break;}
  case 'barrier':{const rr=260*(.3+.7*Math.min(1,t*3)),points:number[]=[];for(let n=0;n<6;n++){const a=n*TAU/6;points.push(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}g.poly(points).fill({color:c,alpha:fade*.1}).stroke({color:c,width:5,alpha:fade});for(let n=0;n<(light?6:18);n++){const a=n*TAU/(light?6:18),px=x+Math.cos(a)*rr*.8,py=y+Math.sin(a)*rr*.8;g.rect(px-9,py-9,18,18).stroke({color:0xe3f7ff,width:2,alpha:fade});}break;}
  case 'overload':{for(let n=0;n<2;n++){const side=n?1:-1;g.arc(x,y,r*.65,t*TAU*side,t*TAU*side+Math.PI*1.6).stroke({color:n?0xf6be69:c,width:8,alpha:fade});}for(let n=0;n<(light?4:12);n++){const a=n*TAU/(light?4:12)+t*2,px=x+Math.cos(a)*r*.65,py=y+Math.sin(a)*r*.65;g.poly([px,py-12,px+8,py,px,py+12,px-8,py]).fill({color:n%2?0xffd181:c,alpha:fade});}break;}
 }
}
