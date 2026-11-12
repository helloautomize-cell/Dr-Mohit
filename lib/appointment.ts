// Appointment form (master 9.1): field model, normalisation and validation
// shared verbatim by the client component and the server action so both
// enforce identical rules. Pure module — no React, no env access.

export const DEPTS = ['Orthopaedics', 'Robotic knee', 'Eye care', 'Mental health', 'Not sure'] as const;
export type Dept = (typeof DEPTS)[number];

export const DOCTORS = ['mohit', 'parul', 'amit', 'notsure'] as const;
export type DoctorId = (typeof DOCTORS)[number];

export const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'any'] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const LANGUAGES = ['Punjabi', 'Hindi', 'English'] as const;
export type Language = (typeof LANGUAGES)[number];

// Reason keys per department — translated strings come from messages/*.json
// (form.reasons.<dept> arrays, same order).
export const REASON_KEYS = {
  Orthopaedics: [
    'knee-pain', 'hip-pain', 'back-neck', 'sports-injury', 'fracture',
    'shoulder-elbow', 'foot-ankle', 'child-bone', 'other',
  ],
  'Robotic knee': ['knee-replacement', 'second-opinion', 'follow-up', 'other'],
  'Eye care': [
    'cataract', 'eye-checkup', 'diabetic-eye', 'child-eye', 'glasses',
    'lasik', 'other',
  ],
  'Mental health': [
    'counselling', 'deaddiction', 'stress-anxiety', 'sleep',
    'family-support', 'other',
  ],
  'Not sure': ['not-sure', 'other'],
} as const satisfies Record<Dept, readonly string[]>;

// ?reason= values arriving from the body-map finder (and other deep links)
// carry human labels, not reason keys — resolve them to dept+key pairs here.
const REASON_ALIASES: Record<string, { dept: Dept; key: string }> = {
  // finder labels (EN)
  'knee': { dept: 'Robotic knee', key: 'knee-replacement' },
  'hip': { dept: 'Orthopaedics', key: 'hip-pain' },
  'back & spine': { dept: 'Orthopaedics', key: 'back-neck' },
  'shoulder': { dept: 'Orthopaedics', key: 'shoulder-elbow' },
  'wrist & hand': { dept: 'Orthopaedics', key: 'other' },
  'eyes': { dept: 'Eye care', key: 'eye-checkup' },
  'mind': { dept: 'Mental health', key: 'counselling' },
  // finder labels (PA)
  'ਗੋਡਾ': { dept: 'Robotic knee', key: 'knee-replacement' },
  'ਕੁੱਲ੍ਹਾ': { dept: 'Orthopaedics', key: 'hip-pain' },
  'ਕਮਰ ਅਤੇ ਰੀੜ੍ਹ': { dept: 'Orthopaedics', key: 'back-neck' },
  'ਮੋਢਾ': { dept: 'Orthopaedics', key: 'shoulder-elbow' },
  'ਗੁੱਟ ਅਤੇ ਹੱਥ': { dept: 'Orthopaedics', key: 'other' },
  'ਅੱਖਾਂ': { dept: 'Eye care', key: 'eye-checkup' },
  'ਮਨ': { dept: 'Mental health', key: 'counselling' },
};

/**
 * Resolve a ?reason= param to a dept+reason-key pair, or null when unknown.
 * Accepts reason keys directly (`knee-pain`) and the alias labels above.
 */
export function resolveReasonParam(param: string): { dept: Dept; key: string } | null {
  const p = param.trim();
  if (!p) return null;
  for (const dept of DEPTS) {
    if ((REASON_KEYS[dept] as readonly string[]).includes(p)) return { dept, key: p };
  }
  return REASON_ALIASES[p.toLowerCase()] ?? REASON_ALIASES[p] ?? null;
}

export type AppointmentInput = {
  dept: Dept | '';
  name: string;
  phone: string;
  age: string; // raw text
  ageUnit: 'years' | 'months';
  doctor: DoctorId | '';
  reason: string; // key
  day: string; // yyyy-mm-dd or ''
  time: TimeSlot | '';
  language: Language | '';
  city: string;
  message: string;
  under18: boolean;
  guardian: string;
  consent: boolean;
  // anti-spam
  website: string; // honeypot — must stay empty
  startedAt: string; // ms epoch from the client; '' when unknown
};

