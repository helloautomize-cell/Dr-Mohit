// /plan-your-visit/ — what to bring, travel tips (reach map), the catchment
// line naming towns, timings [CONFIRM]. No per-town doorway pages.
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { alternates, breadcrumbLd, ldGraph } from '@/lib/seo';
import { crumbTrail } from '@/lib/crumbs';
import { JsonLd } from '@/components/JsonLd';
import { routing, type Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { copy, pageTitle } from '@/lib/copy';
import { LabelText, H1, H2, H3, Lede } from '@/components/primitives';
import { RichText } from '@/components/RichText';
import { BookButton } from '@/components/Buttons';
import { WaveDivider } from '@/components/WaveDivider';
import { Icon, type IconName } from '@/components/icons';
import { Lnk, SecHead } from '@/components/home/sections';
import { Swipe } from '@/components/Swipe';
import { ReachMap } from '@/components/home/ReachMap';

import { MapFacade } from '@/components/MapFacade';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: pageTitle('plan-your-visit'),
    description: copy('plan-your-visit', 'A little planning makes the visit smoother', l),
    alternates: alternates('/plan-your-visit/', l),
  };
}

const BRING: { icon: IconName; h: string; p: string }[] = [
  { icon: 'file', h: 'Old reports', p: 'X-rays, scans and discharge papers.' },
  { icon: 'pill', h: 'Your medicines', p: 'The strips or a list of what you take now.' },
  { icon: 'card', h: 'ID and cards', p: 'Aadhaar, and your Ayushman or insurance card' },
  { icon: 'family', h: 'Someone with you', p: 'Helpful for eye drops, surgery days' },
];

export default async function PlanVisitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale: l, namespace: 'shell' });
  const c = (en: string) => copy('plan-your-visit', en, l);
  const cc = (en: string) => copy('contact', en, l);

  return (
    <>
      {/* 1. Hero (sky) */}
      <section className="hero hero-c">
        <div className="wrap">
          <div className="g12">
            <div className="c-8">
              <LabelText text={t('eyebrow')} />
              <H1 text={c('Plan your visit.')} />
              <div style={{ marginTop: 24 }}>
                <Lede text={c('A little planning makes the visit smoother')} />
              </div>
              <div className="ctas" style={{ marginTop: 20 }}>
                <BookButton href="/contact/">
                  <RichText text={copy('global', 'Book appointment', l)} />
                </BookButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      {/* 2. Catchment + reach map + travel tips (white) */}
      <section className="sec">
        <div className="wrap">
          <SecHead
            label={c('Out of town')}
            h2={c('Coming from <span class="em">outside Bathinda?</span>')}
            lede={c('Patients visit daily from Mansa, Barnala, Moga')}
          />
          <ReachMap locale={l} />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      {/* 3. What to bring (mint) */}
      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <SecHead
            label={c('Before you come')}
            h2={c('What to <span class="em">bring with you.</span>')}
            lede={c('A complete history helps the doctor decide faster')}
          />
          <Swipe className="bring" count={BRING.length} label={cc('Before you come')}>
            {BRING.map((b) => (
              <div className="rv" key={b.h}>
                <span className="sic">
                  <Icon name={b.icon} />
                </span>
                <h3>{cc(b.h)}</h3>
                <p>{cc(b.p)}</p>
              </div>
            ))}
          </Swipe>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      {/* 4. Address and timings (white) */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap g12">
          <div className="c-5 rv">
            <LabelText text={c('Visit')} />
            <H2 text={c('Address and <span class="em">timings.</span>')} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 28 }}>
              <Lnk href={SITE.mapsUrl}>{c('Get directions')}</Lnk>
            </div>
            <div style={{ marginTop: 20, maxWidth: 420 }}>
              <MapFacade
                showLabel={cc('Show map')}
                title={cc('Map of the area around Gupta Hospital')}
              />
            </div>
          </div>
          <dl className="rv" style={{ margin: 0, gridColumn: '7/-1' }}>
            <div className="kv">
              <dt>{c('Address')}</dt>
              <dd>{`${SITE.name}, ${SITE.address}`}</dd>
            </div>
            <div className="kv">
              <dt>{c('Appointments')}</dt>
              <dd>
                <a href={SITE.phoneMainHref}>{SITE.phoneMain}</a>
              </dd>
            </div>
            <div className="kv">
              <dt>{c('Eye department')}</dt>
              <dd>
                <a href={SITE.phoneEyeHref}>{SITE.phoneEye}</a>
              </dd>
            </div>
            <div className="kv">
              <dt>{c('OPD timings')}</dt>
              <dd>{c('Open 24 hours')}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 5. Callout */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="callout rv">
            <H3 text={c('Want to see a doctor? Book a time on WhatsApp.')} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <BookButton href="/contact/">
                <RichText text={c('Book an appointment')} />
              </BookButton>
              <a className="btn btn-line" href={SITE.phoneMainHref}>
                {SITE.phoneMain}
              </a>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={ldGraph(breadcrumbLd(crumbTrail('/plan-your-visit/', l), l))} />
    </>
  );
}
