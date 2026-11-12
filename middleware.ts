import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SITE_INDEXABLE } from './lib/site-config';

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intl(req) as NextResponse;
  // Until launch approval, hard noindex on every host/route (phase-02 item 9).
  if (!SITE_INDEXABLE) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  // Match all pathnames except files, api routes, Next internals, and the
  // extensionless file-metadata routes (opengraph-image, twitter-image) —
  // those must reach their route handler, not the locale catch-all.
  matcher: ['/((?!api|_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)'],
};
