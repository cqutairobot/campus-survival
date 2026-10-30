import type {EnemyDef,EnemyRank} from '../types';
export const NEW_ENEMIES:EnemyDef[]=[
 {id:'thrower',name:'试卷投手',rank:'normal',behavior:'thrower',tags:['ranged'],hp:18,speed:46,damage:6,xp:2,radius:15,color:'#c7a3d7',from:3},
 {id:'charger',name:'早八冲刺',rank:'normal',behavior:'charge',tags:[],hp:16,speed:70,damage:7,xp:1,radius:14,color:'#e59b73',from:4},
 {id:'splitter',name:'复印副本',rank:'normal',behavior:'split',tags:['split'],hp:20,speed:58,damage:6,xp:2,radius:15,color:'#94b8c6',from:5},
 {id:'bomber',name:'实验事故球',rank:'normal',behavior:'bomber',tags:[],hp:14,speed:90,damage:5,xp:1,radius:14,color:'#df9c86',from:7},
 {id:'summoner',name:'课代表',rank:'normal',behavior:'summon',tags:['support'],hp:26,speed:42,damage:7,xp:3,radius:17,color:'#9faac9',from:10},
 {id:'guard',name:'盖章盾卫',rank:'normal',behavior:'shield',tags:['shield'],hp:26,speed:44,damage:8,xp:3,radius:18,color:'#84b8ae',from:9},
 {id:'leader',name:'内卷领队',rank:'normal',behavior:'aura',tags:['support'],hp:24,speed:52,damage:8,xp:3,radius:17,color:'#dbb877',from:13},
 {id:'inspector',name:'实验验收员',rank:'miniBoss',behavior:'inspector',tags:[],hp:4800,speed:50,damage:14,xp:60,radius:36,color:'#7baec6',from:11},
 {id:'teamlead',name:'课程设计组长',rank:'miniBoss',behavior:'teamlead',tags:[],hp:10000,speed:55,damage:18,xp:80,radius:40,color:'#be9bce',from:18},
 {id:'node',name:'护盾节点',rank:'bossAdd',behavior:'node',tags:['summoned','shield'],hp:160,speed:0,damage:0,xp:0,radius:16,color:'#88cdda',from:11},
 {id:'examCharger',name:'考试冲锋兵',rank:'bossAdd',behavior:'charge',tags:['summoned','exam'],hp:120,speed:70,damage:14,xp:0,radius:19,color:'#d78184',from:22},
];
export const RANK_CODE:Record<EnemyRank,number>={normal:0,elite:1,miniBoss:2,boss:3,bossAdd:4};
export const RANKS:EnemyRank[]=['normal','elite','miniBoss','boss','bossAdd'];
export const rankName=(rank:number)=>RANKS[rank]??'normal';
