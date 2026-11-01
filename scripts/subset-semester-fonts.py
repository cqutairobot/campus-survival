#!/usr/bin/env python3
"""Audit the full S1+S2 Chinese inventory; add only uncovered glyphs to the
existing licensed Campus Sans faces. Original S1 subsets stay byte-identical.
Uses existing fontTools/Brotli; no new runtime or build dependency.
"""
from pathlib import Path
# fontTools accepts a Brotli-compatible module. Use Node's built-in zlib
# when the optional Python extension is absent; no dependency is installed.
import sys,types,subprocess
try:
 import brotli
except ImportError:
 bridge=types.ModuleType('brotli');bridge.MODE_FONT=2;bridge.MODE_TEXT=1
 def node_brotli(data,decode=False,mode=0):
  code="const fs=require('node:fs'),z=require('node:zlib'),b=fs.readFileSync(0);process.stdout.write("+("z.brotliDecompressSync(b)" if decode else "z.brotliCompressSync(b,{params:{[z.constants.BROTLI_PARAM_MODE]:"+str(mode)+",[z.constants.BROTLI_PARAM_QUALITY]:11}})")+");"
  return subprocess.run(['node','-e',code],input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
 bridge.compress=lambda data,mode=0:node_brotli(data,False,mode)
 bridge.decompress=lambda data:node_brotli(data,True)
 sys.modules['brotli']=bridge
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
import json,hashlib,shutil,re
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'font-src/s2';ACTIVE=SRC/'ledger-v2.json'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def inventory():
 paths=sorted(p for p in (ROOT/'src').rglob('*') if p.suffix in ['.ts','.tsx','.json','.css'])+[ROOT/'index.html']
 text=''.join(p.read_text() for p in paths)
 return sorted({ord(c) for c in text if c.isprintable() and ord(c) not in [0x2726,0x2727,0x279c]})
def han(n):return 0x3400<=n<=0x9fff or 0x3000<=n<=0x303f or 0xff00<=n<=0xffef
def check(preview=None):
 from fontTools.pens.boundsPen import BoundsPen
 ledger=json.loads(ACTIVE.read_text());required=inventory();assert set(required)<=set(ledger['requiredCodepoints']),'Source inventory exceeds declared font ledger';outlined=0;faces=ledger['existingFaces']+ledger['outputs']
 for weight in [400,600]:
  coverage={};fonts={}
  for face in faces:
   if face['weight']!=weight:continue
   font=TTFont(ROOT/face['file']);fonts[face['file']]=font
   for point,glyph in font.getBestCmap().items():coverage[point]=(face['file'],glyph)
  missing=sorted(set(required)-coverage.keys())
  if missing:raise ValueError(f'Glyphs missing at {weight}: '+','.join(hex(c) for c in missing))
  for point in required:
   if not han(point):continue
   file,glyph=coverage[point];assert glyph!='.notdef',(weight,hex(point));glyphs=fonts[file].getGlyphSet();pen=BoundsPen(glyphs);glyphs[glyph].draw(pen);assert pen.bounds is not None,(weight,hex(point),'empty outline');outlined+=1
 result=dict(required=len(required),weights=[400,600],missing=[],outlinedHanGlyphs=outlined,ledger=ACTIVE.relative_to(ROOT).as_posix(),ledgerSha256=sha(ACTIVE))
 if preview:
  from PIL import Image,ImageDraw,ImageFont
  from io import BytesIO
  image=Image.new('RGB',(1160,560),'#f4f4e7');draw=ImageDraw.Draw(image);buffers=[]
  lines=['第一学期22周 · 第二学期24周','点按互动，静止读条；菜单双指捏合缩放','普通护盾 · 继承盾 · 大招冷却与持续','截止前通过 · 每轮每目标一次 · 表现印章','新增字形：'+''.join(chr(c) for c in ledger['newCodepoints'])]
  for row,weight in enumerate([400,600]):
   loaded=[]
   for face in faces:
    if face['weight']!=weight:continue
    font=TTFont(ROOT/face['file']);points=font.getBestCmap();font.flavor=None;buffer=BytesIO();font.save(buffer);buffer.seek(0);buffers.append(buffer);loaded.append((set(points),ImageFont.truetype(buffer,30)))
   draw.text((22,row*280+10),f'Actual deployed WOFF2 outlines / weight {weight}',fill='#234b50')
   for n,line in enumerate(lines):
    x=22;y=row*280+42+n*44
    for char in line:
     font=next((f for points,f in loaded if ord(char) in points),None);assert font is not None,(weight,char,'preview coverage');draw.text((x,y),char,font=font,fill='#234b50');x+=font.getlength(char)
  target=Path(preview);assert not target.exists(),'Refusing to overwrite a glyph preview';target.parent.mkdir(parents=True,exist_ok=True);image.save(target);result['preview']=str(target);result['previewSha256']=sha(target)
 return result
if '--check' in sys.argv:
 preview=sys.argv[sys.argv.index('--preview')+1] if '--preview' in sys.argv else None
 print(json.dumps(check(preview)));sys.exit(0)
# Generating a new version is explicit and append-only. Historical subsets and
# their public/source ledgers are never rewritten by this tool.
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--write',action='store_true');parser.add_argument('--version',required=True);parser.add_argument('--predecessor',required=True);parser.add_argument('--source',required=True);args=parser.parse_args()
assert args.write and args.version=='font-s2-v2','Explicit --write and next font version required'
previous=ROOT/args.predecessor;assert previous.resolve()==(SRC/'ledger.json').resolve(),'Expected original reviewed predecessor';old=json.loads(previous.read_text());source=Path(args.source);assert sha(source)==old['sourceSha256'],'Licensed source differs from reviewed original'
ledger_path=SRC/'ledger-v2.json';public_path=ROOT/'public/licenses/s2-font-ledger-v2.json';outputs_paths=[ROOT/f'public/assets/fonts/v5/campus-semester-{weight}-delta-v2.woff2' for weight in [400,600]]
assert not any(p.exists() for p in [ledger_path,public_path,*outputs_paths]),'Refusing to overwrite an existing font version'
faces=old['existingFaces']+old['outputs'];required=inventory();covered={weight:set().union(*(set(TTFont(ROOT/f['file']).getBestCmap()) for f in faces if f['weight']==weight)) for weight in [400,600]};missing=sorted(set().union(*(set(required)-points for points in covered.values())))
full=TTFont(source);unavailable=sorted(set(required)-set(full.getBestCmap()));assert not unavailable,unavailable
outputs=[];css=[]
for weight,path in zip([400,600],outputs_paths):
 font=instantiateVariableFont(TTFont(source),{'wght':weight},inplace=True);opts=subset.Options();opts.flavor='woff2';opts.desubroutinize=True;task=subset.Subsetter(options=opts);task.populate(unicodes=missing);task.subset(font)
 for record in font['name'].names:
  if record.nameID in [1,3,4,6,16,17]:record.string=f'CampusSemesterDelta-v2-{weight}'.encode(record.getEncoding(),errors='replace')
 font.flavor='woff2';path.parent.mkdir(parents=True,exist_ok=True)
 with path.open('xb') as output:font.save(output)
 points=sorted(TTFont(path).getBestCmap());assert set(missing)<=set(points);outputs.append(dict(file=path.relative_to(ROOT).as_posix(),weight=weight,codepoints=points,sha256=sha(path),bytes=path.stat().st_size))
 ranges=','.join(f'U+{c:X}' for c in missing);css.append(f"@font-face{{font-family:'Campus Sans';font-style:normal;font-weight:{weight};font-display:swap;src:url('/assets/fonts/v5/{path.name}') format('woff2');unicode-range:{ranges}}}")
report={**old,'version':args.version,'internalFamily':'CampusSemesterDelta-v2 (renamed RFN)','predecessor':{'file':args.predecessor,'sha256':sha(previous)},'inventory':'Actual current S1/S2 printable source inventory; historic glyph files retained','requiredCodepoints':required,'requiredCount':len(required),'newCodepoints':missing,'newCount':len(missing),'hanCjkCount':sum(han(n) for n in required),'existingFaces':faces,'outputs':outputs,'missing':[],'modifications':'Fixed 400/600 weights, only glyphs missing from all six historical faces; renamed internal family; append-only font version. Actual cmap and nonempty Han/CJK outlines verified.'}
for path in [ledger_path,public_path]:
 with path.open('x') as output:output.write(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
stylesheet=ROOT/'src/ui/styles/fonts.css';stylesheet.write_text(stylesheet.read_text()+'/* v5 audit delta v2: retained original faces, uncovered glyphs only. */\n'+'\n'.join(css)+'\n')
credits_path=ROOT/'src/assets/s2-font-attributions.json';credits=json.loads(credits_path.read_text());credits.append({**credits[0],'id':'s2-font-delta-v2','title':'Campus Sans audit glyph delta v2','notes':'Append-only supplemental glyphs at 400/600; all historic subsets and ledgers retained. Actual outline audit in ledger-v2.json.','files':[dict(original=report['original'],output=a['file'].removeprefix('public/'),modifications=report['modifications']) for a in outputs]});credits_path.write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(version=args.version,newCharacters=''.join(chr(c) for c in missing),newCount=len(missing),bytes=sum(a['bytes'] for a in outputs),missing=unavailable),ensure_ascii=False))
