import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {useApp} from '../../state/store';
export function AnimatedNumber({value}:{value:number}){
  const ref=useRef<HTMLSpanElement>(null),last=useRef(value),motion=useApp(s=>s.save.settings.motion);
  useEffect(()=>{if(!motion){if(ref.current)ref.current.textContent=value.toLocaleString();last.current=value;return;}const state={value:last.current};const tween=gsap.to(state,{value,duration:.65,ease:'power2.out',onUpdate:()=>{if(ref.current)ref.current.textContent=Math.floor(state.value).toLocaleString();}});last.current=value;return()=>{tween.kill();};},[value,motion]);
  return <span ref={ref}>{value.toLocaleString()}</span>;
}
