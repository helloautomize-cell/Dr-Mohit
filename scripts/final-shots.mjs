import { chromium } from 'playwright-core';
const b = await chromium.launch();
const mk = async (w, h, loc) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => localStorage.setItem('gh-consent', 'all'));
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000' + loc, { waitUntil: 'networkidle' });
  // scroll through the whole page so every .rv reveal fires, then return to top
  await p.evaluate(async () => {
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += innerHeight * 0.6) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);
  return p;
};
const d = await mk(1440, 900, '/');
await d.screenshot({ path: 'shots/final-desktop-1440.png', fullPage: true });
const m = await mk(390, 844, '/');
await m.screenshot({ path: 'shots/final-mobile-390.png', fullPage: true });
console.log('done');
await b.close();
