# Current Feature

Remove the Invitations page; add tabs to the invitation editor.

## Status

Completed

## Goals

- Remove the dashboard Invitations page (`/dashboard/invitations`) and its nav item.
- Archive it, not delete it: page, `InvitationCard`, `InvitationGroups` and its `Invitations` / `Nav.invitations` / `Meta.invitations` texts move to `archived/invitations-page/`, same paths, with a README on how to restore.
- `archived/` is git-ignored, left out of TypeScript, ESLint and Prettier, and never read unless asked.
- Events list: Edit invitation goes straight to the editor at `/invitations/[id]`; Print goes to `/prints/[id]`. Both disabled without a design; Edit invitation also disabled for past events.
- BACK on the invitation editor and print page falls back to the events list.
- Event row: picture on the left, centred; beside the details its height is set to 40% of the card's width, at most 500px, so it shrinks with the card; stacked, it is the column's width, at most 352px — never sized by the image file itself; beside it one column holding title, date and package over a hairline and the details under them (Sharing, Replies, Dates that matter, split by hairlines), centred against the picture — side by side from 900px card width, stacked below; from 1200px card width the actions have a far-right column of their own (25% of the card up to 280px), spread evenly within at most 460px and centred. Below 1200px the actions drop to a row across the whole card: from 500px two columns 40px apart, filled top to bottom (Edit event, Guest list, Seating | Edit invitation, Print, View as guest); a single stack below 500px. The actions are one set in this order — Edit event, Guest list, Seating, Edit invitation, Print, View as guest — each an icon + label + arrow block styled like the sharing fields (`mustard-50` fill, `mustard-300` border shared between neighbours, 13px `neutral-900` text at weight 450, `neutral-700` icons, `mustard-300` on hover). Sections pad 32px top and bottom (the picture 24px; the title block 32px above and under its package line) while stacked, 40px from 900px, 48px from 1000px, 20px at the sides (40px from 1000px); the card itself has no padding.
- On phones, where everything stacks, the title, date and package come first, above the picture.
- Dates that matter use short month names (5 Sept 2026 / 5 sept. 2026 / 2026. szept. 5.) via `SHORT_DATE_PARTS` in `src/lib/event.ts`.
- Invitation editor panel: a header row of three tabs — Text (the card's fields), Response (the reply panel's fields), Design ("coming soon" for now) — and the X as a fourth segment, styled as host-bar segments (`PANEL_TAB` / `PANEL_CLOSE` in `styles.ts`), no outline, `rounded-sm`, 12px padding (8px at the sides below 500px screens). The row sticks to the top while the form scrolls; it runs edge to edge below 1000px and sits in 24px top/bottom, 12px side padding from 1000px. The form starts at the top, up to 640px wide, 32px above it below 1000px. The print page's panel keeps its plain X.
- Response tab: a hint under the message saying it shows beside the invitation on larger screens only (`HostEditor.rsvpMessageHint`).
- View button in `--c2` with `--c5` hover, like the reply form's Send.
- The note under the guest's thank-you title is balanced.
- Dashboard nav: no Studio section. Hosting holds Home, Events, Downloads (was Print & downloads, `/dashboard/downloads`, download icon) and Templates. No count badge on Events.

## Notes

- Next steps (not in this feature): template switching in the editor for Free / Standard; for Custom, choosing simple or modular templates and editing the modular one.
- `invitations` stays a reserved slug — the editor route still uses it.

## History

<!-- Keep this updated latest to earliest -->

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
