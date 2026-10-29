import { useNow } from "./clock";
import { eventStart, timeLeft, type TimeLeft } from "./content";
import { addDays } from "@/lib/event";
import type { InvitationBasics } from "@/types/modular";

/** The countdown's units, largest first. */
export const UNITS = ["days", "hours", "minutes", "seconds"] as const;

/** The numbers' size in every variant: the section heading's (`H2`). */
export const NUMBER_SIZE = "text-[34px] @3xl:text-[44px] @5xl:text-[48px]";

/**
 * What a countdown says once there is nothing left to count: a fixed
 * eyebrow and a line, on the day and after it, as `Sections` message keys.
 */
export const COUNTDOWN_DONE = {
  day: { eyebrow: "countdownDoneEyebrow", line: "countdownDone" },
  after: { eyebrow: "countdownPastEyebrow", line: "countdownPast" },
} as const;

/** Nothing left to count: on the day, or after it. */
export type CountdownDone = keyof typeof COUNTDOWN_DONE;

/**
 * What is left until the event's day begins, live, and `done` once there is
 * nothing left to count; `left` is `null` until the first tick. Shared by
 * the countdown's variants.
 */
export function useCountdown(basics: InvitationBasics): {
  left: TimeLeft | null;
  done: CountdownDone | null;
} {
  const start = eventStart(basics.date);
  // The next midnight, not 24 hours on: a clock change keeps the day whole.
  const end = addDays(start, 1);
  // After the day, the text is fixed: the clock can stop.
  const now = useNow(end.getTime());
  if (now === null) return { left: null, done: null };
  const done =
    now < start.getTime() ? null : now < end.getTime() ? "day" : "after";
  return { left: timeLeft(start, now), done };
}
