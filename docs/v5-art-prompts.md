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
