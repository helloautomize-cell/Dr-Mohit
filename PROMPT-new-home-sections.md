# Home: add the new design sections for side-by-side review (local only)

Goal: on the existing Home page of the Gupta Hospital Next.js site (App Router, TypeScript, Tailwind v4, next-intl), add every section of the new Home design **except its hero**, so the client can scroll through the old and new sections together on localhost and choose. Nothing gets removed yet.

## Source of truth
- `prototype/new-home-preview.html`: the approved new design. Open it in a browser and scroll it. Ignore its header and hero.
- `screens/desktop-*.png` and `screens/mobile-*.png`: viewport screenshots in scroll order.
- `resources/reference/new-home-sections.html`: markup of every section after the hero. `data-pa` holds the Punjabi string. Images are written as `{{IMG:file}}`.
- `resources/reference/new-home.css`: styles. Its `:root` uses the approved palette (white, navy #0F2A55, brand #1D4E9E, leaf #1E9A4B, teal #0A8A80, mint #EAF6EF, sky #EEF3FB, light green accent #7FD3A0 on navy). Map these to the existing Tailwind theme tokens rather than adding duplicates. Some variable names (`--saffron`, `--ivory`) are left over from an earlier draft. Rename them to the project's token names.
- `resources/reference/new-home.js`: the motion. Port it into client components with `useGSAP` / `useEffect`. No global script.
- `resources/reference/new-home-icons.svg`: the icon set. Make each icon a small React component.
- `resources/images/new/`: high-quality images. If a file with the same name already exists in the project, keep one copy. Images marked "already in project" (logo, Dr. Amrit's founder photo, the IMG-04 VELYS surgery photo, the press clippings) are reused from the current site.

Before starting, confirm these files exist. If any is missing, STOP and tell me.

## Setup
- `npm i gsap@3.12.5 @gsap/react lenis@1.1.13` (skip any already installed). If the site already runs Lenis, reuse that instance and connect it to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and the GSAP ticker). Never run two smooth-scroll instances.
- Wrap all animation in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. With reduced motion everything shows, without animation.
- Content must be visible if JS fails: set hidden starting states only from JS (`gsap.from` / `fromTo`), never in CSS.

## Placement (review mode)
1. Add an env flag `NEXT_PUBLIC_HOME_V2_REVIEW=true` in `.env.local` only. When it is true, render the new sections **directly after the current hero**, then all current sections as they are now.
2. Before the first new section, and again before the first current section, show a slim full-width divider in development only: "New design sections start here" and "Current sections start here". Also give each new section a tiny corner tag "NEW" (development only) so the client can tell them apart.
3. Put the new sections in `components/home-v2/` as one component per section, so we can later keep some and delete the rest.
4. Do not change the current hero, header, footer or any other page. With the flag off, Home must look exactly as it does now.

## New sections to build, in order
1. **Who we are (statement)**: large sentence whose words go from 14% to full opacity as you scroll (word-split, scrubbed). Founder line with Dr. Amrit Gupta's small round photo.
2. **Three departments (stacking cards)**: three large sticky cards (bones in brand blue, eyes in leaf green, mind in teal) with text, doctor, treatment links (to the real department and sub-page routes), a white "See the department" button and a photo (`KH-1.jpg`, `doctor-parul-clinic-portrait.png`, `doctor-amit-armchair-portrait.png`). On desktop each card sticks 22px lower than the last, and the card underneath scales down slightly and dims as the next one arrives. Photo parallax inside the card. Below 860px: normal stacked cards that fade up.
3. **Four decades, one address (scroll bento)** on mint: 6-column bento. Tiles: navy "years of care" tile with the founder photo, VELYS tile with `robotic-plan-screen.jpg` and a solid navy caption panel (no gradient), PM-JAY (brand blue), Tribune Health Care Award 2025 (soft green), three-states map with animated arcs and a pulsing Bathinda dot, three departments, WhatsApp tile. On desktop the tiles start scattered (offset, rotated, scaled 0.86) and assemble into place as you scroll (scrub). Mobile: fade up.
   - **The years number must be calculated, not typed:** `new Date().getFullYear() - 1980` (46 in 2026). It counts up when it scrolls into view. Also fix the current "Our story" section, which still says 44: use the same calculation there.
4. **Robotic knee (horizontal scroll)** on navy: on 1024px and wider the section pins and slides sideways through: intro, the IMG-04 VELYS surgery photo, Mapping your knee, Balancing the ligaments, Following the plan, and a mint "Is robotic knee replacement right for you?" card. The line drawings draw themselves as each card arrives (`containerAnimation`). Thin progress bar at the bottom. Below 1024px: vertical stack, drawings draw on scroll.
5. **Under one roof (waterfall gallery)**: left side has the heading, text and the 8 facilities as an icon list. Right side has three columns of photos that flow endlessly, middle column in the opposite direction, faded at the top and bottom edges. They speed up with scroll velocity, then settle. Pause when off-screen. Mobile: two columns.
6. **From your first call to feeling better (cascade)** on sky: 4 steps with round icons (no numbers) that drop in one after another with a bounce, joined by a flowing dashed line on desktop.
7. **The doctors you will see (hover list)**: large name rows for Dr. Mohit, Dr. Parul, Dr. Amit and Dr. Amrit (founder). On desktop with a mouse, hovering a row shows that doctor's photo following the cursor (smoothed). On touch and below 860px each row shows a round thumbnail instead.
8. **Our story (timeline)** on soft blue: family photo `about-legacy-family-four.png` (sticky on desktop) and a vertical timeline (1980, 2000, 2019, 2024, 2025, Today) whose line fills as you scroll and whose dots light up.
9. **Out in the community (press)**: big outlined newspaper names in a strip whose direction follows your scroll direction, then a draggable, scroll-snapping row of 7 press clippings with captions.
10. **Families often ask (FAQ)** on sky: 4 questions, accordion with real buttons and `aria-expanded`.
11. **Come in. Let's talk. (closing)** on navy: huge two-line heading, round green "Book on WhatsApp" button (magnetic on desktop), address, appointment number, eye department number, email. A faint geometric pattern rotates slowly with scroll. Do not replace the existing footer; this section sits above it.

Also: navy-to-mint and other section joins use the three-layer animated waves already in the project.

## Rules
- Every string in `messages/en.json` and `messages/pa.json` under `homeV2.*`, taken from the reference (`data-pa` is the Punjabi).
- No gradient text, no arch shapes, no rising bubbles or particles, no 01/02/03 step numbers, no em or en dashes in copy, real logo only.
- `next/image` everywhere with sensible `sizes`. Lazy-load everything below the hero.
- No horizontal scroll at 390px. No console errors.

## Done when
- With the flag on, localhost Home shows: current hero, all 11 new sections, then all current sections. With the flag off, Home is unchanged.
- English and Punjabi both work. Reduced motion works.
- Commit as `feat(home): add v2 sections behind review flag`. STOP and send me desktop and mobile screenshots of each new section.
