import {S1_IDS} from './profile';
import {S2_IDS} from '../../semesters/catalog-ids';
import type {SaveProfile} from '../../semesters/profile';
import type {Discovery} from '../../semesters/types';

/** The legacy protocol splits at the first colon; namespaced IDs remain intact. */
export function legacyDiscovery(value:string,evolution=false):Discovery{
 const at=value.indexOf(':'),prefix=at<0?'':value.slice(0,at),category=['enemy','fusion','relic','event','region'].includes(prefix)?prefix as Discovery['category']:evolution?'evolution':'item';
 return {category,id:category==='item'||category==='evolution'?value:value.slice(at+1),semesterId:'s1',evidence:'run'};
}
export function discoverProfile(profile:SaveProfile,discovery:Discovery):SaveProfile{
 if(discovery.category==='interaction'){const id=discovery.id;if(discovery.semesterId!=='s2'||!(S2_IDS.interactions as readonly string[]).includes(id)||profile.semesters.s2.discoveredInteractions.includes(id))return profile;return{...profile,semesters:{...profile.semesters,s2:{...profile.semesters.s2,discoveredInteractions:[...profile.semesters.s2.discoveredInteractions,id]}}};}
 const {category,id,semesterId}=discovery,lists=semesterId==='s1'?S1_IDS:Object.fromEntries(Object.keys(S1_IDS).map(k=>[k,[...S1_IDS[k as keyof typeof S1_IDS],...S2_IDS[k as keyof typeof S1_IDS]]])) as typeof S1_IDS;
 const target={item:'discovered',evolution:'evolutions',enemy:'discoveredEnemies',fusion:'fusions',relic:'relics',event:'events',region:'regions'} as const;
 const allowed:readonly string[]=category==='item'?[...lists.weapons,...lists.passives,...lists.fusions]:category==='evolution'?lists.weapons:lists[{enemy:'enemies',fusion:'fusions',relic:'relics',event:'events',region:'regions'}[category] as keyof typeof S1_IDS];
 const key=target[category];if(!allowed?.includes(id)||!key||profile[key].includes(id))return profile;
 return {...profile,[key]:[...profile[key],id]};
}
