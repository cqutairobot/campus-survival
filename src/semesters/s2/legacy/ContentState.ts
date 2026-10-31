import type {ContentSkill,ContentDamageSource,ContentWeaponId} from '../types';
import {enemyVisual,type ContentVisualEvent} from '../enemy-visuals';
import {RANK_CODE,rankName} from '../../../data/enemies';
import {actualDamage,asSource,damageKey,damageLabel} from './damage';
import {AreaPool,DropPool,EnemyPool,ShotPool} from '../../../entities/pools';
import {BossSystem} from './bosses';
import {EnemyDirector} from './director';
import {EnemyBehaviors} from './behaviors';
import {configureElite} from './elites';
import {draftCards,protocolBonus,statsFor,weekHpMultiplier,weekDamageMultiplier,xpForLevel} from './rules';
import {AdvancedEnemies} from '../advanced-enemies';
import {ProtocolMarks} from '../protocol';
import {EchoChip,Harness,type HitContext} from '../equipment';
import {relicStats,clampStats,relicBulletSpeed} from '../../../progression/relics';
import {RewardSystem} from './rewards';
import {freshMetrics} from '../../../core/metrics';
import {CombatMomentum,frenzyStats} from './momentum';
import {assessmentEntry,createS2WorldSnapshot,worldNavigation,worldSafePoint,worldSlideMove,worldZoneAt,type AssessmentEntry,type WorldSnapshot} from '../world';
import {immutableSnapshot} from '../../types';
import type {Navigation} from '../../../world/navigation';
import {DangerScheduler,dangerContains,ringRadius,warningSeconds,type HazardOptions,type S2Hazard} from '../danger';
import {pressureAt} from '../pressure';
import {FirstChapterBehaviors} from '../first-chapter-behaviors';
import {EXPO_FINAL} from '../expo-final';
import {PROJECT_REVIEW} from '../project-review';
import {PROPOSAL_BOARD} from '../proposal-board';
import {cappedDamage,invulnerabilityFor,selectPlayerHit,tierForRank,type DamageOrigin,type IncomingHit} from '../player-damage';
import {WeaponSystem} from './system';
import {SpatialGrid} from '../../../core/grid';
import {clamp,colorNumber,distanceSq,segmentDistanceSq,TAU} from '../../../core/math';
import {freshProgress,LOGICAL_HEIGHT,LOGICAL_WIDTH} from '../../../core/run';
import {ContentDeathQueue,type ContentDeath} from './deaths';
import {UltimateSystem} from './ultimates';
import {applyPickup,rollPickup} from './pickups';
import type {DropKind,EnemyRank,HUD,Phase,Player,PlayerStats} from '../../../types';
import type {Discovery} from '../../types';
import type {AssessmentEvent,AssessmentServices,RuntimeGrants,RuntimeServices,RuntimeStep} from '../../runtime/contracts';
import type {ContentCatalog} from './catalog';

/** Run-local legacy content, owned exclusively by SemesterRules. No GameEngine,
 * save projection/writer, settlement, renderer or second clock lives here. */
