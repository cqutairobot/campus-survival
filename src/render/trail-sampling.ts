import type {TrailPoint} from '../fx/trails';
/** Same reverse/find predicate, order and point identity, without a temporary array. */
export function afterimagePoint(points:readonly TrailPoint[],age:number,layer:number,high:boolean):TrailPoint|undefined{
 for(let n=points.length-1;n>=0;n--){const point=points[n];if(age-point.time>=layer*.04&&age-point.time<=(high?.22:.12))return point;}
}
