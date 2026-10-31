# 制作名单与素材许可

v4 P2 未新增素材来源。全部音频重新归一到 −23 LUFS 目标，双编码实测真峰值不高于 −3 dBTP；中文字体子集随最终文案更新。逐文件加工记录与原许可继续保留。

由 `python3 scripts/build-credits.py` 离线生成。设置内制作名单、`src/assets/attributions.json` 与 `public/licenses/attributions.json` 同源。只分发实际使用的文件；源音频包、源字体和 PNG 美术原件不进入构建产物。

AI 美术共 137 张；逐图 SHA-256、原始提示词和生成元数据同时发布于 `public/licenses/ai-art-metadata.json`。旧 Leschge 纸纹已被用户的 AI 纸纹替换，不再列为运行时素材。

## Happy Lullaby (song17)

作者：cynicmusic / The Cynic Project / Alex Smith。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://lpc.opengameart.org/content/happy-lullaby-song17。

CC0 成品整曲；保留整曲结构，不制作原创分轨。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `song17.mp3` | `assets/audio/v4/music-menu.ogg / assets/audio/v4/music-menu.mp3` | Whole completed track, loudness normalized to -23 LUFS, stereo 44.1kHz, 128kbps Ogg / 128kbps MP3, 60ms loop-edge fades; no stems or original composition. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged.  |

## Battle Theme B for RPG

作者：cynicmusic / The Cynic Project / Alex Smith。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/content/battle-theme-b-for-rpg。

CC0 成品整曲；保留整曲结构，不制作原创分轨。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `battleThemeB.mp3` | `assets/audio/v4/music-normal.ogg / assets/audio/v4/music-normal.mp3` | Whole completed track, loudness normalized to -23 LUFS, stereo 44.1kHz, 128kbps Ogg / 128kbps MP3, 60ms loop-edge fades; no stems or original composition. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged.  |

## Awake! (MegaWall-10)

作者：cynicmusic / The Cynic Project / Alex Smith。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/content/awake-megawall-10。

CC0 成品整曲；保留整曲结构，不制作原创分轨。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `awake10_megaWall.mp3` | `assets/audio/v4/music-elite.ogg / assets/audio/v4/music-elite.mp3` | Whole completed track, loudness normalized to -23 LUFS, stereo 44.1kHz, 128kbps Ogg / 128kbps MP3, 60ms loop-edge fades; no stems or original composition. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged.  |

## Battle Theme A

作者：cynicmusic / The Cynic Project / Alex Smith。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/node/20592。

CC0 成品整曲；保留整曲结构，不制作原创分轨。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `battleThemeA.mp3` | `assets/audio/v4/music-boss.ogg / assets/audio/v4/music-boss.mp3` | Whole completed track, loudness normalized to -23 LUFS, stereo 44.1kHz, 128kbps Ogg / 128kbps MP3, 60ms loop-edge fades; no stems or original composition. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged.  |

## Victory Theme for RPG

作者：cynicmusic / The Cynic Project / Alex Smith。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/content/victory-theme-for-rpg。

CC0 成品整曲；保留整曲结构，不制作原创分轨。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `Victory1_1.mp3` | `assets/audio/v4/music-result.ogg / assets/audio/v4/music-result.mp3` | Whole completed track, loudness normalized to -23 LUFS, stereo 44.1kHz, 128kbps Ogg / 128kbps MP3, 60ms loop-edge fades; no stems or original composition. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged.  |

## UI Pack

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/ui-pack。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `ui-pack-extracted/Sounds/tap-a.ogg` | `assets/audio/v4/ui-hover.ogg / assets/audio/v4/ui-hover.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |

## Input Prompts

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/input-prompts。

仅分发实际使用的衍生素材。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `Keyboard & Mouse/Vector/keyboard_w.svg` | `assets/art/v4/ui/input-keyboard_w.svg` | unmodified; scaled by CSS  |
| `Keyboard & Mouse/Vector/keyboard_a.svg` | `assets/art/v4/ui/input-keyboard_a.svg` | unmodified; scaled by CSS  |
| `Keyboard & Mouse/Vector/keyboard_s.svg` | `assets/art/v4/ui/input-keyboard_s.svg` | unmodified; scaled by CSS  |
| `Keyboard & Mouse/Vector/keyboard_d.svg` | `assets/art/v4/ui/input-keyboard_d.svg` | unmodified; scaled by CSS  |
| `Keyboard & Mouse/Vector/keyboard_space.svg` | `assets/art/v4/ui/input-keyboard_space.svg` | unmodified; scaled by CSS  |

## Particle Pack

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/particle-pack。

仅分发实际使用的衍生素材。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `PNG (Transparent)/spark_01.png, smoke_01.png` | `assets/art/v4/fx/particles.webp` | Lanczos resized; combined with original code-drawn fragments in a 256×24 atlas  |

## Impact Sounds

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/impact-sounds。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `impact-sounds-extracted/Audio/impactMetal_medium_001.ogg` | `assets/audio/v4/hit-metal-0.ogg / assets/audio/v4/hit-metal-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_002.ogg` | `assets/audio/v4/hit-metal-1.ogg / assets/audio/v4/hit-metal-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_003.ogg` | `assets/audio/v4/hit-metal-2.ogg / assets/audio/v4/hit-metal-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_004.ogg` | `assets/audio/v4/hit-metal-3.ogg / assets/audio/v4/hit-metal-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_001.ogg` | `assets/audio/v4/death-metal-0.ogg / assets/audio/v4/death-metal-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_002.ogg` | `assets/audio/v4/death-metal-1.ogg / assets/audio/v4/death-metal-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_001.ogg` | `assets/audio/v4/shot-metal-0.ogg / assets/audio/v4/shot-metal-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_002.ogg` | `assets/audio/v4/shot-metal-1.ogg / assets/audio/v4/shot-metal-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_001.ogg` | `assets/audio/v4/hit-glass-0.ogg / assets/audio/v4/hit-glass-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_002.ogg` | `assets/audio/v4/hit-glass-1.ogg / assets/audio/v4/hit-glass-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_003.ogg` | `assets/audio/v4/hit-glass-2.ogg / assets/audio/v4/hit-glass-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_004.ogg` | `assets/audio/v4/hit-glass-3.ogg / assets/audio/v4/hit-glass-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_001.ogg` | `assets/audio/v4/death-glass-0.ogg / assets/audio/v4/death-glass-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_002.ogg` | `assets/audio/v4/death-glass-1.ogg / assets/audio/v4/death-glass-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_001.ogg` | `assets/audio/v4/shot-glass-0.ogg / assets/audio/v4/shot-glass-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_002.ogg` | `assets/audio/v4/shot-glass-1.ogg / assets/audio/v4/shot-glass-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_001.ogg` | `assets/audio/v4/hit-brick-0.ogg / assets/audio/v4/hit-brick-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_002.ogg` | `assets/audio/v4/hit-brick-1.ogg / assets/audio/v4/hit-brick-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_003.ogg` | `assets/audio/v4/hit-brick-2.ogg / assets/audio/v4/hit-brick-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_004.ogg` | `assets/audio/v4/hit-brick-3.ogg / assets/audio/v4/hit-brick-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_001.ogg` | `assets/audio/v4/death-brick-0.ogg / assets/audio/v4/death-brick-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_002.ogg` | `assets/audio/v4/death-brick-1.ogg / assets/audio/v4/death-brick-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_001.ogg` | `assets/audio/v4/shot-brick-0.ogg / assets/audio/v4/shot-brick-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_002.ogg` | `assets/audio/v4/shot-brick-1.ogg / assets/audio/v4/shot-brick-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactPunch_heavy_001.ogg` | `assets/audio/v4/critical.ogg / assets/audio/v4/critical.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `impact-sounds-extracted/Audio/impactPunch_heavy_003.ogg` | `assets/audio/v4/hurt.ogg / assets/audio/v4/hurt.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `impact-sounds-extracted/Audio/impactMetal_heavy_002.ogg` | `assets/audio/v4/boss.ogg / assets/audio/v4/boss.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `impact-sounds-extracted/Audio/impactMetal_medium_001.ogg` | `assets/audio/v4/fusion-sword.ogg / assets/audio/v4/fusion-sword.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_medium_001.ogg` | `assets/audio/v4/fusion-binder.ogg / assets/audio/v4/fusion-binder.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_001.ogg` | `assets/audio/v4/fusion-sky.ogg / assets/audio/v4/fusion-sky.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_001.ogg` | `assets/audio/v4/fusion-demolition.ogg / assets/audio/v4/fusion-demolition.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_002.ogg` | `assets/audio/v4/ultimate-lastMinute.ogg / assets/audio/v4/ultimate-lastMinute.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMining_002.ogg` | `assets/audio/v4/ultimate-barrier.ogg / assets/audio/v4/ultimate-barrier.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_002.ogg` | `assets/audio/v4/ultimate-overload.ogg / assets/audio/v4/ultimate-overload.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactMetal_heavy_002.ogg` | `assets/audio/v4/event-examRage.ogg / assets/audio/v4/event-examRage.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `impact-sounds-extracted/Audio/impactGlass_medium_002.ogg` | `assets/audio/v4/shield-break.ogg / assets/audio/v4/shield-break.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |

## RPG Audio

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/rpg-audio。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `rpg-audio-extracted/Audio/metalLatch.ogg` | `assets/audio/v4/ui-chest-latch.ogg / assets/audio/v4/ui-chest-latch.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `rpg-audio-extracted/Audio/bookOpen.ogg` | `assets/audio/v4/ui-chest-open.ogg / assets/audio/v4/ui-chest-open.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `rpg-audio-extracted/Audio/bookOpen.ogg` | `assets/audio/v4/chest.ogg / assets/audio/v4/chest.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `rpg-audio-extracted/Audio/metalClick.ogg` | `assets/audio/v4/block.ogg / assets/audio/v4/block.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `rpg-audio-extracted/Audio/metalLatch.ogg` | `assets/audio/v4/event-advisor.ogg / assets/audio/v4/event-advisor.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |

## Interface Sounds

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/interface-sounds。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `interface-sounds-extracted/Audio/glitch_001.ogg` | `assets/audio/v4/hit-energy-0.ogg / assets/audio/v4/hit-energy-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_002.ogg` | `assets/audio/v4/hit-energy-1.ogg / assets/audio/v4/hit-energy-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_003.ogg` | `assets/audio/v4/hit-energy-2.ogg / assets/audio/v4/hit-energy-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_004.ogg` | `assets/audio/v4/hit-energy-3.ogg / assets/audio/v4/hit-energy-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_001.ogg` | `assets/audio/v4/death-energy-0.ogg / assets/audio/v4/death-energy-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_002.ogg` | `assets/audio/v4/death-energy-1.ogg / assets/audio/v4/death-energy-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_001.ogg` | `assets/audio/v4/shot-energy-0.ogg / assets/audio/v4/shot-energy-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_002.ogg` | `assets/audio/v4/shot-energy-1.ogg / assets/audio/v4/shot-energy-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/click_001.ogg` | `assets/audio/v4/ui-press.ogg / assets/audio/v4/ui-press.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/confirmation_001.ogg` | `assets/audio/v4/ui-confirm.ogg / assets/audio/v4/ui-confirm.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/minimize_001.ogg` | `assets/audio/v4/ui-cancel.ogg / assets/audio/v4/ui-cancel.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/click_003.ogg` | `assets/audio/v4/ui-tab.ogg / assets/audio/v4/ui-tab.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/error_002.ogg` | `assets/audio/v4/ui-disabled.ogg / assets/audio/v4/ui-disabled.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/confirmation_001.ogg` | `assets/audio/v4/ui-rarity-common.ogg / assets/audio/v4/ui-rarity-common.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/tick_002.ogg` | `assets/audio/v4/pickup.ogg / assets/audio/v4/pickup.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/confirmation_003.ogg` | `assets/audio/v4/combo.ogg / assets/audio/v4/combo.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/minimize_003.ogg` | `assets/audio/v4/event-end.ogg / assets/audio/v4/event-end.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `interface-sounds-extracted/Audio/glitch_001.ogg` | `assets/audio/v4/fusion-hub.ogg / assets/audio/v4/fusion-hub.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_002.ogg` | `assets/audio/v4/ultimate-parallel.ogg / assets/audio/v4/ultimate-parallel.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_002.ogg` | `assets/audio/v4/ultimate-conference.ogg / assets/audio/v4/ultimate-conference.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glass_002.ogg` | `assets/audio/v4/event-portal.ogg / assets/audio/v4/event-portal.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `interface-sounds-extracted/Audio/glitch_003.ogg` | `assets/audio/v4/event-blackout.ogg / assets/audio/v4/event-blackout.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |

