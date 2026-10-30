import {useEffect,useRef,type ReactNode} from 'react';
export function Panel({children,className=''}:{children:ReactNode;className?:string}){return <section className={`surface-panel ${className}`}>{children}</section>;}
export function ModalShell({title,close,children}:{title:string;close:()=>void;children:ReactNode}){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;root.current?.focus();return()=>previous?.focus();},[]);
  return <div className="modal-backdrop" onPointerDown={e=>{if(e.target===e.currentTarget)close();}}><div className="modal-panel" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={root} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();close();}if(e.key==='Tab'){const nodes=Array.from(root.current!.querySelectorAll<HTMLElement>('button:not(:disabled),input,[href],select'));if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}><header className="panel-header"><h2>{title}</h2><button className="icon-button" aria-label="关闭面板" onClick={close}>×</button></header><div className="panel-content">{children}</div></div></div>;
}
