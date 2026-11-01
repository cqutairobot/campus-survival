import {freezeSnapshot} from '../../types';
import type {S2View} from '../adapter';
import type {Immutable} from '../../runtime/contracts';

/** The React HUD never subscribes to entity pools, world geometry or effects. */
export function projectHUD(view:S2View){
 const g=view.content,boss=g.bossEnemy;
 return freezeSnapshot({phase:view.phase,clock:view.clock,assessment:view.assessment,gate:view.gate,pause:view.pause,inheritance:view.inheritance,
  content:{phase:g.phase,player:{hp:g.player.hp,shield:g.player.shield},stats:{maxHp:g.stats.maxHp},chapter:g.chapter,
   level:g.level,xp:g.xp,xpNext:g.xpNext,kills:g.kills,weapons:g.weapons,passives:g.passives,relics:g.relics,event:g.event,notice:g.notice,ultimate:g.ultimate,ultimateStatus:g.ultimate.remaining>0?`持续 ${Math.ceil(g.ultimate.remaining)} 秒 · 冷却 ${Math.ceil(g.ultimate.cooldown)} 秒`:g.ultimate.cooldown>1e-6?`冷却 ${Math.ceil(g.ultimate.cooldown)} 秒`:g.ultimate.ready?'可以释放':`能量 ${Math.floor(g.ultimate.energy)}/240`,
   boss:boss<0?null:{id:g.enemies.kind[boss],hp:g.enemies.hp[boss],maxHp:g.enemies.maxHp[boss],stage:g.bossStage}}});
}
export type S2HUD=Immutable<ReturnType<typeof projectHUD>>;
/** Counters/clocks refresh at10Hz; phases, health, loadout and actionable changes
 * publish immediately. The fixed simulation and renderer still run at60Hz. */
export function hudUrgency(view:S2View){
 const g=view.content;
 return JSON.stringify([view.phase,view.gate,view.pause,g.phase,g.player.hp,g.player.shield,view.inheritance,g.stats.maxHp,g.level,g.weapons,g.passives,g.relics,g.ultimate.ready,g.bossEnemy,g.bossStage,g.event?.kind,g.notice]);
}
