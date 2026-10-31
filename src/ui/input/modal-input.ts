import type {GameCommand,Phase} from '../../types';
const GAME_KEYS=new Set(['Escape','KeyP','KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyQ','KeyE','Digit1','Digit2','Digit3']);
/** Stop propagation after controls handle keys; their default action stays available. */
export const blocksGameKey=(code:string)=>GAME_KEYS.has(code);
interface ModalSession {engine:{phase:Phase;send:(command:GameCommand)=>void};scene:{clearUIInput:()=>void}}
export class ModalPauseOwner<T extends ModalSession>{
 private owner:T|null=null;private paused=false;
 open(session:T|null){
  session?.scene.clearUIInput();if(this.owner)return;
  this.owner=session;this.paused=!!session&&!['paused','result','menu'].includes(session.engine.phase);
  if(this.paused)session!.engine.send({type:'pause'});
 }
 close(session:T|null){
  const resume=this.paused&&this.owner===session&&session?.engine.phase!=='result';this.clear();
  if(resume)session!.engine.send({type:'resume'});
 }
 clear(){this.owner=null;this.paused=false;}
}
