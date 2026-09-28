# Reply Editor

The guest list page's row editor (New reply and Edit) asks everything the RSVP form asks, and takes the preloaded list box's look.

## Goals

### Look

- Empty table: no **New reply** button under "Replies will show here as they come in." — the toolbar's New reply stays
- The editor's background is `mustard-100`
- The editor eases in like the preloaded list box: a short drop and a fade (`FADE_IN`, shared). It closes at once, with no fade-out
- Inside the editor everything is mustard: the regular inputs, mustard dividers, and the list box's gold buttons and choices (with a darker hover, `mustard-300`, so it shows on the mustard background)
- Cancel / Save are the list box's gold button pair (`BTN_EDITOR_OUTLINE` / `BTN_EDITOR`)
- Coming / Not coming and yes/no questions are chips as tall as the inputs (same padding and type size), as wide as their words: the unpicked one looks like Cancel, the picked one like Save
- Age and the host's choice questions are dropdowns (an empty "Choose…" = unanswered); dietary needs is a dropdown of ticks, since it takes several
- The unsaved-changes warning ("Discard changes / Keep editing") looks like the list box's warning: the terracotta alert box, `SMALL_BTN_WARN` for Discard, `SMALL_BTN_WARN_SOLID` for Keep editing. The alert style moves from `AddNamesBox.tsx` into the guest list's `styles.ts`, so both share it

### Layout

- Name on top, Coming / Not coming under it
- The editor is at most 500px wide (full width on phones)
- The questions under them in one column, each label above its field
- Cancel / Save at the bottom under a divider, side by side, filling the editor's width

### Editing a reply (one person)

- Each person is edited alone, from their own row, with their own Coming / Not coming
- When Coming, the editor shows:
  - **Age** — adult / child / baby
  - **Dietary needs** — the presets, **Other** with its text, and **None** (reuses the existing `dietNone` label). None clears the others; picking any need clears None
  - The event's own questions (choice, yes/no, text)
- Not coming hides the questions; their answers stay stored (they don't count in the Summary)
- Reply-wide questions (e.g. room, song) change for the whole reply, with a hint naming the others in it
- For a group reply the reply-wide questions sit under a divider; the hint and Separate from group sit between that divider and a second one, 16px from each. The justified hint: "Changing the following answers also changes them for {names}. Avoid that by separating this person from the group." No title. One person alone gets the same questions straight after their own
- The guest's message is not shown and not editable
- No adding people to an existing reply — a new person is a New reply
- **Separate from group** — for someone who replied with others, a small button right below that hint (under the name when there's no reply-wide part: not coming, or no reply-wide questions). Clicking it shows a warning ("Separate {name} from {names}? Once you save, this can't be undone.") with Keep together / Separate. Once okayed it waits for Save; Cancel still keeps them together. On save:
  - the person gets a reply of their own; "Replied with" stops naming them
  - they keep their copy of the reply-wide answers, the others keep theirs, and from then on each changes alone
  - the message stays with the others (so it shows and counts once) and comes off the separated person
  - toast: "Separated"

### New reply

- Dividers: one above each person (including the first, under the status), none between a person's name and their questions (which sit 16px in from the name), and Add person between two (the lower one is the buttons' own line when no reply-wide questions follow)
- Like the guest RSVP form, minus the message: several names (add / remove people), one Coming / Not coming for all of them
- When Coming: age and diet once per person, per-person questions once per person, reply-wide questions once for the whole reply

### Reply details (the row's fold)

- Clicking a name opens its details: age, diet, then the host's own questions' answers — a choice by its option's wording, yes/no in words, text as written, Skipped when asked and skipped, nothing when never asked. Reply-wide answers show on each person
- The guest's message is a line in the details too ("Message: …", last), on each person of the reply, like the reply-wide answers; the thread no longer shows it under the group

### Waiting names (preloaded list, no reply)

- Name only: rename or delete, as now

### Unsaved changes

- The preloaded list box and a row editor (Edit, New reply) are never open together: opening one closes the other, after its unsaved-changes prompt if it has changes
- Everything that would leave or change the open row waits for the unsaved-changes prompt: another row's edit, New reply, Preloaded list, the list switch, delete, and now also **Match to a name**, **Add as new** and **Different person**
- Search and filters never hide the row open in the editor
- While the preloaded list box has unsaved changes, any change to the table asks with the box's own "Discard your changes?" warning — the same actions the row editor holds back: Edit, New reply, Delete, Match to a name, Add as new, Different person and Stop using the list. Discard changes closes the box and does it; Keep editing leaves everything as it was
- Leaving the page with unsaved changes — in a row or in the preloaded list box (a draft change, or names still in its box) — asks first: the browser's own prompt on reload or close, a confirm ("You have unsaved changes. Leave anyway?") on in-app links and BACK

## Rules

- **Age and dietary needs are always required** — set by Festio, not the host. Diet counts as answered when a need or None is picked
- The host's own questions are optional for now (no `required` setting in the mock types)
- Required is enforced only where the guest was asked: new replies, and anyone switched from Not coming to Coming. A question a reply was never asked is not forced
- Answer storage follows the spec: missing key = never asked, null = asked and skipped. A never-asked question shows empty and stays never-asked if left empty; it only counts once filled
- The reply's stored shape doesn't change — `GuestReply` already holds age, diet, `dietOther` and `answers`

## Notes

- Files: `RowEditor.tsx`, `GuestTable.tsx`, `useGuestActions.ts` (`saveReply`), `useRowEditor.ts`, `AddNamesBox.tsx`, guest list `styles.ts`, `types/guests.ts` (`RowValues`)
- The engagement (`logodna-ana-vlad`) is the event with rows, age, diet and custom questions in `src/mock/guests.ts`
- Doesn't depend on the event's tier or type — see `context/fixes/event-edition.md`
