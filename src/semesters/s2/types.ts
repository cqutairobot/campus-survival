import type {DamageSource,PassiveDef,PassiveId,Skill,WeaponDef,WeaponKind} from '../../types';

/** S2 owns its additions; the frozen S1 unions and definitions stay unchanged. */
export type ContentWeaponId=WeaponKind|'s2:drone'|'s2:whiteboard';
export type ContentPassiveId=PassiveId|'s2:protocol';
export type ContentSkill=Omit<Skill,'id'>&{id:ContentWeaponId|ContentPassiveId};
export type ContentPassiveDef=Omit<PassiveDef,'id'>&{id:ContentPassiveId};
export type ContentWeaponDef=Omit<WeaponDef,'id'|'evolution'>&{
 id:ContentWeaponId;
 lineLength?:number[];hitDelay?:number[];sequenceDelay?:number[];retargetInterval?:number[];
 evolution:Omit<WeaponDef['evolution'],'passive'>&{passive:ContentPassiveId;lineLength?:number;hitDelay?:number;sequenceDelay?:number;retargetInterval?:number;syncInterval?:number};
};
export type ContentDamageSource=Exclude<DamageSource,{kind:'weapon'}>|{kind:'weapon';id:ContentWeaponId};
