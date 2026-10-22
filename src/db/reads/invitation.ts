import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import type { Language } from "@/lib/language";
import { initialState } from "@/modular/state";
import type {
  ModularLibrary,
  ModularState,
  ModularTemplate,
} from "@/types/modular";

/**
 * The invitation's own card, or null before the host has saved one. A card
 * that fails its schema reads as none, so the template's start shows instead.
 */
export const loadInvitation = cache(
  async (eventId: string): Promise<InvitationDoc | null> => {
    await connection();
    const snapshot = await db.doc(paths.invitation(eventId)).get();
    if (!snapshot.exists) return null;
    return parseCard(
      invitationSchema,
      paths.invitation(eventId),
      snapshot.data(),
    );
  },
);

/** Where a modular editor starts: the saved card, else the template's own start. */
export function modularStart(
  template: ModularTemplate,
  stored: InvitationDoc | null,
  library: ModularLibrary,
  language: Language,
): ModularState {
  if (stored?.kind !== "modular") {
    return initialState(template, library, language);
  }
  const { palette, fontPair, pattern, corners, envelope, sections, values } =
    stored;
  return { palette, fontPair, pattern, corners, envelope, sections, values };
}
