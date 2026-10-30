import {describe,it,expect} from 'vitest';
import {PresentationClock} from '../../src/fx/PresentationClock';
import {EntityFeedback} from '../../src/fx/EntityFeedback';
import {FeedbackDirector} from '../../src/presentation/FeedbackDirector';
import {profiles} from '../../src/presentation/profiles';
import {CameraRig} from '../../src/fx/CameraRig';
import {eventPixelPosition} from '../../src/fx/PostFX';
import {freshSave} from '../../src/save/storage';
import {GameEngine} from '../../src/core/engine';
import type {VisualEvent} from '../../src/types';
const hit=(critical=false):VisualEvent=>({type:'hit',x:100,y:100,color:0xffffff,size:10,slot:4,generation:7,angle:.6,critical});

describe('v4 presentation is independent of simulation',()=>{
 it('uses seconds at both 30Hz and 200Hz, with maximum-overlap and rolling budgets',()=>{
  for(const fps of [30,200]){const clock=new PresentationClock();clock.request(0,2);clock.request(0,1);expect(clock.remaining).toBeCloseTo(2/60);let progressed=0;for(let n=0;n<fps;n++)progressed+=clock.advance(1/fps);expect(progressed).toBeCloseTo(1-2/60);}
  const clock=new PresentationClock();for(let n=0;n<10;n++){clock.request(n*.06,2);clock.advance(.06);}expect(clock.request(.7,5)).toBeCloseTo(0);expect(clock.request(1.6,5)).toBeCloseTo(5/60);
 });
 it('a reused pool slot never inherits another generation, and overlap keeps the stronger cue',()=>{
  const fx=new EntityFeedback();fx.hit(4,7,0,profiles.critical,0,1);fx.hit(4,7,0,profiles.normal,0,1);expect(fx.pose(4,7).held).toBeCloseTo(2/60);
  expect(fx.pose(4,8)).toMatchObject({x:0,y:0,white:0,scaleX:1,scaleY:1});expect(fx.size).toBe(0);
  fx.hit(4,8,Math.PI/2,profiles.normal,.1,1);fx.update(.04);expect(Math.abs(fx.pose(4,8).y)).toBeGreaterThan(0);expect(Math.abs(fx.pose(4,8,true).y)).toBeLessThanOrEqual(2);
 });
 it('takes the strongest event per batch and clears motion/stop state immediately',()=>{
  const settings=freshSave().settings,d=new FeedbackDirector(settings),cues=d.consume([hit(),hit(true),{...hit(),type:'death',rank:'boss',slot:5}]);
  expect(cues[1].hold).toBeCloseTo(2/60);expect(d.camera.trauma).toBe(1);d.update(.01);d.apply({...settings,motion:false});
  expect(d.update(.01)).toEqual({x:0,y:0,rotation:0,zoom:1});expect(d.entities.size).toBe(0);expect(d.consume([hit(true)])[0].hold).toBe(0);
  d.apply({...settings,hitStop:0});expect(d.consume([hit(true)])[0].hold).toBe(0);
 });
 it('ordinary repeated hits stay restrained, and a Boss can override a recent small zoom',()=>{
  const rig=new CameraRig();for(let n=0;n<100;n++){rig.event(profiles.normal,0,n*.05,1);rig.update(.05,n*.05,1,true);}expect(rig.trauma).toBeLessThan(.31);
  rig.event(profiles.critical,0,10,1);rig.event(profiles.boss,0,10.1,1);const peaks=Array.from({length:15},(_,n)=>rig.update(1/60,10.1+n/60,1,true).zoom);expect(Math.max(...peaks)).toBeGreaterThan(1.06);
 });
 it('converts an off-center world event to filter-input pixels including camera rotation',()=>{
  expect(eventPixelPosition(120,80,320,-20,1.5)).toEqual({x:500,y:100});const point=eventPixelPosition(10,0,100,200,2,Math.PI/2);expect(point.x).toBeCloseTo(100);expect(point.y).toBeCloseTo(220);
 });
 it('consuming visual events changes no damage, drops, random streams or final result',()=>{
  const outcomes=[];
  for(const enabled of [false,true]){
   const save=freshSave();save.settings.motion=enabled;save.settings.shake=enabled?.8:0;save.settings.hitStop=enabled?1:0;
   const game=new GameEngine(save,1234),director=new FeedbackDirector(save.settings);
   for(let n=0;n<180;n++){game.inputX=.4;game.inputY=.1;game.tick(1/60);director.consume(game.visualEvents);director.update(1/60);game.visualEvents.length=0;}
   game.finish(false);outcomes.push({player:game.player,damage:game.damage,kills:game.kills,drops:game.drops.active.map(id=>({...game.drops.data[id]})),streams:Object.values(game.streams).map(s=>s.state),result:{...game.result,id:''}});
  }
  expect(outcomes[0]).toEqual(outcomes[1]);
 });
});
