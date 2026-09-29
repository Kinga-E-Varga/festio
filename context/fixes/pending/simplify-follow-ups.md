# Fix: Simplify Follow-ups

Everything the simplify run (`context/reviews/2026-09-29.md`) left for later, in two parts:

- **Cleanups (Goals 1–11)** it could not do, because they cross chunks or touch files the run was not allowed to edit (`messages/*.json`, `globals.css`, `context/`). No change in behaviour or looks, apart from the translation fix in Goal 1.
- **Bugs (Goals 12–16)** from the review's "Possible bugs" report. These do change behaviour.

Three bigger bugs from that report have their own specs in this folder: `guest-page-access.md`, `confirm-cancel-delete.md` and `invitation-editor-lock.md`.

## Status

Not Started

## Goals

## Cleanups

### 1. Translate the "done" note in Dates that matter

- `DatesThatMatter.tsx` adds a hardcoded English " — done" after the deletion date, so RO and HU hosts see English
- Add a message key in `en`, `ro` and `hu` and use it

### 2. Move product rules out of the mock data

- `PACKAGES` and `nextPackage` in `src/mock/dashboard.ts` are real product rules (prices, upgrade order), not mock data
- Move them to a new file in `src/lib/` (e.g. `package.ts`)
- Update the imports in `PackageSection.tsx`, `NotificationsRail.tsx` and `[locale]/dashboard/events/[id]/page.tsx`

### 3. Move `NAME_LIMIT` to `src/lib/config.ts`

- It lives in `src/components/invitation/useRsvpForm.ts`, but the guest list editors import it from there too
- Put it next to the other limits in `config.ts`

### 4. Move `VISIBILITY` and remove `EventMeta.tsx`

- The unused `EventMeta` component is gone; the file now only holds `VISIBILITY`, read only by `event-editor/LinkSection.tsx`
- Move `VISIBILITY` next to `LinkSection` (or into `src/lib/` if it fits better there), then delete `EventMeta.tsx`
- Check which message keys only `EventMeta` used (`Event.locksIn`, maybe others) and remove them from all three catalogs if nothing else reads them

### 5. One shared dashboard styles file

- `event-editor/styles.ts` is really the dashboard's shared form and button styles; the guest list imports most of it
- Move it to `src/components/dashboard/styles.ts` and update the imports
- Consider moving the guest list's `fold(open)` helper there too, if it reads better

### 6. Let `HostToday` reuse `DATE_PARTS`

- `HostToday` writes out the same long-date options as `DATE_PARTS` in `src/lib/event.ts`
- The run tried and the build failed: next-intl's date options type is stricter than `Intl.DateTimeFormatOptions`
- Type `DATE_PARTS` so both accept it (e.g. `as const` with the literal values), then reuse it in `HostToday`

### 7. One place for the top bar height

- `CentreOnHash.tsx` has the top bar height as `64`; `globals.css` has the same value as `--spacing-topbar`
- Keep it in one place, read by both

### 8. Drawer shadow as a palette token

- The drawer shadow in `DashboardShell.tsx` uses a raw `rgba(...)` colour
- Add a token in `globals.css` `@theme` and use it

### 9. One helper for "event → template → 404"

- The guest invitation page, the host invitation page and the print page each repeat "find the event, check it has a template, load the template, else 404"
- Add a small `loadEventTemplate(event)` (in `src/templates/index.ts` or `src/lib/invitation.ts`) that returns the loaded template or `null`, and use it in all three
- The lookups differ (`findByInvite` vs `findEvent`), so the helper starts from the event, not the id

### 10. `readonly` status lists

- `EventGroups` and `InvitationGroups` take `statuses: EventStatus[]`; make it `readonly EventStatus[]` so the Events and Invitations pages don't need to copy their tab arrays

### 11. Update `context/repo-map.md`

- Fix the RepliesBanner note: the code uses `paused`, not `over`
- Reflect every move above (`src/lib/package.ts`, `VISIBILITY`, `EventMeta.tsx` gone, the shared styles file)

## Bugs

Most serious first. 12 and 13 were traced in the code; 14 was checked with the Europe/Bucharest time zone; 15 and 16 depend on how the spec is read.

### 12. The event editor saves even when a field shows an error

- `canSave` (`useEventForm.ts:271`) only checks "something changed" and "warnings read", so a host can save a taken, reserved or wrong-length link, a bad password, expected guests of 0 or below the replies, or a closing time after the cut-off — and the toast says "Changes saved"
- An empty (or spaces-only) link shows no error (`:177`); Protected with an empty password shows no error (`:191-194`)
- Save only when there is no slug, password, expected-guests or "close too late" error. Treat an empty link as too short. Protected requires a password

### 13. The guest's Send button does nothing when no answer is picked

- With a name typed but no "Going / Not going", Send does nothing and says nothing
- `RsvpForm.tsx:48-55` checks only the names; `RsvpPanel.tsx:74-76` stops silently because `buildPayload` returns null (`useRsvpForm.ts:52`)
- On submit also check a choice is picked, and show a short warning next to the two buttons, like the empty-name warning

### 14. Deletion date and cut-offs shift around daylight-saving changes

- `contentFreeze` and `deletionDate` (`src/lib/event.ts:121-130`) add or subtract whole 24-hour blocks, so a clock change in between puts the result an hour off — sometimes on the wrong day (Maria & Andrei's deletion shows 4 November, not 5; an event on 30 March shows its cut-off as 28 March, 23:00)
- A UTC server and the host's browser can also disagree, which risks a hydration mismatch
- Shown in `DatesThatMatter.tsx:73-74`, `EventRow.tsx:89`, `useEventForm.ts:134-135`, `NotificationsRail.tsx:84`
- Move by calendar days: build the date from year, month and day and change the day number (`setDate(getDate() ± n)`)

### 15. The "guests won't be notified" warning only appears after the first reply

- **Ask first:** is "reply count > 0" meant as the stand-in for "not Hidden"?
- `useEventForm.ts:142` sets `shared = event.rsvp.replied > 0`, so a Public or Protected event with no replies yet can change its link or password with no warning
- If the spec means "not Hidden": base `shared` on visibility, and keep the reply count in the text

### 16. noindex is a meta tag, not a header

- **Ask first:** does the spec mean a real HTTP header?
- The guest page sets only the `robots` meta tag (`invite/[invite]/page.tsx:14-16`), so responses without it — like the 404 for an unknown link — carry nothing. `next.config.ts` has no `headers()`
- If yes: add `X-Robots-Tag: noindex, nofollow` for guest-link paths in `next.config.ts`, and keep the meta tag

## Notes

- Cleanups (1–11) must not change behaviour or looks, except Goal 1 (RO/HU hosts now see their own word)
- Goal 15 decides the rule `invitation-editor-lock.md` uses for its save warning, so do it before that spec
- Pages to check afterwards: `/dashboard` (Dates that matter, notices rail, drawers on a narrow window), `/dashboard/events` and `/dashboard/events/1` (package section, link section, tabs), `/dashboard/events/1/guests` (editors, fold animation), `/maria-andrei` (reply form), `/invitations/maria-andrei`, `/prints/1`
- Optional, only if there's time: split `guest-list/GuestTable.tsx` (~470 lines) into category, group thread and duplicate card files
- Left out on purpose (the run's reasons hold): merging `EventGroups` / `InvitationGroups`, a shared timer hook for `Toast` / `CopyButton`, a shared "Discard / Keep editing" prompt, a shared root-layout frame, the print page's own palette, un-exporting the few exports used only in their own file, and reformatting mixed quote/semicolon styles
