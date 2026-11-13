import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SITE_INDEXABLE } from './lib/site-config';

const intl = createMiddleware(routing);

// Old WordPress URLs -> new routes (phase 9). True 301s via middleware because
// next.config redirects() emits 308. Sources: the live WP sitemap snapshot in
// resources/reference/old-site/_page-sitemap.xml + _pages.txt, plus the
// slug variants recorded in resources/docs/client-inputs-needed.md.
const KNEE_HIP = '/orthopaedics/knee-and-hip-replacement/';
const ROBOTIC = '/orthopaedics/robotic-knee-replacement/';
const MENTAL = '/mental-health/';

const OLD_URLS: Record<string, string> = {
  // Orthopaedics — knee/hip replacement
  '/total-knee-replacement': KNEE_HIP,
  '/partial-knee-replacement': KNEE_HIP,
  '/hip-joint-replacement': KNEE_HIP,
  '/knee-joint-replacement': KNEE_HIP,
  '/joint-replacement-services': KNEE_HIP,
  '/best-knee-replacement-in-punjab': KNEE_HIP,
  // Orthopaedics — robotic knee + trauma + sports
  '/robotic-knee-replacement-surgery': ROBOTIC,
  '/best-robotic-knee-replacement-in-the-punjab': ROBOTIC,
  '/myths-and-facts': ROBOTIC,
  '/orthopaedic-trauma-center': '/orthopaedics/fractures-and-trauma/',
  '/orthopaedic-and-trauma-center': '/orthopaedics/fractures-and-trauma/',
  '/orthopaedics-and-trauma-center': '/orthopaedics/fractures-and-trauma/',
  '/arthroscopic-surgery-and-sports-injury-services':
    '/orthopaedics/arthroscopy-and-sports-injuries/',
  // Eye care
  '/ophthalmology-services': '/eye-care/',
  '/ophthalmology': '/eye-care/',
  // Mental health
  '/psychiatric': MENTAL,
  '/psychiatry': MENTAL,
  '/about-psychiatry': MENTAL,
  '/psychiatry-common-mental-health-illnesses': MENTAL,
  '/psychiatry-faq': MENTAL,
  '/mental-health-myths-vs-reality': MENTAL,
  '/self-assessment-questionnaires': MENTAL,
  '/what-is-stress': MENTAL,
  // Content pages
  '/about-us': '/about/',
  '/home': '/',
  '/book-your-consultation-today': '/contact/',
  '/category/videos': '/media/',
  '/testimonial1': '/about/',
  '/testimonial-3': '/about/',
};

export default function middleware(req: NextRequest) {
  const oldDest =
    OLD_URLS[req.nextUrl.pathname.replace(/\/+$/, '').toLowerCase() || '/'];
  if (oldDest && oldDest !== req.nextUrl.pathname) {
    const url = req.nextUrl.clone();
    url.pathname = oldDest;
    url.search = '';
    return NextResponse.redirect(url, 301);
  }
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
