# Fix: Guest Page Access

The guest invitation page ignores the event's visibility and state. Anyone with the link sees the whole invitation and an open reply form. Split out of `simplify-follow-ups.md` (was Bug 12).

## Status

Not Started

## Goals

### The problem

- `/maria-andrei` is Protected (password `andrei26`) but shows no password box
- `src/app/invite/[invite]/page.tsx:23-43` only checks `repliesPaused`

### What the guest may see

Decide this before drawing the card:

- **Hidden or deleted** → a "not available" page
- **Protected** → a password box first; the invitation only after the right password
- **Cancelled** → the header plus the host's short message (project spec, Lifecycle)
- **Reply window closed** (24h rule or the host's own closing time) **or event past** → the card as usual, but the reply panel shows a "replies are closed" line, like the paused one

### Texts

- Guest-side texts in `Rsvp` in all three catalogs (`en`, `ro`, `hu`): password box, wrong password, not available, cancelled, replies closed

## Notes

- **Ask first:** the event has no "cancelled" state or cancel message yet (`src/types/dashboard.ts`, `src/mock/dashboard.ts`). The data shape is unsettled, so agree on the fields before adding them. `confirm-cancel-delete.md` needs the same fields
- **Ask first:** how the password is checked and remembered (per visit, cookie, server check). It must not be sent to the browser with the page
- The password rule stays as in the spec: min 4 chars, letters or digits
- Keep `noindex` on every one of these pages
- Pages to check: `/maria-andrei` (Protected), a Hidden event's link, an event past its closing time, an unknown link
