// Yellow [CONFIRM] chip: visible in development, hidden in production builds
// (phase-03 item 2).
import { CONFIRMS } from '@/lib/confirms';

/** Gate: true in dev or when NEXT_PUBLIC_SHOW_CONFIRM=1 is set explicitly. */
export const SHOW_CONFIRM =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_CONFIRM === '1';

export function ConfirmChip({ id }: { id?: string }) {
  if (!SHOW_CONFIRM) return null;
  const item = id ? CONFIRMS.find((c) => c.id === id) : undefined;
  return (
    <span className="confirm-chip" title={item?.note ?? 'pending confirmation'}>
      [CONFIRM{item ? `: ${item.note}` : ''}]
    </span>
  );
}

/** Wraps unconfirmed values: shown (with chip) in dev, hidden in production. */
export function ConfirmValue({
  value,
  id,
  prefix,
}: {
  value: string;
  id?: string;
  prefix?: string;
}) {
  if (!SHOW_CONFIRM) return null;
  return (
    <span>
      {prefix}
      {value}
      {id ? <ConfirmChip id={id} /> : <ConfirmChip />}
    </span>
  );
}

/** Box variant for reviewer lines and legal placeholders. */
export function ConfirmNote({ id }: { id: string }) {
  if (!SHOW_CONFIRM) return null;
  const item = CONFIRMS.find((c) => c.id === id);
  return <span className="confirm-chip">[CONFIRM: {item?.note ?? id}]</span>;
}

/** Medical reviewer box (phase-03 item 5). */
export function ReviewerBox({ doctor }: { doctor: string }) {
  return (
    <p className="reviewer">
      Medically reviewed by {doctor} · Last reviewed November 2026
    </p>
  );
}
