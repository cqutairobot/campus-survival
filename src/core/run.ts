import {Random} from './math';
import {CHARACTERS,PASSIVES,TALENTS,WEAPONS} from '../data/catalog';
import {DAILY_RULES,DAILY_RULES_VERSION,RULES_VERSION} from '../data/daily';
import {dailyChallenge} from '../challenges/daily';
import type {RunManifest,RunProgress,SaveData} from '../types';
export const LOGICAL_WIDTH=1280,LOGICAL_HEIGHT=800;
export const STREAM_NAMES=['spawn','ai','combat','drop','draft','event','affix','relic'] as const;
export function hash32(text:string){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
export function randomStreams(seed:number){return Object.fromEntries(STREAM_NAMES.map(name=>[name,new Random(hash32(`${seed}|${name}`))])) as Record<typeof STREAM_NAMES[number],Random>;}
export function createManifest(save:SaveData,seed:number,mode:'normal'|'daily'='normal',date?:string):RunManifest{
 if(mode==='daily'){const challenge=dailyChallenge(date);return{mode,seed:challenge.seed,rulesVersion:challenge.version,date:challenge.date,dailyRule:challenge.rule.id,character:challenge.rule.character,talents:Object.fromEntries(TALENTS.map(t=>[t.id,3])),weapons:WEAPONS.map(w=>w.id),passives:PASSIVES.map(p=>p.id),regions:['library','canteen','track','lab','workshop','garden']};}
 return{mode,seed:seed>>>0,rulesVersion:RULES_VERSION,character:save.selected,talents:{...save.talents},weapons:[...save.unlocks.weapons],passives:[...save.unlocks.passives],regions:[...save.unlocks.regions]};
}
export const freshProgress=():RunProgress=>({normalKills:0,elites:0,miniBosses:0,bossIds:[],shieldKills:0,frozen:0,visited:[],events:[],enemies:[],fusions:[],relics:[],evolutions:0,architect:false});
export const dailyRule=(manifest:RunManifest)=>DAILY_RULES.find(r=>r.id===manifest.dailyRule);

export function validManifest(value:unknown):value is RunManifest{if(!value||typeof value!=='object')return false;const m=value as RunManifest;return ['normal','daily'].includes(m.mode)&&Number.isSafeInteger(m.seed)&&m.seed>=0&&m.seed<=0xffffffff&&CHARACTERS.some(c=>c.id===m.character)&&(m.mode==='daily'?m.rulesVersion===DAILY_RULES_VERSION&&typeof m.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(m.date)&&DAILY_RULES.some(r=>r.id===m.dailyRule):m.rulesVersion===RULES_VERSION)&&!!m.talents&&typeof m.talents==='object'&&TALENTS.every(t=>Number.isInteger(m.talents[t.id]??0)&&(m.talents[t.id]??0)>=0&&(m.talents[t.id]??0)<=5)&&Array.isArray(m.weapons)&&m.weapons.length<=22&&m.weapons.every(id=>WEAPONS.some(w=>w.id===id))&&Array.isArray(m.passives)&&m.passives.length<=16&&m.passives.every(id=>PASSIVES.some(p=>p.id===id))&&Array.isArray(m.regions)&&m.regions.length<=6&&m.regions.every(id=>['library','canteen','track','lab','workshop','garden'].includes(id));}
