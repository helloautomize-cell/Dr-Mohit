// Orthopaedics page — full composition matching the approved preview section
// for section: ph hero, facts band, treatment cards, knee explorer + worn/
// healthy slider, symptom checker, recovery journey, body-area accordion,
// arthroscopy tabs, myths & facts, CTA. All copy via copy() so EN/PA stay in
// sync with the content JSON.
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero, DeptBookCta, DeptPhoneCta } from './DeptHero';
import { ImageSlot } from '../ImageSlot';
import { OrthoFacts, Accordion, OrthoJourney, Callout } from '../sections/bands';
import { ExploreLinks } from './ortho-shared';
import { OrthoServices } from '../sections/cards';
import { KneeExplorer } from '../tools/KneeExplorer';
import { CmpSlider } from '../tools/CmpSlider';
import { SymptomCheck } from '../tools/SymptomCheck';
import { JTabs, JPhysio } from '../tools/JTabs';
import { ReviewerBox } from '../Confirm';

const BODY_AREAS: { q: string; a: string }[] = [
  { q: 'Knee', a: 'Knee arthritis, ligament (ACL) tears, meniscus injuries, knee pain in older adults, knee replacement and revision.' },
  { q: 'Hip', a: 'Hip arthritis, hip fractures after falls, avascular necrosis, hip replacement.' },
  { q: 'Back &amp; spine', a: 'Low back pain, sciatica, slip disc, neck pain, osteoporosis, spine fractures.' },
  { q: 'Shoulder', a: 'Frozen shoulder, rotator cuff tears, dislocation, collarbone fractures.' },
  { q: 'Elbow, wrist &amp; hand', a: 'Wrist and elbow fractures, tennis elbow, carpal tunnel, trigger finger.' },
  { q: 'Ankle &amp; foot', a: 'Ankle sprains and fractures, heel pain, flat feet, diabetic foot care.' },
];

const MYTHS: [string, string][] = [
  ['“X-rays alone decide if I need surgery.”', '<b>Fact:</b> The decision depends on your pain'],
  ['“Joint replacement is only for very old people.”', '<b>Fact:</b> Age matters less than the damage'],
  ['“After a fracture, rest is all you need.”', '<b>Fact:</b> Some fractures need to be set or fixed'],
  ['“Back pain always means a slip disc.”', '<b>Fact:</b> Most back pain comes from muscles, joints or posture'],
  ['“Oil massage will fix a torn ligament.”', '<b>Fact:</b> Massage can ease sore muscles'],
];

