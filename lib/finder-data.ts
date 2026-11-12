// Body-map doctor finder data, ported verbatim from the approved preview's
// inline script (prototype.html). This is tool data, not page copy: the content
// JSON does not carry per-body-part condition lists.
import type { Locale } from '@/i18n/routing';

export type DocKey = 'mohit' | 'parul' | 'amit';
export type AreaKey = 'knee' | 'hip' | 'back' | 'shoulder' | 'hand' | 'eye' | 'mind';

export type FinderArea = {
  doc: DocKey;
  c: string;
  en: string[];
  pa: string[];
  more: string;
  dept: string;
};

export const FD: Record<AreaKey, FinderArea> = {
  knee: {
    doc: 'mohit',
    c: 'var(--brand)',
    en: ['Knee', 'Knee arthritis', 'Ligament (ACL) tears', 'Meniscus injury', 'Robotic knee replacement'],
    pa: ['ਗੋਡਾ', 'ਗੋਡਿਆਂ ਦਾ ਗਠੀਆ', 'ਲਿਗਾਮੈਂਟ (ACL) ਫਟਣਾ', 'ਮੇਨਿਸਕਸ ਦੀ ਸੱਟ', 'ਰੋਬੋਟਿਕ ਗੋਡਾ ਬਦਲਣਾ'],
    more: '/orthopaedics/robotic-knee-replacement/',
    dept: 'Robotic knee',
  },
  hip: {
    doc: 'mohit',
    c: 'var(--brand)',
    en: ['Hip', 'Hip arthritis', 'Fracture after a fall', 'Hip replacement'],
    pa: ['ਕੁੱਲ੍ਹਾ', 'ਕੁੱਲ੍ਹੇ ਦਾ ਗਠੀਆ', 'ਡਿੱਗਣ ਨਾਲ ਹੱਡੀ ਟੁੱਟਣਾ', 'ਕੁੱਲ੍ਹਾ ਬਦਲਣਾ'],
    more: '/orthopaedics/',
    dept: 'Orthopaedics',
  },
  back: {
    doc: 'mohit',
    c: 'var(--brand)',
    en: ['Back & spine', 'Low back pain', 'Sciatica', 'Slip disc', 'Neck pain'],
    pa: ['ਕਮਰ ਅਤੇ ਰੀੜ੍ਹ', 'ਕਮਰ ਦਰਦ', 'ਸਾਇਟਿਕਾ', 'ਸਲਿੱਪ ਡਿਸਕ', 'ਗਰਦਨ ਦਰਦ'],
    more: '/orthopaedics/',
    dept: 'Orthopaedics',
  },
  shoulder: {
    doc: 'mohit',
    c: 'var(--brand)',
    en: ['Shoulder', 'Frozen shoulder', 'Rotator cuff tear', 'Dislocation'],
    pa: ['ਮੋਢਾ', 'ਜੰਮਿਆ ਮੋਢਾ', 'ਰੋਟੇਟਰ ਕਫ਼ ਫਟਣਾ', 'ਮੋਢਾ ਉਤਰਨਾ'],
    more: '/orthopaedics/',
    dept: 'Orthopaedics',
  },
  hand: {
    doc: 'mohit',
    c: 'var(--brand)',
    en: ['Wrist & hand', 'Wrist fracture', 'Carpal tunnel', 'Tennis elbow'],
    pa: ['ਗੁੱਟ ਅਤੇ ਹੱਥ', 'ਗੁੱਟ ਦੀ ਹੱਡੀ ਟੁੱਟਣਾ', 'ਕਾਰਪਲ ਟਨਲ', 'ਟੈਨਿਸ ਐਲਬੋ'],
    more: '/orthopaedics/',
    dept: 'Orthopaedics',
  },
  eye: {
    doc: 'parul',
    c: 'var(--leaf)',
    en: ['Eyes', 'Cataract', 'Glaucoma', 'Diabetic eye checks', "Children's eyes"],
    pa: ['ਅੱਖਾਂ', 'ਮੋਤੀਆ', 'ਕਾਲਾ ਮੋਤੀਆ (ਗਲੂਕੋਮਾ)', 'ਸ਼ੂਗਰ ਵਿੱਚ ਅੱਖਾਂ ਦੀ ਜਾਂਚ', 'ਬੱਚਿਆਂ ਦੀਆਂ ਅੱਖਾਂ'],
    more: '/eye-care/',
    dept: 'Eye care',
  },
  mind: {
    doc: 'amit',
    c: 'var(--teal)',
    en: ['Mind', 'Stress & anxiety', 'Low mood', 'Sleep problems', 'Addiction'],
    pa: ['ਮਨ', 'ਤਣਾਅ ਅਤੇ ਘਬਰਾਹਟ', 'ਉਦਾਸੀ', 'ਨੀਂਦ ਦੀ ਸਮੱਸਿਆ', 'ਨਸ਼ਾ'],
    more: '/mental-health/',
    dept: 'Mental health',
  },
};

export const DOCS: Record<
  DocKey,
  { n: { en: string; pa: string }; f: { en: string; pa: string }; d: { en: string; pa: string }; img: string }
> = {
  mohit: {
    n: { en: 'Dr. Mohit Gupta', pa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ' },
    f: { en: 'Dr. Mohit', pa: 'ਡਾ. ਮੋਹਿਤ' },
    d: { en: 'Orthopaedics & joint replacement', pa: 'ਹੱਡੀਆਂ ਅਤੇ ਜੋੜ ਬਦਲਣਾ' },
    img: '/images/photos/dr-mohit-gupta-desk-avatar.jpg',
  },
  parul: {
    n: { en: 'Dr. Parul Gupta', pa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ' },
    f: { en: 'Dr. Parul', pa: 'ਡਾ. ਪਾਰੁਲ' },
    d: { en: 'Eye care', pa: 'ਅੱਖਾਂ ਦਾ ਵਿਭਾਗ' },
    img: '/images/photos/dr-parul-gupta-saree-avatar.jpg',
  },
  amit: {
    n: { en: 'Dr. Amit Gupta', pa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ' },
    f: { en: 'Dr. Amit', pa: 'ਡਾ. ਅਮਿਤ' },
    d: { en: 'Mental health & de-addiction', pa: 'ਮਾਨਸਿਕ ਸਿਹਤ ਅਤੇ ਨਸ਼ਾ ਛੁਡਾਊ' },
    img: '/images/photos/dr-amit-gupta-office-avatar.jpg',
  },
};

export const FINDER_ORDER: AreaKey[] = ['knee', 'hip', 'back', 'shoulder', 'hand', 'eye', 'mind'];

// Hotspot positions on the 240x470 body-map viewBox, from the preview markup.
export const HOTSPOTS: { k: AreaKey; cx: number; cy: number; ring: number; dot: number; cls?: string }[] = [
  { k: 'mind', cx: 120, cy: 26, ring: 9, dot: 8, cls: 't' },
  { k: 'eye', cx: 134, cy: 62, ring: 9, dot: 8, cls: 'g' },
  { k: 'shoulder', cx: 86, cy: 112, ring: 10, dot: 9 },
  { k: 'back', cx: 120, cy: 165, ring: 10, dot: 9 },
  { k: 'hip', cx: 138, cy: 222, ring: 10, dot: 9 },
  { k: 'knee', cx: 98, cy: 330, ring: 10, dot: 9 },
  { k: 'hand', cx: 186, cy: 262, ring: 10, dot: 9 },
];

export function areaLabels(k: AreaKey, locale: Locale): string[] {
  return locale === 'pa' ? FD[k].pa : FD[k].en;
}
