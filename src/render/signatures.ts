import {drawFusion} from '../fx/fusions';
import type {Graphics} from 'pixi.js';
import {TAU} from '../core/math';
import type {VisualEvent} from '../types';

/** Distinct silhouettes survive low quality without relying on bloom or particles. */
export function drawSignature(g:Graphics,e:VisualEvent,t:number,light:boolean) {
  const x=e.x,y=e.y,c=e.color,fade=1-t,a=e.angle??0,r=Math.min(240,e.size)*(.45+.35*t),count=e.value??1;
  const line=(x1:number,y1:number,x2:number,y2:number,width=2)=>g.moveTo(x1,y1).lineTo(x2,y2).stroke({color:c,width,alpha:fade*.8});
  const ring=(cx:number,cy:number,radius:number,width=2)=>g.circle(cx,cy,Math.max(1,radius)).stroke({color:c,width,alpha:fade*.8});
  if(['sword','hub','binder','sky','icefire','demolition'].includes(e.weapon??'')){drawFusion(g,e,t,light);return;}
  switch(e.weapon){
    case 'ruler':{const layers=light?2:4;for(let n=0;n<layers;n++){const q=a+t*TAU*(n%2?1:-1)+n*Math.PI/layers,len=e.evolved?e.size*.65:r;line(x-Math.cos(q)*len,y-Math.sin(q)*len,x+Math.cos(q)*len,y+Math.sin(q)*len,n===0?8:3);for(let k=-3;k<=3;k++){const px=x+Math.cos(q)*len*k/4,py=y+Math.sin(q)*len*k/4;line(px,py,px-Math.sin(q)*10,py+Math.cos(q)*10,1);}}ring(x,y,r,2);break;}
    case 'blueprint':for(let n=0;n<Math.min(6,count);n++){const q=n*TAU/count,px=x+Math.cos(q)*90,py=y+Math.sin(q)*70;g.rect(px-18,py-18,36,36).stroke({color:c,width:2,alpha:fade});line(px-18,py,px+18,py,1);line(px,py-18,px,py+18,1);line(x,y,px,py,1);if(e.evolved){line(px-15,py+15,px-15,py-35);line(px+15,py+15,px+15,py-35);line(px-15,py-35,px+15,py-35);}}break;
    case 'shuttle':for(let n=0;n<(light?3:7);n++){const q=a+(n-3)*.12,px=x+Math.cos(q)*r,py=y+Math.sin(q)*r;g.poly([px,py+8,px-16,py-16,px,py-7,px+16,py-16]).fill({color:0xfff9e3,alpha:fade*.7}).stroke({color:c,width:1,alpha:fade});}break;
    case 'prism':ring(x,y,r*.5,3);for(let n=0;n<(e.evolved?5:4);n++){const q=n*TAU/(e.evolved?5:4)+t*.6;line(x+Math.cos(q)*r*.4,y+Math.sin(q)*r*.4,x+Math.cos(q)*r,y+Math.sin(q)*r,3);}for(let n=0;n<12;n++){const q=n*TAU/12;line(x+Math.cos(q)*r*.45,y+Math.sin(q)*r*.45,x+Math.cos(q)*r*.5,y+Math.sin(q)*r*.5,1);}break;
    case 'cryo':ring(x,y,r,3);for(let n=0;n<(light?6:16);n++){const q=n*TAU/(light?6:16),px=x+Math.cos(q)*r*.7,py=y+Math.sin(q)*r*.7;g.poly([px,py-16,px+6,py,px,py+10,px-6,py]).fill({color:0xc8f5ff,alpha:fade*.5}).stroke({color:c,width:1,alpha:fade});}break;
    case 'brick':for(let n=0;n<Math.min(6,count);n++){const q=n*TAU/count,px=x+Math.cos(q)*r*.7,py=y+Math.sin(q)*r*.7;g.rect(px-16,py-25,32,50).fill({color:c,alpha:fade*.2}).stroke({color:c,width:2,alpha:fade});line(px-16,py,px+16,py);line(px,py-25,px,py+25,1);}ring(x,y,r,2);break;
    case 'knife':
      ring(x,y,38+t*32);for(let n=0;n<7;n++){const q=n*TAU/7+t*.8,px=x+Math.cos(q)*(38+t*50),py=y+Math.sin(q)*(38+t*50);g.poly([px,py-12,px+6,py+8,px,py+3,px-6,py+8]).fill({color:0xf6fffa,alpha:fade}).stroke({color:c,width:1,alpha:fade});}break;
    case 'orbit': {
      const points:number[]=[];for(let n=0;n<6;n++){const q=n*TAU/6;points.push(x+Math.cos(q)*e.size,y+Math.sin(q)*e.size);}g.poly(points).stroke({color:c,width:3,alpha:fade*.65});break;
    }
    case 'coffee':
      for(let n=0;n<(light?3:8);n++){const q=a-Math.PI/2+n*Math.PI/(light?2:7),px=x+Math.cos(q)*r,py=y+Math.sin(q)*r;g.circle(px,py,12+t*28).fill({color:c,alpha:fade*.08}).stroke({color:0xffe1a1,width:1,alpha:fade*.35});}break;
    case 'code':
      for(let n=0;n<5;n++){const offset=(n-2)*17,dx=Math.cos(a)*r,dy=Math.sin(a)*r;line(x-Math.sin(a)*offset,y+Math.cos(a)*offset,x+dx-Math.sin(a)*offset,y+dy+Math.cos(a)*offset);const px=x+dx,py=y+dy;g.rect(px-4,py+offset-4,8,8).stroke({color:c,width:2,alpha:fade});}break;
    case 'laser':
      for(let n=0;n<2;n++){const q=a+(n?-.23:.23),px=x+Math.cos(q)*52,py=y+Math.sin(q)*52;ring(px,py,16+t*18,3);line(px-8,py-16,px+8,py+16,1);}break;
    case 'ppt':
      for(let n=0;n<4;n++){const q=a+n*TAU/4+t*2,px=x+Math.cos(q)*r*.6,py=y+Math.sin(q)*r*.6;g.roundRect(px-17,py-11,34,22,3).fill({color:0xfff7e4,alpha:fade*.2}).stroke({color:c,width:2,alpha:fade});line(px-10,py-4,px+10,py-4,1);}break;
    case 'bot':
      for(let n=0;n<4;n++){const q=n*TAU/4+Math.PI/4,px=x+Math.cos(q)*82,py=y+Math.sin(q)*55;line(px,py,x,y,1);ring(px,py,9+10*t);g.rect(px-3,py-3,6,6).fill({color:c,alpha:fade});}ring(x,y,12+t*24);break;
    case 'keyboard':
      for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){if(light&&(row+col)%2)continue;const px=x+col*r*.3,py=y+row*r*.26;g.roundRect(px-9,py-7,18,14,3).fill({color:c,alpha:fade*.16}).stroke({color:0xfff5de,width:1.5,alpha:fade});}break;
    case 'rain':
      for(let n=0;n<(light?3:6);n++){const q=n*TAU/6,px=x+Math.cos(q)*r,py=y+Math.sin(q)*r;line(px+20,py-80*(1-t),px,py,3);g.rect(px-6,py-8,12,16).stroke({color:c,width:2,alpha:fade});}break;
    case 'wifi':
      for(let n=0;n<8;n++){const q=n*TAU/8,px=x+Math.cos(q)*r,py=y+Math.sin(q)*r;ring(px,py,4,2);line(x,y,px,py,1);}ring(x,y,r);break;
    case 'lightning':
      for(let n=0;n<5;n++){const q=n*TAU/5,px=x+Math.cos(q)*r*.7,py=y+Math.sin(q)*r*.7;line(x,y,px,py,2);ring(px,py,7+12*t);}break;
    case 'mentor': {
      const width=e.evolved?230:80;g.roundRect(x-width/2,y-70,width,140,6).fill({color:0xfff8df,alpha:fade*.15}).stroke({color:c,width:3,alpha:fade});
      for(let n=0;n<(e.evolved?5:count);n++){const q=n*TAU/(e.evolved?5:count),px=x+Math.cos(q)*r*.6,py=y+Math.sin(q)*r*.6;g.roundRect(px-13,py-13,26,26,3).stroke({color:c,width:3,alpha:fade});line(px-7,py,px+7,py,2);}break;
    }
    case 'staple':
      for(let n=0;n<12;n++){const q=a-Math.PI/6+n*Math.PI/33,px=x+Math.cos(q)*r,py=y+Math.sin(q)*r;g.moveTo(px-4,py+5).lineTo(px-4,py-5).lineTo(px+4,py-5).lineTo(px+4,py+5).stroke({color:c,width:2,alpha:fade});}break;
    case 'mine':
      for(let n=0;n<3;n++){const q=n*TAU/3,px=x+Math.cos(q)*48,py=y+Math.sin(q)*48,next=q+TAU/3;line(px,py,x+Math.cos(next)*48,y+Math.sin(next)*48,1);ring(px,py,22+t*18);}
      break;
    case 'eraser':
      ring(x,y,e.size*(.75+.25*t),4);for(let n=0;n<8;n++){const q=n*TAU/8,px=x+Math.cos(q)*r,py=y+Math.sin(q)*r;g.roundRect(px-9,py-5,18,10,3).fill({color:0xffffff,alpha:fade*.5});}break;
    case 'broadcast':
      for(let n=0;n<3;n++){const q=n*TAU/3,px=x+Math.cos(q)*55,py=y+Math.sin(q)*55;g.poly([px-8,py-6,px+4,py-12,px+4,py+12,px-8,py+6]).fill({color:c,alpha:fade*.55});ring(x,y,r*(1-n*.15),2);}break;
  }
}
