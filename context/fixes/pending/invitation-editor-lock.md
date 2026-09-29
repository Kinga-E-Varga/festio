# Fix: Invitation Editor Lock and Save Warning

The invitation editor ignores the 24h lock and never shows the "guests won't be notified" warning. Split out of `simplify-follow-ups.md` (was Bug 16).

## Status

Not Started

## Goals

### The problem

- `/invitations/<id>` stays editable after the 24h lock
- Save never shows the "guests won't be notified" warning when the invitation isn't Hidden
- `[locale]/invitations/[id]/page.tsx:46-51` passes no `locked` or visibility; `HostInvitationEditor.tsx:58-60` saves with no checks

### The fix

- Pass the event's `locked` state, visibility and reply count into the editor
- **Locked** → read-only: no edit toggle, no save, a short line saying why
- **Not Hidden** → before saving, show the blocking warning with the current reply count. The host agrees or cancels (project spec, Lifecycle)
- Reuse the event editor's warning (`event-editor/ChangeWarning.tsx`) and its texts, so both editors say it the same way

## Notes

- Related: Bug "The warning only appears after the first reply" in `simplify-follow-ups.md` asks what should trigger the warning (reply count or "not Hidden"). Settle that first, so both editors use the same rule
- The lock is `contentFreeze` in `src/lib/event.ts`. The daylight-saving bug in `simplify-follow-ups.md` changes it, but the call stays the same
- Pages to check: `/invitations/maria-andrei` (Public / Protected), a Hidden invitation, an event less than 24h away
