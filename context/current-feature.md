# Current Feature: Repeated Reads

## Status

Completed

## Goals

Pages and saves that re-read every reply of an event, again and again, as the host
opens, switches or saves things. Make each read only what it needs. Data shape may change
where needed.

### 1. Guest list saves

Every save on the Guest list tab re-reads the whole event, then refreshes the page. Make
each save read only what its change can affect (`nameKeys` / `listNameIds` on every reply
card already allow it).

- **Each host save counts only the affected group**, inside its transaction:
  1. Read the event and the reply cards being edited or deleted, by ID (their before-state:
     `sentAt` / `createdBy`, stale check).
  2. Affected names: the changed replies' names before and after; added, removed or renamed
     list names before and after; the list names those replies were matched to, before and
     after. A `sent` flip adds none.
  3. Read the group: replies with those names, replies matched to list names with those
     names (`readNameGroup`), the list and the seating chart.
  4. Close the group: a reply in it with a name outside the set adds that name, read again.
     Not settled after 3 rounds, or the set grows very big: full recount instead.
  5. Count the group before and after (`countsOf`) and add the difference to the stored
     counters, like `countsWithReply`.
  6. No affected names and no reply changed (mark sent): no counting, counters not written.
- **The list switch** (`setGuestListOn`) keeps its full recount: it changes every match.
- **No page refresh after guest-list saves** (`refresh: false`): the page ignores the
  refreshed data (`useState(initial)`); the strip's alerts badge catches up on the next
  page (agreed).
- **Keep one save per action**, with its toast.
- **Keep `repairCounts` on page open** as the safety net (no extra reads).
- Expected cost: edit one reply ~6–8 reads whatever the event's size (now 43 + refresh);
  mark sent 2 reads.

### 2. Event Overview reads every reply

Every open of the Overview (68 reads with the seed; ~300+ for a 300-guest wedding) reads
every reply, only for the Replies box's summary (`tallyGuests`, `answeredCustom` in
`RepliesBox.tsx`: ages, diets, the host's questions, messages).

- **Store that summary on the event**, kept by the same saves as the counters (host saves,
  guest replies, `repairCounts`, the seed). Each reply adds on its own, no name matching:
  a save takes off the card as it was and adds it as it is.
- The Overview then reads no replies.

### 3. Guest list ↔ Summary tabs

Each switch is a server render of the whole page (every reply). Switch in the browser
only; the URL still changes, so a link can open a tab.

### 4. The list switch

A full recount per flip. Store `needsAttention` and `waiting` for both settings (only
those two depend on it; `coming`, `notComing`, `seatingWarnings` don't, see
`eventCounts`). Every save works out both, so the group read always includes the list.
A flip is then 1 read, 1 write.

### 5. Guest page reloads: a server cache, not a view limit

The guest page reads 3 records a view (link, event, invitation), with no limit on
reloads. Instead of a per-visitor view limit, a server cache, **keyed by version, not
cleared by tag**: a tag cleared on one App Hosting instance stays on the others, and
`unstable_cache` is replaced in Next 16 while `"use cache"` needs `cacheComponents`
(docs checked). So: the event card is read fresh on every view (1 read) and carries
`invitationVersion` (raised by `writeInvitation` in its transaction); the invitation is
cached by (event, version), the link by slug, checked against the fresh card and read
again when it no longer matches. A view costs 1 read, always current. Our own small
in-memory cache (`src/lib/memo.ts`), per instance, entries expire. Reply and password
limits stay.

### 6. Read the invitation only when it is shown

A locked Protected page and a cancelled page read the invitation record and never use
it. Check first (the password is a cookie check, no read), read it only for the
invitation itself. After the right password the page renders again as now (the unlock
action sets a cookie), so no extra trip.

### 7. Event Overview: cache what it reads on every open

Once part 2 is in, the Overview still reads the latest 5 replies and their tags
(`loadEventReplies` → `latestReplies` + `feedTags`, ~5–15 reads) and the invitation record
for its preview, on every open. Live updates won't cover these: the dashboard will listen
to event cards only.

- **The latest replies, keyed by a version:** a `dataVersion` on the event card, raised in
  the same transaction by every save that changes a reply card or the list's names (guest
  replies, host saves; a `sent` flip doesn't). The page already reads the event card, so it
  knows the version for free; the cache is looked up by (event, version), so nothing has
  to be cleared and old data can't come back. A deleted event's data never comes from the
  cache. Entries expire after about an hour.
- **The preview's invitation:** read through part 5's guest page cache (keyed by
  `invitationVersion`). The invitation editor and print page keep reading it fresh: they
  edit it.

Not cached, on purpose: the guest list's replies (live updates replace it), the dashboard
layout's events (changes with every reply, and the layout doesn't re-render on
navigation), the latest replies panel (loads only when new replies come), the sign-in
check (a speed question, step 6 measures it).

## Notes

- Plan: `context/plans/repeated-reads.md`
- Simplify: ran 2026-10-25
- **Also in this branch:** the seed's `dayFromNow` counts calendar days (`shiftDay`), not
  24-hour steps; on a clock-change day it landed a day off and `npm run test:app` failed
  (`tests/lib/seed-dates.test.ts`).

- **Not doing: a server cache of the guest list's replies.** Live updates (`database.md` → Security rules → Live updates for hosts) come
  next, with the rules, and replace it. Parts 1–6 stay useful with live updates.
- **At close out:** `database.md` → Counters says "Host saves still recount the whole
  event": update it to match part 1.

- Spec: `context/fixes/pending/guest-list-saves.md` (item 1 only). Its "about 180 reads"
  for the refresh is wrong: the cost report's "page: guest list" is 57.
- **Next.js (this version's docs):** event pages are rendered per request, so every visit
  re-reads; back/forward reuses the page; Links don't prefetch them (no `loading.tsx`).
  Rejected: keeping event pages in the browser (`staleTimes`), since a page visited before
  a save would show the data from before it.
- **Guest invitation page:** 3 reads a view (link record, event, invitation); a locked
  Protected page reads the invitation too and could skip it; an unknown link 1 read.
- **Actions and their saves** (all through `writeGuestChanges`, except the switch): new
  reply, edit reply, delete a person / whole reply, Separate, match an Unknown, add as new,
  mark different, rename a list name, remove a list name, mark sent / not sent, Add names
  box; the list switch (`saveGuestListOn`).
- **The case the closing step exists for:** Bob matched to list name "Robert"; the host
  removes "Robert"; Bob now competes for a "Bob" list name with Bobs outside the group.
- **Concurrency:** guest replies and host saves both read and write the event card in a
  transaction, so they run one after the other.
- **Tests first** (`src/db/writes/`), expected values by hand: each kind of action on a
  small event, including rename "Anna Pop" → "Ana Pop", removing a matched list name
  (Bob/Robert), a later same-name reply (Duplicate), Separate. Plus random sequences of
  host actions and guest replies: after every step, incremental counters = full recount.
- **Cost report:** add mark sent, add names, match an Unknown; `npm run cost` before and
  after.
