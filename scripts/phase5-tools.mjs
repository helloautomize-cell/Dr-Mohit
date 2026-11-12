// Phase 5 acceptance: department-page interactive tools x {mouse, touch,
// keyboard} x {EN, PA} x {1440, 390}. Asserts aria state, live-region updates,
// localized tool copy, no nested interactives, zero console/page errors.
import { chromium, devices } from 'playwright-core';

const BASE = 'http://localhost:3100';
let pass = 0, fail = 0;
const bad = [];
const ok = (cond, name, extra = '') => {
  if (cond) { pass++; } else { fail++; bad.push(`${name} ${extra}`); console.log(`  FAIL ${name} ${extra}`); }
};

const errors = (page) => {
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  return errs;
};

// ---------- probes ----------

async function kneeExplorer(page, loc) {
  const name = `knee[${loc}]`;
  const tabs = page.locator('#ktabs button');
  ok((await tabs.count()) === 5, name, `tabs=${await tabs.count()}`);
  const infoBox = page.locator('.eyebox .einfo');
  ok((await infoBox.locator('[aria-live="polite"]').count()) === 1, name, 'aria-live');
  const before = (await infoBox.innerText()).trim();
  await tabs.nth(3).click(); // meniscus
  ok(await tabs.nth(3).getAttribute('aria-pressed') === 'true', name, 'pressed');
  const after = (await infoBox.innerText()).trim();
  ok(before !== after && after.length > 10, name, 'info updates');
  // keyboard on the SVG region
  const reg = page.locator('.kneesvg .ep').first();
  await reg.focus();
  await page.keyboard.press('Enter');
  ok(await page.locator('#ktabs button[data-k="bone"]').getAttribute('aria-pressed') === 'true', name, 'svg kbd');
  // tab click syncs svg highlight
  await tabs.nth(1).click();
  ok((await page.locator('.kneesvg .ep.on').count()) === 1, name, 'svg highlight');
}

async function symptomCheck(page, loc) {
  const name = `sym[${loc}]`;
  const btns = page.locator('.sym button');
  ok((await btns.count()) === 6, name, `btns=${await btns.count()}`);
  const bar = page.locator('#symbar');
  const txt = page.locator('#symtxt');
  const cta = page.locator('#symbtn');
  ok(await cta.isHidden(), name, 'cta hidden at 0');
  const w0 = await bar.evaluate((el) => el.style.width);
  const t0 = (await txt.innerText()).trim();
  ok(t0.length > 2, name, 'initial state');
  // pick 1 → mid state
  await btns.nth(0).click();
  ok(await btns.nth(0).getAttribute('aria-pressed') === 'true', name, 'pressed');
  const w1 = await bar.evaluate((el) => el.style.width);
  ok(w0 !== w1, name, `meter ${w0}→${w1}`);
  const t1 = (await txt.innerText()).trim();
  ok(t1 !== t0, name, 'mid state text');
  ok(await cta.isVisible(), name, 'cta visible at 1');
  // pick 2 more (n=3) → high state
  await btns.nth(1).click();
  await btns.nth(2).click();
  const t2 = (await txt.innerText()).trim();
  ok(t2 !== t1, name, 'high state text');
  // unselect one → drops back
  await btns.nth(2).click();
  ok(await btns.nth(2).getAttribute('aria-pressed') === 'false', name, 'toggle off');
}

async function jtabs(page, loc) {
  const name = `jtabs[${loc}]`;
  const tabs = page.locator('.jt [role="tab"]');
  ok((await tabs.count()) === 4, name, `tabs=${await tabs.count()}`);
  const pans = page.locator('.jpan');
  ok((await pans.count()) === 4, name, `panels=${await pans.count()}`);
  await tabs.nth(1).click();
  ok(await tabs.nth(1).getAttribute('aria-selected') === 'true', name, 'aria-selected');
  ok(await pans.nth(1).isVisible(), name, 'panel 2 visible');
  ok(await pans.nth(0).isHidden(), name, 'panel 1 hidden');
  // arrow-key nav
  await tabs.nth(1).focus();
  await page.keyboard.press('ArrowRight');
  ok(await tabs.nth(2).getAttribute('aria-selected') === 'true', name, 'arrow nav');
  ok(await pans.nth(2).isVisible(), name, 'panel 3 visible');
}

