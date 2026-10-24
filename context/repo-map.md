# Repo Map

Where things live. Check here before searching the codebase.

## Detail maps — read before working there

- **Modular** — `src/modular/`, `src/components/modular/`, `src/components/envelope/`:
  read `context/map/modular.md`.
- **Dashboard** — `src/components/dashboard/`: read `context/map/dashboard.md`.

## Routes — `src/app/`

Two independent route trees, each its own root layout (Next.js can't have two
differently-named dynamic segments as app-root siblings, so they can't share
one) — see the comments in `[locale]/layout.tsx` and `invite/[invite]/layout.tsx`.

**Host app**, locale-routed via `next-intl` (EN unprefixed, RO/HU under
`/ro`, `/hu`):

| Path                                              | Purpose                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `[locale]/layout.tsx`                             | Root layout for the host app — fonts, `NextIntlClientProvider`, global chrome |
| `[locale]/page.tsx`                               | Landing page                                                                  |
| `globals.css`                                     | **All** Tailwind v4 theme config lives here (`@theme`). No JS config file.    |
| `[locale]/invitations/[id]/page.tsx`              | Host-side invitation view/editor                                              |
| `[locale]/prints/[id]/page.tsx`                   | Host-side printable invitation                                                |
| `[locale]/templates/[id]/page.tsx`                | Template preview                                                              |
| `[locale]/dashboard/page.tsx`                     | Dashboard home                                                                |
| `[locale]/dashboard/layout.tsx`                   | Dashboard shell wrapper                                                       |
| `[locale]/dashboard/events/[id]/page.tsx`         | Event Overview — the event's own home (no events list: Home lists them all)   |
| `[locale]/dashboard/events/[id]/details/page.tsx` | Event editor (Event details)                                                  |
| `[locale]/dashboard/events/[id]/guests/page.tsx`  | Event guest list                                                              |
| `[locale]/dashboard/events/[id]/report/page.tsx`  | Draft: report a flood of unexpected replies                                   |
| `[locale]/sign-in/page.tsx`, `sign-up/page.tsx`   | Sign in / sign up (`AuthPage`); signed in, they go to the dashboard           |

**Guest invitation**, outside next-intl entirely, no language switch:

| Path                         | Purpose                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `invite/[invite]/layout.tsx` | Its own root layout — same fonts/chrome; `lang` and the message catalog come from the invitation's own `language`   |
| `invite/[invite]/page.tsx`   | Public guest-facing invitation. URL is unprefixed (`/maria-birthday`) — `next.config.ts` rewrites it here invisibly |

**Dev only:** `api/dev/db-count/route.ts` — the read and write counts `npm run cost` takes after each page (`src/db/count.ts`); 404 unless counting is on, which needs the emulators.

`fonts.ts` — the app-wide `next/font/google` declarations (Work Sans +
Libre Baskerville), shared by both root layouts.

`ReactGrab.tsx` — dev-only React Grab script, also in both root layouts.
Lives in `app/` because `beforeInteractive` scripts belong to a root layout.

`PaletteSwitcher.tsx` / `PalettePicker.tsx` — dev-only palette switcher, host
layout only, off until `?palette=on` (`context/dev-tools/palette-switcher.md`).

## i18n — `src/i18n/` and `messages/`

- `src/i18n/routing.ts` — `next-intl`'s locale list/default/prefix strategy.
- `src/i18n/navigation.ts` — locale-aware `Link`/`useRouter`/`usePathname`; every host-app component under `[locale]` imports these instead of `next/link` / `next/navigation`.
- `src/i18n/request.ts` — per-request message loading, for the host app's own locale.
- `src/i18n/messages.ts` — `loadMessages(language)`, the only place the path to `messages/` is written. Guest pages call it directly: an invitation's language is its own, not the request's.
- `src/proxy.ts` — the locale-routing proxy (Next.js 16 renamed `middleware.ts`). Explicit route allowlist — must never match invite-link paths.
- `messages/{en,ro,hu}.json` — message catalogs. `Rsvp`, `Print`, `Sections` and `Envelope` are guest-facing and follow the invitation's `language`; `Nav`, `TopBar`, `Footer`, `Dashboard` and `Rail` follow the host's locale. Nav and footer wording lives here, not in `src/mock/dashboard.ts` — that file carries only the keys.

