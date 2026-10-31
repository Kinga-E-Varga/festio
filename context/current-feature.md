# Current Feature: Birthday cake cover

## Status

Completed

## Goals

- A new drawn poster cover, **Birthday cake** (cover variant `4`; ro Tort aniversar, hu Születésnapi torta), after a Freepik birthday card: no photo.
- The cover sits on the page's surface, so the chosen pattern shows through it; the floor at the bottom is the accent, edge to edge.
- Bunting across the top, edge to edge: two nearly straight strings forming a flat X that crosses at about 45% across, the right string behind; each string starts at its own height and sags its own amount. Flags in accent, tertiary, secondary and accent-soft; where a front flag lies over a back one it takes the other tone (light over dark, dark over light). No outlines.
- The Title's lines (names, or the two plain lines, and the second line) on a plain full-width band in the secondary colour. No eyebrow on this cover.
- A three-tier cake with drippy icing, sprinkles and three striped candles, a surface-coloured sticker outline, standing on the floor with a darker oval shadow under it.
- The date and the cover's details line on a tertiary ribbon with a V-cut end, hanging from under the band at the cake's right; as long as its words, never reaching the floor at any size.
- Every colour from the palette; works on every palette.

## Notes

- Poster fields: `names`, `namesStart`, `namesMiddle`, `namesEnd`, `firstLine`, `nextLine`, `secondLine` (no `eyebrow`); `shows: ["details"]`; `wide: true`, no `band` (the page's surface).
- Files: `src/modular/sections/cover/4.tsx` (layout), `Cake.tsx` (the drawing), `Bunting.tsx` (the strings, laid out for the cover's width).
- Phone: cake left of centre, ribbon at the right. From `@3xl`: cake centred, ribbon beside it.
- No motion in the first version.
- Simplify: ran 2026-11-01
