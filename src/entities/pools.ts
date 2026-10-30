import { SlotPool } from '../core/pool';
import type { DropKind, WeaponKind } from '../types';
export class EnemyPool extends SlotPool {
  x:Float32Array;y:Float32Array;prevX:Float32Array;prevY:Float32Array;vx:Float32Array;vy:Float32Array;
  hp:Float32Array;maxHp:Float32Array;speed:Float32Array;damage:Float32Array;radius:Float32Array;
  cooldown:Float32Array;timer:Float32Array;state:Uint8Array;angle:Float32Array;kind:Uint8Array;
  flash:Float32Array;slow:Float32Array;slowTime:Float32Array;burn:Float32Array;burnTick:Float32Array;burnDamage:Float32Array;
  xp:Float32Array;reward:Uint8Array;aiX:Float32Array;aiY:Float32Array;aiTimer:Float32Array;
  orbitHits:Float32Array;areaHits:Float32Array;burnSource:WeaponKind[];hitCount:Uint16Array;firstHit:Float64Array;
  rank:Uint8Array;pendingDead:Uint8Array;shield:Float32Array;maxShield:Float32Array;lastHit:Float64Array;affixes:Uint8Array;frozen:Float32Array;immune:Float32Array;freezeAccum:Float32Array;cryoLast:Float64Array;rewardWeight:Float32Array;chainXp:Float32Array;chainWeight:Float32Array;splitGeneration:Uint8Array;owner:Int32Array;ownerGeneration:Uint32Array;lifetime:Float32Array;affixTimer:Float32Array;shootTimer:Float32Array;skillTimer:Float32Array;chargeSequence:Uint8Array;frozenOnce:Uint8Array;fusionHits:Float64Array;
  constructor(capacity=2560){super(capacity);
    this.x=new Float32Array(capacity);this.y=new Float32Array(capacity);this.prevX=new Float32Array(capacity);this.prevY=new Float32Array(capacity);this.vx=new Float32Array(capacity);this.vy=new Float32Array(capacity);
    this.hp=new Float32Array(capacity);this.maxHp=new Float32Array(capacity);this.speed=new Float32Array(capacity);this.damage=new Float32Array(capacity);this.radius=new Float32Array(capacity);
    this.cooldown=new Float32Array(capacity);this.timer=new Float32Array(capacity);this.state=new Uint8Array(capacity);this.angle=new Float32Array(capacity);this.kind=new Uint8Array(capacity);
    this.flash=new Float32Array(capacity);this.slow=new Float32Array(capacity);this.slowTime=new Float32Array(capacity);this.burn=new Float32Array(capacity);this.burnTick=new Float32Array(capacity);
    this.burnDamage=new Float32Array(capacity);
    this.xp=new Float32Array(capacity);this.reward=new Uint8Array(capacity);this.aiX=new Float32Array(capacity);this.aiY=new Float32Array(capacity);this.aiTimer=new Float32Array(capacity);this.orbitHits=new Float32Array(capacity*12);this.areaHits=new Float32Array(capacity*4);this.burnSource=Array(capacity).fill('coffee');
    this.hitCount=new Uint16Array(capacity);
    this.firstHit=new Float64Array(capacity);
    this.rank=new Uint8Array(capacity);this.pendingDead=new Uint8Array(capacity);this.shield=new Float32Array(capacity);this.maxShield=new Float32Array(capacity);this.lastHit=new Float64Array(capacity);this.affixes=new Uint8Array(capacity);this.frozen=new Float32Array(capacity);this.immune=new Float32Array(capacity);this.freezeAccum=new Float32Array(capacity);this.cryoLast=new Float64Array(capacity);this.rewardWeight=new Float32Array(capacity);this.chainXp=new Float32Array(capacity);this.chainWeight=new Float32Array(capacity);this.splitGeneration=new Uint8Array(capacity);this.owner=new Int32Array(capacity);this.ownerGeneration=new Uint32Array(capacity);this.lifetime=new Float32Array(capacity);this.affixTimer=new Float32Array(capacity);this.shootTimer=new Float32Array(capacity);this.skillTimer=new Float32Array(capacity);this.chargeSequence=new Uint8Array(capacity);this.frozenOnce=new Uint8Array(capacity);this.fusionHits=new Float64Array(capacity*2);
  }
  override acquire(){const id=super.acquire();if(id>=0){for(const key of ['x','y','prevX','prevY','vx','vy','hp','maxHp','speed','damage','radius','cooldown','timer','state','angle','kind','flash','slow','slowTime','burn','burnTick','burnDamage','xp','reward','aiX','aiY','aiTimer','hitCount','firstHit','rank','pendingDead','shield','maxShield','lastHit','affixes','frozen','immune','freezeAccum','cryoLast','rewardWeight','chainXp','chainWeight','splitGeneration','owner','ownerGeneration','lifetime','affixTimer','shootTimer','skillTimer','frozenOnce','chargeSequence'] as const)this[key][id]=0;this.alive[id]=1;this.orbitHits.fill(0,id*12,id*12+12);this.areaHits.fill(0,id*4,id*4+4);this.burnSource[id]='coffee';this.owner[id]=-1;this.fusionHits.fill(0,id*2,id*2+2);this.lastHit[id]=-100;this.cryoLast[id]=-100;}return id;}
}
export interface Shot {
  x:number;y:number;prevX:number;prevY:number;vx:number;vy:number;life:number;age:number;damage:number;radius:number;
  source:WeaponKind;kind:'straight'|'homing'|'boomerang'|'enemy';color:number;pierce:number;
  hits:number[];target:number;targetGeneration:number;originX:number;originY:number;range:number;returning:boolean;evolved:boolean;fragment:boolean;level:number;explosion:number;secondaryDamage:number;launchAngle:number;frozen:number;ordinary:boolean;bounce:number;decay:number;
}
export class ShotPool extends SlotPool {
  readonly data:Shot[];
  constructor(capacity:number){super(capacity);this.data=Array.from({length:capacity},()=>({x:0,y:0,prevX:0,prevY:0,vx:0,vy:0,life:0,age:0,damage:0,radius:4,source:'knife',kind:'straight',color:0xffffff,pierce:1,hits:[],target:-1,targetGeneration:0,originX:0,originY:0,range:700,returning:false,evolved:false,fragment:false,level:1,explosion:24,secondaryDamage:0,launchAngle:0,frozen:0,ordinary:true,bounce:0,decay:1}));}
}
export interface Area { x:number;y:number;radius:number;maxRadius:number;damage:number;life:number;age:number;delay:number;tick:number;source:WeaponKind;kind:'rain'|'mine'|'eraser'|'pulse'|'ink'|'cryo'|'brick'|'icefire'|'aftershock';color:number;evolved:boolean;triggered:boolean;hits:Map<number,number>;cancelTick:number;secondaryDamage:number;interval:number;burstTick:number }
export class AreaPool extends SlotPool {
  readonly data:Area[];
  constructor(capacity=320){super(capacity);this.data=Array.from({length:capacity},()=>({x:0,y:0,radius:0,maxRadius:0,damage:0,life:0,age:0,delay:0,tick:0,source:'rain',kind:'rain',color:0xffffff,evolved:false,triggered:false,hits:new Map(),cancelTick:0,secondaryDamage:0,interval:.5,burstTick:2}));}
}
export interface Drop {x:number;y:number;kind:DropKind;value:number;age:number;attract:boolean;vx:number;vy:number}
export class DropPool extends SlotPool {
  readonly data:Drop[];
  constructor(capacity=2560){super(capacity);this.data=Array.from({length:capacity},()=>({x:0,y:0,kind:'xp',value:1,age:0,attract:false,vx:0,vy:0}));}
}
