import type { EventGuests } from "@/types/guests";

/** What a tab last saved of an event's guest list. */
export interface SavedList {
  dataVersion: number;
  listVersion: number;
  guests: EventGuests;
  useList: boolean;
}

/*
 * Back and Forward reuse the page as it was loaded, so the guest list can
 * mount from a copy older than the host's last save. This keeps the last save
 * of each event, for the life of the tab, for the list to start from instead.
 */
const lastSaved = new Map<string, SavedList>();

export function keptList(eventId: string): SavedList | undefined {
  return lastSaved.get(eventId);
}

export function keepList(eventId: string, saved: SavedList) {
  lastSaved.set(eventId, saved);
}

export function dropList(eventId: string) {
  lastSaved.delete(eventId);
}

/** Forgets every event's last save: on Log out, so no guest list stays in the tab. */
export function forgetSavedLists() {
  lastSaved.clear();
}
