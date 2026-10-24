# Current Feature: Cost check

## Status

Completed

## Goals

- **Every Firestore read and write is counted** per request, in dev only, at the source
  (around the Admin SDK in `src/db/admin.ts`, or the reads and writes), so a new read can't
  slip past. Transactions' reads count too. Off in production, no cost there.
- **Pages are measured in the real app** (`next start` on the emulators, signed in as the
  seed host), since the page reads use React `cache()` and `connection()`. The writes are
  measured directly, like the regression tests.
- **Fixed situations, each measured once:**
  - host pages: dashboard Home, Event Overview, guest list page, event editor, invitation
    editor, print page, landing page signed in
  - host saves: event settings, invitation, guest list (one reply edited), mark replies seen
  - guest: open a Public invitation, a Protected one (locked and unlocked), send a reply
    (new name, a name already replied, a pre-loaded name)
- **A realistic month:** with one bigger event (about 150 invited, 80 replies) and a few
  events per host, the counts become a month's use (e.g. the host opens the dashboard 40
  times, each guest opens the page 3 times), compared to Firestore's free daily allowance:
  how many such events a day fit before Festio pays, and roughly what one event costs after
  that.
- **Baseline:** the result is saved as a table in the repo (situation → reads, writes). Each
  run compares to it and points out anything that went up; updating it is a deliberate
  step.
- **Looked at closely,** each either fixed in its own `fix/` or noted why it's fine:
  - the dashboard reading the whole guest list of each event whose form is closing
  - every dashboard page's replies query and template load per event
  - how often `loadHostId`'s `verifySessionCookie(…, true)` runs (its network cost is
    measured at step 6)
  - `refresh()` after every guest list save re-rendering the whole dashboard
  - the latest replies' Unknown / Duplicate tags reading guest lists
  - the guest list page loading every reply
  - guests replying at the same moment (20 at once took 4–14 s on the emulator); measured
    again on `festio-dev` at step 6
- **Who sees what, on pages:** using the running app, page tests added to `npm test` (they
  run with the regression tests, not with the cost check):
  - host B opens host A's event (dashboard, editors, guest list, print) → not found
  - signed out, a host page → sign-in
  - a Hidden invitation link → not found
  - a Protected invitation → the password screen, never the invitation or its title;
    unlocked, the invitation
  - a cancelled invitation → the host's message only

## Notes

- Spec: `context/features/pending/quality-checks.md`, item 2. At `/feature complete`, change
  its `To do` to `Done (<commit message>)`.
- Branch: `chore/cost-check`.
- Runs on the local emulators only, never a real project. Reuses the regression tests'
  setup (Vitest, the test emulator, `tests/helpers/`).
- The seed already has a large event (`botez-sofia`: 70 expected, 105 people replied); check whether it
  can serve as the "bigger event" before adding one.
- Test guards apply (`context/ai-interaction.md`): any fix to a read or write found here is
  test-first; the page tests' expected results come from the spec, not from the pages.
- Keep it small: a handful of situations that matter.
- Plan: `context/plans/cost-check.md`
- Simplify: ran 2026-10-24