## Music Jingles

作者：Kenney。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://kenney.nl/assets/music-jingles。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI00.ogg` | `assets/audio/v4/ui-reveal.ogg / assets/audio/v4/ui-reveal.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI00.ogg` | `assets/audio/v4/ui-rarity-rare.ogg / assets/audio/v4/ui-rarity-rare.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI06.ogg` | `assets/audio/v4/ui-rarity-epic.ogg / assets/audio/v4/ui-rarity-epic.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI09.ogg` | `assets/audio/v4/ui-rarity-legendary.ogg / assets/audio/v4/ui-rarity-legendary.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI02.ogg` | `assets/audio/v4/ui-talent-upgrade.ogg / assets/audio/v4/ui-talent-upgrade.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI10.ogg` | `assets/audio/v4/ui-achievement.ogg / assets/audio/v4/ui-achievement.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI06.ogg` | `assets/audio/v4/level.ogg / assets/audio/v4/level.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI09.ogg` | `assets/audio/v4/evolution.ogg / assets/audio/v4/evolution.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI02.ogg` | `assets/audio/v4/charged.ogg / assets/audio/v4/charged.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI03.ogg` | `assets/audio/v4/frenzy.ogg / assets/audio/v4/frenzy.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI07.ogg` | `assets/audio/v4/clear.ogg / assets/audio/v4/clear.mp3` | trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. CC0 designed UI/impact/jingle; not described as a field recording. |
| `music-jingles-extracted/Audio/Pizzicato jingles/jingles_PIZZI04.ogg` | `assets/audio/v4/event-sports.ogg / assets/audio/v4/event-sports.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |

## Sound Effects Pack

作者：OwlishMedia。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/content/sound-effects-pack。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `Owlish Media Sound Effects-extracted/Paper/crumples1.wav` | `assets/audio/v4/hit-paper-0.ogg / assets/audio/v4/hit-paper-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples2.wav` | `assets/audio/v4/hit-paper-1.ogg / assets/audio/v4/hit-paper-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/pageturn1.wav` | `assets/audio/v4/hit-paper-1.ogg / assets/audio/v4/hit-paper-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/pageturn2.wav` | `assets/audio/v4/hit-paper-2.ogg / assets/audio/v4/hit-paper-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/paper-sketchbook-page-flips-1.wav` | `assets/audio/v4/hit-paper-3.ogg / assets/audio/v4/hit-paper-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples1.wav` | `assets/audio/v4/hit-paper-3.ogg / assets/audio/v4/hit-paper-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples1.wav` | `assets/audio/v4/death-paper-0.ogg / assets/audio/v4/death-paper-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples2.wav` | `assets/audio/v4/death-paper-1.ogg / assets/audio/v4/death-paper-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/pageturn1.wav` | `assets/audio/v4/death-paper-1.ogg / assets/audio/v4/death-paper-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples1.wav` | `assets/audio/v4/shot-paper-0.ogg / assets/audio/v4/shot-paper-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples2.wav` | `assets/audio/v4/shot-paper-1.ogg / assets/audio/v4/shot-paper-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/pageturn1.wav` | `assets/audio/v4/shot-paper-1.ogg / assets/audio/v4/shot-paper-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/hit-key-0.ogg / assets/audio/v4/hit-key-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/hit-key-1.ogg / assets/audio/v4/hit-key-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/hit-key-2.ogg / assets/audio/v4/hit-key-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/hit-key-3.ogg / assets/audio/v4/hit-key-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/death-key-0.ogg / assets/audio/v4/death-key-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/death-key-1.ogg / assets/audio/v4/death-key-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/shot-key-0.ogg / assets/audio/v4/shot-key-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/mouse-clicks-scrolls.wav` | `assets/audio/v4/shot-key-1.ogg / assets/audio/v4/shot-key-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/hit-brick-0.ogg / assets/audio/v4/hit-brick-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/hit-brick-1.ogg / assets/audio/v4/hit-brick-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/hit-brick-2.ogg / assets/audio/v4/hit-brick-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/hit-brick-3.ogg / assets/audio/v4/hit-brick-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/death-brick-0.ogg / assets/audio/v4/death-brick-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/death-brick-1.ogg / assets/audio/v4/death-brick-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/shot-brick-0.ogg / assets/audio/v4/shot-brick-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/shot-brick-1.ogg / assets/audio/v4/shot-brick-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/hit-liquid-0.ogg / assets/audio/v4/hit-liquid-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/hit-liquid-1.ogg / assets/audio/v4/hit-liquid-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/hit-liquid-2.ogg / assets/audio/v4/hit-liquid-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/hit-liquid-3.ogg / assets/audio/v4/hit-liquid-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/death-liquid-0.ogg / assets/audio/v4/death-liquid-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/death-liquid-1.ogg / assets/audio/v4/death-liquid-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/shot-liquid-0.ogg / assets/audio/v4/shot-liquid-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/shot-liquid-1.ogg / assets/audio/v4/shot-liquid-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/hit-energy-0.ogg / assets/audio/v4/hit-energy-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/hit-energy-1.ogg / assets/audio/v4/hit-energy-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/hit-energy-2.ogg / assets/audio/v4/hit-energy-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/hit-energy-3.ogg / assets/audio/v4/hit-energy-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/death-energy-0.ogg / assets/audio/v4/death-energy-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/death-energy-1.ogg / assets/audio/v4/death-energy-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/shot-energy-0.ogg / assets/audio/v4/shot-energy-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/shot-energy-1.ogg / assets/audio/v4/shot-energy-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/fusion-hub.ogg / assets/audio/v4/fusion-hub.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/fusion-icefire.ogg / assets/audio/v4/fusion-icefire.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/fusion-demolition.ogg / assets/audio/v4/fusion-demolition.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/crumples2.wav` | `assets/audio/v4/ultimate-submission.ogg / assets/audio/v4/ultimate-submission.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/pageturn1.wav` | `assets/audio/v4/ultimate-submission.ogg / assets/audio/v4/ultimate-submission.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/ultimate-parallel.ogg / assets/audio/v4/ultimate-parallel.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/ultimate-conference.ogg / assets/audio/v4/ultimate-conference.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/ultimate-barrier.ogg / assets/audio/v4/ultimate-barrier.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull2.wav` | `assets/audio/v4/event-portal.ogg / assets/audio/v4/event-portal.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Paper/pageturn1.wav` | `assets/audio/v4/event-advisor.ogg / assets/audio/v4/event-advisor.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Technology/plugpull.wav` | `assets/audio/v4/event-blackout.ogg / assets/audio/v4/event-blackout.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Impacts/hit.wav` | `assets/audio/v4/event-examRage.ogg / assets/audio/v4/event-examRage.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Footsteps/running-shoes-1.wav` | `assets/audio/v4/event-sports.ogg / assets/audio/v4/event-sports.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/spray-bottle.wav` | `assets/audio/v4/event-rainstorm.ogg / assets/audio/v4/event-rainstorm.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `Owlish Media Sound Effects-extracted/Water/tap-water-2.wav` | `assets/audio/v4/rain-ambience.ogg / assets/audio/v4/rain-ambience.mp3` | 8-second recorded water excerpt, low-pass filtered with 60ms loop-edge fades, mono 44.1kHz Ogg/MP3; stylized rain ambience P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Recorded water Foley, not an outdoor rain field recording. |

## Keyboard Soundpack #1

