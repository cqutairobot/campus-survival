import type {CSSProperties,ReactNode} from 'react';
import type {Rarity} from '../../types';
import {tokens} from '../../design/tokens';
export function RarityFrame({rarity,children}:{rarity:Rarity;children:ReactNode}){
  return <div className={`rarity-frame rarity-${rarity}`} style={{'--rarity':tokens.rarity[rarity]} as CSSProperties}><span className="rarity-ornament" aria-hidden="true">{['◇','◇◇','✦','✦ ✧ ✦'][rarity]}</span>{children}</div>;
}
