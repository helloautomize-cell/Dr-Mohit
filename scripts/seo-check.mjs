// Phase 9 SEO audit: every indexable route must have a unique title, meta
// description, self-canonical + en/pa/x-default hreflang, og:image, og:locale
// pair and a twitter card; JSON-LD @graph blocks must parse and carry the
// expected @types; rendered text must carry no em/en dashes (AI-fingerprint
// rule); /robots.txt, /llms.txt, /llms-full.txt and the md mirrors must serve.
// Also exports resources/docs/titles-descriptions.csv for client review.
// BASE=http://localhost:3001 node scripts/seo-check.mjs
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:3001';
// Canonicals/hreflang always point at the production host even on localhost.
const PROD = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com').replace(/\/$/, '');

// route → expected JSON-LD @types (beyond the sitewide Hospital emitted by the layout)
const ROUTES = [
  { path: '/', types: ['WebSite'] },
  { path: '/orthopaedics/', types: ['MedicalWebPage', 'BreadcrumbList'] },
  { path: '/orthopaedics/robotic-knee-replacement/', types: ['MedicalWebPage', 'BreadcrumbList'] },
  { path: '/orthopaedics/knee-and-hip-replacement/', types: ['MedicalWebPage', 'BreadcrumbList', 'FAQPage'] },
  { path: '/orthopaedics/fractures-and-trauma/', types: ['MedicalWebPage', 'BreadcrumbList', 'FAQPage'] },
  { path: '/orthopaedics/arthroscopy-and-sports-injuries/', types: ['MedicalWebPage', 'BreadcrumbList', 'FAQPage'] },
  { path: '/orthopaedics/back-pain-clinic/', types: ['MedicalWebPage', 'BreadcrumbList', 'FAQPage'] },
  { path: '/eye-care/', types: ['MedicalWebPage', 'BreadcrumbList'] },
  { path: '/mental-health/', types: ['MedicalWebPage', 'BreadcrumbList'] },
  { path: '/doctors/', types: ['BreadcrumbList', 'Physician', 'ItemList'] },
  { path: '/doctors/dr-mohit-gupta/', types: ['BreadcrumbList', 'Physician'] },
  { path: '/doctors/dr-parul-gupta/', types: ['BreadcrumbList', 'Physician'] },
  { path: '/doctors/dr-amit-gupta/', types: ['BreadcrumbList', 'Physician'] },
  { path: '/about/', types: ['BreadcrumbList'] },
  { path: '/media/', types: ['BreadcrumbList'] },
  { path: '/contact/', types: ['BreadcrumbList'] },
  { path: '/plan-your-visit/', types: ['BreadcrumbList'] },
];

const AI_FILES = ['/robots.txt', '/llms.txt', '/llms-full.txt', '/md/en/index.md', '/md/pa/index.md', '/md/en/orthopaedics/knee-and-hip-replacement.md'];

let pass = 0, fail = 0;
const ok = (cond, label, extra = '') => {
  if (cond) pass++;
  else { fail++; console.log('FAIL', label, extra); }
};

const b = await chromium.launch({ channel: 'msedge', headless: true });
const pg = await b.newPage();

