// P04 bounded presentation port; external textures retain lease ownership.
import type {ContentCatalog} from '../legacy/catalog';
import {Texture,Rectangle} from 'pixi.js';
import {TextureLibrary} from './procedural';
import {characterArt,enemyArt,itemArt,propArt,uiArt} from '../../../assets/bindings';
import {resources} from '../../../assets/loader';
import type {ResourceId} from '../../../assets/manifest';
import {S2_ART_BINDINGS,S2_ART_FRAMES} from './art-manifest';
const bindings=S2_ART_BINDINGS as Record<string,{icon:ResourceId;detail?:ResourceId;kind:string}>;
const frames=S2_ART_FRAMES as Record<string,{atlas:ResourceId;whiteAtlas?:ResourceId;frame:readonly number[];white?:readonly number[];kind:string}>;
/** External art never enters TextureLibrary's ownership or destroy path. */
export class TextureCatalog {
  private fragments=new Map<string,Texture>();
  constructor(private geometry:Pick<TextureLibrary,'get'>,private art:Map<ResourceId,Texture>,private character:string,private content:ContentCatalog){}
  external(id:ResourceId){return resources.isMissing(id)?undefined:this.art.get(id);}
  frameTexture(id:string,white=false){const frame=frames[id];if(!frame)return;const atlas=this.external(white&&frame.whiteAtlas?frame.whiteAtlas:frame.atlas),rect=white?frame.white:frame.frame;if(!atlas||!rect)return;const key=`s2:${id}:${white}`;let texture=this.fragments.get(key);if(!texture||texture.source!==atlas.source){texture?.destroy(false);texture=new Texture({source:atlas.source,frame:new Rectangle(rect[0],rect[1],rect[2],rect[3])});this.fragments.set(key,texture);}return texture;}
  building(id:string){const binding=bindings[id];return binding?.kind==='building'?this.external(binding.icon):undefined;}
  get(id:string){
    const enemy=/^enemy-(.+?)(-white)?$/.exec(id),s2=enemy?this.frameTexture(enemy[1],!!enemy[2]):this.frameTexture(id);if(s2)return s2;
    if(id.startsWith('fragment-')){
      const atlas=this.external('s2:particle-atlas')??this.external('particles'),names=['spark','paper','key','code','smoke','ice','glass','metal','blueprint','brick'];
      if(atlas&&atlas.width>=names.length*24&&atlas.height>=24&&names.includes(id.slice(9))){let frame=this.fragments.get(id);if(!frame||frame.source!==atlas.source){frame?.destroy(false);frame=new Texture({source:atlas.source,frame:new Rectangle(names.indexOf(id.slice(9))*24,0,24,24)});this.fragments.set(id,frame);}return frame;}
    }
    let key:ResourceId|undefined;
    if(id==='player')key=characterArt[this.character]?.sprite;
    const match=/^enemy-(.+?)(-white)?$/.exec(id);
    if(match){const binding=enemyArt[this.content.enemyById[match[1]]?.id];key=match[2]?binding?.white:binding?.sprite;}
    if(id==='paper')key='paperBlade';
    if(id==='book')key='fxBook';
    if(id==='bot')key='fxRobot';
    if(id==='ppt')key='fxSlides';
    if(id==='shuttle')key='fxShuttle';
    if(id==='code')key=itemArt.code;
    if(id==='tree'||id==='bench'||id==='planter')key=propArt[id];
    if(['heal','magnet','bomb','freeze','shield','coffeeBoost','energy'].includes(id))key=itemArt[id];
    if(id==='chest')key=uiArt['chest-closed'];
    if(key&&!resources.isMissing(key)){const texture=this.art.get(key);if(texture)return texture;}
    return this.geometry.get(id);
  }
  destroy(){for(const texture of this.fragments.values())texture.destroy(false);this.fragments.clear();}
}
