"use client";

import { useLocale, useTranslations } from "next-intl";
import { CancelEventForm } from "@/components/dashboard/event-editor/CancelEventForm";
import { ExportLink } from "@/components/dashboard/ExportLink";
import { DeleteRecordForm } from "@/components/dashboard/event-editor/DeleteRecordForm";
import { RollOut } from "@/components/dashboard/event-editor/RollOut";
import {
  ActionRow,
  SettingsCard,
} from "@/components/dashboard/event-editor/SettingsCard";
import {
  BTN_DANGER,
  BTN_GHOST_LIGHT,
} from "@/components/dashboard/event-editor/styles";
import type { ToastTone } from "@/components/dashboard/Toast";
import { ButtonIcon } from "@/components/icons";
import { useState, type ReactNode } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { deletionDate, formatEventDate, isPast } from "@/lib/event";
import type { DashboardEvent, IconName } from "@/types/dashboard";

interface DangerZoneProps {
  event: DashboardEvent;
  onAction: (message: string, tone: ToastTone) => void;
}

interface RowProps {
  title: string;
  children: ReactNode;
  below?: ReactNode;
  /** Beside its button: a link to a step to take first. */
  aside?: ReactNode;
  /** The row's button; a row without one only explains. `quiet`: the accent outline, for a step back. */
  action?: {
    icon?: IconName;
    label: string;
    onClick: () => void;
    quiet?: boolean;
  };
}

/**
 * A row's button that opens the form under it, or, once open, the quiet
 * step back that closes it.
 */
function toggle(
  open: boolean,
  setOpen: (open: boolean) => void,
  start: { icon: IconName; label: string },
  keepLabel: string,
): RowProps["action"] {
  return open
    ? { label: keepLabel, onClick: () => setOpen(false), quiet: true }
    : { ...start, onClick: () => setOpen(true) };
}

/** One choice as a row: what it does, and the button that does it. */
function Row({ title, children, below, aside, action }: RowProps) {
  return (
    <ActionRow
      title={title}
      below={below}
      action={
        action ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              className={action.quiet ? BTN_GHOST_LIGHT : BTN_DANGER}
              onClick={action.onClick}
            >
              {action.icon ? <ButtonIcon name={action.icon} /> : null}
              {action.label}
            </button>
            {aside}
          </div>
        ) : null
      }
    >
      {children}
    </ActionRow>
  );
}

export function DangerZone({ event, onAction }: DangerZoneProps) {
  const t = useTranslations("EventEditor");
  const locale = useLocale();
  const replied = event.rsvp.replied;
  const [cancelling, setCancelling] = useState(false);
  const [deletingDraft, setDeletingDraft] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(false);
  /* Until there is a store, cancelling here marks it cancelled for this visit. */
  const [cancelled, setCancelled] = useState(event.cancelled ?? false);
  /* A cancelled event can be deleted, like a past one; its own row says why. */
  const showCancelled = cancelled && event.paid;
  /* A past draft was never paid for, so it shows only the delete row. */
  const showPast = !cancelled && isPast(event) && event.paid;
  /* A live paid event explains why it has no delete, under its cancel row. */
  const showCancel = !cancelled && !isPast(event) && event.paid;
  const showDraft = !event.paid;
  /* The delete row's switch and its password form: a past event's and a cancelled one's. */
  const deleteRecord = {
    action: toggle(
      deletingRecord,
      setDeletingRecord,
      { icon: "trash", label: t("deleteNow") },
      t("pastKeep"),
    ),
    aside: <ExportLink />,
    below: (
      <DeleteRecordForm
        open={deletingRecord}
        onDelete={() => {
          setDeletingRecord(false);
          onAction(t("pastDeleted"), "neutral");
        }}
      />
    ),
  };
  const deletionLabel = formatEventDate(deletionDate(event.date), locale);

  return (
    <SettingsCard title={t("dangerSection")}>
      <div>
        {/* Why a live paid event has no delete, before the cancel it points to. */}
        {showCancel ? (
          <Row title={t("paidDeleteTitle")}>{t("paidDeleteBody")}</Row>
        ) : null}

        {showCancel ? (
          <Row
            title={t("cancelTitle")}
            action={toggle(
              cancelling,
              setCancelling,
              { icon: "ban", label: t("cancelButton") },
              t("cancelKeep"),
            )}
            below={
              <CancelEventForm
                open={cancelling}
                onCancel={() => {
                  setCancelling(false);
                  setCancelled(true);
                  onAction(t("cancelled"), "neutral");
                }}
              />
            }
          >
            {t("cancelBody", {
              count: replied,
              days: GUEST_DATA_RETENTION_DAYS,
            })}
          </Row>
        ) : null}

        {showDraft ? (
          <Row
            title={t("draftTitle")}
            action={toggle(
              deletingDraft,
              setDeletingDraft,
              { icon: "trash", label: t("deleteDraft") },
              t("draftKeep"),
            )}
            below={
              <RollOut open={deletingDraft}>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                  <p className="font-medium text-accent-700">
                    {t("draftConfirm")}
                  </p>
                  <button
                    type="button"
                    className={BTN_DANGER}
                    onClick={() => {
                      setDeletingDraft(false);
                      onAction(t("draftDeleted"), "neutral");
                    }}
                  >
                    <ButtonIcon name="trash" />
                    {t("deleteDraft")}
                  </button>
                </div>
              </RollOut>
            }
          >
            {t("draftBody")}
          </Row>
        ) : null}

        {showCancelled ? (
          <Row title={t("cancelledTitle")} {...deleteRecord}>
            {t("cancelledBody", { date: deletionLabel })}
          </Row>
        ) : null}

        {showPast ? (
          <Row title={t("pastTitle")} {...deleteRecord}>
            {t("pastBody", { date: deletionLabel })}
          </Row>
        ) : null}
      </div>
    </SettingsCard>
  );
}