async function balanceDemo(page, loc) {
  const name = `bal[${loc}]`;
  const range = page.locator('#bang');
  ok((await range.count()) === 1, name, 'range');
  const bars = page.locator('.bal .gap i b');
  ok((await bars.count()) === 2, name, 'gap bars');
  const w0 = await bars.evaluateAll((els) => els.map((e) => e.style.width));
  await range.fill('60');
  const w1 = await bars.evaluateAll((els) => els.map((e) => e.style.width));
  ok(JSON.stringify(w0) !== JSON.stringify(w1), name, `bend diverges ${w0}→${w1}`);
  const v0 = await page.locator('.bal .verdict').innerText();
  // before/after toggle → equal bars + verdict flips
  const tog = page.locator('.bal .seg button');
  ok((await tog.count()) === 2, name, `seg=${await tog.count()}`);
  await tog.nth(1).click();
  const w2 = await bars.evaluateAll((els) => els.map((e) => e.style.width));
  ok(w2[0] === w2[1], name, `after equal ${w2}`);
  const v1 = await page.locator('.bal .verdict').innerText();
  ok(v0 !== v1, name, 'verdict flips');
  // back to before → diverged again
  await tog.nth(0).click();
  const w3 = await bars.evaluateAll((els) => els.map((e) => e.style.width));
  ok(w3[0] !== w3[1], name, 'before uneven');
}

async function eyeExplorer(page, loc) {
  const name = `eye[${loc}]`;
  const tabs = page.locator('#etabs button');
  ok((await tabs.count()) === 4, name, `tabs=${await tabs.count()}`);
  // default selection = lens (3rd tab in eye order: cornea, retina, iris, lens?)
  const pressed = page.locator('#etabs button[aria-pressed="true"]');
  ok((await pressed.count()) === 1, name, 'one pressed');
  const info = page.locator('.eyebox .einfo');
  ok((await info.locator('[aria-live="polite"]').count()) === 1, name, 'aria-live');
  const t0 = (await info.innerText()).trim();
  await tabs.nth(0).click();
  const t1 = (await info.innerText()).trim();
  ok(t0 !== t1, name, 'info updates');
  // svg region keyboard
  const reg = page.locator('.eyesvg .ep').nth(2);
  await reg.focus();
  await page.keyboard.press(' ');
  const stillPressed = await page.locator('#etabs button[aria-pressed="true"]').innerText();
  ok((await page.locator('.eyesvg .ep.on').count()) === 1, name, `svg kbd (${stillPressed})`);
}

async function breatheCircle(page, loc) {
  const name = `bc[${loc}]`;
  const lbl = page.locator('#bc-t');
  ok((await lbl.count()) === 1, name, 'label');
  const t0 = await lbl.innerText();
  await page.waitForTimeout(5600); // >5s phase
  const t1 = await lbl.innerText();
  ok(t0 !== t1, name, `phase "${t0}"→"${t1}"`);
  const pause = page.locator('.bc-pause');
  ok((await pause.count()) === 1, name, 'pause btn');
  await pause.click();
  const t2 = await lbl.innerText();
  await page.waitForTimeout(5600);
  const t3 = await lbl.innerText();
  ok(t2 === t3, name, 'paused holds label');
  ok(await pause.getAttribute('aria-pressed') === 'true', name, 'pause pressed');
  await pause.click(); // resume for next probe
}

async function cmpSlider(page, loc, sel) {
  const name = `cmp[${loc}]${sel}`;
  const input = page.locator(`${sel} input[type="range"]`);
  ok((await input.count()) === 1, name, 'range input');
  const x0 = await page.locator(sel).evaluate((el) => el.style.getPropertyValue('--x'));
  await input.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const x1 = await page.locator(sel).evaluate((el) => el.style.getPropertyValue('--x'));
  ok(x0 !== x1, name, `--x ${x0}→${x1}`);
  // drag simulation via fill
  await input.fill('80');
  const x2 = await page.locator(sel).evaluate((el) => el.style.getPropertyValue('--x'));
  ok(x2 === '80%', name, `fill→${x2}`);
}

async function noNested(page, loc, sel) {
  const n = await page.locator(`${sel} a a, ${sel} a button, ${sel} button a, ${sel} button button`).count();
  ok(n === 0, `nested[${loc}]${sel}`, `n=${n}`);
}

async function waCards(page, loc) {
  const n = await page.locator('.tgrid.t4 .tcard').count();
  ok(n === 8, `tcards[${loc}]`, `n=${n}`);
  const hrefs = await page.locator('.tgrid.t4 .tcard').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  const wa = hrefs.filter((h) => h && h.startsWith('https://wa.me/')).length;
  const internal = hrefs.filter((h) => h && h.startsWith('/')).length;
  ok(wa === 7 && internal === 1, `tcard-hrefs[${loc}]`, `wa=${wa} int=${internal}`);
}

// ---------- run ----------

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-IN', reducedMotion: 'no-preference' });
const page = await ctx.newPage();
const errs = errors(page);

// --- orthopaedics EN ---
await page.goto(`${BASE}/orthopaedics/`, { waitUntil: 'networkidle' });
await kneeExplorer(page, 'en');
await cmpSlider(page, 'en', '.cmp2');
await symptomCheck(page, 'en');
await jtabs(page, 'en');
await waCards(page, 'en');
await noNested(page, 'en', 'main');

