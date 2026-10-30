"""Self-hosted OFL fonts, fixed weights, renamed subsets (including RFN handling)."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
import re, shutil
ROOT=Path('/tmp/campus-v4-sources');OUT=Path('public/assets/fonts');OUT.mkdir(parents=True,exist_ok=True)
css=[]
source=''.join(p.read_text() for p in Path('src').rglob('*') if p.suffix in ['.ts','.tsx'])
allchars=set(source)|set(chr(n) for n in range(32,127))|set('＋－→←✦×护盾普通暴击精英首领恢复样板反馈镜头推拉局部停顿制作名单素材许可')
shell=''.join(p.read_text() for p in [Path('src/ui/screens/Menu.tsx'),Path('src/ui/screens/Panels.tsx')])
catalog=Path('src/data/catalog.ts').read_text()
characters=catalog[catalog.index('export const CHARACTERS'):catalog.index('export const TALENTS')]
shellchars=set(shell+characters+'本地存档已就绪已保存在此设备旧存档已迁移至 v3读取失败尝试有效备份发现未来版本存档使用内存模式保留原文临时模式存储不可用已恢复有效备份保存失败可导出存档备份')|set(chr(n) for n in range(32,127))
rest=allchars-shellchars

def build(filename,family,weight,chars,suffix):
    font=TTFont(ROOT/filename)
    if 'fvar' in font:font=instantiateVariableFont(font,{'wght':weight},inplace=True)
    opts=subset.Options();opts.flavor='woff2';opts.desubroutinize=True
    task=subset.Subsetter(options=opts);task.populate(text=''.join(sorted(chars)));task.subset(font)
    for record in font['name'].names:
        if record.nameID in [1,3,4,6,16,17]:
            value=family.replace(' ','')+'-'+str(weight)
            record.string=value.encode(record.getEncoding(),errors='replace')
    font.flavor='woff2';name=family.lower().replace(' ','-')+f'-{weight}-{suffix}.woff2';font.save(OUT/name)
    ranges=','.join('U+'+format(ord(c),'X') for c in sorted(chars))
    css.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};font-display:swap;src:url('/assets/fonts/{name}') format('woff2');unicode-range:{ranges}}}")
    print(name,(OUT/name).stat().st_size)
for w in [400,600]:
    build('NotoSansSC[wght].ttf','Campus Sans',w,shellchars,'shell')
    build('NotoSansSC[wght].ttf','Campus Sans',w,rest,'game')
build('ZCOOLQingKeHuangYou-Regular.ttf','Campus Title',400,set('校园生存这学期活下去灵感来了又是充满希望的新学期'),'title')
build('Rajdhani-SemiBold.ttf','Campus Digits',600,set(chr(n) for n in range(32,127)),'latin')
Path('src/ui/styles/fonts.css').write_text('\n'.join(css)+'\n')
lic=Path('public/licenses');lic.mkdir(parents=True,exist_ok=True)
for p in ROOT.glob('*-OFL.txt'):shutil.copy(p,lic/p.name)
