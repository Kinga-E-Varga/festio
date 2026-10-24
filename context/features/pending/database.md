# Database, hosting and environments

The plan agreed in chat before connecting anything. Steps 1–5 are built: the app reads and
saves to the local emulator (see Order); what they left open is under Do later. Fields and names are a sketch to build from, not a final
schema. Each step still gets its own spec in `current-feature.md` when it's built.

## Platform

- **Firebase** for everything: Firestore (data), Auth (host accounts), Storage (host photos),
  App Hosting (the Next.js app). Chosen because it starts free and Festio's data fits it:
  almost everything belongs to one event, and events are small.
- **Firebase App Hosting**, not classic Firebase Hosting, because only App Hosting supports
  wildcard subdomains (see Links).
- Both cloud projects need the **Blaze** (pay-as-you-go) plan for App Hosting and Storage.
  Usage should stay inside the free allowances; set a budget alert of a few euros on each.
- **Region:** `europe-west4` (Netherlands) for Firestore, Storage and App Hosting, in both
  projects. It's App Hosting's only European region, and keeping everything in one place is
  faster and has no cross-region fees. A Firestore database's location can never change.
  Storage's free 5 GB is US-only, so EU storage is paid from the first byte (about $0.02 per
  GB a month).

## Environments

| Where                    | For                           | Data                                    |
| ------------------------ | ----------------------------- | --------------------------------------- |
| Your machine (emulators) | Everyday coding               | Fake seed data, kept in git             |
| `festio-dev`             | Checking things deployed      | Test data only                          |
| `festio-prod`            | Real hosts and guests         | Real data, never copied anywhere        |

- **Emulators:** Firestore, Auth, Storage and Functions run locally. The app connects to them
  when an env variable says so. A seed folder (a few events, replies, a guest list) is
  loaded on start, so everyone and CI start from the same data.
- Each cloud project has its own Firestore, Auth, Storage and App Hosting backend. Nothing
  is shared between them.
- Prod data is never copied to dev (GDPR).
- Prod gets point-in-time recovery or scheduled backups and delete protection.

## Deploying (CI/CD)

- **App Hosting is linked to GitHub.** The dev backend follows `main`.
  The prod backend has automatic deploys off; a "Deploy to production" button in GitHub
  Actions starts a release, ideally with an approval step.
- **Dev deploys only after the checks pass.** By default App Hosting deploys every push, even
  one whose lint, build or rules tests failed. Instead, its automatic deploys are off on dev
  too, and the GitHub Action starts the dev deploy once all checks are green.
- **Settings per environment** in `apphosting.yaml` plus a file per environment. Secrets
  (payment and email keys) in Secret Manager, never in the repo. No service-account key
  files: on App Hosting the server can already use its own project.
- **Rules and indexes** (Firestore and Storage) are not deployed by App Hosting. A GitHub
  Action tests the rules against the emulator, deploys them to dev on every merge, and to
  prod in the same manual release as the app, so rules and code always match.
- **On every push:** lint, build, rules tests.
- **Changing data shapes:** Firestore has no migrations. Code reads both the old and the new
  shape for a while (Zod with defaults). Old documents are fixed with a one-off script, run on
  the emulator, then dev, then prod.

## Data

**Collection** = a folder. **Document** = one card in it, with fields; a card can have its
own folders inside.

```
users/            one card per host
events/           one card per event
  └ <event>
      replies/    one card per reply a guest (or the host) sends
      guestList/
        └ names   every name the host pre-loads
      seating/
        └ chart   the whole seating chart
slugs/            one card per link name, pointing to its event
payments/         one card per payment
rateLimits/       short-lived counts per visitor (see Rate limiting)
```

### Event card

Only what the event form asks: title, event type, language, date, reply closing time,
link name, visibility, password, expected guests, whether a guest list is pre-loaded. Plus
package and template. No time, venue or address: the form doesn't ask for them.

**Time zone** (e.g. `Europe/Bucharest`): taken from the host's browser when the event is
created; not shown or changeable in the event form for now. Every time rule uses that
place's clock: replies closing (00:00 the day before, or the host's own time), the 24h
lock, the deletion date. Otherwise they'd follow the server's clock in the Netherlands.

