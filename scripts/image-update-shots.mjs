// Image-update verification: horizontal-overflow checks at 360/390/768/1440
// and after screenshots at 390/1440 for every page touched by the new image map.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'shots/image-update-after';
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3100';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const issues = [];

const PAGES = [
  ['home', '/'],
  ['orthopaedics', '/orthopaedics/'],
  ['robotic', '/orthopaedics/robotic-knee-replacement/'],
  ['eye-care', '/eye-care/'],
  ['mental-health', '/mental-health/'],
  ['about', '/about/'],
  ['doctors', '/doctors/'],
  ['policy', '/editorial-and-medical-review-policy/'],
];

async function check(name, path, width, scrollSteps = 8) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 1; i <= scrollSteps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), (h * i) / scrollSteps);
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 0) issues.push(`${name} w${width}: horizontal overflow +${overflow}px`);
  if (errors.length) issues.push(`${name} w${width}: console errors: ${errors.slice(0, 3).join(' | ')}`);
  await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
  console.log(`${name} w${width} done (overflow ${overflow}px, ${errors.length} console errors)`);
  await page.close();
}

for (const [name, path] of PAGES) {
  for (const w of [1440, 390]) {
    await check(name, `/en${path === '/' ? '' : path}`, w);
  }
}
// overflow-only checks at the other required widths
for (const [name, path] of PAGES) {
  for (const w of [360, 768]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(`${BASE}/en${path === '/' ? '' : path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 0) issues.push(`${name} w${w}: horizontal overflow +${overflow}px`);
    console.log(`${name} w${w} overflow ${overflow}px`);
    await page.close();
  }
}
// Punjabi spot checks
for (const w of [1440, 390]) {
  await check('home-pa', `/pa/`, w);
  await check('about-pa', `/pa/about/`, w);
  await check('mental-health-pa', `/pa/mental-health/`, w);
}

await browser.close();
console.log(issues.length ? '\nISSUES:\n' + issues.join('\n') : '\nNo issues found.');