作者：unicaegames。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/content/keyboard-soundpack-1-typing-and-single-keystrokes。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-paper-0.ogg / assets/audio/v4/hit-paper-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-paper-1.ogg / assets/audio/v4/hit-paper-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-paper-2.ogg / assets/audio/v4/hit-paper-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-paper-3.ogg / assets/audio/v4/hit-paper-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-paper-0.ogg / assets/audio/v4/death-paper-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-paper-1.ogg / assets/audio/v4/death-paper-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-paper-0.ogg / assets/audio/v4/shot-paper-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-paper-1.ogg / assets/audio/v4/shot-paper-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-key-0.ogg / assets/audio/v4/hit-key-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-005.wav` | `assets/audio/v4/hit-key-0.ogg / assets/audio/v4/hit-key-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-key-1.ogg / assets/audio/v4/hit-key-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-006.wav` | `assets/audio/v4/hit-key-1.ogg / assets/audio/v4/hit-key-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-key-2.ogg / assets/audio/v4/hit-key-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-007.wav` | `assets/audio/v4/hit-key-2.ogg / assets/audio/v4/hit-key-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-key-3.ogg / assets/audio/v4/hit-key-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-008.wav` | `assets/audio/v4/hit-key-3.ogg / assets/audio/v4/hit-key-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-key-0.ogg / assets/audio/v4/death-key-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-005.wav` | `assets/audio/v4/death-key-0.ogg / assets/audio/v4/death-key-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-key-1.ogg / assets/audio/v4/death-key-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-006.wav` | `assets/audio/v4/death-key-1.ogg / assets/audio/v4/death-key-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-key-0.ogg / assets/audio/v4/shot-key-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-005.wav` | `assets/audio/v4/shot-key-0.ogg / assets/audio/v4/shot-key-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-key-1.ogg / assets/audio/v4/shot-key-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-006.wav` | `assets/audio/v4/shot-key-1.ogg / assets/audio/v4/shot-key-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-metal-0.ogg / assets/audio/v4/hit-metal-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-metal-1.ogg / assets/audio/v4/hit-metal-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-metal-2.ogg / assets/audio/v4/hit-metal-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-metal-3.ogg / assets/audio/v4/hit-metal-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-metal-0.ogg / assets/audio/v4/death-metal-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-metal-1.ogg / assets/audio/v4/death-metal-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-metal-0.ogg / assets/audio/v4/shot-metal-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-metal-1.ogg / assets/audio/v4/shot-metal-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-glass-0.ogg / assets/audio/v4/hit-glass-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-glass-1.ogg / assets/audio/v4/hit-glass-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-glass-2.ogg / assets/audio/v4/hit-glass-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-glass-3.ogg / assets/audio/v4/hit-glass-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-glass-0.ogg / assets/audio/v4/death-glass-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-glass-1.ogg / assets/audio/v4/death-glass-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-glass-0.ogg / assets/audio/v4/shot-glass-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-glass-1.ogg / assets/audio/v4/shot-glass-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-brick-0.ogg / assets/audio/v4/hit-brick-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-brick-1.ogg / assets/audio/v4/hit-brick-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-brick-2.ogg / assets/audio/v4/hit-brick-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-brick-3.ogg / assets/audio/v4/hit-brick-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-brick-0.ogg / assets/audio/v4/death-brick-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-brick-1.ogg / assets/audio/v4/death-brick-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-brick-0.ogg / assets/audio/v4/shot-brick-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-brick-1.ogg / assets/audio/v4/shot-brick-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-liquid-0.ogg / assets/audio/v4/hit-liquid-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-liquid-1.ogg / assets/audio/v4/hit-liquid-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-liquid-2.ogg / assets/audio/v4/hit-liquid-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-liquid-3.ogg / assets/audio/v4/hit-liquid-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-liquid-0.ogg / assets/audio/v4/death-liquid-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-liquid-1.ogg / assets/audio/v4/death-liquid-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-liquid-0.ogg / assets/audio/v4/shot-liquid-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-liquid-1.ogg / assets/audio/v4/shot-liquid-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/hit-energy-0.ogg / assets/audio/v4/hit-energy-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/hit-energy-1.ogg / assets/audio/v4/hit-energy-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/hit-energy-2.ogg / assets/audio/v4/hit-energy-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/hit-energy-3.ogg / assets/audio/v4/hit-energy-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/death-energy-0.ogg / assets/audio/v4/death-energy-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/death-energy-1.ogg / assets/audio/v4/death-energy-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/shot-energy-0.ogg / assets/audio/v4/shot-energy-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shot-energy-1.ogg / assets/audio/v4/shot-energy-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/fusion-sword.ogg / assets/audio/v4/fusion-sword.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/fusion-hub.ogg / assets/audio/v4/fusion-hub.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/fusion-binder.ogg / assets/audio/v4/fusion-binder.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/fusion-sky.ogg / assets/audio/v4/fusion-sky.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/fusion-icefire.ogg / assets/audio/v4/fusion-icefire.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/fusion-demolition.ogg / assets/audio/v4/fusion-demolition.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/ultimate-submission.ogg / assets/audio/v4/ultimate-submission.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/ultimate-lastMinute.ogg / assets/audio/v4/ultimate-lastMinute.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/ultimate-parallel.ogg / assets/audio/v4/ultimate-parallel.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/ultimate-conference.ogg / assets/audio/v4/ultimate-conference.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/ultimate-barrier.ogg / assets/audio/v4/ultimate-barrier.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/ultimate-overload.ogg / assets/audio/v4/ultimate-overload.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/event-portal.ogg / assets/audio/v4/event-portal.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/event-advisor.ogg / assets/audio/v4/event-advisor.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-003.wav` | `assets/audio/v4/event-blackout.ogg / assets/audio/v4/event-blackout.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-004.wav` | `assets/audio/v4/event-examRage.ogg / assets/audio/v4/event-examRage.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/event-sports.ogg / assets/audio/v4/event-sports.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-001.wav` | `assets/audio/v4/event-rainstorm.ogg / assets/audio/v4/event-rainstorm.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `unicae_games_keyboard_soundpack_1_0-extracted/Single Keys/keypress-002.wav` | `assets/audio/v4/shield-break.ogg / assets/audio/v4/shield-break.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |

## Scorchers Foley Sounds

作者：scorcher24。许可：[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)。来源：https://opengameart.org/content/scorchers-foley-sounds。

物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `paper_rustling.wav` | `assets/audio/v4/hit-paper-0.ogg / assets/audio/v4/hit-paper-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `paper_rustling.wav` | `assets/audio/v4/hit-paper-2.ogg / assets/audio/v4/hit-paper-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `paper_rustling.wav` | `assets/audio/v4/death-paper-0.ogg / assets/audio/v4/death-paper-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `paper_rustling.wav` | `assets/audio/v4/shot-paper-0.ogg / assets/audio/v4/shot-paper-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/hit-metal-0.ogg / assets/audio/v4/hit-metal-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/hit-metal-1.ogg / assets/audio/v4/hit-metal-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/hit-metal-2.ogg / assets/audio/v4/hit-metal-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/hit-metal-3.ogg / assets/audio/v4/hit-metal-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/death-metal-0.ogg / assets/audio/v4/death-metal-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/death-metal-1.ogg / assets/audio/v4/death-metal-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/shot-metal-0.ogg / assets/audio/v4/shot-metal-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/shot-metal-1.ogg / assets/audio/v4/shot-metal-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/hit-glass-0.ogg / assets/audio/v4/hit-glass-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/hit-glass-1.ogg / assets/audio/v4/hit-glass-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/hit-glass-2.ogg / assets/audio/v4/hit-glass-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/hit-glass-3.ogg / assets/audio/v4/hit-glass-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/death-glass-0.ogg / assets/audio/v4/death-glass-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/death-glass-1.ogg / assets/audio/v4/death-glass-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/shot-glass-0.ogg / assets/audio/v4/shot-glass-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/shot-glass-1.ogg / assets/audio/v4/shot-glass-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/hit-liquid-0.ogg / assets/audio/v4/hit-liquid-0.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/hit-liquid-1.ogg / assets/audio/v4/hit-liquid-1.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/hit-liquid-2.ogg / assets/audio/v4/hit-liquid-2.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/hit-liquid-3.ogg / assets/audio/v4/hit-liquid-3.mp3` | hit: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/death-liquid-0.ogg / assets/audio/v4/death-liquid-0.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/death-liquid-1.ogg / assets/audio/v4/death-liquid-1.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/shot-liquid-0.ogg / assets/audio/v4/shot-liquid-0.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/shot-liquid-1.ogg / assets/audio/v4/shot-liquid-1.mp3` | shot: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/fusion-sword.ogg / assets/audio/v4/fusion-sword.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `shaking_cup_short.wav` | `assets/audio/v4/fusion-binder.ogg / assets/audio/v4/fusion-binder.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/fusion-sky.ogg / assets/audio/v4/fusion-sky.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/fusion-icefire.ogg / assets/audio/v4/fusion-icefire.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Fusion-specific material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/ultimate-lastMinute.ogg / assets/audio/v4/ultimate-lastMinute.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/ultimate-overload.ogg / assets/audio/v4/ultimate-overload.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Character ultimate material mix. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_long.wav` | `assets/audio/v4/event-rainstorm.ogg / assets/audio/v4/event-rainstorm.mp3` | climax: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. Existing campus event transition; no rule changes. P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |
| `stiring_cup_short.wav` | `assets/audio/v4/shield-break.ogg / assets/audio/v4/shield-break.mp3` | death: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps.  P2: all samples normalized offline with BS.1770 measured gain and look-ahead peak limiting to -23 LUFS, -3 dBTP delivered ceiling (-4.5 dBTP pre-encoding margin); measured after both lossy encoders. Very short clicks are padded with silence to at least 120ms for encoder block stability. Clips shorter than 3s use periodic extension for BS.1770 metering only; delivered lengths stay unchanged. Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails. |

## Graduate cap

作者：Delapouite。许可：[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)。来源：https://game-icons.net/1x1/delapouite/graduate-cap.html。

菜单徽标中的学位帽图标。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `icons/ffffff/transparent/1x1/delapouite/graduate-cap.svg` | `assets/art/v4/ui/graduate-cap.svg` | recolored champagne gold; combined with original badge frame  |

## Noto Sans SC

作者：Copyright 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'。许可：[SIL OFL 1.1](https://openfontlicense.org/open-font-license-official-text/)。来源：https://github.com/google/fonts/tree/main/ofl/notosanssc。

自托管、按本项目字符子集化。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `Noto Sans SC` | `assets/fonts/campus-sans-400-game.woff2` | fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits  |
| `Noto Sans SC` | `assets/fonts/campus-sans-400-shell.woff2` | fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits  |
| `Noto Sans SC` | `assets/fonts/campus-sans-600-game.woff2` | fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits  |
| `Noto Sans SC` | `assets/fonts/campus-sans-600-shell.woff2` | fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits  |

## ZCOOL QingKe HuangYou

作者：Copyright 2018 The ZCOOL QingKe HuangYou Project Authors (https://www.github.com/googlefonts/zcool-qingke-huangyou)。许可：[SIL OFL 1.1](https://openfontlicense.org/open-font-license-official-text/)。来源：https://github.com/google/fonts/tree/main/ofl/zcoolqingkehuangyou。

自托管、按本项目字符子集化。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `ZCOOL QingKe HuangYou` | `assets/fonts/campus-title-400-title.woff2` | fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits  |

## Rajdhani

作者：Copyright (c) 2014, Indian Type Foundry (info@indiantypefoundry.com).。许可：[SIL OFL 1.1](https://openfontlicense.org/open-font-license-official-text/)。来源：https://github.com/google/fonts/tree/main/ofl/rajdhani。

自托管、按本项目字符子集化。

| 原文件 | 项目文件 | 修改 |
|---|---|---|
| `Rajdhani` | `assets/fonts/campus-digits-600-latin.woff2` | fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits  |

## 用户提供的 AI 美术 · v4 P1 全量 137 张

作者：用户提供；131 张记录为 Grok Bot GenerateImage，6 张 P0 原图未提供生成信息。许可：用户提供素材；独立许可未提供。来源：art-src/ai/metadata.json。

如实保存原始元数据，未推断 CC0、著作权归属、生成工具或批准版本。131 张有工具/日期/完整提示词，6 张 P0 原图缺这些信息；每张源图以 SHA-256 固定版本。原提示词中关于背景的描述原样保存，运行时只做裁切缩放、描边和压缩。

### art-src/ai/buildings/activity.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/activity.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`d04e4122a207a8e43334d2955bf0308d78618b1e3cf0633fcfa2f6a831e8225d.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`e750b3a226c27d23ea64e4f58f3f8318cabf3218af67ba235db836c13a0808dc`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A lively campus activity center with jade roof forms, broad glass doors and a small sheltered entrance. Isolated on a plain solid pure white background.

### art-src/ai/buildings/architecture.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/architecture.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`e8bd502125af38b81aaa8805a679c876722796c2e9e7bd1d6a0465d3a1fc4998.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`ffa508ace7ed256bd0cd7066b2039d53accbc5092b2bef47f9a5259359863d9b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A contemporary architecture school building with layered pale stone volumes, muted violet glass and a precise facade rhythm. Isolated on a plain solid pure white background.

### art-src/ai/buildings/basic-south.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/basic-south.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`35c18f27f109d570f360a00d08db0b86a9cdc7082953187b52312f87a8b2f483.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`60004d66b39423a1b2814bcbc35f3a55a2b8afb515c599d04b227dc5df7a4072`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A low university teaching block with warm sandstone walls, ivory window frames and a simple flat roof. Isolated on a plain solid pure white background.

### art-src/ai/buildings/basic.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/basic.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`0d1b6154bfc30a2e7d575f4c419d3087e4078c84682d4515eed7d68106d02184.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`2a6a711e274a3cb98e65ecece2a497b69246bc8ee73267e5d79d3051e8a99e83`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A broad ivory university teaching building with champagne-colored facade details and regular classroom windows. Isolated on a plain solid pure white background.

### art-src/ai/buildings/canteen.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/canteen.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`6d8d70bc345e3a8a0ec956fa2fcfaf5735142dec9731af56839a383c99f9d332.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8ad61af8c593f231e869e5d86eb4ba8c6f2a322bd77eac9e92cb61bac89c11e5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A warm university canteen with terracotta accents, broad windows and a simple welcoming entrance. Isolated on a plain solid pure white background.

### art-src/ai/buildings/civil.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/civil.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`c6d55b74b51bfb050c025abb2c07339a26f5705096171df25d3d20264e05eb6d.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`5bf116b12074f68545b9f58c89cba17c5b4d4b7b201aa0b460bc7c1dd8bb1ec2`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A solid university engineering building with blue-gray structural details and a broad practical entrance. Isolated on a plain solid pure white background.

### art-src/ai/buildings/dorm-west.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/dorm-west.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`4568fa2be7d7bdef0f9c772d621ac68c15c18d4eb28fa8fd89ca882c138a5b98.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`08b2d73ccdd90b0ad7a373020058fd50dde283322187a7ee7e424f2d20aa3b1f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A compact graduate residence with warm gray walls, terracotta roof accents and regular ivory-framed windows. Isolated on a plain solid pure white background.

### art-src/ai/buildings/dorm.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/dorm.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`b2d2ca8d4d3d214464e130a5ab67cc29f58ca3c02c7b4bac0c9cd861ef49fd73.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`20cdafe8ffc8e1cd39a171f51201a64933425dc45b4a7089009b531c4628cbb7`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A friendly graduate dormitory with warm ivory walls, dusty rose accents and repeating balcony windows. Isolated on a plain solid pure white background.

### art-src/ai/buildings/experiment.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/experiment.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`03912772065020625f0748a5f5eba5a8043fe786501f0bf047acc1638ac2dd21.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`70e1ce1bed4173bae0c05c21a137c94948e4e401ac22686993bc185764a3158c`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A clean university laboratory center with jade glass panels, ivory concrete and compact rooftop equipment. Isolated on a plain solid pure white background.

### art-src/ai/buildings/library.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/buildings/library.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`fc602e2624da54acaca4bf97366cfa9fd24eb514cb79d35b79179472b4662a49.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`1e1339f61a82005a9c530cdda0509e7cf02b9284fbb36455b4d2923aaaf4640e`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single modern Chinese university building (contemporary architecture, flat or gently sloped modern roofs, no pagoda or ancient temple roofs), orthographic top-down three-quarter game view, complete building visible, clean footprint, no surrounding roads, no ground shadow. Subject: A welcoming university library with a broad jade roof, ivory stone facade and a clear central entrance. Isolated on a plain solid pure white background.

### art-src/ai/characters/analysis/avatar.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/analysis/avatar.webp / assets/art/v4/characters/analysis/avatar.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`faa0dfb1a870bd332e432ac14d02190529ed74af0418e99413aa97f757dfa4fc.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f555efb57f6883def129a88e2b7c7ec110fa71518aa10ee4bbab093b17d71179`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a matching head-and-shoulders portrait with exactly the same face, hairstyle and outfit, centered. Subject: A precise mathematics graduate student with thin round glasses, a navy academic cardigan, champagne-gold details and a compact laser pointer, thoughtful confident expression. Isolated on a plain solid pure white background.

