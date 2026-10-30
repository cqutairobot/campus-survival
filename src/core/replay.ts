import {validManifest} from './run';
import type { GameCommand,Phase,SaveData,RunManifest } from '../types';
import { validCommand } from '../debug/commands';
import { validateSave } from '../save/storage';
export type ReplayEvent=({frame:number;phase:Phase})&({kind:'input';x:number;y:number}|{kind:'command';command:GameCommand}|{kind:'viewport';width:number;height:number});
export interface ReplayData {version:2;rulesVersion:string;manifest:RunManifest;seed:number;save:SaveData;viewport:{width:number;height:number};events:ReplayEvent[];endFrame:number}
export class ReplayRecorder {
  readonly events:ReplayEvent[]=[];private x=NaN;private y=NaN;private width=0;private height=0;
  input(frame:number,phase:Phase,x:number,y:number,width:number,height:number){
    if(width!==this.width||height!==this.height){this.width=width;this.height=height;this.events.push({frame,phase,kind:'viewport',width,height});}
    if(x!==this.x||y!==this.y){this.x=x;this.y=y;this.events.push({frame,phase,kind:'input',x,y});}
  }
  command(frame:number,phase:Phase,command:GameCommand){this.events.push({frame,phase,kind:'command',command:{...command}});}
  synchronizeInput(x:number,y:number){this.x=x;this.y=y;}
  export(seed:number,save:SaveData,width:number,height:number,endFrame:number,manifest:RunManifest):ReplayData{return{version:2,rulesVersion:manifest.rulesVersion,manifest:structuredClone(manifest),seed,save:structuredClone(save),viewport:{width,height},events:structuredClone(this.events),endFrame};}
}
export function validReplay(data:unknown):data is ReplayData {
  if(!data||typeof data!=='object')return false;const r=data as ReplayData;
  if(r.version!==2||!validManifest(r.manifest)||r.manifest.rulesVersion!==r.rulesVersion||r.manifest.seed!==r.seed||r.save?.schemaVersion!==3||!validateSave(r.save)||!Number.isFinite(r.seed)||!Number.isSafeInteger(r.endFrame)||r.endFrame<0||r.endFrame>300000||!r.viewport||!Number.isFinite(r.viewport.width)||!Number.isFinite(r.viewport.height)||r.viewport.width<=0||r.viewport.height<=0||!Array.isArray(r.events)||r.events.length>600000)return false;
  let last=-1;
  return r.events.every(e=>{if(!e||!Number.isSafeInteger(e.frame)||e.frame<last||e.frame>r.endFrame||!['menu','playing','draft','reward','contract','chest','evolution','bossIntro','bossDeath','paused','result'].includes(e.phase))return false;last=e.frame;return e.kind==='input'?Number.isFinite(e.x)&&Number.isFinite(e.y)&&Math.abs(e.x)<=1&&Math.abs(e.y)<=1:e.kind==='command'?validCommand(e.command):e.kind==='viewport'&&Number.isFinite(e.width)&&Number.isFinite(e.height)&&e.width>0&&e.height>0;});
}
/** Replays against a fresh engine; UI waiting time is intentionally absent. */
export class ReplayDriver {
  private cursor=0;
  constructor(private data:ReplayData){if(!validReplay(data))throw new Error(replayVersionMessage(data));}
  apply(engine:{frame:number;phase:Phase;inputX:number;inputY:number;viewWidth:number;viewHeight:number;send:(command:GameCommand)=>void}){
    while(this.cursor<this.data.events.length&&this.data.events[this.cursor].frame<=engine.frame){const e=this.data.events[this.cursor];if(e.phase!==engine.phase)return;this.cursor++;if(e.kind==='input'){engine.inputX=e.x;engine.inputY=e.y;}else if(e.kind==='viewport'){engine.viewWidth=e.width;engine.viewHeight=e.height;}else engine.send(e.command);}
  }
}

export function replayVersionMessage(data:unknown){return data&&typeof data==='object'&&'version'in data&&data.version===1?'这是 v2 游戏的旧回放；v3 规则无法保证复现，请使用旧版本查看。':validReplay(data)?'v3 回放 v2 · 规则版本已记录':'回放格式或规则版本不受支持';}
