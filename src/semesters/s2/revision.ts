import type {ContentState} from './legacy/ContentState';
import {assessmentEntry,worldSlideMove,type AssessmentEntry} from './world';
import {distanceSq} from '../../core/math';

/** Explicit S2 exam values. The frozen definitions and legacy phase scripts
 * remain unchanged; no legacy graduation/reward tail is called here. */
export const REVISION_PARAMETERS={
 inspector:{hp:14000,damage:20,attackScale:1.2,speed:50,rank:'miniBoss'},
 teamlead:{hp:22000,damage:24,attackScale:1.25,speed:55,rank:'miniBoss'},
 proposal:{hp:26000,damage:24,attackScale:1.3,speed:35,rank:'boss'},
 defense:{hp:38000,damage:28,attackScale:1.4,speed:28,rank:'boss'},
 finals:{hp:58000,damage:30,attackScale:1.5,speed:22,rank:'boss'},
} as const;
export const REVISION_ATTACHMENTS={node:{hp:360,damage:0},math:{hp:480,damage:0},english:{hp:480,damage:0},coding:{hp:480,damage:0},mechanics:{hp:480,damage:0},examCharger:{hp:360,damage:20}} as const;
export type RevisionId=keyof typeof REVISION_PARAMETERS;
interface Round {id:RevisionId;actor:number;generation:number;entry:AssessmentEntry;returnTo:{x:number;y:number};started:number}
export class RevisionSystem {
 used=false;selecting=false;token=0;active:Round|null=null;readonly defeated:RevisionId[]=[];
 constructor(private g:ContentState){}
 get locked(){return this.used?'本局复习机会已使用':this.g.week<18?'第18周起开放':this.g.bossActive?'考核期间不可复习':!this.g.director.canReserveRevision()?'本周普通精英机会已用完':'';}
 open(){if(this.locked||this.g.hasPendingRewards||this.active)return false;this.selecting=true;this.token=this.g.rewards.nextToken();this.g.setPhase('contract');return true;}
 choose(token:number,id:unknown){
  const g=this.g;if(!this.selecting||token!==this.token)return false;
  if(id===null){this.selecting=false;g.setPhase('playing');return true;}
  if(typeof id!=='string'||!Object.hasOwn(REVISION_PARAMETERS,id)||this.locked)return false;
  let entry:AssessmentEntry;try{entry=assessmentEntry(g.world,g.player);}catch{return false;}
  if(!g.director.reserveRevision())return false;
  this.selecting=false;this.used=true;const returnTo={x:g.player.x,y:g.player.y};g.events.cancel();g.clearThreats(true);g.setPhase('playing');g.bossActive=true;g.bossStage=1;
  Object.assign(g.player,{...entry.site.player,prevX:entry.site.player.x,prevY:entry.site.player.y,vx:0,vy:0});
  const kind=id as RevisionId,parameters=REVISION_PARAMETERS[kind],actor=g.spawnEnemy(kind,entry.site.boss.x,entry.site.boss.y),e=g.enemies;
  if(actor<0){g.bossActive=false;return false;}
  e.hp[actor]=e.maxHp[actor]=parameters.hp;e.damage[actor]=parameters.damage;e.speed[actor]=parameters.speed;e.xp[actor]=e.rewardWeight[actor]=e.reward[actor]=0;
  this.active={id:kind,actor,generation:e.generation[actor],entry,returnTo,started:g.combatTime};g.bossEnemy=parameters.rank==='boss'?actor:-1;g.bossSystem.reset();g.navigation.rebuild(g.player.x,g.player.y,true);g.rebuildGrid();g.message(`旧课复习 · ${g.content.enemyById[kind].name} · 选修不推进周历`,6);return true;
 }
 isActor(id:number,generation:number){return this.active?.actor===id&&this.active.generation===generation;}
 damageScale(owner?:number){if(owner===undefined||!this.active)return 1;const e=this.g.enemies;for(let depth=0;depth<e.capacity;depth++){if(this.isActor(owner,e.generation[owner]))return REVISION_PARAMETERS[this.active.id].attackScale;if(e.owner[owner]<0||!e.valid(e.owner[owner],e.ownerGeneration[owner]))break;owner=e.owner[owner];}return 1;}
 attachment(id:number){if(!this.active)return;const e=this.g.enemies,kind=this.g.content.enemies[e.kind[id]].id;if(Object.hasOwn(REVISION_ATTACHMENTS,kind)){const p=REVISION_ATTACHMENTS[kind as keyof typeof REVISION_ATTACHMENTS];e.hp[id]=e.maxHp[id]=p.hp;e.damage[id]=p.damage;}}
 win(id:number,generation:number){const a=this.active;if(!a||!this.isActor(id,generation))return false;const won=this.g.player.hp>0;if(won){this.defeated.push(a.id);this.g.completedSideBranches.add(`revision:${a.id}`);}this.finish(won);return true;}
 exit(){if(!this.active)return false;this.finish(false);return true;}
 private finish(won:boolean){
  const g=this.g,a=this.active!;this.active=null;g.clearThreats(true);g.bossActive=false;g.bossStage=1;g.bossEnemy=-1;
  Object.assign(g.player,{...a.returnTo,prevX:a.returnTo.x,prevY:a.returnTo.y,vx:0,vy:0});g.player.invincible=Math.max(g.player.invincible,.75);g.navigation.rebuild(g.player.x,g.player.y,true);
  // Preserve the existing table's remaining opportunity across an elective.
  if(g.projectTables.active)g.projectTables.active.expires+=g.combatTime-a.started;
  if(won)g.rewards.openReinforcement(2);g.message(won?'选修击败 · 两份普通强化；主线继续':'已退出复习 · 未发放奖励；主线继续',4);
 }
 constrain(){const a=this.active;if(!a)return;const p=this.g.player,c=a.entry.site.center,r=a.entry.site.radius+72;if(distanceSq(p.x,p.y,c.x,c.y)<=r*r)return;const d=Math.hypot(p.x-c.x,p.y-c.y),to=worldSlideMove(this.g.world,c.x,c.y,(p.x-c.x)*r/d,(p.y-c.y)*r/d,12);p.x=to.x;p.y=to.y;}
 cancel(){this.selecting=false;if(this.active)this.finish(false);}
 snapshot(){return{used:this.used,selecting:this.selecting,token:this.token,defeated:[...this.defeated],active:this.active?structuredClone(this.active):null,options:Object.entries(REVISION_PARAMETERS).map(([id,p])=>({id,name:this.g.content.enemyById[id].name,...p}))};}
}

/** Reachable production entrances, including attachments created by old phases. */
export const LEGACY_ENEMY_ENTRIES={
 homework:'ordinary',checkin:'ordinary',ppt:'ordinary',review:'ordinary',receipt:'ordinary',thrower:'ordinary',charger:'ordinary',splitter:'ordinary',bomber:'ordinary',summoner:'ordinary',guard:'ordinary',leader:'ordinary',
 ddl:'ordinaryElite',advisor:'event:advisor',inspector:'revision:inspector',teamlead:'revision:teamlead',proposal:'revision:proposal',defense:'revision:defense',finals:'revision:finals',node:'revision:inspector',math:'revision:finals',english:'revision:finals',coding:'revision:finals',mechanics:'revision:finals',examCharger:'revision:finals',
} as const;
