import type {Quality} from '../types';
import type {FeedbackProfile} from './profiles';
/** Manual budgets only. Frame rate never participates in this decision. */
export const QUALITY = {
 high:{dpr:2,particles:32768,numbers:160,bloomResolution:1,bloomQuality:3},
 medium:{dpr:1.5,particles:8192,numbers:80,bloomResolution:.5,bloomQuality:2},
 low:{dpr:1,particles:1024,numbers:32,bloomResolution:.5,bloomQuality:1},
} as const;
export const qualityName=(quality:Quality)=>quality==='medium'||quality==='low'?quality:'high';
export const qualityBudget=(quality:Quality)=>QUALITY[qualityName(quality)];
export function allowsDistortion(quality:Quality,profile:FeedbackProfile){
 return qualityName(quality)==='high'||qualityName(quality)==='medium'&&profile.trauma>=.6;
}
