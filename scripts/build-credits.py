"""Offline, reproducible notices for every deployed asset and all 137 AI originals."""
from pathlib import Path
import json, shutil
ROOT=Path('/tmp/campus-v4-sources'); PUBLIC=Path('public/licenses'); PUBLIC.mkdir(exist_ok=True)
CC0='https://creativecommons.org/publicdomain/zero/1.0/'
BY='https://creativecommons.org/licenses/by/3.0/'
OFL='https://openfontlicense.org/open-font-license-official-text/'
packs={
 'ui-pack':('Kenney','https://kenney.nl/assets/ui-pack','UI Pack'),
 'input-prompts':('Kenney','https://kenney.nl/assets/input-prompts','Input Prompts'),
 'particle-pack':('Kenney','https://kenney.nl/assets/particle-pack','Particle Pack'),
 'impact-sounds':('Kenney','https://kenney.nl/assets/impact-sounds','Impact Sounds'),
 'rpg-audio':('Kenney','https://kenney.nl/assets/rpg-audio','RPG Audio'),
 'interface-sounds':('Kenney','https://kenney.nl/assets/interface-sounds','Interface Sounds'),
 'music-jingles':('Kenney','https://kenney.nl/assets/music-jingles','Music Jingles'),
 'Owlish Media Sound Effects':('OwlishMedia','https://opengameart.org/content/sound-effects-pack','Sound Effects Pack'),
 'unicae_games_keyboard_soundpack_1_0':('unicaegames','https://opengameart.org/content/keyboard-soundpack-1-typing-and-single-keystrokes','Keyboard Soundpack #1'),
 'scorchers':('scorcher24','https://opengameart.org/content/scorchers-foley-sounds','Scorchers Foley Sounds'),
}
entries=[];grouped={name:[] for name in packs}
for record in json.loads(Path('docs/v4-audio-build.json').read_text()):
 outputs=[f"assets/audio/v4/{record['output']}.{ext}" for ext in ['ogg','mp3']]
 if record['output'].startswith('music-'):
  entries.append({'id':record['output'],'title':record['title'],'author':record['author'],'source':record['source'],'license':record['license'],'licenseUrl':record['licenseUrl'],'notes':'CC0 成品整曲；保留整曲结构，不制作原创分轨。','files':[{'original':record['inputs'][0],'output':' / '.join(outputs),'modifications':record['modification']}]})
 else:
  for original in dict.fromkeys(record['inputs']):
   prefix=original.split('-extracted/')[0];group=prefix if prefix in packs else 'scorchers'
   grouped[group].append({'original':original,'output':' / '.join(outputs),'modifications':record['modification'],'recording':record.get('recording','')})
# The exact two CC0 raster fragments and five vector input prompts used by the build.
grouped['particle-pack']=[{'original':'PNG (Transparent)/spark_01.png, smoke_01.png','output':'assets/art/v4/fx/particles.webp','modifications':'Lanczos resized; combined with original code-drawn fragments in a 256×24 atlas'}]
grouped['input-prompts']=[{'original':f'Keyboard & Mouse/Vector/{name}.svg','output':f'assets/art/v4/ui/input-{name}.svg','modifications':'unmodified; scaled by CSS'} for name in ['keyboard_w','keyboard_a','keyboard_s','keyboard_d','keyboard_space']]
for name,(author,url,title) in packs.items():
 if not grouped[name]:continue
 entries.append({'id':name,'title':title,'author':author,'source':url,'license':'CC0 1.0','licenseUrl':CC0,'notes':'物理录音与设计音按逐文件处理记录区分；不将整个 Kenney 包宣称为实录。' if name not in ['input-prompts','particle-pack'] else '仅分发实际使用的衍生素材。','files':grouped[name]})
 original=ROOT/name/'License.txt'
 if original.exists():shutil.copy(original,PUBLIC/(name.replace(' ','-')+'.txt'))
entries.append({'id':'graduate-cap','title':'Graduate cap','author':'Delapouite','source':'https://game-icons.net/1x1/delapouite/graduate-cap.html','license':'CC BY 3.0','licenseUrl':BY,'notes':'菜单徽标中的学位帽图标。','files':[{'original':'icons/ffffff/transparent/1x1/delapouite/graduate-cap.svg','output':'assets/art/v4/ui/graduate-cap.svg','modifications':'recolored champagne gold; combined with original badge frame'}]})
for name,family in [('notosanssc','Noto Sans SC'),('zcoolqingkehuangyou','ZCOOL QingKe HuangYou'),('rajdhani','Rajdhani')]:
 license_path=ROOT/(name+'-OFL.txt');local=PUBLIC/(name+'-OFL.txt')
 if license_path.exists():shutil.copy(license_path,local)
 author=local.read_text().split('\n\n')[0]
 prefix={'notosanssc':'campus-sans','zcoolqingkehuangyou':'campus-title','rajdhani':'campus-digits'}[name]
 entries.append({'id':name,'title':family,'author':author,'source':f'https://github.com/google/fonts/tree/main/ofl/{name}','license':'SIL OFL 1.1','licenseUrl':OFL,'notes':'自托管、按本项目字符子集化。','files':[{'original':family,'output':str(p.relative_to('public')),'modifications':'fixed weight, character subset, WOFF2; internal names renamed Campus Sans/Title/Digits'} for p in sorted(Path('public/assets/fonts').glob(prefix+'*.woff2'))]})