### art-src/ai/characters/analysis/portrait.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/analysis/portrait.webp`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`87da63ca0961187933f953bd38d2fc28fe998364c2d99bd4b05ed353268e8fa7.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`6c4a0a368ccdf34880e06ffeccb92ca7c28379286949aa1d39a12f366ae72c46`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Full-body young adult graduate student, stylized four-head-tall proportions, expressive face, relaxed confident pose, entire body visible with generous margins. Subject: A precise mathematics graduate student with thin round glasses, a navy academic cardigan, champagne-gold details and a compact laser pointer, thoughtful confident expression. Use the reference image only for painting style, proportions and rendering quality; this is a completely different person with a different face, hairstyle and outfit. Isolated on a plain solid pure white background.

### art-src/ai/characters/analysis/sprite.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/analysis/sprite.webp / assets/art/v4/characters/analysis/sprite.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; 2px ivory outline at 128px (1px at 64px); WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`9ab28834b02e2fa27c31cc805b87dc2e0d7269b66307c941a9a7ca2b93c51b8d.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`489e7cdd9a8c37883b47366472df9850bf1aa2cd0b22c37b81115243e64257b9`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a compact top-down three-quarter game sprite, orthographic projection, facing slightly right, entire body visible, simple readable details, no ground shadow. Subject: A precise mathematics graduate student with thin round glasses, a navy academic cardigan, champagne-gold details and a compact laser pointer, thoughtful confident expression. Isolated on a plain solid pure white background.

### art-src/ai/characters/architect/avatar.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/architect/avatar.webp / assets/art/v4/characters/architect/avatar.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`fd692f2f266bf8b62f9b606a8180fe4722e285169a46197642dce855319628eb.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`3d4b476a94f67386bc2fedca37fbed7ef0920adf2ed4259c1ac82f32f4391943`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a matching head-and-shoulders portrait with exactly the same face, hairstyle and outfit, centered. Subject: An architecture graduate student in a light blue work jacket, carrying a T-square ruler and rolled blueprints, cream safety helmet attached to the backpack. Isolated on a plain solid pure white background.

### art-src/ai/characters/architect/portrait.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/architect/portrait.webp`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`1e664e2cd4618b86e904eff8d1f7ce14051ef362133b844c5fc671a06df50e62.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`fe399e96932d8ad235a2a53a5eff443a3a30d087b97c3278ec402703b295cf2b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Full-body young adult graduate student, stylized four-head-tall proportions, expressive face, relaxed confident pose, entire body visible with generous margins. Subject: An architecture graduate student in a light blue work jacket, carrying a T-square ruler and rolled blueprints, cream safety helmet attached to the backpack. Use the reference image only for painting style, proportions and rendering quality; this is a completely different person with a different face, hairstyle and outfit. Isolated on a plain solid pure white background.

### art-src/ai/characters/architect/sprite.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/architect/sprite.webp / assets/art/v4/characters/architect/sprite.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; 2px ivory outline at 128px (1px at 64px); WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`0f6e35e4cb91de2837b378d4230a45c35828fd4c94af0503dfdc00bfc3a84b5d.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`3e7c353760545f0abf162f4cd645dd85cdef9855d907a7c17c25c218fb4721fe`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a compact top-down three-quarter game sprite, orthographic projection, facing slightly right, entire body visible, simple readable details, no ground shadow. Subject: An architecture graduate student in a light blue work jacket, carrying a T-square ruler and rolled blueprints, cream safety helmet attached to the backpack. Isolated on a plain solid pure white background.

### art-src/ai/characters/balanced/avatar.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/balanced/avatar.webp / assets/art/v4/characters/balanced/avatar.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`e8eafb8b295a33510d6661ba05b31c9d525732341843a2f3c08304847c127c64.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`65a433090ed71b618696d76e150693e24386e7a85867315b1a0203d860c71a4b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a matching head-and-shoulders portrait with exactly the same face, hairstyle and outfit, centered. Subject: An approachable graduate student in a jade campus jacket, carrying a cream notebook and a canvas backpack, practical sneakers, determined but friendly expression. Isolated on a plain solid pure white background.

### art-src/ai/characters/balanced/portrait.png

署名：用户提供 / 未提供。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/balanced/portrait.webp`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP。

生成工具：未提供；生成日期：未提供；参考：未提供；源文件：`未提供`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`dcbc134bed97003ad6136f659e6d9aeb26ce52a464f46b0996a9d206f6662de5`。

完整原始提示词：

未提供

### art-src/ai/characters/balanced/sprite.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/balanced/sprite.webp / assets/art/v4/characters/balanced/sprite.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; 2px ivory outline at 128px (1px at 64px); WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`f05bdafcaf415455a7c0dd65643eace875e665000975efc960f100d0c0fbb40a.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`627fd584df693d6489f91d3eaa8611aaf9a190c4d35a193d4075388870e27d32`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a compact top-down three-quarter game sprite, orthographic projection, facing slightly right, entire body visible, simple readable details, no ground shadow. Subject: An approachable graduate student in a jade campus jacket, carrying a cream notebook and a canvas backpack, practical sneakers, determined but friendly expression. Isolated on a plain solid pure white background.

### art-src/ai/characters/coder/avatar.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/coder/avatar.webp / assets/art/v4/characters/coder/avatar.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`417d31135bb1230797aa4d82200e4d14cd9a090db002fae8f4932fb5e96f2ad8.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`09552a04e84dfb8ae1e2c835a52658dbb629e714f1dfd7abc6427ff2ed6cf489`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a matching head-and-shoulders portrait with exactly the same face, hairstyle and outfit, centered. Subject: A computer science graduate student, a young man with slightly messy hair, in a navy hoodie with pale blue accents, holding a small plain unbranded laptop, with a compact ivory assistant robot. Isolated on a plain solid pure white background.

### art-src/ai/characters/coder/portrait.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/coder/portrait.webp`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`ec3e4f841f55ac69a4a5290adf5d37b2acb32a4090ca87cdcfcb442553003696.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9f11805823e2cecb0fcd1771dcfeeb1b7dd2c3f169d3526b19a324967cd4dc26`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Full-body young adult graduate student, stylized four-head-tall proportions, expressive face, relaxed confident pose, entire body visible with generous margins. Subject: A computer science graduate student, a young man with slightly messy hair and a calm focused grin, in a navy hoodie with pale blue accents, holding a small plain unbranded silver laptop with a completely blank lid, accompanied by one compact jade assistant robot hovering beside him; no backpack. Use the reference image only for painting style and rendering quality; this is a completely different person with a different face, hairstyle and outfit. Isolated on a plain solid pure white background.

### art-src/ai/characters/coder/sprite.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/coder/sprite.webp / assets/art/v4/characters/coder/sprite.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; 2px ivory outline at 128px (1px at 64px); WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`bd1a10556f6144bab5a619528c49d6ca304d198e201abfcb35d5122568480778.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4a8a06f5a920c81724615b42568022ffc46937a9f96bf7f6d102c6a51cb74db6`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a compact top-down three-quarter game sprite, orthographic projection, facing slightly right, entire body visible, simple readable details, no ground shadow. Subject: A computer science graduate student, a young man with slightly messy hair, in a navy hoodie with pale blue accents, holding a small plain unbranded laptop, with a compact ivory assistant robot. Isolated on a plain solid pure white background.

### art-src/ai/characters/english/avatar.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/english/avatar.webp / assets/art/v4/characters/english/avatar.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`424aed08d968093e81bf92f9b60f6000682e3746023022c07ec915bf71827aba.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`a0e90d224f9b39e153226100e31c833dc63bc541c99e5d74c30f1d125f106778`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a matching head-and-shoulders portrait with exactly the same face, hairstyle and outfit, centered. Subject: An internationally minded language graduate student, a young woman with a shoulder-length bob haircut, dusty rose scarf, ivory shirt and navy trousers, holding a notebook and wearing a small headset, small shoulder tote. Isolated on a plain solid pure white background.

### art-src/ai/characters/english/portrait.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/english/portrait.webp`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`51caa473f15ef4994df6d775743a33183424a85ce20d851f9678f59b33298c5e.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`0b25d1c27920c3e3a370a8f666f4779e7e59c79f4081132507880ffb2f584bbc`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Full-body young adult graduate student, stylized four-head-tall proportions, expressive face, relaxed confident pose, entire body visible with generous margins. Subject: An internationally minded language graduate student, a young woman with a shoulder-length bob haircut and a bright friendly smile, dusty rose scarf, ivory shirt and navy trousers, holding a notebook and wearing a small headset, small shoulder tote instead of a backpack. Use the reference image only for painting style and rendering quality; this is a completely different person with a different face, hairstyle and outfit. Isolated on a plain solid pure white background.

### art-src/ai/characters/english/sprite.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/english/sprite.webp / assets/art/v4/characters/english/sprite.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; 2px ivory outline at 128px (1px at 64px); WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`c110efa071eb2a76b660a921b93739905802743401c8a3b1b328b1a26d6a324b.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`32c69192df8b0e78a0950eafd985de532cf6a08943d8e365693788e2d3ca6cfb`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a compact top-down three-quarter game sprite, orthographic projection, facing slightly right, entire body visible, simple readable details, no ground shadow. Subject: An internationally minded language graduate student, a young woman with a shoulder-length bob haircut, dusty rose scarf, ivory shirt and navy trousers, holding a notebook and wearing a small headset, small shoulder tote. Isolated on a plain solid pure white background.

### art-src/ai/characters/experiment/avatar.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/experiment/avatar.webp / assets/art/v4/characters/experiment/avatar.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`1f875713f29e339fd7f1d192e473b26c336ac2829974339c2bbc194e0ac9c18f.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`dfcf51fe77fdb1522ee0841b85ed3acca6f1ad1bea77bd80f6ce44bd59734268`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a matching head-and-shoulders portrait with exactly the same face, hairstyle and outfit, centered. Subject: A laboratory graduate student wearing a short ivory lab coat over navy campus clothes, protective goggles and insulated gloves, carrying a compact pale blue cryogenic canister. Isolated on a plain solid pure white background.

### art-src/ai/characters/experiment/portrait.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/experiment/portrait.webp`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`ea46f77dd9e834a09742b929953c719e1576523bb18beb17edf22655c5bc9b55.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`39da4ee1d7b9d9f6f2f08dde32a1500fc721bc87ef9652eb24a83600d932d1a1`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Full-body young adult graduate student, stylized four-head-tall proportions, expressive face, relaxed confident pose, entire body visible with generous margins. Subject: A laboratory graduate student wearing a short ivory lab coat over navy campus clothes, protective goggles and insulated gloves, carrying a compact pale blue cryogenic canister. Use the reference image only for painting style, proportions and rendering quality; this is a completely different person with a different face, hairstyle and outfit. Isolated on a plain solid pure white background.

### art-src/ai/characters/experiment/sprite.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/characters/experiment/sprite.webp / assets/art/v4/characters/experiment/sprite.png`

处理：Alpha bounds trimmed; silhouette preserved; Lanczos resize; 2px ivory outline at 128px (1px at 64px); WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`f8cd1850bd71bbb8e3757227b0ec48bfe57388e92433be57c8f97d9eb7aa16cd.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`b9252af24df532790a7c22d7cc561acf7634ad4d6c70310f8cb25eacded7b2a5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Using the approved character portrait as reference, create a compact top-down three-quarter game sprite, orthographic projection, facing slightly right, entire body visible, simple readable details, no ground shadow. Subject: A laboratory graduate student wearing a short ivory lab coat over navy campus clothes, protective goggles and insulated gloves, carrying a compact pale blue cryogenic canister. Isolated on a plain solid pure white background.

