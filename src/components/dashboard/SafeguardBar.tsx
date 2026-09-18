import { safeguardBarVars } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** Attending vs. declined against the host's cap, plus the reading beneath it. */
export function SafeguardBar({ event }: { event: DashboardEvent }) {
  const { cap } = event.safeguard;
  const barVars = safeguardBarVars(event);

  return (
    <>
      <div
        role="img"
        aria-label={`${event.rsvp.attending} attending and ${event.rsvp.declined} declined, against a cap of ${cap}`}
        className="safeguard mt-3"
        style={barVars}
      >
        <span aria-hidden="true" className="attending" />
        <span aria-hidden="true" className="declined" />
      </div>

      <p className="mt-[9px] text-[11.5px] text-neutral-700">
        Safeguard {event.rsvp.replied} of {cap}
      </p>
    </>
  );
}
