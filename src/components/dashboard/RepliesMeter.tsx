import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import {
  BAR_TRACK,
  REPLIES_BAR,
  STATUS_FILL,
} from "@/components/dashboard/styles";
import { expectedLevel, expectedPercent } from "@/lib/event";

interface RepliesMeterProps {
  replied: number;
  /** How many people the host expects. */
  expected: number;
}

/**
 * Replies received against expected guests: the count stated above a bar
 * drawn like the Overview's (`REPLIES_BAR`) in its colours, but every reply
 * in one fill, Coming's, or once they reach expected its red at the same
 * shade. The editor sets the number with it.
 */
export function RepliesMeter({ replied, expected }: RepliesMeterProps) {
  const t = useTranslations("Event");
  const percent = expectedPercent(replied, expected);
  const fill = { "--replied": `${Math.min(100, percent)}%` } as CSSProperties;
  const over = expectedLevel(percent) === "over";

  return (
    <div className="min-w-0">
      {/* Rich text: the count keeps its figures even, in the sentence's own size. */}
      <p className="mb-2 muted-text leading-none">
        {t.rich("meter", {
          replied,
          expected,
          percent,
          big: (chunks) => <span className="tabular-nums">{chunks}</span>,
        })}
      </p>
      <div
        role="img"
        aria-label={t("meterAria", { replied, expected })}
        className={REPLIES_BAR}
        style={fill}
      >
        {/* As on the Overview's bar, an empty part is left out, so no gap doubles up. */}
        {replied > 0 ? (
          <span
            aria-hidden="true"
            className={`replied ${over ? "bg-danger-700" : STATUS_FILL.going}`}
          />
        ) : null}
        {replied < expected ? (
          <span aria-hidden="true" className={BAR_TRACK} />
        ) : null}
      </div>
    </div>
  );
}
