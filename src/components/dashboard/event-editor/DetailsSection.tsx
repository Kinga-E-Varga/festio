"use client";

import { useTranslations } from "next-intl";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Field } from "@/components/dashboard/event-editor/Field";
import {
  ERROR,
  FIELD_GRID,
  INPUT,
  LABEL,
  SUBBOX,
} from "@/components/dashboard/event-editor/styles";
import { Toggle } from "@/components/dashboard/event-editor/Toggle";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { LANGUAGES, LANGUAGE_NAMES, type Language } from "@/lib/language";
import { EVENT_KINDS } from "@/mock/dashboard";
import type { DashboardEvent, EventKind } from "@/types/dashboard";

/** Dates the platform works out; they are never typed in. */
function Derived({
  items,
}: {
  items: { term: string; value: string; note: string }[];
}) {
  return (
    <dl className="mt-[22px] grid grid-cols-1 gap-px border border-forest-500 border-l-[3px] bg-forest-500 @min-[820px]:grid-cols-3">
      {items.map((item) => (
        <div key={item.term} className="bg-forest-100 px-4 py-[13px]">
          <dt className="text-[12.5px] leading-[1.3] font-bold text-forest-500">
            {item.term}
          </dt>
          <dd className="mt-[5px] text-base leading-[1.3] text-forest-600">
            {item.value}
            <small className="mt-1 block text-[11.5px] leading-[1.45]">
              {item.note}
            </small>
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function DetailsSection({ event, form }: SectionProps) {
  const t = useTranslations("EventEditor");
  const tOccasions = useTranslations("Occasions");
  const { values, set, derived, locked } = form;

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
            disabled={locked}
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
          <select
            id="event-kind"
            disabled={locked}
            value={values.kind}
            onChange={(control) => set.kind(control.target.value as EventKind)}
            className={INPUT}
          >
            {EVENT_KINDS.map((id) => (
              <option key={id} value={id}>
                {tOccasions(id)}
              </option>
            ))}
          </select>
        </Field>

        <Field
          htmlFor="event-language"
          label={t("language")}
          hint={t("languageHint")}
        >
          <select
            id="event-language"
            disabled={locked}
            value={values.language}
            onChange={(control) =>
              set.language(control.target.value as Language)
            }
            className={INPUT}
          >
            {LANGUAGES.map((code) => (
              <option key={code} value={code}>
                {LANGUAGE_NAMES[code]}
              </option>
            ))}
          </select>
        </Field>

        <Field
          htmlFor="event-date"
          label={t("date")}
          hint={t("dateHint")}
        >
          <input
            id="event-date"
            type="date"
            disabled={locked}
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
          b: (chunks) => <b>{chunks}</b>,
        })}
      </ChangeWarning>

      <p className={`mt-[22px] mb-2.5 ${LABEL}`}>{t("closeHeading")}</p>

      <Toggle
        label={t("closeEarly")}
        checked={values.closeEarly}
        disabled={locked}
        onChange={set.closeEarly}
        description={t.rich("closeEarlyNote", {
          date: derived.closeDefaultLabel,
          b: (chunks) => <b>{chunks}</b>,
        })}
      />

      {values.closeEarly ? (
        <div className={SUBBOX}>
          <Field htmlFor="event-close" label={t("closeAt")}>
            <input
              id="event-close"
              type="datetime-local"
              max={derived.closeLimit}
              disabled={locked}
              value={values.closeAt}
              onChange={(control) => set.closeAt(control.target.value)}
              className={`${INPUT} max-w-[280px]`}
            />
          </Field>
          {derived.closeTooLate ? (
            <p className={`mt-[7px] ${ERROR}`}>
              {t("closeTooLate")}
            </p>
          ) : null}
        </div>
      ) : null}

      <Derived
        items={[
          {
            term: t("repliesClose"),
            value: derived.closeLabel,
            note: t(derived.closesEarly ? "closesEarlyNote" : "closesDefaultNote"),
          },
          {
            term: t("editingFreezes"),
            value: derived.freezeLabel,
            note: t("freezeNote"),
          },
          {
            term: t("dataDeleted"),
            value: derived.deletionLabel,
            note: `${event.dataDeleted ? `${t("alreadyDeleted")} ` : ""}${t("deletionNote", { days: GUEST_DATA_RETENTION_DAYS })}`,
          },
        ]}
      />
    </EditorSection>
  );
}
