# Current Feature: Load the latest replies only when their panel opens

## Status

Completed

## Goals

- Dashboard pages no longer read the latest replies on every load: `loadDashboard`
  (`src/db/reads/dashboard.ts`) stops calling `loadRecentReplies`, and the dashboard layout
  (`src/app/[locale]/dashboard/layout.tsx`) no longer passes server-rendered `activity` to
  `RepliesList`.
- The latest replies panel (guests icon on the right strip) asks for its replies when the
  host opens it, and shows a loading skeleton meanwhile.
- Same list as today once loaded: the 20 newest replies across the host's events, with their
  Unknown / Duplicate tags (`loadRecentReplies`, unchanged), still checked for the signed-in
  host.
- Every dashboard page drops to roughly 15 reads plus its own (about 40 fewer each). The
  feed's reads are paid only when the panel is opened.
- `npm run cost` before and after; the baseline goes down, then `COST_UPDATE=1 npm run cost`
  saves it.

## Notes

- Simplify: ran 2026-10-24

- Spec: `context/fixes/pending/dashboard-reads.md`, item 3. Branch: `fix/replies-panel-on-open`.
  At `/feature complete`, mark item 3 there `Done (<commit message>)`.
- Test-first where it touches `src/db/` or `src/lib/` (test guards in
  `.claude/skills/feature/rules.md`); the panel itself is checked in the browser.
- Touches `src/db/reads/` and `src/app/`, so `npm run test:app` must pass too.
- Today: `loadDashboard` runs `loadHostSummary()` and `loadRecentReplies(events, 20)` side by
  side; Home (`dashboard/page.tsx`) uses `loadDashboard` but not `activity`. The event
  Overview's own replies box (`loadEventReplies`) is separate and stays as it is.
- Opening the panel already saves the visit (`markRepliesSeen` in `DashboardShell.tsx`) to
  clear the badge.
- **Decided (2026-10-24):**
  - **The panel fetches with a Server Action**, not a route handler (the coding standards
    keep routes for webhooks, uploads and the like). It reuses `loadRecentReplies` and
    returns `{ success, data, error }`.
  - **Skeleton on the first opening only, then the list is kept.** The panel lives in the
    dashboard layout, so it stays mounted across dashboard pages. A later opening shows the
    kept list at once and fetches again only when the new-replies badge shows new replies;
    with nothing new, reopening costs 0 reads.
