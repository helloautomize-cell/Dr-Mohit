// Home upgrade verification + screenshots (v15). Usage:
//   node scripts/home-upgrade-shots.mjs
// Captures en+pa at 1440 and 390, checks console errors, h-scroll at 390,
// reduced-motion visibility, and dept-panel click behaviour.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const OUT = 'shots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function shot(path, w, h, name, { reduced = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // Scroll through the page so reveal/lazy content settles for the full shot.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const hscroll = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  const rsSteps = await page.evaluate(
    () => [...document.querySelectorAll('.rs-step')].map((s) => getComputedStyle(s).opacity)
  );
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await ctx.close();
  return { errs, hscroll, rsSteps };
}

const report = (k, ...rest) => console.log(k.padEnd(12), rest.flat().join(' | ') || 'ok');

for (const [path, tag] of [['/', 'en'], ['/pa/', 'pa']]) {
  const d = await shot(path, 1440, 900, `home-1440-${tag}`);
  report(`${tag} 1440`, d.errs, `hscroll=${d.hscroll}`, `rs=${d.rsSteps}`);
  const m = await shot(path, 390, 844, `home-390-${tag}`);
  report(`${tag} 390`, m.errs, `hscroll=${m.hscroll}`, `rs=${m.rsSteps}`);
}

// Reduced motion: all robo steps must be visible.
const rm = await shot('/', 1440, 900, 'home-1440-rm', { reduced: true });
report('en 1440 RM', rm.errs, `rs=${rm.rsSteps}`);

// Dept panel click: open the second panel.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const count = await page.locator('.dp-h').count();
  if (count >= 2) {
    await page.locator('.dp-h').nth(1).click();
    await page.waitForTimeout(1100);
    const exp = await page.locator('.dp-h').evaluateAll((els) => els.map((e) => e.getAttribute('aria-expanded')));
    report('panel click', `n=${count}`, `aria-expanded=${exp}`);
  } else {
    const html = await page.locator('.dpanels').count();
    report('panel click', `n=${count} dpanels=${html}`);
  }
  await ctx.close();
}

await browser.close();
