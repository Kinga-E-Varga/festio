# Current Feature: Modular invitation modifications

## Status

Completed

## Goals

- **Full cards read as cards.** A full card style's section paints no ground of its own;
  only the card inside is filled, as the accent ones already were.
- **The pattern lives in the background, not in the sections.** Every ordinary section
  paints its ground solid, so the pattern is seen only where a section leaves the
  background bare: around a full card, behind a sticker, behind the calendar and around
  a cover's drawing.
- **One fill for every full card, whatever its turn.** No alternation: the plain surface
  once a pattern is on (the card is the quiet block the pattern stops at), the second
  surface without one (its colour alone tells it from the page). The accent full cards
  keep the accent.
- **A joined section follows the section before it, bareness included.**
- **The header's bar is a bar, not a lid.** No bottom line, and a cover may run up to the
  page's very top under it, with its own content clear of the bar.

## Notes

- Simplify: ran 2026-11-23

### Grounds and the pattern

- `VariantDefinition.bare` (`src/types/modular.ts`) — the page paints no ground behind
  the variant; it draws whatever it needs itself. On all 29 full card styles (15 plain,
  14 accent), the 8 sticker styles and Date & time's Calendar.
- `bareGrounds` + `bareOf` (`src/modular/ground.ts`) — where the page paints nothing, in
  page order: a `bare` variant, an `own` one with no band (every cover but Champagne),
  and a `joined` one after either, which chains. `sectionGrounds` is unchanged.
- `ModularInvitation.tsx` — paints every section's ground except a bare one (so a
  surface section now covers the pattern too), and sets `--m-card`.
- `CARD_FILL` (`src/modular/styles.ts`) = `--m-card`, the full cards' shared fill: the
  plain surface with a pattern on, the second surface without one. Used by
  `FullCardFrame`, the Playlist's Card, the Text box's Full card (`CardText` gained
  `full`, replacing the `card={ground}` it was passed) and the Calendar's pages.
- Date & time's Calendar (`3`) — bare; its pages on `CARD_FILL`; each faded neighbour
  day wrapped in an opaque surface so the pattern can't show through the fade.
  `NEIGHBOUR` split into `at` (breakpoint) and `fade` (opacity).
- Removed: the Calendar's `in-data-pattern:hidden!` on the neighbour days, and the
  `data-pattern` attribute with it (its only consumer).
- Renamed: Date & time `9` Colourful sticker → **Sticker colourful**, matching the
  Title's (`Autocolant colorat` / `Matrica színes`). Ids untouched.

### The header's bar and the covers under it

- `HeaderBar.tsx` — the bar's bottom border removed. The hero's height in
  `ModularInvitation.tsx` and `BarSkeleton` dropped the 1px they allowed for it.
- `VariantDefinition.underHeader` — a cover drawn up to the page's top, under the
  frosted bar. On Champagne (`3`), Birthday cake (`4`) and Ticket (`8`).
- `UNDER_HEADER` (`src/modular/styles.ts`) = `-mt-14 @5xl:-mt-16`, the bar's own height,
  on such a cover's section. Nothing else in the page moved: the hero is still the
  screen less the header, so an `underHeader` cover still reaches the screen's foot.
- The three covers keep their content clear of the bar, each in its own way:
  - **Ticket** — `MAIN_STAGE`, the host's ticket's own stage, inset by the bar's height
    and a size container of its own, so the ticket stands and sizes as it would with no
    bar while the pile still spans the whole cover and runs on behind it.
  - **Birthday cake** — the cover's inner box starts the bar's height down, so the
    bunting hangs clear of it and the band, cake and ribbon stand as before.
  - **Champagne** — the glass-and-words column starts the bar's height down, while its
    accent band and the stars carry on behind the bar.
- `EditButtons` gained `underHeader`: on such a cover its Design and Content buttons
  start the bar's height further down, clear of it.

### Ticket cover

Two removals on the drawing itself, both asked for: the coins (`COIN`, `METAL`,
`COIN_VALUE`, `CoinSpot`, `COINS`, `WIDE_COINS`, the `Coin` component and its render)
and `MARGIN_PILE`, the two extra tickets on a cover more than twice as wide as tall. The
pile is now four at most. The geometry is otherwise the original's.

### Still to do

- `bareGrounds` has no test. `tests/lib/surface-ground.test.ts` and
  `joined-ground.test.ts` cover `sectionGrounds`, which is unchanged.
- The editor's Design/Content buttons on an `underHeader` cover are not confirmed in the
  browser — they render transparent until hover, so `npm run look` can't measure them.
- `npm test`, `npm run build` and `npm run test:app` not yet run (the change touches
  `src/modular/`, `src/components/` and `src/types/`).
