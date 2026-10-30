import {useApp} from '../../state/store';
import {Icon} from '../components/Icon';
import {ContentArt} from '../components/ContentArt';
import {RELIC_MAP} from '../../data/relics';
import {WEAPON_MAP,PASSIVE_MAP} from '../../data/catalog';
import type {GameSession} from '../../app/GameHost';
export function RewardChoice({session}:{session:GameSession|null}){
 const hud=useApp(s=>s.hud),reward=hud.reward,g=session?.engine;
 if(!reward||!g)return null;
 const contract=hud.phase==='contract';
 return <div className="game-overlay reward-overlay"><div className="draft-heading"><div className="eyebrow">{contract?'RISK / REWARD':'ACADEMIC SUPPLY'}</div><h2>{contract?'风险，由你决定。':'选择下一次突破。'}</h2><p>{contract?'遗物与诅咒同时生效，持续到本局结束，最多三组。':'融合消耗两件材料，品质取较高值；也可以保留当前构筑。'}</p></div><div className="reward-options">{reward.options.map((o,i)=>{
  const relic=contract?RELIC_MAP[o.id]:null,after=contract?g.previewRelic(o.id):null,weapon=WEAPON_MAP[o.id];
  const materials=o.kind==='fusion'?weapon?.components:o.kind==='evolution'&&weapon?[o.id,weapon.evolution.passive]:undefined;
  return <button className={`reward-card ${o.kind}`} key={o.id} onClick={()=>g.send({type:'chooseReward',token:reward.token,index:i})}><span className="eyebrow"><Icon name={o.kind==='fusion'?'sparkles':o.kind==='relic'?'shield':'star'}/>{o.kind==='fusion'?'双武器融合':o.kind==='evolution'?'单武器进化':o.kind==='relic'?'自选契约':'保留构筑'}</span><ContentArt id={o.id} icon={relic?.icon??weapon?.icon??'star'} evolved={o.kind==='evolution'} className="reward-art"/><h3>{o.title}</h3>{materials&&<div className="recipe-visual">{materials.map((id,n)=><span className="recipe-material" key={id}>{n>0&&<i>＋</i>}<ContentArt id={id} icon={(WEAPON_MAP[id]??PASSIVE_MAP[id]).icon}/><small>{(WEAPON_MAP[id]??PASSIVE_MAP[id]).name}<br/>Lv.{WEAPON_MAP[id]?5:1}</small></span>)}</div>}{relic?<><div className="contract-benefit"><small><Icon name="plus" size={14}/>收益</small><p>{relic.benefit}</p></div><div className="contract-cost"><small><Icon name="bolt" size={14}/>代价 · {relic.curse}</small><p>{relic.cost}</p></div></>:<p>{o.description}</p>}{relic&&after&&<div className="contract-preview"><b>最终属性预览</b><dl>{[['生命',Math.round(g.stats.maxHp),Math.round(after.maxHp)],['伤害',g.stats.damage.toFixed(2),after.damage.toFixed(2)],['速度',g.stats.speed.toFixed(0),after.speed.toFixed(0)],['充能',g.stats.charge.toFixed(2),after.charge.toFixed(2)],['召唤',g.stats.summon.toFixed(2),after.summon.toFixed(2)],['非召唤',g.stats.nonSummon.toFixed(2),after.nonSummon.toFixed(2)],['暴击',`${(g.stats.crit*100).toFixed(0)}%`,`${(after.crit*100).toFixed(0)}%`],['经验',g.stats.xp.toFixed(2),after.xp.toFixed(2)]].map(([name,before,next])=><div key={name}><dt>{name}</dt><dd>{before} → <b>{next}</b></dd></div>)}</dl></div>}<span className="reward-confirm">选择此项 <Icon name="arrow" size={16}/></span></button>;
 })}</div>{contract&&<button className="button contract-decline" onClick={()=>g.send({type:'chooseReward',token:reward.token,index:-1})}>放弃本次契约</button>}<small>战斗与全部规则计时已暂停</small></div>;
}
