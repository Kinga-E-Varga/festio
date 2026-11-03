# Wolf Dance font letters

## Problem

Kapakana, the headings font of the simple template Wolf Dance
(`src/templates/simple/wolf-dance/index.tsx`, `secondary: fonts.kapakana`), is
missing letters Romanian and Hungarian need: ă ș ț ő ű and their capitals
(checked in the browser, upright and italic; â î are there). A Romanian or
Hungarian title shows those letters in a fallback font, so one word mixes two
faces.

Every other font in use passes the same check.

## Idea

Replace Kapakana with a script face of the same mood that has every Romanian
and Hungarian letter (`latin-ext` subset, checked in the browser for
ă â î ș ț ő ű, small and capital).

- Change only the font in `src/lib/fonts.ts` and the template's `fonts`;
  hosts' content is untouched.
- Drop Kapakana from `src/lib/fonts.ts` if nothing else uses it.

## Open questions

- Which script face? Show a few candidates on the Wolf Dance card first.
- The template sizes its title for Kapakana; a new face may need its sizes
  rechecked at every screen size (`npm run look`).
