// Ortho sub-pages acceptance (v14 kit): 4 new routes + updated /orthopaedics/
// x {360,390,1440} EN + PA — no horizontal overflow, zero console errors,
// nested interactives = 0, landmarks present, axe (critical/serious) = 0,
// [CONFIRM] chips visible in dev, screenshots at 1440 + 390 for both locales.
// Usage: BASE=http://localhost:3001 node scripts/ortho-check.mjs
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const axeSrc = require.resolve('axe-core/axe.min.js');

const BASE = process.env.BASE || 'http://localhost:3001';
const OUT = 'shots/ortho';
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  '/orthopaedics/',
  '/orthopaedics/knee-and-hip-replacement/',
  '/orthopaedics/fractures-and-trauma/',
  '/orthopaedics/arthroscopy-and-sports-injuries/',
  '/orthopaedics/back-pain-clinic/',
];

let pass = 0, fail = 0;
const ok = (n, c, x = '') => {
  if (c) pass++;
  else { fail++; console.log(`  FAIL ${n} ${x}`); }
};

const b = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await b.newContext({ reducedMotion: 'reduce' });

async function check(u, w) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: 900 });
  const errs = [];
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 90)));
  p.on('pageerror', (e) => errs.push('PAGEERR ' + String(e).slice(0, 90)));
  try {
    await p.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await p.waitForTimeout(1400);
    const r = await p.evaluate(() => ({
      ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      nested: document.querySelectorAll('a a, a button, a [role="button"], button a').length,
      main: !!document.querySelector('main'),
      h1: document.querySelectorAll('h1').length,
      height: document.body.scrollHeight,
    }));
    ok(`${u} @${w} overflow`, r.ov <= 0, `+${r.ov}px`);
    ok(`${u} @${w} nested=0`, r.nested === 0, `got ${r.nested}`);
    ok(`${u} @${w} main+h1`, r.main && r.h1 === 1, `main=${r.main} h1=${r.h1}`);
    ok(`${u} @${w} height`, r.height > 1500, `${r.height}px`);
    ok(`${u} @${w} console`, errs.filter((e) => !/favicon|404/.test(e)).length === 0, errs[0] ?? '');
  } catch (e) {
    fail++;
    console.log(`  FAIL ${u} @${w} load ${String(e).slice(0, 90)}`);
  }
  await p.close();
}

async function axe(u) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await p.waitForTimeout(1200);
  await p.addScriptTag({ path: axeSrc });
  const res = await p.evaluate(async () => {
    const r = await window.axe.run(document, {
      resultTypes: ['violations'],
      rules: { 'color-contrast': { enabled: false } },
    });
    return r.violations
      .filter((v) => ['critical', 'serious'].includes(v.impact))
      .map((v) => `${v.id}(${v.impact}): ${v.nodes.length} nodes`);
  });
  ok(`axe ${u}`, res.length === 0, res.slice(0, 3).join(' | '));
  await p.close();
}

