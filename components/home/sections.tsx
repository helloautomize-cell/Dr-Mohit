// Static home sections ported 1:1 from the approved preview: hero, Our story,
// the robotic-knee feature block, and the doctors row. Copy comes from the
// content JSON via copy(); section head pattern is the preview's g12 label/h2
// + lede pair.
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { copy } from '@/lib/copy';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { ImageSlot } from '../ImageSlot';
import { CountUp } from '../primitives';
import { SITE } from '@/lib/site-config';
import { TrailTimeline } from '../sections/bands';
import { Swipe } from '../Swipe';
import type { SlotId } from '@/lib/image-slots';
import type { ReactNode } from 'react';

type L = Locale;

/* ------------------------------ Section head ------------------------------ */

export function SecHead({
  label,
  h2,
  lede,
  cols = 7,
}: {
  label: string;
  h2: string;
  lede?: string;
  cols?: 6 | 7;
}) {
  return (
    <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
      <div className={cols === 6 ? 'c-6' : 'c-7'}>
        <span className="label">{label}</span>
        <h2 style={{ marginTop: 18 }}>
          <RichText text={h2} />
        </h2>
      </div>
      {lede ? <p className="lede s-8">{lede}</p> : null}
    </div>
  );
}

export function Lnk({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="lnk" href={href}>
      <span>{children}</span>
      <span className="ar">→</span>
    </Link>
  );
}

/* --------------------------------- Hero ---------------------------------- */