const titles = new Map();
const csvRows = [['locale', 'route', 'title', 'description']];
for (const { path, types } of ROUTES) {
  for (const pa of [false, true]) {
    const url = `${pa ? '/pa' : ''}${path}`;
    // next-intl remembers the last locale via NEXT_LOCALE — clear it so an
    // unprefixed URL doesn't redirect to /pa (real user behavior, not a bug).
    await pg.context().clearCookies();
    await pg.goto(BASE + url, { waitUntil: 'domcontentloaded' });
    // Head metadata streams in via flight payloads — wait for the canonical
    // link and a settle beat before reading it.
    await pg.waitForSelector('link[rel="canonical"]', { state: 'attached', timeout: 15000 });
    await pg.waitForTimeout(700);
    const head = await pg.evaluate(() => {
      const q = (s) => document.querySelector(s);
      return {
        title: document.title,
        desc: q('meta[name="description"]')?.content ?? null,
        canonical: q('link[rel="canonical"]')?.href ?? null,
        langs: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
        ogImage: q('meta[property="og:image"]')?.content ?? null,
        ogLocale: q('meta[property="og:locale"]')?.content ?? null,
        ogLocaleAlt: [...document.querySelectorAll('meta[property="og:locale:alternate"]')].map((m) => m.content),
        twitterCard: q('meta[name="twitter:card"]')?.content ?? null,
        lds: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
        lang: document.documentElement.lang,
        dashes: (document.body.innerText.match(/[\u2013\u2014]/g) || []).length,
      };
    });

    const label = `${url}`;
    ok(head.title.length > 5, `${label} title`, head.title);
    titles.set(`${pa ? 'pa' : 'en'}:${path}`, head.title);
    ok(head.desc && head.desc.length > 40, `${label} description`, head.desc ?? '(missing)');
    const expectedCanon = pa ? `${PROD}/pa${path}` : `${PROD}${path}`;
    ok(head.canonical === expectedCanon, `${label} canonical`, head.canonical ?? '(missing)');
    const langMap = Object.fromEntries(head.langs);
    ok(!!langMap.en && !!langMap.pa && !!langMap['x-default'], `${label} hreflang trio`, JSON.stringify(head.langs));
    ok(!!head.ogImage, `${label} og:image`);
    ok(head.ogLocale === (pa ? 'pa_IN' : 'en_IN'), `${label} og:locale`, head.ogLocale ?? '(missing)');
    ok(head.ogLocaleAlt.includes(pa ? 'en_IN' : 'pa_IN'), `${label} og:locale:alternate`, head.ogLocaleAlt.join(','));
    ok(head.twitterCard === 'summary_large_image', `${label} twitter:card`, head.twitterCard ?? '(missing)');
    ok(head.dashes === 0, `${label} no em/en dashes in rendered text`, `${head.dashes} found`);

    let parsed = [];
    for (const raw of head.lds) {
      try { parsed.push(JSON.parse(raw)); } catch { ok(false, `${label} JSON-LD parse`); }
    }
    // Every script is an @graph; collect @types from graph nodes (a bare
    // single-node doc would still work via the fallback).
    const foundTypes = new Set(
      parsed.flatMap((d) => (Array.isArray(d['@graph']) ? d['@graph'] : [d])).map((n) => n['@type']),
    );
    ok(foundTypes.has('Hospital'), `${label} Hospital schema`);
    for (const t of types) ok(foundTypes.has(t), `${label} schema ${t}`, [...foundTypes].join(','));
    csvRows.push([pa ? 'pa' : 'en', path, head.title, head.desc ?? '']);
  }
}

// unique titles across routes (en)
const enTitles = ROUTES.map((r) => titles.get(`en:${r.path}`));
ok(new Set(enTitles).size === enTitles.length, 'unique en titles', enTitles.filter((t, i) => enTitles.indexOf(t) !== i).join(' | '));

// AI files
for (const f of AI_FILES) {
  const res = await pg.request.get(BASE + f);
  ok(res.status() === 200, `${f} serves`, `status ${res.status()}`);
}
const robots = await (await pg.request.get(BASE + '/robots.txt')).text();
// Live mode: sitemap ref + AI-bot rules. Pre-launch: intentional disallow-all.
const lockedDown = /Disallow: \/\s*$/.test(robots.trim());
ok(/sitemap/i.test(robots) || lockedDown, 'robots.txt sitemap ref or lockdown');
ok(/GPTBot/.test(robots) || lockedDown, 'robots.txt AI policy or pre-launch lockdown');

// Titles/descriptions CSV for client review (phase 9 deliverable).
const csv = csvRows
  .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  .join('\n');
writeFileSync('resources/docs/titles-descriptions.csv', csv + '\n');
console.log('wrote resources/docs/titles-descriptions.csv');

await b.close();
console.log(`\nseo-check: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
