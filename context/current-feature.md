# Current Feature: Host-side limits (`fix/host-limits`)

## Status

Completed

## Goals

From `context/features/pending/database.md`, Do later item 7. Today a host has no limits:
anyone can make a free account, add unlimited replies to their own event, and every open of
the guest list reads them all. The reads it can cost us have no upper end. Two limits no
real host reaches:

- **Guests invited has a maximum: 600** (`EXPECTED_GUESTS_MAX` in `src/lib/config.ts`), in
  the event schema and the event form. Past it, the field says that for more guests the
  host should contact us, with a link to `/contact`.
- **The reply cap stops the host too.** The cap stays as it is (the larger of expected +
  50% or expected + 20, so at most 900). A host save that raises the event's people
  (coming + not coming) is refused if the result passes the cap. Edits and deletes that
  keep or lower the number are always allowed, so deleting fake replies makes room. When
  replies are closed (closing time) or the invitation is Hidden, the host can still add,
  up to the cap.
- **The host's refusal says what to do:** the event reached its limit of N people: raise
  Guests invited in Event settings, or check for fake replies. At 600 Guests invited:
  contact us (`/contact`) instead.
- **A rate limit on host saves: 150 an hour per account** (`HOST_SAVE_LIMIT_PER_HOUR`),
  counted in `hostSave` (`src/actions/host-save.ts`), so every host save counts and none
  can forget it. One card per account per hour in `rateLimits/` (a new `save` action,
  keyed by host ID), deleted by the same TTL. Past it: "Too many saves, please try again
  in a few minutes."
- **Sent ticks counted apart:** ticking a pre-loaded name as sent is its own small save
  (`markNameSent` → `writeSentMark`: that name's mark, the list's version up, no counter
  changes) with its own count, 600 an hour (`SENT_MARK_LIMIT_PER_HOUR`), so a host ticking
  a long list never runs out of saves.
- **A "coming soon" `/contact` page** in the host app (`[locale]/contact`), in the three
  languages, so the links lead somewhere. The real page and form are their own feature:
  `context/features/pending/contact-page.md`.

## Notes

- **A decided rule changes:** "the host can always add replies, paused or not" becomes
  "the host can add replies up to the cap". Update `context/project-overview.md` (Security)
  and `database.md` (Counters: "The cap is for safety only"; Rate limiting → Host side;
  `writeGuestChanges`'s comment "no cap").
- The guest's rule stays: a reply is checked against the count before it, so a family
  arriving just under the cap is saved whole (up to 9 over). The host's check is on the
  result, so one save with many replies can't jump past the cap.
- The host save limit costs one read and one write per save: check `npm run cost` and
  accept the rise with `COST_UPDATE=1` if it's only that.
- No real data yet: no script. Seed events are all under 600 Guests invited.
- At `/feature complete`, mark item 7 in `database.md` as Done.
- Simplify: ran 2026-11-26 (with /code-review)
