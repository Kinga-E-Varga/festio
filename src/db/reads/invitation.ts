import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseSnap } from "@/db/reads/parse";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import type { Language } from "@/lib/language";
import { createMemo } from "@/lib/memo";
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
    const snapshot = await db.doc(paths.invitation(event.id)).get();
    return parseSnap(invitationSchema, snapshot);
  },
);

/**
 * Invitation cards by `eventId:invitationVersion`, null for none saved. The
 * key comes from the event card read fresh, so a save (on any server) is
 * never missed: it raises the version, and the old entry just ages out.
 */
const shownInvitations = createMemo<InvitationDoc | null>();

/**
 * The invitation as read-only views show it (the guest page, the Overview's
 * preview): `loadInvitation`, kept on this server by the event card's
 * `invitationVersion`. Editors and the print page read it fresh instead.
 * Nothing is kept or served for an event whose data is gone.
 */
export const loadShownInvitation = cache(
  async (event: DashboardEvent): Promise<InvitationDoc | null> => {
    await connection();
    if (event.dataDeleted) return null;
    const key = `${event.id}:${event.invitationVersion}`;
    const kept = shownInvitations.get(key);
    if (kept !== undefined) return kept;
    const stored = await loadInvitation(event);
    shownInvitations.set(key, stored);
    return stored;
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
