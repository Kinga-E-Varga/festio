import { cookies } from "next/headers";
import { unlockMatches } from "@/db/secret";

/** The cookie that keeps a Protected invitation open in this browser, one per link. */
export function unlockCookie(slug: string): string {
  return `unlock-${slug}`;
}

/** What this browser holds for the link, if anything. */
export async function readUnlock(slug: string): Promise<string | undefined> {
  return (await cookies()).get(unlockCookie(slug))?.value;
}

/** Whether this browser typed the event's current password. */
export async function isUnlocked(event: {
  id: string;
  slug: string;
  password?: string;
}): Promise<boolean> {
  return unlockMatches(await readUnlock(event.slug), event.id, event.password);
}
