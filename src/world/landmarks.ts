import type {GameEngine} from '../core/engine';
import {ZONES} from './campus';
import {distanceSq} from '../core/math';
export const REGION_CONDITIONS:Record<string,string>={lab:'击败开题报告后，下局开放',workshop:'完成一次融合后，下局开放',garden:'普通模式通关后，下局开放'};
export class LandmarkSystem{
 held=false;channel=0;private channelId='';private hurtAt=-100;readonly uses:Record<string,number>={};readonly cooldowns:Record<string,number>={};trackMove=0;trackTime=0;rangeTime=0;private trackCooldown=0;
 contract:{x:number;y:number;remaining:number}|null=null;private opportunities=new Set<number>();
 constructor(private g:GameEngine){}
 get zone(){const p=this.g.player;return ZONES.find(z=>this.g.manifest.regions.includes(z.id)&&distanceSq(p.x,p.y,z.x,z.y)<=z.radius**2);}
 get nearbyContract(){const p=this.g.player;return this.contract&&distanceSq(p.x,p.y,this.contract.x,this.contract.y)<90**2;}
 update(dt:number){const g=this.g,p=g.player,z=this.zone;this.trackTime=Math.max(0,this.trackTime-dt);this.rangeTime=Math.max(0,this.rangeTime-dt);this.trackCooldown=Math.max(0,this.trackCooldown-dt);
  if(z&&!g.progress.visited.includes(z.id)){g.progress.visited.push(z.id);g.discover(`region:${z.id}`);}
  if(z?.id==='track'&&Math.hypot(g.inputX,g.inputY)>.1){this.trackMove+=dt;if(this.trackMove>=3&&this.trackCooldown<=0){this.trackTime=8;this.trackCooldown=30;this.trackMove=0;g.message('操场 · 移速 +15%，持续 8 秒');}}else this.trackMove=0;
  for(const week of [4,11,18])if(g.week===week&&g.semesterTime>=(week-1)*40+4&&!this.opportunities.has(week)){this.opportunities.add(week);this.spawnContract();}
  if(this.contract){this.contract.remaining-=dt;if(this.contract.remaining<=0)this.contract=null;}
  if(!this.held){this.channel=0;return;}
  if(this.nearbyContract){this.held=false;this.channel=0;g.openContract();this.contract=null;return;}
  if(!z||!['canteen','lab','workshop'].includes(z.id)||this.unavailable(z.id)||Math.hypot(g.inputX,g.inputY)>.05||Math.hypot(p.vx,p.vy)>12){this.channel=0;return;}
  if(this.channelId!==z.id||this.hurtAt!==p.lastHurt){this.channel=0;this.channelId=z.id;this.hurtAt=p.lastHurt;}
  this.channel+=dt;const duration=z.id==='canteen'?.8:z.id==='lab'?1:.5;if(this.channel+1e-6<duration)return;
  this.uses[z.id]=(this.uses[z.id]??0)+1;this.cooldowns[z.id]=g.combatTime+(z.id==='lab'?120:90);this.channel=0;this.held=false;
  if(z.id==='canteen')g.heal(25);if(z.id==='lab')this.rangeTime=20;if(z.id==='workshop')g.addShield(40,10);g.message(z.id==='canteen'?'食堂用餐 · 回复 25 HP':z.id==='lab'?'实验增幅 · 范围 +20%，局部刷怪 +20%，持续 20 秒':'模型工坊 · 护盾 +40，持续 10 秒');
 }
 unavailable(id:string){return(this.uses[id]??0)>=2?'本局次数已用完':(this.cooldowns[id]??0)>this.g.combatTime?`冷却 ${Math.ceil(this.cooldowns[id]-this.g.combatTime)} 秒`:'';}
 interaction(){if(this.nearbyContract)return{name:'风险契约台 · 可放弃',progress:0};const z=this.zone;if(!z||!['canteen','lab','workshop'].includes(z.id))return null;return{name:z.id==='canteen'?'按住 E 用餐':z.id==='lab'?'按住 E 实验增幅':'按住 E 工坊护盾',progress:Math.min(1,this.channel/(z.id==='canteen'?.8:z.id==='lab'?1:.5)),locked:this.unavailable(z.id)};}
 spawnContract(){const p=this.g.safePoint(this.g.player.x+100,this.g.player.y+40);this.contract={...p,remaining:60};this.g.message('风险契约台出现 · E 互动，完全自选，可放弃',6);}
}
