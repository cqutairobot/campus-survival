// P04 bounded presentation port; external textures retain lease ownership.
import type {ContentCatalog} from '../legacy/catalog';
import { Application, ColorMatrixFilter, Container, Graphics, Text, Texture, Rectangle } from 'pixi.js';
import type {WorldBuilding,WorldSnapshot} from '../world';
import smartTeaching from './placeholders/smart-teaching.svg?raw';
import jointLab from './placeholders/joint-lab.svg?raw';
import exhibitHall from './placeholders/exhibit-hall.svg?raw';
const placeholders={smartTeaching,jointLab,exhibitHall};
const INK=0x324c43;
const line={color:INK,width:2.6};
export class TextureLibrary {
  readonly textures=new Map<string,Texture>();
  constructor(private app:Application,private content:ContentCatalog,private world:WorldSnapshot){this.create();}
  get(id:string){return this.textures.get(id)??this.textures.get(id.startsWith('enemy-')?`enemy-${this.content.enemies[0].id}`:'bullet')!;}
  private bake(id:string,size:number,draw:(g:Graphics,c:Container)=>void){
    const c=new Container(),g=new Graphics();g.rect(0,0,size,size).fill({color:0xffffff,alpha:0});c.addChild(g);draw(g,c);
    const texture=this.app.renderer.generateTexture({target:c,resolution:1.5});this.textures.set(id,texture);
    if(id.startsWith('enemy-')){
      const white=new ColorMatrixFilter();white.matrix=[0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0];c.filters=[white];
      this.textures.set(`${id}-white`,this.app.renderer.generateTexture({target:c,resolution:1.5}));c.filters=[];
      // A baking pass can be the renderer's last filter use when the map is
      // paused. Release its pooled input before application/texture teardown.
      for(const group of Object.values(white.groups))for(const [binding,resource] of Object.entries(group.resources)){
        if(resource?._resourceType==='textureSource')group.setResource(Texture.WHITE.source,Number(binding));
        else if(resource?._resourceType==='textureSampler')group.setResource(Texture.WHITE.source.style,Number(binding));
      }
      white.destroy();
    }
    c.destroy({children:true});return texture;
  }
  private label(c:Container,text:string,x:number,y:number,size:number,color:number){const t=new Text({text,style:{fontFamily:'Arial, "PingFang SC", sans-serif',fontSize:size,fontWeight:'bold',fill:color}});t.anchor.set(.5);t.position.set(x,y);c.addChild(t);}
  private create(){
    this.bake('player',96,g=>{
      g.ellipse(48,78,23,8).fill({color:INK,alpha:.12});
      g.roundRect(29,50,37,27,12).fill(0x64a88d).stroke(line);
      g.roundRect(57,48,12,23,5).fill(0xd6ae72).stroke(line);
      g.roundRect(33,71,12,10,4).fill(0x45615a).stroke(line);g.roundRect(51,71,12,10,4).fill(0x45615a).stroke(line);
      g.circle(47,39,22).fill(0xf6d6b3).stroke(line);
      g.moveTo(26,36).quadraticCurveTo(23,12,46,15).quadraticCurveTo(72,14,69,37).lineTo(62,29).lineTo(55,32).lineTo(48,25).lineTo(34,34).closePath().fill(0x47584b).stroke(line);
      g.circle(39,41,2.2).fill(INK);g.circle(55,41,2.2).fill(INK);
      g.moveTo(44,48).quadraticCurveTo(48,52,52,48).stroke({color:INK,width:1.6});
      g.ellipse(32,45,4,2.4).fill({color:0xdf9c87,alpha:.5});g.ellipse(62,45,4,2.4).fill({color:0xdf9c87,alpha:.5});
      g.moveTo(19,19).lineTo(47,7).lineTo(76,19).lineTo(47,31).closePath().fill(0x365b4c).stroke(line);
      g.moveTo(71,20).lineTo(71,35).stroke({color:0xe3bd67,width:2.5});g.circle(71,37,3).fill(0xe3bd67);
      g.roundRect(20,53,12,18,4).fill(0xf5dfac).stroke(line);
    });
    this.content.enemies.forEach(def=>this.bake(`enemy-${def.id}`,96,(g,c)=>{
      const color=parseInt(def.color.slice(1),16),boss=def.rank==='boss'||def.rank==='miniBoss',elite=def.id==='ddl';
      g.ellipse(48,78,24,7).fill({color:INK,alpha:.12});
      if(def.id==='s2:bike'){
        for(const x of [23,73])g.circle(x,68,15).fill(0x344d55).stroke({color:0xfff2ce,width:3}).circle(x,68,7).stroke({color:0x9dc3c6,width:2});
        g.poly([23,65,39,39,57,65,23,65,50,47,73,65,63,30]).stroke({color,width:6});
        g.roundRect(10,23,31,27,4).fill(color).stroke(line);g.rect(22,24,7,25).fill(0xfff2ce);
        g.moveTo(61,30).lineTo(77,27).moveTo(43,38).lineTo(55,38).stroke({color:INK,width:4});
        g.poly([49,12,65,12,65,5,82,18,65,31,65,23,49,23]).fill(0xffd166).stroke({color:INK,width:2});return;
      }
      if(def.id==='s2:reservation'){
        g.poly([29,15,66,15,79,80,68,80,57,28,39,28,28,80,17,80]).fill(0x336174).stroke(line);
        g.roundRect(24,18,48,45,5).fill(color).stroke({color:0xeaffff,width:3});
        g.circle(48,40,15).fill(0xeaffff);g.moveTo(48,29).lineTo(48,40).lineTo(58,45).stroke({color:0x336174,width:3});
        g.moveTo(23,70).lineTo(73,70).stroke({color:0xf4d889,width:6});return;
      }
      if(def.id==='s2:parceler'){
        g.roundRect(24,42,48,32,9).fill(color).stroke(line);g.circle(47,29,18).fill(0xf1d5b0).stroke(line);
        g.roundRect(25,10,46,13,5).fill(color).stroke(line);g.circle(40,31,2).fill(INK);g.circle(54,31,2).fill(INK);
        g.roundRect(48,45,34,29,3).fill(0xc99455).stroke({color:0xffefc6,width:3});g.rect(61,46,7,26).fill(0xffefc6);
        g.moveTo(31,75).lineTo(26,84).moveTo(60,75).lineTo(65,84).stroke({color:INK,width:6});return;
      }
      if(def.id==='s2:proposalBoard'){
        g.moveTo(23,55).lineTo(17,84).moveTo(73,55).lineTo(79,84).stroke({color:INK,width:6});
        g.roundRect(9,15,78,52,7).fill(0x3d6374).stroke({color,width:5});g.roundRect(15,20,66,11,3).fill(color);
        for(const x of [29,48,67]){g.circle(x,39,6).fill(0xf2d2a3).stroke({color:INK,width:1.5});g.roundRect(x-7,46,14,16,2).fill(0xf9e6bc).stroke({color:INK,width:1.5});g.moveTo(x-3,51).lineTo(x+4,51).moveTo(x-3,56).lineTo(x+2,56).stroke({color:0x557c85,width:1.5});}
        g.poly([34,73,53,73,53,67,68,78,53,89,53,83,34,83]).fill(color).stroke({color:INK,width:2});
        g.circle(13,18,7).fill(0xf9e6bc).stroke({color:INK,width:2});g.moveTo(13,13).lineTo(13,18).lineTo(17,20).stroke({color:INK,width:2});return;
      }
      if(def.id==='s2:dispatcher'){
        g.roundRect(22,42,50,37,8).fill(0x3d6374).stroke({color,width:4});g.poly([30,44,42,44,42,77,30,77,54,44,65,44,65,77,54,77]).fill(color);
        g.circle(47,28,18).fill(0xf2d2a3).stroke(line);g.roundRect(24,8,48,14,4).fill(color).stroke(line);
        g.circle(40,30,2.4).fill(INK);g.circle(54,30,2.4).fill(INK);g.moveTo(66,25).lineTo(71,39).lineTo(58,39).stroke({color:INK,width:3});
        g.roundRect(73,41,14,28,3).fill(INK).stroke({color:0xffe3a3,width:2});g.moveTo(79,41).lineTo(79,27).stroke({color:INK,width:3});
        g.moveTo(32,80).lineTo(28,87).moveTo(60,80).lineTo(64,87).stroke({color:INK,width:6});return;
      }
      if(['s2:peer','s2:relay','s2:recycler','s2:marshal','s2:coordinator','s2:auditor'].includes(def.id)){
        if(def.id==='s2:relay'){g.poly([48,5,79,23,69,80,27,80,17,23]).fill(0x425867).stroke({color,width:5});g.circle(48,30,12).stroke({color:0xffe4a3,width:4});g.moveTo(48,42).lineTo(48,67).stroke({color,width:6});}
        else if(def.id==='s2:peer'){for(const x of [29,67]){g.circle(x,28,14).fill(color).stroke(line);g.roundRect(x-13,44,26,32,5).fill(0xe9d6aa).stroke(line);}g.moveTo(38,52).lineTo(58,52).stroke({color:0xcbb56b,width:5});}
        else if(def.id==='s2:recycler'){g.roundRect(16,37,64,40,8).fill(color).stroke(line);for(const x of [27,69])g.circle(x,77,10).fill(INK);g.poly([32,19,58,19,69,37,25,37]).fill(0xe8dab2).stroke(line);g.moveTo(31,50).lineTo(65,50).lineTo(58,64).stroke({color:INK,width:4});}
        else{g.circle(48,23,17).fill(0xf2d2a3).stroke(line);g.roundRect(22,43,52,38,7).fill(color).stroke(line);if(def.id==='s2:marshal')g.moveTo(10,39).lineTo(86,39).moveTo(17,31).lineTo(17,76).moveTo(79,31).lineTo(79,76).stroke({color:0xffe4a3,width:6});else if(def.id==='s2:coordinator'){for(const x of [14,82])g.rect(x-6,54,12,17).fill(0xcbb56b).stroke(line);g.moveTo(20,61).lineTo(76,61).stroke({color:0xffe4a3,width:3});}else g.roundRect(54,39,29,36,3).fill(0xffe4a3).stroke(line).moveTo(60,49).lineTo(77,49).moveTo(60,58).lineTo(77,58).stroke(line);}
        return;
      }
      if(elite){g.circle(48,45,29).fill(color).stroke(line);g.circle(48,45,23).fill(0xf8d6bf).stroke(line);g.moveTo(48,28).lineTo(48,44).lineTo(59,49).stroke({color:INK,width:3});this.label(c,'DDL',48,68,11,INK);}
      else if(def.id==='receipt'){g.moveTo(25,17).lineTo(32,21).lineTo(40,17).lineTo(48,21).lineTo(56,17).lineTo(64,21).lineTo(71,17).lineTo(71,76).lineTo(63,72).lineTo(55,76).lineTo(47,72).lineTo(39,76).lineTo(31,72).lineTo(25,76).closePath().fill(0xf2e7cf).stroke(line);g.roundRect(30,23,36,8,2).fill(color);this.label(c,'¥',48,41,14,INK);}
      else if(def.id==='checkin'){g.circle(48,45,27).fill(color).stroke(line);g.circle(48,45,21).fill(0xffedb2).stroke({color:INK,width:1.5});g.moveTo(36,41).lineTo(44,49).lineTo(60,32).stroke({color:INK,width:3});}
      else if(def.id==='advisor'){g.roundRect(25,27,46,47,13).fill(color).stroke(line);g.circle(48,29,20).fill(0xedd2b4).stroke(line);g.roundRect(29,20,17,10,3).stroke(line);g.roundRect(49,20,17,10,3).stroke(line);g.moveTo(46,25).lineTo(49,25).stroke(line);}
      else {
        g.roundRect(24,boss?17:21,48,boss?61:53,7).fill(color).stroke(line);
        g.moveTo(31,28).lineTo(64,28).stroke({color:0xfff7e9,width:2});
        if(def.id==='ppt'){g.roundRect(30,31,36,23,3).fill(0xfff1d6).stroke({color:INK,width:1.5});g.rect(34,42,6,8).fill(color);g.rect(44,36,6,14).fill(color);g.rect(54,39,6,11).fill(color);}
        else {g.moveTo(32,34).lineTo(53,34).moveTo(32,39).lineTo(62,39).stroke({color:INK,width:1.5,alpha:.45});}
        if(boss){g.moveTo(25,20).lineTo(22,7).lineTo(36,13).lineTo(48,4).lineTo(60,13).lineTo(74,7).lineTo(71,20).closePath().fill(0xe8c46a).stroke(line);this.label(c,def.id==='proposal'?'开题':def.id==='defense'?'答辩':def.id==='finals'?'期末':def.id==='inspector'?'验收':'组长',48,34,10,INK);}
        if(def.behavior==='exam')this.label(c,({math:'∑',english:'A',coding:'</>',mechanics:'△'} as Record<string,string>)[def.id],48,36,14,INK);
        if(['thrower','charger','splitter','bomber','summoner','guard','leader','node','examCharger'].includes(def.id)){const glyph:Record<string,string>={thrower:'投',charger:'早8',splitter:'×2',bomber:'!',summoner:'召',guard:'盾',leader:'↑',node:'◇',examCharger:'考'};this.label(c,glyph[def.id],48,36,14,INK);if(def.id==='guard'||def.id==='node')g.poly([48,10,76,27,70,65,48,82,26,65,20,27]).stroke({color:0x79ccce,width:4});if(def.id==='splitter')g.roundRect(18,15,45,54,6).stroke({color:0xf8f9e5,width:2,alpha:.8});if(def.id==='charger'||def.id==='examCharger')g.poly([48,5,58,18,48,15,38,18]).fill(0xffe0a1);if(def.id==='leader')g.moveTo(74,20).lineTo(74,70).moveTo(74,20).lineTo(92,28).lineTo(74,35).stroke({color:0xf5d98d,width:3});}
      }
      if(def.id!=='checkin'&&def.id!=='advisor'){const eyeY=def.id==='ddl'?58:55;g.circle(39,eyeY,2.8).fill(INK);g.circle(57,eyeY,2.8).fill(INK);g.moveTo(44,eyeY+8).quadraticCurveTo(48,eyeY+5,52,eyeY+8).stroke({color:INK,width:1.5});}
      g.moveTo(34,76).lineTo(30,81).moveTo(62,76).lineTo(66,81).stroke({color:INK,width:3});
    }));
    this.bake('enemy-s2:parcel',96,g=>{
      g.ellipse(48,76,24,7).fill({color:INK,alpha:.14});g.poly([19,29,48,14,77,29,77,64,48,81,19,64]).fill(0xc99455).stroke({color:INK,width:4});
      g.poly([19,29,48,45,77,29,48,14]).fill(0xf0cf8f).stroke({color:INK,width:3});g.moveTo(48,45).lineTo(48,81).stroke({color:INK,width:3});
      g.poly([34,21,64,37,64,49,57,53,57,41,27,25]).fill(0xfff2ce);g.roundRect(23,45,16,12,2).fill(0xfff2ce);
    });
    this.bake('paper',40,g=>{g.moveTo(3,19).lineTo(36,6).lineTo(26,35).lineTo(20,23).closePath().fill(0xfffcdf).stroke({color:0x3a897c,width:2});g.moveTo(20,23).lineTo(36,6).stroke({color:0x3a897c,width:1.4});});
    this.bake('book',40,g=>{g.roundRect(8,5,24,30,4).fill(0x5cae9e).stroke({color:INK,width:2});g.rect(12,9,16,23).fill(0xfff0cf);g.moveTo(15,15).lineTo(25,15).moveTo(15,20).lineTo(23,20).stroke({color:0x75b19c,width:2});});
    this.bake('code',40,(g,c)=>{g.roundRect(4,7,32,26,7).fill(0x7f9dd9).stroke({color:0x4d678b,width:1.8});this.label(c,'<>',20,20,17,0xffffff);});
    this.bake('ppt',40,g=>{g.roundRect(5,4,30,32,4).fill(0xf0b8a0).stroke({color:INK,width:2});g.roundRect(10,10,20,16,2).fill(0xfff3d5);g.moveTo(12,31).lineTo(28,31).stroke({color:INK,width:2});});
    this.bake('bot',56,g=>{g.ellipse(28,45,18,5).fill({color:INK,alpha:.1});g.roundRect(11,17,34,25,9).fill(0xe3e8cd).stroke({color:INK,width:2});g.roundRect(16,23,24,11,4).fill(0x396b60);g.circle(22,28,2).fill(0x7ce8ba);g.circle(34,28,2).fill(0x7ce8ba);g.moveTo(28,17).lineTo(28,10).stroke({color:INK,width:2});g.circle(28,8,3).fill(0xe9b65d);g.moveTo(8,27).lineTo(4,33).moveTo(48,27).lineTo(52,33).stroke({color:INK,width:3});});
    this.bake('staple',24,g=>{g.moveTo(6,18).lineTo(6,6).lineTo(18,6).lineTo(18,18).stroke({color:0x657b86,width:3});});
    this.bake('shuttle',40,g=>{g.poly([17,30,6,4,20,12,34,4,23,30]).fill(0xfffae8).stroke({color:0xc7b47e,width:2});g.roundRect(15,28,10,8,4).fill(0xdec28a);g.moveTo(12,7).lineTo(19,29).moveTo(28,7).lineTo(21,29).stroke({color:0xc7b47e,width:1});});
    this.bake('enemyBullet',24,g=>{g.circle(12,12,10).fill({color:0xe96b79,alpha:.17});g.circle(12,12,6).fill(0xeb6f7c).stroke({color:0xaa4856,width:1.3});g.circle(10,10,2.3).fill(0xffe8d8);});
    this.bake('bullet',20,g=>{g.ellipse(10,10,8,4).fill(0x61c3aa);g.ellipse(10,10,5,2).fill(0xe6ffe2);});
    this.bake('xp',32,g=>{g.moveTo(16,4).lineTo(26,16).lineTo(16,28).lineTo(6,16).closePath().fill(0x4db8a3).stroke({color:0x338c7b,width:1.5});g.moveTo(16,7).lineTo(16,23).lineTo(9,16).closePath().fill(0x9ce1bf);});
    this.bake('heal',40,(g,c)=>{g.roundRect(12,6,16,29,4).fill(0xd87973).stroke({color:INK,width:2});g.rect(12,8,16,5).fill(0xc4d3c1);g.rect(12,18,16,10).fill(0xe9d18c);this.label(c,'+',20,23,14,INK);});
    this.bake('magnet',40,g=>{g.moveTo(10,9).lineTo(10,23).quadraticCurveTo(10,37,20,37).quadraticCurveTo(30,37,30,23).lineTo(30,9).stroke({color:0x8d83b8,width:9});g.rect(6,4,8,9).fill(0xe5d9f3);g.rect(26,4,8,9).fill(0xe5d9f3);});
    this.bake('bomb',40,(g,c)=>{g.roundRect(8,4,25,32,4).fill(0xf4d07b).stroke({color:INK,width:2});this.label(c,'!',20,21,23,INK);});
    for(const p of this.content.pickups.filter(p=>['freeze','shield','coffeeBoost','energy'].includes(p.id)))this.bake(p.id,40,(g,c)=>{const color=parseInt(p.color.slice(1),16);if(p.id==='freeze'){g.circle(20,20,15).fill(0xe8f6fa).stroke({color,width:3});g.moveTo(20,9).lineTo(20,20).lineTo(28,24).stroke({color,width:3});}else if(p.id==='shield'){g.poly([20,3,35,10,32,29,20,37,8,29,5,10]).fill(color).stroke({color:INK,width:2});g.moveTo(13,19).lineTo(18,25).lineTo(28,14).stroke({color:0xfff7de,width:3});}else if(p.id==='coffeeBoost'){g.roundRect(7,11,24,23,5).fill(color).stroke({color:INK,width:2});g.moveTo(31,15).quadraticCurveTo(42,14,38,25).lineTo(31,27).stroke({color:INK,width:2});g.moveTo(15,3).lineTo(13,8).moveTo(24,3).lineTo(22,8).stroke({color,width:2});}else{g.roundRect(6,4,28,32,4).fill(color).stroke({color:INK,width:2});this.label(c,'✦',20,21,24,0xfff8d7);}});
    this.bake('chest',48,g=>{g.ellipse(24,41,20,4).fill({color:INK,alpha:.12});g.roundRect(5,13,38,28,5).fill(0xd0a05a).stroke({color:INK,width:2.5});g.roundRect(5,8,38,16,6).fill(0xe8c06c).stroke({color:INK,width:2.5});g.rect(10,10,5,29).fill(0xf6d689);g.rect(33,10,5,29).fill(0xf6d689);g.roundRect(20,20,9,11,2).fill(0xffedac).stroke({color:INK,width:1.5});});
    this.bake('tree',144,g=>{g.ellipse(76,124,42,13).fill({color:INK,alpha:.10});g.roundRect(67,80,12,42,4).fill(0xc3a37a).stroke({color:0x7e8e69,width:2});g.circle(72,64,42).fill(0x8eaf7f).stroke({color:0x73996d,width:2.5});g.circle(47,77,24).fill(0x9bbd88);g.circle(94,77,25).fill(0x87aa78);g.circle(67,45,26).fill(0xaec995);g.ellipse(59,36,12,5).fill({color:0xd4dfa9,alpha:.7});});
    this.bake('bench',96,g=>{g.roundRect(8,24,80,30,5).fill(0xc3a37a).stroke({color:INK,width:2});g.moveTo(14,34).lineTo(82,34).moveTo(14,44).lineTo(82,44).moveTo(20,54).lineTo(20,68).moveTo(76,54).lineTo(76,68).stroke({color:INK,width:3});});
    this.bake('planter',96,g=>{g.roundRect(5,35,86,36,9).fill(0xd2c09a).stroke({color:INK,width:2});for(let n=0;n<5;n++)g.circle(17+n*15,36,15).fill(n%2?0x9fb983:0xb4c891);});
    this.bake('digit-dot',12,g=>{g.circle(6,6,5).fill(0xffffff);});
    const atlas=this.bake('particle-atlas',256,g=>{
      g.circle(12,12,5).fill(0xffffff);
      g.poly([27,5,43,2,40,21,29,18]).fill(0xffffff).moveTo(30,8).lineTo(40,6).stroke({color:0xc8d9d3,width:1});
      g.roundRect(52,4,16,15,3).fill(0xffffff).stroke({color:0xa8adbb,width:1}).moveTo(56,9).lineTo(64,9).stroke({color:0xa8adbb,width:1});
      g.moveTo(81,4).lineTo(76,12).lineTo(81,20).moveTo(87,4).lineTo(92,12).lineTo(87,20).stroke({color:0xffffff,width:2});
      g.poly([132,1,140,12,132,23,124,12]).fill(0xffffff).stroke({color:0xc8efff,width:1});
      g.poly([148,4,162,2,158,21,146,17]).fill({color:0xffffff,alpha:.85}).stroke({color:0xbce5ed,width:1});
      g.roundRect(171,4,17,16,2).fill(0xffffff).stroke({color:0x9da7b3,width:2});
      g.rect(195,3,17,18).fill(0xffffff).moveTo(198,7).lineTo(209,7).moveTo(198,12).lineTo(209,12).moveTo(202,4).lineTo(202,19).stroke({color:0x88b8d7,width:1});
      g.poly([219,7,228,3,237,8,237,19,228,22,219,18]).fill(0xffffff).stroke({color:0xc59c87,width:1});
      g.circle(108,12,10).fill({color:0xffffff,alpha:.35});g.circle(106,10,6).fill({color:0xffffff,alpha:.3});
    });
    for(const [n,name] of ['spark','paper','key','code','smoke','ice','glass','metal','blueprint','brick'].entries())this.textures.set(`fragment-${name}`,new Texture({source:atlas.source,frame:new Rectangle(n*24,0,24,24)}));
    for(const ch of '0123456789+-!'){
      const t=new Text({text:ch,style:{fontFamily:['Campus Digits','Arial'],fontSize:32,fontWeight:'600',fill:0xffffff,stroke:{color:0x345249,width:3}}});
      const texture=this.app.renderer.generateTexture({target:t,resolution:1.25});this.textures.set(`digit-${ch}`,texture);t.destroy();
    }
    for(const building of this.world.buildings)this.building(building);
  }
  private building(b:Readonly<WorldBuilding>){
    const c=new Container(),g=new Graphics();c.addChild(g);
    if(b.placeholder){
      // Local SVG placeholders are baked and owned exactly like other procedural
      // textures. They require neither Assets loads nor external texture ownership.
      g.svg(placeholders[b.placeholder]);g.scale.set(b.w/320,b.h/200);
      this.textures.set(`building-${b.id}`,this.app.renderer.generateTexture({target:c,resolution:1}));c.destroy({children:true});return;
    }
    g.roundRect(8,20,b.w,b.h,12).fill({color:0x445a43,alpha:.13});
    g.roundRect(0,0,b.w,b.h,10).fill(0xf0dfb9).stroke({color:0x697b61,width:3});
    g.roundRect(-5,-8,b.w+10,b.h-38,12).fill(b.color).stroke({color:0x697b61,width:3});
    g.roundRect(7,2,b.w-14,b.h-60,8).fill({color:0xfff9df,alpha:.17});
    for(let x=20;x<b.w-20;x+=48){g.roundRect(x,30,28,34,3).fill(0xe2e8d4).stroke({color:0x698e86,width:2});g.moveTo(x+14,30).lineTo(x+14,64).stroke({color:0x698e86,width:1.5});}
    for(let x=25;x<b.w-20;x+=48)g.roundRect(x,b.h-28,22,16,2).fill(0x6e9690);
    g.roundRect(b.w/2-24,b.h-40,48,40,3).fill(0x527b70).stroke({color:0x456c61,width:2});g.moveTo(b.w/2,b.h-38).lineTo(b.w/2,b.h).stroke({color:0xe9d2a3,width:2});
    g.roundRect(b.w/2-78,81,156,35,5).fill(0xf1e4c3).stroke({color:0x73826a,width:2});
    this.label(c,b.name,b.w/2,98,13,0x405e50);
    if(b.type==='library'){g.moveTo(b.w/2-27,13).lineTo(b.w/2,0).lineTo(b.w/2+27,13).stroke({color:0xf4e1a9,width:4});}
    const tex=this.app.renderer.generateTexture({target:c,resolution:1});this.textures.set(`building-${b.id}`,tex);c.destroy({children:true});
  }
  destroy(){const sources=new Set([...this.textures.values()].map(t=>t.source));for(const texture of this.textures.values())texture.destroy(false);for(const source of sources)source.destroy();this.textures.clear();}
}