## Templates — `src/templates/`

One file per template, **auto-discovered — no registration step.**

Two folders: `simple/` (basic invitations) and `modular/` (custom invitations). An id is unique across both.

- `index.ts` — `loadSimpleTemplate(id)` imports `./simple/<id>` only; it is what the guest, print and invitation pages use, so a modular template is not found there. `loadTemplate(id)` (the `/templates/<id>` page) tries `simple/`, then `modular/`. `modularTemplates()` lists every modular template (`import.meta.glob`). Adding a template never touches this file.
- `simple/<id>/index.tsx` — a simple template (e.g. `simple/wolf-dance/`). Holds identity, package, palette, fonts, editable fields, sections, design. A field's `fallback` is `LocalizedText`: all three languages when it is a phrase, a plain string when it is sample content.
- `modular/<id>/index.ts` — a modular template (e.g. `modular/olive-garden/`), a preset only: `kind: "modular"`, palette id, font-pair id, `{ section, variant }` list, and `values` — only the samples it changes from `DEFAULTS`.
- `TemplateCard.tsx` — a simple template's card, loaded in the browser from `simple/`.

## Invitation — `src/components/invitation/`

- `Invitation.tsx` — owns both the card and the reply panel (one tree per panel).
- `HostInvitationEditor.tsx` — host editing wrapper; `EditPanel.tsx` — the edit surface.
- `EditorFrame.tsx` — the editors' page: the invitation or sheet, and the labelled strip at its right edge (the panel's views, Save or Export, Quit editor); the side panel opens beside it. Shared by the simple and modular editors and the print page. `SidePanel.tsx` — the panel itself: the open view's title and an X, then the caller's fields.
- `RsvpPanel.tsx` / `RsvpForm.tsx` / `useRsvpForm.ts` — guest RSVP.
- `InviteNotice.tsx` — a guest page in the invitation's look standing in for it: `PasswordGate.tsx` (Protected), `CancelledNotice.tsx` (cancelled).
- `ScaledStage.tsx` — scales the invitation to its container.
- `useInvitationSave.ts` — Save for both invitation editors: the confirm, one save at a time, the version, the toast.
- `PanelTabs.tsx` — the Design / Content / Replies tabs (`TABS`, `useTabViews` for the strip), shared by both invitation editors.
- `PanelSwitch.tsx` — the side panel's on/off switch; `Switch`, the switch alone (`md`, or `sm` on Content's head bars).
- `styles.ts`, `icons.tsx` — local to invitations.

## Print — `src/components/print/`

- `PrintEditor.tsx` — the page shell: host action bar, panel, preview.
- `PrintPanel.tsx` — the print settings form; `PrintPreview.tsx` — the card, flipped or folded.

Geometry (`.sheet`, `.sheet-view`, `.leaf`, `.flip`, `.fold`, `.sheet-form`) lives in `globals.css`.

## Auth — `src/components/auth/`, `src/actions/auth.ts`, `src/lib/reauth.ts`

