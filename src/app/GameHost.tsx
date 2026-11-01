import { useEffect, useRef, useState } from 'react';
import type {GameEngine} from '../core/engine';
import {loadSemesterRuntime} from '../semesters/registry';
import type {SemesterId} from '../semesters/profile';
import type {S1RunSnapshot} from '../semesters/types';
import type {S2RunSnapshot} from '../semesters/types';
import type {S2Engine} from '../semesters/s2/adapter';
import type {SemesterScene} from '../semesters/s2/presentation/SemesterScene';
import {createGameEngine,initializeGameScene} from './semester-engine';
import { GameScene } from '../render/scene';
import { useApp } from '../state/store';
import type { Joystick } from '../core/input';
import {getAudio} from '../audio/audio';
import type {LoadProgress} from '../assets/loader';
export interface GameSession {semesterId?:'s1';engine:GameEngine;scene:GameScene;snapshot?:S1RunSnapshot}
export interface S2GameSession {semesterId:'s2';engine:S2Engine;scene:SemesterScene;snapshot:S2RunSnapshot}
export type ActiveGameSession=GameSession|S2GameSession;
declare global {interface Window {__CAMPUS__?:GameSession;__CAMPUS_S2__?:S2GameSession}}
export function GameHost({onReady,seed,debug,mode,semesterId}:{onReady:(session:ActiveGameSession|null)=>void;seed:number;debug:boolean;mode:'normal'|'daily';semesterId:SemesterId}){
  const host=useRef<HTMLDivElement>(null),[stick,setStick]=useState<Joystick>({active:false,x:0,y:0,dx:0,dy:0}),[error,setError]=useState('');
  const settings=useApp(s=>s.save.settings),sessionRef=useRef<ActiveGameSession|null>(null),callback=useRef(onReady);callback.current=onReady;
  const [progress,setProgress]=useState<LoadProgress|null>(null),[loaded,setLoaded]=useState(false);
  useEffect(()=>{
    const state=useApp.getState(),abort=new AbortController();let alive=true,session:ActiveGameSession|null=null,openingEngine:{dispose:()=>void}|null=null;
    void (async()=>{
      const route=await loadSemesterRuntime(semesterId,state.save);if(!alive)return;
      const run=createGameEngine(route,state.save,seed,{publish:state.publish,discover:state.discover,settle:state.settle},{publish:phase=>{const current=useApp.getState();current.publish({...current.hud,phase});},discover:state.discover,settle:state.settleS2,beginDaily:state.beginDaily},mode);
      openingEngine=run.engine;
      if(run.semesterId==='s2'){
        const audio=getAudio(state.save.settings);audio.prepareCombat();audio.setTheme('normal');
        const scene=await run.prepareScene(run.engine,{host:host.current!,settings:state.save.settings,onStick:setStick,audio,onLoad:setProgress,signal:abort.signal});
        if(!alive){run.engine.dispose();return;}session={semesterId:'s2',engine:run.engine,scene,snapshot:run.snapshot};sessionRef.current=session;scene.applySettings(useApp.getState().save.settings);setLoaded(true);callback.current(session);if(debug)window.__CAMPUS_S2__=session;return;
      }
      const {engine,snapshot}=run;
      if(mode==='daily')state.beginDaily(`s1|${engine.manifest.date}|${engine.manifest.rulesVersion}`);
      if(debug)engine.enableReplay();
      const audio=getAudio(state.save.settings);audio.prepareCombat();audio.setTheme('normal');
      const scene=new GameScene(host.current!,engine,state.save.settings,setStick,debug,audio,setProgress);session={engine,scene,snapshot};sessionRef.current=session;
      await initializeGameScene(scene,engine);if(alive){setLoaded(true);callback.current(session);if(debug)window.__CAMPUS__=session;}
    })().catch((e:unknown)=>{session?.scene.destroy();openingEngine?.dispose();session=null;sessionRef.current=null;if(alive){callback.current(null);setError(e instanceof Error?e.message:'无法初始化 WebGL');}});
    return()=>{alive=false;abort.abort();callback.current(null);delete window.__CAMPUS__;delete window.__CAMPUS_S2__;session?.scene.destroy();openingEngine?.dispose();sessionRef.current=null;};
  },[seed,debug,mode,semesterId]);
  useEffect(()=>{sessionRef.current?.scene.applySettings(settings);},[settings]);
  return <>{!loaded&&!error&&<div className="loading-screen" role="status"><span className="loading-leaf">✦</span><h2>{progress?.label??'准备校园画册'}</h2><p>{progress?`${progress.completed} / ${progress.total} 项装备已整理`: '正在准备校园'}</p>{progress&&<progress max={progress.total||1} value={progress.completed}/>}</div>}<div ref={host} className="game-canvas" aria-label="校园生存战斗区域，使用 WASD 或方向键移动"/>{stick.active&&<div className="joystick" style={{left:stick.x,top:stick.y}}><div style={{transform:`translate(${stick.dx}px,${stick.dy}px)`}}/></div>}{error&&<div className="renderer-error"><b>画布没有成功启动</b><p>{error}</p><p>请在支持 WebGL 的浏览器中打开，并开启硬件加速。</p><button onClick={()=>location.reload()}>重新载入</button></div>}</>;
}
