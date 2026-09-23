# Current Feature: Language / i18n

<!-- Feature name and short description -->

## Status

In Progress

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

- RSVP answers are stored keyed to permanent question IDs, never label text — switching language only changes which label renders, no migration needed.
- Decisions made: EN default/unprefixed, RO/HU prefixed, host-switchable in footer; invitation `language` separate from host app language; invitation `language` editable pre-freeze via existing warning flow; template restructuring included now (only one template exists, low cost).
- Out of scope questions not yet settled: covered by spec as decided; nothing else flagged unsettled.
- Build order agreed with the host: (1) routing scaffold — done this session; (2) invitation `language` field + guest-facing RSVP/section/date/print copy; (3) move template labels into catalogs.

### Stage 1 (routing scaffold) — done

- Installed `next-intl`; added `src/i18n/{routing,navigation,request}.ts`, `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`), `messages/{en,ro,hu}.json`.
- Moved `page.tsx`, `dashboard/**`, `invitations/[id]`, `templates/[id]`, `prints/[id]` under `src/app/[locale]/`; all their `next/link/next/navigation` usage switched to `@/i18n/navigation`.
- Guest invitation moved to `src/app/invite/[invite]/` with an invisible `next.config.ts` rewrite so the visible URL is unchanged — see the Goals note above for why.
- Footer language switcher (`LanguageSwitcher.tsx`) is wired and functional; catalogs only carry its own strings so far.
- **Deliberately deferred to a later stage**: extracting the rest of the dashboard/editor's hardcoded English strings into the catalogs. Everything still reads in English regardless of locale until that pass happens.
- Verified via `npm run build`, `npm run lint`, and curl against a dev server (SSR locale/`html lang`/switcher state, invite rewrite, 404 on bad slugs). Could not click-test in an actual browser — Playwright's browser install needs `sudo`, unavailable in this sandbox.

### Stage 2 (invitation `language`) — done

- `src/lib/language.ts` is the one list of languages; `src/i18n/routing.ts` now reads it, so the host app's locales and an invitation's `language` can never drift apart.
- `DashboardEvent.language` is optional on purpose: absent means English, so every invitation that predates the field reads as English with nothing to backfill.
- Guest pages get a `NextIntlClientProvider` holding the *invitation's* language — the route has no locale to read. `<html lang>` follows it too.
- The host's invitation editor and the print page do the same for the guest-facing parts only: the reply panel, the card's date and the printable's own line are in the invitation's language even when the dashboard around them is not. The host's chrome stays on the host's locale.
- Date formats are now rendered per language. `long` and `weekday` follow each language's own convention (Hungarian writes the year first); `monthFirst` is built by hand, because asking `Intl` for it outside English just returns the language's preferred order and collapses the option into `long`.
- The host picks the language in the event editor's Details section. Changing it on an invitation guests already hold raises the usual "telling my guests is up to me" warning.
- Still English regardless of language, and waiting on stage 3: the template's own fallback copy — the reply panel's standing line and the printable's opening headline both come from `wolf-dance`'s hardcoded `rsvpMessage`.
- The dashboard/editor's own hardcoded English is still deferred, as agreed in stage 1.
- Verified via `npm run build`, `npm run lint`, `tsc --noEmit` and curl against a dev server: the Romanian invitation renders Romanian labels and dates with `lang="ro"`, the same invitation opened from a Hungarian dashboard still renders its reply panel and printable line in Romanian, and the language control appears in the event editor. Still no browser click-testing in this sandbox.

### Stage 3 (template copy) — done

