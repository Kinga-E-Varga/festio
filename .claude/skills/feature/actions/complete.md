# Complete Action

1. Stage all changes and commit with a descriptive message (do not add Co-authored with...)
2. Switch to main and merge the feature branch (no push yet).
   **Fast-forward only, no merge commits.** If main hasn't moved since the
   branch was cut, `git merge --ff-only` will just work. If it has, rebase
   the feature branch onto main first (`git rebase main` on the feature
   branch, resolving conflicts there), then fast-forward main onto it —
   never `git merge --no-ff`.
3. Delete the local feature branch
4. Reset current-feature.md:
   - Change H1 back to `# Current Feature`
   - Clear Goals and Notes sections (keep placeholder comments)
   - Add feature to the END of History
   - **Leave this edit uncommitted.** It cannot honestly claim the feature is
     Completed until the merge above already happened, so it can't live
     inside the commit that does the merging, and it isn't a commit of its
     own either. It rides along with the *next* feature's first commit. See
     `context/ai-interaction.md` step 10.
5. Push main to origin ONCE (the feature commit + merge only — the
   current-feature.md reset stays uncommitted and is not part of this push)
6. If feature branch was previously pushed, delete it from origin
