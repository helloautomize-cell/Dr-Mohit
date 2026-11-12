// PageScaffold: hero (page h1 + lede + eyebrow + image slot) + ordered
// content stream + optional medical reviewer box (phase-03 items 4-5).
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { copy, section } from '@/lib/copy';
import { LabelText, H1, Lede } from '@/components/primitives';
import { RichText } from '@/components/RichText';
import { ImageSlot } from '@/components/ImageSlot';
import { ContentStream } from '@/components/ContentStream';
import { ReviewerBox } from '@/components/Confirm';
import { BookButton } from '@/components/Buttons';

export function PageScaffold({
  page,
  locale: l,
  imageSlot,
  ledeKey,
  reviewer,
  injectAfter,
  children,
}: {
  page: string;
  locale: Locale;
  imageSlot?: string;
  ledeKey: string;
  reviewer?: string;
  injectAfter?: { h2: string; node: React.ReactNode };
  children?: React.ReactNode;
}) {
  const t = useTranslations('shell');
  const strings = section(page, l);
  const h1 = strings.find((s) => s.tag === 'h1');
  const title = h1 ? (l === 'pa' ? h1.pa : h1.en) : page;
  return (
    <>
      <section className="hero hero-c">
        <div className="wrap">
          <div className="g12">
            <div className={imageSlot ? 'c-7' : 'c-12'}>
              <LabelText text={t('eyebrow')} />
              <H1 text={title} />
              <div style={{ marginTop: 24 }}>
                <Lede text={copy(page, ledeKey, l)} />
              </div>
              <div className="ctas" style={{ marginTop: 20 }}>
                <BookButton href="/contact/">
                  <RichText text={copy('global', 'Book appointment', l)} />
                  <span className="ar">→</span>
                </BookButton>
              </div>
            </div>
            {imageSlot && (
              <div className="c-5">
                <div className="hero-wrap">
                  <ImageSlot id={imageSlot} locale={l} className="hero-im" fill />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <ContentStream
        page={page}
        locale={l}
        ledeText={copy(page, ledeKey, l)}
        injectAfter={injectAfter}
      />
      {children}
      {reviewer && (
        <div className="wrap" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 18px 64px' }}>
          <ReviewerBox doctor={reviewer} />
        </div>
      )}
    </>
  );
}
