import {CHARACTERS,ENEMIES,PASSIVES,RARITY_MULTIPLIERS,WEAPONS} from '../../../data/catalog';
import {FUSIONS,type FusionDef} from '../../../data/fusions';
import {PICKUPS} from '../../../data/pickups';
import {ULTIMATES} from '../../../data/ultimates';
import {RELICS} from '../../../data/relics';
import {NORMAL_IDS,SPAWN_RATES,WAVE_WEIGHTS,WEEK_GROUP} from '../../../data/waves';
import {immutableSnapshot} from '../../types';
import type {Character,EnemyDef,EnemyBehaviorId} from '../../../types';
import type {ContentPassiveDef,ContentWeaponDef} from '../types';

/** S2 extends its own directory without widening the frozen S1 unions. */
export type ContentEnemyDef=Omit<EnemyDef,'id'|'behavior'>&{id:string;behavior:EnemyBehaviorId|'bike'|'reservation'|'parceler'|'dispatcher'|'proposalBoard'|'peer'|'relay'|'recycler'|'marshal'|'coordinator'|'auditor'};

/** The only legacy-definition import boundary. Cloning protects the S1 arrays;
 * every S2 lookup (including presentation) uses this injected directory. */
export interface ContentCatalog {
 readonly weapons:readonly ContentWeaponDef[];readonly passives:readonly ContentPassiveDef[];
 readonly fusions:readonly FusionDef[];readonly enemies:readonly ContentEnemyDef[];
 readonly characters:readonly Character[];readonly rarityMultipliers:readonly number[];
 readonly pickups:typeof PICKUPS;readonly ultimates:typeof ULTIMATES;readonly relics:typeof RELICS;
 readonly waves:{normalIds:readonly string[];rates:readonly number[];weights:typeof WAVE_WEIGHTS;groups:readonly number[]};
 readonly weaponById:Readonly<Record<string,ContentWeaponDef>>;readonly passiveById:Readonly<Record<string,ContentPassiveDef>>;
 readonly fusionById:Readonly<Record<string,FusionDef>>;readonly enemyById:Readonly<Record<string,ContentEnemyDef>>;
 readonly enemyIndex:Readonly<Record<string,number>>;
 readonly pickupById:Readonly<Record<string,typeof PICKUPS[number]>>;
 readonly ultimateById:Readonly<Record<string,typeof ULTIMATES[number]>>;
}
type Definitions=Pick<ContentCatalog,'weapons'|'passives'|'fusions'|'enemies'|'characters'|'rarityMultipliers'|'pickups'|'ultimates'|'relics'|'waves'>;
export function createContentCatalog(definitions:Definitions):ContentCatalog {
 const d=structuredClone(definitions),index=<T extends {id:string}>(items:readonly T[])=>Object.fromEntries(items.map(item=>[item.id,item]));
 // Preserve array order, including numeric enemy slots, exactly as supplied.
 return immutableSnapshot({...d,weaponById:index([...d.weapons,...d.fusions]),passiveById:index(d.passives),fusionById:index(d.fusions),enemyById:index(d.enemies),enemyIndex:Object.fromEntries(d.enemies.map((e,n)=>[e.id,n])),pickupById:index(d.pickups),ultimateById:index(d.ultimates)});
}
export const LEGACY_CONTENT=createContentCatalog({weapons:WEAPONS,passives:PASSIVES,fusions:FUSIONS,enemies:ENEMIES,characters:CHARACTERS,rarityMultipliers:RARITY_MULTIPLIERS,pickups:PICKUPS,ultimates:ULTIMATES,relics:RELICS,waves:{normalIds:NORMAL_IDS,rates:SPAWN_RATES,weights:WAVE_WEIGHTS,groups:WEEK_GROUP}});
