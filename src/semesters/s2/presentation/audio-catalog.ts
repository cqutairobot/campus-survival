import manifest from './audio-manifest.json';
import {assetUrl} from '../../../assets/manifest';
import {S2_IDS} from '../../catalog-ids';
export const S2_AUDIO_MANIFEST=manifest;
export type S2Sound=keyof typeof manifest;
export const semesterAudioSources=(id:S2Sound)=>['ogg','mp3'].map(ext=>assetUrl(`${manifest[id].path}.${ext}`));
type Cue={hit:S2Sound;death:S2Sound;warning:S2Sound};
const mechanical:Cue={hit:'shot-s2-printer',death:'fusion-s2-digitalTwin',warning:'warning-s2-line'},electronic:Cue={hit:'shot-s2-drone',death:'fusion-s2-fieldHub',warning:'warning-s2-scan'},paper:Cue={hit:'shot-s2-whiteboard',death:'fusion-s2-holoReview',warning:'warning-s2-reservation'};
export const S2_ENEMY_CUES={
 's2:bike':mechanical,'s2:reservation':electronic,'s2:parceler':paper,'s2:peer':paper,'s2:relay':electronic,'s2:recycler':mechanical,'s2:marshal':paper,'s2:coordinator':electronic,'s2:dispatcher':mechanical,'s2:auditor':mechanical,'s2:proposalBoard':paper,'s2:projectReview':electronic,'s2:expoFinal':electronic,'s2:relayNode':electronic,'s2:reviewPanel':electronic,
} as const satisfies Record<typeof S2_IDS.enemies[number],Cue>;
export const S2_WEAPON_CUES={
 's2:drone':'shot-s2-drone','s2:drone:evolved':'shot-s2-drone','s2:whiteboard':'shot-s2-whiteboard','s2:whiteboard:evolved':'shot-s2-whiteboard','s2:spool':'shot-s2-spool','s2:spool:evolved':'shot-s2-spool','s2:printer':'shot-s2-printer','s2:printer:evolved':'shot-s2-printer',
 's2:fieldHub':'fusion-s2-fieldHub','s2:holoReview':'fusion-s2-holoReview','s2:digitalTwin':'fusion-s2-digitalTwin',
} as const satisfies Record<typeof S2_IDS.weapons[number]|`${typeof S2_IDS.weapons[number]}:evolved`|typeof S2_IDS.fusions[number],S2Sound>;
export const S2_PASSIVE_CUES={'s2:battery':'shot-s2-drone','s2:protocol':'contract-s2-project','s2:harness':'contract-s2-amendment','s2:echoChip':'shot-s2-spool'} as const satisfies Record<typeof S2_IDS.passives[number],S2Sound>;
export const S2_RELIC_CUES={'s2:routePermit':'warning-s2-line','s2:bufferBadge':'contract-s2-project','s2:reviewSeal':'warning-s2-reservation','s2:projectGrant':'contract-s2-project'} as const satisfies Record<typeof S2_IDS.relics[number],S2Sound>;
export const S2_EVENT_CUES={'s2:deliveryDay':'event-s2-deliveryDay','s2:networkMaintenance':'event-s2-networkMaintenance','s2:jointExhibit':'event-s2-jointExhibit','s2:openLab':'event-s2-openLab'} as const satisfies Record<typeof S2_IDS.events[number],S2Sound>;
export const S2_INTERACTION_CUES={'s2:jointTable':'contract-s2-project','s2:amendmentTable':'contract-s2-amendment','s2:infirmary':'contract-s2-project','s2:revision':'contract-s2-amendment'} as const satisfies Record<typeof S2_IDS.interactions[number],S2Sound>;
export const S2_WARNING_CUES={line:'warning-s2-line',reservation:'warning-s2-reservation',scan:'warning-s2-scan'} as const satisfies Record<string,S2Sound>;
export const S2_BOSS_STAGE_CUES={1:'warning-s2-line',2:'warning-s2-scan',3:'warning-s2-reservation'} as const satisfies Record<number,S2Sound>;
export const S2_AMBIENCE_CUES={'s2:jointLab':'ambience-s2-lab','s2:exhibitHall':'ambience-s2-exhibit'} as const satisfies Record<string,S2Sound>;
export const S2_SOUND_IDS=Object.keys(manifest) as S2Sound[];
export function semesterAudioIds(week:number,player:{x:number;y:number}){
 const second=week>=8||Math.hypot(player.x-5000,player.y-4480)<1400,third=week>=16||Math.hypot(player.x-1408,player.y-4800)<1400;
 return S2_SOUND_IDS.filter(id=>manifest[id].chapter===1||manifest[id].chapter===2&&second||manifest[id].chapter===3&&third);
}
