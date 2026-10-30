# v4.0.0 P0：可评审样板

本次仅实现 `/workspace/game_v4_plan.md` §13 的 P0，以及用户明确要求的设置、回退、音频、手机和测试保障。P1/P2 的全内容美术覆盖、全界面重构、完整实验室、KTX2 和精修均未展开。

## 不变的模拟边界

- 固定 60Hz、原 HitStopBudget、伤害、AI、碰撞、真实击退、波次、奖励、掉落、每日种子、评分均保持 v3。
- `src/core/engine.ts` 只补充 slot、generation、类别、材质、伤害种类、方向和死亡快照事件；回复只补实际回复量的表现事件。
- `CONTENT_VERSION=4.0.0`，存档 schema 仍为 3，存储键仍为 `campus-survival.save.v3`；玩法 `RULES_VERSION`、`DAILY_RULES_VERSION` 保持原值。
- 表现随机数不访问玩法随机流。视觉变化不提交额外奖励或修改碰撞体。

## 视觉与组件

`src/design/tokens.ts` 同时向 CSS 变量和 Pixi 数字颜色提供值。主色是深墨蓝、青玉与香槟金，校园地图继续使用原明亮地面。玻璃面板采用 88% 实底、12px 模糊、115% 饱和度与金属内高光。512px Leschge 纸纹通过低透明度叠加使用。

主菜单使用 2560×1440 WebP 背景、独立标题和角色立绘。手机使用同一原图的 1440×2560 裁切；头像、精灵由均衡型立绘派生。升级选卡增加物品插画、品质名称与纹样、清晰比较信息；220ms/45ms 的卡片进入不会锁住输入。HUD 使用头像、生命残影条（延迟 220ms）、经验、周数、Boss、大招与构筑层级，手机保留独立触点。

基础组件在 `src/ui/components/`：Button、Panel/ModalShell、ItemCard、RarityFrame、StatBar、Tooltip、Toast、AnimatedNumber、Art。其余界面沿用既有业务与布局，只应用必要的共享材质；全界面重制属于 P1。

字体为自托管 Campus Sans（Noto Sans SC 400/600）、Campus Title（站酷庆科黄油）、Campus Digits（Rajdhani 600）。内部字体名已重命名，源许可证在 `public/licenses/`。首屏与其余文案按 unicode-range 分包；字体最多等待 1.8 秒后使用系统回退。

## 反馈

FeedbackDirector 消费 VisualEvent，统一协调 EntityFeedback、PresentationClock、CameraRig、PostFX 与 DeathFX。新增停顿不会调用 `GameEngine.impact()` 或让 tick 提前返回。

- 局部停顿普通/暴击/击杀/精英/小 Boss/Boss 分别为 1/2/2/3/4/5 个 60Hz 帧，时间单位均为秒；每目标每秒 8 帧，镜头强调每秒 6 帧，重叠取最大。
- 受击按照 slot + generation 绑定。位置始终读取实时模拟坐标，只叠加视觉后坐；近身偏移最多 2px。对象池复用时旧效果立即失效。
- Trauma 以 1.8/s 衰减，二次曲线乘用户强度，方向占 65%，24/41Hz 连续噪声占 35%。普通连击限制在轻量范围，Boss 可以覆盖较小的镜头强调。
- 暴击、精英和 Boss 使用分级推镜、冲击波、色差与径向模糊。滤镜预创建并在事件结束后移出链；敌弹、危险提示和 DOM HUD 不进入滤镜链。每日沿用禁用世界推镜的逻辑。
- 纸片、金属、玻璃的死亡使用独立纹理分块快照，停留后向受力方向散开，不延迟死亡、池释放或掉落。非样板对象复用通用反馈。
- 数字区分暖白普通、金色暴击、蓝色护盾、浅紫持续伤害、红色受伤、绿色回复；80ms 内同目标/代次/来源/类型合并，只合计表现事件。

## 设置与画质

新档 shake/flash 都为 0.8，旧档明确数值（含 0）不覆盖。新增 settingsVersion=4、hitStop、zoomEffects、distortion、uiSfx、dynamicMusic、musicDucking。归一化是纯函数、幂等，不修改输入。

高/中/低的 DPR 上限为 2/1.5/1，粒子上限为 32768/8192/1024，数字上限为 160/80/32。低档关闭扭曲，高档允许径向模糊；美术主体始终保留。FPS 仅用于调试显示，任何画质、音效或特效分级都不读取 FPS。

motion=false 立即清除局部停顿、受击形变、后坐、屏震、推镜、扭曲和死亡移动；伤害数字与结果数字静态显示。原有模拟停顿预算保持不变。声音、危险提示与低血量静态边缘保留。

## 评审入口

`/?debug=1` → 开局 → 展开右下调试工具 →「播放 6 秒样板」。样板依次展示普通、暴击、击杀、精英、小 Boss、Boss、玩家受伤；可选方向、纸/金属/玻璃/冰/键帽/砖石/能量材质、缺图与音频失败、音乐试听。其事件与快照不提交给引擎，不写存档或每日资格。原有修改玩法的调试命令仍按既有规则转为练习局。

设置 →「反馈即时预览」是独立 Canvas fixture，使用同一个反馈调度器与当前设置。P0 没有实现 P2 的完整 A/B 参数编辑、全界面 fixture 与调试 JSON 导出。
