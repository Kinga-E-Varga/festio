import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EventList } from "@/components/dashboard/EventList";
import { HostToday } from "@/components/dashboard/HostToday";
import { NewEventButton } from "@/components/dashboard/NewEventButton";
import { StatStrip } from "@/components/dashboard/StatStrip";
import { SEE_ALL_LINK } from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { eventStatus, orderEvents } from "@/lib/event";
import { EVENTS, HOST } from "@/mock/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  // Every event still ahead, live or not: paid and hidden, or not yet paid.
  const upcoming = orderEvents(
    EVENTS.filter((event) => eventStatus(event) !== "past"),
    "active",
  );

  return (
    <div className="@container">
      {/*
       * The greeting and the one thing a host starts from share a row under the
       * date; on a narrow page the action folds to a plus so the greeting keeps it.
       */}
      <header>
        <HostToday />
        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="min-w-0 font-serif text-[32px] leading-[1.05] text-neutral-950 @min-[720px]:text-[40px]">
            {t("greeting", { name: HOST.name })}
          </h1>
          <NewEventButton label={t("newEvent")} />
        </div>
      </header>

      <div className="mt-5">
        <StatStrip />
      </div>

      <section>
        <div className="mt-8 mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-neutral-400 pb-3">
          <h2 className="section-title">{t("upcomingEvents")}</h2>
          <Link href="/dashboard/events" className={SEE_ALL_LINK}>
            {t("seeAllEvents")}
            <Icon name="arrowRight" className="size-3.5" />
          </Link>
        </div>

        <EventList events={upcoming} emptyMessage={t("emptyUpcoming")} />
      </section>
    </div>
  );
}
