import type {UltimateId} from '../types';
export const ULTIMATES:{id:UltimateId;character:string;name:string;color:string;description:string}[]=[
 {id:'submission',character:'balanced',name:'全校交稿',color:'#72d8b3',description:'900 范围清普通怪与敌弹，按类别扣除精英和 Boss 生命，20 护盾持续 3 秒'},
 {id:'lastMinute',character:'analysis',name:'最后五分钟',color:'#b8d9fa',description:'4 秒时停场；结束释放 80+3L 证明冲击，Boss 遵守分级抗性'},
 {id:'parallel',character:'coder',name:'并行答辩',color:'#78e0c4',description:'6 名临时助手，8 秒内每 .35 秒造成 45+1.5L 召唤伤害'},
 {id:'conference',character:'english',name:'国际会议',color:'#edb4cc',description:'三次 350/650/900 声浪，每波 100+2L 并消弹，移速 +25% 持续 6 秒'},
 {id:'barrier',character:'architect',name:'基建结界',color:'#7bbada',description:'8 秒跟随结界，每 .5 秒 40+L 伤害、每 .2 秒消一弹，40 护盾'},
 {id:'overload',character:'experiment',name:'实验过载',color:'#abdce6',description:'8 秒攻速 +40%、范围 +25%，每 2 秒投出 120+2L 过载弹'},
];
export const ULTIMATE_MAP=Object.fromEntries(ULTIMATES.map(u=>[u.id,u]));
export const ultimateFor=(character:string)=>ULTIMATES.find(u=>u.character===character)??ULTIMATES[0];
