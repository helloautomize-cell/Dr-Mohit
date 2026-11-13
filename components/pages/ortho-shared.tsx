// Shared building blocks of the four orthopaedics sub-pages (v14 preview kit):
// TreatmentLinks (.olinks / .olinks.big), the shared page tail (.rev +
// "Other orthopaedic services" row), UrgentBox, TickList, FitBoxes, CgGrid,
// SignsGrid, BringGrid, the FAQ section and the arthroscopy scopebox diagram.
// All strings resolve through copy() against ortho-subpages.en-pa.json.
import Link from 'next/link';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { Icon, type IconName } from '../icons';
import { Accordion } from '../sections/bands';
import { Swipe } from '../Swipe';
import { ConfirmChip } from '../Confirm';
import { faqLd, ldGraph } from '@/lib/seo';
import { SITE } from '@/lib/site-config';

type L = Locale;
const c = (page: string, en: string, l: L) => copy(page, en, l);

const CONFIRM_MARK = /\[CONFIRM[^\]]*\]/;

/** Copy text that may carry a [CONFIRM: …] marker — strips it and appends the dev chip. */
function Marked({ text, id }: { text: string; id?: string }) {
  const has = CONFIRM_MARK.test(text);
  return (
    <>
      <RichText text={text.replace(CONFIRM_MARK, '')} />
      {has ? <> <ConfirmChip id={id} /></> : null}
    </>
  );
}

/* --------------------------- Ortho service links -------------------------- */

export type OrthoLinkId = 'robotic' | 'kneeHip' | 'fractures' | 'sports' | 'backPain';

export const ORTHO_LINKS: Record<OrthoLinkId, { href: string; icon: IconName; title: string; sub: string; tail: string }> = {
  robotic: { href: '/orthopaedics/robotic-knee-replacement/', icon: 'assess', title: 'Robotic knee replacement', sub: 'VELYS™ robotic-assisted surgery', tail: 'Robotic knee' },
  kneeHip: { href: '/orthopaedics/knee-and-hip-replacement/', icon: 'balance', title: 'Knee and hip replacement', sub: 'Total, partial and hip', tail: 'Knee and hip replacement' },
  fractures: { href: '/orthopaedics/fractures-and-trauma/', icon: 'xray', title: 'Fractures and trauma', sub: 'Plaster, surgery and rehab', tail: 'Fractures and trauma' },
  sports: { href: '/orthopaedics/arthroscopy-and-sports-injuries/', icon: 'walk', title: 'Arthroscopy and sports injuries', sub: 'ACL, meniscus, shoulder', tail: 'Arthroscopy and sports injuries' },
  backPain: { href: '/orthopaedics/back-pain-clinic/', icon: 'body', title: 'Back pain clinic', sub: 'Non-surgical care first', tail: 'Back pain clinic' },
};

const EXPLORE_ORDER: OrthoLinkId[] = ['robotic', 'kneeHip', 'fractures', 'sports', 'backPain'];
const TAIL_ORDER: OrthoLinkId[] = ['kneeHip', 'robotic', 'fractures', 'sports', 'backPain'];

/** "Explore by treatment" 5-card row on /orthopaedics/ (.olinks.big). */
export function ExploreLinks({ locale }: { locale: L }) {
  return (
    <Swipe className="olinks big" count={EXPLORE_ORDER.length} label={c('ortho-explore', 'Treatments', locale)}>
      {EXPLORE_ORDER.map((id) => {
        const l = ORTHO_LINKS[id];
        return (
          <Link key={id} className="olink rv" href={l.href}>
            <span className="sic">
              <Icon name={l.icon} />
            </span>
            <div>
              <b>{c('ortho-explore', l.title, locale)}</b>
              <small>{c('ortho-explore', l.sub, locale)}</small>
            </div>
            <span className="ar">→</span>
          </Link>
        );
      })}
    </Swipe>
  );
}

/* ------------------------------- Page tail -------------------------------- */

// .rev reviewer + disclaimer block — the v14 pattern. The reviewer line comes
// from the page copy; the last-reviewed date is confirmed (November 2026).
export function RevBlock({ page, locale }: { page: string; locale: L }) {
  return (
    <div className="rev rv">
      <span>{c(page, 'Medically reviewed by Dr. Mohit Gupta', locale)}</span>
      <small>{c(page, 'This page explains common treatments.', locale)}</small>
    </div>
  );
}