- `AuthPage.tsx` — the sign-in and sign-up pages' card. `AuthForm.tsx` — email + password and Google, the Terms step for a new Google account.
- `src/actions/auth.ts` — `startSession` (ID token → `users` card if new → `__session` cookie), `signOut`.
- The browser signs in through `src/lib/firebase-client.ts`, in memory only; the cookie keeps the host signed in.
- `src/lib/reauth.ts` — `confirmIdentity(login)`: asks for the password (or Google's popup) before a step that can't be undone, returns a fresh ID token. The server checks it with `freshSignIn`.

## Server Actions — `src/actions/`

Host actions go through `host-save.ts` (`hostSave`: signed in, the card's schema, the save, refusal, refresh) and return `ActionResult`; ownership is checked by `ownEvent` inside the write's transaction. The saves themselves are in `src/db/writes/`.

- `event.ts` — `saveEventSettings`, `savePrintSettings`, `cancelEvent`, `reopenEvent`, `deleteEventNow`.
- `slug.ts` — `checkSlug` (is the link free).
- `invitation.ts` — `saveInvitation` (simple and modular).
- `guests.ts` — `saveGuestChanges` (the replies), `saveGuestListOn` (the pre-loaded names).
- `host.ts` — `markRepliesSeen` (sets `lastVisit`).
- `auth.ts` — see Auth.
- `guest.ts` — the guest's own, no sign-in: `unlockInvitation` (a Protected password → the `unlock-<slug>` cookie), `sendReply` (the reply, checked in `writeGuestReply`).

## Landing — `src/components/landing/`

- `LandingHeader.tsx` — the landing page's dark top bar (`TOP_BAR`), once a copy of the dashboard's phone top bar. Signed out, a Sign in link instead of the counts.
- `SiteFooter.tsx` — the site footer (links, search, language switcher); the landing page only, dashboards have none.

## Lib — `src/lib/`

| File                 | Holds                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts`          | `GUEST_DATA_RETENTION_DAYS` — the single GDPR retention parameter. Never inline it. Also the reply-cap margins, the replies-closing-soon window, the rate limits (`REPLY_LIMIT_PER_HOUR`, `PASSWORD_LIMIT_PER_HOUR`), `UNLOCK_DAYS`, `SLUG_BLOCK_DAYS`, `TERMS_VERSION` and `SESSION_DAYS`.                                                                         |
| `event.ts`           | `eventPath` (an event's dashboard pages), `invitationLink`, `defaultReplyClose` (24h rule), `dateLocked` (from the event day), `deletionDate`, date formatting, expected-guests and reply-cap helpers, `replyClose` / `replyWindow`, `todayIn` / `spanFrom`, `shortTitle`, `isArchived` (its data is deleted)                                                       |
| `slug.ts`            | `RESERVED_SLUGS` (the one list), slug limits and `SLUG_PATTERN`, `normalizeSlug`, suggestions, the invite rewrite pattern. Relative imports only — `next.config.ts` reads it.                                                                                                                                                                                       |
| `invitation.ts`      | Template vars, `inviteTheme` (an invitation root's palette, fonts and ground), `invitationValues` (saved text over the template's fallbacks, the event's date), fallback values, `DATE_FORMATS`                                                                                                                                                                     |
| `fonts.ts`           | Invitation fonts via `next/font/google` (per-template, not the app chrome — that's `src/app/fonts.ts`). Also the font pairs' faces (Gelasio, Arimo, Fraunces, Space Grotesk).                                                                                                                                                                                       |
| `history.ts`         | Local visit tracking; `useLeaveFestio(fallback)` — the one BACK, with each page's own fallback when no Festio page is behind it                                                                                                                                                                                                                                     |
| `guests.ts`          | Guest rows from list + replies: `toGuestReplies` (reply cards → rows, shared with the seed), matching, Unknown/Duplicate tags, grouping and splitting by category, counts, filters, repeat check; `eventCounts` (the event's `counts` from its replies), `fromGuestReplies` and `guestChanges` (the editors' changes as the save sends them). No React or Firebase. |
| `leave-warning.ts`   | `useLeaveWarning(active, message)` — while there are unsaved changes, asks before reload/close (the browser's prompt) and before in-app links or a `data-leaves` control (BACK)                                                                                                                                                                                     |
| `language.ts`        | `LANGUAGES` (the one list, read by both `i18n/routing.ts` and an invitation's `language`), `LocalizedText`/`localized`, locale tags and names, `plainText` (case- and accent-blind search)                                                                                                                                                                          |
| `picked-event.ts`    | The event the nav is on: `PICKED_EVENT_COOKIE` (read in the dashboard layout), `toPickerEvent`, `resolvePicked`, `writePickedEvent` — the one place it is written                                                                                                                                                                                                   |
| `packages.ts`        | `PACKAGES` (prices, what each unlocks), `nextPackage`. A saved event is always paid for: no unpaid or draft state (drafts live on the device)                                                                                                                                                                                                                       |
| `firebase-client.ts` | `clientAuth()` — the browser's Firebase Auth, in memory, on the emulator in dev. Sign-in only; never import `@/db/admin` in the browser                                                                                                                                                                                                                             |
| `action.ts`          | `orFailed(request)` — a Server Action's result, or `failed` when the request itself got no answer (offline)                                                                                                                                                                                                                                                         |
| `id.ts`              | `newId()` — a random UUID; falls back to `getRandomValues` where `crypto.randomUUID` is missing (pages not on HTTPS or localhost, e.g. a phone on the dev server)                                                                                                                                                                                                   |

## Database — `src/db/` and `seed/`

Every page reads it (server only). The host's saves write it through `src/db/writes/`. Shapes: `context/features/pending/database.md`.

- `src/db/reads/` — the pages' reads, Admin SDK, each card checked by its schema, each loader in React `cache()` and behind `connection()` (nothing read at build). `session.ts` (`SESSION_COOKIE`, `loadHostId` — the signed-in uid or null, `requireHostId` — else to sign-in, `freshSignIn` — the token signed in within `FRESH_SIGN_IN_SECONDS`), `access.ts` (**the shared check**: `hostEvent` — one of the signed-in host's events or null, `openEvent` — not found, or Home once archived; `eventMetadata` — a host page's tab title; every host page and Server Action starts here), `host.ts` (`loadHost`, `loadHostLogin` — how they sign in, for the re-enter step), `events.ts` (`toDashboardEvent` — countdown and closes in worked out; `loadHostEvents`, `eventIdBySlug` (the slug card alone), `loadEventBySlug` through it, `guestListCount`), `guests.ts` (`loadGuests`, once per event per request), `invitation.ts` (`loadInvitation`, `modularStart`), `activity.ts` (latest replies, `newReplyCount` — guests' replies since `lastVisit`), `parse.ts` (`parseCard` / `parseCards`: a card failing its schema is logged and read as missing), `visitor.ts` (`visitorKey` — the visitor's IP, hashed), `unlock.ts` (`unlockCookie`, `isUnlocked` — this browser typed the current password), `dashboard.ts` (`loadHostSummary`: host, events, alerts — the landing bar's; `loadDashboard`: that plus the latest replies). Reads that take a `DashboardEvent` (`loadGuests`, `loadInvitation`, `guestListCount`) only get one a check returned.

- `src/db/writes/` — the saves, Admin SDK. They run without Next or React, so a script (step 8's nightly job) can call them. `save.ts` (`SaveError`, `SaveRefused`, `expectVersion` — the `version` check, `refusal` — a refused save as an `ActionResult`), `event.ts` (`ownEvent`, `readOwnEvent` — the same check outside a transaction, for an action that needs a field first, `writeEventSettings`, `writeCancel`, `writeReopen`, `writePrintSettings`), `slugs.ts` (claiming a link in a transaction, blocking the old one), `counts.ts` (**the one counter function**: `readCountInputs`, `countsOf`, `countsAfter` — after a save's change, `readReplyGroup` / `countsWithReply` — a guest's reply counts only the cards its names can change, `repairCounts` — from the replies the guest list page loaded; the seed uses it too), `reply-ref.ts` (`replyRef` — every reply write goes through it, adding `nameKeys` / `listNameIds`), `invitation.ts` (`writeInvitation`), `guests.ts` (`writeGuestChanges`, `setGuestListOn`), `guest-reply.ts` (`writeGuestReply` — visibility, password, closing time, rate limit, cap, then the reply and counters in one transaction), `rate-limit.ts` (`rateLimits/` cards: `limitFor`, `readAttempts`, `countAttempt`, `unlockAttempt`), `delete-event.ts` (`deleteEventData` — a past or cancelled event's data, `leftoverEvent` — what the event card keeps).
- `src/db/schemas/` — one Zod schema per Firestore card (`event`, `invitation`, `reply`, `guest-list`, `user`, `slug`, `seating`, `payment`, `rate-limit`) plus `common`, and `guest-changes` (the guest list page's save, with its `GuestChanges` / `ReplyInput` types). Plain Zod, no Firebase import, so browser and server share them. The value lists (visibility, packages, age groups, diets, …) live here; `src/types/` derives its unions and `PrintSettings` / `AnswerValue` from them.
- `src/db/limits.ts` — `EVENT_KINDS`, `TITLE_MIN`/`MAX`, `PASSWORD_PATTERN`, `HOST_NAME_MAX`, `ACCOUNT_PASSWORD_MIN`, `CANCEL_MESSAGE_MAX`, the reply's `RSVP_NAME_MAX` / `RSVP_NOTE_MAX` / `RSVP_ANSWER_MAX` / `RSVP_PEOPLE_MAX`: no Zod, so client forms import them without shipping Zod.
- `src/db/paths.ts` — every collection and document path.
- `src/db/secret.ts` — `sign` (HMAC with `FESTIO_SECRET`), `unlockToken`, `unlockMatches`. Dev's secret is a dummy in `.env.development`.
- `src/db/count.ts` — dev only: `countDbUse` counts every Firestore read and write the way Firestore bills them, and session checks; `takeDbCount`. On only with `FESTIO_COUNT_DB=true` on the emulators (the test app copy).
- `src/db/admin.ts` — the Admin SDK (`db`, `auth`). With `NEXT_PUBLIC_USE_EMULATORS=true` (`.env.development`) it talks to the local emulators, ports from `firebase.json`.
- `seed/` — the emulators' seed data and runner: `npm run emulators` starts Firestore, Auth and Storage and seeds them; `npm run seed` resets the data. Host login `maria@festio.test` / `festio-dev`.
- Root: `firebase.json` (emulator ports), `.firebaserc` (`demo-festio`), `firestore.rules` / `storage.rules` (closed until step 6), `firestore.indexes.json`.

## Tests — `tests/`

Vitest, run with `npm test`. It starts its own Firestore emulator (`firebase.test.json`, its own port and `demo-…-test` project), so it never touches the dev emulators or their seed; Auth and Storage point where nothing listens. `vitest.config.mts` sets the test env, including the server's clock (`TZ`, New York, never an event's zone). Vitest 4, not 5: 5 needs `@types/node` 22 or later, the project is on 20.

- `setup/global.ts` — refuses anything but the test emulator, then empties it once.
- `helpers/events.ts` — `createEvent` (each test makes its own event with fresh IDs; tests don't use the dev seed), `guestInput`, `newVisitor`, `storedCounts`, `recount`, `refusedWith`.
- `lib/` — plain functions, no emulator. `writes/` — the saves in `src/db/writes/`, called directly.
- `setup/config.ts` — the env both Vitest configs share.
- `app/` — `npm run test:app` (`vitest.app.config.mts`): `global.ts` seeds the test emulator with the dev seed, builds a second copy of the app into `.next-test` and starts it on port 3100, counting reads; `session.ts` (`hostCookie` — a real session from the test Auth emulator, `SEED_HOST`, `OTHER_HOST`), `fetch.ts` (`page`, `appDbCount`, `mentions` — text in a page in any of its written forms), `access.test.ts` (who sees what).
- `cost/` — `npm run cost`: `measure.test.ts` (every page and save against `baseline.json`; the table in `last-run.md`, git-ignored), `report.ts` (`compare`, `table`), `month.ts` (`USE` — a month's habits, `PRICES`, `month`). `report` and `month` have plain tests in `npm test`.

## Other

- `src/types/` — `actions.ts` (`ActionResult`, every Server Action's return), `envelope.ts` (the envelope's colour roles), `invitation.ts` (incl. `TemplateModule`, a union of simple and modular), `modular.ts` (sections, palettes, pairs, modular templates), `dashboard.ts`, `print.ts`, `guests.ts` (the guest list's view shapes)
- `src/mock/dashboard.ts` — the nav, account and footer keys only; `src/mock/inv-img/` — the print preview's placeholder front
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
