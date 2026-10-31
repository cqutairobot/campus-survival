import {useApp} from '../../state/store';
export function SaveNotice({open}:{open:()=>void}){
 const state=useApp(s=>s.persistence),status=useApp(s=>s.saveStatus);
 if(['new','ready','fallback'].includes(state))return null;
 return <aside className="save-notice" role="status"><span>{status}。刷新或关闭会丢失本页未保存进度。</span><button className="button small" onClick={open}>存档与恢复</button></aside>;
}
