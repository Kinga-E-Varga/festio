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

| Path                                              | Purpose                                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `[locale]/layout.tsx`                             | Root layout for the host app — fonts, `NextIntlClientProvider`, global chrome            |
| `[locale]/page.tsx`                               | Landing page                                                                             |
| `globals.css`                                     | **All** Tailwind v4 theme config lives here (`@theme`). No JS config file.               |
| `[locale]/invitations/[id]/page.tsx`              | Host-side invitation view/editor                                                         |
| `[locale]/prints/[id]/page.tsx`                   | Host-side printable invitation                                                           |
| `[locale]/templates/[id]/page.tsx`                | Template preview                                                                         |
| `[locale]/dashboard/page.tsx`                     | Dashboard home                                                                           |
| `[locale]/dashboard/layout.tsx`                   | Dashboard shell wrapper                                                                  |
| `[locale]/dashboard/events/[id]/page.tsx`         | Event Overview — the event's own home (no events list: Home lists them all)              |
| `[locale]/dashboard/events/[id]/load-event.ts`    | `openEvent` (not found, or Home once archived) and `eventMetadata`, for every event page |
| `[locale]/dashboard/events/[id]/details/page.tsx` | Event editor (Event details)                                                             |
| `[locale]/dashboard/events/[id]/guests/page.tsx`  | Event guest list                                                                         |
| `[locale]/dashboard/events/[id]/report/page.tsx`  | Draft: report a flood of unexpected replies                                              |

**Guest invitation**, outside next-intl entirely, no language switch:

| Path                         | Purpose                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `invite/[invite]/layout.tsx` | Its own root layout — same fonts/chrome; `lang` and the message catalog come from the invitation's own `language`   |
| `invite/[invite]/page.tsx`   | Public guest-facing invitation. URL is unprefixed (`/maria-birthday`) — `next.config.ts` rewrites it here invisibly |

`fonts.ts` — the app-wide `next/font/google` declarations (Work Sans +
Libre Baskerville), shared by both root layouts.

`ReactGrab.tsx` — dev-only React Grab script, also in both root layouts.
Lives in `app/` because `beforeInteractive` scripts belong to a root layout.

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
- `ScaledStage.tsx` — scales the invitation to its container.
- `PanelTabs.tsx` — the Design / Content / Replies tabs (`TABS`, `useTabViews` for the strip), shared by both invitation editors.
- `PanelSwitch.tsx` — the side panel's on/off switch; `Switch`, the switch alone (`md`, or `sm` on Content's head bars).
- `styles.ts`, `icons.tsx` — local to invitations.

## Print — `src/components/print/`

- `PrintEditor.tsx` — the page shell: host action bar, panel, preview.
- `PrintPanel.tsx` — the print settings form; `PrintPreview.tsx` — the card, flipped or folded.

Geometry (`.sheet`, `.sheet-view`, `.leaf`, `.flip`, `.fold`, `.sheet-form`) lives in `globals.css`.

## Landing — `src/components/landing/`

- `LandingHeader.tsx` — the landing page's dark top bar (`TOP_BAR`), once a copy of the dashboard's phone top bar.
- `SiteFooter.tsx` — the site footer (links, search, language switcher); the landing page only, dashboards have none.

## Lib — `src/lib/`

| File               | Holds                                                                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts`        | `GUEST_DATA_RETENTION_DAYS` — the single GDPR retention parameter. Never inline it. Also the reply-cap margins, the replies-closing-soon window and `SLUG_BLOCK_DAYS`.                                                              |
| `event.ts`         | `eventPath` (an event's dashboard pages), `invitationLink`, `defaultReplyClose` (24h rule), `dateLocked` (from the event day), `deletionDate`, date formatting, expected-guests and reply-cap helpers, `replyClose` / `replyWindow` |
| `slug.ts`          | `RESERVED_SLUGS` (the one list), slug limits and `SLUG_PATTERN`, `normalizeSlug`, suggestions, the invite rewrite pattern. Relative imports only — `next.config.ts` reads it.                                                       |
| `invitation.ts`    | Template vars, `findByInvite`, seed/fallback values, `DATE_FORMATS`                                                                                                                                                                 |
| `fonts.ts`         | Invitation fonts via `next/font/google` (per-template, not the app chrome — that's `src/app/fonts.ts`). Also the font pairs' faces (Gelasio, Arimo, Fraunces, Space Grotesk).                                                       |
| `history.ts`       | Local visit tracking; `useLeaveFestio(fallback)` — the one BACK, with each page's own fallback when no Festio page is behind it                                                                                                     |
| `guests.ts`        | Guest rows from list + replies: matching, Unknown/Duplicate tags, grouping and splitting by category, counts, filters, repeat check. Type imports only.                                                                             |
| `leave-warning.ts` | `useLeaveWarning(active, message)` — while there are unsaved changes, asks before reload/close (the browser's prompt) and before in-app links or a `data-leaves` control (BACK)                                                     |
| `language.ts`      | `LANGUAGES` (the one list, read by both `i18n/routing.ts` and an invitation's `language`), `invitationLanguage`, `LocalizedText`/`localized`, locale tags and names, `plainText` (case- and accent-blind search)                    |
| `picked-event.ts`  | The event the nav is on: `PICKED_EVENT_COOKIE` (read in the dashboard layout), `toPickerEvent`, `resolvePicked`, `writePickedEvent` — the one place it is written                                                                   |
| `id.ts`            | `newId()` — a random UUID; falls back to `getRandomValues` where `crypto.randomUUID` is missing (pages not on HTTPS or localhost, e.g. a phone on the dev server)                                                                   |

## Database — `src/db/` and `seed/`

Nothing in the app reads it yet; pages still use `src/mock/`. Shapes: `context/features/pending/database.md`.

- `src/db/schemas/` — one Zod schema per Firestore card (`event`, `invitation`, `reply`, `guest-list`, `user`, `slug`, `seating`, `payment`, `rate-limit`) plus `common`. Plain Zod, no Firebase import, so browser and server share them. The value lists (visibility, packages, age groups, diets, …) live here; `src/types/` derives its unions and `PrintSettings` / `AnswerValue` from them.
- `src/db/limits.ts` — `EVENT_KINDS`, `TITLE_MIN`/`MAX`, `PASSWORD_PATTERN`, `CANCEL_MESSAGE_MAX`: no Zod, so client forms import them without shipping Zod.
- `src/db/paths.ts` — every collection and document path.
- `src/db/admin.ts` — the Admin SDK (`db`, `auth`). With `NEXT_PUBLIC_USE_EMULATORS=true` (`.env.development`) it talks to the local emulators, ports from `firebase.json`.
- `seed/` — the emulators' seed data and runner: `npm run emulators` starts Firestore, Auth and Storage and seeds them; `npm run seed` resets the data. Host login `maria@festio.test` / `festio-dev`.
- Root: `firebase.json` (emulator ports), `.firebaserc` (`demo-festio`), `firestore.rules` / `storage.rules` (closed until step 6), `firestore.indexes.json`.

## Other

- `src/types/` — `envelope.ts` (the envelope's colour roles), `invitation.ts` (incl. `TemplateModule`, a union of simple and modular), `modular.ts` (sections, palettes, pairs, modular templates), `dashboard.ts`, `print.ts`, `guests.ts` (mock-only)
- `src/mock/dashboard.ts` — mock data; **no Firestore wiring yet**
- `src/mock/guests.ts` — `findGuests(eventId)`, mock guest lists
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
