import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CentreOnHash } from "@/components/dashboard/CentreOnHash";
import { HostToday } from "@/components/dashboard/HostToday";
import { NewEventButton } from "@/components/dashboard/NewEventButton";
import { EventGroups } from "@/components/dashboard/EventGroups";
import { EventRow } from "@/components/dashboard/EventRow";
import { EventTabs, type EventTab } from "@/components/dashboard/EventTabs";
import { FocusView } from "@/components/dashboard/FocusView";
import { eventStatus } from "@/lib/event";
import { EVENTS, findEvent } from "@/mock/dashboard";
import type { EventStatus } from "@/types/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("events") };
}

/** One tab per pile: which statuses it holds and the texts it shows. */
const PILES = [
  {
    id: "all",
    statuses: ["active", "draft", "past"],
    label: "tabAll",
    empty: "emptyAll",
  },
  {
    id: "active",
    statuses: ["active"],
    label: "tabActive",
    empty: "emptyActive",
  },
  {
    id: "drafts",
    statuses: ["draft"],
    label: "tabDrafts",
    empty: "emptyDrafts",
  },
  { id: "past", statuses: ["past"], label: "tabPast", empty: "emptyPast" },
] as const satisfies readonly {
  id: string;
  statuses: readonly EventStatus[];
  label: string;
  empty: string;
}[];

export default async function EventsPage({
  searchParams,
}: PageProps<"/[locale]/dashboard/events">) {
  /*
   * `?event=` is how another page hands one event over — the dashboard's own
   * cards do, from Manage this event. An id that matches nothing is simply
   * the whole list, which is what the address without the query already is.
   */
  const t = await getTranslations("Events");
  const { event: requested } = await searchParams;
  const focused =
    typeof requested === "string" ? findEvent(requested) : undefined;

  const tabs: EventTab[] = PILES.map((pile) => {
    const statuses: EventStatus[] = [...pile.statuses];
    return {
      id: pile.id,
      label: t(pile.label),
      count: EVENTS.filter((event) => statuses.includes(eventStatus(event)))
        .length,
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={statuses}
          emptyMessage={t(pile.empty)}
        />
      ),
    };
  });

  return (
    <div className="@container">
      {/* Arriving from a dashboard card, on that card rather than under the bar. */}
      <CentreOnHash />

      {/*
       * The title and the one primary action share a row under the date; on a
       * narrow page the action folds to a plus, as on the dashboard.
       */}
      <header className="mb-8">
        <HostToday />
        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="min-w-0 font-serif text-[32px] leading-[1.05] text-neutral-950 @min-[720px]:text-[40px]">
            {t("title")}
          </h1>
          <NewEventButton label={t("newEvent")} />
        </div>
      </header>

      <EventTabs
        tabs={tabs}
        label={t("tabsLabel")}
        // Arriving on one event, no pile is the one being looked at.
        initialId={focused ? null : undefined}
        fallback={
          focused ? (
            <FocusView
              note={t("focusNote")}
              href="/dashboard/events"
              linkLabel={t("focusLink")}
            >
              <EventRow event={focused} />
            </FocusView>
          ) : null
        }
      />
    </div>
  );
}
