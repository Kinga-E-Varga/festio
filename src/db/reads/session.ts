import { cache } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getLocale } from "next-intl/server";
import { auth } from "@/db/admin";
import { redirect } from "@/i18n/navigation";

/** The signed-in host's Firebase session cookie; the one name Firebase hosting forwards. */
export const SESSION_COOKIE = "__session";

/** How Festio's own cookies are set: never read by page scripts, sent only over HTTPS outside dev. */
export const PRIVATE_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax",
  path: "/",
} as const;

/** Firebase's advice: only trust a sign-in made in the last few minutes, never an old token. */
export const FRESH_SIGN_IN_SECONDS = 5 * 60;

/**
 * The signed-in host's uid, or null: no cookie, or one that is expired,
 * revoked or not Firebase's. Checked once per request.
 */
export const loadHostId = cache(async (): Promise<string | null> => {
  await connection();
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    return (await auth.verifySessionCookie(value, true)).uid;
  } catch {
    return null;
  }
});

/** The signed-in host's uid; signed out, the page goes to sign-in instead. */
export async function requireHostId(): Promise<string> {
  const uid = await loadHostId();
  return uid ?? redirect({ href: "/sign-in", locale: await getLocale() });
}

/**
 * Whether the host just proved it's them again (password or Google, in the
 * browser): the token is valid, it's the signed-in host's, and fresh.
 */
export async function freshSignIn(idToken: string): Promise<boolean> {
  const uid = await loadHostId();
  if (!uid) return false;
  try {
    const decoded = await auth.verifyIdToken(idToken, true);
    return (
      decoded.uid === uid &&
      Date.now() / 1000 - decoded.auth_time <= FRESH_SIGN_IN_SECONDS
    );
  } catch {
    return false;
  }
}
