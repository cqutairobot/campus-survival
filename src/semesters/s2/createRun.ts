import {SemesterEngine} from '../runtime/SemesterEngine';
import type {SemesterView} from '../runtime/contracts';
import type {S2RunSnapshot} from '../types';
import {semesterTwoResult,type SettlementIdentity} from './settlement';
import type {SemesterResult} from '../profile';
import {S2_RUNTIME_CONFIG} from './config';
import type {ContentCatalog} from './legacy/catalog';
import {S2_CONTENT} from './content';
import {legacyContentRules,type LegacyContentDTO} from './legacy/rules-adapter';
import {createS2WorldSnapshot,type WorldSnapshot} from './world';

/** Internal composition point only. The semester registry keeps S2 closed. */
export function createSemesterTwoRun(snapshot:S2RunSnapshot,view:SemesterView<LegacyContentDTO>,content:ContentCatalog=S2_CONTENT,world:WorldSnapshot=createS2WorldSnapshot(snapshot.regions),settlement?:SettlementIdentity&{commit:(result:SemesterResult)=>void}){
 let committed=false;
 const output:SemesterView<LegacyContentDTO>={publish(run,alpha){if(settlement&&!committed&&run.result){const result=semesterTwoResult(snapshot,run.result,run.content,settlement);if(result){settlement.commit(result);committed=true;}}view.publish(run,alpha);},dispose:()=>view.dispose?.()};
 return new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,rules:legacyContentRules(content,world),view:output});
}
