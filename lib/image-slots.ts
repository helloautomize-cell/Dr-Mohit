// Image slot registry (IMAGE-GUIDE contract). One photo per slot; a photo never
// repeats across slots except doctor avatars/cards. `src` is empty when the shot
// does not exist yet -> ImageSlot renders the .aimg placeholder with the planned
// filename label.
import altText from '../public/images/alt-text.json';
import type { Locale } from '../i18n/routing';

export type Slot = {
  src?: string;
  alt: { en: string; pa: string };
  ratio?: string; // CSS aspect-ratio, e.g. '4/5'
  focal?: string; // CSS object-position, e.g. '50% 20%'
  sizes?: string;
  note?: string; // planned replacement (IMG-xx / DM-x code) for placeholders
};

const A = altText as Record<string, { en: string; pa: string }>;
const alt = (stem: string, fallback?: { en: string; pa: string }) =>
  A[stem] ?? fallback ?? { en: '', pa: '' };

export const SLOTS: Record<string, Slot> = {
  'home.hero': {
    src: '/images/photos/dr-mohit-with-velys-hero.jpg',
    alt: alt('photos/dr-mohit-with-velys'),
    ratio: '4/5',
    focal: '50% 30%',
    sizes: '(max-width:900px) 92vw, 42vw',
  },
  'home.story': {
    src: '/images/photos/building-front.jpg',
    alt: alt('photos/building-front'),
    ratio: '5/4',
    sizes: '(max-width:900px) 92vw, 46vw',
  },
  'home.feature-ot': {
    src: '/images/photos/operation-theatre.jpg',
    alt: alt('photos/operation-theatre'),
    ratio: '21/9',
    sizes: '(max-width:900px) 92vw, 76vw',
  },
  'home.fac-1': {
    src: '/images/photos/reception.jpg',
    alt: alt('photos/reception'),
    ratio: '3/4',
    sizes: '(max-width:900px) 30vw, 21vw',
  },
  'home.fac-2': {
    src: '/images/photos/opd-corridor.jpg',
    alt: alt('photos/opd-corridor'),
    ratio: '3/4',
    sizes: '(max-width:900px) 30vw, 21vw',
  },
  'home.fac-3': {
    src: '/images/photos/day-care.jpg',
    alt: alt('photos/day-care'),
    ratio: '3/4',
    sizes: '(max-width:900px) 30vw, 21vw',
  },
  'home.first-visit': {
    src: '/images/photos/dr-mohit-gupta-desk-avatar.jpg',
    alt: alt('photos/dr-mohit-gupta-desk-avatar'),
    ratio: '1/1',
  },
  'home.doc-mohit': {
    src: '/images/photos/dr-mohit-gupta-desk-portrait.jpg',
    alt: alt('photos/dr-mohit-gupta-desk-portrait'),
    ratio: '4/5',
    focal: '50% 35%',
  },
  'home.doc-parul': {
    src: '/images/photos/dr-parul-gupta-saree-portrait.jpg',
    alt: alt('photos/dr-parul-gupta-saree-portrait'),
    ratio: '4/5',
    focal: '50% 30%',
  },
  'home.doc-amit': {
    src: '/images/photos/dr-amit-gupta-office-portrait.jpg',
    alt: alt('photos/dr-amit-gupta-office-portrait'),
    ratio: '4/5',
    focal: '52% 35%',
  },
  'home.doctors-banner': {
    src: '/images/photos/home-doctors-banner-trio.jpg',
    alt: alt('photos/home-doctors-banner-trio'),
    ratio: '16/9',
    focal: '50% 40%',
  },

  'ortho.hero': {
    src: '/images/photos/ortho-hero-xray-consult.jpg',
    alt: alt('photos/ortho-hero-xray-consult'),
    // v14 updated frame: portrait 4/4.4 (matches the new sub-page heroes)
    ratio: '4/4.4',
    focal: '72% 35%',
  },
  'ortho.sports': {
    src: '/images/photos/ortho-sports-physio-balance.jpg',
    alt: alt('photos/ortho-sports-physio-balance'),
    ratio: '3/4',
    focal: '50% 45%',
  },
  'ortho.exam': {
    src: '/images/photos/ortho-knee-exam.jpg',
    alt: alt('photos/ortho-knee-exam'),
    ratio: '4/3',
    focal: '40% 45%',
  },
  'ortho.recovery': {
    src: '/images/photos/ortho-recovery-walk.jpg',
    alt: alt('photos/ortho-recovery-walk'),
    ratio: '16/9',
    focal: '50% 50%',
  },
  // v14 ortho sub-pages: hero slots stay placeholders until the photos arrive.
  // Alt copy lives in ortho-subpages.en-pa.json (the aimg aria-labels).
  'ortho.kh.hero': {
    alt: {
      en: 'Dr. Mohit Gupta explains a knee and hip model to an older couple',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਬਜ਼ੁਰਗ ਜੋੜੇ ਨੂੰ ਗੋਡੇ ਅਤੇ ਚੂਲੇ ਦਾ ਮਾਡਲ ਸਮਝਾਉਂਦੇ ਹੋਏ',
    },
    ratio: '4/4.4',
    note: 'KH-1',
  },
  'ortho.fr.hero': {
    alt: {
      en: 'Dr. Mohit Gupta checks a forearm cast on a young man',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਇੱਕ ਨੌਜਵਾਨ ਦੀ ਬਾਂਹ ਦਾ ਪਲਸਤਰ ਜਾਂਚਦੇ ਹੋਏ',
    },
    ratio: '4/4.4',
    note: 'FR-1',
  },
  'ortho.sp.hero': {
    alt: {
      en: 'Dr. Mohit Gupta tests the knee stability of a young athlete',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਇੱਕ ਨੌਜਵਾਨ ਖਿਡਾਰੀ ਦੇ ਗੋਡੇ ਦੀ ਮਜ਼ਬੂਤੀ ਜਾਂਚਦੇ ਹੋਏ',
    },
    ratio: '4/4.4',
    note: 'SP-1',
  },
  'ortho.bp.hero': {
    alt: {
      en: 'Dr. Mohit Gupta explains a spine model to a man with back pain',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਕਮਰ ਦਰਦ ਵਾਲੇ ਆਦਮੀ ਨੂੰ ਰੀੜ੍ਹ ਦਾ ਮਾਡਲ ਸਮਝਾਉਂਦੇ ਹੋਏ',
    },
    ratio: '4/4.4',
    note: 'BP-1',
  },
  // "Getting home ready" on knee-and-hip uses the spare recovery photo
  // (resources/images/new/ortho-recovery-walk-SPARE.jpg — now in use).
  'ortho.kh.recovery': {
    src: '/images/photos/ortho-recovery-walk-spare.jpg',
    alt: {
      // pa translation ours (alt not in the supplied JSON) — flag in report.
      en: 'Dr. Mohit Gupta and a physiotherapist walk with a patient after knee replacement',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਅਤੇ ਫਿਜ਼ੀਓਥੈਰੇਪਿਸਟ ਗੋਡਾ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਮਰੀਜ਼ ਨਾਲ ਤੁਰਦੇ ਹਨ',
    },
    ratio: '16/9',
    focal: '50% 45%',
  },
  'ortho.fr.xray': {
    alt: {
      en: 'Dr. Mohit Gupta reviews a fracture X-ray with plates on screen',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਸਕਰੀਨ ਤੇ ਪਲੇਟਾਂ ਵਾਲਾ ਫ੍ਰੈਕਚਰ ਐਕਸ-ਰੇ ਦੇਖਦੇ ਹੋਏ',
    },
    ratio: '4/3',
    note: 'FR-2',
  },
  'ortho.sp.scope': {
    alt: {
      en: 'Dr. Mohit Gupta performs knee arthroscopy, watching the camera view on a monitor',
      pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਮਾਨੀਟਰ ਤੇ ਕੈਮਰਾ ਦੇਖਦੇ ਹੋਏ ਗੋਡੇ ਦੀ ਆਰਥਰੋਸਕੋਪੀ ਕਰਦੇ ਹੋਏ',
    },
    ratio: '4/3',
    note: 'SP-2',
  },
  'ortho.bp.physio': {
    alt: {
      en: 'A physiotherapist guides a woman through a core exercise for back pain',
      pa: 'ਫਿਜ਼ੀਓਥੈਰੇਪਿਸਟ ਕਮਰ ਦਰਦ ਲਈ ਇੱਕ ਔਰਤ ਨੂੰ ਕੋਰ ਕਸਰਤ ਕਰਵਾਉਂਦੇ ਹੋਏ',
    },
    ratio: '4/3',
    note: 'BP-2',
  },

  'robotic.hero': {
    src: '/images/photos/robotic-hero-mohit-velys.jpg',
    alt: alt('photos/robotic-hero-mohit-velys'),
    // map note: a 4:5 frame would cut the VELYS machine, so this hero stays 5:4
    ratio: '5/4',
    focal: '62% 45%',
  },
  'robotic.plan': {
    src: '/images/photos/robotic-plan-screen.jpg',
    alt: alt('photos/robotic-plan-screen'),
    ratio: '16/9',
    focal: '55% 45%',
  },
  'robotic.velys': {
    src: '/images/photos/velys-surgery-theatre.jpg',
    alt: alt('photos/velys-surgery-theatre'),
    ratio: '16/10',
  },
  'robotic.attune': {
    src: '/images/photos/attune-implant.jpg',
    alt: alt('photos/attune-implant'),
    ratio: '16/10',
  },

  'eye.hero': {
    src: '/images/photos/doctor-parul-clinic-portrait.jpg',
    alt: alt('photos/doctor-parul-clinic-portrait'),
    ratio: '4/5',
    focal: '48% 35%',
  },
  'eye.explain': {
    src: '/images/photos/eye-hero-eye-model-consult.jpg',
    alt: alt('photos/eye-hero-eye-model-consult'),
    ratio: '16/9',
    focal: '50% 40%',
  },
  'eye.exam': {
    src: '/images/photos/eye-exam-slit-lamp.jpg',
    alt: alt('photos/eye-exam-slit-lamp'),
    ratio: '4/3',
    focal: '45% 40%',
  },
  'eye.cataract-day': {
    src: '/images/photos/eye-cataract-day-surgery.jpg',
    alt: alt('photos/eye-cataract-day-surgery'),
    ratio: '3/4',
    focal: '40% 45%',
  },
  'eye.lens': {
    src: '/images/photos/eye-lens-iol-banner.jpg',
    alt: alt('photos/eye-lens-iol-banner'),
    ratio: '3/1',
    focal: '68% 55%',
  },
  'eye.children': {
    src: '/images/photos/eye-children-vision-test.jpg',
    alt: alt('photos/eye-children-vision-test'),
    ratio: '16/9',
    focal: '62% 40%',
  },
  // eye-exam-room is unused elsewhere, so it satisfies the "calm scene, not
  // repeated" rule for the cataract vision slider.
  'eye.slider': {
    src: '/images/photos/eye-exam-room.jpg',
    alt: alt('photos/eye-exam-room'),
    ratio: '16/10',
  },

  'mind.hero': {
    src: '/images/photos/doctor-amit-armchair-portrait.jpg',
    alt: alt('photos/doctor-amit-armchair-portrait'),
    ratio: '4/5',
    focal: '48% 35%',
  },
  'mind.first-session': {
    src: '/images/photos/mind-hero-counselling.jpg',
    alt: alt('photos/mind-hero-counselling'),
    ratio: '3/2',
    focal: '60% 40%',
  },
  'mind.faq': {
    src: '/images/photos/psychiatry-clinic.jpg',
    alt: alt('photos/psychiatry-clinic'),
    ratio: '4/3',
  },
  'mind.family': {
    src: '/images/photos/mind-family-session.jpg',
    alt: alt('photos/mind-family-session'),
    ratio: '3/2',
    focal: '50% 40%',
  },
  'mind.deaddiction': {
    src: '/images/photos/mind-deaddiction-walk.jpg',
    alt: alt('photos/mind-deaddiction-walk'),
    ratio: '4/5',
    focal: '40% 40%',
  },

  'doctors.mohit': {
    src: '/images/photos/dr-mohit-gupta-desk-hero.jpg',
    alt: alt('photos/dr-mohit-gupta-desk-hero'),
    ratio: '4/5',
    focal: '50% 35%',
  },
  'doctors.parul': {
    src: '/images/photos/dr-parul-gupta-saree-hero.jpg',
    alt: alt('photos/dr-parul-gupta-saree-hero'),
    ratio: '4/5',
    focal: '50% 30%',
  },
  'doctors.amit': {
    src: '/images/photos/dr-amit-gupta-office-hero.jpg',
    alt: alt('photos/dr-amit-gupta-office-hero'),
    ratio: '4/5',
    focal: '52% 35%',
  },

  'about.founder': {
    src: '/images/photos/dr-amrit-gupta-hero.jpg',
    alt: alt('photos/dr-amrit-gupta'),
    ratio: '4/5',
  },
  'about.camps': {
    src: '/images/photos/about-camps-village.jpg',
    alt: alt('photos/about-camps-village'),
    ratio: '4/3',
    focal: '60% 50%',
  },
  'about.legacy': {
    src: '/images/photos/about-legacy-family-four.jpg',
    alt: alt('photos/about-legacy-family-four'),
    ratio: '3/2',
    focal: '50% 40%',
  },
};

export type SlotId = keyof typeof SLOTS;

export function slot(id: SlotId): Slot {
  const s = SLOTS[id];
  if (!s) throw new Error(`image slot "${id}" is not registered`);
  return s;
}

export function slotAlt(id: SlotId, locale: Locale) {
  const s = SLOTS[id];
  return s ? (locale === 'pa' ? s.alt.pa : s.alt.en) : '';
}
