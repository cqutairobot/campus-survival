import type {Immutable,RuntimeOutcome} from '../runtime/contracts';
import type {S2RunSnapshot} from '../types';
import type {SemesterResult} from '../profile';
import type {LegacyContentDTO} from './legacy/rules-adapter';

type Mutable<T>=T extends object?{-readonly [K in keyof T]:Mutable<T[K]>}:T;
const clone=<T>(value:T)=>structuredClone(value) as Mutable<T>;
export interface SettlementIdentity {id:string;createdAt:number;nickname:string;practice?:boolean;debug?:boolean}
type Content=Pick<LegacyContentDTO,'assessmentRewardDone'|'kills'|'level'|'bosses'|'damage'|'weapons'|'passives'|'progress'|'bonusCredits'|'relics'>;
/** No result exists during assessmentReward. The runtime's completed outcome is
 * created only after the chest/presentation gate has accepted its token. */
export function semesterTwoResult(snapshot:Immutable<S2RunSnapshot>,outcome:Immutable<RuntimeOutcome>|null,content:Immutable<Content>,identity:SettlementIdentity):SemesterResult|null {
 if(!outcome)return null;
 const finalRewardCommitted=outcome.reason==='completed'&&outcome.assessmentsPassed===3&&outcome.completedWeeks===24&&content.assessmentRewardDone;
 const victory=outcome.victory&&finalRewardCommitted,averageCurse=0;
 const result:SemesterResult={semesterId:'s2',id:identity.id,victory,week:outcome.week,completedWeeks:outcome.completedWeeks,kills:content.kills,level:content.level,bosses:outcome.assessmentsPassed,seconds:outcome.seconds,credits:snapshot.mode==='daily'||identity.practice||identity.debug?0:Math.floor(Math.floor(outcome.completedWeeks*1.5)+Math.floor(content.progress.normalKills/250)+outcome.assessmentsPassed*10+(victory?30:0)+content.bonusCredits),damage:{...content.damage},weapons:clone(content.weapons),passives:clone(content.passives),debug:!!identity.debug,practice:!!identity.practice,manifest:clone(snapshot),progress:clone(content.progress),averageCurse,settlement:{eligible:snapshot.eligible,assessmentsPassed:outcome.assessmentsPassed,finalRewardCommitted}};
 if(snapshot.mode==='daily'&&!identity.practice&&!identity.debug){
  const base=outcome.completedWeeks*1000+content.progress.normalKills*4+content.progress.elites*600+content.progress.miniBosses*3000+outcome.assessmentsPassed*5000+(victory?20000:0),time=victory?Math.max(0,1500-outcome.seconds)*20:0;
  result.dailyRecord={semesterId:'s2',id:identity.id,date:snapshot.date!,version:snapshot.rulesVersion,rule:snapshot.dailyRule!,character:snapshot.character,nickname:identity.nickname,score:Math.floor((base+time)*(1+.05*averageCurse)),victory,completedWeeks:outcome.completedWeeks,seconds:Math.min(1500,outcome.seconds),build:[...content.weapons,...content.passives].map(w=>w.id),relics:[...content.relics],averageCurse,createdAt:identity.createdAt};
 }
 return result;
}
