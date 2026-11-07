// one-shot: TAME (Robinhood Chain, cream/pink) → TAME on Solana (Phantom, black + purple). run once.
'use strict';
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..');
const files = ['server/index.js', 'client/index.html', 'client/app.html', 'client/docs.html', 'X-KIT.md', 'package.json'];
const COL = [['--bg:#fdf6e9', '--bg:#07050c'], ['--panel:#fffdf6', '--panel:#110c1c'], ['--panel2:#f7edda', '--panel2:#1a1229'], ['--ink:#2a2320', '--ink:#ece6ff'], ['--sub:#6f6355', '--sub:#a99bc9'], ['--mut:#a3937f', '--mut:#6f6290'],
  ['--pink:#ff6ea9', '--pink:#a970ff'], ['--mint:#28c48a', '--mint:#c084fc'], ['--bull:#1eae74', '--bull:#3ee0a0'], ['--bear:#e5484d', '--bear:#ff5c7a'], ['--blu:#4f9cf9', '--blu:#7c8cff'], ['--gold:#e8a020', '--gold:#f5c46a'],
  ['--line:rgba(255,110,169,.35)', '--line:rgba(169,112,255,.38)'], ['--line2:rgba(42,35,32,.14)', '--line2:rgba(236,230,255,.12)'],
  ['#fdf6e9', '#07050c'], ['#fffdf6', '#110c1c'], ['#f7edda', '#1a1229'], ['#fff4d6', '#241838'], ['#ff6ea9', '#a970ff'], ['#d14f87', '#8b4fe0'], ['#ff2d95', '#c084fc'], ['#2a2320', '#ece6ff'], ['#6f6355', '#a99bc9'], ['#a3937f', '#6f6290'],
  ['#28c48a', '#c084fc'], ['#1eae74', '#3ee0a0'], ['#1c9468', '#2fbf86'], ['#dff0d2', '#1d1530'], ['%23fff4d6', '%23241838'], ['%23ff6ea9', '%23a970ff'], ['%232a2320', '%23ece6ff'], ['%23fdf6e9', '%2307050c'],
  ['rgba(255,110,169', 'rgba(169,112,255'], ['rgba(42,35,32', 'rgba(236,230,255'], ['rgba(255,253,246', 'rgba(17,12,28'], ['rgba(253,246,233', 'rgba(7,5,12']];
const TXT = [['Robinhood Chain', 'Solana'], ['on Robinhood', 'on Solana'], ['Robinhood', 'Solana'], ['robinhood', 'solana'], ['real Pyth equity feeds', 'live market prices'], ['real Pyth prices', 'live market prices'], ['Pyth', 'market'],
  ['paper capital', 'trading capital'], ['paper-traded', 'tracked'], ['paper ', ''], ['tamerh.xyz', 'tameonsol.com'], ['TameProtocol', 'TameOnSOL'], ['TameRobinhood', 'TameOnSOL'], ['MetaMask or Rabby', 'Phantom'], ['EVM wallet', 'Solana wallet']];
for (const f of files) { const p = path.join(R, f); if (!fs.existsSync(p)) continue; let s = fs.readFileSync(p, 'utf8');
  for (const [a, b] of COL) s = s.split(a).join(b);
  for (const [a, b] of TXT) s = s.split(a).join(b);
  fs.writeFileSync(p, s); }
// server: Solana addresses (base58, case-sensitive), no EVM CA, own port
let s = fs.readFileSync(path.join(R, 'server/index.js'), 'utf8');
s = s.replace("const isEvm = (s) => /^0x[a-fA-F0-9]{40}$/.test(s || '');", "const isEvm = (s) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s || '');   // Solana address (base58)");
s = s.replace(/const MINT = process\.env\.TAME_MINT \|\| '0x[0-9a-fA-F]{40}';/, "const MINT = process.env.TAME_MINT || '';   // $TAME on Solana, shown in the CA bar once set");
s = s.replace("const PORT = +(process.env.PORT || 8172);", "const PORT = +(process.env.PORT || 8280);");
s = s.split("(d.wallet || '').toLowerCase()").join("String(d.wallet || '').trim()").split("(u.searchParams.get('wallet') || '').toLowerCase()").join("String(u.searchParams.get('wallet') || '').trim()");
s = s.replace("pet.owner.slice(2, 6)", "pet.owner.slice(0, 4)").replace("chainId: 4663", "chain: 'solana'");
fs.writeFileSync(path.join(R, 'server/index.js'), s);
// client: Phantom connect
let a = fs.readFileSync(path.join(R, 'client/app.html'), 'utf8');
a = a.replace("const isEvm=s=>/^0x[a-fA-F0-9]{40}$/.test(s||'');", "const isEvm=s=>/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s||'');");
const i0 = a.indexOf("$('connectBtn').onclick=async()=>{"), i1 = a.indexOf('async function api(', i0);
a = a.slice(0, i0) + `$('connectBtn').onclick=async()=>{
  if(wallet){wallet='';localStorage.removeItem('tame_w');MINE=[];renderWallet();try{const p=window.phantom&&window.phantom.solana||window.solana;p&&p.disconnect&&p.disconnect()}catch(e){}toast('Disconnected');return}
  const sol=(window.phantom&&window.phantom.solana)||window.solana||window.solflare||window.backpack;
  if(!sol){toast('No Solana wallet found — opening Phantom');setTimeout(()=>location.href='https://phantom.app/ul/browse/'+encodeURIComponent(location.href)+'?ref='+encodeURIComponent(location.origin),900);return}
  try{
    const r=await sol.connect(); const pk=(r&&r.publicKey||sol.publicKey).toString();
    if(isEvm(pk)){wallet=pk;localStorage.setItem('tame_w',wallet);renderWallet();toast('Connected '+short(wallet)+' — go hatch something');loadMine()}
  }catch(e){toast('Connection rejected')}
};

` + a.slice(i1);
a = a.replace("const short=w=>(w||'').slice(0,6)+'…'+(w||'').slice(-4);", "const short=w=>(w||'').slice(0,4)+'…'+(w||'').slice(-4);");
fs.writeFileSync(path.join(R, 'client/app.html'), a);
console.log('ported');
