import { cache } from "react";
import { connection } from "next/server";
import { auth, db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { userSchema } from "@/db/schemas/user";
import { requireHostId } from "@/db/reads/session";

export interface Host {
  id: string;
  name: string;
  initials: string;
  /** When they last opened the latest replies; undefined = never. */
  lastVisit?: Date;
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
  return {
    id: uid,
    name: user.name,
    initials: initials(user.name),
    lastVisit: user.lastVisit?.toDate(),
  };
});

/** How the host signs in: their email, and whether they have a password (else Google only). */
export interface HostLogin {
  email: string;
  password: boolean;
}

/** The signed-in host's login, so a step that asks "is it you?" knows which way to ask. */
export const loadHostLogin = cache(async (): Promise<HostLogin> => {
  await connection();
  const user = await auth.getUser(await requireHostId());
  return {
    email: user.email ?? "",
    password: user.providerData.some(
      (provider) => provider.providerId === "password",
    ),
  };
});
