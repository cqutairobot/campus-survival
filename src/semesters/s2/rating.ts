import type {Rating,SemesterResult} from '../profile';
export const S2_RATING_VERSION='rating-s2-v1';
export function semesterRating(r:SemesterResult):Rating|null {
 if(r.debug||r.practice||r.semesterId!=='s2')return null;
 const clamp=(n:number,max:number)=>Math.max(0,Math.min(max,Number.isFinite(n)?n:0)),teaching=50*clamp((r.semesterEvidence?.teachingSeconds??r.completedWeeks*40)/960,1),boss=10*clamp(r.settlement.assessmentsPassed,3),side=5*Math.min(2,new Set(r.semesterEvidence?.sideBranches??[]).size),efficiency=10*clamp((1500-r.seconds)/300,1),value=Math.round((teaching+boss+side+efficiency)*100)/100;
 const grade=r.victory&&value>=95?'S':r.victory&&value>=80?'A':value>=60?'B':'C';
 return{grade,value,ratingVersion:S2_RATING_VERSION,rulesVersion:r.manifest!.rulesVersion,semesterId:'s2',runId:r.id};
}
