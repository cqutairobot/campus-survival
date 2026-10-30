import type {ArtId} from './manifest';
/** Complete v4 logical bindings. Missing textures retain the geometric/SVG renderer. */
export const itemArt:Record<string,ArtId> = {
  "knife": "knife",
  "coffee": "coffee",
  "blueprint": "weapon-blueprint",
  "bot": "weapon-bot",
  "brick": "weapon-brick",
  "broadcast": "weapon-broadcast",
  "code": "weapon-code",
  "cryo": "weapon-cryo",
  "eraser": "weapon-eraser",
  "keyboard": "weapon-keyboard",
  "laser": "weapon-laser",
  "lightning": "weapon-lightning",
  "mentor": "weapon-mentor",
  "mine": "weapon-mine",
  "orbit": "weapon-orbit",
  "ppt": "weapon-ppt",
  "prism": "weapon-prism",
  "rain": "weapon-rain",
  "ruler": "weapon-ruler",
  "shuttle": "weapon-shuttle",
  "staple": "weapon-staple",
  "wifi": "weapon-wifi",
  "area": "passive-area",
  "armor": "passive-armor",
  "calm": "passive-calm",
  "duration": "passive-duration",
  "focus": "passive-focus",
  "haste": "passive-haste",
  "health": "passive-health",
  "luck": "passive-luck",
  "magnetism": "passive-magnetism",
  "multi": "passive-multi",
  "night": "passive-night",
  "push": "passive-push",
  "regen": "passive-regen",
  "speed": "passive-speed",
  "thesis": "passive-thesis",
  "xp": "passive-xp",
  "binder": "fusion-binder",
  "demolition": "fusion-demolition",
  "hub": "fusion-hub",
  "icefire": "fusion-icefire",
  "sky": "fusion-sky",
  "sword": "fusion-sword",
  "assistant": "relic-assistant",
  "clockShard": "relic-clockShard",
  "emergency": "relic-emergency",
  "obsidian": "relic-obsidian",
  "redNotebook": "relic-redNotebook",
  "scholarship": "relic-scholarship",
  "bomb": "pickup-bomb",
  "coffeeBoost": "pickup-coffeeBoost",
  "energy": "pickup-energy",
  "freeze": "pickup-freeze",
  "heal": "pickup-heal",
  "magnet": "pickup-magnet",
  "shield": "pickup-shield",
  "barrier": "ultimate-barrier",
  "conference": "ultimate-conference",
  "lastMinute": "ultimate-lastMinute",
  "overload": "ultimate-overload",
  "parallel": "ultimate-parallel",
  "submission": "ultimate-submission"
};
export const characterArt:Record<string,{portrait:ArtId;avatar:ArtId;sprite:ArtId}> = {
  "balanced": {
    "portrait": "portrait",
    "avatar": "avatar",
    "sprite": "player"
  },
  "analysis": {
    "portrait": "character-analysis-portrait",
    "avatar": "character-analysis-avatar",
    "sprite": "character-analysis-sprite"
  },
  "coder": {
    "portrait": "character-coder-portrait",
    "avatar": "character-coder-avatar",
    "sprite": "character-coder-sprite"
  },
  "english": {
    "portrait": "character-english-portrait",
    "avatar": "character-english-avatar",
    "sprite": "character-english-sprite"
  },
  "architect": {
    "portrait": "character-architect-portrait",
    "avatar": "character-architect-avatar",
    "sprite": "character-architect-sprite"
  },
  "experiment": {
    "portrait": "character-experiment-portrait",
    "avatar": "character-experiment-avatar",
    "sprite": "character-experiment-sprite"
  }
};
export const enemyArt:Record<string,{sprite:ArtId;white:ArtId}> = {
  "homework": {
    "sprite": "homework",
    "white": "homeworkWhite"
  },
  "ddl": {
    "sprite": "ddl",
    "white": "ddlWhite"
  },
  "advisor": {
    "sprite": "enemy-advisor",
    "white": "enemy-advisor-white"
  },
  "bomber": {
    "sprite": "enemy-bomber",
    "white": "enemy-bomber-white"
  },
  "charger": {
    "sprite": "enemy-charger",
    "white": "enemy-charger-white"
  },
  "checkin": {
    "sprite": "enemy-checkin",
    "white": "enemy-checkin-white"
  },
  "coding": {
    "sprite": "enemy-coding",
    "white": "enemy-coding-white"
  },
  "defense": {
    "sprite": "enemy-defense",
    "white": "enemy-defense-white"
  },
  "english": {
    "sprite": "enemy-english",
    "white": "enemy-english-white"
  },
  "examCharger": {
    "sprite": "enemy-examCharger",
    "white": "enemy-examCharger-white"
  },
  "finals": {
    "sprite": "enemy-finals",
    "white": "enemy-finals-white"
  },
  "guard": {
    "sprite": "enemy-guard",
    "white": "enemy-guard-white"
  },
  "inspector": {
    "sprite": "enemy-inspector",
    "white": "enemy-inspector-white"
  },
  "leader": {
    "sprite": "enemy-leader",
    "white": "enemy-leader-white"
  },
  "math": {
    "sprite": "enemy-math",
    "white": "enemy-math-white"
  },
  "mechanics": {
    "sprite": "enemy-mechanics",
    "white": "enemy-mechanics-white"
  },
  "node": {
    "sprite": "enemy-node",
    "white": "enemy-node-white"
  },
  "ppt": {
    "sprite": "enemy-ppt",
    "white": "enemy-ppt-white"
  },
  "proposal": {
    "sprite": "enemy-proposal",
    "white": "enemy-proposal-white"
  },
  "receipt": {
    "sprite": "enemy-receipt",
    "white": "enemy-receipt-white"
  },
  "review": {
    "sprite": "enemy-review",
    "white": "enemy-review-white"
  },
  "splitter": {
    "sprite": "enemy-splitter",
    "white": "enemy-splitter-white"
  },
  "summoner": {
    "sprite": "enemy-summoner",
    "white": "enemy-summoner-white"
  },
  "teamlead": {
    "sprite": "enemy-teamlead",
    "white": "enemy-teamlead-white"
  },
  "thrower": {
    "sprite": "enemy-thrower",
    "white": "enemy-thrower-white"
  }
};
export const buildingArt:Record<string,ArtId> = {
  "activity": "building-activity",
  "architecture": "building-architecture",
  "basic-south": "building-basic-south",
  "basic": "building-basic",
  "canteen": "building-canteen",
  "civil": "building-civil",
  "dorm-west": "building-dorm-west",
  "dorm": "building-dorm",
  "experiment": "building-experiment",
  "library": "building-library"
};
export const landmarkArt:Record<string,ArtId> = {
  "canteen": "landmark-canteen",
  "garden": "landmark-garden",
  "lab": "landmark-lab",
  "library": "landmark-library",
  "track": "landmark-track",
  "workshop": "landmark-workshop"
};
export const propArt:Record<string,ArtId> = {
  "bench": "prop-bench",
  "planter": "prop-planter",
  "tree": "prop-tree"
};
export const textureArt:Record<string,ArtId> = {
  "grass": "texture-grass",
  "metal": "texture-metal",
  "paper": "paper",
  "paving": "texture-paving"
};
export const uiArt:Record<string,ArtId> = {
  "academic-crest": "ui-academic-crest",
  "chest-closed": "ui-chest-closed",
  "chest-open": "ui-chest-open",
  "gold-ornament": "ui-gold-ornament",
  "menu-campus-portrait": "menuPortrait",
  "menu-campus": "menu",
  "result-defeat": "ui-result-defeat",
  "result-victory": "ui-result-victory"
};
export const buildingKeys = ["library", "canteen", "basic", "architecture", "dorm", "civil", "experiment", "basic-south", "activity", "dorm-west"] as const;
export const projectileArt:Record<string,ArtId>={paper:'paperBlade',book:'fxBook',bot:'fxRobot',ppt:'fxSlides',shuttle:'fxShuttle',code:'weapon-code'};
/** Normalized lower ground-footprint convention. Decorative roofs extend above it. */
export const buildingFootprints:Record<string,{x:number;y:number;w:number;h:number}> = {
  "library": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "canteen": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "basic": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "architecture": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "dorm": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "civil": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "experiment": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "basic-south": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "activity": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  },
  "dorm-west": {
    "x": 0,
    "y": 0.55,
    "w": 1,
    "h": 0.45
  }
};
