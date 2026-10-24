import type { DbCount } from "@/db/count";
import { APP_URL } from "./global";

/** A page of the app copy as a browser gets it, redirects not followed. */
export async function page(
  path: string,
  cookie?: string,
): Promise<{ status: number; body: string; location: string | null }> {
  const answer = await fetch(`${APP_URL}${path}`, {
    redirect: "manual",
    headers: cookie ? { Cookie: cookie } : {},
  });
  return {
    status: answer.status,
    body: await answer.text(),
    location: answer.headers.get("location"),
  };
}

/** What the app copy asked of Firestore since the last take, then zero again. */
export async function appDbCount(): Promise<DbCount> {
  const answer = await fetch(`${APP_URL}/api/dev/db-count`);
  return (await answer.json()) as DbCount;
}
