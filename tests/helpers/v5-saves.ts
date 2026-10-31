/** Minimal historical shapes, not schema 4 objects relabelled as old versions.
 * schema 1/2: old migrations.ts inputs; v3: 7085e4c; P0/P1: e448cb1;
 * P2: 02942eb; v4.0.1: 08722a5 (persistence added in 75e75bb). */
import {freshSave} from '../../src/save/storage';
import {DEFAULT_SETTINGS} from '../../src/save/settings';

export function historicalSaves():Record<string,Record<string,unknown>>{
 const early={credits:137,unlocked:['balanced','coder'],selected:'coder',talents:{hp:3,damage:2},discovered:['knife','orbit','xp'],evolutions:['orbit'],settledRuns:['historical-run'],settings:{master:.4,music:.2,sfx:.6,quality:'medium',muted:true,motion:false,shake:0,flash:0},stats:{runs:4,wins:1,kills:600,bestWeek:22}};
 const v3={...structuredClone(early),schemaVersion:3,contentVersion:'3.0.0',unlocks:{weapons:[...freshSave().unlocks.weapons,'shuttle','blueprint'],passives:[...freshSave().unlocks.passives],regions:['library','canteen','track','lab','garden']},achievements:{...freshSave().achievements,exercise:{progress:500,completed:true,claimed:true}},discoveredEnemies:['homework','finals'],fusions:['sword'],relics:['clockShard'],events:['portal'],regions:['garden'],daily:{records:[{id:'old-daily',date:'2026-10-30',version:'daily-v3.1',rule:'piercing',character:'balanced',nickname:'旧同学',score:12345,victory:true,completedWeeks:22,seconds:1000,build:['knife','xp'],relics:['clockShard'],averageCurse:.5,createdAt:1700000000000}],attempts:{'2026-10-30|daily-v3.1':2},completedDates:['2026-10-30']},stats:{...early.stats,elites:7,miniBosses:1,shieldKills:2,frozen:4,visits:['garden']}};
 const p0={...structuredClone(v3),contentVersion:'4.0.0',settings:{...v3.settings,settingsVersion:4,uiSfx:.3,hitStop:0,zoomEffects:false,distortion:false}};
 const p1={...structuredClone(p0),settings:{...p0.settings,damageNumbers:false,afterimages:false,haptics:false,quickChest:false,nickname:'原昵称',dynamicMusic:false,musicDucking:false}};
 const p2={...structuredClone(p1),settings:{...p1.settings,audioPreset:'phone'}};
 const final={...structuredClone(p2),contentVersion:'4.0.1',settings:{...DEFAULT_SETTINGS,...p2.settings},persistence:{revision:8,epoch:2,ownerId:'old-page'}};
 return {schema1:{...structuredClone(early),schemaVersion:1,contentVersion:'1.0.0'},v2:{...structuredClone(early),schemaVersion:2,contentVersion:'2.0.0'},v2Uncleared:{...structuredClone(early),schemaVersion:2,contentVersion:'2.0.0',stats:{...early.stats,wins:0}},v3,p0,p1,p2,v401:final};
}
