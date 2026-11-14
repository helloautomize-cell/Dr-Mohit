// Card and grid sections, ported 1:1 from the approved preview. Copy comes from
// resources/content/site-content.en-pa.json via copy(); SVGs are the preview's
// own animated treatment illustrations and kit duotone icons.
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { Icon, LIcon, type IconName, type LineIconName } from '../icons';
import { ImageSlot } from '../ImageSlot';
import type { SlotId } from '@/lib/image-slots';
import { SITE } from '@/lib/site-config';
import { whatsappAsk } from '@/lib/whatsapp';
import { Swipe } from '../Swipe';

type L = Locale;
const c = (page: string, en: string, l: L) => copy(page, en, l);

/* ============================= Treatment cards ============================= */

function TartRobotic() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="62" cy="62" r="50" />
      <path className="bone" d="M50 6h22l1 40c9 3 11 13 4 17-5 3-11 0-16 0s-11 3-16 0c-7-4-5-14 4-17z" />
      <path className="bone" d="M44 72c11-3 23-3 34 0l-2 8-3 2-1 34H51l-1-34-3-2z" />
      <path className="cart" d="M45 64c10 4 21 4 31 0" />
      <g className="arm">
        <rect className="m" x="126" y="98" width="28" height="10" rx="3" />
        <path className="mk" d="M140 98V72L112 54 90 62" />
        <circle className="j" cx="140" cy="72" r="5" />
        <circle className="j" cx="112" cy="54" r="5" />
        <path className="mk" d="M90 62l-8 3" strokeWidth="4" />
      </g>
      <circle className="dotp" cx="78" cy="66" r="3.5" />
    </svg>
  );
}

function TartKneeHip() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <path className="bone" d="M68 4h24l1 38c10 3 12 14 4 18-6 3-12 0-17 0s-11 3-17 0c-8-4-6-15 4-18z" />
      <path className="metal" d="M62 50c6 9 30 9 36 0" />
      <path className="bone" d="M62 74c12-3 24-3 36 0l-2 8-3 2-1 34H69l-1-34-3-2z" />
      <rect className="metal-f" x="60" y="68" width="40" height="7" rx="3" />
      <g className="spark">
        <path d="M114 30l4-9M120 38l9-3M110 22l-1-9" />
      </g>
    </svg>
  );
}

function TartFracture() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <g transform="rotate(-28 80 60)">
        <circle className="bone" cx="26" cy="51" r="10" />
        <circle className="bone" cx="26" cy="69" r="10" />
        <circle className="bone" cx="134" cy="51" r="10" />
        <circle className="bone" cx="134" cy="69" r="10" />
        <rect className="bone" x="24" y="51" width="112" height="18" rx="6" />
        <path className="crack" d="M80 51l5 5-5 4 5 9" />
        <g className="plate">
          <rect x="56" y="42" width="48" height="7" rx="3.5" />
          <circle className="screw" cx="62" cy="45.5" r="1.8" />
          <circle className="screw" cx="72" cy="45.5" r="1.8" />
          <circle className="screw" cx="88" cy="45.5" r="1.8" />
          <circle className="screw" cx="98" cy="45.5" r="1.8" />
        </g>
      </g>
    </svg>
  );
}

function TartSpine() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <g className="spine">
        <rect className="vert" x="66" y="8" width="26" height="13" rx="5" />
        <rect className="disc d1" x="68" y="22" width="22" height="4" rx="2" />
        <rect className="vert" x="69" y="27" width="28" height="14" rx="5" />
        <rect className="disc d2" x="71" y="42" width="24" height="4" rx="2" />
        <rect className="vert" x="70" y="47" width="30" height="15" rx="5" />
        <rect className="disc d3 hot" x="71" y="63" width="27" height="4" rx="2" />
        <rect className="vert" x="67" y="68" width="32" height="16" rx="5" />
        <rect className="disc d4" x="67" y="85" width="28" height="4" rx="2" />
        <rect className="vert" x="62" y="90" width="34" height="17" rx="5" />
      </g>
      <circle className="pain" cx="99" cy="65" r="6" />
    </svg>
  );
}

