# Current Feature

## Status

Completed

## Goals

**Modular invitations — templates split, max width, RSVP jump fix**

1. **Split `src/templates/` in two.**
   - `src/templates/simple/<id>/` — simple (basic) templates: `wolf-dance`.
   - `src/templates/modular/<id>/` — modular (custom) templates: `garden`, `garden-midnight`.
   - `loadSimpleTemplate(id)` looks only in `simple/`. `loadTemplate(id)` (the `/templates/<id>` page) tries both.
   - Template ids stay unique across both folders. Adding a template is still adding one folder, no registration.
   - `TemplateCard.tsx` stays at the root of `src/templates/`; it only draws simple templates, so it imports from `simple/`.
2. **Cap the modular invitation at 1280px wide.**
   - The top bar, sections and footer stop at 1280px, centred, on a plain `--m4` ground (a step darker than the page), with a soft shadow in the palette's `--m8` (`elevation-band`). No border.
   - On the guest page: only visible when the invitation is wider than 1280px.
   - In the editor: the viewing area keeps its padding (none at the bottom) but takes the invitation's `--m4` as its ground; the rounded frame (border, corners, `elevation-page`) goes. The invitation itself is the 1280px column with its own shadow, so its scrollbar sits at the column's edge (`ModularInvitation`'s `framed`).
3. **Ground patterns.**
   - A new shared library, `src/modular/patterns/<id>.ts`, found by id like palettes (`loadPattern`). A pattern is its Tailwind classes, in palette roles only. Ids are permanent.
   - A modular template names one in its preset (`pattern: "dots"`); none means a plain ground. Not host-switchable yet.
   - `dots`: small `--m5` polka dots (1.5px), each row offset half a step (28px tile, second layer at 14px 14px), over the `--m4` ground.
   - Garden uses dots; Garden Midnight stays plain.
   - Shown wherever the ground shows: around the column on a wide guest screen and in the editor's viewing area. Never on sections. `groundClasses` in `src/modular/styles.ts` is the one place the ground is written.
4. **The top bar becomes a section.**
   - `src/modular/sections/top-bar/`: required, first (`order: 0`), no menu label. Today's bar is its `classic` variant (moved from `components/modular/ModularTopBar.tsx`).
   - `ModularInvitation` draws it straight in the column, not in a `<section>`, so it stays sticky; a bar-height placeholder while it loads.
   - Its variants get `nav` (links, drawer open, open the drawer) in `VariantProps`, like RSVP's `onRsvp`. Every variant keeps the bar's height (`h-14 @5xl:h-16`).
   - A `mark` field (max 24): empty means the hosts' initials. Host editing comes in phase 2.
   - Garden lists it first; Garden Midnight inherits it. The footer and the drawer stay part of the page.
5. **No shadow on the editors' side panel** (simple, modular and print): `elevation-panel` removed; the panel's edge line stays.
6. **Fix: jumping to RSVP shifts the whole editor page up.**
   - Clicking RSVP in the top bar or the cover's RSVP button cuts off the top of the editor; only a refresh brings it back.
   - Cause: anchor jumps scroll every scrollable ancestor, and `overflow: hidden` boxes can still be scrolled by the browser, just with no scrollbar.
   - Fix: those wrapping boxes use `overflow: clip` instead, so only the invitation's own scroll area moves. Covers the sections drawer's jumps too.
   - Check the guest page for the same issue.

## Notes

- Not in scope: editing sections, palette / font switching, RSVP questions.
- Update `context/repo-map.md` (Templates section) in the same commit.

## History

<!-- Keep this updated latest to earliest -->

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
