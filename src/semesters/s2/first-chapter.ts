import type {ContentEnemyDef} from './legacy/catalog';

export const FIRST_THREAT_WEEKS={'s2:bike':1,'s2:reservation':3,'s2:parceler':5} as const;
export const FIRST_CHAPTER_ENEMIES:readonly ContentEnemyDef[]=[
 {id:'s2:bike',name:'校园配送车',rank:'normal',behavior:'bike',tags:[],hp:24,speed:62,damage:8,xp:2,radius:18,color:'#f0a343',from:1},
 {id:'s2:reservation',name:'预约占座牌',rank:'normal',behavior:'reservation',tags:['ranged'],hp:30,speed:36,damage:6,xp:2,radius:17,color:'#459eb5',from:3},
 {id:'s2:parceler',name:'错峰投递员',rank:'normal',behavior:'parceler',tags:['ranged'],hp:32,speed:48,damage:7,xp:3,radius:18,color:'#aa78c2',from:5},
 {id:'s2:dispatcher',name:'外场调度长',rank:'miniBoss',behavior:'dispatcher',tags:[],hp:7000,speed:45,damage:16,xp:60,radius:38,color:'#e0ae52',from:6},
];
/** Melee here excludes old charge, explosion and support mechanics. */
export const LESSON_MELEE=['homework','checkin','ppt','receipt'] as const;
