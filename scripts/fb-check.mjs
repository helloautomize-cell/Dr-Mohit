import { chromium } from 'playwright-core';
const b = await chromium.launch();
const errs = [];
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-IN' });
const p = await ctx.newPage();
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) });
p.on('pageerror', (e) => errs.push('PAGE:' + e.message));
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
// scroll to fac bento
await p.evaluate(() => document.getElementById('facBento').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(800);
const st1 = await p.evaluate(() => {
  const fb = document.getElementById('facBento');
  const ims = [...fb.querySelectorAll('.fb-ims img')];
  const tabs = [...fb.querySelectorAll('.fb-tab')];
  const on = ims.findIndex(i => i.classList.contains('on'));
  const grid = getComputedStyle(fb).display;
  const em = getComputedStyle(document.querySelector('.fb-sec .em')).color;
  return { on, tabs: tabs.length, ims: ims.length, grid, em, tiles: fb.querySelectorAll('.fb-t').length, pressed: tabs.map(t => t.getAttribute('aria-pressed')).join(',') };
});
console.log('desktop:', JSON.stringify(st1));
// autoplay: wait 5.5s, index should advance
await p.waitForTimeout(5600);
const st2 = await p.evaluate(() => [...document.querySelectorAll('.fb-ims img')].findIndex(i => i.classList.contains('on')));
console.log('after 5.6s autoplay → img', st2);
// tile hover switches viewer (xray tile data → photo 2)
await p.locator('.fb-t').nth(3).hover(); // Digital X-ray tile (index 3 in tiles array → nth(3) of .fb-t incl. none before)
await p.waitForTimeout(400);
const st3 = await p.evaluate(() => ({ on: [...document.querySelectorAll('.fb-ims img')].findIndex(i => i.classList.contains('on')), paused: document.getElementById('facBento').classList.contains('paused') }));
console.log('after xray tile hover:', JSON.stringify(st3));
await p.mouse.move(10, 10);
// tab click → photo 3
await p.locator('.fb-tab').nth(3).click();
await p.waitForTimeout(300);
const st4 = await p.evaluate(() => [...document.querySelectorAll('.fb-ims img')].findIndex(i => i.classList.contains('on')));
console.log('after tab4 click → img', st4);
await p.screenshot({ path: 'shots/fb-desktop.png' });
// hscroll check
const hs = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('hscroll', hs);
// Punjabi
await p.goto('http://localhost:3000/pa/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.getElementById('facBento').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(600);
const paH = await p.evaluate(() => document.querySelector('.fb-top h2').textContent + ' | tab0=' + document.querySelector('.fb-tab span').textContent);
console.log('pa:', paH);
await p.screenshot({ path: 'shots/fb-pa.png' });
// mobile
const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
m.on('console', (e2) => { if (e2.type() === 'error') errs.push('M:' + e2.text()) });
await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await m.evaluate(() => document.getElementById('facBento').scrollIntoView({ block: 'center' }));
await m.waitForTimeout(700);
const ms = await m.evaluate(() => {
  const v = document.querySelector('.fb-view');
  const tabs = getComputedStyle(document.querySelector('.fb-tabs')).gridTemplateColumns.split(' ').length;
  return { viewW: v.clientWidth, cols: tabs, hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth };
});
console.log('mobile:', JSON.stringify(ms));
await m.screenshot({ path: 'shots/fb-mobile.png', fullPage: false });
// reduced motion
const rc = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
await rc.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await rc.evaluate(() => document.getElementById('facBento').scrollIntoView({ block: 'center' }));
await rc.waitForTimeout(6000); // >5s autoplay window — must NOT advance
const rms = await rc.evaluate(() => [...document.querySelectorAll('.fb-ims img')].findIndex(i => i.classList.contains('on')));
console.log('RM after 6s → img', rms, '(should stay 0)');
await rc.locator('.fb-tab').nth(2).click();
await rc.waitForTimeout(200);
const rms2 = await rc.evaluate(() => [...document.querySelectorAll('.fb-ims img')].findIndex(i => i.classList.contains('on')));
console.log('RM tab3 click → img', rms2);
console.log('console errors:', errs.length ? errs : 'none');
await b.close();
