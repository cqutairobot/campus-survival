# v5 实施约定（P00–P02）

设计依据：`/workspace/game_s2_plan.md`（2026-10-31）。第 13 节均采用推荐答案。

- S2：24×40 秒，8/16/24 三考，普通毕业解锁；旧可靠胜利或 `survivor.progress >= 1` 即认可，不要求收藏 100%。
- 共有成长、钱包与发现保留；S1 统计保持原义，S2 独立统计。历史评级保持未知。
- 继承 `carry-v1`：护盾 15/60 秒、经验 +8%/120 秒、已解锁基础武器 Lv.1 普通品质替换初始武器，三选一。每日固定规则与指定继承。
- 新四武器/四被动直接进入 S2 候选池；共有收藏两学期可补，S1 专属成就仍在 S1。首发完整目录按计划，不减量。
- 原 46 文件原位冻结；S1 原适配器，S2 独立运行时与规则、防秒杀、连通校园。S1 产品内容常量仍为 4.0.1。
- 按学期独立每日、本地榜，保留原 S1 种子与成绩版本；不引入联网。
- 约 42 张 AI 主体图，CC0 粒子/音效，复用音乐；发布目标 30–36 MiB、门槛 40 MiB、首屏目标 1.5 MiB。
- 按批独立本地提交。本轮仅 P00–P02，完整 S2 战斗入口关闭；P03 以后另行实施。不 push、不部署、不升级依赖。

## S1 冻结

`freeze/s1-v4.0.1.json` 只从 `08722a5cc69b6eb166d04aeb6e09f99d5fc6615b` Git 对象生成，固定原文件、值导入依赖闭包（包括 HitStopBudget）、依赖版本/lockfile，以及目录 ID、数值摘要和完整数据摘要。不能从当前工作树自动更新基线。

运行 `node scripts/verify-s1-frozen.mjs [repo-root] [report-path]`：先从固定 `7085e4c78794372a9c25d5a546a5696a8c23cebe` Git 对象在临时目录还原 v3 的 46 文件，运行原审计，再进行 v4.0.1 精确审计。缺少 Git 对象即失败；不依赖未说明的机器路径。报告默认写 `/tmp/campus-s1-freeze.json`。原审计与例外清单也固定哈希。

## P01 存档边界

应用只有一个 `ProfileRepository` / `SaveCoordinator` / zustand 实例。旧 `freshSave`、`validateSave`、仓储与 store 工厂继续用于历史测试与 S1 投影，不初始化额外 writer。协调器仅泛化存档类型，保持 `.commit` 与 `.owner.<id>` 锁名和原所有权协议。

物理键仍为 `campus-survival.save.v3` / `campus-survival.backup.v3`，内部 schema 4。首次覆盖前把旧原文写入 `campus-survival.recovery.pre-v5.<digest>[.<collision-slot>]` 并回读核对；不覆盖旋转备份、不删除旧 v1/v2 键。导入原文也在同锁事务内保护。备份/配额/回读失败不报保存成功；主档或备份中的未来 schema 均阻止降级。

根 `unlocks` / `achievements` / `stats` 只代表 S1；共有发现保留完整 S2 ID，S1 投影过滤它们。S1 结算使用最新投影调用原结算器，再并回钱包增量、S1 字段与发现；S2 使用独立结算容器，全局结算 ID 去重。评级仍为 `null`，不推测历史。S2 玩法与成就算法尚未实现。

schema 4 的完整目录验证需要提前引入 `catalog-ids.ts`（原 P02 的轻量元信息子集），不包含运行时或素材。新区 ID 固定为 `s2:smartTeaching` / `s2:jointLab` / `s2:exhibitHall`；进化发现沿用基础武器 ID 语义。历史 fixture 按 schema 1/2 与 v3/P0/P1/P2/v4.0.1 实际字段差异构造，集中在一个参数化核心测试中。
