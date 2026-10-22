# Email verification

Found while building database step 3 (Auth). Not built yet.

## The problem

Festio never verifies the email of a host who signs up with a password. Firebase treats
Google as a trusted source for an email address, so when such a host later clicks "Continue
with Google" on the same email:

- they still reach the same account (same uid, same events), **but**
- Firebase removes their password. Their next password sign-in fails with "That email and
  password don't match", and they don't know why.

With a **verified** email, Firebase adds Google to the account instead and keeps the
password. Seen on the seed host before the seed marked her email verified.

Verifying also proves the host owns the address that Festio's emails (and the DPA) go to.

## Goals

- **Sign-up sends a verification email.** Right after a password sign-up, Firebase sends
  a link (`sendEmailVerification`), in the host's app language (`auth.languageCode`).
- **Google sign-ups need nothing.** Google's emails count as verified already.
- **A reminder until verified.** The dashboard shows a banner, "Check your inbox to confirm
  your email", with a **Resend** button. It goes away once the email is verified.
- **Resend is limited.** Firebase already rate-limits it; the button waits a minute
  between sends and says when it sent.
- **Clicking the link verifies the email** and opens a Festio page that says so, then
  goes to the dashboard (or sign-in if signed out).
- **The server sees the new state.** The session cookie holds `email_verified` as it was
  at sign-in, so the server reads the current value from the Auth user, not the cookie, or
  the session is refreshed after verifying.
- **Works on the emulator.** The emulator doesn't send email; it prints the link in its
  log and the Emulator UI. The verify page must work with that link too.

## Not in scope

- Blocking anything for unverified hosts. For now they can do everything; see Open.
- Changing the email address.

## Related, found at the same time

- **No "Forgot password?" yet.** A host whose password was already removed by a Google
  sign-in, or who simply forgot it, has no way back except Google. Password reset
  (`sendPasswordResetEmail`) uses the same email action page, so it may be worth building
  together.

## Open — ask, don't assume

- Must a host verify before anything: paying, making an invitation Public, or not at all?
- The verify page: Firebase's default hosted page, or Festio's own (`/verify`, a reserved
  slug), which looks like the app and speaks the host's language?
- The email's wording and sender name (Firebase's templates, set per project in the
  console, step 6).
- Existing password accounts (only test ones today): ask them to verify on next sign-in?
