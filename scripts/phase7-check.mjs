// Phase 7 acceptance: appointment form + consent-gated analytics.
// Covers: field validation + error summary/focus, phone rules, under-18
// guardian block, Sunday note, honeypot + <3s bot redirects, ?dept/?doctor/
// ?reason prefill (incl. finder-label aliases), zero GA before consent,
// click-to-load map, thank-you variants, EN/PA × 1440/390 screenshots.
import { chromium, devices } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3100';
const SHOTS = 'shots/phase7';
mkdirSync(SHOTS, { recursive: true });
let pass = 0, fail = 0;
const bad = [];
const ok = (cond, name, extra = '') => {
  if (cond) { pass++; } else { fail++; bad.push(`${name} ${extra}`); console.log(`  FAIL ${name} ${extra}`); }
};

const newPage = async (browser, w = 1440, h = 900) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, locale: 'en-IN' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  return { page, errs, ctx };
};

// Next Sunday's date (yyyy-mm-dd) for the Sunday-note probe.
const nextSunday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
};

const fillValid = async (page) => {
  await page.locator('#f-dept-0').check();
  await page.locator('#f-name').fill('Test Patient');
  await page.locator('#f-phone').fill('98765 43210');
  await page.locator('#f-age').fill('40');
  await page.locator('#f-doctor').selectOption('mohit');
  await page.locator('#f-reason').selectOption('knee-pain');
  await page.locator('#f-consent').check();
};

