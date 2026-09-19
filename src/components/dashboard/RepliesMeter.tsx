import type { CSSProperties } from "react";

interface RepliesMeterProps {
  replied: number;
  /** The host's attendee safeguard — a technical cap, not a guest limit. */
  cap: number;
}

/**
 * Replies received against the cap: the count stated above a single fill.
 * The editor sets the cap with it, and the events list reports it.
 */
export function RepliesMeter({ replied, cap }: RepliesMeterProps) {
  const percent = cap > 0 ? Math.round((replied / cap) * 100) : 100;
  const fill = { "--fill": `${Math.min(100, percent)}%` } as CSSProperties;

  return (
    <div className="min-w-0">
      <p className="mb-[5px] text-[12.5px] leading-[1.4] text-neutral-700">
        <span className="align-[-1px] font-serif text-[22px] text-neutral-900 tabular-nums">
          {replied}
        </span>{" "}
        replies received against a {cap} cap · {percent}%
      </p>
      <div
        role="img"
        aria-label={`${replied} replies against a cap of ${cap}`}
        className="meter"
        style={fill}
      >
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
