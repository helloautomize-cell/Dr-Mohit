// pnpm mobile-check (phase-08 / design-development-plan.md section 6):
// Playwright pass over every route in both locales. Fails on:
//   - any non-hero section taller than 1.3x the viewport
//   - horizontal overflow at 390 / 768 / 1024 / 1440
//   - nested interactives (a a, a button, button a)
//   - Punjabi text overflowing buttons / chips / link cards
//   - full-screen decorative photos on mobile (image blocks taller than the
//     viewport outside the hero)
//   - wave dividers that do not join cleanly between bands
// Reports (info only): mobile Home height in px (target 9,000-10,000),
// first doctor-link position, every .mswipe carousel's slide count.
//
// Usage: BASE_URL=http://localhost:3000 node scripts/mobile-check.mjs
//        node scripts/mobile-check.mjs http://localhost:3000
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || process.argv[2] || 'http://localhost:3000';

let fails = 0;
const fail = (msg) => { fails++; console.error(`FAIL ${msg}`); };
const warn = (msg) => console.warn(`WARN ${msg}`);
const ok = (msg) => console.log(` ok  ${msg}`);
const info = (msg) => console.log(`  ·  ${msg}`);

const ROUTES = [
  '/',
  '/orthopaedics/',
  '/orthopaedics/robotic-knee-replacement/',
  '/orthopaedics/knee-and-hip-replacement/',
  '/orthopaedics/fractures-and-trauma/',
  '/orthopaedics/arthroscopy-and-sports-injuries/',
  '/orthopaedics/back-pain-clinic/',
  '/eye-care/',
  '/mental-health/',
  '/doctors/',
  '/doctors/dr-mohit-gupta/',
  '/doctors/dr-parul-gupta/',
  '/doctors/dr-amit-gupta/',
  '/about/',
  '/media/',
  '/contact/',
  '/plan-your-visit/',
];
// Exempt from the 1.3x rule: heroes and the booking form — a single
// progressive-enhancement task form cannot be chunked without harming
// completion (documented deviation from plan 6.2).
const HEROISH = /hero|ph\b|facts-band|form-sec/;

