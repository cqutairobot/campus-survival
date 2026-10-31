import {SEMESTERS} from '../registry';
import {immutableSnapshot} from '../types';
import type {SemesterRuntimeConfig} from '../runtime/contracts';

/** Calendar only. Content is injected separately; S2 pressure arrives in P06. */
const {contentVersion,rulesVersion,dailyRulesVersion,worldVersion,calendar}=SEMESTERS.s2;
export const S2_RUNTIME_CONFIG:SemesterRuntimeConfig=immutableSnapshot({id:'s2',contentVersion,rulesVersion,dailyRulesVersion,worldVersion,calendar});
