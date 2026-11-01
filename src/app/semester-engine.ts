import type {loadSemesterRuntime} from '../semesters/registry';
import type {SaveProfile} from '../semesters/profile';
import type {EngineHooks} from '../core/engine';
import type {S2Hooks} from '../semesters/s2/adapter';

/** The host selects the loaded adapter explicitly; S2 cannot fall back to S1. */
export function createGameEngine(route:Awaited<ReturnType<typeof loadSemesterRuntime>>,profile:SaveProfile,seed:number,hooks:EngineHooks,s2Hooks:S2Hooks,mode:'normal'|'daily'){
 if('createS2Engine' in route)return {semesterId:'s2' as const,...route.createS2Engine(profile,seed,s2Hooks,mode),prepareScene:route.prepareS2Scene};
 return {semesterId:'s1' as const,...route.createS1Engine(profile,seed,hooks,mode)};
}
/** A failed opening owns its partial scene and simulation until both are freed. */
export async function initializeGameScene<T extends {initialize:()=>Promise<void>;destroy:()=>void}>(scene:T,engine:{dispose:()=>void}){
 try{await scene.initialize();return scene;}
 catch(error){try{scene.destroy();}finally{engine.dispose();}throw error;}
}
