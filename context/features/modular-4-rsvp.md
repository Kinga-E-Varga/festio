# Modular invitations — Phase 4: modular RSVP

**Status: not discussed yet.** Below is only what was already settled, in the core spec or
while planning phase 1. Everything else must be discussed before work starts.

Builds on: `modular-1-sections.md`.

Visual reference: the design canvas "Type 2 Invitation", board **Modular RSVP + states**
(https://claude.ai/artifact/4cHNDX7cGjTuVQzEE399WL). The board is a design idea, not an
agreed spec.

## Already settled

- **RSVP is a section** with variants, always present, always last. Phase 1 ships one
  variant (`rsvp/simple`, today's form).
- From the core spec (`context/project-overview.md`, RSVP):
  - modular hosts add optional questions from presets or fully custom
  - all non-core questions are attend-only
  - no conditional question logic in v1
  - the answer storage rules (permanent question ids, missing key = never asked, null =
    skipped, archived never deleted, type and scope freeze once in use, the required rules)

## Ideas on the design board, not yet agreed

- Some sections add a question to the RSVP form: Transportation (shuttle), Playlist (song
  request).
- Turning such a section off archives its question rather than deleting it.

## To discuss

Everything else: which presets exist, how the host adds and edits questions, RSVP
variants, how section-driven questions work, per-person vs whole-reply questions.
