# Tests — `tests/`

The regression, page and cost tests in `tests/`. Part of `context/repo-map.md`.

Vitest, run with `npm test`. It starts its own Firestore emulator (`firebase.test.json`, its own port and `demo-…-test` project), so it never touches the dev emulators or their seed; Auth and Storage point where nothing listens. `vitest.config.mts` sets the test env, including the server's clock (`TZ`, New York, never an event's zone). Vitest 4, not 5: 5 needs `@types/node` 22 or later, the project is on 20.

- `setup/global.ts` — refuses anything but the test emulator, then empties it once.
- `helpers/events.ts` — `createEvent` (each test makes its own event with fresh IDs; tests don't use the dev seed), `guestInput`, `newVisitor`, `storedCounts`, `recount`, `refusedWith`.
- `lib/` — plain functions, no emulator. `writes/` — the saves in `src/db/writes/`, called directly. `reads/` — the reads that run without Next (`src/db/reads/feed.ts`), and the slug lookup with `next/server` and the session stubbed (`slug-link.test.ts`).
- `setup/config.ts` — the env both Vitest configs share.
- `app/` — `npm run test:app` (`vitest.app.config.mts`): `global.ts` seeds the test emulator with the dev seed, builds a second copy of the app into `.next-test` and starts it on `localhost:3100` (never `127.0.0.1`: Next would send every proxy rewrite back to itself over HTTP), base domain `festio.test:3100` (`APP_BASE`), counting reads; `session.ts` (`hostCookie` — a real session from the test Auth emulator, `SEED_HOST`, `OTHER_HOST`), `fetch.ts` (`page` — on a given `Host`, through `node:http`, as `fetch` drops it; `guestPage`, `inviteHost`, `action`, `appDbCount`), `access.test.ts` (who sees what), `links.test.ts` (subdomain routing, the 404 and no-longer-available pages). A guest page carries its whole message catalog, so `mentions` can't tell a message is shown: check the rendered element.
- `cost/` — `npm run cost`: `measure.test.ts` (every page and save against `baseline.json`; the table in `last-run.md`, git-ignored), `report.ts` (`compare`, `table`), `month.ts` (`USE` — a month's habits, `PRICES`, `month`). `report` and `month` have plain tests in `npm test`.
