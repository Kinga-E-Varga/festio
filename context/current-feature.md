# Current Feature: Modular Section Design

## Status

Completed

## Goals

- **New section styles** for every modular section, built from shared parts: two-line and icon headings beside lists or cards, grids between hairlines, plain cards, and a **full card** style for most sections (`src/modular/FullCard.tsx`). New in: Date (Heading & date, Framed day, Icon & box), Countdown (Sentence, Days first, Clock), Location, Schedule, Transportation, Accommodation, Menu, Helpful notes, Dress code, Gifts, FAQ, Playlist, Reply form (Icon & soft band), Title (stickers) and Footer. Shared pieces sit beside each section's variants (`VenueRows`, `WaysList`, `StayList`, `CourseList`, `NoteTiles`, `FaqSplit`, `DateBox`, …).
- **Location: Use photos switch** (`photos`): off, no style draws a photo and the photo fields hide; a switch's `controls` may name a list item's path. Locations, ways, stays and courses gain an `icon` field.
- **A picked style fills its new fields** with the template's sample, else `DEFAULTS` (`setVariant`); a variant's fields show in the Content tab only where it draws them (`twinShows`). Every offered field has a sample; a new list item starts with an icon.
- **Two-column dates and joined countdowns:** a `split` variant hands the next section `afterSplit`, so a joined countdown sits in its second column.
- **Style names tidied** (Plain → Simple, Accent band → Accent, Record → Accent, Record on the page → Simple, Cards with icons → Wide cards, Heading & date → Heading & date box, Full card → Card for Playlist) and **listed A to Z** in the host's language in the Design tab; a section may show a hint under its styles (`stylesHint`).
- **Background patterns:** 16 new patterns for the page ground.
- **29 new icons**, grouped (ceremony and places, food and drink, moments, travel, stay, dress and gifts, notes); the picker shows two rows and a More link, each icon named in a tip on hover (`iconNames`).
- **Type and spacing:** `H3` 24px for card headings, `H2_SMALL` for Playlist's Card, section notes run the full width, no shadows on Menu's cards.
- **Dev tool:** `npm run look` (`scripts/look.mjs`, the `look` skill) measures or screenshots a section of the dev server.

## Notes

- Tests added: `tests/lib/set-variant.test.ts` (11; seen failing first), `tests/lib/twin-shows.test.ts` (2; seen failing first), `tests/lib/empty-item.test.ts` (1; seen failing first), `tests/lib/days-around.test.ts` (4), `tests/lib/toggle-off.test.ts` (2).
- Simplify: ran 2026-10-29
- Checked in the browser by the host, and with `npm run look` section by section as built.
- RO and HU wording of the new labels, style names and hint needs the host's check.
- Known side effect: a field the host cleared comes back when they leave for a style without it and return.
- Not part of this branch: `context/features/pending/` (`printing-export.md`, `new-sections.md`, `pattern-on-cards.md`, `time-capsule.md`, untracked), and the "Reply questions for every invitation" line already in `context/history.md` (uncommitted, from an earlier feature).
