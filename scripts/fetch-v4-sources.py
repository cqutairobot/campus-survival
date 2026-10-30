"""Build-only downloads. Archives stay outside the repository; no source pack ships."""
from pathlib import Path
import concurrent.futures, json, re, time, urllib.request, zipfile

ROOT = Path('/tmp/campus-v4-sources')
ROOT.mkdir(exist_ok=True)

def fetch(url, path):
    if path.exists(): return
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer':'https://kenney.nl/assets/'})
    with urllib.request.urlopen(req, timeout=60) as response:
        path.write_bytes(response.read())

def pack(name):
    page = ROOT / (name + '.html')
    fetch('https://kenney.nl/assets/' + name, page)
    key = re.search("data-download-id='([^']+)'", page.read_text())[1]
    req = urllib.request.Request('https://kenney.nl/download-link/' + key + '?t=' + str(time.time()), headers={'User-Agent':'Mozilla/5.0', 'Referer':'https://kenney.nl/assets/' + name, 'Cache-Control':'no-cache'})
    data = json.load(urllib.request.urlopen(req, timeout=30))
    fetch(data['url'], ROOT / (name + '.zip'))
    print('downloaded', name, flush=True)

def oga(name):
    page = ROOT / (name + '.html')
    fetch('https://opengameart.org/content/' + name, page)
    links = re.findall(r'href=[\"\']([^\"\']+)', page.read_text())
    for url in links:
        if '/sites/default/files/' in url and re.search(r'\.(zip|mp3|wav)$', url) and 'zombie' not in url and 'animal' not in url:
            fetch(url, ROOT / urllib.parse.unquote(url.rsplit('/', 1)[-1]))
    print('downloaded', name, flush=True)

jobs = [(pack, x) for x in ['ui-pack','input-prompts','particle-pack','impact-sounds','rpg-audio','interface-sounds','music-jingles']]
jobs += [(oga, x) for x in ['sound-effects-pack','keyboard-soundpack-1-typing-and-single-keystrokes','scorchers-foley-sounds','paper-textures-seamless','battle-theme-a','battle-theme-b-for-rpg','awake-megawall-10']]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    futures = {pool.submit(fn, name): name for fn, name in jobs}
    for future in concurrent.futures.as_completed(futures):
        try: future.result()
        except Exception as error: print('FAILED', futures[future], str(error), flush=True)

fonts = {'notosanssc': 'NotoSansSC[wght].ttf', 'zcoolqingkehuangyou': 'ZCOOLQingKeHuangYou-Regular.ttf', 'rajdhani': 'Rajdhani-SemiBold.ttf'}
fetch('https://game-icons.net/icons/ffffff/transparent/1x1/delapouite/graduate-cap.svg', ROOT/'graduate-cap.svg')
for name, filename in fonts.items():
    base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/' + name + '/'
    fetch(base + urllib.parse.quote(filename), ROOT / filename)
    fetch(base + 'OFL.txt', ROOT / (name + '-OFL.txt'))
for archive in ROOT.glob('*.zip'):
    target = ROOT / archive.stem
    with zipfile.ZipFile(archive) as z:
        for name in z.namelist():
            if name.endswith('/') or not Path(name).suffix: continue
            dest = target / name
            if dest.parent.is_file(): dest.parent.unlink()
            dest.parent.mkdir(exist_ok=True, parents=True)
            dest.write_bytes(z.read(name))
print('Sources ready', flush=True)