Worked out each time, never saved: countdown, locked / locks in, Active / Hidden / Past,
closes in.

- **Title** shows on the host's side (dashboard, editors) and as the invitation page's tab
  text. It is never copied into the invitation.
- **Date** is never copied into the invitation either. The invitation always shows the
  event's date, so postponing changes it everywhere at once. The host still picks how it's
  written (date format).
- Everything else on the invitation is the host's own text, written in the invitation editor.

Also on the event card:

- **`questions`** — the host's own questions: permanent ID, wording, type (choice / yes-no /
  text), per person or once per reply, required, archived. Archived ones are hidden from the
  form but their answers still show and export.
- **`print`** — the printable's settings: shape (flat / folded), tinted, headline, note.
  Saved when the printable is exported, so the print page opens with the last settings.
- **`package`** — what has been bought, starting at Free. It always covers the template: an
  event is saved only once it's paid for (or Free on a Free template), and drafts live on
  the host's device, never in the database. No paid flag.
- **`cancelled`** — the host's short message and when it was cancelled; missing = not
  cancelled.

**Counters** (`counts`), so the dashboard never reads every reply of every event: people coming, people not coming, names needing attention,
`seatingWarnings`. Replied = coming + not coming; invited and waiting come from the guest
list and are worked out.

- **Every change is a transaction:** check the count, save the reply, update the count, as
  one step. Two guests sending at the same second are handled one after the other, so the
  second is checked against the new number and can be told the form is paused.
- The same for the host adding, editing, deleting or separating a reply.
- **The cap is for safety only.** It pauses the guest form; the host can always add replies,
  paused or not, and the counts keep going up.
- **A reply is checked against the count before it**, like the form's pause: one reply that
  arrives just under the cap is saved whole, so it can pass the cap by up to 9 people. A family
  replying together is never cut off halfway.
- **Safety net:** the guest list page loads every reply anyway, so it recounts and quietly
  fixes the counters if they've drifted.
- **A guest's reply adds only the difference it makes** (`readReplyGroup`,
  `countsWithReply`): it reads the replies sharing one of its names, the ones the host matched
  to a list name spelled like them, the list and the seating chart, and counts that group
  before and after. Host saves still recount the whole event.

**Protected password:** stored as it is (not hashed), because the host sees it in the share
fields and it's printed on the card. It guards a page, not an account. Only the server ever
reads it; it's never sent to the guest's browser. The guest types it and the server checks
it, with wrong guesses rate-limited per visitor (e.g. 10 per hour), like replies.

### Invitation card

The invitation's look and text, on its own card inside the event (`invitation/content`), so
the dashboard never loads every invitation and the event and invitation editors each save
their own card.

- **Simple:** the field values (field ID → text) and the envelope on/off switch.
- **Modular:** palette, font pair, pattern, corners, each section on/off and its variant,
  every section's values (today's `ModularState`).

### Reply card

One guest fills in the form once → one card, with everyone they answered for inside.

- **For the whole reply:** when it was sent, coming / not coming (one answer for everyone),
  the message (empty = skipped), answers to questions asked once per reply.
- **`createdBy`** (guest / host) and **`editedAt`** (when the host last changed it, empty if
  never). No history of what changed. `createdBy` lets "new replies" count only guests'.
- **`people`** — each with:
  - a **permanent ID** that never changes (seating points to it)
  - name
  - age group and dietary needs when coming (missing when not coming)
  - answers to the host's per-person questions, by question ID
  - the pre-loaded name the host matched them to, if any
  - `differentPerson` when the host said a same-name reply isn't the same guest. The
    Duplicate tag is worked out live, but this answer is the host's, so it's saved.
- Answers stored once on the reply, never copied onto each person (the mock copies them).
- **Separate from group** moves a person to a new reply card of their own; they keep their
  ID, so their seat follows them.
