# Repo Map

Where things live. Check here before searching the codebase.

## Routes — `src/app/`

| Path | Purpose |
| ---- | ------- |
| `page.tsx` | Landing page |
| `layout.tsx` | Root layout — fonts, global chrome |
| `globals.css` | **All** Tailwind v4 theme config lives here (`@theme`). No JS config file. |
| `[invite]/page.tsx` | Public guest-facing invitation (`/maria-birthday-1657`) |
| `invitations/[id]/page.tsx` | Host-side invitation view/editor |
| `templates/[id]/page.tsx` | Template preview |
| `dashboard/page.tsx` | Dashboard home |
| `dashboard/layout.tsx` | Dashboard shell wrapper |
| `dashboard/events/page.tsx` | Events list |
| `dashboard/events/[id]/page.tsx` | Event editor |
| `dashboard/invitations/page.tsx` | Invitations grid |

## Templates — `src/templates/`

One file per template, **auto-discovered — no registration step.**

- `index.ts` — `loadTemplate(id)`, a dynamic `import('./' + id)`. Adding a template never touches this file.
- `<id>/index.tsx` — the template itself (e.g. `wolf-dance/`). Holds identity, tier, palette, fonts, editable fields, sections, design.
- `TemplateCard.tsx` — template picker card.

## Invitation — `src/components/invitation/`

- `Invitation.tsx` — owns both the card and the reply panel (one tree per panel).
- `HostInvitationEditor.tsx` — host editing wrapper; `EditPanel.tsx` — the edit surface.
- `RsvpPanel.tsx` / `RsvpForm.tsx` / `useRsvpForm.ts` — guest RSVP.
- `ScaledStage.tsx` — scales the invitation to its container.
- `styles.ts`, `icons.tsx` — local to invitations.

## Dashboard — `src/components/dashboard/`

Shell: `DashboardShell.tsx`, `SideNav.tsx`, `TopBar.tsx`, `SiteFooter.tsx`, `NavLink.tsx`.

Events: `EventCard.tsx`, `EventRow.tsx`, `EventList.tsx`, `EventGroups.tsx`, `EventTabs.tsx`, `EventMeta.tsx`.

Invitations: `InvitationCard.tsx`, `InvitationGroups.tsx`.

Widgets: `StatStrip.tsx`, `RepliesMeter.tsx`, `SafeguardBar.tsx`, `DatesThatMatter.tsx`, `NotificationsRail.tsx`, `Toast.tsx`, `CopyButton.tsx`, `PasswordField.tsx`, `FocusView.tsx`, `CentreOnHash.tsx`.

`event-editor/` — the event edit form. `EventEditor.tsx` composes `*Section.tsx` parts; state in `useEventForm.ts`, shared classes in `styles.ts`.

## Lib — `src/lib/`

| File | Holds |
| ---- | ----- |
| `config.ts` | `GUEST_DATA_RETENTION_DAYS` — the single GDPR retention parameter. Never inline it. |
| `event.ts` | Slugs, `invitationLink`, `contentFreeze` (24h rule), `deletionDate`, date formatting |
| `invitation.ts` | Template vars, `findByInvite`, seed/fallback values, `DATE_FORMATS` |
| `fonts.ts` | App fonts via `next/font/google` (Kantumruy Pro + Libre Baskerville) |
| `history.ts` | Local visit tracking |

## Other

- `src/types/` — `invitation.ts` (incl. `TemplateModule`), `dashboard.ts`
- `src/mock/dashboard.ts` — mock data; **no Firestore wiring yet**
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`

No `firestore.rules` / `firestore.indexes.json` in the repo yet.
