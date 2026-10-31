import {test,expect} from '@playwright/test';
import {writeFileSync,readFileSync} from 'node:fs';
import {dailyChallenge} from '../../src/challenges/daily';
test('v4.0.1 单条冒烟：全界面与素材→旧档与反馈→双触点→融合契约→结算与每日→释放会话',async({page})=>{
 const loadFailures:string[]=[],reviews:unknown[]=[];let firstScreenBytes=0;
 page.on('response',r=>{if(r.status()>=400&&/assets\/|licenses\//.test(r.url()))loadFailures.push(`${r.status()} ${r.url()}`);});
 page.on('requestfailed',r=>{if(/assets\/|licenses\//.test(r.url())&&r.failure()?.errorText!=='net::ERR_ABORTED')loadFailures.push(`${r.failure()?.errorText} ${r.url()}`);});
 const capture=async(name:string)=>{await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).filter(img=>img.offsetParent!==null).map(img=>img.decode().catch(()=>{})));});await page.waitForTimeout(320);await page.screenshot({path:`docs/v4.0.1-${name}.png`,animations:'disabled'});reviews.push(await page.evaluate(name=>({screen:name,viewport:[innerWidth,innerHeight],horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:Array.from(document.images).filter(img=>img.offsetParent!==null&&(!img.complete||!img.naturalWidth)).map(img=>img.src)}),name));};
 const errors:string[]=[],warnings:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning'||/PixiJS Deprecation/.test(m.text())){warnings.push(m.text());console.log(m.text());}});
 await page.addInitScript(()=>{if(!localStorage.getItem('campus-survival.save.v3')&&!localStorage.getItem('campus-survival.save.v2'))localStorage.setItem('campus-survival.save.v2',JSON.stringify({schemaVersion:2,contentVersion:'2.0.0',credits:137,unlocked:['balanced','coder'],selected:'balanced',talents:{hp:2},discovered:['knife','orbit'],evolutions:['orbit'],settledRuns:['legacy-id'],settings:{quality:'high',muted:true,motion:true,master:.4,shake:.2,flash:0},stats:{runs:3,wins:0,kills:120,bestWeek:9}}));});
 await page.goto('/?debug=1&seed=999');
 await expect(page.getByText('137',{exact:true})).toBeVisible();
 const migrated=await page.evaluate(()=>JSON.parse(localStorage.getItem('campus-survival.save.v3')!));
 expect(migrated.schemaVersion).toBe(3);expect(migrated.credits).toBe(137);expect(migrated.unlocked).toContain('coder');expect(migrated.evolutions).toContain('orbit');expect(migrated.settledRuns).toContain('legacy-id');expect(migrated.settings).toMatchObject({settingsVersion:4,shake:.2,flash:0,muted:true,hitStop:1,uiSfx:.6});
 await capture('menu-desktop');firstScreenBytes=await page.evaluate(()=>{const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;return navigation.transferSize+performance.getEntriesByType('resource').reduce((sum,entry)=>sum+(entry as PerformanceResourceTiming).transferSize,0);});expect(firstScreenBytes).toBeLessThanOrEqual(4*1024*1024);
 // The second page must observe until explicit takeover, with no stale save merge.
 const ownerBefore=await page.evaluate(()=>localStorage.getItem('campus-survival.save.v3'));
 const second=await page.context().newPage();await second.goto('/?debug=1');await expect(second.locator('.save-notice')).toContainText('另一个页面正在保存');await second.waitForTimeout(650);await second.screenshot({path:'docs/v4.0.1-multitab.png',animations:'disabled'});
 await second.getByRole('button',{name:'开启声音',exact:true}).click();expect(await second.evaluate(()=>localStorage.getItem('campus-survival.save.v3'))).toBe(ownerBefore);
 await second.getByRole('button',{name:'接管 / 存档',exact:true}).click();await second.getByRole('button',{name:'接管并载入设备最新进度',exact:true}).click();await expect(second.locator('.save-notice')).toHaveCount(0);
 await expect(page.locator('.save-notice')).toContainText('本页停止保存');const taken=await page.evaluate(()=>localStorage.getItem('campus-survival.save.v3'));expect(JSON.parse(taken!).persistence.ownerId).not.toBe(JSON.parse(ownerBefore!).persistence.ownerId);
 await page.getByRole('button',{name:'开启声音',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('campus-survival.save.v3'))).toBe(taken);await second.close();await page.locator('.save-notice').getByRole('button',{name:'刷新',exact:true}).click();await expect(page.locator('.save-notice')).toHaveCount(0);
 for(const [name,label,selector] of [['characters','研究生档案','.menu-navigation'],['talents','局外天赋','.menu-navigation'],['achievements','学期成就','.menu-extra'],['map','校园地图','.menu-extra'],['daily','每日挑战','.menu-extra'],['settings','偏好设置','.menu-navigation'],['codex','学期图鉴','.menu-navigation']]){
  await page.locator(selector).getByRole('button',{name:new RegExp(label)}).click();await expect(page.locator('.modal-panel')).toBeVisible();
  if(name==='codex'){for(const tab of ['武器','被动','进化','融合','敌人','遗物','校园','事件']){await page.getByRole('tab',{name:new RegExp('^'+tab)}).click();await capture('codex-'+tab);}}
  else {await capture(name);if(name==='settings'){await page.getByRole('button',{name:'查看制作名单与素材许可',exact:true}).click();await expect(page.locator('.credits-entry')).toHaveCount(20);await capture('credits');}}
  await page.getByRole('button',{name:'关闭面板',exact:true}).click();
 }
 await page.setViewportSize({width:360,height:640});await capture('menu-mobile');
 for(const [name,label] of [['characters','研究生档案'],['talents','局外天赋'],['codex','学期图鉴']]){await page.locator('.menu-navigation').getByRole('button',{name:new RegExp(label)}).click();await capture(name+'-mobile');await page.getByRole('button',{name:'关闭面板',exact:true}).click();}
 await page.setViewportSize({width:1280,height:800});
 await page.getByRole('button',{name:'开启声音',exact:true}).click();
 await page.getByRole('button',{name:/偏好设置/}).click();const flash=page.getByRole('slider',{name:/^闪白/});await flash.focus();await flash.press('End');await flash.press('ArrowLeft');await flash.press('ArrowLeft');await expect(flash).toHaveValue('0.8');await page.getByRole('button',{name:'关闭面板',exact:true}).click();
 await page.getByRole('button',{name:/开始新学期/}).click();await page.getByRole('button',{name:/就这样，开学/}).click();
 await page.waitForFunction(()=>!!window.__CAMPUS__);await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.scene.audio.debug.ready)).toBe(true);
 const x=await page.evaluate(()=>window.__CAMPUS__!.engine.player.x);await page.keyboard.down('KeyD');await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.player.x)).toBeGreaterThan(x+15);await page.keyboard.up('KeyD');
 await page.getByRole('button',{name:'校园地图',exact:true}).click();await page.waitForFunction(()=>window.__CAMPUS__!.engine.phase==='paused');
 const modalBefore=await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;return {time:g.combatTime,x:g.player.x,y:g.player.y,energy:g.ultimate.energy};});
 await page.keyboard.press('KeyP');await page.keyboard.press('KeyD');await page.keyboard.press('KeyQ');await page.keyboard.press('KeyE');await page.keyboard.press('Digit1');
 const modalAfter=await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;for(let i=0;i<60;i++)g.tick(1/60);return {time:g.combatTime,x:g.player.x,y:g.player.y,energy:g.ultimate.energy};});expect(modalAfter).toEqual(modalBefore);await expect(page.getByRole('dialog',{name:'校园地图',exact:true})).toBeVisible();await capture('map-p-blocked');
 await page.getByRole('button',{name:'关闭面板',exact:true}).click();await page.waitForFunction(()=>window.__CAMPUS__!.engine.phase==='playing');
 // Real native pointer: hide the captured interaction button, then release it outside.
 const originalPosition=await page.evaluate(()=>{const g=window.__CAMPUS__!.engine,p=g.player;const old={x:p.x,y:p.y};g.enemies.clear();p.x=p.prevX=3615;p.y=p.prevY=2990;p.vx=p.vy=0;g.tick(1/60);g.publish();return old;});
 await expect(page.locator('.interact-button')).toBeVisible();const interactionBox=(await page.locator('.interact-button').boundingBox())!;await page.mouse.move(interactionBox.x+interactionBox.width/2,interactionBox.y+interactionBox.height/2);await page.mouse.down();
 await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.tick(1/60);g.player.x=g.player.prevX=3072;g.player.y=g.player.prevY=3072;g.tick(1/60);g.publish();});await expect(page.locator('.interact-button')).toHaveCount(0);await page.mouse.up();
 const noResidual=await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.tick(1/60);const held=g.landmarks.held,before=g.landmarks.uses.canteen??0;g.player.x=g.player.prevX=3615;g.player.y=g.player.prevY=2990;g.player.vx=g.player.vy=0;for(let i=0;i<60;i++)g.tick(1/60);return {held,before,after:g.landmarks.uses.canteen??0};});expect(noResidual.held).toBe(false);expect(noResidual.after).toBe(noResidual.before);
 await page.evaluate(old=>{const p=window.__CAMPUS__!.engine.player;p.x=p.prevX=old.x;p.y=p.prevY=old.y;},originalPosition);
 await capture('battle');await page.keyboard.press('Escape');await capture('pause');
 await page.evaluate(()=>{window.__CAMPUS__!.scene.setMissingArt(true);window.__CAMPUS__!.scene.previewFeedback('normal');});
 await page.waitForTimeout(50);
 await page.evaluate(()=>window.__CAMPUS__!.scene.previewFeedback('critical'));
 await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.scene.feedbackState.trauma)).toBeGreaterThan(0);
 await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.scene.feedbackState.post.center.x)).toBeGreaterThan(10);
 const feedback=await page.evaluate(()=>window.__CAMPUS__!.scene.feedbackState);expect(feedback.missingArt).toContain('homework');expect(feedback.post.center.x).toBeGreaterThan(10);expect(feedback.post.center.y).toBeGreaterThan(10);
 expect(await page.evaluate(()=>window.__CAMPUS__!.engine.cheated)).toBe(false);await page.evaluate(()=>window.__CAMPUS__!.scene.setMissingArt(false));
 await page.getByRole('button',{name:'继续这个学期',exact:true}).click();
 await page.evaluate(()=>window.__CAMPUS__!.engine.send({type:'xp',value:15}));
 await expect(page.locator('.draft-card').first()).toBeVisible();
 await page.waitForTimeout(350);await capture('draft');
 const draftBefore=await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;return {token:g.draftToken,cards:g.cards};});await page.getByRole('button',{name:/查看进化公式/}).click();await page.keyboard.press('KeyP');await page.keyboard.press('Digit1');await page.keyboard.press('Escape');await page.waitForFunction(()=>window.__CAMPUS__!.engine.phase==='draft');expect(await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;return {token:g.draftToken,cards:g.cards};})).toEqual(draftBefore);
 for(let n=0;n<5;n++){await page.waitForFunction(()=>{const g=window.__CAMPUS__!.engine;return g.phase==='draft'||!g.hasPendingRewards;});const phase=await page.evaluate(()=>window.__CAMPUS__!.engine.phase);if(phase!=='draft')break;const token=await page.evaluate(()=>window.__CAMPUS__!.engine.draftToken);await page.locator('.draft-card').first().click();await page.waitForFunction(token=>{const g=window.__CAMPUS__!.engine;return g.phase!=='draft'||g.draftToken!==token;},token);}
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'设置',exact:true}).click();
 await page.getByRole('checkbox',{name:/^减少动态效果/}).check();
 await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.scene.feedbackState)).toMatchObject({trauma:0,zoom:1,post:{active:false},entityEffects:0});
 await page.getByRole('button',{name:'关闭面板',exact:true}).click();await page.getByRole('button',{name:'继续这个学期',exact:true}).click();
 await page.setViewportSize({width:360,height:640});
 await page.locator('.debug-toggle').click();await page.getByRole('button',{name:'大招设满',exact:true}).click();await page.locator('.debug-toggle').click();
 await expect(page.locator('.ultimate-button')).toBeEnabled();
 await page.evaluate(()=>{const canvas=document.querySelector('canvas')!,rect=canvas.getBoundingClientRect();canvas.dispatchEvent(new PointerEvent('pointerdown',{pointerId:41,pointerType:'touch',isPrimary:true,button:0,bubbles:true,clientX:rect.left+70,clientY:rect.top+430}));canvas.dispatchEvent(new PointerEvent('pointermove',{pointerId:41,pointerType:'touch',isPrimary:true,button:0,bubbles:true,clientX:rect.left+125,clientY:rect.top+430}));const button=document.querySelector('.ultimate-button')!,r=button.getBoundingClientRect();button.dispatchEvent(new PointerEvent('pointerdown',{pointerId:42,pointerType:'touch',button:0,bubbles:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2}));});
 await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.ultimate.energy)).toBe(0);
 expect(await page.evaluate(()=>window.__CAMPUS__!.engine.inputX)).toBeGreaterThan(0);
 await page.evaluate(()=>{document.querySelector('.ultimate-button')!.dispatchEvent(new PointerEvent('pointercancel',{pointerId:42,pointerType:'touch',bubbles:true}));});
 expect(await page.evaluate(()=>window.__CAMPUS__!.engine.inputX)).toBeGreaterThan(0);
 await page.evaluate(()=>document.querySelector('canvas')!.dispatchEvent(new PointerEvent('pointerup',{pointerId:41,pointerType:'touch',bubbles:true})));
 expect(await page.evaluate(()=>window.__CAMPUS__!.scene.exportPerformance().effects.particleLimit)).toBe(32768);
 await capture('battle-phone-portrait');await page.setViewportSize({width:844,height:390});await capture('battle-phone-landscape');
 await page.setViewportSize({width:1280,height:800});
 await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.send({type:'week',value:9});g.send({type:'god',value:true});g.send({type:'prepareFusion',id:'sword'});g.send({type:'spawnEnemy',id:'ddl',rank:'elite',affixes:['shield']});});
 await page.waitForFunction(()=>window.__CAMPUS__!.engine.weapons.some(w=>w.id==='ruler'));
 await page.evaluate(()=>{const g=window.__CAMPUS__!.engine,id=g.enemies.active.find(id=>g.enemies.rank[id]===1)!;g.hitEnemy(id,1e6,'knife',g.player.x,g.player.y,0,false);g.resolveDeaths();const chest=g.drops.active.find(id=>g.drops.data[id].kind==='chest')!;g.player.x=g.player.prevX=g.drops.data[chest].x;g.player.y=g.player.prevY=g.drops.data[chest].y;});
 await expect(page.getByRole('button',{name:/校园剑阵/})).toBeVisible();await capture('fusion-choice');await page.getByRole('button',{name:/校园剑阵/}).click();
 await expect(page.getByRole('button',{name:/收好，继续/})).toBeVisible();await capture('chest');await page.getByRole('button',{name:/收好，继续/}).click();
 await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.weapons.some(w=>w.id==='sword'))).toBe(true);
 const continuation=page.getByRole('button',{name:/带着新力量出发/});if(await continuation.isVisible())await continuation.click();
 await page.waitForFunction(()=>['playing','draft'].includes(window.__CAMPUS__!.engine.phase));
 // The elite's XP is a real queued level-up; consume it through the normal card UI.
 for(let n=0;n<6;n++){await page.waitForFunction(()=>{const g=window.__CAMPUS__!.engine;return g.phase==='draft'||!g.hasPendingRewards;});const phase=await page.evaluate(()=>window.__CAMPUS__!.engine.phase);if(phase!=='draft')break;const token=await page.evaluate(()=>window.__CAMPUS__!.engine.draftToken);await page.locator('.draft-card').first().click();await page.waitForFunction(token=>{const g=window.__CAMPUS__!.engine;return g.phase!=='draft'||g.draftToken!==token;},token);}
 await page.evaluate(()=>window.__CAMPUS__!.engine.send({type:'contract'}));await page.waitForFunction(()=>!!window.__CAMPUS__!.engine.landmarks.contract);
 await page.evaluate(()=>{const g=window.__CAMPUS__!.engine,c=g.landmarks.contract!;g.player.x=g.player.prevX=c.x;g.player.y=g.player.prevY=c.y;g.send({type:'interact',held:true});});
 await expect(page.getByText('风险，由你决定。',{exact:true})).toBeVisible();await capture('contract');await page.locator('.reward-card.relic').first().click();
 await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.relics.length)).toBe(1);
 await capture('battle-fusion');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:/结束本局并结算/}).click();
 await expect(page.getByText(/练习局 · 不计入绩点、成就或每日榜/)).toBeVisible();await capture('result');await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.scene.audio.debug.music.theme)).toBe('result');
 await page.evaluate(()=>Object.assign(window,{__V4_AUDIO__:window.__CAMPUS__!.scene.audio,__V4_SCENE__:window.__CAMPUS__!.scene}));
 const debugSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('campus-survival.save.v3')!));expect(debugSave.credits).toBe(137);expect(debugSave.stats.runs).toBe(3);expect(debugSave.achievements.firstFusion.completed).toBe(false);expect(debugSave.fusions).toContain('sword');
 await page.getByRole('button',{name:'返回校园',exact:true}).click();await page.waitForFunction(()=>!window.__CAMPUS__);expect(await page.locator('canvas').count()).toBe(0);expect(await page.evaluate(()=>(window as unknown as {__V4_AUDIO__:{debug:{sessionVoices:number}}}).__V4_AUDIO__.debug.sessionVoices)).toBe(0);expect(await page.evaluate(()=>(window as unknown as {__V4_SCENE__:{feedbackState:{deathSnapshots:number}}}).__V4_SCENE__.feedbackState.deathSnapshots)).toBe(0);
 await page.getByRole('button',{name:/每日挑战 · 本地榜/}).click();await page.getByRole('button',{name:/开始今日挑战/}).click();await page.waitForFunction(()=>!!window.__CAMPUS__);
 const daily=await page.evaluate(()=>({manifest:window.__CAMPUS__!.engine.manifest,cheated:window.__CAMPUS__!.engine.cheated,width:window.__CAMPUS__!.engine.viewWidth,height:window.__CAMPUS__!.engine.viewHeight}));expect(daily.cheated).toBe(false);expect(daily.manifest.rulesVersion).toBe('daily-v4.0.1');expect(daily.manifest.seed).toBe(dailyChallenge(daily.manifest.date).seed);expect(daily.manifest.seed).not.toBe(999);expect([daily.width,daily.height]).toEqual([1280,800]);
 await page.keyboard.press('Escape');await page.getByRole('button',{name:/结束本局并结算/}).click();await expect(page.getByText(/已保存至本地榜/)).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('campus-survival.save.v3')!));expect(saved.daily.records).toHaveLength(1);expect(saved.daily.records[0].date).toBe(daily.manifest.date);expect(saved.credits).toBe(137);expect(saved.stats.runs).toBe(3);
 await page.getByRole('button',{name:'返回校园',exact:true}).click();await page.waitForFunction(()=>!window.__CAMPUS__);
 await page.evaluate(()=>{const key='campus-survival.save.v3',save=JSON.parse(localStorage.getItem(key)!);save.daily.records.push({...save.daily.records[0],id:'legacy-daily-version',version:'daily-v3.1',score:999999});localStorage.setItem(key,JSON.stringify(save));});
 await page.reload();await page.getByRole('button',{name:/每日挑战 · 本地榜/}).click();await expect(page.getByRole('combobox',{name:'排行榜规则版本',exact:true})).toHaveValue('daily-v4.0.1');await expect(page.locator('.daily-table tbody tr')).toHaveCount(1);await expect(page.getByText(`最佳 ${saved.daily.records[0].score.toLocaleString()} 分 · 昵称在偏好设置中修改`,{exact:true})).toBeVisible();await page.getByRole('combobox',{name:'排行榜规则版本',exact:true}).selectOption('daily-v3.1');await expect(page.locator('.daily-table tbody tr')).toHaveCount(1);await expect(page.getByText('最佳 999,999 分 · 昵称在偏好设置中修改',{exact:true})).toBeVisible();await page.getByRole('combobox',{name:'排行榜规则版本',exact:true}).selectOption('daily-v4.0.1');await capture('daily-version-board');await page.getByRole('button',{name:'关闭面板',exact:true}).click();expect(await page.locator('canvas').count()).toBe(0);expect(await page.evaluate(()=>window.__CAMPUS__)).toBeUndefined();const labSave=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.route('**/assets/art/v4/enemies/homework*',r=>r.fulfill({status:200,contentType:'image/png',body:'invalid image bytes'}));
 await page.route('**/assets/art/v4/fx/particles*',r=>r.fulfill({status:200,contentType:'image/png',body:'invalid atlas bytes'}));
 await page.getByRole('button',{name:'表现调试实验室',exact:true}).click();
 const feedbackLab=page.frameLocator('iframe[title="打击感实验室"]');await expect(feedbackLab.locator('.lab-stage canvas')).toBeVisible();await expect.poll(()=>feedbackLab.locator('.lab-stage').evaluate(()=>window.__CAMPUS__?.scene.feedbackState.missingArt??[])).toContain('particles');await page.screenshot({path:'docs/v4.0.1-missing-battle.png',animations:'disabled'});
 await feedbackLab.getByRole('button',{name:'暴击',exact:true}).click();await feedbackLab.getByRole('checkbox',{name:'关闭 v4 表现层（A/B）',exact:true}).check();
 const exports:Record<string,unknown>[]=[];
 for(const [tab,label,button] of [['feedback','打击感实验室','导出打击感参数 JSON'],['audio','音频实验室','导出音频参数 JSON'],['motion','界面动效实验室','导出界面参数 JSON']] as const){
  if(tab!=='feedback')await page.locator('.lab-shell>header').getByRole('button',{name:label,exact:true}).click();
  const current=page.frameLocator(`iframe[title="${label}"]`);await current.getByRole('button',{name:button,exact:true}).waitFor();
  const [file]=await Promise.all([page.waitForEvent('download'),current.getByRole('button',{name:button,exact:true}).click()]);const exported=JSON.parse(readFileSync((await file.path())!,'utf8'));expect(exported.lab).toBe(tab);exports.push(exported);
  await page.screenshot({path:`docs/v4.0.1-lab-${tab}.png`,animations:'disabled'});
 }
 await page.getByRole('button',{name:'关闭实验室',exact:true}).click();await page.unroute('**/assets/art/v4/enemies/homework*');await page.unroute('**/assets/art/v4/fx/particles*');expect(await page.evaluate(()=>JSON.stringify({...localStorage}))).toBe(labSave);
 const localBeforeLabs=await page.evaluate(()=>JSON.stringify({...localStorage}));
 const lab=await page.context().newPage();const labErrors:string[]=[];lab.on('pageerror',e=>labErrors.push(e.message));
 await lab.route('**/assets/audio/v4/hit-paper-0.ogg',r=>r.fulfill({status:200,contentType:'audio/ogg',body:'invalid encoded sample'}));
 await lab.route('**/assets/audio/v4/music-menu.ogg',r=>r.fulfill({status:200,contentType:'audio/ogg',body:'invalid encoded music'}));
 await lab.goto('/?debug=1&fixture=1&lab=audio');await lab.getByRole('button',{name:'试听完整事件',exact:true}).click();
 await expect.poll(async()=>JSON.parse(await lab.getByTestId('audio-state').textContent()??'{}').ready).toBe(true);
 await expect.poll(async()=>JSON.parse(await lab.getByTestId('audio-state').textContent()??'{}').sampleFailures??[]).toContain('hit-paper-0');
 await lab.getByRole('button',{name:'独听起音',exact:true}).click();await expect.poll(async()=>JSON.parse(await lab.getByTestId('audio-state').textContent()??'{}').fallbackPlays).toBeGreaterThan(0);
 await expect.poll(async()=>JSON.parse(await lab.getByTestId('audio-state').textContent()??'{}').music?.tracks?.some((t:{fallback:boolean})=>t.fallback)).toBe(true);
 const audioFailureState=JSON.parse(await lab.getByTestId('audio-state').textContent()??'{}');await lab.close();
 const fixture=await page.context().newPage();fixture.on('pageerror',e=>labErrors.push(e.message));await fixture.goto('/?debug=1&fixture=1&lab=ui-preview');await fixture.locator('.fixture-root').waitFor();
 const reviewFixture=async(screen:string,width:number,height:number,extra:Record<string,unknown>={})=>{
  await fixture.setViewportSize({width,height});await fixture.evaluate(params=>window.postMessage({type:'campus-ui-fixture',params},location.origin),{screen,width,height,rarity:3,longText:false,largeNumbers:false,state:'full',motion:false,missing:false,...extra});
  await fixture.waitForTimeout(160);await fixture.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).filter(i=>i.offsetParent!==null).map(i=>i.decode().catch(()=>{})));});
  const report=await fixture.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:Array.from(document.images).filter(i=>i.offsetParent!==null&&(!i.complete||!i.naturalWidth)).map(i=>i.src),hudOverlaps:(()=>{const nodes=Array.from(document.querySelectorAll<HTMLElement>('.player-status,.semester-status,.hud-actions>button,.boss-health,.battle-notice,.event-pill,.relic-strip,.direction-hints,.active-actions,.momentum-hud,.hud-bottom')).filter(e=>e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='contents').map(e=>{const box=e.getBoundingClientRect(),r={top:box.top,right:box.right,bottom:box.bottom,left:box.left};for(let p=e.parentElement;p;p=p.parentElement)if(/auto|scroll|hidden|clip/.test(getComputedStyle(p).overflow)){const b=p.getBoundingClientRect();r.top=Math.max(r.top,b.top);r.right=Math.min(r.right,b.right);r.bottom=Math.min(r.bottom,b.bottom);r.left=Math.max(r.left,b.left);}return{element:e,name:e.className,r};}).filter(e=>e.r.right>e.r.left&&e.r.bottom>e.r.top);return nodes.flatMap((a,i)=>nodes.slice(i+1).filter(b=>!a.element.contains(b.element)&&!b.element.contains(a.element)&&Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1).map(b=>[a.name,b.name]));})(),smallTargets:Array.from(document.querySelectorAll<HTMLElement>('button,input[type=range],select')).filter(e=>e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden').map(e=>({label:e.getAttribute('aria-label')??e.textContent?.slice(0,30),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})).filter(e=>e.width<43.5||e.height<43.5)}));
  reviews.push({screen:`fixture-${screen}`,viewport:[width,height],...extra,...report});expect(report.horizontalOverflow,`${screen} ${width}x${height}`).toBe(false);expect(report.brokenImages).toEqual([]);expect(report.smallTargets,`${screen} ${width}x${height}`).toEqual([]);expect(report.hudOverlaps,`${screen} ${width}x${height}`).toEqual([]);
  return report;
 };
 for(const [width,height,label] of [[360,640,'phone-portrait'],[844,390,'phone-landscape'],[1280,800,'desktop']] as const){
  for(const screen of ['menu','playing','draft','chest','paused','result','codex']){await reviewFixture(screen,width,height);await fixture.screenshot({path:`docs/v4.0.1-${screen}-${label}.png`,animations:'disabled'});}
 }
 for(const [width,height] of [[375,667],[390,844],[414,896],[430,932],[768,1024],[1024,768],[2560,1080]])for(const screen of ['playing','draft','codex'])await reviewFixture(screen,width,height);
 await fixture.setViewportSize({width:360,height:640});await fixture.evaluate(()=>{const s=document.documentElement.style;s.setProperty('--safe-top','28px');s.setProperty('--safe-bottom','20px');s.setProperty('--safe-left','12px');s.setProperty('--safe-right','12px');});
 await reviewFixture('playing',360,640,{longText:true,largeNumbers:true});await fixture.screenshot({path:'docs/v4.0.1-hud-safe-area-long.png',animations:'disabled'});
 await reviewFixture('result',360,640,{largeNumbers:true,motion:true});await reviewFixture('result',360,640,{largeNumbers:true,motion:false});await expect(fixture.locator('.result-metrics strong').nth(1)).toHaveText('987,654,321');
 expect(await fixture.locator('.damage-bar>div').evaluateAll(els=>els.every(el=>!(el as HTMLElement).style.transform))).toBe(true);
 await reviewFixture('draft',360,640,{state:'empty',motion:true});await reviewFixture('result',360,640,{state:'empty',motion:true});
 await reviewFixture('draft',360,640,{longText:true,missing:true});await fixture.screenshot({path:'docs/v4.0.1-missing-ui.png',animations:'disabled'});await fixture.close();expect(labErrors).toEqual([]);
 expect(await page.evaluate(()=>JSON.stringify({...localStorage}))).toBe(localBeforeLabs);
 // Isolated storage for recovery: preserve the original test's migrated save.
 const recoveryContext=await page.context().browser()!.newContext({baseURL:new URL(page.url()).origin}),recoveryPage=await recoveryContext.newPage();
 const damaged=JSON.stringify({...migrated,credits:'137',selected:'coder',unlocked:['balanced','coder'],talents:{hp:3}});await recoveryPage.addInitScript(raw=>{if(localStorage.getItem('campus-survival.save.v3')===null)localStorage.setItem('campus-survival.save.v3',raw);},damaged);
 await recoveryPage.goto('/?debug=1');await expect(recoveryPage.getByRole('dialog',{name:'本地存档需要恢复',exact:true})).toBeVisible();await recoveryPage.screenshot({path:'docs/v4.0.1-save-recovery.png',animations:'disabled'});
 const [originalFile]=await Promise.all([recoveryPage.waitForEvent('download'),recoveryPage.getByRole('button',{name:'导出原文',exact:true}).click()]);expect(readFileSync((await originalFile.path())!,'utf8')).toBe(damaged);
 await recoveryPage.getByRole('button',{name:'按字段恢复',exact:true}).click();await expect(recoveryPage.locator('.recovery-changes')).toContainText('credits：归一化 / 丢弃非法项 "137" → 0');expect(await recoveryPage.evaluate(()=>localStorage.getItem('campus-survival.save.v3'))).toBe(damaged);await recoveryPage.screenshot({path:'docs/v4.0.1-save-recovery-preview.png',animations:'disabled'});
 await recoveryPage.getByRole('button',{name:'确认恢复并保存',exact:true}).click();await expect(recoveryPage.getByRole('dialog').getByText('已按字段恢复并保存，恢复前原文可导出',{exact:true}).first()).toBeVisible();
 expect(await recoveryPage.evaluate(()=>JSON.parse(localStorage.getItem('campus-survival.save.v3')!))).toMatchObject({credits:0,selected:'coder',talents:{hp:3}});expect(await recoveryPage.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('campus-survival.recovery.v3.')).map(k=>localStorage.getItem(k)))).toContain(damaged);await recoveryContext.close();
 const lifecycle:unknown[]=[];const loopStarted=performance.now();
 for(let cycle=0;cycle<5;cycle++){
  await page.getByRole('button',{name:/开始新学期/}).click();await page.getByRole('button',{name:/就这样，开学/}).click();await page.waitForFunction(()=>!!window.__CAMPUS__);
  await page.evaluate(()=>{const session=window.__CAMPUS__!;Object.assign(window,{__V4_SCENE__:session.scene,__V4_AUDIO__:session.scene.audio});session.engine.send({type:'god',value:true});session.engine.send({type:'abandon'});});
  await page.getByRole('button',{name:'返回校园',exact:true}).click();await page.waitForFunction(()=>!window.__CAMPUS__);
  await expect.poll(()=>page.evaluate(()=>(window as unknown as {__V4_SCENE__:{resourceState:{loader:{textures:number}}}}).__V4_SCENE__.resourceState.loader.textures)).toBe(0);
  const state=await page.evaluate(()=>(window as unknown as {__V4_SCENE__:{resourceState:{geometry:number;sessionVoices:number;canvas:boolean}}}).__V4_SCENE__.resourceState);expect(state).toMatchObject({geometry:0,sessionVoices:0,canvas:false});lifecycle.push(state);
 }
 const lifecycleSeconds=(performance.now()-loopStarted)/1000;
 writeFileSync('docs/v4.0.1-browser-review.json',JSON.stringify({firstScreenBytes,reviews,errors,warnings,loadFailures,labErrors,audioFailureState,exports,lifecycle,lifecycleSeconds},null,2));expect(errors).toEqual([]);expect(warnings).toEqual([]);expect(loadFailures).toEqual([]);expect(reviews.every(review=>!(review as {horizontalOverflow:boolean}).horizontalOverflow)).toBe(true);expect(reviews.every(review=>(review as {brokenImages:unknown[]}).brokenImages.length===0)).toBe(true);writeFileSync('docs/v4.0.1-browser-review.json',JSON.stringify({firstScreenBytes,reviews,errors,warnings,loadFailures,labErrors,audioFailureState,exports,lifecycle,lifecycleSeconds},null,2));
});
