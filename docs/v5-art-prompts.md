# v5 首章AI美术提示词与替换约定

使用内置 image_gen，真实透明PNG；共12张独立母图。原始输出留在 art-src/s2/raw，规范母图在 art-src/s2/masters。模型标识供应方未暴露，账本如实记录，AI来源不宣称CC0。派生运行图、缩略图和白闪不计新增母图。

样片门：先完成 enemy-bike / item-drone / building-smart-teaching，游戏截图 docs/v5-p18-sample.png 已确认后才生成其余九张。

## enemy-bike

- 用途：enemy；内容ID：s2:bike
- 规范母图：art-src/s2/masters/enemy-bike.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One compact modern university electric cargo bicycle, jade-teal frame, two dark rubber wheels, small ivory insulated parcel box on rear rack with a plain gold fastening strap; no rider. Three-quarter elevated top-down angle, facing lower right. Mechanically plausible and visibly a bicycle, strong wheel/frame silhouette. Gameplay use: ordinary enemy, final display about48px.
Output: single transparent PNG master, generous clean alpha margin.
```

## item-drone

- 用途：item；内容ID：s2:drone
- 规范母图：art-src/s2/masters/item-drone.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One small research quadcopter drone: ivory body, navy structural frame, four jade rotor housings, small camera lens and gold battery clasp. Four clear rotors and no weapons. Three-quarter elevated top-down angle. Gameplay use: inventory icon96/192px and small summon sprite.
Output: single transparent PNG master, generous clean alpha margin.
```

## building-smart-teaching

- 用途：building；内容ID：s2:glassLink、s2:networkHub
- 规范母图：art-src/s2/masters/building-smart-teaching.png；长边1536px；透明PNG；锚点[0.5, 0.82]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One wide, low modern university smart teaching building with a glass connecting corridor, flat light sandstone roof, white structural pillars, blue-gray glazing, jade door panels, subtle warm facade accents. Long rectangular massing, main entry visible on front bottom edge, roof clearly seen. No trees obscuring the building footprint. Isolated architecture cutout; no surrounding terrain or paving. Gentle overhead architectural game view, NOT a tall isometric tower. Approximately2:1 landscape composition, intended1536px master.
Output: single transparent PNG master, generous clean alpha margin.
```

## enemy-reservation

- 用途：enemy；内容ID：s2:reservation
- 规范母图：art-src/s2/masters/enemy-reservation.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One freestanding modern campus seat-booking kiosk: compact navy A-frame stand with ivory display housing, a jade blank screen showing only a simple clock-like pictogram with no numerals, small gold lower shelf. Elevated top-down angle, clearly a solid physical campus sign. Ordinary enemy about48px.
Output: single transparent PNG master, generous clean alpha margin.
```

## enemy-parceler

- 用途：enemy；内容ID：s2:parceler
- 规范母图：art-src/s2/masters/enemy-parceler.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One friendly stylized university logistics delivery worker, full body visible, jade work jacket and navy trousers, plain ivory cap, carrying one taped cardboard parcel across the torso. Small chibi proportions consistent with a hand-painted campus survival game, face very simple, no branding. Elevated top-down angle. Ordinary enemy about48px.
Output: single transparent PNG master, generous clean alpha margin.
```

## enemy-dispatcher

- 用途：enemy；内容ID：s2:dispatcher
- 规范母图：art-src/s2/masters/enemy-dispatcher.png；长边1024px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One campus outdoor logistics dispatcher mini-boss: a sturdy blue-gray wheeled dispatch cart with ivory console, jade control screen, two compact parcel stacks held by gold straps and a small physical antenna. No driver, no writing, no holographic rings or arrows. Readable broad silhouette and obvious wheels. Elevated top-down view, final display about110px.
Output: single transparent PNG master, generous clean alpha margin.
```

## enemy-proposal-board

