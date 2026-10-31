import type {SaveData} from '../types';
import {validateSave,validPersistence} from './storage';

export interface RecoverySource {key:string;raw:string;reason:string}
export interface RecoveryPreview {save:SaveData;changes:string[]}
const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
export function diagnoseSave(raw:string):string{
 try{const v:unknown=JSON.parse(raw);if(!object(v))return '存档不是数据对象';if(Number(v.schemaVersion)>3)return '来自未来版本，不能覆盖';if(![1,2,3].includes(v.schemaVersion as number))return '无法识别存档版本';if(typeof v.credits!=='number'||!Number.isFinite(v.credits)||v.credits<0)return '绩点字段类型或范围异常';return '存档字段异常';}catch{return 'JSON 无法解析';}
}
/** Only sanitize recognized schemas. Never guess JSON or coerce currency. */
export function recoveryPreview(raw:string):RecoveryPreview|null{
 let v:unknown;try{v=JSON.parse(raw);}catch{return null;}
 if(!object(v)||![1,2,3].includes(v.schemaVersion as number))return null;
 const credits=typeof v.credits==='number'&&Number.isFinite(v.credits)&&v.credits>=0?v.credits:0;
 const candidate:Record<string,unknown>={...v,credits};if(Object.hasOwn(candidate,'persistence')&&!validPersistence(candidate.persistence))delete candidate.persistence;
 const save=validateSave(candidate);if(!save)return null;
 const changes:string[]=[];
 const walk=(before:unknown,after:unknown,path:string)=>{
  if(object(after)){for(const [k,a] of Object.entries(after))walk(object(before)?before[k]:undefined,a,path?`${path}.${k}`:k);if(object(before))for(const k of Object.keys(before))if(!Object.hasOwn(after,k))changes.push(`${path?path+'.':''}${k}：丢弃未知字段`);return;}
  const show=(x:unknown)=>JSON.stringify(x)??'缺失';
  changes.push(`${path}：${JSON.stringify(before)===JSON.stringify(after)?'保留':before===undefined?'补默认':'归一化 / 丢弃非法项'} ${show(before)}${JSON.stringify(before)===JSON.stringify(after)?'':` → ${show(after)}`}`);
 };
 walk(v,save,'');return {save,changes};
}
/** A stable content key; collision slots are checked byte-for-byte before reuse. */
export function recoveryDigest(raw:string){let a=2166136261,b=5381;for(let n=0;n<raw.length;n++){a=Math.imul(a^raw.charCodeAt(n),16777619);b=Math.imul(b,33)^raw.charCodeAt(n);}return `${raw.length}-${(a>>>0).toString(16)}-${(b>>>0).toString(16)}`;}
