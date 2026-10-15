"use client";

import { Select } from "@/components/dashboard/event-editor/Select";
import { useTranslations } from "next-intl";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Field } from "@/components/dashboard/event-editor/Field";
import {
  ERROR,
  FIELD_GRID,
  INPUT,
  LABEL,
} from "@/components/dashboard/event-editor/styles";
import { SummarySwitch } from "@/components/dashboard/event-editor/SummarySwitch";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { LANGUAGES, LANGUAGE_NAMES, type Language } from "@/lib/language";
import { EVENT_KINDS } from "@/mock/dashboard";
import type { DashboardEvent, EventKind } from "@/types/dashboard";

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function DetailsSection({ event, form }: SectionProps) {
  const t = useTranslations("EventEditor");
  const tOccasions = useTranslations("Occasions");
  const { values, set, derived } = form;

  return (
    <EditorSection title={t("details")} first>
      <div className={FIELD_GRID}>
        <Field
          htmlFor="event-name"
          label={t("eventName")}
          hint={t("eventNameHint")}
        >
          <input
            id="event-name"
            type="text"
            maxLength={80}
            value={values.title}
            onChange={(control) => set.title(control.target.value)}
            className={INPUT}
          />
        </Field>

        <Field
          htmlFor="event-kind"
          label={t("occasion")}
          hint={t("occasionHint")}
        >
          <Select
            id="event-kind"
            value={values.kind}
            onChange={(control) => set.kind(control.target.value as EventKind)}
          >
            {EVENT_KINDS.map((id) => (
              <option key={id} value={id}>
                {tOccasions(id)}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          htmlFor="event-language"
          label={t("language")}
          hint={t("languageHint")}
        >
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
        </Field>

        <Field
          htmlFor="event-date"
          label={t("date")}
          hint={t(form.dateLocked ? "dateLockedHint" : "dateHint")}
        >
          <input
            id="event-date"
            type="date"
            disabled={form.dateLocked}
            value={values.date}
            onChange={(control) => set.date(control.target.value)}
            className={INPUT}
          />
        </Field>
      </div>

      <ChangeWarning
        title={t("languageWarningTitle")}
        warning={form.warnings.language}
      >
        {t("languageWarning")}
      </ChangeWarning>

      <ChangeWarning title={t("dateWarningTitle")} warning={form.warnings.date}>
        {t.rich("dateWarning", {
          count: event.rsvp.replied,
          b: (chunks) => <b className="font-semibold">{chunks}</b>,
        })}
      </ChangeWarning>

      <p className={`mt-[22px] mb-1.5 ${LABEL}`}>{t("closeHeading")}</p>

      <SummarySwitch
        icon="calendar"
        action={t(values.closeEarly ? "useDefault" : "closeEarlier")}
        onAction={() => set.closeEarly(!values.closeEarly)}
        hint={t("closeDefaultHint")}
        text={
          values.closeEarly
            ? t("replyUntil")
            : t("replyUntilDate", {
                /* Non-breaking spaces: the date moves to a new line whole. */
                date: derived.closeDefaultLabel.replaceAll(" ", "\u00a0"),
              })
        }
      >
        {values.closeEarly ? (
          <input
            id="event-close"
            type="datetime-local"
            aria-label={t("closeAt")}
            max={derived.closeLimit}
            value={values.closeAt}
            onChange={(control) => set.closeAt(control.target.value)}
            /* In the sentence's own type, so the date reads as part of it. */
            className={`${INPUT} text-[14px]! font-medium! text-neutral-800! @min-[460px]:max-w-max`}
          />
        ) : null}
      </SummarySwitch>
      {derived.closeTooLate ? (
        <p className={`mt-1.5 ${ERROR}`}>{t("closeTooLate")}</p>
      ) : null}
    </EditorSection>
  );
}
