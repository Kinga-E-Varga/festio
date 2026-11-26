# Contact page

**Status: waiting for email sending** (step 6 of `database.md`). Until then, `/contact` is a
"coming soon" page, added by `database.md`'s Do later item 7 (host-side limits).

## Why

Hosts need a way to reach Festio. The first ones: an event that needs more than the largest
Guests invited (600), and an event that reached its reply limit. Later, any question.

## Goals

- **A Contact page** at `/contact` in the host app (`[locale]/contact`, in the host's
  language). It replaces the "coming soon" page; every "Contact us" link already points
  there.
- **A contact form:** email (required, so we can answer), name (optional), message
  (required, with a maximum length). React Hook Form, checked with Zod in the browser and
  on the server.
- **Signed in, the form starts filled** with the host's name and email. Anyone can use it,
  signed in or not.
- **Each message is forwarded to one email address**, Festio's, set per environment (not
  in the code). The email's Reply-To is the sender's address, so answering is just Reply.
- **Not stored in the database.** The message is sent and forgotten.
- **Spam protection:** a limit per visitor, like replies (e.g. 5 an hour, in
  `src/lib/config.ts`), counted in `rateLimits/` (a new `contact` action).
- **A privacy line under the form:** what is sent (name, email, message), to whom
  (Festio), and that it is used only to answer.
- A toast when it's sent; a friendly error when sending fails or the limit is reached.

## Notes

- **Needs email sending,** which Festio doesn't have yet. Email verification
  (`context/fixes/pending/email-verification.md`) needs it too: one email setup for both,
  ideally a provider that sends from the EU.
- The service's key goes into Secret Manager, never into the repo.
- Locally (emulators), the message is logged instead of sent, so no real email goes out.
- **Later:** phone numbers and other ways to reach us, on the same page.

## Open

- Which email service.
- The address messages go to.
- A link to the page from the landing footer and from the dashboard, and where.
