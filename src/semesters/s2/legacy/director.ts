// S2-only pressure budget and fixed teaching-clock opportunities.
import type {ContentState} from './ContentState';
import {RANK_CODE} from '../../../data/enemies';
import {relicSpawn} from '../../../progression/relics';
import {eliteSeconds,MINI_BOSS_SLOTS,normalWeight,pressureAt} from '../pressure';
import {ADVANCED_WEEKS} from '../advanced-enemies';
import {FIRST_THREAT_WEEKS,LESSON_MELEE} from '../first-chapter';

export class EnemyDirector {
 private budget=0;private scheduled=new Set<string>();readonly pendingElites:number[]=[];
 constructor(private g:ContentState){}
 update(dt:number){
  const g=this.g;if(!g.ordinarySpawnsAllowed||g.bossActive)return;
  const w=g.week,e=g.enemies,curve=pressureAt(w),counts:Record<string,number>={};let normals=0,elites=0,mini=false;
  for(const id of e.active){
   if(e.hp[id]<=0)continue;const def=g.content.enemies[e.kind[id]];
   if(e.rank[id]===RANK_CODE.normal){normals++;counts[def.id]=(counts[def.id]??0)+1;}
   if(e.rank[id]===RANK_CODE.elite)elites++;
   if(e.rank[id]===RANK_CODE.miniBoss)mini=true;
  }
  const within=g.semesterTime-(w-1)*40;
  const lesson=Object.entries({...FIRST_THREAT_WEEKS,...ADVANCED_WEEKS}).find(([id,from])=>w===from&&within<12&&g.content.enemyById[id])?.[0];
  if(lesson&&!this.scheduled.has(`lesson:${lesson}`)){
   this.scheduled.add(`lesson:${lesson}`);
   // Cancel survivors of previous mechanisms without kills, drops or charge.
   for(const id of [...e.active])if(g.content.enemies[e.kind[id]].id!==lesson&&!(e.rank[id]===RANK_CODE.normal&&(LESSON_MELEE as readonly string[]).includes(g.content.enemies[e.kind[id]].id)))g.releaseEnemy(id);
   // Releasing each mechanism source cancels only its own casts and shots.
   normals=e.active.filter(id=>e.hp[id]>0&&e.rank[id]===RANK_CODE.normal).length;
   for(const key of Object.keys(counts))counts[key]=0;
   for(const id of e.active){const kind=g.content.enemies[e.kind[id]].id;counts[kind]=(counts[kind]??0)+1;}
   elites=0;mini=false;g.message(`新威胁 · ${g.content.enemyById[lesson].name}，先观察预警`,5);
  }
  for(const slot of MINI_BOSS_SLOTS){
   const key=`mini:${slot.week}`;
   if(w===slot.week&&within>=20&&!this.scheduled.has(key)){
    this.scheduled.add(key);const id=g.spawnEnemy(slot.kind);
    if(id>=0){mini=true;g.message(`小 Boss · ${g.content.enemyById[slot.kind].name}，教学时间继续`,6);}
   }
  }
  let rate=curve.rate*relicSpawn(g.relics)*(mini?.75:1);
  if(g.activeEvent==='examRage')rate*=1.3;if(g.manifest.dailyRule==='piercing')rate*=1.2;
  if(g.landmarks.rangeTime>0&&g.landmarks.zone?.id==='lab')rate*=1.2;
  // Whole opportunities at the cap are spent, never accumulated for a refill.
  this.budget+=dt*rate;
  while(this.budget>=1-1e-9){
   this.budget=Math.max(0,this.budget-1);if(normals>=curve.normalCap)continue;
   const ids=[...g.content.waves.normalIds],weights=ids.map(id=>w>=g.content.enemyById[id].from?normalWeight(id,w,lesson):0);
   for(const kind of ['summoner','leader','s2:relay','s2:peer']){const index=ids.indexOf(kind);if(index>=0&&!g.advanced.canSpawn(kind)){weights[0]+=weights[index];weights[index]=0;}}
   if(g.activeEvent==='sports')weights[ids.indexOf('charger')]*=2;
   if(g.manifest.dailyRule==='construction')weights[ids.indexOf('guard')]*=2;
   // The first lesson unit spends the next ordinary opportunity. Randomness
   // cannot postpone its first appearance until other mechanisms return.
   const kind=lesson&&!this.scheduled.has(`introduced:${lesson}`)?lesson:g.streams.spawn.weighted(ids,id=>weights[ids.indexOf(id)]),id=g.spawnEnemy(kind);
   if(id>=0){counts[kind]=(counts[kind]??0)+1;normals++;if(kind===lesson)this.scheduled.add(`introduced:${lesson}`);}
  }
  for(const second of eliteSeconds(w)){
   const key=`${w}:${second}`;
   if(within>=second&&!this.scheduled.has(key)){this.scheduled.add(key);if(!this.pendingElites.length)this.pendingElites.push(w);}
  }
  if(!lesson&&this.pendingElites.length&&elites<curve.eliteCap){
   const spawnWeek=this.pendingElites.shift()!,kind=spawnWeek<=8?'ddl':g.streams.spawn.weighted(['ddl','thrower','charger','guard',...(w>=9?['s2:marshal']:[]),...(w>=12&&g.advanced.canSpawn('s2:coordinator')?['s2:coordinator']:[])],()=>1),id=g.spawnEnemy(kind,undefined,undefined,0,spawnWeek);
   if(id<0)this.pendingElites.push(spawnWeek);
  }
 }
}
