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
  children,
}: {
  edge: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={`mb-3.5 border-l-4 pb-3.5 pl-3.5 last:mb-0 last:pb-0 ${edge}`}>
      <b className="mb-[3px] block text-neutral-900">{title}</b>
      <p className="text-[12.5px] leading-[1.45] text-neutral-700">{children}</p>
    </div>
  );
}

/** Editing freeze, reply-form close and record deletion, in one place. */
export function DatesThatMatter({ event }: { event: DashboardEvent }) {
  const freeze = formatStamp(contentFreeze(event.date));
  const deletion = formatEventDate(deletionDate(event.date));

  return (
    <>
      <DateNote
        edge={event.locked ? "border-neutral-500" : "border-mustard-500"}
        title={event.locked ? "Editing closed" : "Editing freezes"}
      >
        {freeze}
        {event.locked || !event.locksInLabel
          ? ""
          : ` — ${event.locksInLabel} from now`}
      </DateNote>

      <DateNote edge="border-steel-500" title="Reply form closes">
        {freeze}
      </DateNote>

      <DateNote edge="border-terracotta-500" title="Record deleted">
        {deletion}
        {event.dataDeleted ? " — done" : ""}
      </DateNote>
    </>
  );
}
