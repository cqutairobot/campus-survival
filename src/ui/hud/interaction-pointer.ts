interface CaptureTarget {setPointerCapture:(id:number)=>void;hasPointerCapture:(id:number)=>boolean;releasePointerCapture:(id:number)=>void}
/** Own only the interaction pointer, never the movement joystick. */
export class InteractionPointer {
 private id:number|null=null;private target:CaptureTarget|null=null;
 constructor(private held:(value:boolean)=>void){}
 press(id:number,target:CaptureTarget){
  if(this.id!==null)return false;this.id=id;this.target=target;
  try{target.setPointerCapture(id);}catch{/* The native pointer may have already ended. */}
  this.held(true);return true;
 }
 release(id?:number){
  if(this.id===null||id!==undefined&&id!==this.id)return;
  const pointer=this.id,target=this.target;this.id=null;this.target=null;this.held(false);
  try{if(target?.hasPointerCapture(pointer))target.releasePointerCapture(pointer);}catch{/* Lost capture and unmount are idempotent. */}
 }
}
