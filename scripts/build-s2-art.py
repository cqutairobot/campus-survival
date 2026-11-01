#!/usr/bin/env python3
"""P18: existing Pillow only. AI sources are imported, never generated here.
Canonical alpha crop/anchor, runtime atlases, WebP/PNG fallback and provenance.
Run --samples for the required 3-asset style gate; normal run requires all masters.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json, hashlib, sys
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'art-src/s2'; OUT=ROOT/'public/assets/art/v5/s2'
SAMPLE='--samples' in sys.argv
spec=json.loads((SRC/'spec.json').read_text()); jobs=spec['assets']; history={i['key']:i for i in json.loads((SRC/'generation-sources.json').read_text())}
OUT.mkdir(parents=True,exist_ok=True)
manifest={}; bindings={}; frames={}; ledger=[]; outputs=[]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def normalized(im,size,pad=.08,aspect=1):
 im=im.convert('RGBA'); alpha=im.getchannel('A'); box=alpha.point(lambda a:255 if a>=8 else 0).getbbox()
 if not box or alpha.getextrema()[0]!=0:raise ValueError('Master must contain actual alpha')
 im=im.crop(box); width=size;height=round(size/aspect);piece=ImageOps.contain(im,(round(width*(1-pad*2)),round(height*(1-pad*2))),Image.Resampling.LANCZOS)
 canvas=Image.new('RGBA',(width,height));canvas.alpha_composite(piece,((width-piece.width)//2,(height-piece.height)//2));return canvas
def save(im,path):
 for ext in ['webp','png']:
  p=OUT/(path+'.'+ext);p.parent.mkdir(parents=True,exist_ok=True)
  if ext=='webp':im.save(p,'WEBP',quality=90,method=6,exact=True,lossless=path=='atlases/particles')
  else:im.save(p,optimize=True)
  outputs.append(dict(file=p.relative_to(ROOT).as_posix(),bytes=p.stat().st_size,sha256=sha(p),size=list(im.size)))
def asset(id,path,bundle):manifest[id]=dict(path=path,root='assets/art/v5/s2',bundle=bundle,pngFallback=True,placeholder=False)
def white(im):
 out=Image.new('RGBA',im.size,'white');out.putalpha(im.getchannel('A'));return out
normal=Image.new('RGBA',(1024,512));items=Image.new('RGBA',(1024,256));landmarks=Image.new('RGBA',(512,256))
normal_keys=['enemy-bike','enemy-reservation','enemy-parceler'];item_keys=['item-drone','item-whiteboard','item-drone-evolved','item-whiteboard-evolved'];landmark_keys=['landmark-infirmary','landmark-joint-table']
for j in jobs:
 raw=SRC/'raw'/f"{j['key']}.png"
 if not raw.exists():
  if SAMPLE:continue
  raise FileNotFoundError(raw)
 im=normalized(Image.open(raw),j['masterSize'],aspect=2 if j['kind']=='building' else 1);master=ROOT/j['master'];master.parent.mkdir(parents=True,exist_ok=True);im.save(master,optimize=True)
 row=dict(key=j['key'],sourceType='ai',aiGenerated=True,placeholder=False,model=history[j['key']]['model'],tool='image_gen built-in',generatedAt=history[j['key']]['generatedAt'],prompt=j['prompt'],reference=dict(file=spec['reference'],sha256=sha(ROOT/spec['reference']),role='repository style reference, visually inspected and described in prompt'),raw=raw.relative_to(ROOT).as_posix(),rawSha256=sha(raw),master=j['master'],masterSha256=sha(master),masterSize=list(im.size),alphaExtrema=list(im.getchannel('A').getextrema()),anchor=j['anchor'],license='AI-generated; no CC0 claim',modifications='Alpha>=8 bounding crop, Lanczos contain and transparent padding; white flash preserves alpha; WebP/PNG derivation')
 ledger.append(row)
 if j['kind']=='enemy':
  if j['key'] in normal_keys:
   x=normal_keys.index(j['key'])*192;piece=im.resize((192,192),Image.Resampling.LANCZOS);normal.alpha_composite(piece,(x,0));normal.alpha_composite(white(piece),(x,192));frames[j['contentIds'][0]]=dict(atlas='s2:enemy-atlas',frame=[x,0,192,192],white=[x,192,192,192],kind='enemy')
  else:
   id='s2:'+j['key'];bundle='s2-boss-'+('dispatcher' if j['key']=='enemy-dispatcher' else 'proposalBoard');piece=im.resize((384,384),Image.Resampling.LANCZOS);save(piece,j['key']);save(white(piece),j['key']+'-white');asset(id,j['key'],bundle);asset(id+'-white',j['key']+'-white',bundle);frames[j['contentIds'][0]]=dict(atlas=id,whiteAtlas=id+'-white',frame=[0,0,384,384],white=[0,0,384,384],kind='enemy')
  save(im.resize((96,96),Image.Resampling.LANCZOS),'thumbs/'+j['key']);asset('s2:thumb-'+j['key'],'thumbs/'+j['key'],'s2-codex');bindings[j['contentIds'][0]]=dict(icon='s2:thumb-'+j['key'],kind='enemy')
 elif j['kind']=='item':
  x=item_keys.index(j['key'])*192;items.alpha_composite(im.resize((192,192),Image.Resampling.LANCZOS),(x,0));frames[j['contentIds'][0]]=dict(atlas='s2:item-atlas',frame=[x,0,192,192],kind='item')
  for size in [96,192]:save(im.resize((size,size),Image.Resampling.LANCZOS),f"icons/{j['key']}-{size}");asset(f"s2:{j['key']}-{size}",f"icons/{j['key']}-{size}",'s2-items')
  bindings[j['contentIds'][0]]=dict(icon=f"s2:{j['key']}-96",detail=f"s2:{j['key']}-192",kind='item')
 elif j['kind']=='building':
  save(im.resize((1024,512),Image.Resampling.LANCZOS),j['key']);asset('s2:'+j['key'],j['key'],'s2-start')
  for id in j['contentIds']+['s2:smartTeaching']:bindings[id]=dict(icon='s2:'+j['key'],kind='building')
 else:
  x=landmark_keys.index(j['key'])*192;landmarks.alpha_composite(im.resize((192,192),Image.Resampling.LANCZOS),(x,0));frames[j['contentIds'][0]]=dict(atlas='s2:landmark-atlas',frame=[x,0,192,192],kind='landmark');save(im.resize((96,96),Image.Resampling.LANCZOS),'thumbs/'+j['key']);asset('s2:thumb-'+j['key'],'thumbs/'+j['key'],'s2-landmarks');bindings[j['contentIds'][0]]=dict(icon='s2:thumb-'+j['key'],kind='landmark')
for im,path,id,bundle in [(normal,'atlases/enemies','s2:enemy-atlas','s2-start'),(items,'atlases/items','s2:item-atlas','s2-start'),(landmarks,'atlases/landmarks','s2:landmark-atlas','s2-start')]:save(im,path);asset(id,path,bundle)
shared_particle=ROOT/'public/assets/art/v4/fx/particles.webp'
particles=Image.open(shared_particle).convert('RGBA').copy()
for i,name in enumerate(['spark_04.png','smoke_03.png']):
 p=SRC/'cc0'/name;piece=ImageOps.contain(Image.open(p).convert('RGBA'),(22,22),Image.Resampling.LANCZOS);x=(0 if i==0 else 4)*24;particles.paste((0,0,0,0),(x,0,x+24,24));particles.alpha_composite(piece,(x+(24-piece.width)//2,(24-piece.height)//2));ledger.append(dict(key='particle-'+name,sourceType='cc0',aiGenerated=False,placeholder=False,author='Kenney',source='https://kenney.nl/assets/particle-pack',original='PNG (Transparent)/'+name,sourceFile=p.relative_to(ROOT).as_posix(),sha256=sha(p),license='CC0 1.0',licenseFile='art-src/s2/cc0/Kenney-Particle-Pack-License.txt',licenseSha256=sha(SRC/'cc0/Kenney-Particle-Pack-License.txt'),modifications='Lanczos contain in24px atlas tile; replace only spark/smoke in copied shared atlas, preserving other8 fragments; tint from existing renderer'))
save(particles,'atlases/particles');asset('s2:particle-atlas','atlases/particles','s2-start')
text='// Generated by scripts/build-s2-art.py; no source art is shipped here.\n'
text+='export const S2_ART_MANIFEST='+json.dumps(manifest,ensure_ascii=False,indent=2)+' as const;\n'
text+='export const S2_ART_BINDINGS='+json.dumps(bindings,ensure_ascii=False,indent=2)+' as const;\n'
text+='export const S2_ART_FRAMES='+json.dumps(frames,ensure_ascii=False,indent=2)+' as const;\n'
(ROOT/'src/semesters/s2/presentation/art-manifest.ts').write_text(text)
for row in ledger:
 key=row['key'];paths=[]
 if row['sourceType']=='cc0':paths=['atlases/particles']
 elif key in normal_keys:paths=['atlases/enemies','thumbs/'+key]
 elif key in item_keys:paths=['atlases/items',f'icons/{key}-96',f'icons/{key}-192']
 elif key in landmark_keys:paths=['atlases/landmarks','thumbs/'+key]
 else:paths=[key,key+'-white','thumbs/'+key]
 row['outputs']=[o for o in outputs if any(o['file']==f'public/assets/art/v5/s2/{path}.{ext}' for path in paths for ext in ['webp','png'])]
report=dict(version='s2-art-v1',sampleOnly=SAMPLE,sharedParticleSource=dict(file=shared_particle.relative_to(ROOT).as_posix(),sha256=sha(shared_particle),modifications='Preserve8 original code-drawn fragments byte-for-byte; replace spark/smoke with two credited CC0 shapes; one shared texture source for all10 materials'),assets=ledger,outputs=outputs,missing=[j['key'] for j in jobs if not (SRC/'raw'/f"{j['key']}.png").exists()])
(SRC/'ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(ROOT/'public/assets/art/v5/s2/manifest.json').write_text(json.dumps(dict(version='s2-art-v1',assets=manifest,bindings=bindings,frames=frames),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(aiMasters=len([a for a in ledger if a['sourceType']=='ai']),files=len(outputs),bytes=sum(o['bytes'] for o in outputs),missing=report['missing'])))

licenses=ROOT/'public/licenses';licenses.mkdir(exist_ok=True)
(licenses/'s2-art-ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(licenses/'s2-kenney-particles.txt').write_text((SRC/'cc0/Kenney-Particle-Pack-License.txt').read_text())
credits=[]
for sourceType in ['ai','cc0']:
 rows=[a for a in ledger if a['sourceType']==sourceType]
 credits.append(dict(id='s2-ai' if sourceType=='ai' else 's2-kenney-particles',title='第二学期首章AI美术' if sourceType=='ai' else 'Particle Pack · 第二学期选用2形状',author='image_gen内置（供应方未暴露具体模型ID）' if sourceType=='ai' else 'Kenney',source='image_gen built-in' if sourceType=='ai' else 'https://kenney.nl/assets/particle-pack',license='AI来源，不宣称CC0' if sourceType=='ai' else 'CC0 1.0',licenseUrl='' if sourceType=='ai' else 'https://creativecommons.org/publicdomain/zero/1.0/',notes='完整提示词、模型可见性、日期、参考图和SHA-256见S2账本；派生/白闪/双格式不另计生成张数。' if sourceType=='ai' else '按下载包License.txt记录，只引入spark_04与smoke_03两文件，不导入整包。',files=[dict(original=a.get('master',a.get('original')),output=' / '.join(o['file'].removeprefix('public/') for o in a['outputs']),modifications=a['modifications'],sha256=a.get('masterSha256',a.get('sha256'))) for a in rows]))
(ROOT/'src/assets/s2-attributions.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
