# Preloaded Guest List Editor

The add-names box on the guest list page (`#list`) becomes an editor for the whole
preloaded list: paste names in, see every name on the list, remove the ones not wanted,
then save or cancel.

## Layout

The box opens at the top of the Guest list header, above the Preloaded list / New reply
buttons and the search, on every screen size. It fades and drops in on open, and fades out
on Cancel / Save.

The box, top to bottom:

1. **Header row** — title ("Preloaded guest list", in the section-title style) on the left;
   **Cancel** and **Save** on the top right.
2. **Paste area** — the existing textarea (one name per line) with an **Add X names**
   button under it, on the right.
3. **Count** — "Your list has X names right now." on the left, above the list, following
   the draft. Hidden when the list is empty (the list says so itself).
4. **The list** — every name in the draft, new and saved together, in **A→Z order**
   (sorted the way the host's language sorts). Columns at least 220px wide fill the box
   evenly, 40px apart; long names end in "…". Long lists scroll inside the box.

## The draft

- Opening the box starts a draft from the saved list. Nothing is saved until **Save**.
- **Add X names** moves the pasted names into the list and clears the textarea.
- The repeats check runs at this step, against the whole draft (saved + already added
  names). Same flow as today: the warning lists the repeats, with **Keep them** /
  **Go back and edit**.

## Removing names

- A **waiting** name (on the list, no reply yet) and a **new** name show an **×**.
  × removes it from the draft. No undo; Cancel is the undo.
- A name **with a reply** (matched by name or by hand) shows **"replied"** instead
  of the ×. It can't be removed here.
- "Has a reply" = on the list but not among the waiting rows (`list.waiting` from
  `useGuestList`), the same row logic the table uses.
- Removing every waiting name is allowed; the draft may save empty (replied names always
  stay).
- Renaming isn't part of the box. Typos: × and paste again, or rename in the table's row
  editor.

## Save and Cancel

- **Save** is disabled until the draft differs from the saved list. It applies only the
  difference — adds the new names, removes the ×'d ids — so changes made to the list
  meanwhile (e.g. an invite-sent tick) survive. Confirms with a toast and closes the box.
- **Save with text still in the paste area** (pasted, never added): show a note
  "You have names you haven't added yet" with an **Add them** button, which runs the
  normal add step (including the repeats check). Nothing is saved until the host saves
  again.
- **Cancel** with no changes closes the box. With changes, it asks "Discard your
  changes?" first.

## Deleting from the table (unchanged, for reference)

- Deleting a reply never deletes its list name.
- Deleting a waiting row deletes that name from the list.

## Out of scope

- Renaming names inside the box.
- Undo for single removals.
- Removing names that have replies from the box.

## Files

- `src/components/dashboard/guest-list/AddNamesBox.tsx` — reworked into the draft editor
  (file name kept).
- `src/components/dashboard/guest-list/useGuestActions.ts` — new `saveList(added, removedIds)`.
- `src/components/dashboard/guest-list/GuestManager.tsx` — passes the list, waiting names
  and save handler.
- `messages/{en,ro,hu}.json` — new wording (title, "replied", Save, unadded-names
  note, discard confirm, toast).