export type FieldError = keyof Pick<
  AppointmentInput,
  'dept' | 'name' | 'phone' | 'age' | 'doctor' | 'reason' | 'day' | 'time' | 'language' | 'under18' | 'guardian' | 'consent'
>;

export type AppointmentErrors = Partial<Record<FieldError, true>>;

/** "+91" + 10 digits starting 6–9, or null. */
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, '');
  let local = d;
  if (d.length === 12 && d.startsWith('91')) local = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) local = d.slice(1);
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return `+91${local}`;
}

export function ageInYears(age: string, unit: 'years' | 'months'): number | null {
  if (age.trim() === '') return null;
  const n = Number(age);
  if (!Number.isFinite(n) || n < 0 || n > 150) return null;
  return unit === 'months' ? n / 12 : n;
}

/** Preferred date must be today → today+60 (Asia/Kolkata calendar). */
export function validDay(day: string): boolean {
  if (!day) return true; // optional
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return false;
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const today = ist.toISOString().slice(0, 10);
  const max = new Date(ist.getTime() + 60 * 86400_000).toISOString().slice(0, 10);
  return day >= today && day <= max;
}

export function isSunday(day: string): boolean {
  if (!validDay(day)) return false;
  return new Date(`${day}T00:00:00+05:30`).getDay() === 0;
}

export function validate(input: AppointmentInput): AppointmentErrors {
  const e: AppointmentErrors = {};
  if (!DEPTS.includes(input.dept as Dept)) e.dept = true;
  if (input.name.trim().length < 2) e.name = true;
  if (!normalizePhone(input.phone)) e.phone = true;
  const years = ageInYears(input.age, input.ageUnit);
  if (years === null || years > 120) e.age = true;
  if (!DOCTORS.includes(input.doctor as DoctorId)) e.doctor = true;
  const dept = input.dept as Dept;
  const reasons: readonly string[] = DEPTS.includes(dept) ? REASON_KEYS[dept] : [];
  if (!reasons.includes(input.reason)) e.reason = true;
  if (!validDay(input.day)) e.day = true;
  if (input.time && !TIME_SLOTS.includes(input.time as TimeSlot)) e.time = true;
  if (!LANGUAGES.includes(input.language as Language)) e.language = true;
  const under18 = years !== null && years < 18;
  if (under18 && !input.under18) e.under18 = true;
  if ((under18 || input.under18) && input.guardian.trim().length < 2) e.guardian = true;
  if (!input.consent) e.consent = true;
  return e;
}

export function isBot(input: AppointmentInput): boolean {
  if (input.website.trim() !== '') return true;
  const started = Number(input.startedAt);
  if (Number.isFinite(started) && started > 0 && Date.now() - started < 3000) return true;
  return false;
}

export function readForm(fd: FormData): AppointmentInput {
  const s = (k: string) => String(fd.get(k) ?? '');
  return {
    dept: s('dept') as AppointmentInput['dept'],
    name: s('name'),
    phone: s('phone'),
    age: s('age'),
    ageUnit: s('ageUnit') === 'months' ? 'months' : 'years',
    doctor: s('doctor') as AppointmentInput['doctor'],
    reason: s('reason'),
    day: s('day'),
    time: s('time') as AppointmentInput['time'],
    language: s('language') as AppointmentInput['language'],
    city: s('city'),
    message: s('message'),
    under18: s('under18') === 'on' || s('under18') === 'true',
    guardian: s('guardian'),
    consent: s('consent') === 'on' || s('consent') === 'true',
    website: s('website'),
    startedAt: s('startedAt'),
  };
}

/** Consent wording recorded in the email + shown beside the checkbox. */
export const CONSENT_TEXT = {
  en: 'I agree that Gupta Hospital may contact me about this appointment request.',
  pa: 'ਮੈਂ ਸਹਿਮਤ ਹਾਂ ਕਿ ਗੁਪਤਾ ਹਸਪਤਾਲ ਇਸ ਅਪੌਇੰਟਮੈਂਟ ਬਾਰੇ ਮੇਰੇ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦਾ ਹੈ।',
} as const;
