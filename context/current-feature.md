# Current Feature: Guest list on one card

## Status

Completed

## Goals

- Every pre-loaded name of an event lives on one card (e.g. `events/<event>/guestList/names`)
  instead of one card per name. Each name keeps its permanent ID, its name and its sent flag.
- A guest's reply, the guest list page and the dashboard read the list with one read, not one
  per name.
- One `version` for the whole list. A second device saving the list after another gets
  "changed on another device", even if they edited different names.
- Seating and matching keep pointing at the same name IDs.
- `GuestChanges` / `ReplyInput` (`src/types/guests.ts`) come from a Zod schema in
  `src/db/schemas/`, not written out by hand. The save checks with that schema.
- The seed writes the new shape. No real data yet, so no migration script.
- `npm run build` passes; the guest list page, its saves and a guest's reply work on the
  emulator as before.

## Notes

- From `context/features/pending/database.md`, Do later item 1. At close out, mark it there
  `Done (<commit>)`.
- About 120 bytes a name, so roughly 8,000 names fit in a card's 1 MB.
- Touches: the guest list schema (`src/db/schemas/guest-list.ts`) and path
  (`src/db/paths.ts`), `readGuests` (`src/db/reads/guests.ts`), `guestListCount`
  (`src/db/reads/events.ts`, today a `count()` query), the names stage of
  `writeGuestChanges` (`src/db/writes/guests.ts`), `readCountInputs`
  (`src/db/writes/counts.ts`), `deleteEventData` (`src/db/writes/delete-event.ts`), the seed
  (`seed/index.ts`), and the guest list page's per-name versions, which become one.
- Shape (decided): `events/<event>/guestList/names` holds `names: [{ id, name, sent }]`, in
  the host's order, and `version`. IDs unique, checked by the schema.
- Simplify: ran 2026-10-23
