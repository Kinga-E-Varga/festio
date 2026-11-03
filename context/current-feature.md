# Current Feature: Card covers

Drawn covers with a card on the page's ground and a drawing the host picks. A **Card** group (ro Card, hu Kártya) beside Photo and Illustration — Stamp, Playbill and Wildflower — and a new Illustration cover, Ticket. New font pairs for every modular invitation.

## Status

Completed

## Goals

- **The groups:** Cover's `variantGroups` gets `card`, after Illustration. Card: `5` Wildflower (moved from Illustration), `6` **Stamp** (ro Timbru, hu Bélyeg), `7` **Playbill** (ro Afiș, hu Plakát). Illustration: `8` **Ticket** (ro Bilet, hu Jegy). All poster covers, on the page's surface (no `band`), so the host's pattern shows round them. Ids permanent.
- **Every colour from the palette**, light and dark (`CARD_INKS` swaps the card's colours on a dark palette); the Ticket's coins are the one exception.

### The drawings

- The cover's **`drawing`** field (en illustration, ro ilustrație, hu illusztráció), shown by Stamp and Playbill, picked in the Content tab (`DrawingPicker`): each drawing as a thumbnail, its name in a tip. Default `couple-biking`; an unknown id falls back to it.
- **The library:** one file per drawing in `src/modular/drawings/` (permanent id = file name, name in en/ro/hu based on the file name, `shape`, `file`), listed by glob like the palettes (`src/modular/drawing.ts`). Today: couple biking, children tea party, dog on box, family party, fiddle cat, flower, wild party, wolf dance.
- **Three frames:** tall 100 × 120, square 100 × 100, wide 120 × 100 (`DRAWING_SHAPES`). The artist pads each drawing to one in Inkscape; the covers are laid out for these three only.
- **Sources** in `art/drawings/` (and a cover's own art, Wildflower's corners, in `art/covers/`), outside `public/` and Tailwind's scan. `.claude/skills/cover/svg.py build <name|all>` builds them to `public/modular/drawings/` (`public/modular/cover/`): one path (a lone path needs no `lines` label), an even scale or move applied, any other frame or transform refused with the reason, `build all` carrying on past a bad file. It never writes over an Inkscape file it finds in the output folder.
- **On the card:** the whole drawing, never cropped, in the ink, through a CSS mask (`DRAWING`). Its room (`drawingRoom`): upright held by its height (Stamp 80% of the card's width, never wider than 88%; Playbill 70% / 85%), so tall and wide weigh the same; landscape beside the words, at most 70% of the width (Playbill 60%), never taller than 640px.

### 6 · Stamp

- A postage stamp: perforations on all four edges, the accent margin, a fine line inside, a postmark with the date in Roman numerals hanging off its left edge.
- Inside: the eyebrow, the drawing, the names, the Title's second line (italic, muted), the date between two fine lines, the details line. Upright stacked; landscape drawing left, words right.
- Landscape names grow with the card's width or its height, whichever is bigger, up to 112px (big monitors only grow taller).

### 7 · Playbill

- Scooped corners, a line on the edge and a dotted line inside it, in the secondary.
- Inside: the eyebrow; the cover's **highlight** (`kicker`) as the big uppercase heading (the Title's second line isn't drawn); the drawing; the names on a swallowtail ribbon; the date and details between two double rules reaching 0.8em past them.
- Upright one column. Landscape the heading across the top, drawing | names under it; over 1.9 times as wide as tall, heading | drawing | names in one row — unless the drawing is wide, which keeps the heading on top. In the one row the spacing follows the card's width, so a taller card never shrinks the drawing, and the heading grows to 96px.
- The ribbon's names grow like the Stamp's, up to 52px; its column at most 40% of the card (36% in the one row), so long names wrap instead of squeezing the drawing.
- The heading's longest word must fit its column (about 7–8 capitals in the one row): the host keeps it short; no fitting script.

### 8 · Ticket

- A whole cover, no card and no drawing: the host's ticket, just bought, lying a little askew on a pile of other tickets turned over (the accent, dashed lines) with gold and silver coins, on the page's ground.
- The ticket: scalloped ends, two notches and a row of holes at the tear line; the box with the eyebrow on a band, the names (up to 130px), the Title's second line, the details line; the stub with the date in numbers (landscape stacked, upright in a row). Upright on a phone, landscape on wider screens.
- **Never smaller than its words:** its shape is a minimum; it grows longer from its middle when the words need it (a phone held sideways), the stub and date keeping their size.
- **The pile:** tickets about the host's size, apart from each other, two on a phone and a laptop, four from a 1600px-wide cover, one more in each margin past twice as wide as tall. Two shadows each (a close edge one and a soft lift).
- **Nothing on the cover's foot:** tickets and coins run off the top and sides only, at least 24px clear of the bottom, as the next section may share the ground.

## Notes

- **New font pairs** (`src/modular/font-pairs/`, faces in `src/lib/fonts.ts`, `latin-ext`): Zilla Slab & Source Sans 3, Alegreya & Alegreya Sans, Anton & Archivo, Coiny & Baloo 2, Bungee & Archivo, Bevan & Source Sans 3, Oswald & Archivo, EB Garamond & Alegreya Sans, Castoro & Source Sans 3. Each has every Romanian and Hungarian letter, a real italic where used, and reads well at 17px. The covers use the event's pair.
- Also in this branch: the **Wide columns** pattern; Birthday cake's names and ribbon date no longer italic; `content.ts` gains `monthYear` and `romanMonth`; `npm run look --fonts`; the cover skill documents `art/` and the three frames.
- The ro/hu sample texts and drawing names are to be corrected by the user.
- Follow the `cover` skill: check every size with `npm run look`. No motion in the first build.
- Simplify: ran 2026-11-03
