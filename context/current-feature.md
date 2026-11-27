# Current Feature: Security rules and live updates (database step 6, part 1)

## Status

Completed

## Goals

From `context/features/pending/database.md`, Order step 6, the part that runs fully on the
local machine. The `festio-staging` project and the checks on it are the next feature.

**A. Firestore and Storage rules, with tests** (`firestore.rules`, `storage.rules`, until
now closed to everyone)

- Firestore: closed by default. A signed-in host can **read** their own event cards
  (`hostId` = their uid) and everything inside them (replies, guest list, seating,
  invitation). No browser writes anywhere.
- `users/<uid>`: readable only by that user. `payments`, `slugs`, `rateLimits`: no browser
  access at all.
- Storage: only the event's host can upload into `events/<event>/`, images only (WebP,
  JPEG, PNG; never SVG), at most 1 MB a file. Guests get photos through download-token URLs.
- Rules tests on the emulator (`@firebase/rules-unit-testing`, `npm run test:rules`),
  written by a separate agent from the spec before the rules: a guest can't read replies,
  host A can't read host B's event or its cards, nobody writes from the browser,
  `payments` / `slugs` / `rateLimits` are closed, uploads over 1 MB or not images fail.

**B. Live updates for hosts** (`onSnapshot`)

- The browser stays signed in to Firebase across page loads: a custom token the server
  makes from the session cookie (the cookie decides who the host is). Log out signs the
  browser out too.
- Dashboard: listens to the host's event cards and calls `router.refresh()` when one
  really changed; the host's own save causes no second refresh.
- Guest list page: listens to its event's replies and list card and redraws in the
  browser; a row being edited keeps its draft. While it's open, the dashboard listener
  ignores that event's replies count, and catches up when the page closes.

## Notes

- Plan: `context/plans/festio-staging-rules-and-live-updates.md` (Phase 1 = this feature;
  Phase 2 = the next one).
- Decided 2026-11-27: the dashboard listens, then refreshes; the guest list redraws in
  the browser.
- Checked in the browser by the owner, 2026-11-27: live updates on the dashboard and the
  guest list, drafts kept, one refresh per save.
- Expected costs: switching the guest list on or off, or leaving a guest list after a save
  on it, causes one refresh; a guest list page load reads every reply twice (server and
  listener). Noted in `database.md`.
- Left for later: the landing page still loads Firestore through the Log out form (a
  speed pass before launch).
- **Next feature** (`chore/festio-staging`): step 6's parts C and D, the plan's Phase 2
  (Tasks 7–11): the `festio-staging` project with the owner, rules and indexes deployed,
  App Hosting, `FESTIO_SECRET`, and the checks only the real project answers. Email
  verification after it (`context/fixes/pending/email-verification.md`).
- At `/feature complete`: **don't** mark step 6 done in `database.md`; add under step 6
  that the rules, their tests and the live updates are built (this commit).
- Simplify: ran 2026-11-27
