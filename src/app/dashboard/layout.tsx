import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { NotificationsRail } from "@/components/dashboard/NotificationsRail";
import { SideNav } from "@/components/dashboard/SideNav";
import { SiteFooter } from "@/components/dashboard/SiteFooter";

/**
 * The shell owns the drawer state, so it is a client component — but the nav
 * and the notifications rail are passed in as already-rendered server output.
 */
export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      <DashboardShell nav={<SideNav />} notices={<NotificationsRail />}>
        {children}
      </DashboardShell>
      <SiteFooter />
    </>
  );
}
