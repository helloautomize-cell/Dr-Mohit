// Full-site visual audit: every page at 1440 and 390.
// For each page: full-page screenshot (sliced to <=1500px chunks), horizontal
// overflow, console errors, broken images, off-canvas elements.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

const BASE = 'http://localhost:3000';
const OUT = 'audit';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const exe = existsSync(EDGE) ? EDGE : undefined;

const PAGES = [
  ['home', '/en/'],
  ['about', '/en/about/'],
  ['contact', '/en/contact/'],
  ['doctors', '/en/doctors/'],
  ['dr-mohit', '/en/doctors/dr-mohit-gupta/'],
  ['dr-parul', '/en/doctors/dr-parul-gupta/'],
  ['dr-amit', '/en/doctors/dr-amit-gupta/'],
  ['orthopaedics', '/en/orthopaedics/'],
  ['robotic', '/en/orthopaedics/robotic-knee-replacement/'],
  ['eye-care', '/en/eye-care/'],
  ['mental-health', '/en/mental-health/'],
  ['media', '/en/media/'],
  ['plan-your-visit', '/en/plan-your-visit/'],
  ['styleguide', '/en/styleguide/'],
  ['thank-you', '/en/thank-you/'],
  ['accessibility', '/en/accessibility-statement/'],
  ['cancel-refund', '/en/appointment-cancellation-and-refund/'],
  ['editorial-policy', '/en/editorial-and-medical-review-policy/'],
  ['medical-disclaimer', '/en/medical-disclaimer/'],
  ['patient-rights', '/en/patient-rights-and-responsibilities/'],
  ['privacy-policy', '/en/privacy-policy/'],
  ['terms-of-use', '/en/terms-of-use/'],
  ['home-pa', '/pa/'],
  ['orthopaedics-pa', '/pa/orthopaedics/'],
];
const WIDTHS = [1440, 390];

const results = [];
const browser = await chromium.launch({ executablePath: exe, headless: true });

for (const [name, path] of PAGES) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 160)));
    let status = 0;
    try {
      const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
      status = res ? res.status() : 0;
      await page.waitForTimeout(1500);
      // scroll through to fire reveals + lazy images, then return to top
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));
      });
      await page.waitForTimeout(800);
      const metrics = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const overflow = Math.max(0, document.documentElement.scrollWidth - docW);
        const bad = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > docW + 1 || r.left < -1)) {
            const cs = getComputedStyle(el);
            if (cs.position !== 'fixed' && r.width < 3000) {
              bad.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right:${Math.round(r.right)} left:${Math.round(r.left)}`);
            }
          }
        }
        const broken = [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop().slice(0, 60));
        return { overflow, offenders: [...new Set(bad)].slice(0, 6), broken, height: document.body.scrollHeight };
      });
      const file = `${OUT}/${name}-w${w}.png`;
      await page.screenshot({ path: file, fullPage: true });
      results.push({ name, w, status, ...metrics, errors: [...new Set(errors)].slice(0, 6) });
      console.log(`${name} w${w} status:${status} h:${metrics.height} ovf:${metrics.overflow} img-broken:${metrics.broken.length} err:${errors.length}`);
    } catch (e) {
      results.push({ name, w, status, fatal: String(e).slice(0, 200), errors });
      console.log(`${name} w${w} FATAL ${String(e).slice(0, 140)}`);
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(`${OUT}/audit.json`, JSON.stringify(results, null, 2));

// slice each full-page shot into <=1500px tall segments for review
mkdirSync(`${OUT}/slices`, { recursive: true });
for (const r of results) {
  const file = `${OUT}/${r.name}-w${r.w}.png`;
  try {
    const img = sharp(file);
    const meta = await img.metadata();
    const sliceH = 1500;
    const n = Math.ceil(meta.height / sliceH);
    for (let i = 0; i < n; i++) {
      const top = i * sliceH;
      const h = Math.min(sliceH, meta.height - top);
      await img.clone().extract({ left: 0, top, width: meta.width, height: h })
        .png().toFile(`${OUT}/slices/${r.name}-w${r.w}-s${String(i).padStart(2, '0')}.png`);
    }
    console.log(`sliced ${r.name}-w${r.w} -> ${n}`);
  } catch (e) { console.log(`slice fail ${r.name}-w${r.w}: ${e.message.slice(0, 80)}`); }
}
console.log('DONE');
