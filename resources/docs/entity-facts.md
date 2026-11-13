# Entity facts — canonical reference (GEO)

The single source of truth every surface must agree on: JSON-LD, `llms.txt`,
`llms-full.txt`, the `/md/` mirrors, meta descriptions and page copy. Facts
live in `lib/site-config.ts`; this doc records **which** facts are safe to
publish and **how** entities are identified, so crawlers and answer engines
see one consistent hospital, not fragments.

## Canonical entity

| Field | Value |
|---|---|
| Legal/display name | Gupta Hospital |
| Qualified name | Gupta Hospital, Bathinda |
| `alternateName` | Gupta Hospital Bathinda |
| Founded | 1980, by Dr. Amrit Gupta (orthopaedic clinic) |
| Address | Power House Road, Bathinda, Punjab 151001, IN |
| Phone (main/WhatsApp) | +91 98787 52241 — appointments, WhatsApp |
| Phone (eye dept) | +91 99886 32241 |
| Phone (OPD alternates) | +91 99887 52241, +91 84271 22241 |
| Email | guptahospitalbathinda@gmail.com |
| Hours | Open 24 hours, all days (per Google Business Profile) |
| Site | https://guptahospitalbathinda.com |
| Google Business Profile | https://maps.app.goo.gl/soMPeQvZgJAGNquK7 |
| `geo` pin | 30.2074949, 74.9501122 (resolved from the GBP link) |
| HFR ID (Ayushman Bharat PM-JAY) | IN0310002794 — empanelled since 2019 |
| NABH | Entry Level certified |
| Award | Tribune Health Care Award 2025 (24 Aug 2025) |
| Languages | English, Hindi, Punjabi |
| Patients come from | Punjab, Haryana, Rajasthan |
| `sameAs` | YouTube, Instagram, Facebook, GBP (exact URLs in site-config) |

## Stable `@id` scheme

Everything cross-links through these IDs — one `@graph` per page (see
`lib/seo.ts` `ldGraph`):

| `@id` | Entity | Emitted on |
|---|---|---|
| `{base}/#hospital` | Hospital | every page (root layout) |
| `{base}/#website` | WebSite | home |
| `{base}/#dr-mohit-gupta` | Physician — Orthopaedics | /doctors/, his profile |
| `{base}/#dr-parul-gupta` | Physician — Ophthalmology | /doctors/, her profile |
| `{base}/#dr-amit-gupta` | Physician — Psychiatry | /doctors/, his profile |
| `{base}/#osteoarthritis` | MedicalCondition (gathiya / ਗਠੀਯਾ) | knee-and-hip page |
| `{base}/#cataract` | MedicalCondition (motiya / ਮੋਤੀਆ) | eye-care page |
| `{route}#webpage` | MedicalWebPage | department/treatment pages |
| `{route}#breadcrumb` | BreadcrumbList | every inner page |

Reviewer attribution: MedicalWebPage `reviewedBy` names the department lead —
Dr. Mohit Gupta (orthopaedics), Dr. Parul Gupta (eye care), Dr. Amit Gupta
(mental health). `worksFor` always points at `#hospital`.

## Deliberately NOT in schema (until confirmed)

- ~~`geo` coordinates~~ — resolved: the pin from the GBP link (30.2074949,
  74.9501122) is now in the Hospital schema alongside `hasMap`.
- `aggregateRating` — hospital review schema is intentionally omitted.
- Dr. Parul's and Dr. Amit's degrees — shown as `[CONFIRM]` chips in the UI,
  never in `hasCredential`. Dr. Mohit's credentials are confirmed and included.
- Unverified social profiles — `sameAs` lists only confirmed URLs.

## Condition names (plain-language search terms)

- Osteoarthritis → "gathiya" (ਗਠੀਯਾ) — knee/hip replacement page.
- Cataract → "motiya" (ਮੋਤੀਆ / मोतियाबिंद) — eye-care page.

These appear as `alternateName` on the MedicalCondition nodes and in the
visible copy — the match between schema and page text is intentional (GEO).

## Bilingual consistency

- English routes are unprefixed; Punjabi is `/pa/...`; `x-default` → English.
- Metadata languages: `en-IN` / `pa-IN`; `og:locale` mirrors them.
- `inLanguage` on WebSite/MedicalWebPage follows the page locale.
- Doctor names have confirmed Punjabi spellings (see `lib/crumbs.ts`
  `SEG_DOCTOR`): ਡਾ. ਮੋਹਿਤ ਗੁਪਤਾ, ਡਾ. ਪਾਰੁਲ ਗੁਪਤਾ, ਡਾ. ਅਮਿਤ ਗੁਪਤਾ.
