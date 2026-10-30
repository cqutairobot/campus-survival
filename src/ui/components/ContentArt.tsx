import {Art} from './Art';
import {Icon} from './Icon';
import {enemyArt,itemArt,landmarkArt} from '../../assets/bindings';

/** The same logical content bindings are used in cards, recipes, HUD and results. */
export function ContentArt({id,kind='item',icon='book',className='',evolved=false,alt=''}:{id:string;kind?:'item'|'enemy'|'landmark';icon?:string;className?:string;evolved?:boolean;alt?:string}){
  const art=kind==='enemy'?enemyArt[id]?.sprite:kind==='landmark'?landmarkArt[id]:itemArt[id];
  return <span className={`content-art ${evolved?'art-evolved':''} ${className}`}>{art?<Art id={art} alt={alt} fallback={<Icon name={icon} size={40}/>}/>:<Icon name={icon} size={40}/>} {evolved&&<i className="evolved-mark" aria-label="进化">✦</i>}</span>;
}
