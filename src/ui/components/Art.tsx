import {useState,type ReactNode} from 'react';
import {resources} from '../../assets/loader';
import {artDefinition,artUrl,type ResourceId} from '../../assets/manifest';
export function Art({id,alt='',className='',fallback}:{id:ResourceId;alt?:string;className?:string;fallback?:ReactNode}){
  const [failed,setFailed]=useState<{id:ResourceId;format:'png'|'none'}|null>(null),format=failed?.id===id?failed.format:'webp';
  return format==='none'||resources.isMissing(id)?<>{fallback}</>:<img key={`${id}-${format}`} className={`game-art ${className}`} src={artUrl(id,format)} alt={alt} draggable={false} decoding="async" onError={()=>setFailed({id,format:format==='webp'&&artDefinition(id).pngFallback?'png':'none'})}/>;
}
