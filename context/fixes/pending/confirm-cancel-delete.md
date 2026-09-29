# Fix: Confirm Cancel and Delete

Cancel event and Delete draft act on a single click. Split out of `simplify-follow-ups.md` (was Bug 15).

## Status

Not Started

## Goals

### The problem

- One click shows the "done" toast straight away (`DangerZone.tsx:53` and `:74`)
- The spec asks for a detailed confirmation and the host's password before cancelling

### Confirmation step

- Open a confirmation step first. It says what will happen and how many guests have replied
- **Cancel event:** the host writes the short message guests will see in place of the invitation, then re-enters their password
- **Delete draft:** a plain confirm, no password
- Show the toast only after the host confirms. Backing out changes nothing

### What cancelling does (project spec, Lifecycle)

- The reply form closes
- The invitation page shows a header plus the host's message
- Guests are not notified; the confirmation says so

## Notes

- **Ask first:** the event has no "cancelled" state or cancel message yet. Agree on the fields before adding them. `guest-page-access.md` reads the same fields to show the cancelled page
- **Ask first:** "the host's password" is the account password, and there is no auth yet. Decide whether this step checks a real password or stays a mock for now
- Texts in `Dashboard` (or the event editor's namespace) in all three catalogs
- Pages to check: `/dashboard/events/1` (Danger zone), a draft event's Danger zone
