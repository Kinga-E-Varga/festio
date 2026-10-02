# Current Feature

## Status

Completed

## Goals

Custom invitation editor UI — in the modular (Custom) editor, the invitation sits in its own framed box on the editor's ground, so it is clear what is the invitation and what is the editor. Modular invitations get a scrollbar in their own palette.

**Framed invitation — modular editor only (`/templates/<id>` for a modular template)**

- The area under the editor top bar is painted with the print editor's ground, `mustard-50` (`bg-mustard-50`). `PrintEditor.tsx` currently writes it as raw hex (`--print-ground: #F9F5EA`); point that at `var(--color-mustard-50)` so both editors read the one token.
- The invitation sits in a box inside that area: 12px padding on mobile, 18px on tablets (`md`, 768px+), 24px on desktop (`invite`, 1000px+), 40px on wide screens (`rail`, 1400px+). Small rounded corners, a thin `mustard-300` border and a soft shadow, smaller on mobile.
- The invitation scrolls inside its box. Its sticky top bar stays at the top of the box, not the top of the screen.
- The mobile sections drawer opens inside the box and covers only the invitation, not the editor.
- The simple editor and the print page layouts do not change.

**Edit panel**

- Moves out of `ModularInvitation` and becomes part of the editor (`ModularEditor`).
- Desktop (above the `invite` breakpoint): the framed box shrinks to make room for the open panel, same duration and easing as today. Mobile: the panel covers the screen, as today.
- The panel is in Festio's own colours. Check nothing in it still reads the invitation's `--c*` / `--m*` vars once it is outside the invitation root.

**Palette scrollbar — every modular invitation, guest page included**

- On the invitation's own scroll area: thin, thumb `c7` (`--m7`), track `c2` (`--m2`).
- Standard `scrollbar-color` / `scrollbar-width` for Chrome and Firefox, plus `::-webkit-scrollbar` styles so Safari looks the same.
- Colours read the palette vars only, so a new palette needs no extra work.

## Notes

- Testing: both Garden templates (Terracotta, Midnight) on desktop and mobile; panel open and closed; the sections drawer; scrolling in Chrome and Firefox; the scrollbar on the guest page; the print page still looks the same. Then `npm run build`.

## History

<!-- Keep this updated latest to earliest -->

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
