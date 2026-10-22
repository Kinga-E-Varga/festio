# Current Feature: Database step 2 — Reads

## Status

Completed

## Goals

- The app reads its data from the Firestore emulator instead of `src/mock/`: dashboard
  home, event pages (overview, details, guests), the invitation and print editors, and the
  guest invitation page (`invite/[invite]`, found through its slug card).
- Reads go through the Admin SDK on the server (`src/db/admin.ts`), parsed with the Zod
  schemas in `src/db/schemas/`.
- Pages look and behave the same as on mock data, on the seed's events.
- `GuestQuestion` in `src/types/guests.ts` is derived from `questionSchema` instead of
  repeating it, when the guest list moves over.
- An event with a template but no invitation card yet (the seed's Revelion) opens with the
  template's own starting state.
- A deleted event's leftover card (the seed's Cumetrie) still shows, with zero counts.
- Mock data no longer used by any page is removed from `src/mock/` (what's left there is
  only what isn't data, e.g. nav keys).
- **No writes yet:** saving stays as it is today. Host saves are step 4.

## Notes

- Spec: `context/features/pending/database.md` — step 2 of its **Order**. The document
  shapes there are settled apart from its Open list; don't re-open them.
- **No auth yet** (step 3): decided — the seed host (`host-maria`) as a fixed dev user
  until sign-in exists.
- Decided: the Overview draws the invitation live (no saved pictures); latest replies come
  from the reply cards; the "new since your last visit" badge is hidden until a last visit
  is stored.
- Live updates (`onSnapshot` from the host's browser) need the Firestore rules, which stay
  closed until step 6, so for now every read is a server read.
- Things worked out, never saved: countdown, locked, Active / Draft / Past, closes in. No
  time, venue or address on the event; `seedValues` stops copying them.
- Seed and runner: `seed/`, `npm run emulators`, `npm run seed`.
- Update `context/repo-map.md` for any route, `src/lib/` file or folder move, and the
  `src/db/` / `src/mock/` lines once the app reads the database.
- Plan: `context/plans/database-step-2-reads.md`
- Simplify: ran 2026-10-22