/** Shared sub-page tail: .rev + "Other orthopaedic services" 4-card row. */
export function OrthoSubTail({ page, locale, exclude }: { page: string; locale: L; exclude: OrthoLinkId }) {
  const order = TAIL_ORDER.filter((id) => id !== exclude);
  return (
    <section className="sec" style={{ paddingBlock: 'clamp(40px,5vw,64px)' }}>
      <div className="wrap">
        <RevBlock page={page} locale={locale} />
        <h3 style={{ margin: '40px 0 0', fontSize: '1.1rem' }}>{c(page, 'Other orthopaedic services', locale)}</h3>
        <Swipe
          className="olinks"
          count={order.length}
          label={c(page, 'Other orthopaedic services', locale)}
          trackProps={{ style: { marginTop: 28 } }}
        >
          {order.map((id) => {
            const l = ORTHO_LINKS[id];
            return (
              <Link key={id} className="olink rv" href={l.href}>
                <span className="sic">
                  <Icon name={l.icon} />
                </span>
                <b>{c(page, l.tail, locale)}</b>
                <span className="ar">→</span>
              </Link>
            );
          })}
        </Swipe>
      </div>
    </section>
  );
}

/* -------------------------------- Sections -------------------------------- */

/** .urgent emergency strip (fractures page top). */
export function UrgentBox({ page, locale }: { page: string; locale: L }) {
  return (
    <div className="urgent rv">
      <div>
        <span className="label">{c(page, 'Injured right now?', locale)}</span>
        <h2 style={{ marginTop: 14 }}>
          <RichText text={c(page, 'Call 108 or 112 for an ambulance', locale)} />
        </h2>
        <p className="muted" style={{ marginTop: 12 }}>
          {c(page, 'Power House Road, Bathinda. If you can', locale)}
        </p>
      </div>
      <div className="ub">
        <a className="btn btn-em" href="tel:112">
          <span>{c(page, 'Call 112', locale)}</span>
        </a>
        <a className="btn btn-line" style={{ background: '#fff' }} href={SITE.phoneMainHref}>
          {SITE.phoneMain}
        </a>
      </div>
    </div>
  );
}

/** .ticks check list used in the split sections. */
export function TickList({ items }: { items: string[] }) {
  return (
    <ul className="ticks" style={{ marginTop: 24 }}>
      {items.map((t) => (
        <li key={t}>
          <Marked text={t} />
        </li>
      ))}
    </ul>
  );
}

