// P04 bounded port of src/progression/rewards.ts; S1 source remains frozen.
import type {ContentState} from './ContentState';
import type {RewardOption} from '../../../types';
import {evolutionReady,skillName} from './rules';
import {fusionCandidates,fuseWeapons,fusionRecipe} from './fusions';
export class RewardSystem{
 readonly chests:number[]=[];serial=0;token=0;options:RewardOption[]=[];private count=1;private boss=false;private contract=false;private committed=false;private evolution='';private fusion='';
 constructor(private g:ContentState){}
 nextToken(){return++this.serial;}
 get snapshot(){return this.g.phase==='draft'?{token:this.g.draftToken,options:[]}:this.options.length?{token:this.token,options:this.options}:null;}
 openChest(count=1,boss=false,preferred=''){const g=this.g;if(['result','chest','evolution','reward','contract'].includes(g.phase))return;this.count=count;this.boss=boss;this.contract=false;this.committed=false;this.evolution='';this.fusion='';this.token=this.nextToken();
  const evolutions=evolutionReady(this.g.content,g.weapons,g.passives).sort((a,b)=>Number(b.id===preferred)-Number(a.id===preferred)),fusions=fusionCandidates(this.g.content,g.weapons,g.week,g.progress.fusions.length,g.consumed);
  this.options=[...fusions.map(f=>({id:f.id,kind:'fusion' as const,title:f.name,description:`消耗 ${f.components.map(id=>this.g.content.weaponById[id].name).join(' + ')}，得到 ${f.name}，释放一个武器槽。品质取较高值，被动保留。${fusionRecipe(this.g.content,f.id)}${f.description}`})),...evolutions.map(w=>({id:w.id,kind:'evolution' as const,title:this.g.content.weaponById[w.id].evolution.name,description:`${skillName(this.g.content,w)} Lv.5 → ${this.g.content.weaponById[w.id].evolution.description}`})),{id:'upgrade',kind:'upgrade',title:`普通强化 ×${count}`,description:'强化已有技能；无法强化时，每份回复 15 HP，满血转为结算绩点 +1。'}];
  if(this.options.length===1)this.commit(0);else g.setPhase('reward');
 }
 openContract(){const g=this.g;if(g.phase!=='playing'||g.relics.length>=3)return;this.token=this.nextToken();this.contract=true;this.committed=false;const pool=this.g.content.relics.filter(r=>!g.relics.includes(r.id));this.options=[];while(this.options.length<3&&pool.length){const r=pool.splice(g.streams.relic.int(0,pool.length-1),1)[0];this.options.push({id:r.id,kind:'relic',title:`${r.name} / ${r.curse}`,description:`${r.benefit}；代价：${r.cost}`});}g.setPhase('contract');}
 choose(token:number,index:number){if(token!==this.token||!['reward','contract'].includes(this.g.phase)||this.committed)return;if(this.contract&&index===-1){this.options=[];this.committed=true;this.g.setPhase('playing');return;}if(!this.options[index])return;this.commit(index);}
 private commit(index:number){const g=this.g,option=this.options[index];if(!option||this.committed)return;this.committed=true;this.options=[];const names:string[]=[];
  if(option.kind==='relic'){const previous=g.stats.maxHp;g.relics.push(option.id);g.progress.relics.push(option.id);g.discover(`relic:${option.id}`);g.recalculateStats(option.id==='redNotebook'?'ratio':'increase',previous);g.message(`签订契约 · ${option.title}`);g.setPhase('playing');return;}
  if(option.kind==='fusion'){const skill=fuseWeapons(this.g.content,g.weapons,option.id,g.week,g.progress.fusions.length,g.consumed,g.nextInstance());if(skill){for(const id of skill.components!)g.weaponSystem.remove(id);g.weaponSystem.reset(skill.id);g.progress.fusions.push(skill.id);g.discover(`fusion:${skill.id}`);this.fusion=skill.id;names.push(skillName(this.g.content,skill));}}
  else if(option.kind==='evolution'){const skill=evolutionReady(this.g.content,g.weapons,g.passives).find(w=>w.id===option.id);if(skill){skill.evolved=true;this.evolution=skill.id;g.progress.evolutions++;g.metrics.evolutionTimes.push({id:skill.id,seconds:g.combatTime});g.weaponSystem.remove(skill.id);g.weaponSystem.reset(skill.id);g.discover(skill.id,true);names.push(skillName(this.g.content,skill));}}
  else for(let n=0;n<this.count;n++){const pool=[...g.weapons,...g.passives].filter(s=>s.level<5&&!s.evolved&&s.kind!=='fusion');if(pool.length){const skill=pool[g.draftRandom.int(0,pool.length-1)];skill.level++;names.push(`${skillName(this.g.content,skill)} Lv.${skill.level}`);g.weaponSystem.reset(skill.id);}else if(g.player.hp<g.stats.maxHp){g.heal(15);names.push('回复 15 HP');}else{g.bonusCredits++;names.push('结算绩点 +1');}}
  g.recalculateStats();g.chest={names,evolvedId:this.evolution||undefined,fusionId:this.fusion||undefined};g.setPhase('chest');
 }
 finishChest(){const g=this.g;if(g.phase!=='chest')return;const id=this.fusion||this.evolution;if(id){const def=this.g.content.weaponById[id];g.emit({type:this.fusion?'fusion':'evolution',x:g.player.x,y:g.player.y,color:parseInt(def.color.slice(1),16),size:500,text:this.fusion?def.name:def.evolution.name,weapon:def.id,evolved:!this.fusion,duration:this.fusion?1.5:1.2});g.setPhase('evolution');}else this.afterReward();}
 afterReward(){const g=this.g;this.evolution='';this.fusion='';g.chest=null;if(this.boss){this.boss=false;g.bossActive=false;g.assessmentRewardDone=true;}g.setPhase('playing');g.handlePending();}
 clear(){this.chests.length=0;this.options=[];this.boss=false;this.committed=true;}
}
