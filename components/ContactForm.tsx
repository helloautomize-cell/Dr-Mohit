'use client';

// Contact form shell (phase 6): full markup as in the approved preview.
// Department chips toggle locally; field values are not yet wired to the
// WhatsApp message builder — that logic lands in phase 7.
import { useState } from 'react';

export type ContactFormCopy = {
  department: string;
  depts: string[];
  name: string;
  phone: string;
  day: string;
  language: string;
  languages: string[];
  message: string;
  submit: string;
};

export function ContactForm({ copy: c }: { copy: ContactFormCopy }) {
  const [dept, setDept] = useState(0);
  return (
    <form
      className="c-7 form"
      id="bform"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="fl full">
        <span id="dchips-label">{c.department}</span>
        <div className="chipset" id="dchips" role="group" aria-labelledby="dchips-label">
          {c.depts.map((d, i) => (
            <button
              key={d}
              type="button"
              aria-pressed={dept === i}
              onClick={() => setDept(i)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <label className="fl" htmlFor="f-name">
        <span>{c.name}</span>
        <input id="f-name" name="name" autoComplete="name" />
      </label>
      <label className="fl" htmlFor="f-phone">
        <span>{c.phone}</span>
        <input id="f-phone" name="phone" inputMode="tel" autoComplete="tel" />
      </label>
      <label className="fl" htmlFor="f-day">
        <span>{c.day}</span>
        <input id="f-day" name="day" type="date" />
      </label>
      <label className="fl" htmlFor="f-lang">
        <span>{c.language}</span>
        <select id="f-lang" name="language">
          {c.languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
      </label>
      <label className="fl full" htmlFor="f-msg">
        <span>{c.message}</span>
        <textarea id="f-msg" name="message" rows={3} />
      </label>
      <p className="err full" id="f-err" hidden />
      <div className="full">
        <button className="btn btn-brand" type="submit">
          <span>{c.submit}</span>
          <span className="ar">→</span>
        </button>
      </div>
      <div className="ok full" id="f-ok" hidden />
    </form>
  );
}
