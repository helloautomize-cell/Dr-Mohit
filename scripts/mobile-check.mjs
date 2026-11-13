import { chromium } from 'playwright-core';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
// robo story region
await p.evaluate(() => document.getElementById('roboStory').scrollIntoView());
await p.waitForTimeout(900);
await p.screenshot({ path: 'shots/m-robo-1.png' });
await p.evaluate(() => document.querySelectorAll('.rs-step')[1].scrollIntoView({block:'center'}));
await p.waitForTimeout(400);
await p.screenshot({ path: 'shots/m-robo-2.png' });
// facilities viewer — cycle through all 4 photos
await p.evaluate(() => document.getElementById('facBento').scrollIntoView());
await p.waitForTimeout(700);
for (let i = 0; i < 4; i++) {
  await p.locator('.fb-tab').nth(i).click();
  await p.waitForTimeout(1100);
  await p.screenshot({ path: 'shots/m-fb-' + i + '.png' });
}
const hs = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('hscroll', hs, '| errors:', errs.length ? errs : 'none');
await b.close();
