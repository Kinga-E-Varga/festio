# Current Feature: Step-4 cleanup

## Status

Completed

## Goals

- **One shared save hook for both invitation editors.** `HostInvitationEditor` and
  `ModularEditor` (`src/components/modular/ModularEditor.tsx`) copy the same save flow:
  version, busy guard, save confirm, error toast. Move it into one hook both use.
- **One shared "request failed" helper.** "A failed request becomes `failed` and shows an
  error toast" is written in 6–7 client places (both editors, Danger zone, print, guest list).
  One helper replaces them.
- **One delete-confirm component for the guest list.** `RowView` and `ReplyEditor`
  (`src/components/dashboard/guest-list/`) share the same confirm markup.
- **One `isValidSlug` in `src/lib/slug.ts`.** The event form's link check (`checkLink` in
  `src/components/dashboard/event-editor/useEventForm.ts`) repeats the slug rules. Both it and
  `slugSchema` (`src/db/schemas/event.ts`) use the new plain function.
- **One `parseSnap(schema, snapshot)` in `src/db/reads/parse.ts`.** "The card exists ? parse
  it : missing" is written in five places: `writes/event.ts`, `writes/invitation.ts`,
  `writes/guest-reply.ts`, and `seatedIdsOf` / `guestListOf` in `writes/counts.ts`.

## Notes

- Source: `context/features/pending/database.md`, Do later item 3 (found by the step-4
  review). Tidy-ups, not bugs: behaviour must not change.
- Branch: `chore/step-4-cleanup`.
- Keep `parseSnap` on `parseCard`'s rule: a card failing its schema is logged and read as
  missing.
- `isValidSlug` stays plain (no Zod), so the client form doesn't ship Zod.
- At `/feature complete`: mark item 3 in `database.md` as
  `Done (<commit message>)`.
- Simplify: ran 2026-10-23
