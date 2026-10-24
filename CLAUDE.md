## FESTIO

An invitation + RSVP + event hub.

## Context Files

Read the following to get the full context of the project:

- @AGENTS.md
- @context/project-overview.md
- @context/ai-interaction.md
- @context/coding-standards.md
- @context/repo-map.md
- @context/current-feature.md

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npm run format` — format everything with Prettier (`format:check` to only check)
- `npm test` — the regression tests (Vitest), on their own Firestore emulator; Java needed, like `npm run emulators`. Safe to run while the dev emulators are up. One file or folder: `TESTS=tests/lib npm test`
- `npm run test:app` — the page tests (who sees what): builds a second copy of the app into `.next-test` and runs it on the test emulator, about a minute. Safe beside `npm run dev`
- `npm run cost` — the cost report (reads and writes per page and save, a month's cost); fails if anything costs more than `tests/cost/baseline.json`, `COST_UPDATE=1 npm run cost` accepts it. The last run is in `tests/cost/last-run.md`
