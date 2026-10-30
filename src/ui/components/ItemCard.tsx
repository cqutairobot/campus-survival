import type {ButtonHTMLAttributes,ReactNode} from 'react';
import type {Rarity} from '../../types';
import {RarityFrame} from './RarityFrame';
export function ItemCard({rarity,children,className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{rarity:Rarity;children:ReactNode}){
  return <RarityFrame rarity={rarity}><button {...props} className={`draft-card rarity-${rarity} ${className}`}>{children}</button></RarityFrame>;
}
