"""Build every user-supplied v4 image. No generated art or source mutation.
Run with python3 from repo root (Pillow required). Large UI art stays separate.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFilter
import hashlib
import json
import shutil

SRC = Path('art-src/ai')
OUT = Path('public/assets/art/v4')
SOURCES = Path('/tmp/campus-v4-sources')
OUT.mkdir(parents=True, exist_ok=True)
metadata = json.loads((SRC / 'metadata.json').read_text())
build = []
outputs = {}


def save(image, name, source=None, png=False, lossless=False, quality=86, modification='Lanczos resize; WebP encoding'):
    path = OUT / (name + '.webp')
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, 'WEBP', quality=quality, method=6, lossless=lossless, exact=True)
    written = [path]
    if png:
        fallback = OUT / (name + '.png')
        image.save(fallback, optimize=True)
        written.append(fallback)
    for output in written:
        build.append({'file': str(output.relative_to('public')), 'bytes': output.stat().st_size,
                      'size': list(image.size), 'source': str(source) if source else 'code / credited CC0 particle atlas',
                      'modifications': modification})
        if source:
            outputs.setdefault(str(source.relative_to(SRC)), []).append(str(output.relative_to('public')))


def trimmed(image):
    image = image.convert('RGBA')
    bounds = image.getchannel('A').getbbox()
    return image.crop(bounds) if bounds else image


def tile(image, size=192, padding=8, outline=False):
    """Keep full silhouette and center it; padding prevents edge bleed."""
    image = ImageOps.contain(trimmed(image), (size-padding*2, size-padding*2), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size))
    canvas.alpha_composite(image, ((size-image.width)//2, (size-image.height)//2))
    if outline:
        # 1px at the intended 64px display size; expands alpha, preserves body.
        mask = canvas.getchannel('A').filter(ImageFilter.MaxFilter(5))
        stroke = Image.new('RGBA', canvas.size, '#f3efe4')
        stroke.putalpha(mask.point(lambda a: round(a*.82)))
        stroke.alpha_composite(canvas)
        return stroke
    return canvas


characters = ['balanced', 'analysis', 'coder', 'english', 'architect', 'experiment']
enemies = sorted(p.stem for p in (SRC / 'enemies').glob('*.png'))
bosses = {'proposal', 'defense', 'finals', 'inspector', 'teamlead'}
icon_groups = ['weapons', 'passives', 'fusions', 'relics', 'pickups', 'ultimates']

for character in characters:
    for kind in ['portrait', 'avatar', 'sprite']:
        source = SRC / 'characters' / character / (kind + '.png')
        original = Image.open(source)
        image = (ImageOps.contain(trimmed(original), (432, 704), Image.Resampling.LANCZOS)
                 if kind == 'portrait' else tile(original, 128 if kind == 'sprite' else 192,
                                                padding=6 if kind == 'sprite' else 8, outline=kind == 'sprite'))
        save(image, f'characters/{character}/{kind}', source, png=kind != 'portrait',
             modification='Alpha bounds trimmed; silhouette preserved; Lanczos resize; ' +
             ('2px ivory outline at 128px (1px at 64px); WebP + PNG fallback' if kind == 'sprite'
              else 'WebP' + (' + PNG fallback' if kind == 'avatar' else '')))

for name in enemies:
    source = SRC / 'enemies' / (name + '.png')
    image = tile(Image.open(source), 256 if name in bosses else 128, padding=6)
    save(image, 'enemies/' + name, source, png=True)
    white = Image.new('RGBA', image.size, 'white')
    white.putalpha(image.getchannel('A'))
    save(white, 'enemies/' + name + '-white', source, png=True, lossless=True,
         modification='Same alpha silhouette as base sprite; white RGB for hit flash; lossless WebP + PNG fallback')

for group in icon_groups:
    for source in sorted((SRC / 'icons' / group).glob('*.png')):
        save(tile(Image.open(source)), f'icons/{group}/{source.stem}', source, png=True)

for folder, size in [('buildings', 512), ('landmarks', 384), ('props', 256)]:
    for source in sorted((SRC / folder).glob('*.png')):
        image = ImageOps.contain(trimmed(Image.open(source)), (size, size), Image.Resampling.LANCZOS)
        save(image, f'{folder}/{source.stem}', source, quality=88)

for source in sorted((SRC / 'textures').glob('*.png')):
    save(Image.open(source).convert('RGB').resize((256, 256), Image.Resampling.LANCZOS),
         'textures/' + source.stem, source, quality=88)

for source in sorted((SRC / 'ui').glob('*.png')):
    image = Image.open(source)
    if source.stem == 'menu-campus':
        image = ImageOps.contain(image.convert('RGB'), (1600, 900), Image.Resampling.LANCZOS)
    elif source.stem == 'menu-campus-portrait':
        # Supplied portrait composition, never cropped from landscape.
        image = image.convert('RGB').resize((720, 1280), Image.Resampling.LANCZOS)
    elif source.stem.startswith('result-'):
        image = image.convert('RGB').resize((1280, 720), Image.Resampling.LANCZOS)
    else:
        image = ImageOps.contain(trimmed(image), (384, 384), Image.Resampling.LANCZOS)
    save(image, 'ui/' + source.stem, source, quality=88)

# Battle projectiles reuse corresponding supplied item art.
for name, weapon, size in [('paper-blade', 'knife', 48), ('book', 'orbit', 64),
                           ('robot', 'bot', 64), ('slides', 'ppt', 64), ('shuttle', 'shuttle', 48)]:
    source = SRC / 'icons' / 'weapons' / (weapon + '.png')
    save(tile(Image.open(source), size, padding=3), 'fx/' + name, source,
         modification='Reused weapon icon, alpha trimmed and resized for battle projectile; WebP')

# Existing 24px fragment layout stays stable for TextureCatalog.
atlas = Image.new('RGBA', (256, 24))
draw = ImageDraw.Draw(atlas)
for n in range(10):
    x = n*24
    if n in [0, 4]:
        filename = 'spark_01.png' if n == 0 else 'smoke_01.png'
        original = SOURCES / 'particle-pack' / 'PNG (Transparent)' / filename
        if original.exists():
            piece = ImageOps.contain(Image.open(original).convert('RGBA'), (22, 22), Image.Resampling.LANCZOS)
            atlas.alpha_composite(piece, (x+(24-piece.width)//2, (24-piece.height)//2))
            continue
    if n in [1, 5, 6, 9]:
        draw.polygon([(x+5, 3), (x+20, 6), (x+17, 22), (x+2, 18)], fill='white')
    elif n == 3:
        draw.line([(x+10, 4), (x+5, 12), (x+10, 20)], fill='white', width=3)
        draw.line([(x+15, 4), (x+20, 12), (x+15, 20)], fill='white', width=3)
    else:
        draw.rounded_rectangle((x+4, 4, x+20, 21), radius=2, fill='white', outline='#afbacb', width=1)
save(atlas, 'fx/particles', lossless=True)

for name in ['keyboard_w', 'keyboard_a', 'keyboard_s', 'keyboard_d', 'keyboard_space']:
    original = SOURCES / 'input-prompts' / 'Keyboard & Mouse' / 'Vector' / (name+'.svg')
    if original.exists():
        shutil.copy(original, OUT / 'ui' / ('input-'+name+'.svg'))
cap = SOURCES / 'graduate-cap.svg'
if cap.exists():
    (OUT / 'ui/graduate-cap.svg').write_text(cap.read_text().replace('#ffffff', '#e4c17a').replace('#fff', '#e4c17a'))

# Clean obsolete P0 bitmap alternatives; preserve SVG resources.
expected = {record['file'] for record in build}
for path in OUT.rglob('*'):
    if path.is_file() and path.suffix in ['.png', '.webp'] and str(path.relative_to('public')) not in expected:
        path.unlink()

Path('docs/v4-art-build.json').write_text(json.dumps(build, ensure_ascii=False, indent=2)+'\n')
provenance = []
for source in sorted(SRC.rglob('*.png')):
    relative = str(source.relative_to(SRC))
    record = {'file': str(source), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
              'outputs': outputs[relative], 'metadata': metadata.get(relative),
              'metadataStatus': 'provided' if relative in metadata else 'not supplied with approved P0 asset',
              'approvedVersion': metadata.get(relative, {}).get('approvedVersion', '未提供；以本记录 SHA-256 固定源文件版本')}
    provenance.append(record)
Path('docs/v4-ai-sources.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2)+'\n')
print('Art:', len(provenance), 'source PNGs;', len(build), 'runtime bitmap files;',
      sum(record['bytes'] for record in build), 'bytes')
