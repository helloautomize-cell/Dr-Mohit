# Image slots

Every image position on the site has a **slot ID**. Build each image as a component that takes its slot ID, so swapping images later (Phase 11) means changing one mapping file, not page code.

Suggested mapping file: `lib/image-slots.ts`, exporting `{ [slotId]: { src, alt_en, alt_pa, ratio, focal? } }`. A slot with no file renders the dotted "image slot" placeholder showing its code.

Codes that start with **DM / DP / DA / DF** are the new doctor photos planned in the "photo plan and doctor image prompts" doc (Claude Doc shared by the agency) (DM = Dr. Mohit, DP = Dr. Parul, DA = Dr. Amit, DF = family). **IMG-xx** codes are the section images.

| Slot ID | Page · section | Ratio | Current file (kit `resources/images/`) | Planned replacement |
|---|---|---|---|---|
| home.hero | Home · hero | 4:5 | photos/dr-mohit-with-velys.jpg | DM-1 |
| home.story | Home · Our story (44 years) | 5:4 | photos/building-front_UPSCALE.jpg | IMG-01 (upscaled) |
| home.feature-ot | Home · robotic knee feature | 21:9 | photos/operation-theatre.jpg | keep |
| home.fac-1 / fac-2 / fac-3 | Home · Under one roof strip | 3:4 each | photos/reception, opd-corridor, day-care (_UPSCALE) | upscaled versions |
| home.first-visit | Home · Your first visit (doctor avatar in chat) | 1:1 | photos/dr-mohit-gupta-scrubs.png | DM-3 crop |
| home.doc-mohit / doc-parul / doc-amit | Home · doctor cards | 500:429 | dr-mohit-gupta-scrubs.png, dr-parul-gupta_UPSCALE.jpg, dr-amit-gupta_UPSCALE.jpg | DM-2, DP-1, DA-1 |
| home.doctors-banner | Home or About · family banner (new, optional) | 16:9 | none | DF-1 |
| ortho.hero | Orthopaedics · hero | 4:5 | dr-mohit-gupta-scrubs.png | DM-3 |
| ortho.sports | Orthopaedics · arthroscopy and sports tabs | 3:4 | none (IMG-03) | DM-6 or IMG-03 |
| ortho.recovery | Orthopaedics · road back to walking (new, optional) | 16:9 | photos/dr-mohit-in-theatre.jpg | DM-5 |
| robotic.hero | Robotic knee · hero | 4:5 | photos/dr-mohit-with-velys.jpg | DM-4 or keep real photo |
| robotic.velys | Robotic knee · What is used, VELYS card | 16:10 | photos/velys-surgery-theatre.jpg | keep |
| robotic.attune | Robotic knee · What is used, ATTUNE card | 16:10 | photos/attune-implant_UPSCALE.jpg | official high-res from J&J |
| eye.hero | Eye care · hero | 4:5 | dr-parul-gupta_UPSCALE.jpg | DP-2 |
| eye.cataract-day | Eye care · Cataract surgery day | 3:4 | photos/eye-examination_UPSCALE.jpg | DP-4 |
| eye.lens | Eye care · Choosing your lens banner | 3:1 | none (IMG-07) | IMG-07 or DP-3 |
| eye.slider | Eye care · cataract vision slider (same photo, one side blurred) | 16:9 | photos/operation-theatre.jpg | a different calm scene so it is not repeated, e.g. a Bathinda street or a family at home |
| mind.hero | Mental health · hero | 4:5 | dr-amit-gupta_UPSCALE.jpg | DA-2 |
| mind.faq | Mental health · FAQ side image | 4:3 | photos/psychiatry-clinic_UPSCALE.jpg | keep (upscaled), or DA-1 |
| mind.family | Mental health · family therapy (new, optional) | 3:2 | none | DA-3 |
| mind.deaddiction | Mental health · de-addiction (new, optional) | 4:5 | none | DA-4 |
| doctors.mohit / parul / amit | Doctors · profile bands | 4:5 | as the doctor cards | DM-2, DP-1, DA-1 |
| about.founder | About · founder (Dr. Amrit Gupta) | 4:5 | photos/dr-amrit-gupta_UPSCALE.jpg | upscaled original (real photo only) |
| about.camps | About · free camps | 4:3 | none (IMG-10) | real camp photo, or IMG-10 |
| about.legacy | About · legacy portrait (new, optional) | 4:5 | none | DF-2 |
| press.* | Home and Media · press board | as is | press/*.jpg | keep |

**Rule:** one photo per slot. Do not reuse the same photo in two sections, except the small doctor avatars and cards.
