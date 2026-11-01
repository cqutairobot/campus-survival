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
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/assets/fonts/v5';SRC=ROOT/'font-src/s2'
def inventory():
 paths=sorted(p for p in (ROOT/'src').rglob('*') if p.suffix in ['.ts','.tsx','.json','.css'])+[ROOT/'index.html']
 text=''.join(p.read_text() for p in paths)
 return sorted({ord(c) for c in text if c.isprintable() and ord(c) not in [0x2726,0x2727,0x279c]})
if '--check' in sys.argv:
 ledger=json.loads((SRC/'ledger.json').read_text());required=inventory()
 for weight in [400,600]:
  coverage=set()
  for face in ledger['existingFaces']+ledger['outputs']:
   if face['weight']==weight:coverage.update(TTFont(ROOT/face['file']).getBestCmap())
  missing=sorted(set(required)-coverage)
  if missing:raise ValueError(f'Chinese glyphs missing at{weight}: '+','.join(hex(c) for c in missing))
 print(json.dumps(dict(required=len(required),weights=[400,600],missing=[])));sys.exit(0)
OUT.mkdir(parents=True,exist_ok=True);SRC.mkdir(parents=True,exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
source=Path('/tmp/campus-v4-sources/NotoSansSC[wght].ttf');lic=ROOT/'public/licenses/notosanssc-OFL.txt';shutil.copyfile(lic,SRC/'NotoSansSC-OFL.txt');shutil.copyfile(lic,ROOT/'public/licenses/s2-font-OFL.txt')
required=inventory()
faces=[];old={}
for weight in [400,600]:
 for part in ['shell','game']:
  path=ROOT/f'public/assets/fonts/campus-sans-{weight}-{part}.woff2';font=TTFont(path);points=sorted(font.getBestCmap());faces.append(dict(file=path.relative_to(ROOT).as_posix(),weight=weight,codepoints=points,sha256=sha(path)));old[path.relative_to(ROOT).as_posix()]=sha(path)
existing=set(n for a in faces if a['weight']==400 for n in a['codepoints']);missing=sorted(set(required)-existing)
full=TTFont(source);unavailable=sorted(set(required)-set(full.getBestCmap()));assert not unavailable,unavailable
css=[];outputs=[]
for weight in [400,600]:
 font=instantiateVariableFont(TTFont(source),{'wght':weight},inplace=True);opts=subset.Options();opts.flavor='woff2';opts.desubroutinize=True;task=subset.Subsetter(options=opts);task.populate(unicodes=missing);task.subset(font)
 for record in font['name'].names:
  if record.nameID in [1,3,4,6,16,17]:record.string=f'CampusSemesterDelta-{weight}'.encode(record.getEncoding(),errors='replace')
 font.flavor='woff2';path=OUT/f'campus-semester-{weight}-delta.woff2';font.save(path);points=sorted(TTFont(path).getBestCmap());assert set(missing)<=set(points)
 outputs.append(dict(file=path.relative_to(ROOT).as_posix(),weight=weight,codepoints=points,sha256=sha(path),bytes=path.stat().st_size))
 ranges=','.join(f'U+{c:X}' for c in missing);css.append(f"@font-face{{font-family:'Campus Sans';font-style:normal;font-weight:{weight};font-display:swap;src:url('/assets/fonts/v5/{path.name}') format('woff2');unicode-range:{ranges}}}")
base=(ROOT/'src/ui/styles/fonts.css').read_text().split('/* v5 semester delta:')[0].rstrip();(ROOT/'src/ui/styles/fonts.css').write_text(base+'\n/* v5 semester delta: inventory includes all S1+S2 text; original faces retained. */\n'+'\n'.join(css)+'\n')
report=dict(version='font-s2-v1',family='Campus Sans',internalFamily='CampusSemesterDelta (renamed RFN)',source='https://github.com/google/fonts/tree/main/ofl/notosanssc',original='NotoSansSC[wght].ttf',sourceSha256=sha(source),sourceBytes=source.stat().st_size,license='SIL OFL 1.1',licenseFile='font-src/s2/NotoSansSC-OFL.txt',licenseSha256=sha(SRC/'NotoSansSC-OFL.txt'),inventory='All printable S1+S2 source characters (conservative comment superset); original three decorative star/arrow symbols unsupported by Noto keep system fallback',systemFallbackCodepoints=[0x2726,0x2727,0x279c],hanCjkCount=sum(0x3400<=n<=0x9fff or 0x3000<=n<=0x303f or 0xff00<=n<=0xffef for n in required),requiredCodepoints=required,requiredCount=len(required),newCodepoints=missing,newCount=len(missing),existingFaces=faces,outputs=outputs,missing=[],modifications='Variable font fixed at400/600; subset only glyphs absent from existing faces; internal names renamed; union covers the full S1+S2 inventory without duplicating old glyph downloads')
(SRC/'ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(ROOT/'public/licenses/s2-font-ledger.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(required=len(required),hanCjk=report['hanCjkCount'],new=len(missing),bytes=sum(a['bytes'] for a in outputs),missing=unavailable)))
credits=[dict(id='s2-font-delta',title='第二学期 · Campus Sans补充子集',author='Adobe / Noto Sans SC contributors',source=report['source'],license='SIL OFL 1.1',licenseUrl='https://openfontlicense.org/open-font-license-official-text/',notes='从S1+S2全量中文字符清单生成400/600补充子集，保留原字体和许可；内部名称重命名，缺字校验与SHA-256见字体账本。',files=[dict(original=report['original'],output=a['file'].removeprefix('public/'),modifications=report['modifications']) for a in outputs])]
(ROOT/'src/assets/s2-font-attributions.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
