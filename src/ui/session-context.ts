import type {ActiveGameSession} from '../app/GameHost';
import type {ContentSkill} from '../semesters/s2/types';
import type {SaveProfile} from '../semesters/profile';
import {BUILDINGS,WORLD_SIZE,ZONES} from '../world/campus';
import {buildingArt,buildingKeys,landmarkArt} from '../assets/bindings';
import {createS2WorldSnapshot} from '../semesters/s2/world';
import {S2_CONTENT} from '../semesters/s2/content';
import {LEGACY_CONTENT} from '../semesters/s2/legacy/catalog';
import {evolutionReady} from '../semesters/s2/legacy/rules';
import {fusionCandidates} from '../semesters/s2/legacy/fusions';

const s1World={size:WORLD_SIZE,zones:ZONES.map(z=>({...z,art:landmarkArt[z.id]})),buildings:BUILDINGS.map((b,n)=>({...b,art:buildingArt[buildingKeys[n]]})),paths:[...[2320,3072,4210].map(x=>({x:x-80,y:0,w:160,h:WORLD_SIZE})),...[2040,2870,3310,3870].map(y=>({x:0,y:y-70,w:WORLD_SIZE,h:140}))]};
/** Only panel fields leave the session. Menu selection cannot replace a live
 * opening world or route S2 skills into the S1-only rule functions. */
export function sessionPanelContext(session:ActiveGameSession|null|undefined,profile:SaveProfile){
 if(session?.semesterId==='s2'){
  const g=session.engine.read().content,copy=(skills:typeof g.weapons):ContentSkill[]=>skills.map(s=>({...s,components:s.components?[s.components[0],s.components[1]]:undefined})),weapons=copy(g.weapons),passives=copy(g.passives),consumed=[...g.consumed];
  return {semesterId:'s2' as const,world:g.world,regions:[...session.snapshot.regions],visited:[...g.progress.visited],weapons,passives,week:g.week,content:S2_CONTENT,ready:evolutionReady(S2_CONTENT,weapons,passives).map(w=>String(w.id)),fusionReady:fusionCandidates(S2_CONTENT,weapons,g.week,g.progress.fusions.length,consumed).map(w=>String(w.id))};
 }
 if(session){const g=session.engine,weapons=structuredClone(g.weapons),passives=structuredClone(g.passives);return {semesterId:'s1' as const,world:s1World,regions:[...g.manifest.regions],visited:[...g.progress.visited],weapons,passives,week:g.week,content:LEGACY_CONTENT,ready:evolutionReady(LEGACY_CONTENT,weapons,passives).map(w=>String(w.id)),fusionReady:fusionCandidates(LEGACY_CONTENT,weapons,g.week,g.progress.fusions.length,[...g.consumed]).map(w=>String(w.id))};}
 const s2=profile.selectedSemester==='s2',regions=s2?[...profile.unlocks.regions,...profile.semesters.s2.unlocks.regions]:profile.unlocks.regions;
 return {semesterId:profile.selectedSemester,world:s2?createS2WorldSnapshot(regions):s1World,regions,visited:s2?profile.semesters.s2.stats.visits:profile.regions,weapons:[],passives:[],week:1,content:s2?S2_CONTENT:LEGACY_CONTENT,ready:[] as string[],fusionReady:[] as string[]};
}