export function HomeHero({ locale }: { locale: L }) {
  const c = (en: string) => copy('home', en, locale);
  return (
    <section className="hero hero-c">
      <div className="wrap">
        <div className="g12">
          <div className="c-7">
            <span className="label">{c('Gupta Hospital · Bathinda · Since 1980')}</span>
            <h1>
              <RichText text={c('Bone, eye and mental health care for <span class="em">Bathinda.</span>')} />
            </h1>
            <p className="lede" style={{ marginTop: 28 }}>
              {c('One family of doctors on Power House Road for over four decades')}
            </p>
            <div className="ctas">
              <Link className="btn btn-brand" href="/contact/">
                <span>{c('Book an appointment')}</span>
                <span className="ar">→</span>
              </Link>
              <a className="btn btn-line" href={SITE.phoneMainHref}>
                {SITE.phoneMain}
              </a>
            </div>
          </div>
          <div className="c-5">
            <div className="hero-wrap">
              <div className="im hero-im">
                {/* LCP image: static AVIF renditions from public/images/hero/
                    (process-images.mjs) — no /_next/image optimizer latency.
                    The link preload is hoisted to <head> by React 19. */}
                <link
                  rel="preload"
                  as="image"
                  type="image/avif"
                  imageSrcSet="/images/hero/home-hero-mohit-390.avif 390w, /images/hero/home-hero-mohit-640.avif 640w, /images/hero/home-hero-mohit-828.avif 828w, /images/hero/home-hero-mohit-1200.avif 1200w"
                  imageSizes="(max-width:900px) 92vw, 42vw"
                  fetchPriority="high"
                />
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/images/hero/home-hero-mohit-390.avif 390w, /images/hero/home-hero-mohit-640.avif 640w, /images/hero/home-hero-mohit-828.avif 828w, /images/hero/home-hero-mohit-1200.avif 1200w"
                    sizes="(max-width:900px) 92vw, 42vw"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- static renditions, not next/image */}
                  <img
                    src="/images/hero/home-hero-mohit-640.jpg"
                    alt={slot('home.hero').alt[locale]}
                    width={1200}
                    height={1290}
                    decoding="async"
                    fetchPriority="high"
                    style={{ objectPosition: slot('home.hero').focal }}
                  />
                </picture>
              </div>
            </div>
            <div className="cap">
              <span>Dr. Mohit Gupta</span>
              <span>{c('Joint replacement surgeon')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Our story -------------------------------- */

export function StorySection({ locale }: { locale: L }) {
  const c = (en: string) => copy('home', en, locale);
  const items = [
    { year: '1980', h3: c('A clinic opens'), p: c('Dr. Amrit Gupta starts an orthopaedic practice on Power House Road') },
    { year: '2000', h3: c('Care for the mind'), p: c('Dr. Amit Gupta joins as psychiatrist when addiction was hurting') },
    { year: '2019', h3: c('Ayushman Bharat'), p: c('The hospital is empanelled under PM-JAY, so eligible card holders') },
    { year: '2024', h3: c('Robotic-assisted knees'), p: c('The J&amp;J VELYS™ robotic-assisted knee system is launched') },
    { year: '2025', h3: c('Recognised by The Tribune'), p: c('Tribune Health Care Award for excellence in joint replacement') },
    { year: c('Today'), h3: c('Three departments, one family'), p: c('Dr. Mohit Gupta leads orthopaedics after fellowships in Germany and Switzerland') },
  ];
  const years = 44; // approved prototype value (data-count="44")
  return (
    <section className="sec">
      <div className="wrap legacy">
        <div className="rv">
          <span className="label">{c('Our story')}</span>
          <h2 style={{ marginTop: 18 }}>
            <RichText text={c('Four decades on <span class="em">Power House Road.</span>')} />
          </h2>
          <div className="yrs">
            <CountUp n={years} />
            <span>{c('years of care in Bathinda')}</span>
          </div>
          <p className="lede">{c('What began as a small orthopaedic clinic in 1980')}</p>
          <ImageSlot
            id="home.story"
            locale={locale}
            caption={c('Power House Road, Bathinda')}
          />
        </div>
        <TrailTimeline items={items} label={c('Our story')} />
        <div className="leg-more" style={{ gridColumn: 2, marginTop: -48, paddingLeft: 48 }}>
          <Lnk href="/about/">{c('The full story')}</Lnk>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Doctors row ------------------------------ */

const DOC_CARDS: { img: SlotId; href: string; name: string; roleKey: string; dovKey: 'mohit' | 'parul' | 'amit' }[] = [
  { img: 'home.doc-mohit', href: '/doctors/dr-mohit-gupta/', name: 'Dr. Mohit Gupta', roleKey: 'Orthopaedic &amp; joint replacement surgeon', dovKey: 'mohit' },
  { img: 'home.doc-parul', href: '/doctors/dr-parul-gupta/', name: 'Dr. Parul Gupta', roleKey: 'Eye surgeon', dovKey: 'parul' },
  { img: 'home.doc-amit', href: '/doctors/dr-amit-gupta/', name: 'Dr. Amit Gupta', roleKey: 'Psychiatrist &amp; de-addiction specialist', dovKey: 'amit' },
];

const DOC_PA: Record<string, string> = {
  'Dr. Mohit Gupta': 'ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ',
  'Dr. Parul Gupta': 'ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ',
  'Dr. Amit Gupta': 'ਡਾ. ਅਮਿਤ ਗੁਪਤਾ',
};

export function DoctorsRow({ locale }: { locale: L }) {
  const c = (en: string) => copy('home', en, locale);
  const d = useTranslations('home.doc');
  return (
    <section className="sec doc-sec" style={{ background: 'var(--sky)' }}>
      <div className="wrap">
        <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
          <div className="c-6">
            <span className="label">{c('Doctors')}</span>
            <h2 style={{ marginTop: 18 }}>{c('The doctors you will see.')}</h2>
          </div>
          <div className="s-8" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Lnk href="/doctors/">{c('All profiles')}</Lnk>
          </div>
        </div>
        <div className="rv" style={{ marginBottom: 40 }}>
          <ImageSlot id="home.doctors-banner" locale={locale} />
        </div>
        <Swipe className="docs" count={DOC_CARDS.length} label={c('Doctors')}>
          {DOC_CARDS.map((doc) => (
            <Link className="doc rv" href={doc.href} key={doc.href}>
              <div className="im">
                <Image
                  src={slot(doc.img).src!}
                  alt={slot(doc.img).alt[locale]}
                  width={800}
                  height={1000}
                  sizes="(max-width:767px) 84vw, 33vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: slot(doc.img).focal }}
                />
                <div className="dov">
                  <span>{d('sees')}</span>
                  <p>{d(doc.dovKey)}</p>
                  <b>{d('profile')}</b>
                  <span className="ar">→</span>
                </div>
              </div>
              <div className="meta">
                <h3>{locale === 'pa' ? DOC_PA[doc.name] : doc.name}</h3>
                <span>
                  <RichText text={c(doc.roleKey)} />
                </span>
              </div>
            </Link>
          ))}
        </Swipe>
      </div>
    </section>
  );
}
