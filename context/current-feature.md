# Current Feature: Latest replies without reading every reply

## Status

Completed

## Goals

- The latest replies feed (`loadRecentReplies`, `src/db/reads/activity.ts`) works out each
  shown reply's Unknown / Duplicate tags from the replies sharing its names (`nameKeys`, as
  `readReplyGroup` does), with the list on also the list and the replies the host matched
  to a list name spelled like them, not from every reply of its event.
- Each reply card also stores its host's ID (`hostId`), written with the reply: guest
  replies and host saves alike.
- The feed reads the host's 20 newest replies across all their events with one collection
  group query over `replies` (`hostId ==`, `sentAt` newest first, limit 20), plus their
  name groups: nothing more. The composite index goes in `firestore.indexes.json`.
- The Overview's feed (one event) reads the same way, limited to that event.
- Tags stay exactly as today: the same Unknown / Duplicate on every reply shown, on the
  dashboard's side panel and an event's Overview.
- `npm run cost` goes down (a dashboard page is about 178 reads now, about 122 of them from
  this); then `COST_UPDATE=1 npm run cost` saves the new baseline.

## Notes

- Spec: `context/fixes/pending/dashboard-reads.md`, item 2. Branch `fix/latest-replies-reads`.
  At `/feature complete`, mark item 2 there `Done (<commit message>)`.
- **Now:** reads up to 20 replies from each event, keeps the 20 newest, then reads every
  reply of each event left in the feed (`loadGuestRows`) for the tags.
- **Decided (2026-10-24): store the host's ID on each reply, one query across events.**
  Today each event is asked for its 20 newest and most are thrown away (7 events → up to
  140 replies read for 20 shown); the one query stays at 20 however many events. Only the
  seed has data, so no script: change the schema and reseed. Archived events need no
  filter: an archived event's replies are deleted with its data (`delete-event.ts`).
- Check with the user before the exact field shape if it isn't plain `hostId: string`.
- Simplify: ran 2026-10-24
- Test-first: tests from the spec with hand-worked expected tags, then the code.
  `npm run cost` before and after.
