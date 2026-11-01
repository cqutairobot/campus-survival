import {Art} from './Art';
import {Icon} from './Icon';
import {enemyArt,itemArt,landmarkArt} from '../../assets/bindings';
import {S2_ART_BINDINGS} from '../../semesters/s2/presentation/art-manifest';
import type {ResourceId} from '../../assets/manifest';

/** The same logical content bindings are used in cards, recipes, HUD and results. */
export function ContentArt({id,kind='item',icon='book',className='',evolved=false,alt='',detail=false}:{id:string;kind?:'item'|'enemy'|'landmark';icon?:string;className?:string;evolved?:boolean;alt?:string;detail?:boolean}){
  const binding=(S2_ART_BINDINGS as Record<string,{icon:ResourceId;detail?:ResourceId}>)[id+(evolved?':evolved':'')];
  const art=(detail?binding?.detail:undefined)??binding?.icon??(kind==='enemy'?enemyArt[id]?.sprite:kind==='landmark'?landmarkArt[id]:itemArt[id]);
  return <span className={`content-art ${evolved?'art-evolved':''} ${className}`}>{art?<Art id={art} alt={alt} fallback={<Icon name={icon} size={40}/>}/>:<Icon name={icon} size={40}/>} {evolved&&<i className="evolved-mark" aria-label="进化">✦</i>}</span>;
}
