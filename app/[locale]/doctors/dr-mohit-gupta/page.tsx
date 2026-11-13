import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { DoctorProfile, type DoctorFacts } from '@/components/DoctorProfile';
import { alternates, breadcrumbLd, ldGraph, physicianLd, SITE_BASE } from '@/lib/seo';
import { crumbTrail } from '@/lib/crumbs';
import { JsonLd } from '@/components/JsonLd';
import { slot } from '@/lib/image-slots';
import { SITE } from '@/lib/site-config';

const D: DoctorFacts = {
  "name": "Dr. Mohit Gupta",
  "dept": "Orthopaedics & joint replacement",
  "slot": "doctors.mohit",
  "qualifications": [
    {
      "text": "D.Ortho, MS Ortho, MCh Ortho"
    },
    {
      "text": "Punjab Medical Council reg. no. 43354"
    },
    {
      "text": "Fellowships: Asklepios Klinik Lindenlohe (Germany), Fribourg cantonal hospital (Switzerland)"
    }
  ],
  "namePa": "ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ",
  "deptPa": "ਹੱਡੀਆਂ ਤੇ ਜੋੜ ਬਦਲੀ",
  "languages": "English, Hindi, Punjabi",
  "languagesPa": "ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ, ਪੰਜਾਬੀ",
  "about": [
    "Dr. Mohit Gupta leads the orthopaedics department at Gupta Hospital, Bathinda. The department began as an orthopaedic clinic in 1980 and now offers joint replacement, fracture care, sports injuries and the back pain clinic, including robotic-assisted knee replacement with the Johnson & Johnson VELYS system."
  ],
  "aboutPa": [
    "ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ ਗੁਪਤਾ ਹਸਪਤਾਲ, ਬਠਿੰਡਾ ਦਾ ਹੱਡੀਆਂ ਦਾ ਵਿਭਾਗ ਚਲਾਉਂਦੇ ਹਨ। ਇਹ ਵਿਭਾਗ 1980 ਵਿੱਚ ਹੱਡੀਆਂ ਦੇ ਕਲੀਨਿਕ ਵਜੋਂ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ ਅਤੇ ਹੁਣ ਜੋੜ ਬਦਲੀ, ਫਰੈਕਚਰ ਦੇਖਭਾਲ, ਸਪੋਰਟਸ ਸੱਟਾਂ ਅਤੇ ਬੈਕ ਪੇਨ ਕਲੀਨਿਕ ਦੀ ਸੇਵਾ ਦਿੰਦਾ ਹੈ, ਜਿਸ ਵਿੱਚ Johnson & Johnson VELYS ਸਿਸਟਮ ਨਾਲ ਰੋਬੋਟਿਕ-ਅਸਿਸਟਿਡ ਗੋਡਾ ਬਦਲੀ ਵੀ ਸ਼ਾਮਲ ਹੈ।"
  ],
  "howWorks": [
    "Listens first, then examines the joint and reads the imaging himself.",
    "Explains options from exercise and medicines to surgery in plain words.",
    "Performs the surgery himself and follows the same patient through recovery."
  ],
  "howWorksPa": [
    "ਪਹਿਲਾਂ ਸੁਣਦੇ ਹਨ, ਫਿਰ ਜੋੜ ਦੀ ਜਾਂਚ ਕਰਦੇ ਹਨ ਅਤੇ ਇਮੇਜਿੰਗ ਖ਼ੁਦ ਪੜ੍ਹਦੇ ਹਨ।",
    "ਕਸਰਤ ਤੋਂ ਦਵਾਈਆਂ ਤੱਕ ਸਰਜਰੀ ਤੱਕ ਦੇ ਵਿਕਲਪ ਸਾਦੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝਾਉਂਦੇ ਹਨ।",
    "ਸਰਜਰੀ ਖ਼ੁਦ ਕਰਦੇ ਹਨ ਅਤੇ ਉਸੇ ਮਰੀਜ਼਼ ਨੂੰ ਰਿਕਵਰੀ ਤੱਕ ਦੇਖਦੇ ਹਨ।"
  ],
  "chips": [
    "Robotic knee replacement",
    "Knee & hip replacement",
    "Fractures & trauma",
    "Arthroscopy & sports injuries",
    "Back pain clinic",
    "Orthopaedics department"
  ],
  "chipsPa": [
    "ਰੋਬੋਟਿਕ ਗੋਡਾ ਬਦਲੀ",
    "ਗੋਡਾ ਤੇ ਹਿੱਪ ਬਦਲੀ",
    "ਫਰੈਕਚਰ ਤੇ ਟ੍ਰਾਮਾ",
    "ਆਰਥਰੋਸਕੋਪੀ ਤੇ ਸਪੋਰਟਸ ਸੱਟਾਂ",
    "ਬੈਕ ਪੇਨ ਕਲੀਨਿਕ",
    "ਹੱਡੀਆਂ ਦਾ ਵਿਭਾਗ"
  ]
};

const ROUTE = '/doctors/dr-mohit-gupta/';

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
      <JsonLd
        data={ldGraph(
          breadcrumbLd(crumbTrail(ROUTE, locale as Locale), locale as Locale),
          physicianLd({
            id: 'dr-mohit-gupta',
            name: D.name,
            dept: 'Orthopedic',
            route: ROUTE,
            image: `${SITE_BASE}${slot('doctors.mohit').src}`,
            credentials: D.qualifications.filter((q) => !q.confirmId).map((q) => q.text),
            award: SITE.award,
          }),
        )}
      />
    </>
  );
}
