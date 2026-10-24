# Quality checks

Three checks to run again after any bigger change, so we know the app still works, still
costs what we expect, and is still easy to use. Written after database steps 1–5, before
step 6.

| Check               | Kind                                  | Runs                          |
| ------------------- | ------------------------------------- | ----------------------------- |
| 1. Regression tests | Automatic, pass / fail                | By hand now, in CI at step 7  |
| 2. Cost check       | Automatic, compared to a saved table  | By hand after bigger changes  |
| 3. UX walk-through  | A checklist, judged by a person       | By hand after bigger changes  |

All three run against the local emulators with the seed (`npm run emulators`), never a real
project. Keep each one small: a handful of situations that matter. A slow or flaky suite
stops being run.

## To do

Load one at a time (`/feature load`), each on its own branch, in this order: 2 reuses 1's
setup.

**When one is finished** (at `/feature complete`), mark it here: change its `To do` to
`Done (<commit message>)`, so this list never needs rechecking against the code.

1. **Done (`chore: regression tests`) — regression tests** (`chore/regression-tests`).
   - **Set up:** Vitest (decided), started inside the emulators (`firebase emulators:exec`),
     each test file on a fresh seed. One npm script, e.g. `npm test`. Update `CLAUDE.md`'s
     "no test setup" line and the `feature` skill's `test` action.
   - **Test the writes directly** (`src/db/writes/`): they run without Next or React. No
     browser, no Server Actions.
   - **Counts never drift.** A few hundred random actions on one event: guest replies, host
     adds / edits / deletes / separates a reply, pre-loaded names added, removed or matched.
     After each one, the event's stored `counts` equal a full recount (`countsOf` on every
     reply). This is the main check that a guest's reply counting only its group
     (`countsWithReply`) is right. Random but repeatable: a fixed seed number, printed on
     failure.
   - **Replies at the same time:** about 20 guests sending at once near the cap. Every reply
     is either saved or told the form is paused; the total passes the cap only by the
     allowed one-reply overshoot; the counts still match a recount.
   - **Guest reply rules** (`writeGuestReply`): sent twice with the same ID → saved once;
     the 6th reply in an hour from one visitor → refused; after the closing time → refused,
     checked in a time zone other than the server's; Hidden → not found; Protected without
     the unlock cookie → refused; cancelled → refused.
   - **Password tries:** the 11th wrong password in an hour → refused, a right one still
     counts as no try.
   - **Two devices:** a save with an old `version` is refused, for each card that has one
     (event, invitation, guest list).
   - **Time rules** (`src/lib/event.ts`): reply closing, date lock and deletion date on the
     event's own clock, including a clock-change weekend. Plain functions, no emulator.
   - **Not pages:** only the writes and plain functions. Pages need the running app; their
     tests are built with check 2, which sets that up, and join this runner then.
   - Not here: the Firestore / Storage rules tests. They come with step 6 and join this
     runner then.

2. **To do — cost check** (`chore/cost-check`).
   - **Count every Firestore read and write** a request makes, in dev only. Count at the
     source (around the Admin SDK in `src/db/admin.ts`, or the reads and writes), so a new
     read can't slip past. Transactions' reads count too. Off in production, no cost there.
   - **Pages need the real app:** the page reads use React `cache()` and `connection()`, so
     they're measured by requesting the pages from a running app (`next start` on the
     emulators), signed in as the seed host. The writes can be measured directly, like in
     check 1.
   - **Fixed situations**, each measured once:
     - host: dashboard Home, Event Overview, guest list page, event editor, invitation
       editor, print page, landing page signed in
     - host saves: event settings, invitation, guest list (one reply edited), mark replies
       seen
     - guest: open a Public invitation, a Protected one (locked and unlocked), send a reply
       (new name, a name already replied, a pre-loaded name)
   - **A realistic month:** the seed gets one bigger event (about 150 invited, 80 replies)
     and the host has a few events. The check turns the counts into a month's use (e.g.
     the host opens the dashboard 40 times, each guest opens the page 3 times) and compares
     it to Firestore's free daily allowance. Says how many such events a day fit before
     Festio pays, and roughly what one event costs after that.
   - **Baseline:** the result is saved as a table in the repo (situation → reads, writes).
     Each run compares to it and points out anything that went up; updating the baseline is
     a deliberate step, done when the increase is accepted.
   - **Look closely at,** and either fix in its own `fix/` or note why it's fine:
     - the dashboard reading the whole guest list of each event whose form is closing
     - every dashboard page's replies query and template load per event
     - `loadHostId`'s `verifySessionCookie(…, true)` on every host request (the network
       part is measured at step 6; count how often it runs here)
     - `refresh()` after every guest list save re-rendering the whole dashboard
     - the latest replies' Unknown / Duplicate tags reading guest lists
     - the guest list page loading every reply
     - **guests replying at the same moment:** on the emulator, 20 at once took 4–14 s (they
       queue on the event card's counters; `tests/writes/cap-race.test.ts`). Measure it again
       on `festio-dev` once it exists (step 6): how long a guest waits, and whether any reply
       fails instead of waiting (the guest would see "failed").
   - **Who sees what, on pages:** with the running app set up, add page tests to check 1's
     Vitest runner (they run with `npm test` and in CI, not with the cost check):
     - host B opens host A's event (dashboard, editors, guest list, print) → not found
     - signed out, a host page → sign-in
     - a Hidden invitation link → not found
     - a Protected invitation → the password screen, never the invitation or its title;
       unlocked, the invitation
     - a cancelled invitation → the host's message only

3. **To do — UX walk-through** (`chore/ux-walkthrough`).
   - **A checklist file** of situations, each with how to get there (seed event, steps) and
     what to look for. Lives with the tests, so it's updated with them.
   - **Two people:**
     - a guest who isn't good with tech, on a phone: opens a Protected link, types the
       password wrong, then right; replies for a family of 5 with diets and ages; loses the
       network mid-send and sends again; finds the form closed, paused at the cap, or
       rate-limited; opens a cancelled event; a Hidden link
     - a busy host, on desktop and phone: signs up, makes an event, saves the invitation
       public (the save warning); enters a phone RSVP; sorts out Unknown and Duplicate
       replies; gets "changed on another device" while editing; tries to move the date on
       the event day; cancels and reopens an event
   - **For every message and screen, three questions:** does a normal person understand
     it, do they know what to do next, is anything they typed lost?
   - **Screenshots:** a Playwright script that sets up each state and takes a picture at
     phone and desktop width, so a walk-through is looking at pictures, not clicking through
     every state. Build it only for the states that are slow to reach by hand.
   - **First run's result:** the rough spots, ranked by how often they'd happen and how much
     they'd hurt. Each one worth fixing becomes its own `fix/`; the rest are noted as
     accepted.

