import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { copy, pageTitle } from '@/lib/copy';
import { SITE } from '@/lib/site-config';
import { slot, type SlotId } from '@/lib/image-slots';
import { LabelText, H1, H2, H3, Lede } from '@/components/primitives';
import { RichText } from '@/components/RichText';
import { ImageSlot } from '@/components/ImageSlot';
import { WaveDivider } from '@/components/WaveDivider';
import { BookButton } from '@/components/Buttons';
import { ConfirmValue } from '@/components/Confirm';
import { Lnk } from '@/components/home/sections';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: pageTitle('doctors'),
    description: copy('doctors', 'The clinic Dr. Amrit Gupta opened', l),
    alternates: {
      canonical: l === 'pa' ? '/pa/doctors/' : '/doctors/',
      languages: { en: '/doctors/', pa: '/pa/doctors/' },
    },
  };
}

type Doctor = {
  name: string;
  namePa: string;
  href: string;
  slot: SlotId;
  band: 'd-sky' | 'd-mint' | 'd-teal';
  labelKey: string;
  ledeKey: string;
  chips: { key?: string; confirmId?: 'parul-degrees' | 'amit-md' }[];
  specialty: string;
};

const DOCTORS: Doctor[] = [
  {
    name: 'Dr. Mohit Gupta',
    namePa: 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ',
    href: '/doctors/dr-mohit-gupta/',
    slot: 'doctors.mohit',
    band: 'd-sky',
    labelKey: 'Orthopaedics &amp; joint replacement',
    ledeKey: 'Fellowships in orthopaedics and joint replacement',
    chips: [
      { key: 'D.Ortho' },
      { key: 'MS Ortho' },
      { key: 'MCh Ortho' },
      { key: 'Reg. no. 43354' },
      { key: 'Tribune Health Care Award 2025' },
    ],
    specialty: 'Orthopaedics and joint replacement',
  },
  {
    name: 'Dr. Parul Gupta',
    namePa: 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ',
    href: '/doctors/dr-parul-gupta/',
    slot: 'doctors.parul',
    band: 'd-mint',
    labelKey: 'Ophthalmology',
    ledeKey: 'Specialised training in cataract surgery',
    chips: [
      { key: 'MBBS', confirmId: 'parul-degrees' },
      { key: 'MS', confirmId: 'parul-degrees' },
      { key: 'Phaco cataract surgery' },
    ],
    specialty: 'Ophthalmology',
  },
  {
    name: 'Dr. Amit Gupta',
    namePa: 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ',
    href: '/doctors/dr-amit-gupta/',
    slot: 'doctors.amit',
    band: 'd-teal',
    labelKey: 'Psychiatry &amp; de-addiction',
    ledeKey: 'Psychiatry consultant and de-addiction specialist',
    chips: [
      { key: 'MD Psychiatry', confirmId: 'amit-md' },
      { key: 'Since 2000' },
      { key: 'Licensed de-addiction centre' },
    ],
    specialty: 'Psychiatry',
  },
];

function physicianLd(d: Doctor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: d.name,
    medicalSpecialty: d.specialty,
    url: d.href,
    image: slot(d.slot).src,
    worksFor: {
      '@type': 'Hospital',
      name: `${SITE.name}, ${SITE.city}`,
      telephone: SITE.phoneMain,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Power House Road',
        addressLocality: 'Bathinda',
        addressRegion: 'Punjab',
        postalCode: '151001',
        addressCountry: 'IN',
      },
    },
    ...(d.name === 'Dr. Mohit Gupta'
      ? {
          award: SITE.award,
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'Punjab Medical Council registration',
            value: '43354',
          },
        }
      : {}),
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const pa = l === 'pa';
  const t = await getTranslations({ locale: l, namespace: 'shell' });
  const c = (en: string) => copy('doctors', en, l);

  return (
    <>
      <section className="hero hero-c">
        <div className="wrap">
          <div className="g12">
            <div className="c-12">
              <LabelText text={t('eyebrow')} />
              <H1 text={c('Our doctors.')} />
              <div style={{ marginTop: 24 }}>
                <Lede text={c('The clinic Dr. Amrit Gupta opened')} />
              </div>
              <div className="ctas" style={{ marginTop: 20 }}>
                <BookButton href="/contact/">
                  <RichText text={copy('global', 'Book appointment', l)} />
                  <span className="ar">→</span>
                </BookButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="white" />
      <WaveDivider from="white" to="sky" />

      {DOCTORS.map((d, i) => (
        <DoctorBand key={d.href} d={d} locale={l} pa={pa} c={c} next={DOCTORS[i + 1]?.band} />
      ))}
      <WaveDivider from="teal" to="white" />

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="callout rv">
            <H3 text={c('Want to see a doctor? Book a time on WhatsApp.')} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <BookButton href="/contact/">
                <RichText text={c('Book an appointment')} />
                <span className="ar">→</span>
              </BookButton>
              <a className="btn btn-line" href={SITE.phoneMainHref}>
                {SITE.phoneMain}
              </a>
            </div>
          </div>
        </div>
      </section>
      {DOCTORS.map((d) => (
        <script
          key={d.href}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianLd(d)) }}
        />
      ))}
    </>
  );
}

function DoctorBand({
  d,
  locale,
  pa,
  c,
  next,
}: {
  d: Doctor;
  locale: Locale;
  pa: boolean;
  c: (en: string) => string;
  next?: 'd-sky' | 'd-mint' | 'd-teal';
}) {
  const bandToWave: Record<string, 'sky' | 'mint' | 'teal'> = {
    'd-sky': 'sky',
    'd-mint': 'mint',
    'd-teal': 'teal',
  };
  const from = bandToWave[d.band]!;
  return (
    <>
      <section className={`dband ${d.band}`}>
        <div className="wrap">
          <article className="prof">
            <div className="im rv">
              <ImageSlot id={d.slot} locale={locale} fill />
            </div>
            <div className="rv">
              <LabelText text={c(d.labelKey)} />
              <H2 text={pa ? d.namePa : d.name} style={{ marginTop: 16 }} />
              <div style={{ marginTop: 20 }}>
                <Lede text={c(d.ledeKey)} />
              </div>
              <div className="chips">
                {d.chips.map((chip) =>
                  chip.confirmId ? (
                    <ConfirmValue
                      key={chip.key}
                      value={c(chip.key!)}
                      id={chip.confirmId}
                    />
                  ) : (
                    <span key={chip.key}>{c(chip.key!)}</span>
                  ),
                )}
              </div>
              <div style={{ marginTop: 28 }}>
                <Lnk href={d.href}>{c('Full profile')}</Lnk>
              </div>
            </div>
          </article>
        </div>
      </section>
      {next ? <WaveDivider from={from} to={bandToWave[next]!} /> : null}
    </>
  );
}
