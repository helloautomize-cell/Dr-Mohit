# Design development plan: Gupta Hospital, Bathinda

This plan follows the agency master prompt (Parts 3 to 9). The client has already approved a visual preview, which is `resources/reference/prototype.html`. **Section 0 overrides everything else**, including the master prompt's default section library.

## 0. Project overrides (read first, these win)

1. **The design source of truth is the approved preview.** Rebuild its pages, sections, order, copy, colours, illustrations, interactions and motion faithfully. Where the master's Oliva-style library (Part 3) describes a different section, follow the preview. Use the master's patterns only where the preview has no equivalent: the utility bar, cookie banner, breadcrumbs, legal pages, thank-you page, reviewer box, forms and analytics.
2. **Brand colour bands are approved.** The page base is white, but this client approved full-width coloured section bands with wave dividers between them: sky, mint, brand blue, navy and teal wash. This replaces the master rule "tints only for washes". Keep **at most one gradient surface per viewport** (the Book button and mobile action bar).
3. **Fonts (agency-approved exception to master 4.0, 2026-11-11).** Keep the approved preview fonts: **Geist** (300/400/500/600) for UI and text, **Geist Mono** for eyebrow labels, and **Noto Sans Gurmukhi** (300 to 600) for Punjabi. All via `next/font`, self-hosted; preload only Geist. No Instrument Serif. The accent is one highlighted phrase per heading in solid brand blue (`.em`) or leaf green (`.em-g`), as in the preview, and never a gradient.
4. **Languages.** English (`en-IN`, default, at `/`) and Punjabi (`pa-IN`, at `/pa/`), with an EN / ਪੰਜਾਬੀ switch in the header that keeps the user on the same page. `og:locale` is `en_IN` / `pa_IN`. Add hreflang.
5. **No numbered eyebrows and no 01 / 02 / 03 step numerals.** The client rejected numerals. Use plain eyebrow labels with the small green dot, and the illustrated duotone icons, as in the preview.
6. **Client bans:**
   - no gradient text
   - no arch-shaped windows or image masks
   - no floating badge cards over hero photos
   - no rising bubbles or particles
   - never redraw the logo; use `resources/images/brand/logo-original-4936x1776.png`
7. **Service badges.** The illustrated PNG badge system (master 3.4) is **not used** on this project. The preview's duotone SVG icons (`resources/images/icons/duotone-*.svg`) and animated treatment illustrations replace it.
8. **Hero.** Keep the preview's hero: a single photo of Dr. Mohit with the VELYS™ system and a caption row. Do not use the HeroFan.
9. **No blog yet.** Skip the Health Library sections and templates until the client asks for them.

## 1. Tokens (master token names, this client's values)

```css
:root{
  /* brand, sampled from the real logo */
  --brand-500:#1D4E9E;   /* primary blue, hover/strokes */
  --brand-700:#153C7C;   /* brand ink */
  --brand-100:#DCE7F7;   /* chips, tabs */
  --brand-50:#EEF3FB;    /* "sky" wash and bands */
  --leaf-500:#1E9A4B;    /* secondary green, eye care accent, dots */
  --leaf-100:#D3EEDC;
  --mint-50:#EAF6EF;     /* mint bands */
  --navy-900:#0F2A55;    /* navy bands (journey, stress, visit) */
  --teal-500:#0A8A80;    /* mental health accent */
  --teal-50:#E4F3F1;     /* mental health bands */
  --ink:#0D1520; --ink-600:#3D4652; --mute:#6A7380; --line:#E3E6EA;
  --emergency:#C62828;   /* emergency line only */
  --grad-brand:linear-gradient(90deg,#1D4E9E,#0A8A80); /* Book button + mobile bar only */
  --ease:cubic-bezier(.22,.8,.2,1);
  --radius-card:22px; --radius-lg:24px; --radius-pill:999px;
  --shadow-card:0 26px 50px -34px rgba(15,42,85,.45);
}
```

**Department accents:**

| Department | Accent | Wash |
|---|---|---|
| Orthopaedics | brand-500 | brand-50 |
| Eye care | leaf-500 | mint-50 |
| Mental health | teal-500 | teal-50 |

Put a contrast table in `/styleguide`. Every text colour must pass 4.5:1 on its band.

## 2. Type

Use the master type scale (Part 4.2):

| Style | Desktop | Mobile |
|---|---|---|
| Display | 64/68 | 34–38 |
| H1 | 52/58 | 34/40 |
| H2 | 40/48 | 28/34 |
| H3 | 22/30 | 20/28 |

Body text is at least 17px. The lede is 1.05–1.2rem, weight 300–400. Eyebrow labels are small, uppercase and letter-spaced, with a green dot. Gurmukhi gets about 1.06× size and line-height 1.7.

