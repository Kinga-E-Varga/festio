# Current Feature: Wildflower cover

## Status

Completed

## Goals

- A new drawn poster cover, **Wildflower** (cover variant `5`; ro Flori sălbatice, hu Vadvirág), for weddings, engagements and baptisms, from the host's engraved flower corner (`public/modular/svg-elements/wildflower.svg`, built by `.claude/skills/cover/svg.py`): no photo.
- On the page's surface (no `band`), so the chosen pattern shows.
- Two flower corners: the drawing at the bottom-left, the same turned 180° at the top-right; a small gap from the edges. About 80% of the width on a phone, about 36% of the width on a laptop. Light palettes: the lines in the secondary, the flowers filled with the surface; dark palettes: the lines in the surface, filled with the secondary.
- A card in the second surface, 10px in from its edge one hairline in a soft mix of the accent; the corners grow over it.
- Above the eyebrow a divider: a fine line, three diamonds (the middle one larger), a fine line.
- The words centred, Champagne's levels: eyebrow (small caps), names in large italic, the date in a smaller italic, the details line (small caps).
- Design tab: a section's style groups (Cover's Photo, Illustration) roll out on their own, an arrow in the mark slot, no Change / Close; the group holding the current style starts out.
- Every colour from the palette; works on every palette.
- Text box's Framed styles become full cards (`FULL_CARD`): **Card** (`3`), **Card joined** (`4`), **Accent & card** (`11`, the card on the accent band; ro Card, Card alăturat, Accent & card; hu Kártya, Csatolt kártya, Kiemelt & kártya), each with a hairline round the card. Two more, the band taking its turn as Card's: **Full card** (`12`; ro Card întreg, hu Teljes kártya), the card in the band's own colour; **Full card accent** (`13`; ro Card întreg accent, hu Kiemelt teljes kártya), the card on the accent, its words in the accent's ink.
- Countdown **Sticker joined** (`11`; ro Autocolant alăturat, hu Csatolt matrica): Simple joined as the Text box's stickers, no eyebrow, the numbers in the accent as Clock joined's.
- Every **Full card** style without lines, as its Full card accent twin, keeping its own colour.
- Location **List & grid** (`3`) renamed **Grid** (ro Grilă, hu Rács): no lines, each venue's icon on the secondary disc over its label, as Grid accent and Full card.
- The same for the **Grid** of Contact (`2`), Special people (`1`), Transportation (`6`), Accommodation (`5`) and Helpful notes (`7`): Grid kept, no lines, each item's icon on the secondary disc over its label (the icon field shown); their Accent styles are these on the accent, renamed **Grid accent** (ro Grilă accent, hu Rács kiemelt), Location's too, so the two sit together in the list. Location's **Accent** (`11`, Simple on the accent) renamed **Simple accent** (ro Simplu accent, hu Egyszerű kiemelt). Grid only where the items sit in cells side by side (`columnsFor`). Schedule's **Accent** (`10`, the Timeline on the accent) renamed **Timeline accent** (ro Cronologie accent, hu Idővonal kiemelt).
- Schedule's **Full card accent** (`11`, the Timeline in a full card on the accent) renamed **Full card timeline accent** (ro Card întreg cronologie accent, hu Kiemelt teljes kártya, idővonal); a new **Full card timeline** (`12`; ro Card întreg cronologie, hu Teljes kártya, idővonal): the Timeline in a full card on its own ground. Schedule's **Full card** (`8`) renamed **Full card alternate** (ro Card întreg alternant, hu Teljes kártya, váltakozó); a new **Alternate** (`13`; ro Alternant, hu Váltakozó): the same days, no card (`schedule/AlternateDays.tsx`, shared). Both: each event split at the middle by a line in its day's colour (secondary / accent in turn), no gap between the halves, the time and the words each 16px from the line.
- Schedule **Grid** (`3`), the name kept: the days side by side, 40px apart, no lines; no icons by the events.
- Menu **Simple grid** (`1`) renamed **Grid** (ro Grilă, hu Rács): no lines, as the other Grids, each course's number on the secondary disc in the icons' place.
- Dress code's and Gifts' **Card** (`1`) renamed **Wide card** (ro Card lat, hu Széles kártya), as Helpful notes' Wide cards.
- FAQ's **Accent** (`8`, Bars on the accent) renamed **Bars accent** (ro Bare accent, hu Sávok kiemelt).
- Menu's **Framed card** (`3`) renamed **Simple** (ro Simplu, hu Egyszerű): its menu centred on its own band, no card. **Accent** (`11`) renamed **Simple accent** (ro Simplu accent, hu Egyszerű kiemelt): Simple on the accent band (`menu/CenteredCourses.tsx`, shared).
- **Numbered icons:** list sections whose items each pick an icon get two section-wide switches in the Content tab, once per section, after its heading fields (e.g. after the note) and above the items:
  - **Use icons**: off, no disc on any item, and no icon picker in the items.
  - **Use numbers as icons** (ro folosește numere ca pictograme, hu számok használata ikonként), shown under Use icons only while it is on: on, each item shows its position (01, 02, 03…) on the disc in the icon's place, and the items have no icon picker.
  - Use icons on, Use numbers off: each item has its icon picker, without the "–" choice, and shows its own icon.
  - By default Use icons is on and Use numbers off, as today; a section saved before this reads the same.
