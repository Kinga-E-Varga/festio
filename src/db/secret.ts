import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * The server's own secret signs what a visitor holds (the unlocked-password
 * cookie) and scrambles what is stored about them (their IP), so neither can
 * be made or reversed without it. Dev uses a dummy one (`.env.development`);
 * the real one lives in Secret Manager. No Next or React here: writes use it.
 */

function secret(): string {
  const value = process.env.FESTIO_SECRET;
  if (!value) throw new Error("FESTIO_SECRET is not set");
  return value;
}

/** A value signed with the server's secret: the same value, the same result. */
export function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

/** Whether two signed values match, without telling how close a wrong one came. */
function sameSigned(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

/**
 * What a visitor's browser keeps once it typed a Protected invitation's
 * password. Built from the password, so a new password locks everyone out.
 */
export function unlockToken(eventId: string, password: string): string {
  return sign(`unlock:${eventId}:${password}`);
}

/** Whether what a browser holds opens the event as its password stands now. */
export function unlockMatches(
  held: string | undefined,
  eventId: string,
  password: string | undefined,
): boolean {
  return Boolean(
    held && password && sameSigned(held, unlockToken(eventId, password)),
  );
}
