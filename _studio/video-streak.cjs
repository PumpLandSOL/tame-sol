// TAME Arena launch video (1920x1080, 30fps, 16s). node _studio/video-arena.cjs
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process'), { open, sleep } = require('./cdp.cjs');
const B = path.join(__dirname, '..', 'brand'), K = path.join(__dirname, 'kit'), FPS = 30, DUR = 10, url = (f) => 'file:///' + f.split(path.sep).join('/');
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Onest:wght@600;800;900&family=Press+Start+2P&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{width:1920px;height:1080px;overflow:hidden;position:relative;color:#ece6ff;font-family:Onest;background:radial-gradient(1200px 600px at 50% -10%,rgba(169,112,255,.22),transparent 60%),linear-gradient(rgba(236,230,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(236,230,255,.04) 1px,transparent 1px),#07050c;background-size:auto,60px 60px,60px 60px,auto}
.s{position:absolute;left:0;right:0;text-align:center;opacity:0}.h{font:900 140px/1 Onest;letter-spacing:-.03em}.p{color:#a970ff}.mu{color:#a99bc9}.k{font:400 22px 'Press Start 2P';letter-spacing:.16em;color:#a970ff}
#duel{position:absolute;left:240px;right:240px;top:300px;background:#110c1c;border:4px solid rgba(169,112,255,.55);border-radius:36px;padding:50px 60px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;opacity:0;box-shadow:0 0 60px rgba(169,112,255,.2)}
.side{text-align:center;padding:24px;border-radius:26px}.av{width:170px;height:170px;margin:0 auto;border-radius:50%;border:6px solid;display:grid;place-items:center;font-size:96px;background:#1a1229}.nm{font:900 46px Onest;margin-top:18px}.roi{font:700 70px 'JetBrains Mono';margin-top:8px}
.vs{text-align:center}.vs .px{font:400 52px 'Press Start 2P';color:#a970ff}.vs .t{font:700 34px 'JetBrains Mono';color:#a99bc9;margin-top:22px}
.win{background:rgba(245,196,106,.1);box-shadow:inset 0 0 0 4px rgba(245,196,106,.6)}
.foot{position:absolute;left:0;right:0;bottom:70px;text-align:center;font:400 24px 'JetBrains Mono';letter-spacing:.16em;color:#a99bc9;opacity:0}.foot b{color:#a970ff;font-weight:400}
</style></head><body>
<div class="s" id="a" style="top:300px"><div class="k">NEW ON TAME</div><div class="h" style="margin-top:36px">🔥 Daily Streaks</div></div>
<div class="s" id="b" style="top:140px"><div class="h" style="font-size:90px">Show up every day.</div></div>
<div id="duel" style="grid-template-columns:repeat(5,1fr);gap:18px;padding:40px">${[1,2,3,5,10].map((d,i)=>'<div class="side" id="d'+i+'" style="opacity:.2"><div style="font:900 64px Onest">🔥 '+d+'</div><div class="roi" style="font-size:40px;color:#3ee0a0">+$'+(d*100).toLocaleString()+'</div><div class="mono" style="color:#a99bc9;font-size:20px;margin-top:6px">day '+d+'</div></div>').join('')}</div>
<div class="s" id="c" style="top:820px"><div style="font:900 50px Onest">Your pet's bag grows <span style="color:#f5c46a">up to +$1,000 a day</span>.</div></div>
<div class="s" id="z" style="top:330px"><div class="h">Care daily. <span class="p">Get paid.</span></div><div class="k" style="margin-top:50px">TAMEONSOL.COM/APP</div></div>
<div class="foot" id="ft">tameonsol.com · @TameOnSOL · <b>$TAME</b></div>
<script>const $=(i)=>document.getElementById(i),cl=(v)=>Math.max(0,Math.min(1,v)),win=(t,a,b,f=.4)=>cl(Math.min((t-a)/f,(b-t)/f));
const show=(id,t,a,b)=>{const o=win(t,a,b);$(id).style.opacity=o;$(id).style.transform='translateY('+((1-o)*24)+'px)'};
const ra=(x)=>2.4*Math.sin(x*1.3)+x*0.42+Math.sin(x*5.1)*.35, rb=(x)=>-.8*Math.sin(x*1.1+1)+x*0.08+Math.sin(x*4.3)*.4;
const f=(v)=>(v>=0?'+':'')+v.toFixed(2)+'%';
window.__seek=(t)=>{show('a',t,.1,2);show('b',t,2.1,7.4);$('duel').style.opacity=win(t,2.2,7.4);for(let i=0;i<5;i++){const o=cl((t-2.8-i*.7)/.3);$('d'+i).style.opacity=.2+.8*o;$('d'+i).classList.toggle('win',i===4&&t>5.8)}show('c',t,5.9,7.4);show('z',t,7.6,99);$('ft').style.opacity=cl((t-8)/.4)}</script></body></html>`;
(async () => { const FR = path.join(os.tmpdir(), 'tame-arena'); fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const fp = path.join(K, 'tame-streak-10s.html'); fs.writeFileSync(fp, html); const c = await open('about:blank', 1920, 1080, 8500 + Math.floor(Math.random() * 90));
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }); await c.send('Page.navigate', { url: url(fp) }); await sleep(2500); await c.ev('document.fonts.ready.then(()=>1)');
  for (let i = 0; i < DUR * FPS; i++) { await c.ev('__seek(' + (i / FPS).toFixed(4) + ')'); await c.shot(path.join(FR, 'f_' + String(i).padStart(4, '0') + '.jpg'), 'jpeg'); }
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(FR, 'f_%04d.jpg'), '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', path.join(B, 'tame-streak-10s.mp4')]);
  fs.rmSync(FR, { recursive: true, force: true }); console.log('OK tame-streak-10s'); c.close(); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
