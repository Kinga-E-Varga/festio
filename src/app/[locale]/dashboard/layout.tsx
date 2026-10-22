import { cookies } from "next/headers";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AccountList } from "@/components/dashboard/AccountList";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { CartList } from "@/components/dashboard/CartList";
import { RepliesList } from "@/components/dashboard/RepliesList";
import { SideNav } from "@/components/dashboard/SideNav";
import { orderEvents } from "@/lib/event";
import { PICKED_EVENT_COOKIE, toPickerEvent } from "@/lib/picked-event";
import { loadDashboard } from "@/db/reads/dashboard";

/**
 * The shell owns the drawer state, so it is a client component — but the nav
 * and the side panel's four views are passed in as already-rendered server output.
 */
export default async function DashboardLayout({
  children,
}: LayoutProps<"/[locale]/dashboard">) {
  // The event picked on an earlier visit, so the nav draws it straight away.
  const storedEventId = (await cookies()).get(PICKED_EVENT_COOKIE)?.value;
  const { events: all, notices, unpaid, activity, bar } = await loadDashboard();
  const events = orderEvents(all, "active").map(toPickerEvent);

  return (
    <DashboardShell
      nav={<SideNav events={events} storedEventId={storedEventId} />}
      cart={<CartList unpaid={unpaid} />}
      alerts={<AlertsList notices={notices} />}
      replies={<RepliesList entries={activity} />}
      account={<AccountList />}
      bar={bar}
    >
      {children}
    </DashboardShell>
  );
}
