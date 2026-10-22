# Current Feature: Dates across a clock change

## Status

Completed

## Goals

- Add `addDays(value: Date, days: number): Date` to `src/lib/event.ts`: moves the calendar
  day and keeps the wall-clock time (`new Date(y, m, d + days, hours, minutes)` from the
  date's own parts). Days, not hours.
- `deletionDate` = `addDays(event day at 00:00, GUEST_DATA_RETENTION_DAYS)`.
- `defaultReplyClose` = `addDays(event day at 00:00, -1)`.
- Seed's blocked-slug date (`seed/index.ts`) = `addDays(deletionDate(...), SLUG_BLOCK_DAYS)`.
- Leave the length-of-time rules alone: `spanBetween`, `spanFrom`, `replyWindow`'s "closing
  soon" window, the modular countdown (`src/modular/content.ts`), the seed's `dayFromNow` /
  `momentFromNow`.

## Notes

Spec: `context/fixes/clock-change-dates.md`. Branch: `fix/clock-change-dates`.

- Simplify: ran 2026-10-22

**Problem:** both rules add or take away whole days as fixed 24-hour blocks (`DAY_MS`). A
day with a clock change is 23 or 25 hours, so the result lands an hour off — at midnight,
the day before.

- Majorat (8 October 2026) is deleted on 6 December, 23:00 instead of 7 December (clocks go
  back 25 October).
- An event on 26 October 2026 closes replies at 24 October, 23:00 instead of 25 October,
  00:00.

Seen in `RetentionInfo`, `DatesThatMatter`, the "export your data" alert (`notices.ts`, which
also adds ", 23:00" since `formatDeadline` only drops the time at midnight), `DangerZone`,
the event form's cut-off (`useEventForm`) and the closing notice's "can still move" check.

**Not in this fix:** the rules still run on the server's clock. Running them on the event's
own `timeZone` is the separate time-zone work (`context/features/pending/database.md` →
Order, step 2). This fix stays correct after that.

**Check:**

- `/dashboard`: Majorat's alert reads "deleted on 7 December 2026", no time.
- `/dashboard/events/majorat-ana`: Data and privacy and Key dates both say 7 December.
- Scratch check with `TZ=Europe/Bucharest`:
  - `defaultReplyClose("2026-10-26")` → 25 October, 00:00.
  - `deletionDate("2026-10-08")` → 7 December, 00:00.
  - No clock change in between gives the same as before, e.g. `deletionDate("2026-06-01")`
    → 31 July.
- `npm run seed` still runs; Cumetrie's `blockedUntil` falls at 00:00.
- `npm run build` passes.
