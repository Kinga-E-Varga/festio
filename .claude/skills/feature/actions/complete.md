# Complete Action

Running this action is the user's permission to commit, merge and push this feature. Follow
the Commits rules in `context/ai-interaction.md`.

1. **Simplify.** If Notes in `context/current-feature.md` has a `- Simplify: ran [date]`
   line, don't run it again: ask "Simplify already ran on [date]. Commit now, or simplify
   again?" and go on as answered. Otherwise:
   - Run the `simplify` skill on the branch's changes against main.
   - Add `- Simplify: ran [today's date]` to Notes.
   - Check the Goals in `context/current-feature.md` against the branch's changes.
   - If it found nothing and every goal is met, go straight to step 2.
   - If it applied or skipped anything, or a goal looks unmet, run `npm run build` (fix any errors), then stop and
     report in plain lines, numbered: what it applied, and what it found but didn't apply
     (with why), then `Goals: all met` or the goals that look missing. Ask the user to check in the browser and answer `ok`, `do [n]`,
     `undo [n]` or anything else. Act on the answer, building again after any change,
     until the user says `ok`.
2. Run `npm test`, and `npm run build` unless step 1 already built with no change since. If either
   fails, stop and fix it before going on. In `context/current-feature.md` set **Status: Completed** — that line only, nothing
   else in the file. Delete `.superpowers/` if it exists. If the change moved a route, a
   top-level `src/` directory, a file in `src/lib/`, or a component between folders, update
   `context/repo-map.md` (or the matching `context/map/` file). Then stage all changes and
   commit.
3. Switch to main and merge the feature branch (no push yet). If main hasn't moved since the
   branch was cut, `git merge --ff-only` will just work. If it has, rebase the feature branch
   onto main first (`git rebase main` on the feature branch, resolving conflicts there), then
   fast-forward main onto it — never `git merge --no-ff`.
4. Delete the local feature branch.
5. Add the feature to the top of `context/history.md` (one line; never remove entries) — only
   if it changed the product (features, fixes, refactors). Changes to skills, agents, context
   files or dev tooling stay out.
6. Reset current-feature.md:
   - Change H1 back to `# Current Feature`
   - Status back to `Not Started`
   - Clear Goals and Notes sections (keep placeholder comments)
   - **Leave this edit and the history line uncommitted.**
7. Push main to origin once — the feature commit only; the history line and the reset are not
   part of it.
8. If the feature branch was previously pushed, delete it from origin.
