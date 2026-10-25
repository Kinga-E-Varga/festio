# Subdomain hosting

The console and DNS side of subdomain links (`context/features/pending/subdomain-links.md`):
what makes `maria-wedding.festio.eu` reach the app once the code can serve it. No app code
here, only settings, records and checks.

**Needs first:**

- The subdomain links code, merged. It reads the base domain from `NEXT_PUBLIC_BASE_DOMAIN`
  (default `festio.eu`).
- An App Hosting backend in the project: `festio-staging` (database plan, step 6) for
  staging, `festio-prod` (step 12) for prod. Staging is done first and checked before prod is
  touched.

## Who does what

As in the database plan's "Working together": anything in a Google console or at the domain
registrar is the owner's, one small batch at a time, with Claude saying exactly what to
click or type. Claude writes the config files and checks each step worked before the next.

## What gets set up

### Domains in App Hosting

Each backend gets two custom domains: the host app and the wildcard for invitations.

| Backend          | Host app            | Invitations           |
| ---------------- | ------------------- | --------------------- |
| `festio-prod`    | `festio.eu`         | `*.festio.eu`         |
| `festio-staging` | `staging.festio.eu` | `*.staging.festio.eu` |

`www.festio.eu` is added to the prod backend too, so it has a certificate; the app itself
redirects it to `festio.eu`. With `*.festio.eu` in place it may already be covered; check in
the console.

A wildcard certificate covers one level only, so `*.festio.eu` does not cover
`maria.staging.festio.eu`. That's why staging has its own wildcard.

### DNS records

At the registrar, in the `festio.eu` zone. App Hosting shows the exact records for each
domain when it is added; copy them from there, never from this file.

- `festio.eu` and `www`: the records App Hosting gives.
- `*`: the wildcard, pointing at the prod backend.
- `staging` and `*.staging`: pointing at the staging backend.
- The records App Hosting asks for to prove the domain is ours and to issue the certificates
  (usually a TXT record, and for a wildcard a record under `_acme-challenge`).

Explicit records win over the wildcard, so `festio.eu`, `www`, `staging` and the mail
records (MX, SPF, DKIM) keep working. Nothing is ever added per event.

**Check before adding:** if the zone has CAA records, they must allow the certificate
authority App Hosting uses, or the certificates never issue.

### Certificates

App Hosting issues them once the DNS records are seen; this can take from minutes to a day.
Nothing to buy or renew by hand.

### The base domain setting

- **Prod:** nothing. The code's default is `festio.eu`.
- **Staging:** `NEXT_PUBLIC_BASE_DOMAIN=staging.festio.eu` in staging's App Hosting settings
  file (`apphosting.staging.yaml` or whatever the database plan names it). It is written
  into the browser code when the app is built, so it must be available at **build** time,
  not only at runtime.

### Firebase Auth's allowed domains

In each project's Auth settings (Authorized domains), only the host app's domain:

- `festio-prod`: `festio.eu`
- `festio-staging`: `staging.festio.eu`

Firebase's own defaults (`localhost`, the project's `firebaseapp.com` and `web.app`) can
stay. Invitation subdomains are never added: nobody signs in on them.

## Checks once it's live

Staging first, then the same on prod.

1. `https://staging.festio.eu` opens the host app; sign in works (email and Google).
2. `https://maria-andrei.staging.festio.eu` (or any staging event) opens its invitation with
   a valid certificate, styles and scripts loading.
3. An unknown name (`https://nobody-has-this.staging.festio.eu`) shows the invitation
   not-found page, not a certificate or DNS error.
4. **The app sees the real host name.** The proxy decides by the `Host` header; App Hosting
   runs on Cloud Run, which should pass it through unchanged. If an invitation subdomain
   shows the host app instead, this is why. Then log the request's `host` and
   `x-forwarded-host` once: if the real name arrives only in `X-Forwarded-Host`, `siteFor`
   in `src/proxy.ts` reads `x-forwarded-host ?? host` (safe: a faked header only shows
   the sender a public page).
5. A Protected invitation unlocks, and a guest reply sends (both are Server Actions through
   the rewrite).
6. The browser's dev tools: the login cookie on `staging.festio.eu` has no `Domain`, and is
   not sent to an invitation subdomain.
7. An invitation answers with `noindex`.
8. Prod only: `https://www.festio.eu` redirects to `https://festio.eu`; mail to `@festio.eu`
   still arrives.

## Open

- Where `festio.eu` is registered and who can edit its DNS.
- Whether `festio.eu` already has mail (MX) or other records to keep.
- Whether the registrar supports wildcard records and the `_acme-challenge` record App
  Hosting asks for. Most do; if not, the DNS moves to one that does (e.g. Cloudflare, DNS
  only, no proxying).

## Docs to update when done

- `context/features/pending/database.md`: Links, and step 10 of Order, says the hosting
  side is done.
