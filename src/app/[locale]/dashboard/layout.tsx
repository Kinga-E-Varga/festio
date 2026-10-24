import { cookies } from "next/headers";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AccountList } from "@/components/dashboard/AccountList";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { CartList } from "@/components/dashboard/CartList";
import { SideNav } from "@/components/dashboard/SideNav";
import { orderEvents } from "@/lib/event";
import { PICKED_EVENT_COOKIE, toPickerEvent } from "@/lib/picked-event";
import { loadHostSummary } from "@/db/reads/dashboard";

/**
 * The shell owns the drawer state, so it is a client component — but the nav
 * and three of the side panel's views are passed in as already-rendered server
 * output; the latest replies load when their view opens.
 */
export default async function DashboardLayout({
  children,
}: LayoutProps<"/[locale]/dashboard">) {
  // The event picked on an earlier visit, so the nav draws it straight away.
  const storedEventId = (await cookies()).get(PICKED_EVENT_COOKIE)?.value;
  const { events: all, notices, bar } = await loadHostSummary();
  const events = orderEvents(all, "active").map(toPickerEvent);

  return (
    <DashboardShell
      nav={<SideNav events={events} storedEventId={storedEventId} />}
      cart={<CartList />}
      alerts={<AlertsList notices={notices} />}
      account={<AccountList />}
      bar={bar}
    >
      {children}
    </DashboardShell>
  );
}