export class ContentState {
 readonly enemies=new EnemyPool();readonly shots=new ShotPool(2560);readonly enemyShots=new ShotPool(1280);readonly areas=new AreaPool();readonly drops=new DropPool();readonly grid=new SpatialGrid(2560);
 readonly navigation:Navigation;readonly world:WorldSnapshot;readonly danger:DangerScheduler;readonly weaponSystem:WeaponSystem;readonly bossSystem:BossSystem;readonly director:EnemyDirector;readonly behaviors:EnemyBehaviors;readonly rewards:RewardSystem;readonly ultimate:UltimateSystem;readonly threats:FirstChapterBehaviors;
 readonly manifest;readonly streams;readonly random;readonly dropRandom;readonly draftRandom;
 readonly weapons:ContentSkill[]=[];readonly passives:ContentSkill[]=[];readonly consumed:string[]=[];readonly relics:string[]=[];readonly progress=freshProgress();readonly discoveries:Discovery[]=[];readonly visualEvents:{serial:number;event:ContentVisualEvent}[]=[];readonly hazards:S2Hazard[]=[];readonly deaths=new ContentDeathQueue();readonly momentum=new CombatMomentum();readonly protocol=new ProtocolMarks(this);readonly echo=new EchoChip(this);readonly harness=new Harness(this);readonly advanced=new AdvancedEnemies(this);
 readonly additionalDamage:Record<string,{echo:number;mark:number}>={};
 readonly player:Player={x:3072,y:3072,prevX:3072,prevY:3072,vx:0,vy:0,facing:-Math.PI/2,hp:110,shield:0,shieldTime:0,invincible:1,lastHurt:-100};
 // Regional content and safety scheduling share this run's world.
 readonly landmarks={zone:undefined as ReturnType<typeof worldZoneAt>,trackTime:0,rangeTime:0,channel:0};
 assessmentAdmission:AssessmentEntry|null=null;
 stats:PlayerStats;phase:Phase='playing';semesterTime=0;combatTime=0;bossTime=0;week=1;level=1;xp=0;kills=0;bosses=0;bossEnemy=-1;bossStage=1;bossActive=false;bossNumber=0;
 inputX=0;inputY=0;frame=0;damageMultiplier=1;notice='新学期，出发！';noticeUntil=5;cards:HUD['cards']=[];draftToken=0;chest:HUD['chest']=null;
 damage:Record<string,number>={};poolFailures=0;readonly metrics=freshMetrics();coffeeTime=0;bonusCredits=0;ordinarySpawnsAllowed=false;assessmentRewardDone=false;
 private incomingHits:IncomingHit[]=[];private shotOrigins=new Map<number,{generation:number;origin:DamageOrigin;owner?:number;ownerGeneration?:number}>();
 private rewardedGeneration=new Uint32Array(this.enemies.capacity);
 private navTimer=0;private pendingLevels=0;private levelFeedbackFrame=-1;private deadBoss=-1;private nextMerge=1;private specialCooldown:Record<string,number>={};private hazardId=0;private instanceSerial=0;private visualSerial=0;
 private disposed=false;private waitingForAssessment=false;private moveScratch={x:0,y:0};private grantBoundary:RuntimeGrants|null=null;private transitions=new Set<string>();
 private drafts=0;private offeredNew=false;
 constructor(readonly content:ContentCatalog,services:RuntimeServices,world:WorldSnapshot=createS2WorldSnapshot(services.snapshot.regions)){
  this.manifest=services.snapshot;this.streams=services.streams;this.random=this.streams.combat;this.dropRandom=this.streams.drop;this.draftRandom=this.streams.draft;
  const initial=this.manifest.initialWeapon,definition=content.weaponById[initial.id];
  if(!definition||definition.fusion||!content.characters.some(c=>c.id===this.manifest.character))throw Error('Content not ported for opening snapshot');
  if(world.version!==this.manifest.worldVersion||world.size!==6144)throw Error('Unsupported semester world snapshot');
  this.world=immutableSnapshot(world);this.navigation=worldNavigation(this.world);this.danger=new DangerScheduler(this.world,this.hazards);this.rewards=new RewardSystem(this);this.ultimate=new UltimateSystem(this);
  Object.assign(this.player,{...this.world.spawn,prevX:this.world.spawn.x,prevY:this.world.spawn.y});
  this.weapons.push({...initial,id:definition.id,kind:'base',instanceId:this.nextInstance()});this.stats=this.calculateStats();this.player.hp=this.stats.maxHp;
  this.weaponSystem=new WeaponSystem(this);this.bossSystem=new BossSystem(this);this.director=new EnemyDirector(this);this.threats=new FirstChapterBehaviors(this);this.behaviors=new EnemyBehaviors(this);this.discover(initial.id);
  for(let n=0;n<12;n++){const a=n*TAU/12;this.spawnEnemy(n%3?'homework':'checkin',this.player.x+Math.cos(a)*360,this.player.y+Math.sin(a)*280);}
  this.rebuildGrid();this.navigation.rebuild(this.player.x,this.player.y);
 }
 nextInstance(){return++this.instanceSerial;}
 get activeEvent(){return null;}
 get combatStats(){let st=frenzyStats(this.stats,this.momentum.active);const u=this.ultimate;if(this.coffeeTime>0)st={...st,haste:st.haste*1.25};if(u.remaining>0){if(u.def.id==='overload')st={...st,haste:st.haste*1.4,area:st.area*1.25};if(u.def.id==='conference')st={...st,speed:st.speed*1.25};}if(this.landmarks.trackTime>0)st={...st,speed:st.speed*1.15};if(this.landmarks.rangeTime>0)st={...st,area:st.area*1.2};return clampStats(st);}
 get hasPendingRewards(){return this.pendingLevels>0||this.rewards.chests.length>0||this.phase!=='playing';}
 private calculateStats(relics=this.relics){const s=statsFor(this.content,this.manifest,this.passives);if(this.manifest.mode==='daily'){if(this.manifest.dailyRule==='piercing')s.multi++;if(this.manifest.dailyRule==='lastMinute')s.charge+=.35;if(this.manifest.dailyRule==='assistants')s.summon+=.25;if(this.manifest.dailyRule==='nightRun')s.speed*=1.2;if(this.manifest.dailyRule==='construction')s.area*=1.2;}const stats=relicStats(s,relics);stats.invulnerability=invulnerabilityFor(stats.invulnerability);return stats;}
 previewRelic(id:string){return this.calculateStats([...this.relics,id]);}
 recalculateStats(mode:'increase'|'ratio'='increase',previous=this.stats.maxHp){const hp=this.player.hp;this.stats=this.calculateStats();this.player.hp=Math.min(this.stats.maxHp,mode==='ratio'?hp*this.stats.maxHp/previous:hp+Math.max(0,this.stats.maxHp-previous)*(this.manifest.dailyRule==='overload'?.6:1));this.player.shield=Math.min(this.player.shield,this.stats.maxHp*.5);}
 discover(value:string,evolution=false){const split=value.indexOf(':'),prefixed=['enemy','fusion','relic','event','region','item'].includes(value.slice(0,split)),category:Discovery['category']=evolution?'evolution':prefixed?value.slice(0,split) as Discovery['category']:'item',id=prefixed?value.slice(split+1):value;if(!this.discoveries.some(d=>d.category===category&&d.id===id))this.discoveries.push({semesterId:'s2',category,id,evidence:'run'});}
 safePoint(x:number,y:number){return worldSafePoint(this.world,x,y);}
 rebuildGrid(){this.grid.rebuild(this.enemies.active,this.enemies.x,this.enemies.y);}
 emit(event:ContentVisualEvent){this.visualEvents.push({serial:++this.visualSerial,event});if(this.visualEvents.length>2000)this.visualEvents.shift();}
 impact(_strength:number,_stop=0){/* Presentation owns camera/visual holds; no extra simulation clock. */}
 message(text:string,seconds=4){this.notice=text;this.noticeUntil=this.combatTime+seconds;}
 setPhase(phase:Phase){const previous=this.phase;this.phase=phase;if(phase!=='playing'||previous!=='playing')this.inputX=this.inputY=0;if(phase==='playing'&&previous!=='playing')this.player.invincible=Math.max(this.player.invincible,.75);}
 private inheritanceDamage(value:number){if(!this.grantBoundary)throw Error('Damage grant outside simulation boundary');return this.grantBoundary.damageAfterInheritance(value);}
 private inheritanceExperience(value:number){if(!this.grantBoundary)throw Error('Experience grant outside simulation boundary');return this.grantBoundary.experienceAfterInheritance(value);}
 tick(step:RuntimeStep){
  if(this.disposed)return{};
  this.grantBoundary=step;
  try{
   this.waitingForAssessment=false;this.frame=step.clock.tick;this.combatTime=step.clock.combatSeconds;this.semesterTime=step.clock.teachingSeconds;this.bossTime=step.clock.assessmentSeconds;this.week=step.clock.week;this.ordinarySpawnsAllowed=step.ordinarySpawnsAllowed;
   const dt=step.dt,p=this.player;this.incomingHits.length=0;this.momentum.update(dt,this.combatTime);this.coffeeTime=Math.max(0,this.coffeeTime-dt);p.prevX=p.x;p.prevY=p.y;p.invincible=Math.max(0,p.invincible-dt);if(p.invincible<1e-9)p.invincible=0;p.shieldTime=Math.max(0,p.shieldTime-dt);if(!p.shieldTime)p.shield=0;
   this.movePlayer(dt);this.harness.update(dt);this.landmarks.zone=worldZoneAt(this.world,p.x,p.y);
   const visited=this.landmarks.zone?.id;if(visited&&!this.progress.visited.includes(visited)){this.progress.visited.push(visited);this.discover(`region:${visited}`);}
   this.navTimer-=dt;if(this.navTimer<=0){this.navigation.rebuild(p.x,p.y);this.navTimer=.5;}
   this.director.update(dt);this.advanced.update(dt);this.behaviors.update(dt);this.bossSystem.update(dt);this.bossSystem.updateExams(dt);this.rebuildGrid();this.ultimate.update(dt);this.weaponSystem.update(dt);this.updateEnemyShots(dt);this.updateHazards();this.resolvePlayerHit();this.resolveDeaths();this.updateDrops(dt);
   const currentZone=this.landmarks.zone;if(p.hp>0)this.heal((this.stats.regen+(currentZone?.id==='canteen'&&this.combatTime-p.lastHurt>2?1:0))*dt);if(this.stats.drain>0&&p.hp>0)p.hp=Math.max(1,p.hp-this.stats.maxHp*this.stats.drain*dt);
   if(p.hp<=0)return{defeated:true};if(this.deadBoss>=0)return{assessmentCleared:true};
   this.nextMerge-=dt;if(this.nextMerge<=0){this.mergeExperience();this.nextMerge=1;}this.handlePending();return this.phase==='playing'?{}:{pause:this.phase==='draft'?'choice' as const:'reward' as const};
  }finally{this.grantBoundary=null;}
 }
 handlePending(){if(this.phase!=='playing')return;if(this.rewards.chests.length){this.rewards.openChest(this.rewards.chests.shift()!);return;}if(this.pendingLevels>0)this.openDraft();}
 assessment(event:AssessmentEvent,services:AssessmentServices){
  const key=`${event.assessment.index}:${event.stage}`;if(this.transitions.has(key))return;this.transitions.add(key);
  this.grantBoundary=services;
  try{
  if(event.stage==='prepare'){
   this.waitingForAssessment=true;
   // Finish the current mini-boss once, retaining its earned chest/XP; ordinary
   // threat cleanup is cancellation and never a source of free kill rewards.
   for(const id of [...this.enemies.active])if(this.enemies.rank[id]===RANK_CODE.miniBoss&&this.enemies.hp[id]>0){this.enemies.hp[id]=0;this.deaths.mark(this.enemies,id,{kind:'environment',id:'assessment'},true);}
   this.resolveDeaths();this.clearThreats();this.director.pendingElites.length=0;this.handlePending();
   try{this.assessmentAdmission=assessmentEntry(this.world,this.player);}catch{this.assessmentAdmission=null;this.message('当前区域没有安全考场，请检查世界布局');}
  }else if(event.stage==='start'){
   const entry=assessmentEntry(this.world,this.player,this.assessmentAdmission);this.assessmentAdmission=entry;
   const p=this.player;Object.assign(p,{...entry.site.player,prevX:entry.site.player.x,prevY:entry.site.player.y,vx:0,vy:0});this.navigation.rebuild(p.x,p.y,true);
   this.waitingForAssessment=false;
   this.bossNumber=event.assessment.index;this.bossStage=1;this.bossActive=true;this.bossTime=0;this.assessmentRewardDone=false;
   const kind=event.assessment.week===8&&this.bossNumber===0&&this.content.enemyById[PROPOSAL_BOARD.id]?PROPOSAL_BOARD.id:event.assessment.week===16&&this.bossNumber===1&&this.content.enemyById[PROJECT_REVIEW.id]?PROJECT_REVIEW.id:event.assessment.week===24&&this.bossNumber===2&&this.content.enemyById[EXPO_FINAL.id]?EXPO_FINAL.id:['proposal','defense','finals'][this.bossNumber],point=entry.site.boss;this.bossEnemy=this.spawnEnemy(kind,point.x,point.y);this.bossSystem.reset();this.emit({type:'boss',x:point.x,y:point.y,color:0xe48475,size:240,text:this.content.enemyById[kind].name});
  }else{
   this.waitingForAssessment=true;
   const checkpoint=[PROPOSAL_BOARD.id,PROJECT_REVIEW.id,EXPO_FINAL.id].includes(this.content.enemies[this.enemies.kind[this.deadBoss]]?.id);
   this.bosses++;this.metrics.bossFights.push({boss:this.bossNumber,seconds:event.clock.assessmentSeconds,damage:this.enemies.maxHp[this.deadBoss]});this.deadBoss=-1;this.clearThreats();this.assessmentAdmission=null;this.magnet();if(checkpoint)this.heal(this.stats.maxHp*.15,true);this.rewards.openChest(3,true);
  }
  }finally{this.grantBoundary=null;}
 }
 private clearThreats(){this.inputX=this.inputY=0;this.bossEnemy=-1;this.enemies.clear();this.protocol.clear();this.echo.clear();this.deaths.clear();this.enemyShots.clear();this.shotOrigins.clear();this.danger.clear();this.threats.clear();this.advanced.clear();this.ordinarySpawnsAllowed=false;this.rebuildGrid();}
 canAcknowledge(kind:'assessmentIntro'|'assessmentReward'){return!this.hasPendingRewards&&(kind==='assessmentIntro'?!!this.assessmentAdmission:this.assessmentRewardDone);}
 command(value:unknown){
  if(this.disposed||!value||typeof value!=='object')return{accepted:false};const c=value as Record<string,unknown>;
  if(c.type==='move'&&typeof c.x==='number'&&Number.isFinite(c.x)&&typeof c.y==='number'&&Number.isFinite(c.y)&&this.phase==='playing'&&!this.waitingForAssessment){this.inputX=clamp(c.x,-1,1);this.inputY=clamp(c.y,-1,1);return{accepted:true};}
  if(c.type==='ultimate'&&!this.waitingForAssessment)return{accepted:this.ultimate.release()};
  if(c.type==='choose'&&this.phase==='draft'&&Number.isInteger(c.index)&&c.token===this.draftToken&&this.cards[c.index as number])this.applyCard(c.index as number,c.token as number);
  else if(c.type==='chooseReward'&&Number.isInteger(c.index)&&c.token===this.rewards.token&&this.rewards.options[c.index as number]&&this.phase==='reward')this.rewards.choose(c.token as number,c.index as number);
  else if(c.type==='chestDone'&&c.token===this.rewards.token&&this.phase==='chest')this.rewards.finishChest();
  else if(c.type==='evolutionDone'&&c.token===this.rewards.token&&this.phase==='evolution')this.rewards.afterReward();
  else return{accepted:false};
  return{accepted:true,resume:(this.phase as Phase)==='playing'};
 }
 private movePlayer(dt:number){const p=this.player,len=Math.hypot(this.inputX,this.inputY),scale=len>1?1/len:1,ix=this.inputX*scale,iy=this.inputY*scale,smoothing=1-Math.exp(-dt*(len>.01?18:14)),speed=this.combatStats.speed;p.vx+=(ix*speed-p.vx)*smoothing;p.vy+=(iy*speed-p.vy)*smoothing;if(len>.05)p.facing=Math.atan2(iy,ix);const next=worldSlideMove(this.world,p.x,p.y,p.vx*dt,p.vy*dt,12,this.moveScratch);p.x=next.x;p.y=next.y;}
 moveEnemy(id:number,dx:number,dy:number){const e=this.enemies,next=worldSlideMove(this.world,e.x[id],e.y[id],dx,dy,e.radius[id]*.65,this.moveScratch);e.x[id]=next.x;e.y[id]=next.y;}
 spawnEnemy(kind:string,x?:number,y?:number,reward=0,eliteWeek?:number,attached=false){const index=this.content.enemyIndex[kind];if(index===undefined||!attached&&!this.advanced.canSpawn(kind))return-1;const e=this.enemies,def=this.content.enemies[index];if((def.rank==='elite'||eliteWeek!==undefined)&&e.active.filter(n=>e.hp[n]>0&&e.rank[n]===RANK_CODE.elite).length>=pressureAt(this.week).eliteCap)return-1;if(!attached&&def.rank==='normal'&&eliteWeek===undefined&&e.active.filter(n=>e.hp[n]>0&&e.rank[n]===RANK_CODE.normal).length>=pressureAt(this.week).normalCap)return-1;const id=e.acquire();if(id<0){this.poolFailures++;return-1;}
  if(x===undefined||y===undefined){const rng=this.streams.spawn,horizontal=rng.next()<.5,sign=rng.next()<.5?-1:1;x=this.player.x+(horizontal?sign*(LOGICAL_WIDTH*.5+rng.range(80,160)):rng.range(-LOGICAL_WIDTH*.5,LOGICAL_WIDTH*.5));y=this.player.y+(!horizontal?sign*(LOGICAL_HEIGHT*.5+rng.range(80,160)):rng.range(-LOGICAL_HEIGHT*.5,LOGICAL_HEIGHT*.5));}
  const point=this.safePoint(x,y),normal=def.rank==='normal'&&eliteWeek===undefined;e.x[id]=e.prevX[id]=point.x;e.y[id]=e.prevY[id]=point.y;e.hp[id]=e.maxHp[id]=normal?Math.ceil(def.hp*weekHpMultiplier(this.week)):def.hp;e.speed[id]=def.speed*(normal?pressureAt(this.week).speed:1);e.damage[id]=def.damage*(def.rank==='normal'||def.rank==='elite'?weekDamageMultiplier(this.week):1);e.radius[id]=def.radius;e.kind[id]=index;e.rank[id]=attached?RANK_CODE.bossAdd:eliteWeek===undefined?RANK_CODE[def.rank]:RANK_CODE.elite;e.cooldown[id]=this.streams.ai.range(1,4);e.affixTimer[id]=this.streams.ai.range(1,4);e.skillTimer[id]=7;e.shootTimer[id]=3;e.xp[id]=def.rank==='bossAdd'||attached?0:def.xp;e.reward[id]=reward;e.rewardWeight[id]=def.rank==='bossAdd'||attached?0:1;e.orbitHits.fill(0,id*12,id*12+12);e.areaHits.fill(0,id*4,id*4+4);
  if(kind==='s2:dispatcher'&&this.week>=20)e.hp[id]=e.maxHp[id]=20000;
  if(def.behavior==='shield')e.shield[id]=e.maxShield[id]=e.maxHp[id]*.35;if(normal&&def.behavior==='split'){e.chainXp[id]=e.xp[id]*.5;e.xp[id]*=.5;e.chainWeight[id]=.5;e.rewardWeight[id]=.5;}
  if(def.rank==='elite'||eliteWeek!==undefined)configureElite(this,id,undefined,eliteWeek??this.week);if(def.rank==='miniBoss')e.reward[id]=2;this.metrics.spawned++;if(normal&&!attached)this.metrics.normalSpawned++;if(!this.progress.enemies.includes(kind))this.progress.enemies.push(kind);this.discover(`enemy:${kind}`);return id;
 }
 spawnSummon(kind:string,owner:number,x:number,y:number,lifetime=12,attached=false){const e=this.enemies;if(!this.enemySourceAlive(owner,e.generation[owner]))return-1;const id=this.spawnEnemy(kind,x,y,0,undefined,attached);if(id>=0){e.owner[id]=owner;e.ownerGeneration[id]=e.generation[owner];e.lifetime[id]=lifetime;e.xp[id]=0;e.rewardWeight[id]=0;e.chainXp[id]=0;e.chainWeight[id]=0;e.reward[id]=0;e.splitGeneration[id]=1;}return id;}
 enemySourceAlive(id:number,generation:number):boolean{const e=this.enemies;for(let depth=0;depth<e.capacity;depth++){if(!e.valid(id,generation)||e.hp[id]<=0)return false;if(e.owner[id]<0)return true;generation=e.ownerGeneration[id];id=e.owner[id];}return false;}
 cancelEnemyAttacks(id:number,generation=this.enemies.generation[id]){const e=this.enemies;if(!e.valid(id,generation))return;this.danger.cancelOwner(id,generation);this.threats.forget(id,generation);this.advanced.forget(id,generation);this.bossSystem.projectReview.forget(id,generation);this.bossSystem.expoFinal.forget(id,generation);this.cancelOwnedShots(id,generation);for(const child of [...e.active])if(e.owner[child]===id&&e.ownerGeneration[child]===generation)this.releaseEnemy(child);}
 releaseEnemy(id:number){if(!this.enemies.alive[id])return;this.cancelEnemyAttacks(id);this.protocol.forget(id);this.echo.forget(id);this.enemies.release(id);}
 frozenTarget(id:number){const e=this.enemies;if(e.owner[id]>=0||e.rank[id]===RANK_CODE.bossAdd)return;if(!e.frozenOnce[id]){e.frozenOnce[id]=1;this.progress.frozen++;}}
 hitEnemy(id:number,baseDamage:number,source:ContentWeaponId|ContentDamageSource,x:number,y:number,knockback=1,canCrit=true,canChain=true,clearChain=false,fixed=false,secondary=false,context:HitContext={}):number{
  const e=this.enemies;if(!e.alive[id]||e.hp[id]<=0||baseDamage<=0)return 0;const src=asSource(source),rank=rankName(e.rank[id]),crit=!context.settled&&!context.additional&&canCrit&&this.random.next()<this.stats.crit;let damage=baseDamage*(crit?this.stats.critDamage:1);
  if(!context.settled&&!fixed&&this.landmarks.zone?.id==='garden'&&['elite','miniBoss','boss'].includes(rank))damage*=1.2;
  if(!context.settled&&!fixed&&src.kind==='weapon'){const bonus=protocolBonus(this.content,this.passives);if(bonus>0)damage*=1+this.protocol.hit(id,bonus,secondary)*(rank==='boss'?.5:1);}
  if(!context.settled)damage*=1-Math.min(.4,Math.max(this.advanced.reduction(id),this.bossSystem.projectReview.reduction(id),this.bossSystem.expoFinal.reduction(id)));
  const absorbed=Math.min(e.shield[id],damage);e.shield[id]-=absorbed;const actual=actualDamage(e.hp[id],damage-absorbed),total=actual+absorbed;e.lastHit[id]=this.combatTime;
  this.metrics.hits++;this.metrics.shieldDamage+=absorbed;if(!e.hitCount[id])e.firstHit[id]=this.combatTime;e.hitCount[id]=Math.min(65535,e.hitCount[id]+1);this.metrics.criticalHits+=Number(crit);this.metrics.overkill+=Math.max(0,damage-total);e.hp[id]-=actual;const key=damageKey(src);this.damage[key]=(this.damage[key]??0)+total;e.flash[id]=crit?.077:.065;
  const dx=e.x[id]-x,dy=e.y[id]-y,d=Math.hypot(dx,dy)||1,resist=rank==='boss'?.05:rank==='miniBoss'?.1:rank==='elite'?.25:this.content.enemies[e.kind[id]].tags.includes('heavy')?.5:1;e.vx[id]+=dx/d*(crit?160:90)*knockback*this.stats.push*resist;e.vy[id]+=dy/d*(crit?160:90)*knockback*this.stats.push*resist;
  this.emit({type:'hit',slot:id,generation:e.generation[id],...enemyVisual(this.content.enemies[e.kind[id]].id),rank,batch:this.frame,sourceKey:key,damageType:absorbed>0?'shield':!canCrit&&src.kind==='weapon'&&['coffee','cryo','icefire','eraser'].includes(src.id)?'dot':'normal',x:e.x[id],y:e.y[id]-8,color:crit?0xf0bf5b:colorNumber(damageLabel(this.content,key).color),size:crit?11:6,value:Math.round(total),critical:crit,weapon:src.kind==='weapon'?src.id:undefined,angle:Math.atan2(dy,dx)});
  if(absorbed>0&&e.shield[id]<=0)this.emit({type:'shieldBreak',x:e.x[id],y:e.y[id],color:0x9be3ed,size:e.radius[id]*2,material:'glass',priority:true});if(crit)this.impact(1.5);
  if(id===this.bossEnemy){this.bossSystem.proposalBoard.observeHealth();this.bossSystem.projectReview.observeHealth();this.bossSystem.expoFinal.observeHealth();}
  if(e.hp[id]<=0){this.cancelEnemyAttacks(id,e.generation[id]);this.deaths.mark(e,id,src,clearChain);}
  if(!secondary&&!context.additional&&src.kind==='weapon'){
   const echo=this.echo.amount(id,total,context);if(echo>0)this.hitEnemy(id,echo,src,x,y,0,false,false,false,false,true,{settled:true,additional:'echo'});
   this.weaponSystem.printer.trigger(id);
  }
  if(context.additional){const detail=this.additionalDamage[key]??={echo:0,mark:0};detail[context.additional]+=total;}
  if(crit&&canChain&&e.owner[id]<0&&rank!=='bossAdd'&&src.kind==='weapon'&&this.momentum.critical())this.criticalChain(id,e.x[id],e.y[id],baseDamage*.25,src.id);return total;
 }
 resolveDeaths(){this.deaths.drain(this.enemies,d=>this.resolveDeath(d));}
 private resolveDeath(death:ContentDeath){const e=this.enemies,id=death.slot;if(this.rewardedGeneration[id]===death.generation)return;this.rewardedGeneration[id]=death.generation;this.protocol.forget(id);this.echo.forget(id);const def=this.content.enemies[e.kind[id]],rank=rankName(e.rank[id]),x=e.x[id],y=e.y[id],weight=e.rewardWeight[id]+(death.clearChain?e.chainWeight[id]:0),xp=e.xp[id]+(death.clearChain?e.chainXp[id]:0),attached=e.owner[id]>=0||rank==='bossAdd';
  this.emit({type:'death',slot:id,generation:e.generation[id],...enemyVisual(def.id),rank,batch:this.frame,angle:Math.atan2(e.vy[id],e.vx[id]),x,y,color:colorNumber(def.color),size:e.radius[id],weapon:death.source.kind==='weapon'?death.source.id:undefined,priority:rank!=='normal'});
  this.advanced.death(id);this.cancelEnemyAttacks(id);
  if(attached){e.release(id);return;}
  this.kills++;this.metrics.firstKill??=this.combatTime;
  if(rank==='normal'&&e.owner[id]<0){const band=this.week<=5?'early':this.week<=16?'middle':'late',seconds=this.combatTime-e.firstHit[id],bucket=seconds<.5?0:seconds<1?1:seconds<2?2:seconds<3?3:seconds<5?4:5;this.metrics.normalKillTimings[band].push(seconds);if(this.metrics.normalKillTimings[band].length>8192)this.metrics.normalKillTimings[band].shift();this.metrics.normalKillHits[band][Math.min(10,e.hitCount[id])]++;this.metrics.normalKillSeconds[band][bucket]++;if(def.tags.includes('heavy'))this.metrics.heavyKillHits[Math.min(10,e.hitCount[id])]++;this.progress.normalKills+=weight;if(def.id==='guard'&&weight>0)this.progress.shieldKills++;}
  else if(rank==='elite')this.progress.elites++;else if(rank==='miniBoss')this.progress.miniBosses++;
  if(xp>0)this.spawnDrop('xp',x,y,xp*(rank==='normal'&&this.activeEvent==='examRage'?1.2:1));if(weight>0){this.killFeedback(rank,weight);this.ultimate.kill(rank,weight,death.source);}
  if(rank==='normal'&&e.owner[id]<0&&e.splitGeneration[id]===0)rollPickup(this,x,y,this.specialCooldown);
  if(rank==='boss'){if(!this.progress.bossIds.includes(def.id))this.progress.bossIds.push(def.id);if(def.id==='proposal'&&this.weapons.some(w=>w.id==='ruler'&&w.level===5))this.progress.architect=true;this.deadBoss=id;return;}
  if(rank==='elite'||rank==='miniBoss'){this.spawnDrop('chest',x,y,rank==='miniBoss'?2:1);this.metrics.chests++;this.impact(4,1/60);}
  if(def.id==='advisor'||rank==='miniBoss')this.spawnDrop('heal',x+20,y,this.content.pickupById.heal.value);
  this.advanced.aftershock(id);
  if(e.affixes[id]&8)this.addHazard('circle',x,y,0,0,110,1,.3,16*weekDamageMultiplier(this.week),undefined,{ordinary:false,tier:rank==='elite'?'elite':'normal'});
  const split=def.behavior==='split'&&e.splitGeneration[id]===0&&!death.clearChain,eliteSplit=!!(e.affixes[id]&1);const children:{hp:number;xp:number;weight:number}[]=[];
  if(split)for(let n=0;n<2;n++)children.push({hp:e.maxHp[id]*.35,xp:e.chainXp[id]/2,weight:e.chainWeight[id]/2});else if(eliteSplit)for(let n=0;n<2;n++)children.push({hp:e.maxHp[id]*.3,xp:0,weight:0});
  e.release(id);
  for(const [n,child] of children.entries()){const c=this.spawnEnemy(split?'splitter':'homework',x+(n?16:-16),y);if(c>=0){e.hp[c]=e.maxHp[c]=child.hp;e.xp[c]=child.xp;e.rewardWeight[c]=child.weight;e.chainXp[c]=0;e.chainWeight[c]=0;e.splitGeneration[c]=1;e.radius[c]*=.7;e.reward[c]=0;e.affixes[c]=0;}}
 }
 private killFeedback(rank:EnemyRank,weight:number){const p=this.player,result=this.momentum.kill(rank,this.combatTime,weight);if(result.milestone)this.emit({type:'combo',x:p.x,y:p.y,color:0xffd775,size:90,value:result.milestone,text:result.milestone>=100?'学术无双':result.milestone>=50?'势不可挡':result.milestone>=25?'灵感喷涌':'渐入佳境'});if(result.clear){this.metrics.clearRewards++;for(const id of this.drops.active){const d=this.drops.data[id];if(d.kind==='xp'&&distanceSq(p.x,p.y,d.x,d.y)<=360**2)d.attract=true;}this.emit({type:'clear',x:p.x,y:p.y,color:0x85ead0,size:360,text:'清场 · 学分汇流 +15 狂热',duration:.7});}if(result.frenzy)this.startFrenzyFeedback();}
 private startFrenzyFeedback(){this.metrics.frenzyTriggers++;this.emit({type:'frenzy',x:this.player.x,y:this.player.y,color:0xffb354,size:240,text:'学术狂热',duration:.8});this.impact(4);}
 private criticalChain(origin:number,x:number,y:number,damage:number,source:ContentWeaponId){const e=this.enemies,visited=[origin];this.metrics.criticalChains++;for(let hop=0;hop<2;hop++){let target=-1,best=130**2;for(const id of e.active){if(visited.includes(id)||e.hp[id]<=0)continue;const d=distanceSq(x,y,e.x[id],e.y[id]);if(d<=best){best=d;target=id;}}if(target<0)break;visited.push(target);const tx=e.x[target],ty=e.y[target];this.metrics.chainDamage+=this.hitEnemy(target,damage,source,x,y,.4,false,false,false,false,true);this.emit({type:'chain',x,y,x2:tx,y2:ty,color:0xffdf81,size:3,duration:.22,weapon:source});x=tx;y=ty;}}
 originForEnemy(id:number,kind:DamageOrigin['kind']='contact'):DamageOrigin{const e=this.enemies;let source=id;for(let depth=0;depth<e.capacity&&e.owner[source]>=0&&e.valid(e.owner[source],e.ownerGeneration[source]);depth++)source=e.owner[source];const rank=rankName(e.rank[source]);return{kind,id,generation:e.generation[id],tier:rank==='bossAdd'&&this.bossActive?'boss':tierForRank(rank)};}
 hurtPlayer(damage:number,x:number,y:number,origin:DamageOrigin={kind:'environment',id:0,generation:0,tier:'normal'}){if(this.player.invincible>0||this.player.hp<=0||!Number.isFinite(damage)||damage<=0)return;this.incomingHits.push({...origin,damage,x,y});}
 private resolvePlayerHit(){
  const p=this.player;if(p.invincible>0||p.hp<=0)return;
  const regional=this.landmarks.zone?.id==='garden'?1.1:1,hit=selectPlayerHit(this.incomingHits,this.stats.maxHp,this.stats.armor,regional);if(!hit)return;
  let damage=this.harness.reduce(cappedDamage(hit,this.stats.maxHp,this.stats.armor,regional));const absorbed=Math.min(p.shield,damage);p.shield-=absorbed;damage=this.inheritanceDamage(damage-absorbed);p.hp-=damage;p.invincible=invulnerabilityFor(this.stats.invulnerability);p.lastHurt=this.combatTime;this.landmarks.channel=0;this.metrics.hurtCount++;this.metrics.hpLost+=damage;this.metrics.shieldAbsorbed+=absorbed;
  const dx=p.x-hit.x,dy=p.y-hit.y,d=Math.hypot(dx,dy)||1,push=this.passives.find(s=>s.id==='push'),resistance=push?[.05,.1,.15,.2,.25][push.level-1]:0,next=worldSlideMove(this.world,p.x,p.y,dx/d*12*(1-resistance),dy/d*12*(1-resistance),12,this.moveScratch);p.x=next.x;p.y=next.y;this.impact(5,.04);this.emit({type:'hurt',damageType:'hurt',angle:Math.atan2(dy,dx),x:p.x,y:p.y,color:0xe96c6c,size:24,value:Math.ceil(damage)});
 }
 heal(amount:number,fixed=false){const before=this.player.hp;if(this.player.hp>0&&amount>0)this.player.hp=Math.min(this.stats.maxHp,this.player.hp+amount*(fixed?1:this.manifest.dailyRule==='overload'?.6:1));const restored=this.player.hp-before;if(restored>=1)this.emit({type:'pickup',damageType:'heal',x:this.player.x,y:this.player.y,color:0x83e4be,size:8,value:restored});}
 addShield(amount:number,seconds:number){this.player.shield=Math.min(this.stats.maxHp*.5,this.player.shield+amount);this.player.shieldTime=seconds;}
 enemyBullet(x:number,y:number,angle:number,speed:number,damage:number,radius=6,delay=0,ordinary=true,owner?:number){
  const id=this.enemyShots.acquire();if(id<0){this.poolFailures++;return;}
  const origin=owner!==undefined?this.originForEnemy(owner,'projectile'):{kind:'projectile' as const,id,generation:this.enemyShots.generation[id],tier:this.bossActive?'boss' as const:ordinary?'normal' as const:'elite' as const};
  delay=Math.max(delay,Math.hypot(x-this.player.x,y-this.player.y)<160?warningSeconds(origin.tier):0);
  const s=this.enemyShots.data[id];s.x=s.prevX=x;s.y=s.prevY=y;s.vx=Math.cos(angle)*speed;s.vy=Math.sin(angle)*speed;s.life=8+delay;s.age=-delay;s.damage=damage;s.radius=radius;s.kind='enemy';s.color=0xe8777d;s.frozen=0;s.ordinary=ordinary;
  this.shotOrigins.set(id,{generation:this.enemyShots.generation[id],origin:{...origin,id,generation:this.enemyShots.generation[id]},owner,ownerGeneration:owner===undefined?undefined:this.enemies.generation[owner]});
  if(delay>0)this.emit({type:'warning',x,y,angle,color:0xb65e8a,size:radius+9,duration:delay,priority:true});
 }
 cancelEnemyProjectiles(owner:number,ownerGeneration:number){this.cancelOwnedShots(owner,ownerGeneration);}
 private cancelOwnedShots(owner:number,ownerGeneration:number){for(const id of [...this.enemyShots.active]){const source=this.shotOrigins.get(id);if(source?.generation===this.enemyShots.generation[id]&&source.owner===owner&&source.ownerGeneration===ownerGeneration){this.enemyShots.release(id);this.shotOrigins.delete(id);}}}
 freezeHostiles(radius:number,seconds:number){const p=this.player;for(const id of this.enemyShots.active){const s=this.enemyShots.data[id];if(s.ordinary&&distanceSq(p.x,p.y,s.x,s.y)<=radius**2)s.frozen=Math.max(s.frozen,seconds);}for(const h of this.hazards)if(h.ordinary!==false&&distanceSq(p.x,p.y,h.x,h.y)<=radius**2)h.frozen=Math.max(h.frozen??0,seconds);}
 cancelProjectiles(radius:number,limit=Infinity){const p=this.player;let count=0;for(const id of [...this.enemyShots.active]){const s=this.enemyShots.data[id];if(count>=limit)break;if(distanceSq(p.x,p.y,s.x,s.y)<=radius**2){this.enemyShots.release(id);count++;this.emit({type:'block',x:s.x,y:s.y,color:0xffffff,size:15});}}}
 clearEnemies(radius:number,source:ContentDamageSource,percent:Partial<Record<EnemyRank,[number,number]>>){const p=this.player,e=this.enemies;for(const id of [...e.active]){if(e.hp[id]<=0||distanceSq(p.x,p.y,e.x[id],e.y[id])>radius**2)continue;const rank=rankName(e.rank[id]),value=percent[rank],damage=rank==='normal'||rank==='bossAdd'?e.hp[id]+e.shield[id]:value?Math.min(e.maxHp[id]*value[0],value[1]):0;this.hitEnemy(id,damage,source,p.x,p.y,3,false,false,true,true);}this.cancelProjectiles(radius);this.danger.cancelNear(p,radius);this.emit({type:'ring',x:p.x,y:p.y,color:0xe9bf5e,size:radius,duration:.8,text:'提前交稿！'});this.impact(8,.05);}
 private updateEnemyShots(dt:number){const p=this.player,speed=relicBulletSpeed(this.relics)*(this.manifest.dailyRule==='lastMinute'?1.2:1)*(this.activeEvent==='rainstorm'?.85:1);for(let n=this.enemyShots.active.length-1;n>=0;n--){const id=this.enemyShots.active[n],s=this.enemyShots.data[id];if(s.frozen>0){s.frozen=Math.max(0,s.frozen-dt);continue;}s.life-=dt;s.age+=dt;if(s.life<=0){this.enemyShots.release(id);continue;}if(s.age<0)continue;s.prevX=s.x;s.prevY=s.y;s.x+=s.vx*dt*speed;s.y+=s.vy*dt*speed;if(segmentDistanceSq(p.x,p.y,s.prevX,s.prevY,s.x,s.y)<(s.radius+12)**2){const stored=this.shotOrigins.get(id);this.hurtPlayer(s.damage,s.prevX,s.prevY,stored?.generation===this.enemyShots.generation[id]?stored.origin:{kind:'projectile',id,generation:this.enemyShots.generation[id],tier:'normal'});this.enemyShots.release(id);}}}
 addHazard(kind:S2Hazard['kind'],x:number,y:number,x2:number,y2:number,radius:number,warning:number,life:number,damage:number,safeAngle?:number,extra:HazardOptions={}){
  const owner=extra.owner??(this.bossActive&&this.bossEnemy>=0?this.bossEnemy:undefined),tier=extra.tier??(owner!==undefined?this.originForEnemy(owner).tier:this.bossActive?'boss':extra.ordinary===false?'elite':'normal');
  const h={id:this.hazardId++,kind,x,y,x2,y2,radius,warning,life,damage,hit:false,safeAngle,ordinary:!this.bossActive,...(owner!==undefined?{owner,ownerGeneration:this.enemies.generation[owner],cancelOnDeath:true}:{}),...extra};
  return this.danger.request(h,tier,this.frame,extra.trackPlayer);
 }
 private updateHazards(){
  const p=this.player;
  this.danger.update(this.frame,this.week,p,this.combatStats.speed,h=>h.owner===undefined||this.enemySourceAlive(h.owner,h.ownerGeneration??0),h=>this.emit({type:'warning',x:h.x,y:h.y,x2:h.x2,y2:h.y2,color:0xeb9b6b,size:h.radius,duration:h.warningTotal,priority:true}));
  for(const h of this.hazards){
   if(h.phase!=='active'||h.hit||!h.damage||(h.frozen??0)>0)continue;
   const collision=h.kind==='ring'?Math.abs(Math.hypot(p.x-h.x,p.y-h.y)-ringRadius(h))<20&&dangerContains(h,p,12,false):dangerContains(h,p,12,false);
   if(collision){this.hurtPlayer(h.damage,h.x,h.y,{kind:'hazard',id:h.id,generation:0,tier:h.tier});h.hit=true;}
  }
 }
 spawnDrop(kind:DropKind,x:number,y:number,value:number){if(kind==='xp')this.metrics.generatedXp+=value;if(this.drops.active.length>2100)this.mergeExperience();let id=this.drops.acquire();if(id<0){if(kind==='xp'){const existing=this.drops.active.find(n=>this.drops.data[n].kind==='xp');if(existing!==undefined){this.drops.data[existing].value+=value;return;}}this.collectFarExperience();id=this.drops.acquire();if(id<0){this.poolFailures++;return;}}const d=this.drops.data[id],point=this.safePoint(x,y);d.x=point.x;d.y=point.y;d.kind=kind;d.value=value;d.age=0;d.attract=false;d.vx=0;d.vy=0;}
 private updateDrops(dt:number){const p=this.player;for(let n=this.drops.active.length-1;n>=0;n--){const id=this.drops.active[n],d=this.drops.data[id];d.age+=dt;if(d.kind==='heal'&&p.hp>=this.stats.maxHp){d.attract=false;continue;}const dx=p.x-d.x,dy=p.y-d.y,distance=Math.hypot(dx,dy)||1;if(distance<(d.kind==='xp'?this.stats.magnet:48))d.attract=true;if(d.attract){const speed=Math.min(1050,220+d.age*180);d.x+=dx/distance*Math.min(distance,speed*dt);d.y+=dy/distance*Math.min(distance,speed*dt);}if(distance<18||(d.attract&&distance<35&&d.age>.3)){const kind=d.kind,value=d.value;this.drops.release(id);this.emit({type:'pickup',x:p.x,y:p.y,color:0x49b9a4,size:5});if(kind==='xp'){this.metrics.collectedRawXp+=value;this.addExperience(value*this.stats.xp*(this.landmarks.zone?.id==='library'?1.15:1));}else if(kind==='chest')this.rewards.chests.push(clamp(value,1,3));else applyPickup(this,kind,value);}}}
 mergeExperience(){const cells=new Map<number,number>();for(let n=this.drops.active.length-1;n>=0;n--){const id=this.drops.active[n],d=this.drops.data[id];if(d.kind!=='xp'||d.attract)continue;const size=this.drops.active.length>1600?128:48,key=Math.floor(d.x/size)*128+Math.floor(d.y/size),previous=cells.get(key);if(previous===undefined){cells.set(key,id);continue;}const other=this.drops.data[previous],total=other.value+d.value,point=this.safePoint((other.x*other.value+d.x*d.value)/total,(other.y*other.value+d.y*d.value)/total);other.x=point.x;other.y=point.y;other.value=total;this.drops.release(id);}}
 private collectFarExperience(){let value=0;for(let n=this.drops.active.length-1;n>=0;n--){const id=this.drops.active[n],d=this.drops.data[id];if(d.kind==='xp'){value+=d.value;this.drops.release(id);}}if(value){this.metrics.collectedRawXp+=value;this.addExperience(value*this.stats.xp);}}
 totalDroppedXp(){return this.drops.active.reduce((sum,id)=>sum+(this.drops.data[id].kind==='xp'?this.drops.data[id].value:0),0);}
 magnet(){for(const id of this.drops.active)if(this.drops.data[id].kind==='xp')this.drops.data[id].attract=true;this.message('磁铁 · 全校园学分正在赶来');this.emit({type:'ring',x:this.player.x,y:this.player.y,color:0x52b7b8,size:500,duration:.5});}
 bomb(){applyPickup(this,'bomb');}
 addExperience(value:number){value=this.inheritanceExperience(value);this.metrics.creditedXp+=Math.max(0,value);this.xp+=Math.max(0,value);while(this.xp>=xpForLevel(this.level)){this.xp-=xpForLevel(this.level);this.level++;this.pendingLevels++;this.metrics.firstUpgrade??=this.combatTime;}if(this.pendingLevels&&this.phase==='playing'&&this.levelFeedbackFrame!==this.frame){this.levelFeedbackFrame=this.frame;this.emit({type:'level',x:this.player.x,y:this.player.y,color:0xf1c965,size:160});}}
 private openDraft(){if(this.pendingLevels<=0)return;this.pendingLevels--;this.drafts++;this.draftToken=this.rewards.nextToken();this.cards=draftCards(this.content,this.weapons,this.passives,this.stats.luck,this.draftRandom,this.combatTime<180,{weapons:this.manifest.weapons,passives:this.manifest.passives,consumed:this.consumed},this.drafts<=4&&!this.offeredNew);this.offeredNew||=this.cards.some(c=>c.type==='weapon'&&c.id.startsWith('s2:'));this.setPhase('draft');}
 private applyCard(index:number,token?:number){if(this.phase!=='draft'||token!==undefined&&token!==this.draftToken)return;const card=this.cards[index];if(!card)return;if(card.type==='heal')this.heal(30);else if(card.type==='shield')this.addShield(30,12*this.stats.duration);else if(card.type==='credit')this.bonusCredits+=3;else{const owned=card.type==='weapon'?this.weapons:this.passives,existing=owned.find(w=>w.id===card.id);if(existing)existing.level=Math.min(5,existing.level+1);else if(owned.length<6){const skill:ContentSkill={id:card.id as ContentSkill['id'],instanceId:this.nextInstance(),kind:'base',level:1,rarity:card.rarity,evolved:false};owned.push(skill);this.discover(skill.id);}this.recalculateStats();this.weaponSystem.reset(card.id);if(this.weapons[0]?.level===5)this.metrics.mainLv5??=this.combatTime;}this.cards=[];this.setPhase('playing');this.handlePending();}
 openChest(boss=false,preferred=''){this.rewards.openChest(boss?3:1,boss,preferred);}
 openContract(){this.rewards.openContract();}
 dispose(){if(this.disposed)return;this.disposed=true;this.inputX=this.inputY=0;for(const skill of this.weapons)this.weaponSystem.remove(skill.id);this.weaponSystem.summons.remove('s2:drone');this.weaponSystem.whiteboard.remove();this.rewards.clear();this.visualEvents.length=0;this.enemies.clear();this.shots.clear();this.enemyShots.clear();this.areas.clear();this.drops.clear();this.deaths.clear();this.protocol.clear();this.echo.clear();this.danger.clear();this.threats.clear();this.advanced.clear();this.shotOrigins.clear();this.incomingHits.length=0;}
}
