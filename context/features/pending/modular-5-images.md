# Modular invitations — Phase 5: image uploads and photo variants

**Status: not discussed yet.** Below is only what was already settled, in the core spec or
while planning phase 1. Everything else must be discussed before work starts.

Builds on: `modular-1-sections.md`.

## Already settled

- From the core spec: host images go to **Firebase Storage**, region `europe-west`.
  Firestore holds only the path / URL, never image bytes. Uploaded images fall under the
  GDPR auto-deletion rule.
- Phase 1 has no photo variants. The board's photo variants wait for this phase:
  - Cover A with a real photo (phase 1 uses a dark background in its place)
  - Cover B, Split editorial
  - Location B, Venue photo, two stops
  - Dress code B, Mood board
  - Accommodation A, Photo cards

## To discuss

Everything else: upload limits and formats, cropping, how image fields are declared,
what shows before a host uploads anything, deletion when an image is replaced.