function TartEye() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <path className="rays" d="M8 48h30M4 60h34M8 72h30" />
      <path className="ew" d="M40 60c14-22 30-30 46-30s32 8 46 30c-14 22-30 30-46 30S54 82 40 60z" />
      <circle className="iris" cx="86" cy="60" r="18" />
      <circle className="pupil" cx="86" cy="60" r="8" />
      <circle cx="91" cy="55" r="3" fill="#fff" />
      <path className="lid" d="M40 60c14-22 30-30 46-30s32 8 46 30c-14 4-30 6-46 6S54 64 40 60z" />
    </svg>
  );
}

function TartMind() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <path className="head" d="M62 112V94c-16-5-24-19-22-35 2-24 20-38 42-38 24 0 38 16 38 34l8 14-8 2v12c0 6-6 8-12 8H98v21z" />
      <g className="sprout">
        <path className="stem" d="M82 70V44" />
        <path className="leaf" d="M82 54c-11-1-16-9-14-17 9 0 14 8 14 17z" />
        <path className="leaf r" d="M82 48c10-1 15-8 13-16-8 0-13 7-13 16z" />
      </g>
      <path className="heart" d="M124 26c-3-4-9-2-9 2 0 4 9 9 9 9s9-5 9-9c0-4-6-6-9-2z" />
    </svg>
  );
}

function TartKneePartial() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <path className="bone" d="M68 4h24l1 38c10 3 12 14 4 18-6 3-12 0-17 0s-11 3-17 0c-8-4-6-15 4-18z" />
      <path className="metal" d="M62 50c3 6 9 9 16 9" />
      <path className="cart" d="M84 59c6 0 12-3 15-9" />
      <path className="bone" d="M62 74c12-3 24-3 36 0l-2 8-3 2-1 34H69l-1-34-3-2z" />
      <rect className="metal-f" x="60" y="68" width="19" height="7" rx="3" />
      <path className="cart" d="M82 71.5h16" />
      <g className="spark">
        <path d="M50 30l-4-9M44 38l-9-3" />
      </g>
    </svg>
  );
}

function TartHip() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <path className="bone" d="M24 44c8-22 42-32 68-24 14 4 22 14 24 26-8-6-18-8-26-4-4-10-14-16-26-14-14 2-28 8-40 16z" />
      <path className="metal" d="M60 52a16 16 0 0 1 32 0" />
      <circle className="metal-f" cx="76" cy="53" r="11" />
      <path className="bone" d="M80 60l16 10-8 46H74l2-44z" />
      <path className="metal" d="M80 60l8 10-3 30" strokeWidth="5" />
      <g className="spark">
        <path d="M112 70l9-3M110 80l8 4" />
      </g>
    </svg>
  );
}

function TartScope() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="70" cy="62" r="50" />
      <path className="bone" d="M44 6h22l1 40c9 3 11 13 4 17-5 3-11 0-16 0s-11 3-16 0c-7-4-5-14 4-17z" />
      <path className="bone" d="M38 72c11-3 23-3 34 0l-2 8-3 2-1 34H45l-1-34-3-2z" />
      <path className="cart" d="M39 64c10 4 21 4 31 0" />
      <path className="scope" d="M150 92L74 66" />
      <circle className="dotp" cx="74" cy="66" r="3.5" />
      <rect className="scr" x="108" y="8" width="44" height="30" rx="5" />
      <path className="scrin" d="M116 30c6-12 22-12 28 0" />
    </svg>
  );
}

function TartPhysio() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <circle className="bl" cx="80" cy="60" r="50" />
      <rect className="mat" x="14" y="92" width="132" height="8" rx="4" />
      <circle className="figh" cx="30" cy="80" r="9" />
      <path className="fig" d="M40 86h52M92 86l38 2M58 86l8 6" />
      <g className="legup">
        <path className="fig" d="M92 86l40-26" />
      </g>
    </svg>
  );
}

