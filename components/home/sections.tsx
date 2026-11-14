// Static home sections ported 1:1 from the approved preview: hero plus the
// shared section-head + link helpers. Copy comes from the content JSON via
// copy(); section head pattern is the preview's g12 label/h2 + lede pair.
import Link from 'next/link';
import { copy } from '@/lib/copy';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { SITE } from '@/lib/site-config';
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

