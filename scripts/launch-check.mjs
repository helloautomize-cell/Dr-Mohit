// pnpm launch-check (phase-03 item 2): fails while any open [CONFIRM] items
// remain, on em/en dashes in messages, lorem/TODO markers, and banned
// compliance words in user-facing copy.
import fs from 'node:fs';
import path from 'node:path';

let fails = 0;
const fail = (msg) => { fails++; console.error(`FAIL ${msg}`); };
const ok = (msg) => console.log(` ok  ${msg}`);

// Parse CONFIRMS entries straight from lib/confirms.ts source.
const confirmsSrc = fs.readFileSync('lib/confirms.ts', 'utf8');
const CONFIRMS = [...confirmsSrc.matchAll(/\{ id: '([^']+)', note: '([^']+)' \}/g)]
  .map((m) => ({ id: m[1], note: m[2] }));

// ---- 1. open [CONFIRM] items (source of truth: lib/confirms.ts) ----
if (CONFIRMS.length) {
  console.log(`\n${CONFIRMS.length} open [CONFIRM] items:`);
  CONFIRMS.forEach((c) => console.log(`  - ${c.id}: ${c.note}`));
  fail(`${CONFIRMS.length} [CONFIRM] items unresolved`);
} else ok('no open [CONFIRM] items');

// ---- 2. dashes / lorem / TODO / banned words in user-facing copy ----
const scan = (file, label) => {
  const t = fs.readFileSync(file, 'utf8');
  const lines = t.split('\n');
  lines.forEach((ln, i) => {
    if (/[—–]/.test(ln)) fail(`${label}:${i + 1} em/en dash: ${ln.trim().slice(0, 60)}`);
    if (/lorem ipsum/i.test(ln)) fail(`${label}:${i + 1} lorem ipsum`);
  });
  return t;
};

const BANNED = /\b(best|No\. ?1|leading|world-class|guaranteed|cure|permanent|painless|completely safe|100%)\b/i;
const checkFile = (f, label, checkBans = true) => {
  const t = scan(f, label);
  if (checkBans) {
    const m = t.match(BANNED);
    if (m) fail(`${label}: banned compliance word "${m[0]}"`);
  }
};

// messages/*.json = our authored chrome: banned words are hard fails.
for (const f of ['messages/en.json', 'messages/pa.json']) {
  if (fs.existsSync(f)) checkFile(f, f);
}
// content JSON = hospital-approved copy: list hits as warnings for review.
{
  const f = 'resources/content/site-content.en-pa.json';
  const t = scan(f, f);
  const hits = [...t.matchAll(new RegExp(BANNED, 'gi'))].map((m) => m[0]);
  if (hits.length) console.log(`WARN ${f}: ${hits.length} banned-word hit(s) in approved copy [${[...new Set(hits)].join(', ')}] — review in Phase 9`);
}

// source markers (app/, components/, lib/)
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
for (const dir of ['app', 'components', 'lib']) {
  for (const f of walk(dir).filter((x) => /\.(ts|tsx)$/.test(x))) {
    const t = fs.readFileSync(f, 'utf8');
    const stripped = t.replace(/TODO_CONFIRM\w*/g, '');
    if (/TODO|FIXME|lorem ipsum/i.test(stripped)) fail(`${f}: TODO/FIXME/lorem marker`);
  }
}

console.log(fails ? `\n=== launch-check FAILED: ${fails} issue(s) ===` : '\n=== launch-check PASSED ===');
process.exit(fails ? 1 : 0);
