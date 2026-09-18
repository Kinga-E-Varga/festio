# Current Feature: Events list — "Edit invitation" label + safeguard/dates info

<!-- One line: what is being built or fixed. -->

The events list row's second action button reads "Invitation" with no
information backing it up. Rename it to "Edit invitation" and give the row
the same safeguard bar and "Dates that matter" info the event detail page
(`EventSummary`) already shows, so a host can see freeze/close/deletion
dates without opening the event.

## Status

In Progress

## Goals

<!-- What must exist when this is done. -->

- `EventRow`'s second button reads "Edit invitation" instead of "Invitation".
- Active/draft rows in the events list show the safeguard bar (attending vs.
  declined against the cap) once replies exist, matching `EventSummary`.
- Active/draft rows show a "Dates that matter" block: Editing freezes, Reply
  form closes, Record deleted — same wording/data as `EventSummary`.
- The safeguard bar markup and the three `DateNote`s are shared components so
  `EventSummary` and `EventRow` render identical info from one place, per the
  "single-place edits" principle.
- `npm run build` and `npm run lint` pass.

## Notes

<!-- Decisions, constraints, open questions, known limitations. -->

- Reused `contentFreeze`, `deletionDate`, `formatEventDate`, `formatStamp`,
  `safeguardBarVars` from `src/lib/event.ts` — no new date maths needed.
- Extracted `DatesThatMatter` (the three `DateNote`s) and `SafeguardBar` (bar
  + "Safeguard X of cap" label) out of `EventSummary.tsx` into their own
  components under `src/components/dashboard/`, then used by both
  `EventSummary` and `EventRow`.
- Past rows are untouched — they already show their own deletion line and
  have no action buttons.
- The "Edit invitation" button stays unwired (no `href`/`onClick`) — the
  invitation editor route isn't part of this fix.

## History

<!-- Keep this updated latest to earliest -->

- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
