# Current Feature: Modular invitations — Phase 1 (sections and the template page)

A shared library of sections (with variants), palettes and font pairs, and one modular template shown at `/templates/<id>` with the host bar and an empty edit panel. Not linked to events. No Firestore.

## Status

Completed

## Goals

- `src/modular/` with `sections/<id>/` (`index.ts` + one `.tsx` per variant), `palettes/<id>.ts`, `font-pairs/<id>.ts`, and `index.ts` loaders by id (dynamic import, no registration)
- Section definition: permanent `id`, EN/RO/HU name, required/optional, `order` number, optional menu label, fields with sample content (`text`, `longText`, `time`, new `list`)
- 15 sections, one variant each, no photos: cover/full-bleed, title/editorial, date-time/moments, countdown/big-number, location/details, map/legend, schedule/timeline, dress-code/guidance, menu/card, gifts/bank-card, playlist/record, accommodation/list, transportation/ways, faq/accordion, rsvp/simple
- No map embeds: "Open in Maps" links only. No save-to-calendar buttons
- Palettes `terracotta` and `midnight` (`c1`–`c15`, board hex values) as `--m1`…`--m15`, with one mapping in `src/modular/` that fills `--c1`–`--c6`
- Font pairs `classic` (Libre Baskerville + Kantumruy Pro) and `script` (Kapakana + Noto Serif) in `src/lib/fonts.ts`; `primary` = body, `secondary` = headings
- One set of sample invitation basics (hosts, date, venue) in `src/modular/`
- Fixed guest words in a new `Sections` message group (EN/RO/HU)
- Modular templates `garden` (Terracotta + Classic) and `garden-midnight` (Midnight + Script) in `src/templates/<id>/index.ts`; `kind: "simple" | "modular"`, `TemplateModule` a union
- `ModularInvitation`: sticky top bar (initials, menu links, replies close, RSVP), mobile drawer, full-width sections with anchors, privacy footer from `GUEST_DATA_RETENTION_DAYS`
- `ModularEditor` on `/templates/[id]` for modular: same host bar, `SidePanel` with Text / Response / Design tabs all empty; tab row extracted into a shared `PanelTabs`; RSVP sends show the "test reply" toast; loading skeleton; `noindex` kept
- Guest invite, print and invitation pages show not found for a modular template
- Update `context/project-overview.md`: sections, palettes and font pairs are shared libraries; modular templates are presets

## Notes

- Spec: `context/features/modular-1-sections.md`. Visual reference: design canvas "Type 2 Invitation" (https://claude.ai/artifact/4cHNDX7cGjTuVQzEE399WL), pages **Guest page** and **Section options — 15 colours** only
- Section, variant, palette and font-pair ids are permanent; template ids may change
- Variants never declare their own fields; they may show fewer of the section's fields
- Variants render client-side (like `TemplateCard`) so phase 2 can re-render live
- Page speaks the host's locale
- Out of scope: forms, pickers, events, Firestore, images, second variants, rearranging, custom section, modular RSVP questions, section-driven RSVP questions, click-to-load maps, modular print
- Plan: `context/plans/modular-invitations-phase-1-sections-and-the-template-page.md`
- Testing: build + lint; `/templates/garden` and `/templates/garden-midnight` at desktop/mobile in EN/RO/HU; sticky bar, anchors, drawer; panel tabs; RSVP toast; `/templates/wolf-dance` and the guest page unchanged

## History

<!-- Keep this updated latest to earliest -->

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
