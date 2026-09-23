import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { formatDuration } from "@/lib/event";
import { TIERS } from "@/mock/dashboard";
import type {
  DashboardEvent,
  IconName,
  Visibility,
} from "@/types/dashboard";

/**
 * The icon is this map's own; what each visibility is *called* and what it
 * means are keys into the `Event` namespace, since both are words.
 */
export const VISIBILITY: Record<
  Visibility,
  { labelKey: string; icon: IconName; blurbKey: string }
> = {
  hidden: { labelKey: "hidden", icon: "eyeOff", blurbKey: "hiddenNote" },
  public: { labelKey: "public", icon: "globe", blurbKey: "publicNote" },
  protected: {
    labelKey: "protected",
    icon: "shield",
    blurbKey: "protectedNote",
  },
};

/** The amber pill the meta row uses for anything with a deadline attached. */
const CHIP =
  "inline-flex items-center gap-1.5 border border-terracotta-400 bg-terracotta-200 px-2.5 py-1 text-xs font-semibold text-terracotta-600";

interface EventMetaProps {
  event: DashboardEvent;
  /**
   * The editor states every deadline in its own banners and summary, so the
   * meta row under its title carries only visibility and tier.
   */
  deadlines?: boolean;
  /** The events list gives the freeze a line of its own, further down. */
  locksIn?: boolean;
  /** The list sets its meta a step above the dashboard card's. */
  size?: "sm" | "md";
}

export function EventMeta({
  event,
  deadlines = true,
  locksIn = true,
  size = "sm",
}: EventMetaProps) {
  const t = useTranslations("Event");
  const tTiers = useTranslations("Tiers");
  const locale = useLocale();
  const visibility = VISIBILITY[event.visibility];

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3.5 gap-y-2 text-neutral-700 ${
        size === "md" ? "text-[14px]" : "text-[13px]"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <Icon name={visibility.icon} className={size === "md" ? "size-4" : "size-3.5"} />
        {t(visibility.labelKey)}
      </span>
      <span>{tTiers(`${TIERS[event.tier].key}.name`)}</span>

      {deadlines && !event.paid ? (
        <span className={CHIP}>{t("paymentPending")}</span>
      ) : null}

      {deadlines && event.locked ? (
        <span className={CHIP}>
          <Icon name="lock" className="size-3.5" />
          {t("editingClosed")}
        </span>
      ) : null}

      {deadlines && locksIn && !event.locked && event.isNextUp && event.locksIn ? (
        <span className={CHIP}>
          <Icon name="clock" className="size-3.5" />
          {t("locksIn", { time: formatDuration(event.locksIn, locale) })}
        </span>
      ) : null}
    </div>
  );
}
