# Repo Map

Where things live. Check here before searching the codebase.

## Routes — `src/app/`

Two independent route trees, each its own root layout (Next.js can't have two
differently-named dynamic segments as app-root siblings, so they can't share
one) — see the comments in `[locale]/layout.tsx` and `invite/[invite]/layout.tsx`.

**Host app**, locale-routed via `next-intl` (EN unprefixed, RO/HU under
`/ro`, `/hu`):

| Path                                             | Purpose                                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `[locale]/layout.tsx`                            | Root layout for the host app — fonts, `NextIntlClientProvider`, global chrome |
| `[locale]/page.tsx`                              | Landing page                                                                  |
| `globals.css`                                    | **All** Tailwind v4 theme config lives here (`@theme`). No JS config file.    |
| `[locale]/invitations/[id]/page.tsx`             | Host-side invitation view/editor                                              |
| `[locale]/prints/[id]/page.tsx`                  | Host-side printable invitation                                                |
| `[locale]/templates/[id]/page.tsx`               | Template preview                                                              |
| `[locale]/dashboard/page.tsx`                    | Dashboard home                                                                |
| `[locale]/dashboard/layout.tsx`                  | Dashboard shell wrapper                                                       |
| `[locale]/dashboard/events/page.tsx`             | Events list                                                                   |
| `[locale]/dashboard/events/[id]/page.tsx`        | Event editor                                                                  |
| `[locale]/dashboard/events/[id]/guests/page.tsx` | Event guest list                                                              |
| `[locale]/dashboard/events/[id]/report/page.tsx` | Draft: report a flood of unexpected replies                                   |

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
- `messages/{en,ro,hu}.json` — message catalogs. `Rsvp`, `Print` and `Sections` are guest-facing and follow the invitation's `language`; `Nav`, `TopBar`, `Footer`, `Dashboard`, `Stats` and `Rail` follow the host's locale. Nav, footer and stat wording lives here, not in `src/mock/dashboard.ts` — that file carries only the keys.

## Templates — `src/templates/`

One file per template, **auto-discovered — no registration step.**

Two folders: `simple/` (basic invitations) and `modular/` (custom invitations). An id is unique across both.

- `index.ts` — `loadSimpleTemplate(id)` imports `./simple/<id>` only; it is what the guest, print and invitation pages use, so a modular template is not found there. `loadTemplate(id)` (the `/templates/<id>` page) tries `simple/`, then `modular/`. `modularTemplates()` lists every modular template (`import.meta.glob`). Adding a template never touches this file.
- `simple/<id>/index.tsx` — a simple template (e.g. `simple/wolf-dance/`). Holds identity, package, palette, fonts, editable fields, sections, design. A field's `fallback` is `LocalizedText`: all three languages when it is a phrase, a plain string when it is sample content.
- `modular/<id>/index.ts` — a modular template (e.g. `modular/olive-garden/`), a preset only: `kind: "modular"`, palette id, font-pair id, `{ section, variant }` list, and `values` — only the samples it changes from `DEFAULTS`.
- `TemplateCard.tsx` — a simple template's card, loaded in the browser from `simple/`.

## Modular library — `src/modular/`

Shared by every modular template, listed with Turbopack's `import.meta.glob` — nothing registers.

