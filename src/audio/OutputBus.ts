import type {Settings} from '../types';
export type OutputPreset='full'|'phone';
export function resolveAudioPreset(preset:Settings['audioPreset'],coarse:boolean,shortSide:number):OutputPreset{
 return preset==='full'||preset==='phone'?preset:coarse&&shortSide<=600?'phone':'full';
}
export const OUTPUT_PROFILES={
 full:{highpass:25,shelf:0,threshold:-12,ratio:1},
 phone:{highpass:150,shelf:-3,threshold:-20,ratio:3},
} as const;
/** Shared by music, samples and ZzFX. No private Howler nodes are inspected. */
export class OutputBus {
 private highpass:BiquadFilterNode;private shelf:BiquadFilterNode;private compressor:DynamicsCompressorNode;private limiter:DynamicsCompressorNode;
 preset:OutputPreset='full';
 constructor(private ctx:AudioContext,private input:GainNode){
  this.highpass=ctx.createBiquadFilter();this.highpass.type='highpass';this.highpass.Q.value=.7;
  this.shelf=ctx.createBiquadFilter();this.shelf.type='highshelf';this.shelf.frequency.value=3200;
  this.compressor=ctx.createDynamicsCompressor();this.compressor.attack.value=.008;this.compressor.release.value=.16;this.compressor.knee.value=12;
  this.limiter=ctx.createDynamicsCompressor();this.limiter.threshold.value=-3;this.limiter.knee.value=0;this.limiter.ratio.value=20;this.limiter.attack.value=.002;this.limiter.release.value=.12;
  input.disconnect();input.connect(this.highpass);this.highpass.connect(this.shelf);this.shelf.connect(this.compressor);this.compressor.connect(this.limiter);this.limiter.connect(ctx.destination);
 }
 apply(preset:Settings['audioPreset']){
  this.preset=resolveAudioPreset(preset,matchMedia('(pointer: coarse)').matches,Math.min(screen.width,screen.height));const p=OUTPUT_PROFILES[this.preset],at=this.ctx.currentTime;
  this.highpass.frequency.setTargetAtTime(p.highpass,at,.04);this.shelf.gain.setTargetAtTime(p.shelf,at,.04);this.compressor.threshold.setTargetAtTime(p.threshold,at,.04);this.compressor.ratio.setTargetAtTime(p.ratio,at,.04);
 }
 destroy(){this.input.disconnect();for(const node of [this.highpass,this.shelf,this.compressor,this.limiter])node.disconnect();this.input.connect(this.ctx.destination);}
}
