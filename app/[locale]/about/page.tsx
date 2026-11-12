import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { routing, type Locale } from '@/i18n/routing';
import { copy, pageTitle } from '@/lib/copy';
import { SITE } from '@/lib/site-config';
import { LabelText, H1, H2, H3, Lede, P } from '@/components/primitives';
import { RichText } from '@/components/RichText';
import { ImageSlot } from '@/components/ImageSlot';
import { WaveDivider } from '@/components/WaveDivider';
import { BookButton } from '@/components/Buttons';
import { Icon, type IconName } from '@/components/icons';
import { Lnk, SecHead } from '@/components/home/sections';
import { Swipe } from '@/components/Swipe';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: pageTitle('about'),
    description: copy('about', 'In 1980 Dr. Amrit Gupta opened', l),
    alternates: alternates('/about/', l),
  };
}

const FACILITIES: { icon: IconName; h: string; p: string }[] = [
  { icon: 'ot', h: 'Modular operation theatres', p: 'Separate theatres for orthopaedic and eye surgery' },
  { icon: 'icu', h: 'Critical care', p: 'Close monitoring after surgery and in emergencies' },
  { icon: 'blood', h: 'Blood bank', p: 'On-site blood bank' },
  { icon: 'gyn', h: 'Gynaecology', p: "Women's health services" },
  { icon: 'physio', h: 'Physiotherapy', p: 'Rehabilitation after surgery and injury' },
  { icon: 'shield', h: 'Ayushman Bharat PM-JAY', p: 'Treatment for eligible card holders' },
];

const VALUES: { icon: IconName; h: string; p: string }[] = [
  { icon: 'heart', h: 'Care close to home', p: 'Specialist treatment in Bathinda' },
  { icon: 'scale', h: 'A fair cost', p: 'Clear estimates before treatment' },
  { icon: 'talk', h: 'Plain explanations', p: 'Your doctor explains reports and options' },
];

const TRAIL: { y: string; p: string }[] = [
  { y: '1980', p: 'Dr. Amrit Gupta opens an orthopaedic clinic.' },
  { y: '2000', p: 'Dr. Amit Gupta joins; psychiatry and de-addiction begin.' },
  { y: '2019', p: 'Empanelled under Ayushman Bharat PM-JAY.' },
  { y: '2024', p: 'VELYS robotic knee system publicly launched.' },
  { y: '2025', p: 'Tribune Health Care Award for excellence' },
];

const STORY = [
  'Gupta Hospital began in 1980 as a small orthopaedic clinic',
  'Dr. Amit Gupta joined in 2000 as psychiatry consultant',
  'Under Dr. Mohit Gupta, the orthopaedic department added arthroscopy',
  'Patients come from across Punjab and from neighbouring parts',
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale: l, namespace: 'shell' });
  const c = (en: string) => copy('about', en, l);

  return (
    <>
      {/* 1. Hero (sky) */}
      <section className="hero hero-c">
        <div className="wrap g12">
          <div className="c-8">
            <LabelText text={t('eyebrow')} />
            <H1 text={c('On Power House Road since 1980.')} />
            <div className="ctas" style={{ marginTop: 24 }}>
              <BookButton href="/contact/">
                <RichText text={copy('global', 'Book appointment', l)} />
              </BookButton>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="brand" />

      {/* 2. Facts band (brand) */}
      <section className="facts-band">
        <div className="wrap">
          <div className="facts rv">
            <div>
              <b>1980</b>
              <span>{c('Founded by Dr. Amrit Gupta')}</span>
            </div>
            <div>
              <b>3</b>
              <span>{c('Departments under one roof')}</span>
            </div>
            <div>
              <b>2000</b>
              <span>{c('De-addiction centre begins')}</span>
            </div>
            <div>
              <b>PM-JAY</b>
              <span>{c('Ayushman Bharat empanelled since 2019')}</span>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="brand" to="sky" />

      {/* 3. Founder (sky) — real photo, key credibility element */}
      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap founder">
          <ImageSlot id="about.founder" locale={l} className="rv" />
          <div className="rv">
            <LabelText text={c('Where it began')} />
            <H2 text={c('Dr. Amrit Gupta, founder.')} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 20 }}>
              <Lede text={c('In 1980 Dr. Amrit Gupta opened')} />
            </div>
            <P text={c('Today his children lead')} className="muted" style={{ marginTop: 16 }} />
            <div style={{ marginTop: 24 }}>
              <Lnk href="/doctors/">{c('Meet the doctors today')}</Lnk>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
          <ImageSlot id="about.legacy" locale={l} className="rv" caption={c('Three doctors, one family, since 1980')} />
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      {/* 4. Story (white): pull quote + four paragraphs */}
      <section className="sec">
        <div className="wrap g12">
          <div className="c-5">
            <P text={c('Specialist care for the people of this region')} className="quote rv" />
          </div>
          <div
            className="s-7 rv"
            style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--ink-2)' }}
          >
            {STORY.map((k) => (
              <P key={k} text={c(k)} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Timeline trail (white, same band continues) */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap g12">
          <div className="c-4">
            <LabelText text={c('Timeline')} />
          </div>
          <div className="s-5">
            <Swipe className="tl trail" count={TRAIL.length} label={c('Timeline')} dataTrail>
              <span className="fill" />
              {TRAIL.map((it) => (
                <div className="rv" key={it.y}>
                  <b>{it.y}</b>
                  <P text={c(it.p)} />
                </div>
              ))}
            </Swipe>
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      {/* 6. Facilities (mint) */}
      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <LabelText text={c('Facilities')} />
          <Swipe className="svc" count={FACILITIES.length} label={c('Facilities')}>
            {FACILITIES.map((f) => (
              <div className="rv" key={f.h}>
                <span className="sic">
                  <Icon name={f.icon} />
                </span>
                <H3 text={c(f.h)} />
                <P text={c(f.p)} />
              </div>
            ))}
          </Swipe>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />
      <WaveDivider from="white" to="sky" />

      {/* 7. Values (sky) */}
      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <SecHead label={c('What we stand for')} h2={c('Three ideas we have kept since 1980.')} />
          <div className="vals" style={{ marginTop: 0 }}>
            {VALUES.map((v) => (
              <div className="rv" key={v.h}>
                <span className="sic">
                  <Icon name={v.icon} />
                </span>
                <H3 text={c(v.h)} />
                <P text={c(v.p)} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      {/* 8. Free camps (white) */}
      <section className="sec">
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="c-6 rv">
            <LabelText text={c('In the community')} />
            <H2 text={c('Free camps in villages and colleges.')} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 20 }}>
              <Lede text={c('The hospital regularly holds free bone and eye screening camps')} />
            </div>
            <div style={{ marginTop: 24 }}>
              <Lnk href="/media/">{c('See camp coverage')}</Lnk>
            </div>
          </div>
          <div className="s-7" style={{ gridColumn: '7/-1' }}>
            <div className="rv">
              <ImageSlot id="about.camps" locale={l} />
            </div>
            <p className="muted" style={{ marginTop: 10, fontSize: '.9rem' }}>
              {c('Representative image')}
            </p>
          </div>
        </div>
      </section>

      {/* 9. Callout */}
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
    </>
  );
}
