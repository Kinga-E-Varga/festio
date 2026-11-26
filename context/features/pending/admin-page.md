# Admin page

**Status: idea, not ready to load.** Best built once Festio runs on Google (after step 6 of
`database.md`), when there are real hosts to watch.

## Why

Festio's limits (reply cap, rate limits, the host save limit from `database.md`'s Do later
item 7) stop misuse, but nobody hears about it. The owner wants one private page for
everything about running Festio: stats, warnings of possible misuse, and later acting on
them.

## Goals

- **A private admin page**, on the host app (e.g. `festio.eu/admin`), for the owner only.
  Hosts never see it or know it exists.
- **Stats:** e.g. new hosts, events created, events by package, replies, per day or week.
  Exact list decided when it's built.
- **A list of flags:** every sign of possible misuse, newest first: what happened, which
  host and event, when, how often. Nothing is lost; the owner looks when they like.
- **Email for the strong signs only** (or one summary a day), so warnings don't become
  noise that gets ignored.
- **Each sign can be tuned later:** show on the page / also email / ignore, once it's clear
  which ones matter.

### Signs to flag, to start with

Start broad: it's not yet known what normal looks like.

| Sign                                                 | To start with  |
| ---------------------------------------------------- | -------------- |
| A host reaches the save limit (150 an hour)          | Email          |
| A host refused at the reply cap (more so if repeated)| Page           |
| A guest form pauses (more so soon after going Public)| Page           |
| Many wrong passwords on a Protected invitation       | Page           |
| A visitor hits the reply limit (5 an hour)           | Page           |
| Many new accounts in a short time                    | Email          |
| Many events from one account                         | Page           |

## Later

- **Blocking a host:** turn an account off (sign-in refused, sessions ended with
  `revokeRefreshTokens`), its invitations hidden. Unblocking too.
- Answering contact messages from here (`contact-page.md`), if email alone isn't enough.

## Notes

- **Who is admin:** a Firebase Auth custom claim on the owner's account (`admin: true`),
  set once by a script, checked by the server on every admin page and action. No admin
  list in the database, no admin button anywhere in the host app.
- **Flags need storing** so the page can list them: a new collection (e.g. `flags/`). A new
  card shape, so it's decided when this is built. The places that hit a limit write one
  flag; the email goes from there.
- **GDPR:** flags hold IDs (host, event), the sign and the time, never guest names or
  replies, and no real IPs (hashed, as in `rateLimits/`). Flags are deleted after a set
  time (a number in `src/lib/config.ts`). The privacy notice mentions misuse checks.
- The email needs email sending, shared with `contact-page.md` and email verification.
- Google Cloud's log-based alerts are a free fallback for the email part if wanted early.

## Open

- The stats to show.
- The thresholds: how many is "many" (wrong passwords, new accounts, events per account).
- How long flags are kept.
- Email right away or one summary a day.
