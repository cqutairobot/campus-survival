import {useEffect,useState,useSyncExternalStore} from 'react';
import type {S2GameSession} from '../../../app/GameHost';
import type {Panel} from '../../../ui/screens/Menu';
import {SaveNotice} from '../../../ui/components/SaveNotice';
import {ContentArt} from '../../../ui/components/ContentArt';
import {StatBar} from '../../../ui/components/StatBar';
import {S2_CONTENT} from '../content';
import type {S2Engine} from '../adapter';
import {presentationPhase} from './input';
import './semester-ui.css';

const time=(seconds:number)=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;
/** UI owns gate acknowledgements; the runtime still validates every token. */
export function useAssessmentGate(engine:S2Engine){
 const view=useSyncExternalStore(engine.subscribeHUD,engine.readHUD),phase=presentationPhase(view),token=view.gate?.token;
 useEffect(()=>{
  if(token===undefined||view.pause||!['bossIntro','bossDeath'].includes(phase))return;
  const timer=setTimeout(()=>engine.acknowledge(token),phase==='bossIntro'?2200:750);return()=>clearTimeout(timer);
 },[engine,token,phase,view.pause]);
 return view;
}
export function SemesterUI({session,open,menu,restart}:{session:S2GameSession;open:(panel:Panel)=>void;menu:()=>void;restart:()=>void}){
 const [expanded,setExpanded]=useState(false),{engine}=session,view=useAssessmentGate(engine),g=view.content,phase=presentationPhase(view),boss=g.boss;
 const loadout=(items:typeof g.weapons,label:string)=><div className="s2-hud-loadout" aria-label={label}><b>{label}</b>{items.map(skill=>{const def=S2_CONTENT.weaponById[skill.id]??S2_CONTENT.passiveById[skill.id];return <button key={skill.id} title={def.description} onClick={()=>open('codex')}><ContentArt id={skill.id} icon={def.icon} evolved={skill.evolved}/><span>{skill.evolved&&'evolution'in def?def.evolution.name:def.name}<small>{skill.kind==='fusion'?'融合':skill.evolved?'进化':`Lv.${skill.level}`}</small></span></button>;})}</div>;
 return <>
  {phase!=='result'&&<div className="s2-live-hud">
   <div className="s2-hud-top"><section><b>第二学期 · 第 {view.clock.week} 周 / 24</b><p>第 {g.chapter.chapter} 章 · {g.chapter.title}</p><small>教学 {time(view.clock.teachingSeconds)} · 战斗 {time(view.clock.combatSeconds)}{session.snapshot.mode==='daily'?` / 25:00 · ${session.snapshot.date}`:''}</small><StatBar value={Math.max(0,g.player.hp)} max={g.stats.maxHp} label="生命">{Math.ceil(Math.max(0,g.player.hp))} / {Math.ceil(g.stats.maxHp)} · 护盾 {Math.ceil(g.player.shield)}</StatBar><StatBar value={g.xp} max={g.xpNext} label="经验" kind="xp">Lv.{g.level} · 击败 {g.kills}</StatBar></section><nav><button onClick={()=>open('map')}>校园地图</button><button onClick={()=>engine.send({type:'pause'})} aria-label="暂停游戏">暂停</button></nav></div>
   <div className="s2-hud-information"><SaveNotice embedded open={()=>open('recovery')}/>{boss&&<div className="s2-hud-boss"><b>{S2_CONTENT.enemyById[boss.id]?.name} · 阶段 {boss.stage}</b><StatBar value={Math.max(0,boss.hp)} max={boss.maxHp} label="考核生命" kind="boss"/><small>{Math.ceil(Math.max(0,boss.hp)).toLocaleString()} / {boss.maxHp.toLocaleString()} · 加时 {time(view.clock.assessmentSeconds)}</small></div>}{g.event&&<p>{g.event.warning>0?'即将开始 · ':''}{g.event.name} · {Math.ceil(g.event.warning||g.event.remaining)}s</p>}{g.notice&&<p role="status">{g.notice}</p>}</div>
   <div className="s2-hud-bottom"><button className="s2-build-toggle" aria-expanded={expanded} aria-controls="s2-current-build" onClick={()=>setExpanded(v=>!v)}>构筑 {g.weapons.length}/6 + {g.passives.length}/6 + {g.relics.length}/3</button><div id="s2-current-build" className={`s2-loadout-detail ${expanded?'is-expanded':''}`}>{loadout(g.weapons,'武器')}{loadout(g.passives,'被动')}{g.relics.length>0&&<div className="s2-hud-relics">风险 {g.relics.length}/3{g.relics.map(id=>{const relic=S2_CONTENT.relics.find(d=>d.id===id)!;return <span key={id} title={relic.benefit}><ContentArt id={id} icon={relic.icon}/>{relic.name} · {relic.curse}</span>;})}</div>}</div></div><div className="s2-hud-actions"><button className="s2-ultimate" disabled={!g.ultimate.ready||phase!=='playing'} onPointerDown={e=>{if(e.pointerType==='touch'){e.preventDefault();engine.send({type:'ultimate'});}}} onClick={()=>engine.send({type:'ultimate'})}>{g.ultimate.name} · {g.ultimate.ready?'释放':`${Math.floor(g.ultimate.energy)}/240`}<small>Space / Q</small></button></div>
  </div>}
  {phase==='paused'&&<div className="s2-pause" role="dialog" aria-label="暂停第二学期"><section><h2>歇一下，也没关系。</h2><p>第 {view.clock.week} 周 · 第 {g.chapter.chapter} 章 · Lv.{g.level}</p><button className="button primary" onClick={()=>engine.send({type:'resume'})}>继续这个学期</button><button onClick={()=>open('settings')}>设置</button><button onClick={()=>open('codex')}>图鉴</button><button onClick={()=>engine.send({type:'abandon'})}>结束本局并结算</button></section></div>}
  {(phase==='bossIntro'||phase==='bossDeath')&&<div className="s2-cinematic"><h2>{phase==='bossIntro'?`第 ${view.assessment?.week} 周考核`:'考核通过！'}</h2><p>{phase==='bossIntro'?'教学计时暂停，准备进入考场。':'奖励已确认，继续校园旅程。'}</p><button onClick={()=>view.gate&&engine.acknowledge(view.gate.token)}>继续考核</button></div>}
  {phase==='result'&&<div className="s2-session-actions"><SaveNotice embedded open={()=>open('recovery')}/><button className="button" onClick={menu}>返回校园</button><button className="button primary" onClick={restart}>再来一学期</button></div>}
 </>;
}
