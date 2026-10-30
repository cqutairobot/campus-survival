import {ACHIEVEMENTS} from '../../data/achievements';
import {useApp} from '../../state/store';
import {Icon} from '../components/Icon';
const badges=['cap','book','ruler','snow','shield','sparkles','trophy','map','bolt','users','clock','star','compass','leaf'];
export function Achievements(){
 const save=useApp(s=>s.save),completed=ACHIEVEMENTS.filter(a=>save.achievements[a.id]?.completed).length;
 return <><div className="achievement-summary"><span className="academic-badge"><Icon name="trophy" size={35}/></span><div><div className="eyebrow">SEMESTER HONOURS</div><h3>{completed} <small>/ {ACHIEVEMENTS.length} 项成就</small></h3><p>每一步努力，都有新的可能。</p></div><progress aria-label="成就完成总进度" value={completed} max={ACHIEVEMENTS.length}/></div><p className="panel-footnote">普通模式成就在正常结算时提交，内容从下一局开放；每日成就单独累计。奖励自动领取，练习局不推进成就。</p><div className="achievement-grid">{ACHIEVEMENTS.map((a,index)=>{const state=save.achievements[a.id],done=state?.completed;return <article className={`achievement-card ${done?'completed':''}`} key={a.id}><span className="academic-badge"><Icon name={badges[index]} size={29}/>{done&&<i><Icon name="check" size={12}/></i>}</span><div><small className="eyebrow">{a.daily?'每日挑战':'普通学期'} / {String(index+1).padStart(2,'0')}</small><h3>{a.name}</h3><p>{a.condition}</p><progress aria-label={`${a.name}进度`} value={state?.progress??0} max={a.goal}/><span>{Math.floor(state?.progress??0)} / {a.goal} · {done?'已完成 · 奖励已领取':'进行中'}</span><b><Icon name={done?'check':'lock'} size={13}/>{a.reward}</b></div></article>;})}</div></>;
}
