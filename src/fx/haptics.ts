import type {VisualEvent} from '../types';
/** Capability and user activation are checked at the event boundary. */
export class Haptics {
  private last=-Infinity;
  event(event:VisualEvent,enabled:boolean,now:number) {
    if(!enabled||typeof navigator==='undefined'||typeof navigator.vibrate!=='function'||navigator.userActivation?.hasBeenActive===false||now-this.last<200)return;
    const pulse=event.type==='ultimate'||event.type==='fusion'?[18,35,28]:event.type==='charged'?20:event.type==='shieldBreak'?14:event.type==='evolution'?[12,35,18]:event.type==='hurt'?25:event.type==='level'?20:event.type==='death'&&event.priority?12:0;
    if(!pulse)return;this.last=now;try{navigator.vibrate(pulse);}catch{/* Unsupported devices retain audio and visual feedback. */}
  }
}
