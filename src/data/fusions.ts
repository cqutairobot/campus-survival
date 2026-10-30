import type {BaseWeaponId,FusionId,WeaponDef} from '../types';
export interface FusionDef extends WeaponDef {id:FusionId;fusion:true;components:[BaseWeaponId,BaseWeaponId]}
function fusion(id:FusionId,name:string,icon:string,color:string,components:[BaseWeaponId,BaseWeaponId],damage:number,interval:number,count:number,range:number,description:string,extras:Partial<Omit<WeaponDef,'id'|'fusion'|'components'>>={}):FusionDef{
 return{id,name,icon,color,components,fusion:true,tag:'融合 · 终极构筑',description,damage:Array(5).fill(damage),interval:Array(5).fill(interval),count:Array(5).fill(count),range:Array(5).fill(range),forms:Array(5).fill(name),evolution:{name,passive:'haste',description,damage,interval,count,range},...extras};
}
export const FUSIONS:FusionDef[]=[
 fusion('sword','校园剑阵','ruler','#86ddd5',['knife','ruler'],60,.65,10,1100,'每 .65 秒十刃、穿透 10；每 1.3 秒追加半径 330、90 伤害尺阵。',{pierce:Array(5).fill(10)}),
 fusion('hub','智慧校园中枢','blueprint','#79c6c5',['bot','blueprint'],50,.32,6,750,'六个移动终端；每 3 秒 180 伤害、半径 140 集火。'),
 fusion('binder','高速装订机','shuttle','#e1c782',['staple','shuttle'],65,.8,12,850,'12 枚羽翼钉束，每枚命中最多 5 个不同目标，逐次 ×.9。',{pierce:Array(5).fill(5)}),
 fusion('sky','天穹测绘阵','prism','#f0c862',['laser','prism'],150,1.3,6,1300,'六向折射光柱、宽 30；每三轮追加 120 伤害交汇爆裂。',{width:Array(5).fill(30)}),
 fusion('icefire','冰火实验场','snow','#81d4e7',['coffee','cryo'],60,5,1,340,'持续 6 秒，每 .4 秒伤害；每 2 秒爆裂 140，减速 40%。',{duration:Array(5).fill(6)}),
 fusion('demolition','结构爆破阵','brick','#dfb38e',['brick','mine'],180,1.1,4,800,'四点承重爆破，半径 200，.4 秒后追加一次 60 余震。',{explosion:Array(5).fill(200)}),
];
export const FUSION_MAP=Object.fromEntries(FUSIONS.map(f=>[f.id,f])) as Record<string,FusionDef>;
