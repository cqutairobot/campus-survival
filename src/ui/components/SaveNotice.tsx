import {useApp} from '../../state/store';
import {download} from '../screens/Panels';
export function SaveNotice({open}:{open:()=>void}){
 const state=useApp(s=>s.persistence),status=useApp(s=>s.saveStatus),refresh=useApp(s=>s.refreshSave),inGame=useApp(s=>!['menu','result'].includes(s.hud.phase));
 if(['new','ready','fallback'].includes(state))return null;
 return <aside className="save-notice" role="status"><span>{status}。刷新或关闭会丢失本页未保存进度。</span><div className="save-actions"><button className="button small" disabled={inGame} onClick={()=>{void refresh();}}>刷新</button><button className="button small" onClick={open}>{state==='observer'||state==='conflict'?'接管 / 存档':'存档与恢复'}</button><button className="button small" onClick={()=>download('校园生存-本页内存进度.json',JSON.stringify(useApp.getState().save,null,2))}>导出本页进度</button></div></aside>;
}
