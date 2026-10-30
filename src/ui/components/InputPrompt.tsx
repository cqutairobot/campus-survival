import {useState} from 'react';
import {assetUrl} from '../../assets/manifest';
export function InputPrompt({name,label,className=''}:{name:string;label:string;className?:string}){
 const [failed,setFailed]=useState(false);
 return <span className={`input-prompt ${className}`} aria-label={label}>{failed?<span>{label}</span>:<img src={assetUrl(`assets/art/v4/ui/input-keyboard_${name}.svg`)} alt={label} onError={()=>setFailed(true)}/>}</span>;
}
