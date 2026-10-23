# Current Feature: Dashboard-wide button and field styles

## Status

Completed

## Goals

- **Shared form styles live in `src/components/dashboard/styles.ts`.** Every bundle in
  `src/components/dashboard/event-editor/styles.ts` that is used outside `event-editor/`
  moves up: `FIELD`, `INPUT`, `ERROR`, `SOFT_BTN`, `SOFT_ACTION_SHAPE`, `SOFT_ACTION`,
  `SOFT_OUTLINE`, `SOFT_PICK`, `BUTTON`, `BTN_PRIMARY`, `BTN_GHOST_LIGHT`, `MINI`, `SUBBOX`,
  `BANNER_TITLE`, `BANNER_TONE` (with its `BannerTone` type).
- **Only the event editor's own styles stay** in `event-editor/styles.ts`: `BTN_DANGER`,
  `INSET_INPUT`, `BANNER_ICON`. They import what they build on from the shared file.
- **Every import points at the right file.** The ~21 files outside `event-editor/` that
  import `event-editor/styles` (guest list, modular, auth, print, invitation, `SaveConfirm`,
  `TodoBoard`, …) import from `@/components/dashboard/styles` instead. `guest-list/styles.ts`
  builds on the shared file. No file outside `event-editor/` imports `event-editor/styles`.
- **Nothing looks different.** Each value moves as it is; no class changes.

## Notes

- Source: `context/features/pending/database.md`, Do later item 4 (found by the step-4
  cleanup's simplify review).
- Branch: `chore/dashboard-form-styles`.
- The rule: `context/coding-standards.md` → Styling, "a bundle lives in the `styles.ts` of
  the folder that uses it; used outside that folder, it moves up to the shared one".
- Re-check the outside-use list against the code when starting; the counts above are from
  a grep on 2026-10-23.
- Check in the browser: event settings, guest list, an invitation editor, print, sign-in —
  each looks as before. Then `npm run build`.
- Update `context/map/dashboard.md` if it names where these styles live.
- At `/feature complete`: mark item 4 in `database.md` as `Done (<commit message>)`.
- Simplify: ran 2026-10-23
