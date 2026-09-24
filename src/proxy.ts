import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export const proxy = createMiddleware(routing)

/**
 * Explicit allowlist, not a catch-all: guest invite links (any top-level
 * slug that isn't in `RESERVED_SLUGS`, rewritten to `/invite/[invite]` by
 * `next.config.ts`) must never be rewritten to a locale prefix, so only the
 * known host-app routes are listed here.
 */
export const config = {
  matcher: [
    '/',
    '/(ro|hu)',
    '/(ro|hu)/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/invitations/:path*',
    '/templates/:path*',
    '/prints/:path*',
  ],
}
