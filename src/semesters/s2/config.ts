import {SEMESTERS} from '../registry';
import {immutableSnapshot} from '../types';
import type {SemesterRuntimeConfig} from '../runtime/contracts';

/** Timing only. Pressure curves, content and presentation arrive in later batches. */
const {contentVersion,rulesVersion,dailyRulesVersion,worldVersion,calendar}=SEMESTERS.s2;
export const S2_RUNTIME_CONFIG:SemesterRuntimeConfig=immutableSnapshot({id:'s2',contentVersion,rulesVersion,dailyRulesVersion,worldVersion,calendar});
