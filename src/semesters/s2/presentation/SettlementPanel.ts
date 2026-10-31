import {collectionGaps,settlementCollection,filterCollection,COLLECTION_CATALOG_VERSION,type SemesterFilter} from '../../collection';
import type {SaveProfile,SemesterResult} from '../../profile';
import {semesterRating} from '../rating';
/** Display-only report: rewards/IDs have already committed in the repository. */
export class SemesterSettlementPanel {
 private root=document.createElement('div');private body=document.createElement('section');private full=false;private semester:SemesterFilter='all';private incomplete=true;private unseen=false;
 constructor(host:HTMLElement,private before:SaveProfile,private after:SaveProfile,private result:SemesterResult){this.root.className='s2-build-modal s2-settlement';this.root.setAttribute('role','dialog');this.root.setAttribute('aria-label','第二学期结算');this.root.append(this.body);host.append(this.root);this.render();}
 private text(tag:string,value:string){const e=document.createElement(tag);e.textContent=value;return e;}
 private button(name:string,action:()=>void){const b=document.createElement('button');b.type='button';b.textContent=name;b.onclick=action;return b;}
 private render(){
  this.body.replaceChildren();const changes=settlementCollection(this.before,this.after),rating=semesterRating(this.result);
  this.body.append(this.text('h2','第二学期结算'),this.text('p',rating?`评级 ${rating.grade} · ${rating.value}/100 · ${rating.ratingVersion}`:'练习/调试局 · 不保存评级或榜单'));
  if(!this.full){this.body.append(this.text('h3','本局新发现'),this.text('p',changes.discoveries.map(e=>e.name).join('、')||'本局没有新增发现'),this.text('h3','本局新达成'),this.text('p',changes.achievements.map(e=>e.name).join('、')||'本局没有新成就'),this.text('h3','建议下一局补全'));const list=document.createElement('ul');for(const e of changes.suggestions)list.append(this.text('li',`${e.name} · ${e.condition} · ${e.source}`));this.body.append(list,this.button('查看全部缺项',()=>{this.full=true;this.render();}));return;}
  this.body.append(this.button('返回结算',()=>{this.full=false;this.render();}));const select=document.createElement('select');select.setAttribute('aria-label','图鉴学期');for(const [value,label] of [['s1','第一学期'],['s2','第二学期'],['all','全部']]){const o=document.createElement('option');o.value=value;o.textContent=label;select.append(o);}select.value=this.semester;select.onchange=()=>{this.semester=select.value as SemesterFilter;this.render();};this.body.append(select);
  for(const [name,checked,key] of [['只看未完成',this.incomplete,'incomplete'],['已解锁但未发现',this.unseen,'unseen']] as const){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=checked;input.onchange=()=>{this[key]=input.checked;this.render();};label.append(input,name);this.body.append(label);}
  const result=collectionGaps(this.after,COLLECTION_CATALOG_VERSION,this.semester);this.body.append(this.text('p',`目录 ${result.total} · 已发现 ${result.discovered} · 已达成 ${result.achieved} · 缺项 ${result.missing.length}`));
  for(const entry of filterCollection(Object.values(result.groups).flatMap(g=>g.entries),this.incomplete,this.unseen)){const article=document.createElement('article');article.dataset.contentId=entry.id;article.append(this.text('h3',entry.name),this.text('p',entry.status),this.text('p',entry.condition),this.text('p',`来源：${entry.source}`));this.body.append(article);}
 }
 destroy(){this.root.remove();}
}
