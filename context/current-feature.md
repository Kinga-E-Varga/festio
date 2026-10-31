# Current Feature: Accent modular variants

## Status

Completed

## Goals

- **Grounds:** a `joined` section after a cover takes the cover's background (Champagne's accent band, or the surface behind a photo); the next section stays apart. New ground rule `surface`: always on the page's surface, the next takes the other.
- **New accent styles** (ro Carduri accent / Accent / Card întreg accent, hu Kiemelt kártyák / Kiemelt / Kiemelt teljes kártya):
  - Cards accent (the cards on the accent): Countdown `10`, Schedule `9`, Transportation `9`, Accommodation `8`, Special people `8`, Contact `8`, Helpful notes `10`, Menu `9`.
  - Accent (on the accent band): Location `9`, Schedule `10`, Transportation `11`, Accommodation `9`, Special people `9`, Contact `9`, Helpful notes `11`, Menu `11`, Story `8`, Dress code and Gifts `6`, FAQ `8`.
  - Full card accent (the card on the accent, no lines, ground `surface`): Location `10`, Schedule `11`, Transportation `10`, Accommodation `10`, Special people `10`, Contact `10`, Helpful notes `12`, Menu `10`, Story `7`, Dress code and Gifts `5`, FAQ `7`.
  - On the accent, icons and the gift buttons on the palette's secondary (`AccentIcon`, `ACCENT_BUTTON`); unlined grids pulled out by their cells' padding (`UNLINED_PULL`).
- **Icons:** no longer take turns outside Schedule and Story: every item's icon on the secondary disc (`ItemIcon`).
- **Widths:** everything that took the full card's width now takes `COLUMN` (`FULL_CARD_WIDTH` removed); timelines 64px under their heading.
- **Renames:** Full card & grid / & list / alternate → Full card; Location's Accent cards → Cards accent; Our story → Story.
- **Story:** Moments get an optional icon (`moments.icon`); a Use a photo switch (`photos`); the photo/no-photo pairs merged (`2`, `5` retired); without the photo, the heading beside the story.
- **Header:** a Use monograms switch (`monogram`); off, a plain text (`markText`) in the header and the footer, coloured per style.
- **Layouts:** Location and Transportation full cards side by side without photos.
- **Playlist:** Card accent (`4`) on ground `surface`, as the Full card accents.
- **Fixes:** Timeline's line half a pixel off under a date; Location Icon's second venue 40px low; Dress code's role swatches on the accent.

## Notes

- Tests: `tests/lib/joined-ground.test.ts`, `tests/lib/surface-ground.test.ts`.
- Simplify: ran 2026-10-31
- No change to stored ids; new optional fields only (`moments.icon`, Story's `photos`, the header's `monogram` and `markText`); Story's `2` and `5` retired.
