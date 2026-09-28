# Current Feature: Guest Summary

The Summary section at the top of an event's guest list page: the numbers a host plans with.

## Status

Completed

## Goals

- A table-like grid of small label/number tables (no bar or meter), three columns wide, one on mobile, laid out against the section's width
- Replies: Coming, Not coming, and Waiting for a reply when the preloaded list is on — counted in people
- Age of people coming: Adults / Children / Babies — no Skipped row, age is required
- Dietary needs of people coming: one row per diet in use, including Other (the guest writes their own; the summary shows only "Other", the row shows the words); no "No needs" row
- One block per custom question, driven by the data: choice = a row per option, yes/no = Yes/No, free text = "X answered"; no Skipped row; no per person / per reply hint
- Messages: "X guests left you a message", once per reply
- Replies, Age and Dietary needs always show; custom answers and Messages sit behind a "Show / Hide more answers and messages" toggle under them, closed by default
- Rows with 0 hidden, except Coming and Not coming; numbers live from the rows
- Mock questions and answers on `logodna-ana-vlad` (Main course, Accommodation, Song request), with some skips; Gheorghe gets an age
- Remove the `attendeeNotes` line under the Guest list header on this page; filter chips keep their numbers

## Notes

- Spec: `context/features/guest-summary.md`
- Mock only — not a Firestore schema. Answers keyed by permanent question IDs; missing = never asked, null = skipped
- Keep the Logodnă event's type and tier as they are
- Out of scope: custom answers in the guest list rows, archived questions, a question editor

## History

<!-- Keep this updated latest to earliest -->

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
