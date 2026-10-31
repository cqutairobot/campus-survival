import {distanceSq} from '../../core/math';
import type {ContentState} from './legacy/ContentState';
import type {ContentEnemyDef} from './legacy/catalog';
import type {S2Hazard} from './danger';

export const ADVANCED_WEEKS={'s2:peer':9,'s2:relay':12,'s2:recycler':17} as const;
export const ADVANCED_ENEMIES:readonly ContentEnemyDef[]=[
 {id:'s2:peer',name:'互评小组',rank:'normal',behavior:'peer',tags:[],hp:32,speed:55,damage:8,xp:3,radius:18,color:'#72a9b5',from:9},
 {id:'s2:relay',name:'数据同步器',rank:'normal',behavior:'relay',tags:['ranged'],hp:42,speed:0,damage:6,xp:3,radius:23,color:'#cbb56b',from:12},
 {id:'s2:recycler',name:'回收机器人',rank:'normal',behavior:'recycler',tags:['heavy'],hp:60,speed:43,damage:10,xp:4,radius:23,color:'#8ab16d',from:17},
 {id:'s2:marshal',name:'联展秩序员',rank:'elite',behavior:'marshal',tags:[],hp:600,speed:38,damage:12,xp:16,radius:24,color:'#d38b69',from:9},
 {id:'s2:coordinator',name:'项目协调员',rank:'elite',behavior:'coordinator',tags:[],hp:600,speed:36,damage:12,xp:16,radius:24,color:'#ad91bd',from:12},
 {id:'s2:auditor',name:'联合验收员',rank:'miniBoss',behavior:'auditor',tags:[],hp:16000,speed:35,damage:20,xp:80,radius:38,color:'#b7a26a',from:13},
];
const SUPPORT_CAPS:Readonly<Record<string,number>>={summoner:4,leader:3,'s2:relay':2,'s2:peer':4,'s2:coordinator':2};
interface Identity {id:number;generation:number}
interface Link {kind:'peer'|'insurance'|'coordinator';owner:Identity;targets:Identity[];grants:{identity:Identity;amount:number}[]}
interface Actor {generation:number;next:number;side:number;handle?:S2Hazard;exposed:number;nodesAt:number}

