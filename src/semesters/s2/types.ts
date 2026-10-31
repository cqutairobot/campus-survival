import type {BaseWeaponId,FusionId,DamageSource,PassiveDef,PassiveId,Skill,WeaponDef,WeaponKind} from '../../types';

/** S2 owns its additions; the frozen S1 unions and definitions stay unchanged. */
export type ContentBaseWeaponId=BaseWeaponId|'s2:drone'|'s2:whiteboard'|'s2:spool'|'s2:printer';
export type ContentFusionId=FusionId|'s2:fieldHub'|'s2:holoReview'|'s2:digitalTwin';
export type ContentWeaponId=WeaponKind|ContentBaseWeaponId|ContentFusionId;
export interface WeaponIdentity {id:ContentWeaponId;instanceId:number;generation:number}
export type ContentPassiveId=PassiveId|'s2:protocol'|'s2:battery'|'s2:harness'|'s2:echoChip';
export type ContentSkill=Omit<Skill,'id'|'components'>&{id:ContentWeaponId|ContentPassiveId;components?:[ContentBaseWeaponId,ContentBaseWeaponId]};
export type ContentPassiveDef=Omit<PassiveDef,'id'>&{id:ContentPassiveId};
export type ContentWeaponDef=Omit<WeaponDef,'id'|'evolution'|'components'>&{
 components?:[ContentBaseWeaponId,ContentBaseWeaponId];secondaryDamage?:number;syncInterval?:number;
 id:ContentWeaponId;
 markDamage?:number[];placementInterval?:number[];lineLength?:number[];hitDelay?:number[];sequenceDelay?:number[];retargetInterval?:number[];
 evolution:Omit<WeaponDef['evolution'],'passive'>&{passive:ContentPassiveId;markDamage?:number;placementInterval?:number;lineLength?:number;hitDelay?:number;sequenceDelay?:number;retargetInterval?:number;syncInterval?:number};
};
export type ContentDamageSource=Exclude<DamageSource,{kind:'weapon'}>|{kind:'weapon';id:ContentWeaponId};

export interface ContentFusionDef extends ContentWeaponDef {id:ContentFusionId;fusion:true;components:[ContentBaseWeaponId,ContentBaseWeaponId]}