async function contentChecks() {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });

  // /orthopaedics/: explore-by-treatment row present with 5 real links
  await p.goto(BASE + '/orthopaedics/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  const links = await p.locator('.olinks.big .olink').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  ok('ortho explore links=5', links.length === 5, String(links.length));
  ok(
    'explore hrefs real',
    links.every((h) => h && h.startsWith('/orthopaedics/')),
    links.join(','),
  );

  // knee-hip: svc cards, trail steps, ticks, recovery img, faq
  await p.goto(BASE + '/orthopaedics/knee-and-hip-replacement/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  ok('kh svc cards=4', (await p.locator('.svc.two > div').count()) === 4);
  ok('kh trail steps=5', (await p.locator('.steps.trail .step').count()) === 5);
  ok('kh ticks=5', (await p.locator('.ticks li').count()) === 5);
  ok('kh recovery img', (await p.locator('.rimg img').count()) === 1);
  ok('kh robotic lnk', (await p.locator('.svc a.lnk[href="/orthopaedics/robotic-knee-replacement/"]').count()) === 1);
  ok('kh KH-1 placeholder', (await p.locator('.aimg[data-img], .aimg code').count()) >= 1);

  // fractures: urgent box + emergency 112, cg=6, steps=5, fit boxes
  await p.goto(BASE + '/orthopaedics/fractures-and-trauma/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  ok('fr urgent box', (await p.locator('.urgent').count()) === 1);
  ok('fr 112 button', (await p.locator('.urgent .btn-em[href="tel:112"]').count()) === 1);
  ok('fr cg cards=6', (await p.locator('.cg > div').count()) === 6);
  ok('fr steps=5', (await p.locator('.steps.trail .step').count()) === 5);
  ok('fr FR-2 placeholder', (await p.locator('.aimg').count()) >= 1);

  // sports: scopebox svg + cg=4 + steps=5 + ticks=5
  await p.goto(BASE + '/orthopaedics/arthroscopy-and-sports-injuries/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  ok('sp scopebox', (await p.locator('.scopebox svg.scope').count()) === 1);
  ok('sp scope aria', (await p.locator('.scopebox svg[role="img"][aria-label]').count()) === 1);
  ok('sp cg cards=4', (await p.locator('.cg > div').count()) === 4);
  ok('sp steps=5', (await p.locator('.steps.trail .step').count()) === 5);
  ok('sp repairs ticks=5', (await p.locator('.ticks li').count()) === 5);

  // back-pain: navy signs=4 + btn-em + cg=4 + steps=5 + bring=4
  await p.goto(BASE + '/orthopaedics/back-pain-clinic/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  ok('bp signs=4', (await p.locator('.signs > div').count()) === 4);
  ok('bp 112 button', (await p.locator('.on-dark .btn-em[href="tel:112"]').count()) === 1);
  ok('bp cg cards=4', (await p.locator('.cg > div').count()) === 4);
  ok('bp steps=5', (await p.locator('.steps.trail .step').count()) === 5);
  ok('bp bring=4', (await p.locator('.bring > div').count()) === 4);

  // shared tail: rev block + 4 other-service links on each sub-page
  for (const u of ROUTES.slice(1)) {
    await p.goto(BASE + u, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(900);
    const tails = await p.locator('.olinks:not(.big) .olink').count();
    ok(`${u} tail links=4`, tails === 4, String(tails));
    ok(`${u} rev block`, (await p.locator('.rev').count()) === 1);
    ok(`${u} dev confirm chips`, (await p.locator('.confirm-chip').count()) >= 1);
  }

  // PA spot-check: gurmukhi h1 + pa breadcrumbs + pa olink labels
  for (const u of ROUTES.slice(1)) {
    await p.goto(BASE + `/pa${u}`, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(900);
    const h1 = await p.locator('h1').textContent();
    ok(`pa ${u} gurmukhi h1`, /[\u0A00-\u0A7F]/.test(h1 ?? ''), (h1 ?? '').slice(0, 40));
    const tail = await p.locator('.olinks:not(.big) .olink b').first().textContent();
    ok(`pa ${u} tail gurmukhi`, /[\u0A00-\u0A7F]/.test(tail ?? ''), (tail ?? '').slice(0, 40));
  }

  // FAQ accordion opens (knee-hip, second item)
  await p.goto(BASE + '/orthopaedics/knee-and-hip-replacement/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1000);
  const det = p.locator('.acc details').nth(1);
  await det.locator('summary').click();
  await p.waitForTimeout(300);
  ok('faq opens', (await det.getAttribute('open')) !== null);

  await p.close();
}

async function shot(u, w, name, attempt = 0) {
  const c2 = await b.newContext({ reducedMotion: 'reduce' });
  const p = await c2.newPage();
  try {
    await p.setViewportSize({ width: w, height: 900 });
    await p.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await p.waitForTimeout(1600);
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let i = 1; i <= 5; i++) {
      await p.evaluate((y) => window.scrollTo(0, y), (h * i) / 5);
      await p.waitForTimeout(220);
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/${name}@${w}.png`, fullPage: true });
    console.log(`  shot ${name}@${w}`);
  } catch (e) {
    if (attempt < 1) {
      await p.close().catch(() => {});
      await c2.close().catch(() => {});
      return shot(u, w, name, attempt + 1);
    }
    throw e;
  }
  await p.close();
  await c2.close();
}

// ---- run -----------------------------------------------------------------
for (const u of ROUTES) for (const w of [360, 390, 1440]) await check(u, w);
for (const u of ROUTES) for (const w of [360, 390, 1440]) await check(`/pa${u}`, w);
for (const u of ROUTES) await axe(u);
await contentChecks();
for (const u of ROUTES) {
  const slug = u === '/orthopaedics/' ? 'overview' : u.split('/')[2];
  await shot(u, 1440, `en-${slug}`);
  await shot(u, 390, `en-${slug}`);
  await shot(`/pa${u}`, 1440, `pa-${slug}`);
  await shot(`/pa${u}`, 390, `pa-${slug}`);
}

console.log(`\n=== ortho-check: ${pass} pass, ${fail} fail ===`);
await b.close();
process.exit(fail ? 1 : 0);
