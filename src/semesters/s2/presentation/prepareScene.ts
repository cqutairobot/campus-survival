import type {GameAudio} from '../../../audio/audio';
import type {LoadProgress} from '../../../assets/loader';
import type {Settings} from '../../../types';
import type {S2RunSnapshot} from '../../types';
import type {Immutable,SemesterRunView} from '../../runtime/contracts';
import {createSemesterTwoRun} from '../createRun';
import {LEGACY_CONTENT,type ContentCatalog} from '../legacy/catalog';
import type {LegacyContentDTO} from '../legacy/rules-adapter';
import {SemesterScene} from './SemesterScene';
import type {Joystick} from './input';
import type {WorldSnapshot} from '../world';

/** Internal host seam for later batches; intentionally absent from the registry.
 * Cancellation tears down simulation, listeners, voices and resource leases. */
export async function prepareSemesterTwoScene(options:{host:HTMLElement;snapshot:S2RunSnapshot;settings:Settings;onStick:(stick:Joystick)=>void;audio?:GameAudio;onLoad?:(p:LoadProgress)=>void;onView?:(v:Immutable<SemesterRunView<LegacyContentDTO>>)=>void;content?:ContentCatalog;world?:WorldSnapshot;signal?:AbortSignal}){
 const {signal}=options,cancelled=()=>new DOMException('Semester preparation cancelled','AbortError');
 if(signal?.aborted)throw cancelled();
 const content=options.content??LEGACY_CONTENT,scene=new SemesterScene(options.host,content,options.settings,options.onStick,options.audio,options.onLoad,options.onView);
 const abort=()=>engine.dispose();
 let engine:ReturnType<typeof createSemesterTwoRun>;
 try{engine=createSemesterTwoRun(options.snapshot,{publish:view=>scene.publish(view),dispose(){signal?.removeEventListener('abort',abort);scene.dispose();}},content,options.world);}
 catch(error){scene.dispose();throw error;}
 scene.attach(engine);signal?.addEventListener('abort',abort,{once:true});
 try{if(signal?.aborted){abort();throw cancelled();}await scene.initialize();if(signal?.aborted)throw cancelled();return{engine,scene};}
 catch(error){engine.dispose();throw error;}
}