/** .fit two-box yes/no panel (candidacy, first aid, rest-or-check). */
export function FitBoxes({
  yesTitle,
  yes,
  noTitle,
  no,
  note,
}: {
  yesTitle: string;
  yes: string[];
  noTitle: string;
  no: string[];
  note?: string;
}) {
  return (
    <>
      <div className="fit rv">
        <div>
          <h3>
            <i>✓</i>
            <span>{yesTitle}</span>
          </h3>
          <ul>
            {yes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="n">
          <h3>
            <i>!</i>
            <span>{noTitle}</span>
          </h3>
          <ul>
            {no.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      {note ? (
        <p className="muted" style={{ marginTop: 18, fontSize: '.92rem' }}>
          {note}
        </p>
      ) : null}
    </>
  );
}

/** .cg icon + chips card grid (injury groups, back-pain causes). */
export function CgGrid({ items, label }: { items: { icon: IconName; h3: string; chips: string[] }[]; label: string }) {
  return (
    <Swipe className="cg" count={items.length} label={label}>
      {items.map((it) => (
        <div className="rv" key={it.h3}>
          <span className="sic">
            <Icon name={it.icon} />
          </span>
          <h3>{it.h3}</h3>
          <div className="chips">
            {it.chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
      ))}
    </Swipe>
  );
}

/** .signs navy warning grid (back-pain red flags) + emergency button row. */
export function SignsGrid({ items, page, locale, label }: { items: { icon: IconName; h3: string; lis: string[] }[]; page: string; locale: L; label: string }) {
  return (
    <>
      <Swipe className="signs" count={items.length} label={label}>
        {items.map((it) => (
          <div className="rv" key={it.h3}>
            <span className="sic">
              <Icon name={it.icon} />
            </span>
            <h3>{it.h3}</h3>
            <ul>
              {it.lis.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          </div>
        ))}
      </Swipe>
      <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a className="btn btn-em" href="tel:112">
          <span>{c(page, 'Call 112', locale)}</span>
        </a>
        <a className="btn btn-wline" href={SITE.phoneMainHref}>
          {SITE.phoneMain}
        </a>
      </div>
    </>
  );
}

/** .bring four-card habits grid (back-pain "Everyday habits"). */
export function BringGrid({ items, label }: { items: { icon: IconName; h3: string; p: string }[]; label: string }) {
  return (
    <Swipe className="bring" count={items.length} label={label}>
      {items.map((it) => (
        <div className="rv" key={it.h3}>
          <span className="sic">
            <Icon name={it.icon} />
          </span>
          <h3>{it.h3}</h3>
          <p>{it.p}</p>
        </div>
      ))}
    </Swipe>
  );
}

/** The shared .sec.faq-sec: left label/h2 + "Ask us something else" link.
    Emits FAQPage JSON-LD from the same items the accordion renders. */
export function FaqSec({
  page,
  locale,
  items,
  mint = true,
}: {
  page: string;
  locale: L;
  items: { q: string; a: string }[];
  mint?: boolean;
}) {
  return (
    <section className="sec faq-sec" style={mint ? { background: 'var(--mint)' } : { background: 'var(--sky)' }}>
      <div className="wrap g12">
        <div className="c-4 rv">
          <span className="label">{c(page, 'Questions', locale)}</span>
          <h2 style={{ marginTop: 18 }}>
            <RichText text={c(page, 'Questions people often ask.', locale)} />
          </h2>
          <div style={{ marginTop: 28 }}>
            <Link className="lnk" href="/contact/">
              <span>{c(page, 'Ask us something else', locale)}</span>
              <span className="ar">→</span>
            </Link>
          </div>
        </div>
        <div className="s-6 rv">
          <Accordion items={items} />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldGraph(faqLd(items))) }}
      />
    </section>
  );
}

/** Section heading row (label + h2 [+ lede on the right]). */
export function SecHead({
  page,
  locale,
  label,
  h2,
  lede,
  margin = 0,
}: {
  page: string;
  locale: L;
  label: string;
  h2: string;
  lede?: string;
  margin?: number;
}) {
  return (
    <div className="g12 rv" style={{ marginBottom: margin, alignItems: 'end' }}>
      <div className="c-7">
        <span className="label">{c(page, label, locale)}</span>
        <h2 style={{ marginTop: 18 }}>
          <RichText text={c(page, h2, locale)} />
        </h2>
      </div>
      {lede ? <p className="lede s-8">{c(page, lede, locale)}</p> : null}
    </div>
  );
}

/* ------------------------- Arthroscopy diagram ---------------------------- */

// The sports page's inline "two small cuts" illustration (.scopebox .scope):
// camera + instrument entering a knee. The gentle probe/beam animation is CSS
// (.sc-cam/.sc-beam) and already stops under prefers-reduced-motion.
export function ArthroscopyDiagram({ locale }: { locale: L }) {
  const l = locale === 'pa';
  return (
    <div className="scopebox">
      <svg
        className="scope"
        viewBox="0 0 420 300"
        role="img"
        aria-label={
          l
            ? 'ਚਿਤਰ: ਇੱਕ ਕੈਮਰਾ ਅਤੇ ਇੱਕ ਛੋਟਾ ਯੰਤਰ ਦੋ ਛੋਟੇ ਚੀਰਿਆਂ ਰਾਹੀਂ ਗੋਡੇ ਵਿੱਚ ਜਾਂਦੇ ਹਨ'
            : 'Illustration: a camera and a small instrument enter the knee through two small cuts'
        }
      >
        <defs>
          <clipPath id="kc">
            <ellipse cx="210" cy="160" rx="120" ry="110" />
          </clipPath>
        </defs>
        <ellipse cx="210" cy="160" rx="120" ry="110" fill="#EEF3FB" stroke="#1D4E9E" strokeWidth="2" />
        <g clipPath="url(#kc)">
          <path d="M120 40 C150 120 270 120 300 40 L300 0 L120 0Z" fill="#DCE7F7" stroke="#1D4E9E" strokeWidth="2" />
          <path d="M130 290 C150 200 270 200 290 290Z" fill="#DCE7F7" stroke="#1D4E9E" strokeWidth="2" />
          <path d="M150 196 C185 182 235 182 270 196" fill="none" stroke="#1E9A4B" strokeWidth="7" strokeLinecap="round" />
          <path d="M232 186 l10 10" stroke="#C62828" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="sc-cam">
          <line x1="10" y1="250" x2="170" y2="168" stroke="#0F2A55" strokeWidth="9" strokeLinecap="round" />
          <circle cx="172" cy="167" r="6" fill="#0A8A80" />
          <path className="sc-beam" d="M176 165 L250 150 L250 205Z" fill="#0A8A80" opacity=".18" />
        </g>
        <line x1="410" y1="250" x2="252" y2="196" stroke="#6A7380" strokeWidth="6" strokeLinecap="round" />
        <text x="12" y="285" fontSize="13" fill="#3D4652" fontFamily="inherit">
          {l ? 'ਕੈਮਰਾ' : 'camera'}
        </text>
        <text x="336" y="285" fontSize="13" fill="#3D4652" fontFamily="inherit">
          {l ? 'ਯੰਤਰ' : 'instrument'}
        </text>
        <text x="150" y="232" fontSize="12" fill="#1E9A4B" fontFamily="inherit">
          {l ? 'ਮੇਨਿਸਕਸ' : 'meniscus'}
        </text>
      </svg>
    </div>
  );
}

export { Marked };
