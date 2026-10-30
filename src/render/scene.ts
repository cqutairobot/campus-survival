import { Application, Container, Graphics, Sprite, Text, Texture, Rectangle } from 'pixi.js';
import { AdvancedBloomFilter, GlowFilter, RGBSplitFilter, ShockwaveFilter } from 'pixi-filters';
import { gsap } from 'gsap';
import { TextureLibrary } from './procedural';
import { ParticleFX, DamageNumbers } from '../fx/particles';
import {LOGICAL_WIDTH,LOGICAL_HEIGHT} from '../core/run';
import {RANK_CODE} from '../data/enemies';
import {ENEMIES} from '../data/catalog';
import {REGION_CONDITIONS} from '../world/landmarks';
import { BUILDINGS, isBlocked, WORLD_SIZE, ZONES } from '../world/campus';
import { FixedLoop } from '../core/loop';
import { InputController, type Joystick } from '../core/input';
import { clamp, distanceSq, lerp, Random, TAU } from '../core/math';
import type { GameEngine } from '../core/engine';
import { botPosition } from '../weapons/system';
import { weaponParams } from '../weapons/params';
import {TrailHistory} from '../fx/trails';
import {Haptics} from '../fx/haptics';
import {drawUltimate} from '../fx/ultimates';
import {drawSignature} from './signatures';
import {xpGemTier} from '../progression/rules';
import type { Settings, VisualEvent } from '../types';
import { GameAudio } from '../audio/audio';

