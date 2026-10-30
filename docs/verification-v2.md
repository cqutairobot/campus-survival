# v2 本地验收记录

范围：依据 `/workspace/game_v2_plan.md` 完成 P0 → P1 → P2，七项确认采用推荐方案。纯前端，schema 保持 v2，内容版本升级为 2.0.0；未注册或部署站点。新增设置由验证/迁移逻辑自动补齐。

## 构建与自动化

| 检查 | 实际结果 | 原始记录 |
| --- | --- | --- |
| `npm run build` | 成功，TypeScript 零错误；Vite 静态产物在 dist | [构建日志](verification-build.log) |
| `npm test` | 11 文件、93 测试全部通过 | [测试日志](verification-tests.log) |
| 四个可用浏览器项目 | 22 passed、2 skipped、0 failed | [E2E 日志](verification-e2e.log) |
| 最后视觉修改后的冒烟 | Chromium/iPhone 战斗闭环 2 passed | [冒烟日志](verification-e2e-smoke.log) |
| Firefox | 启动失败，未进入应用测试 | [启动失败日志](verification-firefox.log) |
| 多种子五分钟矩阵 | 20种子×4角色×3天赋×3策略=720局，保留2局自然死亡 | [原始数据](v2-early-runs.json)、[统计解释](v2-run-statistics.md) |

E2E 覆盖菜单、图鉴、存档导入导出、天赋、开局、移动、暂停、选卡、宝箱/进化、Boss、结算、触摸取消、旋转/失焦、音频设备缺失和重开资源回收。新增 v2 案例实际点击狂热条、连杀与快速进化按钮，并检查高档 12288 预算。

使用的四项目命令：

```bash
CAMPUS_WEBKIT_EXECUTABLE=/tmp/campus-webkit.sh npm run test:e2e -- \
  --project=chromium --project=pixel-6 --project=webkit --project=iphone-12
```

`/tmp/campus-webkit.sh` 是本环境已有的 WPE WebKit 启动器，使用 `/tmp/campus-browser-libs` 中的运行库，不属于游戏运行依赖。标准 WebKit 启动最初缺少 libevent、libgstgl、libgstcodecparsers、libavif、libmanette、libenchant；使用该启动器后，桌面 Safari/iPhone 模拟项目完成测试。两项 skipped 是 WebKit 项目中仅支持 Chromium CDP 的重开堆回收测试，Chromium 和 Pixel 6 项目的同一检查通过。

初次不指定环境的完整 `npm run test:e2e` 为10通过/15启动失败，不能视为全部通过；随后补齐可用 WebKit 运行方式并完成上述四项目。Firefox 用默认临时目录和工作区 TMPDIR、禁用内容沙箱分别重试，仍报 `Could not find profile folder`；这是浏览器启动阻塞，未归为应用通过。当前最终 E2E 日志对应成功的四项目运行，单列 Firefox 原始失败。

单元/集成回归包含全部16武器五级可见成长、16进化实际伤害与轮廓、双波/光束/回旋命中去重、持续区域不叠伤、暴击链限次与归属、狂热持续/冷却/衰减/硬上限、清场经验守恒、大宝石边界、连升/宝箱/进化重复指令保护、旧存档新增设置、触觉能力与限频、30/60/120/240 FPS及各档设置确定性。新增普通输入小矩阵在 `npm test` 中执行16局前三分钟回归。

## 跑局结果

详细五级/进化/刷怪参数见 [v2 数值表](v2-balance.md)，全部统计口径、每30秒示例及分组结果见 [跑局统计](v2-run-statistics.md)。

- 720局全部使用正常移动、正常选卡和宝箱，无调试增强；2局自然死亡保留。生成经验−拾取原始经验−地面剩余经验最大误差0；所有逻辑池 overflow=0。
- 零天赋均衡策略（4角色共80个开局）：首升P50 **4.43秒**、P90 **5.53秒**；3/5分钟等级P50 **15/22**，击杀P50 **718/1777**；3分钟≥3武器覆盖 **100%**。5分钟存活79/80，分位数使用到达该分钟的样本。
- 满天赋 seed123 自然通关：**1032.52战斗秒、Lv.61、15099击杀、3 Boss、165绩点**，debug=false。三场Boss用时7.56/31.87/113.09秒，教学时间880秒。[完整记录](natural-run.json)
- 零天赋原地 seed51：**174.09秒、第5周、Lv.7、682击杀**自然死亡，正常结算8绩点。[死亡记录](stationary-run.json)

