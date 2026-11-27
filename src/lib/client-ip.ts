/**
 * The caller's IP, for the rate limits. App Hosting's `x-fah-client-ip`, which
 * it writes over the caller's own (its Cloud Run URL refuses direct calls);
 * elsewhere (local dev) the last `x-forwarded-for` entry. Never `x-real-ip`.
 */
export function clientIp(headers: Headers): string {
  const appHosting = headers.get("x-fah-client-ip");
  if (appHosting) return appHosting;
  const forwarded = headers.get("x-forwarded-for");
  return forwarded?.split(",").at(-1)?.trim() || "unknown";
}
