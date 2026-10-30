# 依赖版本

2026-10-30 从 npm 官方 registry 核实。计划中的全部正式依赖版本均存在，未使用替代版本。

| 包 | 锁定版本 |
| --- | --- |
| TypeScript | 7.0.2 |
| Vite | 8.3.5 |
| @vitejs/plugin-react | 6.1.2 |
| React / React DOM | 19.3.1 |
| pixi.js | 8.22.0 |
| pixi-filters | 6.1.5 |
| GSAP | 3.15.0 |
| Howler | 2.2.4 |
| ZzFX | 1.4.0 |
| zustand | 5.0.16 |
| Vitest | 5.0.5 |
| @playwright/test | 1.64.1 |
| @types/react / react-dom | 19.3.0 |
| @types/howler | 2.2.13 |
| @types/node | 24.10.1 |

实施环境：Node v24.22.1，npm 11.21.1。以 `package-lock.json` 为完整、可复现的依赖解析结果。没有 CDN、远程字体或第三方图片/音频素材。

第三方库保持各自的许可证。项目自身的校园图形、角色、敌人、图标、粒子和音乐是程序化生成内容；ZzFX 合成通过 Howler 播放，关闭其导入时额外创建的 AudioContext，再使用 Howler 的共享上下文。

## v3

v3 沿用 v2 的全部锁定运行时和开发依赖，未安装或新增包。package.json／lockfile 仅升级项目自身版本为 3.0.0；各依赖解析版本保持一致。数值文档生成复用已有 Vite 的本地 SSR 加载，不增加生成器依赖。每日种子复用现有 Random 与 FNV-1a32；图形和音频继续程序化实现。

默认 `npm test` 只选核心 v3 单元与原核心实体／碰撞测试；Playwright 只选一条 Chromium 冒烟。原压力、矩阵、长跑源码和报告作为历史保留，不纳入 v3 默认入口。


## v4 P0 素材构建工具

运行时依赖与版本沿用 v3。离线素材脚本使用 Python 3 + Pillow（Lanczos/WebP）、fontTools + Brotli（固定字重与 WOFF2 子集）和 ffmpeg（CC0 样本混合/转码）；它们不参与普通 npm build，也不进入发布包。npm 缓存由项目 `.npmrc` 固定为 `/tmp/npm-cache`。
