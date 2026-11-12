// Booking context: builds the /contact/ deep link that pre-selects a department
// and carries the reason through to the booking form (Phase 7 wires the form to
// read these params). Kept in one place so every "Book with ..." CTA builds the
// same URL.
export type BookingContext = {
  doctor?: 'mohit' | 'parul' | 'amit';
  dept?: string;
  reason?: string;
};

export function bookingHref(ctx: BookingContext = {}): string {
  const q = new URLSearchParams();
  if (ctx.doctor) q.set('doctor', ctx.doctor);
  if (ctx.dept) q.set('dept', ctx.dept);
  if (ctx.reason) q.set('reason', ctx.reason);
  const s = q.toString();
  return `/contact/${s ? `?${s}` : ''}`;
}
