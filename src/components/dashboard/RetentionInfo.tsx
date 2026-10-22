import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SettingRow } from "@/components/dashboard/event-editor/SettingRow";
import { ExportLink } from "@/components/dashboard/ExportLink";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { deletionDate, formatDay, formatEventDate } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * When the event's record is deleted and what to save before then, with the
 * legal side under them: on the Overview, under the Key dates timeline.
 */
export function RetentionInfo({ event }: { event: DashboardEvent }) {
  const locale = useLocale();
  const deletionLabel = formatEventDate(deletionDate(event.date), locale);
  const dateLabel = formatDay(event.date, locale);
  const t = useTranslations("EventEditor");
  const gone = event.dataDeleted;

  return (
    <div className="@container flex flex-col gap-3">
      {/* The date to remember first. */}
      <SettingRow
        tight
        title={t(gone ? "deletedOnPast" : "deletedOn", {
          date: deletionLabel,
        })}
      >
        {t(gone ? "deletedBodyPast" : "deletedBody", {
          days: GUEST_DATA_RETENTION_DAYS,
          date: dateLabel,
        })}
      </SettingRow>

      <SettingRow tight title={t(gone ? "keepTitlePast" : "keepTitle")}>
        {t(gone ? "keepBodyPast" : "keepBody")}
        {gone ? null : <ExportLink className="mt-2 block" />}
      </SettingRow>

      {/* The legal side, for whoever looks. */}
      <SettingRow tight title={t("controllerTitle")}>
        {t.rich("controller", {
          link: (chunks) => (
            <Link
              href="/legal/terms"
              className="underline underline-offset-[3px] hover:text-neutral-950"
            >
              {chunks}
            </Link>
          ),
        })}
      </SettingRow>
      <SettingRow tight title={t("toldTitle")}>
        {t("told")}
      </SettingRow>
    </div>
  );
}
