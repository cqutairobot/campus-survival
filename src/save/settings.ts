import type {Settings} from '../types';
export const DEFAULT_SETTINGS:Settings={settingsVersion:4,master:.65,music:.35,sfx:.7,uiSfx:.6,muted:false,quality:'high',shake:.8,flash:.8,motion:true,damageNumbers:true,afterimages:true,haptics:true,quickChest:true,nickname:'校园研究生',hitStop:1,zoomEffects:true,distortion:true,dynamicMusic:true,musicDucking:true,audioPreset:'auto'};
/** Pure, idempotent, missing-only defaults. Explicit false and 0 survive all migrations. */
export function normalizeSettings(value:unknown):Settings{
  const input=value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{},out={...DEFAULT_SETTINGS};
  for(const key of ['master','music','sfx','uiSfx','shake','flash','hitStop'] as const){
    const v=input[key]??DEFAULT_SETTINGS[key];
    if(typeof v==='number'&&Number.isFinite(v))out[key]=Math.max(0,Math.min(1,v));
  }
  for(const key of ['muted','motion','damageNumbers','afterimages','haptics','quickChest','zoomEffects','distortion','dynamicMusic','musicDucking'] as const){
    const v=input[key]??DEFAULT_SETTINGS[key];if(typeof v==='boolean')out[key]=v;
  }
  if(['auto','high','medium','low'].includes(String(input.quality)))out.quality=input.quality as Settings['quality'];
  if(['auto','full','phone'].includes(String(input.audioPreset)))out.audioPreset=input.audioPreset as Settings['audioPreset'];
  if(typeof input.nickname==='string')out.nickname=input.nickname.trim().slice(0,20)||DEFAULT_SETTINGS.nickname;
  return out;
}
