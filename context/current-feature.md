# Current Feature: Regression tests

## Status

Completed

## Goals

- Vitest set up, running inside the emulators (`firebase emulators:exec`), each test file on
  a fresh seed; one command, `npm test`
- **Counts never drift:** a few hundred random actions on one event (guest replies; host
  adds / edits / deletes / separates a reply; pre-loaded names added, removed or matched).
  After each one, the stored `counts` equal a full recount (`countsOf` on every reply).
  Random but repeatable: a fixed seed number, printed on failure
- **Replies at the same time:** about 20 guests sending at once near the cap. Each reply is
  either saved or told the form is paused; the total passes the cap only by the allowed
  one-reply overshoot; the counts still match a recount
- **Guest reply rules** (`writeGuestReply`): sent twice with the same ID → saved once; the
  6th reply in an hour from one visitor → refused; after the closing time → refused, checked
  in a time zone other than the server's; Hidden → not found; Protected without the unlock
  cookie → refused; cancelled → refused
- **Password tries:** the 11th wrong password in an hour → refused; a right one counts as no
  try
- **Two devices:** a save with an old `version` is refused, for the event, invitation and
  guest list cards
- **Time rules** (`src/lib/event.ts`): reply closing, date lock and deletion date on the
  event's own clock, including a clock-change weekend. Plain functions, no emulator
- `CLAUDE.md`'s "no test setup" line and the `feature` skill's `test` action updated

## Notes

- Spec: `context/features/pending/quality-checks.md`, item 1. At `/feature complete`, change
  its `To do` to `Done (<commit message>)`.
- Branch: `chore/regression-tests`.
- Test the writes directly (`src/db/writes/`): they run without Next or React. No browser,
  no Server Actions.
- Not here: page tests (built with check 2, the cost check, which sets up the running app;
  they then join this runner) and the Firestore / Storage rules tests (step 6, also join this
  runner then).
- Keep it small and fast: a slow or flaky suite stops being run.
- Tests run on the emulators only, never a real project.
- Plan: `context/plans/regression-tests.md`
- Simplify: ran 2026-10-24
