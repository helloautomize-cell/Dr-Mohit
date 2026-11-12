// Catch-all under [locale]: unknown inner paths route to the branded,
// shell-wrapped not-found.tsx instead of the bare root fallback.
import { notFound } from 'next/navigation';

export default function CatchAll() {
  notFound();
}
