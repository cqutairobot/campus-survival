import type { GameEngine } from './engine';
const MOVEMENT=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
export interface Joystick {active:boolean;x:number;y:number;dx:number;dy:number}
export class InputController {
  private keys=new Set<string>();private pointer=-1;private stickX=0;private stickY=0;
  joystick:Joystick={active:false,x:0,y:0,dx:0,dy:0};
  constructor(private element:HTMLElement,private game:GameEngine,private changed:(stick:Joystick)=>void){
    window.addEventListener('keydown',this.keyDown);window.addEventListener('keyup',this.keyUp);
    window.addEventListener('blur',this.blur);window.addEventListener('resize',this.clear);document.addEventListener('visibilitychange',this.visibility);
    element.addEventListener('pointerdown',this.down);element.addEventListener('pointermove',this.move);element.addEventListener('pointerup',this.up);element.addEventListener('pointercancel',this.up);element.addEventListener('lostpointercapture',this.up);
  }
  private keyDown=(e:KeyboardEvent)=>{
    if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;
    if(MOVEMENT.has(e.code)){e.preventDefault();if(this.game.phase==='playing'){this.keys.add(e.code);this.update();}}
    if(!e.repeat&&(e.code==='Space'||e.code==='KeyQ')){e.preventDefault();this.game.send({type:'ultimate'});}
    if(!e.repeat&&e.code==='KeyE'){e.preventDefault();this.game.send({type:'interact',held:true});}
    if(!e.repeat&&(e.code==='Escape'||e.code==='KeyP')){e.preventDefault();this.game.send({type:this.game.phase==='paused'?'resume':'pause'});this.clear();}
    if(!e.repeat&&['reward','contract'].includes(this.game.phase)&&['Digit1','Digit2','Digit3'].includes(e.code))this.game.send({type:'chooseReward',token:this.game.rewards.token,index:Number(e.code.slice(-1))-1});
    if(!e.repeat&&this.game.phase==='draft'&&['Digit1','Digit2','Digit3'].includes(e.code))this.game.send({type:'choose',index:Number(e.code.slice(-1))-1,token:this.game.draftToken});
  };
  private keyUp=(e:KeyboardEvent)=>{if(e.code==='KeyE')this.game.send({type:'interact',held:false});if(MOVEMENT.has(e.code)){this.keys.delete(e.code);this.update();}};
  private update(){
    const x=Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft'))+this.stickX;
    const y=Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'))+this.stickY;
    const d=Math.max(1,Math.hypot(x,y));this.game.inputX=x/d;this.game.inputY=y/d;
  }
  private down=(e:PointerEvent)=>{if(this.pointer>=0||this.game.phase!=='playing'||e.button>0)return;e.preventDefault();this.pointer=e.pointerId;try{this.element.setPointerCapture(e.pointerId);}catch{/* Synthetic pointers may not own a capture slot. */}const r=this.element.getBoundingClientRect();this.joystick={active:true,x:e.clientX-r.left,y:e.clientY-r.top,dx:0,dy:0};this.changed({...this.joystick});};
  private move=(e:PointerEvent)=>{if(e.pointerId!==this.pointer)return;e.preventDefault();const r=this.element.getBoundingClientRect(),dx=e.clientX-r.left-this.joystick.x,dy=e.clientY-r.top-this.joystick.y,d=Math.hypot(dx,dy),ratio=d<7?0:Math.min(1,(d-7)/43),scale=d>0?ratio/d:0;this.stickX=dx*scale;this.stickY=dy*scale;this.joystick.dx=this.stickX*48;this.joystick.dy=this.stickY*48;this.update();this.changed({...this.joystick});};
  private up=(e:PointerEvent)=>{if(e.pointerId===this.pointer){this.pointer=-1;this.stickX=this.stickY=0;this.joystick.active=false;this.update();this.changed({...this.joystick});}};
  clear=()=>{this.game.landmarks.held=false;this.game.landmarks.channel=0;this.keys.clear();const pointer=this.pointer;this.pointer=-1;if(pointer>=0&&this.element.hasPointerCapture?.(pointer))this.element.releasePointerCapture(pointer);this.stickX=this.stickY=0;this.game.inputX=this.game.inputY=0;this.joystick.active=false;this.changed({...this.joystick});};
  private blur=()=>{this.clear();if(this.game.phase!=='result')this.game.send({type:'pause'});};
  private visibility=()=>{if(document.hidden)this.blur();};
  destroy(){this.clear();window.removeEventListener('keydown',this.keyDown);window.removeEventListener('keyup',this.keyUp);window.removeEventListener('blur',this.blur);window.removeEventListener('resize',this.clear);document.removeEventListener('visibilitychange',this.visibility);this.element.removeEventListener('pointerdown',this.down);this.element.removeEventListener('pointermove',this.move);this.element.removeEventListener('pointerup',this.up);this.element.removeEventListener('pointercancel',this.up);this.element.removeEventListener('lostpointercapture',this.up);}
}
