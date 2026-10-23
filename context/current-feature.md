# Current Feature

New app palette, box consistency pass, palette switcher dev tool. Branch `chore/palette-switcher`.

## Status

Completed

## Goals

- **New palette (Moss)** in `globals.css`: primary moved toward secondary (moss green), khaki neutrals a touch less yellow, a stronger mauve accent (from `a07a90`) as the one colour that stands out. Info, warning and danger redone to fit: dusty teal-slate, amber (light tints peach, so they stand out from the base), brick red (clear of the mauve).
- **Palette switcher** (dev only, off until `?palette=on`): Current, Wine accent, Old green + burgundy, Copy CSS. Documented in `context/dev-tools/palette-switcher.md`.
- **Boxes share one padding** (`BOX_PAD`, as `--box-pad`: 24px, 18px on narrow): Home and Overview boxes, Event settings cards, the guest list (groups and their header bars: header y 18px / 14px), the Summary tab, the Invite list box, dialogs. Sign-in / sign-up keep their own (24 / 32px).
- **Box titles**: `card-title` everywhere (guest list headers, dialogs, the empty state); as much space under the title as over it; buttons beside a title (Edit, Cancel / Save) don't add to it. Sign-in / sign-up keep the bigger `page-title`, centred. `small-title` removed.
- **Borders**: boxes on the page `neutral-300`, boxes inside a `neutral-50` box `neutral-200`; dividers inside boxes `neutral-200`; fields `neutral-400` everywhere.
- **Floating menus** get a soft shadow (`--shadow-menu`).
- **Smaller fixes**: Home's attention links in their mark's colour (a step darker); event status tags (Live / Hidden / Past) borderless with a step darker fill, column wide enough for every language; to-dos coloured as the Hidden tag (`WARNING_SOFT`); the countdown number shrinks with the box titles, with the box padding over and under it; Match to a name dialog no longer has empty scroll space under it; the `LABEL` constant removed, every label uses `label-caps` directly.

## Notes

- Not committed yet. `npm run build` passes (after simplify).
- Simplify: ran 2026-10-23
- Left as they are on purpose: menus' and dialogs' `neutral-400` borders, controls (name picker list, summary switch), the open Event settings card's `neutral-500`, the bell's alerts list and Overview to-dos' link colours, the invitation and print editors.
