# Repo Map

Where things live. Check here before searching the codebase.

## Routes — `src/app/`

Two independent route trees, each its own root layout (Next.js can't have two
differently-named dynamic segments as app-root siblings, so they can't share
one) — see the comments in `[locale]/layout.tsx` and `invite/[invite]/layout.tsx`.

**Host app**, locale-routed via `next-intl` (EN unprefixed, RO/HU under
`/ro`, `/hu`):

| Path | Purpose |
| ---- | ------- |
| `[locale]/layout.tsx` | Root layout for the host app — fonts, `NextIntlClientProvider`, global chrome |
| `[locale]/page.tsx` | Landing page |
| `globals.css` | **All** Tailwind v4 theme config lives here (`@theme`). No JS config file. |
| `[locale]/invitations/[id]/page.tsx` | Host-side invitation view/editor |
| `[locale]/prints/[id]/page.tsx` | Host-side printable invitation |
| `[locale]/templates/[id]/page.tsx` | Template preview |
| `[locale]/dashboard/page.tsx` | Dashboard home |
| `[locale]/dashboard/layout.tsx` | Dashboard shell wrapper |
| `[locale]/dashboard/events/page.tsx` | Events list |
| `[locale]/dashboard/events/[id]/page.tsx` | Event editor |
| `[locale]/dashboard/invitations/page.tsx` | Invitations grid |

**Guest invitation**, outside next-intl entirely, no language switch:

| Path | Purpose |
| ---- | ------- |
| `invite/[invite]/layout.tsx` | Its own root layout — same fonts/chrome; `lang` and the message catalog come from the invitation's own `language` |
| `invite/[invite]/page.tsx` | Public guest-facing invitation. URL is unprefixed (`/maria-birthday-1657`) — `next.config.ts` rewrites it here invisibly |

`fonts.ts` — the app-wide `next/font/google` declarations (Kantumruy Pro +
Libre Baskerville), shared by both root layouts.

## i18n — `src/i18n/` and `messages/`

- `src/i18n/routing.ts` — `next-intl`'s locale list/default/prefix strategy.
- `src/i18n/navigation.ts` — locale-aware `Link`/`useRouter`/`usePathname`; every host-app component under `[locale]` imports these instead of `next/link` / `next/navigation`.
- `src/i18n/request.ts` — per-request message loading, for the host app's own locale.
- `src/i18n/messages.ts` — `loadMessages(language)`, the only place the path to `messages/` is written. Guest pages call it directly: an invitation's language is its own, not the request's.
- `src/proxy.ts` — the locale-routing proxy (Next.js 16 renamed `middleware.ts`). Explicit route allowlist — must never match invite-link paths.
- `messages/{en,ro,hu}.json` — message catalogs. `Rsvp` and `Print` are guest-facing and follow the invitation's `language`; `Nav`, `TopBar`, `Footer`, `Dashboard`, `Stats` and `Rail` follow the host's locale. Nav, footer and stat wording lives here, not in `src/mock/dashboard.ts` — that file carries only the keys.

## Templates — `src/templates/`

One file per template, **auto-discovered — no registration step.**

- `index.ts` — `loadTemplate(id)`, a dynamic `import('./' + id)`. Adding a template never touches this file.
- `<id>/index.tsx` — the template itself (e.g. `wolf-dance/`). Holds identity, tier, palette, fonts, editable fields, sections, design. A field's `fallback` is `LocalizedText`: all three languages when it is a phrase, a plain string when it is sample content.
- `TemplateCard.tsx` — template picker card.

## Invitation — `src/components/invitation/`

- `Invitation.tsx` — owns both the card and the reply panel (one tree per panel).
- `HostInvitationEditor.tsx` — host editing wrapper; `EditPanel.tsx` — the edit surface.
- `RsvpPanel.tsx` / `RsvpForm.tsx` / `useRsvpForm.ts` — guest RSVP.
- `ScaledStage.tsx` — scales the invitation to its container.
- `styles.ts`, `icons.tsx` — local to invitations.

## Print — `src/components/print/`

- `PrintEditor.tsx` — the page shell: host action bar, panel, preview.
- `PrintPanel.tsx` — the print settings form; `PrintPreview.tsx` — the card, flipped or folded.

Geometry (`.sheet`, `.sheet-view`, `.leaf`, `.flip`, `.fold`, `.sheet-form`) lives in `globals.css`.

## Dashboard — `src/components/dashboard/`

Shell: `DashboardShell.tsx`, `SideNav.tsx`, `TopBar.tsx`, `SiteFooter.tsx`, `NavLink.tsx`, `LanguageSwitcher.tsx`.

Events: `EventCard.tsx`, `EventRow.tsx`, `EventList.tsx`, `EventGroups.tsx`, `EventTabs.tsx`, `EventMeta.tsx`.

Invitations: `InvitationCard.tsx`, `InvitationGroups.tsx`.

Widgets: `HostToday.tsx`, `StatStrip.tsx`, `RepliesMeter.tsx`, `DatesThatMatter.tsx`, `NotificationsRail.tsx`, `Toast.tsx`, `CopyButton.tsx`, `PasswordField.tsx`, `FocusView.tsx`, `CentreOnHash.tsx`.

`event-editor/` — the event edit form. `EventEditor.tsx` composes `*Section.tsx` parts; state in `useEventForm.ts`, shared classes in `styles.ts`.

## Lib — `src/lib/`

| File | Holds |
| ---- | ----- |
| `config.ts` | `GUEST_DATA_RETENTION_DAYS` — the single GDPR retention parameter. Never inline it. |
| `event.ts` | Slugs, `invitationLink`, `contentFreeze` (24h rule), `deletionDate`, date formatting |
| `invitation.ts` | Template vars, `findByInvite`, seed/fallback values, `DATE_FORMATS` |
| `fonts.ts` | Invitation fonts via `next/font/google` (per-template, not the app chrome — that's `src/app/fonts.ts`) |
| `history.ts` | Local visit tracking |
| `language.ts` | `LANGUAGES` (the one list, read by both `i18n/routing.ts` and an invitation's `language`), `invitationLanguage`, `LocalizedText`/`localized`, locale tags and names |

## Other

- `src/types/` — `invitation.ts` (incl. `TemplateModule`), `dashboard.ts`, `print.ts`
- `src/mock/dashboard.ts` — mock data; **no Firestore wiring yet**
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`

No `firestore.rules` / `firestore.indexes.json` in the repo yet.
