# Gupta Hospital, Bathinda: website build kit (Next.js)

This kit follows the agency master prompt: Next.js App Router, TypeScript strict, Tailwind v4 with CSS-variable tokens, Radix, Embla, next/font, next/image + sharp, Zod, next-intl, Server Actions + Resend, GA4 with Consent Mode v2, Vercel (bom1).

## What is inside

```
PROMPTS-ALL-PHASES.md        all phase prompts in one file
resources/
  reference/prototype.html   the client-approved preview (design source of truth)
  reference/screens/         screenshots of every preview page
  content/site-content.en-pa.json   all copy, English + Punjabi
  images/{brand,photos,press,icons} real logo, photos, press clippings, duotone icons
  docs/design-development-plan.md   tokens, type, motion, components, overrides (section 0 wins)
  docs/facts-and-compliance.md      verified facts, NMC rules, old URLs for redirects
  docs/IMAGE-GUIDE.md               image slot map -> lib/image-slots.ts
  docs/prototype-styles.css         the preview's CSS, for porting
  docs/client-inputs-needed.md      open questions for the hospital
  prompts/phase-01 ... phase-11     one prompt per phase
```

## How to use with Devin

1. Put this folder at the root of an empty repo and push. Keep `resources/` untouched; the app is created next to it.
2. Send `resources/prompts/phase-01-foundation.md`. Each phase works on its own branch, deploys a Vercel preview, reports, and STOPS.
3. Review the preview, then send the next phase. Phase 8 (design polish) needs your review notes pasted into it.
4. Phase 11 (image mapping) is for later, once the new doctor and section photos are ready in `resources/images/new/`.

## Phases

1. Foundation and /styleguide
2. Site shell (utility bar, header, mobile menu, action bar, footer, cookie banner, 404)
3. Content pipeline, [CONFIRM] chips, launch-check, all routes
4. Home
5. Departments and interactive tools
6. Doctors, About, Media, Contact, Plan your visit, legal pages, QA
7. Forms, Resend, analytics, lockdown
8. Design polish (review-driven, mobile rules)
9. SEO, GEO and AEO
10. Launch
11. LATER: image mapping

## Project exceptions to the master prompt

These are approved and recorded in section 0 of the design plan: the approved preview is the design source of truth; full-width brand colour bands with wave dividers; fonts are Geist, Geist Mono and Noto Sans Gurmukhi (no Instrument Serif); no numbered eyebrows or step numerals; the illustrated PNG badge system and HeroFan are not used; no blog yet.
