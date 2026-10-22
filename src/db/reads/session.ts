import { cache } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getLocale } from "next-intl/server";
import { auth } from "@/db/admin";
import { redirect } from "@/i18n/navigation";

/** The signed-in host's Firebase session cookie; the one name Firebase hosting forwards. */
export const SESSION_COOKIE = "__session";

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
