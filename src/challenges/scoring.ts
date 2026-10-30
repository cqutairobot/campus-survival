import type {DailyRecord,RunProgress} from '../types';
export function scoreBreakdown(completedWeeks:number,p:RunProgress,bosses:number,victory:boolean,seconds:number,averageCurse:number){
 const base=completedWeeks*1000+p.normalKills*4+p.elites*600+p.miniBosses*3000+bosses*5000+(victory?20000:0);
 const time=victory?Math.max(0,1200-seconds)*20:0,multiplier=1+.05*Math.max(0,Math.min(3,averageCurse));
 return{base,time,multiplier,score:Math.floor((base+time)*multiplier)};
}
export const compareDaily=(a:DailyRecord,b:DailyRecord)=>b.score-a.score||Number(b.victory)-Number(a.victory)||b.completedWeeks-a.completedWeeks||a.seconds-b.seconds||a.createdAt-b.createdAt||a.id.localeCompare(b.id);
export function retainRecords(records:DailyRecord[]){
 const latest=records.map(r=>r.date).sort().at(-1),cutoff=latest?new Date(Date.parse(latest)-29*86400000).toISOString().slice(0,10):'',counts=new Map<string,number>(),seen=new Set<string>();
 return [...records].sort(compareDaily).filter(r=>{if(r.date<cutoff||seen.has(r.id))return false;seen.add(r.id);const key=`${r.date}|${r.version}`,count=counts.get(key)??0;counts.set(key,count+1);return count<10;});
}
