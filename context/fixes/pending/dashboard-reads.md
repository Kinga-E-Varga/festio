# Fix: Dashboard Reads

Found by the cost check (`context/features/pending/quality-checks.md`, item 2 → Findings).
Every host page costs about 178 reads with the seed's 7 events, and most of it grows with
each event's replies: the host's dashboard pages are most of a big event's monthly reads.
These two fixes should bring a dashboard page down to about 25 reads.

## Status

Not Started

## To do

Load one at a time (`/feature load`), each on its own branch. Each is test-first (the test
guards in `context/ai-interaction.md`), with `npm run cost` before and after: the baseline
goes down, then `COST_UPDATE=1 npm run cost` saves it.

**When one is finished** (at `/feature complete`), mark it here: change its `To do` to
`Done (<commit message>)`.

1. **To do — keep "who hasn't replied" as a counter** (`fix/waiting-counter`).
   - **Now:** 38 of the 53 reads even the landing page makes. For each event whose form is
     closing soon, host pages read every reply and the guest list, only to count who
     hasn't replied (`waitingCounts` in `src/db/reads/dashboard.ts`). A 300-guest wedding
     near its close would cost every host page view a few hundred reads.
   - **Fix:** the event's `counts` gain `waiting` (pre-loaded names nobody's reply
     matches), kept by `countsOf` like the others, so host pages read none of the replies.
   - A data-shape change: the event schema, the seed, and a one-off script if real data
     exists by then.
2. **To do — latest replies without reading every reply** (`fix/latest-replies-reads`).
   - **Now:** about 122 of a dashboard page's 178 reads. `loadRecentReplies`
     (`src/db/reads/activity.ts`) reads up to 20 replies from each event, then every reply
     of each event left in the feed, to work out the Unknown / Duplicate tags.
   - **Fix:** read only the 20 newest replies across the host's events, and work out their
     tags from the replies sharing their names (`nameKeys`, as `readReplyGroup` does), not
     from every reply of each event.

Not here: `refresh()` after a guest list save (about 180 reads on top of the save's 43).
Live updates remove it (`context/features/pending/database.md` → Security rules → Live
updates for hosts).