### art-src/ai/enemies/advisor.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/advisor.webp / assets/art/v4/enemies/advisor.png / assets/art/v4/enemies/advisor-white.webp / assets/art/v4/enemies/advisor-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`b9d1e3470bd919adf6c80ac0c9fa5934be5b6e0f7f2fe1229d7f7596586362b2.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`bb28c6a97a71d97dac0fc04494e04d794d23fb68f9b0ffcc607a6fd6cb85081b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A stylized adult academic advisor in a jade jacket, round glasses and a compact stack of papers, humorous rather than realistic. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/enemies/bomber.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/bomber.webp / assets/art/v4/enemies/bomber.png / assets/art/v4/enemies/bomber-white.webp / assets/art/v4/enemies/bomber-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`7526e6c202506f9b4fe0b4e1c62bf4694e10eec8675351f439019343e13b19a5.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`ad2fa8d78f0379163fb07768acbf77d0aa094ee175e6f01091ab88a14a4fb8d6`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A compact unstable laboratory glass sphere with warm coral liquid, a cracked metal cap and a clear warning-shaped silhouette. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/charger.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/charger.webp / assets/art/v4/enemies/charger.png / assets/art/v4/enemies/charger-white.webp / assets/art/v4/enemies/charger-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`6fc94ad3dedc675862c3455c59b1e960a667c09d9163d2d6ab8d8c142c048a45.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f851ecb895062854cfeb6ce3e6bdb0d82efdd8e4816d1ca7f81120f9dfafbcfc`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A coral attendance-clock creature leaning forward in a sprint, large running shoes and a sharp compact silhouette. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/checkin.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/checkin.webp / assets/art/v4/enemies/checkin.png / assets/art/v4/enemies/checkin-white.webp / assets/art/v4/enemies/checkin-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`38b9485b7077f3fa730c911e5369a156ede69f41ba20123182358a8440e0e9d6.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`cdff6d3425632fae1da8faa597b9dbac44871315f0c7503a4de4c3ba6cb687e8`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A lively brass attendance token with an embossed check symbol, tiny feet and a compact round silhouette. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/enemies/coding.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/coding.webp / assets/art/v4/enemies/coding.png / assets/art/v4/enemies/coding-white.webp / assets/art/v4/enemies/coding-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`caceb1c34e43fd93f421fe597ccda0fdb62853e4cbd39aedc3ee63512d468fe2.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9215f4c2dc76f09d734595151d253a31c2ba7ba4bc01cab596944de0c0dc6a7e`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: An animated blue programming examination terminal with abstract bracket motifs and a stern luminous face. Isolated on a plain solid pure white background.

### art-src/ai/enemies/ddl.png

署名：用户提供 / 未提供。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/ddl.webp / assets/art/v4/enemies/ddl.png / assets/art/v4/enemies/ddl-white.webp / assets/art/v4/enemies/ddl-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：未提供；生成日期：未提供；参考：未提供；源文件：`未提供`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`934e4e28581547e5c02919323a7439b31f127c191e1796d7d4f785cf4371b6d2`。

完整原始提示词：

未提供

### art-src/ai/enemies/defense.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/defense.webp / assets/art/v4/enemies/defense.png / assets/art/v4/enemies/defense-white.webp / assets/art/v4/enemies/defense-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`c7adead4f90a9a58c17e14107993aa78196fc8cc3e899e8c7979b61444a11051.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`2744cd7154db9a3db00674f79e869758bbca9b1ba60c5aa9d1c4404fb0f3490e`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Distinctive boss silhouette with clearly separated large forms and restrained ornamental detail. Subject: A grand violet academic defense lectern creature with floating manuscript panels and an imposing symmetrical silhouette. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs; the floating panels show only simple abstract circles and lines. Isolated on a plain solid pure white background.

### art-src/ai/enemies/english.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/english.webp / assets/art/v4/enemies/english.png / assets/art/v4/enemies/english-white.webp / assets/art/v4/enemies/english-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`6c6446e962303c89e6a7905b696f31cccdc210341ff84668dd991f77053d4e31.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`b6d77ced4e634f16726e11da762d3b84053159056c19614103755452356e5922`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: An animated jade language examination book with a small globe relief and layered ivory index tabs. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/enemies/examCharger.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/examCharger.webp / assets/art/v4/enemies/examCharger.png / assets/art/v4/enemies/examCharger-white.webp / assets/art/v4/enemies/examCharger-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`86186d12b94b6418495f9d66ca627603b50546adb240c965f1f58376044921f3.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`fb5aa2f88a91536cf19f3af08e624bb2b638ce7ea739e9f6a122866ec25d356c`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A compact coral examination-paper lancer with a pointed folded-paper crest and a strong forward-leaning silhouette. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/finals.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/finals.webp / assets/art/v4/enemies/finals.png / assets/art/v4/enemies/finals-white.webp / assets/art/v4/enemies/finals-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`04b9d424d73028b98feaab9543822599164c41c1745e5de98652ecf5e367c9f8.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`7d3e4f47a97d51c08edec9d4154e4d0797a18bf942cdfb3af7bca3b4e3085250`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Distinctive boss silhouette with clearly separated large forms and restrained ornamental detail. Subject: A massive coral examination clock fused with stacked textbooks, dark navy structural forms and a dramatic gold crown-like timetable ring. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs; the clock face has only simple tick marks and the ring segments are plain smooth panels. Isolated on a plain solid pure white background.

### art-src/ai/enemies/guard.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/guard.webp / assets/art/v4/enemies/guard.png / assets/art/v4/enemies/guard-white.webp / assets/art/v4/enemies/guard-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`7a6752923e4e94da746f1e8fa2155b3e95d9abf60668d7179c6702cf8178bed8.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9c24c97732576ebb569cd40736e3da1e79f2afb76f21b287e2396b2ad8dec1d7`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A sturdy jade office-stamp guardian carrying a large brushed-metal shield, heavy compact defensive silhouette. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/homework.png

署名：用户提供 / 未提供。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/homework.webp / assets/art/v4/enemies/homework.png / assets/art/v4/enemies/homework-white.webp / assets/art/v4/enemies/homework-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：未提供；生成日期：未提供；参考：未提供；源文件：`未提供`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`0bb4d64406236cb1c17efbaa89851e18ddaedf36c1f5b3e1715a97f2293c3375`。

完整原始提示词：

未提供

### art-src/ai/enemies/inspector.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/inspector.webp / assets/art/v4/enemies/inspector.png / assets/art/v4/enemies/inspector-white.webp / assets/art/v4/enemies/inspector-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`feaea198b96843559f3aa16944eaec531764416de434aaefb61a6ecca45d39b5.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`68f5a4af4fefb67b14b1a7e6634baf115b37a5240c1c203e760b4f1d2771bfd2`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Distinctive boss silhouette with clearly separated large forms and restrained ornamental detail. Subject: An imposing laboratory inspector automaton with pale blue protective equipment, a large inspection clipboard and reinforced ivory armor. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/leader.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/leader.webp / assets/art/v4/enemies/leader.png / assets/art/v4/enemies/leader-white.webp / assets/art/v4/enemies/leader-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`864f7296c6d8d34cd70299ddf34a00b6449b449476c5715e89bca53a492f6f8d.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8f4b6e38edacc7cf083fe87b9b2ab309da65af07929bbecb83f177bb675d9630`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: An ochre academic organizer creature with a tall folded-paper pennant and an assertive leading pose. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/math.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/math.webp / assets/art/v4/enemies/math.png / assets/art/v4/enemies/math-white.webp / assets/art/v4/enemies/math-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`edf7d48551fe5b85f8f2e74e6977e42520d8b1e9ecedcc75d197b248e0c35729.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`0e0fca1868202682658b47480e9ac85a91aaf1d981310e4c515cd95b1a57253f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: An animated ochre mathematics examination book with a geometric compass emblem and precise angular paper forms. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/mechanics.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/mechanics.webp / assets/art/v4/enemies/mechanics.png / assets/art/v4/enemies/mechanics-white.webp / assets/art/v4/enemies/mechanics-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`68f43608a7f502e6483373d3a9539a4864a1831d783fa5f4168b971f98080ba3.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9537fab0af91b26cec3f2d92ab878bbb585fc826f130f645a23c62934f57228b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: An animated violet structural mechanics examination book reinforced by a small triangular truss. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/node.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/node.webp / assets/art/v4/enemies/node.png / assets/art/v4/enemies/node-white.webp / assets/art/v4/enemies/node-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`a060fb85c9ce775d13c9302b6be56549f6f621f7d220dd007e68247af48bdfba.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`e6d488c9f7e0f2c75c2ec95661c21d21537577ef853805cdb85dd1ac3fcc8dbe`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A compact stationary pale blue glass shield node suspended in an ivory metal frame, clean diamond-shaped silhouette. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/ppt.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/ppt.webp / assets/art/v4/enemies/ppt.png / assets/art/v4/enemies/ppt-white.webp / assets/art/v4/enemies/ppt-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`74f629f945a267794165fb780e4e2eedbe90828d33daa08b9f19b324d23d7838.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`1806ab1d33a9e1477a7db28e08ff08dd8a824c991783849becb870dda3c072bb`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: An animated coral presentation board with layered slide panels and a slightly irritated expression. Isolated on a plain solid pure white background.

### art-src/ai/enemies/proposal.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/proposal.webp / assets/art/v4/enemies/proposal.png / assets/art/v4/enemies/proposal-white.webp / assets/art/v4/enemies/proposal-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`e74109bf9f90a1063dec36b0a16c07120a3466ce1266f94ef9cbb4e76a21616f.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`71b36b593c54be8405042509c273e24e8ba12971c042cfb7a1d77453c666f72c`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Distinctive boss silhouette with clearly separated large forms and restrained ornamental detail. Subject: A towering academic proposal manuscript fortress with ochre book covers, layered ivory pages and a restrained gold academic crest. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/receipt.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/receipt.webp / assets/art/v4/enemies/receipt.png / assets/art/v4/enemies/receipt-white.webp / assets/art/v4/enemies/receipt-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`649976445098cac6f4c5965b0d01edadccf6253aa8e66d6d6149d7f9a5335010.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`1e8aaaa9932b11eb1d57e265facd5dd1d2047509657956f4bb173482a2230584`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A heavy folded reimbursement receipt creature with dense layered ivory paper and jade accounting tabs. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/review.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/review.webp / assets/art/v4/enemies/review.png / assets/art/v4/enemies/review-white.webp / assets/art/v4/enemies/review-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`2e5576cf1c4f91d94d55865a0b75020619c7240bfaec08d3d9d77e19e2219326.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`16bd96f621605853dd6d0c0c22f7bf996a61d852d89add68b7acd042a4acb8d2`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A hovering violet review manuscript with sharp folded corners, red annotation ribbons and a critical expression. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/splitter.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/splitter.webp / assets/art/v4/enemies/splitter.png / assets/art/v4/enemies/splitter-white.webp / assets/art/v4/enemies/splitter-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`7f91c0bf9fc7d2f72453e7e2f3e2d8209584faefafff4d8eeb88acdedfad66a3.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`39df23faf89b8b13ee9b904a1f31bd1d2ff7fb74394060c747ef7771c2b034a2`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A pale blue stack of duplicated paper sheets with visibly offset layers and two small mischievous faces. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/summoner.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/summoner.webp / assets/art/v4/enemies/summoner.png / assets/art/v4/enemies/summoner-white.webp / assets/art/v4/enemies/summoner-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`ee33b7e611c22543b9a7e1af636d57e2e9d9e5d9f0a3f43422ff963e3ec36b30.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`7d3076d5cb080a197f8e19aed08d41d738f7c779be4ee9767851daddefa0c3a0`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A navy-blue class representative clipboard creature carrying a small brass handbell and several neatly stacked papers. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/teamlead.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/teamlead.webp / assets/art/v4/enemies/teamlead.png / assets/art/v4/enemies/teamlead-white.webp / assets/art/v4/enemies/teamlead-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`1ad6e7e80e6c2f1e37d5176c24f1686c08df315dc96be8f7a930653bf40e00b5.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`d332e3a04abcf5814b4ac1c0375c373de8d52eb5711f6076e1c52eef2dcda788`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Distinctive boss silhouette with clearly separated large forms and restrained ornamental detail. Subject: An imposing violet course-project leader made of stacked design folders, a brass drafting ruler and broad architectural shoulder forms. Clearly a living creature with a simple expressive face, small eyes and tiny stubby limbs; any surface markings are abstract shapes only, no writing or glyphs. Isolated on a plain solid pure white background.

### art-src/ai/enemies/thrower.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/enemies/thrower.webp / assets/art/v4/enemies/thrower.png / assets/art/v4/enemies/thrower-white.webp / assets/art/v4/enemies/thrower-white.png`

处理：Lanczos resize; WebP encoding；Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`7b9d3651970adf433718f84de2ca3c9e5bcdb98cb7995ce240a370203e200d56.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`a17b99198267e1b4b1014bf756ce978f4bbc1bd2e284fe71b73584e0459eb292`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single top-down three-quarter enemy game sprite, orthographic projection, compact readable silhouette, entire body visible, no ground shadow, no surrounding effects. Subject: A violet examination-paper creature holding a tightly rolled paper projectile, clear throwing silhouette. Isolated on a plain solid pure white background.

### art-src/ai/icons/fusions/binder.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/fusions/binder.webp / assets/art/v4/icons/fusions/binder.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`0f5fd42648b2afcea7f735a4062012334f0c098de39ba26411e5fb6fe5e3b14e.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`aa8c3faf09d4a6cdadc922f437bebf34f07fd2f991ea3ea0beef54c68e75ff70`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A powerful polished metal binder launching a fan of feather-shaped silver staples. Isolated on a plain solid pure white background.

