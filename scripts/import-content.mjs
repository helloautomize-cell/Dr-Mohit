// scripts/import-content.mjs (phase-03 item 1)
// Validates site-content.en-pa.json: every entry non-empty en AND pa, same
// count per page; generates lib/content-index.json with stable readable keys
// (page.slug.n) for tooling/lookups. copy() in lib/copy.ts is the typed
// accessor — it throws on missing keys, so SSG build fails on drift.
import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync('resources/content/site-content.en-pa.json', 'utf8'));
const index = {};
let errors = 0, total = 0;

const slug = (s) => s.replace(/<[^>]+>/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 42);

for (const [page, sec] of Object.entries(raw)) {
  const strings = Array.isArray(sec) ? sec : (sec.strings ?? []);
  index[page] = [];
  const seen = new Map();
  strings.forEach((e, i) => {
    total++;
    if (!e.en?.trim() || !e.pa?.trim()) {
      console.error(`EMPTY ${page}[${i}] ${e.tag} en=${!e.en?.trim()} pa=${!e.pa?.trim()}`);
      errors++;
    }
    let k = `${page}.${e.tag}.${slug(e.en) || i}`;
    if (seen.has(k)) k += `-${seen.get(k)}`;
    seen.set(k, (seen.get(k) ?? 0) + 1);
    index[page].push({ key: k, tag: e.tag, en: e.en });
  });
}

fs.writeFileSync('lib/content-index.json', JSON.stringify(index, null, 1));
console.log(`${total} entries, ${errors} empty -> lib/content-index.json`);
process.exit(errors ? 1 : 0);
