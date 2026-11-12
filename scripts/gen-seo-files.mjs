// Phase 9 GEO/AEO: generates public/llms.txt, public/llms-full.txt and the
// public/md/{en,pa}/ markdown mirrors of every content page. Sources are the
// same JSONs the site renders from, so mirrors can never drift from copy.
// Runs via `pnpm gen:seo` and automatically on `pnpm prebuild`.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(ROOT, 'resources/content/site-content.en-pa.json'), 'utf8'));
const ortho = JSON.parse(readFileSync(join(ROOT, 'resources/content/ortho-subpages.en-pa.json'), 'utf8'));

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guptahospitalbathinda.com').replace(/\/$/, '');

const SITE_FACTS = {
  name: 'Gupta Hospital, Bathinda',
  founded: 1980,
  address: 'Power House Road, Bathinda, Punjab 151001, India',
  phone: '+91 98787 52241',
  phoneEye: '+91 99886 32241',
  email: 'guptahospitalbathinda@gmail.com',
  whatsapp: 'https://wa.me/919878752241',
  hours: 'Open 24 hours, all days',
  departments: 'Orthopaedics (Dr. Mohit Gupta), Eye care (Dr. Parul Gupta), Mental health & de-addiction (Dr. Amit Gupta)',
};

// ── text hygiene ────────────────────────────────────────────────────────────
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

// Strip HTML-ish markup and [CONFIRM …] markers for markdown output — same
// rule as production (RevBlock/StepsTrail): the marker plus the sentence
// fragment it sits in are removed, so unconfirmed text is never published.
const clean = (s) =>
  decode(s)
    .replace(/[^.।\n]*\[CONFIRM[^\]]*\][.।]?/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const MD_LINE = {
  h1: (s) => `# ${s}\n`,
  h2: (s) => `\n## ${s}\n`,
  h3: (s) => `\n### ${s}\n`,
  h4: (s) => `\n#### ${s}\n`,
  li: (s) => `- ${s}`,
  dt: (s) => `- **${s}**`,
  dd: (s) => `  ${s}`,
  a: (s) => `- ${s}`,
  button: (s) => `- ${s}`,
  label: (s) => `- ${s}`,
};

