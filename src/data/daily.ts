export const DAILY_RULES_VERSION='daily-v3.1';
export const RULES_VERSION='campus-v3.0';
export const DAILY_RULES=[
 {id:'piercing',name:'穿透学期',character:'balanced',positive:'适用武器数量 +1',pressure:'普通刷怪 +20%'},
 {id:'lastMinute',name:'最后五分钟',character:'analysis',positive:'大招充能 +35%',pressure:'敌弹速度 +20%'},
 {id:'assistants',name:'助研计划',character:'coder',positive:'召唤伤害 +25%',pressure:'精英多一个词条，最多三个'},
 {id:'nightRun',name:'夜跑课堂',character:'english',positive:'移速 +20%',pressure:'每 90 教学秒停电 18 秒'},
 {id:'construction',name:'建筑实习',character:'architect',positive:'攻击范围 +20%',pressure:'盾卫权重 ×2'},
 {id:'overload',name:'实验过载',character:'experiment',positive:'大招间隔 20 秒',pressure:'治疗效果 ×.6'},
];
export const DAILY_RULE_MAP=Object.fromEntries(DAILY_RULES.map(r=>[r.id,r]));
