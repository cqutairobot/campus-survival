#!/usr/bin/env python3
"""Import built-in image_gen output with existing Pillow; never generate AI here.
P18 masters remain byte-for-byte; chapter-sized atlases, real alpha, dual format,
independent codex thumbnails/details, and complete per-file provenance.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json, hashlib, sys
ROOT=Path(__file__).resolve().parents[1]; SRC=ROOT/'art-src/s2'; OUT=ROOT/'public/assets/art/v5/s2'
SAMPLE='--samples' in sys.argv
spec=json.loads((SRC/'spec.json').read_text()); jobs=spec['assets']; history={i['key']:i for i in json.loads((SRC/'generation-sources.json').read_text())}
previous={a['key']:a for a in json.loads((SRC/'ledger.json').read_text())['assets']} if (SRC/'ledger.json').exists() else {}
OUT.mkdir(parents=True,exist_ok=True)
manifest={};bindings={};frames={};ledger=[];outputs=[];atlases={};atlas_owners={}
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def normalized(im,size,pad=.08,aspect=1):
 im=im.convert('RGBA');alpha=im.getchannel('A');box=alpha.point(lambda a:255 if a>=8 else 0).getbbox()
 if not box or alpha.getextrema()[0]!=0:raise ValueError('Master must contain actual alpha')
 im=im.crop(box);width=size;height=round(size/aspect);piece=ImageOps.contain(im,(round(width*(1-pad*2)),round(height*(1-pad*2))),Image.Resampling.LANCZOS)
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
normal_keys=['enemy-bike','enemy-reservation','enemy-parceler'];item_keys=['item-drone','item-whiteboard','item-drone-evolved','item-whiteboard-evolved'];landmark_keys=['landmark-infirmary','landmark-joint-table']
def atlas(key,size,bundle):
 if key not in atlases:atlases[key]=Image.new('RGBA',size);atlas_owners[key]=[];asset('s2:'+key,'atlases/'+key.replace('-atlas','').replace('enemy','enemies').replace('item','items').replace('landmark','landmarks'),bundle)
 return atlases[key]
atlas('enemy-atlas',(1024,512),'s2-start');atlas('item-atlas',(1024,256),'s2-start');atlas('landmark-atlas',(512,256),'s2-start')
# Retain exact P18 paths.
for key,path in [('enemy-atlas','enemies'),('item-atlas','items'),('landmark-atlas','landmarks')]:manifest['s2:'+key]['path']='atlases/'+path
slots={}
def tiled(j,im,key,size,bundle,white_flash=False):
 canvas=atlas(key,size,bundle);n=slots.get(key,0);slots[key]=n+1;cols=size[0]//192;x=n%cols*192;y=n//cols*192*(2 if white_flash else 1);piece=im.resize((192,192),Image.Resampling.LANCZOS);canvas.alpha_composite(piece,(x,y));frame=dict(atlas='s2:'+key,frame=[x,y,192,192],kind=j['kind'])
 if white_flash:canvas.alpha_composite(white(piece),(x,y+192));frame['white']=[x,y+192,192,192]
 frames[j['contentIds'][0]]=frame;atlas_owners[key].append(j['key']);return manifest['s2:'+key]['path']
for index,j in enumerate(jobs):
 raw=SRC/'raw'/f"{j['key']}.png"
 if not raw.exists():
  if SAMPLE:continue
  raise FileNotFoundError(raw)
 master=ROOT/j['master'];master.parent.mkdir(parents=True,exist_ok=True)
 if master.exists() and (index<12 or previous.get(j['key'],{}).get('rawSha256')==sha(raw)):im=Image.open(master).convert('RGBA')
 elif j['kind']=='cover':im=ImageOps.fit(Image.open(raw).convert('RGB'),(2048,1152),Image.Resampling.LANCZOS).convert('RGBA');im.save(master,optimize=True)
 else:im=normalized(Image.open(raw),j['masterSize'],aspect=2 if j['kind']=='building' else 1);im.save(master,optimize=True)
 reference=spec['reference'] if index<12 else j['styleReference']
 row=dict(key=j['key'],sourceType='ai',aiGenerated=True,placeholder=False,model=history[j['key']]['model'],tool='image_gen built-in',generatedAt=history[j['key']]['generatedAt'],prompt=j['prompt'],reference=dict(file=reference,sha256=sha(ROOT/reference),role='approved P18 style reference supplied to image_gen' if index>=12 else 'repository style reference, visually inspected and described in prompt'),raw=raw.relative_to(ROOT).as_posix(),rawSha256=sha(raw),master=j['master'],masterSha256=sha(master),masterSize=list(im.size),alphaExtrema=list(im.getchannel('A').getextrema()),anchor=j['anchor'],license='AI-generated; no CC0 claim',modifications='Alpha>=8 bounding crop, Lanczos contain and transparent padding; white flash preserves alpha; WebP/PNG derivation' if j['kind']!='cover' else 'Lanczos cover fit to2048x1152; opaque landscape; runtime1024x576')
 ledger.append(row);paths=[];chapter=j.get('chapter',1)
 if j['kind']=='enemy':
  if j['key'] in normal_keys:paths.append(tiled(j,im,'enemy-atlas',(1024,512),'s2-start',True))
  elif j['masterSize']==512:paths.append(tiled(j,im,f'enemy-chapter-{chapter}-atlas',(1024,768) if chapter==2 else (512,512),f's2-chapter-{chapter}',True))
  else:
   id='s2:'+j['key'];bundle='s2-boss-'+j['contentIds'][0].split(':')[1];px=512 if j['key']=='enemy-expo-final' else 384;piece=im.resize((px,px),Image.Resampling.LANCZOS);save(piece,j['key']);save(white(piece),j['key']+'-white');asset(id,j['key'],bundle);asset(id+'-white',j['key']+'-white',bundle);frames[j['contentIds'][0]]=dict(atlas=id,whiteAtlas=id+'-white',frame=[0,0,px,px],white=[0,0,px,px],kind='enemy');paths += [j['key'],j['key']+'-white']
  save(im.resize((96,96),Image.Resampling.LANCZOS),'thumbs/'+j['key']);asset('s2:thumb-'+j['key'],'thumbs/'+j['key'],'s2-codex');bindings[j['contentIds'][0]]=dict(icon='s2:thumb-'+j['key'],kind='enemy');paths.append('thumbs/'+j['key'])
 elif j['kind']=='item':
  key='item-atlas' if j['key'] in item_keys else f'item-chapter-{chapter}-atlas';paths.append(tiled(j,im,key,(1024,256) if key=='item-atlas' else (1024,768), 's2-start' if key=='item-atlas' else f's2-items-{chapter}'))
  for size in [96,192]:path=f"icons/{j['key']}-{size}";save(im.resize((size,size),Image.Resampling.LANCZOS),path);asset(f"s2:{j['key']}-{size}",path,'s2-codex' if size==96 else 's2-details');paths.append(path)
  bindings[j['contentIds'][0]]=dict(icon=f"s2:{j['key']}-96",detail=f"s2:{j['key']}-192",kind='item')
 elif j['kind']=='building':
  save(im.resize((1024,512),Image.Resampling.LANCZOS),j['key']);asset('s2:'+j['key'],j['key'],'s2-start' if index<12 else f's2-chapter-{chapter}');paths.append(j['key'])
  path='thumbs/'+j['key'];save(im.resize((96,48),Image.Resampling.LANCZOS),path);asset('s2:thumb-'+j['key'],path,'s2-codex');paths.append(path)
  for id in j['contentIds']+(['s2:smartTeaching'] if index<12 else []):bindings[id]=dict(icon='s2:thumb-'+j['key'],detail='s2:'+j['key'],kind='building')
 elif j['kind']=='cover':
  save(im.resize((1024,576),Image.Resampling.LANCZOS),j['key']);asset('s2:semester-cover',j['key'],'s2-cover');bindings['s2:cover']=dict(icon='s2:semester-cover',kind='cover');paths.append(j['key'])
 else:
  key='landmark-atlas' if j['key'] in landmark_keys else f'landmark-chapter-{chapter}-atlas';paths.append(tiled(j,im,key,(512,256),'s2-start' if key=='landmark-atlas' else f's2-chapter-{chapter}'));save(im.resize((96,96),Image.Resampling.LANCZOS),'thumbs/'+j['key']);asset('s2:thumb-'+j['key'],'thumbs/'+j['key'],'s2-codex');bindings[j['contentIds'][0]]=dict(icon='s2:thumb-'+j['key'],kind='landmark');paths.append('thumbs/'+j['key'])
 row['_paths']=paths
for key,im in atlases.items():save(im,manifest['s2:'+key]['path'])
shared_particle=ROOT/'public/assets/art/v4/fx/particles.webp';particles=Image.open(shared_particle).convert('RGBA').copy()
for i,name in enumerate(['spark_04.png','smoke_03.png']):
 p=SRC/'cc0'/name;piece=ImageOps.contain(Image.open(p).convert('RGBA'),(22,22),Image.Resampling.LANCZOS);x=(0 if i==0 else 4)*24;particles.paste((0,0,0,0),(x,0,x+24,24));particles.alpha_composite(piece,(x+(24-piece.width)//2,(24-piece.height)//2));ledger.append(dict(key='particle-'+name,sourceType='cc0',aiGenerated=False,placeholder=False,author='Kenney',source='https://kenney.nl/assets/particle-pack',original='PNG (Transparent)/'+name,sourceFile=p.relative_to(ROOT).as_posix(),sha256=sha(p),license='CC0 1.0',licenseFile='art-src/s2/cc0/Kenney-Particle-Pack-License.txt',licenseSha256=sha(SRC/'cc0/Kenney-Particle-Pack-License.txt'),modifications='Lanczos contain in24px atlas tile; replace only spark/smoke in copied shared atlas, preserving other8 fragments; tint from existing renderer',_paths=['atlases/particles']))
save(particles,'atlases/particles');asset('s2:particle-atlas','atlases/particles','s2-start')
text='// Generated by scripts/build-s2-art.py; no source art is shipped here.\n'
for name,data in [('MANIFEST',manifest),('BINDINGS',bindings),('FRAMES',frames)]:text+='export const S2_ART_'+name+'='+json.dumps(data,ensure_ascii=False,indent=2)+' as const;\n'
(ROOT/'src/semesters/s2/presentation/art-manifest.ts').write_text(text)
for row in ledger:
 paths=row.pop('_paths');row['outputs']=[o for o in outputs if any(o['file']==f'public/assets/art/v5/s2/{path}.{ext}' for path in paths for ext in ['webp','png'])]
report=dict(version='s2-art-v1',sampleOnly=SAMPLE,sharedParticleSource=dict(file=shared_particle.relative_to(ROOT).as_posix(),sha256=sha(shared_particle),modifications='Preserve8 original code-drawn fragments byte-for-byte; replace spark/smoke with two credited CC0 shapes; one shared texture source for all10 materials'),assets=ledger,outputs=outputs,missing=[j['key'] for j in jobs if not (SRC/'raw'/f"{j['key']}.png").exists()])
(SRC/'ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(OUT/'manifest.json').write_text(json.dumps(dict(version='s2-art-v1',assets=manifest,bindings=bindings,frames=frames),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(aiMasters=len([a for a in ledger if a['sourceType']=='ai']),files=len(outputs),bytes=sum(o['bytes'] for o in outputs),missing=report['missing'])))
licenses=ROOT/'public/licenses';licenses.mkdir(exist_ok=True);(licenses/'s2-art-ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(licenses/'s2-kenney-particles.txt').write_text((SRC/'cc0/Kenney-Particle-Pack-License.txt').read_text())
credits=[]
for sourceType in ['ai','cc0']:
 rows=[a for a in ledger if a['sourceType']==sourceType];credits.append(dict(id='s2-ai' if sourceType=='ai' else 's2-kenney-particles',title='第二学期AI美术' if sourceType=='ai' else 'Particle Pack · 第二学期选用2形状',author='image_gen内置（供应方未暴露具体模型ID）' if sourceType=='ai' else 'Kenney',source='image_gen built-in' if sourceType=='ai' else 'https://kenney.nl/assets/particle-pack',license='AI来源，不宣称CC0' if sourceType=='ai' else 'CC0 1.0',licenseUrl='' if sourceType=='ai' else 'https://creativecommons.org/publicdomain/zero/1.0/',notes='完整提示词、模型可见性、日期、参考图和SHA-256见S2账本；派生/白闪/双格式不另计生成张数。' if sourceType=='ai' else '按下载包License.txt记录，只引入spark_04与smoke_03两文件，不导入整包。',files=[dict(original=a.get('master',a.get('original')),output=' / '.join(o['file'].removeprefix('public/') for o in a['outputs']),modifications=a['modifications'],sha256=a.get('masterSha256',a.get('sha256'))) for a in rows]))
(ROOT/'src/assets/s2-attributions.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
