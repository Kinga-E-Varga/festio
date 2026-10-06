import { useNow } from "./clock";
import { eventStart, list, timeLeft, type TimeLeft } from "./content";
import type { InvitationBasics, SectionValues } from "@/types/modular";

/** The countdown's units, largest first. */
export const UNITS = ["days", "hours", "minutes", "seconds"] as const;

/**
 * What is left until the first part of the day (date & time's `moments`),
 * live; `null` until the first tick. Shared by the countdown's variants.
 */
export function useTimeLeft(
  basics: InvitationBasics,
  related: Partial<Record<string, SectionValues>>,
): TimeLeft | null {
  const now = useNow();
  const first = list(related["date-time"] ?? {}, "moments")[0];
  return now === null
    ? null
    : timeLeft(eventStart(basics.date, first?.time), now);
}
