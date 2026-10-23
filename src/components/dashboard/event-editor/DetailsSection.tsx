"use client";

import { Select } from "@/components/dashboard/event-editor/Select";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import {
  EditRow,
  ReadRow,
  ReadRows,
  SettingsCard,
  type CardEditing,
} from "@/components/dashboard/event-editor/SettingsCard";
import { INPUT } from "@/components/dashboard/styles";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { EVENT_KINDS, TITLE_MAX, TITLE_MIN } from "@/db/limits";
import { formatDay } from "@/lib/event";
import { LANGUAGES, LANGUAGE_NAMES, type Language } from "@/lib/language";
import type { DashboardEvent, EventKind } from "@/types/dashboard";

/** A field with a short value, kept from stretching across the card. */
const SHORT = "w-full @min-[420px]:max-w-[280px]";

/**
 * The event's name, which every event needs. Its error waits until the host
 * leaves the field, so it never scolds while they are still typing; Save
 * stays shut either way. Drawn only while the card is open, so each opening
 * starts untouched.
 */
function NameRow({ form }: { form: EventForm }) {
  const t = useTranslations("EventEditor");
  const [left, setLeft] = useState(false);
  const error = left ? form.derived.titleError : null;

  return (
    <EditRow
      htmlFor="event-name"
      label={t("eventName")}
      error={error}
      hint={t("eventNameHint")}
    >
      <input
        id="event-name"
        type="text"
        required
        minLength={TITLE_MIN}
        maxLength={TITLE_MAX}
        aria-invalid={error ? true : undefined}
        value={form.values.title}
        onChange={(control) => form.set.title(control.target.value)}
        onBlur={() => setLeft(true)}
        className={INPUT}
      />
    </EditRow>
  );
}

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
  editing: CardEditing;
}

/**
 * General: what the event is and when. Read as rows; open, the same rows
 * with their fields, a change warning under each change guests would notice.
 */
export function DetailsSection({ event, form, editing }: SectionProps) {
  const t = useTranslations("EventEditor");
  const tOccasions = useTranslations("Occasions");
  const locale = useLocale();
  const { values, set } = form;

  return (
    <SettingsCard title={t("general")} editing={editing}>
      {editing.open ? (
        <div>
          <NameRow form={form} />

          <EditRow
            htmlFor="event-kind"
            label={t("occasion")}
            hint={t("occasionHint")}
          >
            <div className={SHORT}>
              <Select
                id="event-kind"
                value={values.kind}
                onChange={(control) =>
                  set.kind(control.target.value as EventKind)
                }
              >
                {EVENT_KINDS.map((id) => (
                  <option key={id} value={id}>
                    {tOccasions(id)}
                  </option>
                ))}
              </Select>
            </div>
          </EditRow>

          <EditRow
            htmlFor="event-language"
            label={t("language")}
            hint={t("languageHint")}
            warning={
              <ChangeWarning
                title={t("languageWarningTitle")}
                warning={form.warnings.language}
              >
                {t("languageWarning")}
              </ChangeWarning>
            }
          >
            <div className={SHORT}>
              <Select
                id="event-language"
                value={values.language}
                onChange={(control) =>
                  set.language(control.target.value as Language)
                }
              >
                {LANGUAGES.map((code) => (
                  <option key={code} value={code}>
                    {LANGUAGE_NAMES[code]}
                  </option>
                ))}
              </Select>
            </div>
          </EditRow>

          <EditRow
            htmlFor="event-date"
            label={t("date")}
            hint={t(form.dateLocked ? "dateLockedHint" : "dateHint")}
            warning={
              <ChangeWarning
                title={t("dateWarningTitle")}
                warning={form.warnings.date}
              >
                {t.rich("dateWarning", {
                  count: event.rsvp.replied,
                  b: (chunks) => <b className="font-semibold">{chunks}</b>,
                })}
              </ChangeWarning>
            }
          >
            <input
              id="event-date"
              type="date"
              disabled={form.dateLocked}
              value={values.date}
              onChange={(control) => set.date(control.target.value)}
              className={`${INPUT} ${SHORT}`}
            />
          </EditRow>
        </div>
      ) : (
        <ReadRows>
          <ReadRow label={t("eventName")}>{values.title}</ReadRow>
          <ReadRow label={t("occasion")}>{tOccasions(values.kind)}</ReadRow>
          <ReadRow label={t("language")}>
            {LANGUAGE_NAMES[values.language]}
          </ReadRow>
          <ReadRow
            label={t("date")}
            note={form.dateLocked ? t("dateLockedHint") : undefined}
          >
            {formatDay(values.date, locale)}
          </ReadRow>
        </ReadRows>
      )}
    </SettingsCard>
  );
}
