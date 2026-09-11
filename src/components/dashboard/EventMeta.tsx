import { Icon } from "@/components/icons";
import { TIERS } from "@/mock/dashboard";
import type {
  DashboardEvent,
  IconName,
  Visibility,
} from "@/types/dashboard";

export const VISIBILITY: Record<
  Visibility,
  { label: string; icon: IconName; blurb: string }
> = {
  hidden: {
    label: "Hidden",
    icon: "eyeOff",
    blurb: "Only you can see the invitation.",
  },
  public: {
    label: "Public",
    icon: "globe",
    blurb: "Anyone holding the link can see the invitation and can RSVP.",
  },
  protected: {
    label: "Protected",
    icon: "shield",
    blurb:
      "The invitation can only be viewed with a password. Remember to share the password with your guests.",
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
}

export function EventMeta({ event, deadlines = true }: EventMetaProps) {
  const visibility = VISIBILITY[event.visibility];

  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[13px] text-neutral-700">
      <span className="flex items-center gap-1.5">
        <Icon name={visibility.icon} className="size-3.5" />
        {visibility.label}
      </span>
      <span>{TIERS[event.tier].name}</span>

      {deadlines && !event.paid ? (
        <span className={CHIP}>Payment pending</span>
      ) : null}

      {deadlines && event.locked ? (
        <span className={CHIP}>
          <Icon name="lock" className="size-3.5" />
          Editing closed
        </span>
      ) : null}

      {deadlines && !event.locked && event.isNextUp && event.locksInLabel ? (
        <span className={CHIP}>
          <Icon name="clock" className="size-3.5" />
          Locks in {event.locksInLabel}
        </span>
      ) : null}
    </div>
  );
}
