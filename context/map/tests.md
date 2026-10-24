# Tests — `tests/`

The regression, page and cost tests in `tests/`. Part of `context/repo-map.md`.

Vitest, run with `npm test`. It starts its own Firestore emulator (`firebase.test.json`, its own port and `demo-…-test` project), so it never touches the dev emulators or their seed; Auth and Storage point where nothing listens. `vitest.config.mts` sets the test env, including the server's clock (`TZ`, New York, never an event's zone). Vitest 4, not 5: 5 needs `@types/node` 22 or later, the project is on 20.

- `setup/global.ts` — refuses anything but the test emulator, then empties it once.
- `helpers/events.ts` — `createEvent` (each test makes its own event with fresh IDs; tests don't use the dev seed), `guestInput`, `newVisitor`, `storedCounts`, `recount`, `refusedWith`.
- `lib/` — plain functions, no emulator. `writes/` — the saves in `src/db/writes/`, called directly. `reads/` — the reads that run without Next (`src/db/reads/feed.ts`).
- `setup/config.ts` — the env both Vitest configs share.
- `app/` — `npm run test:app` (`vitest.app.config.mts`): `global.ts` seeds the test emulator with the dev seed, builds a second copy of the app into `.next-test` and starts it on port 3100, counting reads; `session.ts` (`hostCookie` — a real session from the test Auth emulator, `SEED_HOST`, `OTHER_HOST`), `fetch.ts` (`page`, `appDbCount`, `mentions` — text in a page in any of its written forms), `access.test.ts` (who sees what).
- `cost/` — `npm run cost`: `measure.test.ts` (every page and save against `baseline.json`; the table in `last-run.md`, git-ignored), `report.ts` (`compare`, `table`), `month.ts` (`USE` — a month's habits, `PRICES`, `month`). `report` and `month` have plain tests in `npm test`.
