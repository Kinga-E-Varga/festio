# Current Feature: Keep "who hasn't replied" as a counter

## Status

Completed

## Goals

- The event's `counts` gain `waiting`: the pre-loaded names that no reply matches.
- `countsOf` keeps `waiting` up to date, like the other counts, on every save that changes
  replies or the guest list.
- Host pages read none of the replies or the guest list to show who hasn't replied
  (`waitingCounts` in `src/db/reads/dashboard.ts` reads `counts.waiting` instead).
- `npm run cost` goes down (now 53 reads on the landing page, 38 of them from this); then
  `COST_UPDATE=1 npm run cost` saves the new baseline.

## Notes

- Spec: `context/fixes/pending/dashboard-reads.md`, item 1. Branch `fix/waiting-counter`.
  At `/feature complete`, mark item 1 there `Done (<commit message>)`.
- **Now:** for each event whose form is closing soon, host pages read every reply and the
  guest list, only to count who hasn't replied. A 300-guest wedding near its close costs
  every host page view a few hundred reads.
- **A data-shape change:** the event schema, the seed, and a one-off script if real data
  exists by then. Check with the user before changing the schema.
- Test-first (`src/db/writes/`, `src/lib/`): tests from the spec with hand-worked expected
  values, then the code. `npm run cost` before and after.
- Item 2 (`fix/latest-replies-reads`) is a separate fix, loaded after this one.
- Simplify: ran 2026-10-24
