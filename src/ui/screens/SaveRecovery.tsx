import {useState} from 'react';
import {useApp} from '../../state/store';
import {recoveryPreview} from '../../save/recovery';
import {download} from './Panels';
export function SaveRecovery({close,inGame}:{close:()=>void;inGame:boolean}){
 const save=useApp(s=>s.save),sources=useApp(s=>s.recoverySources),state=useApp(s=>s.persistence),recover=useApp(s=>s.recoverSave);
 const [index,setIndex]=useState(0),[view,setView]=useState<'initial'|'fields'|'reset'>('initial'),[confirmed,setConfirmed]=useState(false),[message,setMessage]=useState('');
 const source=sources[index],preview=source?recoveryPreview(source.raw):null,blocked=inGame||state==='future'||state==='unavailable';
 const original=()=>{if(source)download(`校园生存-恢复前原文-${index+1}.txt`,source.raw,'text/plain;charset=utf-8');};
 return <div className="save-recovery"><p>原始内容已保留。确认恢复前，本页只在内存中保存进度，刷新或关闭会丢失本页新进度。</p>{source&&<><label className="select-row">原文来源<select aria-label="恢复原文来源" value={index} onChange={e=>{setIndex(Number(e.target.value));setView('initial');}}>{sources.map((s,n)=><option key={s.key} value={n}>{s.key} · {s.reason}</option>)}</select></label><p>{source.reason}</p></>}
 <div className="save-actions">{source&&<button className="button" onClick={original}>导出原文</button>}<button className="button" onClick={()=>download('校园生存-本页内存进度.json',JSON.stringify(save,null,2))}>导出本页进度</button></div>
 {inGame&&<p role="status">请先返回校园，再应用恢复或重置。可以先导出本页进度。</p>}{state==='future'&&<p>未来版本不能按字段恢复或重置，请使用对应版本读取；本页仍可加载、游玩和导出。</p>}
 {view==='initial'?<><div className="save-actions"><button className="button" disabled={blocked||!preview} onClick={()=>setView('fields')}>按字段恢复</button><button className="button" onClick={close}>先在内存里继续</button><button className="text-button danger" disabled={blocked} onClick={()=>{setView('reset');setConfirmed(false);}}>重置为新档…</button></div>{source&&!preview&&<p>原文无法解析或版本未知，不能按字段恢复，不会猜测修复 JSON。</p>}</>:<><h3>{view==='fields'?'确认可恢复的进度':'确认重置为新档'}</h3><p>此操作将替换本页内存状态；内存进度不会自动合并。请先导出需要保留的进度。</p>{view==='fields'&&preview&&<><p>角色 {preview.save.selected} · 绩点 {preview.save.credits} · 天赋 {JSON.stringify(preview.save.talents)} · 已游玩 {preview.save.stats.runs} 局</p><ul className="recovery-changes">{preview.changes.map((text,n)=><li key={n}>{text}</li>)}</ul></>}{view==='reset'&&<><p>将使用新档；现有角色、天赋和本页未保存进度不会进入新档。先保护原文，保护失败时不会覆盖原档。</p><label className="toggle-row"><span>我已了解并确认重置</span><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/></label></>}
 <div className="save-actions"><button className="button" autoFocus onClick={()=>{setView('initial');setConfirmed(false);}}>取消</button><button className="button primary" disabled={blocked||view==='reset'&&!confirmed} onClick={()=>{const result=recover(view==='fields'?'fields':'reset',index);setMessage(result.message);if(result.kind==='saved')setView('initial');}}>{view==='fields'?'确认恢复并保存':'保留原文并重置'}</button></div></>}
 {message&&<p role="status">{message}</p>}</div>;
}
