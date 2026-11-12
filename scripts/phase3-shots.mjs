// Phase 3 screenshots: every EN route at 1440 + 390, plus five PA routes.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'shots/phase3';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3100';
const EN = [
  '', 'orthopaedics', 'orthopaedics/robotic-knee-replacement', 'eye-care',
  'mental-health', 'doctors', 'doctors/dr-mohit-gupta', 'doctors/dr-parul-gupta',
  'doctors/dr-amit-gupta', 'about', 'media', 'contact', 'plan-your-visit',
  'privacy-policy', 'terms-of-use', 'medical-disclaimer',
  'editorial-and-medical-review-policy', 'patient-rights-and-responsibilities',
  'appointment-cancellation-and-refund', 'accessibility-statement', 'thank-you',
];
const PA = ['', 'orthopaedics', 'doctors/dr-mohit-gupta', 'contact', 'plan-your-visit'];

const b = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await b.newContext({ reducedMotion: 'reduce' });

async function shot(name, url, w) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  // walk the page so lazy images + reveals render
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let i = 1; i <= 5; i++) {
    await p.evaluate((y) => window.scrollTo(0, y), (h * i) / 5);
    await p.waitForTimeout(180);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
  console.log(name, w);
  await p.close();
}

for (const r of EN) {
  const n = r === '' ? 'home' : r.replaceAll('/', '-');
  for (const w of [1440, 390]) await shot(`en-${n}`, `${BASE}/${r}/`, w);
}
for (const r of PA) {
  const n = r === '' ? 'home' : r.replaceAll('/', '-');
  for (const w of [1440, 390]) await shot(`pa-${n}`, `${BASE}/pa/${r}/`, w);
}
await b.close();
console.log('done');
