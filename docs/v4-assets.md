# v4.0.0 资源与失败回退

源 PNG 共 137 张，保留原始元数据与 SHA-256；运行时美术为 168 WebP、125 PNG 回退、6 SVG，覆盖全部已有角色、物品、敌人、建筑、地标与 UI。P2 没有新增素材来源，重新加工了全部音频响度及中文字体子集。没有 KTX2/Basis 或新增运行时依赖。

## 加载与所有权

React/Pixi 共用 `src/assets/manifest.ts`、`bindings.ts`。首屏、美术物品、战斗核心/内容、Boss、详情大图、结算按使用时机加载；Pixi 六请求固定并发，单编码失败重试一次，再尝试适用的 PNG，最后几何回退。

`ResourceLoader` 为每个逻辑 ID 维护租约计数。销毁场景取消后续分包，当前解码结束后释放引用；零引用纹理卸载。卸载过程中再次获取相同 ID 会先等待卸载结束，避免新场景持有已销毁纹理。死亡快照和图集切片只销毁自己的子纹理，源图集由资源服务释放。

## 失败行为

| 故障 | 回退 |
|---|---|
| WebP 请求/解码失败 | 重试 → 适用 PNG → 程序化纹理或 SVG |
| 整张粒子图集失败或尺寸不足 | `TextureLibrary` 中相应材质碎片，避免无效裁切与白块 |
| 物品、头像、详情插画失败 | 原有语义 SVG/几何图标；装饰图可省略 |
| 背景、纸纹等装饰失败 | 渐变、实底面板或原校园矢量背景 |
| 音效请求/解码/超时 | 同类 ZzFX，保留原限音与增益通路 |
| 音乐请求/解码/播放/超时 | 原合成循环；过期回调不播放 |
| 字体失败 | 1.8 秒后继续使用系统字体 |

正常验收要求资源全部成功。故障注入是独立记录的预期失败；游戏仍可操作，不能产生未捕获异常。单元测试覆盖请求/解码失败、PNG 回退、无效图集、共享引用、卸载竞争和取消；Chromium 另注入真实无效音效/音乐字节。

## 构建与许可

普通 `npm run build` 直接使用已加工资源。可重建：

```bash
python3 scripts/build-assets.py
PYTHONPATH=/tmp/campus-v4-py python3 scripts/subset-fonts.py
python3 scripts/build-audio.py
python3 scripts/build-credits.py
```

源包位于 `/tmp/campus-v4-sources`；音频 PCM 位于 `/tmp/campus-v4-audio`，均不进入 `dist`。音频脚本可接片段 ID 做选择性重建，例如 `python3 scripts/build-audio.py pickup`，其他响度记录会保留。npm 缓存为 `/tmp/npm-cache`。

逐文件信息：[美术构建](v4-art-build.json)、[AI 原始来源](v4-ai-sources.json)、[音频加工](v4-audio-build.json)、[响度实测](v4-audio-loudness.json)、[署名](credits.md)。设置内许可、`src/assets/attributions.json`、`public/licenses/attributions.json` 同源。AI 素材未提供独立许可证，6 张 P0 原图缺少生成信息，这些事实保持原样记录。

体积以 [P2 预算报告](v4-p2-budgets.json) 为准；完整产物必须 ≤23,000,000 字节，首屏 ≤4 MiB。
