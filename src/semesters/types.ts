import type {RunManifest} from '../types';
import type {SemesterId} from './profile';

export type InheritanceChoice={id:'supply'}|{id:'notes'}|{id:'topic';weaponId:string};
export interface Discovery {category:'item'|'evolution'|'enemy'|'fusion'|'relic'|'event'|'region';id:string;semesterId:SemesterId;evidence:'run'|'debug'}
export type InheritanceSnapshot=
 | {version:'carry-v1';id:'supply';shield:15;durationSeconds:60}
 | {version:'carry-v1';id:'notes';xpMultiplier:1.08;durationSeconds:120}
 | {version:'carry-v1';id:'topic';weapon:{id:string;level:1;rarity:0;evolved:false}};
export interface SemesterMetadata {
 id:SemesterId;name:string;contentVersion:string;rulesVersion:string;dailyRulesVersion:string;worldVersion:string;
 calendar:{weeks:number;weekSeconds:40;bossWeeks:readonly number[];miniBossWeeks:readonly number[];dailyLimitSeconds:number};
 runtimeAvailable:boolean;
}
interface RunSnapshot {
 readonly semesterId:SemesterId;readonly contentVersion:string;readonly rulesVersion:string;readonly worldVersion:string;
 readonly mode:'normal'|'daily';readonly seed:number;readonly character:string;readonly talents:Record<string,number>;
 readonly weapons:string[];readonly passives:string[];readonly regions:string[];
 readonly initialWeapon:{id:string;level:1;rarity:0;evolved:false};readonly inheritance:InheritanceSnapshot|null;
 readonly eligible:boolean;readonly date?:string;readonly dailyRule?:string;
}
export interface S1RunSnapshot extends RunSnapshot {readonly semesterId:'s1';readonly legacy:RunManifest;readonly inheritance:null}
export interface S2RunSnapshot extends RunSnapshot {readonly semesterId:'s2';readonly inheritance:InheritanceSnapshot}
/** Clone before freezing: caller-owned profile/options remain editable and unmodified. */
export function immutableSnapshot<T>(value:T):T{
 const freeze=(v:unknown)=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){for(const child of Object.values(v))freeze(child);Object.freeze(v);}};
 const out=structuredClone(value);freeze(out);return out;
}
