"use client";

import { useTranslations } from "next-intl";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { BTN_DANGER } from "@/components/dashboard/event-editor/styles";
import { DANGER_DARK } from "@/components/dashboard/styles";
import type { ToastTone } from "@/components/dashboard/Toast";
import { ButtonIcon } from "@/components/icons";
import type { ReactNode } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { isPast } from "@/lib/event";
import type { DashboardEvent, IconName } from "@/types/dashboard";

interface DangerZoneProps {
  event: DashboardEvent;
  onAction: (message: string, tone: ToastTone) => void;
}

interface RowProps {
  title: string;
  children: ReactNode;
  /** The row's button; a row without one only explains. */
  action?: { icon: IconName; label: string; onClick: () => void };
}

/** One choice in its own box: what it does, and the button that does it. */
function Row({ title, children, action }: RowProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-ui border px-5 py-[18px] @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:gap-5 ${DANGER_DARK}`}
    >
      <div className="flex-1">
        <b className="mb-1 block font-semibold">{title}</b>
        <p className="text-[12.5px] leading-[1.5]">{children}</p>
      </div>
      {action ? (
        <button type="button" className={BTN_DANGER} onClick={action.onClick}>
          <ButtonIcon name={action.icon} />
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

export function DangerZone({ event, onAction }: DangerZoneProps) {
  const t = useTranslations("EventEditor");
  const replied = event.rsvp.replied;
  /* TEMPORARY preview: every row shows, whatever the event's state. Set to false to restore. */
  const PREVIEW_ALL = true;
  /* A past draft was never paid for, so it shows only the delete row. */
  const showPast = PREVIEW_ALL || (isPast(event) && event.paid);
  /* A live paid event explains why it has no delete, under its cancel row. */
  const showCancel = PREVIEW_ALL || (!isPast(event) && event.paid);
  const showDraft = PREVIEW_ALL || !event.paid;

  return (
    <EditorSection title={t("dangerSection")}>
      <div className="flex flex-col gap-3">
        {showPast ? (
          <Row
            title={t("pastTitle")}
            action={{
              icon: "trash",
              label: t("deleteNow"),
              onClick: () => onAction(t("pastDeleted"), "neutral"),
            }}
          >
            {t("pastBody")}
          </Row>
        ) : null}

        {showCancel ? (
          <>
            <Row
              title={t("cancelTitle")}
              action={{
                icon: "ban",
                label: t("cancelButton"),
                onClick: () => onAction(t("cancelled"), "neutral"),
              }}
            >
              {t("cancelBody", {
                count: replied,
                days: GUEST_DATA_RETENTION_DAYS,
              })}
            </Row>
            <Row title={t("paidDeleteTitle")}>{t("paidDeleteBody")}</Row>
          </>
        ) : null}

        {showDraft ? (
          <Row
            title={t("draftTitle")}
            action={{
              icon: "trash",
              label: t("deleteDraft"),
              onClick: () => onAction(t("draftDeleted"), "neutral"),
            }}
          >
            {t("draftBody")}
          </Row>
        ) : null}
      </div>
    </EditorSection>
  );
}
