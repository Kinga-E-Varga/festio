# Feature Workflow Rules

Read before branching, planning, writing tests or committing. They hold with or without
`/feature`.

## Steps

Every feature/fix, in this order. The actions in `actions/` hold the how-to for each step.

1. **Document** — the feature in @context/current-feature.md (`/feature load`).
2. **Plan** — large features only, and ask before planning (`/feature plan`).
3. **Branch** — a new branch per feature/fix, cut from `develop`: `feature/[name]`,
   `fix/[name]`, `chore/[name]` (`/feature start`).
4. **Implement** — what @context/current-feature.md describes.
5. **Test** — verify it in the browser, then run `npm test` and `npm run build` and fix any
   errors.
6. **Iterate** — change things if needed.
7. **Simplify, commit, merge into `develop`, push, close out** — `/feature complete`.
8. **Release** — only when the user asks: `main` moves up to `develop` and is pushed, which
   deploys (`/feature release`).

## Commits

- **Ask before every commit.** The only exception: running `/feature complete` is the
  permission to commit, merge and push that feature.
- Never commit until `npm test` and `npm run build` pass, and `npm run test:app` too when the
  change touches `src/db/reads/`, `src/db/secret.ts`, `src/app/`, `src/components/invitation/`, `src/templates/`, `src/modular/`, `src/lib/slug.ts`, `src/i18n/`, `messages/`, `src/proxy.ts` or `next.config.ts`. If any
  fails, fix it first.
- **No tests or build** when the change touches nothing but files outside the app:
  `.claude/`, `context/`, `.vscode/`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `.gitignore`,
  `.prettierignore`. Check `git diff --name-only develop...HEAD` and the uncommitted
  changes. `seed/` is not one of them: `npm run test:app` loads it.
- One feature/fix = one commit, with a conventional message (`feat:`, `fix:`, `chore:`, …).
- Two branches: work lands on `develop`; `main` is what's deployed. Merge into `develop`
  fast-forward only, never a merge commit — rebase onto `develop` first if needed.
- Never commit straight to `main`. It only moves by fast-forward to `develop` at a release,
  urgent fixes included.
- If the change moved a route, a top-level `src/` directory, a file in `src/lib/`, or a
  component between folders, update @context/repo-map.md (or the matching `context/map/`
  file) in the same commit. Adding a template does not count.
- The close-out edit (the history line and the reset @context/current-feature.md) is the only
  change allowed to sit uncommitted between features. It rides along with the next
  feature's commit.

## Test guards

The same agent writes the code and its tests, so:

1. **Tests come from the spec, before the code.** The plan (or, without one, the start of
   the work) lists each test and its expected values.
2. **Expected values are worked out by hand** from the spec, never by calling the code
   under test.
3. **A failing test is a finding.** Never change a test just to make it pass: stop and
   tell the user whether the code or the test is wrong.
4. **Prove the tests can fail, then get a fresh review.** Break the code on purpose once
   per new test file and see the test fail. At `/feature complete`, the `simplifier` agent
   (fresh, didn't write the code) checks each new test proves what its name says.

- **Payments, the GDPR deletion job and the security rules** also get a separate agent
  that writes their tests from the spec alone, before the code exists.
