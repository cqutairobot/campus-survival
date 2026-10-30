import type {EnemyKind,EventId,UltimateId,VisualEvent,WeaponKind} from '../types';
import {assetUrl} from '../assets/manifest';

export const MATERIALS=['paper','key','metal','glass','brick','liquid','energy'] as const;
export type AudioMaterial=typeof MATERIALS[number];
export const MUSIC_THEMES=['menu','normal','elite','boss','result'] as const;
export type MusicTheme=typeof MUSIC_THEMES[number];
export const normalizeTheme=(theme:string):MusicTheme=>theme==='late'?'elite':MUSIC_THEMES.includes(theme as MusicTheme)?theme as MusicTheme:'normal';
export const audioSources=(id:string)=>[assetUrl(`assets/audio/v4/${id}.ogg`),assetUrl(`assets/audio/v4/${id}.mp3`)];

/** Exhaustive presentation tables: adding gameplay content cannot silently omit its sound. */
export const WEAPON_MATERIALS={
 knife:'paper',orbit:'paper',coffee:'liquid',code:'energy',laser:'energy',ppt:'paper',bot:'energy',keyboard:'key',rain:'paper',wifi:'energy',lightning:'energy',mentor:'paper',staple:'metal',mine:'metal',eraser:'paper',broadcast:'metal',ruler:'metal',blueprint:'metal',shuttle:'paper',prism:'glass',cryo:'glass',brick:'brick',
 sword:'metal',hub:'energy',binder:'metal',sky:'glass',icefire:'liquid',demolition:'brick',
} as const satisfies Record<WeaponKind,AudioMaterial>;
export const ENEMY_MATERIALS={
 homework:'paper',checkin:'metal',ppt:'paper',review:'paper',receipt:'paper',ddl:'metal',advisor:'metal',proposal:'paper',defense:'paper',finals:'paper',math:'key',english:'key',coding:'energy',mechanics:'metal',thrower:'paper',charger:'metal',splitter:'paper',bomber:'glass',summoner:'energy',guard:'metal',leader:'paper',inspector:'glass',teamlead:'metal',node:'glass',examCharger:'metal',
} as const satisfies Record<EnemyKind,AudioMaterial>;
export const ULTIMATE_MATERIALS={submission:'paper',lastMinute:'glass',parallel:'energy',conference:'energy',barrier:'brick',overload:'glass'} as const satisfies Record<UltimateId,AudioMaterial>;
export const ENVIRONMENT_SAMPLES={portal:'event-portal',advisor:'event-advisor',blackout:'event-blackout',examRage:'event-examRage',sports:'event-sports',rainstorm:'event-rainstorm'} as const satisfies Record<EventId,string>;
export const UI_SAMPLES=['ui-hover','ui-press','ui-confirm','ui-cancel','ui-tab','ui-disabled','ui-reveal','ui-rarity-common','ui-rarity-rare','ui-rarity-epic','ui-rarity-legendary','ui-chest-latch','ui-chest-open','ui-talent-upgrade','ui-achievement','pickup','level','hurt','boss','evolution','chest','critical'];
export const COMBAT_SAMPLES=[
 ...MATERIALS.flatMap(material=>[...Array.from({length:4},(_,n)=>`hit-${material}-${n}`),...Array.from({length:2},(_,n)=>`death-${material}-${n}`),...Array.from({length:2},(_,n)=>`shot-${material}-${n}`)]),
 ...['sword','hub','binder','sky','icefire','demolition'].map(id=>'fusion-'+id),
 ...Object.keys(ULTIMATE_MATERIALS).map(id=>'ultimate-'+id),...Object.values(ENVIRONMENT_SAMPLES),'event-end','rain-ambience','shield-break','charged','frenzy','clear','combo','block',
];

const fragmentMaterial=(material:VisualEvent['material']):AudioMaterial|undefined=>material==='ice'||material==='glass'?'glass':material==='code'||material==='spark'?'energy':material==='blueprint'?'paper':material==='smoke'?undefined:material;
export function eventMaterial(event:VisualEvent):AudioMaterial{
 // A dying shield retains its material even when coffee or a laser dealt the last hit.
 if(event.type==='death'&&event.enemyKind)return ENEMY_MATERIALS[event.enemyKind];
 if(event.type==='shot')return event.weapon?WEAPON_MATERIALS[event.weapon]:event.ultimate?ULTIMATE_MATERIALS[event.ultimate]:'paper';
 return fragmentMaterial(event.material)??(event.enemyKind?ENEMY_MATERIALS[event.enemyKind]:event.weapon?WEAPON_MATERIALS[event.weapon]:event.ultimate?ULTIMATE_MATERIALS[event.ultimate]:'paper');
}
/** Stable color for each weapon; random variation never consumes the simulation RNG. */
export function weaponVoice(weapon?:WeaponKind,evolved=false){
 const index=weapon?Object.keys(WEAPON_MATERIALS).indexOf(weapon):0;
 return{rate:2**(((index%7)-3)*24/1200)*(evolved?.94:1),volume:evolved?.32:.24};
}
export function selectVariant(previous:number,count:number,random:number){
 if(count<=1)return 0;
 const bounded=Math.max(0,Math.min(.999999,random)),next=Math.floor(bounded*(count-1));
 return previous<0?Math.floor(bounded*count):next>=previous?next+1:next;
}
/** Pure selection makes decode/load failure behavior directly testable. */
export function sampleOrFallback<T>(sample:T|undefined,loaded:(sample:T)=>boolean,fallback:T|undefined){return sample&&loaded(sample)?sample:fallback;}

/** Presentation-only hysteresis prevents an elite at the viewport edge from restarting music. */
export class MusicThemeSelector {
 private current:MusicTheme='menu';private candidate:MusicTheme='menu';private since=0;
 resolve(theme:string,now:number,immediate=false):MusicTheme{
  const desired=normalizeTheme(theme);
  if(desired!==this.candidate){this.candidate=desired;this.since=now;}
  const wait=desired==='elite'?1.5:this.current==='elite'&&desired==='normal'?4:0;
  if(immediate||wait===0||now-this.since>=wait)this.current=desired;
  return this.current;
 }
}
