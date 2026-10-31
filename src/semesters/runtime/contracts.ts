import type {randomStreams} from '../../core/run';
import type {S2RunSnapshot,SemesterMetadata} from '../types';

export type Immutable<T> = T extends (...args:never[])=>unknown ? T : T extends object ? {readonly [K in keyof T]:Immutable<T[K]>} : T;
export type RuntimePhase='teaching'|'assessmentIntro'|'assessment'|'assessmentReward'|'finished';
export type PauseReason='manual'|'choice'|'reward'|'cinematic'|'loading';
export interface SemesterRuntimeConfig {
 readonly id:'s2';readonly contentVersion:string;readonly rulesVersion:string;readonly dailyRulesVersion:string;readonly worldVersion:string;
 readonly calendar:SemesterMetadata['calendar'];
}
export interface Assessment {index:number;week:number;final:boolean}
export interface RuntimeClock {tick:number;combatSeconds:number;teachingSeconds:number;assessmentSeconds:number;week:number;completedWeeks:number}
export interface InheritanceView {id:S2RunSnapshot['inheritance']['id'];shield:number;xpMultiplier:number}
export interface RuntimeServices {
 /** Created once per run. Only simulation rules receive these eight streams. */
 readonly snapshot:Immutable<S2RunSnapshot>;
 readonly streams:ReturnType<typeof randomStreams>;
}
export interface RuntimeGrants {
 /** Apply at the damage/XP grant boundary, once per grant. These never regrant spent shields. */
 readonly damageAfterInheritance:(amount:number)=>number;
 readonly experienceAfterInheritance:(amount:number)=>number;
}
export interface AssessmentServices extends RuntimeServices,RuntimeGrants {}
export interface RuntimeStep extends AssessmentServices {
 readonly dt:number;readonly clock:Immutable<RuntimeClock>;readonly phase:'teaching'|'assessment';
 readonly assessment:Immutable<Assessment>|null;readonly ordinarySpawnsAllowed:boolean;
}
export interface StepOutcome {defeated?:boolean;assessmentCleared?:boolean;pause?:PauseReason}
export interface CommandOutcome {accepted:boolean;pause?:PauseReason;resume?:boolean}
export interface AssessmentEvent {stage:'prepare'|'start'|'passed';assessment:Immutable<Assessment>;clock:Immutable<RuntimeClock>}
export interface SemesterRules<State,Content> {
 /** Initialize exactly one initial weapon from snapshot.initialWeapon, including topic replacement. */
 create(services:RuntimeServices):State;
 step(state:State,step:RuntimeStep):StepOutcome|void;
 /** prepare must end any mini-boss and clear ordinary threats before the paused intro.
  * start spawns the assessment; passed cleans up and prepares its reward, once. */
 assessment(state:State,event:AssessmentEvent,services:AssessmentServices):void;
 /** Export plain content DTOs inside the simulation boundary. */
 project(state:State):Content;
 /** Elective encounters keep combat/daily clocks running while teaching waits. */
 teachingPaused?(state:State):boolean;
 /** Content choices must also work while simulation is suspended. */
 command?(state:State,command:unknown,services:RuntimeServices):CommandOutcome;
 /** A runtime gate cannot skip a content reward or its presentation. */
 canAcknowledge?(state:State,kind:'assessmentIntro'|'assessmentReward'):boolean;
 canResume?(state:State,reason:PauseReason):boolean;
 dispose?(state:State):void;
}
export interface RuntimeOutcome {
 semesterId:'s2';mode:'normal'|'daily';victory:boolean;reason:'completed'|'defeated'|'timeout'|'abandoned';
 week:number;completedWeeks:number;seconds:number;assessmentsPassed:number;teachingSeconds?:number;
}
export interface SemesterRunView<Content> {
 semesterId:'s2';phase:RuntimePhase;clock:RuntimeClock;calendar:SemesterMetadata['calendar'];
 assessment:Assessment|null;assessmentsPassed:number;
 gate:{kind:'assessmentIntro'|'assessmentReward';token:number}|null;
 pause:{reason:PauseReason;token:number}|null;
 inheritance:InheritanceView;result:RuntimeOutcome|null;content:Content;
}
export interface SemesterView<Content> {
 /** The engine clones/freezes DTOs before publishing. Presentation receives
  * neither live state, effect functions nor simulation RNG. */
 publish(view:Immutable<SemesterRunView<Content>>,interpolation:number):void;
 dispose?():void;
}
