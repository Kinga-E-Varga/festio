# Current Feature: Modular invitations 5 — Content tab

The modular editor's empty Text tab becomes the Content tab, where the host edits the values of every section that is on. Spec: `context/features/modular-5-content-tab.md`.

## Status

Completed

## Goals

- "Text" tab renamed "Content" in every editor (simple, modular, print): EN Content, RO Conținut, HU Tartalom
- Content tab lists only the sections switched on in Design, reusing the Design section cards, with a page-position number (1, 2, 3…) in place of the switch
- Clicking a section scrolls the preview to it and opens its fields; one section open at a time
- CLICK TO EDIT box on hover over a preview section (top-right, Edit mode only, no touch devices, host locale), opening the panel on Content with that section's fields
- Each variant lists the fields it shows; Content shows only those; switching variant keeps every value
- Inputs for every field type: text, long text, time, toggle, image (thumbnail + inactive "Change photo" + "coming soon"), icon (grid picker), list and groups with Add / Remove
- Lists: no reorder, Add stops at the max, Remove asks nothing; Location keeps at least one venue, every other list may be empty
- Icon picking only in Schedule variant 1 and Helpful notes' custom notes
- Date (id stays `date-time`): the date only, no time — the `moments` list is gone; date read-only from event details with a "set in the event details" line; variants Calendar card, Accent & big date (with its date format) and Tear-off; countdown counts to the start of the event day
- Helpful notes shows the Dress code / Gifts fields when those switches are on (same values as the standalone sections); Reply edits only its texts
- Times shown in the invitation language's style (EN 3:30 pm, RO/HU 15:30), in Schedule
- Required fields: marked in the tab; small error below the field on blur when emptied, gone once filled; Save stays clickable but saves nothing and jumps to the first empty required field (panel opens on Content, section opens, field focused with the error); a required field the variant hides does not block
- Content and Design share one working state, one Save (in memory) and one leave-page warning

## Notes

- No fallback to sample text: an empty field shows nothing (may change later)
- No character counter
- A field a template leaves empty on purpose still shows in Content if the variant shows it — empty never means hidden
- Out of scope: photo uploads, reordering list items, reply questions (Replies tab)
- Open: which other fields are required — decided after seeing the form
- Plan: `context/plans/modular-invitations-5-content-tab.md`

## History

<!-- Keep this updated latest to earliest -->

- Modular invitations 4 — Section variants & palettes — a second variant for most sections (header, cover, title, date & time, countdown, location, schedule, travel, stays, menu, Helpful notes, FAQ, reply, footer), numbered by id, with shared pieces (`HeaderBar`, `TitleNames`, `CoverPhoto`, `WashedPhoto`, `IconHeading`, `Mark`) and `top-bar` renamed `header`; every sample in `defaults.ts`, templates keeping only their changes; the Coastal Fun template; box corners (Sharp / Slight / Soft / Round); section styles rolling out as bands in the Design tab; new palettes (Coastal, Linen, Noir, Peony, Thistle, Y2K, Flint, Sunset), Dark Olive renamed Orchard, a `mood` (subtle / balanced / vivid) on every palette and readability fixes; the `/palette` skill with a contrast checker and swatch page; reply form ids from `useId` and a wrapping diet dropdown
- Modular invitations 3 — Design editor — the modular editor's Design tab: template, palette, ground pattern and font pair pickers that roll out like the palettes; section switches with a variant picker under each section that is on; Helpful notes switches for Dress code, Gifts and custom notes, never on twice with the standalone sections; live preview; Save in memory with a leave-page warning; the Sunbaked palette and the Fraunces & Space Grotesk pair; the playlist record's disc, rings, hole and shadow mixed from its band
- Modular invitations 2 — Olive Garden — the modular library redone from the Nocturne prototype: palettes as 15 named roles (Nocturne only), Gelasio + Arimo, a hand-drawn icon library, one new variant per section with a shared four-part heading, Helpful notes and a required footer; one reply form with skins for simple and modular; section backgrounds alternated by the page (own-colour and joined sections); split sections with the content capped at 620px; the column widened to 1440px (`INVITE_COLUMN`); a toggle field type; a shared Good to know menu link; "reply" everywhere in guest and host text
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
