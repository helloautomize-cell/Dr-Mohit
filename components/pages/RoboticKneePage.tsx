// Robotic knee replacement page — preview order: ph hero, five-step trail,
// navy balance demo, myths & facts (8), VELYS/ATTUNE duo + fit check, CTA.
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero } from './DeptHero';
import { ImageSlot } from '../ImageSlot';
import { RoboticSteps, Callout } from '../sections/bands';
import { VelysAttuneDuo, FitCheck } from '../sections/cards';
import { BalanceDemo } from '../tools/BalanceDemo';
import { ReviewerBox } from '../Confirm';

// The first five worries stay English on both locales in the approved preview.
const MYTHS_EN: { q: string; a: string }[] = [
  {
    q: '“The robot does the operation.”',
    a: '<b>Fact:</b> The surgeon performs the operation. The system shows the plan and holds the saw to the planned angle. It does not act on its own.',
  },
  {
    q: '“I should wait until I can’t walk at all.”',
    a: '<b>Fact:</b> Waiting a long time can weaken the muscles around the knee. See a specialist when pain starts limiting daily life, even if surgery is not needed yet.',
  },
  {
    q: '“Every painful knee needs replacement.”',
    a: '<b>Fact:</b> Many people do well with exercise, weight control, medicines or injections. Replacement is considered when these no longer help.',
  },
  {
    q: '“Is it covered under Ayushman Bharat?”',
    a: 'Gupta Hospital is empanelled under PM-JAY. Ask our team whether your card and procedure are eligible.',
  },
  {
    q: '“How long will I stay in hospital?”',
    a: 'It depends on your health and the operation. Dr. Mohit will tell you what to expect at your consultation.',
  },
];

const MYTHS_BI: [string, string][] = [
  ['“Do I need a CT scan before robotic surgery?”', 'No separate CT scan is needed'],
  ['“Is robotic surgery right for everyone?”', 'Not always. Dr. Mohit will look'],
  ['“Will I have less pain afterwards?”', 'Any knee replacement involves some pain'],
];

export function RoboticKneePage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('robotic-knee', en, locale);
  return (
    <>
      <DeptHero
        page="robotic-knee"
        locale={locale}
        h1Key="Robotic-assisted knee replacement."
        ledeKey="Gupta Hospital uses"
        image="robotic.hero"
        imStyle={{ background: '#fff', border: '1px solid var(--line)' }}
      />
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap">
          <div className="g12" style={{ marginBottom: 40, alignItems: 'end' }}>
            <div className="c-6">
              <span className="label">{c('The process')}</span>
              <h2 style={{ marginTop: 18 }}>{c('Five steps, start to finish')}</h2>
            </div>
            <div className="s-8 rv" style={{ gridColumn: '8/-1' }}>
              <ImageSlot id="robotic.plan" locale={locale} />
            </div>
          </div>
          <RoboticSteps locale={locale} />
        </div>
      </section>
      <WaveDivider from="white" to="navy" />

      <section className="sec jr-sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 'clamp(36px,5vw,64px)', alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Balancing the knee')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('Bend the knee and watch the')} />
              </h2>
            </div>
            <p className="lede s-8">{c('A camera follows markers')}</p>
          </div>
          <BalanceDemo locale={locale} />
        </div>
      </section>
      <WaveDivider from="navy" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap g12">
          <div className="c-4">
            <span className="label">{c('Myths &amp; facts')}</span>
            <h2 style={{ marginTop: 18 }}>{c('Common worries, answered')}</h2>
          </div>
          <div className="s-6 acc">
            {MYTHS_EN.map((it, i) => (
              <details key={it.q} open={i === 0}>
                <summary>
                  {it.q}
                  <i />
                </summary>
                <div className="body">
                  <RichText text={it.a} />
                </div>
              </details>
            ))}
            {MYTHS_BI.map(([q, a]) => (
              <details key={q}>
                <summary>
                  <span>{c(q)}</span>
                  <i />
                </summary>
                <div className="body">
                  <RichText text={c(a)} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />
      <WaveDivider from="white" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 0, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('What is used')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('Two parts:')} />
              </h2>
            </div>
            <p className="lede s-8">{c('The robotic system helps place')}</p>
          </div>
          <VelysAttuneDuo locale={locale} />
        </div>
      </section>
      {/* same sky band continues — own section so neither part exceeds the
          mobile 1.3x-viewport rule */}
      <section className="sec" style={{ background: 'var(--sky)', paddingTop: 'clamp(32px,6vw,64px)' }}>
        <div className="wrap">
          <FitCheck locale={locale} />
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      <Callout page="robotic-knee" locale={locale} />
      <div className="wrap" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 18px 64px' }}>
        <ReviewerBox doctor="Dr. Mohit Gupta" />
      </div>
    </>
  );
}
