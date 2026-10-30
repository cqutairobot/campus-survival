import type {ButtonHTMLAttributes} from 'react';
export function Button({variant='secondary',className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'danger'|'icon'}){
  return <button {...props} className={`${variant==='icon'?'icon-button':'button'} ${variant} ${className}`}/>;
}
