# Release Action

Moves `main` up to `develop` and pushes it. `main` is what's deployed, so this deploys.
Running this action is the user's permission to push `main`. Never run it on your own.

1. Check: on `develop`, nothing uncommitted except the close-out edit (the history line and
   the reset `context/current-feature.md`), and `develop` is pushed (`git status` shows it up
   to date with `origin/develop`). If not, stop and say what's off.
2. Show what's going out: `git log --oneline main..develop`. If it's empty, say there's
   nothing to release and stop.
3. Run `npm test` and `npm run build`. If either fails, stop and fix it on a `fix/` branch
   first (the normal flow), never on `main`.
4. `git switch main`, `git merge --ff-only develop`. If it isn't a fast-forward, someone
   committed straight to `main`: stop and ask, never force.
5. Push `main` to origin, then `git switch develop`.
