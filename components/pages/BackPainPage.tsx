// Back pain clinic — v14 preview: ph-c hero (BP-1 placeholder), navy "do not
// wait" warning grid + emergency buttons, sky causes grid, five-step clinic
// trail (last step carries a [CONFIRM] on offered procedures), mint habits
// grid, white physiotherapy split with BP-2, sky FAQ, shared ortho tail.
import { copy, ORTHO_SUBPAGES } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero, DeptBookCta, DeptPhoneCta } from './DeptHero';
import { ImageSlot } from '../ImageSlot';
import { Callout, StepsTrail } from '../sections/bands';
import type { IconName } from '../icons';
import { SecHead, SignsGrid, CgGrid, BringGrid, FaqSec, OrthoSubTail } from './ortho-shared';

const PAGE = ORTHO_SUBPAGES.backPain;

const SIGNS: { icon: IconName; h3: string; lis: string[] }[] = [
  { icon: 'drop', h3: 'Bladder or bowel', lis: ['New trouble passing or holding urine', 'Loss of bowel control'] },
  { icon: 'body', h3: 'Numbness', lis: ['Numbness around the groin or buttocks', 'Numbness spreading down both legs'] },
  { icon: 'walk', h3: 'Weakness', lis: ['Foot drop or a leg giving way', 'Weakness getting worse'] },
  { icon: 'shield', h3: 'Other warning signs', lis: ['Back pain after a fall or accident', 'Fever or weight loss with back pain'] },
];

const CAUSES: { icon: IconName; h3: string; chips: string[] }[] = [
  { icon: 'body', h3: 'Muscle and posture', chips: ['Muscle strain', 'Long hours sitting or driving', 'Heavy lifting'] },
  { icon: 'wave', h3: 'Discs and nerves', chips: ['Disc bulge', 'Sciatica', 'Narrowed spinal canal'] },
  { icon: 'arm', h3: 'Neck', chips: ['Stiff neck', 'Pain spreading to the arm', 'Phone and screen posture'] },
  { icon: 'scale', h3: 'Wear and age', chips: ['Spinal arthritis', 'Thin bones', 'Sacroiliac joint pain'] },
];

const STEPS: { icon: IconName; h3: string; p: string; confirmId?: string }[] = [
  { icon: 'talk', h3: 'Listen and examine', p: 'Where it hurts, what makes it worse' },
  { icon: 'xray', h3: 'Tests only if needed', p: 'Many people do not need an X-ray or MRI at first' },
  { icon: 'pill', h3: 'Pain relief', p: 'The right medicines for a short time' },
  { icon: 'physio', h3: 'Physiotherapy and core work', p: 'Exercises to strengthen the back' },
  { icon: 'assess', h3: 'Next steps if pain stays', p: 'If pain or nerve symptoms continue', confirmId: 'spine-procedures' },
];

const HABITS: { icon: IconName; h3: string; p: string }[] = [
  { icon: 'body', h3: 'Sitting', p: 'Feet flat, back supported' },
  { icon: 'hands', h3: 'Lifting', p: 'Bend your knees, keep the load close' },
  { icon: 'moon', h3: 'Sleeping', p: 'A firm, even mattress' },
  { icon: 'walk', h3: 'Keep moving', p: 'Long bed rest usually slows recovery' },
];

const FAQS: [string, string][] = [
  ['Should I rest in bed until the pain goes?', 'A day or two of rest can help'],
  ['Will I need surgery for a disc bulge?', 'Most disc bulges settle with time'],
  ['Do I need an MRI straight away?', 'Usually not, unless there are warning signs'],
  ['Is a back belt helpful?', 'A belt can help for a short time'],
];

export function BackPainPage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy(PAGE, en, locale);
  return (
    <>
      <DeptHero
        page={PAGE}
        locale={locale}
        h1Key="Most back pain gets better"
        ledeKey="Low back pain, sciatica"
        image="ortho.bp.hero"
        align="center"
        wrapped
        ctas={
          <>
            <DeptBookCta page={PAGE} locale={locale} label="Book with Dr. Mohit" dept="Orthopaedics" />
            <DeptPhoneCta />
          </>
        }
      />
      <WaveDivider from="sky" to="navy" />

      <section className="sec on-dark">
        <div className="wrap">
          <SecHead
            page={PAGE}
            locale={locale}
            label="Do not wait"
            h2="Come to the hospital"
            lede="These signs can mean pressure"
          />
          <SignsGrid
            page={PAGE}
            locale={locale}
            label={c('Do not wait')}
            items={SIGNS.map((s) => ({ icon: s.icon, h3: c(s.h3), lis: s.lis.map(c) }))}
          />
        </div>
      </section>
      <WaveDivider from="navy" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Common causes" h2="Where back pain" />
          <CgGrid items={CAUSES.map((g) => ({ icon: g.icon, h3: c(g.h3), chips: g.chips.map(c) }))} label={c('Common causes')} />
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="How the clinic works" h2="Simple treatment first," margin={40} />
          <StepsTrail
            items={STEPS.map((it) => ({ icon: it.icon, h3: c(it.h3), p: c(it.p), confirmId: it.confirmId }))}
            label={c('How the clinic works')}
          />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Everyday habits" h2="Small habits that" />
          <BringGrid items={HABITS.map((it) => ({ icon: it.icon, h3: c(it.h3), p: c(it.p) }))} label={c('Everyday habits')} />
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      <section className="sec">
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="c-5 rv">
            <span className="label">{c('Physiotherapy')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Exercise is often')} />
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {c('A physiotherapist teaches you exercises')}
            </p>
          </div>
          <div className="c-6 rv" style={{ gridColumn: '7/-1' }}>
            <ImageSlot
              id="ortho.bp.physio"
              locale={locale}
              className="rv"
              caption={c('A physiotherapist guides a woman')}
            />
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      <FaqSec page={PAGE} locale={locale} items={FAQS.map(([q, a]) => ({ q: c(q), a: c(a) }))} mint={false} />
      <WaveDivider from="sky" to="white" />

      <OrthoSubTail page={PAGE} locale={locale} exclude="backPain" />
      <WaveDivider from="white" to="sky" />
      <Callout page="orthopaedics" locale={locale} />
    </>
  );
}
