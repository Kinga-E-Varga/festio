# Current Feature: Count only what a reply changes

## Status

Completed

## Goals

- A guest's reply no longer reads every reply of the event inside its transaction. It reads
  only the cards its names can affect, plus the list card and the seating chart, and adds
  the difference it makes to the event's `counts`.
- Each reply card stores its people's names normalized (`normalizeName`: case, accents,
  spaces) as `nameKeys`, set by the server on every write (guest reply, host save, seed).
- The reply's transaction reads: the replies whose `nameKeys` share one of the new reply's
  (`array-contains-any`, at most 10 names a reply, under Firestore's 30), the list card, any
  reply matched by the host to a list name with one of those keys, and the seating chart.
- It counts that small group with `countsOf` before and after the new reply and adds the
  difference to `counts`. Same function as everywhere else, so the two ways can't count
  differently.
- The cap check uses the event card's stored `counts`, not a recount.
- The guest list page's recount (`repairCounts`) stays as the safety net.
- `npm run build` passes; on the emulator a guest reply's counts match a full recount,
  including same-name replies, list matches and seated names.

## Notes

- From `context/features/pending/database.md`, Do later item 2. At close out, mark it there
  `Done (<commit message>)`.
- The list is one card now (Do later item 1, done), so list names need no `nameKeys`: the
  reply reads the whole list and filters it in memory.
- A data-shape change: new field(s) on reply cards and the seed. No real data yet, so no
  migration script.
- Doesn't help guests replying at the same second: every reply writes the event card's
  counts, so they queue either way.
- Host saves (`writeGuestChanges`, event settings, list switch) keep recounting the whole
  event; only the guest reply gets the small read.
- Decided: each reply card also stores `listNameIds` (its people's matched list name IDs,
  set by the server), since Firestore can't query inside `people`. A second
  `array-contains-any` query reads the replies matched to the affected list names.
- No plan: test against a full recount on the emulator (same-name replies, list matches,
  seated names).
- Simplify: ran 2026-10-23
