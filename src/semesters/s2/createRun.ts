import {SemesterEngine} from '../runtime/SemesterEngine';
import type {SemesterView} from '../runtime/contracts';
import type {S2RunSnapshot} from '../types';
import {S2_RUNTIME_CONFIG} from './config';
import {LEGACY_CONTENT,type ContentCatalog} from './legacy/catalog';
import {legacyContentRules,type LegacyContentDTO} from './legacy/rules-adapter';
import {createS2WorldSnapshot,type WorldSnapshot} from './world';

/** Internal composition point only. The semester registry keeps S2 closed. */
export function createSemesterTwoRun(snapshot:S2RunSnapshot,view:SemesterView<LegacyContentDTO>,content:ContentCatalog=LEGACY_CONTENT,world:WorldSnapshot=createS2WorldSnapshot(snapshot.regions)){
 return new SemesterEngine({snapshot,config:S2_RUNTIME_CONFIG,rules:legacyContentRules(content,world),view});
}
