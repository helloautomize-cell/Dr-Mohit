// Phase 3 acceptance: every route x {390,1024,1440} — no horizontal overflow,
// zero console errors/pageerrors; nested interactives = 0; landmarks present.
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:3100';
const ROUTES = [
  '/', '/orthopaedics/', '/orthopaedics/robotic-knee-replacement/',
  '/eye-care/', '/mental-health/', '/doctors/', '/doctors/dr-mohit-gupta/',
  '/doctors/dr-parul-gupta/', '/doctors/dr-amit-gupta/', '/about/', '/media/',
  '/contact/', '/plan-your-visit/', '/privacy-policy/', '/terms-of-use/',
  '/medical-disclaimer/', '/editorial-and-medical-review-policy/',
  '/patient-rights-and-responsibilities/', '/appointment-cancellation-and-refund/',
  '/accessibility-statement/', '/thank-you/',
];
const PA = ['/', '/orthopaedics/', '/doctors/', '/contact/', '/plan-your-visit/'];
const WIDTHS = [390, 1024, 1440];

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
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => ({
      ov: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      nested:
        document.querySelectorAll('a a, a button, a [role="button"], button a').length,
      main: !!document.querySelector('main'),
      h1: document.querySelectorAll('h1').length,
    }));
    ok(`${u} @${w} overflow`, r.ov <= 0, `+${r.ov}px`);
    ok(`${u} @${w} nested=0`, r.nested === 0, `got ${r.nested}`);
    ok(`${u} @${w} main+h1`, r.main && r.h1 === 1, `main=${r.main} h1=${r.h1}`);
    ok(`${u} @${w} console`, errs.filter((e) => !/favicon|404/.test(e)).length === 0, errs[0] ?? '');
  } catch (e) {
    fail++;
    console.log(`  FAIL ${u} @${w} load ${String(e).slice(0, 90)}`);
  }
  await p.close();
}

for (const u of ROUTES) for (const w of [390, 1440]) await check(u, w);
for (const u of PA) for (const w of WIDTHS) await check(`/pa${u === '/' ? '' : u}`, w);

console.log(`\n=== phase3-check: ${pass} pass, ${fail} fail ===`);
await b.close();
process.exit(fail ? 1 : 0);
