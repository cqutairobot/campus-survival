# v4.0.0 最终验收（P2）

本轮仅完成计划 §13 的 P2。没有新增玩法/内容、改变数值、引入 KTX2/Basis，未 commit、push 或部署。P0/P1 的历史报告保留；当前结果以本页及 `v4-p2-*` 为准。

## 必跑检查

| 检查 | 结果 |
|---|---|
| `npm test` | 9 个核心测试文件、103 项通过；原默认测试均保留 |
| `npm run build` | TypeScript 严格检查与 Vite 生产构建通过 |
| `npm run test:e2e` | 单条 Chromium 冒烟通过，约 2 分钟 |
| `node scripts/verify-v4-frozen.mjs` | 46/46 与 v3 一致；44 个逐字节相同，2 个只排除原允许的表现颜色/版本/只读事件 |
| `git diff --check` | 通过 |

日志：[单测](verification-v4-p2-tests.log)、[构建](verification-v4-p2-build.log)、[Chromium](verification-v4-p2-e2e.log)、[冻结报告](v4-p2-freeze-audit.json)。没有运行多浏览器矩阵、压力预设、长时间平衡或完整学期模拟。

## 一条连续冒烟覆盖

1. 注入 v2 旧档，保留 137 绩点、角色/天赋/发现、已结算 ID、显式屏震、闪白 0 和静音；新字段仅补缺失值。单元测试另覆盖 v3、P0、P1 与幂等迁移。
2. 主菜单、角色、天赋、成就、每日、地图、设置与许可，八类图鉴；进入战斗、移动、普通/暴击反馈、选卡并完成选择。
3. 暂停打开设置、关闭动态效果，确认 trauma=0、zoom=1、后处理与实体反馈清除；结算数字和伤害条在切换中立刻恢复静态终值。
4. 360×640 手机双触点：移动和大招独立，取消右手触点不清理左手移动；再检查手机横屏与桌面战斗。
5. 融合、宝箱、契约、练习结算隔离；正式每日种子、1280×800 固定逻辑视野、单次结算和本地榜重载。
6. 三个实验室分别导出有效 JSON，A/B 开关工作；实验室前后真实 localStorage 逐字相同，未增加每日次数。
7. 独立场景把作业图片、白闪图和粒子图集响应替换成无效字节，继续用正式几何回退预览；独立音频页注入无效音效/音乐，确认 ZzFX 实际播放。故障资源返回 200，验证解码错误处理；正常场景要求所有资源成功。
8. 主要界面在 360×640、844×390、1280×800 截图；另覆盖 375×667、390×844、414×896、430×932、768×1024、1024×768、2560×1080。检查横向溢出、破图和至少 44px 的按钮/滑杆/选择器。
9. 额外注入顶部 28px、底部 20px、左右 12px 安全区，与长中文、九位数字同时检查；小屏 HUD 分区不重叠，超长信息可在独立信息区滚动，主要操作不遮挡。
10. 连续开局/退出 5 次，每次等待资源卸载，使用单调时钟计时以排除系统时间跳变；场景 Canvas、程序纹理、图集引用、滤镜、死亡快照与会话音效声部归零。App 音频缓存固定，正常保留菜单音乐；新曲交叉淡化最多两条播放轨。

浏览器记录：[v4-p2-browser-review.json](v4-p2-browser-review.json)。体积记录：[v4-p2-budgets.json](v4-p2-budgets.json)。

## 最终实测摘要

| 项目 | 实测 |
|---|---:|
| 单条 Chromium 冒烟 | 通过，约 2 分钟 |
| 页面错误 / 控制台警告 / 非预期资源失败 | 0 / 0 / 0 |
| 实验室页面错误 | 0 |
| 布局与界面检查 | 78 组，横向溢出、破图、HUD 遮挡、小操作目标均为 0 |
| P2 截图 | 56 张 |
| 连续 5 次开局/退出 | 9.60 秒；每次退出后的纹理、引用、滤镜、快照和会话声部均为 0 |
| 完整 dist（含备用编码与 PNG） | 22,097,139 B = 22.097 MB（21.073 MiB） |
| 首屏实际传输 | 949,793 B = 0.906 MiB |
| 发布预算 | 完整 ≤23 MB；首屏 ≤4 MiB，均通过 |


## 截图索引

| 场景 | 手机竖屏 | 手机横屏 | 桌面 |
|---|---|---|---|
| 菜单 | [截图](v4-p2-menu-phone-portrait.png) | [截图](v4-p2-menu-phone-landscape.png) | [截图](v4-p2-menu-desktop.png) |
| 实际战斗 | [截图](v4-p2-battle-phone-portrait.png) | [截图](v4-p2-battle-phone-landscape.png) | [截图](v4-p2-battle.png) |
| 选卡 | [截图](v4-p2-draft-phone-portrait.png) | [截图](v4-p2-draft-phone-landscape.png) | [截图](v4-p2-draft-desktop.png) |
| 宝箱 | [截图](v4-p2-chest-phone-portrait.png) | [截图](v4-p2-chest-phone-landscape.png) | [截图](v4-p2-chest-desktop.png) |
| 暂停 | [截图](v4-p2-paused-phone-portrait.png) | [截图](v4-p2-paused-phone-landscape.png) | [截图](v4-p2-paused-desktop.png) |
| 结算 | [截图](v4-p2-result-phone-portrait.png) | [截图](v4-p2-result-phone-landscape.png) | [截图](v4-p2-result-desktop.png) |
| 图鉴 | [截图](v4-p2-codex-phone-portrait.png) | [截图](v4-p2-codex-phone-landscape.png) | [截图](v4-p2-codex-desktop.png) |

其他：[安全区与长名称](v4-p2-hud-safe-area-long.png)、[缺图 UI](v4-p2-missing-ui.png)、[坏图/图集几何回退](v4-p2-missing-battle.png)、[打击感实验室](v4-p2-lab-feedback.png)、[音频实验室](v4-p2-lab-audio.png)、[界面实验室](v4-p2-lab-motion.png)。全部截图位于 `docs/v4-p2-*.png`。

## 已知限制与真机验收清单

没有已知阻断游戏的问题。自动验收只用 Chromium；软件渲染容器不能代表真机帧率、扬声器和系统音频中断行为。

- 在手机竖屏/横屏与 iPad 检查真实刘海、底部手势区、旋转、长面板滚动和双触点；特别检查右手互动/大招与左手移动。
- 在手机外放与耳机分别试听自动/标准/手机预设；自动只依据粗指针和屏幕短边，不识别耳机连接。
- 试听密集发射/命中、暴击、精英和受伤：音乐留出空间，关键提示清楚，没有明显疲劳、刺耳或泵动。
- 试听五首整曲切换、循环边缘、暂停/后台与系统打断后恢复。五首为 CC0 成品曲，没有原创同步 stems。
- 真机切换高/中/低与减少动态效果，确认高档完整、低档危险提示清晰；不需要长时间压测。

AI 原图中 6 张 P0 图仍缺少工具、日期与提示词，且 AI 元数据没有独立开源许可证。署名按现有证据保留，未新增来源或推断许可。
