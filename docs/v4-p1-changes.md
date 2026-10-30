# v4 P1 文件改动

以下与 `/workspace/campus-survival-v4p0-backup` 比较，只列 P1 源码、脚本与测试；保留原 P0 未提交改动，没有 commit/push。

## 职责与目录

| 范围 | 主要文件 |
|---|---|
| 界面 | `src/ui/screens/{Panels,Codex,Achievements,DailyChallenge,CampusMap,Overlays,RewardChoice,Credits}.tsx`、`src/ui/styles/p1.css` |
| 共用美术与 HUD | `src/ui/components/{Art,ContentArt}.tsx`、`src/ui/hud/HUD.tsx` |
| 资源包 | `src/assets/{manifest,bindings,loader}.ts`、`src/render/TextureCatalog.ts`、`scripts/build-assets.py` |
| 世界渲染与反馈 | `src/render/scene.ts`、`src/fx/DeathFX.ts`、`src/presentation/{materials,profiles,weapon-feedback,art-layout}.ts` |
| 音频 | `src/audio/{audio,catalog,MusicDirector}.ts`、`src/assets/audio-loops.json`、`scripts/build-audio.py` |
| 应用与许可 | `src/app/App.tsx`、`src/main.tsx`、`src/assets/attributions.json`、`scripts/build-credits.py`、`public/licenses/` |
| 验证 | `tests/unit/{v4-audio,v4-p1}.test.ts`、`tests/e2e/smoke.spec.ts`、`playwright.config.ts`、`scripts/verify-v4-frozen.mjs` |

## 逐文件清单

- `src/app/App.tsx`
- `src/assets/attributions.json`
- `src/assets/audio-loops.json`
- `src/assets/bindings.ts`
- `src/assets/loader.ts`
- `src/assets/manifest.ts`
- `src/audio/MusicDirector.ts`
- `src/audio/audio.ts`
- `src/audio/catalog.ts`
- `src/fx/DeathFX.ts`
- `src/main.tsx`
- `src/presentation/art-layout.ts`
- `src/presentation/materials.ts`
- `src/presentation/profiles.ts`
- `src/presentation/weapon-feedback.ts`
- `src/render/TextureCatalog.ts`
- `src/render/scene.ts`
- `src/ui/components/Art.tsx`
- `src/ui/components/ContentArt.tsx`
- `src/ui/hud/HUD.tsx`
- `src/ui/screens/Achievements.tsx`
- `src/ui/screens/CampusMap.tsx`
- `src/ui/screens/Codex.tsx`
- `src/ui/screens/Credits.tsx`
- `src/ui/screens/DailyChallenge.tsx`
- `src/ui/screens/Overlays.tsx`
- `src/ui/screens/Panels.tsx`
- `src/ui/screens/RewardChoice.tsx`
- `src/ui/styles/fonts.css`
- `src/ui/styles/p1.css`
- `scripts/build-assets.py`
- `scripts/build-audio.py`
- `scripts/build-credits.py`
- `scripts/verify-v4-frozen.mjs`
- `tests/e2e/smoke.spec.ts`
- `tests/unit/v4-audio.test.ts`
- `tests/unit/v4-p1.test.ts`
- `playwright.config.ts`

## 生成文件

- `public/assets/art/v4/`：168 WebP、125 PNG 回退及 6 个 SVG，共 299 文件。
- `public/assets/audio/v4/`：109 个片段，每个 Ogg/MP3 双编码，共 218 文件。
- `public/assets/fonts/`：六份 WOFF2；中文子集随 P1 文案更新。
- `public/licenses/`：逐文件署名、原许可、AI 元数据及用户提供素材说明。
- `docs/{credits,v4-art-build,v4-ai-sources,v4-audio-build,v4-audio}.*`：完整构建和来源记录。
- `docs/v4-p1-*.png`：28 个界面/战斗截图；`v4-p1-browser-review.json`、`v4-p1-budgets.json`、`v4-p1-freeze-audit.json` 记录验收结果。
- `dist/`：当前本地产物；未部署。
