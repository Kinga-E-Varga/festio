# Current Feature: Simplify Codebase

A cleanup pass over the whole of `src/`, one chunk at a time. Quality only — no change in behaviour or looks, no new features.

## Status

Completed

## Goals

- Run a simplify review on each chunk, in this order: `lib` + `types` + `i18n` → `templates` + `mock` → `print` → `invitation` → dashboard shell + widgets → dashboard events + invitations + event pages → `event-editor` → `guest-list` → `app`
- Look for reuse, simplification, efficiency and logic in the wrong place
- Each chunk only edits its own files; ideas that cross chunks are reported, not done
- Never delete a file; leave `messages/*.json` and `context/` untouched (apart from the review file)
- Each chunk must pass `npm run lint` and `npm run build`, or its changes are undone
- One commit per chunk on `fix/simplify-codebase`, squashed into one commit before merging to `main`
- Every chunk writes a plain-language section (problem, fix, files, pages to check) to `context/reviews/2026-09-29.md`
- A final report-only bug hunt over the whole codebase adds a "Possible bugs" section; nothing is fixed

## Notes

- Add `context/reviews/` to the do-not-read rules in `context/ai-interaction.md`
- Reviews are committed, unlike plans

## History

<!-- Keep this updated latest to earliest -->

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
