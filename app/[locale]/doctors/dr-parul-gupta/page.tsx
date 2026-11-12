import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { DoctorProfile, type DoctorFacts } from '@/components/DoctorProfile';
import { alternates, physicianLd, SITE_BASE } from '@/lib/seo';
import { slot } from '@/lib/image-slots';

const D: DoctorFacts = {
  "name": "Dr. Parul Gupta",
  "namePa": "ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ",
  "dept": "Ophthalmology",
  "deptPa": "ਨੇਤਰ ਵਿਗਿਆਨ",
  "slot": "doctors.parul",
  "qualifications": [
    {
      "text": "MBBS, MS",
      "confirmId": "parul-degrees"
    },
    {
      "text": "Specialised training in phacoemulsification cataract surgery"
    }
  ],
  "languages": "English, Hindi, Punjabi",
  "languagesPa": "ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ, ਪੰਜਾਬੀ",
  "about": [
    "Dr. Parul Gupta leads the eye department at Gupta Hospital with its own operation theatre. She is specially trained in phacoemulsification cataract surgery, with several years of dedicated eye-care practice."
  ],
  "aboutPa": [
    "ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੇ ਅੱਖਾਂ ਵਿਭਾਗ ਦੀ ਅਗਵਾਈ ਕਰਦੀ ਹੈ, ਜਿਸ ਦਾ ਆਪਣਾ ਆਪਰੇਸ਼ਨ ਥੀਏਟਰ ਹੈ। ਉਹ ਫੇਕੋਇਮਲਸਿਫਿਕੇਸ਼ਨ ਮੋਤੀਆਬਿੰਦ ਸਰਜਰੀ ਵਿੱਚ ਖ਼ਾਸ ਸਿਖਲਾਈ ਪ੍ਰਾਪਤ ਹੈ ਅਤੇ ਕਈ ਸਾਲਾਂ ਤੋਂ ਅੱਖਾਂ ਦੀ ਦੇਖਭਾਲ ਕਰ ਰਹੀ ਹੈ।"
  ],
  "howWorks": [
    "Checks vision and eye health in one visit where possible.",
    "Explains lens options for cataract surgery in plain words.",
    "Same-day phaco surgery with a next-day check-up."
  ],
  "howWorksPa": [
    "ਜਿੱਥੇ ਸੰਭਵ ਹੋਵੇ, ਇੱਕ ਹੀ ਮੁਲਾਕਾਤ ਵਿੱਚ ਨਜ਼ਰ ਤੇ ਅੱਖਾਂ ਦੀ ਸਿਹਤ ਦੀ ਜਾਂਚ।",
    "ਮੋਤੀਆਬਿੰਦ ਸਰਜਰੀ ਲਈ ਲੈਂਜ਼ ਦੇ ਵਿਕਲਪ ਸਾਦੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝਾਉਂਦੀ ਹੈ।",
    "ਉਸੇ ਦਿਨ ਫੇਕੋ ਸਰਜਰੀ, ਅਗਲੇ ਦਿਨ ਚੈੱਕ-ਅੱਪ।"
  ],
  "chips": [
    "Phaco cataract surgery",
    "Glaucoma",
    "Retina check",
    "Children's eyes",
    "Eye care department"
  ],
  "chipsPa": [
    "ਫੇਕੋ ਮੋਤੀਆਬਿੰਦ ਸਰਜਰੀ",
    "ਗਲੂਕੋਮਾ",
    "ਰੈਟੀਨਾ ਜਾਂਚ",
    "ਬੱਚਿਆਂ ਦੀਆਂ ਅੱਖਾਂ",
    "ਅੱਖਾਂ ਦਾ ਵਿਭਾਗ"
  ]
};

const ROUTE = '/doctors/dr-parul-gupta/';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const pa = locale === 'pa';
  return {
    title: `${pa && D.namePa ? D.namePa : D.name} — ${pa && D.deptPa ? D.deptPa : D.dept}`,
    description: pa && D.aboutPa ? D.aboutPa[0] : D.about[0],
    alternates: alternates(ROUTE, locale as Locale),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <DoctorProfile d={D} locale={locale as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            physicianLd({
              name: D.name,
              dept: 'Ophthalmologic',
              route: ROUTE,
              image: `${SITE_BASE}${slot('doctors.parul').src}`,
              credentials: D.qualifications.filter((q) => !q.confirmId).map((q) => q.text),
            }),
          ),
        }}
      />
    </>
  );
}
