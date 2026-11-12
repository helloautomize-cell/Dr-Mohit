import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware Link/usePathname/useRouter. hrefs passed in are unprefixed;
// next-intl adds /pa automatically when the current locale is Punjabi.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
