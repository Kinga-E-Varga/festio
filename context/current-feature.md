# Current Feature

Redesign the dashboard UI — colours and subtle design elements — to match the updated palette and the new screenshot references.

## Status

Completed

## Goals

<!-- What must exist when this is done. -->

- Dashboard uses **only** the colours listed in @context/project-overview.md (the palette changed; the old one no longer applies).
- Shapes and colours follow the references in @context/screenshots as closely as the palette allows.
- Dashboard is responsive across the three reference breakpoints: extra wide, medium, mobile (`festio-extra-wide.png`, `festio-medium.png`, `festio-mobile.png`).
- Logos come from the SVGs in `/public` (`festio-icon-colour.svg`, `festio-icon-monochrome.svg`), used as shown in the screenshots.

## Notes

<!-- Decisions, constraints, open questions, known limitations. -->

- Source spec: @context/fix/redesign-dashboard.md.
- **Design of record is the "Festio Host Dashboard" artifact**, which is more precise than the screenshots: https://claude.ai/code/artifact/fb5d8c95-a769-480a-b4b1-c485bb94998b. It is a prototype — take colours, shapes and positioning from it, never its code.
- Palette rule is strict — no colours outside the listed tokens. The artifact uses ~15 near-miss hexes (e.g. `#2D2821`, `#3B503B`, `#CE6B34`); each is snapped to the nearest palette token.
- Palette tokens live in the Tailwind v4 `@theme` block in `src/app/globals.css` — update there, not per-component. `--color-*: initial` clears Tailwind's stock colours, so anything off-palette fails to compile rather than slipping through.
- Card layout uses container queries, not viewport ones: the side nav and activity rail both eat into the card's width, so the same viewport gives very different room depending on what's docked.
- Visual/style change only; no change to dashboard data or behaviour.

## History

<!-- Keep this updated earliest to latest -->

- Initial setup of Next.js project (TypeScript, Tailwind, ESLint), linked to git repo (github.com/Kinga-E-Varga/festio.git) and pushed initial commit to `main`.
- **Dashboard UI** — host dashboard shell at `/dashboard` on mock data: top bar, collapsible side nav, collapsible notifications rail, and a main area with stat strip, event tabs and invitation previews. Set up the app-wide Tailwind v4 palette tokens and fonts. Branch `feature/dashboard-ui`.
- **Dashboard redesign** — reworked the dashboard to the new palette and the "Festio Host Dashboard" artifact. Every off-palette hex snapped to its nearest token, with `--color-*: initial` making anything outside the palette fail to compile. Event card moved to container queries with breakpoints derived from content rather than chosen by eye; two-tone attendee safeguard bar; nav docks at 820, activity rail at 1400. Fixed along the way: Tailwind v4 Preflight dropping `cursor: pointer` on buttons, and the rail drawer inheriting the nav's 242px width. Branch `fix/redesign-dashboard`.
