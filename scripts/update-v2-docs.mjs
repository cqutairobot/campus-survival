import {createServer} from 'vite';
import {readFileSync,writeFileSync} from 'node:fs';

const read=name=>JSON.parse(readFileSync(`docs/${name}`,'utf8'));
const fmt=(n,d=2)=>n===null||n===undefined?'—':Number(n).toFixed(d).replace(/\.00$/,'');
const pct=n=>`${fmt(n*100,1)}%`;
const table=(head,rows)=>`| ${head.join(' | ')} |\n| ${head.map(()=>'---').join(' | ')} |\n${rows.map(row=>`| ${row.join(' | ')} |`).join('\n')}\n`;
const series=a=>a.map(n=>String(n)).join(' / ');
const quantile=(vs,q=.5)=>{const s=vs.filter(v=>v!==null&&v!==undefined).sort((a,b)=>a-b);return s.length?s[Math.floor((s.length-1)*q)]:null;};
const talentNames={zero:'零天赋',partial:'固定部分天赋',full:'满天赋'},strategyNames={balanced:'均衡',expand:'扩充',specialize:'专精'};
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
  const {WEAPONS,PASSIVES,CHARACTERS,ENEMIES,CONTENT_VERSION}=await server.ssrLoadModule('/src/data/catalog.ts');
  const {xpForLevel,spawnRate,weekHpMultiplier}=await server.ssrLoadModule('/src/progression/rules.ts');
  const report=read('v2-early-runs.json'),baseline=read('v1-early-baseline.json'),natural=read('natural-run.json'),stationary=read('stationary-run.json');
  const name=id=>WEAPONS.find(w=>w.id===id)?.name??PASSIVES.find(p=>p.id===id)?.name??id;
  const owned=skills=>skills.map(s=>`${name(s.id)} ${s.evolved?'✦':`L${s.level}`}`).join('；');
  let balance=`# v2 爽感强化数值表\n\n内容版本 ${CONTENT_VERSION}。由 \`npm run docs:v2\` 从 \`catalog.ts\`、规则函数和原始统计生成；基础武器均按普通品质、零天赋、无被动计算，数组顺序为 Lv.1 → Lv.5。\n\n## 16 种基础武器\n\n`;
  balance+=table(['武器','伤害','冷却（秒）','数量','范围/射程'],WEAPONS.map(w=>[w.name,series(w.damage),series(w.interval),series(w.count),series(w.range)]));
  balance+='\n'+table(['武器','额外逐级参数','五级形态'],WEAPONS.map(w=>[w.name,['pierce','width','spread','explosion','duration'].filter(k=>w[k]).map(k=>`${({pierce:'穿透',width:'束宽',spread:'扇角 °',explosion:'爆炸半径',duration:'持续秒'})[k]} ${series(w[k])}`).join('；')||'见数量、范围或冷却变化',w.forms.join(' → ')]));
  balance+='\n激光的数量为每次光束数，Wi-Fi 为每次独立扫描波数；导师赏识的基础数量为可见印章数，伤害仍只结算一轮。多发自动索敌优先分配不同目标。PPT 每个去程/回程各自记录已命中目标，进化后去程为向外扩展的旋线、回程弧旋收束。\n\n## 16 条进化\n\n';
  balance+=table(['进化','所需被动 ≥Lv.1','伤害','冷却','数量','范围','附加规则与识别特征'],WEAPONS.map(w=>[w.evolution.name,name(w.evolution.passive),w.evolution.damage,w.evolution.interval,w.evolution.count,w.evolution.range,w.evolution.description]));
  balance+='\n其余进化参数：飞刀穿透 8；激光束宽 36；咖啡扇角 180°；代码爆炸半径 56；键盘和广播 360°；闪电末两节点爆炸半径 45；装订穿透 3。咖啡 12/秒×2 秒，代码每弹 2×18 碎片，助手每 4 秒 80 伤害/半径 100 集火，论文墨池 10/秒×2 秒，推荐信 35 护盾×4 秒，黄金阵 45% 减速×2 秒，擦除场每 .4 秒结算一次并消弹，广播每次回复 2 HP。品质、伤害、召唤、范围与持续加成经统一参数入口计算；DoT 不再暴击。\n\n## 经验与卡池\n\n`B(L)=12+6(L−1)+.5(L−1)²`；乘数 L≤12 为 .5，12<L<24 为 `.5+(L−12)/24`，L≥24 为 1，最终向上取整。到 Lv.24 累计少 1012 经验，之后每级恢复原成本。\n\n';
  const old=l=>Math.ceil(12+6*(l-1)+.5*(l-1)**2),sum=(f,l)=>Array.from({length:l-1},(_,i)=>f(i+1)).reduce((a,b)=>a+b,0);
  balance+=table(['当前等级','旧需求','v2 需求','旧累计到此级','v2 累计到此级'],[1,2,3,4,5,8,10,12,15,20,24,30].map(l=>[l,old(l),xpForLevel(l),sum(old,l),sum(xpForLevel,l)]));
  balance+='\n前三分钟不足四主动武器时，保底一张未持有武器及一张已持有技能升级（存在可升级项时）；第三张优先配方被动，主武器 Lv.4 后缺少配方时立即提供。四武器后解除扩充保底，仍允许专精。玩家可以拒绝新武器。基础吸附 120、天赋每级 +10；同次拾取连升只播一次金色汇聚，后续卡片立即可选，单个逻辑步的重复选卡指令只消费一次。\n\n## 周导演与生命补偿\n\n';
  balance+=table(['周','普通怪/秒','存活上限','周生命总倍率'],Array.from({length:22},(_,i)=>i+1).map(w=>[w,fmt(spawnRate(w)),Math.min(1200,160+48*w),fmt(weekHpMultiplier(w),4)]));
  balance+='\n开局 12 敌人。忽略存活上限和额外精英，五分钟每分钟普通怪计划生成 172 / 236 / 338 / 458 / 634，另有开局 12。第 1—5 周生命不变，第 6—9 周补偿升到 1.10，第 10—17 周升到 1.25，后续保持；接触伤害、敌弹、预警时长不变。第 9 周起 DDL 间隔 20 秒。\n\n';
  balance+=table(['Boss/考试','基础生命'],ENEMIES.slice(7).map(e=>[e.name,e.hp]));
  balance+='\n## 连杀、狂热、暴击链和汇流\n\n';
  balance+=table(['机制','规则'],[
    ['连杀','3 秒续接，10 / 25 / 50 / 100 切换字幕、音阶和边框，最高 +7 半音；断连后重新计数'],
    ['狂热','普通 +1 / 精英 +8 / Boss +25；100 点触发 6 秒，攻速×1.20、范围×1.15，遵守 2.5 / 1.8 硬上限'],
    ['充能窗口','结束后 12 秒冷却；狂热及冷却中不预存。4 秒无击杀后每秒衰减 10'],
    ['暴击链','每 3 次暴击，冷却 .6 秒；最多跳至 2 个其他目标，每跳 ≤130，伤害为触发攻击暴击倍率前的基础伤害×.25'],
    ['链边界','同链目标不重复，不能再暴击或触发连锁，实际扣血计入原武器。冷却中暴击计数最多积存 3，冷却后下一次暴击可触发'],
    ['清场','1 秒 ≥20 普通击杀，冷却 20 秒；吸取 360 半径内已有经验，充能 +15，不生成额外经验'],
    ['宝石','≥4 / ≥12 / ≥48 / ≥192 升档；超大和虹彩有额外环/节点。每 1 秒合并，保留总经验及非经验掉落'],
  ]);
  balance+='\n## 表现预算与设置\n\n';
  balance+=table(['项目','高','中','低'],[
    ['粒子容量','12288','4096','512'],['Bloom scale / threshold','1.4（高潮1.8）/ .55','.9 / .60','关闭'],['命中 / 暴击粒子','8 / 20','4 / 10','2 / 4'],['击杀碎裂','24—36','15','5'],['升级 / 进化粒子','150 / 600','80 / 260','20 / 60'],['拖尾采样点','16','8','2'],['残影','.15秒内最多3层','1层','关闭'],['冲击波幅度','14','8','几何环'],
  ]);
  balance+='\n粒子使用共享材质图集与 12288 容量类型数组，只更新活跃项；到预算后循环复用视觉粒子，不影响逻辑池。拖尾依据模拟时刻及位移采样，同一模拟帧不会随刷新率重复发射。敌弹和预警处于独立上层。手动高档固定预算；自动模式从高档起步，弱设备可切换中/低档。\n\n普通命中全局停顿为 0；暴击目标局部约 12ms 表现定格、震屏 1.5px；精英/重击最多 1 逻辑步、Boss 终结最多 2 步，滚动一秒最多 3 步（50ms），震屏上限 8px 并平滑衰减。计时、输入采集与渲染保持运行，无忙等。普通白闪、爆炸亮核、色差与镜头效果服从闪光/动效设置。\n\n进化演出 1.2 秒，收束 → 定格揭名 → 形态展开，按钮可立即跳过。音效按武器发射、敌人材质命中、暴击重音、碎裂分层，50ms 聚合，最多 23 个音效加 1 条音乐，关键事件优先，高潮音乐约 −3dB。\n\n新增残影与事件触觉开关默认打开；旧 schema v1/v2 自动补齐且保留进度。默认闪光 .65、震屏 .6。触觉能力/用户激活检测后触发：精英 12ms、升级 20ms、受伤 25ms、进化 [12,35,18]ms，事件间隔 ≥200ms；不支持时仍使用声音与画面。\n';
  writeFileSync('docs/v2-balance.md',balance);

  let stats=`# v2 前五分钟与完整学期统计\n\n原始报告：[v2 ${report.totalRuns} 局](v2-early-runs.json)、[修改前 ${baseline.totalRuns} 局](v1-early-baseline.json)、[P0 中间测量](v2-p0-runs.json)、[满天赋完整学期](natural-run.json)、[零天赋原地死亡](stationary-run.json)。\n\n## 口径\n\n每格 ${report.seedsPerCell} 个种子（1—${report.seedsPerCell}），4 角色 × 3 天赋 × 3 策略，共 ${report.totalRuns} 局，每 30 战斗秒采样，最远 300 秒。统计器只使用正常移动、选卡、拾取、宝箱与演出跳过，无无敌、额外伤害、授予技能或调试经验；所有局次 cheated=false。部分天赋固定为生命2/伤害2/速度1/攻速1/经验2/回血1/吸附1/幸运1；满天赋为8条各5级。\n\n分钟等级、击杀和构筑分位数只用到达该时刻的存活样本，另列全部开局数和死亡数；死亡样本保留在 JSON 中。每组按四角色汇总，P50/P90 采用排序后 floor((N−1)×q) 位置。选卡、暂停和演出墙钟时间不计入战斗秒。自动走位的拾取效率不等于真人，不能把这些秒数当真人耗时。\n\n`;
  stats+=table(['天赋/策略','全部开局','死亡','首升P50/P90 秒','主武器Lv.5 P50秒','首进化P50秒','3/5分钟Lv.P50'],report.summaries.map(s=>[`${talentNames[s.talent]}/${strategyNames[s.strategy]}`,s.starts,s.deaths,`${fmt(s.firstUpgradeP50)}/${fmt(s.firstUpgradeP90)}`,fmt(s.mainLv5P50),fmt(s.evolutionP50),`${s.minutes[2].levelP50}/${s.minutes[4].levelP50}`]));
  stats+='\nLv.5 与进化时间的分位数只在实际达到的局次上计算；原始数据保留未达到的 null。首分钟升级次数中位数为零天赋均衡 6 次；并非计划静态经验流下预测的 5 次。\n\n## 零天赋均衡策略逐分钟\n\n';
  const zero=report.summaries.find(s=>s.talent==='zero'&&s.strategy==='balanced'),group=report.runs.filter(r=>r.talent==='zero'&&r.strategy==='balanced');
  stats+=table(['战斗秒','全部开局/存活','等级P10/P50/P90','本分钟升级P50','击杀P50','主动数P50','被动数P50','≥3武器覆盖'],zero.minutes.map(m=>{const ss=group.flatMap(r=>r.samples.filter(s=>s.seconds===m.seconds));return[m.seconds,`${m.allStarts}/${m.survivors}`,`${m.levelP10}/${m.levelP50}/${m.levelP90}`,m.upgradesP50,m.killsP50,m.activeWeaponsP50,quantile(ss.map(s=>s.passives.length)),pct(m.coverage3Weapons)];}));
  stats+='\n## 零天赋均衡分角色\n\n';
  stats+=table(['角色','全部开局/5分钟存活','首次升级P50秒','Lv.5 P50秒','首进化P50秒','3分钟等级P50','5分钟等级P50'],CHARACTERS.map(c=>{const rs=group.filter(r=>r.character===c.id);return[c.name,`${rs.length}/${rs.filter(r=>r.completed).length}`,fmt(quantile(rs.map(r=>r.first.upgrade))),fmt(quantile(rs.map(r=>r.first.mainLv5))),fmt(quantile(rs.map(r=>r.first.evolution))),quantile(rs.flatMap(r=>r.samples.filter(s=>s.seconds===180).map(s=>s.level))),quantile(rs.flatMap(r=>r.samples.filter(s=>s.seconds===300).map(s=>s.level)))];}));
  stats+='\n## 一局完整的 30 秒采样\n\n零天赋、均衡型、均衡策略、seed 1。经验“入账”包含经验加成，“生成/拾取/剩余”为原始掉落单位，便于守恒核对。\n\n';
  const sample=group.find(r=>r.character==='balanced'&&r.seed===1);
  stats+=table(['秒','级','击杀/在场','HP/受伤次数','主动/被动数','生成/拾取/剩余XP','入账XP','实际伤害'],sample.samples.map(s=>[s.seconds,s.level,`${s.kills}/${s.enemies}`,`${fmt(s.hp,1)}/${s.metrics.hurtCount}`,`${s.weapons.length}/${s.passives.length}`,`${s.metrics.generatedXp}/${s.metrics.collectedRawXp}/${s.droppedXp}`,fmt(s.metrics.creditedXp),Math.round(Object.values(s.damage).reduce((a,b)=>a+b,0))]));
  stats+='\n'+table(['时刻','主动武器等级','被动等级'],sample.samples.filter(s=>s.seconds%60===0).map(s=>[s.seconds,owned(s.weapons),owned(s.passives)]));
  const deaths=report.runs.filter(r=>r.deathTime!==null);
  stats+='\n## 死亡、经验和池\n\n'+table(['天赋/角色/策略/种子','自然死亡战斗秒'],deaths.map(r=>[`${talentNames[r.talent]}/${CHARACTERS.find(c=>c.id===r.character).name}/${strategyNames[r.strategy]}/${r.seed}`,fmt(r.deathTime)]));
  const error=Math.max(...report.runs.flatMap(r=>r.samples.map(s=>Math.abs(s.metrics.generatedXp-s.metrics.collectedRawXp-s.droppedXp))));
  stats+=`\n全部 ${report.totalRuns} 局共 ${deaths.length} 个死亡样本；所有采样的生成XP−拾取原始XP−地面XP最大误差 **${error}**。逻辑池失败合计 **${report.runs.reduce((sum,r)=>sum+r.poolFailures,0)}**，各池 overflow 合计 **${report.runs.reduce((sum,r)=>sum+Object.values(r.pools).reduce((a,p)=>a+p.overflow,0),0)}**。未结束局的绩点字段为“此刻结束时的预览”，不会实际结算或写入用户存档。\n\n`;
  stats+=table(['逻辑池','全体峰值'],['enemies','shots','enemyShots','areas','drops'].map(k=>[k,Math.max(...report.runs.map(r=>r.pools[k].peak))]));
  stats+='\n## 满天赋完整学期与原地死亡\n\n';
  const r=natural.result;
  stats+=`固定 seed ${natural.seed}，正常走位和选卡，**${fmt(r.seconds)} 战斗秒、Lv.${r.level}、${r.kills} 击杀、${r.bosses} Boss、${r.credits} 绩点**，自然通关，debug=false。Boss 时间不计入 880 教学秒。\n\n`;
  stats+=table(['Boss','生命','战斗耗时秒'],natural.metrics.bossFights.map(b=>[ENEMIES[7+b.boss].name,b.damage,fmt(b.seconds)]));
  stats+=`\n零天赋、seed ${stationary.seed}、原地不移动，正常选卡并关闭奖励，在 **${fmt(stationary.result.seconds)} 秒、第 ${stationary.result.week} 周**自然死亡，Lv.${stationary.result.level}、${stationary.result.kills} 击杀、${stationary.result.credits} 绩点。\n\n`;
  stats+=table(['周段','普通怪1—3次命中占比','首伤到击杀<3秒占比'],['early','middle','late'].map((band,i)=>{const hits=natural.metrics.normalKillHits[band],times=natural.metrics.normalKillSeconds[band];return[['1—5周','6—16周','17—22周'][i],pct(hits.slice(1,4).reduce((a,b)=>a+b,0)/hits.reduce((a,b)=>a+b,0)),pct(times.slice(0,4).reduce((a,b)=>a+b,0)/times.reduce((a,b)=>a+b,0))];}));
  stats+='\n命中次数包含所有武器、暴击链及持续伤害；“首伤到击杀”包含脱离攻击范围后再接战的时间。中后期未普遍达到 1—3 次命中目标，后段约半数普通怪首伤到死亡超过 3 秒，是这轮平衡验收的明确偏差；不能仅凭成功通关就认定这一目标达标。\n\n## 与计划预测的差别\n\n约定的武器、经验、吸附、刷怪、Boss 和机制数值全部保留。实际首次升级约 4 秒、首分钟6次选卡、三/五分钟等级约15/22，快于计划8—15秒首升、首分钟约5次、三/五分钟11—14/17—21级的预测。均衡/专精主武器升满也偏早，扩充策略的Lv.5/首进化约3/3.8分钟更接近目标。开局12敌人、多发分配、吸附120和更高击杀效率共同提高了实际入账经验；原计划表格使用假设经验流，并非实测。\n\n本轮没有为对齐预测而改动约定经验掉落、武器参数或隐藏发放技能。统计器的策略评分和走位可复现；真人选卡时间、更多弱构筑和手机热机仍需继续验收。\n';
  writeFileSync('docs/v2-run-statistics.md',stats);
  console.log(`已生成 v2 数值表与 ${report.totalRuns} 局统计文档。`);
} finally {await server.close();}
