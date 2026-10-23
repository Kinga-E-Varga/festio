# Current Feature: Database step 4 — Host saves

## Status

Completed

## Goals

- Every host save goes to Firestore through a Server Action in `src/actions/`. Each one
  starts with the shared check (`src/db/reads/access.ts`: signed in, and it's their event),
  validates its input with the card's Zod schema, and returns `ActionResult`. Editors show
  the outcome in their existing toasts; today's in-memory saves go away.
- **Event settings** (`EventEditor`) saves the event card. The server enforces the rules the
  form already shows: the date locked from the event day, Protected needs a password, only
  the server changes the package.
- **Slug claiming:** a new or changed link is claimed in a transaction on `slugs/<slug>`; a
  second claim fails with a friendly message. The link check reads the slug cards, not just
  this host's other events (`takenSlugs`), since links are unique across Festio.
  `loadEventBySlug` also checks the event's `slug` still equals the link, so a stale slug
  card never opens the event.
- **Invitation editors** (simple `HostInvitationEditor`, `ModularEditor`) save
  `invitation/content`. A saved modular card keeps its own section list; sections added to
  the library later are merged in when it's read (`modularStart`).
- **Guest list page:** pre-loaded names (add, rename, delete, sent, save list) on the
  `guestList` cards, and the host's reply edits (add, edit, delete, separate from group,
  match, add as new, different person) on the reply cards.
  - Every reply change is one transaction with the event's `counts`. The host can always
    add replies, past the cap or not.
  - **One shared function for the counters**, used by these actions and the seed (`counts`
    in `seed/index.ts` today), so the two never disagree. Step 5's guest reply transaction
    reuses it.
  - Safety net: the guest list page recounts on load and quietly fixes drifted counters.
- **Danger zone:** cancel the event (message + when, host re-enters their password), delete
  a past or cancelled event's record now. No Delete draft: drafts never reach the database
  (see Decided 2026-10-23).
- **No unpaid saved events** (Decided 2026-10-23): the reworks listed there.
- **Print settings** (`print` on the event card) saved when the printable is exported, so the
  print page opens with the last settings.
- **Saving from two places:** every card a host edits in a form (event, invitation, guest
  list) carries a `version`. The editor sends the version it started from; the server checks
  it in the same transaction, saves and adds one. If someone saved in between: "This was
  changed on another device. Reload to see the latest version."
- **"New since your last visit" badge:** optional `lastVisit` on `userSchema`, set by a Server
  Action when the host opens the latest replies; the strip's replies icon (`countedViews` in
  `BarActions.tsx`) counts guests' replies (`createdBy: guest`) sent after it.
- Everything works against the emulator; `npm run build` passes.

## Notes

- Spec: `context/features/pending/database.md` (step 4; Event card, Reply card, Guest list
  card, Slug card, Saving from two places, Security rules). Document shapes are a starting point:
  change one when a feature needs it, and say so before changing it.
- Scope chosen 2026-10-22: host reply edits, cancel/delete and print settings join step 4.
  Guest replies (cap check, duplicate check, closing time, rate limiting, password) stay in
  step 5.
- Separate from group moves a person to a new reply card; their permanent ID stays, so a
  seat follows them. Unknown and Duplicate tags are never stored; `differentPerson` is.
- Question rules hold on save: type and scope freeze once in use; Required can't be turned on
  once answers exist.
- Large feature: plan first (`/feature plan`).
- Plan: `context/plans/database-step-4-host-saves.md`
- Simplify: ran 2026-10-23

### Decided 2026-10-22

- **Old link after a link change:** the old slug card stays, blocked for `SLUG_BLOCK_DAYS`,
  still pointing to its event. It never opens that event. The **same host** can claim it again
  for **any of their events**: the server reads the blocked card's event to find its host
  (no new field on the slug card), then points the card to the new event and clears the
  block. Anyone else is told the link is taken. Works after data deletion too, since the
  leftover event card keeps its host.
- **Delete now:**
  - **Past or cancelled event:** one shared function, reused by step 8's nightly job. It
    deletes the invitation, replies, guest list, seating and the event's Storage folder,
    blocks the slug for a year, and strips the event card to its leftover
    (`dataDeleted: true`) **last**, so a stop halfway can be finished later.
  - **Leftover keeps:** title, event type, date, package, template, created date, host.
    Drops guest data, password, questions, counts, print settings and the cancel message.
    Step 8 may still adjust this.
  - ~~Draft deleted outright~~ — replaced on 2026-10-23: there are no drafts in the database.
