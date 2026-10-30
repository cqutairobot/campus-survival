import {useEffect,useRef} from 'react';
import {FeedbackDirector} from '../presentation/FeedbackDirector';
import {useApp} from '../state/store';
import {artUrl} from '../assets/manifest';
import {getAudio} from '../audio/audio';
import type {VisualEvent} from '../types';
/** Isolated settings fixture: neither a GameEngine nor a save writer exists here. */
export function FeedbackPreview(){
 const canvas=useRef<HTMLCanvasElement>(null),director=useRef<FeedbackDirector|null>(null),eventRef=useRef<VisualEvent|null>(null),clock=useRef(0);
 const settings=useApp(s=>s.save.settings);
 useEffect(()=>{director.current?.apply(settings);},[settings]);
 useEffect(()=>{
  const el=canvas.current!,ctx=el.getContext('2d')!,d=new FeedbackDirector(useApp.getState().save.settings);director.current=d;const image=new Image();image.src=artUrl('homework');let frame=0,last=performance.now(),age=10;
  const draw=(now:number)=>{
   const dt=Math.min(.05,(now-last)/1000);last=now;clock.current+=dt;
   if(eventRef.current){d.consume([eventRef.current]);eventRef.current=null;age=0;}else age+=dt;
   const camera=d.update(dt),pose=d.entities.pose(1,1),w=el.width,h=el.height,s=useApp.getState().save.settings;
   ctx.clearRect(0,0,w,h);ctx.fillStyle='#dce3d0';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#a8b9a166';
   for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
   ctx.save();ctx.translate(w/2+camera.x,h/2+camera.y);ctx.scale(camera.zoom,camera.zoom);ctx.rotate(camera.rotation);ctx.translate(pose.x,pose.y);ctx.scale(pose.scaleX,pose.scaleY);
   if(image.complete&&image.naturalWidth)ctx.drawImage(image,-48,-48,96,96);else{ctx.fillStyle='#f4eee2';ctx.fillRect(-28,-35,56,70);ctx.fillStyle='#182338';ctx.fillRect(-15,-4,7,7);ctx.fillRect(8,-4,7,7);}
   if(pose.white*s.flash>0){ctx.globalAlpha=pose.white*s.flash*.55;ctx.fillStyle='#fff';ctx.fillRect(-24,-33,48,66);ctx.globalAlpha=1;}
   if(age<.3&&s.motion&&s.distortion){ctx.beginPath();ctx.arc(0,0,age*320+10,0,Math.PI*2);ctx.strokeStyle=`rgba(255,210,110,${1-age/.3})`;ctx.lineWidth=3;ctx.stroke();}ctx.restore();
   if(age<.75){ctx.fillStyle='#bd7d20';ctx.font='600 28px Campus Digits, sans-serif';ctx.fillText('128',w/2-15,h/2-45-(s.motion?age*30:0));}
   frame=requestAnimationFrame(draw);
  };frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);image.src='';d.clear();director.current=null;};
 },[]);
 const preview=()=>{const event:VisualEvent={type:'hit',slot:1,generation:1,critical:true,x:0,y:0,color:0xffd16f,size:12,angle:-.3,material:'paper',value:128,weapon:'knife'};eventRef.current=event;getAudio().event(event);};
 return <div><div className="lab-preview"><canvas ref={canvas} width={500} height={190} aria-label="独立反馈预览"/><span className="lab-preview-label">纸张 · 暴击</span></div><div className="settings-preview"><button className="button small" onClick={preview}>预览镜头、闪白与停顿</button></div></div>;
}
