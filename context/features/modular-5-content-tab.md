# Modular invitations 5 — Content tab

The modular editor's empty Text tab becomes the **Content** tab. It is where the host
edits the words and other values of every section that is on.

## Tab name

- "Text" becomes "Content" in every editor: simple, modular and print.
- EN "Content", RO "Conținut", HU "Tartalom".

## Section list

- Reuse the section cards from the Design tab's section list (`SectionsList.tsx`): same
  card, same look.
- The on/off switch is replaced by a **number**, the section's position on the page
  (1, 2, 3…). Only sections that are on are counted. Header is 1, footer is last. The
  numbers update when a section is switched on or off in Design.
- Only sections that are **switched on** in Design are listed. Sections that are off are
  left out completely.
- Clicking a section scrolls the preview to it, the same way Design does, and opens that
  section's fields under the card.
- **One open at a time:** opening a section closes the one that was open.
  (Design's variant pickers do not work this way, on purpose. Leave them as they are.)

## Click to edit in the preview

- Hovering a section in the preview shows a **CLICK TO EDIT** box in its top-right
  corner.
- Clicking it opens the side panel if it is closed, switches to the Content tab, opens
  that section's fields and scrolls the preview to it.
- Shown only in Edit mode, not in View. Not shown on touch devices (no hover).
- Shown on every section that has fields, including header and footer.
- Host-app text: it follows the host's locale, not the invitation's language.

## Fields per variant

- A section's fields belong to the section, and a variant may show fewer of them. Each
  variant gets a list of the fields it shows. The Content tab shows only those.
- Watch out: a variant may show a field that a template leaves empty on purpose. That
  field still shows in Content as an empty field the host can fill. "Empty" never means
  "hidden".
- Switching variant keeps every value, including the ones the new variant hides.
  Switching back brings them back.

## Field types

| Type        | Input                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| `text`      | single-line text                                                         |
| `longText`  | multi-line text                                                          |
| `time`      | time input                                                               |
| `toggle`    | the panel's switch (`PanelSwitch`)                                       |
| `image`     | current photo as a thumbnail, a "Change photo" button that does nothing yet, a "coming soon" note. No uploads in this feature. |
| `icon`      | an icon picker over the icon library (see below)                         |
| `list`      | the item's fields per item, with Add and Remove                          |
| `groups`    | the group's fields and its inner list, with Add / Remove for both levels |

- Every field uses its existing label (EN / RO / HU) and its `maxLength`.
- **No character counter** for now.
- **No fallback:** an empty field shows nothing on the invitation. (May change later.)

### Lists

- Add and Remove only. **No reordering** for now.
- Add stops at the list's `maxItems` (`maxGroups` for groups).
- Remove asks nothing.
- **Location needs at least one venue.** Its last venue cannot be removed.
- Every other list may go down to zero items. The section still works with an empty list.

### Icons

- Icons can be picked only in **Schedule variant 1** (each event's icon) and in
  **Helpful notes' custom notes**. Every other icon is fixed by its variant and is not a
  field.
- The picker shows the icon library (`ICONS` in `src/modular/icons.tsx`) as a grid.

## Special sections

- **Date & time:** the date comes from the event details. It shows read-only with a short
  "set in the event details" line. The time is edited here (see below).
- **Helpful notes:** when its Dress code or Gifts switch is on, those fields show inside
  Helpful notes. They are the same values the standalone Dress code and Gifts sections
  use. Custom notes get Add / Remove and the icon picker.
- **Reply:** only its texts are edited here (heading, notes). The reply questions belong
  to the Replies tab, not this feature.

## Date & time: one time, not a list

Date & time has a `moments` list today (up to 4 parts of the day, each with a time, a
title and a place). It becomes a **single `time` field**.

- `src/modular/sections/date-time/index.ts`: `moments` is replaced by one `time` field.
- `defaults.ts` and any template that sets `moments`: a single time instead
  (the current sample's first time, `15:30`).
- **Countdown** (`src/modular/countdown.ts`): counts to that time instead of the first
  moment's.
- **Variant 1 (Calendar card):** under the date, one line — the clock icon and the time.
  No title, no place.
- **Variant 2 (Accent & big date):** the note under the big date is replaced by the time.
  The variant shows only the date and the time.

## Saving

- Content and Design share one working state, one Save (in memory) and one leave-page
  warning, as Design does today.

## Out of scope

- Photo uploads (Firebase Storage)
- Reordering list items
- Fallback to sample text for empty fields
- Character counters
- Reply questions (Replies tab)

## Time format

A time is stored as typed (`15:30`) and shown in the **invitation language's own style**:
EN `3:30 pm`, RO and HU `15:30`. This applies to every time on the invitation (Date &
time and Schedule).

## Required fields

- A field can be marked `required` in its section's definition.
- **Date & time's `time` is required.** More required fields will be picked once the form
  can be seen and tried.
- A required field is marked in the Content tab.
- **Save is blocked** while a required field is empty: the button stays clickable, but
  nothing is saved.
- **Error message:** when the host empties a required field and leaves it (blur), a small
  error shows right below the field. It goes away as soon as the field has a value again.
- Clicking Save then jumps to the first empty required field: the panel opens on the
  Content tab, the field's section opens, the field is focused and shows the same error.
- A required field the current variant does not show does not block Save.

## Open questions

- Which other fields are required — decided after seeing the form.
