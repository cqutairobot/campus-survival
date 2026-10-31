import {createContentCatalog,LEGACY_CONTENT} from './legacy/catalog';
import {FIRST_CHAPTER_ENEMIES,FIRST_THREAT_WEEKS} from './first-chapter';
import {ADVANCED_ENEMIES,ADVANCED_WEEKS} from './advanced-enemies';
import {PROPOSAL_BOARD} from './proposal-board';
import {FIRST_CHAPTER_PASSIVES,FIRST_CHAPTER_WEAPONS} from './builds';

/** Append only: all 25 legacy slots, IDs and definitions retain their order. */
export const S2_CONTENT=createContentCatalog({...LEGACY_CONTENT,weapons:[...LEGACY_CONTENT.weapons,...FIRST_CHAPTER_WEAPONS],passives:[...LEGACY_CONTENT.passives,...FIRST_CHAPTER_PASSIVES],enemies:[...LEGACY_CONTENT.enemies,...FIRST_CHAPTER_ENEMIES,PROPOSAL_BOARD,...ADVANCED_ENEMIES],waves:{...LEGACY_CONTENT.waves,normalIds:[...LEGACY_CONTENT.waves.normalIds,...Object.keys(FIRST_THREAT_WEEKS),...Object.keys(ADVANCED_WEEKS)]}});
