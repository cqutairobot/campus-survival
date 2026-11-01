import type {Immutable,SemesterRunView} from '../../runtime/contracts';
import type {LegacyContentDTO} from '../legacy/rules-adapter';
import type {PauseReason} from '../../runtime/contracts';
import type {Phase} from '../../../types';
export interface SemesterControls {
 read():Immutable<SemesterRunView<LegacyContentDTO>>;
 advance(seconds:number):number;dispatch(command:unknown):boolean;
 pause(reason?:PauseReason):number|null;resume(token:number):boolean;
 enableVisualEvents?():void;acknowledgeVisualEvents?(serial:number):boolean;
}
export function presentationPhase(view:Immutable<Pick<SemesterRunView<{phase:Phase}>,'phase'|'pause'|'content'>>):Phase {
 if(view.phase==='finished')return'result';if(view.pause?.reason==='manual'||view.pause?.reason==='loading')return'paused';
 if(view.content.phase!=='playing')return view.content.phase;
 return view.phase==='assessmentIntro'?'bossIntro':view.phase==='assessmentReward'?'bossDeath':'playing';
}
const MOVEMENT=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
export interface Joystick {active:boolean;x:number;y:number;dx:number;dy:number}
/** Original keyboard/pointer ownership, with plain commands instead of a model. */
export class InputController {
 private keys=new Set<string>();private pointer=-1;private stickX=0;private stickY=0;
 joystick:Joystick={active:false,x:0,y:0,dx:0,dy:0};
 constructor(private element:HTMLElement,private controls:SemesterControls,private changed:(stick:Joystick)=>void){
  window.addEventListener('keydown',this.keyDown);window.addEventListener('keyup',this.keyUp);window.addEventListener('blur',this.blur);window.addEventListener('resize',this.clear);document.addEventListener('visibilitychange',this.visibility);
  element.addEventListener('pointerdown',this.down);element.addEventListener('pointermove',this.move);element.addEventListener('pointerup',this.up);element.addEventListener('pointercancel',this.up);element.addEventListener('lostpointercapture',this.up);
 }
 private keyDown=(e:KeyboardEvent)=>{
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;
  const view=this.controls.read(),phase=presentationPhase(view);
  if(MOVEMENT.has(e.code)){e.preventDefault();if(phase==='playing'){this.keys.add(e.code);this.update();}}
  if(!e.repeat&&e.code==='KeyE'&&phase==='playing'){e.preventDefault();this.clear();this.controls.dispatch({type:'interact'});}
  if(!e.repeat&&(e.code==='Space'||e.code==='KeyQ')){e.preventDefault();if(phase==='playing')this.controls.dispatch({type:'ultimate'});}
  if(!e.repeat&&(e.code==='Escape'||e.code==='KeyP')){e.preventDefault();this.clear();if(view.pause?.reason==='manual')this.controls.resume(view.pause.token);else this.controls.pause('manual');}
  if(!e.repeat&&['Digit1','Digit2','Digit3'].includes(e.code)){
   const index=Number(e.code.slice(-1))-1;
   if(phase==='draft')this.controls.dispatch({type:'choose',index,token:view.content.draftToken});
   if(phase==='reward')this.controls.dispatch({type:'chooseReward',index,token:view.content.rewardToken});
  }
 };
 private keyUp=(e:KeyboardEvent)=>{if(MOVEMENT.has(e.code)){this.keys.delete(e.code);this.update();}};
 private update(){const x=Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft'))+this.stickX,y=Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'))+this.stickY,d=Math.max(1,Math.hypot(x,y));this.controls.dispatch({type:'move',x:x/d,y:y/d});}
 private down=(e:PointerEvent)=>{if(this.pointer>=0||presentationPhase(this.controls.read())!=='playing'||e.button>0)return;e.preventDefault();this.pointer=e.pointerId;try{this.element.setPointerCapture(e.pointerId);}catch{/* Synthetic pointers may have no capture slot. */}const r=this.element.getBoundingClientRect();this.joystick={active:true,x:e.clientX-r.left,y:e.clientY-r.top,dx:0,dy:0};this.changed({...this.joystick});};
 private move=(e:PointerEvent)=>{if(e.pointerId!==this.pointer)return;e.preventDefault();const r=this.element.getBoundingClientRect(),dx=e.clientX-r.left-this.joystick.x,dy=e.clientY-r.top-this.joystick.y,d=Math.hypot(dx,dy),ratio=d<7?0:Math.min(1,(d-7)/43),scale=d>0?ratio/d:0;this.stickX=dx*scale;this.stickY=dy*scale;this.joystick.dx=this.stickX*48;this.joystick.dy=this.stickY*48;this.update();this.changed({...this.joystick});};
 private up=(e:PointerEvent)=>{if(e.pointerId===this.pointer){this.pointer=-1;this.stickX=this.stickY=0;this.joystick.active=false;this.update();this.changed({...this.joystick});}};
 clear=()=>{this.keys.clear();const pointer=this.pointer;this.pointer=-1;if(pointer>=0&&this.element.hasPointerCapture?.(pointer))this.element.releasePointerCapture(pointer);this.stickX=this.stickY=0;this.controls.dispatch({type:'move',x:0,y:0});this.joystick.active=false;this.changed({...this.joystick});};
 private blur=()=>{this.clear();this.controls.pause('manual');};
 private visibility=()=>{if(document.hidden)this.blur();};
 destroy(){this.clear();window.removeEventListener('keydown',this.keyDown);window.removeEventListener('keyup',this.keyUp);window.removeEventListener('blur',this.blur);window.removeEventListener('resize',this.clear);document.removeEventListener('visibilitychange',this.visibility);this.element.removeEventListener('pointerdown',this.down);this.element.removeEventListener('pointermove',this.move);this.element.removeEventListener('pointerup',this.up);this.element.removeEventListener('pointercancel',this.up);this.element.removeEventListener('lostpointercapture',this.up);}
}
