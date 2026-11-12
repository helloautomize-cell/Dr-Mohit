// Band-level sections ported 1:1 from the approved preview: facts band, trail
// timeline, journey path, facilities band, callout, visit band, mobile action
// bar, and the FAQ accordion.
import Link from 'next/link';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { Icon, LIcon, type IconName, type LineIconName } from '../icons';
import { ImageSlot } from '../ImageSlot';
import { BtnWLine } from '../Buttons';

import { Swipe } from '../Swipe';
import { SITE } from '@/lib/site-config';
import { ConfirmChip } from '../Confirm';

type L = Locale;
const c = (page: string, en: string, l: L) => copy(page, en, l);

/* =============================== Facts band ================================ */

export function FactsBand({ locale }: { locale: L }) {
  const items: { n: React.ReactNode; s: string }[] = [
    { n: SITE.founded, s: c('home', 'Founded by Dr. Amrit Gupta', locale) },
    { n: 3, s: c('home', 'Departments under one roof', locale) },
    { n: 'PM-JAY', s: c('home', 'Ayushman Bharat empanelled since 2019', locale) },
    { n: 2025, s: c('home', 'Tribune Health Care Award, joint replacement', locale) },
  ];
  return (
    <section className="facts-band">
      <div className="wrap">
        <div className="facts rv">
          {items.map((it, i) => (
            <div key={i}>
              <b>{it.n}</b>
              <span>{it.s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Orthopaedics facts band — same .facts-band pattern, department numbers.
export function OrthoFacts({ locale }: { locale: L }) {
  const items: { n: React.ReactNode; s: string }[] = [
    { n: '1980', s: c('orthopaedics', 'Bone and joint care in Bathinda since', locale) },
    { n: 'VELYS™', s: c('orthopaedics', 'Robotic-assisted knee replacement', locale) },
    { n: c('orthopaedics', '2 countries', locale), s: c('orthopaedics', 'Fellowship training, Germany and Switzerland', locale) },
    { n: 'PM-JAY', s: c('orthopaedics', 'Ayushman Bharat empanelled', locale) },
  ];
  return (
    <section className="facts-band">
      <div className="wrap">
        <div className="facts rv">
          {items.map((it, i) => (
            <div key={i}>
              <b>{it.n}</b>
              <span>{it.s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================== Accordion ================================= */

export function Accordion({ items, openFirst = true }: { items: { q: string; a: string }[]; openFirst?: boolean }) {
  return (
    <div className="acc">
      {items.map((it, i) => (
        <details key={it.q} open={openFirst && i === 0}>
          <summary>
            <span>
              <RichText text={it.q} />
            </span>
            <i />
          </summary>
          <div className="body">
            <RichText text={it.a} />
          </div>
        </details>
      ))}
    </div>
  );
}

// The six "Questions families often ask" items from home.
export function HomeFaq({ locale }: { locale: L }) {
  const qa: [string, string][] = [
    ['Do I need an appointment?', 'Booking ahead by phone or WhatsApp'],
    ['Which doctor should I see?', 'Bones, joints, back and injuries: Dr. Mohit'],
    ['Is treatment covered under Ayushman Bharat?', 'Gupta Hospital is empanelled under PM-JAY'],
    ['Can I talk to the doctor in Punjabi?', 'Yes. All three doctors speak Punjabi'],
    ['What should I bring to my first visit?', 'All old reports, X-rays and scans'],
    ['Does the hospital hold free camps?', 'Yes. The hospital regularly holds free'],
  ];
  return (
    <Accordion
      items={qa.map(([q, a]) => ({ q: c('home', q, locale), a: c('home', a, locale) }))}
    />
  );
}

/* ============================= Trail timeline ============================== */

export function TrailTimeline({
  items,
  className = 'tl',
  label,
}: {
  items: { year: string; h3: string; p: string }[];
  className?: string;
  label: string;
}) {
  return (
    <Swipe className={`${className} trail`} count={items.length} label={label} dataTrail>
      <span className="fill" />
      {items.map((it) => (
        <div className="rv" key={it.year + it.h3}>
          <b>{it.year}</b>
          <div>
            <h3>
              <RichText text={it.h3} />
            </h3>
            <p>
              <RichText text={it.p} />
            </p>
          </div>
        </div>
      ))}
    </Swipe>
  );
}

// About timeline 1980 -> Today (home "Our story" pattern).
export function StoryTrail({ locale }: { locale: L }) {
  const items = [
    { year: '1980', h3: c('home', 'A clinic opens', locale), p: c('home', 'Dr. Amrit Gupta starts an orthopaedic practice', locale) },
    { year: '2000', h3: c('home', 'Care for the mind', locale), p: c('home', 'Dr. Amit Gupta joins as psychiatrist', locale) },
    { year: '2019', h3: c('home', 'Ayushman Bharat', locale), p: c('home', 'The hospital is empanelled under PM-JAY', locale) },
    { year: '2024', h3: c('home', 'Robotic-assisted knees', locale), p: c('home', 'The J&amp;J VELYS™ robotic-assisted knee system', locale) },
    { year: '2025', h3: c('home', 'Recognised by The Tribune', locale), p: c('home', 'Tribune Health Care Award for excellence', locale) },
    { year: c('home', 'Today', locale), h3: c('home', 'Three departments, one family', locale), p: c('home', 'Dr. Mohit Gupta leads orthopaedics', locale) },
  ];
  return <TrailTimeline items={items} label={c('home', 'Our story', locale)} />;
}

// Robotic knee five-step trail (steps.trail with icons). A step's `p` may
// carry a [CONFIRM: …] marker (ortho sub-pages): it is stripped for display
// and a dev-only chip is appended — same contract as ContentStream chips.
export function StepsTrail({
  items,
  label,
}: {
  items: { icon: IconName; h3: string; p: string; confirmId?: string }[];
  label: string;
}) {
  return (
    <Swipe className="steps trail" count={items.length} label={label} dataTrail>
      <span className="fill" />
      {items.map((it) => {
        const confirm = /\[CONFIRM[^\]]*\]/.test(it.p);
        return (
          <div className="step rv" key={it.h3}>
            <span className="sic">
              <Icon name={it.icon} />
            </span>
            <h3>
              <RichText text={it.h3} />
            </h3>
            <p>
              <RichText text={it.p.replace(/\[CONFIRM[^\]]*\]/, '')} />
              {confirm ? <> <ConfirmChip id={it.confirmId} /></> : null}
            </p>
          </div>
        );
      })}
    </Swipe>
  );
}

export function RoboticSteps({ locale }: { locale: L }) {
  const items: { icon: IconName; h3: string; p: string }[] = [
    { icon: 'assess', h3: c('robotic-knee', 'Assessment', locale), p: c('robotic-knee', 'Dr. Mohit examines your knee', locale) },
    { icon: 'xray', h3: c('robotic-knee', 'Mapping your knee', locale), p: c('robotic-knee', 'During surgery the system records', locale) },
    { icon: 'balance', h3: c('robotic-knee', 'Balancing the ligaments', locale), p: c('robotic-knee', 'A camera tracks the knee', locale) },
    { icon: 'ot', h3: c('robotic-knee', 'Preparing to plan', locale), p: c('robotic-knee', 'A robotic handpiece holds the saw', locale) },
    { icon: 'walk', h3: c('robotic-knee', 'Recovery', locale), p: c('robotic-knee', 'Physiotherapy starts in hospital', locale) },
  ];
  return <StepsTrail items={items} label={c('robotic-knee', 'The process', locale)} />;
}

// Eye surgery day trail with elapsed-time chips (.tday): each step shows the
// time chip, then a duotone icon beside the step title.
export function TdayTrail({
  items,
  label,
}: {
  items: { t: string; s: string; icon: IconName; h3: string; p: string }[];
  label: string;
}) {
  return (
    <Swipe className="steps trail tday" count={items.length} label={label} dataTrail>
      <span className="fill" />
      {items.map((it) => (
        <div className="step rv" key={it.h3}>
          <span className="t">
            {it.t}
            <small>{it.s}</small>
          </span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className="sic">
              <Icon name={it.icon} />
            </span>
            <h3>
              <RichText text={it.h3} />
            </h3>
          </div>
          <p>
            <RichText text={it.p} />
          </p>
        </div>
      ))}
    </Swipe>
  );
}

export function CataractDay({ locale }: { locale: L }) {
  const times = [
    { t: '0:00', s: c('eye-care', 'Arrive', locale), icon: 'drop' as IconName, h3: c('eye-care', 'Check-in and drops', locale), p: c('eye-care', 'Your eye is checked again', locale) },
    { t: '0:30', s: c('eye-care', 'Numbing', locale), icon: 'cataract' as IconName, h3: c('eye-care', 'The eye is numbed', locale), p: c('eye-care', 'Usually with drops', locale) },
    { t: '0:45', s: c('eye-care', 'Surgery', locale), icon: 'lens' as IconName, h3: c('eye-care', 'Phaco surgery', locale), p: c('eye-care', 'Through a tiny opening', locale) },
    { t: '1:15', s: c('eye-care', 'Rest', locale), icon: 'calm' as IconName, h3: c('eye-care', 'A short rest', locale), p: c('eye-care', 'You rest with an eye shield', locale) },
    { t: '~2:00', s: c('eye-care', 'Home', locale), icon: 'home' as IconName, h3: c('eye-care', 'Home the same day', locale), p: c('eye-care', 'Most people go home in about two hours', locale) },
  ];
  return <TdayTrail items={times} label={c('eye-care', 'Cataract surgery day', locale)} />;
}

/* ============================== Journey path =============================== */

const J_PATH =
  'M0 100 C60 100 90 40 150 40 C270 40 330 120 450 120 C570 120 630 40 750 40 C870 40 930 120 1050 120 C1110 120 1140 80 1200 80';

function JIcon({ k }: { k: number }) {
  const paths = [
    <path key="p" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    <g key="g">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5" />
    </g>,
    <g key="g2">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3v2h6V3M8.5 11h7M8.5 15h4.5" />
    </g>,
    <path key="h" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  ];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {paths[k]}
    </svg>
  );
}

const J_NODES = [
  { left: '12.5%', top: '25%' },
  { left: '37.5%', top: '75%' },
  { left: '62.5%', top: '25%' },
  { left: '87.5%', top: '75%' },
];

// Ortho recovery node icons (dumbbell / hospital bed / house / back to moving).
function OIcon({ k }: { k: number }) {
  const paths = [
    <path key="a" d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" />,
    <g key="b">
      <path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11" r="2" />
    </g>,
    <g key="c">
      <path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </g>,
    <g key="d">
      <circle cx="13" cy="4.5" r="2" />
      <path d="M11 21l2-6-3-3 1-4 3 3 3 1M9 12l-3 2M13 15l3 6" />
    </g>,
  ];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      {paths[k]}
    </svg>
  );
}

function JFlow({
  steps,
  NodeIcon,
}: {
  steps: { h3: string; p: string }[];
  NodeIcon: (p: { k: number }) => React.ReactNode;
}) {
  return (
    <div className="jflow" data-jflow>
      <div className="jsvg">
        <svg viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
          <path className="jb" d={J_PATH} vectorEffect="non-scaling-stroke" />
          <path className="jp" pathLength={1} d={J_PATH} vectorEffect="non-scaling-stroke" />
          <path className="jw" d={J_PATH} vectorEffect="non-scaling-stroke" />
        </svg>
        {J_NODES.map((n, i) => (
          <span className="jn" style={n} key={i}>
            <NodeIcon k={i} />
          </span>
        ))}
      </div>
      <div className="jcols">
        {steps.map((s, i) => (
          <div key={s.h3}>
            <span className="jic">
              <NodeIcon k={i} />
            </span>
            <h3>{s.h3}</h3>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JourneyPath({ locale }: { locale: L }) {
  const steps = [
    { h3: c('home', 'You reach out', locale), p: c('home', 'Call, WhatsApp or walk in', locale) },
    { h3: c('home', 'You meet your specialist', locale), p: c('home', 'A doctor from the Gupta family listens', locale) },
    { h3: c('home', 'Tests and a clear plan', locale), p: c('home', 'Tests if needed, then your options', locale) },
    { h3: c('home', 'Treatment and follow-up', locale), p: c('home', 'Surgery, medicines or therapy', locale) },
  ];
  return <JFlow steps={steps} NodeIcon={JIcon} />;
}

// Orthopaedics "road back to walking" — same drawn path, recovery steps.
export function OrthoJourney({ locale }: { locale: L }) {
  const steps = [
    { h3: c('orthopaedics', 'Getting ready', locale), p: c('orthopaedics', 'Strengthening exercises before surgery', locale) },
    { h3: c('orthopaedics', 'In hospital', locale), p: c('orthopaedics', 'Physiotherapy begins in hospital', locale) },
    { h3: c('orthopaedics', 'At home', locale), p: c('orthopaedics', 'Exercises at home and regular follow-up', locale) },
    { h3: c('orthopaedics', 'Back to routine', locale), p: c('orthopaedics', 'A return to daily activities', locale) },
  ];
  return <JFlow steps={steps} NodeIcon={OIcon} />;
}

/* ============================ Facilities band ============================== */

export function FacilitiesBand({ locale }: { locale: L }) {
  const fac: { icon: IconName; h: string; key: string; p: string }[] = [
    { icon: 'ot', h: c('home', 'Modular operation theatres', locale), key: 'Modular operation theatres', p: c('home', 'Separate theatres for bone and eye surgery', locale) },
    { icon: 'icu', h: c('home', 'Critical care', locale), key: 'Critical care', p: c('home', 'Close monitoring after major surgery', locale) },
    { icon: 'blood', h: c('home', 'Blood bank', locale), key: 'Blood bank', p: c('home', 'Blood is arranged on site', locale) },
    { icon: 'xray', h: c('home', 'Digital X-ray', locale), key: 'Digital X-ray', p: c('home', 'Images are taken and read during the same visit', locale) },
    { icon: 'lab', h: c('home', 'Laboratory', locale), key: 'Laboratory', p: c('home', 'Routine blood tests before surgery', locale) },
    { icon: 'pill', h: c('home', 'Pharmacy', locale), key: 'Pharmacy', p: c('home', 'Prescribed medicines are available inside', locale) },
    { icon: 'physio', h: c('home', 'Physiotherapy', locale), key: 'Physiotherapy', p: c('home', 'Rehab starts in hospital', locale) },
    { icon: 'bed', h: c('home', 'Private rooms', locale), key: 'Private rooms', p: c('home', 'Quiet rooms to recover in after surgery', locale) },
  ];
  return (
    <section className="sec fac-band">
      <div className="wrap">
        <div className="fac-top">
          <div className="rv">
            <span className="label">{c('home', 'Under one roof', locale)}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('home', 'Everything your treatment needs, <span class="em">in one building.</span>', locale)} />
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              <RichText text={c('home', 'Tests, surgery, blood, medicines and rehab happen here', locale)} />
            </p>
          </div>
          <div className="trio rv">
            <ImageSlot id="home.fac-1" locale={locale} caption={c('home', 'Reception', locale)} />
            <ImageSlot id="home.fac-2" locale={locale} caption={c('home', 'OPD corridor', locale)} />
            <ImageSlot id="home.fac-3" locale={locale} caption={c('home', 'Day care', locale)} />
          </div>
        </div>
        <Swipe className="fac" count={fac.length} label={c('home', 'Under one roof', locale)}>
          {fac.map((f) => (
            <div className="rv" key={f.key}>
              <span className="sic">
                <Icon name={f.icon} />
              </span>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </Swipe>
      </div>
    </section>
  );
}

/* ================================ Callout ================================== */

export function Callout({ page = 'orthopaedics', locale }: { page?: string; locale: L }) {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="callout rv">
          <h3>
            <RichText text={c(page, 'Want to see a doctor? Book a time on WhatsApp.', locale)} />
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-brand" href="/contact/">
              <span>{c(page, 'Book an appointment', locale)}</span>
              <span className="ar">→</span>
            </Link>
            <a className="btn btn-line" href={SITE.phoneMainHref}>
              {SITE.phoneMain}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================== Visit band ================================ */

export function VisitBand({ locale }: { locale: L }) {
  const rows = [
    { dt: c('home', 'Address', locale), dd: `${SITE.name}, ${SITE.address}` },
    { dt: c('home', 'Appointments', locale), dd: <a href={SITE.phoneMainHref}>{SITE.phoneMain}</a> },
    { dt: c('home', 'Eye department', locale), dd: <a href={SITE.phoneEyeHref}>{SITE.phoneEye}</a> },
    { dt: 'WhatsApp', dd: <a href={SITE.whatsapp} target="_blank" rel="noopener">{SITE.phoneMain}</a> },
  ];
  return (
    <section className="band sec">
      <div className="wrap g12">
        <div className="c-5 rv">
          <span className="label">{c('home', 'Visit', locale)}</span>
          <h2 style={{ marginTop: 18 }}>
            <RichText text={c('home', 'Power House Road, Bathinda.', locale)} />
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            {c('home', 'Call or WhatsApp to book. In an emergency', locale)}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
            <Link className="btn btn-brand" href="/contact/">
              <span>{c('home', 'Book an appointment', locale)}</span>
              <span className="ar">→</span>
            </Link>
            <BtnWLine href={SITE.mapsUrl} target="_blank" rel="noopener">
              {c('home', 'Directions', locale)} ↗
            </BtnWLine>
          </div>
        </div>
        <dl className="rv" style={{ margin: 0, gridColumn: '7/-1' }}>
          {rows.map((r) => (
            <div className="kv" key={r.dt}>
              <dt>{r.dt}</dt>
              <dd>{r.dd}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ============================= Mobile bar ================================== */

export function MobileBar({ locale }: { locale: L }) {
  return (
    <div className="mbar show" id="mbar">
      <a href={SITE.phoneMainHref}>{locale === 'pa' ? 'ਕਾਲ' : 'Call'}</a>
      <a href={SITE.whatsapp} target="_blank" rel="noopener">
        WhatsApp
      </a>
      <a className="b" href="#book">
        {locale === 'pa' ? 'ਬੁੱਕ ਕਰੋ' : 'Book'}
      </a>
    </div>
  );
}

/* ========================== Contact card (soc) ============================= */

export function ContactRow({ locale }: { locale: L }) {
  const items: { icon: LineIconName; b: string; s: string; go: string; href: string }[] = [
    { icon: 'phone', b: SITE.phoneMain, s: c('contact', 'Hospital number', locale), go: c('contact', 'Call', locale), href: SITE.phoneMainHref },
    { icon: 'phone', b: SITE.phoneAlt1, s: c('contact', 'Alternate number', locale), go: c('contact', 'Call', locale), href: SITE.phoneAlt1Href },
    { icon: 'mail', b: SITE.email, s: c('contact', 'Write', locale), go: 'Email ↗', href: `mailto:${SITE.email}` },
    { icon: 'wa', b: SITE.phoneMain, s: c('contact', 'Send reports before your visit', locale), go: c('contact', 'Open', locale), href: SITE.whatsapp },
  ];
  return (
    <div className="soc">
      {items.map((it) => (
        <a className="rv" href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noopener" key={it.b + it.s}>
          <span className="ico">
            <LIcon name={it.icon} />
          </span>
          <b>{it.b}</b>
          <span>{it.s}</span>
          <span className="go">{it.go} ↗</span>
        </a>
      ))}
    </div>
  );
}
