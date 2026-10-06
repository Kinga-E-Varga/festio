# Palette text shades

## Problem

Vivid palettes use bright colours that look great as fills but are too light
for small text. Sunbaked is the example: its jade `accent` and orange
`secondary` are used both as fills (buttons, the header, bands) and as small
text (eyebrows, icons, countdown numbers, menu labels). As text they fall under
4.5:1 on the cream surfaces, and so do the light inks on them.

Darkening them fixes the text but changes the palette's look, so today Sunbaked
keeps its fails on purpose (see `.claude/skills/palette/check.mjs --all`).

## Idea

Give palettes an optional darker **text shade** of the accent and the
secondary, e.g. `accent-text` and `secondary-text`.

- Fills keep the bright colour: buttons, the header, bands, discs.
- Small text in that colour uses the text shade instead.
- A palette that leaves them out falls back to `accent` / `secondary`, so
  existing palettes don't change.

## Open questions

- Which uses count as "text"? Eyebrows, the heading's italic line, countdown
  numbers, menu labels, links, icons — go through every section variant.
- The light ink on a bright fill (`accent-ink` on jade) is a separate problem:
  a darker ink on the fill, or a slightly deeper fill only behind text?
- Add the new roles to `ColorRole`, the palette skill's role table and the
  checker's text pairs.
