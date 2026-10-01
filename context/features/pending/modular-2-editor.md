# Modular invitations — Phase 2: host editor forms

**Status: not discussed yet.** Below is only what was already settled while planning
phase 1. Everything else must be discussed before work starts.

Builds on: `modular-1-sections.md`.

## Goal

Fill the empty edit panel of the modular template page with working forms.

## Already settled

- The host can **turn optional sections on and off**. Required sections (cover, title,
  date & time, location) and RSVP are always on.
- The host can **pick a variant** for each section.
- The host can **edit each section's content**. The forms are generated from the fields
  each section declares in its `index.ts` (phase 1), including `list` fields.
- **Content belongs to the section, not the variant.** Switching variants never loses
  what the host typed.
- The host can **pick a palette** (whole palettes only, never single colours) and **a font
  pair**.
- **Section order is fixed** for now. It is stored with the sections list so rearranging
  can be added later.
- The **invitation basics** (names, date, venue) are entered once and shared by every
  section that shows them.
- Variants already render in the browser (phase 1), ready to update live as the host types.

## To discuss

- Which tab holds what (Text / Response / Design, or different tabs for modular).
- How sections and variants are presented and picked in the panel.
- How `list` fields are edited (add, remove, reorder items, limits).
- Where the invitation basics are edited, while there's still no event.
- Whether edits are kept anywhere, given there's no event or Firestore yet.
- Unsaved-changes / leave-page warnings.
- How a variant shows that a section has fewer fields than another variant.
