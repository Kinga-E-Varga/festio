import type { ReactNode } from "react";
import {
  contentFreeze,
  deletionDate,
  formatEventDate,
  formatStamp,
} from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** A dated note; its edge colour says how much attention it wants. */
function DateNote({
  edge,
  title,
  row,
  children,
}: {
  /** Absent in the row layout, which carries no colour coding. */
  edge?: string;
  title: string;
  /** Inline notes borrow the row's own date and tag type. */
  row?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        edge
          ? `mb-3.5 border-l-4 pb-3.5 pl-3.5 last:mb-0 last:pb-0 ${edge}`
          : "min-w-0"
      }
    >
      <b
        className={
          row
            ? "mb-[5px] block text-[14px] leading-none font-medium text-neutral-900"
            : "mb-[3px] block text-neutral-900"
        }
      >
        {title}
      </b>
      <p
        className={
          row
            ? "text-[14px] leading-[1.4] text-neutral-700"
            : "text-[12.5px] leading-[1.45] text-neutral-700"
        }
      >
        {children}
      </p>
    </div>
  );
}

interface DatesThatMatterProps {
  event: DashboardEvent;
  /**
   * The events list states these inline under a rule, with no heading of
   * their own, so they run across rather than down and drop their edges.
   */
  layout?: "stacked" | "row";
}

/** Editing freeze, reply-form close and record deletion, in one place. */
export function DatesThatMatter({
  event,
  layout = "stacked",
}: DatesThatMatterProps) {
  const freeze = formatStamp(contentFreeze(event.date));
  const deletion = formatEventDate(deletionDate(event.date));
  const row = layout === "row";

  return (
    <div className={row ? "flex flex-wrap gap-x-9 gap-y-3" : undefined}>
      <DateNote
        edge={
          row
            ? undefined
            : event.locked
              ? "border-neutral-500"
              : "border-mustard-500"
        }
        title={event.locked ? "Editing closed" : "Editing freezes"}
        row={row}
      >
        {freeze}
      </DateNote>

      <DateNote
        edge={row ? undefined : "border-steel-500"}
        title="Reply form closes"
        row={row}
      >
        {freeze}
      </DateNote>

      <DateNote
        edge={row ? undefined : "border-terracotta-500"}
        title="Record deleted"
        row={row}
      >
        {deletion}
        {event.dataDeleted ? " — done" : ""}
      </DateNote>
    </div>
  );
}
