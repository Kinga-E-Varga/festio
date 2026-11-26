# Current Feature

Modular sections — cards, stickers and countdown styles (`fix/modular-sections`)

## Status

Completed

## Goals

- **Cards soft / hard everywhere:** every Cards style (Accommodation, Contact, Location, Menu, Helpful notes, Schedule, Transportation, Special people, Countdown, Countdown joined) is now Cards hard (old id, second surface) plus a new Cards soft (surface). Cards soft, hard and accent are bare (the pattern round the cards), with no note and a sticker heading (`SectionHeading`'s `sticker`); card content always centred (`CARD_CENTRED` replaces `centredWhenStacked`)
- **Card edges follow the pattern:** `HAIRLINE_FRAME` (a hairline with the pattern off, none with it on) on the full cards (`FULL_CARD`), countdown cards, the Calendar's pages and the Playlist's Card soft / hard. Calendar's cut ring and dividers: `SHAPE_CUT`, `CUT_DIVIDER`
- **Sticker rule:** one `STICKER` (`normal` / `medium` / `semibold`) for every sticker: the outline 1.5px + 5% of the text size (`TEXT_CUT`), the weight 50 over the plain version's, both only with a pattern on (`--m-text-cut` 1 / 0). `STICKER_TEXT`, `SMALL_STICKER`, `TEXT_CUT_THICK` gone
- **Countdown:** renamed to Sticker, Clock, Sentence; new Clock sticker (`14`) and Sentence sticker (`15`) (`ClockRow`, `Sentence`); Simple joined and Cards joined lose the eyebrow; numbers in non-accent cards in the accent; joined styles pulled up (`JOINED_PULL`)
- **Date & time:** Sticker simple (`8`) retired, Sticker colourful renamed Sticker (no eyebrow); Simple accent → Simple on accent; Framed day's month restyled
- **Text box:** Card (`3`) retired; Accent & card → Card on accent; Sticker joined keeps its name
- **Story:** Two-line / Icon put the heading and story left, photo right; new Simple (`10`); Simple, Accent and the three Full cards share one layout (`WideStory`): heading, a wide 3:2 photo (narrower in the cards), the story centred under it. Photo note shortened (Story, Location)
- **Full cards as wide as three Cards:** `FULL_CARD` drops the 960px cap and takes the section's whole content width (up to 1240px); the Text box's Full cards too (`CardText`'s `wide`), its Card styles keep 960px
- **One card layout for every Cards style** (`cardColumns`, `CARD_GRID`; Location's `ROW` gone): two side by side from `@3xl`, 480px each, spaced evenly; three from `@5xl` across the whole width; gaps 16 / 24px
- **Cover Wildflower:** the hairline inside the card removed; the card's edge `HAIRLINE_FRAME`, as every card's
- Schedule: a stale "`9` is retired" comment removed (Cards accent uses `9`)

## Notes

- Simplify: ran 2026-11-26
- New variant ids are permanent: countdown `12`–`15`, people `12`, accommodation / contact `12`, location / menu / transportation `13`, notes `14`, schedule `16`, story `10`
