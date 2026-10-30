import {tokens} from '../design/tokens';
import type { Character, EnemyDef, PassiveDef, Talent, WeaponDef } from '../types';

import {NEW_WEAPONS,NEW_PASSIVES} from './weapons';
import {FUSIONS} from './fusions';
import {NEW_ENEMIES} from './enemies';
const five = (n: number) => [n, n, n, n, n];
export const WEAPONS: WeaponDef[] = [
  { id: 'knife', name: '笔记本飞刀', icon: 'paper', color: '#39b5a3', tag: '穿透 · 远程', description: '把没写完的笔记折成纸刃，向最近的敌人投掷。', damage: [14,16,20,24,30], interval: [.65,.62,.60,.58,.55], count: [3,3,4,4,5], range: [650,700,750,800,850], pierce: [3,4,4,5,6], forms: ["三刃齐射", "宽刃穿行", "四刃展开", "交错扇面", "五刃齐射"], evolution: { name: '参考文献风暴', passive: 'haste', description: '七刃先组成引用环，再分配目标射出；穿透 8，射程 1000。', damage: 48, interval: .55, count: 7, range: 1000, pierce: 8 } },
  { id: 'orbit', name: '文献综述', icon: 'book', color: '#48aab8', tag: '环绕 · 防守', description: '书页环绕身边，对接近的敌人持续造成伤害。', damage: [8,11,15,21,28], interval: five(.35), count: [2,3,3,4,4], range: [75,75,100,100,125], forms: ["双页环绕", "三页护身", "外环展开", "四页护阵", "双圈综述"], evolution: { name: '核心期刊结界', passive: 'xp', description: '六本期刊闭合成六边形护阵，半径 150；每 1.2 秒挡下一枚普通敌弹。', damage: 36, interval: .3, count: 6, range: 150 } },
  { id: 'coffee', name: '咖啡泼洒', icon: 'coffee', color: '#c68c52', tag: '扇形 · 近战', description: '泼出一杯滚烫咖啡。提神，也能击退眼前的作业。', damage: [18,24,30,38,48], interval: [1.8,1.7,1.6,1.5,1.4], count: five(1), range: [140,160,180,205,230], spread: [80,95,110,125,140], forms: ["热咖啡", "蒸汽扩散", "琥珀扇面", "翻卷热浪", "半屏泼洒"], evolution: { name: '通宵冲刺', passive: 'night', description: '180°、半径 280 的琥珀蒸汽；灼烧 12/秒，持续 2 秒。', damage: 70, interval: 1.2, count: 1, range: 280, spread: 180 } },
  { id: 'code', name: '代码弹幕', icon: 'code', color: '#7295de', tag: '追踪 · 爆炸', description: '自动追踪的代码块，命中后产生小范围爆炸。', damage: [16,22,28,36,46], interval: [2.2,2.05,1.9,1.75,1.6], count: [2,2,3,3,4], range: five(650), explosion: [24,32,32,40,40], forms: ["双线代码", "爆炸扩容", "三线并行", "分支扩容", "四路流水线"], evolution: { name: '持续集成', passive: 'duration', description: '五条代码流水线；每弹爆炸半径 56，并分裂 2×18 伤害碎片。', damage: 62, interval: 1.25, count: 5, range: 700, explosion: 56 } },
  { id: 'laser', name: '激光笔', icon: 'laser', color: '#f0b752', tag: '光束 · 贯穿', description: '答辩专用激光笔。现在，它能贯穿整排敌人。', damage: [14,20,28,38,50], interval: five(1.5), count: five(2), range: [850,900,950,1000,1050], width: [12,16,20,24,28], forms: ["双束聚光", "镜片展开", "双层光壳", "宽幅聚焦", "折射光翼"], evolution: { name: '学术聚焦', passive: 'luck', description: '双束金色交叉聚光，每束 135 伤害，长度 1200、宽度 36。', damage: 135, interval: 1.8, count: 2, range: 1200, width: 36 } },
  { id: 'ppt', name: 'PPT 翻页', icon: 'slides', color: '#e28e73', tag: '回旋 · 双程', description: '飞出的幻灯片还会飞回来，去程回程各造成一次伤害。', damage: [14,19,25,32,40], interval: [2.4,2.2,2,1.8,1.6], count: [1,1,2,2,3], range: [280,340,340,400,400], forms: ["单页往返", "远程答辩", "双页并讲", "远距双页", "三页齐讲"], evolution: { name: '无限答辩', passive: 'push', description: '四张巨型幻灯片沿螺旋轨迹往返，回旋距离 480。', damage: 56, interval: 1.3, count: 4, range: 480 } },
  { id: 'bot', name: 'Codex 助手', icon: 'bot', color: '#5cab8d', tag: '召唤 · 自动索敌', description: '召唤小机器人，自动寻找目标并发射代码子弹。', damage: [10,14,19,26,34], interval: [.85,.8,.75,.7,.65], count: [2,2,3,3,4], range: [440,460,480,500,520], forms: ["双助手", "交叉阵位", "三角编队", "前后包抄", "四方编队"], evolution: { name: '多智能体协作', passive: 'multi', description: '四助手分配目标，射程 600；每 4 秒发动 80 伤害、半径 100 的集中打击。', damage: 44, interval: .42, count: 4, range: 600 } },
  { id: 'keyboard', name: '键盘连击', icon: 'keyboard', color: '#9d8ac1', tag: '近战 · 高频', description: '键帽有节奏地弹起，连续击打前方 120°范围。', damage: [6,9,14,21,30], interval: [.32,.3,.28,.26,.24], count: five(1), range: [80,95,110,125,145], spread: [120,150,180,210,240], forms: ["六键起手", "横排键帽", "半环键阵", "扩展键阵", "环抱键阵"], evolution: { name: '机械键盘领域', passive: 'haste', description: '地面键帽矩阵向外翻涌；每 .18 秒触发全方向打击，半径 175。', damage: 42, interval: .18, count: 1, range: 175, spread: 360 } },
  { id: 'rain', name: '论文雨', icon: 'rain', color: '#73aec2', tag: '落点 · 范围', description: '在敌人聚集处标记落点，0.4 秒后论文从天而降。', damage: [28,38,50,64,80], interval: [3,2.8,2.6,2.4,2.2], count: [1,2,2,3,4], range: [60,60,80,80,100], forms: ["论文落点", "双论文", "扩大落点", "三论文", "四论文"], evolution: { name: 'SCI 论文暴雨', passive: 'duration', description: '六片论文流星，半径 120；墨池 10/秒，持续 2 秒。', damage: 110, interval: 1.8, count: 6, range: 120 } },
  { id: 'wifi', name: 'Wi-Fi 信号', icon: 'wifi', color: '#57ac98', tag: '脉冲 · 全向', description: '发出逐渐扩大的信号环，一波命中每个敌人一次。', damage: [12,16,21,27,34], interval: [2.2,2.1,2,1.9,1.8], count: five(2), range: [170,195,220,245,270], forms: ["双信号环", "节点扫描", "扩展网络", "逐排点亮", "全圈扫描"], evolution: { name: '校园全域网', passive: 'speed', description: '双重网格扫描，每波 50 伤害，半径 320。', damage: 50, interval: 1.4, count: 2, range: 320 } },
  { id: 'lightning', name: 'Debug 闪电', icon: 'bolt', color: '#b497e4', tag: '连锁 · 跳跃', description: '在敌人间跳跃的闪电，逐一修复这学期的 bug。', damage: [20,27,36,47,60], interval: [2.6,2.4,2.2,2,1.8], count: [3,4,5,6,7], range: [135,145,155,165,175], forms: ["三点排错", "四点连线", "五点电网", "六点跳链", "七点风暴"], evolution: { name: '全栈风暴', passive: 'area', description: '10 节点紫白电网，跳距 210；末两节点额外 25 伤害、半径 45 爆裂。', damage: 82, interval: 1.35, count: 10, range: 210, explosion: 45 } },
  { id: 'mentor', name: '导师赏识', icon: 'star', color: '#e5b649', tag: '全屏 · 爆发', description: '一句「做得不错」，对视野内所有敌人造成强力冲击。', damage: [70,90,115,145,180], interval: [16,15,14,13,12], count: [1,2,3,4,5], range: five(1100), forms: ["单枚印章", "双侧冲击", "三角学术纹", "四向光柱", "五重推荐印记"], evolution: { name: '院士推荐信', passive: 'calm', description: '巨型推荐信与金色印章；全屏 300 伤害，35 护盾持续 4 秒。', damage: 300, interval: 10, count: 1, range: 1300 } },
  { id: 'staple', name: '订书机齐射', icon: 'staple', color: '#8a9baa', tag: '散射 · 近程', description: '向前方 60°齐射订书钉，火力来自装订室。', damage: [8,11,14,18,23], interval: [1.7,1.6,1.5,1.4,1.3], count: [4,5,6,7,8], range: [360,380,400,420,440], pierce: five(1), forms: ["四钉散射", "五钉扇面", "六钉装订", "七钉排线", "八钉书脊"], evolution: { name: '装订成册', passive: 'multi', description: '12 钉铺成书脊扇面，每钉穿透 3，射程 500。', damage: 32, interval: 1.1, count: 12, range: 500, pierce: 3 } },
  { id: 'mine', name: '圆规地雷', icon: 'compass', color: '#dcad57', tag: '陷阱 · 减速', description: '身后放下圆规，0.5 秒后布防，接近时爆炸并减速。', damage: [22,30,40,52,66], interval: [2.8,2.6,2.4,2.2,2], count: [1,2,2,3,3], range: [65,65,85,85,105], forms: ["单阵布防", "两点布阵", "双阵扩张", "三点布阵", "三点大阵"], evolution: { name: '黄金分割阵', passive: 'push', description: '三点黄金阵，半径 135；几何螺旋爆炸，减速 45% 持续 2 秒。', damage: 90, interval: 1.6, count: 3, range: 135 } },
  { id: 'eraser', name: '橡皮擦场', icon: 'eraser', color: '#bca6a0', tag: '持续 · 消弹', description: '留下白色擦除场，每 0.5 秒伤害敌人，每秒消除一枚敌弹。', damage: [6,9,14,21,30], interval: [5,4.8,4.6,4.4,4.2], count: five(1), range: [90,110,130,150,170], duration: [2,2.5,3,3.5,4], forms: ["白色擦除场", "边界展开", "双层擦除", "白界扩张", "长效擦除"], evolution: { name: '学术橡皮结界', passive: 'health', description: '跟随角色的白色擦除边界；每 .4 秒 26 伤害与消弹，每 5 秒生成、持续 5 秒。', damage: 38, interval: 5, count: 1, range: 210, duration: 5 } },
  { id: 'broadcast', name: '校园广播', icon: 'speaker', color: '#d592a0', tag: '声波 · 击退', description: '120°声浪，强力击退并减速敌人。现在是课间广播时间。', damage: [18,24,32,42,54], interval: [3.5,3.3,3.1,2.9,2.7], count: five(1), range: [175,200,225,250,275], spread: [120,150,180,210,240], forms: ["广播起奏", "双层声纹", "半环声场", "阵列展开", "环抱声场"], evolution: { name: '校园之声', passive: 'regen', description: '广播阵列展开 360°、半径 350 的多层声纹；80 伤害并回复 2 HP。', damage: 80, interval: 2, count: 1, range: 350, spread: 360 } },
  ...NEW_WEAPONS,
];
export const PASSIVES: PassiveDef[] = [
  { id:'speed',name:'咖啡续命',icon:'coffee',color:'#c68c52',description:'提升移动速度，让早八不再遥远。',values:[8,14,20,26,32],unit:'% 移速' },
  { id:'night',name:'熬夜',icon:'moon',color:'#9384b9',description:'提高总伤害，每秒损失少量最大生命；降到 1 HP 停止。',values:[20,40,60,80,100],unit:'% 伤害' },
  { id:'haste',name:'早八体质',icon:'clock',color:'#dda65e',description:'增加攻击速度，今天又比 DDL 快了一点。',values:[8,16,24,32,40],unit:'% 攻速' },
  { id:'xp',name:'图书馆卡',icon:'card',color:'#7baba0',description:'获得的学分经验增加。知识从来不会白学。',values:[10,20,30,40,50],unit:'% 经验' },
  { id:'regen',name:'食堂饭卡',icon:'bowl',color:'#dc9276',description:'每秒回复生命。再忙也要好好吃饭。',values:[.2,.4,.6,.8,1],unit:' HP/秒' },
  { id:'multi',name:'学术合作',icon:'users',color:'#729bc3',description:'增加投射物与召唤数量，高等级还提升召唤伤害。',values:[1,1,2,2,3],unit:' 数量' },
  { id:'calm',name:'组会心态',icon:'shield',color:'#83b1a4',description:'延长受伤后的无敌时间。先稳住，问题不大。',values:[.15,.25,.35,.45,.6],unit:' 秒无敌' },
  { id:'area',name:'开源精神',icon:'expand',color:'#9e94c5',description:'扩大攻击的半径与宽度，让知识影响更多人。',values:[10,20,30,40,50],unit:'% 范围' },
  { id:'luck',name:'幸运签',icon:'clover',color:'#77a36d',description:'提高暴击率和稀有技能的出现概率。',values:[3,6,9,12,15],unit:'% 暴击' },
  { id:'health',name:'宿舍床垫',icon:'bed',color:'#dba08d',description:'提高最大生命，并回复相同数值的生命。',values:[15,30,45,60,75],unit:' 最大生命' },
  { id:'push',name:'运动打卡',icon:'shoe',color:'#7da7c3',description:'提高击退，降低自己受到的击退。',values:[10,20,30,40,50],unit:'% 击退' },
  { id:'duration',name:'实验记录',icon:'flask',color:'#6ba9aa',description:'延长地雷、残留区域和定时护盾的有效时间。',values:[10,20,30,40,50],unit:'% 持续时间' },
  ...NEW_PASSIVES,
];
export const WEAPON_MAP = Object.fromEntries([...WEAPONS,...FUSIONS].map(w=>[w.id,w])) as Record<string, WeaponDef>;
export const PASSIVE_MAP = Object.fromEntries(PASSIVES.map(w=>[w.id,w])) as Record<string, PassiveDef>;
export const RARITY_NAMES = ['普通','精良','史诗','传说'];
export const RARITY_COLORS = tokens.rarity;
export const RARITY_MULTIPLIERS = [1,1.08,1.16,1.25];
export const CHARACTERS: Character[] = [
  { id:'balanced',name:'均衡型',subtitle:'校园里的普通研究生',icon:'cap',color:'#4c9e87',weapon:'knife',hp:110,crit:.05,area:0,summon:0,cost:0,description:'生命 110 · 稳稳开始这个学期' },
  { id:'analysis',name:'泛函型',subtitle:'万物皆可证明',icon:'sigma',color:'#b69a5f',weapon:'laser',hp:90,crit:.2,area:0,summon:0,cost:80,description:'初始暴击 20% · 精准的学术一击' },
  { id:'coder',name:'代码型',subtitle:'让助手先跑一会儿',icon:'code',color:'#7b9bc2',weapon:'bot',hp:95,crit:.05,area:0,summon:.25,cost:120,description:'召唤伤害 +25% · 你的靠谱搭子' },
  { id:'english',name:'英语型',subtitle:'Keep calm and survive',icon:'globe',color:'#c58e91',weapon:'wifi',hp:100,crit:.05,area:.2,summon:0,cost:100,description:'攻击范围 +20% · 交流没有边界' },
  {id:'architect',name:'建筑型',subtitle:'让结构撑起学期',icon:'ruler',color:'#77a8bd',weapon:'ruler',hp:120,crit:.05,area:.1,summon:0,cost:0,armor:1,achievement:'structure',description:'生命 120 · 范围 +10% · 护甲 +1',},
  {id:'experiment',name:'实验型',subtitle:'冷静地超载',icon:'flask',color:'#7bb9cc',weapon:'cryo',hp:95,crit:.05,area:0,summon:0,cost:0,duration:.15,achievement:'calmResearch',description:'持续时间 +15% · 从液氮开始实验'},
];
export const TALENTS: Talent[] = [
  {id:'hp',name:'身体素质',icon:'heart',description:'每级最大生命 +5'},
  {id:'damage',name:'学术积累',icon:'book',description:'每级伤害 +3%'},
  {id:'speed',name:'校园健步',icon:'shoe',description:'每级移动速度 +2%',parent:'hp'},
  {id:'haste',name:'早起训练',icon:'clock',description:'每级攻击速度 +2%',parent:'damage'},
  {id:'xp',name:'学习方法',icon:'cap',description:'每级经验 +3%',parent:'damage'},
  {id:'regen',name:'作息恢复',icon:'bowl',description:'每级每秒回血 +0.1',parent:'hp'},
  {id:'magnet',name:'学分感知',icon:'magnet',description:'每级吸附半径 +10',parent:'xp'},
  {id:'luck',name:'幸运日程',icon:'clover',description:'每级幸运值 +0.03',parent:'speed'},
];
export const ENEMIES: EnemyDef[] = [
  {id:'homework',rank:'normal',behavior:'chase',tags:[],name:'作业',hp:12,speed:54,damage:5,xp:1,radius:14,color:'#e6b281',from:1},
  {id:'checkin',rank:'normal',behavior:'snake',tags:[],name:'签到',hp:18,speed:82,damage:6,xp:1,radius:13,color:'#e7c267',from:1},
  {id:'ppt',rank:'normal',behavior:'flank',tags:[],name:'组会 PPT',hp:30,speed:62,damage:8,xp:2,radius:16,color:'#d98f87',from:3},
  {id:'review',rank:'normal',behavior:'ranged',tags:['ranged'],name:'审稿意见',hp:22,speed:44,damage:6,xp:3,radius:15,color:'#b89dcc',from:5},
  {id:'receipt',rank:'normal',behavior:'heavy',tags:['heavy'],name:'报销单',hp:65,speed:36,damage:10,xp:4,radius:18,color:'#91b2ad',from:9},
  {id:'ddl',rank:'elite',behavior:'charge',tags:[],name:'DDL',hp:450,speed:65,damage:14,xp:12,radius:23,color:'#df6868',from:4},
  {id:'advisor',rank:'elite',behavior:'advisor',tags:[],name:'导师突然找你',hp:600,speed:80,damage:14,xp:50,radius:28,color:'#6a967d',from:3},
  {id:'proposal',rank:'boss',behavior:'boss',tags:[],name:'开题报告',hp:12000,speed:48,damage:18,xp:100,radius:48,color:'#dd9b66',from:8},
  {id:'defense',rank:'boss',behavior:'boss',tags:[],name:'中期答辩',hp:32000,speed:42,damage:24,xp:180,radius:54,color:'#ab8fc5',from:16},
  {id:'finals',rank:'boss',behavior:'boss',tags:[],name:'期末周',hp:80000,speed:35,damage:30,xp:300,radius:62,color:'#df7179',from:22},
  {id:'math',rank:'bossAdd',behavior:'exam',tags:['exam'],name:'数学考试',hp:900,speed:40,damage:14,xp:12,radius:24,color:'#e4ad59',from:22},
  {id:'english',rank:'bossAdd',behavior:'exam',tags:['exam'],name:'英语考试',hp:900,speed:44,damage:14,xp:12,radius:24,color:'#7daf9c',from:22},
  {id:'coding',rank:'bossAdd',behavior:'exam',tags:['exam'],name:'编程考试',hp:900,speed:42,damage:14,xp:12,radius:24,color:'#7b9ecb',from:22},
  {id:'mechanics',rank:'bossAdd',behavior:'exam',tags:['exam'],name:'结构力学考试',hp:900,speed:38,damage:14,xp:12,radius:24,color:'#bb96c4',from:22},
  ...NEW_ENEMIES,
];
export const ENEMY_INDEX = Object.fromEntries(ENEMIES.map((e,i)=>[e.id,i])) as Record<string,number>;
export const BOSS_WEEKS = [8,16,22];
export const CHEST_WEEKS = [4,6,10,12,14,18,20];
export const WEEK_SECONDS = 40;
export const CONTENT_VERSION = '4.0.0';
