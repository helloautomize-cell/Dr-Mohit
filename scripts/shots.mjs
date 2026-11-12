// Screenshot + checks: styleguide (next) vs prototype at 390/768/1024/1440,
// EN + PA. Reports console errors and horizontal overflow.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const issues = [];

async function check(name, url, width, { pa = false, scrollSteps = 0 } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  if (pa) await page.setExtraHTTPHeaders({});
  await page.goto(url, { waitUntil: 'networkidle' });
  // trigger below-fold reveals + trails by stepping through the page
  if (scrollSteps > 0) {
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let i = 1; i <= scrollSteps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (h * i) / scrollSteps);
      await page.waitForTimeout(240);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 0) issues.push(`${name} w${width}: horizontal overflow +${overflow}px`);
  if (errors.length) issues.push(`${name} w${width}: console errors: ${errors.slice(0, 3).join(' | ')}`);
  await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
  console.log(`${name} w${width} done (overflow ${overflow}px, ${errors.length} console errors)`);
  await page.close();
}

const SG = 'http://localhost:3100';
const PT = 'http://localhost:3200/prototype.html';

for (const w of [1440, 1024, 768, 390]) {
  await check('sg-en', `${SG}/styleguide/`, w, { scrollSteps: 14 });
}
await check('sg-pa', `${SG}/pa/styleguide/`, 1440, { scrollSteps: 14 });
await check('sg-pa', `${SG}/pa/styleguide/`, 390, { scrollSteps: 14 });
await check('home-en', `${SG}/`, 1440, { scrollSteps: 4 });
await check('home-pa', `${SG}/pa/`, 390, { scrollSteps: 4 });
for (const w of [1440, 390]) {
  await check('proto-home', `${PT}#home`, w, { scrollSteps: 6 });
}
await check('proto-pa', `${PT}#home`, 1440, { scrollSteps: 6, pa: true });

await browser.close();
console.log(issues.length ? '\nISSUES:\n' + issues.join('\n') : '\nNo issues found.');
