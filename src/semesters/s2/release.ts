import {SEMESTERS} from '../registry';
import {S2_RATING_VERSION} from './rating';
import {S2_DAILY_VERSION} from './daily';
/** First S2 rule freeze. Historical records keep their original identities;
 * this metadata neither backfills old ratings nor opens the runtime route. */
export const S2_RELEASE_VERSIONS=Object.freeze({release:'v5.0.0-local',catalog:'5.0.0',rules:SEMESTERS.s2.rulesVersion,world:SEMESTERS.s2.worldVersion,score:'score-s2-v1',rating:S2_RATING_VERSION,daily:S2_DAILY_VERSION,inheritance:'carry-v1',saveSchema:4,art:'s2-art-v1',audio:'s2-audio-v1',font:'font-s2-v1'});