- 用途：enemy；内容ID：s2:proposalBoard
- 规范母图：art-src/s2/masters/enemy-proposal-board.png；长边1024px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One modern university joint-topic review board boss: wide physical navy mobile display on two solid support feet, ivory panel subdivided into three small project-diagram cards with only abstract lines and blocks, muted jade screens, gold structural trim and small side clipboards. No text, faces, arrows, warning patterns or frame UI. Elevated top-down angle. Clearly a campus review apparatus, not a fantasy monster. Final display about140px.
Output: single transparent PNG master, generous clean alpha margin.
```

## item-whiteboard

- 用途：item；内容ID：s2:whiteboard
- 规范母图：art-src/s2/masters/item-whiteboard.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One compact portable academic whiteboard tilted gently in perspective, ivory writing surface, navy thin frame, jade marker clipped to lower tray and two gold magnets. A few short pale mint mathematical line segments without letters, symbols, arrows or text. Clear recognizable whiteboard icon, no background. Final display96/192px.
Output: single transparent PNG master, generous clean alpha margin.
```

## item-drone-evolved

- 用途：item；内容ID：s2:drone:evolved
- 规范母图：art-src/s2/masters/item-drone-evolved.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One coordinated research drone swarm icon consisting of three small quadcopters in a compact triangular grouping, same ivory bodies, navy frames, jade rotors and gold battery clasps as a university research drone. Small connecting mint cables or short line segments only, no enclosing ring, no arrows, no magical glow. Final display96/192px.
Output: single transparent PNG master, generous clean alpha margin.
```

## item-whiteboard-evolved

- 用途：item；内容ID：s2:whiteboard:evolved
- 规范母图：art-src/s2/masters/item-whiteboard-evolved.png；长边512px；透明PNG；锚点[0.5, 0.5]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One joint academic review matrix icon made of two small overlapping physical ivory whiteboards with navy frames, jade marker trays and restrained gold clips. Thin mint intersecting chalk line segments on surfaces without letters, numerals, equations, arrows or text. Clear compact silhouette. Final display96/192px.
Output: single transparent PNG master, generous clean alpha margin.
```

## landmark-infirmary

- 用途：landmark；内容ID：s2:infirmary
- 规范母图：art-src/s2/masters/landmark-infirmary.png；长边768px；透明PNG；锚点[0.5, 0.82]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One small modern university medical first-aid station: ivory-and-jade freestanding cabinet kiosk with a simple green medical plus pictogram, navy lower plinth, a small supply drawer and no lettering. No red-cross emblem, no people, no background. Elevated top-down view, physical cabinet with grounded short shadow. Final display72px.
Output: single transparent PNG master, generous clean alpha margin.
```

## landmark-joint-table

- 用途：landmark；内容ID：s2:jointTable
- 规范母图：art-src/s2/masters/landmark-joint-table.png；长边768px；透明PNG；锚点[0.5, 0.82]。
- 风格、透明背景和负面要求均含在下面的完整生成提示词中。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One modern university joint-project contract desk: small ivory tabletop with navy legs, a jade closed project folder and a gold paper clip with a small blue-gray display tablet. No lettering, no glowing symbols, no people, no surroundings. Elevated top-down view with clearly visible work surface and short grounded shadow. Final display72px.
Output: single transparent PNG master, generous clean alpha margin.
```

## 重新导入与来源

外部重新生成后，将原图放到 art-src/s2/raw/<key>.png，更新 generation-sources.json 中模型/日期/提示词及 spec.json 对应提示词，运行 python3 scripts/build-s2-art.py。管线会裁切透明边、规范留白、重建图集与双格式、重新计算SHA-256与署名。禁止只换文件而保留旧来源哈希。

本阶段无程序占位母图；P19范围的其余S2敌人、道具、两个新区及修约/复习地标仍使用明确的现有程序回退，不冒充本阶段已完成美术。

# P19 余下30张独立母图（沿用P18已认可风格）

原12条完整提示词及样片保留，增加P18同类母图作为图像风格参考；封面为不透明横图，其余真实透明。

## enemy-peer

