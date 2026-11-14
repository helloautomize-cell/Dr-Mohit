// Mental health & de-addiction page — preview order: ph hero (+ booking and phone),
// services grid + "also treated" note, first-visit steps trail, condition
// groups on teal, stress signs on navy, family FAQ + clinic photo, breathing
// circle, urgent-help line, CTA. The .pg-mind wrapper switches accents to
// teal; the urgent numbers become tel: links.
import Link from 'next/link';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { Icon, type IconName } from '../icons';
import { DeptHero, DeptBookCta, DeptPhoneCta } from './DeptHero';
import { Accordion, Callout } from '../sections/bands';
import { ConditionGroups, StressSigns, SvcCard } from '../sections/cards';
import { Swipe } from '../Swipe';
import { BreatheCircle } from '../tools/BreatheCircle';
import { ImageSlot } from '../ImageSlot';
import { ReviewerBox } from '../Confirm';
import { bookingHref } from '@/lib/booking-context';
import type { ReactNode } from 'react';

const SERVICES: { icon: IconName; h: string; p: string }[] = [
  { icon: 'talk', h: 'Psychotherapy &amp; counselling', p: 'Talking therapy for individuals, at a pace that suits you.' },
  { icon: 'sprout', h: 'De-addiction centre', p: 'Licensed centre for alcohol, opioid and other substance use, with medical and emotional support.' },
  { icon: 'cloud', h: 'Depression', p: 'Assessment and treatment for low mood that does not lift.' },
  { icon: 'calm', h: 'Stress &amp; anxiety', p: 'Help with worry, panic and stress at home or work.' },
  { icon: 'sunmoon', h: 'Bipolar disorder', p: 'Diagnosis and long-term care for mood swings.' },
  { icon: 'family', h: 'Family therapy', p: 'Sessions with family members when it helps recovery.' },
];

const STEPS: { icon: IconName; p: string }[] = [
  { icon: 'talk', p: 'You talk, without being rushed.' },
  { icon: 'bulb', p: 'The doctor explains what may be happening' },
  { icon: 'lock', p: 'You agree a plan together.' },
];

const FAQ: [string, string][] = [
  ['Will anyone know I came to see a psychiatrist?', 'No. What you share and your records'],
  ['Will I have to take medicines for life?', 'Most people do not.'],
  ['Are psychiatric medicines addictive?', 'Most commonly used medicines'],
  ['My family member refuses help. What can I do?', 'You can come alone first'],
  ['Does de-addiction mean being admitted?', 'Not always.'],
  ['“Only weak people need mental health care.”', '<b>Fact:</b> Mental illness'],
];

// Localized urgent-help sentence with the two phone numbers linked.
function UrgentLine({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let k = 0;
  const re = /(14416|112)/g;
  let m: RegExpExecArray | null;
  let last = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a key={k++} href={`tel:${m[0]}`} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
        {m[0]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <p className="muted" style={{ maxWidth: 720 }}>{parts}</p>;
}

export function MentalHealthPage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('mental-health', en, locale);
  return (
    <div className="pg-mind">
      <DeptHero
        page="mental-health"
        locale={locale}
        h1Key="Mental health and de-addiction."
        ledeKey="Since 2000, Dr. Amit Gupta"
        image="mind.hero"
        fitViewport
        ctas={
          <>
            <DeptBookCta page="mental-health" locale={locale} label="Book with Dr. Amit" dept="Mental health" doctor="amit" />
            <DeptPhoneCta />
          </>
        }
      />
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap">
          <span className="label">{c('Services')}</span>
          <Swipe className="svc" count={SERVICES.length} label={c('Services')}>
            {SERVICES.map((s) => (
              <SvcCard key={s.h} icon={s.icon} h3={s.h} p={s.p} />
            ))}
          </Swipe>
          <p className="muted" style={{ marginTop: 28 }}>
            Also treated: obsessive-compulsive disorder, schizophrenia, epilepsy and headaches.
          </p>
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap g12">
          <div className="c-5">
            <span className="label">{c('Your first visit')}</span>
            <h2 style={{ marginTop: 18 }}>{c('What to expect')}</h2>
            <div className="rv" style={{ marginTop: 32 }}>
              <ImageSlot id="mind.first-session" locale={locale} />
            </div>
          </div>
          <div className="s-7 steps trail" data-trail>
            <span className="fill" />
            {STEPS.map((s) => (
              <div className="step rv" style={{ gridTemplateColumns: '80px 1fr' }} key={s.icon}>
                <span className="sic">
                  <Icon name={s.icon} />
                </span>
                <p>{c(s.p)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />
      <WaveDivider from="white" to="teal-dark" />

      <section className="sec on-dark on-teal" style={{ background: 'var(--teal-ink)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 0, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('What we help with')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('More than')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Many people do not know')}</p>
          </div>
          <ConditionGroups locale={locale} />
        </div>
      </section>
      <WaveDivider from="teal-dark" to="navy" />

      <section className="sec on-dark">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 0, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Understanding stress')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('Stress shows up in')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Some stress is a normal')}</p>
          </div>
          <StressSigns locale={locale} />
        </div>
      </section>
      <WaveDivider from="navy" to="white" />

      <section className="sec faq-sec" style={{ background: 'var(--white)' }}>
        <div className="wrap g12">
          <div className="c-4 rv">
            <span className="label">{c('Questions')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Questions families')} />
            </h2>
            <div className="faq-arts" style={{ marginTop: 24 }}>
              <ImageSlot id="mind.faq" locale={locale} caption={c('Psychiatry clinic')} />
              <ImageSlot id="mind.family" locale={locale} />
            </div>
          </div>
          <div className="s-6 rv">
            <Accordion items={FAQ.map(([q, a]) => ({ q: c(q), a: c(a) }))} />
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingBottom: 0 }}>
        <div className="wrap breathe rv">
          <BreatheCircle locale={locale} />
          <div className="copy">
            <span className="label">{c('A moment for you')}</span>
            <h2 style={{ marginTop: 16 }}>
              <RichText text={c('Breathe slowly with the')} />
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {c('Asking for help is not weakness')}
            </p>
            <Link
              className="btn btn-brand"
              style={{ marginTop: 30 }}
              href={bookingHref({ dept: 'Mental health' })}
            >
              <span>{c('Book a private visit')}</span>
              <span className="ar">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingBlock: 40 }}>
        <div className="wrap">
          <UrgentLine text={c('If you need urgent help')} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Callout page="mental-health" locale={locale} />
          <div style={{ marginTop: 28 }}>
            <ReviewerBox doctor="Dr. Amit Gupta" />
          </div>
        </div>
      </section>
    </div>
  );
}
