/**
 * Where the app lives: the host app on the base domain, each invitation on
 * its own subdomain (`maria-wedding.festio.eu`). One setting per environment
 * (`festio.eu`, `staging.festio.eu`, `localhost:3000`); prod needs none.
 */
export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "festio.eu";

export type Site =
  { kind: "app" } | { kind: "www" } | { kind: "invite"; slug: string };

/**
 * The host name as the base domain writes it: lowercase, no trailing dot
 * (`festio.eu.` is the same name), and no port unless the base has one
 * (`festio.eu:443`).
 */
function plainHost(host: string, base: string): string {
  const name = host.toLowerCase();
  const bare = base.includes(":") ? name : name.replace(/:\d+$/, "");
  return bare.replace(/\.$/, "");
}

/**
 * What a request's host name asks for. Everything before `.<base>` is the
 * slug, dots and all: the guest page refuses what isn't one. Any other host
 * (a phone on the dev server's Wi-Fi address) is the host app.
 */
export function siteFor(host: string, base = BASE_DOMAIN): Site {
  const name = plainHost(host, base);
  if (name === `www.${base}`) return { kind: "www" };
  if (name.endsWith(`.${base}`)) {
    return { kind: "invite", slug: name.slice(0, -base.length - 1) };
  }
  return { kind: "app" };
}

/** The base domain's address, or one subdomain's; plain http only on localhost. */
export function siteOrigin(subdomain?: string, base = BASE_DOMAIN): string {
  const protocol = base.startsWith("localhost") ? "http:" : "https:";
  return `${protocol}//${subdomain ? `${subdomain}.` : ""}${base}`;
}

/**
 * An address no route matches, so Next answers with the 404 page
 * (`app/global-not-found.tsx`), by host. Where the proxy and `next.config.ts`
 * send what can only be missing. No path aliases in this file:
 * `next.config.ts` reads it.
 */
export const NO_ROUTE = "/invite/_/_";
