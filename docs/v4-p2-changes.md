# v4 P2 文件改动

基线：main `e448cb1`。只做 P2；未 commit、push 或部署，没有另复制备份。完整实现说明和验收见 [P2 结果](v4-p2-result.md) 与 [v4 验收](v4-verification.md)。

## 改动职责

| 范围 | 文件 / 行为 |
|---|---|
| 布局与动态效果 | `p2.css`、HUD、Menu/Panels/Overlays、AnimatedNumber：安全区、44px、长文与数字、分区网格、作用域动画释放 |
| 画质与反馈 | `quality.ts`、PostFX、DeathFX、particles、FeedbackDirector、scene：固定档位、静态反馈、主事件过滤与清理 |
| 素材回退与释放 | loader、TextureCatalog、scene：失败/坏图集回退，租约卸载竞争协调，取消与会话释放 |
| 音频 | audio、MusicDirector、OutputBus：共同响度目标、采样看门狗、ZzFX 回退、输出预设、父页面试听静音、交叉淡化上限 |
| 实验室 | debug 目录、App/main/store：独立内存仓库与 iframe，三个可导出实验室 |
| 构建和验证 | build-audio/build-credits、冻结脚本、核心单测及原单条 Chromium 冒烟 |

## 源码、脚本与测试清单

- `README.md`
- `playwright.config.ts`
- `scripts/build-audio.py`
- `scripts/build-credits.py`
- `scripts/verify-v4-frozen.mjs`
- `src/app/App.tsx`
- `src/assets/loader.ts`
- `src/audio/MusicDirector.ts`
- `src/audio/OutputBus.ts`
- `src/audio/audio.ts`
- `src/debug/AudioLab.tsx`
- `src/debug/DebugPanel.tsx`
- `src/debug/FeedbackLab.tsx`
- `src/debug/LabApp.tsx`
- `src/debug/Laboratories.tsx`
- `src/debug/MotionLab.tsx`
- `src/debug/UiFixture.tsx`
- `src/debug/fixtures.ts`
- `src/debug/isolation.ts`
- `src/fx/DeathFX.ts`
- `src/fx/PostFX.ts`
- `src/fx/particles.ts`
- `src/main.tsx`
- `src/presentation/FeedbackDirector.ts`
- `src/presentation/quality.ts`
- `src/render/TextureCatalog.ts`
- `src/render/scene.ts`
- `src/save/settings.ts`
- `src/state/store.ts`
- `src/types/index.ts`
- `src/ui/components/AnimatedNumber.tsx`
- `src/ui/components/Art.tsx`
- `src/ui/hud/HUD.tsx`
- `src/ui/screens/Menu.tsx`
- `src/ui/screens/Overlays.tsx`
- `src/ui/screens/Panels.tsx`
- `src/ui/screens/RewardChoice.tsx`
- `src/ui/styles/fonts.css`
- `src/ui/styles/p2.css`
- `tests/e2e/smoke.spec.ts`
- `tests/unit/v4-audio.test.ts`
- `tests/unit/v4-p2.test.ts`

## 生成资源与文档

- `public/assets/audio/v4/`：109 个片段的 Ogg/MP3，共 218 文件重新归一与编码；没有新增采样来源。
- `public/assets/fonts/` 和 `src/ui/styles/fonts.css`：最终中文文案子集。
- `src/assets/attributions.json`、`public/licenses/attributions.json`、`docs/credits.md`、`v4-audio-build.json`、`v4-audio-loudness.json`：来源和加工同源记录。
- `docs/v4-{design,assets,audio,verification}.md`、`docs/controls.md`、`docs/dependencies.md` 与 README 更新。
- `docs/v4-p2-*.png`、浏览器记录、预算、冻结报告和三份验证日志。
- `dist/`：当前本地生产产物。

`package.json`、`package-lock.json` 的项目版本以及 `CONTENT_VERSION` 在 P1 已是 4.0.0，本轮核对保持 4.0.0。冻结的 46 个规则文件没有新增 P2 改动。
