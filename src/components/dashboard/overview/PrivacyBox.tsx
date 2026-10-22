import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { RetentionInfo } from "@/components/dashboard/RetentionInfo";
import { PAGE_BOX } from "@/components/dashboard/styles";
import type { DashboardEvent } from "@/types/dashboard";

/** The Overview's last box: when the guest data goes, what to save, the legal side. */
export function PrivacyBox({ event }: { event: DashboardEvent }) {
  const t = useTranslations("Event");

  return (
    <section className={PAGE_BOX}>
      <BoxHead title={t("dataPrivacy")} />
      <RetentionInfo event={event} />
    </section>
  );
}
