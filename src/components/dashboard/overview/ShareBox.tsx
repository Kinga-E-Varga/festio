import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { ShareFields } from "@/components/dashboard/ShareFields";
import { eventPage } from "@/components/dashboard/event-nav/pages";
import { PageLink } from "@/components/dashboard/overview/PageLink";
import { PAGE_BOX } from "@/components/dashboard/styles";
import type { DashboardEvent } from "@/types/dashboard";

/** Who can open the invitation, said in a line, then its link and password, and the page they open. */
export function ShareBox({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");
  const tNav = useTranslations("Nav");
  const view = eventPage(event, "guestView");

  return (
    <section className={PAGE_BOX}>
      <BoxHead title={t("share")} />
      <p className="mb-4 meta-text leading-[1.45]">
        <span className="strong-text">{t(event.visibility)}:</span>{" "}
        {t(`${event.visibility}Short`)}
      </p>
      <ShareFields event={event} className="relative" />
      {/* What the link opens, as a guest sees it. */}
      <p className="mt-4">
        <PageLink page={view} label={tNav("guestView")} />
      </p>
    </section>
  );
}
