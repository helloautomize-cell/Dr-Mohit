// Phase 9 IndexNow: submits every indexable URL (en + pa) to Bing/Yandex via
// api.indexnow.org. The verification key is served at /<key>.txt from public/
// (a verification token, not a secret — safe to commit). Run AFTER deploy:
//   pnpm indexnow            # submit all routes
//   pnpm indexnow --dry      # print the payload without posting
//   URLS="/, /about/" node scripts/indexnow.mjs   # submit a subset
const KEY = 'cacd21671a706b15234169aa66d41c34';
const HOST = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com'
).replace(/^https?:\/\//, '').replace(/\/$/, '');

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

const routes = process.env.URLS
  ? process.env.URLS.split(',').map((s) => s.trim()).filter(Boolean)
  : ROUTES;

const urlList = routes.flatMap((r) => [
  `https://${HOST}${r}`,
  `https://${HOST}/pa${r}`,
]);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

if (process.argv.includes('--dry')) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

// IndexNow returns 200 (accepted) or 202 (accepted, key check pending).
if (res.ok) {
  console.log(`IndexNow OK (${res.status}): ${urlList.length} URLs submitted to ${HOST}`);
} else {
  console.error(`IndexNow FAILED ${res.status}: ${await res.text()}`);
  process.exit(1);
}
