// Phase 6 acceptance: new pages (doctors, about, media, contact, plan-your-visit,
// 7 legal docs) x {390,1440} EN + PA — no horizontal overflow, zero console
// errors/pageerrors, nested interactives = 0, landmarks present.
// Interaction checks: press lightbox (open/arrow nav/close), map facade,
// FAQ accordion, contact form chips. axe-core on every unique EN page.
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const axeSrc = require.resolve('axe-core/axe.min.js');

const BASE = process.env.BASE || 'http://localhost:4123';
const OUT = 'shots/phase6';
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  '/doctors/', '/about/', '/media/', '/contact/', '/plan-your-visit/',
  '/privacy-policy/', '/terms-of-use/', '/medical-disclaimer/',
  '/editorial-and-medical-review-policy/', '/patient-rights-and-responsibilities/',
  '/appointment-cancellation-and-refund/', '/accessibility-statement/',
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
    await p.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await p.waitForTimeout(1400);
    const r = await p.evaluate(() => ({
      ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      nested:
        document.querySelectorAll('a a, a button, a [role="button"], button a').length,
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

// axe scan (EN pages at 1440): report critical/serious violations only.
async function axe(u) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForTimeout(1200);
  await p.addScriptTag({ path: axeSrc });
  const res = await p.evaluate(async () => {
    const r = await window.axe.run(document, {
      resultTypes: ['violations'],
      rules: { 'color-contrast': { enabled: false } }, // dev-mode [CONFIRM] chips skew this
    });
    return r.violations
      .filter((v) => ['critical', 'serious'].includes(v.impact))
      .map((v) => `${v.id}(${v.impact}): ${v.nodes.length} nodes`);
  });
  ok(`axe ${u}`, res.length === 0, res.slice(0, 3).join(' | '));
  await p.close();
}

// Interactions -------------------------------------------------------------
async function interactions() {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });

  // Media: press board lightbox open, arrow nav, esc close
  await p.goto(BASE + '/media/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2600); // let clip entry animation settle
  const clip = p.locator('.board .clip').first();
  ok('media clip exists', (await clip.count()) === 1);
  await clip.press('Enter'); // keyboard path: detail=0 click -> lightbox
  await p.waitForTimeout(400);
  ok('lightbox opens', (await p.locator('.lb[role="dialog"]').count()) === 1);
  const cap1 = await p.locator('.lb figcaption').textContent().catch(() => '');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300);
  const cap2 = await p.locator('.lb figcaption').textContent().catch(() => '');
  ok('lightbox arrow nav', !!cap1 && cap1 !== cap2, `"${cap1}" -> "${cap2}"`);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  ok('lightbox esc closes', (await p.locator('.lb').count()) === 0);

  // Contact: map facade + dept chip + FAQ accordion
  await p.goto(BASE + '/contact/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1400);
  const mapBtn = p.locator('button.mapbox');
  ok('map facade exists', (await mapBtn.count()) === 1);
  await mapBtn.click();
  await p.waitForTimeout(600);
  ok('map iframe loads', (await p.locator('iframe.mapbox').count()) === 1);
  const chip = p.locator('.chipset button').nth(1);
  if (await chip.count()) {
    await chip.click();
    await p.waitForTimeout(300);
    ok('dept chip toggles', (await chip.getAttribute('aria-pressed')) === 'true' || (await chip.getAttribute('class') ?? '').includes('on'));
  }
  const faq = p.locator('details').nth(1); // first item renders open by default
  if (await faq.count()) {
    await faq.locator('summary').click();
    await p.waitForTimeout(300);
    ok('faq expands', (await faq.getAttribute('open')) !== null);
  }

  // Plan: reach map renders; [CONFIRM] chips hidden in production output
  await p.goto(BASE + '/plan-your-visit/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1400);
  ok('plan reach map', (await p.locator('.reach, .rmap').count()) >= 1);
  const chips = await p.locator('.confirm-chip, .cchip').count();
  const confirmVisible = await p.evaluate(
    () => document.body.innerText.includes('[CONFIRM'),
  );
  ok('plan timings confirm hidden in prod', !confirmVisible, `${chips} chips`);

  // PA: doctors renders gurmukhi
  await p.goto(BASE + '/pa/doctors/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1400);
  const h1pa = await p.locator('h1').textContent();
  ok('pa doctors gurmukhi', /[\u0A00-\u0A7F]/.test(h1pa ?? ''), (h1pa ?? '').slice(0, 40));

  await p.close();
}

// Screenshots ----------------------------------------------------------------
async function shot(u, w, name) {
  // fresh context per shot: locale cookie from earlier /pa/ visits must not leak
  const c2 = await b.newContext({ reducedMotion: 'reduce' });
  const p = await c2.newPage();
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(BASE + u, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForTimeout(1600);
  // step through to trigger reveals/trails
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let i = 1; i <= 4; i++) {
    await p.evaluate((y) => window.scrollTo(0, y), (h * i) / 4);
    await p.waitForTimeout(200);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/${name}@${w}.png`, fullPage: true });
  await p.close();
  await c2.close();
}

for (const u of ROUTES) for (const w of [390, 768, 1024, 1440]) await check(u, w);
for (const u of ROUTES) for (const w of [390, 1440]) await check(`/pa${u}`, w);
for (const u of ROUTES) await axe(u);
await interactions();
for (const u of ROUTES.slice(0, 6)) await shot(u, 1440, `en${u.replace(/\//g, '_')}`);
for (const u of ROUTES.slice(0, 6)) await shot(u, 390, `en${u.replace(/\//g, '_')}`);
for (const u of ROUTES.slice(0, 6)) await shot(`/pa${u}`, 1440, `pa${u.replace(/\//g, '_')}`);
for (const u of ROUTES.slice(0, 6)) await shot(`/pa${u}`, 390, `pa${u.replace(/\//g, '_')}`);

console.log(`\n=== phase6-check: ${pass} pass, ${fail} fail ===`);
await b.close();
process.exit(fail ? 1 : 0);
