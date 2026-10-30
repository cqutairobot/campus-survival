import {Texture,Rectangle} from 'pixi.js';
import {TextureLibrary} from './procedural';
import {characterArt,enemyArt,itemArt,propArt,uiArt} from '../assets/bindings';
import {resources} from '../assets/loader';
import type {ArtId} from '../assets/manifest';
import {ENEMIES} from '../data/catalog';
/** External art never enters TextureLibrary's ownership or destroy path. */
export class TextureCatalog {
  private fragments=new Map<string,Texture>();
  constructor(private geometry:TextureLibrary,private art:Map<ArtId,Texture>,private character:string){}
  external(id:ArtId){return resources.isMissing(id)?undefined:this.art.get(id);}
  get(id:string){
    if(id.startsWith('fragment-')&&!resources.isMissing('particles')){
      const atlas=this.art.get('particles'),names=['spark','paper','key','code','smoke','ice','glass','metal','blueprint','brick'];
      if(atlas&&names.includes(id.slice(9))){let frame=this.fragments.get(id);if(!frame){frame=new Texture({source:atlas.source,frame:new Rectangle(names.indexOf(id.slice(9))*24,0,24,24)});this.fragments.set(id,frame);}return frame;}
    }
    let key:ArtId|undefined;
    if(id==='player')key=characterArt[this.character]?.sprite;
    const match=/^enemy-(\d+)(-white)?$/.exec(id);
    if(match){const binding=enemyArt[ENEMIES[Number(match[1])]?.id];key=match[2]?binding?.white:binding?.sprite;}
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
