# Current Feature: Preloaded Guest List

The add-names box on the guest list page becomes an editor for the whole preloaded list.

## Status

Completed

## Goals

- Paste names, **Add X names** moves them into the list below; the repeats check runs here, against the whole draft
- The list shows every name, new and saved together, A→Z; scrolls inside the box, 2–3 columns on desktop
- Waiting and new names get an ×; names with a reply show "replied" instead
- Cancel / Save top right; nothing saved until Save; Save applies only the difference
- Save with unadded text shows a note with **Add them**; Cancel with changes asks to discard

## Notes

- Spec: `context/features/preloaded-guest-list.md`
- Table deletes unchanged: deleting a reply keeps its list name; deleting a waiting row removes the name
- Out of scope: renaming in the box, undo per removal, removing replied names from the box

## History

<!-- Keep this updated latest to earliest -->

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
