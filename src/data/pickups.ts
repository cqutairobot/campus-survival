import type {PickupId} from '../types';
export const PICKUPS:{id:PickupId;name:string;value:number;probability:number;cooldown:number;duration:number;color:string;description:string}[]=[
 {id:'heal',name:'红牛',value:25,probability:.005,cooldown:20,duration:0,color:'#dd8f83',description:'回复 25 HP，满血时保留在地面'},
 {id:'magnet',name:'磁铁',value:1,probability:.0006,cooldown:75,duration:0,color:'#b397d5',description:'吸取全校园已掉落经验'},
 {id:'bomb',name:'提前交稿炸弹',value:900,probability:.0004,cooldown:90,duration:0,color:'#e4b965',description:'清普通怪、敌弹、待爆危险，按类别扣除精英及 Boss 生命'},
 {id:'freeze',name:'冻结时钟',value:900,probability:.0007,cooldown:60,duration:4,color:'#8ad2ed',description:'普通怪及普通敌弹冻结 4 秒、精英 2 秒；Boss 减速'},
 {id:'shield',name:'应急护盾',value:30,probability:.001,cooldown:35,duration:10,color:'#d9c077',description:'获得 30 护盾，刷新 10 秒；总量不超过最大生命 50%'},
 {id:'coffeeBoost',name:'浓缩咖啡',value:.25,probability:.001,cooldown:45,duration:6,color:'#bb8e69',description:'攻速 +25%，持续 6 秒，同类刷新'},
 {id:'energy',name:'灵感便签',value:60,probability:.0003,cooldown:90,duration:0,color:'#b4c97e',description:'大招能量 +60'},
];
export const PICKUP_MAP=Object.fromEntries(PICKUPS.map(p=>[p.id,p]));
