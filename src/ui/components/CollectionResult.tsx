import type {SaveProfile} from '../../semesters/profile';
import {settlementCollection} from '../../semesters/collection';
import {useApp} from '../../state/store';
export function CollectionResult({before,open}:{before:SaveProfile;open:()=>void}){
 const after=useApp(s=>s.save),changes=settlementCollection(before,after);
 return <section className="result-collection"><h3>本局新发现</h3><p>{changes.discoveries.map(e=>e.name).join('、')||'本局没有新增发现'}</p><h3>本局新达成</h3><p>{changes.achievements.map(e=>e.name).join('、')||'本局没有新成就'}</p><h3>建议下一局补全</h3><ul>{changes.suggestions.map(e=><li key={`${e.category}|${e.id}`}><b>{e.name}</b> · {e.condition}<small> · {e.source}</small></li>)}</ul><button className="button" onClick={()=>{useApp.getState().requestCollectionGaps('all');open();}}>查看全部缺项</button></section>;
}
