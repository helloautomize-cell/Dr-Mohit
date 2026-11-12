import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { copy } from '@/lib/copy';
import { Logo } from '@/components/Logo';
import LocaleSwitch from '@/components/LocaleSwitch';
import { RichText } from '@/components/RichText';
import { LabelText, H2, Lede, CountUp } from '@/components/primitives';
import {
  BookButton,
  BtnBrand,
  BtnInk,
  BtnLine,
  BtnWLine,
  Lnk,
} from '@/components/Buttons';
import { WaveDivider, BAND_HEX, type Band } from '@/components/WaveDivider';
import { ImageSlot } from '@/components/ImageSlot';
import {
  TreatmentGrid,
  OrthoServices,
  VelysAttuneDuo,
  DuoCard,
  FitCheck,
  ConditionGroups,
  StressSigns,
  ValuesGrid,
  BringGrid,
  SocialCards,
} from '@/components/sections/cards';
import {
  FactsBand,
  HomeFaq,
  StoryTrail,
  RoboticSteps,
  CataractDay,
  JourneyPath,
  FacilitiesBand,
  Callout,
  VisitBand,
  MobileBar,
} from '@/components/sections/bands';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

/* ---------- contrast math (WCAG 2.x relative luminance) ---------- */
function lum(hex: string) {
  const c = hex.replace('#', '');
  const ch = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = ch.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * (lin[0] ?? 0) + 0.7152 * (lin[1] ?? 0) + 0.0722 * (lin[2] ?? 0);
}
const ratio = (a: string, b: string) => {
  const x = Math.max(lum(a), lum(b));
  const y = Math.min(lum(a), lum(b));
  return (x + 0.05) / (y + 0.05);
};

const LIGHT_TEXT: [string, string][] = [
  ['ink', '#0D1520'],
  ['ink-600', '#3D4652'],
  ['mute (labels)', '#6A7380'],
  ['mute-band (labels on tints)', '#59616D'],
  ['brand (links, accents)', '#1D4E9E'],
  ['leaf (headings, icons)', '#1E9A4B'],
  ['leaf-ink (labels on mint)', '#157A3B'],
  ['teal (headings, icons)', '#0A8A80'],
  ['teal-ink (labels on teal)', '#076E66'],
  ['emergency', '#C62828'],
];
const LIGHT_BANDS: [string, string][] = [
  ['white', '#FFFFFF'],
  ['sky', '#EEF3FB'],
  ['mint', '#EAF6EF'],
  ['teal-50', '#E4F3F1'],
];
const DARK_TEXT: [string, string][] = [
  ['white', '#FFFFFF'],
  ['sky text #D2E1F7', '#D2E1F7'],
  ['label #BFD6F6', '#BFD6F6'],
  ['fact accent #8FE0AE', '#8FE0AE'],
  ['em accent #7FD3A0', '#7FD3A0'],
  ['dt #8A94A3', '#8A94A3'],
  ['body #B7C6DD', '#B7C6DD'],
];
const DARK_BANDS: [string, string][] = [
  ['brand', '#1D4E9E'],
  ['navy', '#0F2A55'],
  ['night', '#0D1520'],
];

