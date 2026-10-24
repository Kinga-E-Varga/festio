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

1. **Done (fix: keep who hasn't replied as a counter) — keep "who hasn't replied" as a counter** (`fix/waiting-counter`).
   - **Now:** 38 of the 53 reads even the landing page makes. For each event whose form is
     closing soon, host pages read every reply and the guest list, only to count who
     hasn't replied (`waitingCounts` in `src/db/reads/dashboard.ts`). A 300-guest wedding
     near its close would cost every host page view a few hundred reads.
   - **Fix:** the event's `counts` gain `waiting` (pre-loaded names nobody's reply
     matches), kept by `countsOf` like the others, so host pages read none of the replies.
   - A data-shape change: the event schema, the seed, and a one-off script if real data
     exists by then.
2. **Done (fix: latest replies without reading every reply) — latest replies without reading every reply** (`fix/latest-replies-reads`).
   - **Now:** about 122 of a dashboard page's 178 reads. `loadRecentReplies`
     (`src/db/reads/activity.ts`) reads up to 20 replies from each event, then every reply
     of each event left in the feed, to work out the Unknown / Duplicate tags.
   - **Fix:** read only the 20 newest replies across the host's events, and work out their
     tags from the replies sharing their names (`nameKeys`, as `readReplyGroup` does), not
     from every reply of each event.
   - **Decided (2026-10-24): one query across events.** Today it asks each event for its 20 newest
     and throws most away (7 events → up to 140 replies read for 20 shown). If each reply
     card also stored its host's ID, one collection group query over `replies`
     (`hostId ==`, `sentAt` newest first, limit 20) would read exactly the 20 shown.
     Another data-shape change (the reply schema, the seed, a one-off script if real data
     exists), plus a composite index in `firestore.indexes.json`. Archived events need no
     filter: their replies are deleted with their data.
3. **Done (fix: load the latest replies only when their panel opens) — load the latest replies only when their panel opens** (`fix/replies-panel-on-open`).
   - **Now:** the dashboard's shared layout (`src/app/[locale]/dashboard/layout.tsx` →
     `loadDashboard`) builds the latest replies panel (behind the guests icon on the right
     strip) on every dashboard page, though it starts closed. After item 2 that is about 40
     of each page's reads (the event editor's own are about 3 of its 56).
   - **Fix:** the panel asks for its replies when the host opens it, with a loading
     skeleton meanwhile. Every dashboard page drops to roughly 15 reads plus its own; the
     feed's reads are paid only when someone looks.
   - **Decided (2026-10-24):** a Server Action; the skeleton only on the first opening, then
     the list is kept and fetched again only when the badge shows new replies.

