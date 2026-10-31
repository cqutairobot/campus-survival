import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e',testMatch:'smoke.spec.ts',timeout:240000,expect:{timeout:15000},fullyParallel:false,workers:1,
 reporter:[['list'],['html',{open:'never'}]],
 use:{baseURL:'http://127.0.0.1:5173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'npm run build && npm run preview -- --port 5173',url:'http://127.0.0.1:5173',reuseExistingServer:true,timeout:30000},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome'],viewport:{width:1280,height:800},launchOptions:{args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']}}}],
});
