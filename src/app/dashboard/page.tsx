import type { Metadata } from "next";
import { EventList } from "@/components/dashboard/EventList";
import { EventTabs, type EventTab } from "@/components/dashboard/EventTabs";
import { StatStrip } from "@/components/dashboard/StatStrip";
import { EVENTS, HOST } from "@/mock/dashboard";

export const metadata: Metadata = {
  title: "Dashboard · Festio",
};

export default function DashboardPage() {
  const active = EVENTS.filter((event) => event.status === "active");
  const drafts = EVENTS.filter((event) => event.status === "draft");
  const past = EVENTS.filter((event) => event.status === "past");

  const tabs: EventTab[] = [
    {
      id: "active",
      label: "Active",
      count: active.length,
      panel: (
        <EventList
          events={active}
          emptyMessage="Nothing live yet. Pick a template to start your first invitation."
        />
      ),
    },
    {
      id: "drafts",
      label: "Drafts",
      count: drafts.length,
      panel: (
        <EventList
          events={drafts}
          emptyMessage="No drafts waiting. Saved-but-unpublished invitations land here."
        />
      ),
    },
    {
      id: "past",
      label: "Past",
      count: past.length,
      panel: (
        <EventList
          events={past}
          emptyMessage="No past events yet. Invitations move here the day after the event."
        />
      ),
    },
  ];

  return (
    <div>
      <header>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-forest-500 uppercase">
          {HOST.todayLabel}
        </p>
        <h1 className="mt-1.5 font-serif text-[34px] leading-[1.05] text-neutral-900 nav:text-[46px]">
          {HOST.greeting}
        </h1>
        <p className="mt-2 mb-[26px] max-w-[62ch] text-neutral-700">
          {HOST.lede}
        </p>
      </header>

      <StatStrip />

      <section>
        <h2 className="mt-[34px] mb-3.5 flex items-center gap-[18px] font-serif text-xl tracking-[0.14em] text-neutral-900 uppercase">
          Your events
          <span aria-hidden="true" className="h-px flex-1 bg-forest-400" />
        </h2>
        <EventTabs tabs={tabs} />
      </section>
    </div>
  );
}
