# Current Feature: Unknown and Duplicate tags in the latest replies

## Status

Completed

## Goals

- A guest's reply in the latest replies shows an **Unknown** tag when its name isn't on the
  event's pre-loaded guest list, and a **Duplicate** tag when the same name already replied.
  Same rules as the guest list page (`buildRows`, `showsUnknown` in `src/lib/guests.ts`), so
  the two can never disagree.
- Both places that show the feed get the tags: the dashboard's side panel (all events,
  `loadRecentReplies` via `loadDashboard`) and an event's Overview (`RepliesBox`).
- Tags are worked out live, never stored.
- Cheap: the feed loads on every dashboard page, so
  - work the tags out only for the events left in the feed after the cut to `LATEST_REPLIES`;
  - reuse `loadGuests` where it is already read in the request (the Overview page,
    `waitingCounts`), since it is in React `cache()`;
- The tag looks like the guest list's tag (`TAG`, danger colours), worded in all three
  languages (`messages/{en,ro,hu}.json`).

## Notes

- Source: `context/features/pending/database.md`, Do later item 5. At `/feature complete`,
  change its `To do` to `Done (<commit message>)`.
- Today `toActivity` (`src/db/reads/activity.ts`) notes the Unknown tag is left out because
  the lists don't read the guest list. The mock had `tag?: "UNKNOWN"` on `RsvpActivity` and
  an `unknownTag` label in `RepliesList`, removed in `febd7d8` (step 2 reads) — a starting
  point for the markup.
- Decided: host-added replies (phone RSVPs) get tags too, as on the guest list.
- Decided: a reply for several people is tagged if any of its names is Unknown / Duplicate.
- Duplicate goes on the later reply only (`row.later`): the one that repeats an earlier name.
- `loadGuests` reads the list card even for an event with no pre-loaded list (one small
  card); kept so the cached read is shared.
- The tag styles (`TAG_TEXT`, `TAG_PAD`, `TAG`, `ATTENTION_TAG`) moved from
  `guest-list/styles.ts` to the dashboard's `styles.ts`, now used outside the guest list.
- Archived events have no replies left, so nothing to tag.
- Simplify: ran 2026-10-23