export const TREATMENT_ART = {
  robotic: TartRobotic,
  kneehip: TartKneeHip,
  kneepartial: TartKneePartial,
  hip: TartHip,
  scope: TartScope,
  physio: TartPhysio,
  fracture: TartFracture,
  spine: TartSpine,
  eye: TartEye,
  mind: TartMind,
} as const;
export type TreatmentArt = keyof typeof TREATMENT_ART;

export function TreatmentCard({
  art,
  cat,
  h3,
  p,
  cta,
  href = '#',
  accent = 'var(--brand)',
  tint = 'var(--sky)',
}: {
  art: TreatmentArt;
  cat: string;
  h3: string;
  p: string;
  cta: string;
  href?: string;
  accent?: string;
  tint?: string;
}) {
  const Art = TREATMENT_ART[art];
  const external = href.startsWith('http');
  return (
    <a
      className="tcard rv"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      style={{ ['--c' as string]: accent, ['--t' as string]: tint }}
    >
      <div className="tart">
        <Art />
      </div>
      <span className="cat">{cat}</span>
      <h3>
        <RichText text={h3} />
      </h3>
      <p>
        <RichText text={p} />
      </p>
      <span className="ask">
        {cta} →
      </span>
    </a>
  );
}

export function TreatmentGrid({ locale, only }: { locale: L; only?: string[] }) {
  const lm = c('home', 'Learn more', locale);
  const cat = {
    o: c('home', 'Orthopaedics', locale),
    e: c('home', 'Eye care', locale),
    m: c('home', 'Mental health', locale),
  };
  const cards: Parameters<typeof TreatmentCard>[0][] = [
    { art: 'robotic', cat: cat.o, h3: c('home', 'Robotic knee replacement', locale), p: c('home', 'Planned around your own knee', locale), cta: lm, href: '/orthopaedics/robotic-knee-replacement/' },
    { art: 'kneehip', cat: cat.o, h3: c('home', 'Knee &amp; hip replacement', locale), p: c('home', 'Total and partial knee replacement', locale), cta: lm, href: '/orthopaedics/' },
    { art: 'fracture', cat: cat.o, h3: c('home', 'Fractures &amp; trauma', locale), p: c('home', 'Accident injuries, hip fractures', locale), cta: lm, href: '/orthopaedics/', accent: '#A83828', tint: '#FBEDEA' },
    { art: 'spine', cat: cat.o, h3: c('home', 'Back pain clinic', locale), p: c('home', 'Slip disc, sciatica and neck pain', locale), cta: lm, href: '/orthopaedics/' },
    { art: 'eye', cat: cat.e, h3: c('home', 'Cataract &amp; eye care', locale), p: c('home', 'Dr. Parul Gupta: phaco', locale), cta: lm, href: '/eye-care/', accent: 'var(--leaf-ink)', tint: 'var(--mint)' },
    { art: 'mind', cat: cat.m, h3: c('home', 'Mind &amp; de-addiction', locale), p: c('home', 'Dr. Amit Gupta: stress', locale), cta: lm, href: '/mental-health/', accent: 'var(--teal-ink)', tint: '#E4F3F1' },
  ];
  const list = only ? cards.filter((k) => only.includes(k.art)) : cards;
  return (
    <Swipe className="tgrid" count={list.length} label={c('home', 'Treatments', locale)}>
      {list.map((k) => (
        <TreatmentCard key={k.h3} {...k} />
      ))}
    </Swipe>
  );
}

/* ============================= Service cards =============================== */

export function SvcCard({
  icon,
  h3,
  p,
  ask,
  c,
  t,
}: {
  icon: IconName;
  h3: string;
  p: string;
  ask?: string;
  c?: string;
  t?: string;
}) {
  return (
    <div className="rv">
      <span className="sic" style={c ? ({ ['--c' as string]: c, ['--t' as string]: t ?? 'var(--sky)' }) : undefined}>
        <Icon name={icon} />
      </span>
      <h3>
        <RichText text={h3} />
      </h3>
      <p>
        <RichText text={p} />
      </p>
      {ask ? <span className="ask">{ask} →</span> : null}
    </div>
  );
}

