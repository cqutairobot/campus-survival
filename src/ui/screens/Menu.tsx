import {useEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {CHARACTERS} from '../../data/catalog';
import {useApp} from '../../state/store';
import {PRODUCT_VERSION} from '../../semesters/profile';
import {SEMESTERS} from '../../semesters/registry';
import {SemesterTabs} from './Semesters';
import {Icon} from '../components/Icon';
import {CampusArt,GraduateAvatar} from '../components/CampusArt';
import {Art} from '../components/Art';
import {Button} from '../components/Button';
import {characterArt} from '../../assets/bindings';
import {artUrl,assetUrl} from '../../assets/manifest';

export type Panel='semesters'|'characters'|'talents'|'codex'|'settings'|'controls'|'achievements'|'map'|'daily'|'credits'|'recovery';
export function Menu({open}:{open:(panel:Panel)=>void}){
  const save=useApp(s=>s.save),status=useApp(s=>s.saveStatus),settings=useApp(s=>s.settings),character=CHARACTERS.find(c=>c.id===save.selected)??CHARACTERS[0],semester=SEMESTERS[save.selectedSemester];
  const root=useRef<HTMLElement>(null),[missing,setMissing]=useState(false),art=characterArt[character.id];
  useEffect(()=>{
    if(!save.settings.motion)return;
    const context=gsap.context(()=>{gsap.from('.menu-backdrop',{opacity:0,duration:.5});gsap.from('.hero-copy>*',{opacity:0,y:18,stagger:.06,duration:.5,ease:'power3.out'});gsap.from('.hero-visual',{opacity:0,x:24,duration:.7,delay:.18,ease:'power2.out'});},root);
    return()=>context.revert();
  },[save.settings.motion]);
  return <main className="menu-screen v4-menu" ref={root}>
    <div className={`menu-backdrop ${missing?'art-missing':''}`} aria-hidden="true">{missing?<CampusArt/>:<picture><source media="(max-width:650px)" srcSet={artUrl('menuPortrait')}/><img src={artUrl('menu')} alt="" onError={()=>setMissing(true)}/></picture>}</div>
    <header className="masthead"><a className="brand" href="./" aria-label="校园生存首页"><span className="brand-mark"><img src={assetUrl('assets/art/v4/ui/graduate-cap.svg')} alt="" onError={e=>{e.currentTarget.hidden=true;}}/><Icon name="cap" size={26}/></span><span>校园生存<small>CAMPUS SURVIVAL</small></span></a><div className="masthead-right"><span className="edition">研究生生存指南 · VOL. 05</span><Button variant="icon" aria-label={save.settings.muted?'开启声音':'静音'} onClick={()=>settings({muted:!save.settings.muted})}><Icon name={save.settings.muted?'muted':'volume'}/></Button><Button variant="icon" aria-label="操作指南" onClick={()=>open('controls')}><Icon name="help"/></Button></div></header>
    <section className="menu-hero"><div className="hero-copy"><SemesterTabs/><div className="eyebrow"><span className="eyebrow-line"/>又是充满希望的新学期</div><h1>校园<span>生存</span><small>CAMPUS SURVIVAL</small></h1><h2>这学期，活下去。</h2><p className="hero-description">作业会追你，DDL 不会等你。<br/>带上笔记本，把这 {semester.calendar.weeks} 周<br/>过成自己的高光时刻。</p><div className="hero-actions"><Button variant="primary" className="start-button" onClick={()=>open(save.selectedSemester==='s1'?'characters':'semesters')}><Icon name="play" size={20}/>{save.selectedSemester==='s1'?'开始新学期':'查看第二学期'}<Icon name="arrow" size={22}/></Button><span className="start-note">走位交给你，攻击交给学术。</span></div><button className="selected-student" onClick={()=>open('characters')}><span className="student-icon">{art?<Art id={art.avatar} fallback={<Icon name={character.icon}/>}/>:<Icon name={character.icon}/>}</span><span>当前研究生 <b>{character.name}</b></span><span className="subtle">更换</span><Icon name="chevron" size={14}/></button></div>
    <div className="hero-visual"><div className="portrait-halo"/>{art?<Art id={art.portrait} className="menu-character" alt={character.name} fallback={<GraduateAvatar color={character.color}/>}/>:<GraduateAvatar color={character.color}/>}<div className="portrait-caption"><span>本学期 · 研究生档案</span><b>{character.name}</b><small>{character.subtitle}</small></div></div><div className="campus-coordinate">BEIJING · 39°45′N<br/>一点运气，一杯咖啡。</div></section>
    <nav className="menu-navigation" aria-label="主菜单">{[{panel:'characters' as const,icon:'users',title:'研究生档案',subtitle:'找到你的学术人设',number:'01'},{panel:'talents' as const,icon:'sparkles',title:'局外天赋',subtitle:'每次努力，都有积累',number:'02'},{panel:'codex' as const,icon:'book',title:'学期图鉴',subtitle:'那些学会的生存之道',number:'03'},{panel:'settings' as const,icon:'settings',title:'偏好设置',subtitle:'按你的节奏来',number:'04'}].map(item=><button className="nav-card" onClick={()=>open(item.panel)} key={item.panel}><small className="nav-number">{item.number}</small><span className="nav-icon"><Icon name={item.icon} size={25}/></span><span><b>{item.title}</b><small>{item.subtitle}</small></span><Icon name="arrow" size={18}/></button>)}</nav>
    <div className="menu-extra"><button onClick={()=>open('semesters')}><Icon name="cap" size={16}/>学期与继承</button><button onClick={()=>open('achievements')}><Icon name="trophy" size={16}/>学期成就</button><button onClick={()=>open('map')}><Icon name="map" size={16}/>校园地图</button><button onClick={()=>open('daily')}><Icon name="clock" size={16}/>每日挑战 · 本地榜</button></div>
    <footer className="menu-footer"><span><i className="status-dot"/>{status}</span><span className="footer-controls"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 移动 <span>·</span> 触屏拖动摇杆</span><span><Icon name="cap" size={16}/><b>{save.credits}</b> 绩点<span className="footer-version">v{PRODUCT_VERSION}</span></span></footer>
  </main>;
}
