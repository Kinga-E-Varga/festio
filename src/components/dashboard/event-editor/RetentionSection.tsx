import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent } from "@/types/dashboard";

interface RetentionSectionProps {
  event: DashboardEvent;
  /** Follows the date field, so moving the event moves the deletion date. */
  deletionLabel: string;
  dateLabel: string;
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-[18px] py-[15px]">
      <h4 className="mb-1 text-sm font-bold">{title}</h4>
      <p className="text-[13.5px] leading-[1.55]">{children}</p>
    </div>
  );
}

export function RetentionSection({
  event,
  deletionLabel,
  dateLabel,
}: RetentionSectionProps) {
  const t = useTranslations("EventEditor");
  const gone = event.dataDeleted;

  return (
    <EditorSection title={t("retention")}>
      {/* Four labelled rows, with the deletion date lifted out as the thing to remember. */}
      <div className="border border-terracotta-400 bg-terracotta-200 text-terracotta-600">
        <Row
          title={t(gone ? "deletedOnPast" : "deletedOn", {
            date: deletionLabel,
          })}
        >
          {t(gone ? "deletedBodyPast" : "deletedBody", {
            days: GUEST_DATA_RETENTION_DAYS,
            date: dateLabel,
          })}
        </Row>

        <Row title={t(gone ? "keepTitlePast" : "keepTitle")}>
          {t(gone ? "keepBodyPast" : "keepBody")}
        </Row>

        <Row title={t("controllerTitle")}>
          {t.rich("controller", {
            link: (chunks) => (
              <Link
                href="/legal/terms"
                className="underline underline-offset-[3px] hover:text-neutral-900"
              >
                {chunks}
              </Link>
            ),
          })}
        </Row>

        <Row title={t("toldTitle")}>{t("told")}</Row>
      </div>
    </EditorSection>
  );
}