## 3. Layout and spacing

- Container max about 1272px, gutter at least 16px, 12-column grid.
- Section padding is about `clamp(72px,10vw,140px)`.
- Cards use 22–24px radius and soft navy shadows.
- Tap targets are 48px.
- No horizontal scroll at 360px.

## 4. Motion (from the preview, respecting reduced motion)

- **Wave dividers:** two SVG paths drifting horizontally on a loop.
- **Reveals:** fade and 26px rise on enter. They must not delay the LCP element.
- **Headings:** word-mask reveal.
- **Trail timelines:** the line fills on scroll, dots light up, and a dashed water-flow overlay runs along the line.
- **Journey path:** the path draws itself as you scroll.
- **Count-ups** in the facts bands.
- **Reach map:** flowing dashed lines and pulsing rings.
- **Reduced motion:** everything is visible and static.

## 5. Component inventory

**Global shell (master 3.1, adapted):**
- utility bar: hours `[CONFIRM]`, phone, red "Medical emergency? Call 108 or 112", A/A+ switch
- sticky header: real logo, nav with compact dropdowns for Orthopaedics (Robotic knee, Knee and hip replacement, Fractures, Sports injuries, Back pain clinic), EN/ਪੰਜਾਬੀ switch, BookButton
- full-screen mobile menu
- mobile action bar: Book / Call (sheet with numbers) / WhatsApp with a page-based message
- desktop floating WhatsApp button
- footer: 7 legal links and "Cookie settings"
- cookie banner, breadcrumbs, branded 404, thank-you page

**Content blocks (preview class names in brackets, see `prototype-styles.css`):**

| Component | Preview class |
|---|---|
| Facts band with count-ups | `.facts-band` |
| Service cards with duotone icon | `.svc` + `.sic` |
| Treatment cards with animated SVG | `.tgrid` / `.tcard` |
| Accordion and FAQ | `.acc`, `.faq-sec` |
| Trail timeline | `.tl.trail`, `.steps.trail` |
| Journey path | `.jflow` |
| Duo and triple cards | `.duo` |
| Fit check | `.fit` |
| Condition groups | `.cg` |
| Stress signs on navy | `.signs` |
| Values | `.vals` |
| Social cards | `.soc` |
| What to bring | `.bring` |
| Facilities band with photo trio | `.fac-band`, `.trio` |
| Legacy story with 44 count-up | `.legacy` |
| Reach map with travel tips | `.reach` |
| Founder | `.founder` |
| Doctor bands | `.dband` |
| Camps band | `.camps-band` |
| CTA callout | `.callout` |
| Visit band | `.band` |
| Image slot placeholder | `.aimg` |

**Interactive tools (port the logic from the preview's inline script):**

| Tool | Page | Notes |
|---|---|---|
| First-visit sticky stage (`.fv`) | Home | |
| Body-map doctor finder (`#finder`) | Home | Mouse, touch and keyboard |
| Knee explorer | Orthopaedics | |
| Healthy vs worn knee slider (`.cmp2`) | Orthopaedics | |
| Symptom checker (`#sym`) | Orthopaedics | |
| Joint tabs (`.jtabs`) | Orthopaedics | ARIA tabs |
| Balance demo (`.bal`, `drawBal()`) | Robotic knee | |
| Eye explorer (`.eyebox`) | Eye care | |
| Cataract slider (`.cmp`) | Eye care | |
| Breathing circle (`.breathe`) | Mental health | Pausable |
| Draggable press board and lightbox (`[data-board]`) | Home, Media | |
| Booking form (`#bform`) | Contact | Rebuilt per master 9.1 |

All tab, accordion and carousel text must be in the initial HTML.

## 6. Mobile rules (master 4.8, applied in the polish phase)

- Any section with more than 3 cards becomes an auto-advancing swipe carousel below 768px. Cards are about 84% wide, with pause/play and no motion under reduced motion.
- No non-hero section taller than 1.3× the viewport.
- Doctors are reachable early.
- No full-screen decorative photos.
- Target mobile Home height is about 9,000–10,000px at 390px wide. The preview is longer, so the polish phase must tighten it.

## 7. Images

- `scripts/process-images.mjs` (master 4.9) reads `resources/images/` and writes to `public/images/`.
- Files ending in `_UPSCALE` are low resolution. Use them as they are (never upscale in code) and log them in `public/images/_todo.md`.
- Slot map: `resources/docs/IMAGE-GUIDE.md` → `lib/image-slots.ts`. A slot without a file shows the dotted placeholder with its code.
- Doctor sets: `-hero` (4:5), `-portrait` (card) and `-avatar` (square).
- Patient faces: none without consent (slider photos with patients in beds are excluded).