- 用途：enemy；内容ID：s2:peer
- 规范母图：art-src/s2/masters/enemy-peer.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/enemy-parceler.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One compact peer-review student group represented by two university students in ivory shirts and navy trousers holding jade project folders, simple faces, full bodies, clear separate silhouettes. Final display about48px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/enemy-parceler.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly. Match the same small chibi body proportions, simple face, head/body ratio and padded full-body silhouette of the reference character; no tall realistic anime proportions.
```

## enemy-relay

- 用途：enemy；内容ID：s2:relay
- 规范母图：art-src/s2/masters/enemy-relay.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One university data synchronizer machine: squat navy wheeled pedestal, jade server cylinder, ivory casing, two small physical antennae and restrained gold cable connectors. No radio rings. Final display56px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## enemy-recycler

- 用途：enemy；内容ID：s2:recycler
- 规范母图：art-src/s2/masters/enemy-recycler.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One modern campus recycling robot: chunky jade and ivory metal bin on two tank-like rubber tracks, navy hinged lid and a small mechanical pickup arm, no logos. Final display56px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## enemy-marshal

- 用途：enemy；内容ID：s2:marshal
- 规范母图：art-src/s2/masters/enemy-marshal.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/enemy-parceler.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One campus exhibition marshal, full body in navy jacket over ivory shirt with jade armband and a plain gold clipboard. Simple face, no whistle arrows or warning graphics. Final display64px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/enemy-parceler.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly. Match the same small chibi body proportions, simple face, head/body ratio and padded full-body silhouette of the reference character; no tall realistic anime proportions.
```

## enemy-coordinator