### art-src/ai/icons/fusions/demolition.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/fusions/demolition.webp / assets/art/v4/icons/fusions/demolition.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`ca9ed957c4053767f67eb35467dc072d4daf07d74502d55ead75e0cc0d5ec064.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`6840c69f52b6e05b05cdb9b83db7a80e67c6e8ce6a1be48bf1db1b797a6d520f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: Four small white modern architectural foam model blocks, simple flat-roofed contemporary boxes with glass strips, arranged around a brass drafting compass, with controlled fracture lines; no traditional roofs. Isolated on a plain solid pure white background.

### art-src/ai/icons/fusions/hub.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/fusions/hub.webp / assets/art/v4/icons/fusions/hub.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`9da3d64890a221a676d4b18718ae5c137508669aeb53ee3d4ab86177ac4c4a13.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`38bc4193a6a2e852aed33f6036ebe30e1976177965061731b4c178409ca40bb6`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact modern campus command console of sleek glass and brushed metal with six small ivory assistant terminals and a blue holographic grid of simple modern boxy buildings, contemporary design, no roofs or towers. Isolated on a plain solid pure white background.

### art-src/ai/icons/fusions/icefire.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/fusions/icefire.webp / assets/art/v4/icons/fusions/icefire.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`f38540b21b290f1f53269bc0672eb1e94b85e769d42185e51e85a764234310e2.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4060ce4d72be326e0d0746be34546ce425e09eff9e68bdb7b5796f4c4d649a7a`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An academic experiment combining an amber coffee vortex and pale blue crystalline frost. Isolated on a plain solid pure white background.

### art-src/ai/icons/fusions/sky.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/fusions/sky.webp / assets/art/v4/icons/fusions/sky.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`38e27ac035e16ace51afb209dd0b9f2a8d5099dd3bf6819077f0b0aa16004239.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`642e6d7adb5b06e96273e71af27859a73763da7ceac485ad315297e5279d8f82`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A golden surveying prism array with six clean intersecting beams and an ivory coordinate ring. Isolated on a plain solid pure white background.

### art-src/ai/icons/fusions/sword.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/fusions/sword.webp / assets/art/v4/icons/fusions/sword.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`dd47465cdd27fb082da455e8de63f131bd4cf607c648bb219b617cfde5399a0d.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`3b9fbb72994f2cf708277374f338a77a7d165705c303c6cb0f1723fb5fc9740e`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A circular formation of folded paper blades and architectural rulers around a jade academic core. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/area.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/area.webp / assets/art/v4/icons/passives/area.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`cbc6635266c4d804274e2aa5a274eda6916f2768c5ec142d13e87a528e0a1449.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`3137c0ae8ed171fbbdb42ed26827a9e753fe7894243611a2db8f481c0cde19f7`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An open ivory book with four outward-pointing jade geometric expansion arrows. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/armor.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/armor.webp / assets/art/v4/icons/passives/armor.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`c98ff89637329db9219aa55d5e96f826318514e08785c0af08f1b90b7b363d52.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`aca9a140de3763e3d36ff3c9309fb2dbb809b267eab59f7aeb01cc0baf51fa50`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A clean ivory construction safety helmet with champagne-gold fittings and a jade protective accent. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/calm.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/calm.webp / assets/art/v4/icons/passives/calm.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`5dced78eab798e670b04559aa2b6c4d599b6d5c3aec097bcb7c6c1044bd8d6c3.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`a5a223ae8a46032707e971f52e4518b9d78bb50ecf211712085656ec940e91ca`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A jade protective shield enclosing a small calm tea cup, balanced academic symbolism; a small round porcelain teacup on a saucer centered on a plain jade shield, no scrolls, no characters, no writing anywhere. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/duration.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/duration.webp / assets/art/v4/icons/passives/duration.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`94fc33b4692b4f0216a4144232944459838c5d41ca01288b160fadc4fbf98ec2.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8c79ab299fe641a7038dcfb4ce002d575e5168de2bac88c159f5e50a42e7e548`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A carefully bound laboratory notebook with a pale blue glass flask and a gold page marker. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/focus.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/focus.webp / assets/art/v4/icons/passives/focus.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`ceee803a1fc78c7416e8e046b44a475a899ff19ec9d69f33278778ec51e932ca.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`5498f083c03812a390d1f5f6cbbd6d42af88b485b77d252937aa8df5248324b7`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A jade optical focus lens over a clean ivory target diagram, precise concentric forms. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/haste.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/haste.webp / assets/art/v4/icons/passives/haste.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`317c361bb6f79f0e29c80162b23565e356e1f3b65da3f7aba7ec5a59782292d0.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`de4ec293ce057f820e71bcdc81d0475004ac502d8e999bb9d1c44e4bb4bcfede`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact champagne-gold alarm clock with ivory hands and a jade morning-light accent. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/health.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/health.webp / assets/art/v4/icons/passives/health.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`194df87a4a5939b05fa1cadd9d2bf5de32d5cdc2da2c2c367ff222766dba24af.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`5a0cea11e4f7331b7468c31a1a2e3ac82d74f85e2e1c3e900ff501a2d49fcb52`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A cozy rolled ivory mattress with a dusty rose pillow and navy fabric straps. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/luck.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/luck.webp / assets/art/v4/icons/passives/luck.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`0ca1eb7026c6c184f505f23ee8c6dc126cb2bf50e0eaba6bf475f838b53461d1.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`c148f4451eee972bbe1f18033ca10427a53e38bead6c9eefac11ace8adfe8eef`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A delicate green four-leaf clover attached to a champagne-gold bookmark. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/magnetism.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/magnetism.webp / assets/art/v4/icons/passives/magnetism.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`b0313c235e9cb1bcf0bfc896cf9e969ea70098a738b494f0fde31a981a407735.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f9906cbfe45ed5df499797c0000297eb78bd9a1f171231455d266f085f39dc43`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A pale blue campus access card with an elegant magnetic ring and ivory chip. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/multi.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/multi.webp / assets/art/v4/icons/passives/multi.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`bc19e67de4b3c6322e0d6a290fc547db143e76f3a2bc0074058a29c8ce9cbe88.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`850de0c75392aae73fb0d6caab9a4686eb7f3b072003cdd989339c2e9368e172`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: Three interlocking ivory and blue academic badges linked by a small jade ribbon; each badge shows only a simple abstract emblem (a star, an open book, a leaf), absolutely no characters, no writing, no buildings. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/night.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/night.webp / assets/art/v4/icons/passives/night.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`470a0b12651833f1dfed8262ea479cb9e2b626d7d77ccaa8b0dafd250e550131.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`65ac89614105dc90d46928bfec6cc73813683ddf74a11be13fc0e7707b75f227`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A navy desk lamp illuminating a crescent-moon bookmark and a late-night notebook. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/push.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/push.webp / assets/art/v4/icons/passives/push.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`a316fde58c8a399734d0b49d2f60b6b328beb21b2bc7374614980b3b9c235d2e.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`dabaa40ccddc0dd7d4e96976209da8fe888a90228ca1d9eff96d3c7a3e660da9`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A sturdy pale blue running shoe beside a small embossed exercise check-in token. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/regen.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/regen.webp / assets/art/v4/icons/passives/regen.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`a3c0e66347694bfe85b0a2d08391b075c268745479ef6ce91bcff63f28d911d9.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`5d37d34e4403388dbe75565e50e4280588474876c7b7f362cec1e797f790012f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A warm ivory meal bowl and a coral campus meal card, comforting polished game-item design. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/speed.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/speed.webp / assets/art/v4/icons/passives/speed.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`b0d9cacb8898b800656c5387651765c95e209b6e466deb019fb7649ebadd4423.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f71db4ebefede6afbde92b67c5809c3b7793aa4538e22a13985eec3fdef9e321`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A fresh espresso cup beside a small jade running-shoe charm, energetic but clean composition. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/thesis.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/thesis.webp / assets/art/v4/icons/passives/thesis.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`51721552c4a167ce25742411fa6ef48581702c8572842700248c871ef4ee7247.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`17ce3122da5fc55ca1d54ddf740da137b13a4bbfe4351cc113438d8c800e3f39`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A prestigious ivory research manuscript tied with a violet ribbon and a small gold seal. Isolated on a plain solid pure white background.

### art-src/ai/icons/passives/xp.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/passives/xp.webp / assets/art/v4/icons/passives/xp.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`6eebe7c02c0a4de2d21802ddf164a4dcecdf39e4805f1ed7b8046a701760375e.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`63f8781aec662b2e5f135db5881439a3c3c70603c66a8cf5f858bd43a1dbb3b7`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An elegant jade library access card with a small embossed open-book emblem. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/bomb.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/bomb.webp / assets/art/v4/icons/pickups/bomb.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`b7238adef2f1b3062e19fe6e044b2f517907437bad35499faf65f4becd5198bb.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`530898b0369dff5f9d5db6d78c155fbb06da381d1b88230f2144d256237f7e3b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A sealed ivory submission envelope wrapped around a small brass impact device, playful academic design. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/coffeeBoost.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/coffeeBoost.webp / assets/art/v4/icons/pickups/coffeeBoost.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`593456b46c9ad0551cbaa58872223083f277b0e2ddf32e09270372b2187f9501.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9e34f5e073c53bfcb430911f9a2230eb98bcf2997ed13ac4aa65c63962a7c005`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A tiny concentrated espresso vial with amber liquid, dark coffee beans and a gold cap. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/energy.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/energy.webp / assets/art/v4/icons/pickups/energy.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`e9b3d2ef948f55ec52691ac48e25a563c19d53327daac73991e337185305cadf.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`b619f6e6af1a948d28f5f03bb9819d3976f44c45aa3b242efa267ce77d1af4e5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A stack of pale jade sticky notes with a small luminous gold inspiration spark. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/freeze.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/freeze.webp / assets/art/v4/icons/pickups/freeze.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`fc95dcfbfdbb4957b02959cd153ff212cd0886b6c4a6a99056573326001f8415.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`3de631e154e7a85d0b174854ab6f9ba184c3f475ecfe0bbbcb9a93b9a6cdb5c4`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An ivory pocket watch enclosed by crisp pale blue ice crystals. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/heal.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/heal.webp / assets/art/v4/icons/pickups/heal.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`911ce19959b3ca7c87dd6444a0f09d11426355671dc8704dc92f3ea736db1d0f.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4db14e4641b052b3fcd8ffdae04958457f76c12b5d255c305413974c06c18a03`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A generic red-and-ivory energy drink can with a simple medical cross, completely unbranded. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/magnet.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/magnet.webp / assets/art/v4/icons/pickups/magnet.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`1a601a0e1b310a8f5090ac1a1f1eeaec6ec191adabc817255b61c2e29679e449.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`82b486d836db1a27e74381e539b4920651db09bd1db42d2ca0b62c310d2b62d5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact violet horseshoe magnet attracting a few tiny jade academic crystals. Isolated on a plain solid pure white background.

### art-src/ai/icons/pickups/shield.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/pickups/shield.webp / assets/art/v4/icons/pickups/shield.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`80ec04b10c97a7a17a6386370e54c7b03b1c66403add2ed7255dbbdf3c244b84.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`84c1bdaf1b11597076fe19588a37e2e4eb58d7a2cdde979c4f4f7d2569276dbe`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A small champagne-gold shield capsule with a bright ivory protective core. Isolated on a plain solid pure white background.

### art-src/ai/icons/relics/assistant.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/relics/assistant.webp / assets/art/v4/icons/relics/assistant.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`ab91bda40a37e27b545c37fe230ef08a4dc8a6852a3015af6391b32c5e7ce267.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`52a85069afce49b0c763100074db0c0da6c35d4d609e022face6ae3167b66de8`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An elegant ivory research-assistant name badge with a small jade robot emblem. Isolated on a plain solid pure white background.

### art-src/ai/icons/relics/clockShard.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/relics/clockShard.webp / assets/art/v4/icons/relics/clockShard.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`93f5606f4ff0daf173e111ff67b8d7c358bb201aea46852cca6016873e237648.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`d48c71f3dd0d0d3903c86fbdf0537e1f7898a7b87ac59f5ac7e0c1003e4da37f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A broken brass clock fragment with an intact ivory hand and a restrained violet reflection. Isolated on a plain solid pure white background.

### art-src/ai/icons/relics/emergency.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/relics/emergency.webp / assets/art/v4/icons/relics/emergency.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`8fa39c0018f067ce03191ac2dfa5610d5c0c9498960e93f1b2c922040d21a1f6.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4a7a5ae31076aa1dbf506ae4376682789c2e65055bc971f5f0e85c0e962832a6`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A sturdy emergency identification badge with a pale gold shield relief and navy strap. Isolated on a plain solid pure white background.

