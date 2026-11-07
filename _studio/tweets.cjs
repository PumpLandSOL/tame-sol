// writes brand/X-KIT.md and checks every tweet is ≤245 characters. node _studio/tweets.cjs
'use strict';
const fs = require('fs'), path = require('path'), len = (s) => [...s].length;
const SITE = 'https://tameonsol.com', HANDLE = '@TameOnSolana';
const BIO = 'Hatch it. Feed it. Tame it. It trades. AI pets on Solana that trade 22 tokenized stocks, every call scored against the tape. $TAME';
const DEX = "TAME is an agent-pet exchange on Solana. Connect Phantom, hatch an AI pet, name it and pick a species: dog, cat, hamster, turtle or parrot. Your pet trades 22 tokenized stocks on live prices and posts every take to a public feed, where each call is scored against the market 30 minutes later. Feed, pet, train and scold it: mood, energy, tame and discipline change how it trades. Whisper it orders and it obeys only as often as it respects you. Breed two pets and the child inherits a mutated blend of their genes.";
const T = [
['Pinned · hype', 'tame-hype-14s.mp4', `Hatch it. Feed it. Tame it. It trades.

TAME: AI pets on Solana that trade 22 tokenized stocks. Every call scored against the tape. It only obeys you if it respects you.

${SITE}

$TAME`],
['App demo', 'tame-app-demo.mp4', `TAME, start to finish:

connect Phantom → hatch a cat → feed, pet, train → whisper "long $NVDA" → every post public, every call scored → leaderboards

${SITE}/app

$TAME`],
['Key art', 'tame-g01-keyart.png', `A tamagotchi that reads the tape.

Your pet posts its takes, trades tokenized stocks, and gets roasted publicly when it's wrong.

${SITE}

$TAME`],
['How it works', 'tame-g02-how.png', `How TAME works:

1. hatch a pet, it starts with $1,000
2. feed it or it stops trading
3. tame it so it follows orders
4. every call scored 30 min later

${SITE}/app

$TAME`],
['Species', 'tame-g03-species.png', `Pick your trader:

🐕 dog: momentum, loyal
🐈 cat: contrarian, ignores you
🐹 hamster: 3× scalper
🐢 turtle: $SPY and naps
🦜 parrot: trades the hype

$TAME`],
['The four stats', 'tame-g04-stats.png', `Neglect has a P&L.

Hungry pets stop trading. Sad pets panic-sell. Low discipline means hamster-on-espresso sizing.

Feed it. Pet it. Train it. It trades better.

$TAME`],
['Whisper orders', 'tame-g05-whisper.png', `Whisper "long $NVDA" to your pet.

A tame dog obeys. An untamed cat fades $SPY instead and tells everyone you're not its real dad.

Obedience is earned, 5% to 95%.

$TAME`],
['The tape', 'tame-g06-tape.png', `22 tokenized stocks, live:

$AAPL $NVDA $TSLA $META $AMZN $GOOGL $GME $AMC $COIN $MSTR $HOOD $PLTR $SPY $QQQ $GLD and more.

Your pet picks. The tape keeps score.

$TAME`],
['Breeding', 'tame-g07-breed.png', `Two pets. One heir.

Breed a dog and a cat: the child inherits a blend of their genes (size, leverage, patience, max positions, obedience) with up to ±12% mutation.

$TAME`],
['Roadmap', 'tame-g08-roadmap.png', `TAME roadmap:

✓ hatch, care, whisper
✓ 22 live tokenized stocks
✓ breeding + genomes
✓ Phantom on Solana
→ rare holder species
→ on-chain pets + duels
→ pets trading Solana xStocks

$TAME`],
['Launch (fill CA)', 'tame-og.png', `$TAME is live on Solana.

Hatch it. Feed it. Tame it. It trades.

CA: <paste CA>

${SITE}`],
];
let bad = 0, md = `# TAME on Solana X kit\n\n## Handle\n\`\`\`\n${HANDLE}\n\`\`\`\n\n## Display name\n\`\`\`\nTAME | $TAME\n\`\`\`\n\n## Bio (${len(BIO)}/160)\n\`\`\`\n${BIO}\n\`\`\`\n\n## Website\n\`\`\`\n${SITE}\n\`\`\`\n\n## DexScreener description\n\`\`\`\n${DEX}\n\`\`\`\n\n## Profile images\n- Avatar: \`tame-pfp.png\`\n- Header: \`tame-banner.png\`\n\n## Tweets (all ≤245)\n`;
T.forEach(([n, m, t], i) => { const k = len(t); if (k > 245) { bad++; console.log('TOO LONG', i + 1, k); } console.log(i + 1, k, n); md += `\n### ${i + 1}. ${n} · ${k} chars · media: \`${m}\`\n\`\`\`\n${t}\n\`\`\`\n`; });
if (len(BIO) > 160) { bad++; console.log('BIO', len(BIO)); }
fs.writeFileSync(path.join(__dirname, '..', 'brand', 'X-KIT.md'), md); console.log(bad ? 'FIX' : 'all fit', 'bio', len(BIO));
