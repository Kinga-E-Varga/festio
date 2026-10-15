# Database, hosting and environments

The plan agreed in chat before connecting anything. Nothing here is built yet; the app
still runs on mock data. Fields and names are a sketch to build from, not a final
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

- **App Hosting is linked to GitHub.** The dev backend follows `main` and deploys every merge.
  The prod backend has automatic deploys off; a "Deploy to production" button in GitHub
  Actions starts a release, ideally with an approval step.
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
      guestList/  one card per name the host pre-loads
      seating/
        └ chart   the whole seating chart
slugs/            one card per link name, pointing to its event
payments/         one card per payment
rateLimits/       short-lived counts per visitor (see Rate limiting)
```

### Event card

Only what the event form asks: title, event type, language, date, reply closing time,
link name, visibility, password, expected guests, whether a guest list is pre-loaded. Plus
package and template. No time, venue or address: the form doesn't ask for them (the mock
still has them, and `seedValues` copies them into simple invitations; both go).

**Time zone** (e.g. `Europe/Bucharest`): taken from the host's browser when the event is
created; not shown or changeable in the event form for now. Every time rule uses that
place's clock: replies closing (00:00 the day before, or the host's own time), the 24h
lock, the deletion date. Otherwise they'd follow the server's clock in the Netherlands.

Worked out each time, never saved: countdown, locked / locks in, Active / Draft / Past,
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

**Counters** (`counts`), so the dashboard never reads every reply of every event: people coming, people not coming, names needing attention,
`seatingWarnings`. Replied = coming + not coming; invited and waiting come from the guest
list and are worked out.

- **Every change is a transaction:** check the count, save the reply, update the count, as
  one step. Two guests sending at the same second are handled one after the other, so the
  second is checked against the new number and can be told the form is paused.
- The same for the host adding, editing, deleting or separating a reply.
- **The cap is for safety only.** It pauses the guest form; the host can always add replies,
  paused or not, and the counts keep going up.
- **Safety net:** the guest list page loads every reply anyway, so it recounts and quietly
  fixes the counters if they've drifted.

**Protected password:** stored as it is (not hashed), because the host sees it in the share
fields and it's printed on the card. It guards a page, not an account. Only the server ever
reads it; it's never sent to the guest's browser. The guest types it and the server checks
it, with wrong guesses rate-limited per visitor (e.g. 10 per hour), like replies.

### Invitation card

The invitation's look and text, on its own card inside the event (`invitation/content`), so
the dashboard never loads every invitation and the event and invitation editors each save
their own card.

- **Simple:** the field values (field ID → text).
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
- Answers stored once on the reply, never copied onto each person (the mock copies them).
- **Separate from group** moves a person to a new reply card of their own; they keep their
  ID, so their seat follows them.
- Answer rules from the project overview hold: missing = never asked, empty = asked and skipped.
- **Unknown and Duplicate tags are not stored.** They're worked out live.

### Guest list card

One pre-loaded name: a permanent ID, the name, and whether the invitation was sent. Its ID
lets it be seated before the guest replies; when a reply is matched to it, the seat carries
over to that person.

### User card

Firebase Auth keeps the login itself (email, scrambled password, sign-in method). The
`users` card only holds what Festio needs on top: name, the app language they last chose,
when they joined, and which Terms version they accepted and when (proof of the DPA; a new
version can be asked for again). No list of events: each event card names its host.

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
  A reply needs the cap transaction, the duplicate check, rate limiting and the closing
  date, and the password never reaches the browser. A guest's browser never touches the
  database.
- **Every host save goes through the server** (Server Actions): event, invitation,
  replies, guest list, seating. One place for every check: the 24h lock, Required not
  turned on once answers exist, only the server changes the package.
- **Every server action starts with one shared check:** someone is logged in, and it's
  *their* event. Written once, so no action can forget it.

**Live updates for hosts:** the host's browser reads its own events straight from Firestore
(`onSnapshot`), so new replies appear without a refresh.

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
`context/features/subdomain-links.md`.

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

## Order

The document shapes above are settled, apart from the Open list; don't re-open them. Start
at step 1. Each step is its own feature: spec it in `current-feature.md`, then build it.

1. **Emulators + seed data.** Firestore, Auth, Storage and Functions running locally, the
   seed folder, Zod schemas for the cards above, and the app reading from the emulator in
   place of `src/mock/`.
2. **`festio-dev`**, Firestore and Storage rules, and rules tests.
3. **CI:** lint, build and rules tests on every push; auto-deploy to dev.
4. **Subdomain links** (`context/features/subdomain-links.md`). The code part can be built
   and tried on `*.localhost` any time after step 1; the wildcard domain needs App Hosting.
5. **`festio-prod`** with backups and the manual release button, close to launch.
