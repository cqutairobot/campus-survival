> P1 已完成；当前结果及与 P0 的增量文件见 [P1 完成记录](v4-p1-result.md) 与 [P1 文件清单](v4-p1-changes.md)。以下保留 P0 历史清单。

# v4 P0 文件改动

原始用户图片 `art-src/ai/` 保留不改动；下列为本次实现与生成文件。未 commit 或 push。

## 主要职责

| 范围 | 文件 |
|---|---|
| token / 字体 / 材质 | `src/design/tokens.ts`、`src/ui/styles/{tokens,fonts,v4}.css`、`src/main.tsx` |
| 统一组件 | `src/ui/components/{Art,Button,Panel,ItemCard,RarityFrame,StatBar,Tooltip,Toast,AnimatedNumber,InputPrompt}.tsx` |
| P0 界面 | `src/ui/screens/{Menu,Overlays,Panels,Credits}.tsx`、`src/ui/hud/HUD.tsx` |
| 素材门面 | `src/assets/{manifest,bindings,loader}.ts`、`src/render/TextureCatalog.ts` |
| 反馈 | `src/presentation/`、`src/fx/{PresentationClock,EntityFeedback,CameraRig,PostFX,DeathFX}.ts`、`src/fx/particles.ts` |
| 渲染接入 | `src/render/{scene,procedural}.ts`、`src/app/{App,GameHost}.tsx` |
| 音频 | `src/audio/{audio,AudioDirector,MusicDirector,catalog,mix}.ts`、`src/assets/audio-loops.json` |
| 设置 / 元数据 | `src/save/{settings,storage}.ts`、`src/types/index.ts`、`src/core/engine.ts`（只读表现事件） |
| 调试 | `src/debug/{DebugPanel,FeedbackLab,FeedbackPreview}.tsx` |
| 核心验证 | `tests/unit/v4-{settings,feedback,audio}.test.ts`、`tests/e2e/smoke.spec.ts`、`vite.config.ts` |
| 构建与许可 | `scripts/{fetch-v4-sources,build-assets,subset-fonts,build-audio,build-credits}.py`、`src/assets/attributions.json`、`public/licenses/` |
| 版本与说明 | `package.json`、`package-lock.json`、`.npmrc`、`index.html`、`README.md`、`docs/v4-*`、`docs/credits.md` |

## 源码与文档明细

- `.npmrc`
- `README.md`
- `docs/controls.md`
- `docs/credits.md`
- `docs/dependencies.md`
- `docs/v4-ai-sources.json`
- `docs/v4-art-build.json`
- `docs/v4-assets.md`
- `docs/v4-audio-build.json`
- `docs/v4-audio.md`
- `docs/v4-browser-review.json`
- `docs/v4-budgets.json`
- `docs/v4-changes.md`
- `docs/v4-design.md`
- `docs/v4-p1-art-needed.md`
- `docs/v4-verification.md`
- `docs/verification-v4-build.log`
- `docs/verification-v4-e2e.log`
- `docs/verification-v4-tests.log`
- `index.html`
- `package-lock.json`
- `package.json`
- `scripts/build-assets.py`
- `scripts/build-audio.py`
- `scripts/build-credits.py`
- `scripts/fetch-v4-sources.py`
- `scripts/subset-fonts.py`
- `src/app/App.tsx`
- `src/app/GameHost.tsx`
- `src/assets/attributions.json`
- `src/assets/audio-loops.json`
- `src/assets/bindings.ts`
- `src/assets/loader.ts`
- `src/assets/manifest.ts`
- `src/audio/AudioDirector.ts`
- `src/audio/MusicDirector.ts`
- `src/audio/audio.ts`
- `src/audio/catalog.ts`
- `src/audio/mix.ts`
- `src/core/engine.ts`
- `src/data/catalog.ts`
- `src/debug/DebugPanel.tsx`
- `src/debug/FeedbackLab.tsx`
- `src/debug/FeedbackPreview.tsx`
- `src/design/tokens.ts`
- `src/fx/CameraRig.ts`
- `src/fx/DeathFX.ts`
- `src/fx/EntityFeedback.ts`
- `src/fx/PostFX.ts`
- `src/fx/PresentationClock.ts`
- `src/fx/particles.ts`
- `src/main.tsx`
- `src/presentation/FeedbackDirector.ts`
- `src/presentation/materials.ts`
- `src/presentation/profiles.ts`
- `src/render/TextureCatalog.ts`
- `src/render/procedural.ts`
- `src/render/scene.ts`
- `src/save/settings.ts`
- `src/save/storage.ts`
- `src/types/index.ts`
- `src/ui/components/AnimatedNumber.tsx`
- `src/ui/components/Art.tsx`
- `src/ui/components/Button.tsx`
- `src/ui/components/InputPrompt.tsx`
- `src/ui/components/ItemCard.tsx`
- `src/ui/components/Panel.tsx`
- `src/ui/components/RarityFrame.tsx`
- `src/ui/components/StatBar.tsx`
- `src/ui/components/Toast.tsx`
- `src/ui/components/Tooltip.tsx`
- `src/ui/hud/HUD.tsx`
- `src/ui/screens/Credits.tsx`
- `src/ui/screens/Menu.tsx`
- `src/ui/screens/Overlays.tsx`
- `src/ui/screens/Panels.tsx`
- `src/ui/styles/fonts.css`
- `src/ui/styles/tokens.css`
- `src/ui/styles/v4.css`
- `tests/e2e/smoke.spec.ts`
- `tests/unit/v4-audio.test.ts`
- `tests/unit/v4-feedback.test.ts`
- `tests/unit/v4-settings.test.ts`
- `vite.config.ts`

## 发布素材

`public/assets/art/v4/`：34 个目录/文件条目，逐图片见 `v4-art-build.json`。

`public/assets/fonts/`：6 份 WOFF2；`public/assets/audio/v4/`：56 个片段，各有 Ogg/MP3 两种编码。逐文件作者、来源、修改、许可见 `credits.md` 与 `src/assets/attributions.json`。
