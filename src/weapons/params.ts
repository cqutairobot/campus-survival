import {RARITY_MULTIPLIERS,WEAPON_MAP} from '../data/catalog';
import type {PlayerStats,Skill,WeaponKind} from '../types';

export interface WeaponParams {
  id:WeaponKind; damage:number; interval:number; count:number; range:number; pierce:number;
  width:number; spread:number; explosion:number; duration:number; secondaryDamage:number;
  form:string; level:number; evolved:boolean;
}
/** One calculation shared by combat, world rendering, cards and the codex. */
export function weaponParams(skill:Skill,stats?:PlayerStats,damageMultiplier=1):WeaponParams {
  const def=WEAPON_MAP[skill.id],lv=skill.level-1,ev=skill.evolved,e=def.evolution;
  const value=(key:'damage'|'interval'|'count'|'range'|'pierce'|'width'|'spread'|'explosion'|'duration',fallback:number)=>ev?(e[key]??fallback):(def[key]?.[lv]??fallback);
  const scale=(stats?.damage??1)*RARITY_MULTIPLIERS[skill.rarity]*damageMultiplier*(['bot','blueprint','hub'].includes(def.id)?(stats?.summon??1):(stats?.nonSummon??1));
  const area=stats?.area??1,multi=['knife','orbit','code','ppt','bot','rain','staple','mine','blueprint','shuttle','prism','brick','sword','binder','demolition'].includes(def.id)?stats?.multi??0:0;
  return {
    id:def.id,damage:value('damage',1)*scale,interval:Math.max(.08,value('interval',1)/(stats?.haste??1)),
    count:Math.min(def.id==='blueprint'?6:def.id==='bot'||def.id==='hub'?8:def.id==='orbit'?12:16,value('count',1)+multi),range:value('range',100)*area,
    pierce:value('pierce',def.id==='ppt'?99:1),width:value('width',8)*area,
    spread:value('spread',def.id==='staple'?60:120)*Math.PI/180,explosion:value('explosion',def.id==='code'?24:0)*area,
    duration:value('duration',def.id==='mine'?8:def.id==='rain'?2:0)*(stats?.duration??1),
    secondaryDamage:({coffee:12,code:18,bot:80,rain:10,lightning:25,brick:35,sword:90,hub:180,sky:120,icefire:140,demolition:60} as Partial<Record<WeaponKind,number>>)[def.id]!*scale||0,
    form:ev?e.name:def.forms[lv],level:skill.level,evolved:ev,
  };
}
export function weaponChanges(id:string,nextLevel:number,rarity=0):{label:string;before:string;after:string}[] {
  const skill={id:id as WeaponKind,level:nextLevel,rarity:rarity as Skill['rarity'],evolved:false},next=weaponParams(skill);
  const previous=nextLevel>1?weaponParams({...skill,level:nextLevel-1}):null;
  const fields:[keyof WeaponParams,string,string][]=[['damage','伤害',''],['interval','冷却','秒'],['count',id==='mentor'?'表现印章':id==='bot'?'助手':'数量',''],['pierce','穿透',''],['range',id==='lightning'?'跳距':id==='ppt'?'回旋距离':'范围',''],['width','束宽',''],['spread','扇角','°'],['explosion','爆炸半径',''],['duration','持续','秒']];
  const changes=fields.filter(([key])=>typeof next[key]==='number'&&(!previous||next[key]!==previous[key])).filter(([key])=>!['pierce','width','spread','explosion','duration'].includes(key)||WEAPON_MAP[id][key as 'pierce']!==undefined);
  const format=(key:keyof WeaponParams,value:number,unit:string)=>`${Math.round((key==='spread'?value*180/Math.PI:value)*100)/100}${unit}`;
  return [...changes.map(([key,label,unit])=>({label,before:previous?format(key,previous[key] as number,unit):'',after:format(key,next[key] as number,unit)})),{label:'形态',before:previous?.form??'',after:next.form}];
}
