import { SEED_EVENTS } from "../../seed/events";

/** One of the dev seed's events by its ID; a renamed one stops the test with its name. */
export function seedEvent(id: string) {
  const found = SEED_EVENTS.find((event) => event.id === id);
  if (!found) throw new Error(`No seed event ${id}`);
  return found;
}
