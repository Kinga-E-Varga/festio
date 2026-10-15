"use client";

import { useTranslations } from "next-intl";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import {
  ERROR,
  HINT,
  INPUT,
  LABEL,
} from "@/components/dashboard/event-editor/styles";
import { SummarySwitch } from "@/components/dashboard/event-editor/SummarySwitch";
import { RepliesMeter } from "@/components/dashboard/RepliesMeter";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import type { DashboardEvent } from "@/types/dashboard";

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function GuestsSection({ event, form }: SectionProps) {
  const t = useTranslations("EventEditor");
  const { values, set, derived } = form;

  return (
    <EditorSection id="guests" title={t("guests")}>
      <label htmlFor="event-expected" className={`mb-2.5 block ${LABEL}`}>
        {t("expected")}
      </label>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3.5">
        <input
          id="event-expected"
          type="number"
          required
          min={1}
          max={1000}
          step={1}
          value={values.expected}
          onChange={(control) => set.expected(control.target.value)}
          className={`${INPUT} basis-[180px]`}
        />

        {/* The count sits over the bar; the bar lines up with the input's bottom edge beside it. */}
        <div className="flex-1 basis-[320px]">
          <RepliesMeter
            replied={event.rsvp.replied}
            expected={derived.expectedValue}
          />
        </div>

        {/* Pulled up from the row gap to a field's own 6px, as under every other input. */}
        {derived.expectedError ? (
          <p className={`-mt-2 basis-full ${ERROR}`}>{derived.expectedError}</p>
        ) : null}
        <p className={`-mt-2 basis-full ${HINT}`}>{t("expectedHint")}</p>
      </div>

      <div className="mt-[22px]">
        <p className={`mb-1.5 ${LABEL}`}>{t("expecting")}</p>

        <SummarySwitch
          icon="guests"
          action={t(values.preloaded ? "stopList" : "useList")}
          onAction={() => set.preloaded(!values.preloaded)}
          hint={t("noListHint")}
          text={
            values.preloaded ? (
              <>
                {t("matchedList")}{" "}
                {/* The count reads on from the sentence, in the quieter hint style. */}
                <span className="text-[12.5px] font-normal text-neutral-700">
                  {t("listNow", { count: event.preloadedCount })}
                </span>
              </>
            ) : (
              t("matchedNoList")
            )
          }
        />
      </div>
    </EditorSection>
  );
}
