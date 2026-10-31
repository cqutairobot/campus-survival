# v4.0.0 音频与混音

音频由 App 生命周期的 `GameAudio` 管理。首个 pointer/key 手势解锁 Howler 共享 AudioContext；短音效走 Web Audio，成品音乐也走 Web Audio，以便与音效共同经过输出预设与限幅。资源失败回退 ZzFX，场景退出释放本局声部和排队事件，App 卸载取消待加载音乐、停声部并释放音频资源。没有读取 Howler 的私有声部或缓存字段。

## 完整覆盖

- 22 个武器与其进化、6 个融合，通过完整的材质映射、各武器稳定音色参数及发射/命中/重击分层覆盖。6 融合和6大招另有专用离线材质组合。
- 25 个敌人的死亡音读取目标材质，最后一击的武器不会把盾卫死亡变成液体声。七种材质各有4普通命中、2死亡、2发射变体，连续播放不会重复同一片段。
- 六个现有校园事件有转场声。停电保留低通、考试狂暴保留1.08倍播放速率；暴雨使用录制的水声加工成轻量环境循环，明确标为水流 Foley，并不宣称实录户外雨声。
- UI 有 hover/press/confirm/back/tab/disabled、四品质、宝箱锁扣与打开、天赋购买、成就、升级与大招就绪等声音。按钮可用 `data-sound` 指定声音；`none` 可避免组件主动播放后的重复确认音。触屏不会触发 hover，滑杆不触发按钮确认。

物理声音的起音和主体优先使用 OwlishMedia、unicaegames、scorcher24 的纸张、键盘、杯子、水流等录音；Kenney 物理/能量/UI设计音只作为补充和尾音，不把整个资源包称为实录。

## 调度与混音

`AudioDirector` 按实际 Howl playback id 计声部，包含暴击和大事件叠加层。优先级/类别上限依次为 hover 10/1、拾取20/4、发射30/8、普通命中40/18、死亡50/8、暴击60/6、重要事件90/4、受伤及警告100/4。全局上限48，低优先级上限44，为关键事件保留4声部。超限从低优先级、较轻或较远、较旧声部淘汰。

同一攻击来源及材质的35ms窗口跨渲染帧聚合，不因FPS变化；拾取窗口45ms并限制升调。各离线普通混音仅占1声部。普通采样音高约±60 cents、音量±1.5dB；暴击范围更窄；UI确认与品质揭示不随机变调；左右声像限±0.65。

音乐压低取重叠事件中最深的包络：暴击−2.5dB、受伤−5dB、精英−6dB、Boss/融合−8dB、传说揭示−4dB，attack/hold/release沿用计划§8.3。主音量、音乐音量、暂停增益、动态强度和duck只在`musicGain`处相乘一次。

## 五种音乐状态

