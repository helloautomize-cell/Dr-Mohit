'use client';

// Appointment request form (master 9.1 / phase-07 item 1). Progressive-
// enhancement form: native inputs (dept radios, optgrouped reasons) post to
// the server action without JS; the hydrated layer filters reasons by
// department, manages inline errors with focus, reveals the guardian block,
// prefills ?doctor=&dept=&reason= (booking-context) and builds the WhatsApp
// prefill fallback.
//
// SSR structure: <BookingForm> renders <AppointmentForm> (defaults) as the
// Suspense fallback, so the complete no-JS form ships in the initial HTML.
// The suspended child re-renders the same form with ?dept/?reason/?doctor
// applied — React swaps fallback→child on hydration.
import { Suspense, useActionState, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  DEPTS, DOCTORS, TIME_SLOTS, LANGUAGES, REASON_KEYS, isSunday, ageInYears,
  resolveReasonParam, type Dept,
} from '@/lib/appointment';
import { submitAppointment, type AppointmentState } from '@/app/actions/appointment';
import { SITE } from '@/lib/site-config';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

const DEPT_MSG: Record<Dept, string> = {
  Orthopaedics: 'orthopaedics',
  'Robotic knee': 'robotic',
  'Eye care': 'eye',
  'Mental health': 'mind',
  'Not sure': 'notsure',
};

const ERR_FIELD: Record<string, string> = {
  dept: 'f-dept-0',
  name: 'f-name',
  phone: 'f-phone',
  age: 'f-age',
  doctor: 'f-doctor',
  reason: 'f-reason',
  day: 'f-day',
  time: 'f-time',
  language: 'f-lang',
  under18: 'f-u18',
  guardian: 'f-guardian',
  consent: 'f-consent',
};

type FormProps = {
  depts: string[];
  source: string;
  initDept?: Dept;
  initReason?: string;
  initDoctor?: string;
};

