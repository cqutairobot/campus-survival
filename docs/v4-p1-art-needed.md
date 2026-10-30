> P1 状态：以下美术已全部到位并接入；137 张源 PNG 的逐图处理及元数据见 `v4-art-build.json`、`v4-ai-sources.json` 和 `credits.md`。下面保留 P0 当时的待补清单作为历史记录。

# P1 待补美术（按原计划 §4 编号）

统一目录仍为 `art-src/ai/`。现有 P0 文件可以继续使用，不必重做；以下清单用于全内容覆盖，规格和英文提示词沿用 `/workspace/game_v4_plan.md` §4。

| 编号 | 待补文件 | 说明 |
|---|---|---|
| **§4.2** | `characters/{analysis,coder,english,architect,experiment}/{portrait,avatar,sprite}.png` | 其余五个角色各三份。头像可从批准立绘派生。 |
| **§4.2** | `characters/balanced/{avatar,sprite}.png` | 均衡型当前由立绘裁切/缩小。优先补专用俯视精灵；头像可继续沿用派生版。 |
| **§4.3** | `icons/weapons/{orbit,code,laser,ppt,bot,keyboard,rain,wifi,lightning,mentor,staple,mine,eraser,broadcast,ruler,blueprint,shuttle,prism,cryo,brick}.png` | 其余 20 个基础武器。22 条进化继续复用主体，无需另画 22 份。 |
| **§4.4** | `icons/passives/{speed,night,haste,xp,regen,multi,calm,area,luck,health,push,duration,armor,magnetism,focus,thesis}.png` | 16 个被动。 |
| **§4.5** | `icons/fusions/{sword,hub,binder,sky,icefire,demolition}.png` | 6 个融合。 |
| **§4.5** | `icons/relics/{scholarship,redNotebook,clockShard,assistant,emergency,obsidian}.png` | 6 个遗物。 |
| **§4.5** | `icons/pickups/{heal,magnet,bomb,freeze,shield,coffeeBoost,energy}.png` | 7 个拾取。 |
| **§4.5** | `icons/ultimates/{submission,lastMinute,parallel,conference,barrier,overload}.png` | 6 个大招。 |
| **§4.6** | `enemies/{checkin,ppt,review,receipt,advisor,proposal,defense,finals,math,english,coding,mechanics,thrower,charger,splitter,bomber,summoner,guard,leader,inspector,teamlead,node,examCharger}.png` | 作业和 DDL 已有；其余 23 个。proposal/defense/finals/inspector/teamlead 用 B 规格，其他用 E。 |
| **§4.7** | `buildings/{library,canteen,basic,architecture,dorm,civil,experiment,basic-south,activity,dorm-west}.png` | 10 幢建筑，底座需对齐原碰撞矩形。 |
| **§4.7** | `landmarks/{library,canteen,lab,workshop,garden,track}.png` | 6 个地标装饰，不添加碰撞。 |
| **§4.8** | `ui/menu-campus-portrait.png` | 专门构图的竖版可替换当前横图裁切。若希望更清晰，可同时补原生 2560×1440 菜单背景，当前是按要求高质量放大。 |
| **§4.8** | `ui/{academic-crest,gold-ornament,chest-closed,chest-open,result-victory,result-defeat}.png` | 徽章、角饰、同款宝箱开/关、胜/败背景。 |
| **§4.8** | `textures/{metal,grass,paving}.png` | 纸纹已使用 Leschge CC0，可选补 `textures/paper.png`，不是阻塞项。 |
| **§4.8** | `props/{tree,bench,planter}.png` | 树、长椅与花坛。 |
| **§4.9** | 无额外 AI 文件 | 天赋/成就徽章、弹丸、经验、预警、品质边框、数字及粒子继续代码生成/复用。 |

建议先补武器/被动图标、均衡型专用战斗精灵，再补其余角色和敌人，最后建筑与背景。请在后续源素材旁保留生成工具、生成日期、完整提示词和批准版标识；P0 这批没有附带这些元数据，因此署名清单如实标注“未提供”。
