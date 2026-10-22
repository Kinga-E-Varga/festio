import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { EventWhen } from "@/components/dashboard/EventWhen";
import { StatusTag } from "@/components/dashboard/StatusTag";
import { eventPage } from "@/components/dashboard/event-nav/pages";
import { PageLink } from "@/components/dashboard/overview/PageLink";
import { PAGE_BOX } from "@/components/dashboard/styles";
import { eventStatus } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * Edit tucked into the picture's corner, its edges on the picture's own, its
 * outer corner rounded with it: the page's link on a light tag, edged like
 * the boxes; greyed, with its reason, when it can't open.
 */
const EDIT =
  "absolute top-0 right-0 rounded-tr-ui rounded-bl-ui border border-neutral-300 bg-neutral-50 px-2.5 py-1";

/**
 * The event itself: its name and status, its day, then its invitation as
 * guests see it, with Edit on its corner.
 */
export function EventBox({
  event,
  preview,
}: {
  event: DashboardEvent;
  /** The invitation drawn live and shrunk; none before a design is picked. */
  preview: ReactNode;
}) {
  const t = useTranslations("Event");
  const tEditor = useTranslations("EventEditor");

  return (
    <section className={PAGE_BOX}>
      <BoxHead
        title={event.title}
        aside={<StatusTag status={eventStatus(event)} large />}
      />
      <EventWhen event={event} />

      {/*
       * As wide as the box, as tall as the picture's own shape makes it, but
       * never past 380px: once the columns stack the box is the page's width,
       * and the picture would be twice the size it is beside the others. Centred in it then.
       */}
      <div className="relative mx-auto mt-5 max-w-[380px]">
        {preview}
        <PageLink
          page={eventPage(event, "invitation")}
          label={tEditor("edit")}
          hint={t("editInvitation")}
          className={EDIT}
        />
      </div>
    </section>
  );
}
