# Dates across a clock change

One small fix, one commit, on its own branch (`fix/clock-change-dates`).

## Problem

Two date rules add or take away whole days as fixed blocks of 24 hours (`DAY_MS`). A day
with a clock change is 23 or 25 hours long, so when one falls in between, the result lands
an hour off. At midnight, an hour off is the day before.

- **`deletionDate(date)`** (`src/lib/event.ts`): the event day at 00:00 plus
  `GUEST_DATA_RETENTION_DAYS × DAY_MS`. Majorat (8 October 2026) gives **6 December,
  23:00** instead of **7 December**. The clocks go back on 25 October, in between.
- **`defaultReplyClose(date)`** (same file): the event day at 00:00 minus `DAY_MS`. An event
  on 26 October 2026 closes at **24 October, 23:00** instead of **25 October, 00:00**.

Where the host sees it:

- **The deletion date shows the wrong day** in Data and privacy (`RetentionInfo`), Key
  dates (`DatesThatMatter`), the "export your data" alert (`notices.ts`) and Cancel or
  delete (`DangerZone`). The alert also adds a time (", 23:00"), because `formatDeadline`
  only leaves the time out at midnight.
- **The default reply close** is an hour early, and shows a time it shouldn't. The event
  form's cut-off (`useEventForm`) and the "can still move" check in the closing notice
  use it too.

## Fix

- Add `addDays(value: Date, days: number): Date` to `src/lib/event.ts`. It moves the
  calendar day and keeps the wall-clock time:
  `new Date(y, m, d + days, hours, minutes)` from the date's own parts. Days, not hours.
- `deletionDate` = `addDays(event day at 00:00, GUEST_DATA_RETENTION_DAYS)`.
- `defaultReplyClose` = `addDays(event day at 00:00, -1)`.
- The seed's blocked-slug date (`seed/index.ts`, `deleted + SLUG_BLOCK_DAYS × DAY_MS`) is
  the same mistake: use `addDays(deletionDate(...), SLUG_BLOCK_DAYS)`.

**Leave as they are.** These measure lengths of time, where 24 hours is right:

- `spanBetween` (rounds to whole days)
- `spanFrom`
- `replyWindow`'s "closing soon" window
- the modular countdown (`src/modular/content.ts`)
- the seed's `dayFromNow` / `momentFromNow`

## Not in this fix

The rules still run on the server's clock. Running them on the event's own `timeZone` is
the separate time-zone work (`context/features/pending/database.md` → Order, step 2). This
fix stays correct after that change.

## Check

- `/dashboard`: Majorat's alert reads "deleted on **7 December 2026**", with no time.
- `/dashboard/events/majorat-ana`: Data and privacy and Key dates both say 7 December.
- A scratch check with the dev machine's clock (a zone with a clock change, e.g.
  `TZ=Europe/Bucharest`):
  - `defaultReplyClose("2026-10-26")` is 25 October, 00:00.
  - `deletionDate("2026-10-08")` is 7 December, 00:00.
  - Dates with no clock change in between give the same result as before, e.g.
    `deletionDate("2026-06-01")` is 31 July.
- `npm run seed` still runs; Cumetrie's `blockedUntil` falls at 00:00.
- `npm run build` passes.
