# Current Feature: Header menu links

## Status

Completed

## Goals

- The modular header's menu shows at most 7 links (`MENU_MAX`), listed in page order.
- Always there while their sections are on: Date, Location, Schedule, Getting there, Accommodation, Good to know (Helpful notes, Dress code and Gifts share it, one link to the first on the page) and Contact.
- Free spots filled in this order: FAQ, Family (Special people), Menu, Story (`MENU_RANK` in `src/modular/nav.ts`).
- New links: Location (ro Locația, hu Helyszín), Contact (Contact, Kapcsolat), Family (Familia, Család), Story (Poveste, Történet).
- Date & time's link renamed The day → **Date** (ro Data, hu Dátum).

## Notes

- `menuLinks` in `src/components/modular/ModularInvitation.tsx`: a ranked section's link is its `menuLabel`, else its name; no stored data changes.
- Simplify: ran 2026-10-31
