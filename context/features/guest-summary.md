# Guest Summary

The Summary section at the top of an event's guest list page
(`/dashboard/events/[id]/guests`). It holds the numbers a host plans with — for a caterer
or a venue. The Guest list section below it holds the names.

## Layout

- Table-like, not a bar or meter. Do not reuse `RepliesMeter`.
- A grid of small tables, each a label on the left and a number on the right.
- Three columns on wide screens, one on mobile. Columns follow the section's own width
  (`@container`), like the rest of the page.
- Rows with 0 are hidden, except Coming and Not coming.
- Numbers update live from the rows, as the host edits, adds or deletes replies.
- Replies, Age and Dietary needs always show. The custom question blocks and Messages
  are hidden behind one toggle under them — "Show more answers and messages" / "Hide more answers and messages" — that stays below what it opens, closed by default.
  They share one grid with the three always-shown blocks, so they fill any gap beside
  Dietary needs. They fade in when shown and disappear at once when hidden.

## Blocks

Counts are in **people** unless a block says otherwise. One reply for 4 people counts as 4.

### Replies

- Coming
- Not coming
- Waiting for a reply — only when the preloaded list is on. Same wording as the table's
  category.

### Age (people coming)

- Adults · Children · Babies
- No Skipped row: age is required.

### Dietary needs (people coming)

- One row per diet with at least one person: vegetarian, vegan, gluten-free,
  lactose-free, nut allergy, other.
- **Other** is a preset the guest fills in with their own words. The summary shows only
  "Other" and its count; the guest list row shows what the guest wrote.
- No "No needs" row. People with no needs, or who skipped, are not counted.
- One person with two needs counts once in each.

### Custom questions (one block per question)

Shown only when the event has custom questions — driven by the data, not by the
invitation type.

- Title: the question's label, nothing under it. Questions asked once per reply count
  replies, not people.
- Counted over people coming only (non-core questions are attend-only).
- By question kind:
  - **Choice:** one row per option.
  - **Yes / no:** Yes · No.
  - **Free text:** "X answered this question" — a count only, answers are not listed.
- No Skipped row. A skipped answer (`null`) or a missing key (never asked) is not
  counted.

### Messages

- "X guests left you a message" — the reply's note to the host.
- Counted once per reply, not per person in it.

## Mock data

Mock only, not a Firestore schema — that is still unsettled.

- `src/types/guests.ts`: question and answer shapes. Answers are keyed by **permanent
  question IDs**, per the answer-storage rules in the project overview.
- `src/mock/guests.ts`: add questions and answers to `logodna-ana-vlad`. Keep the event's
  type and tier as they are.
  - Main course — per person, choice: Fish / Beef / Pasta.
  - Do you need accommodation? — per reply, yes / no.
  - Song request — per reply, free text.
  - A few replies skip some questions.
- Gheorghe's reply gets an age group (age is required).
- Two people pick Other with their own words (`dietOther`).

## Other changes

- Remove the grey `attendeeNotes` line under the Guest list header on this page. The
  summary replaces it.
- The filter chips keep their numbers. `GuestSummary.tsx` is not touched.

## Files

- `src/types/guests.ts` — question and answer types.
- `src/mock/guests.ts` — mock questions and answers.
- `src/lib/guests.ts` — one function that counts everything for the summary.
- `src/components/dashboard/guest-list/ReplySummary.tsx` — new, the Summary section body.
- `src/components/dashboard/guest-list/GuestManager.tsx` — renders it, drops the notes line.
- `messages/{en,ro,hu}.json` — the new wording.

## Out of scope

- Showing custom answers in the guest list rows. Free-text answers can be counted but not
  read yet.
- Archived questions.
- Real question definitions or an editor for them.
