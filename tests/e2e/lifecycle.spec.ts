import {expect,test} from '@playwright/test';
import {freshSave,SAVE_KEY} from '../../src/save/storage';
test('连续重开 10 次释放画布、监听器和会话资源',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Chromium CDP 提供显式 GC，其他引擎走通用流程回归。');
  test.setTimeout(120000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const save=freshSave();save.settings.quality='low';save.settings.muted=true;save.settings.motion=false;await page.addInitScript(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key:SAVE_KEY,save});
  await page.goto('/?debug=1&seed=123');const cdp=await page.context().newCDPSession(page);let baseline=0,finalHeap=0;
  for(let n=0;n<10;n++){
    await page.getByRole('button',{name:'开始新学期'}).click();await page.getByRole('button',{name:'就这样，开学'}).click();await page.waitForFunction(()=>!!window.__CAMPUS__);await expect(page.locator('canvas')).toHaveCount(1);
    await page.evaluate(()=>window.__CAMPUS__!.engine.send({type:'abandon'}));await page.getByRole('button',{name:'返回校园'}).click();await expect(page.locator('canvas')).toHaveCount(0);expect(await page.evaluate(()=>window.__CAMPUS__)).toBeUndefined();
    await cdp.send('HeapProfiler.collectGarbage');const usage=await cdp.send('Runtime.getHeapUsage');if(n===1)baseline=usage.usedSize;if(n===9)finalHeap=usage.usedSize;
  }
  // JIT, decoded audio and Pixi's shared shader caches can remain; unbounded per-run growth cannot.
  expect(finalHeap-baseline).toBeLessThan(16*1024*1024);expect(errors).toEqual([]);
});
