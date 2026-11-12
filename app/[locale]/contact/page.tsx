import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { routing, type Locale } from '@/i18n/routing';
import { copy, pageTitle } from '@/lib/copy';
import { SITE } from '@/lib/site-config';
import { LabelText, H1, H2, Lede } from '@/components/primitives';
import { WaveDivider } from '@/components/WaveDivider';
import { Icon, LIcon, type IconName, type LineIconName } from '@/components/icons';
import { SecHead } from '@/components/home/sections';
import { Accordion } from '@/components/sections/bands';
import { Swipe } from '@/components/Swipe';
import { BookingForm } from '@/components/booking/AppointmentForm';
import { MapFacade } from '@/components/MapFacade';
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: pageTitle('contact'),
    description: copy('contact', 'Fill in the form and send it on WhatsApp', l),
    alternates: alternates('/contact/', l),
  };
}

const BRING: { icon: IconName; h: string; p: string }[] = [
  { icon: 'file', h: 'Old reports', p: 'X-rays, scans and discharge papers.' },
  { icon: 'pill', h: 'Your medicines', p: 'The strips or a list of what you take now.' },
  { icon: 'card', h: 'ID and cards', p: 'Aadhaar, and your Ayushman or insurance card' },
  { icon: 'family', h: 'Someone with you', p: 'Helpful for eye drops, surgery days' },
];

const FAQ: [string, string][] = [
  ['Do I need an appointment?', 'Booking ahead by phone or WhatsApp'],
  ['Which doctor should I see?', 'Bones, joints, back and injuries: Dr. Mohit Gupta'],
  ['Is treatment covered under Ayushman Bharat?', 'Gupta Hospital is empanelled under PM-JAY'],
  ['Can I talk to the doctor in Punjabi?', 'Yes. All three doctors speak Punjabi'],
  ['What should I bring to my first visit?', 'All old reports, X-rays and scans'],
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale: l, namespace: 'shell' });
  const c = (en: string) => copy('contact', en, l);

  const reach: { icon: LineIconName; b: string; s: string; go: string; href: string; ext?: boolean }[] = [
    { icon: 'phone', b: SITE.phoneAlt1, s: c('OPD'), go: c('Call'), href: SITE.phoneAlt1Href },
    { icon: 'phone', b: SITE.phoneAlt2, s: c('OPD (alternate)'), go: c('Call'), href: SITE.phoneAlt2Href },
    { icon: 'mail', b: c('Write'), s: SITE.email, go: 'Email', href: `mailto:${SITE.email}`, ext: true },
    { icon: 'wa', b: 'WhatsApp', s: c('Send reports before your visit'), go: c('Open'), href: SITE.whatsapp, ext: true },
  ];

  return (
    <>
      {/* 1. Hero (sky) */}
      <section className="hero hero-c">
        <div className="wrap g12">
          <div className="c-8">
            <LabelText text={t('eyebrow')} />
            <H1 text={c('Book an appointment.')} />
            <div style={{ marginTop: 24 }}>
              <Lede text={c('Fill in the form and send it on WhatsApp')} />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="mint" />

      {/* 2. Form shell + contact kv (mint) */}
      <section className="sec form-sec" style={{ paddingTop: 40 }}>
        <div className="wrap g12">
          <BookingForm
            depts={['Orthopaedics', 'Robotic knee', 'Eye care', 'Mental health', 'Not sure'].map((d) => c(d))}
            source={`${l === 'pa' ? '/pa' : ''}/contact/`}
          />
          <div className="s-9" style={{ gridColumn: '9/-1' }}>
            <dl style={{ margin: 0 }}>
              <div className="kv">
                <dt>
                  <span className="ci">
                    <LIcon name="pin" />
                  </span>
                  {c('Address')}
                </dt>
                <dd>{`${SITE.name}, ${SITE.address}`}</dd>
              </div>
              <div className="kv">
                <dt>
                  <span className="ci">
                    <LIcon name="phone" />
                  </span>
                  {c('Appointments &amp; WhatsApp')}
                </dt>
                <dd>
                  <a href={SITE.phoneMainHref}>{SITE.phoneMain}</a>
                </dd>
              </div>
              <div className="kv">
                <dt>
                  <span className="ci">
                    <LIcon name="eye" />
                  </span>
                  {c('Eye department')}
                </dt>
                <dd>
                  <a href={SITE.phoneEyeHref}>{SITE.phoneEye}</a>
                </dd>
              </div>
              <div className="kv">
                <dt>
                  <span className="ci">
                    <LIcon name="clock" />
                  </span>
                  {c('OPD timings')}
                </dt>
                <dd className="muted">{c('Open 24 hours')}</dd>
              </div>
            </dl>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a className="lnk" href={SITE.mapsUrl} target="_blank" rel="noopener" data-track="directions_click">
                <span>{c('Open in Google Maps')}</span>
                <span className="ar">↗</span>
              </a>
              <a className="lnk" href={SITE.googleBusiness} target="_blank" rel="noopener">
                <span>{t('gbp')}</span>
                <span className="ar">↗</span>
              </a>
            </div>
            <div style={{ marginTop: 20 }}>
              <MapFacade showLabel={c('Show map')} title={c('Map of the area around Gupta Hospital')} />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      {/* 3. What to bring + extra numbers/email/WhatsApp (white) */}
      <section className="sec">
        <div className="wrap">
          <SecHead
            label={c('Before you come')}
            h2={c('What to <span class="em">bring with you.</span>')}
            lede={c('A complete history helps the doctor decide faster')}
          />
          <Swipe className="bring" count={BRING.length} label={c('Before you come')}>
            {BRING.map((b) => (
              <div className="rv" key={b.h}>
                <span className="sic">
                  <Icon name={b.icon} />
                </span>
                <h3>{c(b.h)}</h3>
                <p>{c(b.p)}</p>
              </div>
            ))}
          </Swipe>
          <Swipe className="soc" count={reach.length} label={c('Book &amp; contact')} trackProps={{ style: { marginTop: 16 } }}>
            {reach.map((r) => (
              <a className="rv" href={r.href} target={r.ext ? '_blank' : undefined} rel="noopener" key={r.b}>
                <span className="ico">
                  <LIcon name={r.icon} />
                </span>
                <b>{r.b}</b>
                <span>{r.s}</span>
                <span className="go">{r.go} ↗</span>
              </a>
            ))}
          </Swipe>
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      {/* 4. FAQ (sky) */}
      <section className="sec faq-sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap g12">
          <div className="c-4 rv">
            <LabelText text={c('Questions')} />
            <H2 text={c('Questions families <span class="em">often ask.</span>')} style={{ marginTop: 18 }} />
            <p className="muted" style={{ marginTop: 20 }}>
              {c('Still unsure? Call +91 98787 52241')}
            </p>
          </div>
          <div className="s-6 rv">
            <Accordion items={FAQ.map(([q, a]) => ({ q: c(q), a: c(a) }))} />
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="white" />
    </>
  );
}