| 状态 | 成品曲 | 作者及许可 |
|---|---|---|
| 菜单 menu | [Happy Lullaby (song17)](https://lpc.opengameart.org/content/happy-lullaby-song17) | cynicmusic / The Cynic Project，CC0 |
| 普通 normal | [Battle Theme B for RPG](https://opengameart.org/content/battle-theme-b-for-rpg) | cynicmusic / Alex Smith，CC0 |
| 精英 elite | [Awake! (MegaWall-10)](https://opengameart.org/content/awake-megawall-10) | cynicmusic / Alex Smith，CC0 |
| Boss boss | [Battle Theme A](https://opengameart.org/node/20592) | cynicmusic / Alex Smith，CC0 |
| 结算 result | [Victory Theme for RPG](https://opengameart.org/content/victory-theme-for-rpg) | cynicmusic / The Cynic Project，CC0 |

五状态均为整首成品曲，不做原创编曲/分轨。替代歌曲成功加载前旧曲保持播放，新曲就绪后700ms交叉淡化。`MusicThemeSelector` 对精英强度加入1.5秒进入、4秒退出条件，Boss/结算/菜单立即请求切换；旧`late`兼容到`elite`。`prepareTheme`可在Boss前一周提前加载，静默预载最多保留两曲。过期异步回调不会播放；淡出完毕的曲目立即卸载；快速往返菜单时最多保留一首淡出和一首淡入。

## 构建、来源和体积

`python3 scripts/build-audio.py` 从 `/tmp/campus-v4-sources` 的CC0源文件离线混音、转码，输出109个片段，每个有Ogg/MP3两种编码，共218文件，**11,252,735 字节（10.73 MiB）**。单个客户端只加载支持的一种编码；音乐44.1kHz双声道128kbps，音效44.1kHz单声道Ogg96kbps/MP3112kbps。全部 109 个片段统一以 −23 LUFS 为目标，loop边界60ms淡化，`audio-loops.json`的循环时长按解码PCM帧统计，排除输入MP3 priming/padding。

`docs/v4-audio-build.json`逐个输出列出原文件、修改方法；音乐另有作者、原曲页面与CC0链接。`src/assets/attributions.json`、`docs/credits.md`与`public/licenses/`由统一credits脚本生成。原始包、PCM及新下载的源曲不进入部署产物。

验证：核心单测与 Chromium 冒烟覆盖声部上限、保留关键声音、duck、回退、无连续重复、五首不同原曲、精英稳定窗、完整内容映射及每个文件双编码存在、跨淡和过期加载取消。


## P2 母带、余量与手机外放

所有 UI、命中/死亡/发射、环境音和音乐都离线归一到 **−23 LUFS**。先测 BS.1770 门控积分响度，再应用增益和前视峰值限制；编码前留 −4.5 dBTP 余量，Ogg/MP3 分别再次测量并补偿编码偏差，交付真峰值不高于 **−3 dBTP**。极短点击补静音至至少 120ms，避免编码块截断；短于 3 秒的声音仅在测量时周期延拓至 3 秒，交付不包含该延拓。

218 个交付文件的实测范围为 **−23.79 至 −22.67 LUFS**，最大真峰值 **−3.00 dBTP**，见 `v4-audio-loudness.json`。这是明确标注的短音测量方法；不能把极短瞬态的积分值等同于整曲长期听感。

全输出保留约 6dB 余量（Howler 公共主增益 0.5），音乐/SFX/UI 音量在原统一增益通路计算，末端另有 −3dB 压缩限幅。音乐也解码进同一个 AudioContext，保证采样与 ZzFX 一起经过 EQ，不使用 Howler 私有节点。待加载音效有 5 秒看门狗和取消清理；音乐加载/播放失败进入合成回退。

设置增加 `audioPreset`：

| 模式 | 处理 |
|---|---|
| 自动（缺失字段默认） | 粗指针且屏幕短边 ≤600px 选择手机，其余标准；横竖屏一致 |
| 标准 / 耳机 | 25Hz 高通、平直高频、保留动态；末端保护限幅 |
| 手机外放 | 150Hz 高通，3.2kHz 起高架 −3dB，−20dB 阈值 / 3:1 压缩，8ms attack / 160ms release |

自动模式不检测耳机或具体扬声器，连接耳机时可以手动切标准。拾取、高频发射与材质命中保留固定时间窗聚合、无连续重复变体、较轻的发射声及优先级淘汰；不根据 FPS 调整声音。

## 音频实验室与真机试听

`?debug=1` → 表现调试实验室 → 音频：按材质/普通/暴击/精英试听，独听起音 0–20ms、主体 8–138ms、尾音 40–480ms，观察声部、淘汰、被拒绝事件和 ducking 曲线；五首成品曲可独听或切强度，不冒充多轨 stems。可模拟加载/解码失败并导出 JSON。所有预览使用独立音频服务和内存状态；实验室打开期间暂停父页面的音频输出，避免混入背景音乐，关闭后恢复原偏好。

最终听感由用户在真机验收：手机外放与耳机的音量、密集命中疲劳、音乐/受伤/危险提示分离、整曲循环边缘及后台恢复。容器中自动检查只验证加载、状态、计数和混音参数，没有代替主观试听。
