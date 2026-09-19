import type { Metadata } from "next";
import { CentreOnHash } from "@/components/dashboard/CentreOnHash";
import { EventGroups } from "@/components/dashboard/EventGroups";
import { EventTabs, type EventTab } from "@/components/dashboard/EventTabs";
import { Icon } from "@/components/icons";
import { EVENTS, EVENTS_LEDE, HOST } from "@/mock/dashboard";
import type { EventStatus } from "@/types/dashboard";

export const metadata: Metadata = {
  title: "Events · Festio",
};

const ALL: EventStatus[] = ["active", "draft", "past"];

export default function EventsPage() {
  const count = (status: EventStatus) =>
    EVENTS.filter((event) => event.status === status).length;

  const tabs: EventTab[] = [
    {
      id: "all",
      label: "All",
      count: EVENTS.length,
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={ALL}
          emptyMessage="No events yet. Pick a template to start your first invitation."
        />
      ),
    },
    {
      id: "active",
      label: "Active",
      count: count("active"),
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={["active"]}
          emptyMessage="Nothing live yet. Pick a template to start your first invitation."
        />
      ),
    },
    {
      id: "drafts",
      label: "Drafts",
      count: count("draft"),
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={["draft"]}
          emptyMessage="No drafts waiting. Saved-but-unpaid invitations land here."
        />
      ),
    },
    {
      id: "past",
      label: "Past",
      count: count("past"),
      panel: (
        <EventGroups
          events={EVENTS}
          statuses={["past"]}
          emptyMessage="No past events yet. Invitations move here the day after the event."
        />
      ),
    },
  ];

  return (
    <div className="@container">
      {/* Arriving from a dashboard card, on that card rather than under the bar. */}
      <CentreOnHash />

      {/* The title block and the one primary action share a row. */}
      <header className="flex items-center gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase">
            {HOST.todayLabel}
          </p>
          <h1 className="mt-1.5 font-serif text-[34px] leading-[1.05] text-neutral-900 @min-[720px]:text-[46px]">
            Events
          </h1>
        </div>

        {/* Below 560 the label goes and the plus stands on its own. */}
        <button
          type="button"
          aria-label="New event"
          className="flex shrink-0 items-center gap-2 rounded-md border border-forest-500 bg-forest-500 px-4 py-2.5 font-medium text-neutral-50 transition-colors hover:border-forest-600 hover:bg-forest-600 @max-[560px]:gap-0 @max-[560px]:p-[11px]"
        >
          <Icon name="plus" className="size-[18px]" strokeWidth={2} />
          <span className="@max-[560px]:hidden">New event</span>
        </button>
      </header>

      <p className="mt-3.5 mb-[26px] text-neutral-700">
        {EVENTS_LEDE}
      </p>

      <EventTabs tabs={tabs} />
    </div>
  );
}
