import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../core/engine';
import {toLegacyS1Save} from '../save/v5/profile';
import { GameScene } from '../render/scene';
import { useApp } from '../state/store';
import type { Joystick } from '../core/input';
import {getAudio} from '../audio/audio';
import type {LoadProgress} from '../assets/loader';
export interface GameSession {engine:GameEngine;scene:GameScene}
declare global {interface Window {__CAMPUS__?:GameSession}}
export function GameHost({onReady,seed,debug,mode}:{onReady:(session:GameSession|null)=>void;seed:number;debug:boolean;mode:'normal'|'daily'}){
  const host=useRef<HTMLDivElement>(null),[stick,setStick]=useState<Joystick>({active:false,x:0,y:0,dx:0,dy:0}),[error,setError]=useState('');
  const settings=useApp(s=>s.save.settings),sessionRef=useRef<GameSession|null>(null),callback=useRef(onReady);callback.current=onReady;
  const [progress,setProgress]=useState<LoadProgress|null>(null),[loaded,setLoaded]=useState(false);
  useEffect(()=>{
    const state=useApp.getState(),engine=new GameEngine(toLegacyS1Save(state.save),seed,{publish:state.publish,discover:state.discover,settle:state.settle},{mode});
    if(mode==='daily')state.beginDaily(`s1|${engine.manifest.date}|${engine.manifest.rulesVersion}`);
    if(debug)engine.enableReplay();
    const audio=getAudio(state.save.settings);audio.prepareCombat();audio.setTheme('normal');
    const scene=new GameScene(host.current!,engine,state.save.settings,setStick,debug,audio,setProgress),session={engine,scene};sessionRef.current=session;
    let alive=true;
    scene.initialize().then(()=>{if(alive){setLoaded(true);callback.current(session);if(debug)window.__CAMPUS__=session;}}).catch((e:unknown)=>{if(alive)setError(e instanceof Error?e.message:'无法初始化 WebGL');});
    return()=>{alive=false;callback.current(null);delete window.__CAMPUS__;scene.destroy();engine.dispose();sessionRef.current=null;};
  },[seed,debug,mode]);
  useEffect(()=>{sessionRef.current?.scene.applySettings(settings);},[settings]);
  return <>{!loaded&&!error&&<div className="loading-screen" role="status"><span className="loading-leaf">✦</span><h2>{progress?.label??'准备校园画册'}</h2><p>{progress?`${progress.completed} / ${progress.total} 项装备已整理`: '正在准备校园'}</p>{progress&&<progress max={progress.total||1} value={progress.completed}/>}</div>}<div ref={host} className="game-canvas" aria-label="校园生存战斗区域，使用 WASD 或方向键移动"/>{stick.active&&<div className="joystick" style={{left:stick.x,top:stick.y}}><div style={{transform:`translate(${stick.dx}px,${stick.dy}px)`}}/></div>}{error&&<div className="renderer-error"><b>画布没有成功启动</b><p>{error}</p><p>请在支持 WebGL 的浏览器中打开，并开启硬件加速。</p><button onClick={()=>location.reload()}>重新载入</button></div>}</>;
}
