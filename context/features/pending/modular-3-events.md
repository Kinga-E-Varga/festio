# Modular invitations — Phase 3: templates as starting points, linked to events

**Status: not discussed yet.** Below is only what was already settled while planning
phase 1. Everything else must be discussed before work starts.

Builds on: `modular-1-sections.md`, `modular-2-editor.md`.

## Goal

A Custom event gets a modular invitation, started from a template.

## Already settled

- **Templates are presets** (palette, font pair, sections + variants), made by us as a
  starting point. The host can change anything after picking one.
- **Picking a template copies its choices into the event.** The event does **not** store
  the template id. Changing or deleting a template later never changes existing events.
- What the event stores:
  - the **palette id**. Palettes can only be swapped whole, so storing the id is enough.
    Changing a palette's colours later changes every event that uses it.
  - the **font-pair id**
  - the **ordered list of sections with their variant ids**. Order stored on the event,
    ready for rearranging later.
  - the content (invitation basics + each section's fields)
- **Never renamed:** section, variant, palette and font-pair ids. Template ids can change
  freely.
- The event points at variant **code**. A fix to a variant reaches every event that uses
  it. A variant change must never remove a field that hosts have already filled in (same
  care as the core spec's "never break existing events").
- Modular templates need the **Custom** package.

## To discuss

- Firestore document shape. The core spec says to ask before deciding any schema.
- Where and how the host picks a template for a Custom event.
- How the guest invite page, the invitation page and the print page handle modular
  events (phase 1 makes them show not found).
- The invitation's own language for modular invitations.
- More palettes, font pairs and templates.
