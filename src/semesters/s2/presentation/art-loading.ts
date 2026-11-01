import {S2_ART_FRAMES,S2_ART_MANIFEST} from './art-manifest';
import {enemyArt} from '../../../assets/bindings';
import type {ResourceBundle,ResourceId} from '../../../assets/manifest';
const manifest=S2_ART_MANIFEST as Record<string,{bundle:string}>;
const frames=S2_ART_FRAMES as Record<string,{atlas:string;whiteAtlas?:string;kind:string}>;
/** The 25 original mappings keep their original aliases; all 15 additions have
 * explicit normal/white frames. No S1 catalog or resource is rewritten. */
export const S2_ENEMY_ART=Object.fromEntries([
 ...Object.entries(enemyArt).map(([id,a])=>[id,{normal:a.sprite,white:a.white}]),
 ...Object.entries(frames).filter(([,a])=>a.kind==='enemy').map(([id,a])=>[id,{normal:a.atlas,white:a.whiteAtlas??a.atlas}]),
]) as Record<string,{normal:ResourceId;white:ResourceId}>;
export function semesterArtBundles(week:number,player:{x:number;y:number},actors:readonly string[]=[],items:readonly string[]=[]){
 const bundles=new Set<string>();
 // A region is freely reachable from week1. Load well before it enters view.
 if(week>=8||Math.hypot(player.x-5000,player.y-4480)<1400)bundles.add('s2-chapter-2');
 if(week>=16||Math.hypot(player.x-1408,player.y-4800)<1400)bundles.add('s2-chapter-3');
 for(const id of [...actors,...items]){const a=frames[id];if(a&&manifest[a.atlas]?.bundle!=='s2-start')bundles.add(manifest[a.atlas].bundle);}
 return [...bundles] as ResourceBundle[];
}
