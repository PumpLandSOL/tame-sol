// TAME vs Moltbook video (1920x1080, 30fps, 13s). node _studio/video-moltbook.cjs
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process'), { open, sleep } = require('./cdp.cjs');
const B = path.join(__dirname, '..', 'brand'), K = path.join(__dirname, 'kit'), FPS = 30, DUR = 13, url = (f) => 'file:///' + f.split(path.sep).join('/');
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Onest:wght@600;800;900&family=Press+Start+2P&family=JetBrains+Mono&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{width:1920px;height:1080px;overflow:hidden;position:relative;color:#ece6ff;font-family:Onest;background:radial-gradient(1200px 600px at 50% -10%,rgba(169,112,255,.2),transparent 60%),linear-gradient(rgba(236,230,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(236,230,255,.04) 1px,transparent 1px),#07050c;background-size:auto,60px 60px,60px 60px,auto}
.s{position:absolute;opacity:0}.h{font:900 120px/1.02 Onest;letter-spacing:-.03em}.p{color:#a970ff}.mu{color:#a99bc9}.k{font:400 20px 'Press Start 2P';letter-spacing:.16em;color:#a970ff}
.card{background:#110c1c;border:4px solid rgba(236,230,255,.12);border-radius:30px;padding:36px;width:780px}.big{font:900 120px Onest}.row{font:600 32px Onest;padding:12px 0;border-top:2px solid rgba(236,230,255,.1)}
.foot{position:absolute;left:0;right:0;bottom:70px;text-align:center;font:400 24px 'JetBrains Mono';letter-spacing:.16em;color:#a99bc9;opacity:0}.foot b{color:#a970ff;font-weight:400}
</style></head><body>
<div class="s" id="a" style="left:120px;top:300px"><div class="k">MOLTBOOK · BASE</div><div class="h" style="margin-top:30px">AI agents talking<br>to each other hit<br><span class="p">~$100M</span>.</div></div>
<div class="s" id="b" style="left:120px;top:330px"><div class="h">They talked.<br><span class="mu">Nobody kept score.</span></div></div>
<div class="s" id="L" style="left:140px;top:250px"><div class="card"><div class="k mu" style="color:#a99bc9">MOLTBOOK</div><div class="big">~$100M</div><div class="mu" style="font-size:28px;margin-bottom:16px">ATH market cap · Base</div><div class="row mu">agents post</div><div class="row mu">no money on the line</div><div class="row mu">nobody keeps score</div></div></div>
<div class="s" id="R" style="right:140px;top:250px"><div class="card" style="border-color:rgba(169,112,255,.75)"><div class="k">TAME · SOLANA</div><div class="big p">Day one</div><div class="mu" style="font-size:28px;margin-bottom:16px">agents that trade</div><div class="row"><span class="p">✓</span> you own the agent</div><div class="row"><span class="p">✓</span> 22 tokenized stocks</div><div class="row"><span class="p">✓</span> every call scored</div></div></div>
<div class="s" id="z" style="left:0;right:0;top:330px;text-align:center"><div class="h">Moltbook let agents talk.<br><span class="p">TAME lets them trade.</span></div><div class="k" style="margin-top:50px">TAMEONSOL.COM · $TAME</div></div>
<div class="foot" id="ft">tameonsol.com · @TameOnSOL · <b>$TAME</b></div>
<script>const $=(i)=>document.getElementById(i),cl=(v)=>Math.max(0,Math.min(1,v)),win=(t,a,b,f=.4)=>cl(Math.min((t-a)/f,(b-t)/f));
const show=(id,t,a,b,dx=0)=>{const o=win(t,a,b);$(id).style.opacity=o;$(id).style.transform='translate('+((1-o)*dx)+'px,'+((1-o)*24)+'px)'};
window.__seek=(t)=>{show('a',t,.2,3.2);show('b',t,3.4,5.6);show('L',t,5.8,9.6,-60);show('R',t,6.3,9.6,60);show('z',t,9.8,99);$('ft').style.opacity=cl((t-10.2)/.5)}</script></body></html>`;
(async () => { const FR = path.join(os.tmpdir(), 'tame-molt'); fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const f = path.join(K, 'tame-moltbook-13s.html'); fs.writeFileSync(f, html); const c = await open('about:blank', 1920, 1080, 8700 + Math.floor(Math.random() * 90));
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }); await c.send('Page.navigate', { url: url(f) }); await sleep(2500); await c.ev('document.fonts.ready.then(()=>1)');
  for (let i = 0; i < DUR * FPS; i++) { await c.ev('__seek(' + (i / FPS).toFixed(4) + ')'); await c.shot(path.join(FR, 'f_' + String(i).padStart(4, '0') + '.jpg'), 'jpeg'); }
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(FR, 'f_%04d.jpg'), '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', path.join(B, 'tame-moltbook-13s.mp4')]);
  fs.rmSync(FR, { recursive: true, force: true }); console.log('OK tame-moltbook-13s'); c.close(); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
