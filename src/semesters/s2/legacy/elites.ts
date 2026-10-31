// P04 bounded port of src/enemies/elites.ts; S1 source remains frozen.
import type {ContentState} from './ContentState';
import {RANK_CODE} from '../../../data/enemies';
import {pressureAt} from '../pressure';
export const AFFIXES=[{id:'split',name:'分裂',bit:1,color:0x9fbde5},{id:'shield',name:'护盾',bit:2,color:0x83d6d1},{id:'dash',name:'冲刺',bit:4,color:0xf0a363},{id:'deathBlast',name:'死亡爆炸',bit:8,color:0xf18481},{id:'aura',name:'加速光环',bit:16,color:0xded278},{id:'ranged',name:'远射',bit:32,color:0xbe96e2}];
export function configureElite(g:ContentState,id:number,forced?:string[],scheduledWeek=g.week){if(id<0)return;const e=g.enemies,w=scheduledWeek;e.rank[id]=RANK_CODE.elite;e.hp[id]=e.maxHp[id]=600+70*(w-1);e.xp[id]=12+Math.floor(w/4);e.reward[id]=1;e.rewardWeight[id]=1;e.chainXp[id]=0;e.chainWeight[id]=0;e.damage[id]=g.content.enemies[e.kind[id]].damage*pressureAt(w).damage;e.radius[id]=g.content.enemies[e.kind[id]].radius*1.3;
 e.maxShield[id]=g.content.enemies[e.kind[id]].behavior==='shield'?e.maxHp[id]*.35:0;e.shield[id]=e.maxShield[id];
 const count=Math.min(w>=17?3:w>=9?2:1,(w>=17?2:w>=9?1+Number(g.streams.affix.next()<.5):1)+(g.manifest.dailyRule==='assistants'?1:0));const pool=[...AFFIXES],selected=forced?AFFIXES.filter(a=>forced.includes(a.id)):Array.from({length:count},()=>pool.splice(g.streams.affix.int(0,pool.length-1),1)[0]);e.affixes[id]=selected.reduce((bits,a)=>bits|a.bit,0);e.affixTimer[id]=4.5;e.shootTimer[id]=5;
 if(e.affixes[id]&2){e.maxShield[id]=e.maxHp[id]*.25+(g.content.enemies[e.kind[id]].behavior==='shield'?e.maxHp[id]*.35:0);e.shield[id]=e.maxShield[id];}
 g.emit({type:'warning',x:e.x[id],y:e.y[id],color:0xdfa5ec,size:65,text:selected.map(a=>a.name).join(' · '),duration:.8,priority:true});
}