### art-src/ai/icons/relics/obsidian.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/relics/obsidian.webp / assets/art/v4/icons/relics/obsidian.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`8c5f18be2dabd3a359a56378d901175becb00c262bad1e572e46bc91cdd96f60.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4596af9273f87f107ff715e723c8e39dec7533699c7bb0dad45d4d33dfd5825d`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A polished obsidian bookmark with a thin gold edge and a restrained violet glint. Isolated on a plain solid pure white background.

### art-src/ai/icons/relics/redNotebook.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/relics/redNotebook.webp / assets/art/v4/icons/relics/redNotebook.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`5e152223e2eb09d86ee58ba15887471990a7942ebd646597a1a43281f556b86a.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`b8b7cd51800499313e4c2054803899fcfd179318d0b4a6220fbacea598b1275a`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A dark red research notebook with worn gold corners and a single sharp ivory page edge. Isolated on a plain solid pure white background.

### art-src/ai/icons/relics/scholarship.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/relics/scholarship.webp / assets/art/v4/icons/relics/scholarship.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`9cba832b1ec6260f647f33b25c8e04e19bb0765a57671e89759fa8a9b1e196cd.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8548f8d3a2fd8963dcbf26f349d977983af49f290e3fe9deab06332552342bd8`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A prestigious champagne-gold scholarship medal with an ivory academic cap relief. Isolated on a plain solid pure white background.

### art-src/ai/icons/ultimates/barrier.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/ultimates/barrier.webp / assets/art/v4/icons/ultimates/barrier.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`d3baf67e9433b35c30017b2b0c616843526098cb4de580c4afe40ec3dea5f1c3.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`ae71e5063a900b73865d530167310960272360c659b15613dfa58e213ef45ce5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A pale blue architectural blueprint dome supported by gold structural ribs. Isolated on a plain solid pure white background.

### art-src/ai/icons/ultimates/conference.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/ultimates/conference.webp / assets/art/v4/icons/ultimates/conference.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`7bfeade802febd8691b689cc564a88503b845810e107bff913bed8030a629215.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`0a6f8058dfb620ec4bb5098eeb17756d4e4252af1d784cbe2b37d8a9a5311a96`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An elegant ivory conference microphone with concentric dusty rose communication rings. Isolated on a plain solid pure white background.

### art-src/ai/icons/ultimates/lastMinute.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/ultimates/lastMinute.webp / assets/art/v4/icons/ultimates/lastMinute.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`19d0ade792ebbd6170e218a8c7dd5caa9b67d612ec6eba1be45bde4c0162e3d1.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`dde2d7cf5ab7162db2d408164eda1b1815788bc6867f77a239ddf7b5091bf53b`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A precise ivory clock face enclosed by pale blue mathematical construction rings. Isolated on a plain solid pure white background.

### art-src/ai/icons/ultimates/overload.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/ultimates/overload.webp / assets/art/v4/icons/ultimates/overload.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`5bb9e13d3e3ff6f10f4fe19a2638206a7ff9f7b12d1ff8cb3e68cebb98223e1f.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4dc0b74894ec21bfd9001d35dfe65c7fe8580b13342bfd97b21ea4aad8dc81d7`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact laboratory reactor with icy blue glass chambers and a controlled bright energy core. Isolated on a plain solid pure white background.

### art-src/ai/icons/ultimates/parallel.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/ultimates/parallel.webp / assets/art/v4/icons/ultimates/parallel.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`a354eaf3eba0c23c5a4021a819c1b619e63808aa2aa9c5a5c720edc080c2abf8.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`0ab21ea07a1a52e296289e9279aa89c87d7ee54cbb6599aacd3d092c8ab5f337`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: Six small ivory assistant robots arranged around a jade central presentation terminal. Isolated on a plain solid pure white background.

### art-src/ai/icons/ultimates/submission.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/ultimates/submission.webp / assets/art/v4/icons/ultimates/submission.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`d21dffe72810b6668c44772e41e5c442a175913cbc5b2ce6f0454c2f28f33578.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`e55d495fe6723d7133f5f751f04896c1a80630138b3a71d88f4a5b2d29b8d6f9`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A dramatic fan of sealed research envelopes converging on a large round jade academic seal whose face is plain and smooth, no characters. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/blueprint.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/blueprint.webp / assets/art/v4/icons/weapons/blueprint.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`5cd4e8058a9749d0f030d044907d591eb837f6642ec504342729765cb5aaff30.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`245dab98b469218d328be1d922d01ebf3a002dcc0b6f2d607b7161ea64506569`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact deployable blueprint turret made of folded blue plans and polished surveying hardware. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/bot.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/bot.webp / assets/art/v4/icons/weapons/bot.png / assets/art/v4/fx/robot.webp`

处理：Lanczos resize; WebP encoding；Reused weapon icon, alpha trimmed and resized for battle projectile; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`f4a9f5ce8811cb41d425477910e6846079ae2ea2e38c0af3b0546fda3f33dced.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`c7b4a269b58cf0a52861d2b39f5e670ffb355e6afa0022ffc967c50bdef5f30f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A friendly compact academic assistant robot with ivory casing, jade eyes and a small gold antenna. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/brick.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/brick.webp / assets/art/v4/icons/weapons/brick.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`435b42a46448ccea2d93211427a18263f5df09f9309cf57f270045c2132ea7b4.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`ccce87b12544ba699156e5d9ad561f3807d78cdb635bdcc30bfd4c511da378d5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A small architectural model brick assembly with warm terracotta surfaces and clean ivory mortar lines: a compact chunky cluster of six interlocking modern rectangular terracotta model bricks stacked like a tiny abstract modern wall fragment, no roofs, no doors, no signage, no lanterns. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/broadcast.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/broadcast.webp / assets/art/v4/icons/weapons/broadcast.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`680646614c07f36b8d815aa313ffa182474882f64aa0470836d802bdc674eb55.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`193df2b45f27612c6a48ecc1d2a9f73113ec3c48642f4fd0e9de95847a2f2cad`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A vintage campus loudspeaker in ivory enamel and navy metal, with restrained coral sound arcs. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/code.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/code.webp / assets/art/v4/icons/weapons/code.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`0c13a8d30d6042d3214056785c253514fc5143dcf92717493e0bc5cab08c5596.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8bba926188e9f99ec3d929d3deadbebaf12a9db51b05e3490b6c4a852ae6ad80`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact blue code module with abstract bracket shapes, glass surfaces and a luminous jade core. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/coffee.png

署名：用户提供 / 未提供。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/coffee.webp / assets/art/v4/icons/weapons/coffee.png`

处理：Lanczos resize; WebP encoding。

生成工具：未提供；生成日期：未提供；参考：未提供；源文件：`未提供`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`fa3127626d72dc8ff9ba769b7f1b5bcaec15472e3a2808bce95898ceb39e1bd9`。

完整原始提示词：

未提供

### art-src/ai/icons/weapons/cryo.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/cryo.webp / assets/art/v4/icons/weapons/cryo.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`d20113527d8a5a6dd48a131065a0c4309bbac12da7de76e63ea019e648ef529a.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`64389674bdef35f62b398ebcf76e9d11c6e55c169a873d0ec93ce5b6c9453f07`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact brushed-metal liquid nitrogen canister with pale blue frost and a short insulated nozzle. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/eraser.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/eraser.webp / assets/art/v4/icons/weapons/eraser.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`b0228a9a69a602cbdadd2920fc49790b554c536203c992c654c9e3cf5b267eb0.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f4e2a09b8f674346a599345aa1e43c3fe69a66ff64cb3756dafc36076c1e5012`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A large ivory and dusty rose eraser with a crisp erased-paper curl and soft chalk dust. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/keyboard.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/keyboard.webp / assets/art/v4/icons/weapons/keyboard.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`0c09dfb5ca4fe4e1fafbc2e519277bad3530e824f99451c1c85634ca4cb64324.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4834cc78d597e8fc63f2d7f253a607b5c857dab7dba68a1eb6c41b66ba5d7013`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A compact navy mechanical keyboard with raised ivory keycaps and restrained violet highlights, a short compact chunky block of about twelve oversized blank keycaps with absolutely no letters, symbols or legends. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/knife.png

署名：用户提供 / 未提供。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/knife.webp / assets/art/v4/icons/weapons/knife.png / assets/art/v4/fx/paper-blade.webp`

处理：Lanczos resize; WebP encoding；Reused weapon icon, alpha trimmed and resized for battle projectile; WebP。

生成工具：未提供；生成日期：未提供；参考：未提供；源文件：`未提供`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`c77af4eb17f56e0dffd612be91bf1e294d2708eaf3917e74606d9ed9e361759b`。

完整原始提示词：

未提供

### art-src/ai/icons/weapons/laser.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/laser.webp / assets/art/v4/icons/weapons/laser.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`0eaa2105c21efdc85e3c74dc17142fcae7233cb109c6eb766d00080e9f784ec9.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f9b9ff6db5da06ea42617e33a0429e6ee3e3d91a7518955572bdf4900d3be673`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A precision champagne-gold presentation laser pointer emitting a short focused golden beam. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/lightning.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/lightning.webp / assets/art/v4/icons/weapons/lightning.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`c05c4f1fe5d622393f8b33669728c8bf28454beff07c97cf95c9d2fb6078f405.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8ed39bcfa6c568eb9b1635114b076c102c755fb983d5818abd18e6cd995836da`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A violet debugging probe surrounded by a small crisp branching electric arc. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/mentor.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/mentor.webp / assets/art/v4/icons/weapons/mentor.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`3e89df1af314e3b360c4a2d0b1c57b54031cf8e615b6acea4b6fe889a9d7c54a.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`990082507235fbbb8d46446856e57611a0ac348ebca0920d992a468b24a20a08`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An elegant recommendation letter with a champagne-gold academic seal and an ivory envelope. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/mine.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/mine.webp / assets/art/v4/icons/weapons/mine.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`18c4a2f4ff9b1fddbd8ab090d108bc556108f902a0dfdea7fc907424127fb1e7.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`a95acb0760704df3b6b28c5337d05c4773857fc6b382735a10db98bd7e4302d1`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A polished brass drafting compass opened above a restrained geometric construction diagram. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/orbit.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/orbit.webp / assets/art/v4/icons/weapons/orbit.png / assets/art/v4/fx/book.webp`

处理：Lanczos resize; WebP encoding；Reused weapon icon, alpha trimmed and resized for battle projectile; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`ac6e02385902a93ffdc7a869429af3dbcb33f524cebcca0d2d34bf2fc55501c9.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`94fdad8430be40bc375941a1578f04fdc2fa85001a4a39ed3b3485fa41325b35`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An open academic journal with layered ivory pages, a jade hard cover and a gold bookmark. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/ppt.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/ppt.webp / assets/art/v4/icons/weapons/ppt.png / assets/art/v4/fx/slides.webp`

处理：Lanczos resize; WebP encoding；Reused weapon icon, alpha trimmed and resized for battle projectile; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`96fdc635f1895ad18cf9e142e36eb75ba3e430c51ca9a61b8173f43d89fce95e.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9a600ee774d7138707d6367de767fa63b58853215c094ffe722403cdb6b17b89`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A stack of coral presentation slides with simple abstract charts and polished paper edges. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/prism.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/prism.webp / assets/art/v4/icons/weapons/prism.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`345605814461b2bea806a378cd6f64fc0ad2f54b39b5afb45e175d0339ced694.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`a1e4ac7d6af633bc1f83edb76c86f37301a694540cbd6376c5f97d40b17ee89a`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A precision brass and navy surveying theodolite with a luminous glass prism. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/rain.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/rain.webp / assets/art/v4/icons/weapons/rain.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`c91489076686a5841e25083313c509af88108c0fca2a6f59158bdc586ff43d57.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`10484bbfd61b8469aeedd82f140c971d58f905f90f7221fccf0cc657380d1357`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A dramatic stack of ivory research papers descending like a small comet, with pale blue motion accents. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/ruler.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/ruler.webp / assets/art/v4/icons/weapons/ruler.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`c195268997fae4a8711baaa6a105f53251aab6ede83606d9172b97a7438f4fe8.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`fed79b04054af41485c00427ae7ca2ba8fbd7d65993b58bcf2954732d72ab32d`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A substantial architectural T-square ruler made of brushed metal and translucent pale blue acrylic. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/shuttle.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/shuttle.webp / assets/art/v4/icons/weapons/shuttle.png / assets/art/v4/fx/shuttle.webp`

