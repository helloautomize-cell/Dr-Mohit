// Home bento grid (v15 upgrade): six tiles replacing the old facts band.
// Sky section, wave into white handled by the page's WaveDivider. The cursor
// glow (--mx/--my) and count-up are wired by HomeFx / SiteEffects.
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';

function ShieldIcon() {
  return (
    <svg className="di" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="b" cx="24" cy="24" r="22" />
      <path
        d="M24 7l14 5v10c0 9-6 15-14 19-8-4-14-10-14-19V12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 24l4 4 8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="di" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="b" cx="24" cy="24" r="22" />
      <path
        d="M24 37s-12-7.4-12-16a6.5 6.5 0 0 1 12-3.5A6.5 6.5 0 0 1 36 21c0 8.6-12 16-12 16z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const AVATARS = ['home.doc-mohit', 'home.doc-parul', 'home.doc-amit'] as const;

export function Bento() {
  const t = useTranslations('home.bento');
  const locale = useLocale() as Locale;
  const plan = slot('robotic.plan');
  return (
    <section
      className="sec bento-sec"
      style={{ background: 'var(--sky)', paddingTop: 'clamp(24px,3vw,40px)' }}
    >
      <div className="wrap">
        <div className="bento">
          <Link className="bt bt-a rv" href="/orthopaedics/robotic-knee-replacement/">
            <Image
              src={plan.src!}
              alt={plan.alt[locale]}
              fill
              sizes="(max-width:1000px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: '40% 40%' }}
            />
            <div className="bt-cap">
              <span className="k">{t('capK')}</span>
              <b>{t('capB')}</b>
              <span className="ar">→</span>
            </div>
          </Link>
          <div className="bt bt-b rv">
            <b className="num" data-count="1980">
              1980
            </b>
            <span>{t('founded')}</span>
          </div>
          <div className="bt bt-c rv">
            <b className="num" data-count="3">
              3
            </b>
            <span>{t('depts')}</span>
            <div className="dots">
              <i style={{ ['--c' as string]: 'var(--brand)' }} />
              <i style={{ ['--c' as string]: 'var(--leaf)' }} />
              <i style={{ ['--c' as string]: '#0A8A80' }} />
            </div>
          </div>
          <div className="bt bt-d rv">
            <span className="sic">
              <ShieldIcon />
            </span>
            <div>
              <b>{t('pmjayB')}</b>
              <span>{t('pmjayS')}</span>
            </div>
          </div>
          <div className="bt bt-e rv">
            <span className="sic">
              <HeartIcon />
            </span>
            <b>{t('awardB')}</b>
            <span>{t('awardS')}</span>
          </div>
          <Link className="bt bt-f rv" href="/doctors/">
            <div className="avs">
              {AVATARS.map((id) => (
                <Image key={id} src={slot(id).src!} alt="" width={64} height={64} />
              ))}
            </div>
            <div>
              <b>{t('famB')}</b>
              <span>{t('famS')}</span>
            </div>
            <span className="ar">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
