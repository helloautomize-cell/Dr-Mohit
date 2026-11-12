// Bilingual data for the interactive anatomy explorers, ported verbatim from
// the approved preview's inline script (KNEE and EYE maps). Each part carries
// [title, what it does, condition note] in English and Punjabi; the note may
// contain the <b> lead-in the preview uses.
import type { Locale } from '@/i18n/routing';

export type PartKey = string;
export type PartData = [title: string, desc: string, cond: string];

export type PartMap<K extends PartKey = PartKey> = Record<
  K,
  { en: PartData; pa: PartData }
>;

export const KNEE: PartMap<'cartilage' | 'meniscus' | 'acl' | 'side' | 'bone'> = {
  cartilage: {
    en: [
      'Cartilage',
      'A smooth, slippery layer on the ends of the bones that lets them glide.',
      '<b>Osteoarthritis:</b> the cartilage wears thin and the bones start to rub. Care ranges from exercise and medicines to knee replacement.',
    ],
    pa: [
      'ਕਾਰਟੀਲੇਜ',
      'ਹੱਡੀਆਂ ਦੇ ਸਿਰਿਆਂ ਤੇ ਚਿਕਨੀ ਪਰਤ, ਜਿਸ ਨਾਲ ਜੋੜ ਆਸਾਨੀ ਨਾਲ ਹਿੱਲਦਾ ਹੈ।',
      '<b>ਗਠੀਆ (ਓਸਟੀਓਆਰਥਰਾਈਟਿਸ):</b> ਕਾਰਟੀਲੇਜ ਘਸ ਜਾਂਦਾ ਹੈ ਅਤੇ ਹੱਡੀਆਂ ਰਗੜਨ ਲੱਗਦੀਆਂ ਹਨ। ਇਲਾਜ ਕਸਰਤ ਅਤੇ ਦਵਾਈ ਤੋਂ ਲੈ ਕੇ ਗੋਡਾ ਬਦਲਣ ਤੱਕ।',
    ],
  },
  meniscus: {
    en: [
      'Meniscus',
      'Two C-shaped cushions between the bones that absorb shock.',
      '<b>Meniscus tear:</b> often from a twist. It can cause locking or swelling, and some tears are treated by arthroscopy.',
    ],
    pa: [
      'ਮੇਨਿਸਕਸ',
      'ਹੱਡੀਆਂ ਵਿਚਕਾਰ ਦੋ ਗੱਦੀਆਂ ਜੋ ਝਟਕਾ ਸੋਖਦੀਆਂ ਹਨ।',
      '<b>ਮੇਨਿਸਕਸ ਫਟਣਾ:</b> ਅਕਸਰ ਮਰੋੜ ਨਾਲ। ਗੋਡਾ ਅੜ ਸਕਦਾ ਹੈ ਜਾਂ ਸੋਜ ਆ ਸਕਦੀ ਹੈ। ਕੁਝ ਮਾਮਲਿਆਂ ਵਿੱਚ ਆਰਥਰੋਸਕੋਪੀ ਨਾਲ ਇਲਾਜ।',
    ],
  },
  acl: {
    en: [
      'ACL',
      'A ligament inside the knee that stops the shin bone sliding forward.',
      '<b>ACL tear:</b> common in sports and falls, and the knee may give way. Arthroscopic reconstruction is one option.',
    ],
    pa: [
      'ACL ਲਿਗਾਮੈਂਟ',
      'ਗੋਡੇ ਦੇ ਅੰਦਰਲਾ ਲਿਗਾਮੈਂਟ ਜੋ ਪਿੰਨੀ ਦੀ ਹੱਡੀ ਨੂੰ ਅੱਗੇ ਖਿਸਕਣ ਤੋਂ ਰੋਕਦਾ ਹੈ।',
      '<b>ACL ਫਟਣਾ:</b> ਖੇਡਾਂ ਅਤੇ ਡਿੱਗਣ ਨਾਲ ਆਮ। ਗੋਡਾ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹੈ। ਆਰਥਰੋਸਕੋਪਿਕ ਸਰਜਰੀ ਇੱਕ ਵਿਕਲਪ ਹੈ।',
    ],
  },
  side: {
    en: [
      'Side ligaments',
      'Strong bands on the inner and outer side that keep the knee steady.',
      '<b>Sprains and tears:</b> usually after a blow or a fall, and often treated with a brace and physiotherapy.',
    ],
    pa: [
      'ਪਾਸੇ ਦੇ ਲਿਗਾਮੈਂਟ',
      'ਅੰਦਰਲੇ ਅਤੇ ਬਾਹਰਲੇ ਪਾਸੇ ਦੀਆਂ ਮਜ਼ਬੂਤ ਪੱਟੀਆਂ ਜੋ ਗੋਡੇ ਨੂੰ ਸਥਿਰ ਰੱਖਦੀਆਂ ਹਨ।',
      '<b>ਮੋਚ ਅਤੇ ਫਟਣਾ:</b> ਆਮ ਤੌਰ ਤੇ ਸੱਟ ਜਾਂ ਡਿੱਗਣ ਤੋਂ ਬਾਅਦ। ਅਕਸਰ ਬ੍ਰੇਸ ਅਤੇ ਫਿਜ਼ੀਓਥੈਰੇਪੀ ਨਾਲ ਇਲਾਜ।',
    ],
  },
  bone: {
    en: [
      'Bones',
      'The thigh bone and shin bone meet at the knee, with the thin fibula beside the shin.',
      '<b>Fractures and weak bones:</b> breaks after accidents or falls, and osteoporosis in older age.',
    ],
    pa: [
      'ਹੱਡੀਆਂ',
      'ਪੱਟ ਦੀ ਹੱਡੀ ਅਤੇ ਪਿੰਨੀ ਦੀ ਹੱਡੀ ਗੋਡੇ ਤੇ ਮਿਲਦੀਆਂ ਹਨ।',
      '<b>ਹੱਡੀ ਟੁੱਟਣਾ ਅਤੇ ਕਮਜ਼ੋਰ ਹੱਡੀਆਂ:</b> ਹਾਦਸੇ ਜਾਂ ਡਿੱਗਣ ਨਾਲ, ਅਤੇ ਵੱਡੀ ਉਮਰ ਵਿੱਚ ਓਸਟੀਓਪੋਰੋਸਿਸ।',
    ],
  },
};

