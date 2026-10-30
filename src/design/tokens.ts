/** CSS variables and Pixi colors share this source. No gameplay values belong here. */
export const tokens = {
  bg: {canvas:'#101725'},
  surface: {base:'#182338',raised:'#243149',glass:'rgba(20,30,48,.88)'},
  text: {primary:'#F3EFE4',secondary:'#BCC7D8',muted:'#8F9DB4'},
  accent: {jade:'#66D9BF',gold:'#E4C17A'},
  danger:'#F27883',info:'#87BFFF',world:{ivory:'#ECE8D8'},
  border:{subtle:'rgba(185,204,232,.18)',highlight:'rgba(255,241,207,.55)'},
  rarity:['#AAB5C5','#78AEFF','#C39AFF','#F3CB77'],
  damage:{normal:'#FFF2D8',critical:'#FFD16F',shield:'#91D5FF',dot:'#D2BEF5',hurt:'#FF8991',heal:'#83E4BE'},
  duration:{hover:120,press:70,rebound:150,enter:280,exit:180},
  space:[4,8,12,16,24,32,48],
} as const;
export const pixiColor=(color:string)=>Number.parseInt(color.replace('#',''),16);
export function installTokens(){
  const walk=(value:unknown,path:string[]=[])=>{
    if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))walk(item,[...path,key]);
    else document.documentElement.style.setProperty(`--${path.join('-')}`,String(value));
  };
  walk(tokens);
}
