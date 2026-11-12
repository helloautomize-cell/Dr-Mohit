// Home "Your first visit" — the sticky Listen/Examine/Plan stage ported 1:1
// from the approved preview. Steps render their art inline (.fv-art) for the
// mobile single-column layout; the desktop sticky stage shows cloned arts in
// .fv-arts, toggled by FirstVisitFx on scroll.
import Image from 'next/image';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { SITE } from '@/lib/site-config';
import { FirstVisitFx } from './FirstVisitFx';
import { Swipe } from '../Swipe';

const AV = '/images/photos/dr-mohit-gupta-desk-avatar.jpg';

function ChatArt({ l }: { l: Locale }) {
  const c = (en: string) => copy('home', en, l);
  return (
    <div className="art chat">
      <div className="msg d">
        <Image className="av" src={AV} alt="" width={36} height={36} />
        <p>{c('How long has the knee been troubling you?')}</p>
      </div>
      <div className="msg p">
        <p>{c('About two years. Stairs are the hardest.')}</p>
      </div>
      <div className="msg d">
        <Image className="av" src={AV} alt="" width={36} height={36} />
        <p>{c('And what have you tried so far?')}</p>
      </div>
      <div className="msg p typing" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function KneeArt({ l }: { l: Locale }) {
  const c = (en: string) => copy('home', en, l);
  return (
    <div className="art knee">
      <svg viewBox="0 0 400 330" aria-hidden="true">
        <path
          className="kb"
          d="M168 0 L232 0 L236 112 C262 122 270 152 250 166 C234 174 214 162 200 164 C186 162 166 174 150 166 C130 152 138 122 164 112 Z"
        />
        <path
          className="kb"
          d="M148 206 C170 198 230 198 252 206 L248 224 L236 232 L232 330 L168 330 L164 232 L152 224 Z"
        />
        <path className="kc" d="M150 168 C170 178 186 168 200 170 C214 168 230 178 250 168" />
        <path className="kc" d="M152 203 C180 196 220 196 248 203" />
        <path className="kl" d="M144 150 L150 220" />
        <path className="kl" d="M256 150 L250 220" />
        <g className="lab l1">
          <path d="M232 60 H300" />
          <circle cx="232" cy="60" r="4" />
          <text x="306" y="64">
            {c('Thigh bone')}
          </text>
        </g>
        <g className="lab l2">
          <path d="M200 186 H300" />
          <circle cx="200" cy="186" r="4" />
          <text x="306" y="190">
            {c('Cartilage')}
          </text>
        </g>
        <g className="lab l3">
          <path d="M147 186 H70" />
          <circle cx="147" cy="186" r="4" />
          <text x="64" y="190" textAnchor="end">
            {c('Ligament')}
          </text>
        </g>
        <g className="lab l4">
          <path d="M232 280 H300" />
          <circle cx="232" cy="280" r="4" />
          <text x="306" y="284">
            {c('Shin bone')}
          </text>
        </g>
        <g className="scan">
          <rect x="110" y="0" width="180" height="26" rx="4" />
          <path d="M110 26 H290" />
        </g>
      </svg>
    </div>
  );
}

function PlanArt({ l }: { l: Locale }) {
  const c = (en: string) => copy('home', en, l);
  const ck = (
    <svg className="ck" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" />
      <path d="m7 12.5 3.2 3.2L17 9" />
    </svg>
  );
  return (
    <div className="art plan">
      <div className="pl-h">
        <Image className="av" src={AV} alt="" width={44} height={44} />
        <div>
          <b>{c('Your plan')}</b>
          <small>Dr. Mohit Gupta</small>
        </div>
      </div>
      <ul>
        <li>
          {ck}
          <div>
            <b>{c('The cause')}</b>
            <small>{c('Explained on your X-ray')}</small>
          </div>
        </li>
        <li>
          {ck}
          <div>
            <b>{c('Your options')}</b>
            <small>{c('Exercise, medicines, injections or surgery')}</small>
          </div>
        </li>
        <li>
          {ck}
          <div>
            <b>{c('The timeline')}</b>
            <small>{c('At a pace you agree to')}</small>
          </div>
        </li>
      </ul>
      <div className="pl-f">
        {l === 'pa' ? `ਸਵਾਲ? WhatsApp ${SITE.phoneMain}` : `Questions? WhatsApp ${SITE.phoneMain}`}
      </div>
    </div>
  );
}

const STEP_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M4 5h16v10H9l-5 4z" />
    <path d="M8 9h8M8 12h5" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5 5" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="m8.5 12 2.2 2.2L15.5 9.5" />
  </svg>,
];

export function FirstVisit({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('home', en, locale);
  const steps = [
    {
      tag: c('Listen'),
      h3: c('The doctor listens first.'),
      p: c('How long it has hurt, what makes it worse'),
      Art: <ChatArt l={locale} />,
    },
    {
      tag: c('Examine'),
      h3: c('Then a careful examination.'),
      p: c('The doctor checks how the joint moves, reads your X-ray'),
      Art: <KneeArt l={locale} />,
    },
    {
      tag: c('Plan'),
      h3: c('You plan together.'),
      p: c('The likely cause, your options from exercise to surgery'),
      Art: <PlanArt l={locale} />,
    },
  ];
  return (
    <section className="sec fv-sec" id="fvSec">
      <div className="wrap">
        <div className="g12 rv" style={{ marginBottom: 'clamp(32px,5vw,64px)', alignItems: 'end' }}>
          <div className="c-7">
            <span className="label">{c('Your first visit')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Every treatment starts with <span class="em">listening.</span>')} />
            </h2>
          </div>
          <p className="lede s-8">{c('Scroll to see how a first consultation unfolds')}</p>
        </div>
        <div className="fv">
          <Swipe className="fv-steps" count={steps.length} label={c('Your first visit')}>
            {steps.map((s, i) => (
              <article className="fv-step" data-i={i} key={s.tag}>
                <div className="fv-tag">
                  {STEP_ICONS[i]}
                  <span>{s.tag}</span>
                </div>
                <h3>{s.h3}</h3>
                <p>{s.p}</p>
                <div className="fv-art">{s.Art}</div>
              </article>
            ))}
          </Swipe>
          <div className="fv-stage" aria-hidden="true">
            <div className="fv-tabs">
              {steps.map((s) => (
                <span key={s.tag}>{s.tag}</span>
              ))}
              <i />
            </div>
            <div className="fv-arts">
              <ChatArt l={locale} />
              <KneeArt l={locale} />
              <PlanArt l={locale} />
            </div>
          </div>
        </div>
      </div>
      <FirstVisitFx />
    </section>
  );
}