function AppointmentForm({ depts, source, initDept = 'Orthopaedics', initReason = '', initDoctor = '' }: FormProps) {
  const t = useTranslations('form');
  const locale = useLocale();
  const [state, action, pending] = useActionState<AppointmentState, FormData>(submitAppointment, { status: 'idle' });
  const [startedAt, setStartedAt] = useState('');
  const errRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [dept, setDept] = useState<Dept>(initDept);
  const [under18, setUnder18] = useState(false);
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<'years' | 'months'>('years');
  const [reason, setReason] = useState(initReason);
  const [day, setDay] = useState('');

  // Arm the bot timer on mount.
  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  const errors = state.status === 'error' ? state.errors : null;
  useEffect(() => {
    if (!errors) return;
    errRef.current?.focus();
    const first = Object.keys(errors)[0];
    const el = first ? document.getElementById(ERR_FIELD[first] ?? '') : null;
    el?.focus();
  }, [errors]);

  const years = ageInYears(age, ageUnit);
  const needsGuardian = (years !== null && years < 18) || under18;

  // An age under 18 implies the confirmation checkbox — auto-tick it so the
  // person isn't asked twice.
  useEffect(() => {
    if (years !== null && years < 18) setUnder18(true);
  }, [years]);

  // Turnstile only exists when both keys are configured (see .env.example).
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const id = 'cf-turnstile-script';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);
  const reasons = t.raw('reasons') as Record<string, Record<string, string>>;
  const deptReasons = reasons[DEPT_MSG[dept]] ?? {};
  const doctors = t.raw('doctors') as Record<string, string>;
  const times = t.raw('times') as Record<string, string>;
  const sunday = isSunday(day);

  // Built lazily on click — formRef is null during render.
  const buildWaHref = () => {
    const form = formRef.current;
    if (!form) return SITE.whatsapp;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? '');
    const lines = [
      `${t('department')}: ${depts[DEPTS.indexOf(dept)] ?? dept}`,
      `${t('patientName')}: ${s('name')}`,
      `${t('mobile')}: ${s('phone')}`,
      `${t('age')}: ${s('age')} ${t(s('ageUnit') === 'months' ? 'ageMonths' : 'ageYears')}`,
      `${t('doctor')}: ${doctors[s('doctor')] ?? '-'}`,
      `${t('reason')}: ${deptReasons[s('reason')] ?? (s('reason') || '-')}`,
      `${t('preferredDay')}: ${s('day') || '-'}`,
      `${t('timeOfDay')}: ${times[s('time')] ?? '-'}`,
      `${t('language')}: ${s('language')}`,
      s('city') ? `${t('city')}: ${s('city')}` : '',
      s('guardian') ? `${t('guardianName')}: ${s('guardian')}` : '',
      s('message') ? s('message') : '',
    ].filter(Boolean);
    return `${SITE.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };
  const openWa = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(buildWaHref(), '_blank', 'noopener');
  };

  const err = (k: string) => (errors && k in errors ? t(`errors.${k}`) : null);
  const aria = (k: string) => (errors && k in errors ? { 'aria-invalid': true } : {});
  const istDay = (off: number) =>
    new Date(Date.now() + 5.5 * 3600e3 + off * 86400e3).toISOString().slice(0, 10);

  return (
    <form className="c-7 form" id="bform" noValidate action={action} ref={formRef}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* honeypot: invisible to people, named to tempt autofill bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 0, height: 0, overflow: 'hidden' }}>
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="fl full" style={{ border: 0, margin: 0, padding: 0 }}>
        <legend className="sr-only">{t('department')}</legend>
        <span id="dchips-label">{t('department')}</span>
        <div className="chipset" id="dchips">
          {DEPTS.map((d, i) => (
            <label className="chip" key={d}>
              <input
                id={`f-dept-${i}`}
                type="radio"
                name="dept"
                value={d}
                checked={dept === d}
                onChange={() => {
                  setDept(d);
                  if (!(REASON_KEYS[d] as readonly string[]).includes(reason)) setReason('');
                }}
              />
              <span>{depts[i] ?? d}</span>
            </label>
          ))}
        </div>
        {err('dept') ? <span className="ferr">{err('dept')}</span> : null}
      </fieldset>

      <label className="fl" htmlFor="f-name">
        <span>{t('patientName')}</span>
        <input id="f-name" name="name" autoComplete="name" {...aria('name')} />
        {err('name') ? <span className="ferr">{err('name')}</span> : null}
      </label>
      <label className="fl" htmlFor="f-phone">
        <span>{t('mobile')}</span>
        <input id="f-phone" name="phone" inputMode="tel" autoComplete="tel" {...aria('phone')} />
        {err('phone') ? <span className="ferr">{err('phone')}</span> : null}
      </label>

      <div className="fl">
        <span id="f-age-lbl">{t('age')}</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            id="f-age"
            name="age"
            inputMode="numeric"
            autoComplete="off"
            aria-labelledby="f-age-lbl"
            style={{ minWidth: 0 }}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            {...aria('age')}
          />
          <select
            id="f-ageunit"
            name="ageUnit"
            value={ageUnit}
            onChange={(e) => setAgeUnit(e.target.value === 'months' ? 'months' : 'years')}
            aria-label={t('age')}
          >
            <option value="years">{t('ageYears')}</option>
            <option value="months">{t('ageMonths')}</option>
          </select>
        </div>
        {err('age') ? <span className="ferr">{err('age')}</span> : null}
      </div>
      <label className="fl" htmlFor="f-doctor">
        <span>{t('doctor')}</span>
        <select id="f-doctor" name="doctor" defaultValue={initDoctor} {...aria('doctor')}>
          <option value="" disabled />
          {DOCTORS.map((d) => (
            <option key={d} value={d}>
              {doctors[d]}
            </option>
          ))}
        </select>
        {err('doctor') ? <span className="ferr">{err('doctor')}</span> : null}
      </label>

      <label className="fl full" htmlFor="f-reason">
        <span>{t('reason')}</span>
        <select
          id="f-reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          {...aria('reason')}
        >
          <option value="" disabled />
          {DEPTS.map((d) => (
            <optgroup key={d} label={depts[DEPTS.indexOf(d)] ?? d} hidden={d !== dept}>
              {REASON_KEYS[d].map((rk) => (
                <option key={rk} value={rk}>
                  {reasons[DEPT_MSG[d]]?.[rk] ?? rk}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {err('reason') ? <span className="ferr">{err('reason')}</span> : null}
      </label>

      <label className="fl" htmlFor="f-day">
        <span>{t('preferredDay')}</span>
        <input
          id="f-day"
          name="day"
          type="date"
          min={istDay(0)}
          max={istDay(60)}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          {...aria('day')}
        />
        {sunday ? <span className="fnote">{t('sundayNote')}</span> : null}
        {err('day') ? <span className="ferr">{err('day')}</span> : null}
      </label>
      <label className="fl" htmlFor="f-time">
        <span>{t('timeOfDay')}</span>
        <select id="f-time" name="time" defaultValue="any" {...aria('time')}>
          {TIME_SLOTS.map((s) => (
            <option key={s} value={s}>
              {times[s]}
            </option>
          ))}
        </select>
        {err('time') ? <span className="ferr">{err('time')}</span> : null}
      </label>
      <label className="fl" htmlFor="f-lang">
        <span>{t('language')}</span>
        <select id="f-lang" name="language" defaultValue={LANGUAGES[0]} {...aria('language')}>
          {LANGUAGES.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        {err('language') ? <span className="ferr">{err('language')}</span> : null}
      </label>
      <label className="fl" htmlFor="f-city">
        <span>{t('city')}</span>
        <input id="f-city" name="city" autoComplete="address-level2" />
      </label>

      <label className="fl full" htmlFor="f-msg">
        <span>{t('messageLabel')}</span>
        <textarea id="f-msg" name="message" rows={3} />
        <span className="fnote">{t('noMedicalInfo')}</span>
      </label>

      <div className="fl full">
        <label className="fchk" htmlFor="f-u18">
          <input
            id="f-u18"
            name="under18"
            type="checkbox"
            checked={under18}
            onChange={(e) => setUnder18(e.target.checked)}
            {...aria('under18')}
          />
          <span>{t('under18')}</span>
        </label>
        {err('under18') ? <span className="ferr">{err('under18')}</span> : null}
      </div>

      {needsGuardian ? (
        <div className="fl full guard">
          <label className="fl" htmlFor="f-guardian">
            <span>{t('guardianName')}</span>
            <input id="f-guardian" name="guardian" autoComplete="off" {...aria('guardian')} />
            {err('guardian') ? <span className="ferr">{err('guardian')}</span> : null}
          </label>
          <span className="fnote">{t('guardianNote')}</span>
        </div>
      ) : null}

      <div className="fl full">
        <label className="fchk" htmlFor="f-consent">
          <input id="f-consent" name="consent" type="checkbox" {...aria('consent')} />
          <span>{t('consent')}</span>
        </label>
        {err('consent') ? <span className="ferr">{err('consent')}</span> : null}
      </div>

      {TURNSTILE_SITE_KEY ? (
        <div className="fl full">
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        </div>
      ) : null}

      {errors ? (
        <p className="err full" id="f-err" role="alert" tabIndex={-1} ref={errRef}>
          {t('errors.summary')}
        </p>
      ) : (
        <p className="err full" id="f-err" hidden />
      )}

      {state.status === 'unavailable' ? (
        <div className="ok full" role="alert">
          <p style={{ margin: '0 0 12px' }}>{t('unavailable')}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="btn btn-brand" href={SITE.phoneMainHref}>
              {t('callCta', { phone: SITE.phoneMain })}
            </a>
            <a className="btn btn-line" href={SITE.whatsapp} target="_blank" rel="noopener" onClick={openWa}>
              {t('whatsappCta')}
            </a>
          </div>
        </div>
      ) : null}

      <div className="full" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-brand" type="submit" disabled={pending}>
          <span>{pending ? t('sending') : t('submit')}</span>
          <span className="ar">→</span>
        </button>
        <a className="lnk" href={SITE.whatsapp} target="_blank" rel="noopener" onClick={openWa}>
          <span>{t('whatsappPrep')}</span>
          <span className="ar">↗</span>
        </a>
      </div>
    </form>
  );
}

// Resolves ?dept=/?reason=/?doctor= to initial form state. Lives behind
// Suspense because useSearchParams bails to client render for static pages.
function AppointmentFormWithParams(props: Omit<FormProps, 'initDept' | 'initReason' | 'initDoctor'>) {
  const sp = useSearchParams();
  const rr = resolveReasonParam(sp.get('reason') ?? '');
  const deptParam = sp.get('dept');
  const initDept: Dept = rr?.dept
    ?? ((DEPTS as readonly string[]).includes(deptParam ?? '') ? (deptParam as Dept) : 'Orthopaedics');
  const initReason = rr?.key ?? '';
  const docParam = sp.get('doctor');
  const initDoctor = (DOCTORS as readonly string[]).includes(docParam ?? '') ? (docParam ?? '') : '';
  return <AppointmentForm {...props} initDept={initDept} initReason={initReason} initDoctor={initDoctor} />;
}

// Public export: Suspense fallback is the fully-rendered default form (the
// no-JS HTML), the suspended child swaps in the prefilled version.
export function BookingForm(props: Omit<FormProps, 'initDept' | 'initReason' | 'initDoctor'>) {
  return (
    <Suspense fallback={<AppointmentForm {...props} />}>
      <AppointmentFormWithParams {...props} />
    </Suspense>
  );
}
