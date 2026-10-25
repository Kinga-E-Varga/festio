"use server";

import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { z } from "zod";
import { slugSchema } from "@/db/schemas/event";
import type { SaveError } from "@/db/writes/save";
import { readOwnEvent } from "@/db/writes/event";
import { readSlug, slugFree } from "@/db/writes/slugs";
import { hostSave } from "@/actions/host-save";
import { isReservedSlug, slugSuggestions } from "@/lib/slug";
import type { ActionResult } from "@/types/actions";

/** How many free links to offer instead of a taken one. */
const OFFERED = 3;

/**
 * Whether a link is free for this event, and when it isn't, a few free ones
 * to pick instead. Only a hint for the form: the save claims the link for real.
 */
export async function checkSlug(
  eventId: string,
  slug: string,
): Promise<ActionResult<{ free: boolean; suggestions: string[] }, SaveError>> {
  return hostSave(
    z.string(),
    slug,
    async (hostId, typed) => {
      const event = await readOwnEvent(hostId, eventId);
      const parsed = slugSchema.safeParse(typed);
      if (!parsed.success || isReservedSlug(parsed.data)) {
        return { free: false, suggestions: [] };
      }

      const claim = { eventId, hostId, now: new Date() };
      const read = (path: string) => db.doc(path).get();
      const found = await readSlug(read, parsed.data);
      if (found && slugFree(found.card, found.hostId, claim)) {
        return { free: true, suggestions: [] };
      }

      /* Plenty of candidates, read at once, so a few free ones are left over. */
      const candidates = slugSuggestions(
        parsed.data,
        event.date.slice(0, 4),
        9,
      );
      const snaps = candidates.length
        ? await db.getAll(...candidates.map((name) => db.doc(paths.slug(name))))
        : [];
      const suggestions: string[] = [];
      for (const [index, snap] of snaps.entries()) {
        if (suggestions.length === OFFERED) break;
        /* One with a card is read again with its event's host; few ever have one. */
        const other = snap.exists
          ? await readSlug(read, candidates[index])
          : { card: null, hostId: null };
        if (other && slugFree(other.card, other.hostId, claim)) {
          suggestions.push(candidates[index]);
        }
      }
      return { free: false, suggestions };
    },
    { refresh: false },
  );
}
