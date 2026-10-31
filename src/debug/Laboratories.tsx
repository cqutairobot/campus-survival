import {useEffect,useState} from 'react';
import {getAudio} from '../audio/audio';
const labs=[['feedback','打击感实验室'],['audio','音频实验室'],['motion','界面动效实验室']] as const;
export function Laboratories({pause}:{pause:()=>void}){
 const [lab,setLab]=useState('');
 useEffect(()=>{if(!lab)return;const audio=getAudio();audio.suspendForLab(true);return()=>audio.suspendForLab(false);},[lab]);
 useEffect(()=>{const open=(event:Event)=>{pause();setLab((event as CustomEvent<string>).detail||'feedback');};window.addEventListener('campus-open-lab',open);return()=>window.removeEventListener('campus-open-lab',open);},[pause]);
 useEffect(()=>{if(!lab)return;const previous=document.activeElement as HTMLElement|null;const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.stopImmediatePropagation();setLab('');}};window.addEventListener('keydown',key,true);return()=>{window.removeEventListener('keydown',key,true);previous?.focus();};},[lab]);
 return <><button className="lab-launcher" onClick={()=>{pause();setLab('feedback');}}>表现调试实验室</button>{lab&&<div className="lab-shell" role="dialog" aria-modal="true" aria-label="表现调试实验室"><header><nav>{labs.map(([id,label])=><button autoFocus={id===lab} aria-pressed={id===lab} key={id} onClick={()=>setLab(id)}>{label}</button>)}</nav><button onClick={()=>setLab('')} aria-label="关闭实验室">关闭</button></header><iframe key={lab} title={labs.find(([id])=>id===lab)?.[1]} src={`?debug=1&fixture=1&lab=${lab}`}/></div>}</>;
}
