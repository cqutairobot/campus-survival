import type {Immutable,SemesterRunView} from '../../runtime/contracts';
import type {ContentCatalog} from '../legacy/catalog';
import type {LegacyContentDTO} from '../legacy/rules-adapter';
import type {SemesterControls} from './input';
import {parameterRows,weaponCard,weaponCodex} from './build-details';
import {weaponParams} from '../legacy/params';
import './build-panel.css';

/** The internal S2 host uses these cards too; no S1 UI or catalog is extended. */
export class BuildPanel {
 private root=document.createElement('div');private modal=document.createElement('div');private codex=false;private pauseToken:number|null=null;private key='';
 private interact=document.createElement('button');
 private keyDown=(event:KeyboardEvent)=>{
  if(this.modal.hidden||!['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyQ','KeyE','KeyP','Escape','Digit1','Digit2','Digit3'].includes(event.code))return;
  event.preventDefault();event.stopImmediatePropagation();
  if(this.codex){if(event.code==='Escape'&&!event.repeat)this.close();return;}
  if(!event.repeat&&event.code.startsWith('Digit')){const g=this.controls.read().content,index=Number(event.code.slice(-1))-1;if(g.phase==='draft')this.controls.dispatch({type:'choose',index,token:g.draftToken});else if(g.phase==='reward'||g.phase==='contract')this.controls.dispatch({type:'chooseReward',index,token:g.rewardToken});}
 };
 constructor(host:HTMLElement,private content:ContentCatalog,private controls:SemesterControls,private clearInput:()=>void){
  this.root.className='s2-build-panel';this.modal.className='s2-build-modal';this.modal.hidden=true;
  const open=this.button('构筑图鉴',()=>{if(this.controls.read().phase==='finished')return;this.clearInput();const v=this.controls.read();this.pauseToken=v.pause?null:this.controls.pause('manual');this.codex=true;this.key='';this.update(this.controls.read());});open.className='s2-build-codex';this.interact.type='button';this.interact.className='s2-table-interact';this.interact.hidden=true;this.interact.addEventListener('click',()=>this.controls.dispatch({type:'interact'}));this.root.append(open,this.interact,this.modal);host.append(this.root);
  window.addEventListener('keydown',this.keyDown,true);
 }
 private button(label:string,action:()=>void){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);return b;}
 private text(tag:string,value:string){const e=document.createElement(tag);e.textContent=value;return e;}
 private close=()=>{this.codex=false;this.key='';const token=this.pauseToken;this.pauseToken=null;if(token!==null)this.controls.resume(token);this.update(this.controls.read());};
 update(view:Immutable<SemesterRunView<LegacyContentDTO>>){
  const g=view.content,interaction=g.tables.interaction??g.interactions.interaction;this.interact.hidden=!interaction||!!view.pause||view.phase!=='teaching';this.interact.textContent=interaction?`${interaction.name}${'progress'in interaction&&interaction.progress>0?` · ${Math.ceil(interaction.progress*100)}%`:''}`:'';this.interact.disabled=!!interaction?.locked;this.interact.title=interaction?.locked??'';
  const key=this.codex?'codex':`${g.phase}:${g.draftToken}:${g.rewardToken}:${g.revision.selecting}:${g.revision.token}`;if(key===this.key)return;this.key=key;
  this.modal.replaceChildren();this.modal.hidden=!this.codex&&!['draft','reward','contract','chest','evolution'].includes(g.phase);if(this.modal.hidden)return;this.clearInput();
  this.modal.setAttribute('role','dialog');this.modal.setAttribute('aria-label',this.codex?'第二学期构筑图鉴':'选择构筑');
  const body=document.createElement('section');this.modal.append(body);
  if(this.codex){
   body.append(this.text('h2','第二学期构筑图鉴'),this.button('关闭图鉴',this.close),this.text('p','按当前品质和构筑显示；暴击、协议标记在命中时结算。'));
   for(const def of [...this.content.weapons,...this.content.fusions]){
    const book=weaponCodex(this.content,def.id,g.weapons.find(w=>w.id===def.id),g.combatStats,g.damageMultiplier),entry=document.createElement('details');entry.append(this.text('summary',def.name));
    entry.append(this.text('p',def.description),this.text('p',book.recipe));
    for(const level of book.levels)entry.append(this.text('p',`Lv.${level.params.level} · ${level.rows.join(' · ')}`));
    if(!def.fusion)entry.append(this.text('h3',def.evolution.name),this.text('p',book.rows.join(' · ')));body.append(entry);
   }
   for(const def of this.content.passives)body.append(this.text('h3',def.name),this.text('p',`${def.description} 普通品质：${def.values.join(' / ')}${def.unit}`));
  }else if(g.revision.selecting){
   body.append(this.text('h2','旧课复习 · 选择选修'),this.text('p','每局一次，替代本周一次普通精英。教学暂停，战斗/每日计时继续；胜利给两份普通强化，退出不发奖。'));
   for(const option of g.revision.options)body.append(this.button(`${option.name} · ${option.hp} HP`,()=>this.controls.dispatch({type:'chooseRevision',token:g.revision.token,id:option.id})));
   body.append(this.button('取消复习选择',()=>this.controls.dispatch({type:'chooseRevision',token:g.revision.token,id:null})));
  }else if(g.phase==='draft'){
   body.append(this.text('h2','选择新灵感'));const choices=document.createElement('div');choices.className='s2-build-choices';body.append(choices);
   for(const [index,card] of g.cards.entries()){
    const def=card.type==='weapon'?this.content.weaponById[card.id]:this.content.passiveById[card.id],b=this.button('',()=>this.controls.dispatch({type:'choose',index,token:g.draftToken}));b.className='s2-build-card';
    const fallback:Record<string,string>={heal:'回复生命',shield:'临时护盾',credit:'额外绩点'};
    b.dataset.itemId=card.id;b.append(this.text('h3',def?.name??fallback[card.type]??card.id),this.text('p',`Lv.${card.nextLevel} · ${['普通','精良','史诗','传说'][card.rarity]}`));
    if(card.type==='weapon'){
     const detail=weaponCard(this.content,this.content.weaponById[card.id].id,card.nextLevel,card.rarity,g.combatStats,g.damageMultiplier);b.append(this.text('p',detail.description),this.text('p',detail.rows.join(' · ')),this.text('small',detail.recipe));
    }else if(def&&'values'in def)b.append(this.text('p',def.description),this.text('p',`本级效果 ${Math.round(def.values[card.nextLevel-1]*this.content.rarityMultipliers[card.rarity]*100)/100}${def.unit}`));
    choices.append(b);
   }
  }else if(g.phase==='contract'){
   body.append(this.text('h2',g.contractMode==='joint'?'联合课题台 · 三选一或放弃':g.contractMode==='select'?'项目修约台 · 选择换出':'项目修约台 · 选择换入'),this.text('p',`已持有 ${g.relics.length}/3 · 每局最多成功修约一次 · 风险积分 ${g.risk.integral.toFixed(1)}`));
   for(const [index,o] of (g.reward?.options??[]).entries()){const b=this.button('',()=>this.controls.dispatch({type:'chooseReward',index,token:g.rewardToken}));b.dataset.relicId=o.id;b.append(this.text('h3',o.title),this.text('p',o.description));body.append(b);}body.append(this.button('放弃本次机会',()=>this.controls.dispatch({type:'chooseReward',index:-1,token:g.rewardToken})));
  }else if(g.phase==='reward'){
   body.append(this.text('h2','宝箱选择'));
   for(const [index,o] of (g.reward?.options??[]).entries()){
    const b=this.button('',()=>this.controls.dispatch({type:'chooseReward',index,token:g.rewardToken}));b.append(this.text('h3',o.title),this.text('p',o.description));
    if(o.kind==='fusion'){const def=this.content.fusionById[o.id],rarity=Math.max(...def.components.map(id=>g.weapons.find(w=>w.id===id)?.rarity??0)) as 0|1|2|3;b.dataset.itemId=o.id;b.append(this.text('p',parameterRows(weaponParams(this.content,{id:def.id,level:5,rarity,evolved:false},g.combatStats,g.damageMultiplier)).join(' · ')));}
    if(o.kind==='evolution'){const def=this.content.weaponById[o.id],book=weaponCodex(this.content,def.id,g.weapons.find(w=>w.id===o.id),g.combatStats,g.damageMultiplier);b.append(this.text('p',book.rows.join(' · ')));}
    body.append(b);
   }
  }else{
   body.append(this.text('h2',g.phase==='evolution'?'构筑进化':'获得强化'),this.text('p',g.chest?.names.join(' · ')??''),this.button('继续',()=>this.controls.dispatch({type:g.phase==='evolution'?'evolutionDone':'chestDone',token:g.rewardToken})));
  }
 }
 destroy(){window.removeEventListener('keydown',this.keyDown,true);this.root.remove();}
}