- Answer rules from the project overview hold: missing = never asked, empty = asked and skipped.
- **Unknown and Duplicate tags are not stored.** They're worked out live.
- **`nameKeys`** (its people's names, normalized) and **`listNameIds`** (the list names the
  host matched them to): added on every write by `replyRef` (`src/db/writes/reply-ref.ts`), so
  a new reply can find the cards its names can change. Not part of the reply's schema: the
  pages never read them.

### Guest list card

One card per event (`guestList/names`) holding every pre-loaded name, in the host's order,
with one `version` for the whole list. Each name: a permanent ID, the name, and whether the
invitation was sent. Its ID lets it be seated before the guest replies; when a reply is
matched to it, the seat carries over to that person.

### User card

Firebase Auth keeps the login itself (email, scrambled password, sign-in method). The
`users` card only holds what Festio needs on top: name, the app language they last chose,
when they joined, and which Terms version they accepted and when (proof of the DPA; a new
version can be asked for again). No list of events: each event card names its host.

- **`lastVisit`** — when the host last looked at the latest replies. Missing = never. The
  "new since your last visit" badge counts guests' replies (`createdBy: guest`) sent after it.

**Sign-in:** email + password and "Continue with Google". No Apple (it needs a paid Apple
Developer membership, about $99 a year) and no Facebook. One account per email, so signing
in with Google and with a password on the same email reaches the same account.

### Slug card

The link name is the card's ID (`slugs/maria-wedding`) and it points to the event. Firestore
has no "unique" rule, so this is how two hosts are kept from the same link: the card is
claimed in a transaction, and a second claim fails.

When the event's data is deleted, the slug card stays for **one year**, marked blocked, so
old printed cards and forwarded links never open a stranger's invitation. After that the
link is free again.

### Seating chart

One card per event (`seating/chart`), saved all at once. A card holds up to 1 MB, far more
than a chart needs.

- **`tables`** — name and number of seats, in the host's order.
- **`seats`** — person ID → table ID, so one person can only be at one table. Each also keeps
  a **copy of the name** at save time, so a deleted person can still be named in a warning.
  The current name is shown while the person exists.
- **`print`** — settings for each seating printable: place cards, table cards, seating board.
  Exact options decided when the screens are built. All three always match the invitation's
  look, so no design choices are stored.
- **Anyone can be seated:** people from replies or pre-loaded names. Automatic seating gets a
  "only coming / everyone" toggle.
- **The chart only changes when the host saves it.** Nothing in the background ever moves or
  removes anyone. Automatic seating only suggests a plan; the host saves it.
- **Warnings are worked out live** each time the chart opens, never stored: seated but not
  coming, reply deleted, coming but not seated, table over its seats. The same warnings show
  before printing seating cards.
- **Notification:** a `seatingWarnings` count on the event card, updated when a reply comes
  in, is edited or deleted, and when the chart is saved. The dashboard's notifications rail
  reads it ("2 seated guests need a look"). In-app only, no email.
- **When the chart's save is built,** the counts-drift test
  (`tests/writes/counts-drift.test.ts`) saves its chart through it instead of writing the
  card straight to Firestore, so the test also checks that the save updates
  `seatingWarnings`.
- **Later, without breaking anything:** exact seats (an optional seat number per person) and a
  room plan (an optional position and shape per table).

### Payments

- A **Merchant of Record** sells the package: it handles tax worldwide, invoices, refunds and
  card details. Festio never sees card numbers.
- **Payment cards live outside the event folder** so they survive the 60-day deletion:
  host, event ID, what was bought, amount, currency, date, the provider's order number,
  status (paid / failed / refunded). No guest data.
- **Only the server changes an event's package**, after the provider confirms the payment.
- **Upgrades pay the difference.** In the provider's shop that's three products: Free →
  Standard, Free → Custom, Standard → Custom.
- **Regional pricing:** prices can differ by country, grouped into a few levels. Prices live
  in the provider's dashboard, not in our database; the pricing page asks the provider.

## Security rules

Rules are checked only when a **browser** talks to Firestore or Storage. Our server uses the
Admin SDK, which skips them, so the server does its own checks.

**The server does almost everything:**

