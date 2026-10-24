import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { EventPageBar } from "@/components/dashboard/EventPageBar";
import { AttentionCard } from "@/components/dashboard/home/AttentionCard";
import { CreateEventCard } from "@/components/dashboard/home/CreateEventCard";
import { EventsBox } from "@/components/dashboard/home/EventsBox";
import { NextEventCard } from "@/components/dashboard/home/NextEventCard";
import { CONTENT_WIDTH, TWO_COLUMNS } from "@/components/dashboard/styles";
import { homeRows } from "@/lib/event";
import { loadHostSummary } from "@/db/reads/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const format = await getFormatter();
  const { host, events, notices } = await loadHostSummary();
  const rows = homeRows(events);
  const nextRow = rows.find((row) => row.status !== "past");
  const next = nextRow && events.find((event) => event.id === nextRow.id);

  return (
    <>
      {/*
       * The event pages' header, today's date where their event's name goes,
       * capped like the page under it. Outside the `@container` below, so its
       * width is main's, not the column's.
       */}
      <EventPageBar
        label={format.dateTime(new Date(), {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        title={t("greeting", { name: host.name })}
        look="home"
      />

      <div className={`@container ${CONTENT_WIDTH.page}`}>
        {/*
         * Create, the next event and what needs the host in a narrow column,
         * every event beside it, as tall as the column. On a narrow page they
         * stack, the events before the alerts: the alerts show on each event too.
         */}
        <div className={`mt-6 ${TWO_COLUMNS}`}>
          <div className="flex flex-col gap-4 @max-[859px]:contents">
            <CreateEventCard />
            <NextEventCard event={next} />
            <AttentionCard
              notices={notices}
              events={events}
              className="@max-[859px]:order-last"
            />
          </div>
          <EventsBox events={rows} />
        </div>
      </div>
    </>
  );
}
