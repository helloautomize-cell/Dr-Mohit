# Google Business Profile — client handoff (Phase 9)

The website cannot create or manage the Google Business Profile — it needs the
owner's Google account. This file is the checklist to send the client so the
listing and the website reinforce each other (local pack rankings depend on
the two agreeing exactly).

## 1. Claim / confirm access

- Sign in at https://business.google.com with the account that owns the
  "Gupta Hospital" listing on Power House Road.
- Confirm the listing URL and share it with us — it goes into the site schema
  (`sameAs`) and `lib/site-config.ts` (`googleBusiness`).

## 2. NAP — must match the website character-for-character

| Field | Use exactly this |
|---|---|
| Name | Gupta Hospital |
| Address | Power House Road, Bathinda, Punjab 151001 |
| Phone | +91 98787 52241 (primary), +91 99886 32241 (eye dept secondary) |
| Website | https://guptahospitalbathinda.com/ |
| Hours | Open 24 hours (already confirmed) |

## 3. Categories & attributes

- Primary category: **Hospital**
- Secondary: **Orthopedic clinic**, **Eye care center**, **Mental health clinic**
- Enable attributes that apply: wheelchair-accessible entrance/toilet,
  accepts new patients.

## 4. Services (mirror the site structure)

Add each as a GBP "Service" with the same names used on the website:

- Robotic-assisted knee replacement
- Knee and hip replacement
- Fracture and trauma care
- Arthroscopy and sports injuries
- Back pain clinic
- Cataract surgery (phacoemulsification)
- Psychiatry and de-addiction treatment
- Physiotherapy and rehabilitation

## 5. Photos (depends on client photo consent — client-inputs #10)

- Exterior with the signboard, reception, each doctor portrait, OT/equipment.
- Minimum 10 photos; refresh quarterly. Naming files with real words helps.

## 6. Reviews

- Ask settled patients to leave reviews on the GBP (WhatsApp the review link
  after discharge is the usual flow). Reply to every review, politely, without
  discussing treatment details (patient privacy).
- Do NOT add review/rating schema to the site until there is a real,
  verifiable review profile — we omitted `aggregateRating` deliberately.

## 7. Q&A and posts

- Seed the Q&A with the site's real FAQs (appointment by WhatsApp, PM-JAY
  empanelment, 24-hour availability, languages spoken).
- Optional: weekly "Post" when a health camp or press mention happens —
  reuse `resources/content` press clippings.

## 8. Other listings worth claiming (same NAP everywhere)

- Justdial, Practo (each doctor), Lybrate, Bajaj Finserv Health, PM-JAY
  hospital directory — same name/address/phone as section 2.
