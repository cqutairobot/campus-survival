export type Rarity = 0 | 1 | 2 | 3;
export type Quality = 'auto' | 'high' | 'medium' | 'low';
export type Phase = 'menu' | 'playing' | 'draft' | 'reward' | 'contract' | 'chest' | 'evolution' | 'bossIntro' | 'bossDeath' | 'paused' | 'result';
export type BaseWeaponId = 'knife' | 'orbit' | 'coffee' | 'code' | 'laser' | 'ppt' | 'bot' | 'keyboard' | 'rain' | 'wifi' | 'lightning' | 'mentor' | 'staple' | 'mine' | 'eraser' | 'broadcast' | 'ruler' | 'blueprint' | 'shuttle' | 'prism' | 'cryo' | 'brick';
export type FusionId = 'sword' | 'hub' | 'binder' | 'sky' | 'icefire' | 'demolition';
export type WeaponKind = BaseWeaponId | FusionId;
export type PassiveId = 'speed' | 'night' | 'haste' | 'xp' | 'regen' | 'multi' | 'calm' | 'area' | 'luck' | 'health' | 'push' | 'duration' | 'armor' | 'magnetism' | 'focus' | 'thesis';
export interface WeaponDef {
  id: WeaponKind; name: string; icon: string; color: string; description: string; tag: string;
  damage: number[]; interval: number[]; count: number[]; range: number[];
  forms: string[]; pierce?:number[]; width?:number[]; spread?:number[]; explosion?:number[]; duration?:number[];
  fusion?:boolean; components?:[BaseWeaponId,BaseWeaponId];
  evolution: { name: string; passive: PassiveId; description: string; damage: number; interval: number; count: number; range: number; pierce?:number; width?:number; spread?:number; explosion?:number; duration?:number };
}
export interface PassiveDef { id: PassiveId; name: string; icon: string; color: string; description: string; values: number[]; unit: string }
export interface Skill { id: WeaponKind | PassiveId; level: number; rarity: Rarity; evolved: boolean; instanceId?:number; kind?:'base'|'fusion'; components?:[BaseWeaponId,BaseWeaponId] }
export type WeaponInstance = (Skill & {kind:'base';id:BaseWeaponId;instanceId:number}) | (Skill & {kind:'fusion';id:FusionId;instanceId:number;components:[BaseWeaponId,BaseWeaponId]});
export interface DraftCard { id: string; type: 'weapon' | 'passive' | 'heal' | 'shield' | 'credit'; rarity: Rarity; nextLevel: number }
export interface Character { id: string; name: string; subtitle: string; icon: string; color: string; weapon: BaseWeaponId; hp: number; crit: number; area: number; summon: number; cost: number; description: string; armor?:number;duration?:number;achievement?:string }
export interface Talent { id: string; name: string; icon: string; description: string; parent?: string }
export interface Settings { settingsVersion:4;master: number; music: number; sfx: number; uiSfx:number;muted: boolean; quality: Quality; shake: number; flash: number; motion: boolean; damageNumbers: boolean; afterimages:boolean; haptics:boolean;quickChest:boolean;nickname:string;hitStop:number;zoomEffects:boolean;distortion:boolean;dynamicMusic:boolean;musicDucking:boolean;audioPreset:'auto'|'full'|'phone' }
export interface AchievementState {progress:number;completed:boolean;claimed:boolean}
export type PersistenceState='new'|'ready'|'fallback'|'corrupt'|'future'|'unavailable'|'failed'|'starting'|'observer'|'conflict'|'unsupported';
export interface SaveOperation {kind:'saved'|'memory'|'invalid'|'failed';message:string}
export interface PersistenceMetadata {revision:number;ownerId:string;epoch:number}
export interface DailyRecord {id:string;date:string;version:string;rule:string;character:string;nickname:string;score:number;victory:boolean;completedWeeks:number;seconds:number;build:string[];relics:string[];averageCurse:number;createdAt:number}
export interface SaveData {
  persistence?:PersistenceMetadata;
  schemaVersion: 3; contentVersion: string; credits: number; unlocked: string[]; selected: string;
  talents: Record<string, number>; discovered: string[]; evolutions: string[]; settledRuns: string[];
  unlocks:{weapons:string[];passives:string[];regions:string[]};achievements:Record<string,AchievementState>;
  discoveredEnemies:string[];fusions:string[];relics:string[];events:string[];regions:string[];
  daily:{records:DailyRecord[];attempts:Record<string,number>;completedDates:string[]};
  settings: Settings; stats: { runs: number; wins: number; kills: number; bestWeek: number;elites:number;miniBosses:number;shieldKills:number;frozen:number;visits:string[] };
}
export interface PlayerStats { maxHp: number; speed: number; damage: number; haste: number; area: number; crit: number; xp: number; regen: number; multi: number; summon: number; invulnerability: number; magnet: number; luck: number; push: number; duration: number; drain: number;armor:number;charge:number;critDamage:number;nonSummon:number }
export interface Player { x: number; y: number; prevX: number; prevY: number; vx: number; vy: number; facing: number; hp: number; shield: number; shieldTime: number; invincible: number; lastHurt: number }
export type EnemyKind = 'homework' | 'checkin' | 'ppt' | 'review' | 'receipt' | 'ddl' | 'advisor' | 'proposal' | 'defense' | 'finals' | 'math' | 'english' | 'coding' | 'mechanics' | 'thrower' | 'charger' | 'splitter' | 'bomber' | 'summoner' | 'guard' | 'leader' | 'inspector' | 'teamlead' | 'node' | 'examCharger';
export type EnemyRank = 'normal'|'elite'|'miniBoss'|'boss'|'bossAdd';
export type EnemyBehaviorId='chase'|'snake'|'flank'|'ranged'|'heavy'|'charge'|'advisor'|'boss'|'exam'|'thrower'|'split'|'bomber'|'summon'|'shield'|'aura'|'inspector'|'teamlead'|'node';
export type EnemyTag='heavy'|'ranged'|'support'|'summoned'|'exam'|'shield'|'split';
export interface EnemyDef { id: EnemyKind; rank:EnemyRank;behavior:EnemyBehaviorId;tags:EnemyTag[];name: string; hp: number; speed: number; damage: number; xp: number; radius: number; color: string; from: number }
export type PickupId = 'heal'|'magnet'|'bomb'|'freeze'|'shield'|'coffeeBoost'|'energy';
export type DropKind = 'xp' | PickupId | 'chest';
export type UltimateId = 'submission'|'lastMinute'|'parallel'|'conference'|'barrier'|'overload';
export type DamageSource = {kind:'weapon';id:WeaponKind}|{kind:'ultimate';id:UltimateId}|{kind:'pickup';id:PickupId}|{kind:'environment';id:string};
export type EventId='portal'|'advisor'|'blackout'|'examRage'|'sports'|'rainstorm';
export interface RunManifest {mode:'normal'|'daily';seed:number;rulesVersion:string;character:string;talents:Record<string,number>;weapons:string[];passives:string[];regions:string[];date?:string;dailyRule?:string}
export interface RunProgress {normalKills:number;elites:number;miniBosses:number;bossIds:string[];shieldKills:number;frozen:number;visited:string[];events:string[];enemies:string[];fusions:string[];relics:string[];evolutions:number;architect:boolean}
export interface RunResult { id: string; victory: boolean; week: number; completedWeeks: number; kills: number; level: number; bosses: number; seconds: number; credits: number; damage: Record<string, number>; weapons: Skill[]; passives: Skill[]; debug: boolean;manifest?:RunManifest;progress?:RunProgress;averageCurse?:number;dailyRecord?:DailyRecord }
export type FragmentMaterial='spark'|'paper'|'key'|'code'|'smoke'|'ice'|'glass'|'metal'|'blueprint'|'brick';
export interface VisualEvent { slot?:number;generation?:number;enemyKind?:EnemyKind;rank?:EnemyRank;batch?:number;damageType?:'normal'|'shield'|'dot'|'hurt'|'heal';sourceKey?:string;pan?:number; type: 'hit' | 'death' | 'shot' | 'ring' | 'beam' | 'arc' | 'lightning' | 'rain' | 'level' | 'pickup' | 'evolution' | 'boss' | 'hurt' | 'warning' | 'signature' | 'block' | 'combo' | 'frenzy' | 'clear' | 'chain'|'ultimate'|'fusion'|'shieldBreak'|'charged'; x: number; y: number; color: number; size: number; value?: number; angle?: number; x2?: number; y2?: number; critical?: boolean; text?: string; duration?: number; weapon?:WeaponKind; ultimate?:UltimateId; level?:number; evolved?:boolean; material?:FragmentMaterial; priority?:boolean }
export interface Hazard { id: number; kind: 'circle' | 'line' | 'ring'; x: number; y: number; x2: number; y2: number; radius: number; warning: number; life: number; damage: number; hit: boolean; safeAngle?: number; angularSpeed?:number;frozen?:number;owner?:number;ownerGeneration?:number;cancelOnDeath?:boolean;ordinary?:boolean }
export interface GameEvent { kind: EventId; remaining: number; x: number; y: number; x2: number; y2: number; cooldown: number;warning:number }
export interface RewardOption {id:string;kind:'upgrade'|'evolution'|'fusion'|'relic';title:string;description:string}
export interface HUD {
  phase: Phase; hp: number; maxHp: number; shield: number; xp: number; xpNext: number; level: number; kills: number;
  week: number; semesterTime: number; combatTime: number; bossTime: number; bosses: number;
  weapons: Skill[]; passives: Skill[]; cards: DraftCard[]; chest: { names: string[]; evolvedId?: string;fusionId?:string } | null;
  boss: { name: string; hp: number; maxHp: number; stage: number } | null; zone: string; event: string;
  fps: number; p95: number; entities: number; projectiles: number; drops: number; quality: string;
  notice: string; result: RunResult | null;
  combo:number;peakCombo:number;comboTier:number;frenzy:{charge:number;remaining:number;cooldown:number};
  ultimate:{id:UltimateId;name:string;energy:number;cooldown:number;remaining:number;ready:boolean};
  reward:{token:number;options:RewardOption[]}|null;relics:string[];interaction:{name:string;progress:number;locked?:string}|null;manifest:RunManifest|null;score:number;eligible:boolean;directions:{name:string;angle:number}[];
}
export type GameCommand =
  | {type:'chestDone'|'evolutionDone';token?:number}
  | { type: 'pause' | 'resume' | 'introDone' | 'bossDeathDone' | 'abandon' | 'step' | 'magnet' | 'bomb' | 'chest'|'ultimate'|'ultimateFull'|'contract'|'unlockRun' }
  | {type:'interact';held:boolean}
  | {type:'chooseReward';token:number;index:number}
  | { type: 'choose'; index: number;token?:number }
  | { type: 'week'|'boss'|'xp'|'frenzy'|'combo'|'spawn'|'damage'|'seed'; value: number }
  | { type: 'evolve'|'prepareFusion'|'teleport'; id:string }
  | {type:'spawnEnemy';id:string;rank?:EnemyRank;affixes?:string[]}
  | {type:'pickup';id:PickupId}
  | {type:'event';id:EventId}
  | { type: 'grant'; id: string; level: number; evolved?: boolean }
  | { type: 'god'; value: boolean };
