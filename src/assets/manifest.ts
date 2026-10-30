// Source IDs are shared by DOM and Pixi. Small assets never pull in large portraits.
export const assetUrl=(path:string)=>`${import.meta.env.BASE_URL}${path.replace(/^\//,'')}`;
export const artManifest = {
  "menu": {
    "path": "ui/menu-campus",
    "bundle": "shell",
    "pngFallback": false
  },
  "menuPortrait": {
    "path": "ui/menu-campus-portrait",
    "bundle": "shell-mobile",
    "pngFallback": false
  },
  "portrait": {
    "path": "characters/balanced/portrait",
    "bundle": "shell",
    "pngFallback": false
  },
  "avatar": {
    "path": "characters/balanced/avatar",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "player": {
    "path": "characters/balanced/sprite",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "homework": {
    "path": "enemies/homework",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "homeworkWhite": {
    "path": "enemies/homework-white",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "ddl": {
    "path": "enemies/ddl",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "ddlWhite": {
    "path": "enemies/ddl-white",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "knife": {
    "path": "icons/weapons/knife",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "coffee": {
    "path": "icons/weapons/coffee",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "paper": {
    "path": "textures/paper",
    "bundle": "shell",
    "pngFallback": false
  },
  "particles": {
    "path": "fx/particles",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "paperBlade": {
    "path": "fx/paper-blade",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "character-analysis-portrait": {
    "path": "characters/analysis/portrait",
    "bundle": "codex-extra",
    "pngFallback": false
  },
  "character-analysis-avatar": {
    "path": "characters/analysis/avatar",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "character-analysis-sprite": {
    "path": "characters/analysis/sprite",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "character-coder-portrait": {
    "path": "characters/coder/portrait",
    "bundle": "codex-extra",
    "pngFallback": false
  },
  "character-coder-avatar": {
    "path": "characters/coder/avatar",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "character-coder-sprite": {
    "path": "characters/coder/sprite",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "character-english-portrait": {
    "path": "characters/english/portrait",
    "bundle": "codex-extra",
    "pngFallback": false
  },
  "character-english-avatar": {
    "path": "characters/english/avatar",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "character-english-sprite": {
    "path": "characters/english/sprite",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "character-architect-portrait": {
    "path": "characters/architect/portrait",
    "bundle": "codex-extra",
    "pngFallback": false
  },
  "character-architect-avatar": {
    "path": "characters/architect/avatar",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "character-architect-sprite": {
    "path": "characters/architect/sprite",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "character-experiment-portrait": {
    "path": "characters/experiment/portrait",
    "bundle": "codex-extra",
    "pngFallback": false
  },
  "character-experiment-avatar": {
    "path": "characters/experiment/avatar",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "character-experiment-sprite": {
    "path": "characters/experiment/sprite",
    "bundle": "battle-core",
    "pngFallback": true
  },
  "enemy-advisor": {
    "path": "enemies/advisor",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-advisor-white": {
    "path": "enemies/advisor-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-bomber": {
    "path": "enemies/bomber",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-bomber-white": {
    "path": "enemies/bomber-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-charger": {
    "path": "enemies/charger",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-charger-white": {
    "path": "enemies/charger-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-checkin": {
    "path": "enemies/checkin",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-checkin-white": {
    "path": "enemies/checkin-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-coding": {
    "path": "enemies/coding",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-coding-white": {
    "path": "enemies/coding-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-defense": {
    "path": "enemies/defense",
    "bundle": "boss-defense",
    "pngFallback": true
  },
  "enemy-defense-white": {
    "path": "enemies/defense-white",
    "bundle": "boss-defense",
    "pngFallback": true
  },
  "enemy-english": {
    "path": "enemies/english",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-english-white": {
    "path": "enemies/english-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-examCharger": {
    "path": "enemies/examCharger",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-examCharger-white": {
    "path": "enemies/examCharger-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-finals": {
    "path": "enemies/finals",
    "bundle": "boss-finals",
    "pngFallback": true
  },
  "enemy-finals-white": {
    "path": "enemies/finals-white",
    "bundle": "boss-finals",
    "pngFallback": true
  },
  "enemy-guard": {
    "path": "enemies/guard",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-guard-white": {
    "path": "enemies/guard-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-inspector": {
    "path": "enemies/inspector",
    "bundle": "boss-inspector",
    "pngFallback": true
  },
  "enemy-inspector-white": {
    "path": "enemies/inspector-white",
    "bundle": "boss-inspector",
    "pngFallback": true
  },
  "enemy-leader": {
    "path": "enemies/leader",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-leader-white": {
    "path": "enemies/leader-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-math": {
    "path": "enemies/math",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-math-white": {
    "path": "enemies/math-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-mechanics": {
    "path": "enemies/mechanics",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-mechanics-white": {
    "path": "enemies/mechanics-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-node": {
    "path": "enemies/node",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-node-white": {
    "path": "enemies/node-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-ppt": {
    "path": "enemies/ppt",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-ppt-white": {
    "path": "enemies/ppt-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-proposal": {
    "path": "enemies/proposal",
    "bundle": "boss-proposal",
    "pngFallback": true
  },
  "enemy-proposal-white": {
    "path": "enemies/proposal-white",
    "bundle": "boss-proposal",
    "pngFallback": true
  },
  "enemy-receipt": {
    "path": "enemies/receipt",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-receipt-white": {
    "path": "enemies/receipt-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-review": {
    "path": "enemies/review",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-review-white": {
    "path": "enemies/review-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-splitter": {
    "path": "enemies/splitter",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-splitter-white": {
    "path": "enemies/splitter-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-summoner": {
    "path": "enemies/summoner",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-summoner-white": {
    "path": "enemies/summoner-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-teamlead": {
    "path": "enemies/teamlead",
    "bundle": "boss-teamlead",
    "pngFallback": true
  },
  "enemy-teamlead-white": {
    "path": "enemies/teamlead-white",
    "bundle": "boss-teamlead",
    "pngFallback": true
  },
  "enemy-thrower": {
    "path": "enemies/thrower",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "enemy-thrower-white": {
    "path": "enemies/thrower-white",
    "bundle": "battle-content",
    "pngFallback": true
  },
  "weapon-blueprint": {
    "path": "icons/weapons/blueprint",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-bot": {
    "path": "icons/weapons/bot",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-brick": {
    "path": "icons/weapons/brick",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-broadcast": {
    "path": "icons/weapons/broadcast",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-code": {
    "path": "icons/weapons/code",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-cryo": {
    "path": "icons/weapons/cryo",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-eraser": {
    "path": "icons/weapons/eraser",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-keyboard": {
    "path": "icons/weapons/keyboard",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-laser": {
    "path": "icons/weapons/laser",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-lightning": {
    "path": "icons/weapons/lightning",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-mentor": {
    "path": "icons/weapons/mentor",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-mine": {
    "path": "icons/weapons/mine",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-orbit": {
    "path": "icons/weapons/orbit",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-ppt": {
    "path": "icons/weapons/ppt",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-prism": {
    "path": "icons/weapons/prism",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-rain": {
    "path": "icons/weapons/rain",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-ruler": {
    "path": "icons/weapons/ruler",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-shuttle": {
    "path": "icons/weapons/shuttle",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-staple": {
    "path": "icons/weapons/staple",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "weapon-wifi": {
    "path": "icons/weapons/wifi",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-area": {
    "path": "icons/passives/area",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-armor": {
    "path": "icons/passives/armor",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-calm": {
    "path": "icons/passives/calm",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-duration": {
    "path": "icons/passives/duration",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-focus": {
    "path": "icons/passives/focus",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-haste": {
    "path": "icons/passives/haste",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-health": {
    "path": "icons/passives/health",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-luck": {
    "path": "icons/passives/luck",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-magnetism": {
    "path": "icons/passives/magnetism",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-multi": {
    "path": "icons/passives/multi",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-night": {
    "path": "icons/passives/night",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-push": {
    "path": "icons/passives/push",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-regen": {
    "path": "icons/passives/regen",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-speed": {
    "path": "icons/passives/speed",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-thesis": {
    "path": "icons/passives/thesis",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "passive-xp": {
    "path": "icons/passives/xp",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "fusion-binder": {
    "path": "icons/fusions/binder",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "fusion-demolition": {
    "path": "icons/fusions/demolition",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "fusion-hub": {
    "path": "icons/fusions/hub",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "fusion-icefire": {
    "path": "icons/fusions/icefire",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "fusion-sky": {
    "path": "icons/fusions/sky",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "fusion-sword": {
    "path": "icons/fusions/sword",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "relic-assistant": {
    "path": "icons/relics/assistant",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "relic-clockShard": {
    "path": "icons/relics/clockShard",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "relic-emergency": {
    "path": "icons/relics/emergency",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "relic-obsidian": {
    "path": "icons/relics/obsidian",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "relic-redNotebook": {
    "path": "icons/relics/redNotebook",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "relic-scholarship": {
    "path": "icons/relics/scholarship",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-bomb": {
    "path": "icons/pickups/bomb",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-coffeeBoost": {
    "path": "icons/pickups/coffeeBoost",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-energy": {
    "path": "icons/pickups/energy",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-freeze": {
    "path": "icons/pickups/freeze",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-heal": {
    "path": "icons/pickups/heal",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-magnet": {
    "path": "icons/pickups/magnet",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "pickup-shield": {
    "path": "icons/pickups/shield",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "ultimate-barrier": {
    "path": "icons/ultimates/barrier",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "ultimate-conference": {
    "path": "icons/ultimates/conference",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "ultimate-lastMinute": {
    "path": "icons/ultimates/lastMinute",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "ultimate-overload": {
    "path": "icons/ultimates/overload",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "ultimate-parallel": {
    "path": "icons/ultimates/parallel",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "ultimate-submission": {
    "path": "icons/ultimates/submission",
    "bundle": "ui-items",
    "pngFallback": true
  },
  "building-activity": {
    "path": "buildings/activity",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-architecture": {
    "path": "buildings/architecture",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-basic-south": {
    "path": "buildings/basic-south",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-basic": {
    "path": "buildings/basic",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-canteen": {
    "path": "buildings/canteen",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-civil": {
    "path": "buildings/civil",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-dorm-west": {
    "path": "buildings/dorm-west",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-dorm": {
    "path": "buildings/dorm",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-experiment": {
    "path": "buildings/experiment",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "building-library": {
    "path": "buildings/library",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "landmark-canteen": {
    "path": "landmarks/canteen",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "landmark-garden": {
    "path": "landmarks/garden",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "landmark-lab": {
    "path": "landmarks/lab",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "landmark-library": {
    "path": "landmarks/library",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "landmark-track": {
    "path": "landmarks/track",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "landmark-workshop": {
    "path": "landmarks/workshop",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "prop-bench": {
    "path": "props/bench",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "prop-planter": {
    "path": "props/planter",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "prop-tree": {
    "path": "props/tree",
    "bundle": "battle-content",
    "pngFallback": false
  },
  "texture-grass": {
    "path": "textures/grass",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "texture-metal": {
    "path": "textures/metal",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "texture-paving": {
    "path": "textures/paving",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "ui-academic-crest": {
    "path": "ui/academic-crest",
    "bundle": "shell",
    "pngFallback": false
  },
  "ui-chest-closed": {
    "path": "ui/chest-closed",
    "bundle": "ui-decoration",
    "pngFallback": false
  },
  "ui-chest-open": {
    "path": "ui/chest-open",
    "bundle": "ui-decoration",
    "pngFallback": false
  },
  "ui-gold-ornament": {
    "path": "ui/gold-ornament",
    "bundle": "ui-decoration",
    "pngFallback": false
  },
  "ui-result-defeat": {
    "path": "ui/result-defeat",
    "bundle": "ui-results",
    "pngFallback": false
  },
  "ui-result-victory": {
    "path": "ui/result-victory",
    "bundle": "ui-results",
    "pngFallback": false
  },
  "fxBook": {
    "path": "fx/book",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "fxRobot": {
    "path": "fx/robot",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "fxSlides": {
    "path": "fx/slides",
    "bundle": "battle-core",
    "pngFallback": false
  },
  "fxShuttle": {
    "path": "fx/shuttle",
    "bundle": "battle-core",
    "pngFallback": false
  }
} as const;
export type ArtId=keyof typeof artManifest;
export type Bundle=typeof artManifest[ArtId]['bundle'];
export const artUrl=(id:ArtId,format='webp')=>assetUrl(`assets/art/v4/${artManifest[id].path}.${format}`);
export const pixiManifest={bundles:[...new Set(Object.values(artManifest).map(asset=>asset.bundle))].map(name=>({name,assets:(Object.keys(artManifest) as ArtId[]).filter(id=>artManifest[id].bundle===name).map(id=>({alias:id,src:artUrl(id)}))}))};
