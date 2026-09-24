# Complete Action

1. In `context/current-feature.md` set **Status: Completed** — that line only, nothing
   else in the file. Delete `.superpowers/` if it exists. Then stage all changes and
   commit with a descriptive message
   (do not add Co-authored with...)
2. Switch to main and merge the feature branch (no push yet).
   **Fast-forward only, no merge commits.** If main hasn't moved since the
   branch was cut, `git merge --ff-only` will just work. If it has, rebase
   the feature branch onto main first (`git rebase main` on the feature
   branch, resolving conflicts there), then fast-forward main onto it —
   never `git merge --no-ff`.
3. Delete the local feature branch
4. Reset current-feature.md:
   - Add the feature to the start of History. History is never reset; it only grows.
   - Change H1 back to `# Current Feature`
   - Status back to `Not Started`
   - Clear Goals and Notes sections (keep placeholder comments)
   - **Leave this edit uncommitted.** It rides along with the _next_ feature's first
     commit.
5. Push main to origin ONCE (the feature commit + merge only — the
   current-feature.md reset stays uncommitted and is not part of this push)
6. If feature branch was previously pushed, delete it from origin
