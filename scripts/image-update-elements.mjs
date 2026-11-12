// Per-element screenshots of every newly mapped image slot, at 390 and 1440.
// Finds each rendered figure by its img src stem. Hidden (animation-gated)
// slots shoot their nearest visible ancestor instead.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'shots/image-update-after/slots';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3100/en';
const browser = await chromium.launch({ channel: 'msedge', headless: true });

// [slot, page path, img src fragment, optional visible ancestor selector]
const TARGETS = [
  ['home.doctors-banner', '/', 'home-doctors-banner-trio', null],
  ['home.doc-mohit', '/', 'dr-mohit-gupta-desk-portrait', '.doc'],
  ['home.doc-parul', '/', 'dr-parul-gupta-saree-portrait', '.doc'],
  ['home.doc-amit', '/', 'dr-amit-gupta-office-portrait', '.doc'],
  ['home.first-visit', '/', 'dr-mohit-gupta-desk-avatar', '.art.chat'],
  ['ortho.hero', '/orthopaedics/', 'ortho-hero-xray-consult', '.ph .im'],
  ['ortho.sports', '/orthopaedics/', 'ortho-sports-physio-balance', '.jpan'],
  ['ortho.exam', '/orthopaedics/', 'ortho-knee-exam', null],
  ['ortho.recovery', '/orthopaedics/', 'ortho-recovery-walk', null],
  ['robotic.hero', '/orthopaedics/robotic-knee-replacement/', 'robotic-hero-mohit-velys', '.ph .im'],
  ['robotic.plan', '/orthopaedics/robotic-knee-replacement/', 'robotic-plan-screen', null],
  ['eye.hero', '/eye-care/', 'doctor-parul-clinic-portrait', '.ph .im'],
  ['eye.explain', '/eye-care/', 'eye-hero-eye-model-consult', null],
  ['eye.exam', '/eye-care/', 'eye-exam-slit-lamp', null],
  ['eye.cataract-day', '/eye-care/', 'eye-cataract-day-surgery', null],
  ['eye.lens', '/eye-care/', 'eye-lens-iol-banner', null],
  ['mind.hero', '/mental-health/', 'doctor-amit-armchair-portrait', '.ph .im'],
  ['mind.first-session', '/mental-health/', 'mind-hero-counselling', null],
  ['mind.family', '/mental-health/', 'mind-family-session', null],
  ['doctors.mohit', '/doctors/', 'dr-mohit-gupta-desk-hero', null],
  ['doctors.parul', '/doctors/', 'dr-parul-gupta-saree-hero', null],
  ['doctors.amit', '/doctors/', 'dr-amit-gupta-office-hero', null],
  ['about.legacy', '/about/', 'about-legacy-family-four', null],
  ['about.camps', '/about/', 'about-camps-village', null],
];

const missing = [];

for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  let curPath = null;
  for (const [slot, path, stem, anc] of TARGETS) {
    if (curPath !== path) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      // trigger reveal animations
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let i = 0; i < 8; i++) window.scrollTo(0, (h * i) / 8);
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      curPath = path;
    }
    const img = page.locator(`img[src*="${stem}"]`).first();
    if (!(await img.count())) {
      missing.push(`${slot} @${w}: img src*=${stem} not found`);
      continue;
    }
    const target = anc ? img.locator(`xpath=ancestor::*[contains(@class,"${anc.replace('.', '')}")][1]`).first() : img;
    const vis = await target.isVisible().catch(() => false);
    const shoot = vis ? target : img;
    try {
      await shoot.scrollIntoViewIfNeeded({ timeout: 5000 });
    } catch {
      // element gated behind an animation; screenshot the page region anyway
      const box = await shoot.boundingBox().catch(() => null);
      if (!box) {
        missing.push(`${slot} @${w}: no bounding box (hidden)`);
        continue;
      }
      await page.screenshot({ path: `${OUT}/${slot}-${w}.png`, clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: box.width, height: box.height } }).catch(() => {});
      console.log(`${slot} w${w} clipped (hidden element)`);
      continue;
    }
    await page.waitForTimeout(500);
    await shoot.screenshot({ path: `${OUT}/${slot}-${w}.png` }).catch(async () => {
      const box = await shoot.boundingBox();
      if (box) await page.screenshot({ path: `${OUT}/${slot}-${w}.png`, clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: box.width, height: box.height } });
    });
    console.log(`${slot} w${w} ok`);
  }
  await page.close();
}
await browser.close();
console.log(missing.length ? '\nMISSING:\n' + missing.join('\n') : '\nAll slots rendered.');
