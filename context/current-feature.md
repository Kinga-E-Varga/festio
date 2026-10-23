# Current Feature: Database step 5 — guest replies

## Status

Completed

## Goals

- **Shared wrapper for Server Actions first:** sign-in, parse, refusal, refresh written once. Ownership checked once, by `ownEvent` inside the transaction, so actions stop calling `hostEvent` (which reads all the host's events — on the link check, every pause in typing).
- **`writeGuestChanges`** (`src/db/writes/guests.ts`, ~95 lines) split into its three stages (names, reply cards, recount) before the guest reply reuses parts of it.
- **The guest reply transaction:** check the reply cap, save the reply card, update the counters, as one step. Counts with `countsOf` (`src/db/writes/counts.ts`), the same function the host saves and the seed use. Two guests at the same second are handled one after the other; the second can be told the form is paused.
- **No duplicate check for guests:** a same-name reply is saved as sent; the guest list shows it as Duplicate for the host. The guest is never told who already replied (decided: telling them leaks guest data).
- **Closing time:** the form refuses replies after the reply close.
- **Rate limiting:** 5 replies per link per hour per visitor, counted in `rateLimits/` (hashed IP only, TTL after the hour). Over the limit: a friendly "too many tries, please try again in a few minutes".
- **Visibility on the guest page:** Hidden, Protected and cancelled events stop opening as Public.
  - Protected: password typed by the guest, checked on the server, never sent to the browser; wrong guesses limited to 10 per link per hour per visitor. Tab and link preview say "You're invited" until it's typed.
  - Cancelled: header plus the host's short message, form closed.
- **The guest page's recount** (`repairCounts`) works from the replies the page already loaded; the transaction opens only on a mismatch.

## Notes

- Plan: `context/plans/database-step-5-guest-replies.md`
- Spec: `context/features/pending/database.md` (step 5, Rate limiting, Event card → Counters / Protected password, Reply card, Link previews).
- The cap is safety only: it pauses the guest form; the host can always add replies and the counts keep going up. Hidden cap = larger of expected + 50% or expected + 20 (`src/lib/config.ts`).
- Guests never touch the database from the browser: open, password and reply all go through the server.
- Answer rules hold: missing key = never asked, null = asked and skipped; answers stored once on the reply, not copied onto each person; `createdBy: guest`.
- **Decided:** the guest list's saves keep comparing reply cards before and after (`guestChanges`, `src/lib/guests.ts`). The guest reply sends its own "add this reply". Switch to sending each action (separate, match, delete…) only if the comparing causes a real bug.
- **Later, not this step:** Unknown and Duplicate tags in the latest replies. Worked out live (`buildRows`), never stored; they need the event's guest list and all its replies. The feed loads on every dashboard page (the layout's `loadDashboard`), so to keep it cheap: reuse `loadGuests` where it's already read, work the tags out only where the feed shows, and only for the events left in the feed.
- Left as is: who is waiting is worked out, not stored, so the dashboard reads the whole guest list of each active event whose form is closing. Revisit only if it gets slow.
- Decided: at most 10 people per reply; the password screen and the cancelled page use the invitation's own colours and fonts; built inline.
- **Check on `festio-dev` (step 6):** which `x-forwarded-for` entry App Hosting adds (`visitorKey` takes the last one). Send a fake header, log the raw value. If the last entry is a proxy's, every guest shares one limit.
- Simplify: ran 2026-10-23
- Firestore shapes: say so before changing one (`rateLimits/` card shape is new).
