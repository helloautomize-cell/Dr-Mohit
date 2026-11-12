// One-off generator: 3 doctor profile routes (facts from facts-and-compliance.md).
import fs from 'node:fs';
import path from 'node:path';

const P = 'app/[locale]/doctors';
const write = (slug, facts) => {
  fs.mkdirSync(path.join(P, slug), { recursive: true });
  fs.writeFileSync(path.join(P, slug, 'page.tsx'), `import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { DoctorProfile, type DoctorFacts } from '@/components/DoctorProfile';

const D: DoctorFacts = ${JSON.stringify(facts, null, 2)};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <DoctorProfile d={D} locale={locale as Locale} />;
}
`);
};

write('dr-mohit-gupta', {
  name: 'Dr. Mohit Gupta',
  dept: 'Orthopaedics & joint replacement',
  slot: 'doctors.mohit',
  qualifications: [
    { text: 'D.Ortho, MS Ortho, MCh Ortho' },
    { text: 'Punjab Medical Council reg. no. 43354' },
    { text: 'Fellowships: Asklepios Klinik Lindenlohe (Germany), Fribourg cantonal hospital (Switzerland)' },
  ],
  languages: 'English, Hindi, Punjabi',
  about: [
    'Dr. Mohit Gupta leads the orthopaedics department at Gupta Hospital, Bathinda. The department began as an orthopaedic clinic in 1980 and now offers joint replacement, fracture care, sports injuries and the back pain clinic, including robotic-assisted knee replacement with the Johnson & Johnson VELYS system.',
  ],
  howWorks: [
    'Listens first, then examines the joint and reads the imaging himself.',
    'Explains options from exercise and medicines to surgery in plain words.',
    'Performs the surgery himself and follows the same patient through recovery.',
  ],
  chips: [
    'Robotic knee replacement', 'Knee & hip replacement', 'Fractures & trauma',
    'Arthroscopy & sports injuries', 'Back pain clinic', 'Orthopaedics department',
  ],
});

write('dr-parul-gupta', {
  name: 'Dr. Parul Gupta',
  dept: 'Ophthalmology',
  slot: 'doctors.parul',
  qualifications: [
    { text: 'MBBS, MS', confirmId: 'parul-degrees' },
    { text: 'Specialised training in phacoemulsification cataract surgery' },
  ],
  languages: 'English, Hindi, Punjabi',
  about: [
    'Dr. Parul Gupta leads the eye department at Gupta Hospital with its own operation theatre. She is specially trained in phacoemulsification cataract surgery, with several years of dedicated eye-care practice.',
  ],
  howWorks: [
    'Checks vision and eye health in one visit where possible.',
    'Explains lens options for cataract surgery in plain words.',
    'Same-day phaco surgery with a next-day check-up.',
  ],
  chips: [
    'Phaco cataract surgery', 'Glaucoma', 'Retina check', "Children's eyes",
    'Eye care department',
  ],
});

write('dr-amit-gupta', {
  name: 'Dr. Amit Gupta',
  dept: 'Psychiatry & de-addiction',
  slot: 'doctors.amit',
  qualifications: [
    { text: 'MD Psychiatry', confirmId: 'amit-md' },
    { text: 'Psychiatry consultant & de-addiction specialist since 2000' },
    { text: 'Runs the licensed de-addiction centre' },
  ],
  languages: 'English, Hindi, Punjabi',
  about: [
    'Dr. Amit Gupta has worked with families across Malwa since 2000 on stress, anxiety, low mood, sleep and addiction. He heads the mental health department and the licensed de-addiction centre at Gupta Hospital.',
  ],
  howWorks: [
    'Private, unhurried conversations; families welcome when helpful.',
    'Treatment plans combine medicines, therapy and follow-up visits.',
    'De-addiction care with licensed protocols at the centre.',
  ],
  chips: [
    'Stress & anxiety', 'Depression', 'Sleep problems', 'De-addiction',
    'Licensed de-addiction centre', 'Mental health department',
  ],
});

console.log('doctor pages written');
