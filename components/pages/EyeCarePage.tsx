// Eye care page — preview order: ph hero (+ eye dept phone line), services
// grid, eye explorer, cataract vision slider, cataract signs, surgery-day
// trail + photo, lens options + lens banner, myths & facts (+ dept phone
// link), CTA. The .pg-eye wrapper switches icon/tag accents to leaf green.
import Image from 'next/image';
import { copy } from '@/lib/copy';
import type { Locale } from '@/i18n/routing';
import { RichText } from '../RichText';
import { WaveDivider } from '../WaveDivider';
import { DeptHero } from './DeptHero';
import { Accordion, CataractDay, Callout } from '../sections/bands';
import { EyeServices } from '../sections/cards';
import { EyeExplorer } from '../tools/EyeExplorer';
import { CmpSlider } from '../tools/CmpSlider';
import { ImageSlot } from '../ImageSlot';
import { ReviewerBox } from '../Confirm';
import { slot } from '@/lib/image-slots';
import { SITE } from '@/lib/site-config';

const SIGNS = [
  'Cloudy, dim or yellowed vision',
  'Glare from headlights or lamps at night',
  'Glasses that need changing often',
  'Colours that look faded',
  'Needing more light to read',
];

const LENSES: { tag: string; h3: string; p: string }[] = [
  { tag: 'Monofocal', h3: 'Clear at one distance', p: 'Usually set for distance. Most people still use reading glasses.' },
  { tag: 'Toric', h3: 'Corrects astigmatism', p: 'For people with a cylindrical number, so distance vision is sharper.' },
  { tag: 'Multifocal', h3: 'Near and far', p: 'Can reduce the need for glasses. Some people notice halos around lights at night.' },
];

const MYTHS: [string, string][] = [
  ['“Eye drops can dissolve a cataract.”', '<b>Fact:</b> No drop or medicine'],
  ['“A cataract must be ripe before surgery.”', '<b>Fact:</b> With modern phaco surgery'],
  ['“My reading got better without glasses, so my eyes are healing.”', '<b>Fact:</b> This “second sight”'],
  ['“People with diabetes only need eye checks when vision drops.”', '<b>Fact:</b> Retina damage from diabetes'],
];

export function EyeCarePage({ locale }: { locale: Locale }) {
  const c = (en: string) => copy('eye-care', en, locale);
  const sliderSrc = slot('eye.slider').src!;
  return (
    <div className="pg-eye">
      <DeptHero
        page="eye-care"
        locale={locale}
        h1Key="Complete eye care."
        ledeKey="Led by Dr. Parul Gupta"
        image="eye.hero"
        extra={
          <p style={{ marginTop: 24 }}>
            <span className="muted">{c('Eye department:')}</span>{' '}
            <a href={SITE.phoneEyeHref} style={{ userSelect: 'all', color: 'inherit' }}>
              {SITE.phoneEye}
            </a>
          </p>
        }
      />
      <WaveDivider from="sky" to="white" />

      <section className="sec">
        <div className="wrap">
          <span className="label">{c('Services')}</span>
          <EyeServices label={c('Services')} />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('How the eye works')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('Follow the')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Tap a part of the eye')}</p>
          </div>
          <EyeExplorer locale={locale} />
          <div className="g12" style={{ marginTop: 'clamp(40px,6vw,72px)' }}>
            <div className="c-12 rv">
              <ImageSlot id="eye.explain" locale={locale} />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      <section className="sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 36, alignItems: 'end' }}>
            <div className="c-6">
              <span className="label">{c('Vision')}</span>
              <h2 style={{ marginTop: 18 }}>{c('How cataract can change')}</h2>
            </div>
            <p className="lede s-8">{c('Drag the slider')}</p>
          </div>
          <CmpSlider
            id="cmp"
            leftTag={c('With cataract')}
            rightTag={c('Clear lens')}
            ariaLabel="Compare clouded and clear vision"
            layerA={<Image className="cl" src={sliderSrc} alt="" fill sizes="(max-width:900px) 92vw, 84vw" />}
            layerB={
              <Image
                className="clear"
                src={sliderSrc}
                alt="Operation theatre shown clear on one side and clouded on the other"
                fill
                sizes="(max-width:900px) 92vw, 84vw"
              />
            }
          />
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap g12">
          <div className="c-5">
            <span className="label">{c('Cataract')}</span>
            <h2 style={{ marginTop: 18 }}>{c('Signs it may be cataract')}</h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {c('Cataract develops slowly')}
            </p>
            <div className="rv" style={{ marginTop: 32 }}>
              <ImageSlot id="eye.exam" locale={locale} />
            </div>
          </div>
          <ul className="clean s-7 cols3" style={{ columns: 1 }}>
            {SIGNS.map((s, i) => (
              <li className="rv" key={i}>
                {c(s)}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WaveDivider from="mint" to="white" />

      <section className="sec">
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 48, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Cataract surgery day')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('In by morning,')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Cataract surgery is done as day care')}</p>
          </div>
          <div className="g12">
            <div className="c-7">
              <CataractDay locale={locale} />
            </div>
            <div className="s-8" style={{ gridColumn: '9/-1' }}>
              <ImageSlot id="eye.cataract-day" locale={locale} caption={c('Eye examination')} />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="white" to="mint" />

      <section className="sec" style={{ background: 'var(--mint)' }}>
        <div className="wrap">
          <div className="g12 rv" style={{ marginBottom: 0, alignItems: 'end' }}>
            <div className="c-7">
              <span className="label">{c('Choosing your lens')}</span>
              <h2 style={{ marginTop: 18 }}>
                <RichText text={c('The new lens')} />
              </h2>
            </div>
            <p className="lede s-8">{c('Before surgery Dr. Parul measures')}</p>
          </div>
          <div className="duo" style={{ ['--n' as string]: 3 }}>
            {LENSES.map((ln) => (
              <article className="rv" key={ln.tag}>
                <div className="tx">
                  <span className="tag">{c(ln.tag)}</span>
                  <h3>{c(ln.h3)}</h3>
                  <p>{c(ln.p)}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="g12" style={{ marginTop: 16 }}>
            <div className="c-12">
              <ImageSlot
                id="eye.lens"
                locale={locale}
                className="rv"
                caption={c('A folded artificial lens, close up')}
              />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider from="mint" to="sky" />

      <section className="sec faq-sec" style={{ background: 'var(--sky)' }}>
        <div className="wrap g12">
          <div className="c-4 rv">
            <span className="label">{c('Myths &amp; facts')}</span>
            <h2 style={{ marginTop: 18 }}>
              <RichText text={c('What people')} />
            </h2>
            <div style={{ marginTop: 28 }}>
              <a className="lnk" href={SITE.phoneEyeHref}>
                <span>{c('Eye department +91 99886 32241')}</span>
                <span className="ar">→</span>
              </a>
            </div>
          </div>
          <div className="s-6 rv">
            <Accordion items={MYTHS.map(([q, a]) => ({ q: c(q), a: c(a) }))} />
          </div>
        </div>
      </section>
      <WaveDivider from="sky" to="white" />

      <Callout page="eye-care" locale={locale} />
      <div className="wrap" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 18px 64px' }}>
        <ReviewerBox doctor="Dr. Parul Gupta" />
      </div>
    </div>
  );
}
