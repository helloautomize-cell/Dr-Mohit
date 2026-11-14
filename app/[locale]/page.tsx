import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { copy } from '@/lib/copy';
import { WaveDivider } from '@/components/WaveDivider';
import { HomeHero, SecHead, Lnk } from '@/components/home/sections';
import HomeFx from '@/components/home/HomeFx';
import { FirstVisit } from '@/components/home/FirstVisit';
import { DoctorFinder } from '@/components/home/DoctorFinder';
import { PressBoard, HOME_CLIPS } from '@/components/PressBoard';
import { VisitBand } from '@/components/sections/bands';
import { TreatmentGrid } from '@/components/sections/cards';
import { alternates, ldGraph, websiteLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { V2Statement } from '@/components/home-v2/V2Statement';
import { V2Departments } from '@/components/home-v2/V2Departments';
import { V2Bento } from '@/components/home-v2/V2Bento';
import { V2Robotic } from '@/components/home-v2/V2Robotic';
import { V2Waterfall } from '@/components/home-v2/V2Waterfall';
import { V2Journey } from '@/components/home-v2/V2Journey';
import { V2Story } from '@/components/home-v2/V2Story';
import { V2Faq } from '@/components/home-v2/V2Faq';
import { V2Fx } from '@/components/home-v2/V2Fx';
import '@/components/home-v2/home-v2.css';
import type { Metadata } from 'next';

const NEWSPAPERS = [
  'Hindustan Times',
  'Dainik Bhaskar',
  'Sach Kahoon',
  'Jagmarg',
  'Bathinda Bhaskar',
  'Dabwali Bhaskar',
  'Punjabi press',
  'Hindi press',
];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: copy('home', 'Bone, eye and mental health care', l).replace(/<[^>]+>/g, ''),
    description: copy('home', 'One family of doctors on Power House Road', l),
    alternates: alternates('/', l),
  };
}

// FAQPage JSON-LD mirrors exactly the visible accordion items (homeV2.faq).
async function faqJsonLd(l: Locale) {
  const t = await getTranslations({ locale: l, namespace: 'homeV2' });
  const items = t.raw('faq.items') as { q: string; a: string }[];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.a,
      },
    })),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const c = (en: string) => copy('home', en, l);
  const t = await getTranslations({ locale: l, namespace: 'home' });

  return (
    <div id="p-home">
      {/* 1. Hero (sky) */}
      <HomeHero locale={l} />
      <WaveDivider from="sky" to="white" />

      {/* 2. Who we are (white) */}
      <V2Statement locale={l} />

      {/* 3. Three departments (white) */}
      <V2Departments locale={l} />
      <WaveDivider from="white" to="mint" />

      {/* 4. Popular treatments (mint) — trimmed to the three ortho cards */}
      <section className="sec treat-sec">
        <div className="wrap">
          <h3 className="tg-h rv">{t('popular')}</h3>
          <TreatmentGrid locale={l} only={['robotic', 'kneehip', 'fracture']} />
        </div>
      </section>

      {/* 5. Four decades, one address (mint) */}
      <V2Bento locale={l} />
      <WaveDivider from="mint" to="navy" />

      {/* 6. Robotic knee (navy) */}
      <V2Robotic locale={l} />
      <WaveDivider from="navy" to="white" />

      {/* 7. Under one roof (white) */}
      <V2Waterfall locale={l} />

      {/* 8. From first call to feeling better (sky) — hard edge, per design */}
      <V2Journey />
      <WaveDivider from="sky" to="white" />

      {/* 9. Your first visit — sticky stage (white) */}
      <FirstVisit locale={l} />
      <WaveDivider from="white" to="sky" />

      {/* 10. Find the right doctor (sky) */}
      <section className="sec" style={{ background: 'var(--sky)' }} id="finderSec">
        <div className="wrap">
          <SecHead
            label={c('Find the right doctor')}
            h2={c('Where is the <span class="em">trouble?</span>')}
            lede={c('Tap a part of the body. We will show you which Gupta Hospital doctor')}
          />
          <DoctorFinder locale={l} />
        </div>
      </section>
      <WaveDivider from="sky" to="brand100" />

      {/* 11. Our story (soft blue) */}
      <V2Story locale={l} />
      <WaveDivider from="brand100" to="white" />

      {/* 12. In the news — press board (white) */}
      <section className="sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 40, alignItems: 'end' }}>
            <div className="c-6">
              <span className="label">{c('In the news')}</span>
              <h2 style={{ marginTop: 18 }}>{c('Out in the community.')}</h2>
            </div>
            <p className="lede s-8">
              {c('Free camps, health talks and new services, as reported by local papers')}
            </p>
          </div>
          <div className="mq" aria-label={t('newsAria')}>
            <div className="mq-t">
              {[...NEWSPAPERS, ...NEWSPAPERS].map((n, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  <span>{n}</span>
                  <i aria-hidden="true">●</i>
                </span>
              ))}
            </div>
          </div>
          <PressBoard
            clips={HOME_CLIPS}
            hint={l === 'pa' ? 'ਖਿੱਚੋ · ਪੜ੍ਹਨ ਲਈ ਕਲਿੱਕ ਕਰੋ' : 'Drag · Click to read'}
            label={c('In the news')}
          />
          <div style={{ marginTop: 28 }}>
            <Lnk href="/media/">{c('All press coverage')}</Lnk>
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      {/* 13. Families often ask (sky) + FAQPage JSON-LD */}
      <V2Faq />
      <WaveDivider from="sky" to="navy" />

      {/* 14. Visit band (navy) — directions link loads the map only on click */}
      <VisitBand locale={l} />
      <HomeFx />
      <V2Fx />
      <JsonLd data={ldGraph(websiteLd(l), await faqJsonLd(l))} />
    </div>
  );
}