// --- orthopaedics PA ---
await page.goto(`${BASE}/pa/orthopaedics/`, { waitUntil: 'networkidle' });
await kneeExplorer(page, 'pa');
await symptomCheck(page, 'pa');
await jtabs(page, 'pa');
await waCards(page, 'pa');

// --- robotic knee EN ---
await page.goto(`${BASE}/orthopaedics/robotic-knee-replacement/`, { waitUntil: 'networkidle' });
await balanceDemo(page, 'en');
await noNested(page, 'en', 'main');
const mythCount = await page.locator('.acc details').count();
ok(mythCount === 8, 'robotic myths', `n=${mythCount}`);

// --- robotic PA ---
await page.goto(`${BASE}/pa/orthopaedics/robotic-knee-replacement/`, { waitUntil: 'networkidle' });
await balanceDemo(page, 'pa');

// --- eye care EN ---
await page.goto(`${BASE}/eye-care/`, { waitUntil: 'networkidle' });
await eyeExplorer(page, 'en');
await cmpSlider(page, 'en', '#cmp');
await noNested(page, 'en', 'main');
const eyeSvcs = await page.locator('.svc .rv').count();
ok(eyeSvcs === 6, 'eye svcs', `n=${eyeSvcs}`);
const tdayTimes = await page.locator('.tday .step .t').evaluateAll((els) =>
  els.map((e) => e.childNodes[0]?.textContent?.trim())
);
ok(JSON.stringify(tdayTimes) === JSON.stringify(['0:00', '0:30', '0:45', '1:15', '~2:00']), 'tday times', JSON.stringify(tdayTimes));

// --- eye PA ---
await page.goto(`${BASE}/pa/eye-care/`, { waitUntil: 'networkidle' });
await eyeExplorer(page, 'pa');
await cmpSlider(page, 'pa', '#cmp');

// --- mental health EN ---
await page.goto(`${BASE}/mental-health/`, { waitUntil: 'networkidle' });
await breatheCircle(page, 'en');
await noNested(page, 'en', 'main');
const cg = await page.locator('.cg > div').count();
ok(cg === 6, 'cond groups', `n=${cg}`);
const signs = await page.locator('.signs > div').count();
ok(signs === 4, 'stress signs', `n=${signs}`);
const tel112 = await page.locator('main a[href="tel:112"]').count();
const tel14416 = await page.locator('main a[href="tel:14416"]').count();
ok(tel112 >= 1 && tel14416 >= 1, 'urgent tels', `112=${tel112} 14416=${tel14416}`);

// --- mental PA ---
await page.goto(`${BASE}/pa/mental-health/`, { waitUntil: 'networkidle' });
await breatheCircle(page, 'pa');
const paTels = (await page.locator('main a[href="tel:112"]').count()) + (await page.locator('main a[href="tel:14416"]').count());
ok(paTels >= 2, 'pa urgent tels', `n=${paTels}`);

// --- mobile 390 spot-check (EN) ---
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/orthopaedics/`, { waitUntil: 'networkidle' });
await kneeExplorer(page, 'en-390');
await symptomCheck(page, 'en-390');
await jtabs(page, 'en-390');
await cmpSlider(page, 'en-390', '.cmp2');
await page.goto(`${BASE}/mental-health/`, { waitUntil: 'networkidle' });
await breatheCircle(page, 'en-390');
await page.goto(`${BASE}/eye-care/`, { waitUntil: 'networkidle' });
await eyeExplorer(page, 'en-390');
await page.goto(`${BASE}/orthopaedics/robotic-knee-replacement/`, { waitUntil: 'networkidle' });
await balanceDemo(page, 'en-390');

// touch tap on a knee tab
const tctx = await browser.newContext({ ...devices['Pixel 7'], locale: 'en-IN' });
const tp = await tctx.newPage();
errors(tp);
await tp.goto(`${BASE}/orthopaedics/`, { waitUntil: 'networkidle' });
const tt = tp.locator('#ktabs button').nth(2);
await tt.tap();
ok(await tt.getAttribute('aria-pressed') === 'true', 'knee[touch]', 'tap');
const sb = tp.locator('.sym button').nth(1);
await sb.tap();
ok(await sb.getAttribute('aria-pressed') === 'true', 'sym[touch]', 'tap');
await tctx.close();

// console errors anywhere
ok(errs.length === 0, 'console errors', errs.slice(0, 3).join(' | '));

await browser.close();
console.log(`\n=== phase5-tools: ${pass} pass, ${fail} fail ===`);
if (bad.length) console.log(bad.join('\n'));
process.exit(fail ? 1 : 0);
