import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { userSchema } from "@/db/schemas/user";
import { requireHostId } from "@/db/reads/session";

export interface Host {
  id: string;
  name: string;
  initials: string;
}

/** "Maria Ionescu" → "MI": the first letter of the first two words. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export const loadHost = cache(async (): Promise<Host> => {
  await connection();
  const uid = await requireHostId();
  const snapshot = await db.doc(paths.user(uid)).get();
  const user = parseCard(userSchema, paths.user(uid), snapshot.data());
  /* Signing in creates the card, so a signed-in host without one is a data problem. */
  if (!user)
    throw new Error(`Signed in as ${uid}, but no readable users card.`);
  return { id: uid, name: user.name, initials: initials(user.name) };
});