- **Reopen a cancelled event:** a small action that clears `cancelled`, since the cancel text
  promises it ("you can reopen the event at any point in that window"). No button exists
  yet; add one to the Danger zone's cancelled row.
- **"Guests won't be notified" warning:** today the editors only show a toast after saving.
  Add the blocking warning before the save (project overview, Lifecycle): it shows the
  current reply count, and the host agrees or cancels. One shared confirm, used by Event
  settings and both invitation editors, shown only when the invitation isn't Hidden.

### Decided 2026-10-23 — a reply is edited whole

- **Edit opens the whole reply**, from any person in it, in a dialog like New reply: one
  status, each person, then the reply-wide questions. Status and reply-wide answers are the
  whole reply's, as the guest's RSVP form asks them. Storage already works this way: the
  reply card holds one `status` for all its people.
- **People can be added** in the edit form, **not removed** once saved. The dialog's
  **Delete reply** removes the whole reply at once, after a confirm naming everyone.
- **Separate** is its own row action (with a confirm, saved straight away), shown instead
  of Delete while the person is in a group. To change or delete one person: separate them
  first. Seats follow people, since separating keeps their permanent ID.
- Someone switched to Coming is asked like a new reply.

### Decided 2026-10-23 — drafts live on the device

**The model.** The database holds only real events. An event is saved only once it is fully
paid for (or Free on a Free template). Work in progress lives on the host's device.

- **`package` = what was bought, and it always covers the template.** The worked-out `paid`
  flag goes. "Unpaid" stops existing for a saved event.
- **Drafts are local only** (browser storage), never in Firestore. The host need not be
  signed in while playing. Tied to that browser: switching device or clearing site data
  loses it. Database drafts can be added later if hosts ask; local first doesn't block it.
- **The cart = local drafts** ("invitations you started but haven't finished"). The
  dashboard home may also show a "Continue your invitation" card, from the same local data.
- **One delete rule for every saved event:** Cancel, then Delete now (or wait until it is
  past). Its data goes, its link stays blocked for a year (guests may hold the link or a
  printed card). No `everPublic` field needed.
- **Upgrading a saved event:** a template above the bought package can be previewed and
  played with, filled with the event's own details, but not applied until the difference is
  paid. Then the switch happens and the content carries over (template rule 4).
  Customisations made while previewing aren't kept (v1). The live invitation is never
  touched before payment.

**Rework in step 4 (now):**

- Remove `isDraft`, `deleteDraftEvent`, `deleteDraft` and the Danger zone's Delete draft row.
  A Free event follows the same Cancel → Delete now path as any other.
- Remove the worked-out `paid` / `neededPackage` and `awaitingPayment`; the cart no longer
  lists saved events (it stays empty until local drafts exist), and the unpaid notices go.
  The Overview's package box shows what was bought, plus the upgrade.
- `eventStatus`: active = not Hidden. The dashboard's "draft" pile is renamed (my call:
  "Hidden"), so "draft" only ever means unsaved work on the device. The `hiddenPaid`
  notice becomes a plain Hidden notice.
- Seed: every event's package covers its template (`revelion` is Free on the modular
  `olive-garden` today).
- Step 5's guest page: an invitation opens when it is not Hidden; no paid check.

**Later — its own feature (new-event flow).** Not built in step 4; payments don't exist yet.

1. **New event:** occasion, language, date (ask less if possible).
2. **Play:** pick a template, edit, switch, try things. Saved on the device as it goes.
3. **Continue, step 1 (required):** title (pre-filled from the occasion) and the link,
   checked as they type, not held. The price shown here before paying.
4. **Continue, step 2 ("anything else", skippable):** expected guests, pre-filled with
   **150** (a constant in `src/lib/config.ts`, next to the cap margins), plus the other
   details. Skipping keeps 150, so the reply cap always works. The rest can be finished
   after saving.
5. **Sign in / sign up** if not signed in.
6. **Claim the link** on the server, **before** any payment, for both Free and paid. If it
   was just taken: a friendly message and pick another.
7. **Free template:** a confirm page with one button ("Create my event"). **Paid:**
   payment; if it fails or is abandoned, the link is released.
8. **The event is saved** under the host; the local draft is removed; they land on the
   event's dashboard.
