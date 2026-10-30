import {useEffect,useState} from 'react';
import {useApp} from '../../state/store';
export function StatBar({value,max,label,kind='hp',children}:{value:number;max:number;label:string;kind?:'hp'|'xp'|'boss';children?:React.ReactNode}){
  const motion=useApp(s=>s.save.settings.motion),[echo,setEcho]=useState(value),percent=(v:number)=>`${Math.min(100,Math.max(0,v/Math.max(1,max)*100))}%`;
  useEffect(()=>{if(!motion||value>=echo){setEcho(value);return;}const t=setTimeout(()=>setEcho(value),220);return()=>clearTimeout(t);},[value,motion,echo]);
  return <div className={`stat-bar stat-${kind} ${value/max<.3?'danger':''}`} role="progressbar" aria-label={label} aria-valuenow={Math.ceil(value)} aria-valuemin={0} aria-valuemax={Math.ceil(max)}><i className="stat-echo" style={{width:percent(motion?echo:value)}}/><i className="stat-current" style={{width:percent(value)}}/>{children&&<span>{children}</span>}</div>;
}