// The eight orthopaedics service cards — .tgrid.t4 linked cards with the
// preview's animated illustrations. Card 1 routes to the robotic-knee page;
// the rest open WhatsApp with a treatment-specific message.
export function OrthoServices({ locale }: { locale: L }) {
  const ask = c('orthopaedics', 'Ask on WhatsApp', locale);
  const lm = c('orthopaedics', 'Learn more', locale);
  const cat = c('orthopaedics', 'Orthopaedics', locale);
  const cards: Parameters<typeof TreatmentCard>[0][] = [
    { art: 'robotic', cat, h3: c('orthopaedics', 'Robotic knee replacement', locale), p: c('orthopaedics', 'Planned around your own knee', locale), cta: lm, href: '/orthopaedics/robotic-knee-replacement/' },
    { art: 'kneehip', cat, h3: c('orthopaedics', 'Total knee replacement', locale), p: c('orthopaedics', 'The whole worn joint surface', locale), cta: ask, href: whatsappAsk('total knee replacement') },
    { art: 'kneepartial', cat, h3: c('orthopaedics', 'Partial knee replacement', locale), p: c('orthopaedics', 'Only the damaged part is replaced', locale), cta: ask, href: whatsappAsk('partial knee replacement') },
    { art: 'hip', cat, h3: c('orthopaedics', 'Hip replacement', locale), p: c('orthopaedics', 'For hip arthritis and some hip fractures', locale), cta: ask, href: whatsappAsk('hip replacement') },
    { art: 'fracture', cat, h3: c('orthopaedics', 'Fractures &amp; trauma', locale), p: c('orthopaedics', 'Accident injuries, with special care', locale), cta: ask, href: whatsappAsk('fracture or injury'), accent: '#A83828', tint: '#FBEDEA' },
    { art: 'scope', cat, h3: c('orthopaedics', 'Arthroscopy &amp; sports injuries', locale), p: c('orthopaedics', 'Keyhole surgery for ligament', locale), cta: ask, href: whatsappAsk('arthroscopy or sports injury'), accent: 'var(--teal-ink)', tint: '#E4F3F1' },
    { art: 'spine', cat, h3: c('orthopaedics', 'Back pain clinic', locale), p: c('orthopaedics', 'Slip disc, sciatica and neck pain', locale), cta: ask, href: whatsappAsk('back pain') },
    { art: 'physio', cat, h3: c('orthopaedics', 'Physiotherapy &amp; rehab', locale), p: c('orthopaedics', 'Recovery after joint replacement', locale), cta: ask, href: whatsappAsk('physiotherapy'), accent: 'var(--leaf-ink)', tint: 'var(--mint)' },
  ];
  return (
    <Swipe className="tgrid t4" count={cards.length} label={c('orthopaedics', 'Services', locale)}>
      {cards.map((k) => (
        <TreatmentCard key={k.h3} {...k} />
      ))}
    </Swipe>
  );
}

/* ============================= Eye service cards =========================== */

// Eye page .svc grid — six duotone icons unique to the preview's eye services,
// ported literally. Card copy stays English in both locales, as shipped.
function EyeIcon({ k }: { k: number }) {
  const paths = [
    <>
      <path d="M7 24c5-8 11-12 17-12s12 4 17 12c-5 8-11 12-17 12S12 32 7 24z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="6.5" fill="currentColor" opacity=".25" stroke="currentColor" strokeWidth="2.2" />
      <path d="M21 22c2-2 5-2 6 1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    <>
      <circle cx="22" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12c4 4 6 8 4 12s0 8 4 10M14 18c4 2 6 6 8 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 12s4 4.5 4 7a4 4 0 0 1-8 0c0-2.5 4-7 4-7z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    <>
      <path d="M10 32a14 14 0 1 1 28 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 32l8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="32" r="2.4" fill="currentColor" />
      <path d="M14 22l2 2M24 18v3M34 22l-2 2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    <>
      <circle cx="28" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 15c-6 5-6 13 0 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 20l6 2M6 28l6-2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    <>
      <circle cx="24" cy="25" r="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="25" r="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29" cy="25" r="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.5 25h3M20 32c2.5 2 5.5 2 8 0M18 13c2-3 6-3 8-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    <>
      <path d="M24 6v12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 18l-3 4h6z" fill="currentColor" />
      <path d="M9 32c4-6 9-9 15-9s11 3 15 9c-4 6-9 9-15 9s-11-3-15-9z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="32" r="4" fill="currentColor" />
      <path d="M17 10l3 3M31 10l-3 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>,
  ];
  return (
    <svg className="di" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="b" cx="24" cy="24" r="22" />
      {paths[k]}
    </svg>
  );
}

