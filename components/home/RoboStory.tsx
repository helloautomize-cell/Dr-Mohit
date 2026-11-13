// Robotic knee scroll story (v15 upgrade) — replaces the old robotic feature.
// Left column sticky (VELYS photo + 3-part progress); right column three steps
// with small animated SVG diagrams. The active step (nearest viewport middle)
// is toggled by HomeFx; below 1000px / under reduced-motion every step shows.
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';

function DgMap() {
  return (
    <svg viewBox="0 0 200 160" className="dg">
      <path className="ln" d="M70 10 C 70 60 60 70 62 80 C 64 92 136 92 138 80 C 140 70 130 60 130 10" />
      <path className="ln" d="M64 96 C 66 110 74 120 76 150 M136 96 C 134 110 126 120 124 150" />
      <circle className="pt" cx="66" cy="70" r="4" style={{ ['--d' as string]: '0s' }} />
      <circle className="pt" cx="100" cy="88" r="4" style={{ ['--d' as string]: '0.15s' }} />
      <circle className="pt" cx="134" cy="70" r="4" style={{ ['--d' as string]: '0.3s' }} />
      <circle className="pt" cx="70" cy="104" r="4" style={{ ['--d' as string]: '0.45s' }} />
      <circle className="pt" cx="130" cy="104" r="4" style={{ ['--d' as string]: '0.6s' }} />
      <circle className="pt" cx="100" cy="40" r="4" style={{ ['--d' as string]: '0.75s' }} />
    </svg>
  );
}

function DgBalance() {
  return (
    <svg viewBox="0 0 200 160" className="dg">
      <path className="ln" d="M40 60 H160" />
      <path className="ln" d="M40 100 H160" />
      <rect className="gap g1" x="58" y="64" width="24" height="32" rx="4" />
      <rect className="gap g2" x="118" y="64" width="24" height="32" rx="4" />
      <text x="70" y="128" textAnchor="middle">inner</text>
      <text x="130" y="128" textAnchor="middle">outer</text>
    </svg>
  );
}

function DgPlan() {
  return (
    <svg viewBox="0 0 200 160" className="dg">
      <path className="ln" d="M30 120 L170 40" />
      <path className="ln plan" d="M30 120 L170 40" />
      <circle className="pt" cx="30" cy="120" r="5" />
      <circle className="pt" cx="170" cy="40" r="5" style={{ ['--d' as string]: '.6s' }} />
    </svg>
  );
}

export function RoboStory() {
  const t = useTranslations('home.robo');
  const locale = useLocale() as Locale;
  const velys = slot('robotic.velys');
  const steps: { h: string; p: string; Dg: () => React.ReactNode }[] = [
    { h: t('s1h'), p: t('s1p'), Dg: DgMap },
    { h: t('s2h'), p: t('s2p'), Dg: DgBalance },
    { h: t('s3h'), p: t('s3p'), Dg: DgPlan },
  ];
  return (
    <section className="sec robo-story" id="roboStory">
      <div className="wrap">
        <div className="g12 rv" style={{ marginBottom: 'clamp(32px,5vw,56px)', alignItems: 'end' }}>
          <div className="c-7">
            <span className="label">{t('eyebrow')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={t.raw('h2') as string} />
            </h2>
          </div>
          <p className="lede s-8">{t('lede')}</p>
        </div>
        <div className="rs">
          <div className="rs-pin">
            <div className="rs-im">
              <Image
                src={velys.src!}
                alt={velys.alt[locale]}
                fill
                sizes="(max-width:1000px) 100vw, 55vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="rs-prog" aria-hidden="true">
              <i className="on" />
              <i />
              <i />
            </div>
          </div>
          <div className="rs-steps">
            {steps.map((s, i) => (
              <div className="rs-step" data-i={i} key={i}>
                <div className="rs-dg">
                  <s.Dg />
                </div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
            <Link className="lnk" href="/orthopaedics/robotic-knee-replacement/" style={{ marginTop: 8 }}>
              <span>{t('more')}</span>
              <span className="ar">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
