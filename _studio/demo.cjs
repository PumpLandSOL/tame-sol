// TAME on Solana app demo: real app, fresh local node, live stock prices.
// landing → app → connect Phantom → hatch a pet → feed / pet / train → whisper an order → profile → leaderboard.
// node _studio/demo.cjs → brand/tame-app-demo.mp4
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawn, execFileSync } = require('child_process'), { open, sleep } = require('./cdp.cjs');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'brand', 'tame-app-demo.mp4'), FR = path.join(os.tmpdir(), 'tame-demo-frames'), W = 1366, H = 820, PORT = 8281;
const WALLET = 'Ta7mEpet5o1anaXk9QzW2vB3nR8sLd6fHyJcU4gPqTe1';
const CAP = `(() => { if (document.getElementById('__cap')) return; const d=document.createElement('div');d.id='__cap';d.style.cssText='position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:99999;padding:13px 24px;background:#110c1c;border:2px solid rgba(169,112,255,.85);box-shadow:0 0 30px rgba(169,112,255,.3);border-radius:999px;font:700 15px Onest,sans-serif;color:#ece6ff;white-space:nowrap;opacity:0;transition:opacity .3s';document.body.append(d); })();`;
(async () => {
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const srv = spawn(process.execPath, [path.join(ROOT, 'server', 'index.js')], { stdio: 'ignore', env: { ...process.env, PORT: String(PORT), DATA_PATH: path.join(os.tmpdir(), 'tame-demo-' + Date.now() + '.json') } });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://127.0.0.1:${PORT}/api/config`)).ok) break; } catch {} await sleep(400); }
  await sleep(8000);
  const c = await open('about:blank', W, H, 8900 + Math.floor(Math.random() * 90)); const frames = []; let rec = false;
  c.on('Page.screencastFrame', (p) => { if (rec) { const f = path.join(FR, 'f' + String(frames.length).padStart(5, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(p.data, 'base64')); frames.push({ f, t: p.metadata.timestamp * 1000 }); } c.send('Page.screencastFrameAck', { sessionId: p.sessionId }).catch(() => {}); });
  await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.phantom={solana:{isPhantom:true,publicKey:{toString:()=>'${WALLET}'},connect:async()=>({publicKey:{toString:()=>'${WALLET}'}}),disconnect:async()=>{}}};` });
  const go = async (p) => { await c.send('Page.navigate', { url: `http://127.0.0.1:${PORT}${p}` }); await sleep(2800); await c.ev('document.fonts.ready.then(()=>1)'); await c.ev(CAP); };
  const cap = (s) => c.ev(`(()=>{const d=document.getElementById('__cap');d.innerHTML=${JSON.stringify(s)};d.style.opacity=1})()`);
  const post = (u, d) => c.ev(`fetch(${JSON.stringify(u)},{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(${JSON.stringify(d)})}).then(r=>r.json())`);
  const scroll = (y) => c.ev(`window.scrollTo({top:${y},behavior:'smooth'})`);
  await go('/');
  await c.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: W, maxHeight: H, everyNthFrame: 1 }); rec = true;
  await cap('TAME · AI pets that trade tokenized stocks, on Solana'); await sleep(3500);
  await cap('live stats and the 22-stock tape, straight from the running app'); await c.ev(`document.getElementById('tape').scrollIntoView({block:'center',behavior:'smooth'})`); await sleep(4000);
  await go('/app'); await cap('1 · connect Phantom'); await c.ev(`document.getElementById('connectBtn').click()`); await sleep(2500);
  await cap('2 · hatch a pet · name it, pick a species'); const h = await post('/api/hatch', { wallet: WALLET, name: 'Nyx', species: 'cat' }); const id = h.pet.id; await sleep(3500);
  await cap('3 · feed it, pet it, train it · care changes how it trades');
  for (const a of ['feed', 'pet', 'train']) { await post('/api/care', { wallet: WALLET, petId: id, action: a }); await sleep(2200); }
  await cap('4 · whisper an order · it obeys only as often as it respects you'); const w = await post('/api/whisper', { wallet: WALLET, petId: id, side: 'long', sym: 'NVDA', text: 'long $NVDA' }); await sleep(4500);
  await cap('5 · every post is public · every call scored against the tape in 30 min'); await scroll(300); await sleep(4500);
  await cap('6 · the pet profile: stats, genome, trades, hit rate'); await c.ev(`openProfile && openProfile(${JSON.stringify(id)})`); await sleep(5000);
  await c.ev(`(document.querySelector('.modal')||{}).classList && document.querySelector('.modal').classList.remove('on')`); await go('/app');
  await cap('7 · leaderboards: best ROI, best callers, owned vs shelter'); await c.ev(`document.querySelector('[data-v="rich"]').click()`); await sleep(4500);
  await go('/'); await cap('tameonsol.com · <b style="color:#a970ff">$TAME</b>'); await sleep(3500);
  rec = false; await c.send('Page.stopScreencast'); frames.sort((a, b) => a.t - b.t);
  const list = frames.map((x, i) => `file '${x.f.split(path.sep).join('/')}'\nduration ${Math.min(5, Math.max(0.01, ((frames[i + 1] || x).t - x.t) / 1000 || 0.05)).toFixed(3)}`).join('\n') + `\nfile '${frames[frames.length - 1].f.split(path.sep).join('/')}'`;
  fs.writeFileSync(path.join(FR, 'list.txt'), list);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(FR, 'list.txt'), '-vf', 'fps=30,scale=1366:-2,format=yuv420p', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', OUT]);
  console.log('OK', OUT, frames.length, 'frames', 'whisper:', JSON.stringify(w).slice(0, 120));
  c.close(); srv.kill(); fs.rmSync(FR, { recursive: true, force: true }); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
