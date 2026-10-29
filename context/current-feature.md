# Current Feature: New modular sections — Special people, Our story, Text box, Contact

## Status

Completed

## Goals

Four optional sections for modular invitations, three styles each. Mocked up in Peony (Fraunces & Space Grotesk) and approved as shown. They fill the personal side of an invitation: parents and godparents, a verse, a story, someone to call.

- **Spec:** add the four to the optional sections in `context/project-overview.md`.
- **Order** (a place in the fixed order each): Text box right after the title, Our story after the Countdown (order 42), then Special people, Contact right after the FAQ (order 142).
- Built from the parts the sections already share (`SectionHeading`, the two-line heading, cards on the other surface, soft discs taking turns accent / secondary, lists between hairlines, `LINED_GRID`). New parts only where none fits.
- Samples in all three languages, as the other sections.

### Special people (`people`, was Family)

Parents and godparents (_nași_, _keresztszülők_). Heading fields, then groups: each a label ("Parents of the bride", "Godparents") and up to six names. The host adds and removes groups.

- **Grid** (`1`): as Transportation's and Contact's Grid: centred cells between hairlines (`LINED_GRID`) under the heading, each group's label in the secondary over its names (`H3_ITEM`).
- **Cards** (`2`): a card per group on the other surface, side by side, its icon on a soft disc over its label, taking turns accent / secondary, as Transportation's Cards. Each group gets an `icon` (heart, sparkle).
- **Two-line & list** (`3`): the two-line heading beside the groups as rows between hairlines: the label over the row, the names under it, the icon on a soft disc at the row's end.
- **Icon & list** (`4`): a heart on its soft disc over the heading, no eyebrow, beside the groups as Transportation's Icon & list: each group's own icon, bare, where a way's number goes, the same size and spacing, taking turns accent / secondary.
- **Two-line & cards** (`5`): Two-line & list, each group a card on the other surface, stacked, as Transportation's.
- **Icon & cards** (`6`): Icon & list, each group a card on the other surface, stacked, as Transportation's.
- **Full card & grid** (`7`): as Contact's: the heading centred in a full card, the groups side by side under it with hairlines between (three in a row, four as two rows of two, one column on a phone), each centred: its icon on a soft disc, its label, its names.

### Our story

Heading fields, a longer text, one photo, required in the style that shows it, no switch. One photo, not a gallery: a photo gallery is out of scope for v1.

- **Two-line & photo** (`1`): the photo on one side, the heading and text on the other, no note. The photo is required.
- **Icon & photo** (`4`): Two-line & photo with a sparkle on its soft disc over the heading, no eyebrow, italic line or note, as the other Icon styles.
- **Full card & photo** (`6`): the eyebrow and heading centred in a full card, then between its lines the photo on the left, the story on the right; on a phone the photo over the story.
- **Full card simple** (`5`): Full card & photo without the photo: the eyebrow and heading centred in a full card, the story centred between its lines.
- **Simple** (`2`): the full cards' heading, eyebrow and heading only (no italic line, no note), over the text, centred, no photo.
- **Moments** (`3`): Simple's heading (eyebrow and heading only) centred over the moments, laid out as Schedule's Timeline: a line down the middle, a dot for each, the moments taking turns left and right; on a phone the line down the left.

### Text box

Extra text the other sections have no place for: a large text and an optional small text under it (first planned as a quote and its source). An italic switch under the large text sets its style, on by default. No heading: the words alone, unlike every other section.

- **Simple** (`1`): the large text in the heading's italic, the small text as a muted eyebrow, no rules.
- **Simple joined** (`5`): Simple in the band of the section right before (the title), `ground: "joined"`: no top padding of its own.
- **Sticker joined** (`6`): Simple joined with the large text as the title's stickers: medium, outlined in the surface (`TEXT_CUT`, shown with a pattern on).
- **Simple accent** (`2`): Simple on the accent band, as Playlist's Accent (`ground: "own"`, `band: "accent"`).
- **Quote accent** (`7`): Simple accent as a pull quote: a large opening mark at the words' top left, a closing one at their bottom right (beside them from mid-width, over and under on a phone).
- **Quote** (`8`): Quote accent on the page's surface, taking its turn as any section.
- **Quote joined** (`9`): Quote in the band of the section right before (the title), `ground: "joined"`: no top padding of its own.
- **Framed** (`3`): a double hairline frame around the words, as Menu's Framed card.
- **Framed joined** (`4`): Framed in the band of the section right before (the title), `ground: "joined"`, as the countdown's joined styles: no top padding of its own.

### Contact

Heading fields, then people (up to about four): a role ("The bride", "On the day"), a name, a phone number and an email (a new `email` field type), plain text, not links, each with a small outline icon before it in the text's colour.

- **Cards** (`1`): a card per person, its icon on a soft disc over the role, the name, the number; taking turns accent / secondary. Each person gets an `icon`.
- **Grid** (`2`): centred cells between hairlines (`LINED_GRID`), no icons, as Transportation's Grid.
- **Two-line & list** (`3`): the two-line heading beside the people as rows between hairlines: the role over the row, the name, the number and email under it, the icon on a soft disc at the row's end.
- **Icon & list** (`4`): a phone on its soft disc over the heading, no eyebrow, beside the people as rows, numbered (01, 02…) in turns accent / secondary, as Accommodation's Icon & list.
- **Two-line & cards** (`5`): Two-line & list, each person a card on the other surface, stacked.
- **Icon & cards** (`6`): Icon & list, each person a card on the other surface, stacked.
- **Full card & grid** (`7`): the heading centred in a full card, the people side by side under it (three in a row, four as two rows of two, one column on a phone), each centred: the icon on a soft disc, the role, the name, the number and email.

## Notes

- Spec: `context/features/new-sections.md`.
- Plan: `context/plans/new-modular-sections.md`
- Decided: Contact's number is a new `phone` field type; Special people goes after the Countdown (order 45), so the Countdown keeps joining Date & time.
- **The phone number is on a public page.** The field's hint says so and points to Protected mode. The link editor already tells the host links are guessable.
- A phone field is a new input type: check the field types in `src/modular/fields.ts` first, and ask if a new one is needed (`context/project-overview.md`, Unsettled).
- New ids are permanent once events use them (section, variant, field ids).
- RO and HU wording of the names, labels and samples needs the host's check.
- Possibly a phone icon for Contact in `src/modular/icons.tsx`, if none is there.
- Related, separate: `context/features/pending/time-capsule.md` (guest notes for a later day).
- Simplify: ran 2026-10-29
