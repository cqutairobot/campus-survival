import { segmentDistanceSq } from '../core/math';
export function sweptHit(ax:number,ay:number,bx:number,by:number,x:number,y:number,radius:number){return segmentDistanceSq(x,y,ax,ay,bx,by)<=radius*radius;}
export function actualDamage(hp:number,damage:number){return Math.min(Math.max(0,hp),Math.max(0,damage));}
export function inCone(px:number,py:number,x:number,y:number,angle:number,radius:number,spread:number,extraRadius=0){
  const dx=x-px,dy=y-py,d=Math.hypot(dx,dy);if(d>radius+extraRadius)return false;
  return d<extraRadius||(dx*Math.cos(angle)+dy*Math.sin(angle))/(d||1)>=Math.cos(spread*.5);
}

import {WEAPON_MAP} from '../data/catalog';
import {ULTIMATE_MAP} from '../data/ultimates';
import {PICKUP_MAP} from '../data/pickups';
import type {DamageSource,WeaponKind} from '../types';
export const asSource=(source:WeaponKind|DamageSource):DamageSource=>typeof source==='string'?{kind:'weapon',id:source}:source;
export const damageKey=(source:DamageSource)=>source.kind==='weapon'?source.id:`${source.kind}:${source.id}`;
export function damageLabel(key:string){const [kind,id]=key.includes(':')?key.split(':'):['weapon',key],def=kind==='weapon'?WEAPON_MAP[id]:kind==='ultimate'?ULTIMATE_MAP[id]:kind==='pickup'?PICKUP_MAP[id]:null;return{name:def?.name??'校园环境',color:def?.color??'#99aa99',icon:kind==='weapon'?WEAPON_MAP[id]?.icon??'bolt':kind==='pickup'?'card':'bolt'};}
