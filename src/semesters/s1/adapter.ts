import {GameEngine,type EngineHooks} from '../../core/engine';
import {createManifest} from '../../core/run';
import {CHARACTERS} from '../../data/catalog';
import {toLegacyS1Save} from '../../save/v5/profile';
import type {SaveProfile} from '../profile';
import {immutableSnapshot,type S1RunSnapshot} from '../types';

export function createS1Snapshot(profile:SaveProfile,seed:number,mode:'normal'|'daily'='normal',date?:string):S1RunSnapshot{
 const manifest=createManifest(toLegacyS1Save(profile),seed,mode,date),character=CHARACTERS.find(c=>c.id===manifest.character)!;
 return immutableSnapshot({semesterId:'s1',contentVersion:'4.0.1',rulesVersion:manifest.rulesVersion,worldVersion:'campus-s1-v4.0.1',mode:manifest.mode,seed:manifest.seed,character:manifest.character,talents:manifest.talents,weapons:manifest.weapons,passives:manifest.passives,regions:manifest.regions,initialWeapon:{id:character.weapon,level:1,rarity:0,evolved:false},inheritance:null,eligible:true,...(manifest.date?{date:manifest.date,dailyRule:manifest.dailyRule}:{}),legacy:manifest});
}
export function createS1Engine(profile:SaveProfile,seed:number,hooks:EngineHooks,mode:'normal'|'daily'='normal'){
 const snapshot=createS1Snapshot(profile,seed,mode),engine=new GameEngine(toLegacyS1Save(profile),snapshot.seed,hooks,{manifest:structuredClone(snapshot.legacy)});
 return {engine,snapshot};
}
