import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { expectedLevel, expectedPercent } from "@/lib/event";

interface RepliesMeterProps {
  replied: number;
  /** How many people the host expects. */
  expected: number;
}

/**
 * Replies received against expected guests: the count stated above a single
 * fill. The editor sets the number with it, and the events list reports it.
 */
export function RepliesMeter({ replied, expected }: RepliesMeterProps) {
  const t = useTranslations("Event");
  const percent = expectedPercent(replied, expected);
  const fill = { "--fill": `${Math.min(100, percent)}%` } as CSSProperties;

  return (
    <div className="min-w-0">
      {/* Rich text: the count is emphasised where the sentence puts it. */}
      <p className="mb-[5px] text-[12.5px] leading-[1.4] text-neutral-700">
        {t.rich("meter", {
          replied,
          expected,
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
        aria-label={t("meterAria", { replied, expected })}
        className="meter"
        data-level={expectedLevel(percent)}
        style={fill}
      >
        <span aria-hidden="true" />
      </div>
    </div>
  );
}
