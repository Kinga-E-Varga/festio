# Current Feature: festio-staging (database step 6, part 2)

## Status

Completed

## Goals

From `context/features/pending/database.md`, Order step 6, what's left of it: the first
real Firebase project, set up with the owner, and the checks only a real project can
answer. Part 1 (rules, rules tests, live updates for hosts) is built: `ac4294f`.

**C. The `festio-staging` project** (handoffs: the owner's Google account)

- Owner: create the project, Blaze, a budget alert (5 €), Firestore and Storage in
  **`europe-west4`** (can never change: name the exact option first), email/password and
  Google sign-in on, a web app registered (its public config pasted), `! firebase login`.
- Rules, indexes and the `rateLimits` TTL policy deployed
  (`firebase deploy --only firestore:rules,firestore:indexes,storage`). Storage rules read
  Firestore: accept when the deploy asks to give the Storage service agent Firestore
  access, or every upload is refused.
- `.firebaserc`: alias `staging` (default stays `demo-festio`).
- App Hosting backend in `europe-west4`, linked to GitHub, **automatic rollouts off**,
  rollouts started by hand from this branch. `apphosting.yaml` (shared:
  `NEXT_PUBLIC_FIREBASE_*`, `FESTIO_SECRET` from Secret Manager) and
  `apphosting.staging.yaml` (`NEXT_PUBLIC_BASE_DOMAIN` = the backend's `hosted.app`
  domain). Read App Hosting's config docs first for the exact keys.
- `FESTIO_SECRET` into Secret Manager without it ever appearing in the chat (the owner
  pipes a random value into `firebase apphosting:secrets:set … --data-file -`).
- The backend's service account gets **Service Account Token Creator**, so the server can
  make the browser's custom token (`firebaseToken`) with no key file.
- The backend's domain added to Auth's authorized domains.
- Check: the landing page and sign-up work at the backend URL; the dashboard's Firestore
  listener connects (Network panel).

**D. Checks only the real project answers**

- Google sign-in on a password account shows the "sign in with your password" message
  (`passwordAccount` in `AuthForm.tsx`); otherwise a fix on this branch.
- The login check's cost: time `verifySessionCookie(…, true)` in `loadHostId`
  (`src/db/reads/session.ts`) over ~20 dashboard loads; under 100 ms keep, over: a
  follow-up in `database.md`. Remove the timing log.
- Rate limits' IP: a temporary route answering the raw `x-forwarded-for` only with
  `FESTIO_DEBUG_IP=true`; `curl -H "x-forwarded-for: 1.2.3.4"`; the last entry must be the
  caller's real IP (`visitorKey`, `src/db/reads/visitor.ts`), else fix `visitorKey`.
  Remove the route and the variable before the commit.
- Whether a request the rules refuse is billed: note the answer in `database.md`.
- Firestore's `europe-west4` prices (owner reads them from the console) into `PRICES` in
  `tests/cost/month.ts`; `npm run cost` (accept with `COST_UPDATE=1` if only the month line
  moves).

## Notes

- Plan: `context/plans/festio-staging-rules-and-live-updates.md` → **Phase 2 only**
  (Tasks 7–11). Phase 1 there is done (`ac4294f`); don't redo it.
- Branch: `chore/festio-staging`, cut from `develop`.
- **Handoffs** (database.md → Working together): "Your turn:" with a short numbered list,
  one small batch at a time, saying exactly what to click or type; wait for the owner's
  reply and check it before going on. Interactive logins as `! <command>`. Before giving a
  CLI command with flags, check it with `--help` on the installed CLI (firebase-tools 15).
- Never put secrets in the repo or the chat; no service-account key files.
- Guest invitation pages won't open on staging: they need the wildcard domain (step 10).
  Everything on the host side should work.
- Costs to keep in mind (from part 1): each signed-in Storage request reads the event card
  (one billed read); a guest list page load reads every reply twice.
- Not in this feature: email verification, its own fix after it
  (`context/fixes/pending/email-verification.md`).
- At `/feature complete`: mark step 6 done in `database.md`, with any follow-ups found in
  part D written there.
- Simplify: ran 2026-11-27
- Close-out: switch the staging backend's live branch to `develop` once this branch is
  merged and deleted.

## Findings (part D)

- **Google on a password account (2026-11-27):** a Gmail password account with an
  unverified email, then "Continue with Google": Firebase let Google in, removed the
  password (same uid, data kept), marked the email verified. `passwordAccount` never
  showed. Firebase's own rule (Google is trusted for Gmail), not a Festio bug; no fix here.
  Follow-up for `email-verification.md`: once verified, Google should be linked and the
  password kept, check it; the old password now fails as "wrong email or password" with no
  hint. The owner wants purchases and sensitive steps to need a verified email.
- **Login check's cost (2026-11-27):** `verifySessionCookie(…, true)` in `loadHostId`, 21
  dashboard loads on staging: median 161 ms (154–169 warm, 329 cold). Over 100 ms:
  follow-up for `database.md`. The `true` (revocation check) calls Firebase Auth over the
  network on every page; without it the cookie is checked locally. Idea: check revocation
  only on saves and sensitive steps, or remember it per uid for a minute. Timing log removed.
- **Rate limits' IP (2026-11-27):** on App Hosting the last `x-forwarded-for` entry is a
  Google proxy (a different one per request), not the caller. App Hosting's
  `x-fah-client-ip` holds the caller and overwrites a forged one; `x-real-ip` passes forged
  values through. Fixed: `clientIp` (`src/lib/client-ip.ts`), tests in
  `tests/lib/client-ip.test.ts`.
- **Free tier (2026-11-27):** the console suggested the database ID `default` (no
  brackets): a named database the SDKs don't find (`DEFAULT_DATABASE_ID = '(default)'`).
  The free tier goes to the first database created while no free one exists, whatever its
  name ("If the database with the free tier applied is deleted, the next database created
  will receive the free tier", Firestore quotas page). `(default)` was recreated after
  deleting the other: `freeTier: true`. For production: create `(default)` with the CLI
  (`firestore:databases:create "(default)" --location europe-west4`), as the first
  database, and check `freeTier`.
- **Refused reads billed? (2026-11-27):** 50 anonymous `GetDocument`s on a `users` card,
  all 403. Monitoring: `api/request_count` PERMISSION_DENIED +50, `document/read_ops_count`
  +0 from them (its rise matched the dashboard's own reads). So not billed as reads, by
  Google's counter; the billing report confirms after a day.
- Debug route and `FESTIO_DEBUG_IP` removed. Staging still runs the build with them (the
  route answers only with the variable on) until the next rollout.
