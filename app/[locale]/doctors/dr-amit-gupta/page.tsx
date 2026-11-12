import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { DoctorProfile, type DoctorFacts } from '@/components/DoctorProfile';

const D: DoctorFacts = {
  "name": "Dr. Amit Gupta",
  "namePa": "ਡਾ. ਅਮਿਤ ਗੁਪਤਾ",
  "dept": "Psychiatry & de-addiction",
  "deptPa": "ਮਾਨਸਿਕ ਸਿਹਤ ਤੇ ਨਸ਼ਾ-ਛੁਡ਼ਾਉ",
  "slot": "doctors.amit",
  "qualifications": [
    {
      "text": "MD Psychiatry",
      "confirmId": "amit-md"
    },
    {
      "text": "Psychiatry consultant & de-addiction specialist since 2000"
    },
    {
      "text": "Runs the licensed de-addiction centre"
    }
  ],
  "languages": "English, Hindi, Punjabi",
  "languagesPa": "ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ, ਪੰਜਾਬੀ",
  "about": [
    "Dr. Amit Gupta has worked with families across Malwa since 2000 on stress, anxiety, low mood, sleep and addiction. He heads the mental health department and the licensed de-addiction centre at Gupta Hospital."
  ],
  "aboutPa": [
    "ਡਾ. ਅਮਿਤ ਗੁਪਤਾ 2000 ਤੋਂ ਮਾਲਵਾ ਦੇ ਪਰਿਵਾਰਾਂ ਨਾਲ ਤਣਾਅ, ਚਿੰਤਾ, ਉਦਾਸੀ, ਨੀਂਦ ਅਤੇ ਨਸ਼ੇ ਬਾਰੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਹ ਮਾਨਸਿਕ ਸਿਹਤ ਵਿਭਾਗ ਅਤੇ ਗੁਪਤਾ ਹਸਪਤਾਲ ਦੇ ਲਾਇਸੈਂਸਸ਼ੁਦਾ ਨਸ਼ਾ-ਛੁਡ਼ਾਉ ਕੇਂਦ ਦੀ ਅਗਵਾਈ ਕਰਦੇ ਹਨ।"
  ],
  "howWorks": [
    "Private, unhurried conversations; families welcome when helpful.",
    "Treatment plans combine medicines, therapy and follow-up visits.",
    "De-addiction care with licensed protocols at the centre."
  ],
  "howWorksPa": [
    "ਨਿੱਜੀ, ਬਿਨਾਂ ਜਲਦਬਾਜ਼ੀ ਗੱਲਬਾਤ; ਲੋੜ ਪਏ ਤਾਂ ਪਰਿਵਾਰ ਨਾਲ।",
    "ਇਲਾਜ ਦੀਆਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਦਵਾਈਆਂ, ਥੈਰੇਪੀ ਤੇ ਫਾਲੋ-ਅੱਪ ਮੁਲਾਕਾਤਾਂ ਮਿਲ ਕੇ।",
    "ਕੇਂਦਰ ਵਿੱਚ ਲਾਇਸੈਂਸਸ਼ੁਦਾ ਪ੍ਰੋਟੋਕੌਲ ਨਾਲ ਨਸ਼ਾ-ਛੁਡ਼ਾਉ ਦੇਖਭਾਲ।"
  ],
  "chips": [
    "Stress & anxiety",
    "Depression",
    "Sleep problems",
    "De-addiction",
    "Licensed de-addiction centre",
    "Mental health department"
  ],
  "chipsPa": [
    "ਤਣਾਅ ਤੇ ਚਿੰਤਾ",
    "ਡਿਪਰੈਸ਼ਨ",
    "ਨੀਂਦ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ",
    "ਨਸ਼ਾ-ਛੁਡ਼ਾਉ",
    "ਲਾਇਸੈਂਸਸ਼ੁਦਾ ਨਸ਼ਾ-ਛੁਡ਼ਾਉ ਕੇਂਦਰ",
    "ਮਾਨਸਿਕ ਸਿਹਤ ਵਿਭਾਗ"
  ]
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <DoctorProfile d={D} locale={locale as Locale} />;
}
