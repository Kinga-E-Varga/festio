import type { Metadata } from "next";
import { EventGroups } from "@/components/dashboard/EventGroups";
import { EventTabs, type EventTab } from "@/components/dashboard/EventTabs";
import { Icon } from "@/components/icons";
import { EVENTS, HOST } from "@/mock/dashboard";
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
      {/* The title block and the one primary action share a row. */}
      <header className="flex flex-wrap items-center gap-6">
        <div className="min-w-[280px] flex-1">
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
          className="flex shrink-0 items-center gap-2 rounded-md border border-terracotta-500 bg-terracotta-500 px-4 py-2.5 font-medium text-terracotta-50 transition-colors hover:border-terracotta-600 hover:bg-terracotta-600 @max-[560px]:gap-0 @max-[560px]:p-[11px]"
        >
          <Icon name="plus" className="size-4" />
          <span className="@max-[560px]:hidden">New event</span>
        </button>
      </header>

      <p className="mt-3.5 mb-[26px] text-neutral-700">
        Each event is one record and one purchase. Open an event to change its
        details, who can see it, and how guests reply — the invitation&apos;s
        design is edited separately.
      </p>

      <EventTabs tabs={tabs} />
    </div>
  );
}
