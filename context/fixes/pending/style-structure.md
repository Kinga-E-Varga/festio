# Fix: Style Structure

Bring the host app's styles in line with the styling rule in `context/coding-standards.md`
(values as tokens, text styles as `@utility`, bundles as `styles.ts` constants, a bundle in
its folder's file or the shared one). No change in looks.

## Status

Not Started

## Goals

### 1. Guest-list bundles used outside their folder

- `dashboard/guest-list/styles.ts` is still imported from 5 files outside its folder:
  `print/PrintPanel.tsx`, `dashboard/UnsavedPrompt.tsx`, `dashboard/home/EventsBox.tsx`,
  `dashboard/event-editor/RollOut.tsx`, `[locale]/dashboard/events/[id]/guests/page.tsx`
  (e.g. `FADE_IN`, `ICON_BTN_DANGER`)
- Move every bundle used outside the folder up to `src/components/dashboard/styles.ts`
  and update the imports. What stays in `guest-list/styles.ts` is used only there
- Print sits outside `dashboard/`, like sign-in and the invitation editors that already
  import `dashboard/styles.ts`: decide whether the shared file belongs at
  `src/components/styles.ts` instead, since it is no longer the dashboard's alone

### 2. One label-over-a-field bundle

- A label above its field is written as `label-caps` plus its own gap. The print panel
  uses `label-caps mb-2` twice (`PrintPanel.tsx:64`, `:82`); check for other gaps too
- Pick one gap, name the bundle once (e.g. `FIELD_LABEL`) and use it wherever a label sits
  above its field. Where a different gap is on purpose, say why next to it
- Labels beside a field (Event settings rows, the invitation editor) keep plain `label-caps`

### 3. One-class constants: value or alias?

- `NAV_MARGIN = "mx-2.5"` and `TOP_BAR_CIRCLE = "max-nav:size-10"` (`dashboard/styles.ts`),
  `BOX_GAP = "gap-4"` (`modular/design/styles.ts`) are one class each
- They are shared values, not aliases of a named utility, so the rule allows them. Check
  each: if the value is the point (every nav item's inset), make it a `@theme` token
  (`--spacing-nav-inset`) and use `mx-nav-inset`; if it is used once, inline it

### 4. Text styles kept as TS constants

- Find constants that set only text properties (size, weight, colour, tracking, case),
  e.g. `BANNER_TITLE`, and check each against the rule
- Pure text styles move to an `@utility` in `globals.css`; a constant that also carries
  layout or interaction (hover, transitions) stays a bundle

## Notes

- Skip `src/components/invitation/`, `src/modular/` and `src/templates/` for text styles:
  invitations have their own fonts and palettes. Their bundles still follow Goal 1
- `src/modular/sections/rsvp/reply.tsx` has its own `LABEL`: the guest-facing RSVP's, not
  the app's. Leave it
- `npm run build` and a look at Home, the guest list, Event settings, sign-in, print and both
  invitation editors before and after: nothing should move