function stringsToMd(entries, lang) {
  const lines = [];
  for (const e of entries) {
    const text = clean(lang === 'pa' ? e.pa : e.en);
    if (!text) continue;
    lines.push(MD_LINE[e.tag] ? MD_LINE[e.tag](text) : text + '\n');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const section = (key) => {
  const s = site[key];
  return s ? (Array.isArray(s) ? s : s.strings ?? []) : [];
};

// ── page map ────────────────────────────────────────────────────────────────
// Doctor profiles carry their facts inside their route files; parsed below.
function doctorFacts(slug) {
  const src = readFileSync(join(ROOT, `app/[locale]/doctors/${slug}/page.tsx`), 'utf8');
  const m = src.match(/const D: DoctorFacts = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error(`gen-seo: could not parse DoctorFacts in ${slug}`);
  return JSON.parse(m[1]);
}

const PAGES = [
  { key: 'home', route: '/', title: 'Bone, eye and mental health care in Bathinda' },
  { key: 'orthopaedics', route: '/orthopaedics/', title: 'Orthopaedics' },
  { key: 'robotic-knee', route: '/orthopaedics/robotic-knee-replacement/', title: 'Robotic knee replacement' },
  { ortho: '/orthopaedics/knee-and-hip-replacement/', title: 'Knee and hip replacement' },
  { ortho: '/orthopaedics/fractures-and-trauma/', title: 'Fractures and trauma' },
  { ortho: '/orthopaedics/arthroscopy-and-sports-injuries/', title: 'Arthroscopy and sports injuries' },
  { ortho: '/orthopaedics/back-pain-clinic/', title: 'Back pain clinic' },
  { key: 'eye-care', route: '/eye-care/', title: 'Eye care' },
  { key: 'mental-health', route: '/mental-health/', title: 'Mental health and de-addiction' },
  { key: 'doctors', route: '/doctors/', title: 'Doctors' },
  { doctor: 'dr-mohit-gupta', route: '/doctors/dr-mohit-gupta/', title: 'Dr. Mohit Gupta' },
  { doctor: 'dr-parul-gupta', route: '/doctors/dr-parul-gupta/', title: 'Dr. Parul Gupta' },
  { doctor: 'dr-amit-gupta', route: '/doctors/dr-amit-gupta/', title: 'Dr. Amit Gupta' },
  { key: 'about', route: '/about/', title: 'About' },
  { key: 'media', route: '/media/', title: 'Media and press' },
  { key: 'contact', route: '/contact/', title: 'Book an appointment' },
  { key: 'plan-your-visit', route: '/plan-your-visit/', title: 'Plan your visit' },
];

const routeOf = (p) => p.route ?? p.ortho;

function pageEntries(p) {
  if (p.ortho) return ortho[p.ortho] ?? [];
  if (p.key === 'orthopaedics') {
    // The overview also renders the shared "Explore by treatment" row, which
    // lives in the ortho JSON under a note-keyed section.
    const explore = ortho['/orthopaedics/ (new "Explore by treatment" section)'] ?? [];
    return [...section('orthopaedics'), ...explore];
  }
  return section(p.key);
}

function doctorToMd(d, lang) {
  const pa = lang === 'pa';
  const pick = (en, pav) => (pa && pav ? pav : en);
  const lines = [
    `# ${pick(d.name, d.namePa)} — ${pick(d.dept, d.deptPa)}`,
    '',
    `**${pa ? 'ਭਾਸ਼ਾਵਾਂ' : 'Languages'}:** ${pick(d.languages, d.languagesPa)}`,
    '',
    `## ${pa ? 'ਯੋਗਤਾ' : 'Qualifications'}`,
    ...d.qualifications.filter((q) => !q.confirmId).map((q) => `- ${q.text}`),
    '',
    `## ${pa ? 'ਬਾਰੇ' : 'About'}`,
    ...pick(d.about, d.aboutPa).map((t) => t),
    '',
    `## ${pa ? 'ਇਲਾਜ ਦਾ ਢੰਗ' : 'How they work'}`,
    ...pick(d.howWorks, d.howWorksPa).map((t) => `- ${t}`),
    '',
    `## ${pa ? 'ਸੇਵਾਵਾਂ' : 'Services'}`,
    ...pick(d.chips, d.chipsPa).map((t) => `- ${t}`),
  ];
  return lines.join('\n');
}

function pageMd(p, lang) {
  const url = `${BASE}${lang === 'pa' ? '/pa' : ''}${routeOf(p)}`;
  const body = p.doctor
    ? doctorToMd(doctorFacts(p.doctor), lang)
    : stringsToMd(pageEntries(p), lang);
  return [
    '---',
    `title: "${p.title} | ${SITE_FACTS.name}"`,
    `url: ${url}`,
    `language: ${lang === 'pa' ? 'pa-IN' : 'en-IN'}`,
    '---',
    '',
    body,
    '',
    '---',
    `${SITE_FACTS.name} · ${SITE_FACTS.address} · ${SITE_FACTS.phone} · ${SITE_FACTS.hours}`,
  ].join('\n');
}

const mdPath = (p, lang) => {
  const route = routeOf(p);
  if (route === '/') return join(ROOT, 'public', 'md', lang, 'index.md');
  const segs = route.split('/').filter(Boolean);
  return join(ROOT, 'public', 'md', lang, ...segs.slice(0, -1), segs.pop() + '.md');
};

// ── emit .md mirrors ────────────────────────────────────────────────────────
rmSync(join(ROOT, 'public/md'), { recursive: true, force: true });
let mdCount = 0;
for (const lang of ['en', 'pa']) {
  for (const p of PAGES) {
    const file = mdPath(p, lang);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, pageMd(p, lang));
    mdCount++;
  }
}

// ── llms.txt ────────────────────────────────────────────────────────────────
const llmsLines = [
  '# Gupta Hospital Bathinda',
  '',
  `> ${SITE_FACTS.departments}. One family of doctors on Power House Road since ${SITE_FACTS.founded}. ${SITE_FACTS.hours}. Ayushman Bharat (PM-JAY) empanelled.`,
  '',
  'The site is bilingual: English pages are at the root, Punjabi (pa-IN) mirrors live under /pa/. Markdown mirrors of every page are under /md/en/ and /md/pa/.',
  '',
  '## Contact',
  '',
  `- Address: ${SITE_FACTS.address}`,
  `- Phone: ${SITE_FACTS.phone} (main), ${SITE_FACTS.phoneEye} (eye department)`,
  `- WhatsApp: ${SITE_FACTS.whatsapp}`,
  `- Email: ${SITE_FACTS.email}`,
  `- Hours: ${SITE_FACTS.hours}`,
  '',
  '## Departments',
  '',
  `- [Orthopaedics](${BASE}/orthopaedics/): joint replacement, fractures, arthroscopy, back pain — [md](${BASE}/md/en/orthopaedics.md)`,
  `- [Eye care](${BASE}/eye-care/): phaco cataract surgery, glaucoma, retina — [md](${BASE}/md/en/eye-care.md)`,
  `- [Mental health](${BASE}/mental-health/): psychiatry and licensed de-addiction — [md](${BASE}/md/en/mental-health.md)`,
  '',
  '## Treatments',
  '',
  `- [Robotic knee replacement](${BASE}/orthopaedics/robotic-knee-replacement/) — [md](${BASE}/md/en/orthopaedics/robotic-knee-replacement.md)`,
  `- [Knee and hip replacement](${BASE}/orthopaedics/knee-and-hip-replacement/) — [md](${BASE}/md/en/orthopaedics/knee-and-hip-replacement.md)`,
  `- [Fractures and trauma](${BASE}/orthopaedics/fractures-and-trauma/) — [md](${BASE}/md/en/orthopaedics/fractures-and-trauma.md)`,
  `- [Arthroscopy and sports injuries](${BASE}/orthopaedics/arthroscopy-and-sports-injuries/) — [md](${BASE}/md/en/orthopaedics/arthroscopy-and-sports-injuries.md)`,
  `- [Back pain clinic](${BASE}/orthopaedics/back-pain-clinic/) — [md](${BASE}/md/en/orthopaedics/back-pain-clinic.md)`,
  '',
  '## Doctors',
  '',
  `- [Dr. Mohit Gupta](${BASE}/doctors/dr-mohit-gupta/): Orthopaedics and joint replacement — [md](${BASE}/md/en/doctors/dr-mohit-gupta.md)`,
  `- [Dr. Parul Gupta](${BASE}/doctors/dr-parul-gupta/): Ophthalmology — [md](${BASE}/md/en/doctors/dr-parul-gupta.md)`,
  `- [Dr. Amit Gupta](${BASE}/doctors/dr-amit-gupta/): Psychiatry and de-addiction — [md](${BASE}/md/en/doctors/dr-amit-gupta.md)`,
  '',
  '## Patient information',
  '',
  `- [About](${BASE}/about/) — [md](${BASE}/md/en/about.md)`,
  `- [Book an appointment](${BASE}/contact/) — [md](${BASE}/md/en/contact.md)`,
  `- [Plan your visit](${BASE}/plan-your-visit/) — [md](${BASE}/md/en/plan-your-visit.md)`,
  `- [Media and press](${BASE}/media/) — [md](${BASE}/md/en/media.md)`,
  `- [Doctors](${BASE}/doctors/) — [md](${BASE}/md/en/doctors.md)`,
  '',
  '## Full content',
  '',
  `- [llms-full.txt](${BASE}/llms-full.txt): every page in English and Punjabi as plain text`,
  `- [English markdown mirrors](${BASE}/md/en/index.md)`,
  `- [Punjabi markdown mirrors](${BASE}/md/pa/index.md)`,
  '',
  '## Optional',
  '',
  `- [Sitemap](${BASE}/sitemap.xml)`,
].join('\n');
writeFileSync(join(ROOT, 'public/llms.txt'), llmsLines + '\n');

// ── llms-full.txt ───────────────────────────────────────────────────────────
const full = [];
for (const lang of ['en', 'pa']) {
  full.push(`\n${'='.repeat(72)}\nLANGUAGE: ${lang === 'pa' ? 'Punjabi (pa-IN)' : 'English (en-IN)'}\n${'='.repeat(72)}\n`);
  for (const p of PAGES) {
    const url = `${BASE}${lang === 'pa' ? '/pa' : ''}${routeOf(p)}`;
    full.push(`\n${'#'.repeat(72)}\n# ${p.title}\n# ${url}\n${'#'.repeat(72)}\n`);
    full.push(p.doctor ? doctorToMd(doctorFacts(p.doctor), lang) : stringsToMd(pageEntries(p), lang));
    full.push('');
  }
}
writeFileSync(join(ROOT, 'public/llms-full.txt'), full.join('\n'));

console.log(`gen-seo: wrote llms.txt, llms-full.txt and ${mdCount} markdown mirrors (en+pa)`);
