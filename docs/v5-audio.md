# 第二学期音效与真机试听

18个逻辑片段，36个Ogg/MP3（共563,577B）。浏览器通过Howler选择一种支持的编码。音乐继续使用原五首整曲；原音频源码、曲目、素材和预设哈希保持，未新增运行时依赖。

| 来源 | 选用源片段 | 许可 |
| --- | ---: | --- |
| [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds) | 5 | 包内Creative Commons Zero / CC0 |
| [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) | 13 | 包内Creative Commons Zero / CC0 |

许可原文在`audio-src/s2/licenses`及`public/licenses/s2-*-License.txt`。逐文件源页、作者、原文件、修改、原始/许可/双编码SHA-256与各编码实测响度见`audio-src/s2/ledger.json`、`docs/v5-audio-loudness.json`与公开`licenses/s2-audio-ledger.json`；制作名单提供入口。两个环境片段是包内片段制作的设计循环，非真实校园实地录音。只保留用到的源文件，原包/PCM不发布。

| 逻辑片段 | 用途 |
| --- | --- |
| shot-s2-drone / whiteboard / spool / printer | 四武器及对应进化、敌人材质复用 |
| fusion-s2-fieldHub / holoReview / digitalTwin | 三融合与机械/纸面/电子强调 |
| warning-s2-line / reservation / scan | 冲线、预约落点、扫描扇区及Boss阶段 |
| event-s2-deliveryDay / networkMaintenance / jointExhibit / openLab | 四新事件播报 |
| contract-s2-project / amendment | 两类契约、被动/遗物、医务站、旧课复习 |
| ambience-s2-lab / exhibit | 实验园/展廊设计循环 |

原有BS.1770工具离线处理到−23 LUFS，短音只在测量时周期延拓；双编码最大偏差0.61 LU，真峰值最高−3.78 dBTP（上限−3）。运行使用同一Howler上下文、共享输出预设、duck包络和48声部导演，普通声部留出关键提示空间。程序验证证明映射、解码/失败回退、关键声部、取消/晚到和退出清理；无头环境不证明听感。

以下项目需用户后续真机试听，保持完整粒子/bloom/残影与命中反馈，分别使用手机外放（自动/手机预设）和耳机（完整预设）：

- 四武器与四进化、三融合在单独与混合构筑中起音可分辨，没有刺耳高频或突发音量跳变。
- 普通怪/精英/验收员与三Boss密集交战时，冲线、落点、移动扇区和阶段转换仍清楚；左右方向提示对应画面，音乐duck后自然恢复。
- 四事件开始/结束、两类契约、医疗完成和复习选择有明确反馈；取消、暂停/恢复、快速退出后无残留或重复提示。
- 电池溢出、协议标记、背带就绪、回响、四遗物收益/风险提示能辅助判断，不掩盖危险音。
- 实验园/展廊8秒循环音量适中、接点无明显爆音；离开区域、静音或退出后立即停止。
- 原五首音乐的普通/精英/Boss/结算切换、耳机与手机预设、音量保存保持正常；手机扬声器低频不糊、高频不尖。

正式第二学期入口仍关闭。真机试听通过、开放正式入口、push与部署各需用户后续决定。
