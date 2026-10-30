import { expect,test,type Page } from '@playwright/test';
import { freshSave, SAVE_KEY } from '../../src/save/storage';
const errors=new WeakMap<Page,string[]>();
test.beforeEach(async({page})=>{
  const list:string[]=[];errors.set(page,list);page.on('pageerror',e=>list.push(e.message));page.on('console',m=>{if(m.type()==='error')list.push(m.text());});
  const save=freshSave();save.settings.quality='low';save.settings.muted=true;
  await page.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));},{key:SAVE_KEY,save});
});
test.afterEach(async({page})=>{expect(errors.get(page)??[]).toEqual([]);});
async function start(page:Page){await page.goto('/?debug=1&seed=123');await page.getByRole('button',{name:'开始新学期'}).click();await page.getByRole('button',{name:'就这样，开学'}).click();await page.waitForFunction(()=>!!window.__CAMPUS__);}
test('主菜单、全部图鉴、设置与存档导入导出',async({page})=>{
  await page.goto('/');await expect(page.getByRole('heading',{name:'这学期， 活下去。'})).toBeVisible();
  await page.getByRole('button',{name:/学期图鉴/}).click();await expect(page.locator('.codex-card')).toHaveCount(16);
  await page.getByRole('tab',{name:'被动 12'}).click();await expect(page.locator('.codex-card')).toHaveCount(12);
  await page.getByRole('tab',{name:'进化 16'}).click();await expect(page.locator('.codex-card')).toHaveCount(16);
  await page.getByRole('button',{name:'关闭面板'}).click();await page.getByRole('button',{name:/偏好设置/}).click();
  await page.getByRole('checkbox',{name:'静音',exact:true}).uncheck();await page.getByRole('button',{name:'导出存档'}).click();
  await page.getByRole('button',{name:'导入存档'}).click();const save=freshSave();save.credits=250;save.settings.muted=true;save.settings.quality='low';
  await page.getByLabel('粘贴导出的 JSON 存档，或选择文件').fill(JSON.stringify(save));await page.getByRole('button',{name:'验证并导入'}).click();await expect(page.locator('.form-message')).toHaveText('导入成功，进度已更新。');
  await page.getByRole('button',{name:'关闭面板'}).click();await page.getByRole('button',{name:/局外天赋/}).click();await page.locator('.talent-card').first().getByRole('button').click();await expect(page.locator('.talent-top>b').first()).toHaveText('1/5');await page.getByRole('button',{name:'关闭面板'}).click();
  await page.reload();expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).talents.hp,SAVE_KEY)).toBe(1);expect(await page.evaluate(()=>window.__CAMPUS__)).toBeUndefined();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('开局、移动、暂停、选卡、宝箱进化、Boss 与结算闭环',async({page,isMobile})=>{
  await start(page);
  await page.evaluate(()=>window.__CAMPUS__!.engine.send({type:'god',value:true}));
  const before=await page.evaluate(()=>({x:window.__CAMPUS__!.engine.player.x,y:window.__CAMPUS__!.engine.player.y}));
  if(isMobile){await page.locator('canvas').dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch',clientX:150,clientY:300,button:0});await page.locator('canvas').dispatchEvent('pointermove',{pointerId:1,pointerType:'touch',clientX:220,clientY:300});await page.waitForTimeout(400);await page.locator('canvas').dispatchEvent('pointercancel',{pointerId:1,pointerType:'touch'});}else{await page.keyboard.down('KeyD');await page.waitForTimeout(400);await page.keyboard.up('KeyD');}
  await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.player.x)).toBeGreaterThan(before.x+4);
  await page.getByRole('button',{name:'暂停游戏'}).click();await expect(page.getByRole('heading',{name:'歇一下，也没关系。'})).toBeVisible();const t=await page.evaluate(()=>window.__CAMPUS__!.engine.combatTime);await page.waitForTimeout(350);expect(await page.evaluate(()=>window.__CAMPUS__!.engine.combatTime)).toBe(t);await page.getByRole('button',{name:'继续这个学期'}).click();
  await page.evaluate(()=>window.__CAMPUS__!.engine.send({type:'xp',value:12}));await expect(page.locator('.draft-card')).toHaveCount(3);await page.locator('.draft-card').first().click();await expect(page.locator('.draft-card')).toHaveCount(0);
  await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.send({type:'grant',id:'orbit',level:5});g.send({type:'grant',id:'xp',level:1});g.send({type:'chest'});});await expect(page.getByRole('heading',{name:'打开学术补给箱'})).toBeVisible();await page.getByRole('button',{name:'跳过抽奖动画'}).click();await expect(page.locator('.chest-results')).toContainText('核心期刊结界');await page.getByRole('button',{name:'收好，继续'}).click();await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.weapons.find(w=>w.id==='orbit')?.evolved)).toBe(true);
  await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.send({type:'boss',value:0});});await expect(page.getByRole('heading',{name:'开题报告'})).toBeVisible();await page.getByRole('button',{name:'跳过演出'}).click();await expect(page.locator('.boss-health')).toBeVisible();
  await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.hitEnemy(g.bossEnemy,1e9,'knife',0,0);});await expect(page.locator('.chest-overlay')).toBeVisible();await page.getByRole('button',{name:'跳过抽奖动画'}).click();await page.getByRole('button',{name:'收好，继续'}).click();
  await page.evaluate(()=>window.__CAMPUS__!.engine.send({type:'abandon'}));await expect(page.getByRole('heading',{name:'今天也很努力了。'})).toBeVisible();await expect(page.locator('.debug-run-note')).toBeVisible();await page.getByRole('button',{name:'返回校园'}).click();await expect(page.getByRole('button',{name:'开始新学期'})).toBeVisible();expect(await page.evaluate(()=>window.__CAMPUS__)).toBeUndefined();
});
test('横竖屏、失焦与触摸取消清空输入',async({page})=>{
  await start(page);await page.keyboard.down('KeyW');await page.waitForTimeout(150);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.phase)).toBe('paused');expect(await page.evaluate(()=>window.__CAMPUS__!.engine.inputY)).toBe(0);
  await page.setViewportSize({width:844,height:390});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.getByRole('button',{name:'继续这个学期'}).click();await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>window.__CAMPUS__!.engine.inputY)).toBe(0);await expect(page.locator('.loadout')).toBeVisible();await expect(page.getByRole('button',{name:'暂停游戏'})).toBeVisible();
});
test('未静音开局时，音频设备不可用也不产生未处理异常',async({page})=>{
  await page.goto('/?debug=1');await page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key)!);s.settings.muted=false;localStorage.setItem(key,JSON.stringify(s));},SAVE_KEY);await page.reload();await page.getByRole('button',{name:'开始新学期'}).click();await page.getByRole('button',{name:'就这样，开学'}).click();await page.waitForFunction(()=>!!window.__CAMPUS__);await page.waitForTimeout(500);await page.locator('canvas').click({position:{x:150,y:250}});await page.waitForTimeout(1000);await page.getByRole('button',{name:'暂停游戏'}).click();await expect(page.getByRole('heading',{name:'歇一下，也没关系。'})).toBeVisible();
});
test('v2 狂热条、连杀、快速进化和高档特效预算',async({page})=>{
  await start(page);
  // Hold combat quiet while asserting exact debug values; ordinary kills charge the bar.
  await page.evaluate(()=>{const g=window.__CAMPUS__!.engine;g.enemies.clear();g.weapons.length=0;});
  await page.locator('.debug-toggle').click();
  await page.getByRole('button',{name:'狂热条 85',exact:true}).click();await expect(page.getByRole('progressbar',{name:'狂热条'})).toHaveAttribute('aria-valuenow','85');
  await page.getByRole('button',{name:'触发狂热',exact:true}).click();await expect(page.locator('.momentum-hud')).toHaveClass(/frenzy-active/);
  await page.getByRole('button',{name:'99 连杀',exact:true}).click();await expect(page.locator('.combo-counter b')).toContainText('99');
  await page.getByRole('combobox',{name:'授予技能'}).selectOption('knife');await page.getByRole('button',{name:'快速进化',exact:true}).click();await page.locator('.debug-toggle').click();
  await expect(page.locator('.chest-overlay')).toBeVisible();await page.getByRole('button',{name:'跳过抽奖动画'}).click();await expect(page.locator('.chest-results')).toContainText('参考文献风暴');await page.getByRole('button',{name:'收好，继续'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.engine.weapons[0].evolved)).toBe(true);
  await page.evaluate(()=>{
    const {engine:g,scene}=window.__CAMPUS__!;scene.applySettings({...g.save.settings,quality:'high'});
    g.emit({type:'evolution',x:g.player.x,y:g.player.y,color:0x75d7ba,size:240,weapon:'knife',evolved:true});
  });
  await expect.poll(()=>page.evaluate(()=>window.__CAMPUS__!.scene.exportPerformance().effects.particleLimit)).toBe(12288);
  expect(await page.evaluate(()=>window.__CAMPUS__!.scene.exportPerformance().quality)).toBe('high');
  expect(await page.evaluate(()=>window.__CAMPUS__!.engine.cheated)).toBe(true);
});
