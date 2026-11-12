import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { copy, pageTitle } from '@/lib/copy';
import { SITE } from '@/lib/site-config';
import { LabelText, H1, H2, H3, Lede, CountUp } from '@/components/primitives';
import { RichText } from '@/components/RichText';
import { WaveDivider } from '@/components/WaveDivider';
import { BookButton } from '@/components/Buttons';
import { LIcon, type LineIconName } from '@/components/icons';
import { SecHead } from '@/components/home/sections';
import { PressBoard, MEDIA_CLIPS } from '@/components/PressBoard';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: pageTitle('media'),
    description: copy('media', 'Coverage from local newspapers', l),
    alternates: {
      canonical: l === 'pa' ? '/pa/media/' : '/media/',
      languages: { en: '/media/', pa: '/pa/media/' },
    },
  };
}

const CAMPS: { n: number; label: string }[] = [
  { n: 300, label: 'Jhuneer eye &amp; bone camp' },
  { n: 237, label: 'Camp, 3 December' },
  { n: 200, label: 'Goodwill Society bone camp' },
  { n: 190, label: '26th camp' },
  { n: 150, label: 'Rajindra College students' },
  { n: 75, label: 'Oriya Colony eye camp' },
];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const pa = l === 'pa';
  const t = await getTranslations({ locale: l, namespace: 'shell' });
  const c = (en: string) => copy('media', en, l);

  const socials: { icon: LineIconName; name: string; desc: string; href: string }[] = [
    { icon: 'yt', name: 'YouTube', desc: c('Health talks and explainers from the doctors'), href: SITE.social.youtube },
    { icon: 'ig', name: 'Instagram', desc: c('Camp dates, hospital news and short tips'), href: SITE.social.instagram },
    { icon: 'fb', name: 'Facebook', desc: c('Announcements and events in Bathinda'), href: SITE.social.facebook },
    { icon: 'wa', name: 'WhatsApp', desc: c('Book a visit or send reports to the team'), href: SITE.whatsapp },
  ];

  return (
    <>
      {/* 1. Hero (sky) */}
      <section className="hero hero-c">
        <div className="wrap g12">
          <div className="c-8">
            <LabelText text={t('eyebrow')} />
            <H1 text={c('In the news.')} />
            <div style={{ marginTop: 24 }}>
              <Lede text={c('Coverage from local newspapers')} />
            </div>
            <div className="ctas" style={{ marginTop: 20 }}>
              <BookButton href="/contact/">
                <RichText text={copy('global', 'Book appointment', l)} />
                <span className="ar">→</span>
              </BookButton>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Press board (sky) — drag on desktop, strip on mobile, lightbox */}
      <section className="sec" style={{ paddingTop: 24, background: 'var(--sky)' }}>
        <div className="wrap">
          <PressBoard
            clips={MEDIA_CLIPS}
            big
            hint={pa ? 'ਖਿੱਚੋ · ਪੜ੍ਹਨ ਲਈ ਕਲਿੱਕ ਕਰੋ' : 'Drag · Click to read'}
            label={c('In the news.')}
          />
        </div>
      </section>
      <WaveDivider from="sky" to="brand" />

      {/* 3. Free camps count-up band (brand) */}
      <section className="sec camps-band">
        <div className="wrap g12">
          <div className="c-4">
            <LabelText text={c('Free camps')} />
            <H2 text={c('Free screening camps')} style={{ marginTop: 18 }} />
            <p className="muted" style={{ marginTop: 14, fontSize: '.9rem' }}>
              {c('Numbers as reported in each newspaper.')}
            </p>
          </div>
          <div className="s-6 camps">
            {CAMPS.map((camp) => (
              <div className="rv" key={camp.label}>
                <CountUp n={camp.n} />
                <span>{c(camp.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="brand" to="white" />
      <WaveDivider from="white" to="sky" />

      {/* 4. Social channels (sky) */}
      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <SecHead
            label={c('Follow along')}
            h2={c('Camp dates and health talks, <span class="em">as they happen.</span>')}
            lede={c('Newspaper reports come after the event')}
          />
          <div className="soc">
            {socials.map((s) => (
              <a className="rv" href={s.href} target="_blank" rel="noopener" key={s.name}>
                <span className="ico">
                  <LIcon name={s.icon} />
                </span>
                <b>{s.name}</b>
                <span>{s.desc}</span>
                <span className="go">Open ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      {/* 5. Callout */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="callout rv">
            <H3 text={c('Want to see a doctor? Book a time on WhatsApp.')} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <BookButton href="/contact/">
                <RichText text={c('Book an appointment')} />
                <span className="ar">→</span>
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