战斗秒不含选卡、宝箱和演出墙钟等待。未结束的五分钟样本中，绩点为此刻结束时的预览，不写用户存档。修改前72局与P0中间72局另行保留；原计划的静态经验流表不是旧版实测。

## 压力检查

六种进化武器并发，定时狂热；CPU压力每两秒提供24个可击杀目标，浏览器压力额外每秒约60次材质碎裂及周期进化高潮。受控场景补齐/撤出敌人以维持目标密度，自动处理奖励；浏览器隐藏奖励遮罩，固定手动高档。

| CPU目标敌人 | 模拟秒数 | p95 ms | p99 ms | 池失败 | 原始报告 |
| --- | --- | --- | --- | --- | --- |
| 500 | 60 | 0.783 | 1.524 | 0 | [500](v2-simulation-500.json) |
| 800 | 60 | 1.562 | 3.132 | 0 | [800](v2-simulation-800.json) |
| 1200 | 600 | 2.411 | 3.349 | 0 | [1200](v2-simulation-1200.json) |

| 浏览器目标敌人 | 请求墙钟秒数 | p95 / p99 ms | 长帧>50ms | 逻辑丢时秒 | 粒子预算/峰值 | 原始报告 |
| --- | --- | --- | --- | --- | --- | --- |
| 500 | 30 | 150.10 / 183.40 | 245 | 10.33 | 12288/12288 | [500](v2-browser-500.json) |
| 800 | 30 | 133.50 / 150.10 | 265 | 8.57 | 12288/12288 | [800](v2-browser-800.json) |
| 1200 | 30 | 150 / 183.40 | 141 | 5.77 | 12288/12288 | [1200](v2-browser-1200.json) |

浏览器报告的 renderer 为 **ANGLE / Vulkan / SwiftShader 软件渲染**，没有真实GPU。三个档位测试场景固定为高档，均无页面错误或逻辑池溢出；视觉粒子达到预算后正常复用，次数单列为 recycled。此处没有据本机低帧率削减高档预算。p95/p99来自渲染间隔，逻辑丢时包含固定步长追赶上限与大于100ms的输入帧增量截断；这些数值不能推断用户手机或带显卡电脑的帧率。

截图：[500](v2-browser-500.png)、[800](v2-browser-800.png)、[1200](v2-browser-1200.png)。兼容原文档路径的 `performance-simulation.json`、`performance-browser.json`、`stress-scene.png` 现指向本轮1200场景数据；原记录另存为 v1 前缀文件。浏览器音频压力静音，audioVoicePeak=0，不构成真实设备24声部听感验证。

复现：

```bash
npm run test:balance
npm run docs:v2
node tests/performance/benchmark.mjs --seconds=600 --entities=1200 --output=docs/v2-simulation-1200.json
# 另一个终端运行 npm run dev
node tests/performance/browser-stress.mjs --seconds=30 --entities=1200 --quality=high --output=docs/v2-browser-1200.json
```

## 明确偏差与待验

1. 功能、基础参数和机制均已落地；首升约4秒、首分钟6次选卡、3/5分钟Lv.15/22，快于计划的8—15秒、约5次、Lv.11—14/17—21。均衡/专精主武器升满偏早，扩充策略更接近计划。保留约定数值，没有通过减少经验掉落或削减开局火力来对齐预测。
2. 中后期“普通怪约1—3次有效命中”没有普遍达标。满天赋自然局17—22周仅约6.3%的普通怪在1—3次各类伤害结算内击杀，首伤后3秒内击杀约50.8%；命中统计包含小额连锁与DoT，首伤计时包含脱战后再接敌。仍需真人结合弱构筑、受伤频率与后期敌种组合继续平衡，不能把通关回归视为此目标已完成。
3. Firefox因浏览器启动环境受阻未验；真实手机10—15分钟热机、触觉API实际支持、音效层次与主观舒适度未验。无GPU环境的浏览器压力仅检查完整预算和错误，不替代真机性能。
4. UI检查出现过实时击杀改变狂热数值导致的测试竞争；断言前设置安静场景后通过。曾并行运行两组Playwright导致临时trace冲突，最终四项目改为同一运行顺序执行。日志仍有Pixi销毁绑定和空伤害条GSAP的非致命warning，最终受检页面无console error/pageerror。

机读汇总见 [v2-validation.json](v2-validation.json)。
