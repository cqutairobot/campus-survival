"""P1 offline CC0 Foley layers and whole completed songs; no generated music/stems.
Run from repository root with ffmpeg. Downloaded source packs stay in /tmp.
"""
from pathlib import Path
import subprocess,array,wave,json,concurrent.futures,urllib.request
ROOT=Path('/tmp/campus-v4-sources');OUT=Path('public/assets/audio/v4');OUT.mkdir(parents=True,exist_ok=True)
TEMP=Path('/tmp/campus-v4-audio');TEMP.mkdir(exist_ok=True)
RATE=44100

def src(pack,name):return ROOT/(pack+'-extracted')/name
ow=lambda name:src('Owlish Media Sound Effects',name)
impact=lambda name:src('impact-sounds','Audio/'+name+'.ogg')
interface=lambda name:src('interface-sounds','Audio/'+name+'.ogg')
rpg=lambda name:src('rpg-audio','Audio/'+name+'.ogg')
jingle=lambda n:src('music-jingles',f'Audio/Pizzicato jingles/jingles_PIZZI{n:02}.ogg')
key=lambda n:src('unicae_games_keyboard_soundpack_1_0',f'Single Keys/keypress-{n:03}.wav')
inputs={
 'paper':[[key(1),ow('Paper/crumples1.wav'),ROOT/'paper_rustling.wav'],[key(2),ow('Paper/crumples2.wav'),ow('Paper/pageturn1.wav')],[key(3),ow('Paper/pageturn2.wav'),ROOT/'paper_rustling.wav'],[key(4),ow('Paper/paper-sketchbook-page-flips-1.wav'),ow('Paper/crumples1.wav')]],
 'key':[[key(n),key(n+4),ow('Technology/mouse-clicks-scrolls.wav')] for n in range(1,5)],
 'metal':[[key(n),ROOT/'shaking_cup_short.wav',impact('impactMetal_medium_00'+str(n))] for n in range(1,5)],
 'glass':[[key(n),ROOT/'stiring_cup_short.wav',impact('impactGlass_medium_00'+str(n))] for n in range(1,5)],
 'brick':[[key(n),ow('Impacts/hit.wav'),impact('impactMining_00'+str(n))] for n in range(1,5)],
 'liquid':[[key(n),ow('Water/spray-bottle.wav'),ROOT/'stiring_cup_long.wav'] for n in range(1,5)],
 'energy':[[key(n),ow('Technology/plugpull.wav'),interface('glitch_00'+str(n))] for n in range(1,5)],
}
cache={}
def pcm(path):
 if path in cache:return cache[path]
 data=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-af','silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.001','-f','f32le','-ac','1','-ar',str(RATE),'pipe:1'])
 values=array.array('f');values.frombytes(data);peak=max((abs(v) for v in values),default=1) or 1
 values=array.array('f',(v*.7/peak for v in values));cache[path]=values;return values

