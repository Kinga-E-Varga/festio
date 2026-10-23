import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import type { Language } from "@/lib/language";
import type { DashboardEvent } from "@/types/dashboard";
import { initialState } from "@/modular/state";
import type {
  ModularLibrary,
  ModularState,
  ModularTemplate,
} from "@/types/modular";

/**
 * The invitation's own card, or null before the host has saved one. A card
 * that fails its schema reads as none, so the template's start shows instead.
 * It takes the event, not its id: only an event a check returned (the host's,
 * or a guest link's) can be passed.
 */
export const loadInvitation = cache(
  async (event: DashboardEvent): Promise<InvitationDoc | null> => {
    await connection();
    const path = paths.invitation(event.id);
    const snapshot = await db.doc(path).get();
    if (!snapshot.exists) return null;
    return parseCard(invitationSchema, path, snapshot.data());
  },
);

/**
 * Where a modular editor starts: the saved card, else the template's own
 * start. A saved card keeps its own sections; one added to the library since
 * comes in off, with its first variant, at its place in the fixed order, and
 * a section with no saved values takes the fresh ones.
 */
export function modularStart(
  template: ModularTemplate,
  stored: InvitationDoc | null,
  library: ModularLibrary,
  language: Language,
): ModularState {
  const fresh = initialState(template, library, language);
  if (stored?.kind !== "modular") return fresh;

  const sections = [...stored.sections];
  let after = -1;
  for (const definition of library.sections) {
    const at = sections.findIndex(({ section }) => section === definition.id);
    if (at >= 0) {
      after = at;
      continue;
    }
    after += 1;
    sections.splice(after, 0, {
      section: definition.id,
      variant: definition.variants[0].id,
      on: Boolean(definition.required),
    });
  }

  const { palette, fontPair, pattern, corners, envelope, values } = stored;
  return {
    palette,
    fontPair,
    pattern,
    corners,
    envelope,
    sections,
    values: { ...fresh.values, ...values },
  };
}
