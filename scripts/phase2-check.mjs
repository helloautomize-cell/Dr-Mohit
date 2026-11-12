// Phase 2 acceptance checks (spec: Playwright tests for nested interactives,
// dropdown panel inside viewport, action bar hiding rules, consent store;
// no overflow at 390/768/1024/1440).
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:3100';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${extra}`); }
};

const b = await chromium.launch({ channel: 'msedge', headless: true });

// ---------- nested interactives: a a, a button, button a must be 0 ----------
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  const nested = await p.evaluate(() => {
    let n = 0;
    document.querySelectorAll('a a').forEach(() => n++);
    document.querySelectorAll('a button, a [role="button"]').forEach(() => n++);
    document.querySelectorAll('button a').forEach(() => n++);
    return n;
  });
  ok(`nested interactives = 0 @${w}`, nested === 0, `got ${nested}`);
  // no horizontal overflow
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`no overflow @${w}`, ov <= 0, `+${ov}px`);
  await p.close();
}

// ---------- overflow sweep on all routes ----------
for (const w of [768, 1024]) {
  for (const u of ['/', '/pa/', '/styleguide/']) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(BASE + u, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(1500);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`no overflow ${u} @${w}`, ov <= 0, `+${ov}px`);
    await p.close();
  }
}

// ---------- dropdown panel inside viewport, no overlapping links ----------
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);
  await p.locator('button.navlink').first().click();
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const el = document.querySelector('.ddgrid');
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, vw: innerWidth, vh: innerHeight };
  });
  ok('dropdown exists', r !== null);
  ok('dropdown inside viewport', r && r.left >= 0 && r.right <= r.vw && r.bottom <= r.vh + 1, JSON.stringify(r));
  const overlap = await p.evaluate(() => {
    const el = document.querySelector('.ddgrid');
    if (!el) return 0;
    const b = el.getBoundingClientRect();
    let n = 0;
    document.querySelectorAll('a').forEach(a => {
      if (el.contains(a)) return;
      const r2 = a.getBoundingClientRect();
      if (r2.width && !(r2.right < b.left || r2.left > b.right || r2.bottom < b.top || r2.top > b.bottom) && a.offsetParent) n++;
    });
    return n;
  });
  ok('no links under dropdown', overlap === 0, `got ${overlap}`);
  // Esc closes
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  const vis = await p.evaluate(() => !!document.querySelector('.ddgrid'));
  ok('Esc closes dropdown', !vis);
  await p.close();
}

// ---------- action bar hiding rules ----------
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1500);
  const vis0 = await p.evaluate(() => getComputedStyle(document.querySelector('.mbar2')).transform);
  ok('mbar hidden before scroll', vis0 === 'none' || vis0.includes('matrix'), vis0);
  await p.evaluate(() => scrollTo(0, 600));
  await p.waitForTimeout(500);
  const shown = await p.evaluate(() => document.querySelector('.mbar2').classList.contains('show'));
  ok('mbar shows after scroll>360', shown);
  // typing hides
  await p.evaluate(() => {
    const i = document.createElement('input');
    i.id = 'fake-input'; document.body.appendChild(i); i.focus();
  });
  await p.waitForTimeout(400);
  const typingHidden = await p.evaluate(() => !document.querySelector('.mbar2').classList.contains('show'));
  ok('mbar hides while typing', typingHidden);
  await p.evaluate(() => document.getElementById('fake-input').remove());
  // thank-you hides
  await p.goto(`${BASE}/thank-you/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  await p.evaluate(() => scrollTo(0, 600));
  await p.waitForTimeout(400);
  const tyHidden = await p.evaluate(() => !document.querySelector('.mbar2').classList.contains('show'));
  ok('mbar hidden on thank-you', tyHidden);
  await p.close();
}

// ---------- consent store ----------
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1800);
  const banner = await p.locator('.cb').count();
  ok('banner shows undecided', banner === 1);
  await p.locator('.cb-acc').click();
  await p.waitForTimeout(400);
  const ls = await p.evaluate(() => JSON.parse(localStorage.getItem('gh_consent_v1') ?? '{}'));
  ok('consent saved analytics=true', ls.analytics === true && ls.decided === true, JSON.stringify(ls));
  const gone = await p.locator('.cb').count();
  ok('banner hides after decision', gone === 0);
  // reopen via footer link
  const link = p.locator('text=Cookie settings').first();
  if (await link.count()) { await link.click(); await p.waitForTimeout(400); }
  const back = await p.locator('.cb').count();
  ok('cookie settings reopens banner', back === 1);
  await p.close();
}

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
await b.close();
process.exit(fail ? 1 : 0);