const run = async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const requests = (page) => {
    const hits = { ga: 0, maps: 0 };
    page.on('request', (r) => {
      const u = r.url();
      if (/googletagmanager|google-analytics|gtag\//.test(u)) hits.ga++;
      if (/google\.com\/maps|maps\.googleapis/.test(u)) hits.maps++;
    });
    return hits;
  };

  // ---------- 1. form structure ----------
  {
    const { page, errs, ctx } = await newPage(browser);
    const hits = requests(page);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    const F = page.locator('#bform');
    ok(await F.count() === 1, 'form', 'present');
    ok(await F.locator('input[name=dept]').count() === 5, 'form', `dept radios=${await F.locator('input[name=dept]').count()}`);
    ok(await F.locator('input[name=website]').count() === 1, 'form', 'honeypot input');
    const hpBox = await F.locator('input[name=website]').boundingBox();
    ok(!hpBox || hpBox.x < -1000, 'form', 'honeypot offscreen');
    ok(await F.locator('select[name=reason] optgroup').count() === 5, 'form', `optgroups=${await F.locator('select[name=reason] optgroup').count()}`);
    ok(await F.locator('input[name=consent]').count() === 1, 'form', 'consent');
    ok(await F.locator('input[name=startedAt]').count() === 1, 'form', 'startedAt');
    // no third-party calls on load
    ok(hits.ga === 0, 'ga', `before-consent=${hits.ga}`);
    ok(hits.maps === 0, 'maps', `before-click=${hits.maps}`);
    ok(await page.locator('iframe[src*="google.com/maps"]').count() === 0, 'maps', 'no iframe on load');
    // consent defaults pushed inline
    ok(await page.evaluate(() => Array.isArray(window.dataLayer) && window.dataLayer.length > 0), 'ga', 'consent default in dataLayer');
    // map facade: iframe only after click
    await page.locator('.mapbtn').click();
    await page.waitForSelector('iframe[src*="google.com/maps"]', { timeout: 5000 });
    ok(await page.locator('iframe[src*="google.com/maps"]').count() === 1, 'maps', 'iframe after click');
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await page.screenshot({ path: `${SHOTS}/contact-en-empty-1440.png`, fullPage: true });
    await ctx.close();
  }

  // ---------- 2. validation: empty submit ----------
  {
    const { page, errs, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3300); // clear the <3s bot gate
    await page.locator('#bform button[type=submit]').click();
    await page.waitForSelector('#f-err:not([hidden])', { timeout: 8000 });
    ok(await page.locator('#f-err[role=alert]').count() === 1, 'valid', 'error summary role=alert');
    ok((await page.locator('.ferr').count()) >= 6, 'valid', `field errors=${await page.locator('.ferr').count()}`);
    ok((await page.locator('[aria-invalid="true"]').count()) >= 5, 'valid', `aria-invalid=${await page.locator('[aria-invalid="true"]').count()}`);
    const focused = await page.evaluate(() => document.activeElement?.id);
    ok(focused === 'f-name' || focused === 'f-err' || focused?.startsWith('f-'), 'valid', `focus→${focused}`);
    await page.screenshot({ path: `${SHOTS}/contact-en-errors-1440.png`, fullPage: true });
    // bad phone
    await fillValid(page);
    await page.locator('#f-phone').fill('12345');
    await page.locator('#bform button[type=submit]').click();
    await page.waitForSelector('#f-err:not([hidden])', { timeout: 8000 });
    const ferrTexts = await page.locator('.ferr').allInnerTexts();
    ok(ferrTexts.length > 0, 'valid', 'bad phone → errors');
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await ctx.close();
  }

  // ---------- 3. under-18 guardian + sunday note ----------
  {
    const { page, errs, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    ok(await page.locator('#f-guardian').count() === 0, 'u18', 'guardian hidden initially');
    await page.locator('#f-age').fill('12');
    await page.waitForSelector('#f-guardian', { timeout: 5000 });
    ok(await page.locator('#f-guardian').isVisible(), 'u18', 'guardian shown at 12');
    ok(await page.locator('#f-u18').isChecked(), 'u18', 'under18 auto-checked');
    // months unit: 8 months → guardian too
    await page.locator('#f-ageunit').selectOption('months');
    await page.locator('#f-age').fill('8');
    ok(await page.locator('#f-guardian').isVisible(), 'u18', 'guardian at 8 months');
    await page.locator('#f-ageunit').selectOption('years');
    await page.locator('#f-age').fill('40');
    await page.locator('#f-u18').uncheck().catch(() => {});
    await page.waitForTimeout(300);
    // sunday note
    await page.locator('#f-day').fill(nextSunday());
    ok((await page.locator('.fnote').count()) >= 1, 'sunday', 'sunday note shown');
    // under-18 submit without guardian → guardian error
    await page.locator('#f-age').fill('12');
    await fillValid(page);
    await page.locator('#f-age').fill('12');
    await page.waitForSelector('#f-guardian', { timeout: 5000 });
    await page.waitForTimeout(3300);
    await page.locator('#bform button[type=submit]').click();
    await page.waitForSelector('#f-err:not([hidden])', { timeout: 8000 });
    ok(await page.locator('#f-guardian[aria-invalid="true"]').count() === 1, 'u18', 'guardian required error');
    await page.screenshot({ path: `${SHOTS}/contact-en-guardian-1440.png` });
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await ctx.close();
  }

  // ---------- 4. honeypot + fast-bot → silent redirect ----------
  {
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await fillValid(page);
    await page.locator('#f-website').fill('spam.example', { force: true });
    await page.locator('#bform button[type=submit]').click();
    await page.waitForURL('**/thank-you/**', { timeout: 10000 });
    ok(page.url().includes('type=appointment'), 'honeypot', `redirected ${page.url()}`);
    await ctx.close();
  }
  {
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await fillValid(page);
    await page.locator('#bform button[type=submit]').click(); // <3s since mount
    await page.waitForURL('**/thank-you/**', { timeout: 10000 });
    ok(page.url().includes('type=appointment'), 'fastbot', `redirected ${page.url()}`);
    await ctx.close();
  }

  // ---------- 5. unavailable fallback (no RESEND_API_KEY) ----------
  {
    const { page, errs, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await fillValid(page);
    await page.waitForTimeout(3300);
    await page.locator('#bform button[type=submit]').click();
    // either unavailable block (no key) or thank-you (key set) — both valid
    const landed = await Promise.race([
      page.waitForSelector('.ok[role=alert]', { timeout: 12000 }).then(() => 'unavailable'),
      page.waitForURL('**/thank-you/**', { timeout: 12000 }).then(() => 'thankyou'),
    ]).catch(() => 'neither');
    ok(landed === 'unavailable' || landed === 'thankyou', 'submit', `landed=${landed}`);
    if (landed === 'unavailable') {
      ok(await page.locator('.ok a[href^="tel:"]').count() === 1, 'submit', 'fallback call CTA');
      ok(await page.locator('.ok a[href*="wa.me"]').count() === 1, 'submit', 'fallback WhatsApp CTA');
      await page.screenshot({ path: `${SHOTS}/contact-en-unavailable-1440.png` });
    }
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await ctx.close();
  }

  // ---------- 6. prefill ?dept=&doctor=&reason= ----------
  {
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/?dept=${encodeURIComponent('Eye care')}&doctor=parul&reason=cataract`, { waitUntil: 'networkidle' });
    ok(await page.locator('#f-dept-2').isChecked(), 'prefill', 'dept=Eye care → chip 2');
    ok(await page.locator('#f-doctor').inputValue() === 'parul', 'prefill', 'doctor=parul');
    ok(await page.locator('#f-reason').inputValue() === 'cataract', 'prefill', `reason=${await page.locator('#f-reason').inputValue()}`);
    await ctx.close();
  }
  {
    // finder deep-link: reason=Knee label resolves to Robotic knee / knee-replacement
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/contact/?doctor=mohit&dept=${encodeURIComponent('Robotic knee')}&reason=Knee`, { waitUntil: 'networkidle' });
    ok(await page.locator('#f-dept-1').isChecked(), 'prefill', 'alias → dept chip 1');
    ok(await page.locator('#f-reason').inputValue() === 'knee-replacement', 'prefill', `alias reason=${await page.locator('#f-reason').inputValue()}`);
    ok(await page.locator('#f-doctor').inputValue() === 'mohit', 'prefill', 'doctor=mohit');
    await ctx.close();
  }
  {
    // PA finder label alias
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/pa/contact/?reason=${encodeURIComponent('ਗੋਡਾ')}`, { waitUntil: 'networkidle' });
    ok(await page.locator('#f-dept-1').isChecked(), 'prefill-pa', 'PA alias → dept chip 1');
    ok(await page.locator('#f-reason').inputValue() === 'knee-replacement', 'prefill-pa', `PA reason=${await page.locator('#f-reason').inputValue()}`);
    // dept chips render Punjabi labels
    const chipTxt = await page.locator('#dchips .chip span').allInnerTexts();
    ok(chipTxt.some((s) => /[\u0A00-\u0A7F]/.test(s)), 'prefill-pa', 'PA chip labels');
    await page.screenshot({ path: `${SHOTS}/contact-pa-empty-1440.png`, fullPage: true });
    await ctx.close();
  }

  // ---------- 7. consent gating: accept → still zero GA (no GA_ID configured) ----------
  {
    const { page, errs, ctx } = await newPage(browser);
    const hits = requests(page);
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const before = hits.ga;
    const accept = page.locator('.cb-acc');
    if (await accept.count()) await accept.click();
    await page.waitForTimeout(1200);
    ok(before === 0, 'ga', `requests before consent=${before}`);
    ok(hits.ga === 0, 'ga', `requests after consent=${hits.ga} (NEXT_PUBLIC_GA_ID unset → loader stays off)`);
    // clicking a tracked link must not throw and must not phone home
    await page.locator('a[href^="tel:"]').first().dispatchEvent('click');
    await page.waitForTimeout(400);
    ok(hits.ga === 0, 'ga', 'tracked click no-op');
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await ctx.close();
  }

  // ---------- 8. thank-you variants ----------
  {
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/thank-you/?type=appointment`, { waitUntil: 'networkidle' });
    const h1 = await page.locator('h1').first().innerText();
    ok(/appointment/i.test(h1), 'ty', `EN appt h1="${h1}"`);
    const robots = await page.locator('meta[name=robots]').getAttribute('content');
    ok(/noindex/.test(robots ?? ''), 'ty', 'noindex');
    await ctx.close();
  }
  {
    const { page, ctx } = await newPage(browser);
    await page.goto(`${BASE}/pa/thank-you/?type=appointment`, { waitUntil: 'networkidle' });
    const h1 = await page.locator('h1').first().innerText();
    ok(/[\u0A00-\u0A7F]/.test(h1), 'ty', `PA appt h1="${h1}"`);
    await page.screenshot({ path: `${SHOTS}/thankyou-appt-pa.png` });
    await ctx.close();
  }

  // ---------- 9. mobile + PA form shots ----------
  {
    const { page, errs, ctx } = await newPage(browser, 390, 844);
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= 390, 'mobile', `scrollWidth=${sw}`);
    await page.screenshot({ path: `${SHOTS}/contact-en-390.png`, fullPage: true });
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await ctx.close();
  }
  {
    const { page, errs, ctx } = await newPage(browser, 390, 844);
    await page.goto(`${BASE}/pa/contact/`, { waitUntil: 'networkidle' });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= 390, 'mobile-pa', `scrollWidth=${sw}`);
    await page.screenshot({ path: `${SHOTS}/contact-pa-390.png`, fullPage: true });
    ok(errs.length === 0, 'errors', errs.join(' | '));
    await ctx.close();
  }

  await browser.close();
  console.log(`\nphase7-check: ${pass} pass, ${fail} fail`);
  if (bad.length) { console.log(bad.join('\n')); process.exit(1); }
};

run().catch((e) => { console.error(e); process.exit(1); });
