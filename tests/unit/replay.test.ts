import {expect,it} from 'vitest';
import {GameEngine} from '../../src/core/engine';
import {FixedLoop} from '../../src/core/loop';
import {ReplayDriver,validReplay} from '../../src/core/replay';
import {freshSave} from '../../src/save/storage';
it('固定帧输入与 UI 指令可在不同渲染频率重放',()=>{
  const original=new GameEngine(freshSave(),91);original.enableReplay();
  for(let n=0;n<600;n++){
    original.inputX=n<240?.8:-.3;original.inputY=n<400?.2:-.8;
    if(n===100)original.send({type:'pause'});if(n===110)original.send({type:'resume'});
    if(n===200)original.send({type:'xp',value:12});
    if(original.phase==='draft')original.send({type:'choose',index:0});
    original.tick(1/60);original.visualEvents.length=0;
  }
  const data=original.exportReplay()!;expect(validReplay(data)).toBe(true);
  const state=(g:GameEngine)=>({x:g.player.x,y:g.player.y,hp:g.player.hp,level:g.level,xp:g.xp,kills:g.kills,random:g.random.state,seconds:g.semesterTime,frame:g.frame,skills:g.weapons,passives:g.passives});
  for(const fps of [30,120]){
    const g=new GameEngine(data.save,data.seed),driver=new ReplayDriver(data),loop=new FixedLoop();
    for(let n=0;n<fps*20&&g.frame<data.endFrame;n++)loop.advance(1/fps,dt=>{if(g.frame>=data.endFrame)return;driver.apply(g);g.tick(dt);g.visualEvents.length=0;});
    expect(state(g)).toEqual(state(original));
  }
  expect(validReplay({...data,events:[{frame:-1,kind:'input',x:NaN,y:0,phase:'playing'}]})).toBe(false);
});
