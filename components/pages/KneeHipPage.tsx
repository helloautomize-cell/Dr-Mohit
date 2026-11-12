// Knee and hip replacement — v14 preview: ph-c hero (KH-1 placeholder), four
// .svc.two options, mint fit check, five-step journey trail, sky "Getting home
// ready" split with the spare recovery photo, mint FAQ, shared ortho tail.
import Image from 'next/image';
import Link from 'next/link';
import { copy, ORTHO_SUBPAGES } from '@/lib/copy';
import { slot } from '@/lib/image-slots';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero, DeptBookCta, DeptPhoneCta } from './DeptHero';
import { Callout, StepsTrail } from '../sections/bands';
import { Icon, type IconName } from '../icons';
import { SecHead, FitBoxes, TickList, FaqSec, OrthoSubTail } from './ortho-shared';

const PAGE = ORTHO_SUBPAGES.kneeHip;

const OPTIONS: { icon: IconName; h3: string; p: string; link?: boolean }[] = [
  { icon: 'balance', h3: 'Total knee replacement', p: 'The worn ends of the thigh' },
  { icon: 'scale', h3: 'Partial knee replacement', p: 'When only one part of the knee is worn' },
  { icon: 'assess', h3: 'Robotic-assisted knee replacement', p: 'The VELYS™ system helps plan', link: true },
  { icon: 'walk', h3: 'Hip replacement', p: 'A worn or damaged hip joint' },
];

const JOURNEY: { icon: IconName; h3: string; p: string }[] = [
  { icon: 'assess', h3: 'Consultation and X-rays', p: 'Dr. Mohit examines the joint' },
  { icon: 'lab', h3: 'Checks before surgery', p: 'Blood tests, heart and sugar checks' },
  { icon: 'ot', h3: 'The operation', p: 'Done in the modular operation theatre' },
  { icon: 'physio', h3: 'First steps in hospital', p: 'Physiotherapy starts in hospital' },
  { icon: 'home', h3: 'Home and follow-up', p: 'Exercises continue at home' },
];

const HOME_TICKS = [
  'A firm chair with arm rests',
  'A raised or western toilet seat',
  'Loose rugs and wires moved',
  'A bed on the ground floor',
  'Someone at home for the first days',
];

const FAQS: [string, string][] = [
  ['How long does a new knee or hip last?', 'Most modern joints last many years'],
  ['Can both knees be done together?', 'Sometimes, if your general health allows'],
  ['Will I be able to sit on the floor?', 'Many people get good bending back'],
  ['Is it covered under Ayushman Bharat?', 'Gupta Hospital is empanelled under PM-JAY'],
  ['How long will I stay in hospital?', 'It depends on your health and the operation'],
];

export function KneeHipPage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy(PAGE, en, locale);
  const s = slot('ortho.kh.recovery');
  return (
    <>
      <DeptHero
        page={PAGE}
        locale={locale}
        h1Key="Walk, sit and sleep"
        ledeKey="When arthritis has worn"
        image="ortho.kh.hero"
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
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Options" h2="Four ways to" lede="Which one suits you" margin={48} />
          <div className="svc two">
            {OPTIONS.map((o) => {
              const full = c(o.p);
              // The robotic card's copy ends "… How it works →": split the
              // trailing link phrase and render it as a real route link.
              const m = o.link ? full.match(/^(.*?[.।])\s*([^.।]+?)\s*→\s*$/) : null;
              return (
                <div className="rv" key={o.h3}>
                  <span className="sic">
                    <Icon name={o.icon} />
                  </span>
                  <h3>{c(o.h3)}</h3>
                  {m ? (
                    <p>
                      {m[1]}{' '}
                      <Link className="lnk" href="/orthopaedics/robotic-knee-replacement/">
                        {m[2]} →
                      </Link>
                    </p>
                  ) : (
                    <p>{full}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Is it time?" h2="Signs it may be" />
          <FitBoxes
            yesTitle={c('Talk to us about replacement if')}
            yes={[
              c('Pain limits walking, stairs or sleep'),
              c('Medicines, exercise and injections no longer help'),
              c('The knee is bending outwards or inwards'),
              c('You avoid going out because of the pain'),
            ]}
            noTitle={c('Try other treatment first if')}
            no={[
              c('Pain comes and goes and you stay active'),
              c('Your X-ray shows early wear'),
              c('You have not tried physiotherapy yet'),
              c('Weight loss could ease the load on the joint'),
            ]}
            note={c('Only an examination and X-rays can decide')}
          />
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      <section className="sec">
        <div className="wrap">
          <SecHead page={PAGE} locale={locale} label="Your journey" h2="From first visit" margin={40} />
          <StepsTrail
            items={JOURNEY.map((it) => ({ icon: it.icon, h3: c(it.h3), p: c(it.p) }))}
            label={c('Your journey')}
          />
        </div>
      </section>
      <WaveDivider from="white" to="sky" />

      <section className="sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap g12" style={{ alignItems: 'center' }}>
          <div className="c-5 rv">
            <span className="label">{c('Getting home ready')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('Small changes that make')} />
            </h2>
            <TickList items={HOME_TICKS.map(c)} />
          </div>
          <div className="c-6 rv" style={{ gridColumn: '7/-1' }}>
            <figure className="rimg" style={{ ['--ar' as string]: '4/3', margin: 0 }}>
              <Image
                src={s.src!}
                alt={locale === 'pa' ? s.alt.pa : s.alt.en}
                width={1600}
                height={900}
                sizes="(max-width:900px) 92vw, 50vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.focal }}
              />
            </figure>
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="mint" />

      <FaqSec
        page={PAGE}
        locale={locale}
        items={FAQS.map(([q, a]) => ({ q: c(q), a: c(a) }))}
      />
      <WaveDivider from="mint" to="white" />

      <OrthoSubTail page={PAGE} locale={locale} exclude="kneeHip" />
      <WaveDivider from="white" to="sky" />
      <Callout page="orthopaedics" locale={locale} />
    </>
  );
}
