# Event Guest List

Event guest list — one page per event at `/dashboard/events/[id]/guests` where the host reads, fixes and adds every reply, and manages the pre-loaded guest list.

## Goals

### Back button (all host editors)

- A small client component that calls `useLeaveFestio(fallback)` from `src/lib/history.ts`, the same helper the invitation and print editors use.
- Label: **BACK** (uppercase), in the event editor's current eyebrow style.
- It replaces the event editor's "All events" link too.
- **With no Festio page behind it** (a new tab, a pasted link), BACK goes to the page's own fallback instead of the landing page:
  - event editor and guest list → the events list;
  - invitation editor and print editor → the invitations list.

### Page header

- The event's title and date line, laid out the same way as the event editor.

### Banners (only the ones true right now)

- **Names not matching:** shown when the event has unknown names. **Remove this banner from the event editor page.**
- **Replies, one banner at most, only at 100% or more of expected:**
  - "paused" when the form is paused;
  - otherwise "at/over expected".
  - Nothing below 100%.
- The event editor keeps its own replies banners unchanged.

### Page layout, top to bottom

1. Banners.
2. The supplier line: the event's `attendeeNotes` (children, dietary, …).
3. The toolbar: Use pre-loaded list toggle, then **Add names · Add guest · Export**.
4. The add-names box, when open.
5. The summary chips on the left, search by name on the right, in one row.
6. The table.

### Summary chips

- **All · Coming · Not coming · Waiting · Not sent yet · Unknown · Duplicates.**
- Counted from the rows, per person, not per category. "Coming" counts everyone coming, whichever category they sit in.
- Clicking a chip filters the table; clicking it again goes back to All.
- Waiting shows only when the list is on. Not sent yet shows when the list is on and the count is above 0. Unknown and Duplicates show only above 0.
- When a chip disappears, its filter resets to All for good, so it can't come back on its own.
- Without a list, "X of Y expected replied" follows the chips.

### The table: one merged list

- **Each row is one person.**
  - A pre-loaded name with no reply is a **Waiting** row.
  - A reply that matches a pre-loaded name fills that name's row.
  - A reply that matches no name gets its own row.
- **Categories**, in this order, each with a heading and a count of its people: **Unknown guests · Confirmed · Declined · Waiting for a reply**. A category with nobody in it is hidden.
  - Unknown guests: anyone with the Unknown tag.
  - Confirmed / Declined: by the person's own reply.
  - Waiting for a reply: pre-loaded names with no reply.
- **Grouping:** people from the same reply (same `submissionId`) share a thin bracket, but only when they are in the same category.
  - **A reply whose people land in different categories splits**, one part per category. Each part shows "Replied with …" naming the others. The reply's note shows once, on the first part that isn't Unknown.
  - Once everyone in the reply lands in the same category again (e.g. after matching an unknown person), it is one group again.
- **Filters and search work the same way:** only the matching people show, still bracketed together; the ones left out are named in "Replied with …". Nothing is dimmed.
- **Order:** A–Z inside each category; groups with an Unknown or Duplicate tag come first.
- **Tags:**
  - **Unknown:** the list is on and the name isn't on it (no free list name to claim). Without a list, nobody is Unknown.
  - **Duplicate:** the guest picked "No, add mine" on a name already there. Every reply with that name gets the tag, the first one too. Hover text: "Replied under a name that was already there".
  - Waiting names never get tags.
- **Invitation sent:** Waiting rows only get an **Invite sent** checkbox. One click, no edit mode, saves right away with a toast. Once a name gets a reply, the checkbox is gone.
- **Current row (to be redesigned in a fix, see `context/fixes/guest-list-design.md`):** Name · Coming / Not coming, or ☐ Invite sent on Waiting rows · an Unknown box with **Match to… / Add as new** · a Duplicate box with **Keep both / Same person** (on the second reply only) · **Edit**.
- **Export:** a button only; not functional yet.

### Pre-loaded list

- **The toggle here and the event editor's toggle are the same setting.** Both are local state for now; nothing persists.
- **Turning it off:** Waiting rows are hidden and the names are kept. Turning it back on brings them back.
- **Turning it on (or adding names):** existing replies are matched against the names. The rest become Unknown.
- **Add names:** opens an inline box above the table (not a side panel).
  - A text area, one name per line. Pasting a spreadsheet column, or typing and pressing Enter, both work. Blank lines are ignored.
  - A live count of the names about to be added.
  - **Repeated names are never skipped.** On Add, if any name appears more than once (inside the paste, or against names already on the list), a warning lists them first, e.g. "Elena Ionescu (2×)", with **Keep them** or **Go back and edit**.
  - After Add, the names appear as Waiting rows, and existing replies are matched against them.
  - The empty-state link opens this same box.
  - No file upload (Excel/CSV) in this feature.

### Without a pre-loaded list