- **Guests always go through the server:** opening the invitation, the password, replying.
  A reply needs the cap transaction, rate limiting and the closing date, and the password
  never reaches the browser. There is no duplicate check for guests: telling a guest a name
  already replied would leak who replied. The guest list shows it as Duplicate. A guest's browser never touches the
  database.
- **Every host save goes through the server** (Server Actions): event, invitation,
  replies, guest list, seating. One place for every check: the 24h lock, Required not
  turned on once answers exist, only the server changes the package.
- **Every server action starts with one shared check:** someone is logged in, and it's
  *their* event. Written once, so no action can forget it.

**Live updates for hosts:** the host's browser reads its own events straight from Firestore
(`onSnapshot`), so new replies appear without a refresh. Once they're in, the guest list's
saves can drop `refresh()` (`src/actions/guests.ts`): today it re-renders the whole
dashboard on the server after every tick, only so the nav counts update.

- **Dashboard:** listens only to the host's event cards; the counters there update for one
  read per change.
- **Guest list page:** listens to that event's replies while it's open.
- Cost: one read per card when the page opens, one per changed card after, nothing while
  idle. Cheaper than refreshing.

**Firestore rules:**

- Closed to everyone by default.
- A logged-in host can **read** their own events and everything inside them. Never write.
- `users`: a host can read only their own card.
- `payments` and `slugs`: no browser access at all.

**Storage rules:** the host uploads photos straight from the browser, so only the event's
host can upload into its folder, images only, at most 1 MB a file.

**Tested in CI** against the emulator on every push: a guest can't read replies, host A
can't read host B's event, nobody writes from the browser, uploads over the limit fail.

## Saving from two places

A host can have the same thing open on two devices. Without a check, whatever saves last
silently wipes the other's changes.

- Every card a host edits in a form (event, invitation, seating chart, guest list) has a
  **version number**.
- The editor remembers the version it started from. On save, the server checks in the same
  transaction that it's still that version, saves, and adds one.
- If someone saved in between, the save is refused: "This was changed on another device.
  Reload to see the latest version."
- Nice extra, not a must: with live updates the editor can show this before Save.

## Rate limiting

Done by our server, counting per visitor (IP address). Not in memory: App Hosting runs
several copies of the server and restarts them, so the count lives in Firestore.

| What             | Limit                                | Against                       |
| ---------------- | ------------------------------------ | ----------------------------- |
| Replies          | 5 per link per hour per visitor      | Spam replies                  |
| Wrong passwords  | 10 per link per hour per visitor     | Scripts guessing the password |

- **`rateLimits/`**: one tiny card per visitor + link + hour with the count. A Firestore TTL
  policy deletes them by itself after the hour.
- **GDPR:** only a scrambled (hashed) IP is stored, never the real one, and it's gone within
  the hour.
- **Which IP:** the last `x-forwarded-for` entry, the one Google's front end adds
  (`visitorKey`, `src/db/reads/visitor.ts`). Earlier entries are whatever the caller sent.
- **The hour is the clock's hour**, not the last 60 minutes, so someone can get about twice the
  tries across an hour boundary (10 at 10:59, 10 more at 11:00). Fine at these limits; if abuse
  shows up, also check the previous hour's card.
- **Decide later: a per-link cap on wrong passwords across all visitors** (e.g. 100 an hour).
  It stops a botnet of real IPs guessing a short password, but anyone could use it to lock
  real guests out for an hour. Not built; revisit if guessing shows up in the logs.
- Over the limit, the guest sees a friendly "too many tries, please try again in a few
  minutes".
- Some mobile networks put many phones behind one IP, so unrelated guests can rarely share a
  limit. Unlikely to matter at these numbers.
