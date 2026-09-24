import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  contentFreeze,
  deletionDate,
  formatDeadline,
  formatEventDate,
  replyClose,
  replyWindow,
} from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** A dated note; its edge colour says how much attention it wants. */
function DateNote({
  edge,
  title,
  row,
  children,
}: {
  /** The colour coding both layouts carry. */
  edge: string;
  title: string;
  /** Inline notes borrow the row's own date and tag type. */
  row?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        row
          ? `min-w-0 flex-1 basis-[132px] border-l-4 pl-3 ${edge}`
          : `mb-3.5 border-l-4 pb-3.5 pl-3.5 last:mb-0 last:pb-0 ${edge}`
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
   * The events list runs them across rather than down, keeping the edge
   * colours that say how much attention each one wants.
   */
  layout?: "stacked" | "row";
}

/** Editing freeze, reply-form close and record deletion, in one place. */
export function DatesThatMatter({
  event,
  layout = "stacked",
}: DatesThatMatterProps) {
  const t = useTranslations("Event");
  const locale = useLocale();
  const freeze = formatDeadline(contentFreeze(event.date), locale);
  const deletion = formatEventDate(deletionDate(event.date), locale);
  const row = layout === "row";

  return (
    <div className={row ? "flex flex-wrap gap-x-6 gap-y-3.5" : undefined}>
      <DateNote
        edge={event.locked ? "border-neutral-500" : "border-mustard-500"}
        title={t(event.locked ? "editingClosed" : "editingFreezes")}
        row={row}
      >
        {freeze}
      </DateNote>

      <DateNote
        edge="border-steel-500"
        title={t(
          replyWindow(event) === "closed" ? "repliesClosed" : "replyFormCloses",
        )}
        row={row}
      >
        {formatDeadline(replyClose(event), locale)}
      </DateNote>

      <DateNote
        edge="border-terracotta-500"
        title={t("recordDeleted")}
        row={row}
      >
        {deletion}
        {event.dataDeleted ? " — done" : ""}
      </DateNote>
    </div>
  );
}
