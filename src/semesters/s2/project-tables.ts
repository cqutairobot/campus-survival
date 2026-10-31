import type {ContentState} from './legacy/ContentState';
import {distanceSq} from '../../core/math';
interface Table {kind:'joint'|'amendment';x:number;y:number;expires:number;week:number}
export class ProjectTables {
 private opportunities=new Set<string>();active:Table|null=null;
 constructor(private g:ContentState){}
 update(){const g=this.g;if(this.active&&g.combatTime>=this.active.expires)this.active=null;if(g.bossActive)return;const kind=[4,12,20].includes(g.week)?'joint':[10,18].includes(g.week)?'amendment':null;if(!kind||g.semesterTime<(g.week-1)*40+4||this.opportunities.has(`${kind}:${g.week}`))return;this.opportunities.add(`${kind}:${g.week}`);if(kind==='amendment'&&g.projectRelics.amended)return;this.active={...g.safePoint(g.player.x+100,g.player.y+40),kind,week:g.week,expires:g.combatTime+60};g.message(`${kind==='joint'?'联合课题台':'项目修约台'}出现 · 靠近后按 E 或点击互动，完全自选`,6);}
 get nearby(){return !!this.active&&distanceSq(this.active.x,this.active.y,this.g.player.x,this.g.player.y)<90**2;}
 get interaction(){const t=this.active;if(!t||!this.nearby)return null;return{name:t.kind==='joint'?'联合课题台 · 三选一或放弃':'项目修约台 · 本局仅成功一次',locked:t.kind==='joint'&&this.g.relics.length>=3?'遗物最多三件':t.kind==='amendment'&&(!this.g.relics.length||this.g.projectRelics.amended)?'需要现有遗物且尚未修约':'',kind:t.kind};}
 interact(){if(!this.interaction||this.interaction.locked||this.g.bossActive||this.g.phase!=='playing')return false;const kind=this.active!.kind;this.active=null;if(kind==='joint')this.g.rewards.openContract();else this.g.rewards.openAmendment();return (this.g.phase as string)==='contract';}
 clear(){this.active=null;}
 snapshot(){return{table:this.active?{...this.active}:null,interaction:this.interaction,opportunities:[...this.opportunities]};}
}