interface Transient {event:VisualEvent;life:number;total:number}
export class GameScene {
  readonly app=new Application();readonly loop=new FixedLoop();readonly audio:GameAudio;
  private textures!:TextureLibrary;private world=new Container();private ground=new Container();private dropLayer=new Container();private entityLayer=new Container();private propLayer=new Container();private effects=new Container();private dangerLayer=new Container();
  private fxGraphic=new Graphics();private groundFX=new Graphics();private telegraphs=new Graphics();private debugGraphics=new Graphics();private particles!:ParticleFX;private numbers!:DamageNumbers;private player!:Sprite;
  private enemySprites:(Sprite|undefined)[]=[];private shotSprites:(Sprite|undefined)[]=[];private hostileSprites:(Sprite|undefined)[]=[];private dropSprites:(Sprite|undefined)[]=[];private orbitSprites:Sprite[]=[];private botSprites:Sprite[]=[];
  private transient:Transient[]=[];private props:Sprite[]=[];private input!:InputController;private resizeObserver!:ResizeObserver;private animation=0;private lastTime=0;private elapsed=0;private destroyed=false;private ready=false;
  private bloom=new AdvancedBloomFilter({threshold:.65,bloomScale:.6,brightness:1,blur:3,quality:2});private glow=new GlowFilter({distance:8,outerStrength:1.1,color:0x99e1b2,quality:.15});private rgb=new RGBSplitFilter({red:[2,0],green:[0,0],blue:[-2,0]});private shock=new ShockwaveFilter({center:{x:.5,y:.5},speed:700,amplitude:6,wavelength:120});
  private gates=new Graphics();private zoneLabels:{id:string;text:Text}[]=[];private regionStamp='';
  private viewportMask=new Graphics();private letterbox=new Graphics();private viewportY=0;private viewportHeight=0;
  private blackSprite=new Sprite();private hurtSprite=new Sprite();private uiTextures:Texture[]=[];private hitFlash=0;private splitTime=0;private shockTime=1;
  private cameraX=3072;private cameraY=3072;private cameraZoom=1;private baseScale=1;private settings:Settings;private quality:'high'|'medium'|'low'='high';private samples:number[]=[];private perfFrames:number[]=[];private perfTimer=0;private lastRender=0;private renderedPhase='';
  private haptics=new Haptics();private trails=new Map<number,{generation:number;history:TrailHistory}>();private nextCinematic=0;private bloomClimax=0;private longFrames=0;
  private brokenOrbitEdge=-1;private orbitRebuildUntil=0;
  debugGeometry=false;debugNavigation=false;
  constructor(private host:HTMLElement,readonly game:GameEngine,settings:Settings,private onStick:(stick:Joystick)=>void,readonly debug=false){this.settings=settings;this.audio=new GameAudio(settings);}
  async initialize(){
    await this.app.init({resizeTo:this.host,background:0xedecd9,antialias:true,resolution:Math.min(devicePixelRatio,1.25),autoDensity:true,preference:'webgl',powerPreference:'high-performance',autoStart:false});
    if(this.destroyed){this.app.destroy(true,{children:true});return;}
    this.host.appendChild(this.app.canvas);this.textures=new TextureLibrary(this.app);this.particles=new ParticleFX(this.textures);this.numbers=new DamageNumbers(this.textures);
    this.world.addChild(this.ground,this.gates,this.groundFX,this.dropLayer,this.entityLayer,this.propLayer,this.effects,this.numbers.container,this.debugGraphics);
    this.effects.addChild(this.fxGraphic,this.particles.container);this.dangerLayer.addChild(this.telegraphs);
    this.app.stage.addChild(this.letterbox,this.world,this.blackSprite,this.dangerLayer,this.hurtSprite,this.viewportMask);
    this.createMap();this.player=new Sprite(this.textures.get('player'));this.player.anchor.set(.5);this.player.scale.set(.64);this.entityLayer.addChild(this.player);
    this.input=new InputController(this.app.canvas,this.game,this.onStick);this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.host);
    this.applySettings(this.settings);this.resize();this.ready=true;this.lastTime=performance.now();this.animation=requestAnimationFrame(this.animate);
  }
  private createMap(){
    const g=new Graphics(),rng=new Random(7042019);this.ground.addChild(g);
    g.rect(0,0,WORLD_SIZE,WORLD_SIZE).fill(0xe9ecd8);
    for(let n=0;n<220;n++){const x=rng.range(60,6080),y=rng.range(60,6080);g.ellipse(x,y,rng.range(20,80),rng.range(15,50)).fill({color:0xd8e2bf,alpha:.55});}
    for(const x of [2320,3072,4210])g.rect(x-80,0,160,WORLD_SIZE).fill(0xf4ecd8);
    for(const y of [2040,2870,3310,3870])g.rect(0,y-70,WORLD_SIZE,140).fill(0xf4ecd8);
    g.roundRect(2760,2820,630,520,38).fill(0xf4eddd).stroke({color:0xe1d7be,width:3});
    for(let x=2790;x<3380;x+=56)for(let y=2848;y<3340;y+=56)g.rect(x,y,2,2).fill(0xdacfb5);
    g.circle(3072,3072,152).stroke({color:0xe5dcc2,width:3});g.circle(3072,3072,142).stroke({color:0xe5dcc2,width:1.5});
    g.moveTo(3044,3074).lineTo(3072,3059).lineTo(3100,3074).lineTo(3072,3089).closePath().stroke({color:0xd5c9a8,width:3});
    // Campus running track.
    g.roundRect(2560,1360,680,400,180).fill(0xc8997f).stroke({color:0xb38a73,width:3});
    for(let n=0;n<4;n++)g.roundRect(2575+n*13,1375+n*13,650-n*26,370-n*26,165-n*13).stroke({color:0xe9c8a6,width:2});
    g.roundRect(2640,1435,520,250,112).fill(0xb9c68e);g.rect(2750,1450,300,220).stroke({color:0xebead0,width:2});g.circle(2900,1560,40).stroke({color:0xebead0,width:2});
    for(const zone of ZONES){if(zone.id==='track')continue;g.circle(zone.x,zone.y,zone.radius).fill({color:zone.color,alpha:.13}).stroke({color:zone.color,width:2,alpha:.4});
      const t=new Text({text:this.game.manifest.regions.includes(zone.id)?zone.name:`${zone.name} · 未开放\n${REGION_CONDITIONS[zone.id]??''}`,style:{fontFamily:'sans-serif',fontSize:13,fill:0x789781,fontWeight:'bold'}});t.anchor.set(.5);t.position.set(zone.x,zone.y+zone.radius-20);this.ground.addChild(t);this.zoneLabels.push({id:zone.id,text:t});
    }
    for(const f of this.game.map.fences)g.rect(f.x,f.y,f.w,f.h).fill(0x8f9b80).stroke({color:0x607963,width:2});

    for(const b of BUILDINGS){const s=new Sprite(this.textures.get(`building-${b.name}`));s.position.set(b.x-5,b.y-8);this.propLayer.addChild(s);this.props.push(s);}
    for(let n=0;n<260;n++){
      const x=rng.range(300,5840),y=rng.range(300,5840);
      if(isBlocked(x,y,70)||distanceSq(x,y,3072,3072)<440**2||ZONES.some(z=>distanceSq(x,y,z.x,z.y)<(z.radius+30)**2)||[2320,3072,4210].some(v=>Math.abs(x-v)<115)||[2040,2870,3310,3870].some(v=>Math.abs(y-v)<100))continue;
      const tree=new Sprite(this.textures.get('tree'));tree.anchor.set(.5,.85);tree.position.set(x,y);tree.scale.set(rng.range(.7,1.15));this.propLayer.addChild(tree);this.props.push(tree);
    }
    // Low garden planters frame the central square, leaving generous walking lanes.
    for(const [x,y] of [[2750,2780],[3400,2780],[2750,3370],[3400,3370]]){
      g.roundRect(x-42,y-18,84,36,10).fill(0xd2c09a).stroke({color:0xb9ae8e,width:2});
      for(let n=0;n<5;n++)g.circle(x-28+n*14,y-4,13).fill(n%2?0x9fb983:0xb4c891);
    }
    const sign=new Text({text:'北京建筑大学\nBEIJING UNIVERSITY OF CIVIL ENGINEERING AND ARCHITECTURE',style:{fontFamily:'sans-serif',fontSize:15,fill:0x8b997c,align:'center',letterSpacing:2,lineHeight:27}});sign.anchor.set(.5);sign.position.set(3072,3210);this.ground.addChild(sign);
  }
  private resize(){
    if(this.destroyed)return;this.releaseFilterTextures();const w=this.host.clientWidth,h=this.host.clientHeight;this.app.renderer.resize(w,h);
    const daily=this.game.manifest.mode==='daily';this.baseScale=daily?Math.min(w/LOGICAL_WIDTH,h/LOGICAL_HEIGHT):w<650?.78:Math.min(1.1,Math.max(.85,h/800));this.game.viewWidth=daily?LOGICAL_WIDTH:w/this.baseScale;this.game.viewHeight=daily?LOGICAL_HEIGHT:h/this.baseScale;this.viewportHeight=daily?LOGICAL_HEIGHT*this.baseScale:h;this.viewportY=(h-this.viewportHeight)*.5;this.letterbox.clear().rect(0,0,w,h).fill(0xe9ecd8);this.viewportMask.clear().rect(0,this.viewportY,w,this.viewportHeight).fill(0xffffff);if(daily){this.world.mask=this.viewportMask;this.dangerLayer.mask=this.viewportMask;}else{this.world.mask=null;this.dangerLayer.mask=null;this.viewportMask.visible=false;}
    const make=(black:boolean)=>{
      const existing=this.uiTextures[black?0:1],canvas=(existing?.source.resource as HTMLCanvasElement|undefined)??document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d')!;
      const radius=black?260*this.baseScale:Math.max(w,h)*.65,gradient=ctx.createRadialGradient(w/2,h/2,black?radius*.55:Math.min(w,h)*.18,w/2,h/2,radius);
      gradient.addColorStop(0,'rgba(0,0,0,0)');gradient.addColorStop(1,black?'rgba(15,28,30,.94)':'rgba(205,63,63,.7)');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);if(existing){existing.source.resize(w,h);existing.source.update();return existing;}return Texture.from(canvas);
    };
    this.uiTextures=[make(true),make(false)];this.blackSprite.texture=this.uiTextures[0];this.hurtSprite.texture=this.uiTextures[1];
    this.blackSprite.visible=false;this.hurtSprite.alpha=0;this.effects.filterArea=new Rectangle(0,0,w,h);this.input?.clear();this.loop.reset();
  }
  applySettings(settings:Settings){
    this.settings=settings;this.audio.apply(settings);const quality=settings.quality==='auto'?'high':settings.quality;this.setQuality(quality);
  }
  private setQuality(quality:'high'|'medium'|'low'){
    this.quality=quality;this.game.quality=quality;
    if(!this.particles)return;
    this.particles.limit=quality==='high'?32768:quality==='medium'?8192:1024;
    this.numbers.limit=quality==='high'?160:quality==='medium'?80:32;
    this.effects.filters=quality==='low'?[]:[this.bloom];this.bloom.resolution=.5;this.bloom.quality=quality==='high'?3:2;
    this.bloom.threshold=quality==='high'?.55:.6;this.bloom.bloomScale=quality==='high'?1.6:1;
    if(this.player)this.player.filters=quality==='high'?[this.glow]:[];
    const dpr=Math.min(devicePixelRatio,quality==='high'?1.5:quality==='medium'?1.25:1);this.app.renderer.resolution=dpr;
  }
  private animate=(now:number)=>{
    if(this.destroyed||!this.ready)return;this.animation=requestAnimationFrame(this.animate);
    const delta=Math.max(0,(now-this.lastTime)/1000);this.lastTime=now;this.elapsed+=delta;
    const alpha=this.loop.advance(delta,dt=>this.game.tick(dt));
    if(document.hidden){this.loop.reset();return;}
    const renderDelta=this.lastRender?(now-this.lastRender)/1000:delta;this.lastRender=now;
    this.trackPerformance(renderDelta);this.render(Math.min(.1,renderDelta),alpha);
  };
  private trackPerformance(delta:number){
    if(!Number.isFinite(delta)||delta<=0)return;const ms=delta*1000;this.samples.push(ms);if(this.samples.length>180)this.samples.shift();this.perfTimer+=delta;
    if(ms>50)this.longFrames++;
    if(this.debug&&this.perfFrames.length<100000)this.perfFrames.push(ms);
    if(this.perfTimer<3)return;this.perfTimer=0;
    const sorted=[...this.samples].sort((a,b)=>a-b),p95=sorted[Math.floor(sorted.length*.95)]??16.7;
    this.game.fps=1000/(this.samples.reduce((a,b)=>a+b,0)/this.samples.length);this.game.p95=p95;

  }
  private render(dt:number,alpha:number){
    const g=this.game,p=g.player,w=this.app.screen.width,time=g.combatTime;
    if(this.renderedPhase!==g.phase){this.renderedPhase=g.phase;if(g.phase!=='playing')this.input.clear();if(g.phase==='result')this.audio.stopMusic();}
    const px=lerp(p.prevX,p.x,alpha),py=lerp(p.prevY,p.y,alpha),cameraBlend=1-Math.exp(-dt*10);
    this.cameraX=lerp(this.cameraX,px,cameraBlend);this.cameraY=lerp(this.cameraY,py,cameraBlend);
    const shake=this.settings.motion?g.shake*this.settings.shake:0,scale=this.baseScale*(g.manifest.mode==='daily'?1:this.cameraZoom);
    const ox=w*.5-this.cameraX*scale+Math.sin(this.elapsed*93)*shake,oy=this.viewportY+this.viewportHeight*.5-this.cameraY*scale+Math.cos(this.elapsed*81)*shake;
    this.world.position.set(ox,oy);this.world.scale.set(scale);this.dangerLayer.position.copyFrom(this.world.position);this.dangerLayer.scale.set(scale);
    this.player.position.set(px,py-4+Math.sin(time*13)*Math.min(2,Math.hypot(p.vx,p.vy)/130));this.player.scale.set((p.vx< -8?-.64:.64)*(1+Math.sin(time*13)*.025),.64*(1-Math.sin(time*13)*.02));this.player.alpha=p.invincible>0&&Math.floor(time*16)%2===0?.55:1;
    const stamp=g.manifest.regions.join('|');if(stamp!==this.regionStamp){this.regionStamp=stamp;this.gates.clear();for(const z of ZONES.filter(z=>['lab','workshop','garden'].includes(z.id)&&!g.manifest.regions.includes(z.id)))this.gates.rect(z.x-80,z.y+z.radius+52,160,18).fill(0xa98d70).stroke({color:0x6d7760,width:2});for(const label of this.zoneLabels){const z=ZONES.find(z=>z.id===label.id)!;label.text.text=g.manifest.regions.includes(z.id)?z.name:`${z.name} · 未开放\n${REGION_CONDITIONS[z.id]??''}`;}}
    this.fxGraphic.clear();this.syncEntities(alpha);this.drawGroundEffects();this.drawOrbitAndBots();this.drawEnemyStatus();this.drawTelegraphs();
    if(g.frame%4===0)for(const prop of this.props){prop.visible=Math.abs(prop.x-p.x)<g.viewWidth*.65+450&&Math.abs(prop.y-p.y)<g.viewHeight*.65+400;prop.alpha=distanceSq(prop.x+prop.width*.5,prop.y+prop.height*.6,p.x,p.y)<150**2?.55:1;}
    this.audio.beginFrame();
    for(const event of g.visualEvents){this.audio.event(event);this.haptics.event(event,this.settings.haptics,this.elapsed*1000);this.handleEvent(event);}g.visualEvents.length=0;
    this.audio.flush();
    const visualDt=g.phase==='paused'?0:dt;
    for(let n=this.transient.length-1;n>=0;n--){const item=this.transient[n];item.life-=visualDt;if(item.life<=0){this.transient.splice(n,1);continue;}this.drawTransient(item);}
    this.particles.update(visualDt);this.numbers.update(visualDt);
    this.bloomClimax=Math.max(0,this.bloomClimax-dt);this.bloom.bloomScale=this.quality==='high'?(this.bloomClimax>0?2.2:1.6):1;
    this.hitFlash=Math.max(0,this.hitFlash-dt);this.splitTime=Math.max(0,this.splitTime-dt);this.shockTime+=dt;
    this.blackSprite.visible=g.activeEvent==='blackout';
    const lowHp=p.hp/g.stats.maxHp<.3;this.hurtSprite.alpha=(this.hitFlash*3+(lowHp?.25+Math.sin(this.elapsed*7)*.1:0))*this.settings.flash;
    if(this.quality!=='low'&&this.settings.motion&&this.settings.flash>0){
      this.shock.time=this.shockTime;this.rgb.redX=2*this.settings.flash;this.rgb.blueX=-2*this.settings.flash;this.shock.amplitude=(this.quality==='high'?18:9)*this.settings.flash;this.world.filters=[...(this.splitTime>0?[this.rgb]:[]),...(this.shockTime<.65?[this.shock]:[])];
    }else this.world.filters=[];
    this.audio.setEnvironment(g.activeEvent);this.audio.setPaused(g.phase!=='playing');this.audio.setTheme(g.bossActive?'boss':g.week>=12?'late':'normal');
    this.drawDebug();this.app.render();this.releaseFilterTextures();
  }
  private inView(x:number,y:number,margin=120){return Math.abs(x-this.cameraX)<this.game.viewWidth*.55+margin&&Math.abs(y-this.cameraY)<this.game.viewHeight*.55+margin;}
  private syncEntities(alpha:number){
    const g=this.game,e=g.enemies;
    for(let id=0;id<this.enemySprites.length;id++)if(this.enemySprites[id]&&!e.alive[id])this.enemySprites[id]!.visible=false;
    for(const id of e.active){let sprite=this.enemySprites[id];if(!sprite){sprite=new Sprite();sprite.anchor.set(.5);this.entityLayer.addChild(sprite);this.enemySprites[id]=sprite;}sprite.visible=this.inView(e.x[id],e.y[id]);if(!sprite.visible)continue;
      sprite.texture=this.textures.get(`enemy-${e.kind[id]}${e.flash[id]>0&&this.settings.flash>0?'-white':''}`);const localAlpha=e.flash[id]>.065?0:alpha;sprite.position.set(lerp(e.prevX[id],e.x[id],localAlpha),lerp(e.prevY[id],e.y[id],localAlpha));
      const bounce=this.settings.motion?Math.sin(g.combatTime*6+id)*.025+Math.min(1,e.flash[id]/.065)*.15:0,scale=e.radius[id]/28;sprite.scale.set(scale*(1+bounce),scale*(1-bounce));sprite.tint=e.frozen[id]>0?0xa5dcf5:0xffffff;
      sprite.alpha=e.hp[id]<=0?.3:1;sprite.rotation=e.state[id]===1?Math.sin(this.elapsed*42)*.04:0;
    }
    // Keep the player's sprite above ordinary enemies.
    this.entityLayer.setChildIndex(this.player,this.entityLayer.children.length-1);
    for(let id=0;id<this.shotSprites.length;id++)if(this.shotSprites[id]&&!g.shots.alive[id])this.shotSprites[id]!.visible=false;
    for(const id of g.shots.active){const s=g.shots.data[id];let sprite=this.shotSprites[id];if(!sprite){sprite=new Sprite();sprite.anchor.set(.5);this.effects.addChild(sprite);this.shotSprites[id]=sprite;}
      sprite.visible=this.inView(s.x,s.y);if(!sprite.visible)continue;sprite.texture=this.textures.get(s.source==='knife'?'paper':s.source==='code'?'code':s.source==='ppt'?'ppt':s.source==='staple'||s.source==='binder'?'staple':s.source==='shuttle'?'shuttle':s.source==='sword'?'paper':'bullet');
      sprite.position.set(lerp(s.prevX,s.x,alpha),lerp(s.prevY,s.y,alpha));const growth=1+(s.level-1)*.055+(s.evolved?.35:0);sprite.scale.set((s.source==='ppt'?.8:s.source==='code'?.65:s.source==='staple'?.6:.65)*growth);sprite.rotation=Math.atan2(s.vy,s.vx)+(s.source==='knife'?Math.PI/4:0)+(s.source==='ppt'?s.age*9:0);
      let trail=this.trails.get(id);if(!trail||trail.generation!==g.shots.generation[id]){trail={generation:g.shots.generation[id],history:new TrailHistory()};this.trails.set(id,trail);}
      if(trail.history.sample(s.x,s.y,s.age,this.quality==='high'?32:this.quality==='medium'?12:4)&&this.quality!=='low')this.particles.burst(s.x,s.y,s.color,s.evolved?2:1,12,.5);
      const points=trail.history.points;for(let n=1;n<points.length;n++){const a=points[n-1],b=points[n];this.fxGraphic.moveTo(a.x,a.y).lineTo(b.x,b.y).stroke({color:s.color,width:(s.evolved?6:3)*n/points.length,alpha:n/points.length*.5});}
      if(this.settings.motion&&this.settings.afterimages&&this.quality!=='low')for(let layer=1;layer<=(this.quality==='high'?5:2);layer++){
        const point=[...points].reverse().find(point=>s.age-point.time>=layer*.04&&s.age-point.time<=(this.quality==='high'?.22:.12));if(point)this.fxGraphic.roundRect(point.x-9*growth,point.y-5*growth,18*growth,10*growth,2).stroke({color:s.color,width:1.5,alpha:.22/layer});
      }
    }
    for(const id of this.trails.keys())if(!g.shots.alive[id])this.trails.delete(id);
    for(let id=0;id<this.hostileSprites.length;id++)if(this.hostileSprites[id]&&!g.enemyShots.alive[id])this.hostileSprites[id]!.visible=false;
    for(const id of g.enemyShots.active){const s=g.enemyShots.data[id];let sprite=this.hostileSprites[id];if(!sprite){sprite=new Sprite(this.textures.get('enemyBullet'));sprite.anchor.set(.5);this.dangerLayer.addChild(sprite);this.hostileSprites[id]=sprite;}
      sprite.visible=this.inView(s.x,s.y);sprite.position.set(s.x,s.y);sprite.scale.set(s.radius/6);sprite.alpha=s.age<0?.35+.2*Math.sin(this.elapsed*15):1;
    }
    for(let id=0;id<this.dropSprites.length;id++)if(this.dropSprites[id]&&!g.drops.alive[id])this.dropSprites[id]!.visible=false;
    for(const id of g.drops.active){const d=g.drops.data[id];let sprite=this.dropSprites[id];if(!sprite){sprite=new Sprite();sprite.anchor.set(.5);this.dropLayer.addChild(sprite);this.dropSprites[id]=sprite;}
      sprite.visible=this.inView(d.x,d.y);if(!sprite.visible)continue;sprite.texture=this.textures.get(d.kind);sprite.position.set(d.x,d.y+(d.kind==='xp'?0:Math.sin(this.elapsed*3+id)*3));
      const tier=xpGemTier(d.value),size=d.kind==='xp'?[.36,.52,.7,1,1.3][tier]:.85;sprite.scale.set(size);sprite.tint=d.kind==='xp'?[0xffffff,0xffffff,0xe2c9ff,0xbbe7ff,0xffdd8c][tier]:0xffffff;
      if(d.kind==='xp'&&d.value>=48){this.fxGraphic.circle(d.x,d.y,12+Math.sin(this.elapsed*4)*2).stroke({color:d.value>=192?0xffd577:0x99cde9,width:d.value>=192?3:1.5,alpha:.65});if(d.value>=192)for(let n=0;n<5;n++){const a=this.elapsed+n*TAU/5;this.fxGraphic.circle(d.x+Math.cos(a)*20,d.y+Math.sin(a)*20,2).fill({color:[0xffd577,0xbcecd9,0x92c5fb,0xd1a6ed,0xffb4ba][n],alpha:.8});}}
    }
  }
  private drawOrbitAndBots(){
    const g=this.game,p=g.player,orbit=g.weapons.find(w=>w.id==='orbit'),bot=g.weapons.find(w=>w.id==='bot'||w.id==='hub');
    const draw=(skill:typeof orbit,sprites:Sprite[],kind:'orbit'|'bot')=>{
      let count=0;if(skill){const params=weaponParams(skill,g.combatStats);count=params.count;
        const range=params.range;
        for(let n=0;n<count;n++){
          if(!sprites[n]){sprites[n]=new Sprite(this.textures.get(kind==='bot'?'bot':'book'));sprites[n].anchor.set(.5);this.effects.addChild(sprites[n]);}
          const s=sprites[n];s.visible=true;s.scale.set(kind==='bot'?.8:.78);
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
  }
  private drawEnemyStatus(){
    const gr=this.fxGraphic,g=this.game,e=g.enemies;
    for(const id of e.active){if(e.hp[id]<=0||!this.inView(e.x[id],e.y[id],260))continue;const x=e.x[id],y=e.y[id],r=e.radius[id],def=ENEMIES[e.kind[id]],bits=e.affixes[id];
      if(e.shield[id]>0){const points:number[]=[];for(let n=0;n<6;n++){const a=n*TAU/6;points.push(x+Math.cos(a)*(r+8),y+Math.sin(a)*(r+8));}gr.poly(points).fill({color:0x9bdde5,alpha:.1}).stroke({color:0x6dbac7,width:2,alpha:.8});}
      if(e.frozen[id]>0){for(let n=0;n<6;n++){const a=n*TAU/6,rr=r+8;gr.moveTo(x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5).lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr).stroke({color:0xd4f6ff,width:2,alpha:.9});}gr.circle(x,y,r+5).fill({color:0x92d1f5,alpha:.2});}
      if(def.behavior==='aura'||(bits&16)){const radius=bits&16?220:180;gr.circle(x,y,radius).stroke({color:0xd2c66e,width:2,alpha:.3});for(const other of e.active){if(other===id||e.hp[other]<=0||distanceSq(x,y,e.x[other],e.y[other])>radius**2)continue;gr.moveTo(x,y).lineTo(e.x[other],e.y[other]).stroke({color:0xc8be68,width:1,alpha:.18});}}
      if(e.rank[id]===RANK_CODE.elite){gr.circle(x,y,r+4).stroke({color:0xd693c5,width:2,alpha:.85});const marks=[1,2,4,8,16,32].filter(bit=>bits&bit);for(const [n,bit] of marks.entries()){const px=x+(n-(marks.length-1)/2)*14,py=y-r-17;if(bit===1){gr.circle(px-3,py,4).stroke({color:0xa5bde9,width:1.5});gr.circle(px+3,py,4).stroke({color:0xa5bde9,width:1.5});}else if(bit===2)gr.poly([px,py-6,px+5,py-2,px+4,py+4,px,py+7,px-4,py+4,px-5,py-2]).stroke({color:0x7fcbd5,width:1.5});else if(bit===4)gr.poly([px-5,py+5,px,py-5,px+5,py+5]).stroke({color:0xea965a,width:2});else if(bit===8)gr.circle(px,py,5).stroke({color:0xe7817f,width:2});else if(bit===16)gr.circle(px,py,6).stroke({color:0xcbbd62,width:2});else gr.moveTo(px-6,py+4).lineTo(px,py-4).lineTo(px+6,py+4).stroke({color:0xba91df,width:2});}}
      if(e.rank[id]===RANK_CODE.miniBoss){gr.roundRect(x-35,y-r-16,70,5,2).fill({color:0x4e685b,alpha:.3});gr.roundRect(x-35,y-r-16,Math.max(1,70*e.hp[id]/e.maxHp[id]),5,2).fill(0xb788bb);}
    }
    if(g.ultimate.remaining>0&&g.ultimate.def.id==='parallel')for(let n=0;n<6;n++){const a=n*TAU/6+g.combatTime*.5,x=g.player.x+Math.cos(a)*85,y=g.player.y+Math.sin(a)*65;gr.roundRect(x-13,y-10,26,20,5).fill({color:0xc2eedb,alpha:.8}).stroke({color:0x448a79,width:2});gr.circle(x-5,y-2,2).fill(0x317666);gr.circle(x+5,y-2,2).fill(0x317666);}
  }
  private drawGroundEffects(){
    const gr=this.groundFX,g=this.game;gr.clear();
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
    const turrets=g.weaponSystem.summons.turrets;for(const [n,t] of turrets.entries()){if(t.remaining<=0)continue;gr.roundRect(t.x-19,t.y-15,38,30,5).fill({color:0x83b4e0,alpha:.35}).stroke({color:0x6d9fd8,width:2});gr.circle(t.x,t.y,11).stroke({color:0xc0effe,width:3});if(n){const previous=turrets[n-1];gr.moveTo(previous.x,previous.y).lineTo(t.x,t.y).stroke({color:0x8dc1e6,width:1,alpha:.5});}}
    if(g.landmarks.contract){const c=g.landmarks.contract;gr.roundRect(c.x-24,c.y-22,48,44,7).fill({color:0xd7b678,alpha:.8}).stroke({color:0x745d63,width:3});gr.poly([c.x,c.y-13,c.x+12,c.y,c.x,c.y+13,c.x-12,c.y]).stroke({color:0xfcf0b9,width:2});gr.circle(c.x,c.y,90).stroke({color:0xb69c76,width:1,alpha:.4});}
    const mines=g.areas.active.map(id=>g.areas.data[id]).filter(a=>a.kind==='mine'&&a.evolved);for(let n=1;n<mines.length;n++)if(distanceSq(mines[n].x,mines[n].y,mines[n-1].x,mines[n-1].y)<200**2)gr.moveTo(mines[n-1].x,mines[n-1].y).lineTo(mines[n].x,mines[n].y).stroke({color:0xe1b955,width:1,alpha:.5});
    if(g.player.shield>0)gr.circle(g.player.x,g.player.y,38).fill({color:0xe7c976,alpha:.12}).stroke({color:0xe7c976,width:2,alpha:.7});
    if(g.momentum.active){const p=g.player;for(let n=0;n<2;n++)gr.circle(p.x,p.y,42+n*12+Math.sin(g.combatTime*8)*2).stroke({color:n?0xffd477:0xffa66b,width:n?1:3,alpha:.6});}
    if(g.gameEvent?.kind==='portal'){for(const [x,y] of [[g.gameEvent.x,g.gameEvent.y],[g.gameEvent.x2,g.gameEvent.y2]]){gr.ellipse(x,y,40,24).fill({color:0x62bba8,alpha:.15}).stroke({color:0x54a994,width:3});gr.ellipse(x,y,28+Math.sin(this.elapsed*4)*4,17).stroke({color:0x94d9bd,width:3});}}
  }
  private drawTelegraphs(){
    const gr=this.telegraphs;gr.clear();
    const g=this.game;for(const id of g.enemyShots.active){const s=g.enemyShots.data[id];if(s.age<0){const speed=Math.hypot(s.vx,s.vy)||1;gr.circle(s.x,s.y,s.radius+9).stroke({color:0xb65e8a,width:2,alpha:.9});gr.moveTo(s.x,s.y).lineTo(s.x+s.vx/speed*70,s.y+s.vy/speed*70).stroke({color:0xd480a3,width:2,alpha:.7});}if(g.activeEvent==='blackout'&&distanceSq(g.player.x,g.player.y,s.x,s.y)>260**2){const dx=s.x-g.player.x,dy=s.y-g.player.y,a=Math.atan2(dy,dx),x=g.player.x+Math.cos(a)*245,y=g.player.y+Math.sin(a)*245;gr.poly([x+Math.cos(a)*10,y+Math.sin(a)*10,x+Math.cos(a+2.4)*8,y+Math.sin(a+2.4)*8,x+Math.cos(a-2.4)*8,y+Math.sin(a-2.4)*8]).fill({color:0xf09b90,alpha:.9});}}
    gr.circle(g.player.x,g.player.y,19).stroke({color:0xf0ffe5,width:2,alpha:.75});
    for(const h of this.game.hazards){const warning=h.warning>0,alpha=warning?.16+.08*Math.sin(this.elapsed*16):.35,color=warning?0xeb9b6b:0xe57577;
      if(h.kind==='circle')gr.circle(h.x,h.y,h.radius).fill({color,alpha}).stroke({color,width:2,alpha:.85});
      else if(h.kind==='line')gr.moveTo(h.x,h.y).lineTo(h.x2,h.y2).stroke({color,width:h.radius*2,alpha}).moveTo(h.x,h.y).lineTo(h.x2,h.y2).stroke({color,width:warning?2:5,alpha:.8});
      else{const r=warning?h.radius:h.radius*clamp(1-h.life/1.3,0,1);gr.arc(h.x,h.y,Math.max(1,r),(h.safeAngle??0)+.62,(h.safeAngle??0)+TAU-.62).stroke({color,width:warning?2:12,alpha:warning?.5:.8});}
    }
  }
  private handleEvent(event:VisualEvent){
    if(!this.inView(event.x,event.y,event.size))return;
    if(['ultimate','fusion'].includes(event.type)){this.bloomClimax=1.2;const count=this.quality==='high'?1600:this.quality==='medium'?550:100;this.particles.burst(event.x,event.y,event.color,count,480,1.4,event.weapon==='demolition'?'brick':event.weapon==='hub'?'blueprint':event.weapon==='icefire'||event.ultimate==='lastMinute'?'ice':event.weapon==='sky'?'glass':event.weapon==='binder'?'metal':'spark');this.splitTime=.14;this.shockTime=0;}
    if(event.type==='shieldBreak'){this.particles.burst(event.x,event.y,event.color,this.quality==='high'?100:this.quality==='medium'?40:12,230,1.1,'glass');}
    if(event.type==='block'){
      this.particles.burst(event.x,event.y,event.color,this.quality==='high'?24:this.quality==='medium'?12:4,150,.7,event.material??'paper');
      if(event.weapon==='orbit'){const angle=((event.angle??0)+TAU)%TAU;this.brokenOrbitEdge=Math.floor(angle/TAU*6);this.orbitRebuildUntil=this.game.combatTime+.3;}
    }
    if(event.type==='hit'){
      this.particles.burst(event.x,event.y,event.color,this.quality==='high'?(event.critical?20:8):this.quality==='medium'?(event.critical?10:4):(event.critical?4:2),150,event.critical?1.25:.7,event.material);
      if(this.settings.damageNumbers&&event.value)this.numbers.spawn(event.value,event.x,event.y,!!event.critical);
      this.transient.push({event,life:event.critical?.09:.06,total:event.critical?.09:.06});
    }else if(event.type==='death')this.particles.burst(event.x,event.y,event.color,event.priority?(this.quality==='high'?240:this.quality==='medium'?100:24):this.quality==='high'?36+Math.min(12,Math.floor(event.size/2)):this.quality==='medium'?16+Math.min(8,Math.floor(event.size/3)):6+Math.min(2,Math.floor(event.size/8)),210,1.2,event.material);
    else if(event.type==='hurt'){this.hitFlash=.28;this.particles.burst(event.x,event.y,event.color,16,120);}
    else if(event.type==='shot')this.particles.burst(event.x,event.y,event.color,2,60,.4);
    else if(event.type==='pickup')this.particles.burst(event.x,event.y,event.color,2,40,.35);
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
        if(this.elapsed>=this.nextCinematic){
          this.nextCinematic=this.elapsed+.5;
          if(this.settings.motion){this.cameraZoom=event.type==='boss'?1.06:1.03;gsap.to(this,{cameraZoom:1,duration:1.2,ease:'power2.out'});}
          if(event.type!=='level'){this.splitTime=.12;this.shockTime=0;this.shock.center={x:.5,y:.5};}
        }
      }
      if(event.type==='beam')this.splitTime=.06;
    }
    const limit=this.quality==='high'?720:this.quality==='medium'?300:100;if(this.transient.length>limit)this.transient.splice(0,this.transient.length-limit);
  }
  private drawTransient(item:Transient){
    const e=item.event,g=this.fxGraphic,t=1-item.life/item.total,fade=1-t;
    if(e.type==='ultimate'){drawUltimate(g,e,t,this.quality==='low');return;}
    if(e.type==='signature'||e.type==='fusion'){drawSignature(g,e,t,this.quality==='low');}
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
      if(e.type==='evolution'&&e.weapon)drawSignature(g,e,t,this.quality==='low');
      if(e.weapon==='mine'&&e.evolved){g.moveTo(e.x,e.y);for(let n=1;n<=40;n++){const q=n/40*TAU*2,rr=radius*n/40;g.lineTo(e.x+Math.cos(q)*rr,e.y+Math.sin(q)*rr);}g.stroke({color:0xffd77e,width:2,alpha:fade});}
    }
  }
  private drawDebug(){
    const gr=this.debugGraphics;gr.clear();if(!this.debug||!this.debugGeometry&&!this.debugNavigation)return;
    const g=this.game;if(this.debugGeometry){
      for(const id of g.enemies.active)if(this.inView(g.enemies.x[id],g.enemies.y[id]))gr.circle(g.enemies.x[id],g.enemies.y[id],g.enemies.radius[id]).stroke({color:0xe46e70,width:1,alpha:.6});
      gr.circle(g.player.x,g.player.y,12).stroke({color:0x2c88ce,width:2});gr.circle(g.player.x,g.player.y,g.stats.magnet).stroke({color:0x2c88ce,width:1,alpha:.4});
      const left=Math.floor((this.cameraX-g.viewWidth/2)/64)*64,top=Math.floor((this.cameraY-g.viewHeight/2)/64)*64;
      for(let x=left;x<this.cameraX+g.viewWidth/2;x+=64)gr.moveTo(x,top).lineTo(x,top+g.viewHeight+64).stroke({color:0x57988b,width:1,alpha:.2});
      for(let y=top;y<this.cameraY+g.viewHeight/2;y+=64)gr.moveTo(left,y).lineTo(left+g.viewWidth+64,y).stroke({color:0x57988b,width:1,alpha:.2});
      for(const b of BUILDINGS)gr.rect(b.x,b.y,b.w,b.h).stroke({color:0xe96b6e,width:2});
    }
    if(this.debugNavigation)for(let x=Math.floor((g.player.x-400)/64)*64;x<g.player.x+400;x+=64)for(let y=Math.floor((g.player.y-300)/64)*64;y<g.player.y+300;y+=64){const d=g.navigation.direction(x,y),len=Math.hypot(d.x,d.y)||1;gr.moveTo(x,y).lineTo(x+d.x/len*18,y+d.y/len*18).stroke({color:0x7c6fba,width:1,alpha:.7});}
  }
  exportPerformance(){const s=[...this.perfFrames].sort((a,b)=>a-b);return{timestamp:new Date().toISOString(),device:navigator.userAgent,viewport:[this.app.screen.width,this.app.screen.height],frames:s.length,meanFps:s.length?1000/(s.reduce((a,b)=>a+b,0)/s.length):0,p95:s[Math.floor(s.length*.95)]??0,p99:s[Math.floor(s.length*.99)]??0,longFrames:this.longFrames,quality:this.quality,effects:{particleLimit:this.particles.limit,particlePeak:this.particles.pool.peak,recycled:this.particles.recycled,audioVoicePeak:this.audio.voicePeak},pools:Object.fromEntries(['enemies','shots','enemyShots','areas','drops'].map(k=>{const p=this.game[k as 'enemies'];return[k,{peak:p.peak,overflow:p.overflow}];})),droppedSimulationSeconds:this.loop.droppedSeconds,session:this.game.exportSession()};}
  private releaseFilterTextures(){
    for(const filter of [this.bloom,this.glow,this.rgb,this.shock])for(const group of Object.values(filter.groups))for(const [binding,resource] of Object.entries(group.resources)){
      if(resource?._resourceType==='textureSource')group.setResource(Texture.WHITE.source,Number(binding));
      else if(resource?._resourceType==='textureSampler')group.setResource(Texture.WHITE.source.style,Number(binding));
    }
  }
  destroy(){
    if(this.destroyed)return;this.destroyed=true;cancelAnimationFrame(this.animation);this.resizeObserver?.disconnect();this.input?.destroy();gsap.killTweensOf(this);this.audio.destroy();this.loop.reset();
    // Release shader references before Pixi's render-texture pool and atlas sources.
    this.world.filters=[];this.effects.filters=[];if(this.player)this.player.filters=[];
    this.releaseFilterTextures();for(const filter of [this.bloom,this.glow,this.rgb,this.shock])filter.destroy();
    if(this.ready){this.app.destroy(true,{children:true,texture:false,textureSource:false});this.textures.destroy();for(const texture of this.uiTextures)texture.destroy(true);}
  }
}