- 用途：enemy；内容ID：s2:coordinator
- 规范母图：art-src/s2/masters/enemy-coordinator.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/enemy-parceler.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One university project coordinator, full body with ivory lab jacket, jade scarf, navy trousers, holding a small physical tablet and a clipped stack of project papers. Simple face, no lettering. Final display64px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/enemy-parceler.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly. Match the same small chibi body proportions, simple face, head/body ratio and padded full-body silhouette of the reference character; no tall realistic anime proportions.
```

## enemy-auditor

- 用途：enemy；内容ID：s2:auditor
- 规范母图：art-src/s2/masters/enemy-auditor.png；长边1024px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One joint university acceptance-review inspector mini-boss: imposing navy rolling inspection trolley with ivory instrument case, jade sensor head and two gold mechanical measuring arms. Clearly modern physical campus equipment. Final display110px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## enemy-project-review

- 用途：enemy；内容ID：s2:projectReview
- 规范母图：art-src/s2/masters/enemy-project-review.png；长边1024px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One university midterm project review boss: broad three-panel navy display apparatus on ivory steel feet, central jade physical monitor and two smaller ivory side panels with abstract nontext diagrams, restrained gold binder clips. Final display150px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## enemy-expo-final

- 用途：enemy；内容ID：s2:expoFinal
- 规范母图：art-src/s2/masters/enemy-expo-final.png；长边1024px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One graduation project exhibition boss: monumental modern campus display pavilion apparatus, three ivory and navy panels with jade glass, gold structural braces and a compact central physical scale model of a university building on a sturdy rolling plinth. Three clearly readable modules, no people or lettering. Final display170px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## enemy-relay-node

- 用途：enemy；内容ID：s2:relayNode
- 规范母图：art-src/s2/masters/enemy-relay-node.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One compact joint-testing terminal: ivory server cabinet on short navy feet, jade inset screen and restrained gold cable sockets. Physical grounded equipment, no text or warning icons. Final display50px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## enemy-review-panel

- 用途：enemy；内容ID：s2:reviewPanel
- 规范母图：art-src/s2/masters/enemy-review-panel.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One mobile academic review screen: tall ivory rectangular screen in navy frame on two small wheels, jade abstract nontext project shapes and small gold top clip. Final display58px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-spool

- 用途：item；内容ID：s2:spool
- 规范母图：art-src/s2/masters/item-spool.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One university optical fiber cable spool: navy circular reel, neatly wound jade cable, gold connector tip, ivory handle, compact clear inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-printer

- 用途：item；内容ID：s2:printer
- 规范母图：art-src/s2/masters/item-printer.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One handheld3D printing pen with ivory body, navy grip, jade nozzle and a short physical jade filament curl. No glowing effects. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-spool-evolved

- 用途：item；内容ID：s2:spool:evolved
- 规范母图：art-src/s2/masters/item-spool-evolved.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One campus fiber network kit icon: two compact navy cable reels linked by short jade physical cables with gold connectors and an ivory router. No enclosing UI rings. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-printer-evolved

- 用途：item；内容ID：s2:printer:evolved
- 规范母图：art-src/s2/masters/item-printer-evolved.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One digital modeling kit icon: three ivory and jade3D printing pens arranged around a small physical navy architectural lattice model, restrained gold nozzles. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-field-hub

- 用途：item；内容ID：s2:fieldHub
- 规范母图：art-src/s2/masters/item-field-hub.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One field collaboration station icon: a small ivory project table with jade research quadcopter and compact navy blueprint model turret, gold fasteners. Modern physical apparatus. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-holo-review

- 用途：item；内容ID：s2:holoReview
- 规范母图：art-src/s2/masters/item-holo-review.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One modern academic projection review array icon: ivory portable whiteboard with navy stand beside a compact jade projector, faint mint abstract line segments on the physical board. No magical hologram or glow. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-digital-twin

- 用途：item；内容ID：s2:digitalTwin
- 规范母图：art-src/s2/masters/item-digital-twin.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One digital twin experiment bench icon: small navy laboratory platform holding an ivory architectural lattice model and a neatly coiled jade cable with gold connectors. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-battery

- 用途：item；内容ID：s2:battery
- 规范母图：art-src/s2/masters/item-battery.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One spare university research battery pack: ivory rectangular case, navy end caps, two gold terminals and jade inset charge window without letters or numerals. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-protocol

- 用途：item；内容ID：s2:protocol
- 规范母图：art-src/s2/masters/item-protocol.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One academic protocol manual: closed navy hardcover notebook, jade cloth spine, gold page edges, ivory bookmark and plain unlettered cover. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-harness

- 用途：item；内容ID：s2:harness
- 规范母图：art-src/s2/masters/item-harness.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One mobility equipment harness: navy padded shoulder straps and jade woven belts with ivory backplate and restrained gold buckles, no wearer. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-echo-chip

- 用途：item；内容ID：s2:echoChip
- 规范母图：art-src/s2/masters/item-echo-chip.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One research echo circuit chip: jade square circuit board, navy central processor, gold contacts and a few fine ivory circuit traces. No text or glow. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-route-permit

- 用途：item；内容ID：s2:routePermit
- 规范母图：art-src/s2/masters/item-route-permit.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One campus field access permit: ivory physical card inside navy holder with jade lanyard and gold metal clip, only a small abstract campus building pictogram and no letters. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-buffer-badge

- 用途：item；内容ID：s2:bufferBadge
- 规范母图：art-src/s2/masters/item-buffer-badge.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One academic buffer badge: small ivory shield-shaped physical enamel badge with jade center and navy gold rim, a simple layered rectangular nontext pictogram. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-review-seal

- 用途：item；内容ID：s2:reviewSeal
- 规范母图：art-src/s2/masters/item-review-seal.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One physical university review seal stamp: navy handle, ivory rectangular stamp body, jade ink pad and gold clasp, no writing or stamped text. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## item-project-grant

- 用途：item；内容ID：s2:projectGrant
- 规范母图：art-src/s2/masters/item-project-grant.png；长边512px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One university project funding letter: ivory envelope with jade folder behind it, navy paper band and a plain gold physical seal, no letters or numbers. Inventory icon96/192px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## building-joint-lab

- 用途：building；内容ID：s2:assemblyA, s2:logisticsA, s2:assemblyB, s2:logisticsB, s2:jointLab
- 规范母图：art-src/s2/masters/building-joint-lab.png；长边1536px；锚点[0.5, 0.82]；风格参考：art-src/s2/masters/building-smart-teaching.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One modern university joint laboratory building, wide low ivory sandstone facade, navy steel frames and jade glass, practical visible assembly bay and a small loading canopy. Similar detail, perspective, sunlight and short shadow to the approved smart teaching building. Entire isolated building, no terrain slab, no signage. Wide2:1 composition.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/building-smart-teaching.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## building-exhibit-hall

- 用途：building；内容ID：s2:displayWest, s2:displayEast, s2:exhibitHall
- 规范母图：art-src/s2/masters/building-exhibit-hall.png；长边1536px；锚点[0.5, 0.82]；风格参考：art-src/s2/masters/building-smart-teaching.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One modern university student exhibition hall, wide ivory sandstone pavilion, navy slender structure, jade glazed facade, restrained gold entrance trim and visible physical project models behind glass. Same perspective, sunlight and shadow as the approved smart teaching building. Entire isolated building, no terrain slab or signage. Wide2:1 composition.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/building-smart-teaching.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## landmark-amendment-table

- 用途：landmark；内容ID：s2:amendmentTable
- 规范母图：art-src/s2/masters/landmark-amendment-table.png；长边768px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One university project amendment desk: ivory tabletop on navy legs, two jade project folders and a gold physical swap binder clip beside a navy stamp. No arrows, text, people or background. Same scale as the approved joint-project desk. Final display72px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## landmark-revision

- 用途：landmark；内容ID：s2:revision
- 规范母图：art-src/s2/masters/landmark-revision.png；长边768px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/item-drone.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Transparent background with real alpha; isolated subject, centered, all extremities and shadow visible, 10 percent transparent padding, no floor tile, no backdrop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: One old-course revision study desk: ivory tabletop on navy legs, a compact stack of jade and navy textbooks, open ivory notebook with only faint abstract lines and a gold desk lamp. No lettering, people or background. Final display72px.
Output: single transparent PNG master, generous clean alpha margin.
Reference image: art-src/s2/masters/item-drone.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```

