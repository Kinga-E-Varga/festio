# Current Feature: Database step 3 — Auth

## Status

Completed

## Goals

- Hosts can sign up and sign in with email + password, and with "Continue with Google".
  One account per email: Google and password on the same email reach the same account.
  No Apple, no Facebook. Hosts can sign out.
- Sign-up creates the host's `users` card (name, language, joined, accepted Terms version +
  when), checked by `userSchema`.
- Works against the Auth emulator (seed login `maria@festio.test` / `festio-dev`).
- The signed-in host replaces `DEV_HOST_ID` (`src/db/reads/host.ts`) everywhere it's used
  (`loadHost`, `loadHostEvents`, `loadEvent`). Signed-out visitors to host pages go to
  sign-in.
- **One shared check**, next to the reads: logged in, and it's _their_ event. Every server
  action (from step 4 on) and every host page starts with it.
  - It replaces `openEvent` (`src/app/[locale]/dashboard/events/[id]/load-event.ts`, also
    imported by the invitation and print pages).
  - On dashboard pages it takes the event from the host's events the layout already read,
    instead of reading the card again.
  - `loadInvitation` and `guestListCount` go through it, so no caller can pass a bare
    event id and skip it.
- The landing page gets a lighter read than the whole `loadDashboard`, just for its two
  badge counts.

## Notes

- Spec: `context/features/pending/database.md` (Step 3, User card, Security rules).
- Document shapes are settled; don't re-open them. The `users` card is `userSchema` in
  `src/db/schemas/user.ts`.
- No `src/actions/` exists yet — this step builds the shared check; host saves come in
  step 4.
- The guest page (`invite/[invite]/page.tsx`) also calls `loadInvitation(event.id)`, with
  no host. It needs its own guest path that doesn't bypass the host check.
- Decided: the server knows the host by a Firebase session cookie (`__session`, 14 days)
  the Admin SDK verifies; after sign-in the host always lands on `/dashboard`.
- Decided: the last visit lives on the `users` card (`lastVisit`). The badge is built with
  step 4 (setting it is a host save), noted there in `database.md`.
- Firebase behaviour: Google on an email whose password account isn't verified keeps the
  account but drops its password. Avoiding it needs email verification (not built): `context/fixes/pending/email-verification.md`.
- Worth a look, not a must: every dashboard page runs one replies query and one template
  load per event. Fine at a few events.
- Plan: `context/plans/database-step-3-auth.md`
- Simplify: ran 2026-10-22
- Firebase console steps (turning on sign-in methods) are step 6; here everything runs on
  the emulator.