export function OrthopaedicsPage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('orthopaedics', en, locale);
  return (
    <>
      <DeptHero
        page="orthopaedics"
        locale={locale}
        h1Key="Bones, joints"
        ledeKey="The department that began"
        image="ortho.hero"
        fitViewport
        align="center"
        wrapped
        ctas={
          <>
            <DeptBookCta page="orthopaedics" locale={locale} label="Book with Dr. Mohit" dept="Orthopaedics" doctor="mohit" />
            <DeptPhoneCta />
          </>
        }
      />
      <WaveDivider from="sky" to="white" />

      <section className="sec" style={{ paddingBlock: 'clamp(48px,6vw,88px)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 0, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{copy('ortho-explore', 'Treatments', locale)}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={copy('ortho-explore', 'Explore by', locale)} />
              </h2>
            </div>
          </div>
          <ExploreLinks locale={locale} />
        </div>
      </section>
      <WaveDivider from="white" to="brand" />
      <OrthoFacts locale={locale} />
      <WaveDivider from="brand" to="white" />

      <section className="sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Services')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('From knee to spine,')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Tap a card to ask')}</p>
          </div>
          <OrthoServices locale={locale} />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Inside the knee')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('Every part of the knee')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Tap a part of the knee')}</p>
          </div>
          <KneeExplorer locale={locale} />
        </div>
      </section>
      {/* same mint band continues — split so each part stays under the
          mobile 1.3x-viewport rule */}
      <section className="sec" style={{ background: 'var(--mint)', paddingTop: 'clamp(32px,5vw,56px)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginTop: 0, marginBottom: 28, alignItems: 'end' }}>
            <div className="c-6">
              <span className="label">{c('Arthritis')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('A healthy knee next to a worn one.')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Drag the slider')}</p>
          </div>
          <CmpSlider
            className="cmp cmp2 rv"
            leftTag={c('Worn knee')}
            rightTag={c('Healthy knee')}
            ariaLabel="Compare worn and healthy knee"
            layerA={
              <div className="kva">
                <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  <rect width="800" height="400" fill="#FBF3EE" />
                  <g transform="translate(400 6)">
                    <path className="kb" d="M-112 256 C-60 242 60 242 112 256 L104 284 L80 296 L74 400 L-74 400 L-80 296 L-104 284 Z" />
                    <path className="kb" d="M-112 256 l-18 -10 l10 18z M112 256 l18 -10 l-10 18z" />
                    <g transform="translate(0 40)">
                      <path className="kb" d="M-60 -40 L60 -40 L64 120 C110 130 126 170 100 192 C78 206 40 186 0 188 C-40 186 -78 206 -100 192 C-126 170 -110 130 -64 120 Z" />
                      <path d="M-102 192 C-80 208 -40 188 0 192 C40 188 80 208 102 192" stroke="#C98B5A" strokeWidth="4" strokeDasharray="26 22" fill="none" strokeLinecap="round" />
                    </g>
                    <circle className="glow" cx="-46" cy="238" r="22" />
                    <circle className="glow" cx="54" cy="240" r="18" style={{ animationDelay: '-1s' }} />
                    <path className="kcall" d="M-120 236 H-200" stroke="#3D4652" strokeWidth="1.2" />
                    <text className="kcall" x="-206" y="240" textAnchor="end">{c('Thin, worn cartilage')}</text>
                    <path className="kcall" d="M-128 250 H-200 V286" fill="none" stroke="#3D4652" strokeWidth="1.2" />
                    <text className="kcall" x="-206" y="300" textAnchor="end">{c('Bone spurs')}</text>
                  </g>
                </svg>
              </div>
            }
            layerB={
              <div className="kvb clear">
                <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  <rect width="800" height="400" fill="#F4FAF6" />
                  <g transform="translate(400 6)">
                    <path className="kb" d="M-60 0 L60 0 L64 120 C110 130 126 170 100 192 C78 206 40 186 0 188 C-40 186 -78 206 -100 192 C-126 170 -110 130 -64 120 Z" />
                    <path d="M-102 192 C-80 208 -40 188 0 192 C40 188 80 208 102 192" stroke="#1E9A4B" strokeWidth="13" fill="none" strokeLinecap="round" />
                    <path d="M-104 222 C-90 212 -50 212 -30 220 C-50 224 -80 226 -104 230Z M104 222 C90 212 50 212 30 220 C50 224 80 226 104 230Z" fill="#7FB2F5" />
                    <path className="kb" d="M-112 256 C-60 242 60 242 112 256 L104 284 L80 296 L74 400 L-74 400 L-80 296 L-104 284 Z" />
                    <path d="M-110 252 C-60 240 60 240 110 252" stroke="#1E9A4B" strokeWidth="13" fill="none" strokeLinecap="round" />
                    <path className="kcall" d="M120 196 H200" stroke="#3D4652" strokeWidth="1.2" />
                    <text className="kcall" x="206" y="200">{c('Thick, smooth cartilage')}</text>
                    <path className="kcall" d="M120 236 H200" stroke="#3D4652" strokeWidth="1.2" />
                    <text className="kcall" x="206" y="240">{c('A healthy gap')}</text>
                  </g>
                </svg>
              </div>
            }
          />
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      <section className="sec">
        <div className="wrap g12">
          <div className="c-5 rv">
            <span className="label">{c('Check yourself')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('What do you')} />
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {c('Tap the ones that sound like you')}
            </p>
            <div style={{ marginTop: 32 }}>
              <ImageSlot id="ortho.exam" locale={locale} />
            </div>
          </div>
          <div className="s-7 rv">
            <SymptomCheck locale={locale} />
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="navy" />

      <section className="sec jr-sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 'clamp(40px,6vw,80px)', alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('After joint replacement')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('The road back to')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Every recovery is different')}</p>
          </div>
          <OrthoJourney locale={locale} />
          <div className="rv" style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
            <ImageSlot id="ortho.recovery" locale={locale} />
          </div>
        </div>
      </section>
      <WaveDivider from="navy" to="white" />

      <section className="sec">
        <div className="wrap g12">
          <div className="c-4">
            <span className="label">{c('By body area')}</span>
            <h2 style={{ marginTop: 18 }}>{c('What we treat')}</h2>
          </div>
          <div className="s-6 acc">
            {BODY_AREAS.map((it, i) => (
              <details key={it.q} open={i === 0}>
                <summary>
                  <span>
                    <RichText text={c(it.q)} />
                  </span>
                  <i />
                </summary>
                <div className="body">{c(it.a)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Arthroscopy &amp; sports injuries')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('Keyhole surgery,')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Many injuries heal with rest')}</p>
          </div>
          <JTabs locale={locale} />
        </div>
      </section>
      {/* same sky band continues — physio gets its own section so the tab
          widget stays under the mobile 1.3x-viewport rule */}
      <section className="sec" style={{ background: 'var(--sky)', paddingTop: 0 }}>
        <div className="wrap">
          <JPhysio locale={locale} />
        </div>
      </section>
      <WaveDivider from="sky" to="mint" />

      <section className="sec faq-sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap g12">
          <div className="c-4 rv">
            <span className="label">{c('Myths &amp; facts')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('What people')} />
            </h2>
            <p className="muted" style={{ marginTop: 20 }}>
              {c('These come up often')}
            </p>
          </div>
          <div className="s-6 rv">
            <Accordion
              items={MYTHS.map(([q, a]) => ({ q: c(q), a: c(a) }))}
            />
          </div>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      <Callout locale={locale} />
      <div className="wrap" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 18px 64px' }}>
        <ReviewerBox doctor="Dr. Mohit Gupta" />
      </div>
    </>
  );
}
