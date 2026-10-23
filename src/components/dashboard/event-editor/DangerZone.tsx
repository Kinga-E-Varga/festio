"use client";

import { useLocale, useTranslations } from "next-intl";
import { reopenEvent } from "@/actions/event";
import { CancelEventForm } from "@/components/dashboard/event-editor/CancelEventForm";
import { ExportLink } from "@/components/dashboard/ExportLink";
import { DeleteRecordForm } from "@/components/dashboard/event-editor/DeleteRecordForm";
import {
  ActionRow,
  SettingsCard,
} from "@/components/dashboard/event-editor/SettingsCard";
import { BTN_DANGER } from "@/components/dashboard/event-editor/styles";
import { BTN_GHOST_LIGHT } from "@/components/dashboard/styles";
import type { ToastTone } from "@/components/dashboard/Toast";
import { ButtonIcon } from "@/components/icons";
import { useState, type ReactNode } from "react";
import type { HostLogin } from "@/db/reads/host";
import { useRouter } from "@/i18n/navigation";
import { orFailed } from "@/lib/action";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { deletionDate, formatEventDate, isPast } from "@/lib/event";
import type { DashboardEvent, IconName } from "@/types/dashboard";

interface DangerZoneProps {
  event: DashboardEvent;
  /** How the host confirms it's them: password, or Google. */
  login: HostLogin;
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
    disabled?: boolean;
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
              disabled={action.disabled}
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

export function DangerZone({ event, login, onAction }: DangerZoneProps) {
  const t = useTranslations("EventEditor");
  const tError = useTranslations("SaveErrors");
  const locale = useLocale();
  const router = useRouter();
  const replied = event.rsvp.replied;
  const [cancelling, setCancelling] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(false);
  /* While Reopen waits for the server. */
  const [busy, setBusy] = useState(false);
  /* A cancelled event can be deleted, like a past one; its own row says why. */
  const cancelled = event.cancelled ?? false;
  /* Reopening only makes sense before the event day has passed. */
  const showReopen = cancelled && !isPast(event);
  const showPast = !cancelled && isPast(event);
  /* A live event explains why it has no delete, under its cancel row. */
  const showCancel = !cancelled && !isPast(event);

  /** Reopens the event, no password; its outcome as a toast. */
  async function reopen() {
    setBusy(true);
    const result = await orFailed(reopenEvent(event.id));
    setBusy(false);
    onAction(
      result.success ? t("reopened") : tError(result.error),
      result.success ? "neutral" : "error",
    );
  }

  const errorToast = (message: string) => onAction(message, "error");
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
        eventId={event.id}
        login={login}
        onError={errorToast}
        onDelete={() => {
          onAction(t("pastDeleted"), "neutral");
          router.push("/dashboard");
        }}
      />
    ),
  };
  const deletionLabel = formatEventDate(deletionDate(event.date), locale);

  return (
    <SettingsCard title={t("dangerSection")}>
      <div>
        {/* Why a live event has no delete, before the cancel it points to. */}
        {showCancel ? (
          <Row title={t("liveDeleteTitle")}>{t("liveDeleteBody")}</Row>
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
                eventId={event.id}
                login={login}
                onError={errorToast}
                onCancel={() => {
                  setCancelling(false);
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

        {cancelled ? (
          <Row title={t("cancelledTitle")} {...deleteRecord}>
            {t("cancelledBody", { date: deletionLabel })}
          </Row>
        ) : null}

        {showReopen ? (
          <Row
            title={t("reopenTitle")}
            action={{
              label: t("reopenButton"),
              quiet: true,
              disabled: busy,
              onClick: reopen,
            }}
          >
            {t("reopenBody")}
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
