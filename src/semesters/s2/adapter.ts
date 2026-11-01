import {createS2PreviewSnapshot} from '../inheritance';
import type {SaveProfile,SemesterResult} from '../profile';
import type {Discovery,S2RunSnapshot} from '../types';
import type {Immutable,SemesterRunView,SemesterView} from '../runtime/contracts';
import type {GameCommand,Phase} from '../../types';
import {createSemesterTwoRun} from './createRun';
import {s2DailyChallenge} from './daily';
import {semesterTwoResult,type SettlementIdentity} from './settlement';
import type {LegacyContentDTO} from './legacy/rules-adapter';
import {presentationPhase} from './presentation/input';

export type S2View=Immutable<SemesterRunView<LegacyContentDTO>>;
export interface S2Hooks {
 publish:(phase:Phase)=>void;
 discover:(discovery:Discovery)=>void;
 settle:(result:SemesterResult)=>SaveProfile;
 beginDaily:(id:string)=>void;
}
interface Presentation extends SemesterView<LegacyContentDTO> {settled?:(before:SaveProfile,after:SaveProfile,result:SemesterResult)=>void}

/** The preview snapshot is the frozen opening contract, also used in production. */
export function createS2Snapshot(profile:SaveProfile,seed:number,mode:'normal'|'daily'='normal',date?:string):S2RunSnapshot {
 return mode==='daily'?createS2PreviewSnapshot(profile,seed,{mode,assignment:s2DailyChallenge(date).assignment}):createS2PreviewSnapshot(profile,seed);
}
export function createS2Engine(profile:SaveProfile,seed:number,hooks:S2Hooks,mode:'normal'|'daily'='normal',date?:string,identity?:SettlementIdentity){
 const snapshot=createS2Snapshot(profile,seed,mode,date),before=structuredClone(profile),seen=new Set<string>(),listeners=new Set<()=>void>();
 const receipt=identity??{id:`s2-${crypto.randomUUID()}`,createdAt:Date.now(),nickname:profile.settings.nickname};
 let latest:S2View,result:SemesterResult|null=null,presentation:Presentation|undefined,disposed=false,lastPhase:Phase|undefined;
 if(mode==='daily')hooks.beginDaily(`s2|${snapshot.date}|${snapshot.rulesVersion}`);
 const runtime=createSemesterTwoRun(snapshot,{publish(view,alpha){
  latest=view;
  for(const discovery of view.content.discoveries){const key=`${discovery.category}|${discovery.id}|${discovery.evidence}`;if(!seen.has(key)){seen.add(key);hooks.discover({...discovery});}}
  if(view.result&&!result){result=semesterTwoResult(snapshot,view.result,view.content,receipt);if(result){const after=hooks.settle(result);presentation?.settled?.(before,after,result);}}
  presentation?.publish(view,alpha);
  const phase=presentationPhase(view);if(phase!==lastPhase){lastPhase=phase;hooks.publish(phase);}
  for(const listener of listeners)listener();
 },dispose(){presentation?.dispose?.();listeners.clear();}});
 const engine={
  runtime,snapshot,
  get phase(){return presentationPhase(latest);},get result(){return result;},get damage(){return latest.content.damage;},
  read:()=>latest,subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};},
  advance:(seconds:number)=>runtime.advance(seconds),dispatch:(command:unknown)=>runtime.dispatch(command),
  pause:(reason:Parameters<typeof runtime.pause>[0]='manual')=>runtime.pause(reason),resume:(token:number)=>runtime.resume(token),
  acknowledge:(token:number)=>runtime.acknowledge(token),abandon:()=>runtime.abandon(),
  send(command:GameCommand){
   if(command.type==='pause')runtime.pause('manual');
   else if(command.type==='resume'){if(latest.pause?.reason==='manual')runtime.resume(latest.pause.token);}
   else if(command.type==='abandon')runtime.abandon();
   else if(command.type==='introDone'||command.type==='bossDeathDone'){if(latest.gate)runtime.acknowledge(latest.gate.token);}
   else runtime.dispatch(command);
  },
  attachView(view:Presentation){if(disposed){view.dispose?.();return;}presentation=view;view.publish(latest,0);},
  dispose(){if(disposed)return;disposed=true;runtime.dispose();},
 };
 return {engine,snapshot};
}
export type S2Engine=ReturnType<typeof createS2Engine>['engine'];

/** Uses the same scene/loader ownership and abort lifecycle as prepareScene. */
export async function prepareS2Scene(engine:S2Engine,options:Omit<Parameters<typeof import('./presentation/prepareScene').prepareSemesterTwoScene>[0],'snapshot'|'settlement'|'onView'|'content'|'world'>){
 const abort=()=>engine.dispose();
 if(options.signal?.aborted){abort();throw new DOMException('Semester preparation cancelled','AbortError');}
 options.signal?.addEventListener('abort',abort,{once:true});
 try{
  const {SemesterScene}=await import('./presentation/SemesterScene');
  if(options.signal?.aborted)throw new DOMException('Semester preparation cancelled','AbortError');
  const {S2_CONTENT}=await import('./content');
  if(options.signal?.aborted)throw new DOMException('Semester preparation cancelled','AbortError');
  const scene=new SemesterScene(options.host,S2_CONTENT,options.settings,options.onStick,options.audio,options.onLoad);
  scene.setHUDInset(170);
  engine.attachView({publish:view=>scene.publish(view),settled:(before,after,result)=>scene.showSettlement(before,after,result),dispose(){options.signal?.removeEventListener('abort',abort);scene.dispose();}});
  scene.attach(engine);
  if(options.signal?.aborted)throw new DOMException('Semester preparation cancelled','AbortError');
  await scene.initialize();if(options.signal?.aborted)throw new DOMException('Semester preparation cancelled','AbortError');return scene;
 }catch(error){options.signal?.removeEventListener('abort',abort);engine.dispose();throw error;}
}
