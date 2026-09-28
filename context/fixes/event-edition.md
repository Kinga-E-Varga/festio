# Event Edition

An event has one **edition** — Free, Standard or Custom — in place of a tier plus a separate invitation type. Also fixes the Edition section showing message keys instead of text.

## Goals

### One edition instead of tier + type

| Edition  | Price   | Invitation                                               | Seating chart |
| -------- | ------- | -------------------------------------------------------- | ------------- |
| Free     | Free    | Simple, free templates only                              | No            |
| Standard | 100 RON | Simple, all simple templates                             | Yes           |
| Custom   | 200 RON | Modular: sections, own RSVP questions, palette/fonts/images | Yes           |

- **Custom always means modular.** A host who wants a simple template picks Standard (today the spec lets Tier 3 use Type 1 templates too — this drops that)
- The edition only ever goes up: Free → Standard → Custom. No downgrades, no partial refunds (unchanged)
- Events: drop `invitationType` (nothing reads it) and replace `tier` with `edition`
- Templates: one `edition` field, the edition it needs, in place of `type` + `minTier` (`wolf-dance` has `type: 1, minTier: 1` → free)
- Keep the existing names: the `Tiers` messages already use `free` / `standard` / `custom`
- Mock: the engagement (`logodna-ana-vlad`) is `tier: 1` but `paid: true` — make it **Custom**
- Update `context/project-overview.md` (Tiers table, Invitation types) to talk about editions

### Bug: Edition section shows keys

- On the event edit page, the Edition section shows `Tiers.standard.blurb` (and the upgrade tile `Tiers.custom.upsell`) instead of text
- Cause: `66bd5df` removed every `blurb` and `upsell` from `Tiers` in all three catalogs; `EditionSection.tsx` still reads them
- Fix: restore them in `en`, `ro` and `hu` (the removed texts are in that commit's diff), updated to the edition wording above

## Notes

- Code that reads the tier: `types/dashboard.ts` (`TierId`, `Tier`, `tier` on events and notices), `types/invitation.ts` (`minTier`), `mock/dashboard.ts` (`TIERS`, events), `EditionSection.tsx`, `EventMeta.tsx`, `EventRow.tsx`, `NotificationsRail.tsx`, `app/[locale]/dashboard/events/[id]/page.tsx`, `templates/wolf-dance/index.tsx`
- Separate from the reply editor (`context/features/reply-editor.md`)