- **Page views: not limited at launch.** Counting every view would double its cost. Caching
  keeps repeated views cheap, and the budget alert tells us about abuse. If it happens, a
  page-view limit goes in front of the site (e.g. Cloudflare's free plan).

## Previews

**No preview pictures are saved.** The Events page and the printables section draw the real
invitation live, shrunk to the box (`ScaledStage`), with clicks turned off. Nothing to
upload, store or delete, always up to date, nothing that can fail on save.

- **Simple invitations:** the whole card, the same as the printable.
- **Modular invitations:** the top of the page (header, cover, names), cut off at the box.
- **Printables section:** simple ones show the card; modular ones their own printable
  layout, drawn live like the print page does (`PrintPreview`), once it's built.
- **Long lists** only draw the cards that scroll into view.
- **Host photos** load through `next/image`, at the small size the box needs.

## Link previews

What WhatsApp, Facebook and other chat apps show when a link is pasted (Open Graph tags).
`noindex` doesn't stop them; it's only for search engines.

- **The same for every invitation, Public or Protected:** the title "You're invited", in
  the invitation's language, and one Festio picture for all events (still to be designed): a
  plain image file in the app, not stored per event. Nothing personal, so a forwarded Protected link reveals nothing.
- **Protected invitations' browser tab** also says "You're invited" until the password is
  typed; the event title shows after.
- **Later, maybe:** a personal share picture made on request with `next/og` (names, date,
  the invitation's colours) for Public invitations only.

## Pictures (Storage)

One folder per event, so the 60-day cleanup deletes the event's card and its folder:

```
events/<event>/
    photos the host uploads for modular invitations (later)
```

**Photo rules**, so photos stay cheap:

1. **Shrink before upload.** The browser resizes each photo to the biggest size the
   invitation ever shows it (the cover up to 1440 px wide) and saves it as WebP. The phone's
   original is never stored. A cover is about 300–500 KB, a smaller photo 150–200 KB.
2. **Storage rules enforce it:** images only, with a maximum size per file (e.g. 1 MB).
3. **Replacing a photo deletes the old one,** so trying out covers leaves no forgotten files.
4. **Caching** keeps photos close to guests, so reloading a page on purpose mostly hits the
   cache; a page-view limit comes later if needed (see Rate limiting).
5. **A budget alert** of a few euros on each project.

What it costs, for a cover and two venue photos (about 1 MB per event): storing 10,000
events is about $0.20 a month. Downloads are the real cost: guests get photos sized for
their screen through `next/image` (about 400 KB a visit), so 200 guests visiting 3 times is
about $0.03 per event. Photos are modular only, so every such event is a paid Custom one.

## GDPR cleanup

A scheduled job (a Cloud Function on a timer) runs once a night and clears every event
whose date is more than `GUEST_DATA_RETENTION_DAYS` (`src/lib/config.ts`, 60 today) in the
past. No "delete on" date is stored: postponing moves the deletion with it, and changing
the setting applies everywhere.

- **Deleted:** the invitation card, replies, guest list, seating chart, counters and the
  event's Storage folder. Deleting a card doesn't delete its folders, so the job deletes
  everything under the event (Admin SDK `recursiveDelete`).
- **Kept:** the host's account, payment cards, and a **tiny leftover** of the event card so
  it still shows in the host's past events, marked as data deleted. Which fields it keeps
  is still to decide; no guest data and no images.
- **Never misses one:** it looks for everything past the cutoff, not just today's, so a
  failed night is caught up the next. The event card is stripped to its leftover **last**,
  so if the job stops halfway the next run finishes it. Several failed nights in a row send
  an alert.
- **Backups:** deleted data stays in prod's backups and recovery history until they expire
  (about 7 days). The privacy notice says so.
- **The link stays blocked for a year** after the deletion (see Slug card).

**Deleting an account** (the host asks, GDPR): the user card, the login, and every event of
theirs with everything inside it and its Storage folder. Payment cards stay, for the books.

## Links

Later, `maria-wedding.festio.eu` instead of `festio.eu/maria-wedding`. Its own spec:
`context/features/pending/subdomain-links.md`.

## Error alerts

- **Server errors** (a reply that fails to save, the deletion job crashing): Google's
  **Error Reporting**, from day one. Built in and free; it groups repeats and emails new
  errors.
- **Errors in guests' browsers:** **Sentry**'s free plan, added once real guests use it.

## Open

- The Merchant of Record: Paddle (safe, regional pricing built in), Creem (cheaper, younger,
  ask about regional pricing), Stripe Managed Payments (check it accepts sellers in your
  country). The price levels and currencies.
- Invoicing and your own books, to learn about with an accountant.
- The exact options of each seating printable.
- Which fields the deleted event's leftover keeps (no guest data, no images).

## Working together

Some steps need the owner's Google account, so they're done by you, guided by Claude. Claude
does the rest, stops at each handoff, and checks your part worked before going on.

**Only you:**

- Anything that needs your Google account: signing in, creating the Firebase projects,
  turning on Blaze billing, setting budget alerts.
- Picking the region in the console. It can never change, so Claude points at the exact
  option first.
- Turning on sign-in methods (email/password, Google) in the Auth console.
- Linking App Hosting to GitHub.
- Pasting secrets (payment and email keys) into Secret Manager.
- Interactive logins such as `firebase login`, typed as `! firebase login` in Claude Code so
  the output lands in the chat.

**Claude:**

- All the code: Zod schemas, seed data, swapping `src/mock/` for real reads, rules and rules
  tests.
- Config files: `firebase.json`, `.firebaserc`, `apphosting.yaml`, the emulator setup.
- CLI commands, once you're logged in.
- Checking that what you set up in the console works.

**Handoffs:** when it's your turn, Claude posts "Your turn:" with a short numbered list, one
small batch at a time, saying exactly what to click or type. You say when it's done, or paste
what you see; Claude checks it, then continues.

**Step 1 needs little from you:** the emulators run locally with a `demo-` project ID, no
real Firebase project. Only installing the Firebase CLI and Java (the Firestore emulator
needs it). The real back-and-forth starts at step 6.

## Order

The document shapes above are a starting point: change one when a feature needs it, and say so
before changing it. Start
at step 1. Each step is its own feature: spec it in `current-feature.md`, then build it.

Steps 1–5 run fully on your machine; the first big handoff is step 6.

1. **Emulators + schemas + seed data.** Firestore, Auth and Storage running
   locally with a `demo-` project ID, Zod schemas for the cards above, and the seed folder.
   No app changes yet. The Functions emulator joins with the first Cloud Function.
2. **Reads.** Done: every page reads the emulator through `src/db/reads/`. An event with no
   invitation card opens on its template's own start; the Overview draws the invitation
   live; the latest replies come from the reply cards.
   - **Fixed (`fc2f96f`):** the deletion date and the default reply close count calendar
     days (`addDays`), not 24-hour blocks, so a clock change no longer moves them an hour.
3. **Auth.** Sign in and sign up (email + password, Google), the `users` card, and the one
   shared check every server action starts with: logged in, and it's their event.
   - Replace `DEV_HOST_ID` (`src/db/reads/host.ts`, the seed's host) with the signed-in one.
   - `loadInvitation` and `guestListCount` take a bare event id; make them go through the
     shared check too, so no caller can skip it.
   - The shared check replaces `openEvent` (today in the dashboard's route folder, imported
     by the invitation and print pages too): put it next to the reads. On dashboard pages it
     can take the event from the host's events the layout already read, instead of reading
     the card a second time.
   - The landing page reads the whole dashboard (`loadDashboard`) for two badge counts. Give
     it a lighter read. Every dashboard page also runs one replies query and one template
     load per event; fine at a few events, worth a look as hosts get more.
   - Decided: the last visit lives on the `users` card (`lastVisit`). The badge is built
     with step 4, since setting it is a host save.
4. **Host saves.** Done: event settings, link claiming, both invitation editors, the guest
   list (names and the host's reply edits), cancel / reopen / delete now and print settings
   save through Server Actions (`src/actions/` → `src/db/writes/`), with version numbers.
   The counters have one function (`countsOf`, `src/db/writes/counts.ts`), shared with the
   seed. Drafts live on the device; the guest list edits a reply whole (one status).
5. **Guest replies.** Done: the guest reply saves in one transaction (`writeGuestReply`:
   link, template, visibility, Protected cookie, closing time, 5 an hour per visitor, the
   cap, then the reply and the counters), saved once however often it's resent (the form
   makes its ID). The guest page respects Hidden (not found), Protected (a password screen,
   10 wrong tries an hour, an `unlock-<slug>` cookie signed with `FESTIO_SECRET`) and
   cancelled (the host's message). Host actions share `hostSave`; ownership is `ownEvent`'s,
   inside each transaction. The guest list page recounts from the replies it loaded.
   - Decided: the guest list's saves keep comparing reply cards before and after
     (`guestChanges`). Switch to sending each action only if the comparing causes a real bug.
   - Who is waiting is worked out, not stored, so the dashboard reads the whole guest list
     of each active event whose form is closing. Fine at a few events; revisit only if it
     gets slow.
6. **`festio-dev`**, Firestore and Storage rules, and rules tests.
   - **Google on a password account:** the emulator can't produce
     `auth/account-exists-with-different-credential`. Check on the real project that it shows
     the "sign in with your password" message (`passwordAccount` in `AuthForm.tsx`).
   - **The login check's cost:** `loadHostId` (`src/db/reads/session.ts`) checks the cookie
     with Firebase on every host request (`verifySessionCookie(…, true)`, to catch revoked
     sessions). Measure it; if it's slow, check revocation less often.
   - **Rate limits' IP:** check which `x-forwarded-for` entry App Hosting adds. Send a fake
     header, log the raw value. `visitorKey` takes the last one; if that's a proxy's, every
     guest shares one limit.
   - **`FESTIO_SECRET`** into Secret Manager (dev has a dummy in `.env.development`), and the
     `rateLimits` TTL policy (`firestore.indexes.json`) deployed.
   - **Email verification** needs real email sending, so it can only be finished here:
     `context/fixes/pending/email-verification.md`. Until then, Google on an unverified
     password account drops the password.
   - **Firestore's europe-west4 prices:** `tests/cost/month.ts` uses the US list prices;
     put the real ones in from the console's pricing.
7. **CI:** lint, build and rules tests on every push; auto-deploy to dev. Every push also
   runs `npm run test:app` (page tests) and `npm run cost`; a cost rise fails until fixed
   or accepted with `COST_UPDATE=1 npm run cost`.
8. **GDPR cleanup.** The nightly deletion job and account deletion.
   - The job reuses `src/db/writes/`. Move the rules that live only in the actions today
     (past, cancelled: `eventForRules` in `src/actions/event.ts`, the last `hostEvent` reads
     in an action) into the writes, so the job gets them too, with one "past" on the
     event's clock (`todayIn`); the actions use the countdown worked out at read time.
   - The job picks events by calendar day, not `deletionDate` (a wall-clock value on the
     server's clock): `shiftDay(date, GUEST_DATA_RETENTION_DAYS) <= todayIn(timeZone, now)`.
   - Log out only deletes this browser's cookie; a copied cookie stays valid up to 14 days.
     Deleting an account must also end every session (`auth.revokeRefreshTokens(uid)`).
     Later, maybe: a "Log out of all devices" button in Settings, doing the same.
9. **Photos (Storage).** When modular host photos are built.
10. **Subdomain links** (`context/features/pending/subdomain-links.md`). The code part can be
    built and tried on `*.localhost` any time after step 2; the wildcard domain needs App
    Hosting.
11. **Payments**, once the Merchant of Record is chosen.
12. **`festio-prod`** with backups and the manual release button, close to launch.

## Do later

Work steps 1–5 left open, in the order to build them. Load one at a time
(`/feature load`), each on its own branch.

**When one is finished** (at `/feature complete`), mark it here: change its `To do` to
`Done (<commit message>)`, so this list never needs rechecking against the code.

1. **Done (`chore: guest list on one card`) — the guest list on one card** (`chore/`). Today each pre-loaded name is its own
   card (`guestList/<id>`), so a guest's reply, the guest list page and the dashboard read
   every name. Instead: one card (e.g. `guestList/names`) holding every name with its
   permanent ID, name and sent flag. About 120 bytes a name, so roughly 8,000 fit in a
   card's 1 MB. Seating and matching keep pointing at the IDs.
   - One `version` for the whole list: two devices editing different names at once now get
     "changed on another device" for the second save. Host-only, so rare.
   - Touches the guest list schema and path, `readGuests`, `guestListCount`, the names stage
     of `writeGuestChanges`, `readCountInputs`, the seed, and the guest list page's per-name
     versions (they become one). No real data yet: a new seed, no script.
   - Also here, since the names part changes shape: `GuestChanges` / `ReplyInput`
     (`src/types/guests.ts`) restate the save's Zod schema by hand. Move the schema to
     `src/db/schemas/` and derive the types from it.
2. **Done (`chore: count only what a reply changes`) — count only what a reply changes** (`chore/`, after item 1, so the list part is
   one read). A guest's reply recounts the whole event inside its transaction
   (`readCountInputs`: every reply, the list, the seating chart). Names only affect cards
   with the same name, so:
   - Each reply card stores its people's names normalized (`normalizeName`: case, accents,
     spaces) as `nameKeys`; each list name the same.
   - The reply's transaction reads only the replies whose `nameKeys` share one of the new
     reply's (`array-contains-any`, at most 10 names a reply, under Firestore's 30), the list
     names with those keys, any reply matched (`listNameId`) to those names, and the seating
     chart. Coming / not coming just go up by the reply's people.
   - It counts that small group with `countsOf` before and after the new reply and adds the
     difference to the event's `counts`. Same function, so the two ways can't count
     differently; the guest list page's recount (`repairCounts`) stays as the safety net.
   - A data-shape change: new fields on reply and list cards, the seed, a one-off script if
     real data exists by then.
   - Doesn't help guests replying at the same second: every reply writes the event card's
     counts, so they queue either way.
3. **Done (`chore: step-4 cleanup`) — step-4 cleanup** (`chore/`; found by the step-4 review; tidy-ups, not bugs):
   - The two invitation editors (`HostInvitationEditor`, `ModularEditor`) copy the same save
     flow (version, busy guard, save confirm, error toast): one shared hook.
   - "A request that failed becomes `failed` and an error toast" is written in 6–7 client
     places (editors, Danger zone, print, guest list): one shared helper.
   - The guest list's two delete confirms (`RowView`, `ReplyEditor`) share their markup: one
     small component.
   - The event form's link check (`checkLink` in `useEventForm.ts`) repeats the slug rules:
     one plain `isValidSlug` in `src/lib/slug.ts`, used by it and `slugSchema`.
   - "The card exists ? parse it : missing" is written in five places (`writes/event.ts`,
     `writes/invitation.ts`, `writes/guest-reply.ts`, `seatedIdsOf` and `guestListOf` in
     `writes/counts.ts`): one `parseSnap(schema, snapshot)` in `src/db/reads/parse.ts`.
4. **Done (`chore: dashboard-wide button and field styles`) — dashboard-wide button and field styles** (`chore/`; found by the step-4
   cleanup's simplify review). `event-editor/styles.ts` is in practice the dashboard's shared
   form styles: about 20 files outside `event-editor/` import its `BUTTON`, `BTN_*` and
   `INPUT` (guest list, modular, auth, print, invitation, `SaveConfirm`, `TodoBoard`), and
   `guest-list/styles.ts` builds on it. The styling rule says a bundle used outside its
   folder moves up to `src/components/dashboard/styles.ts`. Move the shared ones there and
   point every import at it; what only the event editor uses stays.
5. **Done (`feat: unknown and duplicate tags in the latest replies`) — Unknown and Duplicate tags in the latest replies** (after item 1, so each
   event's list is one read), worked out live. They need each event's guest list and all its
   replies, and the feed loads on every dashboard page, so: reuse `loadGuests` where it's
   already read, work the tags out only where the feed shows, and only for the events left
   in the feed.
6. **Done (`fix: reply closing on the event's own clock`) — every time rule on the event's own clock** (`fix/`, any time, or with step 8).
   Replies closing, the date lock and the deletion date (`replyClose`, `defaultReplyClose`,
   `dateLocked`, `deletionDate` in `src/lib/event.ts`) use the server's clock, not the
   event's `timeZone`. Today only the countdown's "today" and the save's date lock
   (`todayIn`) use it.
