# Subdomain links

Guest links move from `festio.eu/maria-wedding` to `maria-wedding.festio.eu`, as RSVPify
does. The host app stays on `festio.eu`.

Decide and build before launch: the link is printed on cards, so the first format that
goes out has to keep working forever. Nothing is printed yet, so switching now is free.

Hosting depends on the database plan (`context/features/database.md`): only Firebase App
Hosting supports wildcard subdomains, classic Firebase Hosting doesn't. The code part can be
built and tried locally before any hosting exists.

## How it works

1. **DNS:** one wildcard record, `*.festio.eu`, pointing at the App Hosting backend. Every
   subdomain reaches the same app; nothing is added per event.
2. **HTTPS:** `*.festio.eu` is added as a domain in the App Hosting backend's settings, and
   App Hosting issues one certificate that covers every subdomain.
3. **Routing:** the app reads the host name. `maria-wedding.festio.eu/` shows the invitation
   (today's `invite/[invite]` page); `festio.eu` is the host app as now.

Explicit records (`festio.eu`, `www`, mail's MX) still win over the wildcard, so email and
the main site are unaffected.

## What changes in the app

- **The proxy decides by host first.** `src/proxy.ts` runs before `next.config.ts`'s
  rewrites, and its matcher includes `/`, so on a subdomain it would send guests through
  `next-intl`'s locale handling. It checks the host first: on an invitation subdomain it
  rewrites `/` to `/invite/<slug>` and skips `next-intl`; on `festio.eu` it works as now.
  Check the Next.js proxy and rewrites docs before building (`has` host matching may be an
  alternative).
- **Only `/` is an invitation.** Next.js's own files (`/_next/…`) load normally on the
  subdomain. Any other path on a subdomain (`maria-wedding.festio.eu/dashboard`) is not
  found.
- **Path links are dropped, not redirected.** Only mock invitations ever used them. The
  `festio.eu/<slug>` rewrite in `next.config.ts` and `INVITE_PATH_PATTERN` are removed, and
  `festio.eu/<slug>` is simply not found.
- **`invitationLink`** (`src/lib/event.ts`) builds `<slug>.festio.eu`. The share fields,
  the event form and the printed card all use it, so they follow.
- **The link editor** (`LinkSection.tsx`) shows `.festio.eu` after the field instead of
  `festio.eu/` before it.
- **`www.festio.eu`** redirects to `festio.eu`.
- **Language works as now.** Guest pages never had a language prefix: an invitation's
  language is its own (`language` on the event), read by `invite/[invite]/layout.tsx`, not
  by `next-intl`. The host app keeps `festio.eu/ro/…` and `festio.eu/hu/…`.
- **Unknown subdomains** (a typo, a slug nobody has) show the invitation-not-found page. A
  link still blocked after its event's data was deleted shows "This invitation is no longer
  available".

## Slug rules

A slug is now a subdomain name, so it must be a valid one:

- Lowercase letters, digits and hyphens (as now). DNS ignores case; slugs are already
  lowercased.
- **No hyphen at the start or end** (new). `normalizeSlug` strips them.
- **At least 6 characters** (`SLUG_MIN`, as now) and at most 32 (`SLUG_MAX`), well inside
  DNS's 63.
- No double hyphens (as now), which also keeps out `xn--` names, which DNS reserves.

**`RESERVED_SLUGS` becomes the subdomains Festio keeps for itself,** not app routes: once
invitations leave the path, a slug can no longer clash with `/dashboard`. A name goes on it
when Festio may need it (a status page, a help centre) or when it would look official and
could be used to fool guests (`account`, `billing`). One list, in `src/lib/slug.ts`:

- **Festio's own:** `www`, `app`, `api`, `admin`, `mail`, `email`, `smtp`, `status`,
  `help`, `support`, `docs`, `blog`, `cdn`, `static`, `assets`, `auth`, `login`, `dev`,
  `staging`, `test`, `festio`, `dashboard`, `settings`, `official`
- **Accounts and money:** `account`, `signin`, `signup`, `security`, `billing`, `payment`,
  `payments`, `invoice`
- the language codes

Slugs are at least 6 characters (`SLUG_MIN`), so the shorter names are impossible anyway.
They stay listed so the list is still right if the minimum ever drops. Adding a name later
only blocks new links, never ones already taken.

## Security

- **The host login stays on `festio.eu` only.** Any login cookie is set without a
  `Domain`, so it's never sent to `*.festio.eu`. An invitation page can never see a host's
  login.
- **Each invitation is its own site** to the browser: what one invitation stores (a
  Protected invitation remembering its password was typed) can't be read by another.
- **Firebase Auth's allowed domains** list `festio.eu` only; invitation subdomains never
  sign anyone in.
- `noindex` stays on every invitation.
- Links are still guessable; Protected mode is still the privacy, and the link editor
  still says so.

## Environments

- **Prod:** `festio.eu` (host app) and `*.festio.eu` (invitations).
- **Dev:** `dev.festio.eu` and `*.dev.festio.eu` on the dev backend. A `*.festio.eu`
  certificate covers one level only, so dev needs its own wildcard. `dev` is reserved, so
  no host can take it.
- **Local:** browsers send `*.localhost` to your own machine, so
  `maria-wedding.localhost:3000` works with no setup. The app reads the base domain
  (`festio.eu`, `dev.festio.eu`, `localhost:3000`) from one setting per environment.

## Docs to update when built

- `context/project-overview.md` — Security: links are `<slug>.festio.eu`; slugs that clash
  with Festio's reserved subdomains are rejected.
- `context/repo-map.md` — `slug.ts` (reserved subdomains, no pattern), `proxy.ts` (decides
  by host), `next.config.ts` (no invite rewrite).
- `context/features/database.md` — the Links section points here.
