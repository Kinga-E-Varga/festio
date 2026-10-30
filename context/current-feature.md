# Current Feature: New modular cover: Champagne

## Status

Completed

## Goals

- A new **Cover** variant that needs **no photo**: a drawn champagne coupe, for a dinner or birthday party. It's the first of the picture-free covers; more come later.
- A **poster cover**: the cover shows the Title's content itself (intro line, Use names, name / mark / name or the two title lines, the second line) in the Title's place. Not the caption, and not the cover's own kicker (both kept, for photo covers).
  - The Cover's Content card shows the Title's own fields before its own (the details line last); editing them edits the Title.
  - The Title steps aside from the page, the Content tab and the Design list; Save doesn't check it.
  - Switching to Box or Badge brings it back with everything typed. Nothing is deleted.
  - **Date** becomes optional (a switch in the Design list, on by default). With Box or Badge it's required again and drawn whatever the switch says; the host's off is kept for the next poster cover.
  - Fills the whole first screen at every width (no 2:1 cap). The envelope's preview shows the names.
- The drawing, after the Paper Culture card (`context/features/new-covers.md`): a wide, shallow coupe; the drink in its lower part with fizz dots; a bow tie on the stem; bubbles rising above; a few stars by the glass, and small stars of mixed sizes and angles scattered over the whole cover, kept clear of the text.
- **Colours from the palette**, like the playlist's record (`src/modular/sections/playlist/Record.tsx`): the ground is the accent, and every part of the drawing is mixed from it (glass lighter, drink near white, bow tie much darker). Text in `accent-ink`. One design works in every palette.
- **Text:** the intro line in small caps, the names large and italic in the heading face, sized by the cover's box (fits 440px tall), then in caps the event's date (`longDate`) and the host's free **details line** (a new optional cover field), e.g. "Dinner at 7 · Villa Cassis".
- **Layout:** desktop, the glass on the left and the text on the right; phone, the glass on top and the text below.
- **Motion:** the bubbles rise and fade, the stars twinkle, the fizz shimmers; gentle and looping. Still under `prefers-reduced-motion`.
- **Name:** Champagne (ro Șampanie, hu Pezsgő).
- Existing events keep working: a new variant id, no change to stored ids or to the shape of saved data.

## Notes

Spec: `context/features/new-covers.md`. The mockup (visual companion) is scratch, not kept.

The event has no start time stored anywhere, so time and place are one free line the host writes.

**Also in this feature** (related, or small fixes found while building it): Countdown's Simple accent style; Text box's Sticker style; Location's heading in italic (`headingItalic`); Location's cards on the shared hairline frame (`HAIRLINE_FRAME`); accent cards' hairline change (`ACCENT_FILL_CARD`); comment fixes in Date & time and Playlist.

- Simplify: ran 2026-10-30

**Later, not in this feature:** the other picture-free covers, mood and poster, listed in the spec.
