# Current Feature: Event Package

An event has one **package** — Free, Standard or Custom — in place of a tier plus a separate invitation type. Also fixes the Edition (now Package) section showing message keys instead of text.

## Status

Completed

## Goals

### One package instead of tier + type

| Package  | Price   | Invitation                                                  | Seating chart |
| -------- | ------- | ----------------------------------------------------------- | ------------- |
| Free     | Free    | Simple, free templates only                                 | No            |
| Standard | 100 RON | Simple, all simple templates                                | Yes           |
| Custom   | 200 RON | All templates, simple or modular (sections, own RSVP questions, palette/fonts/images) | Yes           |

- **Custom unlocks every template**, simple or modular — same as today's Tier 3. Modular templates need Custom; simple ones stay available on it too
- The package only ever goes up: Free → Standard → Custom. No downgrades, no partial refunds (unchanged)
- Events: drop `invitationType` (nothing reads it) and replace `tier` with `package`
- Templates: one `package` field, the lowest package that can use it, in place of `type` + `minTier` (`wolf-dance` has `type: 1, minTier: 1` → free)
- **Named "package" everywhere** — code, message keys and English text (HU *csomag*, RO *pachet* already). The `Tiers` namespace becomes `Packages`; its `free` / `standard` / `custom` keys stay; `tierPaid` / `{tier}` / `edition` keys become `package…`. `package` is reserved in strict JS, so locals are `pkg`
- Mock: the engagement (`logodna-ana-vlad`) is `tier: 1` but `paid: true` — make it **Custom**
- Update `context/project-overview.md` (Tiers table, Invitation types) to talk about packages

### Bug: Edition section shows keys

- On the event edit page, the Edition section shows `Tiers.standard.blurb` (and the upgrade tile `Tiers.custom.upsell`) instead of text
- Cause: `66bd5df` removed every `blurb` and `upsell` from `Tiers` in all three catalogs; `EditionSection.tsx` still reads them
- Fix: restore them in `en`, `ro` and `hu` (the removed texts are in that commit's diff), updated to the package wording above

### Event row actions order

- The six actions on an event's row (events page) run: Edit event, Guest list, Seating, View as guest, Print, Edit invitation
- Shorter labels for the two edit buttons: HU *Esemény* / *Meghívó*, RO *Eveniment* / *Invitație* (EN stays Edit event / Edit invitation)

## Notes

- Code that reads the tier: `types/dashboard.ts` (`TierId`, `Tier`, `tier` on events and notices), `types/invitation.ts` (`minTier`), `mock/dashboard.ts` (`TIERS`, events), `EditionSection.tsx`, `EventMeta.tsx`, `EventRow.tsx`, `NotificationsRail.tsx`, `app/[locale]/dashboard/events/[id]/page.tsx`, `templates/wolf-dance/index.tsx`
- Separate from the reply editor (`context/features/reply-editor.md`)

## History

<!-- Keep this updated latest to earliest -->

- Reply editor — edit a reply with every RSVP question (age, diet with None/Other, the host's questions, reply-wide answers with Separate from group); New reply with several people; unsaved-changes guards shared with the list box and a leave-page warning; custom answers and the message in the reply details; keyboard diet dropdown
- Preloaded guest list — the list box as a draft editor: paste and add names, an A→Z list with a sticky search, × for waiting names and "replied" for the rest, Save / Cancel with unadded-names and discard prompts; opens above the list buttons, fades in and out; one shared gold button colour
- Guest summary — the guest list page's Summary: Replies, Age and Dietary needs tables, custom question answers and messages behind a Show/Hide toggle, an Other diet option, and mock custom questions on the engagement
- Guest list row design — one sheet with category sections, reply threads, a Needs your attention section for unknown and identical names, foldable reply details, a header that gives up space in order, and Summary / Guest list page sections
- React Grab — dev-only tool to copy an element's component and file location for Claude Code
- Event guest list — one page per event with the merged list, categories, Unknown/Duplicate resolving, inline editing, pasted names and invite-sent tracking; BACK falls back to each page's own list
- Safety features — clean slug-only links, the Protected password on the printed card, expected guests with a hidden reply cap, reply-form closing, and one set of warning texts for banners and the notifications rail
- Language / i18n — Romanian and Hungarian for the host app and guest invitations, each invitation with its own language
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