- Rows are only replies and guests the host added.
- No Unknown tags. Duplicates still show the Duplicate tag and resolve with **Keep both** (clears the flag) or **Same person** (removes the duplicate).
- **Empty state:** "Replies will show here as they come in", with Add guest, and the line "Have a guest list? Add names and replies will be matched to it." That line turns the list on and opens the paste box.

### Editing: inline, one row at a time

- **Edit:** turns the row into inputs (name, status), with Save and Cancel.
- **Unsaved changes:** opening another row, Add names, the list toggle or the empty-state link ask first ("You have unsaved changes on this row": Discard changes / Keep editing), but only when the row really differs from how it started. Typing a change back doesn't count.
- **Saving:** each row saves on its own, with a toast. No page SaveBar.
- **Mobile:** the row grows downward into stacked fields.
- **Add guest:** a blank row at the top, already in edit mode.
- **Match to… (on an Unknown reply):**
  - A name search box lists the Waiting names. "No names match." when the search finds nothing; Escape closes it.
  - Picking one merges the reply into that name's row.
  - **Add as new** clears the tag and adds the name to the list.
- **Keep both:** when the kept reply finds no free list name, it turns Unknown, and the toast says so: "Kept both. {name} isn't on your list yet: match or add them."
- **Delete:** inside edit mode, with a short confirm.
- **Always editable:** before, during and after the event, until the guest data is auto-deleted. The 24h content freeze does not apply here.
- **After deletion** (`dataDeleted`): no list, just a short "guest data deleted" note.

### Entry points

- The events list's "Guest list" button (`EventRow.tsx`) links to the page.
- The event editor's "Edit list" button opens the page **in a new tab** at `#list`, which opens the paste box and scrolls to it. The editor's unsaved changes stay put.

### Mock data: a new event

**"Logodnă Ana & Vlad — Vila Florilor"**
- Engagement, 2026-10-24 18:00, Public, Type 1, tier 1, no template, language RO.
- Pre-loaded list on; expected guests 8.
- Reuses an existing preview screenshot.

**Pre-loaded list (8):** Maria Popescu, Andrei Popescu, Elena Ionescu, Mihai Dumitru, Ioana Dumitru, Gheorghe Pop, Radu Stan, Irina Stan.

| Reply | People | Status | Note | Result |
|---|---|---|---|---|
| 1 | Maria & Andrei Popescu | Coming | "Abia așteptăm!" | both match |
| 2 | Elena Ionescu | Not coming | "Sunt plecată, vă pup!" | matches, tagged Duplicate |
| 3 | Mihai, Ioana & Luca Dumitru | Coming | — | Luca Unknown, split off |
| 4 | Gheorghe Popp | Coming | — | Unknown, typo of "Gheorghe Pop" |
| 5 | Elena Ionescu | Coming | — | Duplicate, name is on the list |

- **Waiting:** Gheorghe Pop (not sent), Radu Stan (sent), Irina Stan (sent).
- **The page shows:** Unknown guests 2 · Confirmed 5 · Declined 1 · Waiting for a reply 3. Chips: All 11 · Coming 7 · Not coming 1 · Waiting 3 · Not sent yet 1 · Unknown 2 · Duplicates 2.
- **Event tally:** replied 8, attending 7, declined 1, pending 3, invited 8, `unmatched` 2 (Luca and Gheorghe Popp; the second Elena is a duplicate, not unmatched), `preloadedCount` 8. That is 100%, so the replies banner shows.
- **Hard-coded mock numbers to update:** the Events nav badge `'4'` → `'5'`, the `unmatchedNames` stat `'5'` → `'7'`, and the `liveInvitations` stat `'3'` of 4 → `'4'` of 5.
- **No existing event's data changes.**

## Notes

- **Storage is decided:** one record per attendee, fanned out from a shared `submissionId`, with the note copied onto each. Status is per person, so the host can change one person in a group.
- **The guest types are mock-only**, in `src/types/guests.ts`. They are not a Firestore schema. The schema is still unsettled; ask before wiring it.
- **Type 1 replies hold only name, status and note.** No per-question answers are shown until Type 2 questions exist.
- **All new text goes in a `GuestList` namespace** in `messages/{en,ro,hu}.json`. It follows the host's locale. RO/HU are AI-drafted and need a native read.
- **Add the new route to `context/repo-map.md`** in the feature commit.
- **The row design is not final.** It moves to its own fix: `context/fixes/guest-list-design.md`.
- **Changes carried into this commit** (made before or alongside this feature):
  - `GUEST_DATA_RETENTION_DAYS` goes from 30 to 60 in `src/lib/config.ts`, and "Currently 60 days" in `context/project-overview.md`.
  - Formatting-only edits in `config.ts` and `InvitationCard.tsx`.
  - A new line in `context/fixes/pending/pending-design-fixes.md`, and the BACK unsaved-changes note in `context/fixes/pending/pending-UX-fixes.md`.
  - The Plan step in the workflow (`context/ai-interaction.md`), `/context/plans/` in `.gitignore`, and the feature skill's new `plan` action.
  - The fix notes in `context/fixes/guest-list-design.md`.
