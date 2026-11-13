// Legal document renderer (phase-06): left sticky TOC, sectioned body,
// last-updated line, print-friendly. Content comes from lib/legal-docs.ts
// (wording + Punjabi translation reviewed by the hospital's legal contact).
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site-config';
import { getLegalDoc } from '@/lib/legal-docs';
import { ConfirmNote, SHOW_CONFIRM } from '@/components/Confirm';
import type { Metadata } from 'next';

export const legalMeta: Metadata = { robots: { index: false, follow: false } };

// Render text that may contain "[CONFIRM: id]" markers: a chip in development,
// removed entirely in production builds.
function Marked({ text }: { text: string }) {
  const parts = text.split(/\[CONFIRM: ([a-z-]+)\]/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          SHOW_CONFIRM ? (
            <ConfirmNote key={i} id={p} />
          ) : null
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function LegalDoc({ slug, locale }: { slug: string; locale: Locale }) {
  const doc = getLegalDoc(slug);
  const pa = locale === 'pa';
  const pick = (t: { en: string; pa: string }) => (pa ? t.pa : t.en);
  return (
    <article className="legaldoc wrap">
      <header className="ld-head">
        <h1>{pick(doc.title)}</h1>
        <p className="upd">
          {pa ? 'ਆਖ਼ਰੀ ਅੱਪਡੇਟ' : 'Last updated'}: {SITE.legalLastUpdated}
        </p>
        {doc.intro && <p className="lede">{pick(doc.intro)}</p>}
      </header>
      <div className="ld-grid">
        <nav className="ld-toc" aria-label={pa ? 'ਇਸ ਪੰਨੇ ਤੇ' : 'On this page'}>
          <span className="label">{pa ? 'ਇਸ ਪੰਨੇ ਤੇ' : 'On this page'}</span>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={i}>
                <a href={`#s${i + 1}`}>{pick(s.h)}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="ld-body">
          {doc.sections.map((s, i) => (
            <section key={i} id={`s${i + 1}`}>
              <h2>{pick(s.h)}</h2>
              {s.paras?.map((p, j) => (
                <p key={j}>
                  <Marked text={pick(p)} />
                </p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((li, j) => (
                    <li key={j}>
                      <Marked text={pick(li)} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
