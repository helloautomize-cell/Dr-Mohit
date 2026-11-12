// Master doctor profile template (phase-03 item 4): split hero with key
// facts (qualifications, registration where known, languages), About,
// "How Dr. X works", non-clickable condition/service chips, Book CTA.
// Facts only from resources/docs/facts-and-compliance.md.
import type { Locale } from '@/i18n/routing';
import { copy } from '@/lib/copy';
import { RichText } from '@/components/RichText';
import { ImageSlot } from '@/components/ImageSlot';
import { BookButton } from '@/components/Buttons';
import { ConfirmNote } from '@/components/Confirm';
import { LabelText, H1, Lede } from '@/components/primitives';

export interface DoctorFacts {
  name: string;
  namePa?: string;
  dept: string;
  deptPa?: string;
  slot: string;
  qualifications: { text: string; confirmId?: string }[];
  languages: string;
  languagesPa?: string;
  about: string[];
  aboutPa?: string[];
  howWorks: string[];
  howWorksPa?: string[];
  chips: string[];
  chipsPa?: string[];
}

export function DoctorProfile({ d, locale: l }: { d: DoctorFacts; locale: Locale }) {
  const pa = l === 'pa';
  const name = (pa && d.namePa) || d.name;
  const about = (pa && d.aboutPa) || d.about;
  const howWorks = (pa && d.howWorksPa) || d.howWorks;
  const chips = (pa && d.chipsPa) || d.chips;
  const languages = (pa && d.languagesPa) || d.languages;
  const dept = (pa && d.deptPa) || d.dept;
  return (
    <>
      <section className="hero hero-c">
        <div className="wrap">
          <div className="g12" style={{ alignItems: 'center' }}>
            <div className="c-7">
              <LabelText text={dept} />
              <H1 text={name} />
              <div className="docfacts" style={{ marginTop: 22 }}>
                {d.qualifications.map((q, i) => (
                  <div className="docfact" key={i}>
                    <RichText text={q.text} />
                    {q.confirmId && <ConfirmNote id={q.confirmId} />}
                  </div>
                ))}
                <div className="docfact">
                  <b>{pa ? 'ਭਾਸ਼ਾਵਾਂ' : 'Languages'}:</b> {languages}
                </div>
              </div>
              <div className="ctas" style={{ marginTop: 22 }}>
                <BookButton href="/contact/">
                  <RichText text={copy('global', 'Book appointment', l)} />
                </BookButton>
              </div>
            </div>
            <div className="c-5">
              <div className="hero-wrap">
                <ImageSlot id={d.slot} locale={l} className="hero-im" fill />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="csec">
        <div className="wrap" style={{ paddingBlock: '44px 24px' }}>
          <h2 className="h2">{pa ? 'ਬਾਰੇ' : 'About'}</h2>
          {about.map((p, i) => (
            <Lede key={i} text={p} />
          ))}
          <h2 className="h2" style={{ marginTop: 36 }}>
            {pa ? `${name} ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ` : `How ${name} works`}
          </h2>
          <ul className="cklist">
            {howWorks.map((p, i) => (
              <li key={i}><RichText text={p} /></li>
            ))}
          </ul>
          <div className="chips" style={{ marginTop: 24 }}>
            {chips.map((c, i) => (
              <span className="chip" key={i}>{c}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
