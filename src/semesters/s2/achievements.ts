import type {SaveProfile,SemesterResult} from '../profile';
import {S2_IDS} from '../catalog-ids';

export const S2_ACHIEVEMENTS=[
 {id:'s2:proposal',name:'外场开题',goal:1,condition:'第二学期普通模式击败联合选题审查',reward:'课题档案徽章'},
 {id:'s2:network',name:'网络检修员',goal:10,condition:'第二学期普通模式累计关闭10个有效联调终端',reward:'网络主题头像框'},
 {id:'s2:guide',name:'新区向导',goal:3,condition:'第二学期普通模式累计访问三个新区',reward:'校园地图样式'},
 {id:'s2:collaboration',name:'跨课题协作',goal:1,condition:'第二学期普通模式完成任一新旧材料混合融合',reward:'融合图鉴徽章'},
 {id:'s2:multidiscipline',name:'多学科进修',goal:4,condition:'正常结算中累计获得四种第二学期新进化',reward:'学期档案印章'},
 {id:'s2:survivor',name:'进阶学期幸存者',goal:1,condition:'第二学期普通模式完整通关',reward:'第二学期毕业证'},
 {id:'s2:risk',name:'风险项目负责人',goal:1,condition:'第二学期普通模式持有至少两件遗物通关',reward:'风险称号'},
 {id:'s2:today',name:'第二学期日课',goal:3,condition:'通关三个不同北京时间日期的第二学期每日挑战',reward:'S2本地榜头像框',daily:true},
] as const;
export const s2DailyDates=(p:SaveProfile)=>new Set(p.daily.completedKeys.filter(k=>k.startsWith('s2|')).map(k=>k.slice(3))).size;
/** UI derives partial daily progress from the date keys; the award itself is
 * committed with the third settlement, never with discovery/debug writes. */
export function s2AchievementProgress(p:SaveProfile,id:string){return id==='s2:today'?Math.min(3,s2DailyDates(p)):p.semesters.s2.achievements[id]?.progress??0;}
export function awardSemesterAchievements(p:SaveProfile,r:SemesterResult){
 const s=p.semesters.s2,normal=r.manifest?.mode==='normal',e=r.semesterEvidence;
 if(normal)s.evidence.terminalClosures+=Math.max(0,Math.floor(e?.terminalClosures??0));s.evidence.evolutions=[...new Set([...s.evidence.evolutions,...(e?.evolutions??[]).filter(id=>(S2_IDS.weapons as readonly string[]).includes(id))])];
 const values:Record<string,number>=normal?{'s2:proposal':Number(r.settlement.assessmentsPassed>=1),'s2:network':s.evidence.terminalClosures,'s2:guide':s.stats.visits.filter(id=>(S2_IDS.regions as readonly string[]).includes(id)).length,'s2:collaboration':Number(!!e?.mixedFusion),'s2:multidiscipline':s.evidence.evolutions.length,'s2:survivor':Number(r.victory),'s2:risk':Number(r.victory&&new Set(e?.heldRelics??[]).size>=2)}:{};
 if(!normal&&s2DailyDates(p)>=3)values['s2:today']=3;
 values['s2:multidiscipline']=s.evidence.evolutions.length;
 for(const a of S2_ACHIEVEMENTS){if(values[a.id]===undefined)continue;const old=s.achievements[a.id],progress=Math.min(a.goal,Math.max(old?.progress??0,values[a.id])),completed=!!old?.completed||progress>=a.goal;s.achievements[a.id]={progress,completed,claimed:completed};}
}
