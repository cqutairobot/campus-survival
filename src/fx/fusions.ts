import type {Graphics} from 'pixi.js';
import type {VisualEvent} from '../types';
import {TAU} from '../core/math';
export function drawFusion(g:Graphics,e:VisualEvent,t:number,light:boolean){const x=e.x,y=e.y,c=e.color,fade=1-t,r=Math.min(350,e.size)*(.35+.55*t),count=light?6:12;
 const line=(ax:number,ay:number,bx:number,by:number,width=2)=>g.moveTo(ax,ay).lineTo(bx,by).stroke({color:c,width,alpha:fade*.8});
 switch(e.weapon){
  case 'sword':for(let n=0;n<10;n++){const a=n*TAU/10+t,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.poly([px+Math.cos(a)*25,py+Math.sin(a)*25,px-Math.sin(a)*5,py+Math.cos(a)*5,px-Math.cos(a)*12,py-Math.sin(a)*12,px+Math.sin(a)*5,py-Math.cos(a)*5]).fill({color:0xf0fffa,alpha:fade}).stroke({color:c,width:1,alpha:fade});line(px,py,x,y,1);}g.circle(x,y,r*.4).stroke({color:c,width:3,alpha:fade});break;
  case 'hub':for(let n=0;n<6;n++){const a=n*TAU/6,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.7;line(x,y,px,py);g.roundRect(px-18,py-14,36,28,5).fill({color:c,alpha:fade*.25}).stroke({color:0xd9fffb,width:2,alpha:fade});}for(let n=-1;n<=1;n++)g.rect(x+n*27-11,y-30-Math.abs(n)*-12,22,60).stroke({color:c,width:2,alpha:fade});break;
  case 'binder':for(let n=0;n<count;n++){const a=-Math.PI/2+n*Math.PI/(count-1),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;line(px-5,py+14,px-5,py-8,3);line(px-5,py-8,px+5,py-8,3);line(px+5,py-8,px+5,py+14,3);g.poly([px-5,py-8,px-22,py-24,px,py-16,px+22,py-24,px+5,py-8]).stroke({color:0xfff5da,width:1,alpha:fade});}break;
  case 'sky':for(let n=0;n<6;n++){const a=n*TAU/6+t*.4;line(x-Math.cos(a)*r,y-Math.sin(a)*r,x+Math.cos(a)*r,y+Math.sin(a)*r,3);}g.ellipse(x,y,r,r*.45).stroke({color:c,width:3,alpha:fade});g.ellipse(x,y,r*.45,r).stroke({color:0xffedba,width:2,alpha:fade});break;
  case 'icefire':for(let n=0;n<count;n++){const a=n*TAU/count+t*3,px=x+Math.cos(a)*r*.7,py=y+Math.sin(a)*r*.7;g.arc(x,y,r*(.5+n/count*.5),a,a+.8).stroke({color:n%2?0xf2b565:0x9ae7ff,width:5,alpha:fade});g.poly([px,py-9,px+5,py,px,py+9,px-5,py]).fill({color:n%2?0xffd38c:0xc3f5ff,alpha:fade});}break;
  case 'demolition':for(let n=0;n<4;n++){const a=n*TAU/4+Math.PI/4,px=x+Math.cos(a)*r*.7,py=y+Math.sin(a)*r*.7,next=a+TAU/4;line(px,py,x+Math.cos(next)*r*.7,y+Math.sin(next)*r*.7);g.rect(px-18,py-27,36,54).stroke({color:c,width:3,alpha:fade});g.circle(px,py,30+t*40).stroke({color:0xffe3b9,width:2,alpha:fade});}break;
 }
}
