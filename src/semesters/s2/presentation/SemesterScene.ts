// P04 bounded port of the battle presentation. Consumes DTOs and content IDs only.
import type {Immutable,SemesterRunView,SemesterView} from '../../runtime/contracts';
import type {LegacyContentDTO} from '../legacy/rules-adapter';
import type {ContentCatalog} from '../legacy/catalog';
import { Application, Container, Graphics, Sprite, Text, Texture, Rectangle, TilingSprite } from 'pixi.js';
import { AdvancedBloomFilter, GlowFilter } from 'pixi-filters';
import { TextureLibrary } from './procedural';
import { ParticleFX, DamageNumbers } from '../../../fx/particles';
import {LOGICAL_WIDTH,LOGICAL_HEIGHT} from '../../../core/run';
import {RANK_CODE} from '../../../data/enemies';
import {REGION_CONDITIONS} from '../../../world/landmarks';
import {warningFloor} from '../world';
import {legacyFeedbackEvent,type ContentVisualEvent} from '../enemy-visuals';
import {BuildPanel} from './BuildPanel';
import {S2_ART_MANIFEST} from './art-manifest';
import {semesterArtBundles} from './art-loading';
import {SemesterSettlementPanel} from './SettlementPanel';
import type {SaveProfile,SemesterResult} from '../../profile';
import {ringRadius} from '../danger';
import {InputController,presentationPhase,type Joystick,type SemesterControls} from './input';
import { clamp, distanceSq, lerp, TAU } from '../../../core/math';
import { botPosition } from '../legacy/system';
import { weaponParams } from '../legacy/params';
import {TrailHistory} from '../../../fx/trails';
import {afterimagePoint} from '../../../render/trail-sampling';
import {Haptics} from '../../../fx/haptics';
import {drawUltimate} from '../../../fx/ultimates';
import {drawSignature} from '../../../render/signatures';
import {xpGemTier} from '../legacy/rules';
import type { Settings } from '../../../types';
import { GameAudio } from '../../../audio/audio';
import { TextureCatalog } from './TextureCatalog';
import { resources,prepareFonts,type LoadProgress,type ResourceLease } from '../../../assets/loader';
import { FeedbackDirector } from '../../../presentation/FeedbackDirector';
import { PostFX,eventPixelPosition } from '../../../fx/PostFX';
import { DeathFX } from '../../../fx/DeathFX';
import {characterArt,textureArt,itemArt,uiArt} from '../../../assets/bindings';
import {type ResourceId,type ResourceBundle} from '../../../assets/manifest';
import {buildingPlacement,enemyArtSize,fitArtScale} from '../../../presentation/art-layout';
import {enemyMaterial} from '../../../presentation/materials';
import {attackFeel} from '../../../presentation/weapon-feedback';
import {qualityBudget,qualityName} from '../../../presentation/quality';

