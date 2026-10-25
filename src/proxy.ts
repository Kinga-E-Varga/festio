import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NO_ROUTE, siteFor, siteOrigin } from "@/lib/domain";
import { SLUG_PATTERN } from "@/lib/slug";

const intl = createMiddleware(routing);

function rewriteTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

/**
 * Decides by host first. An invitation subdomain shows its invitation at `/`
 * and nothing else, outside next-intl (its language is its own); `www` goes
 * to the base domain; the base domain is the host app as ever. A rewrite
 * here doesn't run the proxy again, so `/invite/…` typed by hand is never an
 * invitation, on any host: one would otherwise open on another's subdomain.
 */
export function proxy(request: NextRequest) {
  const site = siteFor(request.headers.get("host") ?? "");
  const { pathname, search } = request.nextUrl;
  if (site.kind === "www") {
    return NextResponse.redirect(
      new URL(`${pathname}${search}`, siteOrigin()),
      308,
    );
  }
  if (site.kind === "invite") {
    const shown = pathname === "/" && SLUG_PATTERN.test(site.slug);
    return rewriteTo(request, shown ? `/invite/${site.slug}` : NO_ROUTE);
  }
  if (pathname.startsWith("/invite/")) return rewriteTo(request, NO_ROUTE);
  return intl(request);
}

/** Every page path, `/` included: Next's own files, the API and files with an extension pass by. */
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
