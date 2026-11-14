# Home: new hero, Treatments, Inside the hospital, Visit us, and the final section order

Goal: on the Home page of the Gupta Hospital Next.js site (App Router, TypeScript, Tailwind v4, next-intl), replace the current hero with the new premium hero, add three new sections (Treatments, Inside the hospital, Visit us), and put all Home sections into the order below. Remove the sections marked "remove". Work on a branch `home-hero-order`, deploy a Vercel preview, and do not merge until I approve.

## Source of truth
- `prototype/hero-sections-preview.html`: the approved design. Open it in a browser and scroll it. Ignore its top note bar and its header (the site header stays as it is).
- `screens/desktop-*.png` and `screens/mobile-*.png`: viewport screenshots in scroll order (1440 and 390 wide).
- `resources/reference/hero-sections.html`: markup of the four new sections. `data-pa` holds the Punjabi string. Images are written as `{{IMG:file}}`.
- `resources/reference/hero-sections.css`: styles. Map the `:root` colours to the existing Tailwind theme tokens (white, navy #0F2A55, brand #1D4E9E, leaf #1E9A4B, teal #0A8A80, mint #EAF6EF, sky #EEF3FB, soft #DCE7F7, light green #7FD3A0 on navy). Do not add duplicate tokens.
- `resources/reference/hero-sections.js`: the motion. Port it into client components with `useGSAP` / `useEffect`. No global script. The prototype's language toggle and its Lenis setup are for the preview only: use next-intl and the site's existing Lenis instance.
- `resources/reference/hero-sections-icons.svg`: the icon set. Reuse the icon components already made for the v2 sections; add any that are missing.
- `resources/images/new/`: high-quality images. If a file with the same name already exists in the project, keep one copy. Run them through the existing image pipeline (never upscale, strip EXIF, AVIF/WebP).
- `resources/images/placeholder/`: four photos from the current site, used only in Inside the hospital until the hospital sends new ones. If the same photos already exist in `public/images`, use those and skip these.

Before starting, confirm these files exist. If any is missing, STOP and tell me.

## Rules (same as before)
- gsap@3.12.5, @gsap/react and lenis@1.1.13 are already installed by the v2 work. Reuse the one Lenis instance and keep it connected to ScrollTrigger. Never run two smooth-scroll instances.
- Wrap all scroll animation in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. With reduced motion everything shows, without animation, and the hero panels do not auto-cycle.
- Hidden starting states only from JS. Use `gsap.fromTo` with explicit end values for anything inside a timeline that has `invalidateOnRefresh` (a plain `.from` there leaves tiles stuck at opacity 0 after a refresh; this bug was found and fixed in the prototype).
- Every string in `messages/en.json` and `messages/pa.json` under `home.*`, taken from the reference (`data-pa` is the Punjabi).
- The years number is always `new Date().getFullYear() - 1980` (46 in 2026). Never type it.
- No gradient text, no arch shapes, no floating badge cards on hero photos, no rising bubbles or particles, no 01/02/03 numbers, no em or en dashes in copy, real logo only.
- `next/image` everywhere with sensible `sizes`. Only the first hero photo is `priority`; everything else lazy-loads.
- No horizontal scroll at 390px. No console errors. EN and PA both work.

## New sections

### A. Hero (replaces the current hero)
Two columns on desktop. Left: eyebrow "Gupta Hospital, Bathinda · Since 1980", the three-line heading "Care for bones, / eyes and the mind. / From one family." (last line in brand blue), lede, "Book a visit" and WhatsApp buttons, and three facts (computed years, PM-JAY, 2025 Tribune Health Care Award).
Right: three tall photo panels in a row (Dr. Mohit `DM-2-mohit-desk-portrait.jpg`, Dr. Parul `DP-1-parul-portrait.png`, Dr. Amit `DA-1-amit-portrait.png`). The open panel is wide and shows a caption bar (department, name, role, round arrow link to that department page). The closed panels are narrow and show their name as vertical text.
- Panels auto-advance every 6 seconds with a thin progress bar, pause on hover, open on hover (mouse only), click or tap, and Left/Right arrow keys. Use `role="tablist"` / `role="tab"` / `aria-selected` as in the reference.
- Intro: heading words rise in one after another; the panels rise in like a curtain (clip-path), one after another. Photos drift slightly on scroll.
- The years fact counts up once when visible.
- Below 1024px: copy first, then the panels stacked as in `screens/mobile-*`.

### B. Treatments, "Six ways we help." (navy)
Six large horizontal cards, each with an icon (no numbers), a heading with a light green second half, one line of text, chips and a photo:
1. Joint replacement and robotic knee, `DM-4-mohit-velys.jpg`
2. Fractures and trauma, `FR-1.jpg`
3. Sports injuries and arthroscopy, `SP-1.jpg`
4. Back and neck pain, `BP-1.jpg`
5. Eye care, `eye-cataract-day-surgery.png`
6. Mental health and de-addiction, `mind-hero-counselling.png`
Every chip links to the real route (orthopaedics sub-pages, eye care, mental health). The prototype uses `#treatments` only as a stand-in.
- 1024px and wider: the section pins and the row slides sideways as you scroll. Each card turns, scales and fades into place as it arrives (`containerAnimation`), its photo has parallax, its chips rise in, and a thin progress bar fills at the bottom.
- Below 1024px: a vertical stack of cards that rise in.

### C. Inside the hospital, "A real hospital, as it is."
A 3-column grid (1fr 1.5fr 1fr, two rows): the operation theatre photo `operation-theatre.png` in the centre spanning both rows, and four side tiles (building, reception, OPD corridor, day care) from `resources/images/placeholder/`.
- 1024px and wider: the section pins. It starts with the theatre photo filling the whole screen; as you scroll it shrinks into its centre slot with rounded corners, while the side tiles slide in from left and right and the heading fades up.
- Below 1024px: a normal grid whose tiles rise in.
- Keep the small "Placeholder photos" note under the grid for now. The hospital will send new photos; I will hand them over later.

### D. Visit us, "Power House Road, Bathinda." (navy)
Left: heading, summary "The hospital is open day and night, all seven days. Emergency, admissions and the pharmacy never close. Book ahead to see a specific doctor.", a green "Open now · 24 hours" status pill with a soft pulse, "Book on WhatsApp" and "Get directions" buttons, address and appointment number.
Right: a weekly bar chart, Monday to Sunday. **The hospital is open 24 hours**, so every day is one full leaf-green bar across a 12 am to 12 am axis, labelled "Open 24 hours". Today's row is highlighted and shows a thin white "now" line at the current time. Legend: "Emergency, admissions and pharmacy" and "Right now". Bars sweep in day by day when the section scrolls into view.
Keep the data in one small config (days and open ranges) so OPD hours can be added later as a second colour without rewriting the component.
This replaces the current navy "Power House Road, Bathinda" contact band above the footer.

## Final Home order
Build the page in this order. "Keep" means the section stays as it is now apart from the fix noted.

1. **Hero** (new, A).
2. **Who we are** statement: keep.
3. **Treatments, "Six ways we help."** (new, B).
4. **Find the right doctor, "Where is the trouble?"** body map: keep (must stay). It turns the treatments into "which doctor should I see".
5. **A plan made for your own knee** robotic horizontal scroll: keep.
6. **Four decades, one address** bento: keep. Fix: the years tile must use the calculation (it still shows 44 on the live site).
7. **Inside the hospital** (new, C).
8. **Every treatment starts with listening** (Listen / Examine / Plan): keep.
9. **Under one roof, "Everything your treatment needs, in one building"** waterfall gallery with the facility list: keep as it is (must stay).
10. **Four decades on Power House Road** story timeline: keep. Check its years text uses the calculation too.
11. **Out in the community** press: keep.
12. **Families often ask** FAQ: keep.
13. **Visit us** (new, D).
14. Footer: keep.

Remove from Home (delete the usage on Home; keep the component files until I confirm):
- The current hero.
- **Three departments. Each led by a Gupta.** stacking cards: the new hero already shows the three doctors and Treatments covers their work. If you keep the component, also fix the cards turning almost black while they stack.
- **Popular treatments** (three illustration cards): replaced by Treatments.
- **From your first call to feeling better** four steps: it repeats "Every treatment starts with listening". Put its WhatsApp line into the listening section's button instead.
- The navy **Power House Road, Bathinda** contact band: replaced by Visit us.

Do NOT remove the Under one roof waterfall gallery or the Find the right doctor body map.

Spacing: the live page has large empty gaps between sections (after the Under one roof gallery, before Our story, before the press section and before the FAQ). Use one consistent section padding (`clamp(88px, 11vw, 160px)` top and bottom) and remove the extra blank space. Keep the three-layer animated waves only where a section changes background colour.

Three pinned sections (Treatments, robotic knee, Inside) must not sit next to each other; the order above keeps a normal section between each pair. Inside the hospital and Under one roof both show the building, so keep at least one section between them, as above. After any language switch, call `ScrollTrigger.refresh()`.

## Done when
- The preview shows the 14 parts above in order, the removed sections are gone from Home, and no other page changed.
- English and Punjabi both work. Reduced motion works. No horizontal scroll at 390px, no console errors.
- Commit as `feat(home): new hero, treatments, inside, visit and section order`. STOP and send me the preview link plus desktop and mobile screenshots of the hero and each new section.
