# Current Feature: Invitation editor rework

The invitation, modular and print editors get one shared top bar in place of the host bar over the card, and their side panels move to Festio's own palette and the event editor's fields instead of the invitation's.

## Status

Completed

## Goals

- New `EditorTopBar` shared by the simple editor, the modular editor and the print page: BACK (dark tone), the event's or template's title, Visibility and reply-count tags (event editor only), the save status ("unsaved" / "no changes" / "saved just now"), one Edit / View toggle and Save — or Export on the print page
- Save is off until something changed; the simple editor tracks saved values to know
- `HostBar` deleted, with its `HOST_*` styles, `ArrowLeftIcon` and the `HostEditor.back` message; one `EditorFrame` (top bar, page, toasts) shared by the three editors; `Invitation` takes `fill` instead of `hostBar`, `ModularInvitation` always fills its parent
- The event editor's save bar shares its buttons (`BAR_OUTLINE`, `BAR_SOLID`, `BAR_DISABLED`) and status dot (`stateDot`) with the top bar
- Side panel in Festio's chrome, never the invitation's palette: `mustard-100` fill, `mustard-300` left edge, Work Sans, a softer `elevation-panel` shadow
- Panel header: tabs (or, on the print page, a "Print settings" title) on one `neutral-700` line, a divider at 25% and the X; X hover `neutral-300`
- Tabs: Text / Replies / Design (was Response); text `neutral-800`; open tab `neutral-800` fill with light text; hover `neutral-300` fill and `neutral-800` edge
- Panel fields use the event editor's `LABEL` / `HINT` and a new `PANEL_INPUT`: `mustard-50` fill, `neutral-400` border, `neutral-700` on hover, `neutral-600` on focus
- Panel View button (small screens) in Save's colours (`BAR_SOLID`)
- Print panel: Flat / Folded as `PANEL_CHOICE_ON` / `OFF` — `neutral-400` border, picked `neutral-300`, both `neutral-400` on hover; the Background checkbox with a `neutral-800` border and tick, `neutral-300` when ticked; form up to 640px wide
- Unused invitation styles removed (`TEXTAREA`, `SELECT`, `VIEW`, `TOGGLE_*`, `PANEL_TABS`, `PANEL_TAB`, `PANEL_CLOSE`); `BTN_DARK_SOFT` removed
- Small app-wide colour fixes: mustard-500 → mustard-400 for the top bar edge, save bar and focus outlines; SideNav quit button; footer search focus; top bar logo as a mask in `mustard-50`, icon hover `neutral-800`
- New messages in EN / RO / HU: `HostEditor.replyCount`, `HostEditor.tabReplies`, `PrintPanel.title`

## Notes

- Save on the simple editor still only shows a toast; no Firestore
- The modular editor has nothing to edit yet, so its Save is always off
- `BAR_DISABLED` was made for the `neutral-900` bar — its `neutral-800` border would vanish on a lighter bar
- Repo map: add `EditorTopBar.tsx` (`EditorTopBar` + `EditorFrame`) under Invitation
- Testing: build + lint; `/invitations/<id>`, `/templates/wolf-dance`, `/templates/garden`, `/prints/<id>` at desktop and mobile in EN / RO / HU; Save on/off and status; View / Edit toggle; panel tabs, fields, choice buttons and checkbox

## History

<!-- Keep this updated latest to earliest -->

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