- Applies in every style of the section that draws item icons; a style's big icon in its heading (`IconHeading`) is left as it is. Sections: Location, Contact, Special people, Transportation, Accommodation, Menu, Helpful notes (Dress code and Gifts notes counted in their place) and Schedule, and Story's Moments (`3`) as the Timeline (no mark: the dot).
- The always-numbered **Icon & list** / **Icon & cards** styles (Menu `5`, Contact `4` and `6`, Accommodation `2` and `4`, Transportation `2` and `4`) follow the switches too, as Special people's: the icon bare in the number column, or the number; icons off, no column. Helpful notes' **Two-line & list** / **Two-line & cards** (`4`, `5`) and **Icon & list** / **Icon & cards** (`3`, `6`) get marks too (`NoteList` `marks`): Two-line's on a soft disc at the row's end under the label, Icon's bare before the row.
- Schedule: the numbers start again at 01 for each day.
- The colours that take turns start with the secondary (`turnTone(index, "secondary")`): Schedule's Timeline, Two-line & list / cards and Alternate days, Story's Moments. Schedule's Clock styles keep the accent first.
- Menu **Grid** (`1`) no longer always numbered: it shows each course's icon like the other Grids, its numbers only with the switch on.

## Notes

- Poster fields as Champagne: `eyebrow`, `names`, `namesStart`, `namesMiddle`, `namesEnd`, `firstLine`, `nextLine`, `secondLine`; `shows: ["details"]`.
- The drawing stays a static file (it is large), painted through CSS masks (lines over a fill, `wildflower-fill.svg`; dark palettes `wildflower-fill-dark.svg`); the fill's outline 2, dark 0.75 (`svg.py` `SETTINGS`: `stroke`, `dark_stroke`); trimmed (precision, Inkscape metadata) without changing its look.
- No motion, no scattered decorations in the first version.
- Cover card: `surface-alt`, no edge line, one hairline 10px in (`FRAME`: 45% accent in the card's colour). Corners 2cqmin from the sides when taller than wide (`CORNER_GAP`); 90% of the width when taller than wide (at most 67.5% of a phone's height, 63% of a tablet's); wider than tall 49.5% of the width, 40.5% past 1600px, at most 83% of the height.
- Text box: `FramedText` is `CardText`, a full card (`FULL_CARD`, exported from `FullCard.tsx`); its `card` takes any `SectionGround`, `framed` adds the hairline (`HAIRLINE_FRAME`).
- Countdown: the number row shared by Simple, Simple joined and Sticker joined (`countdown/NumberRow.tsx`); `SMALL_STICKER` moved to `styles.ts`.
- Full cards: `FullCard` draws no lines; `fullCardGrid(count)`, `FULL_CARD_CELL` (was `fullCardCell`); FAQ Full card and Full card accent keep their lines: between the questions, above the first and under the last row (`FaqList` `divided`); Menu's Full card takes the accent's short rule; Schedule Full card's days without lines.
- Location: `ListGridVenues` exports `VenueRow` and `VenueText`, Full card uses them (its own copies gone).
- Simplify: ran 2026-11-02
- Numbered icons: the two switches are `toggle` fields of the section (`ToggleField`, saved as booleans beside its other values, no new data shape): `icons` (Use icons, default on) and `numbers` (Use numbers, default off), drawn after the heading fields; their `controls` / `controlsOff` show or hide `numbers` and the items' `icon` field. Each item's own icon stays saved, so switching back loses nothing.
- Items saved before this with no icon ("" today) keep showing no disc while icons are on, until the host picks one; the picker has no "–" to set it back.
- Numbers drawn as Menu Grid's today: `pad(index + 1)` on the disc, in the disc's tone (secondary, or the item's turn tone where the style takes turns).
- Picker: `src/components/modular/content/IconPicker.tsx` (via `FieldInput.tsx`); discs: `ItemIcon` / `CardIcon` in `src/modular/cards/`.