## semester-cover

- 用途：cover；内容ID：s2:cover
- 规范母图：art-src/s2/masters/semester-cover.png；长边2048px；锚点[0.5, 0.5]；风格参考：art-src/s2/masters/building-smart-teaching.png。

```text
Use case: stylized-concept. Asset type: transparent raster game asset for Campus Survival second semester. Style: detailed hand-painted modern Chinese university campus illustration, elevated top-down view with mild front perspective, clean strong silhouettes readable at small game sizes, fine dark blue-green contour lines, subtle watercolor/colored-pencil surface detail. Palette: warm ivory and sandstone, jade/teal, muted navy, restrained gold, natural greenery only where appropriate. Soft sunlight from upper left and a short subtle contact shadow toward lower right. Match a warm paved modern campus with glass teaching buildings and landscaped grounds. Opaque campus landscape backdrop, composed for wide cover with central safe crop. Avoid fantasy/castles/magic, photorealism, glossy toy 3D, pixel art, neon bloom, red/orange danger markings, circles/arrows/countdowns, UI frames, logos, letters, text, watermark.
Subject: A wide16:9 illustrated modern Chinese university campus panorama, ivory sandstone and jade glass smart teaching building at left, practical joint laboratory at middle distance, student project exhibition pavilion at right, warm paved paths and natural trees. Same hand-painted contour detail and upper-left sunlight as approved sample. Broad central safe crop for mobile, no characters needed, absolutely no words or logos. Opaque fully painted background, no transparency.
Output: single opaque landscape PNG,2048x1152, safe central crop.
Reference image: art-src/s2/masters/building-smart-teaching.png is the approved P18 style reference only; create the requested NEW subject. Match its contour rendering, watercolor surface, elevated camera, light and palette exactly.
```
