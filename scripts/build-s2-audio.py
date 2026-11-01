#!/usr/bin/env python3
"""18 used CC0 clips only; the established v4 BS.1770 / true-peak mastering
functions are reused without executing or modifying the S1 audio build.
Sources copied from verified original Kenney packs, never whole-pack imports.
"""
from pathlib import Path
import ast,json,shutil,hashlib,subprocess,concurrent.futures
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'audio-src/s2';OUT=ROOT/'public/assets/audio/v5/s2';TEMP=Path('/tmp/campus-s2-audio-build');RATE=44100
TARGET_LUFS=-23;TRUE_PEAK=-4.5;ENCODED_CEILING=-3
for p in [SRC,OUT,TEMP]:p.mkdir(parents=True,exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
rows=[
('shot-s2-drone','interface-sounds','glitch_001',False,1),('shot-s2-whiteboard','interface-sounds','scratch_001',False,1),('shot-s2-spool','interface-sounds','glitch_002',False,1),('shot-s2-printer','impact-sounds','impactMetal_light_001',False,1),
('fusion-s2-fieldHub','impact-sounds','impactMetal_medium_001',False,1),('fusion-s2-holoReview','interface-sounds','glass_004',False,1),('fusion-s2-digitalTwin','impact-sounds','impactMining_002',False,1),
('warning-s2-line','interface-sounds','error_004',False,1),('warning-s2-reservation','interface-sounds','question_004',False,1),('warning-s2-scan','interface-sounds','error_008',False,1),
('event-s2-deliveryDay','impact-sounds','impactPlate_medium_004',False,1),('event-s2-networkMaintenance','interface-sounds','glitch_004',False,2),('event-s2-jointExhibit','interface-sounds','confirmation_004',False,3),('event-s2-openLab','interface-sounds','maximize_004',False,1),
('contract-s2-project','interface-sounds','confirmation_002',False,1),('contract-s2-amendment','interface-sounds','switch_004',False,2),
('ambience-s2-lab','impact-sounds','impactMetal_light_004',True,2),('ambience-s2-exhibit','interface-sounds','scroll_004',True,3)]
spec=[]
for id,pack,name,loop,chapter in rows:
 cached=Path('/tmp/campus-v4-sources')/(pack+'-extracted');original=cached/'Audio'/(name+'.ogg');dest=SRC/'raw'/pack/(name+'.ogg');dest.parent.mkdir(parents=True,exist_ok=True)
 if not dest.exists():shutil.copyfile(original,dest)
 license=SRC/'licenses'/(pack+'-License.txt');license.parent.mkdir(exist_ok=True)
 if not license.exists():shutil.copyfile(cached/'License.txt',license)
 if 'Creative Commons Zero' not in license.read_text():raise ValueError('Missing original package CC0 license')
 spec.append(dict(id=id,pack=pack,author='Kenney',source='https://kenney.nl/assets/'+pack,original='Audio/'+name+'.ogg',sourceFile=dest.relative_to(ROOT).as_posix(),sourceSha256=sha(dest),license='CC0 1.0',licenseFile=license.relative_to(ROOT).as_posix(),licenseSha256=sha(license),loop=loop,chapter=chapter))
(SRC/'spec.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
# Extract only these exact existing functions; importing the v4 script would
# execute its entire S1 build and is intentionally forbidden here.
tree=ast.parse((ROOT/'scripts/build-audio.py').read_text());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['analyze','encode']]
exec(compile(ast.Module(body=functions,type_ignores=[]),'scripts/build-audio.py (existing mastering functions)','exec'))
jobs=[]
for a in spec:
 path=ROOT/a['sourceFile']
 if a['loop']:
  loop=TEMP/(a['id']+'-designed-loop.wav');subprocess.run(['ffmpeg','-v','error','-y','-stream_loop','-1','-i',str(path),'-t','8','-af','lowpass=f=2200,afade=t=in:d=0.06,afade=t=out:st=7.94:d=0.06','-ac','1','-ar',str(RATE),str(loop)],check=True);path=loop
 jobs.append((a['id'],path,'ambience' if a['loop'] else False))
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:measurements=list(pool.map(encode,jobs))
assets=[]
for a,m in zip(spec,measurements):
 a={**a,'modifications':'Existing v4 BS.1770 mastering: -23 LUFS, -4.5 dBTP pre-encode / -3 dBTP delivered, mono44.1kHz, Ogg96k / MP3112k; '+('8-second low-pass rhythmic design loop from the credited clip,60ms loop-edge fades; not a field recording' if a['loop'] else 'trim<=0.8s,2ms onset fade,>=120ms block padding; very short clips periodically extended for metering only'),'outputs':[]}
 for ext in ['ogg','mp3']:
  file=OUT/(a['id']+'.'+ext);data=m['outputs'][ext]
  assert abs(data['integratedLufs']-TARGET_LUFS)<=.65,(a['id'],ext,data)
  assert data['truePeakDbtp']<=ENCODED_CEILING,(a['id'],ext,data)
  a['outputs'].append(dict(file=file.relative_to(ROOT).as_posix(),sha256=sha(file),**data))
 assets.append(a)
report=dict(version='s2-audio-v1',logicalClips=18,files=36,targetLufs=TARGET_LUFS,ceilingDbtp=ENCODED_CEILING,analysis='Same v4 BS.1770 gated integrated loudness; short clips periodically extended only for metering; encoded outputs measured independently',assets=assets,measurements=measurements)
(SRC/'ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(ROOT/'docs/v5-audio-loudness.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(ROOT/'public/licenses/s2-audio-ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
for p in (SRC/'licenses').iterdir():shutil.copyfile(p,ROOT/'public/licenses'/('s2-'+p.name))
manifest={a['id']:dict(path='assets/audio/v5/s2/'+a['id'],loop=a['loop'],chapter=a['chapter']) for a in spec}
(ROOT/'src/semesters/s2/presentation/audio-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
credits=[]
for pack in dict.fromkeys(a['pack'] for a in assets):
 clips=[a for a in assets if a['pack']==pack];credits.append(dict(id='s2-audio-'+pack,title='第二学期 · '+pack,author='Kenney',source='https://kenney.nl/assets/'+pack,license='CC0 1.0',licenseUrl='https://creativecommons.org/publicdomain/zero/1.0/',notes='仅实际使用的源片段；保留包内许可。双编码/离线归一化与SHA-256见第二学期音频账本。环境为设计循环，不冒称校园实地录音。',files=[dict(original=a['original'],output=' / '.join(o['file'].removeprefix('public/') for o in a['outputs']),modifications=a['modifications']) for a in clips]))
(ROOT/'src/assets/s2-audio-attributions.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(clips=18,files=36,bytes=sum(o['bytes'] for a in assets for o in a['outputs']),maxLufsError=max(abs(o['integratedLufs']+23) for a in assets for o in a['outputs']),maxTruePeak=max(o['truePeakDbtp'] for a in assets for o in a['outputs']))))
