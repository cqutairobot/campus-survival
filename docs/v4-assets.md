# v4 P1 资源

完整结果见 [P1 完成记录](v4-p1-result.md)，逐文件列表见 `v4-art-build.json`、`v4-audio-build.json` 与 `credits.md`。

137 张用户源 PNG 保留不改；运行时输出 168 WebP、125 PNG 回退及 6 SVG。所有六角色、25 敌人及白闪、63 物品、10 建筑、6 地标、3 props、4 贴图和 UI 都有共享逻辑绑定。

- 六角色精灵为 128px 方图，透明边缘紧裁、2px 象牙描边，在 64px 显示约 1px 描边并配脚下阴影；不同敌人纹理统一按半径归一化。
- 菜单使用横版源和专用竖版源；立绘/背景按原图质量压缩，不再将旧横图放大冒充新增细节。
- 草地、铺装、金属和纸纹均来自用户 AI 源。旧 Leschge 纸纹已替换并从运行时署名中移除。
- React/Pixi 共用 manifest 与 bindings；战斗必要包、内容包、Boss 包、界面物品与大图按使用时机加载，六请求固定并发，不依 FPS 改档。
- 透明主体可从 WebP 转 PNG 回退，最终返回原几何/SVG。菜单和背景失败返回原渐变。异步任务受取消信号和存活状态保护；场景退出释放纹理引用，快照仅拥有自己的子纹理。
- 音频共 109 片段、218 双编码文件；五首 CC0 成品曲按状态交叉淡化，详见 [音频说明](v4-audio.md)。

普通 `npm run build` 不需要重新加工素材。再生成可依次运行 `python3 scripts/build-assets.py`、`python3 scripts/build-audio.py`、`python3 scripts/build-credits.py`。字体加工需要 fontTools/Brotli；本次临时依赖位于 `/tmp/campus-v4-py`，可使用 `PYTHONPATH=/tmp/campus-v4-py python3 scripts/subset-fonts.py`。源包与 PCM 保留在 `/tmp`，npm 缓存固定 `/tmp/npm-cache`。