export function EyeServices({ label }: { label: string }) {
  const items: { h3: string; p: string }[] = [
    { h3: 'Cataract surgery', p: 'Phaco surgery through a tiny opening, replacing the cloudy lens with a clear artificial lens.' },
    { h3: 'Diabetic retinopathy', p: 'Regular retina checks for people with diabetes, and treatment when changes are found.' },
    { h3: 'Glaucoma treatment', p: 'Eye pressure checks and long-term care to protect the optic nerve.' },
    { h3: 'Cornea problems', p: 'Infections, injuries and other conditions of the clear front surface of the eye.' },
    { h3: 'Paediatric ophthalmology', p: 'Squint, lazy eye, glasses and other eye problems in children.' },
    { h3: 'LASIK surgery', p: 'Laser vision correction for suitable patients who want to reduce dependence on glasses.' },
  ];
  return (
    <Swipe className="svc" count={items.length} label={label}>
      {items.map((it, i) => (
        <div className="rv" key={it.h3}>
          <span className="sic">
            <EyeIcon k={i} />
          </span>
          <h3>{it.h3}</h3>
          <p>{it.p}</p>
        </div>
      ))}
    </Swipe>
  );
}

/* ================================ Duo cards ================================ */

export function DuoCard({
  img,
  locale,
  tag,
  h3,
  p,
  list,
  contain = false,
}: {
  img?: SlotId;
  locale: L;
  tag: string;
  h3: string;
  p: string;
  list: string[];
  contain?: boolean;
}) {
  return (
    <article className="rv">
      {img ? (
        <ImageSlot id={img} locale={locale} className={contain ? 'rimg contain' : 'rimg'} />
      ) : null}
      <div className="tx">
        <span className="tag">{tag}</span>
        <h3>
          <RichText text={h3} />
        </h3>
        <p>
          <RichText text={p} />
        </p>
        {list.length ? (
          <ul>
            {list.map((li) => (
              <li key={li}>
                <RichText text={li} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

// VELYS + ATTUNE pair (robotic knee page pattern).
export function VelysAttuneDuo({ locale }: { locale: L }) {
  return (
    <Swipe className="duo" count={2} label={c('robotic-knee', 'What is used', locale)}>
      <DuoCard
        img="robotic.velys"
        locale={locale}
        tag="Johnson & Johnson"
        h3="VELYS™ Robotic-Assisted Solution"
        p={c('robotic-knee', 'A camera and a small robotic handpiece', locale)}
        list={[
          c('robotic-knee', 'Maps your knee during surgery', locale),
          c('robotic-knee', 'Shows ligament balance', locale),
          c('robotic-knee', 'Holds the saw to the planned angle', locale),
        ]}
      />
      <DuoCard
        img="robotic.attune"
        locale={locale}
        tag="Johnson & Johnson"
        h3="ATTUNE™ Knee System"
        p={c('robotic-knee', 'The implant used with the robotic system', locale)}
        list={[
          c('robotic-knee', 'Metal parts cover the ends of the bones', locale),
          c('robotic-knee', 'A smooth plastic insert', locale),
          c('robotic-knee', 'Sizes are chosen to fit your knee', locale),
        ]}
        contain
      />
    </Swipe>
  );
}

/* ================================ Fit check ================================ */

export function FitCheck({ locale }: { locale: L }) {
  const yes = [
    c('robotic-knee', 'Knee arthritis limits walking', locale),
    c('robotic-knee', 'Medicines, exercise and injections no longer help', locale),
    c('robotic-knee', 'Your X-ray shows advanced joint damage', locale),
  ];
  const no = [
    c('robotic-knee', 'There is an active infection in the body', locale),
    c('robotic-knee', 'Other health problems make surgery unsafe for now', locale),
    c('robotic-knee', 'The pain comes from the hip or back', locale),
  ];
  return (
    <>
      <div className="fit rv">
        <div>
          <h3>
            <RichText text={c('robotic-knee', 'It may suit you if', locale)} />
          </h3>
          <ul>
            {yes.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </div>
        <div className="n">
          <h3>
            <RichText text={c('robotic-knee', 'It may not suit you if', locale)} />
          </h3>
          <ul>
            {no.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 18, fontSize: '.92rem' }}>
        <RichText text={c('robotic-knee', 'Only an examination by the surgeon can decide', locale)} />
      </p>
    </>
  );
}

/* ============================ Condition groups ============================= */

export function ConditionGroups({ locale }: { locale: L }) {
  const groups: { icon: IconName; h: string; chips: string[] }[] = [
    {
      icon: 'cloud',
      h: c('mental-health', 'Worry &amp; fear', locale),
      chips: ['Generalised anxiety', 'Panic attacks', 'Social anxiety', 'Phobias', 'OCD', 'PTSD'].map((k) => c('mental-health', k, locale)),
    },
    {
      icon: 'mood',
      h: c('mental-health', 'Mood', locale),
      chips: ['Depression', 'Bipolar disorder', 'Cyclothymia', 'Stress after life events'].map((k) => c('mental-health', k, locale)),
    },
    {
      icon: 'drop',
      h: c('mental-health', 'Addiction &amp; habits', locale),
      chips: ['Alcohol', 'Opioids and chitta', 'Other drugs', 'Gambling', 'Impulse control'].map((k) => c('mental-health', k, locale)),
    },
    {
      icon: 'brain',
      h: c('mental-health', 'Thinking &amp; reality', locale),
      chips: ['Schizophrenia', 'Hallucinations', 'Delusions', 'Dissociative disorders'].map((k) => c('mental-health', k, locale)),
    },
    {
      icon: 'moon',
      h: c('mental-health', 'Sleep', locale),
      chips: ['Insomnia', 'Nightmares and night terrors', 'Sleepwalking', 'Restless legs', 'Teeth grinding'].map((k) => c('mental-health', k, locale)),
    },
    {
      icon: 'bulb',
      h: c('mental-health', 'Memory, headache &amp; body', locale),
      chips: ['Memory loss and dementia', 'Migraine', 'Tension headache', 'Epilepsy', 'Eating disorders', 'Sexual health concerns'].map((k) => c('mental-health', k, locale)),
    },
  ];
  return (
    <Swipe className="cg" count={groups.length} label={c('mental-health', 'What we help with', locale)}>
      {groups.map((g) => (
        <div className="rv" key={g.h}>
          <span className="sic" style={{ ['--c' as string]: 'var(--teal)', ['--t' as string]: '#E4F3F1' }}>
            <Icon name={g.icon} />
          </span>
          <h3>
            <RichText text={g.h} />
          </h3>
          <div className="chips">
            {g.chips.map((ch) => (
              <span key={ch}>{ch}</span>
            ))}
          </div>
        </div>
      ))}
    </Swipe>
  );
}

/* ============================== Stress signs =============================== */

export function StressSigns({ locale }: { locale: L }) {
  const groups: { icon: IconName; h: string; items: string[] }[] = [
    { icon: 'body', h: c('mental-health', 'In the body', locale), items: ['Headaches, tight shoulders', 'Poor sleep or tiredness', 'Stomach upsets'].map((k) => c('mental-health', k, locale)) },
    { icon: 'cloud', h: c('mental-health', 'In your thoughts', locale), items: ['Constant worrying', 'Trouble concentrating', 'Forgetting things'].map((k) => c('mental-health', k, locale)) },
    { icon: 'mood', h: c('mental-health', 'In your feelings', locale), items: ['Irritable or short-tempered', 'Feeling low or numb', 'Feeling overwhelmed'].map((k) => c('mental-health', k, locale)) },
    { icon: 'moon', h: c('mental-health', 'In what you do', locale), items: ['Eating more or less', 'More alcohol or smoking', 'Pulling away from people'].map((k) => c('mental-health', k, locale)) },
  ];
  return (
    <Swipe className="signs" count={groups.length} label={c('mental-health', 'Understanding stress', locale)}>
      {groups.map((g) => (
        <div className="rv" key={g.h}>
          <span className="sic">
            <Icon name={g.icon} />
          </span>
          <h3>{g.h}</h3>
          <ul>
            {g.items.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </div>
      ))}
    </Swipe>
  );
}

/* ============================= Values / bring ============================== */

export function ValuesGrid({ locale }: { locale: L }) {
  const items: { icon: IconName; h: string; p: string }[] = [
    { icon: 'home', h: c('about', 'Care close to home', locale), p: c('about', 'Specialist treatment in Bathinda', locale) },
    { icon: 'scale', h: c('about', 'A fair cost', locale), p: c('about', 'Clear estimates before treatment', locale) },
    { icon: 'chat', h: c('about', 'Plain explanations', locale), p: c('about', 'Your doctor explains reports', locale) },
  ];
  return (
    <div className="vals">
      {items.map((it) => (
        <div className="rv" key={it.h}>
          <span className="sic">
            <Icon name={it.icon} />
          </span>
          <h3>{it.h}</h3>
          <p>{it.p}</p>
        </div>
      ))}
    </div>
  );
}

export function BringGrid({ locale }: { locale: L }) {
  const items: { icon: IconName; h: string; p: string }[] = [
    { icon: 'file', h: c('contact', 'Old reports', locale), p: c('contact', 'X-rays, scans and discharge papers.', locale) },
    { icon: 'pill', h: c('contact', 'Your medicines', locale), p: c('contact', 'The strips or a list of what you take now.', locale) },
    { icon: 'card', h: c('contact', 'ID and cards', locale), p: c('contact', 'Aadhaar, and your Ayushman or insurance card', locale) },
    { icon: 'family', h: c('contact', 'Someone with you', locale), p: c('contact', 'Helpful for eye drops, surgery days', locale) },
  ];
  return (
    <Swipe className="bring" count={items.length} label={c('contact', 'Before you come', locale)}>
      {items.map((it) => (
        <div className="rv" key={it.h}>
          <span className="sic">
            <Icon name={it.icon} />
          </span>
          <h3>{it.h}</h3>
          <p>{it.p}</p>
        </div>
      ))}
    </Swipe>
  );
}

/* ============================= Social cards ================================ */

export function SocialCards({ locale }: { locale: L }) {
  const items: { icon: LineIconName; name: string; desc: string; href: string }[] = [
    { icon: 'yt', name: 'YouTube', desc: c('media', 'Health talks and explainers', locale), href: SITE.social.youtube },
    { icon: 'ig', name: 'Instagram', desc: c('media', 'Camp dates, hospital news', locale), href: SITE.social.instagram },
    { icon: 'fb', name: 'Facebook', desc: c('media', 'Announcements and events', locale), href: SITE.social.facebook },
    { icon: 'wa', name: 'WhatsApp', desc: c('media', 'Book a visit or send reports', locale), href: SITE.whatsapp },
  ];
  return (
    <Swipe className="soc" count={items.length} label={c('media', 'Follow along', locale)}>
      {items.map((it) => (
        <a className="rv" href={it.href} target="_blank" rel="noopener" key={it.name}>
          <span className="ico">
            <LIcon name={it.icon} />
          </span>
          <b>{it.name}</b>
          <span>{it.desc}</span>
          <span className="go">{locale === 'pa' ? 'ਖੋਲ੍ਹੋ' : 'Open'} ↗</span>
        </a>
      ))}
    </Swipe>
  );
}
