import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { userSchema } from "@/db/schemas/user";

/*
 * Server reads, Admin SDK only: it skips the security rules, so every read
 * here checks the card belongs to the host itself.
 */

/** The seed's host, standing in for the signed-in one until sign-in exists (step 3). */
export const DEV_HOST_ID = "host-maria";

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
  const snapshot = await db.doc(paths.user(DEV_HOST_ID)).get();
  const user = parseCard(userSchema, paths.user(DEV_HOST_ID), snapshot.data());
  /* Without its own card nothing can be shown as the host: a setup problem, not a guest's. */
  if (!user) throw new Error(`No readable host card: run \`npm run seed\`.`);
  return { id: DEV_HOST_ID, name: user.name, initials: initials(user.name) };
});
