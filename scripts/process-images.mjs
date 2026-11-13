// Phase 1 image pipeline (design plan section 1 / Phase 11 contract).
// Reads resources/images/, writes public/images/ (AVIF handled by next/image at
// request time; here we emit clean sRGB JPEG/PNG masters), alt-text.json and
// _todo.md for files flagged *_UPSCALE or needing confirmation.
import { mkdirSync, readdirSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const SRC = 'resources/images';
const OUT = 'public/images';
const todo = [];
const altText = {};

// width caps (never upscale): masters are stored at up to these widths
const CAPS = { photo: 2000, press: 1400, brand: 1600, icon: null };

async function processOne(srcPath, destPath, { maxW, quality = 85, trim = false, fit } = {}) {
  let pipe = sharp(srcPath).rotate(); // respect EXIF orientation, then strip it (sharp accepts a path or Buffer)
  if (trim) pipe = pipe.trim({ threshold: 10 });
  const m = await pipe.metadata();
  if (maxW && (m.width ?? 0) > maxW) pipe = pipe.resize({ width: maxW, withoutEnlargement: true });
  if (fit) pipe = pipe.resize({ ...fit, withoutEnlargement: true });
  await pipe
    .flatten({ background: '#ffffff' })
    .jpeg({ quality, mozjpeg: true })
    .toFile(destPath)
    .catch(async () => {
      // keep alpha for PNG sources (logo, nabh)
      await sharp(srcPath)
        .rotate()
        .resize({ width: maxW ?? undefined, withoutEnlargement: true })
        .png()
        .toFile(destPath);
    });
}

async function processPng(srcPath, destPath, { maxW, trim = false } = {}) {
  let pipe = sharp(srcPath).rotate();
  if (trim) pipe = pipe.trim({ threshold: 10 });
  const m = await pipe.metadata();
  if (maxW && (m.width ?? 0) > maxW) pipe = pipe.resize({ width: maxW, withoutEnlargement: true });
  await pipe.png({ compressionLevel: 9 }).toFile(destPath);
}

// produce a named crop from a source photo (doctor set: -hero 4:5, -portrait, -avatar 1:1).
// `focal` (x, y 0..1 from the image map) keeps the face in frame: the crop window is
// centred on it horizontally and placed so the focal lands ~40% down for portrait crops.
async function cropVariant(srcPath, destPath, ratio, w, focal) {
  const m = await sharp(srcPath).rotate().metadata();
  const sw = m.width ?? 0;
  const sh = m.height ?? 0;
  const [rw, rh] = ratio.split('/').map(Number);
  const targetRatio = rw / rh;
  let cw = sw;
  let ch = Math.round(sw / targetRatio);
  if (ch > sh) {
    ch = sh;
    cw = Math.round(sh * targetRatio);
  }
  let top;
  let left;
  if (focal) {
    const topBias = targetRatio < 1 ? 0.4 : 0.5;
    left = Math.min(Math.max(0, Math.round(focal.x * sw - cw / 2)), Math.max(0, sw - cw));
    top = Math.min(Math.max(0, Math.round(focal.y * sh - ch * topBias)), Math.max(0, sh - ch));
  } else {
    top = Math.max(0, Math.round((sh - ch) * 0.18)); // bias to top for faces
    left = Math.max(0, Math.round((sw - cw) / 2));
  }
  await sharp(srcPath)
    .rotate()
    .extract({ left, top, width: cw, height: ch })
    .resize({ width: w, withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(destPath);
}

const ensure = (d) => mkdirSync(d, { recursive: true });
const list = (d) => (existsSync(d) ? readdirSync(d) : []);

ensure(OUT);
ensure(join(OUT, 'photos'));
ensure(join(OUT, 'press'));
ensure(join(OUT, 'brand'));

// ---------- brand ----------
const logoSrc = join(SRC, 'brand', 'logo-original-4936x1776.png');
if (existsSync(logoSrc)) {
  await processPng(logoSrc, join(OUT, 'brand', 'logo.png'), { maxW: 1600, trim: true });
  await processPng(logoSrc, join(OUT, 'brand', 'logo-2x.png'), { maxW: 900, trim: true });
}
const favSrc = join(SRC, 'brand', 'favicon-source-72.png');
if (existsSync(favSrc)) copyFileSync(favSrc, 'app/icon.png');
const nabh = join(SRC, 'brand', 'nabh-badge-CONFIRM-BEFORE-USE.png');
if (existsSync(nabh)) {
  // NABH Entry Level certification confirmed — badge shows in the site footer.
  await processPng(nabh, join(OUT, 'brand', 'nabh-badge.png'), { maxW: 400 });
}
// Ortho Robotic Centre sub-brand: decided not to use it — the banner is not
// processed or displayed anywhere.

// ---------- photos ----------
for (const f of list(join(SRC, 'photos'))) {
  const ext = extname(f).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const name = basename(f, ext).replace(/_UPSCALE$/, '');
  const srcPath = join(SRC, 'photos', f);
  const dest = join(OUT, 'photos', `${name}.jpg`);
  if (ext === '.png') await processPng(srcPath, join(OUT, 'photos', `${name}.png`), { maxW: CAPS.photo });
  else await processOne(srcPath, dest, { maxW: CAPS.photo });
  if (f.includes('_UPSCALE')) {
    const m = await sharp(srcPath).metadata();
    todo.push(`- \`photos/${name}\` (${m.width}x${m.height}) — flagged *_UPSCALE in kit: small source, keep crops modest; replace when original arrives.`);
  }
}

// doctor sets: -hero 4:5, -portrait 4:5(card), -avatar 1:1
const doctors = [
  { key: 'mohit', srcs: ['dr-mohit-gupta-scrubs.png', 'dr-mohit-with-velys.jpg'] },
  { key: 'parul', srcs: ['dr-parul-gupta.jpg'] },
  { key: 'amit', srcs: ['dr-amit-gupta.jpg'] },
  { key: 'amrit', srcs: ['dr-amrit-gupta.jpg'] },
];
for (const d of doctors) {
  for (const s of d.srcs) {
    const p = join(OUT, 'photos', s);
    if (!existsSync(p)) continue;
    const stem = s.replace(/\.(jpg|png)$/, '');
    if (s.endsWith('.png')) {
      // PNG (alpha) sources: variants stay jpg on white
      await cropVariant(p, join(OUT, 'photos', `${stem}-hero.jpg`), '4/5', 1200);
      await cropVariant(p, join(OUT, 'photos', `${stem}-portrait.jpg`), '4/5', 900);
      await cropVariant(p, join(OUT, 'photos', `${stem}-avatar.jpg`), '1/1', 512);
    } else {
      await cropVariant(p, join(OUT, 'photos', `${stem}-hero.jpg`), '4/5', 1200);
      await cropVariant(p, join(OUT, 'photos', `${stem}-portrait.jpg`), '4/5', 900);
      await cropVariant(p, join(OUT, 'photos', `${stem}-avatar.jpg`), '1/1', 512);
    }
  }
}

// ---------- new batch (Phase 11 image update) ----------
// resources/images/new/ -> public/images/photos/. Masters stay full-ratio;
// each slot frames them with its CSS aspect-ratio + object-position focal.
const NEW_DIR = join(SRC, 'new');
for (const f of list(NEW_DIR)) {
  const ext = extname(f).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const name = basename(f, ext)
    // ortho-recovery-walk-SPARE.jpg is no longer spare — the knee-and-hip
    // "Getting home ready" photo. Emit it lowercase as a normal photo.
    .replace(/-SPARE$/, '-spare');
  let input = join(NEW_DIR, f);
  if (name === 'ortho-sports-physio-balance') {
    // map note: remove the Nike logo on the T-shirt -> clone a clean patch of the
    // navy shirt fabric over it (no upscaling).
    const logo = { left: 655, top: 292, width: 72, height: 40 };
    const donor = await sharp(input)
      .extract({ left: logo.left - 150, top: logo.top, width: logo.width, height: logo.height })
      .flop()
      .toBuffer();
    input = await sharp(input)
      .composite([{ input: donor, left: logo.left, top: logo.top }])
      .png()
      .toBuffer();
  }
  await processOne(input, join(OUT, 'photos', `${name}.jpg`), { maxW: CAPS.photo });
}

// doctor sets from the three new doctor files (card, profile and avatar share
// the same photo per doctor - the only allowed reuse).
const NEW_DOCTORS = [
  { stem: 'dr-mohit-gupta-desk', src: 'doctor-mohit-desk-portrait.jpg', x: 0.5, y: 0.35 },
  { stem: 'dr-parul-gupta-saree', src: 'doctor-parul-saree-avatar.png', x: 0.5, y: 0.3 },
  { stem: 'dr-amit-gupta-office', src: 'doctor-amit-office-real-avatar.png', x: 0.52, y: 0.35 },
];
for (const d of NEW_DOCTORS) {
  const p = join(NEW_DIR, d.src);
  if (!existsSync(p)) continue;
  const focal = { x: d.x, y: d.y };
  await cropVariant(p, join(OUT, 'photos', `${d.stem}-hero.jpg`), '4/5', 1200, focal);
  await cropVariant(p, join(OUT, 'photos', `${d.stem}-portrait.jpg`), '4/5', 900, focal);
  await cropVariant(p, join(OUT, 'photos', `${d.stem}-avatar.jpg`), '1/1', 512, focal);
}

// ---------- press clippings ----------
for (const f of list(join(SRC, 'press'))) {
  const ext = extname(f).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const name = basename(f, ext);
  const dest = join(OUT, 'press', `${name}.jpg`);
  await processOne(join(SRC, 'press', f), dest, { maxW: CAPS.press, quality: 82 });
}
// copy press index alongside processed files so lib code can read captions
if (existsSync(join(SRC, 'press', 'press-index.json'))) {
  copyFileSync(join(SRC, 'press', 'press-index.json'), join(OUT, 'press', 'press-index.json'));
}

// ---------- hero static renditions (LCP: serve /images/hero/ files, not the
// runtime /_next/image optimizer) ----------
// Home hero: LCP element on mobile. Emit fixed AVIF sizes + one JPG fallback;
// HomeHero renders them via <picture> + preload instead of next/image.
const HERO_SRC = join(NEW_DIR, 'home-hero-mohit.jpg');
if (existsSync(HERO_SRC)) {
  mkdirSync(join(OUT, 'hero'), { recursive: true });
  for (const w of [390, 640, 828, 1200]) {
    await sharp(HERO_SRC)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 62 })
      .toFile(join(OUT, 'hero', `home-hero-mohit-${w}.avif`));
  }
  await sharp(HERO_SRC)
    .rotate()
    .resize({ width: 640, withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUT, 'hero', 'home-hero-mohit-640.jpg'));
}

// ---------- alt text seed (en + pa, refined by hand / Phase 11) ----------
const A = {
  'dr-mohit-with-velys': {
    en: 'Dr. Mohit Gupta beside the VELYS robotic-assisted knee system in the operation theatre',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਆਪਰੇਸ਼ਨ ਥਿਏਟਰ ਵਿੱਚ VELYS ਰੋਬੋਟਿਕ ਗੋਡਾ ਪ੍ਰਣਾਲੀ ਨਾਲ',
  },
  'dr-mohit-gupta-scrubs': {
    en: 'Dr. Mohit Gupta, orthopaedic and joint replacement surgeon',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ, ਹੱਡੀਆਂ ਤੇ ਜੋੜ ਬਦਲਣ ਦੇ ਸਰਜਨ',
  },
  'dr-mohit-in-theatre': {
    en: 'Dr. Mohit Gupta in the operation theatre during a knee replacement',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਗੋਡਾ ਬਦਲਣ ਦੀ ਸਰਜਰੀ ਦੌਰਾਨ ਆਪਰੇਸ਼ਨ ਥਿਏਟਰ ਵਿੱਚ',
  },
  'dr-parul-gupta': {
    en: 'Dr. Parul Gupta, eye specialist at Gupta Hospital',
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ, ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੀ ਅੱਖਾਂ ਦੀ ਮਾਹਰ',
  },
  'dr-amit-gupta': {
    en: 'Dr. Amit Gupta, psychiatrist at Gupta Hospital',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ, ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੇ ਮਨੋਰੋਗ ਵਿਗਿਆਨੀ',
  },
  'dr-amrit-gupta': {
    en: 'Dr. Amrit Gupta, founder of Gupta Hospital',
    pa: 'ਡਾ. ਅਮ੍ਰਿਤ ਗੁਪਤਾ, ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੇ ਬਾਨੀ',
  },
  'building-front': {
    en: 'Gupta Hospital building on Power House Road, Bathinda',
    pa: 'ਪਾਵਰ ਹਾਊਸ ਰੋਡ, ਬਠਿੰਡਾ ਤੇ ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੀ ਇਮਾਰਤ',
  },
  'operation-theatre': {
    en: 'Operation theatre at Gupta Hospital',
    pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਦਾ ਆਪਰੇਸ਼ਨ ਥਿਏਟਰ',
  },
  'reception': { en: 'Reception area at Gupta Hospital', pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਦਾ ਰਿਸੈਪਸ਼ਨ' },
  'opd-corridor': {
    en: 'OPD corridor at Gupta Hospital',
    pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਦਾ OPD ਗਲਿਆਰਾ',
  },
  'day-care': { en: 'Day care room at Gupta Hospital', pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਦਾ ਡੇ-ਕੇਅਰ ਕਮਰਾ' },
  'eye-examination': {
    en: 'Eye examination in progress at Gupta Hospital',
    pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਵਿੱਚ ਅੱਖਾਂ ਦੀ ਜਾਂਚ',
  },
  'eye-exam-room': {
    en: 'Eye examination room at Gupta Hospital',
    pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਦਾ ਅੱਖਾਂ ਦੀ ਜਾਂਚ ਕਮਰਾ',
  },
  'psychiatry-clinic': {
    en: 'Psychiatry consultation room at Gupta Hospital',
    pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਦਾ ਮਨੋਰੋਗ ਸਲਾਹ ਕਮਰਾ',
  },
  'velys-surgery-theatre': {
    en: 'VELYS robotic-assisted knee replacement in the operation theatre',
    pa: 'ਆਪਰੇਸ਼ਨ ਥਿਏਟਰ ਵਿੱਚ VELYS ਰੋਬੋਟਿਕ ਗੋਡਾ ਬਦਲੀ',
  },
  'attune-implant': {
    en: 'ATTUNE knee implant system components',
    pa: 'ATTUNE ਗੋਡਾ ਇੰਪਲਾਂਟ ਪ੍ਰਣਾਲੀ ਦੇ ਹਿੱਸੇ',
  },
  'knee-xray': { en: 'Knee X-ray used during consultation', pa: 'ਸਲਾਹ ਦੌਰਾਨ ਵਰਤਿਆ ਗੋਡੇ ਦਾ ਐਕਸ-ਰੇ' },
  'home-hero-mohit': {
    en: 'Dr. Mohit Gupta, joint replacement surgeon at Gupta Hospital',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ, ਗੁਪਤਾ ਹਸਪਤਾਲ ਵਿੱਚ ਜੋੜ ਬਦਲਣ ਦੇ ਸਰਜਨ',
  },
  // Phase 11 new batch (resources/images/new -> photos/<stem>)
  'dr-mohit-gupta-desk': {
    en: 'Dr. Mohit Gupta at his desk in the orthopaedic clinic',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਹੱਡੀਆਂ ਦੇ ਕਲੀਨਿਕ ਵਿੱਚ ਆਪਣੇ ਡੈਸਕ ਤੇ',
  },
  'dr-parul-gupta-saree': {
    en: 'Dr. Parul Gupta in a navy saree in her clinic',
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਆਪਣੇ ਕਲੀਨਿਕ ਵਿੱਚ ਨੀਲੀ ਸਾੜੀ ਵਿੱਚ',
  },
  'dr-amit-gupta-office': {
    en: 'Dr. Amit Gupta in his office',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਆਪਣੇ ਦਫ਼ਤਰ ਵਿੱਚ',
  },
  'doctor-mohit-desk-portrait': {
    en: 'Dr. Mohit Gupta at his desk in the orthopaedic clinic',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਹੱਡੀਆਂ ਦੇ ਕਲੀਨਿਕ ਵਿੱਚ ਆਪਣੇ ਡੈਸਕ ਤੇ',
  },
  'doctor-parul-saree-avatar': {
    en: 'Dr. Parul Gupta in a navy saree in her clinic',
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਆਪਣੇ ਕਲੀਨਿਕ ਵਿੱਚ ਨੀਲੀ ਸਾੜੀ ਵਿੱਚ',
  },
  'doctor-amit-office-real-avatar': {
    en: 'Dr. Amit Gupta in his office',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਆਪਣੇ ਦਫ਼ਤਰ ਵਿੱਚ',
  },
  'doctor-amit-armchair-portrait': {
    en: 'Dr. Amit Gupta seated in the counselling room',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਸਲਾਹ ਕਮਰੇ ਵਿੱਚ ਬੈਠੇ',
  },
  'doctor-parul-clinic-portrait': {
    en: 'Dr. Parul Gupta in the eye clinic',
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਅੱਖਾਂ ਦੇ ਕਲੀਨਿਕ ਵਿੱਚ',
  },
  'home-doctors-banner-trio': {
    en: 'Dr. Mohit Gupta, Dr. Parul Gupta and Dr. Amit Gupta together at Gupta Hospital',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ, ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਤੇ ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਗੁਪਤਾ ਹਸਪਤਾਲ ਵਿੱਚ ਇਕੱਠੇ',
  },
  'about-legacy-family-four': {
    en: 'Dr. Amrit Gupta at his desk, with Dr. Mohit, Dr. Parul and Dr. Amit Gupta standing behind',
    pa: 'ਡਾ. ਅੰਮ੍ਰਿਤ ਗੁਪਤਾ ਆਪਣੇ ਡੈਸਕ ਤੇ, ਪਿੱਛੇ ਡਾ. ਮੋਹਿਤ, ਡਾ. ਪਾਰੁਲ ਤੇ ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਖੜ੍ਹੇ',
  },
  'about-camps-village': {
    en: "A doctor checks an elderly man's knee at a village health camp",
    pa: 'ਪਿੰਡ ਦੇ ਜਾਂਚ ਕੈਂਪ ਵਿੱਚ ਡਾਕਟਰ ਇੱਕ ਬਜ਼ੁਰਗ ਦਾ ਗੋਡਾ ਵੇਖਦੇ ਹਨ',
  },
  'ortho-hero-xray-consult': {
    en: 'Dr. Mohit Gupta explains a knee X-ray to an elderly couple',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਇੱਕ ਬਜ਼ੁਰਗ ਜੋੜੇ ਨੂੰ ਗੋਡੇ ਦਾ ਐਕਸ-ਰੇ ਸਮਝਾਉਂਦੇ ਹਨ',
  },
  'ortho-sports-physio-balance': {
    en: 'A physiotherapist guides a patient through a balance exercise',
    pa: 'ਫਿਜ਼ੀਓਥੈਰੇਪਿਸਟ ਮਰੀਜ਼ ਨੂੰ ਸੰਤੁਲਨ ਦੀ ਕਸਰਤ ਕਰਾਉਂਦਾ ਹੈ',
  },
  'ortho-knee-exam': {
    en: "Dr. Mohit Gupta examines a patient's knee",
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਮਰੀਜ਼ ਦੇ ਗੋਡੇ ਦੀ ਜਾਂਚ ਕਰਦੇ ਹਨ',
  },
  'ortho-recovery-walk': {
    en: 'A patient walks with a frame after knee surgery, helped by a physiotherapist',
    pa: 'ਗੋਡੇ ਦੀ ਸਰਜਰੀ ਤੋਂ ਬਾਅਦ ਫਿਜ਼ੀਓਥੈਰੇਪਿਸਟ ਦੀ ਮਦਦ ਨਾਲ ਮਰੀਜ਼ ਵਾਕਰ ਨਾਲ ਤੁਰਦਾ ਹੈ',
  },
  'ortho-recovery-walk-spare': {
    en: 'Dr. Mohit Gupta and a physiotherapist walk with a patient after knee replacement',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਅਤੇ ਫਿਜ਼ੀਓਥੈਰੇਪਿਸਟ ਗੋਡਾ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਮਰੀਜ਼ ਨਾਲ ਤੁਰਦੇ ਹਨ',
  },
  // Ortho sub-page photos (KH/FR/SP/BP batch — keep code filenames)
  'KH-1': {
    en: 'Dr. Mohit Gupta explains a knee model to an older couple',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਬਜ਼ੁਰਗ ਜੋੜੇ ਨੂੰ ਗੋਡੇ ਦਾ ਮਾਡਲ ਸਮਝਾਉਂਦੇ ਹੋਏ',
  },
  'FR-1': {
    en: "Dr. Mohit Gupta checks a young man's forearm cast",
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਇੱਕ ਨੌਜਵਾਨ ਦੀ ਬਾਂਹ ਦਾ ਪਲਸਤਰ ਜਾਂਚਦੇ ਹੋਏ',
  },
  'FR-2': {
    en: 'Dr. Mohit Gupta explains a hip fracture X-ray to a mother and son',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਮਾਂ ਅਤੇ ਪੁੱਤਰ ਨੂੰ ਚੂਲੇ ਦੇ ਫ੍ਰੈਕਚਰ ਦਾ ਐਕਸ-ਰੇ ਸਮਝਾਉਂਦੇ ਹੋਏ',
  },
  'SP-1': {
    en: 'Dr. Mohit Gupta tests the knee of a young athlete',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਇੱਕ ਨੌਜਵਾਨ ਖਿਡਾਰੀ ਦੇ ਗੋਡੇ ਦੀ ਜਾਂਚ ਕਰਦੇ ਹੋਏ',
  },
  'SP-2': {
    en: 'Knee arthroscopy in the operation theatre, with the camera view on a monitor',
    pa: 'ਅਪਰੇਸ਼ਨ ਥੀਏਟਰ ਵਿੱਚ ਗੋਡੇ ਦੀ ਆਰਥਰੋਸਕੋਪੀ, ਮਾਨੀਟਰ ਤੇ ਕੈਮਰੇ ਦਾ ਦ੍ਰਿਸ਼',
  },
  'BP-1': {
    en: 'Dr. Mohit Gupta explains a spine model to a man with back pain',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਕਮਰ ਦਰਦ ਵਾਲੇ ਆਦਮੀ ਨੂੰ ਰੀੜ੍ਹ ਦਾ ਮਾਡਲ ਸਮਝਾਉਂਦੇ ਹੋਏ',
  },
  'BP-2': {
    en: 'A physiotherapist guides a woman through a core exercise',
    pa: 'ਫਿਜ਼ੀਓਥੈਰੇਪਿਸਟ ਇੱਕ ਔਰਤ ਨੂੰ ਕੋਰ ਕਸਰਤ ਕਰਵਾਉਂਦੇ ਹੋਏ',
  },
  'robotic-hero-mohit-velys': {
    en: 'Dr. Mohit Gupta beside the VELYS robotic knee system in the operation theatre',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਆਪਰੇਸ਼ਨ ਥਿਏਟਰ ਵਿੱਚ VELYS ਰੋਬੋਟਿਕ ਗੋਡਾ ਪ੍ਰਣਾਲੀ ਨਾਲ',
  },
  'robotic-plan-screen': {
    en: 'Dr. Mohit Gupta points at the knee surgical plan on the VELYS screen',
    pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ VELYS ਸਕਰੀਨ ਤੇ ਗੋਡੇ ਦੀ ਸਰਜਰੀ ਯੋਜਨਾ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੇ ਹਨ',
  },
  'eye-hero-eye-model-consult': {
    en: 'Dr. Parul Gupta explains the parts of the eye on a model to two patients',
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਮਾਡਲ ਰਾਹੀਂ ਦੋ ਮਰੀਜ਼ਾਂ ਨੂੰ ਅੱਖ ਦੇ ਹਿੱਸੇ ਸਮਝਾਉਂਦੀ ਹੈ',
  },
  'eye-exam-slit-lamp': {
    en: "Dr. Parul Gupta checks a patient's eye with a slit lamp",
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਸਲਿੱਟ ਲੈਂਪ ਨਾਲ ਮਰੀਜ਼ ਦੀ ਅੱਖ ਦੀ ਜਾਂਚ ਕਰਦੀ ਹੈ',
  },
  'eye-cataract-day-surgery': {
    en: 'Dr. Parul Gupta performs cataract surgery under an operating microscope',
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਆਪਰੇਟਿੰਗ ਮਾਈਕ੍ਰੋਸਕੋਪ ਨਾਲ ਮੋਤੀਆ ਦੀ ਸਰਜਰੀ ਕਰਦੀ ਹੈ',
  },
  'eye-lens-iol-banner': {
    en: 'An artificial eye lens held on a gloved fingertip',
    pa: 'ਦਸਤਾਨੇ ਦੀ ਉੰਗਲੀ ਤੇ ਰੱਖਿਆ ਨਕਲੀ ਅੱਖ ਦਾ ਲੈਂਜ਼',
  },
  'eye-children-vision-test': {
    en: "Dr. Parul Gupta points at a picture chart during a child's eye test",
    pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਬੱਚੇ ਦੀ ਅੱਖ ਜਾਂਚ ਵਿੱਚ ਤਸਵੀਰ ਚਾਰਟ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੀ ਹੈ',
  },
  'mind-hero-counselling': {
    en: 'Dr. Amit Gupta listens to a patient during a counselling session',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਸਲਾਹ ਸੈਸ਼ਨ ਵਿੱਚ ਮਰੀਜ਼ ਦੀ ਗੱਲ ਸੁਣਦੇ ਹਨ',
  },
  'mind-family-session': {
    en: 'Dr. Amit Gupta talks with a family in the counselling room',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਸਲਾਹ ਕਮਰੇ ਵਿੱਚ ਇੱਕ ਪਰਿਵਾਰ ਨਾਲ ਗੱਲ ਕਰਦੇ ਹਨ',
  },
  'mind-deaddiction-walk': {
    en: 'Dr. Amit Gupta walks with a patient in the hospital grounds',
    pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੇ ਬਾਹਰਲੇ ਹਿੱਸੇ ਵਿੱਚ ਮਰੀਜ਼ ਨਾਲ ਤੁਰਦੇ ਹਨ',
  },
};
for (const f of list(join(OUT, 'photos'))) {
  const stem = f.replace(/\.(jpg|png)$/, '');
  const base = stem.replace(/-(hero|portrait|avatar)$/, '');
  if (A[stem]) altText[`photos/${stem}`] = A[stem];
  else if (A[base]) altText[`photos/${stem}`] = A[base];
}
altText['brand/logo'] = { en: 'Gupta Hospital Bathinda', pa: 'ਗੁਪਤਾ ਹਸਪਤਾਲ ਬਠਿੰਡਾ' };
altText['brand/nabh-badge'] = {
  en: 'NABH Entry Level Certified badge',
  pa: 'NABH ਐਂਟਰੀ ਲੈਵਲ ਸਰਟੀਫਾਈਡ ਬੈਜ',
};

writeFileSync(join(OUT, 'alt-text.json'), JSON.stringify(altText, null, 2));

// ---------- _todo.md ----------
const header = `# Image follow-ups

Generated by scripts/process-images.mjs. Resolve before launch (Phases 9-10).

## Flagged for attention
${todo.length ? todo.join('\n') : '- (none)'}

## Missing shots (per IMAGE-GUIDE, no slot should improvise)
- hero-candid / OPD scene (IMG-01)
- sports physiotherapy (IMG-03)
- lens counselling / optical shelf (IMG-07)
- counselling room wide (planned)
- community eye camp (IMG-10)
- Bathinda street / city establishing shot (for reach map or eye slider)
- Dr. Amrit Gupta original (IMG-14)

## New-image naming (Phase 11)
DM-* Dr. Mohit · DP-* Dr. Parul · DA-* Dr. Amit · DF-* Dr. Amrit/founder · IMG-* general
`;
writeFileSync(join(OUT, '_todo.md'), header);
console.log(`done. ${Object.keys(altText).length} alt entries, ${todo.length} follow-ups`);
