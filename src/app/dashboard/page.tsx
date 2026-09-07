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
    <div className="mx-auto flex max-w-6xl flex-col gap-7">
      <header>
        <p className="text-[11px] font-medium tracking-[0.14em] text-stone-500 uppercase">
          {HOST.todayLabel}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
          {HOST.greeting}
        </h1>
        <p className="mt-2 max-w-prose text-stone-500">{HOST.lede}</p>
      </header>

      <StatStrip />

      <section>
        <h2 className="flex items-center gap-4 font-serif text-base tracking-[0.18em] uppercase">
          Your events
          <span aria-hidden="true" className="h-px flex-1 bg-linen-200" />
        </h2>
        <div className="mt-4">
          <EventTabs tabs={tabs} />
        </div>
      </section>
    </div>
  );
}
