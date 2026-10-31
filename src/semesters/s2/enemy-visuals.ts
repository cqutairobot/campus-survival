import {ENEMY_MATERIALS} from '../../presentation/materials';
import type {EnemyKind,FragmentMaterial,VisualEvent} from '../../types';
import type {ContentWeaponId} from './types';

/** Shared feedback consumes rank/material; the S2 scene retains the full ID. */
export type ContentVisualEvent=Omit<VisualEvent,'weapon'>&{weapon?:ContentWeaponId;contentEnemyId?:string};
/** Reuse existing sound, camera and particle profiles at the S2 boundary. */
export function legacyFeedbackEvent(event:ContentVisualEvent):VisualEvent{return{...event,weapon:event.weapon==='s2:drone'?'bot':event.weapon==='s2:whiteboard'?'prism':event.weapon==='s2:spool'?'lightning':event.weapon==='s2:printer'?'staple':event.weapon};}
const materials:Readonly<Record<string,FragmentMaterial>>={...ENEMY_MATERIALS,'s2:bike':'metal','s2:reservation':'glass','s2:parceler':'paper','s2:dispatcher':'metal','s2:proposalBoard':'metal'};
export function enemyVisual(id:string){return{contentEnemyId:id,enemyKind:id in ENEMY_MATERIALS?id as EnemyKind:undefined,material:materials[id]??'paper'};}
