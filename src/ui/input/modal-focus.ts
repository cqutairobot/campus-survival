import {blocksGameKey} from './modal-input';

const stack:ModalFocus[]=[];
export const nativeKeyTarget=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('button,input,select,textarea,a[href],summary,[contenteditable="true"]');
/** A shared focus owner for React and DOM panels, including nested settings. */
export class ModalFocus {
 private previous:HTMLElement|null=null;private opened=false;
 constructor(private root:HTMLElement,private escape?:()=>void,private priority=20){}
 get top(){return stack.at(-1)===this;}
 private focusable(){return [...this.root.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],summary,[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length>0);}
 refresh(){if(this.top&&!this.root.contains(document.activeElement))(this.focusable()[0]??this.root).focus();}
 open(){if(this.opened){this.refresh();return;}this.opened=true;this.previous=document.activeElement as HTMLElement|null;this.root.tabIndex=-1;this.root.setAttribute('aria-modal','true');stack.push(this);stack.sort((a,b)=>a.priority-b.priority);window.addEventListener('keydown',this.key,true);document.addEventListener('focusin',this.focus,true);this.refresh();}
 private focus=()=>{this.refresh();};
 private key=(event:KeyboardEvent)=>{
  if(!this.top)return;
  if(blocksGameKey(event.code))event.stopPropagation();
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)this.escape?.();return;}
  if(event.key!=='Tab')return;
  const controls=this.focusable(),first=controls[0],last=controls.at(-1),active=document.activeElement;
  if(!first){event.preventDefault();this.root.focus();return;}
  if(event.shiftKey&&(active===first||active===this.root||!this.root.contains(active))){event.preventDefault();last!.focus();}
  else if(!event.shiftKey&&(active===last||active===this.root||!this.root.contains(active))){event.preventDefault();first.focus();}
 };
 close(){if(!this.opened)return;const top=this.top;this.opened=false;stack.splice(stack.indexOf(this),1);window.removeEventListener('keydown',this.key,true);document.removeEventListener('focusin',this.focus,true);this.root.removeAttribute('aria-modal');if(top){if(this.previous?.isConnected)this.previous.focus();stack.at(-1)?.refresh();}this.previous=null;}
}
