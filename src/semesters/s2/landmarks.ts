import {distanceSq} from '../../core/math';
import type {ContentState} from './legacy/ContentState';

export const S2_LANDMARKS=[
 {id:'s2:infirmary',name:'校园医务站',x:1776,y:1280,from:1},
 {id:'s2:revision',name:'旧课复习台',x:1376,y:4768,from:18},
] as const;
export const S2_INTERACTION_DEFS=[
 {id:'s2:jointTable',name:'联合课题台',from:4,condition:'第4/12/20周第4秒出现，三选一或放弃，每局最多三件遗物'},
 {id:'s2:amendmentTable',name:'项目修约台',from:10,condition:'第10/18周出现，用已有遗物换签，每局只成功一次'},
 {...S2_LANDMARKS[0],condition:'脱战2秒后静止读条0.8秒，回复20HP与10短护盾，每局一次'},
 {...S2_LANDMARKS[1],condition:'第18周起选旧两小Boss/三大Boss之一，替代本周一次精英机会，每局一次'},
] as const;
type ChannelId='canteen'|'lab'|'workshop'|'s2:infirmary';
/** Legacy uses stay separate from the new infirmary's one successful use. */
export class SemesterLandmarks {
 readonly uses:Record<string,number>={};readonly cooldowns:Record<string,number>={};private channel:{id:ChannelId;at:number;x:number;y:number;hurt:number}|null=null;private trackMove=0;private trackCooldown=0;
 constructor(private g:ContentState){}
 get point(){return S2_LANDMARKS.find(p=>distanceSq(p.x,p.y,this.g.player.x,this.g.player.y)<80**2);}
 private get availableId():ChannelId|null{if(this.point?.id==='s2:infirmary')return's2:infirmary';const id=this.g.landmarks.zone?.id;return id==='canteen'||id==='lab'||id==='workshop'?id:null;}
 private lock(id:ChannelId){return(this.uses[id]??0)>=(id==='s2:infirmary'?1:2)?'本局次数已用完':this.g.combatTime<(this.cooldowns[id]??0)?'互动冷却中':id==='s2:infirmary'&&this.g.combatTime-this.g.player.lastHurt+1e-8<2?'脱战2秒后可用':'';}
 get interaction(){
  if(this.g.revision.active)return{name:'退出旧课复习 · 不发奖',locked:'',progress:0};
  const point=this.point;if(point?.id==='s2:revision')return{name:'旧课复习台 · 选择选修',locked:this.g.revision.locked,progress:0};
  const id=this.availableId;if(!id||this.g.bossActive)return null;const duration=id==='lab'?1:id==='workshop'?.5:.8;
  return{name:id==='s2:infirmary'?'校园医务站 · 回复20 HP与10短护盾':id==='canteen'?'食堂用餐 · 回复25 HP':id==='lab'?'实验增幅 · 范围+20%':'工坊护盾 · +40',locked:this.lock(id),progress:this.channel?Math.min(1,(this.g.combatTime-this.channel.at)/duration):0};
 }
 interact(){const g=this.g;if(g.revision.active)return g.revision.exit();if(g.hasPendingRewards)return false;if(this.point?.id==='s2:revision')return g.revision.open();const id=this.availableId;if(!id||this.lock(id)||g.bossActive||Math.hypot(g.player.vx,g.player.vy)>12||Math.hypot(g.inputX,g.inputY)>.05)return false;this.channel={id,at:g.combatTime,x:g.player.x,y:g.player.y,hurt:g.player.lastHurt};return true;}
 cancel(){this.channel=null;this.g.landmarks.channel=0;}
 update(dt:number){
  const g=this.g,p=g.player;const point=this.point;if(point&&g.week>=point.from)g.discover(`interaction:${point.id}`);g.landmarks.trackTime=Math.max(0,g.landmarks.trackTime-dt);g.landmarks.rangeTime=Math.max(0,g.landmarks.rangeTime-dt);this.trackCooldown=Math.max(0,this.trackCooldown-dt);
  if(g.landmarks.zone?.id==='track'&&Math.hypot(g.inputX,g.inputY)>.1){this.trackMove+=dt;if(this.trackMove>=3&&this.trackCooldown<=0){g.landmarks.trackTime=8;this.trackCooldown=30;this.trackMove=0;}}else this.trackMove=0;
  const c=this.channel;if(!c)return;if(g.bossActive||g.phase!=='playing'||this.availableId!==c.id||this.lock(c.id)||p.lastHurt!==c.hurt||Math.hypot(g.inputX,g.inputY)>.05||distanceSq(p.x,p.y,c.x,c.y)>.01){this.cancel();return;}
  const duration=c.id==='lab'?1:c.id==='workshop'?.5:.8;g.landmarks.channel=(g.combatTime-c.at)/duration;if(g.combatTime-c.at+1e-8<duration)return;
  this.uses[c.id]=(this.uses[c.id]??0)+1;this.cooldowns[c.id]=g.combatTime+(c.id==='lab'?120:90);this.cancel();
  if(c.id==='s2:infirmary'){g.heal(20,true);g.addShield(10,8);}else if(c.id==='canteen')g.heal(25);else if(c.id==='lab')g.landmarks.rangeTime=20;else g.addShield(40,10);
  g.inputX=g.inputY=0;g.player.invincible=Math.max(g.player.invincible,.75);g.message(c.id==='s2:infirmary'?'医务站治疗完成 · 本局仅一次':'校园互动完成',3);
 }
 snapshot(){return{uses:{...this.uses},interaction:this.interaction,channel:this.g.landmarks.channel,points:S2_LANDMARKS.map(p=>({...p}))};}
}
