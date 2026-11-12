import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { copy } from '@/lib/copy';
import { WaveDivider } from '@/components/WaveDivider';
import { HomeHero, StorySection, RoboticFeature, DoctorsRow, SecHead, Lnk } from '@/components/home/sections';
import { FirstVisit } from '@/components/home/FirstVisit';
import { DoctorFinder } from '@/components/home/DoctorFinder';
import { ReachMap } from '@/components/home/ReachMap';
import { PressBoard, HOME_CLIPS } from '@/components/PressBoard';
import {
  FactsBand,
  HomeFaq,
  JourneyPath,
  FacilitiesBand,
  VisitBand,
} from '@/components/sections/bands';
import { TreatmentGrid } from '@/components/sections/cards';
import { RichText } from '@/components/RichText';
import { alternates, websiteLd } from '@/lib/seo';
import type { Metadata } from 'next';

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

// FAQPage JSON-LD mirrors exactly the visible accordion items.
function faqJsonLd(l: Locale) {
  const qa: [string, string][] = [
    ['Do I need an appointment?', 'Booking ahead by phone or WhatsApp'],
    ['Which doctor should I see?', 'Bones, joints, back and injuries: Dr. Mohit'],
    ['Is treatment covered under Ayushman Bharat?', 'Gupta Hospital is empanelled under PM-JAY'],
    ['Can I talk to the doctor in Punjabi?', 'Yes. All three doctors speak Punjabi'],
    ['What should I bring to my first visit?', 'All old reports, X-rays and scans'],
    ['Does the hospital hold free camps?', 'Yes. The hospital regularly holds free'],
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(([q, a]) => ({
      '@type': 'Question',
      name: copy('home', q, l).replace(/<[^>]+>/g, ''),
      acceptedAnswer: {
        '@type': 'Answer',
        text: copy('home', a, l).replace(/<[^>]+>/g, ''),
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

  return (
    <>
      {/* 1. Hero (sky) */}
      <HomeHero locale={l} />
      <WaveDivider from="sky" to="brand" />

      {/* 2. Facts band (blue) */}
      <FactsBand locale={l} />
      <WaveDivider from="brand" to="white" />

      {/* 3. Your first visit — sticky stage */}
      <FirstVisit locale={l} />
      <WaveDivider from="white" to="mint" />

      {/* 4. Treatments (mint) */}
      <section className="sec treat-sec">
        <div className="wrap">
          <SecHead
            label={c('Treatments')}
            h2={c('Care for bones, eyes <span class="em-g">and the mind.</span>')}
            lede={c('Three departments, each led by a specialist from the Gupta family')}
          />
          <TreatmentGrid locale={l} />
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      {/* 5. Our story */}
      <StorySection locale={l} />
      <WaveDivider from="white" to="sky" />

      {/* 6. Find the right doctor (sky) */}
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
      <WaveDivider from="sky" to="navy" />

      {/* 7. Your journey (navy) */}
      <section className="sec jr-sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 'clamp(40px,6vw,80px)', alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Your journey')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('From first call to <span class="em">feeling better.</span>')} />
              </h2>
            </div>
            <p className="lede s-8">{c('The same doctor stays with you at every step.')}</p>
          </div>
          <JourneyPath locale={l} />
        </div>
      </section>
      <WaveDivider from="navy" to="white" />

      {/* 8. Robotic knee feature */}
      <RoboticFeature locale={l} />
      <WaveDivider from="white" to="brand" />

      {/* 9. Under one roof (brand band) */}
      <FacilitiesBand locale={l} />
      <WaveDivider from="brand" to="sky" />

      {/* 10. Doctors (sky) */}
      <DoctorsRow locale={l} />
      <WaveDivider from="sky" to="white" />

      {/* 11. In the news — press board */}
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
      <WaveDivider from="white" to="mint" />

      {/* 12. Coming from out of town (mint) */}
      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <SecHead
            label={c('Coming from out of town')}
            h2={c('Families travel from <span class="em">three states.</span>')}
            lede={c('Patients come from across Punjab and neighbouring Haryana and Rajasthan')}
          />
          <ReachMap locale={l} />
        </div>
      </section>
      <WaveDivider from="mint" to="sky" />

      {/* 13. FAQ (sky) + FAQPage JSON-LD */}
      <section className="sec faq-sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap g12">
          <div className="c-4 rv">
            <span className="label">{c('Questions')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Questions families <span class="em">often ask.</span>')} />
            </h2>
            <div style={{ marginTop: 28 }}>
              <Lnk href="/contact/">{c('Ask us something else')}</Lnk>
            </div>
          </div>
          <div className="s-6 rv">
            <HomeFaq locale={l} />
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(l)) }}
        />
      </section>
      <WaveDivider from="sky" to="navy" />

      {/* 14. Visit band (navy) — directions link loads the map only on click */}
      <VisitBand locale={l} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd(l)) }}
      />
    </>
  );
}
