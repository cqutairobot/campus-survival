import {useState} from 'react';
import {WEAPON_MAP} from '../../data/catalog';
import {useApp} from '../../state/store';
import {SEMESTERS,semesterAccess} from '../../semesters/registry';
import {createS2PreviewSnapshot,inheritedWeaponIds} from '../../semesters/inheritance';
import type {InheritanceChoice} from '../../semesters/types';
import {Art} from '../components/Art';

const newWeaponNames:Record<string,string>={'s2:drone':'课题无人机','s2:whiteboard':'白板推演','s2:spool':'光纤线盘','s2:printer':'3D 打印笔'};
export function SemesterTabs({inGame=false}:{inGame?:boolean}){
 const profile=useApp(s=>s.save),select=useApp(s=>s.selectSemester);
 return <div className="semester-tabs" role="group" aria-label="选择学期">{(['s1','s2'] as const).map(id=>{const meta=SEMESTERS[id],access=semesterAccess(profile,id);return <button key={id} type="button" aria-pressed={profile.selectedSemester===id} disabled={inGame||!access.eligible} title={access.reason} onClick={()=>select(id)}>{meta.name}<small>{meta.calendar.weeks} 周 · {id==='s2'?(access.eligible?'可开始':'普通通关后开放'):'原校园旅程'}</small></button>;})}</div>;
}
export function Semesters({inGame,start}:{inGame:boolean;start:()=>void}){
 const [showCover,setShowCover]=useState(false);
 const profile=useApp(s=>s.save),select=useApp(s=>s.selectInheritance),access=semesterAccess(profile,'s2'),choice=profile.inheritance.choice;
 const weapons=inheritedWeaponIds(profile),topic=choice.id==='topic'?choice.weaponId:weapons[0];
 const snapshot=access.eligible?createS2PreviewSnapshot(profile,0):null;
 const options:{choice:InheritanceChoice;name:string;description:string}[]=[{choice:{id:'supply'},name:'学长补给',description:'15 点开局护盾，60 战斗秒后失效。'},{choice:{id:'notes'},name:'旧课笔记',description:'前 120 战斗秒经验 +8%。'},{choice:{id:'topic',weaponId:topic},name:'自选课题',description:'替换角色初始武器；Lv.1、普通品质，只占一个武器槽。'}];
 return <div className="semester-picker"><SemesterTabs inGame={inGame}/>{profile.selectedSemester==='s2'&&<><button type="button" onClick={()=>setShowCover(v=>!v)}>{showCover?'收起学期封面':'查看学期封面'}</button>{showCover&&<Art id="s2:semester-cover" alt="第二学期现代校园" className="s2-semester-cover"/>}</>}<p>第一学期可随时回去补全。绩点、角色、天赋与共有收藏持续保留。</p><section><h3>第二学期 · 进阶实习与联合项目</h3><p>24 周，每周 40 秒；第 8、16、24 周考核。{access.eligible?'已认可第一学期普通毕业，无需收集 100%。':'通关第一学期普通模式后开放。'}</p><p role="status">{access.reason}</p></section><section><h3>开学继承 · 三选一</h3><p>选择一份开学心意，本局开始时生效。</p><div className="inheritance-options" role="radiogroup" aria-label="开学继承">{options.map(option=><button type="button" role="radio" key={option.choice.id} aria-checked={choice.id===option.choice.id} disabled={inGame||!access.eligible} onClick={()=>select(option.choice)}><b>{option.name}</b><span>{option.description}</span></button>)}</div><label className="select-row"><span>自选课题武器</span><select aria-label="自选课题武器" value={topic} disabled={inGame||!access.eligible||choice.id!=='topic'} onChange={e=>select({id:'topic',weaponId:e.target.value})}>{weapons.map(id=><option key={id} value={id}>{WEAPON_MAP[id]?.name??newWeaponNames[id]??id}</option>)}</select></label>{snapshot&&<p className="inheritance-preview" data-inheritance={snapshot.inheritance.id}>已预选：{options.find(o=>o.choice.id===choice.id)?.name} · 初始武器 {WEAPON_MAP[snapshot.initialWeapon.id]?.name??newWeaponNames[snapshot.initialWeapon.id]} Lv.1 · 普通</p>}</section><button className="button primary" disabled={inGame||!access.playable||profile.selectedSemester!=='s2'} onClick={start}>开始第二学期</button></div>;
}
