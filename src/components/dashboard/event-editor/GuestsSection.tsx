"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import { Choice } from "@/components/dashboard/event-editor/Choice";
import {
  EditRow,
  ReadRow,
  ReadRows,
  SettingsCard,
  type CardEditing,
} from "@/components/dashboard/event-editor/SettingsCard";
import { RepliesMeter } from "@/components/dashboard/RepliesMeter";
import { TEXT_LINK, INPUT } from "@/components/dashboard/styles";
import { Switch } from "@/components/invitation/PanelSwitch";
import { Link } from "@/i18n/navigation";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { eventPath, formatDeadline, isRealDate } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
  editing: CardEditing;
  /** How many names are on the pre-loaded list. */
  listCount: number;
}

/**
 * Replies: how many guests the host expects, until when they can reply, and
 * whether replies are matched against an invite list.
 */
export function GuestsSection({
  event,
  form,
  editing,
  listCount,
}: SectionProps) {
  const t = useTranslations("EventEditor");
  const locale = useLocale();
  const { values, set, derived } = form;
  const closeAt = new Date(values.closeAt);
  const closesEarly = values.closeEarly && isRealDate(closeAt);

  return (
    <SettingsCard id="guests" title={t("replies")} editing={editing}>
      {editing.open ? (
        <div>
          <EditRow
            htmlFor="event-expected"
            label={t("readExpectedLabel")}
            error={derived.expectedError}
            hint={t("expectedHint")}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
              <input
                id="event-expected"
                type="number"
                required
                min={1}
                max={1000}
                step={1}
                value={values.expected}
                onChange={(control) => set.expected(control.target.value)}
                className={`${INPUT} basis-[140px]`}
              />
              {/* The count over the bar, the two centred on the input beside them. */}
              <div className="flex-1 basis-[200px]">
                <RepliesMeter
                  replied={event.rsvp.replied}
                  expected={derived.expectedValue}
                />
              </div>
            </div>
          </EditRow>

          <EditRow
            label={t("readClosesLabel")}
            error={
              derived.closeTooLate
                ? t("closeTooLate")
                : derived.closeInPast
                  ? t("closeInPast")
                  : null
            }
            warning={
              <ChangeWarning
                title={t("closeWarningTitle")}
                warning={form.warnings.close}
              >
                {t("closeWarning")}
              </ChangeWarning>
            }
          >
            <div
              role="radiogroup"
              aria-label={t("readClosesLabel")}
              className="flex flex-col"
            >
              <Choice
                name="close"
                checked={!values.closeEarly}
                onPick={() => set.closeEarly(false)}
              >
                {t("closeDefaultChoice")}
                <span className="font-normal muted-text">
                  {" "}
                  · {derived.closeDefaultLabel}
                </span>
              </Choice>
              <Choice
                name="close"
                checked={values.closeEarly}
                onPick={() => set.closeEarly(true)}
              >
                {t("closeEarlyChoice")}
              </Choice>
              {/* Under its choice, lined up with the choice's words. */}
              {values.closeEarly ? (
                <input
                  id="event-close"
                  type="datetime-local"
                  aria-label={t("closeAt")}
                  max={derived.closeLimit}
                  value={values.closeAt}
                  onChange={(control) => set.closeAt(control.target.value)}
                  className={`${INPUT} ml-6 max-w-[256px]`}
                />
              ) : null}
            </div>
          </EditRow>

          <EditRow label={t("readListLabel")} hint={t("noListHint")}>
            <div className="flex min-h-input items-center gap-3">
              <Switch
                id="event-list"
                label={t("listSwitch")}
                checked={values.preloaded}
                onChange={set.preloaded}
                tone="choice"
              />
              {/* The list's size and where it is edited read on from the label. */}
              <p className="min-w-0">
                <span className="font-medium text-neutral-800">
                  {t("listSwitch")}
                </span>
                {values.preloaded ? (
                  <span className="meta-text">
                    {" · "}
                    {t("listCount", { count: listCount })} ·{" "}
                    <Link
                      href={eventPath(event.id, "guests")}
                      className={TEXT_LINK}
                    >
                      {t("listEdit")}
                    </Link>
                  </span>
                ) : null}
              </p>
            </div>
          </EditRow>
        </div>
      ) : (
        <ReadRows>
          <ReadRow
            label={t("readExpectedLabel")}
            note={t("readReplied", { count: event.rsvp.replied })}
          >
            {t("readExpected", { count: derived.expectedValue })}
          </ReadRow>
          <ReadRow
            label={t("readClosesLabel")}
            note={t(closesEarly ? "readClosesEarly" : "readClosesDefault")}
          >
            {closesEarly
              ? formatDeadline(closeAt, locale)
              : derived.closeDefaultLabel}
          </ReadRow>
          <ReadRow
            label={t("readListLabel")}
            note={
              values.preloaded ? t("listNow", { count: listCount }) : undefined
            }
          >
            {t(values.preloaded ? "matchedList" : "matchedNoList")}
          </ReadRow>
        </ReadRows>
      )}
    </SettingsCard>
  );
}
