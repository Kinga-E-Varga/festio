# Current Feature: Language / i18n

<!-- Feature name and short description -->

## Status

Completed

## Goals

- Add Hungarian and Romanian alongside English, for both the host-facing app and guest-facing invitations.
- Any Festio-provided string the host can't edit gets a catalog entry and is translated (RSVP labels, predefined section titles, print instructional text, dashboard UI, toasts, empty states, etc). Host-typed content is never translated.
- Host app (dashboard, editor, landing page): use `next-intl` with locale-segment routing (`src/app/[locale]/...`). English is default/unprefixed; RO/HU are prefixed. Host switches app language via a footer control, independent of any event's language. UI strings live in per-locale message catalogs.
- Guest invitation route stays unprefixed, outside `[locale]` — no per-guest language switch. Lives at `src/app/invite/[invite]/page.tsx` (not a bare `src/app/[invite]/`): Next.js won't allow `[invite]` and `[locale]` as differently-named dynamic siblings at the app root, so it's nested under a literal `invite/` folder and `next.config.ts` rewrites the real unprefixed URL there invisibly.
- Each invitation gets a new `language` field, set by the host, separate from the host's app language. It drives:
  - RSVP form labels/questions provided by Festio.
  - Type 2 predefined section titles and other Festio-provided section copy.
  - Date/time formatting shown to guests.
  - Default values for editable fields while unedited by host (nice-to-have, skip if it adds real complexity).
- `language` is editable like any content field until the 24h content freeze; changing it after public uses the existing "guests won't be notified" warning flow.
- Already-downloaded printable PNGs do not retroactively update on language change (expected, not a bug).
- Printable invitation always reflects the invitation's own `language`, never the host's dashboard language.
- Existing invitations default `language` to English on rollout; no host action required.
- Templates: move Festio-provided labels/copy (section titles, defaults) into message catalogs so templates read from them instead of hardcoding strings. Host-editable field values stay in the template's own data.

## Notes

Committed so far: `a5c8881` on `feature/language`. Not merged — the feature is
not finished.

### Pick up here

Translate the event editor: `src/components/dashboard/event-editor/` (15 files)
plus `TemplateField.label` in `src/templates/wolf-dance/index.tsx`. Do both
together — translating the labels alone leaves the host's edit panel
half-translated.

`DetailsSection` and `LinkSection` are already partly wired (the invitation
language control and the shared visibility copy), so start by reading those two
for the pattern, then work through the rest.

`EditPanel` renders inside the *invitation's* language provider, so a label
read from a catalog there would come out in the invitation's language, not the
host's. Pass the host's locale in as a prop — the pages already know it.

After that the feature is done: set Status to Completed, commit, merge
fast-forward, delete the branch, then close out.

### Method that works

- Add the keys to `messages/en.json` first, then `ro`/`hu`. Wording that is
  Festio's goes in the catalogs; structure (which sections exist, which icon)
  stays in the data and carries only a `labelKey`.
- A plain function cannot call `useTranslations` — have it return keys and
  values and let the render translate (see `warningsFor` in `EventCard`).
- Use `t.rich` when a number or link sits mid-sentence; where "mid" falls
  differs per language.
- Numbers passed to ICU are formatted, so a year must go in as a string or it
  prints "2,026".
- Check with `npm run build`, `npm run lint`, `tsc --noEmit`, then curl the
  page under `/`, `/ro` and `/hu`. Browser click-testing is not possible in
  this sandbox (Playwright's install needs `sudo`).

### Done

- **Routing** — `next-intl`, `src/i18n/*`, `src/proxy.ts` (Next 16 renamed
  `middleware.ts`), host app under `src/app/[locale]/`, footer switcher.
- **Invitation `language`** — the field, the host control with its change
  warning, guest RSVP copy, per-language date formats, the printable's line.
- **Template copy** — `TemplateField.fallback` is `LocalizedText`.
- **Dashboard** — shell, home, notifications rail, events list, invitations
  grid. Everything but the event editor.

### Decisions that hold — do not re-open

- `src/lib/language.ts` owns the one list of languages; `i18n/routing.ts` reads
  it. An invitation's `language` and the host's locale are the same set of
  languages but never the same choice.
- `DashboardEvent.language` is optional; absent means English. That *is* the
  rollout default — nothing needs backfilling.
- The guest route lives at `app/invite/[invite]` with a `next.config.ts`
  rewrite. Next.js will not allow `[invite]` and `[locale]` as
  differently-named dynamic siblings at the app root, and the guest URL has to
  stay unprefixed.
- Template copy stays *in the template file*, declared per language, not in the
  shared catalogs — `project-overview.md` makes "adding a template touches one
  file" a hard constraint.
- `LocalizedText` is a plain string or a full `Record<Language, string>`, never
  `Partial`: a template cannot ship a language short.
- Guest-facing copy follows the invitation's `language`; host chrome follows
  the host's locale. On the invitation editor and print page both are on screen
  at once, and that is correct.

### Deliberately not translated

- The attention notices and recent-RSVP lines in the rail. Both are sentences
  Festio generates from an event's own numbers, and nothing generates them yet;
  their message shape depends on a write layer that does not exist.
- Host-typed content, ever.

### Before launch

RO and HU throughout are AI drafts and want a native read-through.

## History

<!-- Keep this updated latest to earliest -->

- Invitation print page — a flat or folded printable at `/prints`, with its own settings form
- Host action bar — one bar over the card: back, edit toggle, save, dismiss
- Invitations page — grid of invitation cards, plus one-record arrivals from Events and the dashboard
- Dashboard & events UX fixes — header action, card restack, warning-only tags
- Dashboard design fixes — stats, card/list layout, editor banners, focus rings
- Invitation composition — card + reply in one component, one tree per panel
- Type 1 invitation page and editing platform
- Events list — "Edit invitation" label + safeguard/dates info
- Scanner fixes — cart badge + safeguard bar helper
- Dashboard events + event edit pages
- Dashboard redesign
- Dashboard UI
- Initial setup
