import type {DamageSource,PassiveDef,PassiveId,Skill,WeaponDef,WeaponKind} from '../../types';

/** S2 owns its additions; the frozen S1 unions and definitions stay unchanged. */
export type ContentWeaponId=WeaponKind|'s2:drone'|'s2:whiteboard'|'s2:spool'|'s2:printer';
export type ContentPassiveId=PassiveId|'s2:protocol'|'s2:battery'|'s2:harness'|'s2:echoChip';
export type ContentSkill=Omit<Skill,'id'>&{id:ContentWeaponId|ContentPassiveId};
export type ContentPassiveDef=Omit<PassiveDef,'id'>&{id:ContentPassiveId};
export type ContentWeaponDef=Omit<WeaponDef,'id'|'evolution'>&{
 id:ContentWeaponId;
 markDamage?:number[];placementInterval?:number[];lineLength?:number[];hitDelay?:number[];sequenceDelay?:number[];retargetInterval?:number[];
 evolution:Omit<WeaponDef['evolution'],'passive'>&{passive:ContentPassiveId;markDamage?:number;placementInterval?:number;lineLength?:number;hitDelay?:number;sequenceDelay?:number;retargetInterval?:number;syncInterval?:number};
};
export type ContentDamageSource=Exclude<DamageSource,{kind:'weapon'}>|{kind:'weapon';id:ContentWeaponId};