provenance=json.loads(Path('docs/v4-ai-sources.json').read_text());art_build=json.loads(Path('docs/v4-art-build.json').read_text())
ai=[]
for record in provenance:
 metadata=record['metadata']
 info={'tool':metadata.get('tool','未提供'),'date':metadata.get('date','未提供'),'prompt':metadata.get('prompt','未提供'),'reference':metadata.get('reference','未提供'),'originalSource':metadata.get('source','未提供')} if metadata else {'tool':'未提供','date':'未提供','prompt':'未提供','reference':'未提供','originalSource':'未提供'}
 outputs=[b for b in art_build if b['source']==record['file']]
 ai.append({'original':record['file'],'output':' / '.join(b['file'] for b in outputs),'modifications':'；'.join(dict.fromkeys(b['modifications'] for b in outputs)),'author':'用户提供 / '+info['tool'],'license':'用户提供素材；元数据未提供独立许可证','sha256':record['sha256'],'approvedVersion':record['approvedVersion'],'generation':info})
entries.append({'id':'user-ai','title':'用户提供的 AI 美术 · v4 P1 全量 137 张','author':'用户提供；131 张记录为 Grok Bot GenerateImage，6 张 P0 原图未提供生成信息','source':'art-src/ai/metadata.json','license':'用户提供素材；独立许可未提供','licenseUrl':'','notes':'如实保存原始元数据，未推断 CC0、著作权归属、生成工具或批准版本。131 张有工具/日期/完整提示词，6 张 P0 原图缺这些信息；每张源图以 SHA-256 固定版本。原提示词中关于背景的描述原样保存，运行时只做裁切缩放、描边和压缩。','files':ai})
text=json.dumps(entries,ensure_ascii=False,indent=2)+'\n'
Path('src/assets/attributions.json').write_text(text);(PUBLIC/'attributions.json').write_text(text)
(PUBLIC/'ai-art-metadata.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
(PUBLIC/'USER-PROVIDED-AI-ART.txt').write_text('用户提供 AI 美术使用记录\n\n137 张源图由用户提供并授权接入本项目。metadata.json 未提供独立开源许可证；本项目不将其标为 CC0，也不推断生成工具或批准版本。逐图生成信息、完整提示词、源文件哈希、运行时衍生文件见 ai-art-metadata.json 和 attributions.json。131 张有生成信息，6 张 P0 原图如实标为未提供。\n')
lines=['# 制作名单与素材许可','','v4 P2 未新增素材来源。全部音频重新归一到 −23 LUFS 目标，双编码实测真峰值不高于 −3 dBTP；中文字体子集随最终文案更新。逐文件加工记录与原许可继续保留。','','由 `python3 scripts/build-credits.py` 离线生成。设置内制作名单、`src/assets/attributions.json` 与 `public/licenses/attributions.json` 同源。只分发实际使用的文件；源音频包、源字体和 PNG 美术原件不进入构建产物。','',f'AI 美术共 {len(provenance)} 张；逐图 SHA-256、原始提示词和生成元数据同时发布于 `public/licenses/ai-art-metadata.json`。旧 Leschge 纸纹已被用户的 AI 纸纹替换，不再列为运行时素材。','']
for entry in entries:
 label=f"[{entry['license']}]({entry['licenseUrl']})" if entry['licenseUrl'] else entry['license']
 lines+=['## '+entry['title'],'',f"作者：{entry['author']}。许可：{label}。来源：{entry['source']}。",'',entry['notes'],'']
 if entry['id']=='user-ai':
  for f in entry['files']:
   g=f['generation'];lines+=['### '+f['original'],'',f"署名：{f['author']}。许可：{f['license']}。",'',f"运行时文件：`{f['output']}`",'',f"处理：{f['modifications']}。",'',f"生成工具：{g['tool']}；生成日期：{g['date']}；参考：{g['reference']}；源文件：`{g['originalSource']}`。",'',f"批准版本：{f['approvedVersion']}。SHA-256：`{f['sha256']}`。",'','完整原始提示词：','',g['prompt'],'']
 else:
  lines+=['| 原文件 | 项目文件 | 修改 |','|---|---|---|']
  for f in entry['files']:lines.append(f"| `{f['original']}` | `{f['output']}` | {f['modifications']} {f.get('recording','')} |")
  lines.append('')
Path('docs/credits.md').write_text('\n'.join(lines)+'\n')
print('Attributions:',len(entries),'groups;',len(ai),'AI originals;',sum(len(e['files']) for e in entries),'file records')