const measure = async (page, route, { pa = false } = {}) => {
  const url = `${BASE}${pa ? '/pa' : ''}${route}`;
  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  if (!res || res.status() >= 400) {
    fail(`${url}: HTTP ${res ? res.status() : 'no response'}`);
    return;
  }
  await page.waitForTimeout(600); // let reveal/IO settle
  const tag = `${pa ? 'pa' : 'en'} ${route}`;

  const data = await page.evaluate(() => {
    const vh = window.innerHeight;
    const sections = [...document.querySelectorAll('section')].map((s) => ({
      cls: typeof s.className === 'string' ? s.className : '',
      h: Math.round(s.getBoundingClientRect().height),
    }));
    const rgb2hex = (c) => {
      const m = c.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)(?:[, /]+([\d.]+))?/);
      if (!m) return '';
      const a = m[4] === undefined ? 1 : parseFloat(m[4]);
      if (a === 0) return ''; // transparent — keep climbing
      return '#' + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0').toUpperCase()).join('');
    };
    // Effective backdrop: first non-transparent background up the ancestors.
    const bgOf = (el) => {
      for (let e = el; e; e = e.parentElement) {
        const h = rgb2hex(getComputedStyle(e).backgroundColor);
        if (h) return h;
      }
      return '#FFFFFF';
    };
    const waves = [...document.querySelectorAll('.wave')].map((w, i) => {
      const prev = w.previousElementSibling;
      const next = w.nextElementSibling;
      const prevIsWave = !!prev && prev.classList.contains('wave');
      return {
        i,
        bg: rgb2hex(getComputedStyle(w).backgroundColor),
        fill: w.querySelector('.w1')?.getAttribute('fill') ?? '',
        // band directly above: the previous section's bg, or — when waves are
        // stacked (the preview's "lens" joins) — the upper wave's own fill.
        above: prevIsWave ? prev.querySelector('.w1')?.getAttribute('fill') ?? '' : bgOf(prev),
        below: bgOf(next),
      };
    });
    return {
      docH: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sections,
      waves,
      nested:
        document.querySelectorAll('a a, a button, a [role="button"], button a, button button').length,
      btnOverflow: [...document.querySelectorAll('.btn, .mswipe-pp, .chips>span, .olink b, .tag')]
        .filter((el) => el.scrollWidth > el.clientWidth + 2)
        .map((el) => el.textContent?.trim().slice(0, 40) ?? ''),
      tallImgs: [...document.querySelectorAll('.im, .aimg, figure')]
        .filter((el) => !el.closest('.hero, .ph, .hero-wrap, .lb'))
        .filter((el) => el.getBoundingClientRect().height > vh)
        .map((el) => `${el.className} ${Math.round(el.getBoundingClientRect().height)}px`),
      swipes: [...document.querySelectorAll('.mswipe-track')].map((t) => ({
        cls: t.className,
        slides: t.children.length,
        overflow: t.scrollWidth - t.clientWidth,
      })),
      firstDocLinkY: (() => {
        const a = document.querySelector('a[href*="/doctors/"]');
        return a ? Math.round(a.getBoundingClientRect().top + window.scrollY) : null;
      })(),
      vh,
    };
  });

  if (data.overflowX > 1) fail(`${tag}: horizontal overflow ${data.overflowX}px`);
  for (const s of data.sections) {
    if (!HEROISH.test(s.cls) && s.h > data.vh * 1.3)
      fail(`${tag}: section ".${s.cls.split(' ')[0]}..." (${s.cls.slice(0, 48)}) is ${s.h}px > 1.3x viewport (${Math.round(data.vh * 1.3)}px)`);
  }
  if (data.nested > 0) fail(`${tag}: ${data.nested} nested interactive element(s)`);
  for (const t of data.tallImgs) fail(`${tag}: decorative image block taller than viewport: ${t}`);
  for (const w of data.waves) {
    if (w.above && w.bg !== w.above)
      fail(`${tag}: wave #${w.i} bg ${w.bg} does not match band above ${w.above}`);
    // Only a true band transition must match the band below. The preview also
    // uses waves decoratively between two bands of the same colour (e.g. the
    // sky flourish before the callout) — those joins are intentional.
    if (w.below && w.above !== w.below && w.fill !== w.below)
      fail(`${tag}: wave #${w.i} fill ${w.fill} does not match band below ${w.below}`);
  }
  if (pa && data.btnOverflow.length)
    fail(`${tag}: Punjabi text overflowing ${data.btnOverflow.length} control(s): ${data.btnOverflow.slice(0, 4).join(' | ')}`);
  if (route === '/') {
    info(`${tag}: page height ${data.docH}px (target ~9,000-10,000)`);
    if (data.docH < 8500 || data.docH > 10500) warn(`${tag}: Home height ${data.docH}px outside the 9,000-10,000 target`);
    if (data.firstDocLinkY != null)
      info(`${tag}: first /doctors/ link at ${data.firstDocLinkY}px (${Math.round((data.firstDocLinkY / data.docH) * 100)}% of page)`);
  }
  const badSwipe = data.swipes.filter((s) => s.slides > 3 && s.overflow <= 0);
  for (const s of badSwipe)
    warn(`${tag}: .${s.cls} has ${s.slides} slides but no scroll overflow`);
};

const browser = await chromium.launch();
try {
  // Mobile pass — every route, both locales, 390x844.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => fail(`pageerror: ${e.message}`));
  for (const r of ROUTES) {
    await measure(page, r);
    await measure(page, r, { pa: true });
  }
  await ctx.close();

  // Overflow-only pass at the other breakpoints (English).
  for (const w of [768, 1024, 1440]) {
    const c2 = await browser.newContext({ viewport: { width: w, height: 900 } });
    const p2 = await c2.newPage();
    for (const r of ROUTES) {
      const res = await p2.goto(`${BASE}${r}`, { waitUntil: 'networkidle', timeout: 45000 });
      if (!res || res.status() >= 400) { fail(`${r} @${w}: HTTP ${res ? res.status() : 'none'}`); continue; }
      const ox = await p2.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (ox > 1) fail(`${r} @${w}: horizontal overflow ${ox}px`);
    }
    await c2.close();
    ok(`no horizontal overflow at ${w}px`);
  }
} finally {
  await browser.close();
}

console.log(fails ? `\n=== mobile-check FAILED: ${fails} issue(s) ===` : '\n=== mobile-check PASSED ===');
process.exit(fails ? 1 : 0);
