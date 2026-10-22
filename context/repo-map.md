# Repo Map

Where things live. Check here before searching the codebase.

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

## Modular library — `src/modular/`

Shared by every modular template, listed with Turbopack's `import.meta.glob` — nothing registers.

- `sections/<id>/index.ts` — the section: permanent id, name, required, `order`, optional menu label, its `variants` (numbered id and name; the first is the default; an id is never renamed or reused; `shows` — the fields the variant draws, as paths like `venues.label`; an `own` variant's `band` — the colour the page paints across the whole width behind it), its fields (a field may be `required`; a list may set `minItems`) (no sample values — those are in `defaults.ts`). `sections/<id>/<variant id>.tsx` — one file per variant, named by its id (`1.tsx`, `2.tsx`), exporting `Variant`. Parts two variants share sit in their own named file beside them (`menu/Dishes.tsx`, `faq/FaqList.tsx`, `accommodation/StayList.tsx`, `rsvp/reply.tsx`, `countdown/Done.tsx`, `date-time/Calendar.tsx`); a variant never imports another variant. `header` is a section too (required, first), drawn apart from the others so it stays sticky; `footer` is required and last. A section may list `reads` — other sections whose values it shows (notes ← dress-code, gifts; footer ← header; countdown ← date-time).
- `palettes/<id>.ts` (14 named roles — `surface`(-alt), `ink`(-muted), `line`, `accent`(-ink, -soft), `secondary`(-ink, -soft), `tertiary`(-ink), `error` — and a `mood`: `subtle`, `balanced` or `vivid`; new ones via the `palette` skill in `.claude/skills/palette/`), `font-pairs/<id>.ts` (`primary` body, `secondary` headings), `patterns/<id>.ts` (the ground's pattern as Tailwind classes, e.g. `dots`). `corners.ts` — the four corner steps (`sharp`, `slight`, `soft`, `round`; ids permanent) as `--m-corner` (boxes, via `CORNER` in `styles.ts`) `--m-corner-pill` (buttons and small labels, via `PILL`) and `--m-corner-field` (form fields and their dropdown lists, via `FIELD_CORNER`: as the box, but `round` stays at `soft`); a template may set one, `sharp` otherwise.
- `index.ts` — `loadLibrary` (server): every palette, font pair, pattern, section and modular template. `variants.ts` — `loadVariant` (browser only; kept apart so variants never enter the server graph).
- `state.ts` — `ModularState` (ids, the envelope switch, every section's on/off + variant, every section's values) and its helpers: `initialState`, `applyTemplate`, `setSectionOn`, `setVariant`, `setNoteSwitch` / `noteSwitchOn`, `resolveDesign`, `sameState`.
- `vars.ts` — the roles as `--m-<role>` (`paletteVars`; the pair's faces `fontVars`), the `shadow` (the ground darkened, one oklab `color-mix`), the `pattern` ink (the ground a little darkened) the `inverse`/`inverse-ink` pair, the bands' muted inks (`accent-ink-muted`, `tertiary-ink-muted`) and the `page-*` copies of ink, muted ink, secondary and accent that `GROUND` in `styles.ts` switches between (the accent band points those roles at its ink; a surface sets them back; `ON_ACCENT` alone for a variant's own accent fill), and the one mapping onto the shared `--c1`–`--c6`. `INVITE_COLUMN` — the widest a section's content grows (1440px; its colour spans the page), as `--invite-column` and in photos' `sizes`. `content.ts` — values (`text`, `list`, `groups`), basics, date and countdown helpers, `formatTime` (EN 3:30 pm, RO/HU 15:30), `imageSrc`, `safeLink`, `mapsQuery`. `samples.ts` — editor-only, so `DEFAULTS` stays out of the guest bundle: `sectionValues` reads a template's samples over `DEFAULTS`, `customNoteSample`. `defaults.ts` — every modular sample in one file: `DEFAULT_BASICS` (the date) and `DEFAULTS` (every section's fields, by section id, then field id). `fields.ts` — the Content tab's helpers: `variantShows`, `fieldShown`, `shownItems`, `setValue`, `fieldId`, `emptyItem`, `firstMissing` (the first empty required field). `nav.ts` — `HEADER_ID`, `SECTIONS_TRIGGER_ID`. `countdown.ts` — `useCountdown` (time left, and before / on / after the day), `COUNTDOWN_DONE` (the fixed texts on and after the day) and `UNITS`, shared by the countdown's variants. `ground.ts` — `groundRule` (a section's rule, its variant's first), `sectionGrounds` (each section's ground by its variant's rule or its own: surfaces taking turns, restarting after an `own` or `accent` section; `joined` ones match the section right before) and `otherGround` (a card's). `styles.ts` (the type scale and shared classes, incl. `GROUND_FILL`), `labels.ts`, `MapsLink.tsx`.
- `icons.tsx` — the hand-drawn icon library (`ICONS`, one entry per icon a host can pick) and `Icon`. `heading.ts` + `SectionHeading.tsx` — every section heading's four optional fields and how they draw. `HeaderBar.tsx` — the header's bar, shared by its variants (they differ only in the mark, the links and the Reply button, in `LOOKS`). `TitleNames.tsx` — the title's names, shared by its variants (Diamonds and Plain differ only in the diamonds above and the eyebrow, in `LOOKS`). `CoverPhoto.tsx` — the cover's full photo, shared by its variants; each draws its own content over it. `WashedPhoto.tsx` — a mood photo with a ground washed over it (cover, location). `IconHeading.tsx` — a large icon disc over the section heading, eyebrow left out. `Mark.tsx` — a line written in three parts (first, middle, last; empty parts left out): the header's mark, drawn by the header and the footer, and the title's names. `clock.ts` (`useNow`), `notes.ts` (`noteItems`, `MAX_NOTES` (6), `NOTE_SWITCH` — Helpful notes' Dress code / Gifts / Custom toggles). `cards/` — `NoteCard` and the Dress code / Gifts cards, shared by those sections and Helpful notes.

## Modular page — `src/components/modular/`

- `ModularInvitation.tsx` — the guest page: the `header` section straight in the column, `SectionsDrawer`, the other sections via `SectionView` (loads a variant with `use`). `framed` for the editor.
- `ModularEditor.tsx` + `ModularEditPanel.tsx` — the `/templates/<id>` editor for modular templates: working and saved state, the open tab and Content section, Save in memory (stopped by an empty required field, which it jumps to), leave warning, the preview's Design and Content buttons on each section.
- `content/` — the Content tab: `ContentTab.tsx` (numbered section cards, one open), `SectionFields.tsx` (a section's fields, from `contentParts` in `src/modular/fields.ts` — the same list Save checks), `FieldInput.tsx` (one field, its required error), `IconPicker.tsx`, `ListFields.tsx` (lists and groups, Add / Remove), `NotesFields.tsx` (Helpful notes: Dress code / Gifts fields and custom notes).
- `design/` — the Design tab: `DesignTab.tsx`, `TemplatePicker.tsx`, `LookPickers.tsx` (palette, pattern, font pair), `SectionsList.tsx` (section switches, styles, Helpful notes switches); `SectionBar.tsx` (a section card's top row) and `styles.ts` (the section card's classes) are shared with Content.

## Invitation — `src/components/invitation/`

- `Invitation.tsx` — owns both the card and the reply panel (one tree per panel).
- `HostInvitationEditor.tsx` — host editing wrapper; `EditPanel.tsx` — the edit surface.
- `EditorFrame.tsx` — the editors' page: the invitation or sheet, and the labelled strip at its right edge (the panel's views, Save or Export, Quit editor); the side panel opens beside it. Shared by the simple and modular editors and the print page. `SidePanel.tsx` — the panel itself: the open view's title and an X, then the caller's fields.
- `RsvpPanel.tsx` / `RsvpForm.tsx` / `useRsvpForm.ts` — guest RSVP.
- `ScaledStage.tsx` — scales the invitation to its container.
- `PanelTabs.tsx` — the Design / Content / Replies tabs (`TABS`, `useTabViews` for the strip), shared by both invitation editors.
- `PanelSwitch.tsx` — the side panel's on/off switch; `Switch`, the switch alone (`md`, or `sm` on Content's head bars).
- `styles.ts`, `icons.tsx` — local to invitations.

## Envelope — `src/components/envelope/`

The closed envelope over an invitation (simple and modular, guest page and editors) until it is opened. Maintained with the `envelope` skill.

- `Envelope.tsx` — the drawing's layers, the hover lift and tag swing, the flap's turn on click, then the fade into the page; used by `Invitation` and `ModularInvitation`. `useSealed.ts` — whether the page is still sealed (the page stays `inert` until then; the editors' Use envelope switch seals it again).
- `colors.ts` — an `envelope` (each palette's, each simple template's: six roles, hex or another role; a palette's may also name its own colours, `paletteEnvelope`, and adds `ground`, what the envelope sits on, `envelopeGround`) as `--env-*` vars, with the fixed Hue + Vivid shading. `motion.ts` — timings, flap keyframes, the shading fades. `tag.ts` — the tag's words, fitted along it. `card.ts` — the simple card's way out of the pocket (Rises / Slides out); `strip.ts` — the modular page's way out.
- `drawing.generated.ts` — the drawing as markup, every id, class and colour `env-` prefixed. Built by `envelope.py build-app` from `.claude/skills/envelope/drawing/envelope-edit.svg`; never edited.
- The CSS is the envelope block at the end of `@layer components` in `globals.css`.

## Print — `src/components/print/`

- `PrintEditor.tsx` — the page shell: host action bar, panel, preview.
- `PrintPanel.tsx` — the print settings form; `PrintPreview.tsx` — the card, flipped or folded.

Geometry (`.sheet`, `.sheet-view`, `.leaf`, `.flip`, `.fold`, `.sheet-form`) lives in `globals.css`.

## Landing — `src/components/landing/`

- `LandingHeader.tsx` — the landing page's dark top bar (`TOP_BAR`), once a copy of the dashboard's phone top bar.
- `SiteFooter.tsx` — the site footer (links, search, language switcher); the landing page only, dashboards have none.

## Dashboard — `src/components/dashboard/`

Shell: `DashboardShell.tsx`, `SideNav.tsx`, `TopBar.tsx` (phones only, light, across the top like the editors': the menu, then `MoreMenu.tsx` — cart, alerts, latest replies and language folded into one ⋮ button — and the account), `BarActions.tsx` (the right-hand strip from `nav` up: account, cart, alerts, latest replies, language; `COUNTED_VIEWS` and `AccountButton`, shared with the top bar), `SidePanel.tsx` + `useSidePanel.ts` (the right-hand panel: alerts, latest replies or the account, one at a time; narrows the page from `nav` up, over it on phones), `media.ts` (`NAV_DOCKED`), `LanguageMenu.tsx` (the strip's language picker; `LanguageOptions`, the list it shares with `MoreMenu`), `NavLink.tsx`, `LanguageSwitcher.tsx` (the landing footer's EN / RO / HU buttons).

Home: `home/` — `CreateEventCard.tsx`, `NextEventCard.tsx`, `AttentionCard.tsx` (every event's alerts), `EventsBox.tsx` (search, filter dropdown, six rows a page). Shared by boxes: `BoxHead.tsx` (a box's serif title and count), `RowLines.tsx` (a row's name over its grey line), `SearchField.tsx` (the guest list's and Home's search), `SearchClear.tsx` (the X in every search box, for the browser's own).

Overview: `EventOverview.tsx` lays out `overview/` — `ShareBox.tsx` (visibility in a line, link and password, View as guest), `PageLink.tsx` (an event page as a text link, greyed with its reason), `EventBox.tsx` (name, status tag, day, the invitation's picture with Edit on its corner), `PackageBox.tsx` (the package: Upgrade, or Pay and publish), `RepliesBox.tsx` (replies, who is coming in short lines, the reply form's state, the latest five replies beside them), `PrivacyBox.tsx` (`RetentionInfo` in its own box). `StatusTag.tsx` — an event's Live / Draft / Past tag, Home's and the Overview's.

Events: `EventOverview.tsx` (an event's Overview), `EventWhen.tsx` (the day + how far off, the Overview event box's line), `ShareFields.tsx` (link, copy button and Protected password).

`event-nav/` — the nav's event half: `EventNav.tsx` (the picked event, from the route or the cookie, and its pages), `EventPicker.tsx` (the nav's picker: the event's name and short date, the list floating under it, over the event's pages), `EventPickerList.tsx` (the list: search, upcoming events, New event; each event's status `DOT`), `useDismiss.ts` (closing a menu on a press outside or Escape), `pages.ts` (`eventPages` — each page, its icon and why it is greyed; `switchHref` — the same page for another event, else its Overview).

Widgets: `RepliesMeter.tsx`, `RepliesSummary.tsx` (count, bar and legend on the Overview; `RepliesBar`, the bar alone, on Home's event rows), `DatesThatMatter.tsx` (Key dates, a timeline across the box once it has room, down it before), `RetentionInfo.tsx` (the Overview's Data and privacy: the deletion date, what to save, the legal side), `CartList.tsx`, `AlertsList.tsx`, `RepliesList.tsx` (also one event's alone, on its Overview) and `AccountList.tsx` (the side panel's four views; the unpaid events and their total; the account's links and Log out), `Toast.tsx`, `CopyButton.tsx`, `PasswordField.tsx`.

Event pages: `PageTabs.tsx` (a page's underlined tabs under its title, each a link; the guest page's Guest list / Summary), `EventPageHeader.tsx` (an event page's bar and title, then its tabs or the same rule under the title) + `EventPageBar.tsx` (the full-width sticky bar with the event's name, then the page's name with an optional action beside it, which the bar takes on once it scrolls away; its `look`: an event page's, or Home's with its date in the bar, capped to the page), `TodoBoard.tsx` (the Overview's To do: the event's alerts plus what its own state needs doing, `eventTodos` in `notices.ts`).

`event-editor/` — Event settings. `EventEditor.tsx` lays out the `*Section.tsx` cards, one under another (General, Link and access, Replies, Package, Cancel or delete) and which one is open; each is a `SettingsCard.tsx` (title, Edit; read as `ReadRow`s, open as `EditRow`s — the same rows, each value turned into its field — with Cancel / Save), with `SettingRow.tsx` for a line and its button; state in `useEventForm.ts`, shared classes in `styles.ts`. `EditorSection.tsx` — `EditorHeading`, a group title in small sans caps, used by the modular editor's tabs.

`guest-list/` — the guest manager. `GuestManager.tsx` holds the page's two tabs (`?view=summary`) and composes the add-names box, one row of the search (`SearchField`) and `GuestToolbar.tsx` (the Invite list menu, New reply), and the table, a card per status (`GuestTable.tsx` → categories → groups → `RowView.tsx` / an editor); state in `useGuestList.ts` / `useGuestActions.ts` / `useRowEditor.ts`. Editors: `ReplyEditor.tsx` (a reply's questions, or a new reply with several people) and `NameEditor.tsx` (a waiting name), both in the `RowEditor.tsx` frame; fields in `ReplyFields.tsx` (diet's tick dropdown in `MultiSelect.tsx`), reply ↔ form values in `replyValues.ts`; the status/age/diet message keys in `labels.ts`, shared by rows, editor and summary.

## Lib — `src/lib/`

| File               | Holds                                                                                                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts`        | `GUEST_DATA_RETENTION_DAYS` — the single GDPR retention parameter. Never inline it. Also the reply-cap margins and the replies-closing-soon window.                                                                                 |
| `event.ts`         | `eventPath` (an event's dashboard pages), `invitationLink`, `defaultReplyClose` (24h rule), `dateLocked` (from the event day), `deletionDate`, date formatting, expected-guests and reply-cap helpers, `replyClose` / `replyWindow` |
| `slug.ts`          | `RESERVED_SLUGS` (the one list), slug limits, `normalizeSlug`, suggestions, the invite rewrite pattern. Relative imports only — `next.config.ts` reads it.                                                                          |
| `invitation.ts`    | Template vars, `findByInvite`, seed/fallback values, `DATE_FORMATS`                                                                                                                                                                 |
| `fonts.ts`         | Invitation fonts via `next/font/google` (per-template, not the app chrome — that's `src/app/fonts.ts`). Also the font pairs' faces (Gelasio, Arimo, Fraunces, Space Grotesk).                                                       |
| `history.ts`       | Local visit tracking; `useLeaveFestio(fallback)` — the one BACK, with each page's own fallback when no Festio page is behind it                                                                                                     |
| `guests.ts`        | Guest rows from list + replies: matching, Unknown/Duplicate tags, grouping and splitting by category, counts, filters, repeat check. Type imports only.                                                                             |
| `leave-warning.ts` | `useLeaveWarning(active, message)` — while there are unsaved changes, asks before reload/close (the browser's prompt) and before in-app links or a `data-leaves` control (BACK)                                                     |
| `language.ts`      | `LANGUAGES` (the one list, read by both `i18n/routing.ts` and an invitation's `language`), `invitationLanguage`, `LocalizedText`/`localized`, locale tags and names, `plainText` (case- and accent-blind search)                    |
| `picked-event.ts`  | The event the nav is on: `PICKED_EVENT_COOKIE` (read in the dashboard layout), `toPickerEvent`, `resolvePicked`, `writePickedEvent` — the one place it is written                                                                   |
| `id.ts`            | `newId()` — a random UUID; falls back to `getRandomValues` where `crypto.randomUUID` is missing (pages not on HTTPS or localhost, e.g. a phone on the dev server)                                                                   |

## Other

- `src/types/` — `envelope.ts` (the envelope's colour roles), `invitation.ts` (incl. `TemplateModule`, a union of simple and modular), `modular.ts` (sections, palettes, pairs, modular templates), `dashboard.ts`, `print.ts`, `guests.ts` (mock-only)
- `src/mock/dashboard.ts` — mock data; **no Firestore wiring yet**
- `src/mock/guests.ts` — `findGuests(eventId)`, mock guest lists
- `src/components/icons.tsx` — app-wide icons
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`

No `firestore.rules` / `firestore.indexes.json` in the repo yet.
