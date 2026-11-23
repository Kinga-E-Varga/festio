# Drawing fills

## Status

Completed

## Goals

- The host-picked drawings (`art/drawings/`) each gained a filled silhouette path in
  Inkscape. Label them for the build (`lines` and `fill`) and rebuild all eight, so
  `public/modular/drawings/` has `<name>.svg` and `<name>-fill.svg`.
- `DRAWING` (`src/modular/drawing.ts`) paints the fill under the lines, like `FLOWERS`
  in `cover/5.tsx` does for Wildflower: both layers on one box, same margin reach.
- The fill's colour: the surface on a light palette; on a dark one `CARD_STAGE`'s
  `--card-drawing`, the palette's ink and muted ink half and half (its paper, a shade
  darker), since a dark palette has no lighter surface above its paper.
- Each drawing's file (`src/modular/drawings/<name>.ts`) carries the fill's url as well
  as the lines'; `svg.py` prints both lines so there is still nothing to register.
- The covers that show a drawing (Stamp and Playbill; the Ticket has none) and the
  Content tab's drawing picker look right at every size, on a light and a dark palette.

## Notes

- Sources were edited by the user before this branch: 1 path → 2 (lines + fill), frames
  unchanged. Back them up before touching their labels.
- Build: `python3 -I .claude/skills/cover/svg.py build all` from the repo root.
- The picker's buttons sit in the dashboard, where no modular palette is set, so the
  fill colour has to come from the caller, not from `DRAWING` itself.
- Simplify: ran 2026-11-23
