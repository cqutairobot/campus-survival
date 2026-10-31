import {createContentCatalog,LEGACY_CONTENT} from './legacy/catalog';
import {FIRST_CHAPTER_ENEMIES,FIRST_THREAT_WEEKS} from './first-chapter';

/** Append only: all 25 legacy slots, IDs and definitions retain their order. */
export const S2_CONTENT=createContentCatalog({...LEGACY_CONTENT,enemies:[...LEGACY_CONTENT.enemies,...FIRST_CHAPTER_ENEMIES],waves:{...LEGACY_CONTENT.waves,normalIds:[...LEGACY_CONTENT.waves.normalIds,...Object.keys(FIRST_THREAT_WEEKS)]}});
