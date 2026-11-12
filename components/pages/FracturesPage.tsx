// Fractures and trauma — v14 preview: ph-c hero (FR-1 placeholder), urgent
// 108/112 box, six .cg injury groups, five-step healing trail, mint first-aid
// fit boxes, sky "Older parents" split with the FR-2 placeholder, mint FAQ.
import { copy, ORTHO_SUBPAGES } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero, DeptBookCta, DeptPhoneCta } from './DeptHero';
import { ImageSlot } from '../ImageSlot';
import { Callout, StepsTrail } from '../sections/bands';
import type { IconName } from '../icons';
import { SecHead, UrgentBox, FitBoxes, CgGrid, FaqSec, OrthoSubTail } from './ortho-shared';

const PAGE = ORTHO_SUBPAGES.fractures;

const GROUPS: { icon: IconName; h3: string; chips: string[] }[] = [
  { icon: 'arm', h3: 'Shoulder and arm', chips: ['Collarbone', 'Upper arm', 'Elbow', 'Dislocation'] },
  { icon: 'hands', h3: 'Wrist and hand', chips: ['Wrist fracture', 'Finger and hand', 'Scaphoid'] },
  { icon: 'walk', h3: 'Hip and thigh', chips: ['Hip fracture in older people', 'Thigh bone', 'Pelvis'] },
  { icon: 'balance', h3: 'Leg, ankle and foot', chips: ['Shin bone', 'Ankle fracture', 'Kneecap', 'Foot'] },
  { icon: 'family', h3: 'Children’s fractures', chips: ['Falls from play', 'Growth plate injuries', 'Elbow in children'] },
  { icon: 'shield', h3: 'Road and farm injuries', chips: ['Multiple fractures', 'Open wounds with fracture', 'Machinery injuries'] },
];

const STEPS: { icon: IconName; h3: string; p: string }[] = [
  { icon: 'xray', h3: 'Examination and X-ray', p: 'The injury is checked for swelling' },
  { icon: 'hands', h3: 'Setting the bone', p: 'If the pieces have moved' },
  { icon: 'shield', h3: 'Holding it still', p: 'A plaster, splint or brace' },
  { icon: 'file', h3: 'Check-up X-rays', p: 'Follow-up visits make sure' },
  { icon: 'physio', h3: 'Getting strength back', p: 'Physiotherapy brings back movement' },
];

const DO_LIST = [
  'Keep the injured part still',
  'Support it with a folded cloth',
  'Cover any wound with a clean cloth',
  'Remove rings and bangles',
];
const DONT_LIST = [
  'Pull or try to straighten the limb',
  'Massage or apply oil on the injury',
  'Tie a tight bandage or local splint',
  'Give food or water if surgery may be needed',
];

const FAQS: [string, string][] = [
  ['How long does a plaster stay on?', 'It depends on the bone and your age'],
  ['Will the plates and screws be removed?', 'Often they stay in for life'],
  ['Is a local bone-setter enough?', 'Tight local bandages can cut off'],
  ['Do children’s fractures heal differently?', 'Children’s bones usually heal faster'],
];

export function FracturesPage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy(PAGE, en, locale);
  return (
    <>
      <DeptHero
        page={PAGE}
        locale={locale}
        h1Key="Broken bones, set right"
        ledeKey="From a child’s wrist"
        image="ortho.fr.hero"
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

      <section className="sec" style={{ paddingBlock: 'clamp(40px,5vw,72px)' }}>
        <div className="wrap">
          <UrgentBox page={PAGE} locale={locale} />
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="What we treat" h2="Fractures of every" />
          <CgGrid items={GROUPS.map((g) => ({ icon: g.icon, h3: c(g.h3), chips: g.chips.map(c) }))} />
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="How a fracture heals" h2="Five steps to a" margin={40} />
          <StepsTrail
            items={STEPS.map((it) => ({ icon: it.icon, h3: c(it.h3), p: c(it.p) }))}
            label={c('How a fracture heals')}
          />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="First aid" h2="Before you reach" />
          <FitBoxes
            yesTitle={c('Do')}
            yes={DO_LIST.map(c)}
            noTitle={c('Do not')}
            no={DONT_LIST.map(c)}
          />
        </div>
      </section>
      <WaveDivider from="mint" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="c-6 rv">
            <ImageSlot
              id="ortho.fr.xray"
              locale={locale}
              className="rv"
              caption={c('Dr. Mohit Gupta reviews a fracture X-ray')}
            />
          </div>
          <div className="c-5 rv">
            <span className="label">{c('Older parents')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('A fall at home is')} />
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {c('After a fall, an older person who cannot stand')}
            </p>
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="mint" />

      <FaqSec page={PAGE} locale={locale} items={FAQS.map(([q, a]) => ({ q: c(q), a: c(a) }))} />
      <WaveDivider from="mint" to="white" />

      <OrthoSubTail page={PAGE} locale={locale} exclude="fractures" />
      <WaveDivider from="white" to="sky" />
      <Callout page="orthopaedics" locale={locale} />
    </>
  );
}
