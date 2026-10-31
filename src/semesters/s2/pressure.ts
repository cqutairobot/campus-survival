import {clamp} from '../../core/math';

/** S2 multipliers apply once to catalogue bases, never to S1 week values. */
export const PRESSURE_POINTS = [
 {week:1,rate:4,hp:1.25,damage:1.05,speed:1,normalCap:240,eliteCap:0},
 {week:4,rate:7.5,hp:1.75,damage:1.2,speed:1.06,normalCap:360,eliteCap:2},
 {week:8,rate:14,hp:2.5,damage:1.4,speed:1.13,normalCap:560,eliteCap:2},
 {week:12,rate:23,hp:2.95,damage:1.65,speed:1.2,normalCap:760,eliteCap:2},
 {week:16,rate:32,hp:3.3,damage:1.85,speed:1.25,normalCap:960,eliteCap:2},
 {week:20,rate:42,hp:3.6,damage:2,speed:1.28,normalCap:1120,eliteCap:3},
 {week:24,rate:50,hp:3.85,damage:2.1,speed:1.3,normalCap:1200,eliteCap:3},
] as const;
export function pressureAt(week:number){
 const w=clamp(Math.floor(week),1,24),right=PRESSURE_POINTS.find(p=>p.week>=w)!,left=PRESSURE_POINTS[Math.max(0,PRESSURE_POINTS.indexOf(right)-1)],t=right===left?0:(w-left.week)/(right.week-left.week);
 const mix=(key:'rate'|'hp'|'damage'|'speed'|'normalCap'|'eliteCap')=>left[key]+(right[key]-left[key])*t;
 return{week:w,rate:mix('rate'),hp:mix('hp'),damage:mix('damage'),speed:mix('speed'),normalCap:Math.round(mix('normalCap')),eliteCap:Math.floor(mix('eliteCap')),majorCap:w<=16?2:3};
}

// P07 replaces these internal legacy actors with the new chapter threats.
export const MINI_BOSS_SLOTS=[{week:6,kind:'inspector'},{week:13,kind:'teamlead'},{week:20,kind:'inspector'}] as const;
export const eliteSeconds=(week:number)=>week<4?[]:week>=9&&!MINI_BOSS_SLOTS.some(s=>s.week===week)?[12,32]:[12];

/** Independent 24-week weights. The injected catalogue supplies the IDs; every
 * legacy normal retains a reachable, nonzero late-semester allocation. */
const NORMAL_WEIGHTS:Readonly<Record<string,readonly number[]>>={
 homework:[72,28,22],checkin:[28,18,14],ppt:[0,14,11],review:[0,10,8],receipt:[0,6,5],thrower:[0,8,8],
 charger:[0,7,8],splitter:[0,7,6],bomber:[0,4,5],summoner:[0,3,4],guard:[0,4,5],leader:[0,3,4],
};
export function normalWeight(id:string,week:number){
 const values=NORMAL_WEIGHTS[id];if(!values)return 0;
 const w=clamp(Math.floor(week),1,24),a=w<=9?0:1,b=a+1,t=w<=9?(w-1)/8:(w-9)/15;
 return values[a]+(values[b]-values[a])*t;
}
