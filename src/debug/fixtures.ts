import {freshSave} from '../save/storage';
import {WEAPONS,PASSIVES,CHARACTERS,ENEMIES} from '../data/catalog';
import {RELICS} from '../data/relics';
import type {HUD,Phase,Rarity,RunResult,Skill} from '../types';
export interface UiParameters {screen:string;rarity:Rarity;longText:boolean;largeNumbers:boolean;state:'full'|'locked'|'empty';motion:boolean;missing:boolean;width:number;height:number}
export const DEFAULT_UI_PARAMETERS:UiParameters={screen:'draft',rarity:3,longText:false,largeNumbers:false,state:'full',motion:true,missing:false,width:390,height:844};
export const UI_SCREENS=['menu','characters','talents','codex','settings','controls','achievements','map','daily','credits','playing','draft','chest','reward','contract','evolution','paused','bossIntro','bossDeath','result'] as const;
export function uiFixture(p:UiParameters,base:HUD){
 const save=freshSave(),large=p.largeNumbers?987654321:128;
 save.settings.motion=p.motion;save.credits=large;save.unlocked=p.state==='full'?CHARACTERS.map(c=>c.id):['balanced'];
 if(p.state==='full'){save.discovered=[...WEAPONS,...PASSIVES].map(w=>w.id);save.discoveredEnemies=ENEMIES.map(e=>e.id);save.relics=RELICS.map(r=>r.id);}
 const skills:Skill[]=WEAPONS.slice(0,p.state==='empty'?0:6).map((w,n)=>({id:w.id,level:5,rarity:p.rarity,evolved:n%2===0}));
 const passives:Skill[]=PASSIVES.slice(0,p.state==='empty'?0:6).map(w=>({id:w.id,level:5,rarity:p.rarity,evolved:false}));
 const result:RunResult={id:'isolated-fixture',victory:false,week:22,completedWeeks:21,kills:large,level:p.largeNumbers?12345:48,bosses:2,seconds:876,credits:large,weapons:skills,passives,debug:true,damage:p.state==='empty'?{}:{knife:large,orbit:large/2,coffee:large/4,code:large/8}};
 const phases:Phase[]=['playing','draft','chest','reward','contract','evolution','paused','bossIntro','bossDeath','result'];
 const hud:HUD={...structuredClone(base),phase:phases.includes(p.screen as Phase)?p.screen as Phase:'menu',hp:large,maxHp:large+99,shield:large,xp:7,xpNext:10,level:p.largeNumbers?12345:48,kills:large,week:22,semesterTime:879,weapons:skills,passives,combo:p.largeNumbers?99999:12,comboTier:3,zone:p.longText?'建筑与城市规划学院超长中文地标名称验证':'图书馆草坪',event:p.longText?'考试狂暴·连续多行中文危险提示验证':'考试狂暴',notice:'躲开橙色预警与红色弹幕',boss:{name:p.longText?'期末考试与综合学术能力答辩超长名称':'期末考试',hp:large,maxHp:large+999,stage:3},ultimate:{...base.ultimate,name:p.longText?'全校交稿超长中文技能名称':'全校交稿',energy:240,ready:true},interaction:{name:p.longText?'实验中心与结构模型工坊连续互动名称':'实验中心互动',progress:.5},relics:p.state==='empty'?[]:RELICS.slice(0,3).map(r=>r.id),directions:[{name:'契约台',angle:1}],result,
 cards:p.state==='empty'?[]:WEAPONS.slice(0,3).map(w=>({id:w.id,type:'weapon',rarity:p.rarity,nextLevel:5})),chest:{names:[p.longText?'超长中文学术补给与结构模型工坊奖励名称测试':'笔记本飞刀 +1','咖啡 +1'],evolvedId:'knife'},reward:{token:1,options:p.screen==='contract'?RELICS.slice(0,3).map(r=>({id:r.id,kind:'relic',title:r.name,description:r.benefit})):['sword','hub','binder'].map(id=>({id,kind:'fusion',title:id==='sword'?'校园剑阵':id==='hub'?'智慧校园中枢':'高速装订机',description:'两件满级材料融合，释放一个武器槽。'}))}};
 return{save,hud};
}
