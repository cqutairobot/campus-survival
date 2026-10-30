export const RELICS=[
 {id:'scholarship',name:'奖学金徽章',curse:'加试',icon:'cap',benefit:'经验 +25%',cost:'普通刷怪 +25%'},
 {id:'redNotebook',name:'赤字笔记',curse:'玻璃心',icon:'book',benefit:'伤害 +25%',cost:'最大生命 −20%，当前生命同比调整'},
 {id:'clockShard',name:'时钟碎片',curse:'躁动',icon:'clock',benefit:'大招充能 +30%',cost:'敌人移速 +18%'},
 {id:'assistant',name:'助研铭牌',curse:'落单',icon:'bot',benefit:'召唤伤害 +40%',cost:'非召唤武器伤害 −15%'},
 {id:'emergency',name:'应急胸牌',curse:'沉重',icon:'shield',benefit:'最大生命 +40，补足增加的生命',cost:'玩家移速 −12%'},
 {id:'obsidian',name:'黑曜书签',curse:'追索',icon:'star',benefit:'暴击率 +15 个百分点',cost:'敌弹速度 +20%'},
];
export const RELIC_MAP=Object.fromEntries(RELICS.map(r=>[r.id,r]));
