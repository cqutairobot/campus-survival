import {useState,type ReactNode} from 'react';
import {artManifest,artUrl,type ArtId} from '../../assets/manifest';
export function Art({id,alt='',className='',fallback}:{id:ArtId;alt?:string;className?:string;fallback?:ReactNode}){
  const [failed,setFailed]=useState<{id:ArtId;format:'png'|'none'}|null>(null),format=failed?.id===id?failed.format:'webp';
  return format==='none'?<>{fallback}</>:<img key={`${id}-${format}`} className={`game-art ${className}`} src={artUrl(id,format)} alt={alt} draggable={false} decoding="async" onError={()=>setFailed({id,format:format==='webp'&&artManifest[id].pngFallback?'png':'none'})}/>;
}
