# Modular invitations 3 — Design editor

Builds on: `modular-2-olive-garden.md`.

## Goal

Fill the **Design** tab of the modular editor's panel (`ModularEditPanel`) with working
settings. Text editing of the sections is a separate feature.

## What the host can do

The Design tab has five parts, top to bottom:

1. **Template.** Shows the current template. Clicking it opens the list of modular
   templates to choose from; while the list is open, every other design setting is
   hidden. Only Olive Garden exists for now. That's fine.
   - Picking a template **replaces the palette, the ground pattern and the font pair**
     with the template's own.
   - It **does not change the sections**: what is on stays on, what is off stays off.
2. **Colour palette.** Pick one of the given palettes. Whole palettes only, never single
   colours. Only Dark Olive exists for now.
3. **Ground pattern.** Pick the pattern drawn on the ground around the invitation, or
   none for a plain ground. Only Dots exists for now. It's drawn in the palette's colours.
4. **Font pair.** Pick one of the given font pairs (body + headings). Whole pairs only.
   Only Gelasio + Arimo exists for now.
5. **Sections.** Turn each optional section on or off.
   - Always on, no switch: top bar, cover, title, date & time, location, reply form,
     footer.
   - Optional: everything else (countdown, schedule, transportation, accommodation, menu,
     helpful notes, dress code, gifts, FAQ, playlist).
   - The order is fixed. Hosts can't rearrange sections for now.
   - **Variants:** every section that is on shows its variant picker right below it,
     required sections included. Turning a section off hides its picker. Switching
     variant never loses content.
   - **Helpful notes** comes with three subsections: Dress code, Gifts and a custom one.
     Each has its own on/off switch, right under the Helpful notes switch.
   - Up to **6** subsections in total (`MAX_NOTES`, now 4).
   - The **custom** switch covers all custom notes at once. Turning it on adds one custom
     note; the Design tab never adds more. The text editor can add more, or delete them,
     and works on the same notes. Deleting the last custom note there turns the switch
     off; turning it on again adds one.
   - Turning the custom switch off hides every custom note but keeps them. Turning it
     back on brings them all back.
   - Dress code and Gifts can be on as standalone sections and inside Helpful notes at the
     same time. Festio doesn't prevent it; it's up to the host to turn one off.

The preview updates live as the host changes a setting.

## Saving

- Nothing is saved until the host clicks **Save** in the editor top bar. This covers
  every change made in edit mode, in every tab.
- Save stays off and the top bar shows no unsaved state until something changed (the
  top bar already supports this via `dirty`).
- **Leave-page warning:** while there are unsaved changes in any tab, leaving the page
  asks first (`useLeaveWarning`, the same as the guest list).
- Saved only in memory for now, like the simple editor. There's no event or Firestore
  yet.

## Already settled

- **Content belongs to the section.** Turning a section or a Helpful notes subsection
  off only hides it; the data stays. Turning it back on brings back exactly what the
  host had. This holds for every section.
- Section order is stored with the sections list, so rearranging can be added later.
- Events store section, variant, palette, pattern and font-pair ids. Template ids are not stored.
