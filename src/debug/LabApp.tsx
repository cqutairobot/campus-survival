import {lazy,Suspense,useEffect} from 'react';
import {getAudio,disposeAudio} from '../audio/audio';
import {useApp} from '../state/store';
import {FeedbackLab} from './FeedbackLab';
import {AudioLab} from './AudioLab';
import {MotionLab} from './MotionLab';
const UiFixture=lazy(()=>import('./UiFixture').then(m=>({default:m.UiFixture})));
export function LabApp(){
 const settings=useApp(s=>s.save.settings),lab=new URLSearchParams(location.search).get('lab');getAudio(settings);
 useEffect(()=>{document.body.classList.toggle('reduce-motion',!settings.motion);document.documentElement.dataset.quality=settings.quality==='auto'?'high':settings.quality;getAudio().apply(settings);},[settings]);
 useEffect(()=>()=>disposeAudio(),[]);
 if(lab==='ui-preview')return <Suspense fallback={<p>正在准备预览…</p>}><UiFixture/></Suspense>;
 return <main className="laboratory"><p className="lab-isolation-note">隔离测试数据 · 仅内存状态 · 不写真实存档或每日记录</p>{lab==='audio'?<AudioLab/>:lab==='motion'?<MotionLab/>:<FeedbackLab/>}</main>;
}
