# Complete Action

Running this action is the user's permission to commit, merge and push this feature to
`develop`. It never touches `main`: that's `release`. Follow
the Commits rules in `.claude/skills/feature/rules.md`.

1. **Simplify.** If Notes in `context/current-feature.md` has a `- Simplify: ran [date]`
   line, don't run it again: ask "Simplify already ran on [date]. Commit now, or simplify
   again?" and go on as answered. Otherwise:
   - **Size and risk check.** Run `git diff --stat develop...HEAD` (plus the uncommitted
     changes). If it is over 400 changed lines or 15 files, or touches a risky path —
     `firestore.rules`, `storage.rules`, `src/db/secret.ts`, `src/db/reads/session.ts`,
     `access.ts` or `unlock.ts`, `src/actions/auth.ts`, `src/actions/guest.ts`,
     `src/lib/reauth.ts`, `src/db/writes/guest-reply.ts`, `rate-limit.ts`, `slugs.ts` or
     `delete-event.ts`, `src/lib/config.ts`, `src/proxy.ts`, `next.config.ts`, or anything
     about payments — stop and say which, then ask: "Run the built-in `/simplify` (big
     diff) / `/code-review` (risky path) as well, or only the usual check?" Go on as
     answered.
   - **The usual check.** Under 50 changed lines with no new tests: review the diff
     yourself against the `simplifier` agent's checklist. Otherwise run the `simplifier`
     agent. It only reports: you check each finding against the code, apply what holds,
     and list the rest as skipped, with why.
   - Add `- Simplify: ran [today's date]` to Notes.
   - Check the Goals in `context/current-feature.md` against the branch's changes.
   - If it found nothing and every goal is met, go straight to step 2.
   - If it applied or skipped anything, or a goal looks unmet, run `npm run build` (fix any errors), then stop and
     report in plain lines, numbered: what it applied, and what it found but didn't apply
     (with why), then `Goals: all met` or the goals that look missing. Ask the user to check in the browser and answer `ok`, `do [n]`,
     `undo [n]` or anything else. Act on the answer, building again after any change,
     until the user replies with just `ok`.
2. Unless the Commits rules exempt the change (nothing outside the app changed), run
   `npm test`, and `npm run build` unless step 1 already built with no change since. Also
   run `npm run test:app` when the Commits rules call for it
   (check `git diff --name-only develop...HEAD` and the uncommitted changes against its list).
   If any fails, stop and fix it before going on. In `context/current-feature.md` set **Status: Completed** — that line only, nothing
   else in the file. Delete `.superpowers/` if it exists. If the change moved a route, a
   top-level `src/` directory, a file in `src/lib/`, or a component between folders, update
   `context/repo-map.md` (or the matching `context/map/` file). Then stage all changes and
   commit.
3. Switch to develop and merge the feature branch (no push yet). If develop hasn't moved
   since the branch was cut, `git merge --ff-only` will just work. If it has, rebase the
   feature branch onto develop first (`git rebase develop` on the feature branch, resolving
   conflicts there), then fast-forward develop onto it — never `git merge --no-ff`.
4. Delete the local feature branch.
5. Add the feature to the top of `context/history.md` (one line; never remove entries; read
   only its first 10 lines, never the whole file) — only
   if it changed the product (features, fixes, refactors). Changes to skills, agents, context
   files or dev tooling stay out.
6. Reset current-feature.md:
   - Change H1 back to `# Current Feature`
   - Status back to `Not Started`
   - Clear Goals and Notes sections (keep placeholder comments)
   - **Leave this edit and the history line uncommitted.**
7. Push develop to origin once — the feature commit only; the history line and the reset are not
   part of it.
8. If the feature branch was previously pushed, delete it from origin.
