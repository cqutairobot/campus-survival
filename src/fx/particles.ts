import { Container, Particle, ParticleContainer, Sprite } from 'pixi.js';
import { Random, TAU } from '../core/math';
import type { TextureLibrary } from '../render/procedural';
import {SlotPool} from '../core/pool';
import type {FragmentMaterial} from '../types';
export type {FragmentMaterial} from '../types';
export class ParticleFX {
  readonly container:ParticleContainer;
  readonly pool=new SlotPool(32768);
  private particles:Particle[]=[];private life=new Float32Array(32768);private total=new Float32Array(32768);private vx=new Float32Array(32768);private vy=new Float32Array(32768);private scale=new Float32Array(32768);private smoke=new Uint8Array(32768);
  private renderPositions=new Int32Array(32768);private renderSlots:number[]=[];private dirty=false;
  private rng=new Random(869023);limit=8192;recycled=0;
  constructor(private textures:TextureLibrary){
    this.container=new ParticleContainer({dynamicProperties:{position:true,color:true,vertex:true,rotation:true,uvs:true}});this.container.blendMode='add';this.container.texture=textures.get('fragment-spark');
    for(let n=0;n<32768;n++){const p=new Particle({texture:textures.get('fragment-spark'),alpha:0,anchorX:.5,anchorY:.5});this.particles.push(p);}
  }
  burst(x:number,y:number,color:number,count:number,speed:number,size=1,material:FragmentMaterial='spark',converge=false){
    for(let n=0;n<count;n++){
      if(this.pool.active.length>=this.limit){const old=this.pool.active[this.recycled++%this.pool.active.length];this.release(old);}
      const id=this.pool.acquire();if(id<0)break;this.renderPositions[id]=this.renderSlots.length;this.renderSlots.push(id);this.container.particleChildren.push(this.particles[id]);this.dirty=true;const p=this.particles[id],a=this.rng.range(0,TAU),s=this.rng.range(speed*.3,speed);
      p.texture=this.textures.get(`fragment-${material}`);p.x=x+(converge?Math.cos(a)*s*.45:0);p.y=y+(converge?Math.sin(a)*s*.45:0);p.tint=color;p.alpha=1;p.rotation=a;
      this.life[id]=this.total[id]=converge?.45:this.rng.range(.25,.8);this.vx[id]=Math.cos(a)*s*(converge?-1:1);this.vy[id]=Math.sin(a)*s*(converge?-1:1);this.scale[id]=this.rng.range(.25,.7)*size;this.smoke[id]=Number(material==='smoke');
    }
  }
  private release(id:number){const position=this.renderPositions[id],last=this.renderSlots.pop()!,particle=this.container.particleChildren.pop()!;if(last!==id){this.renderSlots[position]=last;this.container.particleChildren[position]=particle;this.renderPositions[last]=position;}this.particles[id].alpha=0;this.pool.release(id);this.dirty=true;}
  update(dt:number){for(let index=this.pool.active.length-1;index>=0;index--){const n=this.pool.active[index],p=this.particles[n];this.life[n]-=dt;if(this.life[n]<=0||index>=this.limit){this.release(n);continue;}const t=Math.max(0,this.life[n]/this.total[n]);p.x+=this.vx[n]*dt;p.y+=this.vy[n]*dt;this.vx[n]*=Math.exp(-dt*2.5);this.vy[n]*=Math.exp(-dt*2.5);p.alpha=t*(this.smoke[n]?.3:1);p.scaleX=this.scale[n]*(this.smoke[n]?2-t:t);p.scaleY=p.scaleX*(this.smoke[n]?1:.55);p.rotation+=dt*2;}if(this.dirty){this.container.update();this.dirty=false;}}
}
interface NumberItem {container:Container;digits:Sprite[];life:number;total:number;x:number;y:number;critical:boolean}
export class DamageNumbers {
  readonly container=new Container();private items:NumberItem[]=[];private cursor=0;limit=80;
  constructor(private textures:TextureLibrary){}
  spawn(value:number,x:number,y:number,critical:boolean){
    const id=this.cursor++%this.limit;let item=this.items[id];
    if(!item){item={container:new Container(),digits:[],life:0,total:.65,x:0,y:0,critical:false};this.items[id]=item;this.container.addChild(item.container);}
    const text=String(Math.min(99999,Math.round(value)));let width=0;
    for(let n=0;n<Math.max(item.digits.length,text.length);n++){
      if(!item.digits[n]){item.digits[n]=new Sprite();item.container.addChild(item.digits[n]);}
      const digit=item.digits[n];digit.visible=n<text.length;if(!digit.visible)continue;
      digit.texture=this.textures.get(`digit-${text[n]}`);digit.x=width;digit.tint=critical?0xffda79:0xfffbdf;width+=digit.texture.width*.8;
    }
    item.x=x-width*.25;item.y=y;item.life=item.total=.6;item.critical=critical;
  }
  update(dt:number){for(const item of this.items){if(!item)continue;item.life-=dt;item.container.visible=item.life>0;if(item.life<=0)continue;const t=1-item.life/item.total;item.container.position.set(item.x,item.y-t*42);item.container.alpha=Math.min(1,item.life*5);const bounce=1+Math.sin(Math.min(1,t*4)*Math.PI)*.25;item.container.scale.set((item.critical?.78:.56)*bounce);}}
}
