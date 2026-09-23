import { useTranslations } from "next-intl";
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
  const t = useTranslations("Event");
  const percent = cap > 0 ? Math.round((replied / cap) * 100) : 100;
  const fill = { "--fill": `${Math.min(100, percent)}%` } as CSSProperties;

  return (
    <div className="min-w-0">
      {/* Rich text: the count is emphasised where the sentence puts it. */}
      <p className="mb-[5px] text-[12.5px] leading-[1.4] text-neutral-700">
        {t.rich("meter", {
          replied,
          cap,
          percent,
          big: (chunks) => (
            <span className="align-[-1px] font-serif text-[22px] text-neutral-900 tabular-nums">
              {chunks}
            </span>
          ),
        })}
      </p>
      <div
        role="img"
        aria-label={t("meterAria", { replied, cap })}
        className="meter"
        style={fill}
      >
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
