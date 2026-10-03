# Current Feature: Modular invitations 2 — Olive Garden

## Status

Completed

## Goals

Redo the modular library's look from the prototype in
`context/plans/online-invitation-design-ideas/` (Nocturne palette). The prototype is a
reference only: evaluate its code, don't copy it straight in.

### Clean-up

- Delete every current section variant **except `playlist/record`**. Each section gets one
  new variant, drawn from the prototype. Section ids stay.
- Delete the `map` section. Its place is taken by a photo inside `location`.
- Delete the Terracotta and Midnight palettes, the Classic and Script font pairs, and the
  Garden and Garden Midnight templates.
- Keep the `dots` pattern, even though nothing uses it.

### Colour model

- A palette goes from 15 positional roles (`c1`–`c15`) to **15 named roles**: `canvas`,
  `surface`, `surface-alt`, `ink`, `ink-muted`, `line`, `accent`, `accent-ink`,
  `accent-soft`, `secondary`, `secondary-ink`, `secondary-soft`, `tertiary`, `tertiary-ink`, `error`.
- `error` is the RSVP form's warnings (`--c6`), apart from `secondary` so a warning doesn't
  read as decoration.
- `surface-alt`, `ink-muted`, `line` and the two `-soft` tints started as mixes, but no mix
  matched the prototype, so each palette sets them.
- Only the shadow is mixed, in `vars.ts`, in `oklab`: `shadow` = canvas + ~80% black (the
  page ground, darkened). The `inverse` pair just swaps ink and surface.
- More roles can come later.
- Re-point the shared `--c1`–`--c6` mapping (host bar, edit panel, RSVP form) at the new names.
- Update `project-overview.md`: "a palette is 15 fixed colour roles" → "15 colour roles, the
  rest mixed from them; more may be added".
- **Nocturne**, the only palette: canvas `#e8e4d9` (light, as the prototype shows it), surface `#22251f`, surface-alt
  `#2c3028`, ink `#f0eee5`, ink-muted `#b2b6a7`, line `#41463b`, accent `#a8b891`, accent-ink `#1a2118`, accent-soft `#353f30`,
  secondary `#d88d6d`, secondary-ink `#241812`, secondary-soft `#463127`,
  tertiary `#e2c480`, tertiary-ink `#2a251a`, error `#ef8a7e`.
- Invitation shadow: `elevation-band` (`0 0 14px`, 70% opacity); its colour changes from
  `--m7` to the mixed `shadow`. Don't use the prototype's shadows.

### Fonts

- One font pair: **Gelasio** headings, **Arimo** body, via `next/font/google`.

### Icons

- A shared, hand-drawn icon library in `src/modular/` (no `lucide-react`) any section can
  offer as a choice. Adding an icon = one place, nothing else to touch.
- Start with: meal, heart, sparkle, moon, train, bus, car, compass, gift, pin, clock.

### Section headings

- Every section heading has separate optional fields: eyebrow, heading, italic second
  heading line, note. Any can be empty and the heading must still look good.

### Sections (in page order)

- `top-bar` — monogram (`mark`) + section links; the prototype's palette switch becomes an
  **RSVP** button that jumps to the form.
- `cover` — cover photo with kicker, date, "Scroll to celebrate". Photo required. No fade
  over the photo: it looked better without.
- `title` — hero: eyebrow, names, caption. **No date link.**
- `date-time` — "The day" text + card; keeps the parts-of-the-day list (up to 4).
- `countdown` — its own section, right under date-time; live days, hours, minutes, seconds.
- `location` — venue card + a **photo where the map was**. Photo required in this variant.
- `schedule` — host adds days, and events per day (time, title, note, icon). No highlighted
  day. Icons only, colours alternate by day: odd `accent` on `accent-soft`, even `secondary`
  on `secondary-soft`.
