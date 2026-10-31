import {useEffect,useRef,useState} from 'react';
import {useApp,INITIAL_HUD} from '../state/store';
import {GameEngine} from '../core/engine';
import {migrateV3ToV4} from '../save/v5/profile';
import {Menu,type Panel} from '../ui/screens/Menu';
import {ModalPanel} from '../ui/screens/Panels';
import {GameOverlays} from '../ui/screens/Overlays';
import {HUD} from '../ui/hud/HUD';
import {Art} from '../ui/components/Art';
import {artManifest,type ArtId} from '../assets/manifest';
import {resources} from '../assets/loader';
import {DEFAULT_UI_PARAMETERS,uiFixture,type UiParameters} from './fixtures';
const panels=['characters','talents','codex','settings','controls','achievements','map','daily','credits'];
export function UiFixture(){
 const [params,setParams]=useState<UiParameters>(DEFAULT_UI_PARAMETERS),[generation,setGeneration]=useState(0),[previewEngine,setPreviewEngine]=useState<GameEngine|null>(null),[panel,setPanel]=useState<Panel|null>(null),engine=useRef<GameEngine|null>(null);
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='campus-ui-fixture')return;setParams(event.data.params);if(event.data.replay)setGeneration(n=>n+1);};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 useEffect(()=>{
  const f=uiFixture(params,INITIAL_HUD);useApp.setState({...f,save:migrateV3ToV4(f.save)});engine.current?.dispose();engine.current=new GameEngine(structuredClone(f.save),404);engine.current.setPhase('paused');setPreviewEngine(engine.current);setPanel(panels.includes(params.screen)?params.screen as Panel:null);
  for(const id of Object.keys(artManifest) as ArtId[])resources.forceMissing(id,params.missing);
  document.body.classList.toggle('fixture-missing',params.missing);document.body.classList.toggle('fixture-long-text',params.longText);
  // Deliberately stress real name elements without editing the frozen content catalog.
  const longName='建筑与城市规划学院超长中文学术装备名称测试';
  const observer=new MutationObserver(()=>{if(!params.longText)return;document.querySelectorAll<HTMLElement>('.draft-card h3,.codex-card h3,.character-dossier h3,.reward-card h3').forEach(el=>{if(el.textContent!==longName)el.textContent=longName;});});observer.observe(document.getElementById('root')!,{childList:true,subtree:true});
  return()=>{observer.disconnect();engine.current?.dispose();};
 },[params,generation]);
 const showMenu=()=>{setParams(p=>({...p,screen:'menu'}));setPanel(null);};
 const uiPhase=['playing','draft','chest','reward','contract','evolution','paused','bossIntro','bossDeath','result'].includes(params.screen);
 return <div key={`${params.screen}-${generation}`} className="fixture-root">{uiPhase?<main className={`battle-screen phase-${params.screen}`}><div className="fixture-campus"><Art id="homework" fallback={<span>▤</span>}/></div><HUD session={null} open={setPanel}/><GameOverlays session={null} previewEngine={previewEngine??undefined} open={setPanel} menu={showMenu} restart={()=>setGeneration(n=>n+1)}/></main>:<Menu open={setPanel}/>} {panel&&<ModalPanel panel={panel} close={()=>setPanel(null)} start={()=>setParams(p=>({...p,screen:'playing'}))} startDaily={()=>setParams(p=>({...p,screen:'playing'}))} inGame={false}/>}</div>;
}
