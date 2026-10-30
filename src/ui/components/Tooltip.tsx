import type {ReactNode} from 'react';
export function Tooltip({title,children}:{title:string;children:ReactNode}){return <details className="game-tooltip"><summary>{title}</summary><div role="note">{children}</div></details>;}
