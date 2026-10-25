# Fix: Guest List Saves

The guests page's Guest list tab (`/dashboard/events/[id]/guests`, not `?view=summary`).
Every change the host makes there reads the whole event again, twice. Found while talking
through `dashboard-reads.md`. **Not ready to build: talk it through and rethink it first.**

## Status

Not Started

## How it works now

- **No Save button.** Each action saves the moment the host does it, with its own toast
  (`useGuestActions.ts` → `apply` in `useGuestList.ts` → `saveGuestChanges` →
  `writeGuestChanges` in `src/db/writes/guests.ts`): edit a reply, add one (phone RSVP),
  delete, separate, match an Unknown, add as new, mark different, rename a list name,
  remove one, mark an invite sent, the Add names box.
- **Only a few saves carry more than one change:** the Add names box (several names), a
  reply with several people, separate.
- **Every save recounts the whole event** (`readCountInputs`: every reply, the list, the
  seating chart), about one read per reply. The cost report's "save: guest list, one reply
  edited" is 43 reads with the seed's big event; a 300-guest wedding, about 300.
- **Then the page refreshes** (`refresh()` in `hostSave`): about 180 more reads with the
  seed.
- **The list switch** (`setGuestListOn`) recounts the whole event too.
- **Opening the page** reads every reply (it shows them all), then `repairCounts` checks
  the counters against what it loaded.

## What's wrong

- A host sorting out 30 Unknowns at a 300-guest wedding: 30 saves × (≈300 + the refresh)
  reads.
- **Marking an invite sent** (`toggleSent`) only flips a flag on a list name. No counter
  can change, yet it recounts every reply.
- A guest's reply is already counted incrementally (`readReplyGroup` +
  `countsWithReply` in `src/db/writes/counts.ts`); host saves never are.

## To talk through

- **Which saves need a recount at all.** Mark sent: none. Others: which counters each can
  change.
- **Incremental host saves**, like a guest's reply: the cards an action can change, worked
  out per kind of action. The hard parts:
  - an edit has a before and an after (renaming "Anna Pop" to "Ana Pop" touches the replies
    sharing either name);
  - renaming or removing a list name changes which replies match it;
  - order decides who gets a list name and who is the Duplicate;
  - the list switch changes every reply: always a full recount.
- **Is a full recount still worth keeping** somewhere as the safety net (`repairCounts` on
  page open already is one)?
- **The refresh after each save** — `dashboard-reads.md` leaves it to live updates
  (`context/features/pending/database.md` → Security rules → Live updates for hosts). Is
  that still the plan, or does this fix take it?
- **Each save reads the cards it edits** to keep `sentAt` / `createdBy` and to spot a stale
  page: only those, not every reply.
- Should the tab keep saving every action on its own, or not? (A UX question, not only a
  cost one.)

## Notes

- Do `dashboard-reads.md` item 1 (`waiting` counter) first: it adds a counter these saves
  must keep right.
- Test-first, like every save in `src/db/writes/`: the counters after each kind of action,
  worked out by hand, must equal a full recount's.
- `npm run cost` before and after.