- `menu` — menu card.
- `notes` — new, "A few helpful notes" (see below).
- `dress-code` — dress code card; stays a section of its own too.
- `gifts` — gifts card; stays a section of its own too.
- `accommodation` — "A soft place to land".
- `transportation` — train / shuttle / car cards, each with an icon from the library.
- `faq` — FAQ accordion.
- `rsvp` — **our existing form and logic** in the prototype's look: intro beside the form,
  heart, field styles, thank-you screen with sign-off. "Kindly reply by" is host-written
  text, not filled from the closing date.
- **RSVP skins** — one reply form (`RsvpForm`) for simple and modular invitations, one
  layout. Its look is a `skin`: every part (labels, inputs, Coming / Not coming, ×, Add
  person, Send, privacy, warning, spacing, age and diet dropdowns) is required. Simple
  invitations use `SIMPLE_RSVP_SKIN` (today's `--c*` look); each modular RSVP variant sets
  its own in `--m-*` — `rsvp/split` in the prototype's look.
- `footer` — new, **required and always last**: monogram (read from the top bar's `mark` —
  one source), the date from the event, "Back to the beginning".
- `playlist` keeps its old `record` variant, as a green band right before `rsvp`.

### Helpful notes (`notes`)

- Holds subsections, **at most 4 in total**: **Dress code**, **Gifts** (each once) and
  **Custom** (host's own title and text, any number).
- Dress code and Gifts read the **same data** as the standalone `dress-code` and `gifts`
  sections — one source. Showing both twice is allowed; removing one is up to the host.
- Numbering ("01 · Dress code") is automatic.

### Template

- **Olive Garden** — Nocturne, Gelasio + Arimo, no pattern, every section above except the
  standalone `dress-code` and `gifts` (Helpful notes shows both), with `playlist` between
  `faq` and `rsvp`.
- The prototype's Tuscany photo is the sample image for the cover and location photo until
  uploads exist.

### Mobile

- The prototype barely handles phone widths. Design the mobile layout in the same style,
  following the existing modular page's behaviour (drawer, a centred column).
- The column grows to 1440px (was 1280px), set once as `INVITE_COLUMN` in `src/modular/vars.ts`.

## Notes

- Spec: `context/features/modular-2-olive-garden.md`.
- Plan: `context/plans/modular-invitations-2-olive-garden.md`
- Firestore schema is still unsettled. How the shared dress-code / gifts data is stored is
  a later layout question; for now both places read the same section values.
- Image fields are new. No upload yet — the sample photo is the value.
- No saved events use the old variants, palettes, pairs or the `map` section, so deleting
  them breaks nothing.

## History

<!-- Keep this updated latest to earliest -->

- Modular invitations — templates split, 1280px column — `src/templates/` in `simple/` and `modular/`; the modular invitation capped at 1280px on its `--m4` ground with a faint palette shadow, shown the same way in the editor (no rounded frame, no bottom padding); ground patterns as a shared library with polka dots on Garden; the top bar as a required `top-bar` section with a `mark` field; no shadow on the editors' side panel; anchor jumps to RSVP no longer shift the editor up (`overflow: clip`)
- Custom invitation editor UI — the modular editor frames the invitation on the print ground (mustard-50) with padding per breakpoint, rounded corners, a thin border and a soft shadow; the edit panel moved out of the invitation into the editor, the sections drawer stays inside the box; modular invitations get a thin palette scrollbar (`--m7` on `--m2`); `elevation-btn` renamed `elevation-print`
- Text uniformity — one sans scale (10 / 11 / 11.5 / 12.5 / 13.5 / 14) and fewer spacings and weights across the host app, serif headings resized; every single-line field 40px tall; the editor side panel's tabs underlined in neutral with an edge-only open tab, the X only while the panel covers the viewport, View at every width and no title row on the print panel
- Invitation editor rework — one shared top bar and page frame for the simple, modular and print editors (BACK, title and tags, save status, Edit / View, Save or Export, Save off until something changed), `HostBar` removed; side panels in Festio's own chrome with neutral Text / Replies / Design tabs, a Print settings title, the event editor's fields and grey inputs, choice buttons and checkbox; app icons in the top bar; shared bar buttons and banner tones in `event-editor/styles.ts`
- Modular invitations phase 1 — a shared library in `src/modular/`: 15 sections with one variant each, Terracotta and Midnight palettes (15 colours as `--m1`…`--m15`), Classic and Script font pairs, all found by id; Garden and Garden Midnight templates at `/templates/<id>` with a sticky top bar, mobile drawer, Open in Maps links and the simple RSVP form; the host bar and an empty three-tab panel via a shared `PanelTabs`; simple-only loading for the guest, print and invitation pages
- RSVP form fixes — Coming / Not coming above the names; age and dietary needs per name when coming, with the reply editor's options; one warning slot above Send; custom radios and checkboxes in the invitation palette; reply fields in the invitation's primary font, buttons in Work Sans uppercase; the editor tries the form without saving; toast tones (success, neutral, warning, error), bigger and longer-lasting toasts
- Invitation editor tabs — the dashboard Invitations page archived to `archived/invitations-page/`; Edit invitation and Print straight from the events list, BACK falling back to it; a new event row layout with shared action blocks and short month names; no Studio in the nav, Downloads in Hosting; the editor panel's Text / Response / Design tabs with the X as a segment, sticky at the top, with a hint on where the reply message shows and the View button in `--c2`
- Prettier formatting — one pinned style (double quotes, semicolons) in `.prettierrc.json`, `npm run format` / `format:check`, VS Code format-on-save with Prettier, a Claude Code hook that formats every file Claude edits, and a one-time reformat of the codebase
- Card shadow, tab hover, Active = shared — a template sets its card shadow (light / dark / none) and the stage leaves room for it, so the card no longer pads itself; lighter tab hover with a bottom border and a 3px tab border; Active holds only paid Public / Protected events, with the status worked out instead of stored and the Active / Draft texts fixed in EN, RO and HU
- Simplify codebase — a quality-only cleanup of all of `src/`, one chunk at a time, with a plain-language review and a possible-bugs list in `context/reviews/2026-09-29.md`
- Event package — one Free / Standard / Custom package in place of tier + invitation type, named package everywhere (HU csomag, RO pachet); Custom unlocks every template; package texts restored in the edit page; event row actions reordered with shorter HU/RO edit labels
- Reply editor — edit a reply with every RSVP question (age, diet with None/Other, the host's questions, reply-wide answers with Separate from group); New reply with several people; unsaved-changes guards shared with the list box and a leave-page warning; custom answers and the message in the reply details; keyboard diet dropdown
- Preloaded guest list — the list box as a draft editor: paste and add names, an A→Z list with a sticky search, × for waiting names and "replied" for the rest, Save / Cancel with unadded-names and discard prompts; opens above the list buttons, fades in and out; one shared gold button colour
- Guest summary — the guest list page's Summary: Replies, Age and Dietary needs tables, custom question answers and messages behind a Show/Hide toggle, an Other diet option, and mock custom questions on the engagement
- Guest list row design — one sheet with category sections, reply threads, a Needs your attention section for unknown and identical names, foldable reply details, a header that gives up space in order, and Summary / Guest list page sections
- React Grab — dev-only tool to copy an element's component and file location for Claude Code
- Event guest list — one page per event with the merged list, categories, Unknown/Duplicate resolving, inline editing, pasted names and invite-sent tracking; BACK falls back to each page's own list
- Safety features — clean slug-only links, the Protected password on the printed card, expected guests with a hidden reply cap, reply-form closing, and one set of warning texts for banners and the notifications rail
- Language / i18n — Romanian and Hungarian for the host app and guest invitations, each invitation with its own language
- Invitation print page — a flat or folded printable at `/prints`, with its own settings form
- Host action bar — one bar over the card: back, edit toggle, save, dismiss
- Invitations page — grid of invitation cards, plus one-record arrivals from Events and the dashboard
- Dashboard & events UX fixes — header action, card restack, warning-only tags
- Dashboard design fixes — stats, card/list layout, editor banners, focus rings
- Invitation composition — card + reply in one component, one tree per panel
- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
