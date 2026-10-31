import type {AchievementState,DailyRecord,RunResult,SaveData} from '../types';
import type {InheritanceChoice} from './types';

export const PRODUCT_VERSION='5.0.0';
export type SemesterId='s1'|'s2';
export interface Graduation {source:'legacyWins'|'legacyAchievement'|'normalRun';runId?:string}
export interface Rating {grade:'S'|'A'|'B'|'C';value:number;ratingVersion:string;rulesVersion:string;semesterId:SemesterId;runId:string}
export interface RunSummary {id:string;semesterId:SemesterId;rulesVersion:string;victory:boolean;week:number;seconds:number;build:string[];rating:Rating|null}
export interface SemesterHistory {graduation:Graduation|null;bestRating:Rating|null;recentRuns:RunSummary[]}
export interface SemesterDailyRecord extends DailyRecord {semesterId:SemesterId}
/** Root wallet, characters, talents, settings, dedup IDs and collections are shared.
 * Root unlocks/achievements/stats describe S1 only. Never write S2 weeks into them. */
export interface SaveProfile extends Omit<SaveData,'schemaVersion'|'daily'> {
 schemaVersion:4;
 selectedSemester:SemesterId;
 semesters:{s1:SemesterHistory;s2:SemesterHistory&{unlocks:SaveData['unlocks'];achievements:Record<string,AchievementState>;stats:SaveData['stats']}};
 inheritance:{version:'carry-v1';alumniEligible:boolean;choice:InheritanceChoice};
 daily:{records:SemesterDailyRecord[];attempts:Record<string,number>;completedKeys:string[]};
 migration:{fromSchema:number;fromContentVersion:string;legacyDigest:string|null};
}
/** S2 result carries the run qualification and final reward receipt. */
export interface SemesterResult extends Omit<RunResult,'weapons'|'passives'|'dailyRecord'> {
 semesterId:'s2';settlement:{eligible:boolean;assessmentsPassed:number;finalRewardCommitted:boolean};practice?:boolean;weapons:{id:string}[];passives:{id:string}[];dailyRecord?:SemesterDailyRecord;
}