- The spec asked for template copy to move into the message catalogs, but `project-overview.md` makes "adding a template = adding a single file, no edits elsewhere" a hard constraint, and shared catalogs would break it. Both are satisfied by keeping the copy in the template file and declaring it per language: templates no longer hardcode one English string, and adding a template still touches one file.
- `LocalizedText` (in `src/lib/language.ts`) is either a plain string or a full `Record<Language, string>`. The record is deliberately not `Partial` — a template cannot ship a language short, because TypeScript refuses it before the card can render a hole.
- `TemplateField.fallback` is now `LocalizedText`. A fallback that is a phrase carries all three languages; names, addresses and the date-format id stay plain strings, because they are sample content standing in for the host's own and read the same in any language.
- `seedValues` reads the language off the event itself rather than taking it as an argument — a fallback is copy a guest reads, so there is one right answer and no caller can pick the wrong one.
- `TemplateField.label` is deliberately still English. It is editor chrome, and translating it alone would leave the host's edit panel half-translated; it belongs with the deferred dashboard/editor pass so the whole panel changes language at once.
- This closes the two gaps left open after stage 2: the reply panel's standing line and the printable's opening headline both came from `wolf-dance`'s `rsvpMessage` fallback and now follow the invitation's language.
- Type 2 predefined section titles were in scope but have nothing to translate yet — no template declares sections, and `wolf-dance` is Type 1.
- Verified by curl: the Romanian invitation renders "Vă invităm să / sărbătoriți nunta noastră" and "Cununia | 13:00" on the card, the English survives only inside the serialized `fallback` record, and the sample names and venues are untouched. The printable seen from a Hungarian dashboard carries Romanian on both lines.

### Stage 4 (dashboard strings) — shell done, rest in progress

The piece parked back in stage 1. Being done in increments rather than one 38-file diff.

- **Done — the shell**: side nav (section headings, every destination, "quit"), top bar (all four aria labels), footer (three columns, twelve links, search, copyright). `/ro/dashboard` and `/hu/dashboard` now read in their own language.
- Nav and footer wording moved out of `src/mock/dashboard.ts` into the `Nav`, `TopBar` and `Footer` namespaces; the mock data now carries only `labelKey`/`linkKeys`, since which sections exist is structure and what they are called is copy.
- The copyright year is passed as a string, not a number: ICU would otherwise format it with grouping and print "© 2,026 Festio".
- **Done — dashboard home and the rail**: greeting, date line, "New event", "Active events", the empty-state line, all four stat labels and their trailing detail, the rail's three panel headings and the whole data-retention block.
- The host's date is now formatted per language rather than stored as the English sentence it used to be, so Hungarian gets its own year-first order. `HOST` holds a name and an ISO date; the greeting around the name and the shape of the date are the catalog's and the formatter's business.
- The three pages that each repeated that date paragraph now share `HostToday` — they were already identical, and having a format to keep in step as well as classes made the triplication worth removing.
- The retention block uses `t.rich`: the day count sits mid-sentence in its own serif span, and where "mid" falls differs per language, so gluing three fragments would only have worked in English.
- **Done — events list and invitations grid**: both page titles, ledes, tab labels, empty states and group captions; every event card and row (tallies, safeguard line and its aria label, all six actions, the sharing/replies/dates panels); the replies meter; visibility labels and their explanations; the freeze/close/deletion date notes; and the invitation cards.
- Visibility is shared between the event cards and the editor's own Link section, so `VISIBILITY` carries `labelKey`/`blurbKey` and both read the same two entries. The icon stays in the map — it is not a word.
- `warningsFor` in `EventCard` is a plain function and cannot call a hook, so it returns keys and values and the render translates them. The card's safeguard warning carries its percentage as a value rather than baked into a string.
- The two page ledes left `src/mock/dashboard.ts` entirely — they were Festio's own copy sitting in the mock data.
- **Still English**: the whole event editor (`event-editor/`), and `TemplateField.label` from stage 3, which should land with it so the edit panel changes language in one go. This is the last piece.
- **Deliberately left English**: the attention notices and recent-RSVP lines in the rail. Both are sentences Festio generates from an event's own numbers, and nothing generates them yet — their message shape depends on a write layer that does not exist, so inventing one now would be guessing.
- RO/HU here are my own drafts and want a native read-through before launch.

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
