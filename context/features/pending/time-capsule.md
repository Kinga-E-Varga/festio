# Time capsule notes

**Status: idea, not designed yet.** Seen on another invitation, never used.

## Why

Guests write a note for the hosts to open on a later day: a couple on their first anniversary, a child on their 18th birthday. It turns the invitation into a keepsake, beyond the event itself.

## Goals

- A form of its own, apart from the reply form: a guest writes a note without replying, and a reply never asks for one.
- Shown on the invitation as an optional section, which opens the form.
- The host exports the notes and keeps them; Festio doesn't keep them past the event.
- Works for any event with a later day worth opening on: weddings (the first anniversary), birthdays (the 18th), others.

## Notes

- **Retention clashes with the idea.** The whole invitation record is deleted a set period after the event (now 60 days, `src/lib/config.ts`), long before an anniversary. So Festio never opens the notes on the day: the host exports them before the deletion and opens them then. The host must be told clearly and early, and reminded before the deletion.
- Open: does the host see the notes before the day, or only export them sealed? Sealed fits the idea, but Festio can't stop them opening the file.
- Open: the export's format (one printable page per note, a PDF is out of scope for v1, a plain file, …).
- Open: a note's fields (the note; a name or anonymous; a photo is out of scope as a gallery).
- Open: a guest's limit on notes, rate limiting as for replies, the reply cap.
- The privacy notice on the form says who reads the note and when it is deleted.
- New guest data: the Firestore shape needs asking first (`context/project-overview.md`, Unsettled).
