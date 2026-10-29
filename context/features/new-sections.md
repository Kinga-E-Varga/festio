# New modular sections: Family, Our story, Quote, Contact

**Status: designed, ready to load.** Four optional sections for modular invitations, three styles each. Mocked up in Peony (Fraunces & Space Grotesk) and approved as shown; the mockup is scratch, not kept.

## Why

The current sections cover the practical side (where, when, how to get there, what to wear). These fill the personal side, and what Romanian and Hungarian invitations traditionally carry: the parents and godparents, a verse, a story, someone to call.

## Goals

- **Spec:** add the four to the optional sections in `context/project-overview.md`.
- **Order** (a place in the fixed order each): Quote right after the title, Family after Date & time, Our story before Location, Contact before the footer.
- Built from the parts the sections already share (`SectionHeading`, the two-line heading, cards on the other surface, soft discs taking turns accent / secondary, lists between hairlines, `LINED_GRID`). New parts only where none fits.
- Samples in all three languages, as the other sections.

### Family

Parents and godparents (*nași*, *keresztszülők*). Heading fields, then groups: each a label ("Parents of the bride", "Godparents") and one or two names. The host adds and removes groups.

- **Centred** (`1`): the heading centred over the groups side by side, an upright hairline between; each group's label as a muted eyebrow over its names in `H3`. The printed-invitation look.
- **Cards** (`2`): a card per group on the other surface, side by side, its icon on a soft disc over its label, taking turns accent / secondary, as Transportation's Cards. Each group gets an `icon` (heart, sparkle).
- **Two-line & list** (`3`): the two-line heading beside the groups as rows between hairlines, the label in a column, the names beside it.

### Our story

Heading fields, a longer text, one optional photo (the Use photos switch, as Location's). One photo, not a gallery: a photo gallery is out of scope for v1.

- **Photo beside text** (`1`): the photo on one side, the heading and text on the other. Photos off: the text alone, centred.
- **Centred text** (`2`): the two-line heading over the text, no photo.
- **Moments** (`3`): the two-line heading beside a few dated steps (a year, a title, a line) on Schedule's Timeline line. The steps are a list the host edits.

### Quote

The quote and an optional source (author, verse reference). No heading: the words alone, unlike every other section.

- **Large & centred** (`1`): the quote in the heading's italic, short accent rules over and under, the source as a muted eyebrow.
- **On the accent band** (`2`): the same on the accent, a large quote mark over it, as Playlist's Record (`ground: "own"`, `band: "accent"`).
- **Framed** (`3`): a double hairline frame around the words, as Menu's Framed card.

### Contact

Heading fields, then people (up to about four): a role ("The bride", "On the day"), a name, a phone number drawn as a tap-to-call `tel:` link.

- **Cards** (`1`): a card per person, its icon on a soft disc over the role, the name, the number; taking turns accent / secondary. Each person gets an `icon`.
- **Grid** (`2`): centred cells between hairlines (`LINED_GRID`), no icons, as Transportation's Grid.
- **Two-line & list** (`3`): the two-line heading beside the people as rows between hairlines: the role, the name, the number at the row's end.

## Notes

- **The phone number is on a public page.** The field's hint says so and points to Protected mode. The link editor already tells the host links are guessable.
- A phone field is a new input type: check the field types in `src/modular/fields.ts` first, and ask if a new one is needed (`context/project-overview.md`, Unsettled).
- New ids are permanent once events use them (section, variant, field ids).
- RO and HU wording of the names, labels and samples needs the host's check.
- Possibly a phone icon for Contact in `src/modular/icons.tsx`, if none is there.
- Related, separate: `context/features/pending/time-capsule.md` (guest notes for a later day).
