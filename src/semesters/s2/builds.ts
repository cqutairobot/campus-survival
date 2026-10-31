import type {ContentPassiveDef,ContentWeaponDef} from './types';

export const FIRST_CHAPTER_WEAPONS:ContentWeaponDef[]=[
 {id:'s2:drone',name:'课题无人机',icon:'bot',color:'#529fcc',tag:'召唤 · 轮转索敌',description:'基础 1→3 台随行无人机分配目标。学术合作增加数量（最多 6 台），召唤伤害与攻速均有效。',damage:[17,23,26,33,40],interval:[.78,.7,.65,.6,.55],count:[1,1,2,2,3],range:[440,470,500,530,560],retargetInterval:[.6,.5,.4,.3,.22],forms:['单机开题','快速轮转','双机分工','双机快研','三机协作'],evolution:{name:'外场协作机群',passive:'multi',description:'保留普通分工攻击，每 4 秒追加一轮同步集火；基础 3 台，学术合作可增加数量，最多 6 台。',damage:44,interval:.52,count:3,range:620,retargetInterval:.18,syncInterval:4}},
 {id:'s2:whiteboard',name:'白板推演',icon:'ruler',color:'#408b79',tag:'延迟 · 顺序线段',description:'朝前方依次画出 1→3 段薄荷色短线，延迟依序命中。每线每目标命中一次，线条不阻挡移动。',damage:[38,52,57,72,85],interval:[1.6,1.5,1.4,1.3,1.2],count:[1,1,2,2,3],range:[180,200,220,240,260],width:[14,16,18,20,22],lineLength:[150,170,180,200,220],hitDelay:[.32,.32,.32,.32,.32],sequenceDelay:[.14,.14,.14,.14,.14],forms:['单线假设','延展推导','双线推演','双线复核','三段证明'],evolution:{name:'联合评审矩阵',passive:'s2:protocol',description:'三组交错短线共 6 段，逐线绘制并延迟命中；每线每目标一次，不阻挡移动。',damage:48,interval:1.15,count:6,range:290,width:24,lineLength:240,hitDelay:.32,sequenceDelay:.14}},
];
export const FIRST_CHAPTER_PASSIVES:ContentPassiveDef[]=[
 {id:'s2:protocol',name:'协议手册',icon:'book',color:'#408b79',description:'首次武器命中施加 3 秒协议标记；后续新旧武器伤害提高，武器命中刷新。Boss 收益减半，同类标记合并，易伤总加成上限 15%；附伤不再施加标记。',values:[2,3,4,5,6],unit:'% 标记易伤（Boss 减半）'},
];
