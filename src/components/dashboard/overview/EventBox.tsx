import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { EventWhen } from "@/components/dashboard/EventWhen";
import { StatusTag } from "@/components/dashboard/StatusTag";
import { eventPage } from "@/components/dashboard/event-nav/pages";
import { PageLink } from "@/components/dashboard/overview/PageLink";
import { PAGE_BOX, PREVIEW_EDGE } from "@/components/dashboard/styles";
import { eventStatus } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * Edit floating 12px in from the picture's top right corner: the page's link
 * on a light tag, rounded and edged like the box; greyed, with its reason,
 * when it can't open.
 */
const EDIT = `absolute top-3 right-3 rounded-ui border ${PREVIEW_EDGE} bg-neutral-50 px-2.5 py-1`;

/** The event itself: its name and status, its day. */
export function EventBox({
  event,
  className = "",
}: {
  event: DashboardEvent;
  /** Joins it to the card's box under it, once the columns stack. */
  className?: string;
}) {
  return (
    <section className={`${PAGE_BOX} ${className}`}>
      <BoxHead
        title={event.title}
        aside={<StatusTag status={eventStatus(event)} large />}
      />
      <EventWhen event={event} />
    </section>
  );
}

/** Edit on the Overview's invitation picture, which places it on its corner. */
export function InvitationEdit({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");
  const tEditor = useTranslations("EventEditor");

  return (
    <PageLink
      page={eventPage(event, "invitation")}
      label={tEditor("edit")}
      hint={t("editInvitation")}
      className={EDIT}
    />
  );
}
