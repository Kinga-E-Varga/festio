# Current Feature: Subdomain links

## Status

Completed

## Goals

- Guest links move from `festio.eu/<slug>` to `<slug>.festio.eu`; the host app stays on
  `festio.eu`.
- `src/proxy.ts` decides by host first: on an invitation subdomain it rewrites `/` to
  `/invite/<slug>` and skips `next-intl`; on the base domain it works as now.
- On a subdomain only `/` is an invitation; `/_next/…` loads normally; any other path is not
  found.
- Path links are dropped, not redirected: the `festio.eu/<slug>` rewrite in `next.config.ts`
  and `INVITE_PATH_PATTERN` go; `festio.eu/<slug>` is not found.
- `invitationLink` (`src/lib/event.ts`) builds `<slug>.<base domain>`; share fields, event
  form and printed card follow.
- The link editor (`LinkSection.tsx`) shows `.festio.eu` after the field instead of
  `festio.eu/` before it.
- `www.festio.eu` redirects to `festio.eu`.
- Unknown subdomains show the invitation-not-found page; a blocked link whose event data was
  deleted shows "This invitation is no longer available".
- Slug rules for subdomain names: lowercase letters, digits, hyphens; no hyphen at the start
  or end (`normalizeSlug` strips them); `SLUG_MIN` 6, new `SLUG_MAX` 32; no double hyphens.
- `RESERVED_SLUGS` in `src/lib/slug.ts` becomes Festio's reserved subdomains (list below),
  not app routes.
- The base domain (`festio.eu`, `staging.festio.eu`, `localhost:3000`) comes from one
  setting per environment.

## Notes

Spec: `context/features/pending/subdomain-links.md`.

- Plan: `context/plans/subdomain-links.md`
- Simplify: ran 2026-10-25
- Decided while planning: both missing-invitation pages are built here (a guest
  not-found page, and "This invitation is no longer available" for blocked links).

**Why now:** the link is printed on cards, so the first format that goes out must keep
working forever. Nothing is printed yet.

**Hosting:** depends on the database plan (`context/features/pending/database.md`). Only
Firebase App Hosting supports wildcard subdomains. DNS (`*.festio.eu` wildcard record) and
HTTPS (wildcard domain in the App Hosting backend) are hosting setup, not code. The code
part can be built and tried locally: browsers send `*.localhost` to your own machine, so
`maria-wedding.localhost:3000` works with no setup.

**Before building:** read the Next.js proxy and rewrites docs (`has` host matching may be
an alternative to doing it in the proxy). The proxy runs before `next.config.ts`'s
rewrites, and its matcher includes `/`.

**Language:** unchanged. Guest pages never had a locale prefix; the invitation's own
`language` is read by `invite/[invite]/layout.tsx`. The host app keeps `/ro/…`, `/hu/…`.

**Reserved subdomains** (one list in `src/lib/slug.ts`):

- Festio's own: `www`, `app`, `api`, `admin`, `mail`, `email`, `smtp`, `status`, `help`,
  `support`, `docs`, `blog`, `cdn`, `static`, `assets`, `auth`, `login`, `dev`, `staging`,
  `test`, `festio`, `dashboard`, `settings`, `official`
- Accounts and money: `account`, `signin`, `signup`, `security`, `billing`, `payment`,
  `payments`, `invoice`
- the language codes

Short names stay listed even though `SLUG_MIN` rules them out, so the list holds if the
minimum ever drops. Adding a name later only blocks new links.

**Security:**

- Host login stays on the base domain: login cookies set without `Domain`, never sent to
  subdomains.
- Each invitation is its own site to the browser (e.g. the `unlock-<slug>` cookie can't be
  read by another invitation).
- Firebase Auth's allowed domains: `festio.eu` only.
- `noindex` stays on every invitation. Links are still guessable; Protected mode is the
  privacy, and the link editor still says so.

**Environments:** prod `festio.eu` + `*.festio.eu`; staging `staging.festio.eu` +
`*.staging.festio.eu` on `festio-staging` (needs its own wildcard cert); local
`localhost:3000` + `*.localhost:3000`.

**Docs to update when built:**

- `context/project-overview.md` — Security: links are `<slug>.festio.eu`; slugs clashing
  with reserved subdomains are rejected.
- `context/repo-map.md` — `slug.ts` (reserved subdomains, no pattern), `proxy.ts` (decides
  by host), `next.config.ts` (no invite rewrite).
- `context/features/pending/database.md` — the Links section points here.
