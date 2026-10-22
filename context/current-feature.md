# Current Feature: Database step 1 — Emulators, schemas and seed data

## Status

Completed

## Goals

- Firebase emulators for Firestore, Auth and Storage run locally with a `demo-` project
  ID (no real Firebase project), started by one npm script. Functions joins with the first
  Cloud Function.
- Zod schemas for every card in `context/features/pending/database.md` → Data: event,
  invitation (simple and modular), reply (with `people`), guest list, user, slug, seating
  chart, payment, rate limit.
- A seed folder kept in git (a few events, replies, a guest list), loaded when the
  emulators start, so everyone starts from the same data.
- An env variable that tells the app to use the emulators.
- **No app changes yet:** the app still reads `src/mock/`. Reading from the emulator is step 2.

## Notes

- Spec: `context/features/pending/database.md` — step 1 of its **Order**. The document
  shapes there are settled apart from its Open list; don't re-open them.
- **Tools:** the Firebase CLI is a dev dependency (`npx firebase`), Java 25 is installed.
- The seed data comes from `src/mock/dashboard.ts` and `src/mock/guests.ts`, reshaped to the
  new cards (no time, venue or address on the event; answers stored once per reply, not
  per person; no stored Unknown/Duplicate tags).
- Time zone on each seeded event (e.g. `Europe/Bucharest`).
- The retention period stays `GUEST_DATA_RETENTION_DAYS` in `src/lib/config.ts`; nothing
  stores a deletion date.
- Decided (now in the spec): `package` = what's bought, paid is worked out; `cancelled`
  on the event card; `differentPerson` on each person in a reply.
- Update `context/repo-map.md` for any new `src/lib/` file or top-level folder.
- Simplify: ran 2026-10-22