def clip_layers(name,paths,variant,mode='hit'):
 heavy=mode in ['death','climax'];length=.68 if mode=='climax' else .48 if heavy else .18 if mode=='shot' else .28
 mix=[0.]*round(RATE*length)
 durations=[.02,.08 if mode=='shot' else .13,.48 if mode=='climax' else .3 if heavy else .09 if mode=='shot' else .18]
 # Offline onset/body/tail, so each ordinary hit consumes exactly one real voice.
 for path,offset,duration,gain in zip(paths,[0,.008,.04],durations,[.36,.70 if heavy else .58,.3]):
  samples=pcm(path);start=min(max(0,len(samples)-round(duration*RATE)),variant*round(.012*RATE))
  for i in range(min(round(duration*RATE),len(samples)-start)):
   dest=i+round(offset*RATE)
   if dest>=len(mix):break
   envelope=min(1,i/30,max(0,(duration*RATE-i)/120))
   mix[dest]+=samples[start+i]*gain*envelope
 peak=max(abs(v) for v in mix) or 1;scale=min(1,.83/peak)
 path=TEMP/(name+'.wav')
 with wave.open(str(path),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(array.array('h',(round(v*scale*32767) for v in mix)).tobytes())
 return path

records=[];jobs=[]
def record_mix(name,paths,variant=0,mode='hit',note=''):
 jobs.append((name,clip_layers(name,paths,variant,mode),False))
 records.append({'output':name,'inputs':[str(p.relative_to(ROOT)) for p in paths],'modification':f'{mode}: onset/body/tail mixed offline, normalized, mono 44.1kHz, Ogg 96kbps / MP3 112kbps. '+note,'recording':'Physical Foley/keyboard recordings form the onset and body; Kenney design/impact sounds are supplemental. Energy sounds are recorded objects plus designed electronic tails.'})
for material,variants in inputs.items():
 for i,paths in enumerate(variants):record_mix(f'hit-{material}-{i}',paths,i)
 for mode in ['death','shot']:
  for i,paths in enumerate(variants[:2]):record_mix(f'{mode}-{material}-{i}',paths,i,mode)

single={
 'ui-hover':src('ui-pack','Sounds/tap-a.ogg'),'ui-press':interface('click_001'),'ui-confirm':interface('confirmation_001'),'ui-cancel':interface('minimize_001'),'ui-tab':interface('click_003'),'ui-disabled':interface('error_002'),
 'ui-reveal':jingle(0),'ui-rarity-common':interface('confirmation_001'),'ui-rarity-rare':jingle(0),'ui-rarity-epic':jingle(6),'ui-rarity-legendary':jingle(9),'ui-chest-latch':rpg('metalLatch'),'ui-chest-open':rpg('bookOpen'),'ui-talent-upgrade':jingle(2),'ui-achievement':jingle(10),
 'critical':impact('impactPunch_heavy_001'),'hurt':impact('impactPunch_heavy_003'),'pickup':interface('tick_002'),'level':jingle(6),'boss':impact('impactMetal_heavy_002'),'evolution':jingle(9),'chest':rpg('bookOpen'),
 'charged':jingle(2),'frenzy':jingle(3),'combo':interface('confirmation_003'),'clear':jingle(7),'block':rpg('metalClick'),'event-end':interface('minimize_003'),
}
for name,path in single.items():
 jobs.append((name,path,False));records.append({'output':name,'inputs':[str(path.relative_to(ROOT))],'modification':'trimmed to 0.8s maximum, mono 44.1kHz, Ogg 96kbps / MP3 112kbps','recording':'CC0 designed UI/impact/jingle; not described as a field recording.'})
for name,material in {'sword':'metal','hub':'energy','binder':'metal','sky':'glass','icefire':'liquid','demolition':'brick'}.items():record_mix('fusion-'+name,inputs[material][0],0,'climax','Fusion-specific material mix.')
for name,material in {'submission':'paper','lastMinute':'glass','parallel':'energy','conference':'energy','barrier':'brick','overload':'glass'}.items():record_mix('ultimate-'+name,inputs[material][1],1,'climax','Character ultimate material mix.')
for name,paths in {
 'portal':[key(2),ow('Technology/plugpull2.wav'),interface('glass_002')],
 'advisor':[key(1),ow('Paper/pageturn1.wav'),rpg('metalLatch')],
 'blackout':[key(3),ow('Technology/plugpull.wav'),interface('glitch_003')],
 'examRage':[key(4),ow('Impacts/hit.wav'),impact('impactMetal_heavy_002')],
 'sports':[key(2),ow('Footsteps/running-shoes-1.wav'),jingle(4)],
 'rainstorm':[key(1),ow('Water/spray-bottle.wav'),ROOT/'stiring_cup_long.wav'],
}.items():record_mix('event-'+name,paths,0,'climax','Existing campus event transition; no rule changes.')
record_mix('shield-break',inputs['glass'][1],1,'death')
rain=ow('Water/tap-water-2.wav');jobs.append(('rain-ambience',rain,'ambience'))
records.append({'output':'rain-ambience','inputs':[str(rain.relative_to(ROOT))],'modification':'8-second recorded water excerpt, low-pass filtered with 60ms loop-edge fades, mono 44.1kHz Ogg/MP3; stylized rain ambience','recording':'Recorded water Foley, not an outdoor rain field recording.'})

music={
 'menu':('song17.mp3','Happy Lullaby (song17)','https://lpc.opengameart.org/content/happy-lullaby-song17','https://lpc.opengameart.org/sites/default/files/song17.mp3'),
 'normal':('battleThemeB.mp3','Battle Theme B for RPG','https://opengameart.org/content/battle-theme-b-for-rpg',''),
 'elite':('awake10_megaWall.mp3','Awake! (MegaWall-10)','https://opengameart.org/content/awake-megawall-10',''),
 'boss':('battleThemeA.mp3','Battle Theme A','https://opengameart.org/node/20592',''),
 'result':('Victory1_1.mp3','Victory Theme for RPG','https://opengameart.org/content/victory-theme-for-rpg','https://opengameart.org/sites/default/files/Victory1_1.mp3'),
}
metadata={}
for name,(filename,title,url,download) in music.items():
 path=ROOT/filename
 if not path.exists() and download:path.write_bytes(urllib.request.urlopen(download,timeout=60).read())
 jobs.append(('music-'+name,path,True))
 # Decoded frame length excludes original MP3 encoder priming/end padding.
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-f','s16le','-ac','2','-ar','44100','pipe:1'])
 metadata[name]={'loopStartMs':0,'loopLengthMs':len(raw)/4/44100*1000,'original':filename,'title':title,'source':url}
 records.append({'output':'music-'+name,'inputs':[filename],'title':title,'source':url,'author':'cynicmusic / The Cynic Project / Alex Smith','license':'CC0 1.0','licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/','modification':'Whole completed track, loudness normalized to -20 LUFS, stereo 44.1kHz, 128kbps Ogg / 128kbps MP3, 60ms loop-edge fades; no stems or original composition.'})

def encode(job):
 name,path,kind=job;is_music=kind is True
 for ext,codec,bitrate in [('ogg','libvorbis','128k' if is_music else '96k'),('mp3','libmp3lame','128k' if is_music else '112k')]:
  args=['ffmpeg','-v','error','-y','-i',str(path)]
  if kind=='ambience':args+=['-t','8','-ac','1','-ar',str(RATE),'-af','lowpass=f=3400,afade=t=in:d=0.06,afade=t=out:st=7.94:d=0.06,volume=0.65']
  elif not is_music:args+=['-t','0.8','-ac','1','-ar',str(RATE),'-af','afade=t=in:d=0.002,afade=t=out:st=0.75:d=0.05,volume=0.8']
  else:
   duration=metadata[name.removeprefix('music-')]['loopLengthMs']/1000
   args+=['-ac','2','-ar',str(RATE),'-af',f'loudnorm=I=-20:TP=-2:LRA=9,afade=t=in:d=0.06,afade=t=out:st={max(0,duration-.06)}:d=0.06']
  subprocess.run(args+['-c:a',codec,'-b:a',bitrate,str(OUT/(name+'.'+ext))],check=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(encode,jobs))
expected={name+'.'+ext for name,_,_ in jobs for ext in ['ogg','mp3']}
for path in OUT.iterdir():
 if path.suffix in ['.ogg','.mp3'] and path.name not in expected:path.unlink()
Path('src/assets/audio-loops.json').write_text(json.dumps(metadata,indent=2,ensure_ascii=False)+'\n')
Path('docs/v4-audio-build.json').write_text(json.dumps(records,indent=2,ensure_ascii=False)+'\n')
print('Audio:',len(jobs),'clips in two codecs;',sum(p.stat().st_size for p in OUT.iterdir()),'bytes')