interface Transient {event:ContentVisualEvent;life:number;total:number;hold?:number}
export class SemesterScene implements SemesterView<LegacyContentDTO> {
  private settlementPanel:SemesterSettlementPanel|undefined;
  private landmarkSprites=new Map<string,Sprite>();
  private buildingSprites=new Map<string,Sprite>();
  private extensionLeases=new Map<ResourceBundle,ResourceLease<ResourceId>>();
  private pendingArt=new Map<ResourceBundle,Promise<void>>();
  private wantedArt=new Set<ResourceBundle>();
  showSettlement(before:SaveProfile,after:SaveProfile,result:SemesterResult){this.settlementPanel?.destroy();this.settlementPanel=new SemesterSettlementPanel(this.host,before,after,result);}
  readonly app=new Application();readonly audio:GameAudio;
  private textures!:TextureCatalog;private geometry!:TextureLibrary;private assetsRelease:(()=>void)|undefined;private loadAbort=new AbortController();
  private artTextures=new Map<ResourceId,Texture>();private artReleases:(()=>void)[]=[];private requestedBosses=new Set<ResourceBundle>();private playerShadow=new Graphics();
  readonly feedback:FeedbackDirector;readonly postFX=new PostFX();readonly deathFX=new DeathFX();private world=new Container();private ground=new Container();private dropLayer=new Container();private entityLayer=new Container();private propLayer=new Container();private effects=new Container();private dangerLayer=new Container();
  private fxGraphic=new Graphics();private groundFX=new Graphics();private telegraphs=new Graphics();private dangerGuides=new Graphics();private debugGraphics=new Graphics();private particles!:ParticleFX;private numbers!:DamageNumbers;private player!:Sprite;
  private whiteSprites:(Sprite|undefined)[]=[];private enemySprites:(Sprite|undefined)[]=[];private shotSprites:(Sprite|undefined)[]=[];private hostileSprites:(Sprite|undefined)[]=[];private dropSprites:(Sprite|undefined)[]=[];private orbitSprites:Sprite[]=[];private botSprites:Sprite[]=[];private droneSprites:Sprite[]=[];
  private transient:Transient[]=[];private props:Sprite[]=[];private input!:InputController;private resizeObserver!:ResizeObserver;private animation=0;private lastTime=0;private elapsed=0;private destroyed=false;private ready=false;
  private bloom=new AdvancedBloomFilter({threshold:.65,bloomScale:.6,brightness:1,blur:3,quality:2});private glow=new GlowFilter({distance:8,outerStrength:1.1,color:0x99e1b2,quality:.15});
  private gates=new Graphics();private warningMask=new Graphics();
  private chapterLabel=new Text({text:'',style:{fontFamily:['Campus Sans','sans-serif'],fontSize:14,fill:0x304d52,fontWeight:'bold',wordWrap:true,wordWrapWidth:340,lineHeight:22}});
  private viewportMask=new Graphics();private letterbox=new Graphics();private viewportY=0;private viewportHeight=0;
  private blackSprite=new Sprite();private hurtSprite=new Sprite();private uiTextures:Texture[]=[];private hitFlash=0;
  private cameraX=3072;private cameraY=3072;private cameraZoom=1;private baseScale=1;private settings:Settings;private quality:'high'|'medium'|'low'='high';private lastRender=0;private renderedPhase='';
  private haptics=new Haptics();private trails=new Map<number,{generation:number;history:TrailHistory}>();private bloomClimax=0;
  private ownsAudio=false;private appInitialized=false;private brokenOrbitEdge=-1;private orbitRebuildUntil=0;
  clearUIInput(){this.input?.clear();}
  private latest:Immutable<SemesterRunView<LegacyContentDTO>>|null=null;
  private controls:SemesterControls|null=null;private eventCursor=0;
  private buildPanel:BuildPanel|null=null;
  private viewWidth=LOGICAL_WIDTH;private viewHeight=LOGICAL_HEIGHT;
  private get game(){if(!this.latest)throw Error('Publish opening DTO before initialization');return this.latest.content;}
  private get phase(){return presentationPhase(this.latest!);}
  constructor(private host:HTMLElement,private content:ContentCatalog,settings:Settings,private onStick:(stick:Joystick)=>void,audio?:GameAudio,private onLoad?:(p:LoadProgress)=>void,private onView?:(v:Immutable<SemesterRunView<LegacyContentDTO>>)=>void){this.settings=settings;this.ownsAudio=!audio;this.audio=audio??new GameAudio(settings);this.feedback=new FeedbackDirector(settings);}
  attach(controls:SemesterControls){this.controls=controls;}
  publish(view:Immutable<SemesterRunView<LegacyContentDTO>>){if(this.destroyed)return;this.latest=view;this.onView?.(view);}
  dispose(){this.destroy();}
  async initialize(){
    if(this.destroyed)return;
    if(!this.controls||!this.latest)throw Error('Attach semester controls and publish opening DTO first');
    await this.app.init({resizeTo:this.host,background:0xedecd9,antialias:true,resolution:Math.min(devicePixelRatio,qualityBudget(this.settings.quality).dpr),autoDensity:true,preference:'webgl',powerPreference:'high-performance',autoStart:false});
    this.appInitialized=true;if(this.destroyed){this.destroyApplication();return;}
    this.assetsRelease=()=>{for(const release of this.artReleases)release();this.artReleases=[];};
    const acquire=async(promise:Promise<ResourceLease<ResourceId>>)=>{const lease=await promise;if(this.destroyed){lease.release();return;}this.artReleases.push(lease.release);for(const [id,texture] of lease.textures)this.artTextures.set(id,texture);};
    await acquire(resources.bundle('battle-core',this.loadAbort.signal,this.onLoad));
    await acquire(resources.bundle('battle-content',this.loadAbort.signal,this.onLoad));
    await acquire(resources.loadIds((Object.keys(S2_ART_MANIFEST) as ResourceId[]).filter(id=>S2_ART_MANIFEST[id as keyof typeof S2_ART_MANIFEST].bundle==='s2-start'),this.loadAbort.signal,this.onLoad,'准备第二学期首章'));
    await acquire(resources.loadIds([characterArt[this.game.manifest.character].sprite,...['heal','magnet','bomb','freeze','shield','coffeeBoost','energy'].map(id=>itemArt[id]),uiArt['chest-closed']],this.loadAbort.signal,this.onLoad,'整理随身补给'));
    await prepareFonts();if(this.destroyed){this.assetsRelease();this.destroyApplication();return;}
    this.host.appendChild(this.app.canvas);this.geometry=new TextureLibrary(this.app,this.content,this.game.world);this.textures=new TextureCatalog(this.geometry,this.artTextures,this.game.manifest.character,this.content);this.particles=new ParticleFX(this.textures);this.numbers=new DamageNumbers(this.textures);
    this.world.addChild(this.ground,this.gates,this.groundFX,this.dropLayer,this.entityLayer,this.propLayer,this.effects,this.numbers.container,this.debugGraphics);
    this.effects.addChild(this.fxGraphic,this.deathFX.container,this.particles.container);this.dangerLayer.addChild(this.telegraphs,this.warningMask,this.dangerGuides);this.telegraphs.mask=this.warningMask;
    this.chapterLabel.position.set(18,18);this.app.stage.addChild(this.letterbox,this.world,this.blackSprite,this.dangerLayer,this.hurtSprite,this.viewportMask,this.chapterLabel);
    this.createMap();this.playerShadow.ellipse(0,0,17,6).fill({color:0x172d31,alpha:.25});this.entityLayer.addChild(this.playerShadow);this.player=new Sprite(this.textures.get('player'));this.player.anchor.set(.5);this.player.scale.set(fitArtScale(this.player.texture,64));this.entityLayer.addChild(this.player);this.preloadBossArt();
    await Promise.all([...this.pendingArt.values()]);if(this.destroyed)return;
    this.input=new InputController(this.app.canvas,this.controls!,this.onStick);this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.host);
    this.buildPanel=new BuildPanel(this.host,this.content,this.controls,()=>this.clearUIInput());
    this.applySettings(this.settings);this.resize();this.ready=true;this.lastTime=performance.now();this.animation=requestAnimationFrame(this.animate);
  }
  private createMap(){
    const g=new Graphics(),map=this.game.world,{size,spawn,square,track}=map;
    this.cameraX=spawn.x;this.cameraY=spawn.y;
    this.ground.addChild(new Graphics().rect(0,0,size,size).fill(0xe9ecd8));
    const tile=(id:ResourceId,x:number,y:number,width:number,height:number,alpha:number)=>{const texture=this.textures.external(id);if(!texture)return;const s=new TilingSprite({texture,width,height});s.position.set(x,y);s.alpha=alpha;s.tileScale.set(.8);this.ground.addChild(s);};
    tile(textureArt.grass,0,0,size,size,.48);
    for(const path of [...map.paths,square])tile(textureArt.paving,path.x,path.y,path.w,path.h,.9);
    this.ground.addChild(g);
    for(const lawn of map.lawns)g.ellipse(lawn.x,lawn.y,lawn.rx,lawn.ry).fill({color:0xd8e2bf,alpha:.55});
    for(const path of map.paths)g.rect(path.x,path.y,path.w,path.h).fill({color:0xf4ecd8,alpha:.2});
    g.roundRect(square.x,square.y,square.w,square.h,38).fill({color:0xf4eddd,alpha:.2}).stroke({color:0xe1d7be,width:3});
    for(let x=square.x+30;x<square.x+square.w-10;x+=56)for(let y=square.y+28;y<square.y+square.h;y+=56)g.rect(x,y,2,2).fill(0xdacfb5);
    g.circle(spawn.x,spawn.y,152).stroke({color:0xe5dcc2,width:3});g.circle(spawn.x,spawn.y,142).stroke({color:0xe5dcc2,width:1.5});
    g.moveTo(spawn.x-28,spawn.y+2).lineTo(spawn.x,spawn.y-13).lineTo(spawn.x+28,spawn.y+2).lineTo(spawn.x,spawn.y+17).closePath().stroke({color:0xd5c9a8,width:3});
    g.roundRect(track.x,track.y,track.w,track.h,180).fill(0xc8997f).stroke({color:0xb38a73,width:3});
    for(let n=0;n<4;n++)g.roundRect(track.x+15+n*13,track.y+15+n*13,track.w-30-n*26,track.h-30-n*26,165-n*13).stroke({color:0xe9c8a6,width:2});
    g.roundRect(track.x+80,track.y+75,track.w-160,track.h-150,112).fill(0xb9c68e);g.rect(track.x+190,track.y+90,300,220).stroke({color:0xebead0,width:2});g.circle(track.x+340,track.y+200,40).stroke({color:0xebead0,width:2});
    for(const zone of map.zones){
      const decoration=zone.art?this.textures.external(zone.art):undefined;
      if(decoration){const sprite=new Sprite(decoration);sprite.anchor.set(.5);sprite.position.set(zone.x,zone.y);sprite.scale.set(fitArtScale(decoration,zone.radius*2));sprite.alpha=.68;this.ground.addChild(sprite);}
      g.circle(zone.x,zone.y,zone.radius).fill({color:zone.color,alpha:.08}).stroke({color:zone.color,width:2,alpha:.4});
      const text=map.regions.includes(zone.id)?zone.name:`${zone.name} · 未开放\n${REGION_CONDITIONS[zone.id]??''}`;
      const label=new Text({text,style:{fontFamily:['Campus Sans','sans-serif'],fontSize:zone.legacy?13:20,fill:0x526f72,fontWeight:'bold'}});label.anchor.set(.5);label.position.set(zone.x,zone.y+zone.radius-20);this.ground.addChild(label);
    }
    for(const f of map.fences){g.rect(f.x,f.y,f.w,f.h).fill(0x8f9b80).stroke({color:0x607963,width:2});tile(textureArt.metal,f.x,f.y,f.w,f.h,.8);}
    // Locked legacy regions visibly occupy the same footprint as their blocker.
    for(const gate of map.gates)this.gates.rect(gate.x,gate.y,gate.w,gate.h).fill({color:0x788b80,alpha:.22}).stroke({color:0x6d7760,width:3});
    for(const b of map.buildings){
      const art=this.textures.building(b.id)??(b.art?this.textures.external(b.art):undefined),sprite=new Sprite(art??this.textures.get(`building-${b.id}`));
      // The plinth and every local placeholder exactly match the collision rect.
      g.roundRect(b.x,b.y,b.w,b.h,6).fill({color:art&&b.id.startsWith('s2:')?0xbdb9a5:b.color,alpha:.9}).stroke({color:0x526b65,width:3,alpha:.8});
      if(art){const placement=buildingPlacement(b,art);sprite.position.set(placement.x,placement.y);sprite.width=placement.width;sprite.height=placement.height;}
      else if(b.placeholder){sprite.position.set(b.x,b.y);sprite.width=b.w;sprite.height=b.h;}
      else sprite.position.set(b.x-5,b.y-8);
      this.propLayer.addChild(sprite);this.props.push(sprite);this.buildingSprites.set(b.id,sprite);
      const label=new Text({text:b.name,style:{fontFamily:['Campus Sans','sans-serif'],fontSize:14,fill:0x3f5b55,fontWeight:'bold'}});label.anchor.set(.5,0);label.position.set(b.x+b.w/2,b.y+b.h+8);this.ground.addChild(label);
    }
    for(const prop of map.props){
      const sprite=new Sprite(this.textures.get(prop.kind));sprite.anchor.set(.5,prop.kind==='tree'?.85:.65);sprite.position.set(prop.x,prop.y);sprite.scale.set(fitArtScale(sprite.texture,prop.kind==='tree'?112:prop.kind==='bench'?76:90)*prop.scale);this.propLayer.addChild(sprite);this.props.push(sprite);
      if(prop.kind==='planter')g.roundRect(prop.x-42,prop.y-18,84,36,10).fill(0xd2c09a).stroke({color:0xb9ae8e,width:2});
    }
    for(const site of map.assessmentSites.filter(s=>s.regionId.startsWith('s2:'))){
      g.circle(site.center.x,site.center.y,site.radius).fill({color:0xf3eedf,alpha:.16}).stroke({color:0x98b9af,width:2,alpha:.55});
      for(const route of site.retreats){g.moveTo(route[0].x,route[0].y);for(const point of route.slice(1))g.lineTo(point.x,point.y);g.stroke({color:0xabc6b6,width:3,alpha:.45});}
    }
    // Warning coverage is clipped by the same collision rectangles as movement
    // and flow-field navigation. This does not change hazard timing or damage.
    for(const rect of warningFloor(map))this.warningMask.rect(rect.x,rect.y,rect.w,rect.h);
    this.warningMask.fill(0xffffff);
    const sign=new Text({text:'北京建筑大学\nBEIJING UNIVERSITY OF CIVIL ENGINEERING AND ARCHITECTURE',style:{fontFamily:['Campus Sans','sans-serif'],fontSize:15,fill:0x8b997c,align:'center',letterSpacing:2,lineHeight:27}});sign.anchor.set(.5);sign.position.set(spawn.x,spawn.y+138);this.ground.addChild(sign);
  }
  private preloadBossArt(){
    const g=this.game,actors=g.enemies.active.map(id=>g.enemies.kind[id]),items=[...g.weapons.flatMap(w=>[w.id,...(w.evolved?[`${w.id}:evolved`]:[])]),...g.passives.map(p=>p.id),...g.relics];
    const bundles=new Set(semesterArtBundles(g.week,g.player,actors,items));
    for(const def of this.content.enemies){if(!['boss','miniBoss'].includes(def.rank)||def.from>g.week+1)continue;if(def.rank==='boss'&&def.from<g.week-1&&!actors.includes(def.id))continue;const bundle=(def.id.startsWith('s2:')?`s2-boss-${def.id.slice(3)}`:`boss-${def.id}`) as ResourceBundle;bundles.add(bundle);}
    this.wantedArt=bundles;
    for(const [bundle,lease] of this.extensionLeases)if(!bundles.has(bundle)){lease.release();for(const id of lease.textures.keys())this.artTextures.delete(id);this.extensionLeases.delete(bundle);this.requestedBosses.delete(bundle);void resources.dispose();}
    for(const bundle of bundles){if(this.requestedBosses.has(bundle))continue;this.requestedBosses.add(bundle);
      const pending=resources.extensionBundle(bundle,this.loadAbort.signal).then(lease=>{if(this.destroyed||!this.wantedArt.has(bundle)){lease.release();this.requestedBosses.delete(bundle);void resources.dispose();return;}this.extensionLeases.set(bundle,lease);for(const [id,texture] of lease.textures)this.artTextures.set(id,texture);this.refreshBuildings();}).finally(()=>this.pendingArt.delete(bundle));this.pendingArt.set(bundle,pending);
    }
  }
  private refreshBuildings(){for(const b of this.game.world.buildings){const sprite=this.buildingSprites.get(b.id),texture=this.textures?.building(b.id);if(!sprite||!texture)continue;sprite.texture=texture;const p=buildingPlacement(b,texture);sprite.position.set(p.x,p.y);sprite.width=p.width;sprite.height=p.height;}}
  private resize(){
    if(this.destroyed)return;this.releaseFilterTextures();const w=this.host.clientWidth,h=this.host.clientHeight;this.app.renderer.resize(w,h);
    const daily=this.game.manifest.mode==='daily';this.baseScale=daily?Math.min(w/LOGICAL_WIDTH,h/LOGICAL_HEIGHT):w<650?.78:Math.min(1.1,Math.max(.85,h/800));this.viewWidth=daily?LOGICAL_WIDTH:w/this.baseScale;this.viewHeight=daily?LOGICAL_HEIGHT:h/this.baseScale;this.viewportHeight=daily?LOGICAL_HEIGHT*this.baseScale:h;this.viewportY=(h-this.viewportHeight)*.5;this.letterbox.clear().rect(0,0,w,h).fill(0xe9ecd8);this.viewportMask.clear().rect(0,this.viewportY,w,this.viewportHeight).fill(0xffffff);if(daily){this.world.mask=this.viewportMask;this.dangerLayer.mask=this.viewportMask;}else{this.world.mask=null;this.dangerLayer.mask=null;this.viewportMask.visible=false;}
    const make=(black:boolean)=>{
      const existing=this.uiTextures[black?0:1],canvas=(existing?.source.resource as HTMLCanvasElement|undefined)??document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d')!;
      const radius=black?260*this.baseScale:Math.max(w,h)*.65,gradient=ctx.createRadialGradient(w/2,h/2,black?radius*.55:Math.min(w,h)*.18,w/2,h/2,radius);
      gradient.addColorStop(0,'rgba(0,0,0,0)');gradient.addColorStop(1,black?'rgba(15,28,30,.94)':'rgba(205,63,63,.7)');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);if(existing){existing.source.resize(w,h);existing.source.update();return existing;}return Texture.from(canvas);
    };
    this.uiTextures=[make(true),make(false)];this.blackSprite.texture=this.uiTextures[0];this.hurtSprite.texture=this.uiTextures[1];
    this.blackSprite.visible=false;this.hurtSprite.alpha=0;this.effects.filterArea=new Rectangle(0,0,w,h);this.world.filterArea=new Rectangle(0,0,w,h);this.input?.clear();
  }
  applySettings(settings:Settings){
    this.settings=settings;this.audio.apply(settings);this.feedback.apply(settings);if(!settings.motion||!settings.distortion||settings.flash===0){this.world.filters=[];this.postFX.clear();}if(this.particles)this.particles.motion=settings.motion;if(!settings.motion){this.trails.clear();this.particles?.clear();this.cameraZoom=1;this.world.rotation=0;this.dangerLayer.rotation=0;this.deathFX.clear();for(const item of this.transient)item.hold=0;this.numbers?.setMotion(false);}this.setQuality(qualityName(settings.quality));
  }
  private setQuality(quality:'high'|'medium'|'low'){
    this.quality=quality;
    if(!this.particles)return;
    const budget=qualityBudget(quality);this.particles.limit=budget.particles;
    this.numbers.limit=budget.numbers;
    this.effects.filters=quality==='low'?[]:[this.bloom];this.bloom.resolution=budget.bloomResolution;this.bloom.quality=budget.bloomQuality;
    this.bloom.threshold=quality==='high'?.55:.6;this.bloom.bloomScale=quality==='high'?1.6:1;
    if(this.player)this.player.filters=quality==='high'?[this.glow]:[];
    const dpr=Math.min(devicePixelRatio,budget.dpr);if(this.app.renderer.resolution!==dpr){this.app.renderer.resolution=dpr;this.resize();}
  }
  private animate=(now:number)=>{
    if(this.destroyed||!this.ready)return;this.animation=requestAnimationFrame(this.animate);
    const delta=Math.max(0,(now-this.lastTime)/1000);this.lastTime=now;this.elapsed+=delta;
    this.preloadBossArt();
    // A newly admitted boss waits for its owned resources, including late I/O.
    // Failure resolves through the existing geometry path; no hidden attacks.
    const waiting=this.latest?.phase==='assessment'&&[...this.pendingArt.keys()].some(b=>b.startsWith('s2-boss-'));
    const alpha=waiting?0:this.controls?.advance(delta)??0;
    if(document.hidden){return;}
    const renderDelta=this.lastRender?(now-this.lastRender)/1000:delta;this.lastRender=now;
    this.render(Math.min(.1,renderDelta),alpha);
  };
  private render(dt:number,alpha:number){
    const g=this.game,p=g.player,w=this.app.screen.width,time=g.combatTime;
    this.buildPanel?.update(this.latest!);
    if(this.renderedPhase!==this.phase){this.renderedPhase=this.phase;if(this.phase!=='playing')this.input.clear();}
    const px=lerp(p.prevX,p.x,alpha),py=lerp(p.prevY,p.y,alpha),cameraBlend=1-Math.exp(-dt*10);
    this.cameraX=lerp(this.cameraX,px,cameraBlend);this.cameraY=lerp(this.cameraY,py,cameraBlend);
    const camera=this.feedback.update(this.phase==='paused'?0:dt);this.cameraZoom=camera.zoom;const scale=this.baseScale*(g.manifest.mode==='daily'?1:this.cameraZoom);
    const ox=w*.5-this.cameraX*scale+camera.x,oy=this.viewportY+this.viewportHeight*.5-this.cameraY*scale+camera.y;
    this.world.position.set(ox,oy);this.world.scale.set(scale);this.dangerLayer.position.copyFrom(this.world.position);this.dangerLayer.scale.set(scale);this.world.rotation=camera.rotation;this.dangerLayer.rotation=camera.rotation;
    this.player.texture=this.textures.get('player');const playerScale=fitArtScale(this.player.texture,64);this.player.position.set(px,py-11+(this.settings.motion?Math.sin(time*13)*Math.min(2,Math.hypot(p.vx,p.vy)/130):0));this.player.scale.set((p.vx< -8?-playerScale:playerScale)*(1+(this.settings.motion?Math.sin(time*13)*.025:0)),playerScale*(1-(this.settings.motion?Math.sin(time*13)*.02:0)));this.player.alpha=p.invincible>0&&Math.floor(time*16)%2===0?.55:1;this.playerShadow.position.set(px,py+17);
    this.chapterLabel.text=`第 ${g.chapter.chapter} 章 · ${g.chapter.title}${g.chapter.reached?' · 已抵达':''}\n${g.chapter.objective}${this.latest?.phase==='assessmentIntro'&&g.assessmentAdmission?`\n考场：${g.assessmentAdmission.site.name} · 等待确认入场`:''}`;
    const board=g.proposalBoard;
    if(g.event)this.chapterLabel.text+=`\n校园事件 · ${g.event.name} · ${g.event.warning>0?`${g.event.warning.toFixed(1)}秒后开始`:`剩余 ${Math.ceil(g.event.remaining)} 秒`}${g.event.kind==='s2:networkMaintenance'?` · 终端 ${g.event.closed}/2`:g.event.kind==='s2:jointExhibit'?` · 展点 ${g.event.visits}/2`:''}`;
    if(g.revision.active)this.chapterLabel.text+=`\n旧课复习 · ${this.content.enemyById[g.revision.active.id].name} · 选修（教学暂停）`;
    if(g.notice)this.chapterLabel.text+=`\n${g.notice}`;
    this.blackSprite.visible=g.event?.kind==='blackout'&&g.event.warning<=0;
    if(board){
      const attack=g.hazards.find(h=>h.id===board.handleId),moves={opening:'审查开始',transition:'安全过渡',recovery:'停手 · 集中输出',stagger:'错峰间隔',chase:'普通追击',line:`冲线 ${board.line}`,reservation:'预约落点'};
      const timing=attack?`${attack.phase==='warning'?`预警 ${attack.warning.toFixed(1)} 秒${attack.locked?' · 已锁定':''}`:'生效'}`:board.attackPhase==='queued'?'等待安全放行':board.remaining>0?`${board.remaining.toFixed(1)} 秒`:'';
      this.chapterLabel.text+=`\n联合选题审查 · 阶段 ${board.stage}/2 · ${Math.ceil(g.enemies.hp[board.owner])}/16000\n${moves[board.move]}${timing?` · ${timing}`:''}`;
    }
    if(g.expoFinal){const expo=g.expoFinal;this.chapterLabel.text+=`\n毕业成果联展 · 阶段 ${expo.stage}/3 · ${Math.ceil(g.enemies.hp[expo.owner])}/110000\n${expo.move==='recovery'?'停手 · 集中输出':expo.move==='transition'?'安全过渡':{delivery:'配送线路',reservation:'预约落点',scan:'移动安全扇区'}[expo.attack]} · ${Math.round(expo.reduction*100)}% 减伤`;}
    this.fxGraphic.clear();this.syncEntities(alpha);this.drawGroundEffects();this.drawOrbitAndBots();this.drawEnemyStatus();this.drawTelegraphs();
    if(g.frame%4===0)for(const prop of this.props){prop.visible=Math.abs(prop.x-p.x)<this.viewWidth*.65+450&&Math.abs(prop.y-p.y)<this.viewHeight*.65+400;prop.alpha=distanceSq(prop.x+prop.width*.5,prop.y+prop.height*.6,p.x,p.y)<150**2?.55:1;}
    this.audio.beginFrame();
    const unseen=g.visualEvents.filter(v=>v.serial>this.eventCursor);this.eventCursor=Math.max(this.eventCursor,unseen.at(-1)?.serial??0);
    const allEvents=unseen.map(v=>v.event).map(event=>{
      const skill=event.weapon?g.weapons.find(skill=>skill.id===event.weapon):undefined;
      return skill?{...event,evolved:event.evolved??skill.evolved,level:event.level??skill.level}:event;
    });
    const feedbackEvents=new Map(allEvents.map(e=>[e,legacyFeedbackEvent(e)]));
    const cues=this.feedback.consume(allEvents.filter(e=>this.inView(e.x,e.y,e.size)).map(e=>feedbackEvents.get(e)!));
    for(const cue of cues)if(cue.profile.wave&&this.settings.motion&&this.settings.distortion){const point=eventPixelPosition(cue.event.x,cue.event.y,ox,oy,scale,camera.rotation);this.postFX.event(cue.profile,point,this.quality);}
    const holds=new Map(cues.map(c=>[c.event,c.hold]));
    for(const event of allEvents){const feedback=feedbackEvents.get(event)!;this.audio.event({...feedback,pan:Math.max(-.65,Math.min(.65,(event.x-this.cameraX)/(this.viewWidth*.6)))});this.haptics.event(feedback,this.settings.haptics,this.elapsed*1000);this.handleEvent(event,holds.get(feedback)??0);}
    this.audio.flush();
    const visualDt=this.phase==='paused'?0:dt;
    for(let n=this.transient.length-1;n>=0;n--){const item=this.transient[n];const held=Math.min(item.hold??0,visualDt);item.hold=Math.max(0,(item.hold??0)-held);item.life-=visualDt-held;if(item.life<=0){this.transient.splice(n,1);continue;}this.drawTransient(item);}
    this.particles.update(visualDt);this.numbers.setMotion(this.settings.motion);this.numbers.update(visualDt);this.deathFX.update(visualDt,this.settings.motion);
    this.bloomClimax=Math.max(0,this.bloomClimax-dt);this.bloom.bloomScale=this.quality==='high'?(this.bloomClimax>0?2.2:1.6):1;
    this.hitFlash=Math.max(0,this.hitFlash-dt);
    this.blackSprite.visible=false;
    const lowHp=p.hp/g.stats.maxHp<.3;this.hurtSprite.alpha=(Math.min(1,this.hitFlash/.18)*.6+(lowHp?.25+(this.settings.motion?Math.sin(this.elapsed*7)*.1:0):0))*this.settings.flash;
    this.world.filters=this.postFX.update(dt,this.settings,this.quality);
    this.preloadBossArt();if([7,15,23].includes(g.week))this.audio.prepareTheme('boss');
    this.audio.setEnvironment(null);this.audio.setPaused(['paused','draft','chest','reward','contract'].includes(this.phase));this.audio.setTheme(this.phase==='result'?'result':!this.settings.dynamicMusic?'normal':g.bossActive?'boss':g.enemies.active.some(id=>g.enemies.rank[id]===RANK_CODE.elite||g.enemies.rank[id]===RANK_CODE.miniBoss)?'elite':'normal');
    this.app.render();this.releaseFilterTextures();
  }
  private inView(x:number,y:number,margin=120){return Math.abs(x-this.cameraX)<this.viewWidth*.55+margin&&Math.abs(y-this.cameraY)<this.viewHeight*.55+margin;}
  private syncEntities(alpha:number){
    const g=this.game,e=g.enemies,parcels=new Set(g.parcels.map(p=>p.slot));
    for(let id=0;id<this.enemySprites.length;id++)if(this.enemySprites[id]&&!e.alive[id]){this.enemySprites[id]!.visible=false;if(this.whiteSprites[id])this.whiteSprites[id]!.visible=false;}
    for(const id of e.active){let sprite=this.enemySprites[id];if(!sprite){sprite=new Sprite();sprite.anchor.set(.5);this.entityLayer.addChild(sprite);this.enemySprites[id]=sprite;}sprite.visible=this.inView(e.x[id],e.y[id]);if(!sprite.visible){if(this.whiteSprites[id])this.whiteSprites[id]!.visible=false;continue;}
      const textureId=parcels.has(id)?'s2:parcel':e.kind[id];sprite.texture=this.textures.get(`enemy-${textureId}`);const pose=this.settings.motion?this.feedback.entities.pose(id,e.generation[id],distanceSq(e.x[id],e.y[id],g.player.x,g.player.y)<70**2):{x:0,y:0,scaleX:1,scaleY:1,skew:0,white:0};
      sprite.position.set(lerp(e.prevX[id],e.x[id],alpha)+pose.x,lerp(e.prevY[id],e.y[id],alpha)+pose.y);
      const bounce=this.settings.motion?Math.sin(g.combatTime*6+id)*.018:0,scale=fitArtScale(sprite.texture,enemyArtSize(e.radius[id]));sprite.scale.set(scale*(pose.scaleX+bounce),scale*(pose.scaleY-bounce));sprite.skew.set(pose.skew,-pose.skew);sprite.tint=e.frozen[id]>0?0xa5dcf5:0xffffff;
      sprite.alpha=e.hp[id]<=0?.3:1;sprite.rotation=this.settings.motion&&e.state[id]===1?Math.sin(this.elapsed*42)*.04:0;
      let white=this.whiteSprites[id];if(!white){white=new Sprite();white.anchor.set(.5);this.entityLayer.addChild(white);this.whiteSprites[id]=white;}white.texture=this.textures.get(`enemy-${textureId}-white`);white.visible=true;white.position.copyFrom(sprite.position);white.scale.copyFrom(sprite.scale);white.skew.copyFrom(sprite.skew);white.rotation=sprite.rotation;white.alpha=pose.white*this.settings.flash*sprite.alpha;

    }
    this.feedback.entities.prune((slot,generation)=>!!e.alive[slot]&&e.generation[slot]===generation);
    // Keep the player's sprite above ordinary enemies.
    this.entityLayer.setChildIndex(this.player,this.entityLayer.children.length-1);
    for(let id=0;id<this.shotSprites.length;id++)if(this.shotSprites[id]&&!g.shots.alive[id])this.shotSprites[id]!.visible=false;
    for(const id of g.shots.active){const s=g.shots.data[id];let sprite=this.shotSprites[id];if(!sprite){sprite=new Sprite();sprite.anchor.set(.5);this.effects.addChild(sprite);this.shotSprites[id]=sprite;}
      sprite.visible=this.inView(s.x,s.y);if(!sprite.visible)continue;sprite.texture=this.textures.get(s.source==='knife'?'paper':s.source==='code'?'code':s.source==='ppt'?'ppt':s.source==='staple'||s.source==='binder'?'staple':s.source==='shuttle'?'shuttle':s.source==='sword'?'paper':'bullet');
      sprite.position.set(lerp(s.prevX,s.x,alpha),lerp(s.prevY,s.y,alpha));const growth=1+(s.level-1)*.055+(s.evolved?.35:0);sprite.scale.set(fitArtScale(sprite.texture,s.source==='staple'||s.source==='binder'?15:s.source==='ppt'?32:26)*growth);sprite.rotation=Math.atan2(s.vy,s.vx)+(s.source==='knife'?Math.PI/4:0)+(s.source==='ppt'?s.age*9:0);
      let trail=this.trails.get(id);if(!trail||trail.generation!==g.shots.generation[id]){trail={generation:g.shots.generation[id],history:new TrailHistory()};this.trails.set(id,trail);}
      if(this.settings.motion&&trail.history.sample(s.x,s.y,s.age,this.quality==='high'?32:this.quality==='medium'?12:4)&&this.quality!=='low')this.particles.burst(s.x,s.y,s.color,s.evolved?2:1,12,.5);
      const points=this.settings.motion?trail.history.points:[];for(let n=1;n<points.length;n++){const a=points[n-1],b=points[n];this.fxGraphic.moveTo(a.x,a.y).lineTo(b.x,b.y).stroke({color:s.color,width:(s.evolved?6:3)*n/points.length,alpha:n/points.length*.5});}
      if(this.settings.motion&&this.settings.afterimages&&this.quality!=='low')for(let layer=1;layer<=(this.quality==='high'?5:2);layer++){
        const point=afterimagePoint(points,s.age,layer,this.quality==='high');if(point)this.fxGraphic.roundRect(point.x-9*growth,point.y-5*growth,18*growth,10*growth,2).stroke({color:s.color,width:1.5,alpha:.22/layer});
      }
    }
    for(const id of this.trails.keys())if(!g.shots.alive[id])this.trails.delete(id);
    for(let id=0;id<this.hostileSprites.length;id++)if(this.hostileSprites[id]&&!g.enemyShots.alive[id])this.hostileSprites[id]!.visible=false;
    for(const id of g.enemyShots.active){const s=g.enemyShots.data[id];let sprite=this.hostileSprites[id];if(!sprite){sprite=new Sprite(this.textures.get('enemyBullet'));sprite.anchor.set(.5);this.dangerLayer.addChild(sprite);this.hostileSprites[id]=sprite;}
      sprite.visible=this.inView(s.x,s.y);sprite.position.set(s.x,s.y);sprite.scale.set(s.radius/6);sprite.alpha=s.age<0?.35+.2*Math.sin(this.elapsed*15):1;
    }
    for(let id=0;id<this.dropSprites.length;id++)if(this.dropSprites[id]&&!g.drops.alive[id])this.dropSprites[id]!.visible=false;
    for(const id of g.drops.active){const d=g.drops.data[id];let sprite=this.dropSprites[id];if(!sprite){sprite=new Sprite();sprite.anchor.set(.5);this.dropLayer.addChild(sprite);this.dropSprites[id]=sprite;}
      sprite.visible=this.inView(d.x,d.y);if(!sprite.visible)continue;sprite.texture=this.textures.get(d.kind);sprite.position.set(d.x,d.y+(d.kind==='xp'||!this.settings.motion?0:Math.sin(this.elapsed*3+id)*3));
      const tier=xpGemTier(d.value),size=d.kind==='xp'?[.36,.52,.7,1,1.3][tier]:fitArtScale(sprite.texture,d.kind==='chest'?48:36);sprite.scale.set(size);sprite.tint=d.kind==='xp'?[0xffffff,0xffffff,0xe2c9ff,0xbbe7ff,0xffdd8c][tier]:0xffffff;
      if(d.kind==='xp'&&d.value>=48){this.fxGraphic.circle(d.x,d.y,12+Math.sin(this.elapsed*4)*2).stroke({color:d.value>=192?0xffd577:0x99cde9,width:d.value>=192?3:1.5,alpha:.65});if(d.value>=192)for(let n=0;n<5;n++){const a=this.elapsed+n*TAU/5;this.fxGraphic.circle(d.x+Math.cos(a)*20,d.y+Math.sin(a)*20,2).fill({color:[0xffd577,0xbcecd9,0x92c5fb,0xd1a6ed,0xffb4ba][n],alpha:.8});}}
    }
  }
  private drawOrbitAndBots(){
    const g=this.game,p=g.player,orbit=g.weapons.find(w=>w.id==='orbit'),bot=g.weapons.find(w=>w.id==='bot'||w.id==='hub');
    const draw=(skill:typeof orbit,sprites:Sprite[],kind:'orbit'|'bot')=>{
      let count=0;if(skill){const params=weaponParams(this.content,skill,g.combatStats);count=params.count;
        const range=params.range;
        for(let n=0;n<count;n++){
          if(!sprites[n]){sprites[n]=new Sprite(this.textures.get(kind==='bot'?'bot':'book'));sprites[n].anchor.set(.5);this.effects.addChild(sprites[n]);}
          const s=sprites[n];s.visible=true;s.scale.set(fitArtScale(s.texture,kind==='bot'?42:32));
          const a=g.combatTime*2.4*g.combatStats.haste+n*TAU/count;
          const pos=kind==='bot'?botPosition(p.x,p.y,g.combatTime,n,count,skill.level,skill.evolved):{x:p.x+Math.cos(a)*range,y:p.y+Math.sin(a)*range};s.position.set(pos.x,pos.y);s.rotation=kind==='bot'?0:a+.2;
          if(kind==='bot'&&skill.evolved)this.fxGraphic.moveTo(p.x,p.y).lineTo(pos.x,pos.y).stroke({color:0x6bc8a4,width:1,alpha:.35});
        }
        if(kind==='orbit')this.fxGraphic.circle(p.x,p.y,range).stroke({color:0x6bb6ac,width:1,alpha:.35});
        if(kind==='orbit'&&skill.evolved)for(let edge=0;edge<6;edge++){
          const a=edge*TAU/6,b=(edge+1)*TAU/6,rebuild=edge===this.brokenOrbitEdge?clamp(1-(this.orbitRebuildUntil-g.combatTime)/.3,0,1):1;
          this.fxGraphic.moveTo(p.x+Math.cos(a)*range,p.y+Math.sin(a)*range).lineTo(p.x+Math.cos(b)*range,p.y+Math.sin(b)*range).stroke({color:0x6bc8b8,width:3,alpha:.65*rebuild});
        }
      }
      for(let n=count;n<sprites.length;n++)sprites[n].visible=false;
    };draw(orbit,this.orbitSprites,'orbit');draw(bot,this.botSprites,'bot');
    for(const [n,drone] of g.drones.entries()){
      const art=this.textures.frameTexture(g.weapons.find(w=>w.id==='s2:drone')?.evolved?'s2:drone:evolved':'s2:drone');let sprite=this.droneSprites[n];if(art){if(!sprite){sprite=new Sprite(art);sprite.anchor.set(.5);this.entityLayer.addChild(sprite);this.droneSprites[n]=sprite;}sprite.texture=art;sprite.visible=true;sprite.position.set(drone.x,drone.y);sprite.scale.set(fitArtScale(art,48));sprite.rotation=this.settings.motion?Math.sin(g.combatTime*4+n)*.06:0;}else if(sprite)sprite.visible=false;
      const gr=this.fxGraphic,x=drone.x,y=drone.y,t=g.combatTime*24;
      if(!art)gr.roundRect(x-12,y-8,24,16,5).fill(0xd7edf0).stroke({color:0x357594,width:2});gr.circle(x,y,4).fill(0x4089ac);
      for(const side of [-1,1]){gr.moveTo(x,y).lineTo(x+side*19,y-8).stroke({color:0x357594,width:2});gr.ellipse(x+side*19,y-9,10,3+Math.sin(t)*1.5).stroke({color:0x529fcc,width:2,alpha:.9});}
      if(g.weapons.find(w=>w.id==='s2:drone')?.evolved)gr.moveTo(p.x,p.y).lineTo(x,y).stroke({color:0x7dd7ec,width:1,alpha:.3});
    }
    for(let n=g.drones.length;n<this.droneSprites.length;n++)this.droneSprites[n].visible=false;
    for(const bolt of g.droneBolts)this.fxGraphic.moveTo(bolt.prevX,bolt.prevY).lineTo(bolt.x,bolt.y).stroke({color:bolt.sync?0xc1f6ff:0x529fcc,width:bolt.sync?4:2,alpha:.9});
  }
  private drawEnemyStatus(){
    const gr=this.fxGraphic,g=this.game,e=g.enemies;
    for(const id of e.active){if(e.hp[id]<=0||!this.inView(e.x[id],e.y[id],260))continue;const x=e.x[id],y=e.y[id],r=e.radius[id],def=this.content.enemyById[e.kind[id]],bits=e.affixes[id];
      if(g.protocolMarks.some(m=>m.id===id&&m.generation===e.generation[id]))gr.poly([x-7,y-r-11,x,y-r-18,x+7,y-r-11,x,y-r-4]).stroke({color:0x408b79,width:2});
      if(e.shield[id]>0){const points:number[]=[];for(let n=0;n<6;n++){const a=n*TAU/6;points.push(x+Math.cos(a)*(r+8),y+Math.sin(a)*(r+8));}gr.poly(points).fill({color:0x9bdde5,alpha:.1}).stroke({color:0x6dbac7,width:2,alpha:.8});}
      if(e.frozen[id]>0){for(let n=0;n<6;n++){const a=n*TAU/6,rr=r+8;gr.moveTo(x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5).lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr).stroke({color:0xd4f6ff,width:2,alpha:.9});}gr.circle(x,y,r+5).fill({color:0x92d1f5,alpha:.2});}
      if(def.behavior==='aura'||(bits&16)){const radius=bits&16?220:180;gr.circle(x,y,radius).stroke({color:0xd2c66e,width:2,alpha:.3});for(const other of e.active){if(other===id||e.hp[other]<=0||distanceSq(x,y,e.x[other],e.y[other])>radius**2)continue;gr.moveTo(x,y).lineTo(e.x[other],e.y[other]).stroke({color:0xc8be68,width:1,alpha:.18});}}
      if(e.rank[id]===RANK_CODE.elite){gr.circle(x,y,r+4).stroke({color:0xd693c5,width:2,alpha:.85});const marks=[1,2,4,8,16,32,64,128].filter(bit=>bits&bit);for(const [n,bit] of marks.entries()){const px=x+(n-(marks.length-1)/2)*14,py=y-r-17;if(bit===1){gr.circle(px-3,py,4).stroke({color:0xa5bde9,width:1.5});gr.circle(px+3,py,4).stroke({color:0xa5bde9,width:1.5});}else if(bit===2)gr.poly([px,py-6,px+5,py-2,px+4,py+4,px,py+7,px-4,py+4,px-5,py-2]).stroke({color:0x7fcbd5,width:1.5});else if(bit===4)gr.poly([px-5,py+5,px,py-5,px+5,py+5]).stroke({color:0xea965a,width:2});else if(bit===8)gr.circle(px,py,5).stroke({color:0xe7817f,width:2});else if(bit===16)gr.circle(px,py,6).stroke({color:0xcbbd62,width:2});else if(bit===64)gr.rect(px-7,py-4,5,8).rect(px+2,py-4,5,8).stroke({color:0xcbb56b,width:2});else if(bit===128)gr.arc(px,py,6,.5,Math.PI*1.7).stroke({color:0xdb8c79,width:2});else gr.moveTo(px-6,py+4).lineTo(px,py-4).lineTo(px+6,py+4).stroke({color:0xba91df,width:2});}}
      if(e.rank[id]===RANK_CODE.miniBoss){gr.roundRect(x-35,y-r-16,70,5,2).fill({color:0x4e685b,alpha:.3});gr.roundRect(x-35,y-r-16,Math.max(1,70*e.hp[id]/e.maxHp[id]),5,2).fill(0xb788bb);}
    }
    for(const review of [g.projectReview,g.expoFinal])if(review){const boss=review.owner;for(const node of review.nodes){const x=e.x[boss],y=e.y[boss],dx=e.x[node.id]-x,dy=e.y[node.id]-y,d=Math.hypot(dx,dy);for(let n=0;n<d;n+=18)gr.moveTo(x+dx*n/d,y+dy*n/d).lineTo(x+dx*Math.min(d,n+9)/d,y+dy*Math.min(d,n+9)/d).stroke({color:0xc7ae65,width:3,alpha:.9});gr.rect(e.x[node.id]-7,e.y[node.id]-7,14,14).stroke({color:0xffdf91,width:2});}if(review.exposed>0)gr.circle(e.x[boss],e.y[boss],e.radius[boss]+12).stroke({color:0xffedbb,width:4,alpha:.9});}
    for(const mark of g.risk.marks)gr.poly([e.x[mark.id],e.y[mark.id]-e.radius[mark.id]-14,e.x[mark.id]+6,e.y[mark.id]-e.radius[mark.id]-6,e.x[mark.id],e.y[mark.id]-e.radius[mark.id]+2,e.x[mark.id]-6,e.y[mark.id]-e.radius[mark.id]-6]).stroke({color:0xe6c88f,width:2});
    for(const link of g.advanced.links){const a=link.owner;if(!e.alive[a.id]||e.generation[a.id]!==a.generation)continue;for(const b of link.targets){if(!e.alive[b.id]||e.generation[b.id]!==b.generation)continue;const x=e.x[a.id],y=e.y[a.id],dx=e.x[b.id]-x,dy=e.y[b.id]-y,d=Math.hypot(dx,dy),color=link.kind==='coordinator'?0xd098a4:0xcbb56b;for(let n=0;n<d;n+=18)gr.moveTo(x+dx*n/d,y+dy*n/d).lineTo(x+dx*Math.min(d,n+9)/d,y+dy*Math.min(d,n+9)/d).stroke({color,width:3,alpha:.85});gr.circle(x,y,5).stroke({color,width:2});}}
    if(g.ultimate.remaining>0&&g.ultimate.id==='parallel')for(let n=0;n<6;n++){const a=n*TAU/6+g.combatTime*.5,x=g.player.x+Math.cos(a)*85,y=g.player.y+Math.sin(a)*65;gr.roundRect(x-13,y-10,26,20,5).fill({color:0xc2eedb,alpha:.8}).stroke({color:0x448a79,width:2});gr.circle(x-5,y-2,2).fill(0x317666);gr.circle(x+5,y-2,2).fill(0x317666);}
  }
  private drawGroundEffects(){
    const gr=this.groundFX,g=this.game;gr.clear();
    const artLandmark=(id:string,x:number,y:number)=>{const texture=this.textures.frameTexture(id);let sprite=this.landmarkSprites.get(id);if(!texture){if(sprite)sprite.visible=false;return false;}if(!sprite){sprite=new Sprite(texture);sprite.anchor.set(.5,.82);this.landmarkSprites.set(id,sprite);this.propLayer.addChild(sprite);}sprite.texture=texture;sprite.position.set(x,y+22);sprite.scale.set(fitArtScale(texture,86));sprite.visible=true;return true;};
    for(const sprite of this.landmarkSprites.values())sprite.visible=false;
    for(const point of g.interactions.points){if(!this.inView(point.x,point.y,80))continue;if(artLandmark(point.id,point.x,point.y))continue;const color=point.id==='s2:infirmary'?0x579d8a:0x637b9f;gr.roundRect(point.x-28,point.y-23,56,46,7).fill({color,alpha:.85}).stroke({color:0xf6e8bc,width:2});if(point.id==='s2:infirmary')gr.rect(point.x-5,point.y-15,10,30).rect(point.x-15,point.y-5,30,10).fill(0xe4f3e9);else gr.rect(point.x-18,point.y-12,36,24).stroke({color:0xf6e8bc,width:3});}
    if(g.revision.active){const site=g.revision.active.entry.site;gr.circle(site.center.x,site.center.y,site.radius+72).stroke({color:0x637b9f,width:4,alpha:.6});}
    if(g.event&&g.event.warning<=0){const a=g.event;if(a.kind==='portal'||a.kind==='s2:jointExhibit')for(const [n,point] of [{x:a.x,y:a.y},{x:a.x2,y:a.y2}].entries())gr.circle(point.x,point.y,a.kind==='portal'?38:52).stroke({color:n<a.visits?0x6b9d86:0x637b9f,width:4,alpha:.8});}
    if(g.tables.table){const t=g.tables.table;if(!artLandmark(t.kind==='joint'?'s2:jointTable':'s2:amendmentTable',t.x,t.y)){gr.roundRect(t.x-26,t.y-18,52,36,5).fill({color:t.kind==='joint'?0xc7ae65:0x9a95c9,alpha:.8}).stroke({color:0xffedbb,width:3});gr.moveTo(t.x-32,t.y+22).lineTo(t.x+32,t.y+22).stroke({color:0x526b65,width:5});}}
    for(const node of g.fusionAttacks.nodes){this.fxGraphic.roundRect(node.x-12,node.y-10,24,20,4).fill(0x61bdce).stroke({color:0xe0f8ef,width:2});if(node.stationary)this.fxGraphic.rect(node.x-17,node.y+12,34,4).fill(0x3c8295);else this.fxGraphic.moveTo(node.x-21,node.y-12).lineTo(node.x+21,node.y-12).stroke({color:0x9cddde,width:2});}
    for(const b of g.fusionAttacks.bolts)this.fxGraphic.circle(b.x,b.y,4).fill(0x61bdce);
    for(const line of g.fusionAttacks.lines)if(line.age>=0)gr.moveTo(line.x,line.y).lineTo(line.x2,line.y2).stroke({color:0x7bd7bd,width:line.hit?line.width:2,alpha:line.hit?.65:.4});
    for(const segment of g.fusionAttacks.segments)gr.moveTo(segment.x,segment.y).lineTo(segment.x2,segment.y2).stroke({color:0xba9ae8,width:2,alpha:.8});
    for(const c of g.fusionAttacks.constructs){const x=(c.x+c.x2)/2,y=(c.y+c.y2)/2;gr.rect(x-9,y-9,18,18).stroke({color:0xba9ae8,width:2});gr.circle(x,y,c.radius).stroke({color:0xba9ae8,width:1,alpha:.25});}
    for(const s of g.fiberSegments)this.fxGraphic.moveTo(s.x,s.y).lineTo(s.x2,s.y2).stroke({color:0x709fe8,width:s.connector?3:2,alpha:Math.min(.9,s.life)});
    for(const b of g.inkBeads)this.fxGraphic.circle(b.x,b.y,5).fill(0xae7cd2);
    for(const m of g.structureMarks)this.fxGraphic.rect(m.x-9,m.y-9,18,18).stroke({color:0xae7cd2,width:2}).moveTo(m.x-12,m.y).lineTo(m.x+12,m.y).stroke({color:0xae7cd2,width:1});
    for(const line of g.whiteboardLines){
      if(line.age<0)continue;const progress=line.hit?1:clamp(line.age/line.hitDelay,0,1),x2=lerp(line.x,line.x2,progress),y2=lerp(line.y,line.y2,progress),fade=line.hit?clamp((line.life-line.age)/.24,0,1):.6;
      // Thin paired chalk strokes and square endpoints, never danger stripes,
      // arrowheads, dashed boundaries, collision walls or filled damage lanes.
      gr.moveTo(line.x,line.y).lineTo(x2,y2).stroke({color:0x408b79,width:line.hit?4:2,alpha:fade});gr.moveTo(line.x+3,line.y+3).lineTo(x2+3,y2+3).stroke({color:0xc4f3df,width:1,alpha:fade});
      gr.rect(line.x-3,line.y-3,6,6).stroke({color:0x408b79,width:1,alpha:fade});gr.rect(x2-3,y2-3,6,6).stroke({color:0x408b79,width:1,alpha:fade});
    }
    for(const id of g.areas.active){const a=g.areas.data[id];if(!this.inView(a.x,a.y,a.maxRadius))continue;
      if(a.kind==='mine'){gr.circle(a.x,a.y,a.maxRadius*.45).fill({color:a.color,alpha:.08}).stroke({color:a.color,width:2,alpha:a.age<a.delay?.35:.8});gr.moveTo(a.x-10,a.y+12).lineTo(a.x,a.y-13).lineTo(a.x+10,a.y+12).stroke({color:a.color,width:2});}
      else if(a.kind==='cryo'||a.kind==='icefire'){gr.circle(a.x,a.y,a.radius).fill({color:a.color,alpha:.13}).stroke({color:a.color,width:a.evolved?4:2,alpha:.6});for(let n=0;n<10;n++){const angle=n*TAU/10+g.combatTime*.15,x=a.x+Math.cos(angle)*a.radius*.75,y=a.y+Math.sin(angle)*a.radius*.75;gr.poly([x,y-9,x+4,y,x,y+9,x-4,y]).stroke({color:a.kind==='icefire'&&n%2?0xf3bd6f:0xd4f7ff,width:2,alpha:.7});}}
      else if(a.kind==='brick'||a.kind==='aftershock'){gr.circle(a.x,a.y,a.maxRadius).stroke({color:a.color,width:2,alpha:.65});}
      else if(a.kind==='eraser'||a.kind==='ink'){gr.circle(a.x,a.y,a.radius).fill({color:a.kind==='eraser'?0xffffff:0x38375b,alpha:.2}).stroke({color:a.color,width:a.evolved?4:2,alpha:.4});for(let n=0;n<8;n++){const angle=g.combatTime+n*TAU/8;gr.circle(a.x+Math.cos(angle)*a.radius*.85,a.y+Math.sin(angle)*a.radius*.85,2).fill({color:0xffffff,alpha:.8});}if(a.evolved&&a.kind==='eraser')gr.circle(a.x,a.y,a.radius-8).stroke({color:0x515869,width:1,alpha:.45});}
      else if(a.kind==='pulse'&&a.age>=a.delay){
        const radius=Math.max(1,a.radius);gr.circle(a.x,a.y,radius).stroke({color:a.color,width:a.evolved?6:4,alpha:.55});
        const skill=g.weapons.find(w=>w.id==='wifi');if((skill?.level??0)>1||a.evolved)for(let n=0;n<8;n++){const angle=n*TAU/8,x=a.x+Math.cos(angle)*radius,y=a.y+Math.sin(angle)*radius;gr.circle(x,y,3).fill({color:0xd7fff1,alpha:.9});if(a.evolved)gr.moveTo(a.x,a.y).lineTo(x,y).stroke({color:a.color,width:1,alpha:.2});}
      }
    }
    const turrets=g.turrets;for(const [n,t] of turrets.entries()){if(t.remaining<=0)continue;gr.roundRect(t.x-19,t.y-15,38,30,5).fill({color:0x83b4e0,alpha:.35}).stroke({color:0x6d9fd8,width:2});gr.circle(t.x,t.y,11).stroke({color:0xc0effe,width:3});if(n){const previous=turrets[n-1];gr.moveTo(previous.x,previous.y).lineTo(t.x,t.y).stroke({color:0x8dc1e6,width:1,alpha:.5});}}
    const mines=g.areas.active.map(id=>g.areas.data[id]).filter(a=>a.kind==='mine'&&a.evolved);for(let n=1;n<mines.length;n++)if(distanceSq(mines[n].x,mines[n].y,mines[n-1].x,mines[n-1].y)<200**2)gr.moveTo(mines[n-1].x,mines[n-1].y).lineTo(mines[n].x,mines[n].y).stroke({color:0xe1b955,width:1,alpha:.5});
    if(g.player.shield+(this.latest?.inheritance.shield??0)>0)gr.circle(g.player.x,g.player.y,38).fill({color:0xe7c976,alpha:.12}).stroke({color:0xe7c976,width:2,alpha:.7});
    if(g.momentum.active){const p=g.player;for(let n=0;n<2;n++)gr.circle(p.x,p.y,42+n*12+Math.sin(g.combatTime*8)*2).stroke({color:n?0xffd477:0xffa66b,width:n?1:3,alpha:.6});}

  }
  private drawTelegraphs(){
    const gr=this.telegraphs,guides=this.dangerGuides,g=this.game;gr.clear();guides.clear();
    // These unfiltered graphics sit over bloom, player attacks and weather.
    this.dangerLayer.setChildIndex(guides,this.dangerLayer.children.length-1);
    const dash=(x:number,y:number,x2:number,y2:number,color:number,width=3)=>{
      const length=Math.hypot(x2-x,y2-y);for(let at=0;at<length;at+=16){const end=Math.min(length,at+9);gr.moveTo(x+(x2-x)*at/length,y+(y2-y)*at/length).lineTo(x+(x2-x)*end/length,y+(y2-y)*end/length).stroke({color,width});}
    };
    const edge=(x:number,y:number)=>{
      if(this.inView(x,y,0))return;const dx=x-this.cameraX,dy=y-this.cameraY,halfW=this.viewWidth/2-28,halfH=this.viewHeight/2-28,t=Math.min(halfW/Math.max(1,Math.abs(dx)),halfH/Math.max(1,Math.abs(dy))),a=Math.atan2(dy,dx),cx=this.cameraX+dx*t,cy=this.cameraY+dy*t;
      const point=(along:number,side:number)=>({x:cx+Math.cos(a)*along-Math.sin(a)*side,y:cy+Math.sin(a)*along+Math.cos(a)*side});
      const tip=point(12,0),left=point(-8,10),right=point(-8,-10);guides.poly([tip.x,tip.y,left.x,left.y,right.x,right.y]).fill(0xffc46b).stroke({color:0x432d38,width:3});
    };
    if(this.latest?.phase==='assessmentIntro'&&g.assessmentAdmission){const site=g.assessmentAdmission.site;gr.circle(site.center.x,site.center.y,site.radius).fill({color:0x76bfa9,alpha:.1}).stroke({color:0x4d968e,width:3,alpha:.85});gr.circle(site.player.x,site.player.y,24).stroke({color:0x4d968e,width:3});}
    const board=g.proposalBoard;
    if(board){
      const x=g.enemies.x[board.owner],y=g.enemies.y[board.owner],r=g.enemies.radius[board.owner],ratio=clamp(g.enemies.hp[board.owner]/g.enemies.maxHp[board.owner],0,1);
      guides.roundRect(x-60,y-r-28,120,8,3).fill(0x324c43).roundRect(x-59,y-r-27,Math.max(1,118*ratio),6,2).fill(board.stage===1?0xf2ca70:0x9cd9d0);
      guides.moveTo(x,y-r-30).lineTo(x,y-r-18).stroke({color:0xffffff,width:2});
      if(board.move==='recovery'||board.move==='transition')guides.circle(x,y,r+14).stroke({color:0x285f61,width:5}).circle(x,y,r+14).stroke({color:0xb9f2d3,width:2});
    }
    for(const id of g.enemyShots.active){const s=g.enemyShots.data[id];
      gr.circle(s.x,s.y,s.radius+3).stroke({color:0x432d38,width:3}).circle(s.x,s.y,s.radius+2).stroke({color:0xfff3da,width:1.5});
      if(s.age<0){const speed=Math.hypot(s.vx,s.vy)||1;dash(s.x,s.y,s.x+s.vx/speed*70,s.y+s.vy/speed*70,0xb65e8a,2);gr.circle(s.x,s.y,s.radius+9).stroke({color:0xb65e8a,width:2});}
      edge(s.x,s.y);
    }
    for(const h of g.hazards){
      const warning=h.phase==='warning',color=warning?0xb86122:0xc64055,points:number[]=[],r=h.kind==='ring'?(warning?h.radius:Math.max(1,ringRadius(h))):h.radius;
      if(h.kind==='line'){
        const a=Math.atan2(h.y2-h.y,h.x2-h.x);
        for(let n=0;n<=12;n++){const t=a-Math.PI/2+n*Math.PI/12;points.push(h.x2+Math.cos(t)*r,h.y2+Math.sin(t)*r);}
        for(let n=0;n<=12;n++){const t=a+Math.PI/2+n*Math.PI/12;points.push(h.x+Math.cos(t)*r,h.y+Math.sin(t)*r);}
      }else{
        const gap=h.kind==='ring'?h.safeHalfAngle:0,start=h.kind==='ring'?(h.safeAngle??0)+gap:0,end=h.kind==='ring'?(h.safeAngle??0)+TAU-gap:TAU;
        for(let n=0;n<=64;n++){const a=start+(end-start)*n/64;points.push(h.x+Math.cos(a)*r,h.y+Math.sin(a)*r);}
      }
      if(!warning&&h.kind!=='ring')gr.poly(points).fill({color,alpha:.24});
      // Dash the warning perimeter; solid double-contrast edges are damaging.
      for(let n=2;n<points.length;n+=2){
        if(warning){if(n%4===0)gr.moveTo(points[n-2],points[n-1]).lineTo(points[n],points[n+1]).stroke({color,width:3});}
        else gr.moveTo(points[n-2],points[n-1]).lineTo(points[n],points[n+1]).stroke({color:0x422b38,width:h.kind==='ring'?15:5}).moveTo(points[n-2],points[n-1]).lineTo(points[n],points[n+1]).stroke({color,width:h.kind==='ring'?10:3});
      }
      if(h.kind!=='ring'){if(warning)dash(points.at(-2)!,points.at(-1)!,points[0],points[1],color);else gr.moveTo(points.at(-2)!,points.at(-1)!).lineTo(points[0],points[1]).stroke({color,width:3});}
      if(h.kind==='line'){
        const dx=h.x2-h.x,dy=h.y2-h.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;
        for(let at=20;at<d;at+=32){const x=h.x+dx*at/d,y=h.y+dy*at/d;gr.moveTo(x+nx*r*.7-dx/d*5,y+ny*r*.7-dy/d*5).lineTo(x-nx*r*.7+dx/d*5,y-ny*r*.7+dy/d*5).stroke({color,width:2,alpha:.65});}
        gr.moveTo(h.x2-dx/d*20+nx*10,h.y2-dy/d*20+ny*10).lineTo(h.x2,h.y2).lineTo(h.x2-dx/d*20-nx*10,h.y2-dy/d*20-ny*10).stroke({color,width:4});
      }else if(h.kind==='circle')for(let y=-r+16;y<r;y+=24){const half=Math.sqrt(Math.max(0,r*r-y*y))*.85;gr.moveTo(h.x-half,h.y+y).lineTo(h.x+half,h.y+y).stroke({color,width:2,alpha:.5});}
      if(warning){
        const progress=clamp(1-h.warning/h.warningTotal,0,1),unitMarker=h.owner!==undefined&&(h.kind==='line'&&g.enemies.kind[h.owner]?.startsWith('s2:')||g.parcels.some(p=>p.slot===h.owner)),x=h.x,y=unitMarker?h.y-h.radius-24:h.y;
        gr.circle(x,y,13).stroke({color:0x432d38,width:3});gr.arc(x,y,13,-Math.PI/2,-Math.PI/2+TAU*Math.max(.001,progress)).stroke({color:0xffe3a3,width:4});if(h.locked)gr.poly([x,y-5,x+5,y,x,y+5,x-5,y]).fill(color);
      }
      if(h.kind==='ring')for(const a of [(h.safeAngle??0)-h.safeHalfAngle,(h.safeAngle??0)+h.safeHalfAngle])gr.moveTo(h.x,h.y).lineTo(h.x+Math.cos(a)*h.radius,h.y+Math.sin(a)*h.radius).stroke({color:0x286e65,width:3});
      edge(h.x,h.y);
    }
    for(const parcel of g.parcels){
      const x=g.enemies.x[parcel.slot],y=g.enemies.y[parcel.slot];
      gr.roundRect(x-17,y-17,34,34,5).stroke({color:0x432d38,width:5}).stroke({color:0xffefd2,width:2});
      if(parcel.phase==='warning')gr.arc(x,y,24,-Math.PI/2,-Math.PI/2+TAU*Math.max(.001,1-parcel.warning/parcel.warningTotal)).stroke({color:0xaa78c2,width:4});
      edge(x,y);
    }
    const route=[...g.hazards].sort((a,b)=>b.token-a.token)[0]?.route;
    if(route){const end=route.points.at(-1)!;gr.poly([end.x,end.y-13,end.x+13,end.y,end.x,end.y+13,end.x-13,end.y]).stroke({color:0xf1ffe6,width:6}).stroke({color:0x286e65,width:3});}
    // Player centre and projectile outlines remain legible during full effects.
    guides.circle(g.player.x,g.player.y,19).stroke({color:0x253d43,width:4}).circle(g.player.x,g.player.y,19).stroke({color:0xf0ffe5,width:2}).circle(g.player.x,g.player.y,3).fill(0xf0ffe5);
  }
  private handleEvent(event:ContentVisualEvent,hold=0){
    if(!this.inView(event.x,event.y,event.size))return;
    if(['ultimate','fusion'].includes(event.type)){this.bloomClimax=1.2;const count=this.quality==='high'?1600:this.quality==='medium'?550:100;this.particles.burst(event.x,event.y,event.color,count,480,1.4,event.weapon==='demolition'?'brick':event.weapon==='hub'?'blueprint':event.weapon==='icefire'||event.ultimate==='lastMinute'?'ice':event.weapon==='sky'?'glass':event.weapon==='binder'?'metal':'spark');}
    if(event.type==='shieldBreak'){this.particles.burst(event.x,event.y,event.color,this.quality==='high'?100:this.quality==='medium'?40:12,230,1.1,'glass');}
    if(event.type==='block'){
      this.particles.burst(event.x,event.y,event.color,this.quality==='high'?24:this.quality==='medium'?12:4,150,.7,event.material??'paper');
      if(event.weapon==='orbit'){const angle=((event.angle??0)+TAU)%TAU;this.brokenOrbitEdge=Math.floor(angle/TAU*6);this.orbitRebuildUntil=this.game.combatTime+.3;}
    }
    if(event.type==='hit'){
      const feel=attackFeel(legacyFeedbackEvent(event)),count=this.quality==='high'?(event.critical?20:8):this.quality==='medium'?(event.critical?10:4):(event.critical?4:2);
      this.particles.burst(event.x,event.y,event.color,Math.round(count*feel.particles),150*feel.weight,(event.critical?1.25:.7)*feel.radius,event.material);
      if(this.settings.damageNumbers&&event.value)this.numbers.spawn(event.value,event.x,event.y,!!event.critical,event.damageType??'normal',`${event.slot}:${event.generation}:${event.sourceKey}:${event.damageType}`);
      this.transient.push({event,life:event.critical?.09:.06,total:event.critical?.09:.06,hold});
    }else if(event.type==='death'){
      const kind=event.contentEnemyId??event.enemyKind,material=event.material??(event.enemyKind?enemyMaterial(event.enemyKind):'paper');if(kind&&this.content.enemyById[kind])this.deathFX.spawn({...legacyFeedbackEvent(event),material},this.textures.get(`enemy-${kind}`),hold,this.quality,this.settings.motion);
      this.particles.burst(event.x,event.y,event.color,this.quality==='low'?4:material==='glass'||material==='ice'?14:material==='metal'?10:8,material==='glass'||material==='ice'?290:210,1.1,material);
      if(material==='metal'||material==='brick')this.particles.burst(event.x,event.y,0xffdc8f,this.quality==='low'?2:6,220,.55,'spark');
    }
    else if(event.type==='hurt'){this.hitFlash=.18;this.particles.burst(event.x,event.y,event.color,16,120);if(this.settings.damageNumbers&&event.value)this.numbers.spawn(event.value,event.x,event.y,false,'hurt');}
    else if(event.type==='shot')this.particles.burst(event.x,event.y,event.color,2,60,.4);
    else if(event.type==='pickup'){this.particles.burst(event.x,event.y,event.color,2,40,.35);if(this.settings.damageNumbers&&event.damageType==='heal'&&event.value)this.numbers.spawn(event.value,event.x,event.y,false,'heal','player-heal');}
    else{
      const total=event.duration??(event.type==='arc'?.27:event.type==='lightning'?.22:.65);this.transient.push({event,life:total,total});
      if(event.type==='ring'&&event.text==='explosion'){
        this.particles.burst(event.x,event.y,event.color,this.quality==='high'?18:this.quality==='medium'?8:3,180,.8,'smoke');
        this.particles.burst(event.x,event.y,event.color,this.quality==='high'?20:this.quality==='medium'?8:3,220,.6,event.weapon==='code'?'code':'paper');
      }
      if(event.type==='frenzy'||event.type==='clear'){this.bloomClimax=.8;this.particles.burst(event.x,event.y,event.color,this.quality==='high'?180:this.quality==='medium'?70:15,240,1.2,'spark',event.type==='clear');}
      if(['boss','evolution','level'].includes(event.type)){
        const count=event.type==='level'?(this.quality==='high'?150:this.quality==='medium'?80:20):(this.quality==='high'?600:this.quality==='medium'?260:60);
        this.particles.burst(event.x,event.y,event.color,count,event.type==='level'?220:400,1.4,'spark',event.type==='level');this.bloomClimax=.8;

      }

    }
    const limit=this.quality==='high'?720:this.quality==='medium'?300:100;if(this.transient.length>limit)this.transient.splice(0,this.transient.length-limit);
  }
  private drawTransient(item:Transient){
    const e=item.event,g=this.fxGraphic,t=this.settings.motion?1-item.life/item.total:.55,fade=this.settings.motion?1-t:1;
    if(e.type==='ultimate'){drawUltimate(g,legacyFeedbackEvent(e),t,this.quality==='low');return;}
    if(e.type==='signature'||e.type==='fusion'){drawSignature(g,legacyFeedbackEvent(e),t,this.quality==='low');}
    else if(e.type==='hit'){
      const a=e.angle??0;for(let n=-1;n<=1;n++){const q=a+n*.45,r=10+22*t;g.moveTo(e.x+Math.cos(q)*3,e.y+Math.sin(q)*3).lineTo(e.x+Math.cos(q)*r,e.y+Math.sin(q)*r).stroke({color:e.critical?0xffe9a4:e.color,width:e.critical?2:1,alpha:fade});}
    }else if(e.type==='block'){
      for(let n=0;n<6;n++){const a=n*TAU/6+t;g.moveTo(e.x+Math.cos(a)*e.size*t,e.y+Math.sin(a)*e.size*t).lineTo(e.x+Math.cos(a)*(e.size*t+8),e.y+Math.sin(a)*(e.size*t+8)).stroke({color:e.color,width:2,alpha:fade});}
    }else if(e.type==='beam'){
      g.moveTo(e.x,e.y).lineTo(e.x2!,e.y2!).stroke({color:e.color,width:e.size*1.8,alpha:.15*fade});g.moveTo(e.x,e.y).lineTo(e.x2!,e.y2!).stroke({color:e.color,width:e.size*.6,alpha:fade});g.moveTo(e.x,e.y).lineTo(e.x2!,e.y2!).stroke({color:0xfff9df,width:e.size*.18,alpha:fade});
      if(e.evolved){const x=e.x+(e.x2!-e.x)*t,y=e.y+(e.y2!-e.y)*t;g.circle(x,y,e.size*.6).fill({color:0xffffea,alpha:fade*.5});g.circle(e.x2!,e.y2!,12+25*t).stroke({color:e.color,width:2,alpha:fade});}
    }else if(e.type==='lightning'||e.type==='chain'){
      for(let layer=0;layer<2;layer++){
        g.moveTo(e.x,e.y);const dx=e.x2!-e.x,dy=e.y2!-e.y,d=Math.hypot(dx,dy)||1;
        for(let n=1;n<=7;n++){const p=n/7,offset=n===7?0:Math.sin(n*41.7+e.x)*13;g.lineTo(e.x+dx*p-dy/d*offset,e.y+dy*p+dx/d*offset);}
        g.stroke({color:layer?0xfffcdf:e.color,width:layer?e.size*.45:e.size*2,alpha:fade*(layer?1:.55)});
      }
      if(e.type==='chain')g.circle(e.x2!,e.y2!,6+t*12).stroke({color:0xffdb7a,width:2,alpha:fade});
    }else if(e.type==='arc'){
      const a=e.angle??0,spread=e.value??Math.PI/2,r=e.size*(.55+t*.45);
      g.moveTo(e.x,e.y).arc(e.x,e.y,r,a-spread/2,a+spread/2).closePath().fill({color:e.color,alpha:fade*.16});
      for(let n=0;n<3;n++)g.arc(e.x,e.y,r*(1-n*.15),a-spread/2,a+spread/2).stroke({color:n===0?0xfff7d8:e.color,width:n===0?3:2,alpha:fade*.75});
      if(e.text==='keyboard')for(let n=0;n<4+(e.level??1)*2;n++){const count=4+(e.level??1)*2,angle=a-spread*.45+n*spread/count;g.roundRect(e.x+Math.cos(angle)*r*.72-7,e.y+Math.sin(angle)*r*.72-6,14,12,3).fill({color:e.color,alpha:fade}).stroke({color:0xfff7dc,width:1,alpha:fade});}
    }else if(e.type==='rain'){
      g.circle(e.x,e.y,e.size).fill({color:e.color,alpha:.08}).stroke({color:e.color,width:2,alpha:.6});const yy=e.y-(e.evolved?450:260)*(1-t);g.moveTo(e.x+50*(1-t),yy-(e.evolved?100:30)).lineTo(e.x,yy+20).stroke({color:0xf9f5d9,width:e.evolved?12:6,alpha:.8});if(e.evolved)g.roundRect(e.x-14,yy-16,28,34,3).fill({color:0xfffbec,alpha:.9}).stroke({color:e.color,width:2,alpha:.8});
    }else if(e.type==='warning')g.circle(e.x,e.y,e.size*(.8+t*.2)).stroke({color:e.color,width:3,alpha:fade});
    else{
      const radius=Math.max(1,e.size*(1-(1-t)**3));
      if(e.text==='explosion'&&t<.25)g.circle(e.x,e.y,e.size*(.25+t)).fill({color:0xfff8db,alpha:(1-t*4)*this.settings.flash*.7});
      for(let n=0;n<2;n++)g.circle(e.x,e.y,radius*(1-n*.08)).stroke({color:n===0?e.color:0xfff4c9,width:(n===0?5:2)*fade+.5,alpha:fade*.8});
      if(e.type==='evolution'||e.type==='boss')for(let n=0;n<12;n++){const a=n*TAU/12+t*.2;g.moveTo(e.x+Math.cos(a)*radius*.7,e.y+Math.sin(a)*radius*.7).lineTo(e.x+Math.cos(a)*radius,e.y+Math.sin(a)*radius).stroke({color:e.color,width:2,alpha:fade});}
      if(e.type==='evolution'&&e.weapon)drawSignature(g,legacyFeedbackEvent(e),t,this.quality==='low');
      if(e.weapon==='mine'&&e.evolved){g.moveTo(e.x,e.y);for(let n=1;n<=40;n++){const q=n/40*TAU*2,rr=radius*n/40;g.lineTo(e.x+Math.cos(q)*rr,e.y+Math.sin(q)*rr);}g.stroke({color:0xffd77e,width:2,alpha:fade});}
    }
  }
  private releaseFilterTextures(){
    for(const filter of [this.bloom,this.glow,...this.postFX.filters])for(const group of Object.values(filter.groups))for(const [binding,resource] of Object.entries(group.resources)){
      if(resource?._resourceType==='textureSource')group.setResource(Texture.WHITE.source,Number(binding));
      else if(resource?._resourceType==='textureSampler')group.setResource(Texture.WHITE.source.style,Number(binding));
    }
  }
  private destroyApplication(){
    if(!this.appInitialized)return;this.appInitialized=false;
    this.app.destroy(true,{children:true,texture:false,textureSource:false});this.textures?.destroy();this.geometry?.destroy();for(const texture of this.uiTextures)texture.destroy(true);this.uiTextures=[];
  }
  destroy(){
    if(this.destroyed)return;this.destroyed=true;cancelAnimationFrame(this.animation);this.resizeObserver?.disconnect();this.buildPanel?.destroy();this.buildPanel=null;this.settlementPanel?.destroy();this.settlementPanel=undefined;this.input?.destroy();this.loadAbort.abort();this.assetsRelease?.();this.feedback.clear();this.deathFX.clear();this.particles?.clear();
    // Release shader references before Pixi's render-texture pool and atlas sources.
    this.world.filters=[];this.effects.filters=[];if(this.player)this.player.filters=[];
    this.releaseFilterTextures();for(const filter of [this.bloom,this.glow,...this.postFX.filters])filter.destroy();
    this.destroyApplication();
    for(const lease of this.extensionLeases.values())lease.release();this.extensionLeases.clear();this.buildingSprites.clear();
    this.artTextures.clear();this.uiTextures=[];this.trails.clear();this.transient=[];this.enemySprites=[];this.whiteSprites=[];this.shotSprites=[];this.hostileSprites=[];this.dropSprites=[];this.orbitSprites=[];this.botSprites=[];this.droneSprites=[];this.landmarkSprites.clear();this.props=[];if(!this.ownsAudio)this.audio.releaseSession();else this.audio.destroy();void resources.dispose();
  }
}
