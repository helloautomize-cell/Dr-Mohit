// Arthroscopy and sports injuries — v14 preview: ph-c hero (SP-1 placeholder),
// scopebox explainer, four .cg injury groups, rest-vs-check fit boxes, mint
// five-stage return-to-sport trail, sky keyhole-repairs list with the SP-2
// placeholder, mint FAQ, shared ortho tail.
import { copy, ORTHO_SUBPAGES } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero, DeptBookCta, DeptPhoneCta } from './DeptHero';
import { ImageSlot } from '../ImageSlot';
import { Callout, StepsTrail } from '../sections/bands';
import type { IconName } from '../icons';
import {
  SecHead,
  ArthroscopyDiagram,
  CgGrid,
  FitBoxes,
  TickList,
  FaqSec,
  OrthoSubTail,
} from './ortho-shared';

const PAGE = ORTHO_SUBPAGES.sports;

const GROUPS: { icon: IconName; h3: string; chips: string[] }[] = [
  { icon: 'balance', h3: 'Knee', chips: ['ACL tear', 'Meniscus tear', 'Kneecap slipping', 'Cartilage damage'] },
  { icon: 'arm', h3: 'Shoulder', chips: ['Rotator cuff tear', 'Recurrent dislocation', 'Frozen shoulder', 'Impingement'] },
  { icon: 'walk', h3: 'Ankle and foot', chips: ['Ankle sprain', 'Ligament tear', 'Achilles pain'] },
  { icon: 'hands', h3: 'Elbow and wrist', chips: ['Tennis elbow', 'Golfer’s elbow', 'Wrist sprain'] },
];

const REST_OK = ['You can walk on it with mild pain', 'Swelling is small and going down', 'It feels better each day'];
const SEE_DOC = [
  'You heard a pop and the knee swelled within hours',
  'The joint gives way, locks or catches',
  'You cannot put weight on it',
  'The shoulder has come out of place',
];

const STAGES: { icon: IconName; h3: string; p: string }[] = [
  { icon: 'shield', h3: 'Protect', p: 'Rest, ice, a brace if needed' },
  { icon: 'physio', h3: 'Move', p: 'Physiotherapy brings back the full range' },
  { icon: 'arm', h3: 'Strengthen', p: 'Muscles around the joint are built up' },
  { icon: 'balance', h3: 'Train', p: 'Balance, running and turning drills' },
  { icon: 'walk', h3: 'Play', p: 'You return to sport or heavy work' },
];

const REPAIRS = [
  'ACL reconstruction',
  'Meniscus repair or trimming',
  'Shoulder stabilisation',
  'Rotator cuff repair',
  'Kneecap realignment and cartilage procedures',
];

const FAQS: [string, string][] = [
  ['Do I need an MRI?', 'Not always. The examination often tells us'],
  ['Can a torn ACL heal without surgery?', 'The ligament does not usually join'],
  ['When can I play again after ACL surgery?', 'It usually takes several months'],
  ['Is arthroscopy done under general anaesthesia?', 'Knee arthroscopy is often done under spinal'],
];

export function SportsInjuriesPage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy(PAGE, en, locale);
  return (
    <>
      <DeptHero
        page={PAGE}
        locale={locale}
        h1Key="Back to the field"
        ledeKey="Twisted knees, torn ligaments"
        image="ortho.sp.hero"
        align="center"
        wrapped
        ctas={
          <>
            <DeptBookCta page={PAGE} locale={locale} label="Book with Dr. Mohit" dept="Orthopaedics" />
            <DeptPhoneCta />
          </>
        }
      />
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="c-5 rv">
            <span className="label">{c('What is arthroscopy?')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Surgery through')} />
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {c('A thin camera goes into the joint')}
            </p>
            <p className="muted" style={{ marginTop: 14, fontSize: '.9rem' }}>
              {c('Illustration only.')}
            </p>
          </div>
          <div className="c-6 rv" style={{ gridColumn: '7/-1' }}>
            <ArthroscopyDiagram locale={locale} />
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Common injuries" h2="Injuries we see" />
          <CgGrid items={GROUPS.map((g) => ({ icon: g.icon, h3: c(g.h3), chips: g.chips.map(c) }))} label={c('Common injuries')} />
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="When to see a doctor" h2="Rest it, or" />
          <FitBoxes
            yesTitle={c('Often settles with rest and ice if')}
            yes={REST_OK.map(c)}
            noTitle={c('See a doctor soon if')}
            no={SEE_DOC.map(c)}
            note={c('If pain is severe or the limb looks out of shape')}
          />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Return to sport" h2="Five stages," margin={40} />
          <StepsTrail
            items={STAGES.map((it) => ({ icon: it.icon, h3: c(it.h3), p: c(it.p) }))}
            label={c('Return to sport')}
          />
        </div>
      </section>
      <WaveDivider from="mint" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="c-6 rv">
            <ImageSlot
              id="ortho.sp.scope"
              locale={locale}
              className="rv"
              caption={c('Dr. Mohit Gupta performs knee arthroscopy')}
            />
          </div>
          <div className="c-5 rv">
            <span className="label">{c('Procedures')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Keyhole repairs')} />
            </h2>
            <TickList items={REPAIRS.map(c)} />
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="mint" />

      <FaqSec page={PAGE} locale={locale} items={FAQS.map(([q, a]) => ({ q: c(q), a: c(a) }))} />
      <WaveDivider from="mint" to="white" />

      <OrthoSubTail page={PAGE} locale={locale} exclude="sports" />
      <WaveDivider from="white" to="sky" />
      <Callout page="orthopaedics" locale={locale} />
    </>
  );
}
