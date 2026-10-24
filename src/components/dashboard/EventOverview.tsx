import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { DatesThatMatter } from "@/components/dashboard/DatesThatMatter";
import { EventPageHeader } from "@/components/dashboard/EventPageHeader";
import { TodoBoard } from "@/components/dashboard/TodoBoard";
import { EventBox } from "@/components/dashboard/overview/EventBox";
import { PackageBox } from "@/components/dashboard/overview/PackageBox";
import { PrivacyBox } from "@/components/dashboard/overview/PrivacyBox";
import { RepliesBox } from "@/components/dashboard/overview/RepliesBox";
import { ShareBox } from "@/components/dashboard/overview/ShareBox";
import {
  CONTENT_WIDTH,
  PAGE_BOX,
  TWO_COLUMNS,
} from "@/components/dashboard/styles";
import type {
  AttentionNotice,
  DashboardEvent,
  RsvpActivity,
} from "@/types/dashboard";

interface EventOverviewProps {
  event: DashboardEvent;
  /** Its alerts plus what its own state needs doing. */
  todos: AttentionNotice[];
  /** Its latest replies, newest first. */
  latest: RsvpActivity[];
  /** The invitation drawn live and shrunk; none before a design is picked. */
  preview: ReactNode;
}

/**
 * One event's own home. A narrow column of the event with its invitation,
 * how it is shared and its package; beside it, one under another, what is
 * waiting, its replies, its dates and its data. On a narrow page the
 * second column follows the first, each in its own order. Its pages are in the nav, so the only
 * buttons here are the invitation's own and paying.
 */
export function EventOverview({
  event,
  todos,
  latest,
  preview,
}: EventOverviewProps) {
  const t = useTranslations("Event");
  const tNav = useTranslations("Nav");

  return (
    <>
      {/* The event pages' header, outside the `@container` below, so its width is main's. */}
      <EventPageHeader event={event} title={tNav("overview")} />

      <div className={`@container mt-8 ${CONTENT_WIDTH.page}`}>
        <div className={TWO_COLUMNS}>
          <div className="flex flex-col gap-4">
            <EventBox event={event} preview={preview} />
            <ShareBox event={event} />
            <PackageBox event={event} />
          </div>

          <div className="flex flex-col gap-4">
            {/* Nothing waiting, no box. */}
            {todos.length > 0 ? (
              <section className={PAGE_BOX}>
                <BoxHead title={t("todo")} />
                <TodoBoard todos={todos} />
              </section>
            ) : null}
            <RepliesBox event={event} latest={latest} />
            <section className={PAGE_BOX}>
              <BoxHead title={t("keyDates")} />
              <DatesThatMatter event={event} />
            </section>
            <PrivacyBox event={event} />
          </div>
        </div>
      </div>
    </>
  );
}
