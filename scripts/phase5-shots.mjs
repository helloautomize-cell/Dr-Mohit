// Phase 5 screenshots: the four dept pages EN+PA at 1440 + 390, plus focused
// tool shots (explorer selected state, slider mid-drag, sym filled, balance
// after-state, breathe paused).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'shots/phase5';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3100';
const ROUTES = ['orthopaedics', 'orthopaedics/robotic-knee-replacement', 'eye-care', 'mental-health'];

const b = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await b.newContext({ reducedMotion: 'reduce' });

async function shot(name, url, w) {
  await ctx.clearCookies(); // NEXT_LOCALE from a PA shot must not redirect EN shots
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let i = 1; i <= 6; i++) {
    await p.evaluate((y) => window.scrollTo(0, y), (h * i) / 6);
    await p.waitForTimeout(200);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
  console.log(name, w);
  await p.close();
}

for (const r of ROUTES) {
  const n = r.replaceAll('/', '-');
  for (const w of [1440, 390]) {
    await shot(`en-${n}`, `${BASE}/${r}/`, w);
    await shot(`pa-${n}`, `${BASE}/pa/${r}/`, w);
  }
}

// focused tool shots (EN, 1440, motion allowed so states settle visibly)
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const toolShot = async (name, sel) => {
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await el.screenshot({ path: `${OUT}/tool-${name}.png` });
  console.log('tool-' + name);
};

await p.goto(`${BASE}/orthopaedics/`, { waitUntil: 'networkidle' });
await p.locator('#ktabs button').nth(1).click();
await toolShot('knee-selected', '.eyebox');
await p.locator('.cmp2 input[type="range"]').fill('72');
await toolShot('cmp2', '.cmp2');
for (const i of [0, 2, 4]) await p.locator('.sym button').nth(i).click();
await toolShot('sym', '#symres');
await p.locator('.jt [role="tab"]').nth(1).click();
await toolShot('jtabs', '.jtabs');

await p.goto(`${BASE}/orthopaedics/robotic-knee-replacement/`, { waitUntil: 'networkidle' });
await p.locator('#bang').fill('70');
await toolShot('bal-before', '.bal');
await p.locator('.bal .seg button').nth(1).click();
await toolShot('bal-after', '.bal');

await p.goto(`${BASE}/eye-care/`, { waitUntil: 'networkidle' });
await p.locator('#etabs button').nth(2).click();
await toolShot('eye-selected', '.eyebox');
await p.locator('#cmp input[type="range"]').fill('30');
await toolShot('cmp', '#cmp');

await p.goto(`${BASE}/mental-health/`, { waitUntil: 'networkidle' });
await p.locator('.bc-pause').click();
await toolShot('breathe', '.bc-wrap');

await b.close();
console.log('done');
