# Current Feature

React Grab — a dev-only tool: hover an element, press Ctrl+C, and paste its component and file location into Claude Code.

## Status

Completed

## Goals

- Load the React Grab script in both root layouts (`[locale]` and `invite/[invite]`), from one shared component.
- Development only (`NODE_ENV === "development"`). It must never reach a production build.

## Notes

- Loaded from unpkg at dev time, not installed as a package.
- Uses `next/script` with `beforeInteractive`, which must sit in a root layout.

## History

<!-- Keep this updated latest to earliest -->

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
