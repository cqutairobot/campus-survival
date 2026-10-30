import { chromium } from '@playwright/test';
import { mkdirSync,writeFileSync } from 'node:fs';
const seconds=Number(process.argv.find(a=>a.startsWith('--seconds='))?.split('=')[1])||600;
const target=Number(process.argv.find(a=>a.startsWith('--entities='))?.split('=')[1])||800;
const quality=process.argv.find(a=>a.startsWith('--quality='))?.split('=')[1]||'high';
const output=process.argv.find(a=>a.startsWith('--output='))?.split('=')[1]||'docs/performance-browser.json';
const baseURL=process.env.CAMPUS_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(quality=>localStorage.setItem('campus-survival.save.v2',JSON.stringify({schemaVersion:2,credits:0,unlocked:['balanced'],selected:'balanced',settings:{quality,muted:true}})),quality);
  await page.goto(`${baseURL}/?debug=1&seed=20261030`);await page.getByRole('button',{name:'开始新学期'}).click();await page.getByRole('button',{name:'就这样，开学'}).click();await page.waitForFunction(()=>!!window.__CAMPUS__);
  await page.addStyleTag({content:'.game-overlay,.boss-cinematic{display:none!important}'});
  await page.evaluate(target=>{
    const g=window.__CAMPUS__.engine;g.weapons.length=0;for(const id of ['orbit','bot','lightning','wifi','rain','laser'])g.send({type:'grant',id,level:5,evolved:true});g.send({type:'god',value:true});g.send({type:'week',value:17});g.send({type:'spawn',value:target});g.send({type:'frenzy',value:100});g.specialCooldown.bomb=Infinity;
    window.__stressCounts=[];
    window.__stressInterval=setInterval(()=>{const g=window.__CAMPUS__?.engine;if(!g)return;g.semesterTime=650;
      const missing=target-g.enemies.active.length;if(missing>0)g.send({type:'spawn',value:missing});
      while(g.enemies.active.length>target)g.enemies.release(g.enemies.active.at(-1));
      if(g.phase==='draft')g.send({type:'choose',index:0});else if(g.phase==='chest')g.send({type:'chestDone'});else if(g.phase==='evolution')g.send({type:'evolutionDone'});
      for(const id of g.enemies.active)if(g.enemies.maxHp[id]<8000){g.enemies.maxHp[id]=8000;g.enemies.hp[id]=8000;}
      // Explicit cosmetic stress events exercise continuous material fragments and climax FX.
      for(let n=0;n<30;n++)g.emit({type:'death',x:g.player.x+Math.sin(n*5.1)*240,y:g.player.y+Math.cos(n*3.7)*180,color:0xc8ae72,size:18,material:['paper','key','code'][n%3]});
      if(window.__stressCounts.length%8===0)g.emit({type:'evolution',x:g.player.x,y:g.player.y,color:0x75d7ba,size:240,weapon:'knife',evolved:true,duration:1.2});
      if(window.__stressCounts.length%40===0)g.send({type:'frenzy',value:100});
      let visible=0;for(const id of g.enemies.active)if(Math.abs(g.enemies.x[id]-g.player.x)<g.viewWidth/2&&Math.abs(g.enemies.y[id]-g.player.y)<g.viewHeight/2)visible++;
      window.__stressCounts.push({entities:g.enemies.active.length,visible,fps:g.fps,p95:g.p95});
    },500);
  },target);
  for(let elapsed=0;elapsed<seconds;elapsed+=30){await page.waitForTimeout(Math.min(30,seconds-elapsed)*1000);console.log(`浏览器压力 ${Math.min(elapsed+30,seconds)} / ${seconds} 秒`);}
  const report=await page.evaluate(()=>{clearInterval(window.__stressInterval);const gl=window.__CAMPUS__.scene.app.renderer.gl;const ext=gl?.getExtension('WEBGL_debug_renderer_info');return{...window.__CAMPUS__.scene.exportPerformance(),renderer:gl&&ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unknown',samples:window.__stressCounts};});
  report.errors=errors;report.target=target;report.wallDurationSeconds=seconds;report.note='SwiftShader 软件渲染，帧率不代表真机；六进化武器、定时狂热、每秒约 60 次材质碎裂和进化高潮视觉压力。高档预算固定，不自动降档；隐藏奖励遮罩，自动选择奖励；定期补齐/撤出敌人维持目标密度。';mkdirSync('docs',{recursive:true});writeFileSync(output,JSON.stringify(report,null,2));await page.screenshot({path:output.replace(/\.json$/,'.png')});console.log(JSON.stringify({...report,samples:report.samples.slice(-3)},null,2));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
