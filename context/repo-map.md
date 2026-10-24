# Repo Map

Where things live. Check here before searching the codebase.

## Detail maps — read before working there

- **Modular** — `src/modular/`, `src/components/modular/`, `src/components/envelope/`:
  read `context/map/modular.md`.
- **Dashboard** — `src/components/dashboard/`: read `context/map/dashboard.md`.
- **Lib** — `src/lib/`: read `context/map/lib.md`.
- **Database** — `src/db/`, `seed/`, the Firebase config: read `context/map/db.md`.
- **Tests** — `tests/`: read `context/map/tests.md`.

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
- `host.ts` — `markRepliesSeen` (sets `lastVisit`), `loadLatestReplies` (the side panel's latest replies, when it opens).
- `auth.ts` — see Auth.
- `guest.ts` — the guest's own, no sign-in: `unlockInvitation` (a Protected password → the `unlock-<slug>` cookie), `sendReply` (the reply, checked in `writeGuestReply`).

## Landing — `src/components/landing/`

- `LandingHeader.tsx` — the landing page's dark top bar (`TOP_BAR`), once a copy of the dashboard's phone top bar. Signed out, a Sign in link instead of the counts.
- `SiteFooter.tsx` — the site footer (links, search, language switcher); the landing page only, dashboards have none.

## Lib — `src/lib/`

One file per concern, plain functions, no React unless named `use…`. **`config.ts` holds every tunable number** (GDPR retention, reply cap, rate limits, …) — never inline them. File by file: `context/map/lib.md`.

## Database — `src/db/` and `seed/`

Server only, Admin SDK. `reads/` (the pages' reads; `access.ts` is the shared check every host page and action starts with), `writes/` (the saves, no Next or React), `schemas/` (one Zod schema per card), `paths.ts`, `limits.ts`. `seed/` and `npm run emulators` for dev data. File by file: `context/map/db.md`.

## Tests — `tests/`

Vitest on its own emulator: `lib/` (plain functions), `writes/` (the saves), `app/` (`npm run test:app`), `cost/` (`npm run cost`), `helpers/`. Details: `context/map/tests.md`.

## Other

- `src/types/` — `actions.ts` (`ActionResult`, every Server Action's return), `envelope.ts` (the envelope's colour roles), `invitation.ts` (incl. `TemplateModule`, a union of simple and modular), `modular.ts` (sections, palettes, pairs, modular templates), `dashboard.ts`, `print.ts`, `guests.ts` (the guest list's view shapes)
- `src/mock/dashboard.ts` — the nav, account and footer keys only; `src/mock/inv-img/` — the print preview's placeholder front
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
