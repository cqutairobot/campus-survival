import type {ContentSkill} from '../types';
import type {ContentCatalog} from './catalog';
import type {Immutable} from '../../runtime/contracts';
// P04 bounded port of src/weapons/params.ts; S1 source remains frozen.
import type {PlayerStats} from '../../../types';
import type {ContentWeaponId} from '../types';

export interface WeaponParams {
  id:ContentWeaponId; damage:number; interval:number; count:number; range:number; pierce:number;
  width:number; spread:number; explosion:number; duration:number; secondaryDamage:number;
  form:string; level:number; evolved:boolean;
  markDamage?:number;placementInterval?:number;lineLength?:number;hitDelay?:number;sequenceDelay?:number;retargetInterval?:number;syncInterval?:number;
}
/** One calculation shared by combat, world rendering, cards and the codex. */
export function weaponParams(content:ContentCatalog,skill:Immutable<ContentSkill>,stats?:PlayerStats,damageMultiplier=1):WeaponParams {
  const def=content.weaponById[skill.id],lv=skill.level-1,ev=skill.evolved,e=def.evolution;
  const value=(key:'damage'|'interval'|'count'|'range'|'pierce'|'width'|'spread'|'explosion'|'duration',fallback:number)=>ev?(e[key]??fallback):(def[key]?.[lv]??fallback);
  const scale=(stats?.damage??1)*content.rarityMultipliers[skill.rarity]*damageMultiplier*(['bot','blueprint','hub','s2:drone'].includes(def.id)?(stats?.summon??1):(stats?.nonSummon??1));
  const area=stats?.area??1,multi=['knife','orbit','code','ppt','bot','rain','staple','mine','blueprint','shuttle','prism','brick','sword','binder','demolition','s2:drone'].includes(def.id)?stats?.multi??0:0;
  return {
    id:def.id,damage:value('damage',1)*scale,interval:Math.max(.08,value('interval',1)/(stats?.haste??1)),
    count:Math.min(def.id==='blueprint'||def.id==='s2:drone'?6:def.id==='bot'||def.id==='hub'?8:def.id==='orbit'?12:16,value('count',1)+multi),range:value('range',100)*area,
    pierce:value('pierce',def.id==='ppt'?99:1),width:value('width',8)*area,
    spread:value('spread',def.id==='staple'?60:120)*Math.PI/180,explosion:value('explosion',def.id==='code'?24:0)*area,
    duration:value('duration',def.id==='mine'?8:def.id==='rain'?2:0)*(stats?.duration??1),
    secondaryDamage:({coffee:12,code:18,bot:80,rain:10,lightning:25,brick:35,sword:90,hub:180,sky:120,icefire:140,demolition:60} as Record<string,number>)[def.id]*scale||0,
    form:ev?e.name:def.forms[lv],level:skill.level,evolved:ev,
    ...(def.id==='s2:drone'?{retargetInterval:ev?e.retargetInterval!:def.retargetInterval![lv],syncInterval:ev?e.syncInterval!:0}:{}),
    ...(def.id==='s2:spool'?{lineLength:(ev?e.lineLength!:def.lineLength![lv])*area,placementInterval:ev?e.placementInterval!:def.placementInterval![lv]}:{}),
    ...(def.id==='s2:printer'?{markDamage:(ev?e.markDamage!:def.markDamage![lv])*scale}:{}),
    ...(def.id==='s2:whiteboard'?{lineLength:(ev?e.lineLength!:def.lineLength![lv])*area,hitDelay:ev?e.hitDelay!:def.hitDelay![lv],sequenceDelay:ev?e.sequenceDelay!:def.sequenceDelay![lv]}:{}),
  };
}
export function weaponChanges(content:ContentCatalog,id:ContentWeaponId,nextLevel:number,rarity=0,stats?:PlayerStats,damageMultiplier=1):{label:string;before:string;after:string}[] {
  const skill={id,level:nextLevel,rarity:rarity as ContentSkill['rarity'],evolved:false},next=weaponParams(content,skill,stats,damageMultiplier);
  const previous=nextLevel>1?weaponParams(content,{...skill,level:nextLevel-1},stats,damageMultiplier):null;
  const fields:[keyof WeaponParams,string,string][]=[['damage','伤害',''],['interval','冷却','秒'],['count',id==='bot'?'助手':id==='s2:drone'?'无人机':id==='s2:whiteboard'?'线段':'数量',''],['pierce','穿透',''],['range',id==='lightning'?'跳距':id==='ppt'?'回旋距离':'范围',''],['width',id==='s2:whiteboard'?'线宽':'束宽',''],['spread','扇角','°'],['explosion','爆炸半径',''],['duration','持续','秒'],['markDamage','印记伤害',''],['placementInterval','铺设间隔','秒'],['lineLength','线长',''],['hitDelay','命中延迟','秒'],['sequenceDelay','逐线间隔','秒'],['retargetInterval','轮转间隔','秒']];
  const changes=fields.filter(([key])=>typeof next[key]==='number'&&(!previous||next[key]!==previous[key])).filter(([key])=>!['pierce','width','spread','explosion','duration'].includes(key)||content.weaponById[id][key as 'pierce']!==undefined);
  const format=(key:keyof WeaponParams,value:number,unit:string)=>`${Math.round((key==='spread'?value*180/Math.PI:value)*100)/100}${unit}`;
  return [...changes.map(([key,label,unit])=>({label,before:previous?format(key,previous[key] as number,unit):'',after:format(key,next[key] as number,unit)})),{label:'形态',before:previous?.form??'',after:next.form}];
}
