/** Screen-space art placement only. The source collision rectangle is never mutated. */
export function buildingPlacement(rect:{x:number;y:number;w:number;h:number},image:{width:number;height:number}){
  const width=rect.w,height=width*image.height/image.width;
  return {x:rect.x,y:rect.y+rect.h-height,width,height,base:{x:rect.x,y:rect.y,w:rect.w,h:rect.h}};
}
export const enemyArtSize=(radius:number)=>radius*2.8;
export const fitArtScale=(texture:{width:number;height:number},size:number)=>size/Math.max(1,texture.width,texture.height);
