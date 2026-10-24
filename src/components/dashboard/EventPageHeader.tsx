import type { ReactNode } from "react";
import { EventPageBar } from "@/components/dashboard/EventPageBar";
import { PageTabs, type PageTab } from "@/components/dashboard/PageTabs";
import type { DashboardEvent } from "@/types/dashboard";

interface EventPageHeaderProps {
  event: DashboardEvent;
  /** The page's name, e.g. Event details. */
  title: string;
  /** The page's one action, at the right of its title. */
  action?: ReactNode;
  /** The page's tabs under its title (Guests'), with their name for screen readers. */
  tabs?: { label: string; items: PageTab[] };
}

/**
 * An event page's header (`EventPageBar`), then its tabs, or with none the
 * same rule under the title, so every event page starts alike.
 */
export function EventPageHeader({
  event,
  title,
  action,
  tabs,
}: EventPageHeaderProps) {
  return (
    <>
      <EventPageBar
        label={event.title}
        title={title}
        action={action}
        tabs={tabs?.items}
      />
      {tabs ? (
        <div className="mt-6">
          <PageTabs label={tabs.label} tabs={tabs.items} />
        </div>
      ) : (
        <div className="mt-6 border-b border-neutral-300" />
      )}
    </>
  );
}