- `sections/<id>/index.ts` — the section: permanent id, name, required, `order`, optional menu label, its `variants` (numbered id and name; the first is the default; an id is never renamed or reused), its fields (no sample values — those are in `defaults.ts`). `sections/<id>/<variant id>.tsx` — one file per variant, named by its id (`1.tsx`, `2.tsx`), exporting `Variant`. Parts two variants share sit in their own named file beside them (`menu/Dishes.tsx`, `faq/FaqList.tsx`, `accommodation/StayList.tsx`, `rsvp/reply.tsx`); a variant never imports another variant. `header` is a section too (required, first), drawn apart from the others so it stays sticky; `footer` is required and last. A section may list `reads` — other sections whose values it shows (notes ← dress-code, gifts; footer ← header; countdown ← date-time).
- `palettes/<id>.ts` (15 named roles — `canvas`, `surface`(-alt), `ink`(-muted), `line`, `accent`(-ink, -soft), `secondary`(-ink, -soft), `tertiary`(-ink), `error` — and a `mood`: `subtle`, `balanced` or `vivid`; new ones via the `palette` skill in `.claude/skills/palette/`), `font-pairs/<id>.ts` (`primary` body, `secondary` headings), `patterns/<id>.ts` (the ground's pattern as Tailwind classes, e.g. `dots`). `corners.ts` — the four corner steps (`sharp`, `slight`, `soft`, `round`; ids permanent) as `--m-corner` (boxes, via `CORNER` in `styles.ts`) `--m-corner-pill` (buttons and small labels, via `PILL`) and `--m-corner-field` (form fields and their dropdown lists, via `FIELD_CORNER`: as the box, but `round` stays at `soft`); a template may set one, `sharp` otherwise.
- `index.ts` — `loadLibrary` (server): every palette, font pair, pattern, section and modular template. `variants.ts` — `loadVariant` (browser only; kept apart so variants never enter the server graph).
- `state.ts` — `ModularState` (ids, every section's on/off + variant, every section's values) and its helpers: `initialState`, `applyTemplate`, `setSectionOn`, `setVariant`, `setNoteSwitch` / `noteSwitchOn`, `resolveDesign`, `sameState`.
- `vars.ts` — the roles as `--m-<role>` (`paletteVars`; the pair's faces `fontVars`), the `shadow` (the ground darkened, one oklab `color-mix`), the `pattern` ink (the ground a little darkened) the `inverse`/`inverse-ink` pair, the bands' muted inks (`accent-ink-muted`, `tertiary-ink-muted`) and the `page-*` copies of ink, muted ink, secondary and accent that `GROUND` in `styles.ts` switches between (the accent band points those roles at its ink; a surface sets them back; `ON_ACCENT` alone for a variant's own accent fill), and the one mapping onto the shared `--c1`–`--c6`. `INVITE_COLUMN` — the column's widest (1440px), as `--invite-column` and in photos' `sizes`. `content.ts` — values (`text`, `list`, `groups`), basics, date and countdown helpers, `imageSrc`, `safeLink`, `mapsQuery`. `samples.ts` — editor-only, so `DEFAULTS` stays out of the guest bundle: `sectionValues` reads a template's samples over `DEFAULTS`, `customNoteSample`. `defaults.ts` — every modular sample in one file: `DEFAULT_BASICS` (the date) and `DEFAULTS` (every section's fields, by section id, then field id). `nav.ts` — `HEADER_ID`, `SECTIONS_TRIGGER_ID`. `countdown.ts` — `useTimeLeft` and `UNITS`, shared by the countdown's variants. `ground.ts` — `sectionGrounds` (each section's ground by its variant's rule or its own: surfaces taking turns, restarting after an `own` or `accent` section; `joined` ones match the section right before) and `otherGround` (a card's). `styles.ts` (the type scale and shared classes, incl. `groundClasses`), `labels.ts`, `MapsLink.tsx`.
- `icons.tsx` — the hand-drawn icon library (`ICONS`, one entry per icon a host can pick) and `Icon`. `heading.ts` + `SectionHeading.tsx` — every section heading's four optional fields and how they draw. `HeaderBar.tsx` — the header's bar, shared by its variants (they differ only in the mark, the links and the Reply button, in `LOOKS`). `TitleNames.tsx` — the title's names, shared by its variants (Diamonds and Plain differ only in the diamonds above and the eyebrow, in `LOOKS`). `CoverPhoto.tsx` — the cover's full photo, shared by its variants; each draws its own content over it. `WashedPhoto.tsx` — a mood photo with a ground washed over it (cover, location). `IconHeading.tsx` — a large icon disc over the section heading, eyebrow left out. `Mark.tsx` — a line written in three parts (first, middle, last; empty parts left out): the header's mark, drawn by the header and the footer, and the title's names. `clock.ts` (`useNow`), `notes.ts` (`noteItems`, `MAX_NOTES` (6), `NOTE_SWITCH` — Helpful notes' Dress code / Gifts / Custom toggles). `cards/` — `NoteCard` and the Dress code / Gifts cards, shared by those sections and Helpful notes.

## Modular page — `src/components/modular/`

- `ModularInvitation.tsx` — the guest page: the `header` section straight in the column, `SectionsDrawer`, the other sections via `SectionView` (loads a variant with `use`). `framed` for the editor.
- `ModularEditor.tsx` + `ModularEditPanel.tsx` — the `/templates/<id>` editor for modular templates: working and saved state, Save in memory, leave warning.
- `design/` — the Design tab: `DesignTab.tsx`, `TemplatePicker.tsx`, `LookPickers.tsx` (palette, pattern, font pair), `SectionsList.tsx` (section switches, styles, Helpful notes switches).

## Invitation — `src/components/invitation/`

- `Invitation.tsx` — owns both the card and the reply panel (one tree per panel).
- `HostInvitationEditor.tsx` — host editing wrapper; `EditPanel.tsx` — the edit surface.
- `EditorTopBar.tsx` — the editors' top bar (BACK, title and tags, save status, Edit / View, Save or Export) and `EditorFrame`, the page around it; shared by the simple and modular editors and the print page.
- `RsvpPanel.tsx` / `RsvpForm.tsx` / `useRsvpForm.ts` — guest RSVP.
- `ScaledStage.tsx` — scales the invitation to its container.
- `PanelTabs.tsx` — the Text / Replies / Design tabs, shared by both edit panels.
- `PanelSwitch.tsx` — the side panel's on/off switch.
- `styles.ts`, `icons.tsx` — local to invitations.

## Print — `src/components/print/`

- `PrintEditor.tsx` — the page shell: host action bar, panel, preview.
- `PrintPanel.tsx` — the print settings form; `PrintPreview.tsx` — the card, flipped or folded.

Geometry (`.sheet`, `.sheet-view`, `.leaf`, `.flip`, `.fold`, `.sheet-form`) lives in `globals.css`.

## Dashboard — `src/components/dashboard/`

Shell: `DashboardShell.tsx`, `SideNav.tsx`, `TopBar.tsx`, `SiteFooter.tsx`, `NavLink.tsx`, `LanguageSwitcher.tsx`.

Events: `EventCard.tsx`, `EventRow.tsx`, `EventList.tsx`, `EventGroups.tsx`, `EventTabs.tsx`, `EventMeta.tsx`, `EventWhen.tsx` (the day + how far off, shared by card, row and header), `ShareFields.tsx` (link, copy button and Protected password).

Widgets: `HostToday.tsx`, `StatStrip.tsx`, `RepliesMeter.tsx`, `DatesThatMatter.tsx`, `NotificationsRail.tsx`, `Toast.tsx`, `CopyButton.tsx`, `PasswordField.tsx`, `FocusView.tsx`, `CentreOnHash.tsx`.

Event pages: `EventHeader.tsx` (BACK + title + date), `BackButton.tsx`, `RepliesBanner.tsx` (from `warn` in the editor, `over` on the guest list).

`event-editor/` — the event edit form. `EventEditor.tsx` composes `*Section.tsx` parts; state in `useEventForm.ts`, shared classes in `styles.ts`.

`guest-list/` — the guest manager. `GuestManager.tsx` composes toolbar, add-names box, summary chips + `GuestSearch.tsx`, and table (`GuestTable.tsx` → categories → groups → `RowView.tsx` / an editor); state in `useGuestList.ts` / `useGuestActions.ts` / `useRowEditor.ts`. Editors: `ReplyEditor.tsx` (a reply's questions, or a new reply with several people) and `NameEditor.tsx` (a waiting name), both in the `RowEditor.tsx` frame; fields in `ReplyFields.tsx` (diet's tick dropdown in `MultiSelect.tsx`), reply ↔ form values in `replyValues.ts`; the status/age/diet message keys in `labels.ts`, shared by rows, editor and summary.

## Lib — `src/lib/`

| File               | Holds                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts`        | `GUEST_DATA_RETENTION_DAYS` — the single GDPR retention parameter. Never inline it. Also the reply-cap margins, the expected-guests warning percent and the replies-closing-soon window. |
| `event.ts`         | `invitationLink`, `contentFreeze` (24h rule), `deletionDate`, date formatting, expected-guests and reply-cap helpers, `replyClose` / `replyWindow`                                       |
| `slug.ts`          | `RESERVED_SLUGS` (the one list), slug limits, `normalizeSlug`, suggestions, the invite rewrite pattern. Relative imports only — `next.config.ts` reads it.                               |
| `invitation.ts`    | Template vars, `findByInvite`, seed/fallback values, `DATE_FORMATS`                                                                                                                      |
| `fonts.ts`         | Invitation fonts via `next/font/google` (per-template, not the app chrome — that's `src/app/fonts.ts`). Also the font pairs' faces (Gelasio, Arimo, Fraunces, Space Grotesk).            |
| `history.ts`       | Local visit tracking; `useLeaveFestio(fallback)` — the one BACK, with each page's own fallback when no Festio page is behind it                                                          |
| `guests.ts`        | Guest rows from list + replies: matching, Unknown/Duplicate tags, grouping and splitting by category, counts, filters, repeat check. Type imports only.                                  |
| `leave-warning.ts` | `useLeaveWarning(active, message)` — while there are unsaved changes, asks before reload/close (the browser's prompt) and before in-app links or a `data-leaves` control (BACK)          |
| `language.ts`      | `LANGUAGES` (the one list, read by both `i18n/routing.ts` and an invitation's `language`), `invitationLanguage`, `LocalizedText`/`localized`, locale tags and names                      |

## Other

- `src/types/` — `invitation.ts` (incl. `TemplateModule`, a union of simple and modular), `modular.ts` (sections, palettes, pairs, modular templates), `dashboard.ts`, `print.ts`, `guests.ts` (mock-only)
- `src/mock/dashboard.ts` — mock data; **no Firestore wiring yet**
- `src/mock/guests.ts` — `findGuests(eventId)`, mock guest lists
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`

No `firestore.rules` / `firestore.indexes.json` in the repo yet.

`archived/` — git-ignored, removed features kept for restoring. Don't read it unless asked.
