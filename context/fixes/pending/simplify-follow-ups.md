# Fix: Simplify Follow-ups

What is still open from the simplify run (`context/reviews/2026-09-29.md`): one cleanup and three bugs from the review's "Possible bugs" report.

## Status

Not Started

## Goals

## Cleanups

### 1. One helper for "event → template → 404"

- The guest invitation page, the host invitation page and the print page each repeat "find the event, check it has a template, load the template, else 404"
- Add a small `loadEventTemplate(event)` (in `src/templates/index.ts` or `src/lib/invitation.ts`) that returns the loaded template or `null`, and use it in all three
- The lookups differ, so the helper starts from the event, not the id. The guest and print pages load only simple templates (`loadSimpleTemplate`), the host invitation page both (`loadTemplate`)

## Bugs

### 2. The event editor saves even when a field shows an error

- `canSave` (`useEventForm.ts:246`) only checks "something changed", "warnings read" and the title, so a host can press Save with a taken, reserved or wrong-length link, a bad password, or expected guests of 0 or below the replies
- An empty (or spaces-only) link shows no error; Protected with an empty password shows no error
- Save only when there is no slug, password or expected-guests error. Treat an empty link as too short. Protected requires a password

### 3. The "guests won't be notified" warning only appears after the first reply

- **Ask first:** is "reply count > 0" meant as the stand-in for "not Hidden"?
- `useEventForm.ts:148` sets `shared = event.rsvp.replied > 0`, so a Public or Protected event with no replies yet can change its link, password or language with no warning
- The invitation editor's save (`useInvitationSave.ts`) is given the visibility too; check both editors use the same rule
- If the spec means "not Hidden": base `shared` on visibility, and keep the reply count in the text

### 4. noindex is a meta tag, not a header

- **Ask first:** does the spec mean a real HTTP header?
- The guest page sets only the `robots` meta tag, so responses without it — like the 404 for an unknown link — carry nothing. `next.config.ts` has no `headers()`
- If yes: add `X-Robots-Tag: noindex, nofollow` for guest-link paths in `next.config.ts`, and keep the meta tag

## Notes

- Goal 1 must not change behaviour or looks
- Pages to check afterwards: `/dashboard/events/1/details` (link, password, expected guests), `/maria-andrei`, an unknown link, `/invitations/maria-andrei`, `/prints/1`
- Optional, only if there's time: split `guest-list/GuestTable.tsx` (~580 lines) into category, group thread and duplicate card files
- Left out on purpose (the run's reasons hold): a shared timer hook for `Toast` / `CopyButton`, a shared "Discard / Keep editing" prompt, a shared root-layout frame, the print page's own palette, un-exporting the few exports used only in their own file, and reformatting mixed quote/semicolon styles
