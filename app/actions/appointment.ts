'use server';

// Appointment request pipeline (phase-07 item 2): validate → anti-spam →
// email the clinic via Resend → redirect to /thank-you/?type=appointment.
// No database; the email carries a field table, tel:/wa.me reply links, the
// source page, the exact consent text and IST timestamps.
//
// Env (see .env.example):
//   RESEND_API_KEY        — required to send; absent => status "unavailable"
//   APPOINTMENT_EMAIL_TO  — clinic inbox (default SITE.email)
//   APPOINTMENT_EMAIL_FROM— verified sender on the clinic domain
//   TURNSTILE_SECRET_KEY  — when set, verifies cf-turnstile-response

import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import {
  readForm, validate, isBot, normalizePhone, ageInYears, CONSENT_TEXT,
  type AppointmentErrors, type AppointmentInput,
} from '@/lib/appointment';
import { SITE } from '@/lib/site-config';
import enForm from '@/messages/en.json';

export type AppointmentState =
  | { status: 'idle' }
  | { status: 'error'; errors: AppointmentErrors }
  | { status: 'unavailable' };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ist = () =>
  new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const REASON_EN: Record<string, Record<string, string>> = {
  Orthopaedics: enForm.form.reasons.orthopaedics,
  'Robotic knee': enForm.form.reasons.robotic,
  'Eye care': enForm.form.reasons.eye,
  'Mental health': enForm.form.reasons.mind,
  'Not sure': enForm.form.reasons.notsure,
};

const DOCTOR_EN: Record<string, string> = enForm.form.doctors;
const TIME_EN: Record<string, string> = enForm.form.times;

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // widget not configured — honeypot+timer still apply
  if (!token) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
    const j = (await r.json()) as { success?: boolean };
    return j.success === true;
  } catch {
    return false;
  }
}

function emailHtml(input: AppointmentInput, phone: string, source: string): string {
  const dept = input.dept as string;
  const reason = REASON_EN[dept]?.[input.reason] ?? input.reason;
  const years = ageInYears(input.age, input.ageUnit);
  const ageTxt = years === null ? '—' : input.ageUnit === 'months' ? `${input.age} months` : `${input.age} years`;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#5B6B84;vertical-align:top">${esc(k)}</td>` +
    `<td style="padding:6px 0">${v}</td></tr>`;
  const wa = `https://wa.me/${phone.replace(/\D/g, '')}`;
  return `<h2 style="font-size:18px;margin:0 0 12px">New appointment request</h2>
<table style="border-collapse:collapse;font-size:14px">
${row('Department', esc(dept))}
${row('Patient name', esc(input.name))}
${row('Mobile', `<a href="tel:${phone}">${esc(phone)}</a> · <a href="${wa}">WhatsApp</a>`)}
${row('Age', esc(ageTxt) + (years !== null && years < 18 ? ` — under 18, guardian: ${esc(input.guardian)}` : ''))}
${row('Doctor', esc(DOCTOR_EN[input.doctor] ?? input.doctor))}
${row('Reason', esc(reason))}
${row('Preferred day', esc(input.day || '—'))}
${row('Preferred time', esc((input.time && TIME_EN[input.time]) || '—'))}
${row('Language', esc(input.language))}
${row('City', esc(input.city || '—'))}
${row('Message', input.message ? esc(input.message).replace(/\n/g, '<br>') : '—')}
${row('Source page', esc(source || '/contact/'))}
${row('Consent', `${esc(CONSENT_TEXT.en)}<br><span style="color:#5B6B84">tick recorded ${ist()} IST</span>`)}
${row('Submitted', `${ist()} IST`)}
</table>`;
}

export async function submitAppointment(
  _prev: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const input = readForm(formData);
  const locale = String(formData.get('locale') ?? 'en') === 'pa' ? 'pa' : 'en';
  const source = String(formData.get('source') ?? '').slice(0, 200);
  const done = `${locale === 'pa' ? '/pa' : ''}/thank-you/?type=appointment&ts=${Date.now()}`;

  // Bots get a quiet success — no signal that anything was discarded.
  if (isBot(input)) redirect(done);

  const errors = validate(input);
  if (Object.keys(errors).length) return { status: 'error', errors };

  const turnstileOk = await verifyTurnstile(String(formData.get('cf-turnstile-response') ?? ''));
  if (!turnstileOk) return { status: 'unavailable' };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: 'unavailable' };

  const phone = normalizePhone(input.phone)!;
  const to = process.env.APPOINTMENT_EMAIL_TO || SITE.email;
  const from = process.env.APPOINTMENT_EMAIL_FROM || `appointments@${new URL(`https://${'guptahospitalbathinda.com'}`).hostname}`;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Appointment request — ${input.name.trim()} (${input.dept})`,
      html: emailHtml(input, phone, source),
    });
    if (error) return { status: 'unavailable' };
  } catch {
    return { status: 'unavailable' };
  }
  redirect(done);
}
