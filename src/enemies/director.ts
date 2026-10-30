import type {GameEngine} from '../core/engine';
import {ENEMIES} from '../data/catalog';
import {NORMAL_IDS,WAVE_WEIGHTS,WEEK_GROUP} from '../data/waves';
import {RANK_CODE} from '../data/enemies';
import {spawnRate} from '../progression/rules';
import {relicSpawn} from '../progression/relics';
import {configureElite} from './elites';
export class EnemyDirector{
 private budget=0;private scheduled=new Set<string>();readonly pendingElites:number[]=[];
 constructor(private g:GameEngine){}
 update(dt:number){const g=this.g;if(g.bossActive||g.examBoundaryWaiting)return;const w=g.week,e=g.enemies,counts:Record<string,number>={};let normals=0,elites=0;for(const id of e.active){if(e.hp[id]<=0)continue;const def=ENEMIES[e.kind[id]];if(e.rank[id]===RANK_CODE.normal){normals++;counts[def.id]=(counts[def.id]??0)+1;}if(e.rank[id]===RANK_CODE.elite)elites++;}
  let rate=spawnRate(w)*relicSpawn(g.relics);if(g.activeEvent==='examRage')rate*=1.3;if(g.manifest.dailyRule==='piercing')rate*=1.2;if(g.landmarks.rangeTime>0&&g.landmarks.zone?.id==='lab')rate*=1.2;
  this.budget+=dt*rate;while(this.budget>=1){this.budget--;if(normals>=Math.min(1200,160+w*48))continue;const weights=[...WAVE_WEIGHTS[WEEK_GROUP[w-1]]];for(const [kind,cap] of [['summoner',6],['leader',4]] as const){const index=NORMAL_IDS.indexOf(kind);if((counts[kind]??0)>=cap){weights[0]+=weights[index];weights[index]=0;}}
   if(g.activeEvent==='sports')weights[NORMAL_IDS.indexOf('charger')]*=2;if(g.manifest.dailyRule==='construction')weights[NORMAL_IDS.indexOf('guard')]*=2;const kind=g.streams.spawn.weighted(NORMAL_IDS,id=>weights[NORMAL_IDS.indexOf(id)]);g.spawnEnemy(kind);counts[kind]=(counts[kind]??0)+1;normals++;}
  const within=g.semesterTime-(w-1)*40;for(const second of w>=17?[12,32]:[12]){const key=`${w}:${second}`;if(w>=4&&within>=second&&!this.scheduled.has(key)){this.scheduled.add(key);this.pendingElites.push(w);}}
  if(this.pendingElites.length&&elites<(w>=17?3:2)){const spawnWeek=this.pendingElites.shift()!,kind=spawnWeek<=8?'ddl':g.streams.spawn.weighted(['ddl','thrower','charger','guard'],()=>1),id=g.spawnEnemy(kind);if(kind!=='ddl')configureElite(g,id,undefined,spawnWeek);}
  for(const [week,kind] of [[11,'inspector'],[18,'teamlead']] as const){const key=`mini:${week}`;if(w===week&&within>=20&&!this.scheduled.has(key)){this.scheduled.add(key);g.spawnEnemy(kind);g.message(`小 Boss · ${ENEMIES.find(e=>e.id===kind)!.name}，教学时间继续`,6);}}
 }
}
