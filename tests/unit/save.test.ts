// 历史 v2 契约：schema 2 终点与 quality=auto 默认不适用于当前版本。
// v4.0.1 重置保留独立原文记录并写入新档，不再要求整个 Storage 为空。
// 当前迁移、0/false、未来档保护与防重复结算见 v3-foundation、v4-settings、v4-fixes。
import { describe,expect,it } from 'vitest';
import { BACKUP_KEY, freshSave, SAVE_KEY, SaveRepository, settleRun, validateSave } from '../../src/save/storage';
import type { RunResult } from '../../src/types';
class MemoryStorage {data=new Map<string,string>();getItem(k:string){return this.data.get(k)??null;}setItem(k:string,v:string){this.data.set(k,v);}removeItem(k:string){this.data.delete(k);}}
describe('存档与结算',()=>{
  it('往返保存、保留有效备份，主档损坏时回退',()=>{const s=new MemoryStorage(),repo=new SaveRepository(s),save=freshSave();save.credits=15;expect(repo.write(save)).toBe(true);repo.write({...save,credits:20});expect(JSON.parse(s.getItem(BACKUP_KEY)!).credits).toBe(15);s.setItem(SAVE_KEY,'{broken');expect(repo.load().credits).toBe(15);expect(repo.status).toContain('备份');});
  it('v1 迁移为 v2，未来版本和非法数据不能导入',()=>{expect(validateSave({...freshSave(),schemaVersion:1})?.schemaVersion).toBe(2);expect(validateSave({...freshSave(),schemaVersion:99})).toBeNull();expect(validateSave({...freshSave(),credits:-1})).toBeNull();expect(validateSave({schemaVersion:2,credits:Infinity})).toBeNull();expect(validateSave(null)).toBeNull();});
  it('导入字段校验、范围限制、去重，不信任未知内容 ID',()=>{const s=validateSave({...freshSave(),unlocked:['coder','fake','coder'],selected:'fake',discovered:['__proto__','constructor','bad','orbit'],evolutions:['bad','orbit'],talents:{hp:999,damage:-1},settings:{music:8,master:-2,quality:'unsafe'}})!;expect(s.unlocked).toEqual(['balanced','coder']);expect(s.selected).toBe('balanced');expect(s.discovered).toEqual(['knife','orbit']);expect(s.evolutions).toEqual(['orbit']);expect(s.talents.hp).toBe(5);expect(s.talents.damage).toBe(0);expect(s.settings.music).toBe(1);expect(s.settings.master).toBe(0);expect(s.settings.quality).toBe('auto');});
  it('重复结算保护和调试局保护',()=>{const result:RunResult={id:'run-1',victory:true,week:22,completedWeeks:22,kills:1000,level:40,bosses:3,seconds:1000,credits:97,weapons:[],passives:[],damage:{},debug:false};const s=settleRun(freshSave(),result);expect(s.credits).toBe(97);expect(s.stats.wins).toBe(1);expect(settleRun(s,result)).toBe(s);expect(settleRun(s,{...result,id:'run-2',debug:true})).toBe(s);});
  it('存储不可用时仍能使用内存存档，完整重置清除旧备份',()=>{const repo=new SaveRepository(null);expect(repo.load().unlocked).toContain('balanced');expect(repo.write(freshSave())).toBe(false);const s=new MemoryStorage(),r=new SaveRepository(s);r.write(freshSave());r.write(freshSave());r.reset();expect(s.data.size).toBe(0);});
});
