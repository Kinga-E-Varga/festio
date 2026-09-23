"use client";

import { useTranslations } from "next-intl";
import { BTN_DANGER } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent } from "@/types/dashboard";

interface DangerZoneProps {
  event: DashboardEvent;
  onAction: (message: string) => void;
}

export function DangerZone({ event, onAction }: DangerZoneProps) {
  const t = useTranslations("EventEditor");
  const replied = event.rsvp.replied;
  /* An unpaid draft was never reachable, so there is nothing to cancel. */
  const explained = event.status === "past" || event.paid;

  return (
    <section className="mt-[58px] border border-rust-300 bg-rust-100">
      <h2 className="bg-rust-500 px-5 py-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-50 uppercase">
        {t("danger")}
      </h2>

      {event.status === "past" ? (
        <div className="flex items-center gap-5 px-5 py-[18px]">
          <div className="flex-1 text-rust-500">
            <b className="mb-1 block">{t("pastTitle")}</b>
            <p className="text-[13.5px] leading-[1.5]">{t("pastBody")}</p>
          </div>
        </div>
      ) : event.paid ? (
        <div className="flex flex-col gap-3 px-5 py-[18px] @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:gap-5">
          <div className="flex-1 text-rust-500">
            <b className="mb-1 block">{t("cancelTitle")}</b>
            <p className="text-[13.5px] leading-[1.5]">
              {t("cancelBody", {
                count: replied,
                days: GUEST_DATA_RETENTION_DAYS,
              })}
            </p>
          </div>
          <button
            type="button"
            className={BTN_DANGER}
            onClick={() => onAction(t("cancelled"))}
          >
            <Icon name="ban" className="size-[15px]" />
            {t("cancelButton")}
          </button>
        </div>
      ) : null}

      {event.paid ? null : (
        <div
          className={`flex flex-col gap-3 px-5 py-[18px] @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:gap-5 ${
            explained ? "border-t border-rust-300" : ""
          }`}
        >
          <div className="flex-1 text-rust-500">
            <b className="mb-1 block">{t("draftTitle")}</b>
            <p className="text-[13.5px] leading-[1.5]">{t("draftBody")}</p>
          </div>
          <button
            type="button"
            className={BTN_DANGER}
            onClick={() => onAction(t("draftDeleted"))}
          >
            <Icon name="trash" className="size-[15px]" />
            {t("deleteDraft")}
          </button>
        </div>
      )}
    </section>
  );
}
