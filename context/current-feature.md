# Current Feature: Every time rule on the event's own clock

## Status

Completed

## Goals

- The two checks against the real "now" use the event's `timeZone`, never the server's clock
  (Netherlands on App Hosting):
  - the guest reply's closing check (`writeGuestReply`);
  - "closes in" (`repliesCloseIn` in `toDashboardEvent`), which also drives the guest page's
    closed state and the dashboard's closing notices.
- One helper, `zonedTime(local, timeZone)` in `src/lib/event.ts`: a wall-clock time in a zone
  → the real moment, with `Intl` only, right across a clock change. `replyCloseAt(event)`
  uses it.
- Everything else stays as it is: it reads a zone-less time and shows or compares it on the
  same clock, so the host sees what they typed. Comments say so.

## Notes

- Source: `context/features/pending/database.md`, Do later item 6. At `/feature complete`,
  change its `To do` to `Done (<commit message>)`.
- Branch type: `fix/`.
- Today only the countdown's "today" (`src/db/reads/events.ts`) and the save's date lock
  (`src/db/writes/event.ts`) use `todayIn(timeZone)`.
- `repliesCloseAt` is stored as a `datetime-local` string with no zone
  (`localDateTimeSchema`); keep it that way and read it in the event's zone.
- Callers to check: `src/db/writes/event.ts`, `src/db/writes/guest-reply.ts`,
  `src/db/reads/events.ts`, `DatesThatMatter.tsx`, `RetentionInfo.tsx`, `notices.ts`,
  `RepliesBox.tsx`, `DangerZone.tsx`, `useEventForm.ts`. Some run in the browser, so the
  rules need the zone passed in (the event has it, or it must be added to `DashboardEvent`).
- Decided: the narrow fix (2 places), not every rule returning a real moment.
- No date library in `package.json` today; `Intl` can do it. Ask before adding one.
- Simplify: ran 2026-10-23
- Step 8 (nightly GDPR job) will reuse `deletionDate`, so it must not depend on the server's
  clock.
