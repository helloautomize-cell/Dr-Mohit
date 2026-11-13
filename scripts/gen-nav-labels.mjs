// pnpm prebuild step: resolves every navLabel() key against the content JSONs
// once, and writes lib/nav-labels.json. Lets client chrome (header, menu,
// breadcrumbs, footer) render labels without bundling the ~250KB copy corpus.
// The lookup mirrors lib/copy.ts entry(): exact, then prefix, then
// strip-tags, then loose — and falls back to the ortho-subpages list like
// navLabel did. Throws on a miss so label drift fails the build loudly.
import { readFileSync, writeFileSync } from 'node:fs';

const content = JSON.parse(
  readFileSync('resources/content/site-content.en-pa.json', 'utf8'),
);
const ortho = JSON.parse(
  readFileSync('resources/content/ortho-subpages.en-pa.json', 'utf8'),
);

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');

const globalList = (() => {
  const sec = content.global;
  return Array.isArray(sec) ? sec : (sec.strings ?? []);
})();

const strip = (s) => s.replace(/<[^>]+>/g, '');
const loose = (s) => strip(s).replace(/^[^\p{L}\p{N}]+/u, '');

const fromGlobal = (key) =>
  globalList.find((e) => e.en === key) ??
  globalList.find((e) => e.en.startsWith(key)) ??
  globalList.find((e) => key.startsWith(e.en)) ??
  globalList.find((e) => strip(e.en) === key || strip(e.en).startsWith(key)) ??
  globalList.find((e) => loose(e.en) === key || loose(e.en).startsWith(key));

const fromOrtho = (key) => {
  for (const v of Object.values(ortho)) {
    if (!Array.isArray(v)) continue;
    const hit = v.find((e) => e.en === key);
    if (hit) return hit;
  }
  return null;
};

// Every key navLabel() is called with: NAV_MAIN + ORTHO_MENU item keys plus
// the literal keys used by SiteHeader/MobileMenu/lib/crumbs.
const NAV_MAIN = [
  'Orthopaedics',
  'Eye care',
  'Mental health',
  'Doctors',
  'About',
  'Media',
];
const ORTHO_MENU = [
  'Orthopaedics overview',
  'Robotic knee replacement',
  'Knee and hip replacement',
  'Fractures and trauma',
  'Arthroscopy and sports injuries',
  'Back pain clinic',
];
const LITERALS = ['Book appointment', 'Robotic knee', 'Plan your visit'];

const keys = [...new Set([...NAV_MAIN, ...ORTHO_MENU, ...LITERALS])];
const out = { en: {}, pa: {} };
const misses = [];

for (const key of keys) {
  const hit = fromGlobal(key) ?? fromOrtho(key);
  if (!hit) {
    misses.push(key);
    continue;
  }
  out.en[key] = decode(hit.en);
  out.pa[key] = decode(hit.pa);
}

if (misses.length) {
  console.error(`gen-nav-labels: unresolved keys: ${misses.join(', ')}`);
  process.exit(1);
}

writeFileSync('lib/nav-labels.json', JSON.stringify(out, null, 2) + '\n');
console.log(`gen-nav-labels: wrote ${keys.length} labels (en+pa)`);