export const EYE: PartMap<'cornea' | 'lens' | 'retina' | 'nerve'> = {
  cornea: {
    en: [
      'Cornea',
      'The clear front window of the eye. It bends incoming light and does most of the focusing.',
      '<b>Cornea problems:</b> infections, scratches and injuries. LASIK gently reshapes the cornea to reduce the need for glasses.',
    ],
    pa: [
      'ਕੋਰਨੀਆ',
      'ਅੱਖ ਦੀ ਸਾਫ਼ ਅਗਲੀ ਖਿੜਕੀ। ਇਹ ਅੰਦਰ ਆਉਂਦੀ ਰੋਸ਼ਨੀ ਨੂੰ ਮੋੜਦੀ ਹੈ।',
      '<b>ਕੋਰਨੀਆ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ:</b> ਇਨਫੈਕਸ਼ਨ ਅਤੇ ਸੱਟਾਂ। LASIK ਕੋਰਨੀਆ ਦੀ ਸ਼ਕਲ ਬਦਲ ਕੇ ਐਨਕਾਂ ਦੀ ਲੋੜ ਘਟਾਉਂਦਾ ਹੈ।',
    ],
  },
  lens: {
    en: [
      'Lens',
      'Sits just behind the pupil and fine-tunes focus so the picture lands sharply on the retina.',
      '<b>Cataract:</b> the lens slowly turns cloudy with age. In phaco surgery it is replaced with a clear artificial lens.',
    ],
    pa: [
      'ਲੈਂਜ਼',
      'ਪੁਤਲੀ ਦੇ ਪਿੱਛੇ ਹੁੰਦਾ ਹੈ ਅਤੇ ਤਸਵੀਰ ਨੂੰ ਰੈਟੀਨਾ ਤੇ ਸਾਫ਼ ਫੋਕਸ ਕਰਦਾ ਹੈ।',
      '<b>ਮੋਤੀਆ:</b> ਉਮਰ ਨਾਲ ਲੈਂਜ਼ ਧੁੰਦਲਾ ਹੋ ਜਾਂਦਾ ਹੈ। ਫੇਕੋ ਸਰਜਰੀ ਵਿੱਚ ਇਸ ਨੂੰ ਸਾਫ਼ ਨਕਲੀ ਲੈਂਜ਼ ਨਾਲ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ।',
    ],
  },
  retina: {
    en: [
      'Retina',
      'The light-sensitive layer at the back of the eye, working like the film in a camera.',
      '<b>Diabetic retinopathy:</b> long-term diabetes can damage the tiny blood vessels here. Regular checks help catch it early.',
    ],
    pa: [
      'ਰੈਟੀਨਾ',
      'ਅੱਖ ਦੇ ਪਿਛਲੇ ਪਾਸੇ ਰੋਸ਼ਨੀ ਮਹਿਸੂਸ ਕਰਨ ਵਾਲੀ ਪਰਤ, ਕੈਮਰਾ ਦੀ ਫ਼ਿਲਮ ਵਾਂਗ।',
      '<b>ਡਾਇਬੀਟਿਕ ਰੈਟੀਨੋਪੈਥੀ:</b> ਲੰਬੇ ਸਮੇਂ ਦੀ ਸ਼ੂਗਰ ਇੱਥੇ ਦੀਆਂ ਨਸਾਂ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦਾ ਹੈ। ਨਿਯਮਤ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ।',
    ],
  },
  nerve: {
    en: [
      'Optic nerve',
      'Carries the picture from the retina to the brain.',
      '<b>Glaucoma:</b> raised pressure inside the eye can slowly damage this nerve, often without pain. Pressure checks protect it.',
    ],
    pa: [
      'ਆਪਟਿਕ ਨਸ',
      'ਰੈਟੀਨਾ ਤੋਂ ਤਸਵੀਰ ਦਿਮਾਗ ਤੱਕ ਪਹੁੰਚਾਉਂਦੀ ਹੈ।',
      '<b>ਗਲੂਕੋਮਾ:</b> ਅੱਖ ਦਾ ਵਧਿਆ ਦਬਾਅ ਹੌਲੀ-ਹੌਲੀ ਇਸ ਨਸ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦਾ ਹੈ, ਅਕਸਰ ਬਿਨਾਂ ਦਰਦ ਦੇ।',
    ],
  },
};

/** Localized part data for a key. */
export function partText<K extends PartKey>(map: PartMap<K>, k: K, l: Locale): PartData {
  return map[k][l];
}

// Symptom-checker result text for 0 / 1-2 / 3+ selections — the preview sets
// these from JS, so they live here with their approved PA lines.
export const SYM_TEXTS: { en: string[]; pa: string[] } = {
  en: [
    'Tap what you feel.',
    'If this has lasted a few weeks, a check-up is a good idea.',
    'Together, these are worth showing to an orthopaedic doctor.',
  ],
  pa: [
    'ਜੋ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ ਉਸ ਤੇ ਟੈਪ ਕਰੋ।',
    'ਜੇ ਇਹ ਕੁਝ ਹਫ਼ਤਿਆਂ ਤੋਂ ਹੈ, ਤਾਂ ਇੱਕ ਵਾਰ ਜਾਂਚ ਕਰਵਾਉਣਾ ਚੰਗਾ ਹੈ।',
    'ਇਹ ਲੱਛਣ ਇਕੱਠੇ ਹੋਣ ਤਾਂ ਹੱਡੀਆਂ ਦੇ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਉਣਾ ਚੰਗਾ ਹੈ।',
  ],
};