function ContrastTable({
  text,
  bands,
}: {
  text: [string, string][];
  bands: [string, string][];
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="sg-table">
        <thead>
          <tr>
            <th>Text colour</th>
            {bands.map(([n]) => (
              <th key={n}>{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {text.map(([tn, th]) => (
            <tr key={tn}>
              <td>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: th,
                    border: '1px solid var(--line)',
                    marginRight: 8,
                    verticalAlign: '-1px',
                  }}
                />
                {tn} <span style={{ color: 'var(--mute)' }}>{th}</span>
              </td>
              {bands.map(([bn, bh]) => {
                const r = ratio(th, bh);
                const pass = r >= 4.5;
                return (
                  <td key={bn} className={pass ? 'pass' : 'fail'}>
                    {r.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SWATCHES: [string, string, string][] = [
  ['brand-500', '#1D4E9E', 'primary action, facts band, facilities band'],
  ['brand-700', '#153C7C', 'hover'],
  ['brand-100', '#DCE7F7', 'leaf-soft accents'],
  ['brand-50 (sky)', '#EEF3FB', 'tinted bands'],
  ['leaf-500', '#1E9A4B', 'accents, checkmarks, .em-g'],
  ['leaf-100', '#D3EEDC', 'lit trail dots'],
  ['mint-50', '#EAF6EF', 'tinted bands'],
  ['navy-900', '#0F2A55', 'journey, stress, visit bands'],
  ['teal-500', '#0A8A80', 'mental health accent'],
  ['teal-50', '#E4F3F1', 'mental health tint band'],
  ['ink', '#0D1520', 'text, night band'],
  ['ink-600', '#3D4652', 'secondary text'],
  ['mute', '#6A7380', 'labels, muted text (white only)'],
  ['mute-band', '#59616D', 'labels on tinted bands'],
  ['line', '#E3E6EA', 'hairlines'],
  ['emergency', '#C62828', 'urgent help only'],
  ['grad-brand', 'linear-gradient(90deg,#1D4E9E,#0A8A80)', 'Book button + mobile bar only'],
];

function Spec({ children }: { children: React.ReactNode }) {
  return <p className="sg-spec">{children}</p>;
}

function SectionHead({ n, en, pa, l }: { n: string; en: string; pa: string; l: Locale }) {
  return (
    <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 18, marginTop: 0 }}>
      <span className="label">{n}</span>
      <h2 style={{ fontSize: 'clamp(1.5rem,2.6vw,2.1rem)', marginTop: 10 }}>
        {l === 'pa' ? pa : en}
      </h2>
    </div>
  );
}

const WAVE_PAIRS: [Band, Band][] = [
  ['sky', 'brand'],
  ['brand', 'white'],
  ['white', 'mint'],
  ['mint', 'white'],
  ['white', 'sky'],
  ['sky', 'navy'],
  ['navy', 'white'],
  ['white', 'brand'],
  ['brand', 'sky'],
  ['sky', 'white'],
  ['mint', 'sky'],
  ['white', 'navy'],
  ['sky', 'mint'],
  ['navy', 'mint'],
  ['white', 'teal'],
  ['teal', 'navy'],
  ['mint', 'teal'],
  ['teal', 'white'],
];

export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = (p: string, en: string) => copy(p, en, l);
  const pa = (en: string) => copy('home', en, 'pa');

  return (
    <>
      {/* styleguide header */}
      <div className="wrap" style={{ paddingBlock: '28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <a href={l === 'pa' ? '/pa/' : '/'}>
            <Logo locale={l} height={40} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span className="label">{l === 'pa' ? 'ਡਿਜ਼ਾਈਨ ਸਿਸਟਮ' : 'Design system'}</span>
            <LocaleSwitch />
          </div>
        </div>
        <p className="sg-note" style={{ marginTop: 14 }}>
          {l === 'pa'
            ? 'ਮੰਜ਼ੂਰਸ਼ੁਦਾ ਪੂਰਵ-ਝਲਕ ਦੇ ਹਰ ਕੰਪੋਨੈਂਟ ਦਾ ਹਵਾਲਾ। ਇਹ ਪੰਨਾ noindex ਹੈ।'
            : 'Reference for every component of the approved preview. This page is noindex and excluded from the sitemap.'}
        </p>
      </div>

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 88, paddingBlock: '56px 96px' }}>
        {/* ============ 01 Colour ============ */}
        <section>
          <SectionHead n="01" en="Colour" pa="ਰੰਗ" l={l} />
          <div className="sg-grid" style={{ marginTop: 28 }}>
            {SWATCHES.map(([n, v, use]) => (
              <div className="sg-swatch" key={n}>
                <div className="sw" style={{ background: v }} />
                <div className="inf">
                  <b>--{n}</b>
                  {v}
                  <br />
                  <span style={{ color: 'var(--mute)' }}>{use}</span>
                </div>
              </div>
            ))}
          </div>
          <Spec>contrast: text colours on light bands (WCAG AA, 4.5:1 minimum)</Spec>
          <ContrastTable text={LIGHT_TEXT} bands={LIGHT_BANDS} />
          <Spec>contrast: light text on dark bands</Spec>
          <ContrastTable text={DARK_TEXT} bands={DARK_BANDS} />
          <Spec>
            {l === 'pa'
              ? 'ਨੋਟ: ਪੂਰਵ-ਝਲਕ ਦੇ mute #6A7380 ਸਕਾਈ/ਮਿੰਟ ਤੇ 4.3:1 ਬੈਠਦਾ ਹੈ, ਇਸ ਲਈ ਰੰਗੀਨ ਬੈਂਡਾਂ ਤੇ ਲੇਬਲ --mute-band #59616D (5.6:1) ਵਰਤਦੇ ਹਨ।'
              : 'Note: the preview\u2019s mute #6A7380 measures 4.3:1 on sky/mint, so labels on tinted bands use --mute-band #59616D (5.6:1). Same for leaf/teal labels -> --leaf-ink / --teal-ink.'}
          </Spec>
        </section>

        {/* ============ 02 Typography ============ */}
        <section>
          <SectionHead n="02" en="Type" pa="ਟਾਈਪ" l={l} />
          <div className="g12" style={{ marginTop: 28 }}>
            <div className="c-6 sg-type">
              <span className="tag">English · Geist / Geist Mono</span>
              <div>
                <span className="label">Label · Geist Mono .74rem</span>
              </div>
              <div>
                <p className="lede">{t('home', 'One family of doctors on Power House Road')}</p>
                <Spec>lede · clamp(1.05,1.4vw,1.2rem) / ink-2 / 54ch</Spec>
              </div>
              <div>
                <h3>{t('home', 'A clinic opens')}</h3>
                <Spec>h3 · clamp(1.25,1.8vw,1.55rem) / -0.02em</Spec>
              </div>
              <div>
                <h2 style={{ fontSize: 'clamp(2rem,4vw,3.4rem)' }}>
                  <RichText text={t('home', 'Questions families <span class="em">often ask.</span>')} />
                </h2>
                <Spec>h2 · clamp(2,4vw,3.4rem) / 300 / -0.035em · .em = brand</Spec>
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(2.6rem,6vw,5.4rem)' }}>
                  <RichText text={t('home', 'Bone, eye and mental health care')} />
                </h1>
                <Spec>h1 · clamp(2.6,6vw,5.4rem) / 300 / -0.035em</Spec>
              </div>
            </div>
            <div className="c-6 sg-type" lang="pa-IN">
              <span className="tag">Gurmukhi · Noto Sans Gurmukhi</span>
              <div>
                <span className="label">{pa('Treatments')}</span>
              </div>
              <div>
                <p className="lede">{pa('One family of doctors on Power House Road')}</p>
                <Spec>lede · html[lang=&quot;pa-IN&quot;] switches family</Spec>
              </div>
              <div>
                <h3>{pa('A clinic opens')}</h3>
              </div>
              <div>
                <h2 style={{ fontSize: 'clamp(2rem,4vw,3.4rem)' }}>
                  <RichText text={pa('Questions families often ask.')} />
                </h2>
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(2.6rem,6vw,5.4rem)' }}>
                  <RichText text={pa('Bone, eye and mental health care')} />
                </h1>
                <Spec>letter-spacing -0.01em / line-height 1.25</Spec>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 03 Buttons ============ */}
        <section>
          <SectionHead n="03" en="Buttons and links" pa="ਬਟਨ ਅਤੇ ਲਿੰਕ" l={l} />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 28 }}>
            <BookButton href="#">{t('global', 'Book appointment')}</BookButton>
            <BtnBrand href="#">{t('home', 'Book an appointment')}</BtnBrand>
            <BtnInk href="#">{l === 'pa' ? 'ਹੋਰ ਜਾਣੋ' : 'Learn more'}</BtnInk>
            <BtnLine href={SITE.phoneMainHref}>{SITE.phoneMain}</BtnLine>
            <Lnk href="#" internal>
              {t('home', 'The full story')}
            </Lnk>
          </div>
          <div style={{ background: 'var(--navy)', borderRadius: 22, padding: '28px 32px', marginTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <BtnWLine href="#">{t('home', 'Directions')}</BtnWLine>
            <BookButton href="#">{t('global', 'Book appointment')}</BookButton>
          </div>
          <Spec>
            .btn-book (gradient: the one allowed gradient surface) · .btn-brand · .btn-ink · .btn-line · .btn-wline on navy · .lnk arrow link. Height 50px, pill radius, 48px+ tap targets.
          </Spec>
        </section>

        {/* ============ 04 Eyebrow + heading + lede ============ */}
        <section>
          <SectionHead n="04" en="Section header block" pa="ਸੈਕਸ਼ਨ ਸਿਰਲੇਖ" l={l} />
          <div style={{ maxWidth: 720, marginTop: 28 }}>
            <LabelText text={t('home', 'Treatments')} />
            <H2 text={t('home', 'Care for bones, eyes <span class="em-g">and the mind.</span>')} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 22 }}>
              <Lede text={t('home', 'Three departments, each led by a specialist')} />
            </div>
          </div>
          <Spec>.label (mono eyebrow) + h2 with .em + .lede — the standard section open</Spec>
        </section>
      </div>

      {/* ============ 05 Waves ============ */}
      <div className="wrap">
        <SectionHead n="05" en="Wave dividers" pa="ਵੇਵ ਡਿਵਾਈਡਰ" l={l} />
        <Spec>every colour pair used in the preview · two drifting paths · aria-hidden · reduced-motion pauses drift</Spec>
      </div>
      <div style={{ display: 'grid', gap: 0, marginTop: 20 }}>
        {WAVE_PAIRS.map(([f, t2]) => (
          <div key={f + t2} style={{ background: BAND_HEX[f] }}>
            <div className="wrap" style={{ padding: '14px 0 0', display: 'flex', justifyContent: 'space-between' }}>
              <span className="sg-chip" style={{ background: 'rgba(255,255,255,.75)' }}>{f}</span>
              <span className="sg-chip" style={{ background: 'rgba(255,255,255,.75)' }}>{'→ ' + t2}</span>
            </div>
            <WaveDivider from={f} to={t2} />
            <div style={{ background: BAND_HEX[t2], height: 10 }} />
          </div>
        ))}
      </div>

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 88, paddingBlock: '88px 96px' }}>
        {/* ============ 06 Reveal + headings ============ */}
        <section>
          <SectionHead n="06" en="Reveal and word-mask headings" pa="ਰਿਵੀਲ ਅਤੇ ਸਿਰਲੇਖ" l={l} />
          <div className="g12" style={{ marginTop: 28 }}>
            <div className="c-7">
              <H2 text={t('home', 'From first call to <span class="em">feeling better.</span>')} />
              <Spec>h1/h2 split into masked words (.w &gt; .wi) and rise when scrolled into view — this heading animated on entry. Scroll back up and re-enter to see it again.</Spec>
            </div>
            <div className="c-5">
              <div className="rv" style={{ border: '1px solid var(--line)', borderRadius: 22, padding: 24 }}>
                <b style={{ fontSize: '2.2rem', fontWeight: 300 }}><CountUp n={44} /></b>
                <p className="muted" style={{ marginTop: 8 }}>{t('home', 'years of care in Bathinda')}</p>
              </div>
              <Spec>.rv fade-up on scroll (.pre offscreen) · [data-count] counts up on entry · prefers-reduced-motion renders everything static</Spec>
            </div>
          </div>
        </section>
      </div>

      {/* ============ 07 Facts band ============ */}
      <div className="wrap">
        <SectionHead n="07" en="Facts band" pa="ਫ਼ੈਕਟਸ ਬੈਂਡ" l={l} />
        <Spec>.facts-band on brand blue · count-ups · 1980 / 3 departments / PM-JAY 2019 / Tribune Award 2025</Spec>
      </div>
      <FactsBand locale={l} />

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 88, paddingBlock: '88px 96px' }}>
        {/* ============ 08 Service cards ============ */}
        <section>
          <SectionHead n="08" en="Service cards" pa="ਸਰਵਿਸ ਕਾਰਡ" l={l} />
          <Spec>.svc 3-col card grid · duotone icons in .sic (accent --c, tint --t) · hover lift + icon tilt · dept accents: .pg-eye leaf, .pg-mind teal</Spec>
          <OrthoServices locale={l} />
        </section>

        {/* ============ 09 Treatment cards ============ */}
        <section>
          <SectionHead n="09" en="Treatment cards" pa="ਟ੍ਰੀਟਮੈਂਟ ਕਾਰਡ" l={l} />
          <Spec>.tgrid / .tcard with the preview&#39;s six animated SVGs (.tart) · whole card is one link (stretched-link pattern)</Spec>
          <TreatmentGrid locale={l} />
        </section>

        {/* ============ 10 Accordion ============ */}
        <section className="g12">
          <div className="c-4">
            <SectionHead n="10" en="Accordion" pa="ਐਕਰਡੀਅਨ" l={l} />
            <Spec>.acc details/summary · + rotates to × · text always in initial HTML for crawling</Spec>
          </div>
          <div className="s-7"><HomeFaq locale={l} /></div>
        </section>

        {/* ============ 11 Trail timelines ============ */}
        <section>
          <SectionHead n="11" en="Trail timelines" pa="ਟ੍ਰੇਲ ਟਾਈਮਲਾਈਨ" l={l} />
          <div className="g12" style={{ marginTop: 28 }}>
            <div className="c-6">
              <Spec>.tl.trail — brand fill scales with scroll, dots light (.lit), dashed water-flow ::after</Spec>
              <StoryTrail locale={l} />
            </div>
            <div className="c-6">
              <Spec>.steps.trail — icon steps (robotic knee five-step pattern)</Spec>
              <RoboticSteps locale={l} />
            </div>
          </div>
          <div style={{ marginTop: 48 }}>
            <Spec>.steps.trail.tday — time chips (cataract surgery day)</Spec>
            <CataractDay locale={l} />
          </div>
        </section>
      </div>

      {/* ============ 12 Journey path (navy) ============ */}
      <section className="sec" style={{ background: 'var(--navy)', color: '#fff', paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="wrap">
          <span className="label" style={{ color: '#9FC0F0' }}>12 · {t('home', 'Your journey')}</span>
          <h2 style={{ marginTop: 18 }}>
            <RichText text={t('home', 'From first call to <span class="em">feeling better.</span>')} />
          </h2>
          <Spec>scroll-drawn .jp path + lit .jn nodes · mobile: vertical dashed water-flow with .jic icons</Spec>
          <JourneyPath locale={l} />
        </div>
      </section>

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 88, paddingBlock: '88px 96px' }}>
        {/* ============ 13 Duo cards ============ */}
        <section>
          <SectionHead n="13" en="Duo cards" pa="ਡੂਓ ਕਾਰਡ" l={l} />
          <Spec>.duo --n columns · VELYS + ATTUNE pair (trademarks preserved) and the 3-lens variant</Spec>
          <VelysAttuneDuo locale={l} />
          <div className="duo" style={{ ['--n' as string]: 3 }}>
            {(['Monofocal', 'Toric', 'Multifocal'] as const).map((tg) => (
              <DuoCard
                key={tg}
                locale={l}
                tag={t('eye-care', tg)}
                h3={t('eye-care', tg === 'Monofocal' ? 'Clear at one distance' : tg === 'Toric' ? 'Corrects astigmatism' : 'Near and far')}
                p={t('eye-care', tg === 'Monofocal' ? 'Usually set for distance' : tg === 'Toric' ? 'For people with a cylindrical number' : 'Can reduce the need for glasses')}
                list={[]}
              />
            ))}
          </div>
        </section>

        {/* ============ 14 Fit check ============ */}
        <section>
          <SectionHead n="14" en="Fit check" pa="ਫ਼ਿਟ ਚੈੱਕ" l={l} />
          <Spec>.fit two-column ✓/! lists + disclaimer line — guide, not a diagnosis</Spec>
          <FitCheck locale={l} />
        </section>

        {/* ============ 15 Condition groups ============ */}
        <section>
          <SectionHead n="15" en="Condition groups" pa="ਕੰਡੀਸ਼ਨ ਗਰੁੱਪ" l={l} />
          <Spec>.cg 3-col cards · teal icons (.pg-mind accent) + chip lists</Spec>
          <ConditionGroups locale={l} />
        </section>
      </div>

      {/* ============ 16 Stress signs on navy ============ */}
      <section className="sec" style={{ background: 'var(--navy)', color: '#fff', paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="wrap">
          <span className="label" style={{ color: '#9FC0F0' }}>16 · {t('mental-health', 'Understanding stress')}</span>
          <h2 style={{ marginTop: 18 }}>
            <RichText text={t('mental-health', 'Stress shows up in <span class="em">four places.</span>')} />
          </h2>
          <Spec>.signs 4-col translucent cards on navy · same duotone icon system</Spec>
          <StressSigns locale={l} />
        </div>
      </section>

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 88, paddingBlock: '88px 96px' }}>
        {/* ============ 17 Values ============ */}
        <section>
          <SectionHead n="17" en="Values" pa="ਮੁੱਲ" l={l} />
          <Spec>.vals — three ideas kept since 1980</Spec>
          <div style={{ marginTop: 24 }}>
            <ValuesGrid locale={l} />
          </div>
        </section>

        {/* ============ 18 Social cards ============ */}
        <section>
          <SectionHead n="18" en="Social and contact cards" pa="ਸੋਸ਼ਲ ਕਾਰਡ" l={l} />
          <Spec>.soc link cards · YouTube / Instagram / Facebook / WhatsApp and the contact variant</Spec>
          <SocialCards locale={l} />
        </section>

        {/* ============ 19 What to bring ============ */}
        <section>
          <SectionHead n="19" en="What to bring grid" pa="ਕੀ ਲਿਆਉਣਾ ਹੈ" l={l} />
          <Spec>.bring — documents, medicines, ID, family member</Spec>
          <div style={{ marginTop: 24 }}>
            <BringGrid locale={l} />
          </div>
        </section>
      </div>

      {/* ============ 20 Facilities band ============ */}
      <div className="wrap">
        <SectionHead n="20" en="Facilities band" pa="ਸਹੂਲਤਾਂ ਬੈਂਡ" l={l} />
        <Spec>.fac-band on brand · .trio photo row with caption pills · eight .fac translucent cards</Spec>
      </div>
      <FacilitiesBand locale={l} />

      {/* ============ 21 Callout + 22 Visit band ============ */}
      <div className="wrap" style={{ paddingTop: 88 }}>
        <SectionHead n="21" en="CTA callout" pa="ਕਾਲਆਉਟ" l={l} />
        <Spec>.callout brand card · leaf circle motif · white book button</Spec>
      </div>
      <Callout locale={l} />
      <div className="wrap" style={{ paddingTop: 88 }}>
        <SectionHead n="22" en="Visit band" pa="ਵਿਜ਼ਿਟ ਬੈਂਡ" l={l} />
        <Spec>.band on night navy · .kv key/value rows · book button renders leaf-green on navy per preview</Spec>
      </div>
      <VisitBand locale={l} />

      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 88, paddingBlock: '88px 96px' }}>
        {/* ============ 23 Image slots ============ */}
        <section>
          <SectionHead n="23" en="Image slots" pa="ਚਿੱਤਰ ਸਲਾਟ" l={l} />
          <Spec>.aimg placeholder (planned filename chip) vs filled slot — next/image, AVIF/WebP, EXIF-stripped masters</Spec>
          <div className="g12" style={{ marginTop: 24 }}>
            <div className="c-6">
              <ImageSlot id="mind.family" locale={l} />
              <Spec>empty slot: mind.family (counselling room)</Spec>
            </div>
            <div className="c-6">
              <ImageSlot id="home.story" locale={l} caption={t('home', 'Power House Road, Bathinda')} />
              <Spec>filled slot: home.story with caption pill</Spec>
            </div>
          </div>
        </section>

        {/* ============ 24 Mobile action bar ============ */}
        <section>
          <SectionHead n="24" en="Mobile action bar" pa="ਮੋਬਾਈਲ ਬਾਰ" l={l} />
          <Spec>.mbar · Call / WhatsApp / Book(gradient) · slides in after 360px scroll · shown here in a 390px frame</Spec>
          <div className="sg-frame" style={{ marginTop: 24 }}>
            <div className="frame-body">
              <div style={{ padding: 24, color: 'var(--mute)', fontSize: '.9rem' }}>
                {l === 'pa' ? 'ਪੇਜ ਸਮੱਗਰੀ ਇਥੇ…' : 'page content scrolls here…'}
              </div>
              <MobileBar locale={l} />
            </div>
          </div>
        </section>

        {/* ============ 25 Responsive + reduced motion ============ */}
        <section>
          <SectionHead n="25" en="Responsive and reduced-motion rules" pa="ਰਿਸਪੌਂਸਿਵ ਨਿਯਮ" l={l} />
          <div style={{ marginTop: 24 }}>
            {[
              'body text >= 17px · tap targets >= 48px',
              '.wrap 1320px · 24px gutters (18px under 600px)',
              'g12 collapses to one column under 900px',
              'tgrid 3 -> 2 (980px) -> 1 (620px) · svc/cg/fac similar',
              'jflow svg path -> vertical dashed trail under 900px',
              'mobile bar appears under 1120px after 360px scroll',
              'prefers-reduced-motion: waves, count-ups, word-mask, trails, parallax all render static',
              'one gradient surface per viewport maximum (Book button / mobile bar)',
              'no em/en dashes in UI copy',
            ].map((r) => (
              <span className="sg-chip" key={r}>{r}</span>
            ))}
          </div>
        </section>

        <p className="sg-note">
          Gupta Hospital design system · Phase 1 reference · {l === 'pa' ? 'ਪੰਜਾਬੀ' : 'English'} ·{' '}
          <a className="lnk" href={l === 'pa' ? '/pa/' : '/'} style={{ display: 'inline-flex' }}>
            {l === 'pa' ? 'ਮੁੱਖ ਪੰਨਾ' : 'Back to site'}
          </a>
        </p>
      </div>
    </>
  );
}