/** Sources, links, remains and pending casts are run-local and generation-bound. */
export class AdvancedEnemies {
 private links:Link[]=[];private actors=new Map<number,Actor>();private paired=new Set<string>();
 private corpses:{x:number;y:number;expires:number}[]=[];
 constructor(private g:ContentState){}
 private identity(id:number):Identity{return{id,generation:this.g.enemies.generation[id]};}
 private alive(i:Identity){return this.g.enemies.valid(i.id,i.generation)&&this.g.enemies.hp[i.id]>0;}
 canSpawn(kind:string){const cap=SUPPORT_CAPS[kind];if(!cap)return true;const counts=this.supportCounts();return(counts[kind]??0)<cap&&counts.total<8;}
 supportCounts(){const e=this.g.enemies,result:Record<string,number>={total:0};for(const id of e.active){const kind=this.g.content.enemies[e.kind[id]].id;if(e.hp[id]>0&&kind in SUPPORT_CAPS&&e.owner[id]<0){result[kind]=(result[kind]??0)+1;result.total++;}}return result;}
 private actor(id:number){let a=this.actors.get(id);if(a?.generation!==this.g.enemies.generation[id]){a={generation:this.g.enemies.generation[id],next:this.g.combatTime+1.2,side:0,exposed:0,nodesAt:this.g.combatTime+.5};this.actors.set(id,a);}return a!;}
 private shield(id:number,amount:number,cap=.45){const e=this.g.enemies,before=e.shield[id];e.shield[id]=Math.min(e.maxHp[id]*cap,e.shield[id]+amount);return e.shield[id]-before;}
 private dropLink(link:Link){const e=this.g.enemies;for(const {identity,amount} of link.grants)if(e.valid(identity.id,identity.generation))e.shield[identity.id]=Math.max(0,e.shield[identity.id]-amount);this.links.splice(this.links.indexOf(link),1);}
 private prune(){for(const l of [...this.links])if(!this.alive(l.owner)||l.targets.some(i=>!this.alive(i)))this.dropLink(l);}
 forget(id:number,generation:number){
  const e=this.g.enemies;for(const l of [...this.links])if(l.owner.id===id&&l.owner.generation===generation||l.targets.some(t=>t.id===id&&t.generation===generation))this.dropLink(l);
  if(e.valid(id,generation)&&e.owner[id]>=0&&this.g.content.enemies[e.kind[e.owner[id]]]?.id==='s2:auditor'&&e.valid(e.owner[id],e.ownerGeneration[id])){const a=this.actor(e.owner[id]);a.exposed=this.g.combatTime+2;a.nodesAt=this.g.combatTime+8;}
  if(this.actors.get(id)?.generation===generation)this.actors.delete(id);
 }
 clear(){for(const l of [...this.links])this.dropLink(l);this.actors.clear();this.paired.clear();this.corpses.length=0;}
 death(id:number){const g=this.g,e=g.enemies;if(e.owner[id]<0&&e.rank[id]===0){this.corpses.push({x:e.x[id],y:e.y[id],expires:g.combatTime+8});while(this.corpses.length>128)this.corpses.shift();}}
 aftershock(id:number){const g=this.g,e=g.enemies;if(!(e.affixes[id]&128)||e.owner[id]>=0)return;g.addHazard('ring',e.x[id],e.y[id],0,0,240,1.3,1.1,18,Math.atan2(g.player.y-e.y[id],g.player.x-e.x[id]),{ordinary:false,tier:'elite',cancelOnDeath:false});}
 /** Old inspector reduction and new reductions share one finite ceiling. */
 reduction(id:number){this.prune();const g=this.g,e=g.enemies,kind=g.content.enemies[e.kind[id]].id;
  if(kind==='inspector'&&e.active.some(n=>e.hp[n]>0&&e.owner[n]===id&&e.ownerGeneration[n]===e.generation[id]&&g.content.enemies[e.kind[n]].id==='node'))return .4;
  if(kind==='s2:auditor'){const a=this.actor(id);if(g.combatTime<a.exposed)return 0;return e.active.some(n=>e.hp[n]>0&&e.owner[n]===id&&e.ownerGeneration[n]===e.generation[id])?.2:0;}
  return this.links.some(l=>l.kind==='coordinator'&&l.owner.id===id&&l.owner.generation===e.generation[id])?.2:0;
 }
 snapshot(){this.prune();return{support:this.supportCounts(),links:this.links.map(l=>({kind:l.kind,owner:{...l.owner},targets:l.targets.map(i=>({...i}))})),actors:[...this.actors].map(([id,a])=>({id,generation:a.generation,exposed:Math.max(0,a.exposed-this.g.combatTime),attackPhase:a.handle?.phase??null,side:a.side})),remains:this.corpses.length};}
 private nearby(id:number,count=2){const e=this.g.enemies;return e.active.filter(n=>n!==id&&e.hp[n]>0&&e.owner[n]<0&&e.rank[n]===0&&distanceSq(e.x[id],e.y[id],e.x[n],e.y[n])<=240**2).sort((a,b)=>distanceSq(e.x[id],e.y[id],e.x[a],e.y[a])-distanceSq(e.x[id],e.y[id],e.x[b],e.y[b])||a-b).slice(0,count).map(n=>this.identity(n));}
 private link(id:number,kind:Link['kind'],targets:Identity[]){if(!targets.length)return;const e=this.g.enemies,owner=this.identity(id),grants:Link['grants']=[];if(kind!=='coordinator'){const members=kind==='peer'?[owner,...targets]:[owner],total=e.maxHp[id]*.25;for(const identity of members){const amount=this.shield(identity.id,Math.min(total/members.length,e.maxHp[identity.id]*.2));grants.push({identity,amount});}}this.links.push({kind,owner,targets,grants});}
 update(dt:number){
  const g=this.g,e=g.enemies;this.prune();this.corpses=this.corpses.filter(c=>c.expires>g.combatTime);
  for(const id of [...e.active]){
   if(e.hp[id]<=0)continue;const kind=g.content.enemies[e.kind[id]].id;
   if(e.affixes[id]&64&&!this.links.some(l=>l.kind==='insurance'&&l.owner.id===id)){const key=`insurance:${id}:${e.generation[id]}`;if(!this.paired.has(key)){this.paired.add(key);this.link(id,'insurance',this.nearby(id));}}
   if(kind==='s2:peer'){
    const key=`peer:${id}:${e.generation[id]}`;if(!this.paired.has(key)&&this.links.filter(l=>l.kind==='peer').length<2){const other=e.active.find(n=>n!==id&&e.hp[n]>0&&g.content.enemies[e.kind[n]].id===kind&&!this.paired.has(`peer:${n}:${e.generation[n]}`)&&distanceSq(e.x[id],e.y[id],e.x[n],e.y[n])<280**2);if(other!==undefined){this.paired.add(key);this.paired.add(`peer:${other}:${e.generation[other]}`);this.link(id,'peer',[this.identity(other)]);}}
   }else if(kind==='s2:coordinator'){
    const key=`coordinator:${id}:${e.generation[id]}`;if(!this.paired.has(key)){this.paired.add(key);this.link(id,'coordinator',this.nearby(id));}
   }else if(kind==='s2:relay'){
    const a=this.actor(id);if(e.frozen[id]<=0&&g.combatTime>=a.next){a.next=g.combatTime+2.5;for(const t of this.nearby(id,8))this.shield(t.id,e.maxHp[t.id]*.03);g.emit({type:'ring',x:e.x[id],y:e.y[id],size:240,color:0xcbb56b,duration:.5});}
   }else if(kind==='s2:recycler'&&e.frozen[id]<=0){
    const n=this.corpses.findIndex(c=>distanceSq(c.x,c.y,e.x[id],e.y[id])<150**2);if(n>=0){this.corpses.splice(n,1);this.shield(id,e.maxHp[id]*.04,.2);}
   }else if((kind==='s2:marshal'||kind==='s2:auditor')&&e.frozen[id]<=0)this.cast(id,kind,dt);
  }
 }
 private cast(id:number,kind:string,_dt:number){
  const g=this.g,e=g.enemies,p=g.player,a=this.actor(id),options={owner:id,ownerGeneration:e.generation[id],cancelOnDeath:true,ordinary:false,tier:'elite' as const};
  if(a.handle){if(a.handle.phase!=='cancelled'){e.state[id]=a.handle.phase==='active'?2:1;return;}a.handle=undefined;a.next=g.combatTime+(kind==='s2:auditor'?2.5:1.4);e.state[id]=3;}
  if(kind==='s2:auditor'&&g.combatTime>=a.nodesAt&&g.combatTime>=a.exposed){a.nodesAt=g.combatTime+10;const own=e.active.filter(n=>e.owner[n]===id&&e.ownerGeneration[n]===e.generation[id]&&e.hp[n]>0);for(let n=own.length;n<2;n++){const node=g.spawnSummon('node',id,e.x[id]+(n?105:-105),e.y[id]-65,12,true);if(node>=0){e.hp[node]=e.maxHp[node]=420;e.shield[node]=e.maxShield[node]=0;}}}
  if(g.combatTime<a.next||g.combatTime<a.exposed)return;
  if(kind==='s2:marshal'){
   // Two narrow parallel channels alternate around a 160px clear middle lane.
   const side=a.side++%2?1:-1,x=p.x+side*190;a.handle=g.addHazard('line',x,p.y-350,x,p.y+350,30,1.4,.6,18,undefined,options);
  }else a.handle=g.addHazard('circle',p.x,p.y,0,0,78,1.5,.35,22,undefined,options);
  if(!a.handle)a.next=g.combatTime+.5;
 }
}
