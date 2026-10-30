export function Toast({messages}:{messages:{kind:'info'|'reward'|'error';text:string}[]}){
  const unique=[...new Map(messages.map(m=>[m.text,m])).values()].slice(-3);
  return <div className="toast-stack" aria-live="polite">{unique.map(m=><div className={`toast toast-${m.kind}`} key={m.text}>{m.text}</div>)}</div>;
}