处理：Lanczos resize; WebP encoding；Reused weapon icon, alpha trimmed and resized for battle projectile; WebP。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`223bc2c7889ec043872c911f00feb1cb89b4f9a50ada27adc87b0d1b3e2f9df1.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`f3d9b350eefa89eda7a12bd61469f07e2587275d8fb2f218c58f76e42a97064f`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: An elegant white shuttlecock with individually readable feathers and a champagne-gold cork base. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/staple.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/staple.webp / assets/art/v4/icons/weapons/staple.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`8ab9741082940ef051b0dcf4f3092b8234966f611faf66703180d461cbf79213.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`a21a8b239c2ab2476494fdfea58def27a29b18bf92b5ac4257ec0b1485e5e2d9`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A heavy navy metal stapler with visible silver staples and a clean industrial silhouette. Use the reference image only for painting style, palette and rendering quality; the object itself must be entirely different from the reference object. Isolated on a plain solid pure white background.

### art-src/ai/icons/weapons/wifi.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/icons/weapons/wifi.webp / assets/art/v4/icons/weapons/wifi.png`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`6e3b4dceb10b22efe7598fb19fd3559d9085a5dba1089977c82cd0b17c579d94.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`52d523331c86fe5e05da5fcc2d1e0454d5e1847c24fae7a08bc0f790afa10e7d`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Single collectible game item icon, three-quarter view, large central silhouette occupying about 75 percent of the canvas, readable at 48 pixels, no frame, no ground shadow. Subject: A jade campus network transmitter with three clean concentric signal arcs, shaped as a small upright router tower with a short antenna mast, clearly electronic, not a cup. Isolated on a plain solid pure white background.

### art-src/ai/landmarks/canteen.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/landmarks/canteen.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`e9d91c30c169296016e6f20b3e5bd91e87afd37300c285fe42b6367047be0469.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`20210f7a6b9e78e3ed4c2f5a8d39bdb4c818d425ea9a17fd9352c85c7a4d8fb9`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Top-down orthographic ground decoration for an existing modern campus landmark, sparse center for gameplay visibility, no text. Subject: A warm campus courtyard floor with sparse terracotta paving details and a clean open center. Modern campus setting with only contemporary elements such as modern benches, planters and slim lamp posts; no pavilions, lanterns, gates or traditional roofs. Isolated on a plain solid pure white background.

### art-src/ai/landmarks/garden.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/landmarks/garden.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`208e1efe4312891346e212af2fc294bae79f40f3c43e3cb23461202bb556a2bd.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`89dec67e930d36ba5eafbd81f54299c901b8e4794aadedd9887def4d8f53b67e`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Top-down orthographic ground decoration for an existing modern campus landmark, sparse center for gameplay visibility, no text. Subject: A quiet violet-and-jade reading garden ground decoration with low plants around a clear central space. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/landmarks/lab.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/landmarks/lab.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`01d6c741d85df13caa312a15d745ea6850982a0b533a12175ec5ff82719ea75f.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`8f2a70b2284d3fadadbc1e6fc91f82df8e3a135737330ffbdfc8f9447af4623e`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Top-down orthographic ground decoration for an existing modern campus landmark, sparse center for gameplay visibility, no text. Subject: A pale blue laboratory courtyard decal with subtle measurement markings and a few restrained scientific details. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/landmarks/library.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/landmarks/library.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`8b2279fc7c6e27dd659ab8413e2d5a553e991941b377b0c5b617f68642baf1b9.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`6b3e0f667aa913f04f0ef63e3f31a3f94600b17192a3e74dae541de6bc97b463`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Top-down orthographic ground decoration for an existing modern campus landmark, sparse center for gameplay visibility, no text. Subject: A quiet circular reading lawn with a few low book-themed stone details and an open central grass area. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/landmarks/track.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/landmarks/track.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`0147e7d39185ca08cd0dae0fa5febd484ba095d5100ec961378925daf549cec0.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`923985f106bed19e37a63ef2f21d391342bf6b093368bdbc3cab0de4c0bf5da8`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Top-down orthographic ground decoration for an existing modern campus landmark, sparse center for gameplay visibility, no text. Subject: A clean oval terracotta running-track ground illustration with ivory lane markings and a jade inner field. Modern campus setting with only contemporary elements such as modern benches, planters and slim lamp posts; no pavilions, lanterns, gates or traditional roofs. Isolated on a plain solid pure white background.

### art-src/ai/landmarks/workshop.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/landmarks/workshop.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`5a7b76dc51a1f1a8e23ad0b48be5a45789f0e9503c16631bf7409f21cfbad5cc.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`7ca09d45a65d6ddaa8d527d87b3d543998c7709eaf6d270de747ad20d9a89f19`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Top-down orthographic ground decoration for an existing modern campus landmark, sparse center for gameplay visibility, no text. Subject: A small architectural workshop ground arrangement with sparse model-making tools around the perimeter. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/props/bench.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/props/bench.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`ea1a2ec9c26321a30fcf835336824b2d11f2b4bde4731da82af115700cd50b45.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`0c8de3824f76ed6ae9df0b282d957e58dfb1d26f3c370ae021b457334a7a3a77`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: An elegant campus bench made of warm wood and dark navy metal, top-down three-quarter orthographic view. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/props/planter.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/props/planter.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`3ab0ffaf8b7427962cf1d73061483b23a2d2dc99ded7d7446a34e2bb3bc20e45.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`9d0122a51f46221ad4a98a0a39aa1b7c4942b9c958d5c4850574fdab61c4995d`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: A low ivory campus planter with sparse jade foliage, compact orthographic three-quarter silhouette. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/props/tree.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/props/tree.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`693872fca60d8c253321436e6072f7b64ea2249e972b8694bee30956bf974c20.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`e8fdf90068a6c0c4a9237e81eb8b0e3e2eff03adf13c7596076f3cad4579863c`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: A single standalone compact leafy university courtyard tree only, no ground platform, no paving and no surrounding structures, jade canopy, simple readable trunk, top-down three-quarter orthographic view, no ground shadow. Modern campus setting. Isolated on a plain solid pure white background.

### art-src/ai/textures/grass.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/textures/grass.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`45834c30d5508aad6b74251fcdc42664172aa4f647daa58d446cf70343bb7583.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`2755d0f37f1b8bd3686f110dd80f18dae70e36fb514213b3adb4c411621953c0`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Seamless tileable material texture, evenly lit, no directional shadow, no objects, no vignette, flat top-down view filling the entire square. Subject: Soft hand-painted jade green campus lawn grass with full even green coverage and no bare ground patches, low contrast and sparse detail for clear gameplay visibility.

### art-src/ai/textures/metal.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/textures/metal.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`1206524892ea8fcf9df3956e0fe2d0068f510faa8f1048ee53c5674ff9be9500.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`116cbccfd398a8d601ea4f78c184565a774fc44ff1e6c071423b93465f5cde3d`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Seamless tileable material texture, evenly lit, no directional shadow, no objects, no vignette, flat top-down view filling the entire square. Subject: Clean dark navy brushed metal with extremely subtle fine grain, restrained premium finish.

### art-src/ai/textures/paper.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/textures/paper.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`e8978088d1a698b56f00ae596abb732e8543712fd68868159c8cbbe97bc06829.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`04153e19af0a04ca794403ca399d694a013aeb5aff97ad548450baed33eb9715`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Seamless tileable material texture, evenly lit, no directional shadow, no objects, no vignette, flat top-down view filling the entire square. Subject: Fine clean ivory academic paper with subtle natural fibers, very low contrast.

### art-src/ai/textures/paving.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/textures/paving.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`18e784cadd66a29ef8a86410369c97a8676430c6ad3f4f3b9ea01dd73661f6b9.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`308f1c1518c702688d37fe01f09eec2f3291058e8e1ee78ece9694f9a81fdcaa`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Seamless tileable material texture, evenly lit, no directional shadow, no objects, no vignette, flat top-down view filling the entire square. Subject: Clean warm ivory campus paving stones with subtle joints and restrained wear.

### art-src/ai/ui/academic-crest.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/academic-crest.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`2aedbb0e5f3c5422ce7b6a4d99319c455da543a5271cf14992c784fabd1e6185.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`b14a58e96fdf7b15946b5f1c5432e4804a48db60ab6262e1bef15a8897f44717`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: An original academic crest combining an open book, architectural compass and a small jade leaf, elegant champagne-gold metal. Isolated on a plain solid pure white background.

### art-src/ai/ui/chest-closed.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/chest-closed.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`ca3706104ab52b9d263d3c2207fa531117fcb9ae3c042249ee193c966991c1fe.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`49cd33e4a268498f273621f9342f257239cafff3b41cc2dedb5797d24d5d9b61`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: A closed premium academic supply chest made of navy enamel, warm brass fittings and ivory book-like panels, three-quarter view. Isolated on a plain solid pure white background.

### art-src/ai/ui/chest-open.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/chest-open.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`7e47364cf9b450b96233a261e2f801cf6aa8431ff724f46c60f51116c1b97917.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`5f7a0bf282a6b79142dda7fcdd3107978d0aa8cd1278eae9cab385eb3e485b69`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: The exact same approved academic supply chest with its lid open, empty readable interior, matching camera and proportions, no baked glow. Isolated on a plain solid pure white background.

### art-src/ai/ui/gold-ornament.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/gold-ornament.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`d32c9f841d4490a8927bb12cd30fb73a80387fa0b6e6351daa28054ac9fb916a.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`2df1a9542b3a47f7a7d927c2094ef32cb23dd8903377155230b600a81b224518`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: Four separate minimalist L-shaped corner ornaments of fine champagne-gold metal lines with subtle layered book-page edges, generous spacing, no pictorial scenes, no buildings, no medallions. Isolated on a plain solid pure white background.

### art-src/ai/ui/menu-campus-portrait.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/menu-campus-portrait.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：approved style master；源文件：`758f443a3a7f9a951d904f3efa9ed8f26c0b718345ee3bec4b011ff11328c487.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`345777725561b76c455503f829b410e51ec71ef9b01b45a94965b356b621aff5`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: A vertical modern Chinese university campus with contemporary glass-and-stone teaching buildings and a library, no pagodas or ancient roofs, illustration at blue hour, calm darker sky at the top, architecture concentrated in the upper and lower thirds, calm central area reserved for a game interface. Use the reference image only for painting style, palette and mood.

### art-src/ai/ui/menu-campus.png

署名：用户提供 / 未提供。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/menu-campus.webp`

处理：Lanczos resize; WebP encoding。

生成工具：未提供；生成日期：未提供；参考：未提供；源文件：`未提供`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`6f45a1ddd7a55929e79b6842545a649aa07021bdab32cec0dbfea7765cd9434e`。

完整原始提示词：

未提供

### art-src/ai/ui/result-defeat.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/result-defeat.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`3dcf94c67a3e0b28ed8d42342fd129fb4e42bbb143632088e00832ff456ab708.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`4c375fcdf0b0eb9d80974ced5b9e609fab9a56f55f4be0a0a2e02447c6375747`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: A peaceful university campus after rain, warm library windows and soft jade reflections, reflective but encouraging mood, quiet central area for a results panel. Modern contemporary glass-and-stone campus buildings only, no pagodas or ancient roofs.

### art-src/ai/ui/result-victory.png

署名：用户提供 / Grok Bot GenerateImage。许可：用户提供素材；元数据未提供独立许可证。

运行时文件：`assets/art/v4/ui/result-victory.webp`

处理：Lanczos resize; WebP encoding。

生成工具：Grok Bot GenerateImage；生成日期：2026-10-30；参考：none；源文件：`1f17c676647b45249c82d835721d88c7fe3277716bbdc643e53f7599a4cd7966.jpg`。

批准版本：未提供；以本记录 SHA-256 固定源文件版本。SHA-256：`78f1c3fd830727e5802802454995cbd7ad84da01ab87896f5209bc688181ca22`。

完整原始提示词：

Premium hand-painted 2.5D illustration for a whimsical Chinese university survival game. Cohesive ivory, ink navy, jade and champagne-gold palette, crisp readable silhouette, clean beveled materials, soft upper-left lighting, restrained surface texture, polished high-end game art. No words, no logos, no watermark. Subject: A hopeful university campus at sunrise with a few floating ivory paper sheets, quiet open central sky area reserved for a results panel, no drawn panels, frames or signs. Modern contemporary glass-and-stone campus buildings only, no pagodas or ancient roofs.

