import type {WeaponKind,UltimateId,VisualEvent} from '../types';
interface WeaponFeel {weight:number;radius:number;particles:number}
const light={weight:.88,radius:.9,particles:.8},balanced={weight:1,radius:1,particles:1},heavy={weight:1.12,radius:1.15,particles:1.25};
/** Explicit coverage prevents new render/audio fallthroughs; these values never enter damage math. */
export const WEAPON_FEEDBACK:Record<WeaponKind,WeaponFeel>={
 knife:light,orbit:light,coffee:balanced,code:balanced,laser:heavy,ppt:balanced,bot:light,keyboard:light,rain:heavy,wifi:balanced,lightning:heavy,mentor:heavy,staple:light,mine:heavy,eraser:light,broadcast:balanced,ruler:heavy,blueprint:balanced,shuttle:balanced,prism:heavy,cryo:light,brick:heavy,
 sword:heavy,hub:heavy,binder:heavy,sky:heavy,icefire:heavy,demolition:heavy,
};
export const ULTIMATE_FEEDBACK:Record<UltimateId,WeaponFeel>={submission:heavy,lastMinute:heavy,parallel:balanced,conference:heavy,barrier:balanced,overload:heavy};
export function attackFeel(event:VisualEvent):WeaponFeel{
 const ultimate=event.ultimate??(event.sourceKey?.startsWith('ultimate:')?event.sourceKey.slice(9) as UltimateId:undefined);
 const feel=ultimate?ULTIMATE_FEEDBACK[ultimate]??balanced:event.weapon?WEAPON_FEEDBACK[event.weapon]:balanced;
 const boost=event.evolved?1.15:1;
 return {weight:feel.weight*boost,radius:feel.radius*boost,particles:feel.particles*boost};
}
